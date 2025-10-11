import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "../server/index.js";
import { fileURLToPath } from "url";

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      // Allow project root and server folder so the client can import server/shared during dev
      allow: [
        __dirname,
        path.resolve(__dirname, ".."), // project root
        path.resolve(__dirname, "../server"),
      ],
      proxy: {
        "/api": {
        target: "",
        changeOrigin: true,
        secure: false,
      },
    },
      deny: [
        ".env",
        ".env.*",
        "*.{crt,pem}",
        "**/.git/**",
      ],
    },
  },
  build: {
    outDir: "dist",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@shared": path.resolve(__dirname, "../server/shared"),
    },
  },
}));

function expressPlugin() {
  return {
    name: "express-plugin",
    apply: "serve", // Only during dev
    configureServer(server) {
      const app = createServer();
      // Attach your Express app to Vite's dev server
      server.middlewares.use(app);
    },
  };
}
