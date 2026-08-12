const crypto = require('node:crypto');

function contentHash(snapshot) {
  return crypto.createHash('sha256').update(JSON.stringify({ vaultSalt: snapshot.vaultSalt, envelope: snapshot.envelope })).digest('hex');
}

class DriveSyncService {
  constructor({ driveClient, vaultService, stateStore, now = () => new Date() }) {
    this.driveClient = driveClient;
    this.vaultService = vaultService;
    this.stateStore = stateStore;
    this.now = now;
  }

  async updateState(email, value) {
    await this.stateStore.update((state) => {
      state.users ||= {};
      state.users[email] = { ...value, syncedAt: this.now().toISOString() };
      return state;
    });
  }

  async sync({ password } = {}) {
    const local = await this.vaultService.exportEncryptedSnapshot();
    const email = local.email;
    const driveAccount = this.vaultService.syncAccount?.() || email;
    const localHash = contentHash(local);
    const state = await this.stateStore.read();
    const previous = state.users?.[email] || null;
    const files = await this.driveClient.listVaultFiles(driveAccount);

    if (!files.length) {
      const payload = { ...local, revision: 1, updatedAt: this.now().toISOString() };
      const created = await this.driveClient.createJson(driveAccount, 'passsa-vault.json', payload);
      await this.updateState(email, { fileId: created.id, localHash, remoteHash: localHash, revision: 1 });
      return { ok: true, status: 'uploaded', message: 'Vault terenkripsi diunggah ke Google Drive.' };
    }

    const file = files[0];
    const remote = await this.driveClient.downloadJson(driveAccount, file.id);
    if (remote.schemaVersion !== 1 || remote.email !== email || !remote.envelope || !remote.vaultSalt) {
      throw new Error('Format vault Google Drive tidak valid atau bukan milik akun ini.');
    }
    const remoteHash = contentHash(remote);
    if (remoteHash === localHash) {
      await this.updateState(email, { fileId: file.id, localHash, remoteHash, revision: remote.revision || 1 });
      return { ok: true, status: 'current', message: 'Vault sudah sinkron.' };
    }

    const localEmpty = await this.vaultService.isEmpty();
    const localChanged = previous ? previous.localHash !== localHash : !localEmpty;
    const remoteChanged = previous ? previous.remoteHash !== remoteHash : true;

    if (previous && !localChanged && !remoteChanged) {
      return { ok: true, status: 'current', message: 'Vault sudah sinkron.' };
    }

    if ((!previous && localEmpty) || (previous && !localChanged && remoteChanged)) {
      if (!password) return { ok: false, status: 'requires-password', message: 'Vault Drive berubah. Login ulang dengan Google untuk mengunduhnya dengan aman.' };
      await this.vaultService.importEncryptedSnapshot(remote, password);
      const imported = await this.vaultService.exportEncryptedSnapshot();
      await this.updateState(email, { fileId: file.id, localHash: contentHash(imported), remoteHash, revision: remote.revision || 1 });
      return { ok: true, status: 'downloaded', message: 'Vault terenkripsi terbaru diunduh dari Google Drive.' };
    }

    if (previous && localChanged && !remoteChanged) {
      const revision = Number(remote.revision || previous.revision || 1) + 1;
      const payload = { ...local, revision, updatedAt: this.now().toISOString() };
      await this.driveClient.updateJson(driveAccount, file.id, payload);
      await this.updateState(email, { fileId: file.id, localHash, remoteHash: localHash, revision });
      return { ok: true, status: 'uploaded', message: 'Perubahan lokal diunggah ke Google Drive.' };
    }

    const suffix = this.now().toISOString().replaceAll(':', '-').replaceAll('.', '-');
    await this.driveClient.createJson(driveAccount, `passsa-vault-conflict-${suffix}.json`, {
      ...local, conflictWith: file.id, updatedAt: this.now().toISOString(), revision: Number(remote.revision || 1),
    });
    return {
      ok: false,
      status: 'conflict',
      message: 'Konflik terdeteksi. Salinan lokal disimpan sebagai backup konflik; vault Drive utama tidak ditimpa.',
    };
  }
}

module.exports = { DriveSyncService, contentHash };
