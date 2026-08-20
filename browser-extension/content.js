(() => {
  if (window.__passsaContentReady) return;
  window.__passsaContentReady = true;

  function visible(input) {
    const style = getComputedStyle(input);
    const rect = input.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  }

  function findFields() {
    const inputs = [...document.querySelectorAll('input')].filter(visible);
    const password = inputs.find((input) => input.type === 'password');
    const username = inputs.find((input) => {
      const hint = `${input.name} ${input.id} ${input.autocomplete} ${input.type}`.toLowerCase();
      return input !== password && (input.autocomplete === 'username' || /user|email|login|account|identifier/.test(hint));
    }) || inputs.find((input) => input !== password && ['text', 'email'].includes(input.type));
    return { username, password };
  }

  function setValue(input, value) {
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    if (setter) setter.call(input, value);
    else input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function fillCustomFields(customFields) {
    const inputs = [...document.querySelectorAll('input, textarea, select')].filter(visible);
    let filled = 0;
    for (const field of Array.isArray(customFields) ? customFields : []) {
      const label = String(field?.label || '').trim().toLowerCase();
      if (!label) continue;
      const target = inputs.find((input) => [input.id, input.name, input.getAttribute('aria-label'), input.placeholder]
        .some((candidate) => String(candidate || '').trim().toLowerCase() === label));
      if (!target) continue;
      if (field.type === 'boolean' && target.type === 'checkbox') target.checked = Boolean(field.value);
      else setValue(target, field.value ?? '');
      target.dispatchEvent(new Event('change', { bubbles: true }));
      filled += 1;
    }
    return filled;
  }

  function fill(credential) {
    const fields = findFields();
    const usernameFilled = setValue(fields.username, credential?.username || '');
    const passwordFilled = setValue(fields.password, credential?.password || '');
    const customFilled = fillCustomFields(credential?.fields);
    if (fields.username) fields.username.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    if (fields.password) fields.password.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    return { ok: Boolean(usernameFilled || passwordFilled || customFilled), usernameFilled, passwordFilled, customFilled };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'fill') sendResponse(fill(message.credential));
    if (message?.type === 'notice') {
      const node = document.createElement('div');
      node.textContent = message.text;
      Object.assign(node.style, { position: 'fixed', zIndex: '2147483647', top: '16px', right: '16px', padding: '10px 14px', borderRadius: '9px', background: '#fff', color: '#5b1934', boxShadow: '0 6px 24px #0003', font: '600 13px system-ui' });
      document.documentElement.appendChild(node);
      setTimeout(() => node.remove(), 2600);
    }
  });
})();
