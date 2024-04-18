import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pluginChecker from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pluginChecker({ typescript: true }),nodePolyfills(),],
})
