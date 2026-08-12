const classic = Boolean(process.env.WIN_CSC_LINK && process.env.WIN_CSC_KEY_PASSWORD);
if (!classic) {
  console.error('Credential code signing belum tersedia. Isi WIN_CSC_LINK dan WIN_CSC_KEY_PASSWORD. Untuk Azure Trusted Signing, tambahkan win.azureSignOptions sesuai akun publisher terlebih dahulu.');
  process.exit(1);
}

console.log('Konfigurasi certificate Authenticode tersedia.');
