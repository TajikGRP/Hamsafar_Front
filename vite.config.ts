import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed backend (Render). Override with VITE_PROXY_TARGET in .env.local,
// e.g. VITE_PROXY_TARGET=http://127.0.0.1:8080 to use a local Spring server.
const DEFAULT_BACKEND = 'https://hamsafar-back-jarw.onrender.com'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        // Forward /api calls to the Spring Boot backend during development
        '/api': {
          target: env.VITE_PROXY_TARGET || DEFAULT_BACKEND,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
