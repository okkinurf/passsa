const test = require('node:test');
const assert = require('node:assert/strict');
const { escapeCell, splitCells } = require('../src/markdown-table');

test('table cells keep escaped pipes, backslashes, and line breaks inside one cell', () => {
  const original = 'path\\part | first line\nsecond line';
  const encoded = escapeCell(original);

  assert.equal(splitCells(`| ${encoded} | next |`)[0], 'path\\part | first line second line');
  assert.equal(splitCells(`| left\\|middle | right |`).length, 2);
});

test('table cell splitter distinguishes escaped pipes from column boundaries', () => {
  assert.deepEqual(splitCells('| a\\|b | c |'), ['a|b', 'c']);
  assert.deepEqual(splitCells('| a\\\\ | b |'), ['a\\', 'b']);
  assert.deepEqual(splitCells('| a | b |'), ['a', 'b']);
});
