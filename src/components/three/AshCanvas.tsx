import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { attachAnimationLifecycle } from './animationLifecycle';
import { createSquareTexture, makePRNG } from './squareTexture';

/**
 * Fondo sutil de ceniza cayendo, pensado para colocar detrás de una cabecera
 * oscura (posicionar el contenedor con CSS: position absolute/inset 0, z-index
 * bajo el contenido). Partículas cuadradas, color ceniza con alfa, caída muy
 * lenta y determinista. No se integra todavía en ninguna página.
 */

const ASH = '#6b6b6b';
const COUNT = 420;
const HALF_HEIGHT = 1; // unidades de mundo de la cámara ortográfica
const FALL_SPEED_MIN = 0.02;
const FALL_SPEED_MAX = 0.045;
const SWAY_AMOUNT = 0.05;
const STATIC_TIME = 4;

export default function AshCanvas({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    // fondo transparente: se ve lo que haya detrás (la cabecera oscura)
    const camera = new THREE.OrthographicCamera(-1, 1, HALF_HEIGHT, -HALF_HEIGHT, 0.1, 10);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const rand = makePRNG(7);
    const baseX = new Float32Array(COUNT);
    const speed = new Float32Array(COUNT);
    const phase = new Float32Array(COUNT);
    const swaySeed = new Float32Array(COUNT);
    const swayFreq = new Float32Array(COUNT);

    const WORLD_HALF_WIDTH = 2.4; // cubre pantallas anchas; el frustum recorta el resto
    for (let i = 0; i < COUNT; i++) {
      baseX[i] = (rand() * 2 - 1) * WORLD_HALF_WIDTH;
      speed[i] = FALL_SPEED_MIN + rand() * (FALL_SPEED_MAX - FALL_SPEED_MIN);
      phase[i] = rand();
      swaySeed[i] = rand() * Math.PI * 2;
      swayFreq[i] = 0.15 + rand() * 0.25;
    }

    const positions = new Float32Array(COUNT * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const texture = createSquareTexture(ASH);
    const material = new THREE.PointsMaterial({
      size: 0.03,
      map: texture,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      color: 0xffffff,
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    const totalRange = HALF_HEIGHT * 2 + 0.4;
    const top = HALF_HEIGHT + 0.2;

    function updatePositions(t: number) {
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        const fall = (t * speed[i] + phase[i] * totalRange) % totalRange;
        const y = top - fall;
        const x = baseX[i] + Math.sin(t * swayFreq[i] + swaySeed[i]) * SWAY_AMOUNT;
        const idx = i * 3;
        positions[idx] = x;
        positions[idx + 1] = y;
        positions[idx + 2] = 0;
      }
      posAttr.needsUpdate = true;
    }

    function renderFrame(t: number) {
      updatePositions(t);
      renderer.render(scene, camera);
    }

    const cleanupLifecycle = attachAnimationLifecycle(container, {
      onFrame: renderFrame,
      onResize: (width, height) => {
        const aspect = width / height;
        const halfWidth = HALF_HEIGHT * aspect;
        camera.left = -halfWidth;
        camera.right = halfWidth;
        camera.top = HALF_HEIGHT;
        camera.bottom = -HALF_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        renderer.render(scene, camera);
      },
      renderStaticFrame: () => renderFrame(STATIC_TIME),
    });

    return () => {
      cleanupLifecycle();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', pointerEvents: 'none' }}
    />
  );
}
