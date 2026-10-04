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
const helloHelper = path.join(dist, 'win-unpacked', 'resources', 'app.asar.unpacked', 'scripts', 'windows-hello-helper.exe');
if (!fs.existsSync(unpackedExe) || !fs.existsSync(asar) || fs.statSync(asar).size < 100_000 || !fs.existsSync(helloHelper)) {
  console.error('Isi aplikasi hasil packaging tidak lengkap.');
  process.exit(1);
}
const allowUnsigned = process.env.PASSA_ALLOW_UNSIGNED_QA === 'true';
const expectedSubject = process.env.PASSA_EXPECTED_SIGNER_SUBJECT?.trim();
const expectedThumbprint = process.env.PASSA_EXPECTED_SIGNER_THUMBPRINT?.replaceAll(' ', '').toUpperCase();
const allowUntrustedSigner = process.env.PASSA_ALLOW_UNTRUSTED_SIGNER === 'true' && Boolean(expectedSubject && expectedThumbprint);
const signingTargets = [installer, unpackedExe, helloHelper];
const signatures = [];
for (const target of signingTargets) {
  const command = `$ErrorActionPreference='Stop'; $signature = Get-AuthenticodeSignature -LiteralPath '${target.replaceAll("'", "''")}'; [PSCustomObject]@{ Status=$signature.Status.ToString(); Subject=$signature.SignerCertificate.Subject; Thumbprint=$signature.SignerCertificate.Thumbprint } | ConvertTo-Json -Compress`;
  const result = spawnSync('pwsh.exe', ['-NoProfile', '-Command', command], { encoding: 'utf8' });
  if (result.status !== 0 || !result.stdout.trim()) {
    console.error(result.stderr || `Authenticode tidak dapat diverifikasi: ${path.basename(target)}.`);
    process.exit(1);
  }
  const signature = JSON.parse(result.stdout.trim());
  signatures.push({ target: path.basename(target), ...signature });
  const trustedOrPinnedSelfSigned = signature.Status === 'Valid'
    || (allowUntrustedSigner && signature.Status === 'NotTrusted');
  if (!trustedOrPinnedSelfSigned && !allowUnsigned) {
    console.error(`${path.basename(target)} belum ditandatangani secara valid (status: ${signature.Status}).`);
    process.exit(1);
  }
  if (expectedSubject && signature.Subject !== expectedSubject) {
    console.error(`Publisher ${path.basename(target)} tidak cocok dengan publisher yang diharapkan.`);
    process.exit(1);
  }
  if (expectedThumbprint && signature.Thumbprint?.replaceAll(' ', '').toUpperCase() !== expectedThumbprint) {
    console.error(`Thumbprint publisher ${path.basename(target)} tidak cocok dengan sertifikat yang diizinkan.`);
    process.exit(1);
  }
}
const sha256 = crypto.createHash('sha256').update(fs.readFileSync(installer)).digest('hex');
const signatureSummary = signatures.map(({ target, Status, Subject, Thumbprint }) => `${target}=${Status}${Subject ? ` (${Subject}${Thumbprint ? `, ${Thumbprint}` : ''})` : ''}`).join('; ');
console.log(`Installer QA lulus: ${path.basename(installer)}, ${(stat.size / 1024 / 1024).toFixed(1)} MB, ${signatureSummary}, sha256=${sha256}.`);
