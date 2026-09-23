import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['logomax.png', 'logo.png', 'bg2.png', 'bg100.png', 'bg99.png', 'pirates_theme.mp3'],
        manifest: {
          id: '/',
          name: 'Agent-sigma08',
          short_name: 'Agent08',
          description: 'Agent-sigma08 — Next-generation Intelligent AI Operating System with autonomous workflow execution.',
          theme_color: '#080204',
          background_color: '#080204',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/logomax.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/logomax.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/logomax.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/logo.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/logo.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ],

    // GitHub Pages
    base: './',

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',

      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
