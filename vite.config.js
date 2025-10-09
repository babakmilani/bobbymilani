// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    base: '/',

    build: {
        outDir: 'docs',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about-me.html'),
                privacy: resolve(__dirname, 'privacy-policy.html'),
                terms: resolve(__dirname, 'terms-of-use.html'),
                // Add all your video HTML files here
                chinaTravel: resolve(__dirname, 'videos/china-travel-tips.html'),
                denmarkCitizenship: resolve(__dirname, 'videos/denmark-citizenship.html'),
                lifeWithJudy: resolve(__dirname, 'videos/life-with-judy.html'),
                whiteManBlackKid: resolve(__dirname, 'videos/white-man-raising-black-kid.html'),
                copenhagenSquare: resolve(__dirname, 'videos/copenhagen-nørrebro-red-square.html'),
                dayInLife: resolve(__dirname, 'videos/day-in-the-life-tobi.html'),
            }
        }
    }
})