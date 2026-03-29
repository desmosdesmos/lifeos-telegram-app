import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './',
  define: {
    'import.meta.env.VITE_TELEGRAM_BOT_TOKEN': JSON.stringify(process.env.VITE_TELEGRAM_BOT_TOKEN || ''),
    'import.meta.env.VITE_TELEGRAM_ADMIN_ID': JSON.stringify(process.env.VITE_TELEGRAM_ADMIN_ID || ''),
  },
})
