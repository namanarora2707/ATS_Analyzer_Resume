import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

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
      "@": new URL("./", import.meta.url).pathname,
    },
  },
}));
