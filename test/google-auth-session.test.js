const test = require('node:test');
const assert = require('node:assert/strict');
const { GoogleAuthSession } = require('../src/services/google-auth-session');

test('challenge Google hanya dapat dipakai satu kali', () => {
  const sessions = new GoogleAuthSession();
  const challenge = sessions.create({ email: 'okki@example.test' }, { access_token: 'secret' });
  assert.equal(sessions.consume(challenge.challengeId).profile.email, 'okki@example.test');
  assert.throws(() => sessions.consume(challenge.challengeId), /tidak valid/);
});

test('challenge Google yang kedaluwarsa ditolak', () => {
  let now = 1000;
  const sessions = new GoogleAuthSession({ ttlMs: 100, now: () => now });
  const challenge = sessions.create({ email: 'okki@example.test' }, {});
  now = 1200;
  assert.throws(() => sessions.consume(challenge.challengeId), /kedaluwarsa/);
});
