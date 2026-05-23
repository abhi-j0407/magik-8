import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { VitePWA } from 'vite-plugin-pwa';

const useHttps = process.env.VITE_HTTPS === 'true';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(useHttps ? [basicSsl()] : []),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/.*(?:three|OracleScene|fiber|drei|postprocessing).*\.js$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'webgl-vendor-chunks',
              expiration: {
                maxEntries: 24,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Magik 8',
        short_name: 'Magik 8',
        description: 'Ask a yes/no question, shake, reveal the oracle.',
        theme_color: '#1a1a20',
        background_color: '#1a1a20',
        display: 'standalone',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
