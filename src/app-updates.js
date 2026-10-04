/* Small SemVer helper shared by the About view and Node tests. */
((root, factory) => {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PassSaUpdates = api;
})(typeof globalThis === 'object' ? globalThis : this, () => {
  const VERSION_PATTERN = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

  function parseVersion(value) {
    const match = VERSION_PATTERN.exec(String(value || '').trim());
    if (!match) return null;
    const prerelease = match[4] ? match[4].split('.') : [];
    if (prerelease.some((identifier) => /^\d+$/.test(identifier) && identifier.length > 1 && identifier.startsWith('0'))) return null;
    return {
      major: BigInt(match[1]),
      minor: BigInt(match[2]),
      patch: BigInt(match[3]),
      prerelease,
    };
  }

  function compareVersions(left, right) {
    const a = parseVersion(left);
    const b = parseVersion(right);
    if (!a || !b) return null;
    for (const key of ['major', 'minor', 'patch']) {
      if (a[key] > b[key]) return 1;
      if (a[key] < b[key]) return -1;
    }
    if (!a.prerelease.length || !b.prerelease.length) {
      if (a.prerelease.length === b.prerelease.length) return 0;
      return a.prerelease.length ? -1 : 1;
    }
    const count = Math.max(a.prerelease.length, b.prerelease.length);
    for (let index = 0; index < count; index += 1) {
      const aId = a.prerelease[index];
      const bId = b.prerelease[index];
      if (aId === undefined) return -1;
      if (bId === undefined) return 1;
      if (aId === bId) continue;
      const aNumeric = /^\d+$/.test(aId);
      const bNumeric = /^\d+$/.test(bId);
      if (aNumeric && bNumeric) {
        const aNumber = BigInt(aId);
        const bNumber = BigInt(bId);
        return aNumber > bNumber ? 1 : -1;
      }
      if (aNumeric !== bNumeric) return aNumeric ? -1 : 1;
      return aId > bId ? 1 : -1;
    }
    return 0;
  }

  return { parseVersion, compareVersions };
});
