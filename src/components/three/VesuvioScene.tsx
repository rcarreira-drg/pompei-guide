import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { attachAnimationLifecycle } from './animationLifecycle';
import { createSquareTexture, makePRNG, lerp, easeOutCubic, easeInCubic } from './squareTexture';

/**
 * Escena WebGL brutalista del Vesubio: dos cumbres low-poly (Somma más baja a la
 * izquierda, cono del Vesubio a la derecha con cráter), contorno de trazo grueso
 * y constante en pantalla, tramas de rayado diagonal a modo de grabado, y una
 * columna eruptiva de partículas cuadradas que sube, se ensancha en una nube
 * plana y densa, y cae como lapilli en dos abanicos laterales. Un relámpago
 * parpadea dentro de la nube. Todo el movimiento es una función determinista
 * del tiempo transcurrido (sin física simulada ni `Math.random()` en el bucle
 * de animación).
 */

const PAPER = '#f2efe6';
const INK = '#111111';
const ASH = '#6b6b6b';
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

const MOUNTAIN_DEPTH = 0.4;
const CRATER = new THREE.Vector3(0.55, 1.28, MOUNTAIN_DEPTH / 2 + 0.05);

// Escala global de la escena (montaña + columna + lapilli): pensada para que la
// montaña ocupe ~55% del ancho del lienzo con la cámara/FOV definidos más abajo
// (el lienzo real es más apaisado/bajo de lo que un cuadro cuadrado sugiere:
// ~320×203css px, aspecto ~1.58).
const SCALE = 1.06;

// Fases del ciclo de cada partícula (deben sumar 1).
const RISE_FRAC = 0.3;
const SPREAD_FRAC = 0.3;
const FALL_FRAC = 1 - RISE_FRAC - SPREAD_FRAC;

const COLUMN_HEIGHT = 1.45;
const Y0 = CRATER.y;
// La fase de ascenso llega casi hasta arriba: la de expansión apenas sube más,
// así la nube se aplana en vez de seguir creciendo en altura ("nube plana").
const Y1 = CRATER.y + COLUMN_HEIGHT * 0.92;
const Y2 = CRATER.y + COLUMN_HEIGHT;
const MUSHROOM_MAX = 2.3;
const FLATTEN_Z = 0.55;

function radiusRise0(rf: number) { return lerp(0.01, 0.04, rf); }
function radiusRise1(rf: number) { return lerp(0.05, 0.18, rf); }
function radiusSpreadEnd(rf: number) { return lerp(0.55, MUSHROOM_MAX, Math.pow(rf, 0.55)); }
function radiusFallEnd(rf: number) { return radiusSpreadEnd(rf) * (1 + 0.55 * rf); }
function fallEndY(rf: number) { return CRATER.y - (0.5 + 1.3 * rf); }

interface ParticleSet {
  points: THREE.Points;
  update: (t: number) => void;
  dispose: () => void;
}

interface EruptionParticleOptions {
  /** Sesga el radio hacia el eje de la columna (usado por las brasas). */
  emberBias?: boolean;
  /** Reduce la altura alcanzada respecto al cráter (brasas: no llegan a la nube de arriba). */
  heightScale?: number;
  /** Reduce el radio horizontal alcanzado (brasas: se quedan más cerca de la boca del cráter). */
  radiusScale?: number;
}

/** Crea un sistema de partículas (columna eruptiva + lapilli) determinista. */
function createEruptionParticles(count: number, color: string, size: number, seed: number, opts: EruptionParticleOptions = {}): ParticleSet {
  const { emberBias = false, heightScale = 1, radiusScale = 1 } = opts;
  const rand = makePRNG(seed);
  const phaseOffset = new Float32Array(count);
  const sign = new Float32Array(count);
  const zJitter = new Float32Array(count);
  const rf = new Float32Array(count);
  const cyc = new Float32Array(count);
  const wobbleSeed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const r = emberBias ? Math.pow(rand(), 2.2) : rand(); // brasas: más concentradas cerca del eje/base
    cyc[i] = lerp(7, 13, rand());
    phaseOffset[i] = rand() * cyc[i];
    // el lateral (izquierda/derecha) se decide por partícula; al multiplicar
    // directamente por el radio (en vez de usar un ángulo polar) la columna
    // sigue unida cerca del eje y solo se abre en dos abanicos al ganar radio,
    // ya en la nube y en la caída de lapilli.
    sign[i] = rand() < 0.5 ? 1 : -1;
    zJitter[i] = (rand() * 2 - 1);
    rf[i] = r;
    wobbleSeed[i] = rand() * Math.PI * 2;
  }

  function scaleFromCrater(value: number, scale: number) {
    return CRATER.y + (value - CRATER.y) * scale;
  }

  const positions = new Float32Array(count * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const texture = createSquareTexture(color);
  const material = new THREE.PointsMaterial({
    size,
    map: texture,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    color: 0xffffff,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  function update(t: number) {
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const cycI = cyc[i];
      const lt = ((t + phaseOffset[i]) % cycI + cycI) % cycI;
      const p = lt / cycI;
      const rfv = rf[i];
      const y1 = heightScale === 1 ? Y1 : scaleFromCrater(Y1, heightScale);
      const y2 = heightScale === 1 ? Y2 : scaleFromCrater(Y2, heightScale);
      let y: number;
      let r: number;
      if (p < RISE_FRAC) {
        const u = p / RISE_FRAC;
        y = lerp(Y0, y1, easeOutCubic(u));
        r = lerp(radiusRise0(rfv), radiusRise1(rfv), u);
      } else if (p < RISE_FRAC + SPREAD_FRAC) {
        const u = (p - RISE_FRAC) / SPREAD_FRAC;
        y = lerp(y1, y2, u);
        r = lerp(radiusRise1(rfv), radiusSpreadEnd(rfv), easeOutCubic(u));
      } else {
        const u = (p - RISE_FRAC - SPREAD_FRAC) / FALL_FRAC;
        const fEnd = heightScale === 1 ? fallEndY(rfv) : scaleFromCrater(fallEndY(rfv), heightScale);
        y = lerp(y2, fEnd, easeInCubic(u));
        r = lerp(radiusSpreadEnd(rfv), radiusFallEnd(rfv), u);
      }
      r *= radiusScale;
      const wobble = Math.sin(t * 0.6 + wobbleSeed[i]) * 0.03;
      const x = CRATER.x + sign[i] * r + wobble;
      const z = CRATER.z + zJitter[i] * Math.min(r / MUSHROOM_MAX, 1) * FLATTEN_Z;
      const idx = i * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
    }
    posAttr.needsUpdate = true;
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

// Rayado diagonal (hatching) recortado a la silueta de la montaña: dibuja
// líneas negras finas en espacio de pantalla (gl_FragCoord), así el espaciado
// se mantiene constante en píxeles sin importar el zoom/tamaño del lienzo.
const HATCH_VERTEX_SHADER = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const HATCH_FRAGMENT_SHADER = `
  precision mediump float;
  uniform float uSpacing;
  uniform float uThickness;
  uniform vec3 uColor;
  void main() {
    float diag = gl_FragCoord.x + gl_FragCoord.y;
    float m = mod(diag, uSpacing);
    if (m > uThickness) discard;
    gl_FragColor = vec4(uColor, 1.0);
  }
`;

// Zigzag del relámpago (proporciones inspiradas en el trazo de la ilustración SVG),
// situado dentro de la nube/columna: pequeño y bien adentro del marco, no pegado
// al borde superior.
const LIGHTNING_LOCAL_POINTS: [number, number][] = [
  [-0.16, 0.16],
  [-0.02, 0.04],
  [-0.13, -0.02],
  [0.05, -0.16],
];
const FLASH_PERIOD = 4.2; // s
const FLASH_DURATION = 0.5; // s

const STATIC_TIME = 6.2; // instante representativo para el fotograma estático (reduced-motion)
const BREATH_SPEED = 0.12;
const BREATH_MAX_RAD = (6 * Math.PI) / 180;

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
    const capMaterial = new THREE.MeshBasicMaterial({ color: ASH });
    const sideMaterial = new THREE.MeshBasicMaterial({ color: INK });
    const mountainMesh = new THREE.Mesh(mountainGeometry, [capMaterial, sideMaterial]);
    rotationGroup.add(mountainMesh);

    // trama de grabado: rayas diagonales negras recortadas a la silueta, sobre el relleno
    const hatchGeometry = new THREE.ShapeGeometry(mountainShape);
    hatchGeometry.translate(0, 0, MOUNTAIN_DEPTH / 2 + 0.015);
    const hatchMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uSpacing: { value: 10 * dpr },
        uThickness: { value: 1.6 * dpr },
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

    // --- relámpago (parpadeo determinista, oculto con prefers-reduced-motion) ---
    const lightningFlat: number[] = [];
    for (const [lx, ly] of LIGHTNING_LOCAL_POINTS) {
      lightningFlat.push(CRATER.x - 0.05 + lx, Y2 - 0.15 + ly, CRATER.z + 0.06);
    }
    const lightningGeometry = new LineGeometry();
    lightningGeometry.setPositions(lightningFlat);
    const lightningMaterial = new LineMaterial({ color: 0xb4321e, linewidth: 4 * dpr });
    const lightning = new Line2(lightningGeometry, lightningMaterial);
    lightning.computeLineDistances();
    lightning.visible = false;
    rotationGroup.add(lightning);

    // --- columna eruptiva ---
    const ashParticles = createEruptionParticles(1700, ASH, 0.2, 1);
    const inkParticles = createEruptionParticles(650, INK, 0.17, 2);
    const emberParticles = createEruptionParticles(140, RED, 0.16, 3, { emberBias: true, heightScale: 0.22, radiusScale: 0.42 });
    rotationGroup.add(ashParticles.points, inkParticles.points, emberParticles.points);

    const particleSets = [ashParticles, inkParticles, emberParticles];

    function renderFrame(t: number) {
      for (const set of particleSets) set.update(t);
      rotationGroup.rotation.y = Math.sin(t * BREATH_SPEED) * BREATH_MAX_RAD;
      if (!prefersReducedMotion) {
        const phase = t % FLASH_PERIOD;
        lightning.visible = phase < FLASH_DURATION;
      }
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
      for (const set of particleSets) set.dispose();
      mountainGeometry.dispose();
      edgesGeometry.dispose();
      outlineGeometry.dispose();
      hatchGeometry.dispose();
      groundGeometry.dispose();
      lightningGeometry.dispose();
      capMaterial.dispose();
      sideMaterial.dispose();
      hatchMaterial.dispose();
      outlineMaterial.dispose();
      groundMaterial.dispose();
      lightningMaterial.dispose();
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
