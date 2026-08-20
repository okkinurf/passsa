const { app, net } = require('electron');

// Keep the network-only QA runner usable on Windows hosts without a working GPU process.
app.commandLine.appendSwitch('in-process-gpu');
app.commandLine.appendSwitch('disable-gpu');
app.disableHardwareAcceleration();

const endpoints = [
  'https://oauth2.googleapis.com/token',
  'https://openidconnect.googleapis.com/v1/userinfo',
  'https://www.googleapis.com/drive/v3/files',
];

app.whenReady().then(async () => {
  for (const endpoint of endpoints) {
    const response = await net.fetch(endpoint);
    if (response.status < 100 || response.status >= 600) throw new Error(`Respons tidak valid dari ${endpoint}.`);
    console.log(`${new URL(endpoint).hostname}: HTTP ${response.status} (TLS tersambung)`);
  }
  console.log('Google network QA lulus menggunakan Chromium/Windows network stack.');
  app.quit();
}).catch((error) => {
  console.error(`Google network QA gagal: ${error.message}`);
  app.exit(1);
});
