import Module from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve as resolvePath } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const originalResolveFilename = Module._resolveFilename;

/**
 * Patching the resolver to substitute our stub
 */
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === 'sails-adminpanel/lib/installStepper/InstallStepAbstract') {
    return resolvePath(__dirname, './lib/installStepper/InstallStepAbstract.ts');
  }
  if (request === 'sails-adminpanel/helper/accessRightsHelper') {
    return originalResolveFilename.call(this, 'adminizer/helpers/accessRightsHelper', parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};