import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// No need for __dirname/__filename in frontend Vite
export default defineConfig(({ command }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: command === "serve" ? {
      "/api": {
        target: "https://ats-analyzer-resume.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    } : {},
  },
  build: {
    outDir: "dist",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": new URL("./", import.meta.url).pathname, // replace Node path usage
    },
  },
}));
