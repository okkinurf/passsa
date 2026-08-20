const searchInput = document.querySelector('#quick-search-input');
const status = document.querySelector('#quick-status');
const pinnedSection = document.querySelector('#quick-pinned-section');
const pinnedCount = document.querySelector('#quick-pinned-count');
const pinnedList = document.querySelector('#quick-pinned-list');
const recentSection = document.querySelector('#quick-recent-section');
const recentCount = document.querySelector('#quick-recent-count');
const recentList = document.querySelector('#quick-recent-list');
const emptyState = document.querySelector('#quick-empty');
const emptyTitle = document.querySelector('#quick-empty-title');
const emptySubtitle = document.querySelector('#quick-empty-subtitle');
const recentTitle = document.querySelector('#quick-recent-title');
const closeButton = document.querySelector('#quick-close');

let entries = [];
let refreshTimer;

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
  const label = record.field === 'password' ? 'Password' : record.field === 'username' ? 'Username' : 'Link';
  return `${label} disalin · ${formatRecent(record.usedAt)}`;
}

function matches(entry, query) {
  if (!query) return true;
  return [entry.title, entry.username, entry.url, entry.group, ...(entry.tags || [])]
    .some((value) => String(value || '').toLowerCase().includes(query));
}

function entryMarkup(entry) {
  const title = escapeHtml(entry.title);
  const meta = escapeHtml([entry.username || 'Tanpa username', entry.url || entry.group || 'Login lokal'].filter(Boolean).join(' · '));
  const safeId = escapeHtml(entry.id);
  const isNote = entry.type === 'secure-note';
  return `<article class="quick-entry" data-id="${safeId}">
    <div class="quick-entry-main">
      <div class="quick-entry-title"><button class="quick-pin ${entry.quickPinned ? 'active' : ''}" type="button" data-quick-action="pin" aria-label="${entry.quickPinned ? 'Lepas pin' : 'Pin'} ${title}" title="${entry.quickPinned ? 'Lepas pin' : 'Pin'}">${entry.quickPinned ? '★' : '☆'}</button><strong>${title}</strong></div>
      <small class="quick-entry-meta">${meta}</small>
      <small class="quick-entry-recent">${escapeHtml(isNote ? 'Secure note' : lastAction(entry))}</small>
    </div>
    ${isNote ? '<span class="quick-entry-recent">Catatan</span>' : `<div class="quick-entry-actions" aria-label="Aksi ${title}">
      <button class="quick-action" type="button" data-quick-action="copy" data-field="url" title="Salin alamat situs" aria-label="Salin alamat situs" ${entry.url ? '' : 'disabled'}>↗</button>
      <button class="quick-action" type="button" data-quick-action="copy" data-field="username" title="Salin username" aria-label="Salin username" ${entry.username ? '' : 'disabled'}>@</button>
      <button class="quick-action" type="button" data-quick-action="copy" data-field="password" title="Salin password" aria-label="Salin password">🔑</button>
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
  renderList(pinnedList, pinned);
  renderList(recentList, recent);
  const hasVisibleSection = pinned.length > 0 || recent.length > 0;
  emptyState.classList.toggle('hidden', hasVisibleSection);
  emptyTitle.textContent = query ? 'Tidak ada credential ditemukan' : 'Belum ada credential di Quick Access';
  emptySubtitle.textContent = query ? 'Coba kata kunci lain.' : 'Pin item atau salin credential untuk melihatnya di sini.';
  if (!filtered.length && entries.length && query) status.textContent = 'Tidak ada hasil.';
  else status.textContent = '';
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
  const original = button.textContent;
  button.textContent = '✓';
  setTimeout(() => { button.classList.remove('copy-success'); button.textContent = original; }, 800);
  status.textContent = message;
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => { status.textContent = ''; }, 2600);
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

searchInput.addEventListener('input', render);
document.addEventListener('click', handleAction);
closeButton.addEventListener('click', () => window.passsaQuick.close());
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') window.passsaQuick.close();
  if (event.key === 'Enter' && event.target === searchInput) {
    const first = document.querySelector('.quick-entry [data-quick-action="copy"][data-field="password"]');
    if (first) first.click();
  }
});

window.passsaQuick.onRefresh(loadEntries);
loadEntries();
searchInput.focus();
