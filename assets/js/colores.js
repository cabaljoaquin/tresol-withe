/* ============================================================
   TRESOL — colores.js
   Biblioteca de colores: series agrupadas por grupo de precio,
   detalle de cada color con productos disponibles.
   ============================================================ */

(() => {
  function productosConColor(colorId) {
    return TRESOL.productos.filter(p =>
      (p.colores || []).some(c => c.id === colorId && c.modo === 'estandar'));
  }
  function productosAPedido(colorId) {
    return TRESOL.productos.filter(p =>
      (p.colores || []).some(c => c.id === colorId && c.modo === 'pedido'));
  }

  function render() {
    const root = document.getElementById('coloresRoot');
    root.innerHTML = TRESOL.grupos.map(g => {
      const seriesDelGrupo = TRESOL.series.filter(s => s.grupo === g.id);
      return `
      <div class="grupo-band reveal">
        <h2>${esc(g.nombre)}</h2>
        <p class="muted">${esc(g.desc)}</p>
      </div>
      ${seriesDelGrupo.map(s => {
        const cols = TRESOL.coloresDeSerie(s.id);
        return `
        <div class="serie-block reveal" id="serie-${s.id}">
          <div class="serie-head">
            <h3>Serie ${esc(s.nombre)} <span class="muted" style="font-size:.8rem">· ${cols.length} colores</span></h3>
            ${s.nota ? `<span class="badge badge--neutral">${esc(s.nota)}</span>` : ''}
          </div>
          <p style="font-size:.9rem; max-width:70ch; margin-bottom:1.2rem;">${esc(s.desc)}</p>
          <div class="swatch-grid">
            ${cols.map(c => `
              <button type="button" class="swatch" data-color="${c.id}" aria-label="Ver detalle del color ${esc(c.nombre)}">
                <span class="swatch-chip ${c.textura ? 'is-texture' : ''}" style="background:${c.css}"></span>
                <span class="swatch-name">${esc(c.nombre)}</span>
              </button>`).join('')}
          </div>
        </div>`;
      }).join('')}`;
    }).join('');

    // Detalle de color en modal
    root.querySelectorAll('.swatch[data-color]').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = TRESOL.getColor(btn.dataset.color);
        const s = TRESOL.getSerie(c.serie);
        const g = TRESOL.grupos.find(x => x.id === s.grupo);
        const std = productosConColor(c.id);
        const ped = productosAPedido(c.id);
        openModal(c.nombre, `
          <div style="height:150px; border-radius:14px; background:${c.css}; border:1px solid var(--line-strong); box-shadow: inset 0 2px 12px rgba(0,0,0,.15); margin-bottom:1.2rem;"></div>
          <div class="table-wrap mb-2">
            <table class="spec-table">
              <tr><th scope="row">Serie</th><td>Serie ${esc(s.nombre)}</td></tr>
              <tr><th scope="row">Grupo de precio</th><td>${esc(g.nombre)}</td></tr>
              ${s.nota ? `<tr><th scope="row">Nota</th><td>${esc(s.nota)}</td></tr>` : ''}
              <tr><th scope="row">Disponible estándar en</th><td>${std.length ? std.length + ' producto' + (std.length !== 1 ? 's' : '') : 'A pedido en toda la línea'}</td></tr>
            </table>
          </div>
          ${std.length ? `
            <h3 style="font-size:.85rem; letter-spacing:.12em; text-transform:uppercase; color:var(--text-3); margin-bottom:.7rem;">Productos en este color</h3>
            <div style="display:grid; gap:.5rem;">
              ${std.slice(0, 6).map(p => `
                <a class="search-result" href="producto.html?id=${p.id}">
                  <span class="sr-dot" style="background:${c.css}"></span>
                  <span><strong>${esc(p.nombre)}</strong><span>${esc(p.codigo)}</span></span>
                  <span class="sr-price">${TRESOL.precioDesde(p) ? 'desde ' + TRESOL.fmtPrecio(TRESOL.precioDesde(p)) : 'A presupuesto'}</span>
                </a>`).join('')}
            </div>` : ''}
          ${ped.length && !std.length ? `<p class="muted" style="font-size:.86rem">Este color se fabrica a pedido en ${ped.length} producto${ped.length !== 1 ? 's' : ''} — indicalo en las observaciones al presupuestar.</p>` : ''}
          ${ped.length && std.length ? `<p class="muted mt-2" style="font-size:.82rem">Además, disponible a pedido en ${ped.length} producto${ped.length !== 1 ? 's' : ''} más.</p>` : ''}
        `);
      });
    });

    // Carta de colores PDF
    document.getElementById('descargarCarta').addEventListener('click', () => {
      openModal('Carta de colores Tresol®', `
        <p style="margin-bottom:1rem;">En el sitio en producción este botón descarga la <strong>Colección de Colores Tresol</strong> en PDF, administrada desde el panel de gestión (hoy el archivo vive en Google Drive — se migra a hosting propio).</p>
        <div class="swatch-grid" style="grid-template-columns:repeat(auto-fill,minmax(78px,1fr));">
          ${TRESOL.colores.slice(0, 18).map(c => `
            <span class="swatch"><span class="swatch-chip ${c.textura ? 'is-texture' : ''}" style="background:${c.css}"></span>
            <span class="swatch-name" style="font-size:.68rem">${esc(c.nombre)}</span></span>`).join('')}
        </div>`);
    });

    // Reveal
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => io.observe(el));

    // Scroll a ancla si viene con hash (#serie-xxx)
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  }

  document.addEventListener('DOMContentLoaded', render);
})();
