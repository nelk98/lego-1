import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import UnoCSS from '@unocss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss(), UnoCSS()],
  build: {
    manifest: true,
    rolldownOptions: {
      input: {
        playground: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin.html', import.meta.url)),
        client: fileURLToPath(new URL('./client.html', import.meta.url)),
      },
    },
  },
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: {
    exclude: [
      '@lego/core',
      '@lego/platform',
      '@lego/schema-form',
      '@lego/styles',
      '@lego/ui-admin',
      '@lego/ui-client',
    ],
  },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
})
