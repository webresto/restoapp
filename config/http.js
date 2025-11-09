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


// TODO: add 500 and 404 for admin panel
module.exports.http = {
    middleware: {
        order: [
            'startRequestTimer',
            'bodyParser',
            'handleBodyParserError',
            'compress',
            'methodOverride',
            'favicon',
            'cookieParser',
            'session',
            'poweredBy',
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
        poweredBy: function (req, res, next) {
            res.set('X-Powered-By', "WebResto");
            return next();
        },
        frontendRoutes: function (req, res, next) {
            switch (req.url) {
                case '/':
                    if (req.method === 'GET') {
                        return res.view('index');
                    }
                    break;
                default:
                    if (req.method === 'GET' && !req.isSocket) {
                        return res.view('index');
                    }
            }
            return next();
        },
    }
};
