const metadata = require('@fortawesome/fontawesome-free/metadata/icon-families.json');

const FREE_SOLID_ICONS = Object.entries(metadata)
  .filter(([, icon]) => icon.familyStylesByLicense?.free?.some(
    (style) => style.family === 'classic' && style.style === 'solid',
  ))
  .map(([name]) => name)
  .sort((left, right) => left.localeCompare(right));

const FREE_SOLID_ICON_SET = new Set(FREE_SOLID_ICONS);

function defaultIconForCategory(name) {
  const key = String(name).toLowerCase();
  if (key.includes('internet')) return 'globe';
  if (key.includes('coding')) return 'code';
  if (key.includes('gaming')) return 'gamepad';
  if (key.includes('shopping')) return 'cart-shopping';
  if (key.includes('social')) return 'user-group';
  if (key.includes('computer')) return 'computer';
  if (key.includes('real world')) return 'house';
  return 'folder';
}

module.exports = { FREE_SOLID_ICONS, FREE_SOLID_ICON_SET, defaultIconForCategory };
