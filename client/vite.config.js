import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/auth': 'http://127.0.0.1:5001',
      '/spotify': 'http://127.0.0.1:5001',
      '/personality': 'http://127.0.0.1:5001',
      '/playlist': 'http://127.0.0.1:5001',
    }
  }
})
