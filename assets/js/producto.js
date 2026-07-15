/* ============================================================
   TRESOL — producto.js
   Ficha de producto: galería, specs estructuradas, selector de
   color por serie, variantes con precio, plano técnico, carrito.
   ============================================================ */

(() => {
  const params = new URLSearchParams(location.search);
  const p = TRESOL.getProducto(params.get('id')) || TRESOL.productos[0];
  const cat = TRESOL.categorias.find(c => c.id === p.categoria);
  const sub = cat?.sub.find(s => s.id === p.sub);
  const serie = TRESOL.getSerie(p.serie);

  const state = {
    colorId: (p.colores.find(c => c.modo === 'estandar') || p.colores[0]).id,
    qty: 1,
    // variantes
    ancho: p.tipo === 'base' ? p.variantes.anchos[0] : null,
    largo: p.tipo === 'base' ? p.variantes.largos[0] : null,
    alto: p.tipo === 'base' ? p.variantes.altos[0] : null,
    medidaIdx: p.tipo === 'tapa' ? 0 : null,
    espesor: p.tipo === 'placa' ? p.espesores[0] : null
  };

  /* ---------- Precio actual según variante ---------- */
  function precioActual() {
    if (!p.muestraPrecio) return null;
    if (p.tipo === 'base') return TRESOL.precioBaseDucha(p, state.ancho, state.largo, state.alto);
    if (p.tipo === 'tapa') return p.medidasOpciones[state.medidaIdx].precio;
    return p.precio;
  }

  /* ---------- Descripción de la variante elegida (para el carrito) ---------- */
  function varianteDesc() {
    const color = TRESOL.getColor(state.colorId);
    const parts = ['Color ' + color.nombre];
    if (p.tipo === 'base') parts.push(`${state.ancho} × ${state.largo} mm · alto ${state.alto} mm`);
    if (p.tipo === 'tapa') parts.push(p.medidasOpciones[state.medidaIdx].label);
    if (p.tipo === 'placa') parts.push(`Espesor ${state.espesor} mm · ${p.formato}`);
    if (p.tipo === 'pileta' && p.largo) parts.push(TRESOL.medidasTexto(p));
    return parts.join(' · ');
  }

  /* ---------- Vistas de galería ---------- */
  const vistas = p.tipo === 'pileta'
    ? [['main', 'Vista superior'], ['ambiente', 'En ambiente'], ['detail', 'Detalle desagüe'], ['top', 'Planta']]
    : p.tipo === 'base'
      ? [['main', 'Vista superior'], ['ambiente', 'En ambiente'], ['detail', 'Textura y desagüe']]
      : [['main', 'Vista principal'], ['ambiente', 'En contexto']];
  let vistaActiva = 'main';

  /* ---------- Tabla de especificaciones ---------- */
  function specsRows() {
    const rows = [];
    rows.push(['Código', p.codigo]);
    rows.push(['Categoría', cat.nombre + (sub ? ' · ' + sub.nombre : '')]);
    rows.push(['Material', 'Superficie sólida Tresol® (resinas acrílicas/poliéster + hidróxido de aluminio)']);
    if (p.specsFijas) { rows.push(...p.specsFijas); }
    if (p.tipo === 'pileta') {
      if (p.forma) rows.push(['Forma', TRESOL.FORMAS[p.forma]]);
      if (p.instalacion) rows.push(['Tipo de instalación', TRESOL.INSTALACIONES[p.instalacion]]);
      if (p.largo) rows.push(['Medidas', TRESOL.medidasTexto(p)]);
      if (p.profundidad) rows.push(['Profundidad', p.profundidad + ' mm']);
      rows.push(['Incluye desagüe', p.incluyeDesague ? 'Sí' : 'No']);
      rows.push(['Apta para', sub?.nombre === 'Sanitarias' ? 'Hospitales, laboratorios, industria' : (sub?.nombre || '—')]);
    }
    if (p.tipo === 'base') {
      rows.push(['Modelo', p.codigo.charAt(0) + p.codigo.slice(1).toLowerCase()]);
      rows.push(['Anchos disponibles', p.variantes.anchos.join(' / ') + ' mm']);
      rows.push(['Largos disponibles', Math.min(...p.variantes.largos) + ' a ' + Math.max(...p.variantes.largos) + ' mm']);
      rows.push(['Altos', p.variantes.altos.join(' / ') + ' mm']);
      rows.push(['Superficie', 'Antideslizante']);
    }
    if (p.tipo === 'tapa') {
      rows.push(['Forma', TRESOL.FORMAS[p.forma]]);
      rows.push(['Medidas estándar', p.medidasOpciones.map(m => m.label).join(' · ')]);
      rows.push(['Respaldo', 'Melamina 18 mm']);
      rows.push(['Regrueso perimetral', '40 mm']);
    }
    if (p.tipo === 'placa') {
      rows.push(['Formato', p.formato]);
      rows.push(['Espesores', p.espesores.join(' / ') + ' mm']);
      rows.push(['Serie', serie.nombre + ' (Grupo ' + serie.grupo + ' de precio)']);
      if (p.flex) rows.push(['Termoformable', 'Sí — línea TRESOL FLEX']);
    }
    rows.push(['Higiene', 'Antibacterial sin biocidas · no poroso · apto contacto con alimentos']);
    rows.push(['Seguridad', 'Ignífugo / retardante de llama']);
    if (p.garantia) rows.push(['Garantía', p.garantia]);
    return rows;
  }

  /* ---------- Selector de color ---------- */
  function colorPickerHTML() {
    return p.colores.map(pc => {
      const c = TRESOL.getColor(pc.id);
      const sel = state.colorId === pc.id;
      return `<button type="button" class="color-opt ${pc.modo === 'pedido' ? 'is-pedido' : ''} ${sel ? 'is-selected' : ''}"
        style="background:${c.css}" data-color="${pc.id}"
        title="${esc(c.nombre)}${pc.modo === 'pedido' ? ' (a pedido)' : ''}"
        aria-label="${esc(c.nombre)}${pc.modo === 'pedido' ? ', disponible a pedido' : ''}" aria-pressed="${sel}">
        <span class="tick">✓</span>
      </button>`;
    }).join('');
  }

  /* ---------- Selectores de variante ---------- */
  function variantesHTML() {
    if (p.tipo === 'base') {
      return `<div class="pdp-block"><h2>Medida</h2>
        <div class="variant-row">
          <div class="field"><label for="vAncho">Ancho (mm)</label>
            <select id="vAncho">${p.variantes.anchos.map(a => `<option value="${a}">${a}</option>`).join('')}</select></div>
          <div class="field"><label for="vLargo">Largo (mm)</label>
            <select id="vLargo">${p.variantes.largos.map(l => `<option value="${l}">${l}</option>`).join('')}</select></div>
          <div class="field"><label for="vAlto">Alto (mm)</label>
            <select id="vAlto">${p.variantes.altos.map(a => `<option value="${a}">${a}</option>`).join('')}</select></div>
        </div>
        <p class="pdp-note">¿Necesitás otra medida? Indicala en observaciones — confeccionamos medidas especiales.</p>
      </div>`;
    }
    if (p.tipo === 'tapa') {
      return `<div class="pdp-block"><h2>Medida</h2>
        <div class="variant-row">
          <div class="field"><label for="vMedida">Medida estándar</label>
            <select id="vMedida">${p.medidasOpciones.map((m, i) => `<option value="${i}">${esc(m.label)} — ${TRESOL.fmtPrecio(m.precio)}</option>`).join('')}</select></div>
        </div>
        <p class="pdp-note">Consulte por tamaños especiales en el campo de observaciones.</p>
      </div>`;
    }
    if (p.tipo === 'placa') {
      return `<div class="pdp-block"><h2>Espesor</h2>
        <div class="variant-row">
          <div class="field"><label for="vEspesor">Espesor (mm)</label>
            <select id="vEspesor">${p.espesores.map(e => `<option value="${e}">${e} mm</option>`).join('')}</select></div>
        </div>
        ${p.espesores.length < 3 ? '<p class="pdp-note">El espesor de 19 mm está disponible solo en las series Absolut, Nature y Trend.</p>' : ''}
      </div>`;
    }
    return '';
  }

  /* ---------- Render principal ---------- */
  function render() {
    const precio = precioActual();
    const color = TRESOL.getColor(state.colorId);

    document.getElementById('pdpBreadcrumb').innerHTML = `
      <a href="index.html">Inicio</a><span class="sep">/</span>
      <a href="catalogo.html">Catálogo</a><span class="sep">/</span>
      <a href="catalogo.html?cat=${cat.id}">${esc(cat.nombre)}</a>
      ${sub ? `<span class="sep">/</span><a href="catalogo.html?cat=${cat.id}&sub=${sub.id}">${esc(sub.nombre)}</a>` : ''}
      <span class="sep">/</span><span aria-current="page">${esc(p.nombre)}</span>`;

    document.title = `${p.nombre} — TRESOL® Superficie Sólida`;

    document.getElementById('pdpRoot').innerHTML = `
      <div class="pdp-gallery">
        <div class="pdp-main-img" id="pdpMainImg">${productVisual(p, state.colorId, vistaActiva)}</div>
        <div class="pdp-thumbs">
          ${vistas.map(([v, label]) => `
            <button type="button" class="pdp-thumb ${v === vistaActiva ? 'is-active' : ''}" data-vista="${v}" aria-label="${esc(label)}" title="${esc(label)}">
              ${productVisual(p, state.colorId, v)}
            </button>`).join('')}
        </div>
        <p class="pdp-note">* Visualización ilustrativa del producto en color ${esc(color.nombre)} — las fotografías reales se cargan desde el panel de gestión.</p>
      </div>

      <div class="pdp-info">
        <span class="prod-code">${esc(cat.nombre)}${sub ? ' · ' + esc(sub.nombre) : ''} · ${esc(p.codigo)}</span>
        <h1>${esc(p.nombre)}</h1>
        <p class="pdp-desc">${esc(p.desc)}</p>

        ${p.muestraPrecio
          ? `<div class="pdp-price" id="pdpPrice">${TRESOL.fmtPrecio(precio)}<small>IVA incluido · fabricación a pedido</small></div>`
          : `<div class="pdp-quote-flag"><span class="badge">A presupuesto</span><span class="muted" style="font-size:.85rem">Cotizamos tu configuración dentro de las 48 hs</span></div>`}

        <div class="pdp-block">
          <h2>Color — Serie ${esc(serie.nombre)}</h2>
          <div class="color-picker" id="colorPicker">${colorPickerHTML()}</div>
          <p class="pdp-note" id="colorNota">${esc(p.colorNota || '')} <a href="colores.html" class="text-link" style="font-size:.8rem">Ver biblioteca de colores</a></p>
        </div>

        ${variantesHTML()}

        <div class="pdp-block">
          <h2>Observaciones</h2>
          <div class="field" style="margin-bottom:0">
            <textarea id="pdpObs" placeholder="Medidas especiales, terminaciones, cortes para grifería o anafe, color a pedido…" aria-label="Observaciones para este producto"></textarea>
            <span class="hint">Todo se fabrica a pedido: contanos lo que necesitás y lo cotizamos.</span>
          </div>
        </div>

        <div class="pdp-block">
          <div class="qty-row">
            <div class="qty-stepper" aria-label="Cantidad">
              <button type="button" id="qtyMinus" aria-label="Restar uno">−</button>
              <input type="text" id="qtyInput" value="1" inputmode="numeric" aria-label="Cantidad">
              <button type="button" id="qtyPlus" aria-label="Sumar uno">+</button>
            </div>
            <button class="btn btn--primary btn--lg" id="addToQuote" style="flex:1">
              Agregar al presupuesto
            </button>
          </div>
          <div class="qty-row mt-2">
            ${p.plano ? `<button class="btn btn--ghost btn--sm" id="verPlano">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M9 15h6M9 18h4"/></svg>
              Plano técnico (PDF)</button>` : ''}
            <a class="btn btn--wa btn--sm" href="https://wa.me/${TRESOL.contacto.whatsapp}?text=${encodeURIComponent('¡Hola Tresol! Quiero consultar por: ' + p.nombre + ' (' + p.codigo + ')')}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
          </div>
        </div>

        <div class="pdp-block">
          <ul class="trust-list">
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg> Garantía: ${esc(p.garantia || GARANTIA_DEF)}</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg> Fabricación a pedido en San Francisco, Córdoba — envíos a todo el país</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg> Reparable: rayas y roturas se restauran por elaboradores certificados</li>
            <li style="color:var(--text-3)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/></svg> No incluye: ${esc(p.noIncluye || '')}</li>
          </ul>
        </div>

        <div class="pdp-block">
          <h2>Especificaciones técnicas</h2>
          <div class="table-wrap">
            <table class="spec-table">
              ${specsRows().map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}
            </table>
          </div>
        </div>
      </div>`;

    bindEvents();
  }

  const GARANTIA_DEF = '48 hs de recibido el producto';

  /* ---------- Eventos ---------- */
  function bindEvents() {
    // Color
    document.querySelectorAll('#colorPicker .color-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        state.colorId = btn.dataset.color;
        refreshVisuals();
        document.querySelectorAll('#colorPicker .color-opt').forEach(b => {
          const sel = b.dataset.color === state.colorId;
          b.classList.toggle('is-selected', sel);
          b.setAttribute('aria-pressed', sel);
        });
        const pc = p.colores.find(c => c.id === state.colorId);
        if (pc?.modo === 'pedido') showToast(`${TRESOL.getColor(state.colorId).nombre}: color a pedido — se cotiza con la solicitud.`, false);
      });
    });

    // Vistas
    document.querySelectorAll('.pdp-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        vistaActiva = btn.dataset.vista;
        document.getElementById('pdpMainImg').innerHTML = productVisual(p, state.colorId, vistaActiva);
        document.querySelectorAll('.pdp-thumb').forEach(b => b.classList.toggle('is-active', b.dataset.vista === vistaActiva));
      });
    });

    // Variantes
    const upd = () => {
      const el = document.getElementById('pdpPrice');
      if (el) el.innerHTML = TRESOL.fmtPrecio(precioActual()) + '<small>IVA incluido · fabricación a pedido</small>';
    };
    document.getElementById('vAncho')?.addEventListener('change', e => { state.ancho = +e.target.value; upd(); });
    document.getElementById('vLargo')?.addEventListener('change', e => { state.largo = +e.target.value; upd(); });
    document.getElementById('vAlto')?.addEventListener('change', e => { state.alto = +e.target.value; upd(); });
    document.getElementById('vMedida')?.addEventListener('change', e => { state.medidaIdx = +e.target.value; upd(); });
    document.getElementById('vEspesor')?.addEventListener('change', e => { state.espesor = +e.target.value; });

    // Cantidad
    const qtyInput = document.getElementById('qtyInput');
    const setQty = q => { state.qty = Math.max(1, Math.min(99, q)); qtyInput.value = state.qty; };
    document.getElementById('qtyMinus').addEventListener('click', () => setQty(state.qty - 1));
    document.getElementById('qtyPlus').addEventListener('click', () => setQty(state.qty + 1));
    qtyInput.addEventListener('change', () => setQty(parseInt(qtyInput.value, 10) || 1));

    // Plano técnico
    document.getElementById('verPlano')?.addEventListener('click', () => {
      openModal(`Plano técnico — ${p.codigo}`, `
        <div style="border-radius:12px; overflow:hidden; border:1px solid var(--line-strong); margin-bottom:1rem;">${planoSVG(p)}</div>
        <p class="muted" style="font-size:.85rem">Dibujo de referencia generado a partir de las medidas del modelo. En el sitio en producción este botón descarga el plano técnico oficial en PDF (${esc(p.codigo)}.pdf) cargado desde el panel de gestión.</p>`);
    });

    // Agregar al presupuesto
    document.getElementById('addToQuote').addEventListener('click', () => {
      TresolCart.add({
        pid: p.id,
        colorId: state.colorId,
        variante: varianteDesc(),
        precioUnit: precioActual(),
        qty: state.qty,
        obs: document.getElementById('pdpObs').value.trim()
      });
      showToast(`${p.nombre} agregado a tu presupuesto (×${state.qty}).`);
    });
  }

  function refreshVisuals() {
    document.getElementById('pdpMainImg').innerHTML = productVisual(p, state.colorId, vistaActiva);
    document.querySelectorAll('.pdp-thumb').forEach(b => { b.innerHTML = productVisual(p, state.colorId, b.dataset.vista); });
    const color = TRESOL.getColor(state.colorId);
    const note = document.querySelector('.pdp-gallery .pdp-note');
    if (note) note.innerHTML = `* Visualización ilustrativa del producto en color ${esc(color.nombre)} — las fotografías reales se cargan desde el panel de gestión.`;
  }

  /* ---------- Relacionados: misma categoría o mismo color estándar ---------- */
  function renderRelated() {
    const stdColors = p.colores.filter(c => c.modo === 'estandar').map(c => c.id);
    const related = TRESOL.productos
      .filter(x => x.id !== p.id)
      .map(x => {
        let score = 0;
        if (x.categoria === p.categoria) score += 2;
        if (x.sub && x.sub === p.sub) score += 2;
        const shared = (x.colores || []).filter(c => c.modo === 'estandar' && stdColors.includes(c.id)).length;
        score += Math.min(shared, 2) * .5;
        if (x.destacado) score += .5;
        // cross-sell entre categorías complementarias
        const combos = { piletas: ['mesadas', 'bases-ducha'], mesadas: ['piletas', 'bases-ducha'], 'bases-ducha': ['piletas', 'mesadas'] };
        if ((combos[p.categoria] || []).includes(x.categoria)) score += 1.5;
        return { x, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4).map(r => r.x);
    if (related.length) {
      document.getElementById('relatedSection').hidden = false;
      document.getElementById('relatedGrid').innerHTML = related.map(productCardHTML).join('');
    }
  }

  document.addEventListener('DOMContentLoaded', () => { render(); renderRelated(); });
})();
