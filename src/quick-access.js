const THEME_STORAGE_KEY = 'passsa-theme';
const PALETTE_STORAGE_KEY = 'passsa-palette';
const PALETTE_NAMES = new Set(['rose', 'ocean', 'forest', 'violet', 'sunset', 'amber', 'teal', 'indigo', 'coral', 'slate']);
const systemThemeQuery = typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null;

function normalizeThemePreference(value) {
  return ['system', 'light', 'dark'].includes(value) ? value : 'system';
}

function applyQuickTheme(input) {
  const theme = typeof input === 'object' && input ? input.theme : input;
  let palette = typeof input === 'object' && input ? input.palette : '';
  if (!PALETTE_NAMES.has(palette)) {
    try { palette = localStorage.getItem(PALETTE_STORAGE_KEY); } catch { palette = ''; }
  }
  const resolved = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.palette = PALETTE_NAMES.has(palette) ? palette : 'rose';
  document.documentElement.style.colorScheme = resolved;
}

function applyStoredTheme() {
  let preference = 'system';
  let palette = 'rose';
  try { preference = normalizeThemePreference(localStorage.getItem(THEME_STORAGE_KEY)); } catch { /* gunakan tema sistem */ }
  try { palette = localStorage.getItem(PALETTE_STORAGE_KEY) || 'rose'; } catch { /* gunakan palet default */ }
  applyQuickTheme({
    theme: preference === 'system' ? (systemThemeQuery?.matches ? 'dark' : 'light') : preference,
    palette,
  });
}

applyStoredTheme();

const searchInput = document.querySelector('#quick-search-input');
const status = document.querySelector('#quick-status');
const pinnedSection = document.querySelector('#quick-pinned-section');
const pinnedCount = document.querySelector('#quick-pinned-count');
const pinnedList = document.querySelector('#quick-pinned-list');
const recentSection = document.querySelector('#quick-recent-section');
const recentCount = document.querySelector('#quick-recent-count');
const recentList = document.querySelector('#quick-recent-list');
const clearRecentButton = document.querySelector('#quick-clear-recent');
const emptyState = document.querySelector('#quick-empty');
const emptyTitle = document.querySelector('#quick-empty-title');
const emptySubtitle = document.querySelector('#quick-empty-subtitle');
const recentTitle = document.querySelector('#quick-recent-title');
const closeButton = document.querySelector('#quick-close');
const noteModal = document.querySelector('#quick-note-modal');
const noteTitle = document.querySelector('#quick-note-title');
const noteMeta = document.querySelector('#quick-note-meta');
const noteBody = document.querySelector('#quick-note-body');
const noteTags = document.querySelector('#quick-note-tags');
const noteCloseButton = document.querySelector('#quick-note-close');

let entries = [];
let refreshTimer;
let noteModalPreviousFocus = null;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatRecent(value) {
  const timestamp = Date.parse(value || '');
  if (!timestamp) return 'Belum digunakan';
  const delta = Math.max(0, Date.now() - timestamp);
  if (delta < 60_000) return 'Baru saja digunakan';
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)} menit lalu`;
  if (delta < 86_400_000) return `${Math.floor(delta / 3_600_000)} jam lalu`;
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(timestamp);
}

function lastAction(entry) {
  const record = entry.recentUseHistory?.at(-1);
  if (!record) return formatRecent(entry.lastUsedAt);
  const label = record.field === 'password' ? 'Password' : record.field === 'username' ? 'Username' : record.field === 'note' ? 'Catatan dibuka' : record.field === 'totp' ? 'Kode 2FA' : 'Link';
  return `${label}${record.field === 'note' ? '' : ' disalin'} · ${formatRecent(record.usedAt)}`;
}

function matches(entry, query) {
  if (!query) return true;
  return [entry.title, entry.username, entry.url, entry.group, entry.totp?.issuer, entry.totp?.account, ...(entry.tags || [])]
    .some((value) => String(value || '').toLowerCase().includes(query));
}

function formatTotpCode(value) {
  const code = String(value || '').replace(/\s/g, '');
  if (!code) return '••• •••';
  const midpoint = Math.ceil(code.length / 2);
  return `${code.slice(0, midpoint)} ${code.slice(midpoint)}`;
}

function totpRemainingLabel(value) {
  const remaining = Number(value);
  return Number.isFinite(remaining) && remaining > 0 ? `${Math.max(0, Math.floor(remaining))}s` : '—';
}

function entryMarkup(entry) {
  const title = escapeHtml(entry.title);
  const isAuthenticator = entry.type === 'authenticator';
  const meta = escapeHtml(isAuthenticator
    ? [entry.totp?.issuer || 'Authenticator', entry.totp?.account || 'Tanpa akun'].join(' · ')
    : [entry.username || 'Tanpa username', entry.url || entry.group || 'Login lokal'].filter(Boolean).join(' · '));
  const safeId = escapeHtml(entry.id);
  const isNote = entry.type === 'secure-note';
  const recentLabel = isNote ? (entry.lastUsedAt ? lastAction(entry) : 'Secure note') : isAuthenticator ? (entry.lastUsedAt ? lastAction(entry) : 'Authenticator') : lastAction(entry);
  return `<article class="quick-entry${isAuthenticator ? ' authenticator-entry' : ''}" data-id="${safeId}" tabindex="0" aria-label="Buka ${title}">
    <div class="quick-entry-main">
      <div class="quick-entry-title"><button class="quick-pin ${entry.quickPinned ? 'active' : ''}" type="button" data-quick-action="pin" aria-pressed="${String(Boolean(entry.quickPinned))}" aria-label="${entry.quickPinned ? 'Lepas pin' : 'Pin'} ${title}" title="${entry.quickPinned ? 'Lepas pin' : 'Pin'}"><i class="fa-${entry.quickPinned ? 'solid' : 'regular'} fa-star" aria-hidden="true"></i></button><strong>${title}</strong></div>
      <small class="quick-entry-meta">${meta}</small>
      <small class="quick-entry-recent">${escapeHtml(recentLabel)}</small>
    </div>
    ${isNote ? '<span class="quick-entry-recent">Catatan</span>' : isAuthenticator ? `<div class="quick-entry-actions quick-totp-actions" aria-label="Aksi ${title}">
      <div class="quick-totp-panel">
        <span class="quick-totp-label">KODE 2FA</span>
        <strong class="quick-totp-code" data-quick-totp-code aria-label="Kode 2FA ${title}">${formatTotpCode(entry.totpCode)}</strong>
        <small class="quick-totp-timer" data-quick-totp-timer>${totpRemainingLabel(entry.totpRemaining)}</small>
      </div>
      <button class="quick-action quick-totp-copy" type="button" data-quick-action="copy" data-field="totp" title="Salin kode 2FA" aria-label="Salin kode 2FA ${title}"><i class="fa-solid fa-copy" aria-hidden="true"></i></button>
    </div>` : `<div class="quick-entry-actions" aria-label="Aksi ${title}">
      <button class="quick-action" type="button" data-quick-action="copy" data-field="url" title="Salin alamat situs" aria-label="Salin alamat situs ${title}" ${entry.url ? '' : 'disabled'}><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></button>
      <button class="quick-action" type="button" data-quick-action="copy" data-field="username" title="Salin username" aria-label="Salin username ${title}" ${entry.username ? '' : 'disabled'}><i class="fa-solid fa-at" aria-hidden="true"></i></button>
      <button class="quick-action" type="button" data-quick-action="copy" data-field="password" title="Salin password" aria-label="Salin password ${title}"><i class="fa-solid fa-key" aria-hidden="true"></i></button>
    </div>`}
  </article>`;
}

function renderList(target, list) {
  target.innerHTML = list.length ? list.map(entryMarkup).join('') : '';
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = entries.filter((entry) => matches(entry, query));
  const pinned = filtered.filter((entry) => entry.quickPinned);
  const recent = filtered
    .filter((entry) => !entry.quickPinned && (query || entry.lastUsedAt || entry.usageCount > 0))
    .sort((left, right) => (Date.parse(right.lastUsedAt || '') || 0) - (Date.parse(left.lastUsedAt || '') || 0));
  recentTitle.textContent = query ? 'Hasil pencarian' : 'Terakhir digunakan';
  pinnedSection.classList.toggle('hidden', pinned.length === 0);
  pinnedCount.textContent = pinned.length ? String(pinned.length) : '';
  recentSection.classList.toggle('hidden', recent.length === 0);
  recentCount.textContent = recent.length ? String(recent.length) : '';
  clearRecentButton.classList.toggle('hidden', Boolean(query) || recent.length === 0);
  renderList(pinnedList, pinned);
  renderList(recentList, recent);
  refreshTotpCodes();
  const hasVisibleSection = pinned.length > 0 || recent.length > 0;
  emptyState.classList.toggle('hidden', hasVisibleSection);
  emptyTitle.textContent = query ? 'Tidak ada credential ditemukan' : 'Belum ada credential di Quick Access';
  emptySubtitle.textContent = query ? 'Coba kata kunci lain.' : 'Pin item atau salin credential untuk melihatnya di sini.';
  if (!filtered.length && entries.length && query) status.textContent = 'Tidak ada hasil.';
  else status.textContent = '';
}

async function clearRecentUsage() {
  if (clearRecentButton.disabled) return;
  clearRecentButton.disabled = true;
  try {
    const result = await window.passsaQuick.clearRecent();
    if (!result?.ok) throw new Error(result?.message || 'Riwayat penggunaan gagal dibersihkan.');
    entries = entries.map((entry) => ({
      ...entry,
      usageCount: 0,
      lastUsedAt: null,
      recentUseHistory: [],
    }));
    render();
    status.textContent = result.cleared
      ? `${result.cleared} riwayat penggunaan dibersihkan.`
      : 'Riwayat penggunaan sudah bersih.';
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => { status.textContent = ''; }, 2600);
  } catch (error) {
    status.textContent = error.message || 'Riwayat penggunaan gagal dibersihkan.';
  } finally {
    clearRecentButton.disabled = false;
  }
}

async function loadEntries() {
  status.textContent = '';
  try {
    const result = await window.passsaQuick.list();
    if (!result?.ok) {
      entries = [];
      status.textContent = result?.message || 'Vault sedang terkunci.';
      render();
      return;
    }
    entries = Array.isArray(result.items) ? result.items : [];
    render();
  } catch (error) {
    entries = [];
    status.textContent = error.message || 'Quick Access tidak tersedia.';
    render();
  }
}

function showCopyFeedback(button, message) {
  button.classList.add('copy-success');
  const original = button.innerHTML;
  button.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
  setTimeout(() => { button.classList.remove('copy-success'); button.innerHTML = original; }, 800);
  status.textContent = message;
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => { status.textContent = ''; }, 2600);
}

let totpRefreshInFlight = false;

async function refreshTotpCodes() {
  if (totpRefreshInFlight || document.visibilityState === 'hidden') return;
  const ids = entries.filter((entry) => entry.type === 'authenticator').map((entry) => entry.id);
  if (!ids.length || typeof window.passsaQuick.totpCodes !== 'function') return;
  totpRefreshInFlight = true;
  try {
    const codes = await window.passsaQuick.totpCodes(ids);
    for (const [id, data] of Object.entries(codes || {})) {
      const row = [...document.querySelectorAll('.authenticator-entry')]
        .find((candidate) => candidate.dataset.id === id);
      if (!row || !data?.code) continue;
      const codeElement = row.querySelector('[data-quick-totp-code]');
      const timerElement = row.querySelector('[data-quick-totp-timer]');
      const formatted = formatTotpCode(data.code);
      if (codeElement) {
        codeElement.textContent = formatted;
        codeElement.setAttribute('aria-label', `Kode 2FA ${data.code}`);
      }
      if (timerElement) timerElement.textContent = totpRemainingLabel(data.remaining);
    }
  } catch {
    // Quick Access tetap menampilkan placeholder jika sesi sedang berakhir.
  } finally {
    totpRefreshInFlight = false;
  }
}

async function handleAction(event) {
  const button = event.target.closest('[data-quick-action]');
  if (!button) return;
  const row = button.closest('[data-id]');
  if (!row) return;
  const entry = entries.find((candidate) => candidate.id === row.dataset.id);
  if (!entry) return;
  try {
    if (button.dataset.quickAction === 'pin') {
      const result = await window.passsaQuick.togglePin(entry.id);
      if (!result?.ok) throw new Error(result?.message || 'Pin credential gagal.');
      await loadEntries();
      return;
    }
    const result = await window.passsaQuick.copy(entry.id, button.dataset.field);
    if (!result?.ok) throw new Error(result?.message || 'Credential gagal disalin.');
    entry.usageCount = result.usage?.usageCount ?? entry.usageCount;
    entry.lastUsedAt = result.usage?.lastUsedAt ?? entry.lastUsedAt;
    entry.recentUseHistory = result.usage?.recentUseHistory ?? entry.recentUseHistory;
    showCopyFeedback(button, result.message || 'Credential disalin.');
    render();
  } catch (error) {
    status.textContent = error.message || 'Aksi Quick Access gagal.';
  }
}

function closeNoteModal() {
  noteModal.classList.add('hidden');
  noteModalPreviousFocus?.focus?.({ preventScroll: true });
  noteModalPreviousFocus = null;
}

function showNoteModal(note, source) {
  noteTitle.textContent = note.title || 'Catatan';
  noteMeta.textContent = `${note.group || 'Umum'} · Catatan terenkripsi`;
  noteBody.textContent = note.notes || 'Tidak ada isi catatan.';
  noteTags.innerHTML = Array.isArray(note.tags) && note.tags.length
    ? note.tags.map((tag) => `<span class="quick-note-tag">#${escapeHtml(tag)}</span>`).join('')
    : '';
  noteModalPreviousFocus = source;
  noteModal.classList.remove('hidden');
  requestAnimationFrame(() => noteCloseButton.focus());
}

async function openEntry(event) {
  if (event.target.closest('button, input, a')) return;
  const row = event.target.closest('.quick-entry');
  if (!row) return;
  const entry = entries.find((candidate) => candidate.id === row.dataset.id);
  if (!entry) return;
  try {
    if (entry.type === 'secure-note') {
      const result = await window.passsaQuick.getNote(entry.id);
      if (!result?.ok || !result.note) throw new Error(result?.message || 'Secure Note tidak dapat dibuka.');
      const usage = await window.passsaQuick.useNote(entry.id);
      if (!usage?.ok) throw new Error(usage?.message || 'Penggunaan Secure Note gagal dicatat.');
      entry.usageCount = usage.usage?.usageCount ?? entry.usageCount;
      entry.lastUsedAt = usage.usage?.lastUsedAt ?? entry.lastUsedAt;
      entry.recentUseHistory = usage.usage?.recentUseHistory ?? entry.recentUseHistory;
      render();
      const refreshedRow = [...document.querySelectorAll('.quick-entry')].find((candidate) => candidate.dataset.id === entry.id);
      showNoteModal(result.note, refreshedRow || row);
      return;
    }
    const result = await window.passsaQuick.openItem(entry.id);
    if (!result?.ok) throw new Error(result?.message || 'Credential tidak dapat dibuka.');
  } catch (error) {
    status.textContent = error.message || 'Credential tidak dapat dibuka.';
  }
}

searchInput.addEventListener('input', render);
clearRecentButton.addEventListener('click', clearRecentUsage);
document.addEventListener('click', handleAction);
document.addEventListener('click', openEntry);
closeButton.addEventListener('click', () => window.passsaQuick.close());
noteCloseButton.addEventListener('click', closeNoteModal);
noteModal.addEventListener('click', (event) => {
  if (event.target === noteModal) closeNoteModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!noteModal.classList.contains('hidden')) closeNoteModal();
    else window.passsaQuick.close();
    return;
  }
  if (['Enter', ' '].includes(event.key) && event.target.closest('.quick-entry') && !event.target.closest('button, input, a')) {
    event.preventDefault();
    openEntry(event);
    return;
  }
  if (event.key === 'Enter' && event.target === searchInput) {
    const first = document.querySelector('.quick-entry [data-quick-action="copy"][data-field="password"], .quick-entry [data-quick-action="copy"][data-field="totp"]');
    if (first) first.click();
  }
});

window.passsaQuick.onTheme((theme) => applyQuickTheme(theme));
if (systemThemeQuery?.addEventListener) systemThemeQuery.addEventListener('change', () => {
  try {
    if (normalizeThemePreference(localStorage.getItem(THEME_STORAGE_KEY)) === 'system') applyStoredTheme();
  } catch { applyStoredTheme(); }
});

function resetSearchAndLoad() {
  searchInput.value = '';
  loadEntries();
  searchInput.focus();
}

window.passsaQuick.onRefresh(resetSearchAndLoad);
loadEntries();
searchInput.focus();
setInterval(refreshTotpCodes, 1000);
