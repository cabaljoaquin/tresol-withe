/* ============================================================
   TRESOL — presupuesto.js
   Carrito de PRESUPUESTO (no de compra): consolida productos,
   variantes y observaciones, y genera la Solicitud de Presupuesto.
   ============================================================ */

(() => {
  const root = document.getElementById('quoteRoot');

  function resumenWhatsApp() {
    const items = TresolCart.items;
    const lines = items.map(i => {
      const p = TRESOL.getProducto(i.pid);
      return `• ${p?.nombre || i.pid} (${i.variante}) ×${i.qty}${i.obs ? ' — Obs: ' + i.obs : ''}`;
    });
    return encodeURIComponent(`¡Hola Tresol! Quiero cotizar:\n${lines.join('\n')}`);
  }

  function render() {
    const items = TresolCart.items;

    if (!items.length) {
      root.innerHTML = `
        <div class="empty-state">
          <h3>Tu solicitud está vacía</h3>
          <p>Recorré el catálogo y agregá los productos que quieras cotizar — podés combinar mesadas, bachas y bases de ducha en una misma solicitud.</p>
          <a class="btn btn--primary" href="catalogo.html">Explorar el catálogo</a>
        </div>`;
      return;
    }

    const conPrecio = items.filter(i => i.precioUnit != null);
    const sinPrecio = items.filter(i => i.precioUnit == null);
    const subtotal = conPrecio.reduce((a, i) => a + i.precioUnit * i.qty, 0);

    root.innerHTML = `
    <div class="quote-layout">
      <div class="card" style="overflow:visible;">
        ${items.map((i, idx) => {
          const p = TRESOL.getProducto(i.pid);
          if (!p) return '';
          return `
          <div class="quote-item">
            <div class="qi-visual">${productVisual(p, i.colorId)}</div>
            <div>
              <h3><a href="producto.html?id=${p.id}">${esc(p.nombre)}</a></h3>
              <p class="qi-meta">${esc(p.codigo)} · ${esc(i.variante)}</p>
              <div class="qty-stepper" style="transform:scale(.85); transform-origin:left;" aria-label="Cantidad">
                <button type="button" data-minus="${idx}" aria-label="Restar uno">−</button>
                <input type="text" value="${i.qty}" data-qty="${idx}" inputmode="numeric" aria-label="Cantidad">
                <button type="button" data-plus="${idx}" aria-label="Sumar uno">+</button>
              </div>
              ${i.obs ? `<p class="qi-obs"><strong>Obs:</strong> ${esc(i.obs)}</p>` : ''}
            </div>
            <div class="qi-actions">
              <span class="qi-price">${i.precioUnit != null ? TRESOL.fmtPrecio(i.precioUnit * i.qty) : 'A cotizar'}</span>
              <button class="qi-remove" data-remove="${idx}">Quitar</button>
            </div>
          </div>`;
        }).join('')}
      </div>

      <aside class="quote-summary">
        <h2>Resumen</h2>
        <div class="sum-row"><span>Productos</span><strong>${items.reduce((a, i) => a + i.qty, 0)}</strong></div>
        ${conPrecio.length ? `<div class="sum-row"><span>Subtotal precios de referencia</span><strong>${TRESOL.fmtPrecio(subtotal)}</strong></div>` : ''}
        ${sinPrecio.length ? `<div class="sum-row"><span>Ítems a cotizar</span><strong>${sinPrecio.length}</strong></div>` : ''}
        <p class="sum-note">Los precios publicados son de referencia (IVA incluido). Tresol revisará tu solicitud — incluidas medidas especiales y colores a pedido — y te enviará la <strong>cotización final</strong>. No incluye descarga, instalación ni grifería.</p>

        <form id="quoteForm" novalidate>
          <div class="field">
            <label for="fNombre">Nombre y apellido <span class="req">*</span></label>
            <input type="text" id="fNombre" name="nombre" autocomplete="name" required>
            <span class="error-msg">Ingresá tu nombre.</span>
          </div>
          <div class="field">
            <label for="fEmail">Email <span class="req">*</span></label>
            <input type="email" id="fEmail" name="email" autocomplete="email" required>
            <span class="error-msg">Ingresá un email válido.</span>
          </div>
          <div class="field">
            <label for="fTel">Teléfono <span class="req">*</span></label>
            <input type="tel" id="fTel" name="telefono" autocomplete="tel" placeholder="Ej: 351 1234567" required>
            <span class="error-msg">Ingresá un teléfono de contacto.</span>
          </div>
          <div class="field">
            <label for="fMsg">Mensaje</label>
            <textarea id="fMsg" name="mensaje" placeholder="Contanos sobre tu proyecto: plazos, ubicación de la obra, dudas…"></textarea>
          </div>
          <button type="submit" class="btn btn--primary btn--block btn--lg">Enviar solicitud de presupuesto</button>
        </form>
        <a class="btn btn--wa btn--block mt-2" href="https://wa.me/${TRESOL.contacto.whatsapp}?text=${resumenWhatsApp()}" target="_blank" rel="noopener">Enviar por WhatsApp</a>
      </aside>
    </div>`;

    bind();
  }

  function bind() {
    root.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => { TresolCart.remove(+b.dataset.remove); render(); }));
    root.querySelectorAll('[data-minus]').forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.minus; TresolCart.setQty(i, TresolCart.items[i].qty - 1); render();
    }));
    root.querySelectorAll('[data-plus]').forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.plus; TresolCart.setQty(i, TresolCart.items[i].qty + 1); render();
    }));
    root.querySelectorAll('[data-qty]').forEach(inp => inp.addEventListener('change', () => {
      TresolCart.setQty(+inp.dataset.qty, parseInt(inp.value, 10) || 1); render();
    }));

    const form = document.getElementById('quoteForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('step2')?.classList.add('is-active');

      let ok = true;
      const check = (id, valid) => {
        const field = document.getElementById(id).closest('.field');
        field.classList.toggle('has-error', !valid);
        if (!valid) ok = false;
      };
      const nombre = document.getElementById('fNombre').value.trim();
      const email = document.getElementById('fEmail').value.trim();
      const tel = document.getElementById('fTel').value.trim();
      check('fNombre', nombre.length >= 2);
      check('fEmail', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      check('fTel', tel.length >= 6);
      if (!ok) return;

      // Simulación de envío: en producción esto es un POST al backend
      // que crea la SOLICITUD_PRESUPUESTO y notifica al equipo comercial.
      const nro = 'SP-' + String(Date.now()).slice(-6);
      const resumen = TresolCart.items.length;
      TresolCart.clear();
      confirmar(nro, nombre, email, resumen);
    });
  }

  function confirmar(nro, nombre, email, cant) {
    document.getElementById('step1').classList.remove('is-active');
    document.getElementById('step2').classList.remove('is-active');
    document.getElementById('step3').classList.add('is-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    root.innerHTML = `
      <div class="card confirm-panel">
        <div class="confirm-icon">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>
        </div>
        <h2>¡Solicitud enviada, ${esc(nombre.split(' ')[0])}!</h2>
        <p>Registramos tu solicitud <strong>${nro}</strong> con ${cant} producto${cant !== 1 ? 's' : ''}. Te enviaremos la cotización a <strong>${esc(email)}</strong> — normalmente dentro de las 48 hs hábiles.</p>
        <p class="muted" style="font-size:.85rem;">¿Tenés apuro? Escribinos por WhatsApp mencionando el número de solicitud.</p>
        <div class="hero-ctas" style="justify-content:center;">
          <a class="btn btn--primary" href="catalogo.html">Seguir explorando</a>
          <a class="btn btn--wa" href="https://wa.me/${TRESOL.contacto.whatsapp}?text=${encodeURIComponent('¡Hola Tresol! Consulto por mi solicitud ' + nro)}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
        <p class="muted mt-3" style="font-size:.75rem;">* Prototipo: en producción la solicitud se registra en el panel de gestión y dispara un email de confirmación.</p>
      </div>`;
  }

  document.addEventListener('DOMContentLoaded', render);
})();
