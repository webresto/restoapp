const { expect } = require('chai');
const fs = require('fs');
const os = require('os');
const path = require('path');
const tar = require('tar');

const installer = require('../api/hooks/app-manager-proto/helpers/moduleInstaller');

describe('app-manager cross-platform installer', function () {
  let testRoot;

  beforeEach(function () {
    testRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'restoapp-module-installer-'));
  });

  afterEach(function () {
    fs.rmSync(testRoot, { recursive: true, force: true });
  });

  it('installs an archive without bash or /app paths', async function () {
    const sourceRoot = path.join(testRoot, 'source');
    const modulesRoot = path.join(testRoot, 'modules');
    fs.mkdirSync(sourceRoot);
    fs.writeFileSync(path.join(sourceRoot, 'package.json'), JSON.stringify({
      name: 'demo-module',
      appId: 'demo-module',
      version: '1.0.0',
      description: 'test module'
    }));
    fs.writeFileSync(path.join(sourceRoot, 'index.js'), 'module.exports = {};\n');

    const archivePath = path.join(testRoot, 'demo-module.tar');
    await tar.c({ cwd: sourceRoot, file: archivePath }, ['package.json', 'index.js']);
    const archive = fs.readFileSync(archivePath);
    let dependenciesInstalledIn = '';

    const result = await installer.installMarketplaceModule({
      appId: 'demo-module',
      modulesPath: modulesRoot,
      registryUrl: 'https://registry.test',
      httpClient: { get: async () => ({ data: archive }) },
      installDependencies: async (modulePath) => { dependenciesInstalledIn = modulePath; }
    });

    expect(result.modulePath).to.equal(path.join(modulesRoot, 'demo-module'));
    expect(fs.existsSync(path.join(result.modulePath, 'package.json'))).to.equal(true);
    expect(dependenciesInstalledIn).to.contain('.install-demo-module-');
  });

  it('adds, removes and re-adds modules in the list file', function () {
    const listFile = path.join(testRoot, 'config', 'webresto-modules.list');
    expect(installer.addModuleToList(listFile, 'demo-module')).to.equal(true);
    expect(installer.addModuleToList(listFile, 'demo-module')).to.equal(false);
    expect(fs.readFileSync(listFile, 'utf8')).to.equal('demo-module\n');

    expect(installer.removeModuleFromList(listFile, 'demo-module')).to.equal(true);
    expect(fs.readFileSync(listFile, 'utf8')).to.equal('');

    expect(installer.addModuleToList(listFile, 'demo-module')).to.equal(true);
    expect(fs.readFileSync(listFile, 'utf8')).to.equal('demo-module\n');
  });

  it('rejects paths outside the modules directory on Windows and Linux', function () {
    const modulesRoot = path.join(testRoot, 'modules');
    expect(installer.isPathInside(modulesRoot, path.join(modulesRoot, 'demo'))).to.equal(true);
    expect(installer.isPathInside(modulesRoot, path.join(testRoot, 'outside'))).to.equal(false);
    expect(() => installer.assertSafeArchiveEntry({ path: '../escape.txt' })).to.throw('Unsafe path');
  });

  it('does not render a numeric zero when catalog metadata is empty', function () {
    const catalogUi = fs.readFileSync(
      path.resolve(__dirname, '../api/hooks/app-manager-proto/assets/modules-versions.js'),
      'utf8'
    );
    expect(catalogUi).to.contain('Boolean(item.group || item.tags?.length)');
  });
});
