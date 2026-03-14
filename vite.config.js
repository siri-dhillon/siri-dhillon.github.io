import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Correct for custom domains
  server: {
    historyApiFallback: true, // Helps with React Router refresh issues
  }
})
