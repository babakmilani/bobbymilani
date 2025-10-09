// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/',
    
    build: {
        outDir: '/',  // Build to dist folder
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'index.html',
                about: 'about-me.html',
                chinaTravel: 'videos/china-travel-tips.html'
            }
        }
    }
})