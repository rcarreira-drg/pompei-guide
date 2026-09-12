import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { attachAnimationLifecycle } from './animationLifecycle';
import { createSquareTexture, createRadialGlowTexture, makePRNG, lerp, easeOutCubic } from './squareTexture';

/**
 * Escena WebGL brutalista del Vesubio: dos cumbres low-poly (Somma más baja a la
 * izquierda, cono del Vesubio a la derecha con cráter), contorno de trazo grueso
 * y constante en pantalla, tramas de rayado diagonal a modo de grabado (con una
 * deriva muy lenta), sombreado de valor en la ladera de sotavento, y una columna
 * eruptiva formada por tres capas densas de partículas cuadradas (núcleo de
 * tinta, capa media de ceniza, borde claro) que suben con turbulencia lenta,
 * se frenan y se abren en un yunque que deriva hacia un lado (viento). Un único
 * acento rojo: un resplandor fijo en la boca del cráter. Todo el movimiento es
 * una función determinista del tiempo transcurrido (sin física simulada ni
 * `Math.random()` en el bucle de animación) — pensado como un grabado en
 * movimiento, no como fuegos artificiales.
 */

const PAPER = '#f2efe6';
const INK = '#111111';
const ASH = '#6b6b6b';
const ASH_EDGE = '#9a968d';
const ASH_LIT = '#7d7d7a';
const ASH_SHADE = '#54524d';
const RED = '#b4321e';

/** Silueta de la montaña (unidades de escena), adaptada del trazado de la ilustración SVG `vesuvio`. */
const MOUNTAIN_POINTS: [number, number][] = [
  [-1.76, 0],
  [-0.77, 0.96], // cima del Somma (más baja, a la izquierda)
  [-0.11, 0.564], // collado entre ambas cumbres
  [0.264, 1.404], // ladera hacia el cráter
  [0.44, 1.284], // labio izquierdo del cráter
  [0.66, 1.284], // labio derecho del cráter
  [0.836, 1.44], // cima del cono del Vesubio
  [1.76, 0],
];
const MOUNTAIN_MIN_X = -1.76;
const MOUNTAIN_MAX_X = 1.76;

const MOUNTAIN_DEPTH = 0.4;
const CRATER = new THREE.Vector3(0.55, 1.28, MOUNTAIN_DEPTH / 2 + 0.05);

// Escala global de la escena (montaña + columna): pensada para que la montaña
// ocupe ~55% del ancho del lienzo con la cámara/FOV definidos más abajo (el
// lienzo real es más apaisado/bajo de lo que un cuadro cuadrado sugiere:
// ~320×203css px, aspecto ~1.58).
const SCALE = 1.06;

// El viento sopla hacia la izquierda (-x): el yunque deriva en esa dirección y
// la ladera de sotavento (+x, la del cono) queda algo más oscura.
const WIND_DIR = -1;
const WIND_STRENGTH = 0.8;

// Fases del ciclo de cada partícula (deben sumar 1). La columna sube y se abre
// en el yunque; en el último tramo de la fase de deriva la partícula se
// desvanece (encoge a tamaño 0) sin moverse fuera de la masa, y reaparece
// creciendo desde tamaño 0 en el cráter al iniciar el siguiente ciclo: nunca
// hay un tramo de "caída" visible ni puntos sueltos fuera de la nube.
const RISE_FRAC = 0.3;
const DRIFT_FRAC = 1 - RISE_FRAC;
// Fracción del tramo de ascenso dedicada a crecer desde tamaño 0 (aparición en el cráter).
const FADE_IN_FRAC = 0.2;
// Fracción final del tramo de deriva dedicada a desvanecerse a tamaño 0 (dentro del yunque).
const FADE_OUT_FRAC = 0.18;

const COLUMN_HEIGHT = 1.05;
const Y0 = CRATER.y;
const Y1 = CRATER.y + COLUMN_HEIGHT * 0.6; // techo de la fase de ascenso: aún columna estrecha
const Y2 = CRATER.y + COLUMN_HEIGHT; // altura del yunque, con margen de papel arriba
const MUSHROOM_MAX = 1.55; // radio máximo del yunque, deja margen de papel a los lados

interface LayerSpec {
  color: string;
  count: number;
  size: number;
  opacity: number;
  seed: number;
  /** Exponente de la distribución radial: mayor = más concentrado cerca del eje. */
  radiusExponent: number;
  /** Radio máximo de la capa en la fase de ascenso, relativo a MUSHROOM_MAX. */
  riseRadiusFrac: number;
  /** Radio máximo de la capa ya en el yunque, relativo a MUSHROOM_MAX. */
  spreadRadiusFrac: number;
}

const LAYERS: LayerSpec[] = [
  // Núcleo de tinta: masa estrecha y densa junto al eje de la columna.
  { color: INK, count: 3600, size: 0.17, opacity: 1, seed: 2, radiusExponent: 2, riseRadiusFrac: 0.12, spreadRadiusFrac: 0.42 },
  // Capa media de ceniza: cuerpo principal de la nube.
  { color: ASH, count: 6200, size: 0.15, opacity: 0.95, seed: 1, radiusExponent: 1.5, riseRadiusFrac: 0.16, spreadRadiusFrac: 0.82 },
  // Borde claro: halo tenue que difumina el límite de la nube contra el papel.
  { color: ASH_EDGE, count: 3200, size: 0.18, opacity: 0.55, seed: 3, radiusExponent: 1.05, riseRadiusFrac: 0.2, spreadRadiusFrac: 1 },
];

interface ParticleSet {
  points: THREE.Points;
  update: (t: number) => void;
  dispose: () => void;
}

/** Crea una capa de partículas de la columna eruptiva (masa densa, sin partículas sueltas). */
function createEruptionLayer(spec: LayerSpec): ParticleSet {
  const { count, size, opacity, seed, radiusExponent, riseRadiusFrac, spreadRadiusFrac } = spec;
  const rand = makePRNG(seed);
  const cyc = new Float32Array(count);
  const phaseOffset = new Float32Array(count);
  const sign = new Float32Array(count);
  const radiusFactor = new Float32Array(count);
  const zBias = new Float32Array(count);
  const wobbleSeedA = new Float32Array(count);
  const wobbleSeedB = new Float32Array(count);
  const wobbleFreqA = new Float32Array(count);
  const wobbleFreqB = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    cyc[i] = lerp(18, 30, rand());
    phaseOffset[i] = rand() * cyc[i];
    sign[i] = rand() < 0.5 ? 1 : -1;
    radiusFactor[i] = Math.pow(rand(), radiusExponent); // denso en el eje, cae a cero en el borde
    zBias[i] = (rand() * 2 - 1);
    wobbleSeedA[i] = rand() * Math.PI * 2;
    wobbleSeedB[i] = rand() * Math.PI * 2;
    wobbleFreqA[i] = lerp(0.09, 0.16, rand());
    wobbleFreqB[i] = lerp(0.22, 0.35, rand());
  }

  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count).fill(1);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

  const texture = createSquareTexture(spec.color);
  const material = new THREE.PointsMaterial({
    size,
    map: texture,
    sizeAttenuation: true,
    transparent: true,
    opacity,
    depthWrite: false,
    color: 0xffffff,
  });
  // Inyecta un factor de escala por vértice en el shader de puntos estándar:
  // permite que cada partícula crezca desde 0 al aparecer en el cráter y
  // se desvanezca a 0 al final de su ciclo sin necesidad de un material a medida.
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', 'attribute float aScale;\n#include <common>')
      .replace('gl_PointSize = size;', 'gl_PointSize = size * aScale;');
  };

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  const riseMaxR = MUSHROOM_MAX * riseRadiusFrac;
  const spreadMaxR = MUSHROOM_MAX * spreadRadiusFrac;

  function update(t: number) {
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const scaleAttr = geometry.attributes.aScale as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const cycI = cyc[i];
      const lt = ((t + phaseOffset[i]) % cycI + cycI) % cycI;
      const p = lt / cycI;
      const rf = radiusFactor[i];

      // Turbulencia lenta de baja frecuencia: dos ondas de frecuencia/fase
      // distinta por partícula, nunca aleatoriedad por fotograma.
      const wobble = Math.sin(t * wobbleFreqA[i] + wobbleSeedA[i]) * 0.55 + Math.sin(t * wobbleFreqB[i] + wobbleSeedB[i]) * 0.3;

      let y: number;
      let r: number;
      let windU: number; // 0..1: cuánto de la deriva del viento se aplica
      let scale = 1;

      if (p < RISE_FRAC) {
        // Asciende por el eje: columna estrecha, apenas se ensancha.
        const u = p / RISE_FRAC;
        y = lerp(Y0, Y1, easeOutCubic(u));
        r = lerp(0.015, riseMaxR, u) * rf;
        windU = 0;
        if (u < FADE_IN_FRAC) scale = easeOutCubic(u / FADE_IN_FRAC);
      } else {
        // Se frena y se abre en el yunque, derivando hacia el lado del viento;
        // en el último tramo se desvanece (tamaño 0) sin moverse fuera de la masa.
        const u = (p - RISE_FRAC) / DRIFT_FRAC;
        const eu = easeOutCubic(u);
        y = lerp(Y1, Y2, eu);
        r = lerp(riseMaxR, spreadMaxR, eu) * rf;
        windU = eu;
        if (u > 1 - FADE_OUT_FRAC) scale = Math.max(0, (1 - u) / FADE_OUT_FRAC);
      }

      const windOffset = WIND_DIR * WIND_STRENGTH * windU;
      const wobbleAmp = 0.03 + 0.05 * Math.min(r / MUSHROOM_MAX, 1);
      const x = CRATER.x + sign[i] * r + windOffset + wobble * wobbleAmp;
      const z = CRATER.z + zBias[i] * Math.min(r / MUSHROOM_MAX, 1) * 0.5;
      const idx = i * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
      scaleAttr.array[i] = scale;
    }
    posAttr.needsUpdate = true;
    scaleAttr.needsUpdate = true;
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
    texture.dispose();
  }

  return { points, update, dispose };
}

function buildMountainShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(MOUNTAIN_POINTS[0][0], MOUNTAIN_POINTS[0][1]);
  for (let i = 1; i < MOUNTAIN_POINTS.length; i++) {
    shape.lineTo(MOUNTAIN_POINTS[i][0], MOUNTAIN_POINTS[i][1]);
  }
  shape.closePath();
  return shape;
}

/** Sombreado de valor: colorea los vértices según su x, más oscuro en la ladera de sotavento (+x). */
function applyMountainShading(geometry: THREE.BufferGeometry) {
  const posAttr = geometry.attributes.position as THREE.BufferAttribute;
  const count = posAttr.count;
  const colors = new Float32Array(count * 3);
  const lit = new THREE.Color(ASH_LIT);
  const shade = new THREE.Color(ASH_SHADE);
  const span = MOUNTAIN_MAX_X - MOUNTAIN_MIN_X;
  const tmp = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const x = posAttr.getX(i);
    const u = Math.min(Math.max((x - MOUNTAIN_MIN_X) / span, 0), 1);
    tmp.copy(lit).lerp(shade, u);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

// Rayado diagonal (hatching) recortado a la silueta de la montaña: dibuja
// líneas negras finas en espacio de pantalla (gl_FragCoord), así el espaciado
// se mantiene constante en píxeles sin importar el zoom/tamaño del lienzo. Una
// deriva muy lenta (uOffset, ~0.5 px/s) evita que la trama quede estática.
const HATCH_VERTEX_SHADER = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const HATCH_FRAGMENT_SHADER = `
  precision mediump float;
  uniform float uSpacing;
  uniform float uThickness;
  uniform float uOffset;
  uniform vec3 uColor;
  void main() {
    float diag = gl_FragCoord.x + gl_FragCoord.y - uOffset;
    float m = mod(diag, uSpacing);
    if (m > uThickness) discard;
    gl_FragColor = vec4(uColor, 1.0);
  }
`;

const STATIC_TIME = 6.2; // instante representativo para el fotograma estático (reduced-motion)
const BREATH_SPEED = 0.12;
const BREATH_MAX_RAD = (6 * Math.PI) / 180;
const HATCH_DRIFT_PX_PER_S = 0.5;
const GLOW_PERIOD = 4; // s

export default function VesuvioScene({ className, title }: { className?: string; title?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PAPER);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 1.0, 7);
    camera.lookAt(0, 1.0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const rotationGroup = new THREE.Group();
    rotationGroup.scale.setScalar(SCALE);
    scene.add(rotationGroup);

    // --- montaña low-poly ---
    const mountainShape = buildMountainShape();
    const mountainGeometry = new THREE.ExtrudeGeometry(mountainShape, { depth: MOUNTAIN_DEPTH, bevelEnabled: false, steps: 1 });
    mountainGeometry.translate(0, 0, -MOUNTAIN_DEPTH / 2);
    applyMountainShading(mountainGeometry);
    const capMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true });
    const sideMaterial = new THREE.MeshBasicMaterial({ color: INK });
    const mountainMesh = new THREE.Mesh(mountainGeometry, [capMaterial, sideMaterial]);
    rotationGroup.add(mountainMesh);

    // trama de grabado: rayas diagonales negras recortadas a la silueta, sobre el relleno
    const hatchGeometry = new THREE.ShapeGeometry(mountainShape);
    hatchGeometry.translate(0, 0, MOUNTAIN_DEPTH / 2 + 0.015);
    const hatchMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uSpacing: { value: 10 * dpr },
        uThickness: { value: 1.6 * dpr },
        uOffset: { value: 0 },
        uColor: { value: new THREE.Color(INK) },
      },
      vertexShader: HATCH_VERTEX_SHADER,
      fragmentShader: HATCH_FRAGMENT_SHADER,
    });
    const hatchMesh = new THREE.Mesh(hatchGeometry, hatchMaterial);
    rotationGroup.add(hatchMesh);

    // contorno de trazo grueso y constante en pantalla (LineSegments2 + LineMaterial),
    // independiente del zoom/escala de la escena.
    const edgesGeometry = new THREE.EdgesGeometry(mountainGeometry, 1);
    const outlineGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edgesGeometry);
    // `linewidth` es en píxeles CSS, pero LineSegments2 fija `resolution` cada
    // fotograma a partir del viewport en píxeles físicos: compensamos con el dpr
    // para que el grosor visual (~5px) no varíe con la densidad de píxeles.
    const outlineMaterial = new LineMaterial({ color: 0x111111, linewidth: 5 * dpr });
    const outline = new LineSegments2(outlineGeometry, outlineMaterial);
    outline.computeLineDistances();
    rotationGroup.add(outline);

    // base/suelo: franja negra fina bajo la montaña
    const groundGeometry = new THREE.PlaneGeometry(3.9, 0.07);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: INK });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.set(0, -0.035, MOUNTAIN_DEPTH / 2 + 0.02);
    rotationGroup.add(ground);

    // --- único acento rojo: resplandor fijo en la boca del cráter ---
    const glowTexture = createRadialGlowTexture(RED);
    const glowMaterial = new THREE.MeshBasicMaterial({
      map: glowTexture,
      color: new THREE.Color(RED),
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const glowGeometry = new THREE.PlaneGeometry(0.21, 0.21);
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    // En el labio del cráter, medio tapado por la base de la columna.
    glow.position.set(CRATER.x - 0.03, CRATER.y + 0.01, CRATER.z + 0.06);
    rotationGroup.add(glow);

    // --- columna eruptiva: tres capas densas (núcleo, medio, borde) ---
    const layers = LAYERS.map((spec) => createEruptionLayer(spec));
    for (const layer of layers) rotationGroup.add(layer.points);

    function renderFrame(t: number) {
      for (const layer of layers) layer.update(t);
      rotationGroup.rotation.y = Math.sin(t * BREATH_SPEED) * BREATH_MAX_RAD;
      hatchMaterial.uniforms.uOffset.value = t * HATCH_DRIFT_PX_PER_S * dpr;
      glowMaterial.opacity = 0.5 + 0.05 * Math.sin((t / GLOW_PERIOD) * Math.PI * 2);
      renderer.render(scene, camera);
    }

    const cleanupLifecycle = attachAnimationLifecycle(container, {
      onFrame: renderFrame,
      onResize: (width, height) => {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        renderer.render(scene, camera);
      },
      renderStaticFrame: () => renderFrame(STATIC_TIME),
    });

    return () => {
      cleanupLifecycle();
      for (const layer of layers) layer.dispose();
      mountainGeometry.dispose();
      edgesGeometry.dispose();
      outlineGeometry.dispose();
      hatchGeometry.dispose();
      groundGeometry.dispose();
      glowGeometry.dispose();
      capMaterial.dispose();
      sideMaterial.dispose();
      hatchMaterial.dispose();
      outlineMaterial.dispose();
      groundMaterial.dispose();
      glowMaterial.dispose();
      glowTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={title ?? 'El Vesubio en erupción'}
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
    />
  );
}
