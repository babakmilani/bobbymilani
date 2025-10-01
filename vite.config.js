// vite.config.js
import { defineConfig } from 'vite'

// **IMPORTANT:** For custom domains (like bobbymilani.com), use base: '/'
// Only use '/repo-name/' if using GitHub Pages default URL (username.github.io/repo-name)

export default defineConfig({
    // For custom domain: use root path
    base: '/',
    
    build: {
        outDir: 'docs',
    }
})