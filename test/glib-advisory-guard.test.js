const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rustSourceRoot = path.join(__dirname, '..', 'src-tauri', 'src');
const vulnerableType = ['Variant', 'Str', 'Iter'].join('');
const vulnerableMethod = ['array', '_iter', '_str'].join('');

function rustSources(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return rustSources(entryPath);
    return entry.isFile() && entry.name.endsWith('.rs') ? [entryPath] : [];
  });
}

test('PassSa does not call the vulnerable glib VariantStrIter API', () => {
  const forbidden = new RegExp(`${vulnerableType}|\\.${vulnerableMethod}\\s*\\(`);
  const references = rustSources(rustSourceRoot).flatMap((file) => {
    const source = fs.readFileSync(file, 'utf8');
    return source.split(/\r?\n/).flatMap((line, index) => (
      forbidden.test(line) ? [`${path.relative(process.cwd(), file)}:${index + 1}`] : []
    ));
  });

  assert.deepEqual(references, [], 'Do not use glib VariantStrIter until Tauri ships a patched GTK stack.');
});
