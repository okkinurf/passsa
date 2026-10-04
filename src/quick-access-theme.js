(() => {
  const palettes = new Set(['rose', 'ocean', 'forest', 'violet', 'sunset', 'amber', 'teal', 'indigo', 'coral', 'slate']);
  const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)');
  let preference = 'system';
  let palette = 'rose';

  try {
    const storedTheme = localStorage.getItem('passsa-theme');
    if (['system', 'light', 'dark'].includes(storedTheme)) preference = storedTheme;
    const storedPalette = localStorage.getItem('passsa-palette');
    if (palettes.has(storedPalette)) palette = storedPalette;
  } catch { /* Gunakan tema sistem dan palet default bila storage tidak tersedia. */ }

  const theme = preference === 'system'
    ? (systemTheme?.matches ? 'dark' : 'light')
    : preference;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.palette = palette;
  document.documentElement.style.colorScheme = theme;
})();
