# Onboarding — especificación

## Objetivo
Explicar en la primera apertura, en menos de dos minutos, qué se puede hacer con la app y cómo. Debe ser saltable, repetible desde Inicio y Práctico ("¿Cómo funciona?"), y estar disponible también como página de ayuda (`#/ayuda`) para consultar después.

## Comportamiento
- Se muestra a pantalla completa la primera vez (flag `pompei-guide:onboarded` en localStorage, con try/catch). Botón SALTAR arriba a la derecha en todas las pantallas; EMPEZAR al final marca el flag y lleva a Inicio.
- Navegación: botones ANTERIOR / SIGUIENTE, puntos de progreso, deslizar horizontal en táctil (touchstart/touchend, umbral 40 px), teclas ← →. Ruta `#/bienvenida/:n` para poder enlazar a una pantalla concreta.
- Estilo brutalista coherente: una ilustración grande por pantalla (componente `Illustration`), kicker en mono, título en display, 2-4 frases cortas, y un bloque "PRUÉBALO" con una acción real cuando aplique.
- Sin scroll horizontal a 360 px; contenido de cada pantalla cabe en un móvil de 640 px de alto sin desplazamiento, salvo la de consejos.

## Pantallas
1. **Bienvenida** (illus `vesuvio`): "POMPEYA EN EL BOLSILLO". Tres cosas: prepararte antes, recorrer el parque como con un guía, y buscar cualquier punto del plano oficial. Aviso: proyecto no oficial, todo gratuito.
2. **Antes del viaje** (illus `plinio`): ocho capítulos de historia, cronología, glosario y quiz; checklist y clima; entradas y cómo llegar. Acción: "IR A PREPARAR" (enlace) y "INSTALAR COMO APP" con instrucciones según plataforma (Android: menú ⋮ → Añadir a pantalla de inicio; iOS: Compartir → Añadir a pantalla de inicio), detectando `display-mode: standalone` para decir "ya instalada".
3. **Elige tu ruta** (illus `brujula`): exprés 13 paradas 2,5-3 h; completa 24 paradas 5-7 h; total con todos los puntos del plano. Acción: el propio selector de modo (`ExpressToggle`) funcionando aquí.
4. **El día de la visita** (illus `calle`): activa la ubicación (una vez, sigue en todas las pantallas; se puede detener), el mapa muestra tu posición y el camino en ocre hasta la siguiente parada, banner "ESTÁS EN…" al acercarte a menos de cuarenta metros, "MARCAR VISITADA Y SIGUIENTE". Brújula: gira hasta que la flecha apunte arriba. Acción: "DESCARGAR MAPA DEL PARQUE" (componente `MapDownload`) con recomendación de hacerlo con wifi.
5. **Escuchar al guía** (illus `teatro`): la narración usa la voz del móvil: elegir voz y velocidad, tocar un párrafo para saltar, párrafo final "por qué seguimos por aquí". Limitación honesta: se detiene si bloqueas la pantalla; activa PANTALLA SIEMPRE ENCENDIDA. Acción: mini `Narrator` con un texto de prueba de dos frases ("Hola, soy tu guía…") para comprobar que hay voz en español instalada; si no hay voces, enlace a ajustes (texto explicativo por plataforma).
6. **El plano oficial** (illus `foro`): el plano de papel de taquilla tiene ocho regiones con números; en la pestaña PLANO eliges Regio y número y escuchas el relato; buscador por nombre; "el punto más cercano a ti". Acción: "ABRIR EL PLANO".
7. **Consejos y fin** (illus `pan`): agua en las fuentes, sombra escasa, calzado, baños; primera vez mejor a la apertura; casas con horario rotativo. Botón grande EMPEZAR → Inicio. Texto pequeño: "Puedes volver a ver esto en Práctico → ¿Cómo funciona?".

## Implementación
- `src/pages/Onboarding.tsx` + `src/components/OnboardingSlide.tsx`; estilos en `src/styles/onboarding.css` (importar en App.tsx).
- `src/lib/onboarding.ts`: `isOnboarded()`, `setOnboarded()`, `isStandalone()`, `platformHint()`.
- En `App.tsx`: si no está onboarded y la ruta es `/`, redirigir a `/bienvenida/1` (solo una vez por sesión, con `sessionStorage` para no forzar si el usuario salta). Ruta `/ayuda` renderiza las mismas pantallas apiladas en vertical con anclas.
- Enlaces "¿Cómo funciona?" en Home (bloque estado de preparación) y en Practical (chip al principio).
- Ocultar la barra inferior de navegación durante el onboarding (clase en body o prop) para que sea una experiencia limpia; mostrarla en `/ayuda`.
- Tests Playwright: primera visita redirige a bienvenida; SALTAR marca el flag y muestra Inicio; recorrer las 7 pantallas con SIGUIENTE; `/ayuda` accesible; no hay scroll horizontal a 360 px.
