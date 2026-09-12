# Spec: rediseño de la escena del Vesubio + transiciones discretas

## Problema (feedback del usuario)
La escena three.js de portada "se ve de mala calidad e infantil": partículas cuadradas dispersas como confeti por todo el cuadro, columna fina, chispas rojas, relámpago parpadeante. Además faltan transiciones de interfaz; el usuario las quiere **sin exagerar**.

## Parte A — Vesubio: de "confeti" a "grabado en movimiento"

Referencia estética: xilografía / grabado del s. XVIII de la erupción (Hamilton, *Campi Phlegraei*): masa densa, valores planos, muy poco color. Brutalista, paleta ya definida: papel `#f2efe6`, tinta `#111`, ceniza `#6b6b6b`, rojo pompeyano `#b4321e` (solo un acento mínimo, o ninguno).

Reglas (`src/components/three/VesuvioScene.tsx`):
1. **Fuera lo que hace ruido**: eliminar el relámpago, las brasas rojas dispersas y toda partícula que caiga suelta por el cuadro. Nada de puntos aislados sobre el papel fuera de la pluma.
2. **La pluma es una masa, no puntos**: una columna que sale del cráter con anchura real (≈ 18–25 % del ancho de la montaña en la base, ensanchándose), formada por **muchas partículas pequeñas y muy densas** (mín. 6–8k puntos, tamaño pequeño, PointsMaterial con textura cuadrada y `depthWrite:false`), en tres capas de valor: tinta (núcleo), ceniza (medio), papel/gris claro (borde). Cada partícula sigue un flujo determinista: sube por el eje con ruido de baja frecuencia (turbulencia lenta, `sin/cos` de varias frecuencias sobre `t` y una fase por partícula), se frena y **se desplaza lateralmente en la parte alta** formando un yunque (anvil) que deriva hacia un lado (viento), como la pluma pliniana real. Densidad alta en el núcleo, cae a cero en el borde: nunca "salpicaduras".
3. **Lentitud**: el ciclo de una partícula 18–30 s. La sensación debe ser de nube que respira, no de fuegos artificiales. Nada parpadea.
4. **Montaña**: mantener silueta, contorno grueso y rayado; añadir un **sombreado de valor** (la ladera del lado contrario al viento algo más oscura) y hacer que el rayado tenga una deriva muy lenta (0.5 px/s) para que no sea estático. Opcional: una fina línea de horizonte (bahía) por detrás, en tinta, 2 px.
5. **Único acento rojo**: un resplandor fijo y pequeño en la boca del cráter (un quad con textura radial cuadrada, opacidad 0.6–0.8 oscilando ±0.1 en 4 s). Nada más en rojo.
6. **Composición**: la montaña sigue ocupando ~55 % del ancho; la pluma sube hasta ~85 % de la altura del lienzo y el yunque ocupa hasta ~70 % del ancho, con un margen limpio de papel arriba y a los lados. Comprobar en el lienzo real ~320×203 css px.
7. **Rendimiento**: 60 fps en móvil medio: un solo `Points` por capa (3 draw calls), sin `Math.random()` en el bucle, actualizar posiciones en CPU es aceptable con 8k puntos; si no, mover la animación a un vertex shader (preferible). Respetar `prefers-reduced-motion` (frame estático) y la lógica de `animationLifecycle.ts` (pausa fuera de vista / pestaña oculta).
8. Mantener fallback SVG y carga perezosa. No tocar `AshCanvas.tsx` en esta parte.

Entrega de la parte A con **capturas** (Playwright, viewport Pixel 5, `npx vite preview --port 4173`, onboarding saltado con `localStorage['pompei-guide:onboarding-done']='1'`, esperar 4 s) guardadas en `docs/screens/vesuvio-after-1.png` y `-2.png` (dos instantes distintos) para revisión.

## Parte B — transiciones discretas (CSS puro, sin librerías)

Principio: 150–220 ms, `ease-out`, desplazamientos ≤ 8 px, nunca escala grande ni rebotes. Todo bajo `@media (prefers-reduced-motion: no-preference)`; el bloque global de `global.css` ya anula animaciones en `reduce`.

1. **Cambio de página**: en el layout que envuelve las rutas (buscar `<Outlet/>` o el `Routes` en `src/App.tsx`), envolver el contenido en un `<div key={location.pathname} className="page-enter">` con `@keyframes page-enter { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }` de 180 ms. Sin animación de salida (evita saltos de layout).
2. **Aparición en cascada en portada**: las tarjetas `01 PREPARAR…`, `02…` de Home reciben `.reveal` con `animation-delay: calc(var(--i) * 40ms)` (máx. 5 elementos). Misma keyframe.
3. **Banner "ESTÁS EN"** de Visit y la barra fija de siguiente parada (`has-next-sticky`): entrada con la misma keyframe.
4. **Botones**: ya tienen `transform .08s`; unificar a `120ms ease-out` y añadir `:active { transform: translate(2px,2px); box-shadow: none }` si no está ya.
5. **Acordeones `<details>`**: animar solo la opacidad del contenido (`details[open] > *:not(summary) { animation: page-enter 160ms ease-out }`).
6. **Narrator**: el resaltado de frase ya transiciona; no tocar.
7. Nada de transiciones en el mapa ni en la brújula (ya tienen las suyas).

Verificación: `npx tsc --noEmit`, `npm run build`, `npx playwright test` (50 deben pasar; añadir 1 test que compruebe que el contenedor de página tiene la clase `page-enter` tras navegar y que con `reducedMotion: 'reduce'` no hay animación en curso: `getAnimations().length === 0`).

## Entregable
Informe: archivos tocados, decisiones tomadas en la pluma (conteo de partículas, ciclo, shader o CPU), rutas de las capturas, resultado de tsc/build/tests. Sin commit.
