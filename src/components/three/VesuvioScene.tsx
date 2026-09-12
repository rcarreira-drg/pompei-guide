import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { attachAnimationLifecycle } from './animationLifecycle';
import { createSquareTexture, makePRNG, lerp, easeOutCubic, easeInCubic } from './squareTexture';

/**
 * Escena WebGL brutalista del Vesubio: dos cumbres low-poly (Somma más baja a la
 * izquierda, cono del Vesubio a la derecha con cráter) y una columna eruptiva de
 * partículas cuadradas que sube, se ensancha en forma de pino y cae como lapilli.
 * Todo el movimiento es una función determinista del tiempo transcurrido (sin
 * física simulada ni `Math.random()` en el bucle de animación).
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

// Fases del ciclo de cada partícula (deben sumar 1).
const RISE_FRAC = 0.32;
const SPREAD_FRAC = 0.28;
const FALL_FRAC = 1 - RISE_FRAC - SPREAD_FRAC;

const COLUMN_HEIGHT = 1.05;
const Y0 = CRATER.y;
const Y1 = CRATER.y + COLUMN_HEIGHT * 0.8;
const Y2 = CRATER.y + COLUMN_HEIGHT;
const MUSHROOM_MAX = 2.05;
const FLATTEN_Z = 0.4;

function radiusRise0(rf: number) { return lerp(0.02, 0.09, rf); }
function radiusRise1(rf: number) { return lerp(0.18, 0.5, rf); }
function radiusSpreadEnd(rf: number) { return lerp(0.55, MUSHROOM_MAX, Math.pow(rf, 0.7)); }
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
  const theta = new Float32Array(count);
  const rf = new Float32Array(count);
  const cyc = new Float32Array(count);
  const wobbleSeed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const r = emberBias ? Math.pow(rand(), 2.2) : rand(); // brasas: más concentradas cerca del eje/base
    cyc[i] = lerp(7, 13, rand());
    phaseOffset[i] = rand() * cyc[i];
    theta[i] = rand() * Math.PI * 2;
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
      const x = CRATER.x + r * Math.cos(theta[i]) + wobble;
      const z = CRATER.z + r * Math.sin(theta[i]) * FLATTEN_Z;
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

const STATIC_TIME = 6.2; // instante representativo para el fotograma estático (reduced-motion)
const BREATH_SPEED = 0.12;
const BREATH_MAX_RAD = (6 * Math.PI) / 180;

export default function VesuvioScene({ className, title }: { className?: string; title?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PAPER);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 0.95, 7);
    camera.lookAt(0, 0.95, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const rotationGroup = new THREE.Group();
    scene.add(rotationGroup);

    // --- montaña low-poly ---
    const mountainShape = buildMountainShape();
    const mountainGeometry = new THREE.ExtrudeGeometry(mountainShape, { depth: MOUNTAIN_DEPTH, bevelEnabled: false, steps: 1 });
    mountainGeometry.translate(0, 0, -MOUNTAIN_DEPTH / 2);
    const capMaterial = new THREE.MeshBasicMaterial({ color: ASH });
    const sideMaterial = new THREE.MeshBasicMaterial({ color: INK });
    const mountainMesh = new THREE.Mesh(mountainGeometry, [capMaterial, sideMaterial]);
    rotationGroup.add(mountainMesh);

    // silueta negra ligeramente mayor por detrás (técnica de "casco invertido"): simula grosor de trazo.
    const outlineMaterial = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
    const outlineMesh = new THREE.Mesh(mountainGeometry, outlineMaterial);
    outlineMesh.scale.set(1.035, 1.035, 1.15);
    rotationGroup.add(outlineMesh);

    // aristas marcadas
    const edgesGeometry = new THREE.EdgesGeometry(mountainGeometry, 1);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: INK });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    rotationGroup.add(edges);

    // --- columna eruptiva ---
    const ashParticles = createEruptionParticles(1500, ASH, 0.16, 1);
    const inkParticles = createEruptionParticles(550, INK, 0.14, 2);
    const emberParticles = createEruptionParticles(140, RED, 0.15, 3, { emberBias: true, heightScale: 0.4, radiusScale: 0.6 });
    rotationGroup.add(ashParticles.points, inkParticles.points, emberParticles.points);

    const particleSets = [ashParticles, inkParticles, emberParticles];

    function renderFrame(t: number) {
      for (const set of particleSets) set.update(t);
      rotationGroup.rotation.y = Math.sin(t * BREATH_SPEED) * BREATH_MAX_RAD;
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
      capMaterial.dispose();
      sideMaterial.dispose();
      outlineMaterial.dispose();
      edgesMaterial.dispose();
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
