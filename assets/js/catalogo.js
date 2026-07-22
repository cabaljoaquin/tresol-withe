/* ============================================================
   TRESOL — catalogo.js
   Navegación en embudo: Categoría → Subcategoría → Filtros.
   Filtros combinables por atributo (patrón Johnson Acero).
   ============================================================ */

(() => {
  const params = new URLSearchParams(location.search);

  const state = {
    cat: params.get('cat') || null,
    sub: params.get('sub') || null,
    precio: [],        // ['online','presupuesto']
    instalacion: [],
    forma: [],
    colores: [],
    desague: false,
    desde: null,
    hasta: null,
    sort: 'relevancia'
  };

  /* Rango de largo (mm) de un producto, para filtro desde/hasta */
  function rangoLargo(p) {
    if (p.tipo === 'base') return [Math.min(...p.variantes.largos), Math.max(...p.variantes.largos)];
    if (p.tipo === 'tapa') {
      const nums = p.medidasOpciones.map(m => parseInt(m.label.replace(/[^\d]/g, ' ').trim().split(/\s+/)[0], 10));
      return [Math.min(...nums), Math.max(...nums)];
    }
    if (p.tipo === 'mesada') return [600, 2400];
    if (p.tipo === 'placa') return [3660, 3660];
    if (p.largo == null) return [0, 99999]; // a medida: siempre pasa
    return [p.largo, p.largo];
  }

  function baseSet() {
    let list = TRESOL.productos;
    if (state.cat) list = list.filter(p => p.categoria === state.cat);
    if (state.sub) list = list.filter(p => p.sub === state.sub);
    return list;
  }

  function applyFilters(list) {
    return list.filter(p => {
      if (state.precio.length === 1) {
        if (state.precio[0] === 'online' && !p.muestraPrecio) return false;
        if (state.precio[0] === 'presupuesto' && p.muestraPrecio) return false;
      }
      if (state.instalacion.length && !state.instalacion.includes(p.instalacion)) return false;
      if (state.forma.length && !state.forma.includes(p.forma)) return false;
      if (state.colores.length) {
        const std = (p.colores || []).filter(c => c.modo === 'estandar').map(c => c.id);
        if (!state.colores.some(c => std.includes(c))) return false;
      }
      if (state.desague && !p.incluyeDesague) return false;
      const [lo, hi] = rangoLargo(p);
      if (state.desde != null && hi < state.desde) return false;
      if (state.hasta != null && lo > state.hasta) return false;
      return true;
    });
  }

  function sortList(list) {
    const l = [...list];
    const desde = p => TRESOL.precioDesde(p) ?? Infinity;
    if (state.sort === 'precio-asc') l.sort((a, b) => desde(a) - desde(b));
    else if (state.sort === 'precio-desc') l.sort((a, b) => (TRESOL.precioDesde(b) ?? 0) - (TRESOL.precioDesde(a) ?? 0));
    else if (state.sort === 'nombre') l.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    else l.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
    return l;
  }

  /* ---------- Chips de categoría ---------- */
  function renderCatChips() {
    const total = TRESOL.productos.length;
    const chips = [
      `<button class="chip ${!state.cat ? 'is-active' : ''}" data-cat="">Todos <span class="chip-count">(${total})</span></button>`,
      ...TRESOL.categorias.map(c => {
        const n = TRESOL.productosDe(c.id).length;
        return `<button class="chip ${state.cat === c.id ? 'is-active' : ''}" data-cat="${c.id}">${esc(c.nombre)} <span class="chip-count">(${n})</span></button>`;
      })
    ];
    document.getElementById('catChips').innerHTML = chips.join('');
    document.querySelectorAll('#catChips .chip').forEach(ch => ch.addEventListener('click', () => {
      state.cat = ch.dataset.cat || null;
      state.sub = null;
      resetFilters(false);
      syncUrl(); renderAll();
    }));
  }

  /* ---------- Tabs de subcategoría ---------- */
  function renderSubTabs() {
    const box = document.getElementById('subTabs');
    const cat = TRESOL.categorias.find(c => c.id === state.cat);
    if (!cat || !cat.sub.length) { box.innerHTML = ''; return; }
    box.innerHTML = [
      `<button class="chip ${!state.sub ? 'is-active' : ''}" data-sub="">Todas</button>`,
      ...cat.sub.map(s => {
        const n = TRESOL.productosDe(cat.id, s.id).length;
        return `<button class="chip ${state.sub === s.id ? 'is-active' : ''}" data-sub="${s.id}">${esc(s.nombre)} <span class="chip-count">(${n})</span></button>`;
      })
    ].join('');
    box.querySelectorAll('.chip').forEach(ch => ch.addEventListener('click', () => {
      state.sub = ch.dataset.sub || null;
      syncUrl(); renderAll();
    }));
  }

  /* ---------- Filtros dinámicos ---------- */
  function countBy(list, fn) {
    const m = new Map();
    list.forEach(p => { const k = fn(p); if (k) m.set(k, (m.get(k) || 0) + 1); });
    return m;
  }

  function renderFilters() {
    const list = baseSet();
    const body = document.getElementById('filtersBody');
    let html = '';

    // Modalidad de precio
    const nOnline = list.filter(p => p.muestraPrecio).length;
    const nPres = list.length - nOnline;
    html += `<div class="filter-group"><h3>Modalidad</h3>
      ${filterOpt('precio', 'online', 'Con precio online', nOnline)}
      ${filterOpt('precio', 'presupuesto', 'A presupuesto', nPres)}
    </div>`;

    // Instalación
    const inst = countBy(list, p => p.instalacion);
    if (inst.size > 1) {
      html += `<div class="filter-group"><h3>Tipo de instalación</h3>
        ${[...inst.entries()].map(([k, n]) => filterOpt('instalacion', k, TRESOL.INSTALACIONES[k] || k, n)).join('')}
      </div>`;
    }

    // Forma
    const formas = countBy(list, p => p.forma);
    if (formas.size > 1) {
      html += `<div class="filter-group"><h3>Forma</h3>
        ${[...formas.entries()].map(([k, n]) => filterOpt('forma', k, TRESOL.FORMAS[k] || k, n)).join('')}
      </div>`;
    }

    // Medida desde/hasta
    html += `<div class="filter-group"><h3>Largo (mm) — desde / hasta</h3>
      <div class="range-row">
        <input type="number" id="fDesde" min="0" step="50" placeholder="Desde" value="${state.desde ?? ''}" aria-label="Largo desde (mm)">
        <span>—</span>
        <input type="number" id="fHasta" min="0" step="50" placeholder="Hasta" value="${state.hasta ?? ''}" aria-label="Largo hasta (mm)">
      </div>
      <p class="pdp-note">Todo se fabrica a medida: si tu medida no aparece, igual la cotizamos.</p>
    </div>`;

    // Colores estándar
    const colorCount = new Map();
    list.forEach(p => (p.colores || []).filter(c => c.modo === 'estandar').forEach(c => colorCount.set(c.id, (colorCount.get(c.id) || 0) + 1)));
    if (colorCount.size > 1) {
      html += `<div class="filter-group"><h3>Color estándar</h3>
        ${[...colorCount.entries()].map(([k, n]) => {
          const col = TRESOL.getColor(k);
          return `<label class="filter-opt">
            <input type="checkbox" data-f="colores" value="${k}" ${state.colores.includes(k) ? 'checked' : ''}>
            <span class="dot" style="width:15px;height:15px;border-radius:50%;display:inline-block;background:${col.css};border:1px solid var(--line-input)"></span>
            ${esc(col.nombre)} <span class="f-count">${n}</span>
          </label>`;
        }).join('')}
      </div>`;
    }

    // Desagüe (solo si aplica)
    if (list.some(p => p.incluyeDesague)) {
      html += `<div class="filter-group"><h3>Extras</h3>
        <label class="filter-opt"><input type="checkbox" id="fDesague" ${state.desague ? 'checked' : ''}> Incluye desagüe</label>
      </div>`;
    }

    body.innerHTML = html;

    body.querySelectorAll('input[type="checkbox"][data-f]').forEach(cb => {
      cb.addEventListener('change', () => {
        const arr = state[cb.dataset.f];
        if (cb.checked) arr.push(cb.value);
        else arr.splice(arr.indexOf(cb.value), 1);
        renderGrid();
      });
    });
    document.getElementById('fDesague')?.addEventListener('change', e => { state.desague = e.target.checked; renderGrid(); });
    ['fDesde', 'fHasta'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', e => {
        const v = e.target.value === '' ? null : parseInt(e.target.value, 10);
        if (id === 'fDesde') state.desde = v; else state.hasta = v;
        renderGrid();
      });
    });
  }

  function filterOpt(field, value, label, count) {
    return `<label class="filter-opt">
      <input type="checkbox" data-f="${field}" value="${value}" ${state[field].includes(value) ? 'checked' : ''}>
      ${esc(label)} <span class="f-count">${count}</span>
    </label>`;
  }

  function resetFilters(rerender = true) {
    state.precio = []; state.instalacion = []; state.forma = []; state.colores = [];
    state.desague = false; state.desde = null; state.hasta = null;
    if (rerender) renderAll();
  }

  /* ---------- Grid ---------- */
  function renderGrid() {
    const list = sortList(applyFilters(baseSet()));
    const grid = document.getElementById('prodGrid');
    const empty = document.getElementById('emptyState');
    grid.innerHTML = list.map(productCardHTML).join('');
    empty.hidden = list.length > 0;
    const cat = TRESOL.categorias.find(c => c.id === state.cat);
    const sub = cat?.sub.find(s => s.id === state.sub);
    document.getElementById('catCount').innerHTML =
      `<strong>${list.length}</strong> producto${list.length !== 1 ? 's' : ''}${cat ? ' en <strong>' + esc(cat.nombre) + (sub ? ' · ' + esc(sub.nombre) : '') + '</strong>' : ''}`;
  }

  function renderHead() {
    const cat = TRESOL.categorias.find(c => c.id === state.cat);
    document.getElementById('catTitle').textContent = cat ? cat.nombre : 'Todos los productos';
    document.getElementById('catDesc').textContent = cat
      ? cat.desc
      : 'Todo se fabrica a pedido en superficie sólida Tresol®. Elegí una categoría, afiná con filtros y agregá a tu solicitud de presupuesto.';
    document.title = (cat ? cat.nombre + ' — ' : 'Catálogo — ') + 'TRESOL® Superficie Sólida';
  }

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.cat) p.set('cat', state.cat);
    if (state.sub) p.set('sub', state.sub);
    // try/catch: replaceState puede fallar al navegar desde file://
    try {
      history.replaceState(null, '', 'catalogo.html' + (p.toString() ? '?' + p.toString() : ''));
    } catch (e) { /* prototipo local: se ignora */ }
  }

  function renderAll() {
    renderHead();
    renderCatChips();
    renderSubTabs();
    renderFilters();
    renderGrid();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    document.getElementById('sortSelect').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
    document.getElementById('clearFilters').addEventListener('click', () => resetFilters());
    const ft = document.getElementById('filtersToggle');
    const panel = document.getElementById('filtersPanel');
    ft.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open');
      ft.setAttribute('aria-expanded', open);
    });

    /* Por encima del umbral el panel se muestra siempre por CSS (styles.css:678-681)
       y el botón desaparece: is-open y aria-expanded quedaban stale y volvían a
       aplicarse al achicar la ventana. Umbral del layout de catálogo, no el del nav. */
    matchMedia('(min-width: 1024px)').addEventListener('change', e => {
      if (!e.matches) return;
      panel.classList.remove('is-open');
      ft.setAttribute('aria-expanded', 'false');
    });
  });
})();
