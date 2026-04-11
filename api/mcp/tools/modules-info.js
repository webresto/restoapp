'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Protected tool — lists installed modules with their versions.
 * Scans the modules/ directory and reads package.json from each.
 */
module.exports = function register(mcp) {
  mcp.registerTool({
    name: 'modules-info',
    description: 'Returns a list of installed RestoApp modules with name, version, appId, and description. Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {},
    },
    handler: async () => {
      const modulesDir = path.join(process.cwd(), 'modules');

      if (!fs.existsSync(modulesDir)) {
        return { modules: [] };
      }

      const entries = fs.readdirSync(modulesDir).filter(f => {
        if (f.startsWith('.')) return false;
        return fs.statSync(path.join(modulesDir, f)).isDirectory();
      });

      const modules = entries.map(dir => {
        const pkgPath = path.join(modulesDir, dir, 'package.json');
        if (!fs.existsSync(pkgPath)) return null;

        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
          return {
            dir,
            name:        pkg.name        ?? dir,
            appId:       pkg.appId       ?? null,
            appName:     pkg.appName     ?? null,
            version:     pkg.version     ?? null,
            description: pkg.description ?? null,
          };
        } catch {
          return { dir, error: 'Failed to parse package.json' };
        }
      }).filter(Boolean);

      return { count: modules.length, modules };
    },
  });
};
