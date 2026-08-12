const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const dist = path.resolve(__dirname, '..', 'dist');
const installers = fs.existsSync(dist)
  ? fs.readdirSync(dist).filter((name) => /^PassSa-Setup-.*\.exe$/i.test(name)).map((name) => path.join(dist, name))
  : [];
if (!installers.length) {
  console.error('Installer PassSa tidak ditemukan di folder dist.');
  process.exit(1);
}
const installer = installers.sort((left, right) => fs.statSync(right).mtimeMs - fs.statSync(left).mtimeMs)[0];
const stat = fs.statSync(installer);
if (stat.size < 10 * 1024 * 1024) {
  console.error('Ukuran installer tidak wajar.');
  process.exit(1);
}
const unpackedExe = path.join(dist, 'win-unpacked', 'PassSa.exe');
const asar = path.join(dist, 'win-unpacked', 'resources', 'app.asar');
if (!fs.existsSync(unpackedExe) || !fs.existsSync(asar) || fs.statSync(asar).size < 100_000) {
  console.error('Isi aplikasi hasil packaging tidak lengkap.');
  process.exit(1);
}
const command = `$ErrorActionPreference='Stop'; $signature = Get-AuthenticodeSignature -LiteralPath '${installer.replaceAll("'", "''")}'; [PSCustomObject]@{ Status=$signature.Status.ToString(); Subject=$signature.SignerCertificate.Subject } | ConvertTo-Json -Compress`;
const result = spawnSync('pwsh.exe', ['-NoProfile', '-Command', command], { encoding: 'utf8' });
if (result.status !== 0 || !result.stdout.trim()) {
  console.error(result.stderr || 'Authenticode tidak dapat diverifikasi.');
  process.exit(1);
}
const signature = JSON.parse(result.stdout.trim());
const allowUnsigned = process.env.PASSA_ALLOW_UNSIGNED_QA === 'true';
if (signature.Status !== 'Valid' && !allowUnsigned) {
  console.error(`Installer belum ditandatangani secara valid (status: ${signature.Status}).`);
  process.exit(1);
}
const sha256 = crypto.createHash('sha256').update(fs.readFileSync(installer)).digest('hex');
console.log(`Installer QA lulus: ${path.basename(installer)}, ${(stat.size / 1024 / 1024).toFixed(1)} MB, signature=${signature.Status}${signature.Subject ? `, ${signature.Subject}` : ''}, sha256=${sha256}.`);
