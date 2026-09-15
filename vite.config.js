/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Defaults to root (works for Vercel / custom domains / local dev).
// The GitHub Pages workflow sets VITE_BASE=/hello-portfolio/ for project-site
// deploys.
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split the big, rarely-changing libraries out of the app bundle so a
        // repeat visitor only re-downloads the small app chunk after each deploy
        // (React & Supabase stay cached). App data (sprites/themes/codes) stays in
        // the app chunk; heavy tabs/modals/changelog are already lazy-loaded.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@supabase')) return 'supabase'
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|use-sync-external-store)[\\/]/.test(id)) return 'react-vendor'
          return 'vendor'
        },
      },
    },
  },
})
