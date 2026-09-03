#!/usr/bin/env node

const { execFileSync } = require('node:child_process');
const { readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const projectRoot = resolve(__dirname, '..', '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npmArgs = ['update', 'adminizer', '--package-lock-only', '--ignore-scripts', '--legacy-peer-deps'];

const command = process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : npmCommand;
const commandArgs = process.platform === 'win32'
  ? ['/d', '/s', '/c', `${npmCommand} ${npmArgs.join(' ')}`]
  : npmArgs;

execFileSync(command, commandArgs, { cwd: projectRoot, stdio: 'inherit' });

const packageLockPath = resolve(projectRoot, 'package-lock.json');
const packageLock = JSON.parse(readFileSync(packageLockPath, 'utf8'));
const adminizer = packageLock.packages?.['node_modules/adminizer'];

if (!adminizer?.version || !adminizer.resolved || !adminizer.integrity) {
  throw new Error('Adminizer was not resolved in package-lock.json');
}

const yarnLockPath = resolve(projectRoot, 'yarn.lock');
const yarnLock = readFileSync(yarnLockPath, 'utf8');
const lineEnding = yarnLock.includes(String.fromCharCode(13, 10))
  ? String.fromCharCode(13, 10)
  : String.fromCharCode(10);
const lines = yarnLock.split(lineEnding);
const entryIndex = lines.indexOf('adminizer@alpha:');

if (entryIndex === -1) {
  throw new Error('The adminizer@alpha entry was not found in yarn.lock');
}

lines[entryIndex + 1] = `  version "${adminizer.version}"`;
lines[entryIndex + 2] = `  resolved "${adminizer.resolved}"`;
lines[entryIndex + 3] = `  integrity ${adminizer.integrity}`;
writeFileSync(yarnLockPath, lines.join(lineEnding));
console.log(`Adminizer updated to ${adminizer.version} in both lock files.`);
