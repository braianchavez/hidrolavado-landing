/* =========================================================
   CONFIGURACIÓN DEL SITIO
   Editá estos 4 valores con los datos reales de la empresa
   (los vas a encontrar en su perfil de Instagram).
   Todo el sitio se actualiza automáticamente a partir de acá.
   ========================================================= */
const SITE_CONFIG = {
  businessName: "Hidromax",      // ej: "Hidrolavados del Oeste"
  whatsappNumber: "5491132119391",           // solo números, con código de país. ej: Arg = 54 9 11 XXXXXXXX
  whatsappMessage: "Hola! Quiero pedir un presupuesto para hidrolavado.",
  instagramHandle: "@hidromax.ok",             // ej: "@hidrolavados.oeste"
  location: "Trabajamos en GBA y Capital Federal: desde Campana hasta La Plata."               // ej: "San Justo, Buenos Aires"
};

(function init() {
  // --- Businessname / location text nodes ---
  document.querySelectorAll('[data-config="businessName"]').forEach(el => {
    el.textContent = SITE_CONFIG.businessName;
  });
  document.querySelectorAll('[data-config="location"]').forEach(el => {
    el.textContent = SITE_CONFIG.location;
  });

  // --- WhatsApp links ---
  const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`;
  document.querySelectorAll('[data-wa-link]').forEach(el => { el.href = waUrl; });

  const waDisplay = document.querySelector('[data-wa-display]');
  if (waDisplay) {
    const formatted = SITE_CONFIG.whatsappNumber.length >= 10
      ? `WhatsApp: +${SITE_CONFIG.whatsappNumber}`
      : 'WhatsApp';
    waDisplay.textContent = formatted;
  }

  // --- Instagram links ---
  const igUrl = `https://instagram.com/${SITE_CONFIG.instagramHandle.replace('@', '')}`;
  document.querySelectorAll('[data-ig-link]').forEach(el => { el.href = igUrl; });
  document.querySelectorAll('[data-ig-handle]').forEach(el => { el.textContent = SITE_CONFIG.instagramHandle; });

  // --- Footer year ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Mobile nav ---
  const burger = document.getElementById('navBurger');
  const nav = document.getElementById('nav');
  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav--open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // --- Before/after compare slider ---
  document.querySelectorAll('[data-compare]').forEach(setupCompare);
})();

function setupCompare(root) {
  const frame = root.querySelector('.compare__frame');
  const after = root.querySelector('[data-compare-after]');
  const handle = root.querySelector('[data-compare-handle]');
  if (!frame || !after || !handle) return;

  let dragging = false;

  function setPosition(clientX) {
    const rect = frame.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    after.style.width = pct + '%';
    handle.style.left = pct + '%';
    // keep the after image visually full-width relative to the frame,
    // so it doesn't stretch as the clip width changes
    after.querySelector('img').style.width = rect.width + 'px';
  }

  function onDown(e) {
    dragging = true;
    frame.setPointerCapture && e.pointerId != null && frame.setPointerCapture(e.pointerId);
  }
  function onMove(e) {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setPosition(clientX);
  }
  function onUp() { dragging = false; }

  frame.addEventListener('pointerdown', (e) => { onDown(e); setPosition(e.clientX); });
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  frame.addEventListener('touchstart', (e) => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
  frame.addEventListener('touchmove', onMove, { passive: true });
  frame.addEventListener('touchend', onUp);

  // click anywhere on the frame also moves the handle
  frame.addEventListener('click', (e) => setPosition(e.clientX));

  // keep after-image sized correctly on resize
  window.addEventListener('resize', () => {
    const rect = frame.getBoundingClientRect();
    after.querySelector('img').style.width = rect.width + 'px';
  });

  // init at 62%
  requestAnimationFrame(() => {
    const rect = frame.getBoundingClientRect();
    after.querySelector('img').style.width = rect.width + 'px';
  });
}
