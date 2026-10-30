/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */
if (process.env.OPENHARNESS_MCP_TOOLS !== 'false') {
    process.env.MCP_INTERNAL_ENABLED = process.env.MCP_INTERNAL_ENABLED || 'true';
}

var path = require('path');
var Readable = require('stream').Readable;

// Неизвестный адрес в этих пространствах — 404 бэкенда, а не страница витрины
var BACKEND_PREFIXES = ['/admin', '/api', '/graphql', '/assets'];

function isStorefrontPage(req) {
    var urlPath = req.path;
    var isBackendPath = BACKEND_PREFIXES.some(function (prefix) {
        return urlPath === prefix || urlPath.indexOf(prefix + '/') === 0;
    });
    if (isBackendPath) return false;
    // Ненайденный файл (манифест, логотип) — 404. Переход браузера явно просит text/html,
    // поэтому страница со слагом с точкой (статьи base-pages) всё равно получает витрину.
    return path.extname(urlPath) === '' || /text\/html/.test(req.headers.accept || '');
}

// How the storefront renders its pages, asked once, on the first page, from the module that delivers the storefront
// (admin-frontend) by the event storefront:get-renderer. The answer is one object { mode, handle } the module keeps
// current itself (at its start, after a build): mode 'ssr' - handle(request, { apiBase }) renders the page on the
// server, anything else - views/index.ejs of the static build. One answer only: two are a conflict of modules.
var storefrontRenderer;

async function getStorefrontRenderer() {
    if (storefrontRenderer !== undefined) return storefrontRenderer;
    var answers = (await emitter.emit('storefront:get-renderer')).filter(function (answer) {
        return answer.state === 'success' && answer.result;
    });
    if (answers.length > 1) {
        sails.log.error('storefront:get-renderer: ' + answers.length + ' modules answered (' + answers.map(function (answer) { return answer.id; }).join(', ') + '), the storefront stays static');
    }
    storefrontRenderer = answers.length === 1 ? answers[0].result : null;
    return storefrontRenderer;
}

// A page rendered on the server: the request as a fetch Request, the answer back into Express. The API is Sails
// itself on 127.0.0.1 - past the nginx of the image, the base of the recipe ("/") is for the browser only.
async function renderOnServer(renderer, req, res) {
    var headers = new Headers();
    Object.keys(req.headers).forEach(function (name) {
        var value = req.headers[name];
        (Array.isArray(value) ? value : [value]).forEach(function (one) {
            if (one !== undefined) headers.append(name, one);
        });
    });
    var request = new Request(req.protocol + '://' + req.get('host') + req.originalUrl, { method: req.method, headers: headers });
    var response = await renderer.handle(request, { apiBase: 'http://127.0.0.1:' + sails.config.port });
    res.status(response.status);
    response.headers.forEach(function (value, name) {
        if (name !== 'set-cookie') res.setHeader(name, value);
    });
    // append: the session of Sails may have set its own cookie already
    var cookies = response.headers.getSetCookie();
    if (cookies.length > 0) res.append('Set-Cookie', cookies);
    if (!response.body) return res.end();
    Readable.fromWeb(response.body).pipe(res);
}

function renderPage(req, res, next) {
    getStorefrontRenderer().then(function (renderer) {
        if (renderer && renderer.mode === 'ssr') return renderOnServer(renderer, req, res);
        return res.view('index');
    }).catch(next);
}

// TODO: add 500 and 404 for admin panel
module.exports.http = {
    middleware: {
        order: [
            'metrics',
            'bodyParser',
            'compress',
            'cookieParser',
            'session',
            'poweredBy',
            'mcpServer',
            'router',
            'www',
            'frontendRoutes'
        ],
        bodyParser: (function _configureBodyParser() {
            var skipper = require('skipper');
            var middlewareFn = skipper({
                strict: true,
                maxTimeToBuffer: 180000
                // ... more Skipper options here ...
            });
            return middlewareFn;
        })(),
        // Prometheus exporter: serves /metrics and times every request that
        // follows it. Wired here rather than through the api/hooks loader
        // because the release image sets paths.hooks = "modules", so api/hooks
        // is never scanned — see api/hooks/metrics/setup.js.
        // Inert until METRICS_TOKEN is set. Monitoring must never be able to
        // keep the app from booting, so a broken exporter degrades to a
        // pass-through instead of throwing out of the config load.
        metrics: (function _configureMetrics() {
            try {
                return require('../api/hooks/metrics/setup').middleware();
            } catch (error) {
                console.error('Metrics exporter failed to load, continuing without it:', error && error.message);
                return function metricsDisabled(req, res, next) { return next(); };
            }
        })(),
        // MCP Server middleware — always loaded so global.mcp is available everywhere.
        // HTTP routes are only active when MCP_ENABLED=true.
        // Tools are registered by api/bootstrap/mcp-server.js at startup.
        mcpServer: require('../api/mcp/McpServer').middleware(),
        poweredBy: function (req, res, next) {
            res.set('X-Powered-By', "WebResto");
            return next();
        },
        frontendRoutes: function (req, res, next) {
            // HEAD обслуживается наравне с GET: HTTP/1.1 требует тот же статус и
            // заголовки, что у GET, но без тела, а внешние health-check и
            // мониторинги по умолчанию ходят именно HEAD-запросом. Тело срезает
            // сам Express в res.send, поэтому рендер вьюхи здесь безопасен.
            var isPageRequest = req.method === 'GET' || req.method === 'HEAD';
            switch (req.url) {
                case '/':
                    if (isPageRequest) {
                        return renderPage(req, res, next);
                    }
                    break;
                default:
                    if (isPageRequest && !req.isSocket && isStorefrontPage(req)) {
                        return renderPage(req, res, next);
                    }
            }
            return next();
        },
    }
};
