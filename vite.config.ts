import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The repository is expected to be named "vibe-generator" on GitHub.
// Change this when deploying under a different repository name.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/vibe-generator/' : '/',
  plugins: [react()],
}))
