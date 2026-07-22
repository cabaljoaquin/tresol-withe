/* ============================================================
   TRESOL — main.js
   Header/footer compartidos, mega-menú, carrito de presupuesto,
   buscador con sinónimos, visuales SVG y utilidades.
   Requiere data.js cargado antes.
   ============================================================ */

/* ---------- Utilidades ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

function shade(hex, amt) {
  // amt: -1 (negro) a 1 (blanco)
  const n = hex.replace('#', '');
  const num = parseInt(n.length === 3 ? n.split('').map(c => c + c).join('') : n, 16);
  let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const isLight = hex => {
  const n = hex.replace('#', '');
  const num = parseInt(n, 16);
  const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
};

/* ============================================================
   VISUALES SVG — representaciones estilizadas del producto.
   (En producción se reemplazan por fotografía real; ver README.)

   Paleta: se lee de los tokens CSS para que styles.css siga siendo la única
   fuente de verdad del tema. Memoizada (el catálogo genera decenas de escenas)
   y con fallbacks por si un visual se generara antes de que resuelva la hoja
   de estilo. planoSVG() ya estaba en paleta clara y es el patrón de destino.
   ============================================================ */
let __svgUid = 0;

let __pal = null;
function pal() {
  if (__pal) return __pal;
  const cs = getComputedStyle(document.documentElement);
  const t = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  return (__pal = {
    scene: t('--bg-2', '#F7F7F5'),      // fondo de escena, arriba
    scene2: t('--bg-3', '#F1F1EF'),     // fondo de escena, abajo
    ink: t('--text', '#14213F'),
    navy: t('--navy', '#142142'),
    accent: t('--accent', '#C9A26B'),
    metal: '#8A8F99',                   // grifería: objeto, no token de tema
    wall: '#E4E3DF',                    // pared/mueble de fondo
    wallDeep: '#D6D5D0',
    floor: '#EAE9E5'
  });
}

/* Contorno del producto. Adaptativo como speckles(): sobre escena clara un
   producto claro necesita línea oscura, y uno oscuro sigue leyendo mejor con
   el reflejo claro que ya tenía. */
const edgeStroke = (hex, strong = false) =>
  isLight(hex)
    ? `rgba(20,33,66,${strong ? .38 : .26})`
    : `rgba(255,255,255,${strong ? .42 : .26})`;

function speckles(hex, n, seedOffset = 0) {
  // Partículas deterministas (sin Math.random para consistencia)
  let out = '';
  const light = isLight(hex);
  for (let i = 0; i < n; i++) {
    const x = ((i * 73 + seedOffset * 31) % 340) + 30;
    const y = ((i * 47 + seedOffset * 17) % 220) + 40;
    const r = 0.8 + (i % 3) * 0.5;
    const o = 0.15 + (i % 4) * 0.08;
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${light ? '#5A5A64' : '#FFFFFF'}" opacity="${o}"/>`;
  }
  return out;
}

function svgWrap(inner, defs = '') {
  return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">${defs}${inner}</svg>`;
}

function sceneDefs(uid, hex) {
  const lite = shade(hex, .22), dark = shade(hex, -.18), darker = shade(hex, -.38);
  return `<defs>
    <linearGradient id="bg${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${pal().scene}"/><stop offset="1" stop-color="${pal().scene2}"/>
    </linearGradient>
    <radialGradient id="glow${uid}" cx=".72" cy=".2" r=".9">
      <stop offset="0" stop-color="rgba(201,162,107,.10)"/><stop offset=".6" stop-color="rgba(201,162,107,0)"/>
    </radialGradient>
    <linearGradient id="surf${uid}" x1="0" y1="0" x2=".8" y2="1">
      <stop offset="0" stop-color="${lite}"/><stop offset=".5" stop-color="${hex}"/><stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <radialGradient id="cav${uid}" cx=".5" cy=".42" r=".75">
      <stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${darker}"/>
    </radialGradient>
    <linearGradient id="edge${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${darker}"/>
    </linearGradient>
  </defs>`;
}

function sceneBg(uid) {
  return `<rect width="400" height="300" fill="url(#bg${uid})"/><rect width="400" height="300" fill="url(#glow${uid})"/>
  <ellipse cx="200" cy="262" rx="150" ry="16" fill="${pal().navy}" opacity=".10"/>`;
}

function basinShape(p, uid, hex, cx = 200, cy = 160, scale = 1) {
  const color = TRESOL.getColor ? null : null;
  const spk = (TRESOL.colores.find(c => c.hex === hex) || {}).textura ? speckles(hex, 14, __svgUid) : '';
  // El desagüe es un hueco: se mantiene oscuro (deriva de --text) en cualquier tema.
  const drain = (dx, dy) => `<circle cx="${dx}" cy="${dy}" r="9" fill="url(#edge${uid})"/><circle cx="${dx}" cy="${dy}" r="5.5" fill="${pal().ink}"/><circle cx="${dx - 1.5}" cy="${dy - 1.5}" r="1.2" fill="rgba(255,255,255,.45)"/>`;
  let s = '';
  const w = 250 * scale, h = 170 * scale;
  if (p.doble) {
    s = `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="20" fill="url(#surf${uid})"/>
    <rect x="${cx - w / 2 + 14}" y="${cy - h / 2 + 14}" width="${w / 2 - 22}" height="${h - 28}" rx="13" fill="url(#cav${uid})"/>
    <rect x="${cx + 8}" y="${cy - h / 2 + 14}" width="${w / 2 - 22}" height="${h - 28}" rx="13" fill="url(#cav${uid})"/>
    ${drain(cx - w / 4 + 2, cy + h / 4)}${drain(cx + w / 4 + 2, cy + h / 4)}`;
  } else if (p.forma === 'redonda') {
    const r = 95 * scale;
    s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#surf${uid})"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 15}" fill="url(#cav${uid})"/>
    ${drain(cx, cy + r * .35)}`;
  } else if (p.forma === 'oval') {
    s = `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" fill="url(#surf${uid})"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${w / 2 - 16}" ry="${h / 2 - 15}" fill="url(#cav${uid})"/>
    ${drain(cx, cy + h * .26)}`;
  } else {
    const rx = p.forma === 'cuadrada' ? 26 : 20;
    const ww = p.forma === 'cuadrada' ? h : w;
    s = `<rect x="${cx - ww / 2}" y="${cy - h / 2}" width="${ww}" height="${h}" rx="${rx}" fill="url(#surf${uid})"/>
    <rect x="${cx - ww / 2 + 15}" y="${cy - h / 2 + 14}" width="${ww - 30}" height="${h - 28}" rx="${rx - 8}" fill="url(#cav${uid})"/>
    ${drain(cx, cy + h * .27)}`;
  }
  return s + spk;
}

function productVisual(p, colorId, view = 'main') {
  const uid = ++__svgUid;
  const color = TRESOL.getColor(colorId) || TRESOL.getColor('blanco');
  const hex = color.hex;
  const defs = sceneDefs(uid, hex);
  const spk = color.textura ? speckles(hex, 16, uid) : '';
  let body = '';

  if (p.tipo === 'pileta') {
    if (view === 'detail') {
      body = `<rect width="400" height="300" fill="url(#surf${uid})"/>${spk}
      <circle cx="200" cy="150" r="64" fill="url(#cav${uid})"/>
      <circle cx="200" cy="150" r="34" fill="url(#edge${uid})"/>
      <circle cx="200" cy="150" r="22" fill="${pal().ink}"/>
      <path d="M186 136 a20 20 0 0 1 22 -4" stroke="${edgeStroke(hex, true)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    } else if (view === 'ambiente') {
      body = `${sceneBg(uid)}
      <rect x="0" y="196" width="400" height="104" fill="${pal().wallDeep}"/>
      <rect x="20" y="176" width="360" height="26" rx="6" fill="url(#surf${uid})"/>${spk}
      <rect x="20" y="170" width="360" height="8" rx="4" fill="${shade(hex, .3)}" opacity=".8"/>
      <ellipse cx="200" cy="189" rx="82" ry="9" fill="url(#cav${uid})"/>
      <rect x="188" y="120" width="7" height="52" rx="3.5" fill="${pal().metal}"/>
      <path d="M191 120 h30 a8 8 0 0 1 8 8 v6" stroke="${pal().metal}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    } else {
      body = `${sceneBg(uid)}${basinShape(p, uid, hex, 200, 152, view === 'top' ? 1 : .92)}`;
    }
  }
  else if (p.tipo === 'base') {
    if (view === 'detail') {
      body = `<rect width="400" height="300" fill="url(#surf${uid})"/>${spk}
      ${Array.from({ length: 7 }, (_, i) => `<rect x="${60 + i * 42}" y="60" width="5" height="180" rx="2.5" fill="${shade(hex, -.22)}" opacity=".7"/>`).join('')}
      <rect x="290" y="118" width="64" height="64" rx="8" fill="url(#edge${uid})"/>
      <rect x="298" y="126" width="48" height="48" rx="5" fill="${pal().ink}"/>
      ${Array.from({ length: 4 }, (_, i) => `<rect x="${302 + i * 11}" y="130" width="4" height="40" rx="2" fill="${pal().metal}"/>`).join('')}`;
    } else if (view === 'ambiente') {
      body = `${sceneBg(uid)}
      <rect x="40" y="30" width="320" height="180" rx="4" fill="${pal().wall}"/>
      <rect x="52" y="42" width="296" height="156" rx="3" fill="${pal().wallDeep}" opacity=".7"/>
      <rect x="60" y="212" width="280" height="34" rx="9" fill="url(#surf${uid})"/>${spk}
      <rect x="76" y="222" width="248" height="4" rx="2" fill="${shade(hex, -.25)}" opacity=".6"/>
      <circle cx="200" cy="70" r="13" fill="${pal().metal}"/><rect x="197" y="83" width="6" height="26" fill="${pal().metal}"/>`;
    } else {
      const marco = p.id === 'base-oxford' ? `<rect x="76" y="76" width="248" height="148" rx="12" fill="none" stroke="${shade(hex, -.25)}" stroke-width="4" opacity=".8"/>` : '';
      const texture = p.id === 'base-chelsea' ? Array.from({ length: 6 }, (_, i) => `<rect x="90" y="${92 + i * 20}" width="180" height="4" rx="2" fill="${shade(hex, -.2)}" opacity=".55"/>`).join('') : '';
      body = `${sceneBg(uid)}
      <rect x="62" y="62" width="276" height="176" rx="16" fill="url(#surf${uid})"/>${spk}${marco}${texture}
      <rect x="286" y="122" width="34" height="56" rx="7" fill="url(#edge${uid})"/>
      ${Array.from({ length: 4 }, (_, i) => `<rect x="${291 + i * 7}" y="128" width="3" height="44" rx="1.5" fill="${pal().ink}"/>`).join('')}`;
    }
  }
  else if (p.tipo === 'tapa') {
    const edge = shade(hex, -.25);
    if (p.forma === 'redonda') {
      body = `${sceneBg(uid)}
      <ellipse cx="200" cy="160" rx="128" ry="96" fill="${edge}"/>
      <ellipse cx="200" cy="150" rx="128" ry="96" fill="url(#surf${uid})"/>${spk}
      <ellipse cx="200" cy="150" rx="128" ry="96" fill="none" stroke="${edgeStroke(hex)}" stroke-width="1.4"/>
      <path d="M96 120 a 128 96 0 0 1 90 -60" stroke="${edgeStroke(hex, true)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    } else {
      const w = p.forma === 'cuadrada' ? 200 : 270, h = p.forma === 'cuadrada' ? 160 : 150;
      body = `${sceneBg(uid)}
      <rect x="${200 - w / 2}" y="${160 - h / 2 + 12}" width="${w}" height="${h}" rx="12" fill="${edge}"/>
      <rect x="${200 - w / 2}" y="${160 - h / 2}" width="${w}" height="${h}" rx="12" fill="url(#surf${uid})"/>${spk}
      <rect x="${200 - w / 2}" y="${160 - h / 2}" width="${w}" height="${h}" rx="12" fill="none" stroke="${edgeStroke(hex)}" stroke-width="1.4"/>`;
    }
  }
  else if (p.tipo === 'placa') {
    body = `${sceneBg(uid)}
    <g transform="translate(200 158)">
      <polygon points="-150,44 -66,-64 156,-64 72,44" fill="${shade(hex, -.32)}"/>
      <polygon points="-150,36 -66,-72 156,-72 72,36" fill="url(#surf${uid})"/>${color.textura ? `<g transform="translate(-160 -110)">${speckles(hex, 18, uid)}</g>` : ''}
      <polygon points="-150,36 -66,-72 156,-72 72,36" fill="none" stroke="${edgeStroke(hex)}" stroke-width="1.2"/>
      <polygon points="-150,36 72,36 72,44 -150,44" fill="${shade(hex, -.4)}"/>
      <polygon points="-64,-84 158,-84 152,-78 -62,-78" fill="${shade(hex, .1)}" opacity=".55"/>
    </g>`;
  }
  else if (p.tipo === 'mesada') {
    body = `${sceneBg(uid)}
    <rect x="30" y="96" width="340" height="12" rx="4" fill="${shade(hex, .15)}"/>
    <rect x="30" y="108" width="340" height="26" rx="5" fill="url(#surf${uid})"/>${spk}
    <rect x="30" y="70" width="340" height="8" rx="4" fill="${shade(hex, .05)}" opacity=".7"/>
    <ellipse cx="255" cy="121" rx="62" ry="8" fill="url(#cav${uid})"/>
    <rect x="30" y="134" width="340" height="110" fill="${pal().wallDeep}"/>
    <rect x="46" y="134" width="2" height="110" fill="${pal().wall}"/><rect x="352" y="134" width="2" height="110" fill="${pal().wall}"/>
    <rect x="120" y="60" width="6" height="52" rx="3" fill="${pal().metal}"/>
    <path d="M123 60 h26 a7 7 0 0 1 7 7 v8" stroke="${pal().metal}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
  return svgWrap(body, defs);
}

/* Visual abstracto para proyectos */
function projectVisual(proj) {
  const uid = ++__svgUid;
  const hex = proj.color || '#C9A26B';
  const defs = sceneDefs(uid, hex);
  return svgWrap(`${sceneBg(uid)}
    <rect x="0" y="210" width="400" height="90" fill="${pal().floor}"/>
    <rect x="28" y="150" width="344" height="62" rx="8" fill="url(#surf${uid})"/>
    <rect x="28" y="140" width="344" height="12" rx="6" fill="${shade(hex, .2)}"/>
    <rect x="48" y="52" width="120" height="70" rx="8" fill="${shade(hex, -.35)}" opacity=".55"/>
    <rect x="188" y="38" width="90" height="84" rx="8" fill="${shade(hex, -.2)}" opacity=".4"/>
    <rect x="296" y="66" width="70" height="56" rx="8" fill="${shade(hex, .1)}" opacity=".35"/>
    <ellipse cx="200" cy="216" rx="140" ry="8" fill="${pal().navy}" opacity=".12"/>`, defs);
}

/* Plano técnico (dibujo acotado) */
function planoSVG(p) {
  const L = p.largo || 600, A = p.ancho || 450;
  const maxW = 300, maxH = 170;
  const k = Math.min(maxW / L, maxH / A);
  const w = L * k, h = A * k, x = 200 - w / 2, y = 130 - h / 2;
  const ink = '#2B2C30', dim = '#8A6A38';
  const shape = p.forma === 'redonda'
    ? `<circle cx="200" cy="130" r="${w / 2}" fill="none" stroke="${ink}" stroke-width="2"/><circle cx="200" cy="130" r="${w / 2 - 12}" fill="none" stroke="${ink}" stroke-width="1" stroke-dasharray="4 3"/>`
    : p.forma === 'oval'
      ? `<ellipse cx="200" cy="130" rx="${w / 2}" ry="${h / 2}" fill="none" stroke="${ink}" stroke-width="2"/><ellipse cx="200" cy="130" rx="${w / 2 - 12}" ry="${h / 2 - 10}" fill="none" stroke="${ink}" stroke-width="1" stroke-dasharray="4 3"/>`
      : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="none" stroke="${ink}" stroke-width="2"/><rect x="${x + 12}" y="${y + 10}" width="${w - 24}" height="${h - 20}" rx="6" fill="none" stroke="${ink}" stroke-width="1" stroke-dasharray="4 3"/>`;
  const drain = `<circle cx="200" cy="${130 + h * .22}" r="6" fill="none" stroke="${ink}" stroke-width="1.4"/><line x1="194" y1="${130 + h * .22}" x2="206" y2="${130 + h * .22}" stroke="${ink}" stroke-width="1"/>`;
  return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Plano técnico ${esc(p.codigo)}">
  <rect width="400" height="300" fill="#F4F2ED"/>
  <rect x="10" y="10" width="380" height="280" fill="none" stroke="#C9C4B8" stroke-width="1.5"/>
  ${shape}${drain}
  <line x1="${x}" y1="${y - 22}" x2="${x + w}" y2="${y - 22}" stroke="${dim}" stroke-width="1"/>
  <line x1="${x}" y1="${y - 27}" x2="${x}" y2="${y - 17}" stroke="${dim}" stroke-width="1"/>
  <line x1="${x + w}" y1="${y - 27}" x2="${x + w}" y2="${y - 17}" stroke="${dim}" stroke-width="1"/>
  <text x="200" y="${y - 29}" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="${dim}">${p.forma === 'redonda' ? 'Ø ' : ''}${L} mm</text>
  ${p.forma !== 'redonda' ? `
  <line x1="${x - 22}" y1="${y}" x2="${x - 22}" y2="${y + h}" stroke="${dim}" stroke-width="1"/>
  <line x1="${x - 27}" y1="${y}" x2="${x - 17}" y2="${y}" stroke="${dim}" stroke-width="1"/>
  <line x1="${x - 27}" y1="${y + h}" x2="${x - 17}" y2="${y + h}" stroke="${dim}" stroke-width="1"/>
  <text x="${x - 32}" y="${132 + 4}" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="${dim}" transform="rotate(-90 ${x - 32} 130)">${A} mm</text>` : ''}
  <line x1="20" y1="252" x2="380" y2="252" stroke="#C9C4B8" stroke-width="1"/>
  <text x="24" y="272" font-family="Outfit, sans-serif" font-weight="600" font-size="13" fill="#2B2C30">TRESOL® · ${esc(p.codigo)}</text>
  <text x="376" y="272" text-anchor="end" font-family="Inter, sans-serif" font-size="10" fill="#8A857A">Prof. ${p.profundidad ?? '—'} mm · Esc. gráfica · Cotas en mm</text>
  </svg>`;
}

/* ============================================================
   CARRITO DE PRESUPUESTO (localStorage)
   ============================================================ */
const TresolCart = {
  KEY: 'tresol_presupuesto',
  get items() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; }
  },
  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    updateCartBadge();
  },
  add(item) {
    const items = this.items;
    const match = items.find(i => i.pid === item.pid && i.colorId === item.colorId && i.variante === item.variante && (i.obs || '') === (item.obs || ''));
    if (match) match.qty += item.qty;
    else items.push(item);
    this.save(items);
  },
  remove(idx) { const items = this.items; items.splice(idx, 1); this.save(items); },
  setQty(idx, qty) { const items = this.items; if (items[idx]) { items[idx].qty = Math.max(1, qty); this.save(items); } },
  clear() { this.save([]); },
  count() { return this.items.reduce((a, i) => a + i.qty, 0); }
};

function updateCartBadge() {
  const badge = document.querySelector('.cart-count');
  if (!badge) return;
  const n = TresolCart.count();
  badge.textContent = n;
  badge.classList.toggle('is-visible', n > 0);
}

/* ============================================================
   ICONOS
   ============================================================ */
const ICONS = {
  search: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16l-1.5 11a2 2 0 0 1-2 1.8h-9A2 2 0 0 1 5.5 18Z"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  caret: '<svg class="caret" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>',
  wa: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.1-.7l.4-.5c.1-.1.2-.3.3-.4.1-.2 0-.3 0-.5L9.6 8.4c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3Z"/></svg>',
  ig: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
  fb: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h2.5l.5-3h-3V3.5c0-.9.3-1.5 1.6-1.5H17V0h-2.6C11.7 0 10.5 1.4 10.5 3.8V5H8v3h2.5v9H14V8Z" transform="translate(2.5 3.5) scale(.78)"/></svg>',
  pdf: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M9 15h6M9 18h4"/></svg>',
  arrow: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
};

/* ============================================================
   HEADER + FOOTER + CHROME
   ============================================================ */
function currentPage() {
  const f = location.pathname.split('/').pop() || 'index.html';
  return f;
}

function buildHeader() {
  const cats = TRESOL.categorias.map(c => {
    const n = TRESOL.productosDe(c.id).length;
    return `<a class="mega-item" href="catalogo.html?cat=${c.id}">
      <strong>${esc(c.nombre)}</strong>
      <span class="count">${n} producto${n !== 1 ? 's' : ''}</span>
      <span>${esc(c.desc.split('.')[0])}.</span>
    </a>`;
  }).join('');

  const materialItems = [
    ['material.html', '¿Qué es Tresol?', 'La superficie sólida explicada: composición, propiedades y diferencias.'],
    ['material.html#ventajas', 'Ventajas del material', '12 atributos: antibacterial, ignífugo, juntas imperceptibles y más.'],
    ['material.html#acabados', 'Opciones de acabado', 'Barras de acero, molduras, escurrideros, zócalo sanitario.'],
    ['material.html#mantenimiento', 'Uso y mantenimiento', 'Limpieza, temperatura, rayas y reparaciones.'],
    ['material.html#certificaciones', 'Certificaciones', 'Calidad certificada ISO 9001.'],
    ['empresa.html', 'La empresa', 'Primera fabricante de superficie sólida en Argentina.']
  ].map(([href, t, d]) => `<a class="mega-item" href="${href}"><strong>${esc(t)}</strong><span>${esc(d)}</span></a>`).join('');

  return `
  <a class="skip-link" href="#main">Saltar al contenido</a>
  <header class="site-header" id="siteHeader">
    <div class="header-inner">
      <a class="brand" href="index.html" aria-label="Tresol — inicio">
        <img class="brand-img" src="assets/img/logo-wordmark.png" alt="TRESOL">
        <span class="brand-tag">Superficie Sólida</span>
      </a>
      <nav class="main-nav" aria-label="Navegación principal">
        <button class="nav-link" data-mega="megaProductos" aria-expanded="false" aria-haspopup="true">Productos ${ICONS.caret}</button>
        <button class="nav-link" data-mega="megaMaterial" aria-expanded="false" aria-haspopup="true">El Material ${ICONS.caret}</button>
        <a class="nav-link" href="colores.html">Colores</a>
        <a class="nav-link" href="proyectos.html">Proyectos</a>
        <a class="nav-link" href="empresa.html">Empresa</a>
        <a class="nav-link" href="contacto.html">Contacto</a>
      </nav>
      <div class="header-actions">
        <button class="icon-btn" id="searchBtn" aria-label="Buscar productos">${ICONS.search}</button>
        <a class="icon-btn" href="presupuesto.html" aria-label="Ver mi presupuesto">
          ${ICONS.cart}<span class="cart-count" aria-hidden="true">0</span>
        </a>
        <a class="btn btn--primary btn--sm btn-quote" href="presupuesto.html">Mi presupuesto</a>
        <button class="icon-btn nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false">${ICONS.menu}</button>
      </div>
    </div>

    <div class="mega" id="megaProductos" role="menu">
      <div class="mega-grid">${cats}</div>
      <div class="mega-footer">
        <p class="muted">Todo se fabrica a pedido en San Francisco, Córdoba.</p>
        <a class="text-link" href="catalogo.html">Ver catálogo completo ${ICONS.arrow}</a>
      </div>
    </div>
    <div class="mega" id="megaMaterial" role="menu">
      <div class="mega-grid">${materialItems}</div>
      <div class="mega-footer">
        <p class="muted">Antibacterial sin biocidas · Ignífugo · 100 % reciclable</p>
        <a class="text-link" href="material.html">Conocer el material ${ICONS.arrow}</a>
      </div>
    </div>
  </header>

  <nav class="mobile-nav" id="mobileNav" aria-label="Menú móvil">
    <div class="mobile-nav-group">
      <button data-mobile-sub aria-expanded="false">Productos ${ICONS.caret}</button>
      <div class="mobile-nav-sub">
        ${TRESOL.categorias.map(c => `<a href="catalogo.html?cat=${c.id}">${esc(c.nombre)} <span class="muted">(${TRESOL.productosDe(c.id).length})</span></a>`).join('')}
        <a href="catalogo.html"><strong>Ver todo el catálogo →</strong></a>
      </div>
    </div>
    <div class="mobile-nav-group">
      <button data-mobile-sub aria-expanded="false">El Material ${ICONS.caret}</button>
      <div class="mobile-nav-sub">
        <a href="material.html">¿Qué es Tresol?</a>
        <a href="material.html#ventajas">Ventajas</a>
        <a href="material.html#acabados">Opciones de acabado</a>
        <a href="material.html#mantenimiento">Uso y mantenimiento</a>
        <a href="material.html#certificaciones">Certificaciones</a>
      </div>
    </div>
    <div class="mobile-nav-group"><a href="colores.html">Colores</a></div>
    <div class="mobile-nav-group"><a href="proyectos.html">Proyectos</a></div>
    <div class="mobile-nav-group"><a href="empresa.html">Empresa</a></div>
    <div class="mobile-nav-group"><a href="contacto.html">Contacto</a></div>
    <a class="btn btn--primary btn--block mt-3" href="presupuesto.html">Mi presupuesto</a>
  </nav>`;
}

function buildFooter() {
  const c = TRESOL.contacto;
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img class="footer-logo" src="assets/img/logoN.png" alt="TRESOL — Solid Surface">
          <p>Primera fabricante de superficie sólida en Argentina. Plantas en Argentina y Brasil, abasteciendo a toda Latinoamérica. Calidad certificada ISO 9001.</p>
          <div class="footer-social">
            <a href="${c.instagram}" target="_blank" rel="noopener" aria-label="Instagram de Tresol">${ICONS.ig}</a>
            <a href="${c.facebook}" target="_blank" rel="noopener" aria-label="Facebook de Tresol">${ICONS.fb}</a>
          </div>
        </div>
        <div class="footer-col">
          <h3>Productos</h3>
          <ul>
            ${TRESOL.categorias.map(cat => `<li><a href="catalogo.html?cat=${cat.id}">${esc(cat.nombre)}</a></li>`).join('')}
            <li><a href="colores.html">Biblioteca de colores</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Tresol</h3>
          <ul>
            <li><a href="material.html">¿Qué es Tresol?</a></li>
            <li><a href="material.html#ventajas">Ventajas del material</a></li>
            <li><a href="proyectos.html">Proyectos</a></li>
            <li><a href="empresa.html">La empresa</a></li>
            <li><a href="contacto.html">Contacto</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Contacto</h3>
          <address>
            ${esc(c.direccion)}<br>${esc(c.ciudad)}<br>
            <a href="mailto:${c.email}">${c.email}</a><br>
            Tel: ${esc(c.telefono)}<br>
            WhatsApp: <a href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener">${esc(c.whatsappVisible)}</a>
          </address>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} TRESOL® — Superficie Sólida. Todos los derechos reservados.</span>
        <span>ISO 9001 · Fabricado en Argentina 🇦🇷</span>
      </div>
    </div>
  </footer>

  <a class="wa-fab" href="https://wa.me/${c.whatsapp}?text=${encodeURIComponent('¡Hola Tresol! Quiero hacer una consulta.')}"
     target="_blank" rel="noopener" aria-label="Consultar por WhatsApp">${ICONS.wa}</a>

  <div class="search-overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-label="Buscador">
    <div class="search-panel">
      <div class="search-input-wrap">
        ${ICONS.search}
        <input type="search" class="search-input" id="searchInput" placeholder="Buscar bachas, bases de ducha, mesadas…" autocomplete="off">
        <span class="search-kbd">ESC</span>
      </div>
      <div class="search-results" id="searchResults">
        <p class="search-hint">Buscá por nombre, código o tipo — por ejemplo: <em>“bacha country”</em>, <em>“T11”</em> o <em>“plato de ducha”</em>.</p>
      </div>
    </div>
  </div>

  <div class="toast" id="toast" role="status" aria-live="polite">
    <span class="toast-icon">${ICONS.check}</span>
    <p id="toastMsg"></p>
    <a href="presupuesto.html" id="toastLink">Ver presupuesto</a>
  </div>

  <div class="modal-backdrop" id="modalBackdrop">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div class="modal-head">
        <h2 id="modalTitle"></h2>
        <button class="modal-close" id="modalClose" aria-label="Cerrar">${ICONS.close}</button>
      </div>
      <div class="modal-body" id="modalBody"></div>
    </div>
  </div>`;
}

/* ============================================================
   ESTADO DE UI — bloqueo de scroll y sincronización de viewport
   ------------------------------------------------------------
   El bloqueo de scroll del body es un recurso compartido entre el nav
   móvil, el buscador y el modal. Cada cierre lo reseteaba a '' sin mirar
   quién más lo tenía tomado: abrir nav → abrir buscador → cerrar buscador
   devolvía el scroll con el nav todavía encima. Se lleva un set de dueños
   y el body solo se libera cuando queda vacío.
   ============================================================ */
const scrollLockOwners = new Set();
function lockScroll(owner) {
  scrollLockOwners.add(owner);
  document.body.style.overflow = 'hidden';
}
function unlockScroll(owner) {
  scrollLockOwners.delete(owner);
  if (!scrollLockOwners.size) document.body.style.overflow = '';
}

/* Umbral donde el nav horizontal reemplaza a la hamburguesa. Tiene que
   coincidir con los @media de .main-nav (styles.css:190) y .nav-toggle
   (styles.css:254). Si se cambia acá, cambiarlo allá. */
const NAV_BP = 1024;

function closeAllMegas() {
  document.querySelectorAll('.mega').forEach(m => m.classList.remove('is-open'));
  document.querySelectorAll('[data-mega]').forEach(b => b.setAttribute('aria-expanded', 'false'));
}

function setMobileNav(open) {
  const nav = document.getElementById('mobileNav');
  const toggle = document.getElementById('navToggle');
  if (!nav || !toggle) return;
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  toggle.innerHTML = open ? ICONS.close : ICONS.menu;
  if (open) lockScroll('nav'); else unlockScroll('nav');
}
const closeMobileNav = () => setMobileNav(false);
const isMobileNavOpen = () => !!document.getElementById('mobileNav')?.classList.contains('is-open');

/* ---------- Modal genérico ---------- */
function openModal(title, bodyHTML) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modalBackdrop').classList.add('is-open');
  lockScroll('modal');
}
function closeModal() {
  document.getElementById('modalBackdrop')?.classList.remove('is-open');
  unlockScroll('modal');
}
const isModalOpen = () => !!document.getElementById('modalBackdrop')?.classList.contains('is-open');

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg, showLink = true) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastLink').style.display = showLink ? '' : 'none';
  t.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-visible'), 4200);
}

/* ---------- Buscador ---------- */
function openSearch() {
  const overlay = document.getElementById('searchOverlay');
  if (!overlay) return;
  overlay.classList.add('is-open');
  lockScroll('search');
  setTimeout(() => document.getElementById('searchInput')?.focus(), 60);
}
function closeSearch() {
  const overlay = document.getElementById('searchOverlay');
  if (!overlay) return;
  overlay.classList.remove('is-open');
  unlockScroll('search');
}
const isSearchOpen = () => !!document.getElementById('searchOverlay')?.classList.contains('is-open');

function normalizar(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function buscarProductos(q) {
  let query = normalizar(q.trim());
  if (query.length < 2) return [];
  // aplicar sinónimos
  for (const [k, v] of Object.entries(TRESOL.sinonimos)) {
    if (query.includes(normalizar(k))) query = query.replace(normalizar(k), normalizar(v));
  }
  const terms = query.split(/\s+/).filter(Boolean);
  return TRESOL.productos.filter(p => {
    const cat = TRESOL.categorias.find(c => c.id === p.categoria);
    const sub = cat?.sub.find(s => s.id === p.sub);
    const hay = normalizar([
      p.nombre, p.codigo, cat?.nombre, sub?.nombre,
      p.instalacion ? TRESOL.INSTALACIONES[p.instalacion] : '',
      p.forma ? TRESOL.FORMAS[p.forma] : '', p.desc || ''
    ].join(' '));
    return terms.every(t => hay.includes(t));
  }).slice(0, 8);
}
function renderSearchResults(list, q) {
  const box = document.getElementById('searchResults');
  if (!q || q.trim().length < 2) {
    box.innerHTML = '<p class="search-hint">Buscá por nombre, código o tipo — por ejemplo: <em>“bacha country”</em>, <em>“T11”</em> o <em>“plato de ducha”</em>.</p>';
    return;
  }
  if (!list.length) {
    box.innerHTML = `<p class="search-hint">No encontramos resultados para “${esc(q)}”.<br><a class="text-link mt-1" href="https://wa.me/${TRESOL.contacto.whatsapp}?text=${encodeURIComponent('Hola! Estoy buscando: ' + q)}" target="_blank" rel="noopener">Consultanos por WhatsApp ${ICONS.arrow}</a></p>`;
    return;
  }
  box.innerHTML = list.map(p => {
    const cat = TRESOL.categorias.find(c => c.id === p.categoria);
    const color = TRESOL.getColor(p.colores?.[0]?.id || 'blanco');
    const desde = TRESOL.precioDesde(p);
    return `<a class="search-result" href="producto.html?id=${p.id}">
      <span class="sr-dot" style="background:${color.css}"></span>
      <span><strong>${esc(p.nombre)}</strong><span>${esc(cat?.nombre || '')} · ${esc(p.codigo)}</span></span>
      <span class="sr-price">${desde ? 'desde ' + TRESOL.fmtPrecio(desde) : 'A presupuesto'}</span>
    </a>`;
  }).join('');
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Chrome
  const headerMount = document.getElementById('chrome-header');
  const footerMount = document.getElementById('chrome-footer');
  if (headerMount) headerMount.innerHTML = buildHeader();
  if (footerMount) footerMount.innerHTML = buildFooter();
  updateCartBadge();

  // Scroll del header
  const header = document.getElementById('siteHeader');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mega menús
  document.querySelectorAll('[data-mega]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const mega = document.getElementById(btn.dataset.mega);
      const wasOpen = mega.classList.contains('is-open');
      closeAllMegas();
      if (!wasOpen) { mega.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.mega') && !e.target.closest('[data-mega]')) closeAllMegas();
  });

  // Nav móvil
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  navToggle?.addEventListener('click', () => setMobileNav(!isMobileNavOpen()));
  document.querySelectorAll('[data-mobile-sub]').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.mobile-nav-group').classList.toggle('is-open'));
  });
  // Los links del submenú apuntan a anclas (material.html#ventajas). Desde la
  // propia página eso es un cambio de hash, no una recarga: sin esto el nav
  // queda abierto tapando la sección a la que el usuario acaba de saltar.
  mobileNav?.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const url = new URL(a.getAttribute('href'), location.href);
    if (url.hash && url.pathname === location.pathname && url.search === location.search) closeMobileNav();
  });

  /* Punto único de sincronización al cruzar el umbral del nav.
     matchMedia y no resize: dispara una sola vez en el cruce en vez de decenas
     de veces por segundo durante el arrastre, así que no necesita debounce ni
     recordar el ancho anterior para saber si cruzó. */
  matchMedia(`(min-width: ${NAV_BP}px)`).addEventListener('change', e => {
    if (e.matches) closeMobileNav();  // la hamburguesa desaparece por CSS: el nav quedaría sin control para cerrarlo
    else closeAllMegas();             // los mega-menús no existen por debajo del umbral
  });

  // Buscador
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  document.getElementById('searchBtn')?.addEventListener('click', openSearch);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
  input?.addEventListener('input', () => renderSearchResults(buscarProductos(input.value), input.value));
  document.addEventListener('keydown', e => {
    // Cierra solo lo que está abierto, en orden de prioridad: cerrar a ciegas
    // liberaba el lock de scroll de una capa que seguía visible.
    if (e.key === 'Escape') {
      if (isModalOpen()) closeModal();
      else if (isSearchOpen()) closeSearch();
      else if (isMobileNavOpen()) closeMobileNav();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
  });

  // Modal
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalBackdrop')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  // El FAB de WhatsApp se superpone a cualquier botón de WhatsApp a todo el
  // ancho (mismo destino, misma esquina) mientras ese botón cruza la franja
  // inferior de la pantalla. Se oculta el FAB mientras alguno está en vista
  // y reaparece al salir — sin tocar el contenido de la página. rootMargin
  // negativo abajo: el botón cuenta como "visible" recién al entrar en la
  // franja donde el FAB fijo realmente se dibuja (58px + 1.4rem de margen).
  const waButtons = document.querySelectorAll('.btn--wa.btn--block');
  if (waButtons.length) {
    const fab = document.querySelector('.wa-fab');
    const visibles = new Set();
    const waIo = new IntersectionObserver(entries => {
      entries.forEach(en => en.isIntersecting ? visibles.add(en.target) : visibles.delete(en.target));
      fab?.classList.toggle('is-hidden', visibles.size > 0);
    }, { rootMargin: '0px 0px -80px 0px' });
    waButtons.forEach(b => waIo.observe(b));
  }

  // Botones magnéticos (solo puntero fino y sin reduced-motion)
  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.btn--lg').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px, ${(e.clientY - r.top - r.height / 2) * .25}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }
});

/* ---------- Render de card de producto (compartido) ---------- */
function productCardHTML(p) {
  const cat = TRESOL.categorias.find(c => c.id === p.categoria);
  const firstColor = p.colores?.[0]?.id || 'blanco';
  const desde = TRESOL.precioDesde(p);
  const dots = (p.colores || []).filter(c => c.modo === 'estandar').slice(0, 5)
    .map(c => { const col = TRESOL.getColor(c.id); return `<span class="dot" style="background:${col.css}" title="${esc(col.nombre)}"></span>`; }).join('');
  return `<a class="card prod-card" href="producto.html?id=${p.id}">
    <div class="prod-visual">
      <span class="prod-flag">${p.muestraPrecio
        ? '<span class="badge badge--ok">Precio online</span>'
        : '<span class="badge">A presupuesto</span>'}</span>
      ${productVisual(p, firstColor)}
    </div>
    <div class="prod-body">
      <span class="prod-code">${esc(cat?.nombre || '')} · ${esc(p.codigo)}</span>
      <h3>${esc(p.nombre)}</h3>
      <span class="prod-meta">${esc(TRESOL.medidasTexto(p))}</span>
      <div class="prod-foot">
        ${desde
          ? `<span class="prod-price"><small>desde</small>${TRESOL.fmtPrecio(desde)}</span>`
          : '<span class="prod-quote">Solicitar presupuesto</span>'}
        <span class="prod-colors">${dots}</span>
      </div>
    </div>
  </a>`;
}
