import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      'https://spu-test.manmanbuy.com': {
        target: 'https://spu-test.manmanbuy.com',
        changeOrigin: true,
      },
      'http://120.24.174.221:31300': {
        target: 'http://120.24.174.221:31300',
        changeOrigin: true,
      },
    },
  },
})
