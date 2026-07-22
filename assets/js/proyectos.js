/* ============================================================
   TRESOL — proyectos.js
   Galería de proyectos filtrable por sector, con detalle modal.
   ============================================================ */

(() => {
  const params = new URLSearchParams(location.search);
  let sectorActivo = params.get('sector') || null;

  function renderChips() {
    const box = document.getElementById('sectorChips');
    const count = id => TRESOL.proyectos.filter(p => p.sector === id).length;
    box.innerHTML = [
      `<button class="chip ${!sectorActivo ? 'is-active' : ''}" data-sector="">Todos <span class="chip-count">(${TRESOL.proyectos.length})</span></button>`,
      ...TRESOL.sectores.map(s =>
        `<button class="chip ${sectorActivo === s.id ? 'is-active' : ''}" data-sector="${s.id}">${esc(s.nombre)} <span class="chip-count">(${count(s.id)})</span></button>`)
    ].join('');
    box.querySelectorAll('.chip').forEach(ch => ch.addEventListener('click', () => {
      sectorActivo = ch.dataset.sector || null;
      const p = new URLSearchParams();
      if (sectorActivo) p.set('sector', sectorActivo);
      // try/catch: replaceState puede fallar al navegar desde file://
      try {
        history.replaceState(null, '', 'proyectos.html' + (p.toString() ? '?' + p.toString() : ''));
      } catch (e) { /* prototipo local: se ignora */ }
      renderChips(); renderGrid();
    }));
  }

  function renderGrid() {
    const list = sectorActivo ? TRESOL.proyectos.filter(p => p.sector === sectorActivo) : TRESOL.proyectos;
    const grid = document.getElementById('projGrid');
    document.getElementById('projEmpty').hidden = list.length > 0;
    grid.innerHTML = list.map(p => {
      const sector = TRESOL.sectores.find(s => s.id === p.sector);
      return `<button type="button" class="card proj-card" data-proj="${p.id}">
        <div class="proj-visual">
          <span class="badge proj-sector">${esc(sector?.nombre || '')}</span>
          ${projectVisual(p)}
        </div>
        <div class="proj-body">
          <h3>${esc(p.titulo)}</h3>
          <p>${esc(p.resumen)}</p>
          <div class="proj-tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        </div>
      </button>`;
    }).join('');

    grid.querySelectorAll('[data-proj]').forEach(card => {
      card.addEventListener('click', () => openProyecto(card.dataset.proj));
    });
  }

  function openProyecto(id) {
    const p = TRESOL.proyectos.find(x => x.id === id);
    const sector = TRESOL.sectores.find(s => s.id === p.sector);
    // "Galería": tres composiciones variadas del mismo proyecto
    const gal = [projectVisual(p), projectVisual({ ...p, color: p.color }), projectVisual(p)];
    openModal(p.titulo, `
      <span class="badge mb-2" style="margin-bottom:1rem; display:inline-flex;">${esc(sector?.nombre || '')}</span>
      <div style="display:grid; grid-template-columns:2fr 1fr; gap:.6rem; margin:1rem 0 1.2rem;">
        <div style="border-radius:12px; overflow:hidden; border:1px solid var(--line); grid-row:span 2;">${gal[0]}</div>
        <div style="border-radius:12px; overflow:hidden; border:1px solid var(--line);">${gal[1]}</div>
        <div style="border-radius:12px; overflow:hidden; border:1px solid var(--line);">${gal[2]}</div>
      </div>
      <p style="margin-bottom:1rem;">${esc(p.desc)}</p>
      <div class="proj-tags" style="display:flex; gap:.4rem; flex-wrap:wrap; margin-bottom:1.4rem;">
        ${p.tags.map(t => `<span style="font-size:.72rem; padding:.25rem .65rem; border-radius:999px; background:var(--hover-tint); border:1px solid var(--line); color:var(--text-3);">${esc(t)}</span>`).join('')}
      </div>
      <p class="muted" style="font-size:.78rem; margin-bottom:1.2rem;">* Imágenes ilustrativas — las fotografías reales del proyecto se administran desde el panel de gestión.</p>
      <div style="display:flex; gap:.7rem; flex-wrap:wrap;">
        <a class="btn btn--primary btn--sm" href="contacto.html">Cotizar un proyecto similar</a>
        <a class="btn btn--ghost btn--sm" href="catalogo.html">Ver productos</a>
      </div>
    `);
  }

  document.addEventListener('DOMContentLoaded', () => { renderChips(); renderGrid(); });
})();
