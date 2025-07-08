import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 匹配以 /api 开头的请求
      '/api': {
        target: 'http://localhost:3000', // NestJS 后端服务地址
        changeOrigin: true,              // 修改请求头中的 origin
        // rewrite: path => path.replace(/^\/api/, '') // 可选：重写路径
      }
    }
  }
})
