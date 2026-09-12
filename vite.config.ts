import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  base: '/pompei-guide/',
  define: { __BUILD_TIME__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC') },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['img/**/*', 'icons/*'],
      manifest: {
        name: 'POMPEI — Guía de visita',
        short_name: 'POMPEI',
        description: 'Guía brutalista para preparar y recorrer el Parque Arqueológico de Pompei.',
        theme_color: '#111111',
        background_color: '#f2efe6',
        display: 'standalone',
        start_url: '/pompei-guide/',
        scope: '/pompei-guide/',
        lang: 'es',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // "json" cubre public/geo/park-buildings.json y park-streets.json (capas propias
        // del parque, ver src/lib/mapStyle.ts) para que el mapa funcione sin conexión.
        globPatterns: ['**/*.{js,mjs,css,html,svg,png,jpg,webp,woff2,json}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tiles\.openfreemap\.org\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'ofm-tiles', expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 90 }, cacheableResponse: { statuses: [0, 200] } }
          }
        ]
      }
    })
  ]
});
