import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "node:path";

export default defineConfig(({ command }) => ({
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    allowedHosts: true,
  },
  resolve: {
    alias: { "@": path.resolve(process.cwd(), "src") },
    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({ server: { entry: "server" } }),
    viteReact(),
    ...(command === "build"
      ? [cloudflare({ viteEnvironment: { name: "ssr" } })]
      : []),
  ],
}));
