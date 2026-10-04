(function attachMarkdownTable(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PassSaMarkdownTable = api;
})(typeof globalThis === 'undefined' ? null : globalThis, function createMarkdownTableHelpers() {
  function escapeCell(value) {
    return String(value ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/\|/g, '\\|')
      .replace(/[\r\n]+/g, ' ')
      .trim();
  }

  function splitCells(row) {
    let source = String(row ?? '').trim();
    if (source.startsWith('|')) source = source.slice(1);

    const cells = [];
    let cell = '';
    let hasTrailingSeparator = false;
    for (let index = 0; index < source.length; index += 1) {
      const character = source[index];
      if (character === '\\' && index + 1 < source.length) {
        const next = source[index + 1];
        if (next === '\\' || next === '|') {
          cell += next;
          index += 1;
          hasTrailingSeparator = false;
          continue;
        }
        cell += character;
        hasTrailingSeparator = false;
        continue;
      }
      if (character === '|') {
        cells.push(cell.trim());
        cell = '';
        hasTrailingSeparator = index === source.length - 1;
        continue;
      }
      cell += character;
      hasTrailingSeparator = false;
    }
    if (!hasTrailingSeparator) cells.push(cell.trim());
    return cells;
  }

  return { escapeCell, splitCells };
});
