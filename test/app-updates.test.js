const test = require('node:test');
const assert = require('node:assert/strict');
const { compareVersions, parseVersion } = require('../src/app-updates.js');

test('pembanding versi menangani nomor versi utama dan awalan v', () => {
  assert.equal(compareVersions('v1.10.0', '1.9.9'), 1);
  assert.equal(compareVersions('0.2.0', 'v0.2.0'), 0);
  assert.equal(compareVersions('0.1.8', '0.2.0'), -1);
});

test('versi stabil lebih baru daripada prerelease dan prerelease dibandingkan semantik', () => {
  assert.equal(compareVersions('2.0.0', '2.0.0-rc.1'), 1);
  assert.equal(compareVersions('2.0.0-beta.2', '2.0.0-beta.11'), -1);
  assert.equal(compareVersions('2.0.0-alpha', '2.0.0-alpha.1'), -1);
  assert.equal(compareVersions('2.0.0-1', '2.0.0-alpha'), -1);
});

test('metadata build tidak memengaruhi perbandingan dan versi invalid ditolak', () => {
  assert.equal(compareVersions('1.2.3+build.8', '1.2.3+build.2'), 0);
  assert.equal(compareVersions('01.2.3', '1.2.3'), null);
  assert.equal(compareVersions('1.2.3-01', '1.2.3-1'), null);
  assert.equal(parseVersion('1.2'), null);
});
