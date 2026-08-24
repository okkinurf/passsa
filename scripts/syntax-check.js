const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { PROJECT_ROOT } = require('./lib/runtime');

const root = PROJECT_ROOT;
const ignored = new Set(['node_modules', '.git', 'dist', 'release', 'backups']);

function collect(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.agents') continue;
    if (entry.isDirectory()) {
      if (!ignored.has(entry.name)) files.push(...collect(path.join(directory, entry.name)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.js')) files.push(path.join(directory, entry.name));
  }
  return files;
}

const files = collect(root).sort();
const failures = [];
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) failures.push({ file: path.relative(root, file), output: `${result.stdout || ''}${result.stderr || ''}`.trim() });
}

if (failures.length) {
  console.error(`JS syntax gagal pada ${failures.length} file:`);
  for (const failure of failures) console.error(`\n${failure.file}\n${failure.output}`);
  process.exitCode = 1;
} else {
  console.log(`JS syntax lulus: ${files.length} file.`);
}
