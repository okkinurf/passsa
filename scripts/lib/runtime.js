const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

function projectPath(...parts) {
  return path.join(PROJECT_ROOT, ...parts);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function commandResult(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
    windowsHide: true,
    ...options,
  });
  return {
    ok: result.status === 0,
    status: result.status,
    error: result.error,
    output: `${result.stdout || ''}${result.stderr || ''}`.trim(),
  };
}

function commandExists(command, args = ['--version']) {
  return commandResult(command, args);
}

module.exports = { PROJECT_ROOT, commandExists, commandResult, projectPath, readJson };
