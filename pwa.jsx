import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // <-- CRITICAL: tells Vite that this app is hosted at /input/
  base: '/input/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        // Keep the PWA scoped to /input so refresh/install deep links work
        id: '/input/',
        scope: '/input/',
        start_url: '/input/',
        name: 'Attendance Monitoring System',
        short_name: 'Attendance',
        description: 'A web-based attendance system for college.',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      // Make SPA refreshes under /input/* fall back to the app entry
      workbox: {
        navigateFallback: '/input/index.html',
        // Don’t hijack API or dev sockets
        navigateFallbackDenylist: [/^\/api\//, /^\/sockjs\//]
      }
    })
  ]
});
