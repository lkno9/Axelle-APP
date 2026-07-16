import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: { port: 5174 },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "KAIROS — Organize today, elevate tomorrow",
        short_name: "KAIROS",
        description: "Maîtrise ton temps, crée ta vie.",
        lang: "fr",
        display: "standalone",
        background_color: "#0b1020",
        theme_color: "#0b1020",
        icons: [
          { src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }
        ]
      }
    })
  ]
});
