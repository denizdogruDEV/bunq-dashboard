import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/bunq-dashboard/', // This should match the repository name
  build: {
    outDir: 'build'
  }
})