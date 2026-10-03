function resolveLoginMethod({ twoFactorEnabled = false } = {}) {
  if (twoFactorEnabled) return 'two-factor';
  return 'password';
}

module.exports = { resolveLoginMethod };
