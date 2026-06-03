import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from 'path' 

// vite.config.js
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./vitest.setup.js",
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    router: ["react-router-dom"],
                    forms: ["react-hook-form", "@hookform/resolvers", "zod"],
                    admin: ["@tanstack/react-table", "@uiw/react-json-view", "dayjs"],
                    animations: ["gsap"],
                },
            },
        },
    },
    server: {
        host: true,
        port: 5173,
        proxy: {
            "/api": {
                target: "http://backend:3000",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
})
