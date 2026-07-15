# Sitio web TRESOL — Prototipo de rediseño (Fase 1)

Prototipo navegable completo del nuevo sitio institucional + catálogo de **Tresol**
(tresol.com.ar), construido como sitio estático con datos reales del relevamiento.
Diseño dark premium mobile-first, referencia estética Krion, filtros tipo Johnson
Acero y ficha híbrida precio/consulta tipo Novellshop.

## Cómo verlo

Abrir `index.html` directamente en el navegador (funciona desde `file://`), o mejor:

```
cd sitio-web
npx serve .
```

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Home: hero, propuesta de valor (antibacterial/ignífugo/juntas/reciclable), categorías con contador, destacados, proyectos, teaser de colores, CTA, feed IG (placeholder) |
| `material.html` | "¿Qué es Tresol?" — el material antes que los productos: definición, comparativa vs. mármol, 12 atributos, antibacterial sin biocidas, acabados, uso y mantenimiento, FAQ, ISO 9001 |
| `empresa.html` | Quiénes somos: 1ª fabricante argentina, plantas ARG+BR, servicios, red de elaboradores |
| `catalogo.html` | Embudo Categoría → Subcategoría → Filtros combinables (modalidad de precio, instalación, forma, largo desde/hasta, color, desagüe) + contador + orden |
| `producto.html?id=…` | Ficha: galería multi-vista, specs estructuradas, selector de color por serie (a pedido atenuados), variantes con precio dinámico (bases de ducha y tapas), plano técnico, observaciones, garantía 48 hs, "no incluye", relacionados/cross-sell |
| `colores.html` | Biblioteca: 9 series en 3 grupos de precio, detalle por color con productos disponibles, carta PDF, colores especiales Pantone/RAL |
| `proyectos.html` | Galería por sector (10 sectores; casos McDonald's, Mostaza, salud, etc.) con detalle en modal |
| `presupuesto.html` | Carrito de PRESUPUESTO (no compra): ítems + variante + observaciones, formulario de contacto, confirmación con nº de solicitud, envío alternativo por WhatsApp con resumen |
| `contacto.html` | Formulario de leads con perfil/asunto + datos reales + horarios + WhatsApp |

Transversal: mega-menú sticky con glassmorphism, buscador (Ctrl+K) con sinónimos
(bacha→pileta, country→semi-encastre, plato de ducha→base), botón de WhatsApp
flotante en todas las páginas, carrito persistente (localStorage), micro-animaciones
reveal, accesibilidad (zoom habilitado, focus visible, aria, skip-link).

## Estructura

```
sitio-web/
├── *.html                  (9 páginas)
└── assets/
    ├── css/styles.css      Sistema de diseño (variables, componentes, responsive)
    └── js/
        ├── data.js         ★ ÚNICA FUENTE DE VERDAD: 45 productos, 54 colores,
        │                     9 series, 3 grupos, 12 proyectos, sinónimos, contacto
        ├── main.js         Header/footer compartidos, carrito, buscador, visuales SVG
        ├── catalogo.js     Filtros combinables + embudo
        ├── producto.js     Ficha de producto
        ├── colores.js      Biblioteca de colores
        ├── proyectos.js    Galería por sector
        └── presupuesto.js  Solicitud de presupuesto
```

## Datos reales incluidos

- Modelos y precios de la tienda actual (TA1 $854.664, T11 $786.025, D30 $929.945, etc.).
- Bases Boston/Oxford/Chelsea 700–900 × 700–1800 × 20/30 mm, 5 colores + 2 a pedido.
- Placas 3660×760 en 6/12/19 mm con regla real: 19 mm solo en Absolut/Nature/Trend;
  TRESOL FLEX en todos los colores **excepto Cool Series**.
- Paleta Absolut (~17 tonos) + series con textura; colores estándar de elaborados
  (blanco/marfil/gris) vs. "a pedido".
- Contacto real: Lothar Badersbach 4461, ventas@tresol.com.ar, 03564 445809,
  WhatsApp +54 9 351 754 0162 (link corregido — el actual tiene un `++` roto).

## Qué está simulado (pendiente de backend / assets)

1. **Imágenes**: los productos se muestran con visuales SVG ilustrativos generados
   por código (respetan forma, color y tipo). Reemplazar por fotografía real/IA:
   en producción cada producto tendrá `PRODUCTO_MEDIA` desde el panel.
2. **Formularios** (presupuesto y contacto): validan y confirman en pantalla pero
   no envían a servidor. En producción: POST → `SOLICITUD_PRESUPUESTO` / lead en panel.
3. **PDFs** (planos técnicos, carta de colores, manuales): el plano se genera como
   dibujo acotado ilustrativo; los archivos definitivos se migran de Google Drive
   a hosting propio.
4. **Feed de Instagram**: placeholder con enlace a @tresoloficial.
5. **Precio de bases de ducha**: se calcula con una fórmula ilustrativa por medida;
   la matriz real medida×color se define en el taller de precios (dudas B2/B3 de la
   Matriz de Riesgos).

## Decisiones abiertas del proyecto que este prototipo asume provisoriamente

- Atributos filtrables por subcategoría (B1): se usó instalación/forma/medida/color/desagüe.
- Modelo de precios (B2/B3): híbrido — precio por variante donde existe, "solicitar presupuesto" donde no.
- Piletas con precio online (como la tienda actual); placas y mesadas a presupuesto.
- 1 producto = 1 serie (A4) y color = variante (A3), según contexto_proyecto.md.
