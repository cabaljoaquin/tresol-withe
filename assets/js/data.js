/* ============================================================
   TRESOL — Datos del sitio (catálogo, colores, proyectos)
   Fuente de verdad única para todas las páginas.
   Modelos, medidas y precios tomados del relevamiento del
   sitio productivo (documentos/archivos extras/relevamiento-tresol.md).
   ============================================================ */

const TRESOL = (() => {

  /* ---------- Contacto ---------- */
  const contacto = {
    direccion: 'Lothar Badersbach 4461, Parque Industrial San Francisco',
    ciudad: 'X2400BSL · San Francisco, Córdoba, Argentina',
    email: 'ventas@tresol.com.ar',
    telefono: '03564 445809',
    whatsapp: '5493517540162',
    whatsappVisible: '+54 9 351 754 0162',
    instagram: 'https://www.instagram.com/tresoloficial',
    facebook: 'https://www.facebook.com/tresoloficial',
    mapsUrl: 'https://maps.google.com/?q=Lothar+Badersbach+4461,+San+Francisco,+Córdoba'
  };

  /* ---------- Grupos de precio ---------- */
  const grupos = [
    { id: 1, nombre: 'Grupo 1', desc: 'Colores plenos y tonos claros. La base de la colección, con la mejor relación costo-diseño.' },
    { id: 2, nombre: 'Grupo 2', desc: 'Texturas y diseños de complejidad media: piedras suaves, minerales y tendencias.' },
    { id: 3, nombre: 'Grupo 3', desc: 'Terminaciones de alta complejidad: brillos, patrones profundos y diseños especiales.' }
  ];

  /* ---------- Colores ----------
     css: valor de background CSS del swatch.
     textura: agrega grano/veteado visual. */
  const colores = [
    // — Serie Absolut (colores plenos) —
    { id: 'blanco',        nombre: 'Blanco',        serie: 'absolut', hex: '#F2F1EC', css: '#F2F1EC' },
    { id: 'blanco-nieve',  nombre: 'Blanco Nieve',  serie: 'absolut', hex: '#FAFAF7', css: '#FAFAF7' },
    { id: 'marfil',        nombre: 'Marfil',        serie: 'absolut', hex: '#EDE5D3', css: '#EDE5D3' },
    { id: 'vainilla',      nombre: 'Vainilla',      serie: 'absolut', hex: '#EFDDB4', css: '#EFDDB4' },
    { id: 'gris',          nombre: 'Gris',          serie: 'absolut', hex: '#B9BCBD', css: '#B9BCBD' },
    { id: 'grafito',       nombre: 'Grafito',       serie: 'absolut', hex: '#4E5257', css: '#4E5257' },
    { id: 'negro',         nombre: 'Negro',         serie: 'absolut', hex: '#1B1B1E', css: '#1B1B1E' },
    { id: 'chocolate',     nombre: 'Chocolate',     serie: 'absolut', hex: '#4A342A', css: '#4A342A' },
    { id: 'sky',           nombre: 'Sky',           serie: 'absolut', hex: '#A9C7DE', css: '#A9C7DE' },
    { id: 'aqua',          nombre: 'Aqua',          serie: 'absolut', hex: '#7FC6C2', css: '#7FC6C2' },
    { id: 'verde-manzana', nombre: 'Verde Manzana', serie: 'absolut', hex: '#9FBF56', css: '#9FBF56' },
    { id: 'verde-lima',    nombre: 'Verde Lima',    serie: 'absolut', hex: '#C6D64E', css: '#C6D64E' },
    { id: 'verde-suave',   nombre: 'Verde Suave',   serie: 'absolut', hex: '#BCD1B5', css: '#BCD1B5' },
    { id: 'molten',        nombre: 'Molten',        serie: 'absolut', hex: '#C3502B', css: '#C3502B' },
    { id: 'rojo',          nombre: 'Rojo',          serie: 'absolut', hex: '#B01F24', css: '#B01F24' },
    { id: 'mandarina',     nombre: 'Mandarina',     serie: 'absolut', hex: '#E87722', css: '#E87722' },
    { id: 'amarillo',      nombre: 'Amarillo',      serie: 'absolut', hex: '#F2C230', css: '#F2C230' },

    // — Serie Pastel —
    { id: 'rosa-pastel',   nombre: 'Rosa Pastel',   serie: 'pastel', hex: '#F2D6D3', css: '#F2D6D3' },
    { id: 'celeste-bruma', nombre: 'Celeste Bruma', serie: 'pastel', hex: '#CFE0EA', css: '#CFE0EA' },
    { id: 'menta',         nombre: 'Menta',         serie: 'pastel', hex: '#D3E8D8', css: '#D3E8D8' },
    { id: 'lavanda',       nombre: 'Lavanda',       serie: 'pastel', hex: '#DCD3E8', css: '#DCD3E8' },
    { id: 'manteca',       nombre: 'Manteca',       serie: 'pastel', hex: '#F4E9C9', css: '#F4E9C9' },
    { id: 'durazno',       nombre: 'Durazno',       serie: 'pastel', hex: '#F5DAC0', css: '#F5DAC0' },

    // — Nature Series (piedra / naturaleza) —
    { id: 'galaxia',       nombre: 'Galaxia',       serie: 'nature', hex: '#2B2B30', textura: true,
      css: 'radial-gradient(circle at 20% 30%, #45454d 1px, transparent 1.6px), radial-gradient(circle at 70% 60%, #5a5a64 1px, transparent 1.4px), radial-gradient(circle at 45% 80%, #3c3c44 1.2px, transparent 1.8px), #26262b' },
    { id: 'mediterraneo',  nombre: 'Mediterráneo',  serie: 'nature', hex: '#5E7480', textura: true,
      css: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,.14) 1px, transparent 1.5px), linear-gradient(135deg, #63798a 0%, #56707c 55%, #4c6470 100%)' },
    { id: 'malbec',        nombre: 'Malbec',        serie: 'nature', hex: '#4A2430', textura: true,
      css: 'radial-gradient(circle at 60% 30%, rgba(255,255,255,.08) 1px, transparent 1.4px), linear-gradient(150deg, #55293a 0%, #46212d 60%, #381a24 100%)' },
    { id: 'piedra-luna',   nombre: 'Piedra Luna',   serie: 'nature', hex: '#D9D6CE', textura: true,
      css: 'radial-gradient(circle at 25% 55%, rgba(120,118,110,.35) 1px, transparent 1.6px), radial-gradient(circle at 75% 25%, rgba(120,118,110,.25) 1px, transparent 1.4px), #DAD7CF' },
    { id: 'arena-toscana', nombre: 'Arena Toscana', serie: 'nature', hex: '#D9C4A5', textura: true,
      css: 'radial-gradient(circle at 40% 40%, rgba(140,110,70,.28) 1px, transparent 1.5px), radial-gradient(circle at 70% 70%, rgba(140,110,70,.2) 1px, transparent 1.3px), #DCC7A8' },
    { id: 'niebla',        nombre: 'Niebla',        serie: 'nature', hex: '#C4C7C5', textura: true,
      css: 'radial-gradient(circle at 55% 35%, rgba(90,95,95,.3) 1px, transparent 1.5px), linear-gradient(120deg, #C9CCCA, #BEC1BF)' },

    // — Trend Series (tendencia contemporánea) —
    { id: 'concreto',      nombre: 'Concreto',      serie: 'trend', hex: '#9B9C98', textura: true,
      css: 'linear-gradient(160deg, rgba(255,255,255,.10), transparent 45%), radial-gradient(circle at 65% 55%, rgba(60,60,58,.25) 1px, transparent 1.6px), #9B9C98' },
    { id: 'lino',          nombre: 'Lino',          serie: 'trend', hex: '#E3DCCB', textura: true,
      css: 'repeating-linear-gradient(90deg, rgba(160,150,125,.14) 0 1px, transparent 1px 4px), #E5DECD' },
    { id: 'basalto',       nombre: 'Basalto',       serie: 'trend', hex: '#3E4144', textura: true,
      css: 'radial-gradient(circle at 35% 65%, rgba(255,255,255,.09) 1px, transparent 1.5px), linear-gradient(140deg, #45484c, #37393c)' },
    { id: 'terrazo-blanco',nombre: 'Terrazo Blanco',serie: 'trend', hex: '#EBE8E1', textura: true,
      css: 'radial-gradient(circle at 22% 30%, #C9B8A0 2px, transparent 2.6px), radial-gradient(circle at 68% 62%, #A9ADB2 2.4px, transparent 3px), radial-gradient(circle at 45% 85%, #8E8378 1.8px, transparent 2.4px), #ECE9E2' },
    { id: 'oxido',         nombre: 'Óxido',         serie: 'trend', hex: '#8A5A3B', textura: true,
      css: 'radial-gradient(circle at 60% 40%, rgba(255,200,150,.18) 2px, transparent 3px), linear-gradient(150deg, #95633f, #7c4e33)' },

    // — Season Series —
    { id: 'duna',          nombre: 'Duna',          serie: 'season', hex: '#E0CDA9', textura: true,
      css: 'linear-gradient(120deg, #E5D3B0 0%, #DCC7A0 50%, #E5D3B0 100%)' },
    { id: 'escarcha',      nombre: 'Escarcha',      serie: 'season', hex: '#E9EDF0', textura: true,
      css: 'radial-gradient(circle at 40% 30%, rgba(170,190,205,.3) 1px, transparent 1.6px), #EAEEF1' },
    { id: 'brisa',         nombre: 'Brisa',         serie: 'season', hex: '#CBDDD3', textura: true,
      css: 'linear-gradient(135deg, #D2E2D9, #C2D6CB)' },
    { id: 'otono',         nombre: 'Otoño',         serie: 'season', hex: '#B5764A', textura: true,
      css: 'radial-gradient(circle at 30% 60%, rgba(90,45,20,.22) 1.4px, transparent 2px), linear-gradient(140deg, #C08154, #A76940)' },

    // — Space Series —
    { id: 'cosmos',        nombre: 'Cosmos',        serie: 'space', hex: '#1E2233', textura: true,
      css: 'radial-gradient(circle at 25% 35%, rgba(160,180,255,.35) 1px, transparent 1.5px), radial-gradient(circle at 70% 65%, rgba(255,255,255,.25) 1px, transparent 1.3px), radial-gradient(circle at 50% 80%, rgba(140,160,255,.2) 1.2px, transparent 1.8px), #1D2130' },
    { id: 'nebulosa',      nombre: 'Nebulosa',      serie: 'space', hex: '#3A3050', textura: true,
      css: 'radial-gradient(circle at 60% 40%, rgba(190,150,255,.25) 6px, transparent 14px), radial-gradient(circle at 30% 70%, rgba(120,140,255,.2) 5px, transparent 12px), #372E4C' },
    { id: 'eclipse',       nombre: 'Eclipse',       serie: 'space', hex: '#17181B', textura: true,
      css: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,.15) 2px, transparent 8px), #17181B' },
    { id: 'via-lactea',    nombre: 'Vía Láctea',    serie: 'space', hex: '#EDEAE4', textura: true,
      css: 'radial-gradient(circle at 30% 40%, rgba(150,150,160,.4) 1px, transparent 1.4px), radial-gradient(circle at 65% 70%, rgba(120,120,135,.3) 1px, transparent 1.3px), #EEEBE5' },

    // — Cool Series (no disponible en Tresol Flex) —
    { id: 'cool-white',    nombre: 'Cool White',    serie: 'cool', hex: '#F4F6F7', textura: true,
      css: 'linear-gradient(150deg, #F7F9FA, #EFF2F4)' },
    { id: 'cool-grey',     nombre: 'Cool Grey',     serie: 'cool', hex: '#AEB6BB', textura: true,
      css: 'linear-gradient(150deg, #B5BDC2, #A5ADB2)' },
    { id: 'artico',        nombre: 'Ártico',        serie: 'cool', hex: '#DCE7EC', textura: true,
      css: 'linear-gradient(135deg, #E2EBF0, #D3E0E6)' },
    { id: 'glaciar',       nombre: 'Glaciar',       serie: 'cool', hex: '#BFD4DC', textura: true,
      css: 'linear-gradient(135deg, #C7DAE2, #B4CBD4)' },

    // — Diamond Series (brillo) —
    { id: 'diamante-blanco', nombre: 'Diamante Blanco', serie: 'diamond', hex: '#F5F4F0', textura: true,
      css: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.95) 1px, transparent 1.4px), radial-gradient(circle at 70% 60%, rgba(200,210,230,.55) 1px, transparent 1.3px), #F3F2EE' },
    { id: 'cuarzo',        nombre: 'Cuarzo Brillante', serie: 'diamond', hex: '#E8E2D8', textura: true,
      css: 'radial-gradient(circle at 45% 45%, rgba(255,255,255,.8) 1px, transparent 1.3px), radial-gradient(circle at 75% 25%, rgba(210,190,160,.4) 1px, transparent 1.4px), #E9E3D9' },
    { id: 'perla',         nombre: 'Perla',         serie: 'diamond', hex: '#EFE9E4', textura: true,
      css: 'linear-gradient(120deg, rgba(255,255,255,.5), transparent 55%), radial-gradient(circle at 60% 60%, rgba(215,200,195,.45) 1px, transparent 1.3px), #EFE9E4' },
    { id: 'onix-brillo',   nombre: 'Ónix Brillo',   serie: 'diamond', hex: '#232326', textura: true,
      css: 'radial-gradient(circle at 35% 40%, rgba(255,255,255,.35) 1px, transparent 1.3px), radial-gradient(circle at 70% 70%, rgba(170,170,190,.3) 1px, transparent 1.2px), #222225' },

    // — Fantasy Series (patrones) —
    { id: 'terrazzo-color',nombre: 'Terrazzo Color', serie: 'fantasy', hex: '#E9E4DB', textura: true,
      css: 'radial-gradient(circle at 20% 35%, #C3542F 2.6px, transparent 3.4px), radial-gradient(circle at 62% 25%, #33657D 2.4px, transparent 3.2px), radial-gradient(circle at 42% 72%, #C9A24B 2.2px, transparent 3px), radial-gradient(circle at 82% 62%, #56613C 2px, transparent 2.8px), #EAE5DC' },
    { id: 'coral',         nombre: 'Coral',         serie: 'fantasy', hex: '#D97B6C', textura: true,
      css: 'radial-gradient(circle at 55% 45%, rgba(255,255,255,.25) 3px, transparent 7px), linear-gradient(140deg, #E08677, #CC6F60)' },
    { id: 'ambar',         nombre: 'Ámbar',         serie: 'fantasy', hex: '#C98A3B', textura: true,
      css: 'radial-gradient(circle at 40% 55%, rgba(255,220,150,.4) 4px, transparent 10px), linear-gradient(150deg, #D49445, #B87A31)' },
    { id: 'mosaico',       nombre: 'Mosaico',       serie: 'fantasy', hex: '#7A8CA3', textura: true,
      css: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.2) 2px, transparent 5px), radial-gradient(circle at 70% 65%, rgba(30,40,60,.25) 3px, transparent 6px), #7A8CA3' }
  ];

  /* ---------- Series ---------- */
  const series = [
    { id: 'absolut', nombre: 'Absolut', grupo: 1,
      desc: 'Colores plenos sin textura. La serie base de la colección: del blanco nieve al negro profundo, más una paleta vibrante de acentos. Cualquier color pleno puede fabricarse a pedido.' },
    { id: 'pastel', nombre: 'Pastel', grupo: 1,
      desc: 'La calidez de los colores Absolut en tonos suaves y luminosos, pensados para espacios serenos.' },
    { id: 'nature', nombre: 'Nature', grupo: 2,
      desc: 'Texturas inspiradas en la piedra y la naturaleza: minerales, arenas y tonos profundos como Galaxia, Mediterráneo y Malbec.' },
    { id: 'trend', nombre: 'Trend', grupo: 2,
      desc: 'Diseños de tendencia contemporánea: concreto, lino, terrazo y acabados urbanos.' },
    { id: 'season', nombre: 'Season', grupo: 2,
      desc: 'Una paleta estacional que captura atmósferas: dunas, escarcha, brisa y otoño.' },
    { id: 'space', nombre: 'Space', grupo: 3,
      desc: 'Diseños de profundidad espacial: partículas y destellos sobre fondos intensos.' },
    { id: 'cool', nombre: 'Cool', grupo: 3, nota: 'No disponible en línea TRESOL FLEX',
      desc: 'Acabados fríos y minerales de gran pureza visual. Disponible en placa estándar (no en TRESOL FLEX).' },
    { id: 'diamond', nombre: 'Diamond', grupo: 3,
      desc: 'Partículas brillantes que responden a la luz: la serie más luminosa de la colección.' },
    { id: 'fantasy', nombre: 'Fantasy', grupo: 3,
      desc: 'Patrones y diseños de autor: terrazos de color, corales y ámbares para proyectos singulares.' }
  ];

  /* ---------- Categorías ---------- */
  const categorias = [
    { id: 'placas', nombre: 'Placas', slug: 'placas',
      desc: 'La placa madre de superficie sólida. Formato 3660 × 760 mm en espesores de 6, 12 y 19 mm, organizada por serie de color.',
      sub: [] },
    { id: 'piletas', nombre: 'Piletas', slug: 'piletas',
      desc: 'Bachas de superficie sólida para integración monolítica con juntas imperceptibles. Más de 40 modelos con plano técnico.',
      sub: [
        { id: 'bano', nombre: 'Baño' },
        { id: 'cocina', nombre: 'Cocina' },
        { id: 'sanitarias', nombre: 'Sanitarias' }
      ] },
    { id: 'bases-ducha', nombre: 'Bases de Ducha', slug: 'bases-de-ducha',
      desc: 'Platos de ducha en tres modelos — Boston, Oxford y Chelsea — con medidas de 700 a 1800 mm y siete colores.',
      sub: [] },
    { id: 'tapas-mesa', nombre: 'Tapas de Mesa', slug: 'tapas-de-mesa',
      desc: 'Tapas redondas, cuadradas y rectangulares con regrueso perimetral de 40 mm y respaldo de melamina de 18 mm.',
      sub: [] },
    { id: 'mesadas', nombre: 'Mesadas', slug: 'mesadas',
      desc: 'Mesadas 100 % a medida con zócalo sanitario incluido. Ancho base 620 mm, espesor 15 mm, largos de 600 a 2400 mm.',
      sub: [] }
  ];

  /* ---------- Helpers de armado ---------- */
  const std = ids => ids.map(id => ({ id, modo: 'estandar' }));
  const ped = ids => ids.map(id => ({ id, modo: 'pedido' }));
  const PALETA_PILETA = [...std(['blanco', 'marfil', 'gris']),
    ...ped(['blanco-nieve', 'vainilla', 'grafito', 'negro', 'chocolate', 'sky', 'aqua', 'verde-suave', 'rojo', 'mandarina', 'amarillo'])];
  const PALETA_BASE = [...std(['negro', 'gris', 'malbec', 'blanco', 'marfil']), ...ped(['mediterraneo', 'galaxia'])];
  const PALETA_TAPA = [...std(['blanco', 'marfil']), ...ped(['galaxia', 'mediterraneo'])];
  const NO_INCLUYE = 'Descarga, instalación, grifería y accesorios.';
  const GARANTIA = '48 hs de recibido el producto';

  const pileta = (o) => ({
    categoria: 'piletas', tipo: 'pileta', serie: 'absolut',
    colores: PALETA_PILETA, muestraPrecio: true, plano: true,
    garantia: GARANTIA, noIncluye: NO_INCLUYE,
    colorNota: 'Colores estándar: Blanco, Marfil y Gris. Resto de la serie Absolut a pedido.',
    ...o
  });

  /* ---------- Productos ---------- */
  const productos = [

    /* ===== PILETAS · BAÑO ===== */
    pileta({ id: 'ta1', codigo: 'TA1', nombre: 'Bacha de Baño TA1', sub: 'bano',
      forma: 'rectangular', instalacion: 'bajo-mesada',
      largo: 580, ancho: 440, profundidad: 155, incluyeDesague: false, precio: 854664, destacado: true,
      desc: 'Bacha rectangular de líneas puras, pensada para integrarse de forma monolítica a mesadas de superficie sólida con juntas imperceptibles.' }),
    pileta({ id: 'ta2', codigo: 'TA2', nombre: 'Bacha de Baño TA2', sub: 'bano',
      forma: 'rectangular', instalacion: 'bajo-mesada',
      largo: 520, ancho: 400, profundidad: 135, incluyeDesague: false, precio: 467187,
      desc: 'Versión intermedia de la familia TA: proporciones equilibradas para vanitories de uso diario.' }),
    pileta({ id: 'ta3', codigo: 'TA3', nombre: 'Bacha de Baño TA3', sub: 'bano',
      forma: 'rectangular', instalacion: 'bajo-mesada',
      largo: 460, ancho: 360, profundidad: 130, incluyeDesague: false, precio: 515898,
      desc: 'La más compacta de la familia TA, ideal para toilettes y baños de dimensiones reducidas.' }),
    pileta({ id: 't05', codigo: 'T05', nombre: 'Bacha de Baño T05', sub: 'bano',
      forma: 'oval', instalacion: 'bajo-mesada',
      largo: 440, ancho: 330, profundidad: 140, incluyeDesague: false, precio: 436188,
      desc: 'Bacha oval clásica de instalación bajo mesada, un estándar atemporal para baños y vanitories.' }),
    pileta({ id: 't10', codigo: 'T10', nombre: 'Bacha de Baño T10', sub: 'bano',
      forma: 'rectangular', instalacion: 'semi-encastre',
      largo: 500, ancho: 390, profundidad: 145, incluyeDesague: false, precio: 515898,
      desc: 'Semi-encastre de perfil bajo — el modelo que muchos clientes conocen como “Country”.' }),
    pileta({ id: 't12', codigo: 'T12', nombre: 'Bacha de Baño T12', sub: 'bano',
      forma: 'cuadrada', instalacion: 'sobre-mesada',
      largo: 380, ancho: 380, profundidad: 130, incluyeDesague: false, precio: 402976, destacado: true,
      desc: 'Bacha cuadrada de apoyo con aristas suavizadas: protagonista sobre cualquier mesada.' }),
    pileta({ id: 't22', codigo: 'T22', nombre: 'Bacha de Baño T22', sub: 'bano',
      forma: 'redonda', instalacion: 'sobre-mesada',
      largo: 370, ancho: 370, profundidad: 140, incluyeDesague: false, precio: 325481,
      desc: 'Bacha circular de apoyo, un gesto escultórico simple para baños contemporáneos.' }),
    pileta({ id: 't23', codigo: 'T23', nombre: 'Bacha de Baño T23', sub: 'bano',
      forma: 'redonda', instalacion: 'bajo-mesada',
      largo: 330, ancho: 330, profundidad: 125, incluyeDesague: false, precio: 239129,
      desc: 'Redonda compacta bajo mesada: la puerta de entrada a la superficie sólida.' }),
    pileta({ id: 't40', codigo: 'T40', nombre: 'Bacha de Baño T40', sub: 'bano',
      forma: 'oval', instalacion: 'sobre-mesada',
      largo: 550, ancho: 350, profundidad: 150, incluyeDesague: false, precio: 612300,
      desc: 'Oval de apoyo de gran formato, con paredes esbeltas de espesor constante.' }),
    pileta({ id: 'oa011', codigo: 'OA011', nombre: 'Bacha de Baño OA011', sub: 'bano',
      forma: 'oval', instalacion: 'enrasada',
      largo: 500, ancho: 350, profundidad: 130, incluyeDesague: false, precio: 445600,
      desc: 'Instalación enrasada: la bacha queda al ras de la mesada, en un plano continuo y fácil de limpiar.' }),
    pileta({ id: 'oa018', codigo: 'OA018', nombre: 'Bacha de Baño OA018', sub: 'bano',
      forma: 'oval', instalacion: 'bajo-mesada',
      largo: 560, ancho: 380, profundidad: 140, incluyeDesague: false, precio: 489200,
      desc: 'Oval amplia de la serie OA, pensada para vanitories principales y baños en suite.' }),
    pileta({ id: 'ob850', codigo: 'OB850', nombre: 'Bacha Lineal OB850', sub: 'bano',
      forma: 'rectangular', instalacion: 'enrasada',
      largo: 850, ancho: 350, profundidad: 120, incluyeDesague: false, precio: 527800,
      desc: 'Bacha lineal de 850 mm tipo canal, ideal para baños compartidos y proyectos de hotelería.' }),
    pileta({ id: 'oc880', codigo: 'OC880', nombre: 'Bacha de Baño OC880', sub: 'bano',
      forma: 'rectangular', instalacion: 'sobre-mesada',
      largo: 880, ancho: 400, profundidad: 130, incluyeDesague: false, precio: 598400,
      desc: 'Gran formato de apoyo de la serie OC, con desagüe desplazado y generosa superficie útil.' }),
    pileta({ id: 'oc950', codigo: 'OC950', nombre: 'Bacha de Baño OC950', sub: 'bano',
      forma: 'rectangular', instalacion: 'enrasada',
      largo: 950, ancho: 420, profundidad: 130, incluyeDesague: false, precio: 645100,
      desc: 'La mayor de la serie OC: 950 mm enrasados para dobles bachas de un solo cuerpo.' }),

    /* ===== PILETAS · COCINA ===== */
    pileta({ id: 't02', codigo: 'T02', nombre: 'Pileta de Cocina T02', sub: 'cocina',
      forma: 'rectangular', instalacion: 'bajo-mesada',
      largo: 560, ancho: 420, profundidad: 200, incluyeDesague: true, precio: 389900,
      desc: 'Pileta de cocina compacta con desagüe incluido, apta para uso intensivo diario.' }),
    pileta({ id: 't08', codigo: 'T08', nombre: 'Pileta de Cocina T08', sub: 'cocina',
      forma: 'rectangular', instalacion: 'bajo-mesada',
      largo: 620, ancho: 450, profundidad: 220, incluyeDesague: true, precio: 452300,
      desc: 'Formato medio de gran profundidad: 220 mm para vajilla de todos los tamaños.' }),
    pileta({ id: 't09', codigo: 'T09', nombre: 'Pileta de Cocina T09', sub: 'cocina',
      forma: 'rectangular', instalacion: 'bajo-mesada',
      largo: 700, ancho: 450, profundidad: 230, incluyeDesague: true, precio: 478900,
      desc: 'Cuba amplia de 700 mm pensada para cocinas familiares y uso gastronómico liviano.' }),
    pileta({ id: 't11', codigo: 'T11', nombre: 'Pileta de Cocina T11', sub: 'cocina',
      forma: 'rectangular', instalacion: 'bajo-mesada',
      largo: 760, ancho: 460, profundidad: 240, incluyeDesague: true, precio: 786025, destacado: true,
      desc: 'La cuba principal de la línea: 760 × 460 mm y 240 mm de profundidad, integración monolítica total.' }),
    pileta({ id: 't19', codigo: 'T19', nombre: 'Pileta de Cocina T19', sub: 'cocina',
      forma: 'cuadrada', instalacion: 'bajo-mesada',
      largo: 450, ancho: 450, profundidad: 210, incluyeDesague: true, precio: 512400,
      desc: 'Cuba cuadrada versátil: funciona sola o en pareja como estación de lavado doble.' }),
    pileta({ id: 't20', codigo: 'T20', nombre: 'Pileta de Cocina T20', sub: 'cocina',
      forma: 'rectangular', instalacion: 'semi-encastre',
      largo: 640, ancho: 440, profundidad: 200, incluyeDesague: true, precio: 534800,
      desc: 'Semi-encastre con frente visto de superficie sólida, estilo farmhouse contemporáneo.' }),
    pileta({ id: 't21', codigo: 'T21', nombre: 'Pileta de Cocina T21', sub: 'cocina',
      forma: 'rectangular', instalacion: 'bajo-mesada',
      largo: 580, ancho: 440, profundidad: 190, incluyeDesague: true, precio: 498700,
      desc: 'Proporción clásica de 580 mm, un equilibrio justo entre capacidad y espacio de mesada.' }),
    pileta({ id: 't24', codigo: 'T24', nombre: 'Pileta de Cocina T24', sub: 'cocina',
      forma: 'rectangular', instalacion: 'sobre-mesada',
      largo: 500, ancho: 400, profundidad: 180, incluyeDesague: true, precio: 356200,
      desc: 'Sobre mesada de líneas rectas, pensada para islas y espacios de apoyo.' }),
    pileta({ id: 't25', codigo: 'T25', nombre: 'Pileta de Cocina T25', sub: 'cocina',
      forma: 'rectangular', instalacion: 'bajo-mesada',
      largo: 540, ancho: 420, profundidad: 185, incluyeDesague: true, precio: 371900,
      desc: 'Compacta bajo mesada para cocinas urbanas, quinchos y kitchenettes.' }),
    pileta({ id: 'd20', codigo: 'D20', nombre: 'Pileta Doble D20', sub: 'cocina',
      forma: 'rectangular', instalacion: 'bajo-mesada', doble: true,
      largo: 820, ancho: 450, profundidad: 200, incluyeDesague: true, precio: 564609,
      desc: 'Doble cuba simétrica de 820 mm: lavado y enjuague en un solo cuerpo monolítico.' }),
    pileta({ id: 'd30', codigo: 'D30', nombre: 'Pileta Doble D30', sub: 'cocina',
      forma: 'rectangular', instalacion: 'bajo-mesada', doble: true,
      largo: 940, ancho: 450, profundidad: 220, incluyeDesague: true, precio: 929945, destacado: true,
      desc: 'La doble cuba de mayor formato: 940 mm y 220 mm de profundidad para cocinas de alta exigencia.' }),
    pileta({ id: 'fs21', codigo: 'FS21', nombre: 'Pileta Profunda FS21', sub: 'cocina',
      forma: 'rectangular', instalacion: 'semi-encastre',
      largo: 750, ancho: 480, profundidad: 250, incluyeDesague: true, precio: 848021,
      desc: 'Cuba profunda de 250 mm con frente visto: la elección para cocinas profesionales y lavaderos exigentes.' }),

    /* ===== PILETAS · SANITARIAS ===== */
    pileta({ id: 'h01', codigo: 'H01', nombre: 'Bacha Sanitaria H01', sub: 'sanitarias',
      forma: 'rectangular', instalacion: 'enrasada',
      largo: 600, ancho: 450, profundidad: 250, incluyeDesague: true,
      muestraPrecio: false, precio: null, destacado: true,
      desc: 'Bacha hospitalaria de gran profundidad, sin juntas ni poros: la higiene de la superficie sólida al servicio de quirófanos, terapias y laboratorios. Antibacterial por composición, sin biocidas.',
      colorNota: 'Color estándar: Blanco. Otros colores de la serie Absolut a pedido.' }),
    pileta({ id: 'san-medida', codigo: 'SAN-M', nombre: 'Pileta Sanitaria a Medida', sub: 'sanitarias',
      forma: 'rectangular', instalacion: 'enrasada',
      largo: null, ancho: null, profundidad: null, incluyeDesague: true,
      muestraPrecio: false, precio: null, plano: false, aMedida: true,
      desc: 'Desarrollamos piletas sanitarias según especificación de obra: medidas, profundidades, zócalos sanitarios y canales de escurrimiento para hospitales, laboratorios e industria alimentaria.',
      colorNota: 'Paleta completa Absolut a pedido según proyecto.' }),

    /* ===== BASES DE DUCHA ===== */
    {
      id: 'base-boston', codigo: 'BOSTON', nombre: 'Base de Ducha Boston', categoria: 'bases-ducha', sub: null,
      tipo: 'base', serie: 'nature', forma: 'rectangular', instalacion: 'apoyo',
      variantes: { anchos: [700, 800, 900], largos: [700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800], altos: [20, 30] },
      precioBase: 389900, muestraPrecio: true, plano: true, destacado: true,
      colores: PALETA_BASE, garantia: GARANTIA, noIncluye: NO_INCLUYE,
      colorNota: 'Cinco colores estándar. Mediterráneo y Galaxia a pedido. Medidas y colores especiales: consultar.',
      desc: 'Líneas puras y borde recto minimalista. La base Boston desaparece visualmente en el piso del baño, con superficie antideslizante y desagüe lateral.'
    },
    {
      id: 'base-oxford', codigo: 'OXFORD', nombre: 'Base de Ducha Oxford', categoria: 'bases-ducha', sub: null,
      tipo: 'base', serie: 'nature', forma: 'rectangular', instalacion: 'apoyo',
      variantes: { anchos: [700, 800, 900], largos: [700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800], altos: [20, 30] },
      precioBase: 412500, muestraPrecio: true, plano: true,
      colores: PALETA_BASE, garantia: GARANTIA, noIncluye: NO_INCLUYE,
      colorNota: 'Cinco colores estándar. Mediterráneo y Galaxia a pedido. Medidas y colores especiales: consultar.',
      desc: 'Marco perimetral sutil que contiene el agua y ordena la geometría del baño. Un clásico contemporáneo.'
    },
    {
      id: 'base-chelsea', codigo: 'CHELSEA', nombre: 'Base de Ducha Chelsea', categoria: 'bases-ducha', sub: null,
      tipo: 'base', serie: 'nature', forma: 'rectangular', instalacion: 'apoyo',
      variantes: { anchos: [700, 800, 900], largos: [700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800], altos: [20, 30] },
      precioBase: 438700, muestraPrecio: true, plano: true,
      colores: PALETA_BASE, garantia: GARANTIA, noIncluye: NO_INCLUYE,
      colorNota: 'Cinco colores estándar. Mediterráneo y Galaxia a pedido. Medidas y colores especiales: consultar.',
      desc: 'Superficie texturizada de máxima adherencia, con canales de escurrimiento integrados. Seguridad sin resignar diseño.'
    },

    /* ===== TAPAS DE MESA ===== */
    {
      id: 'tapa-redonda', codigo: 'TM-R', nombre: 'Tapa de Mesa Redonda', categoria: 'tapas-mesa', sub: null,
      tipo: 'tapa', serie: 'absolut', forma: 'redonda',
      medidasOpciones: [
        { label: 'Ø 600 mm', precio: 285900 }, { label: 'Ø 700 mm', precio: 327500 },
        { label: 'Ø 800 mm', precio: 371200 }, { label: 'Ø 900 mm', precio: 418600 }
      ],
      muestraPrecio: true, plano: false, destacado: true,
      colores: PALETA_TAPA, garantia: GARANTIA, noIncluye: 'Base, estructura y colocación.',
      colorNota: 'Blanco y Marfil estándar. Galaxia y Mediterráneo (Nature) a pedido. Consulte por tamaños especiales.',
      desc: 'Tapa circular con regrueso perimetral de 40 mm y respaldo de melamina de 18 mm. Superficie higiénica, reparable y apta contacto con alimentos: ideal para gastronomía.'
    },
    {
      id: 'tapa-cuadrada', codigo: 'TM-C', nombre: 'Tapa de Mesa Cuadrada', categoria: 'tapas-mesa', sub: null,
      tipo: 'tapa', serie: 'absolut', forma: 'cuadrada',
      medidasOpciones: [
        { label: '600 × 600 mm', precio: 298400 }, { label: '700 × 700 mm', precio: 344100 },
        { label: '800 × 800 mm', precio: 392700 }
      ],
      muestraPrecio: true, plano: false,
      colores: PALETA_TAPA, garantia: GARANTIA, noIncluye: 'Base, estructura y colocación.',
      colorNota: 'Blanco y Marfil estándar. Galaxia y Mediterráneo (Nature) a pedido. Consulte por tamaños especiales.',
      desc: 'Formato cuadrado con cantos suavizados, regrueso de 40 mm y dorso de melamina de 18 mm. Resistente al uso comercial intensivo.'
    },
    {
      id: 'tapa-rectangular', codigo: 'TM-RE', nombre: 'Tapa de Mesa Rectangular', categoria: 'tapas-mesa', sub: null,
      tipo: 'tapa', serie: 'absolut', forma: 'rectangular',
      medidasOpciones: [
        { label: '1200 × 700 mm', precio: 486300 }, { label: '1400 × 800 mm', precio: 562900 }
      ],
      muestraPrecio: true, plano: false,
      colores: PALETA_TAPA, garantia: GARANTIA, noIncluye: 'Base, estructura y colocación.',
      colorNota: 'Blanco y Marfil estándar. Galaxia y Mediterráneo (Nature) a pedido. Consulte por tamaños especiales.',
      desc: 'El formato para mesas familiares y de restaurante. Juntas imperceptibles ante roturas: se repara, no se reemplaza.'
    },

    /* ===== MESADAS ===== */
    {
      id: 'mesada-medida', codigo: 'MES-M', nombre: 'Mesada a Medida', categoria: 'mesadas', sub: null,
      tipo: 'mesada', serie: 'absolut', forma: 'rectangular', aMedida: true, destacado: true,
      specsFijas: [
        ['Ancho base', '620 mm'], ['Espesor', '15 mm'], ['Largo', '600 a 2400 mm (medidas especiales a pedido)'],
        ['Zócalo sanitario', '50 mm — incluido'], ['Tolerancia dimensional', '± 3 mm'],
        ['Terminación', 'Pulido mate uniforme'], ['Integración', 'Admite bachas integradas con junta imperceptible']
      ],
      muestraPrecio: false, plano: false,
      colores: [...std(['blanco', 'marfil', 'gris']), ...ped(['blanco-nieve', 'vainilla', 'grafito', 'negro'])],
      garantia: GARANTIA, noIncluye: NO_INCLUYE,
      colorNota: 'Colores estándar: Blanco, Marfil y Gris. Incluye zócalo de 50 mm.',
      desc: 'Cada mesada Tresol se fabrica a pedido según su proyecto: indique largo, cortes para bacha y anafe, y terminaciones en el campo de observaciones. Nuestro equipo la cotiza dentro de las 48 hs.'
    },

    /* ===== PLACAS (una por serie) ===== */
    ...series.map(s => ({
      id: 'placa-' + s.id, codigo: 'PL-' + s.id.toUpperCase(), nombre: 'Placa ' + s.nombre,
      categoria: 'placas', sub: null, tipo: 'placa', serie: s.id, forma: 'rectangular',
      formato: '3660 × 760 mm',
      espesores: ['absolut', 'nature', 'trend'].includes(s.id) ? [6, 12, 19] : [6, 12],
      muestraPrecio: false, plano: false, destacado: s.id === 'absolut',
      colores: std(colores.filter(c => c.serie === s.id).map(c => c.id)),
      garantia: GARANTIA, noIncluye: 'Flete, elaboración y transformación.',
      colorNota: 'Todos los colores de la serie ' + s.nombre + '.' + (s.nota ? ' ' + s.nota + '.' : ''),
      desc: 'Placa de superficie sólida serie ' + s.nombre + ' en formato 3660 × 760 mm. ' + s.desc
    })),

    /* ===== PLACA TRESOL FLEX ===== */
    {
      id: 'placa-flex', codigo: 'PL-FLEX', nombre: 'Placa TRESOL FLEX', categoria: 'placas', sub: null,
      tipo: 'placa', serie: 'absolut', forma: 'rectangular', flex: true,
      formato: '3660 × 760 mm', espesores: [6, 12], destacado: true,
      muestraPrecio: false, plano: false,
      colores: std(colores.filter(c => c.serie !== 'cool').map(c => c.id)),
      garantia: GARANTIA, noIncluye: 'Flete, elaboración y transformación.',
      colorNota: 'Disponible en todos los colores de la colección, excepto Cool Series.',
      desc: 'La línea termoformable de Tresol: una placa que se curva con calor para crear superficies continuas, mostradores orgánicos y revestimientos envolventes. Disponible en toda la colección de colores excepto Cool Series.'
    }
  ];

  /* ---------- Proyectos / Aplicaciones ---------- */
  const sectores = [
    { id: 'hoteleria', nombre: 'Hotelería' },
    { id: 'gastronomia', nombre: 'Gastronomía' },
    { id: 'salud', nombre: 'Salud y Laboratorios' },
    { id: 'educacion', nombre: 'Educación' },
    { id: 'comercial', nombre: 'Comercial y Retail' },
    { id: 'hogar', nombre: 'Hogar' },
    { id: 'oficinas', nombre: 'Oficinas' },
    { id: 'carteleria', nombre: 'Cartelería y Señalética' },
    { id: 'revestimientos', nombre: 'Revestimientos' },
    { id: 'vehiculos', nombre: 'Vehículos Especiales' }
  ];

  const proyectos = [
    { id: 'mcdonalds', sector: 'gastronomia', titulo: "McDonald's Argentina", destacado: true,
      resumen: 'Frentes de atención, mesadas de trabajo y mesas para locales de la cadena en todo el país.',
      desc: 'La superficie sólida Tresol equipa locales de McDonald’s en Argentina: frentes de mostrador termoformados, mesadas de cocina de uso intensivo y tapas de mesa. Un material apto contacto con alimentos, antibacterial sin biocidas y reparable in situ — clave para operaciones que no pueden detenerse.',
      tags: ['Mesadas', 'Tapas de mesa', 'Termoformado'], color: '#C3502B' },
    { id: 'mostaza', sector: 'gastronomia', titulo: 'Mostaza', destacado: true,
      resumen: 'Mostradores de atención y mesas para la cadena de hamburguesas argentina.',
      desc: 'Para Mostaza desarrollamos mostradores de atención con juntas imperceptibles y tapas de mesa de alto tránsito. Las rayas del uso diario se pulen y las superficies vuelven a estado original, sin reemplazos.',
      tags: ['Mostradores', 'Tapas de mesa'], color: '#E87722' },
    { id: 'laboratorio-farma', sector: 'salud', titulo: 'Laboratorio Farmacéutico', destacado: true,
      resumen: 'Mesadas continuas con zócalo sanitario y bachas integradas para áreas de análisis.',
      desc: 'Mesadas de laboratorio en un único plano continuo, con zócalo sanitario de 50 mm, bachas H01 integradas y resistencia a reactivos químicos. Al no tener poros ni juntas, la superficie se desinfecta por completo — y al ser antibacterial por composición, las bacterias no desarrollan resistencia.',
      tags: ['Mesadas', 'Bachas sanitarias', 'Zócalo sanitario'], color: '#7FC6C2' },
    { id: 'hospital-regional', sector: 'salud', titulo: 'Hospital Regional',
      resumen: 'Superficies asépticas para quirófanos, nursery y terapia intensiva.',
      desc: 'Revestimientos y mesadas para áreas críticas: quirófanos, nursery y terapias. El material hipoalergénico y antibacterias de Tresol reduce la carga microbiana sin biocidas agregados, y soporta protocolos de desinfección con lavandina.',
      tags: ['Revestimientos', 'Bachas sanitarias'], color: '#A9C7DE' },
    { id: 'hotel-boutique', sector: 'hoteleria', titulo: 'Hotel Boutique · Córdoba', destacado: true,
      resumen: 'Vanitories con bachas integradas y mostrador de recepción retroiluminado.',
      desc: 'Sesenta baños en suite con vanitories monolíticos — mesada y bacha en una sola pieza sin juntas — y un mostrador de recepción termoformado con retroiluminación a través del material traslúcido.',
      tags: ['Vanitories', 'Recepción', 'Traslúcido'], color: '#C9A26B' },
    { id: 'universidad-lab', sector: 'educacion', titulo: 'Universidad Nacional',
      resumen: 'Mesadas para laboratorios de química con resistencia a reactivos.',
      desc: 'Laboratorios de química equipados con mesadas Tresol: resistencia química certificada, reparabilidad ante el desgaste académico y bordes anticaída moldeados en el mismo material.',
      tags: ['Mesadas', 'Laboratorio'], color: '#9FBF56' },
    { id: 'retail-flagship', sector: 'comercial', titulo: 'Flagship Store · Retail',
      resumen: 'Mostradores esculturales retroiluminados en material traslúcido.',
      desc: 'Mostradores curvos termoformados en TRESOL FLEX con retroiluminación LED: el material traslúcido convierte el punto de venta en una pieza de diseño que se ve desde la calle.',
      tags: ['Mostradores', 'TRESOL FLEX', 'Traslúcido'], color: '#DCD3E8' },
    { id: 'casa-patio', sector: 'hogar', titulo: 'Casa Patio · Residencial', destacado: true,
      resumen: 'Cocina integral con mesada, doble bacha D30 e isla en Blanco Absolut.',
      desc: 'Una cocina donde mesada, isla, doble bacha y zócalo son un único gesto continuo en Blanco Absolut. Sin juntas donde se acumule suciedad, resistente a golpes y reparable: pensada para vivir.',
      tags: ['Mesadas', 'Piletas dobles'], color: '#F2F1EC' },
    { id: 'oficinas-corp', sector: 'oficinas', titulo: 'Oficinas Corporativas',
      resumen: 'Islas de café, kitchenettes y recepción para 400 puestos de trabajo.',
      desc: 'Kitchenettes por piso con mesadas y bachas integradas, más un mostrador de recepción de doble curvatura. Mantenimiento mínimo para espacios de alta rotación.',
      tags: ['Mesadas', 'Recepción'], color: '#B9BCBD' },
    { id: 'carteleria-corp', sector: 'carteleria', titulo: 'Cartelería Corporativa',
      resumen: 'Letras corpóreas y señalética retroiluminada en material traslúcido.',
      desc: 'Letras corpóreas caladas en placa de 12 mm con retroiluminación: el material traslúcido de Tresol distribuye la luz de manera uniforme, sin puntos calientes. Resistente a UV e intemperie: no se decolora.',
      tags: ['Señalética', 'Traslúcido', 'Exterior'], color: '#F2C230' },
    { id: 'sanatorio-revest', sector: 'revestimientos', titulo: 'Sanatorio · Revestimientos',
      resumen: 'Revestimiento de pasillos y áreas húmedas en placa de 6 mm.',
      desc: 'Pasillos de circulación revestidos con placa de 6 mm y zócalo sanitario integrado: paredes lavables, resistentes al impacto de camillas y sin juntas donde proliferen bacterias.',
      tags: ['Revestimientos', 'Placa 6 mm'], color: '#EDE5D3' },
    { id: 'motorhome', sector: 'vehiculos', titulo: 'Motorhome & Food Trucks',
      resumen: 'Mesadas curvas termoformadas para unidades móviles gastronómicas.',
      desc: 'Interiores de motorhomes y food trucks con mesadas termoformadas en TRESOL FLEX: superficies continuas que copian las curvas del vehículo, livianas, higiénicas y aptas contacto con alimentos.',
      tags: ['TRESOL FLEX', 'Termoformado'], color: '#5E7480' }
  ];

  /* ---------- Sinónimos para el buscador ---------- */
  const sinonimos = {
    'bacha': 'pileta', 'bachas': 'pileta', 'lavabo': 'pileta', 'lavatorio': 'pileta',
    'country': 'semi-encastre', 'embutida': 'bajo-mesada', 'un montada': 'sobre-mesada',
    'plato de ducha': 'base de ducha', 'receptaculo': 'base de ducha', 'receptáculo': 'base de ducha',
    'marmol': 'superficie sólida', 'mármol': 'superficie sólida', 'fregadero': 'pileta cocina'
  };

  const INSTALACIONES = {
    'bajo-mesada': 'Bajo mesada', 'sobre-mesada': 'Sobre mesada',
    'semi-encastre': 'Semi-encastre', 'enrasada': 'Enrasada', 'apoyo': 'Apoyo directo'
  };
  const FORMAS = { rectangular: 'Rectangular', cuadrada: 'Cuadrada', redonda: 'Redonda', oval: 'Oval' };

  /* ---------- API ---------- */
  const getColor = id => colores.find(c => c.id === id);
  const getSerie = id => series.find(s => s.id === id);
  const getProducto = id => productos.find(p => p.id === id);
  const productosDe = (cat, sub) => productos.filter(p => p.categoria === cat && (!sub || p.sub === sub));
  const coloresDeSerie = sid => colores.filter(c => c.serie === sid);

  const fmtPrecio = n => n == null ? '' : '$ ' + Math.round(n).toLocaleString('es-AR');

  // Precio de bases de ducha según medida elegida
  const precioBaseDucha = (p, ancho, largo, alto) => {
    const f = (ancho / 700) * (largo / 700) * (alto === 30 ? 1.12 : 1);
    return Math.round(p.precioBase * f / 100) * 100;
  };

  const medidasTexto = p => {
    if (p.tipo === 'placa') return p.formato + ' · esp. ' + p.espesores.join(' / ') + ' mm';
    if (p.tipo === 'base') return '700–900 × 700–1800 mm · alto 20/30 mm';
    if (p.tipo === 'tapa') return p.medidasOpciones.map(m => m.label).join(' · ');
    if (p.tipo === 'mesada') return 'Ancho 620 mm · largo 600–2400 mm · esp. 15 mm';
    if (p.aMedida) return 'A medida según proyecto';
    if (p.forma === 'redonda') return 'Ø ' + p.largo + ' mm · prof. ' + p.profundidad + ' mm';
    return p.largo + ' × ' + p.ancho + ' × ' + p.profundidad + ' mm';
  };

  const precioDesde = p => {
    if (!p.muestraPrecio) return null;
    if (p.tipo === 'base') return precioBaseDucha(p, 700, 700, 20);
    if (p.tipo === 'tapa') return Math.min(...p.medidasOpciones.map(m => m.precio));
    return p.precio;
  };

  return {
    contacto, grupos, series, colores, categorias, productos, proyectos, sectores, sinonimos,
    INSTALACIONES, FORMAS,
    getColor, getSerie, getProducto, productosDe, coloresDeSerie,
    fmtPrecio, precioBaseDucha, medidasTexto, precioDesde
  };
})();
