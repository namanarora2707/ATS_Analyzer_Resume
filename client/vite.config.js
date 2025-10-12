import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command }) => ({
  server: {
    host: "::",
    port: 8080,
    // ✅ Proxy ONLY during local development
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

  plugins: [react()], // ✅ Only React plugin; no Backend loading

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      // 🚨 Removed @shared and ../server imports to avoid backend bundling
    },
  },
}));
