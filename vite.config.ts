import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { mockPlugin } from './mock-plugin'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const mockEnabled = command === 'serve' && process.env.MOCK !== 'none'

  const config: UserConfig = {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      vue(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'fullcalendar': [
              '@fullcalendar/core',
              '@fullcalendar/interaction',
              '@fullcalendar/timegrid',
            ],
          },
        },
      },
    },
  }

  if (mockEnabled) {
    config.plugins.push(mockPlugin())
  } else {
    config.server = {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5001',
        },
      },
    }
  }

  return config
})
