const crypto = require('node:crypto');
const { S3ObjectClient } = require('./s3-object-client');

function contentHash(snapshot) {
  return crypto.createHash('sha256')
    .update(JSON.stringify({ vaultSalt: snapshot.vaultSalt, envelope: snapshot.envelope }))
    .digest('hex');
}

function normalizeConfig(input = {}) {
  const region = String(input.region || '').trim();
  const bucket = String(input.bucket || '').trim();
  const accessKeyId = String(input.accessKeyId || '').trim();
  const secretAccessKey = String(input.secretAccessKey || '').trim();
  const sessionToken = String(input.sessionToken || '').trim();
  let endpoint = String(input.endpoint || '').trim();
  const prefix = String(input.prefix || 'PassSa').trim().replace(/^\/+|\/+$/g, '').replace(/\/{2,}/g, '/');

  if (!region) throw new Error('Masukkan region S3.');
  if (!bucket || /\s/.test(bucket)) throw new Error('Masukkan nama bucket S3 yang valid.');
  if (!accessKeyId) throw new Error('Masukkan Access Key ID.');
  if (!secretAccessKey) throw new Error('Masukkan Secret Access Key.');
  if (!prefix || prefix.split('/').some((part) => part === '.' || part === '..')) {
    throw new Error('Prefix harus berupa jalur folder yang valid.');
  }

  if (endpoint) {
    let parsed;
    try { parsed = new URL(endpoint); } catch { throw new Error('Endpoint S3 harus berupa URL yang valid.'); }
    const localHttpHost = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
    if (!['https:', ...(localHttpHost ? ['http:'] : [])].includes(parsed.protocol)) {
      throw new Error('Endpoint S3 harus menggunakan HTTPS (HTTP hanya di localhost).');
    }
    if (parsed.username || parsed.password || parsed.search || parsed.hash) {
      throw new Error('Endpoint tidak boleh memuat user, password, query, atau fragment.');
    }
    endpoint = parsed.toString().replace(/\/$/, '');
  }

  return { region, bucket, accessKeyId, secretAccessKey, sessionToken, endpoint, prefix };
}

function isMissingObject(error) {
  return error?.name === 'NoSuchKey'
    || error?.name === 'NotFound'
    || error?.$metadata?.httpStatusCode === 404;
}

function safeS3Error(error) {
  const status = Number(error?.$metadata?.httpStatusCode || 0);
  if (status === 403 || error?.name === 'AccessDenied') {
    return new Error('S3 menolak akses. Periksa kredensial serta izin ListBucket, GetObject, dan PutObject pada bucket/prefix.');
  }
  if (status === 301 || error?.name === 'PermanentRedirect') {
    return new Error('Region bucket S3 tidak cocok. Periksa nilai region.');
  }
  if (error?.name === 'NetworkingError' || error?.name === 'TimeoutError') {
    return new Error('Endpoint S3 tidak dapat dijangkau. Periksa koneksi dan alamat endpoint.');
  }
  const name = String(error?.name || 'S3Error').replace(/[^\w-]/g, '').slice(0, 40);
  return new Error(`S3 gagal (${status || name}). Periksa endpoint, region, bucket, dan izin akses.`);
}

class S3SyncService {
  constructor({ vaultService, credentialStore, stateStore, clientFactory = (config) => new S3ObjectClient(config), now = () => new Date() }) {
    this.vaultService = vaultService;
    this.credentialStore = credentialStore;
    this.stateStore = stateStore;
    this.clientFactory = clientFactory;
    this.now = now;
  }

  async updateState(email, value) {
    await this.stateStore.update((state) => {
      state.users ||= {};
      state.users[email] = { ...value, syncedAt: this.now().toISOString() };
      return state;
    });
  }

  async connect(input) {
    const config = normalizeConfig(input);
    const snapshot = await this.vaultService.exportEncryptedSnapshot();
    const client = this.clientFactory(config);
    try {
      await client.verifyBucket(config.bucket);
    } catch (error) {
      throw safeS3Error(error);
    } finally {
      client.close?.();
    }
    await this.credentialStore.save(snapshot.email, config);
    return {
      ok: true,
      connected: true,
      message: `Koneksi ke bucket ${config.bucket} berhasil. Vault belum diunggah; tekan Sinkronkan sekarang untuk memulai.`,
      config: this.publicConfig(config),
    };
  }

  publicConfig(config) {
    return {
      endpoint: config.endpoint,
      region: config.region,
      bucket: config.bucket,
      prefix: config.prefix,
      accessKeyHint: config.accessKeyId.slice(-4),
    };
  }

  async info() {
    const snapshot = await this.vaultService.exportEncryptedSnapshot();
    const config = await this.credentialStore.load(snapshot.email);
    return {
      ok: true,
      connected: Boolean(config),
      ...(config ? { config: this.publicConfig(config) } : {}),
    };
  }

  async disconnect() {
    const snapshot = await this.vaultService.exportEncryptedSnapshot();
    await this.credentialStore.clear(snapshot.email);
    return { ok: true, connected: false, message: 'Koneksi S3 lokal diputus. Objek di bucket tidak dihapus.' };
  }

  objectKey(prefix, email) {
    const accountHash = crypto.createHash('sha256').update(String(email).toLowerCase()).digest('hex').slice(0, 24);
    return `${prefix}/vaults/${accountHash}/passsa-vault.json`;
  }

  async sync({ password } = {}) {
    const local = await this.vaultService.exportEncryptedSnapshot();
    const email = String(local.email || '').trim().toLowerCase();
    if (!email) throw new Error('Identitas vault lokal tidak tersedia.');
    const config = await this.credentialStore.load(email);
    if (!config) return { ok: false, status: 'not-connected', message: 'Hubungkan bucket S3 melalui Pengaturan terlebih dahulu.' };

    const key = this.objectKey(config.prefix, email);
    const localHash = contentHash(local);
    const state = await this.stateStore.read();
    const savedState = state.users?.[email] || null;
    const previous = savedState?.bucket === config.bucket && savedState?.key === key ? savedState : null;
    const client = this.clientFactory(config);
    try {
      let remote = null;
      try {
        const object = await client.getJson(config.bucket, key);
        remote = object.value;
      } catch (error) {
        if (!isMissingObject(error)) throw error;
      }

      if (!remote) {
        const payload = { ...local, revision: 1, updatedAt: this.now().toISOString() };
        await client.putJson(config.bucket, key, payload);
        await this.updateState(email, { bucket: config.bucket, key, localHash, remoteHash: localHash, revision: 1 });
        return { ok: true, status: 'uploaded', message: 'Snapshot vault terenkripsi pertama diunggah ke S3.' };
      }

      if (remote.schemaVersion !== 1 || String(remote.email || '').toLowerCase() !== email || !remote.envelope || !remote.vaultSalt) {
        throw new Error('Format snapshot S3 tidak valid atau bukan milik akun lokal ini.');
      }

      const remoteHash = contentHash(remote);
      if (remoteHash === localHash) {
        await this.updateState(email, { bucket: config.bucket, key, localHash, remoteHash, revision: remote.revision || 1 });
        return { ok: true, status: 'current', message: 'Vault lokal sudah sinkron dengan S3.' };
      }

      const localEmpty = await this.vaultService.isEmpty();
      const localChanged = previous ? previous.localHash !== localHash : !localEmpty;
      const remoteChanged = previous ? previous.remoteHash !== remoteHash : true;

      if ((!previous && localEmpty) || (previous && !localChanged && remoteChanged)) {
        try {
          await this.vaultService.importEncryptedSnapshot(remote, password);
        } catch (error) {
          if (!password) {
            return { ok: false, status: 'requires-password', message: 'Masukkan password vault lokal untuk membuka snapshot dari perangkat lain.' };
          }
          throw new Error('Password vault tidak dapat membuka snapshot S3. Periksa password, lalu coba lagi.');
        }
        const imported = await this.vaultService.exportEncryptedSnapshot();
        await this.updateState(email, { bucket: config.bucket, key, localHash: contentHash(imported), remoteHash, revision: remote.revision || 1 });
        return { ok: true, status: 'downloaded', message: 'Snapshot vault terenkripsi terbaru diunduh dari S3.' };
      }

      if (previous && localChanged && !remoteChanged) {
        const revision = Number(remote.revision || previous.revision || 1) + 1;
        await client.putJson(config.bucket, key, { ...local, revision, updatedAt: this.now().toISOString() });
        await this.updateState(email, { bucket: config.bucket, key, localHash, remoteHash: localHash, revision });
        return { ok: true, status: 'uploaded', message: 'Perubahan lokal diunggah ke S3.' };
      }

      const suffix = `${this.now().toISOString().replaceAll(':', '-').replaceAll('.', '-')}-${crypto.randomBytes(4).toString('hex')}`;
      const conflictKey = key.replace(/passsa-vault\.json$/, `conflicts/passsa-vault-conflict-${suffix}.json`);
      await client.putJson(config.bucket, conflictKey, { ...local, conflictWith: key, updatedAt: this.now().toISOString(), revision: Number(remote.revision || 1) });
      return { ok: false, status: 'conflict', message: 'Konflik terdeteksi. Salinan lokal diunggah sebagai backup; snapshot S3 utama tidak ditimpa.' };
    } catch (error) {
      if (error.message?.startsWith('S3 menolak') || error.message?.startsWith('Region bucket') || error.message?.startsWith('Endpoint S3')) throw error;
      if (error.message?.startsWith('Format snapshot')
        || error.message?.startsWith('Snapshot S3')
        || error.message?.startsWith('Password vault tidak dapat')
        || error.message?.startsWith('Konflik')) throw error;
      throw safeS3Error(error);
    } finally {
      client.close?.();
    }
  }
}

module.exports = { S3SyncService, contentHash, normalizeConfig, isMissingObject, safeS3Error };
