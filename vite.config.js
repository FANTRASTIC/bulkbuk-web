import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const PORT = parseInt(env.PORT || '3000')

  return {
    plugins: [react()],
    base: mode === 'production' ? './' : '/',
    server: {
      port: PORT,
      strictPort: false,
      host: true,
      cors: true,
      open: true,
      proxy: {
        '/api': {
          target: `http://localhost:${PORT + 1}`,
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: 'terser'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
