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
})
