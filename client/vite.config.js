import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🚨 Import Express server ONLY in development
let expressPlugin = () => ({ name: "noop-plugin" });
if (process.env.NODE_ENV === "development") {
  const { createServer } = await import("../server/index.js");
  expressPlugin = function () {
    return {
      name: "express-plugin",
      apply: "serve",
      configureServer(server) {
        const app = createServer();
        server.middlewares.use(app);
      },
    };
  };
}

export default defineConfig(({ command }) => ({
  server: {
    host: "::",
    port: 8080,
    // ✅ Proxy only for local dev — Vercel will not use this
    proxy: command === "serve" ? {
      "/api": {
        target: "https://ats-analyzer-resume.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    } : {},
    fs: {
      allow: [
        __dirname,
        path.resolve(__dirname, ".."),
        path.resolve(__dirname, "../server"),
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
  build: {
    outDir: "dist",
  },
  // ✅ Only load Express plugin in development, not in Vercel build
  plugins: command === "serve" ? [react(), expressPlugin()] : [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@shared": path.resolve(__dirname, "../server/shared"),
    },
  },
}));
