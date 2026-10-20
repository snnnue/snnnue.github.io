import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build`        → normal build for GitHub Pages (dist/)
// `npm run build:single` → one self-contained HTML file (for previews)
export default defineConfig(({ mode }) => ({
  base: "/",
  plugins: mode === "single" ? [react(), viteSingleFile()] : [react()],
  build: mode === "single"
    ? { outDir: "dist-single", assetsInlineLimit: 100000000 }
    : { outDir: "dist" },
}));
