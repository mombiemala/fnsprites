import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed as a GitHub Pages *project* site at /hello-portfolio/.
// Override with VITE_BASE='/' for root deployments (e.g. Vercel/custom domain).
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/hello-portfolio/',
  plugins: [react()],
})
