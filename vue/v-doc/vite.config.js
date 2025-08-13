import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('r-'),
        },
      },
    }),
    vueJsx({
      isCustomElement: (tag) => tag.startsWith('r-'),
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('r-'),
        },
      },
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: '1111',
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
