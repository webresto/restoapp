import serveStatic = require('serve-static');
import * as path from 'path';
import * as fs from 'fs';

// Try to import i18nMiddleware if present
let i18nMiddleware: any;
try {
    i18nMiddleware = require('../i18nMiddleware').default;
} catch (e) {
    // i18nMiddleware not present, skip
}

export default async function(sails: any) {
    const frontendFolderPath = path.join(process.cwd(), '.tmp', 'frontend');

    if (!fs.existsSync(frontendFolderPath)) {
        fs.mkdirSync(frontendFolderPath, { recursive: true });
    }

    const app = sails.hooks.http.app;

    // Register the i18nMiddleware before serving static files if present
    if (i18nMiddleware) {
        app.use('/assets/i18n/:locale', i18nMiddleware);
    }

    // Serve static files from frontend folder
    app.use('/', serveStatic(frontendFolderPath));

    // Serve module assets
    const assetsPath = path.join(__dirname, '../assets');
    app.use('/admin/modules/assets', serveStatic(assetsPath));

    // Adjust router stack ordering - move the last added layer to position 1
    let layer = sails.hooks.http.app._router.stack.slice(-1)[0];
    sails.hooks.http.app._router.stack.splice(1, 0, layer);
};
