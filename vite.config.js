import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
        about: './about.html',
        contact: './contact.html',
        services: './services.html'
      }
    }
  },
  server: {
    port: 3000,
    // Disable auto-open to avoid Windows spawn EPERM errors
    open: false
  }
})
