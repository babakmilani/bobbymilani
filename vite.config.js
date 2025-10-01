// vite.config.js
import { defineConfig } from 'vite'

// **IMPORTANT:** Replace 'your-repo-name' with the EXACT name of your GitHub repository.
const repoName = '/bobbymilani/';

export default defineConfig({
    // This tells Vite to prefix all asset paths (CSS, JS, images) with the repo name.
    base: repoName,

    // You can set the output directory to 'docs' to use that folder for deployment
    build: {
        outDir: 'docs', // <-- Change this to 'docs' or 'dist' as you prefer.
    }
})