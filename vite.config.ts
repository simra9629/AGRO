import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    port: 3000,
  },

  plugins: [
    tsconfigPaths(),

    tanstackStart(),

    react(),

    tailwindcss(),

    VitePWA({
      // Auto-update: silently installs the new SW and reloads when ready
      registerType: "autoUpdate",

      // Let VitePWA inject the registration script itself
      injectRegister: "auto",

      // Run workbox in GenerateSW mode (VitePWA manages the SW file)
      strategies: "generateSW",

      includeAssets: [
        "pwa-192x192.png",
        "pwa-512x512.png",
        "favicon.ico",
      ],

      manifest: {
        name: "AGRO — AI Farming Companion",
        short_name: "AGRO",
        description:
          "AI-powered, multilingual agricultural assistant for crop guidance, disease scanning, weather and government schemes.",
        theme_color: "#16a34a",
        background_color: "#f0fdf4",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        scope: "/",
        lang: "en",
        categories: ["agriculture", "utilities", "productivity"],
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            // maskable variant lets Android adaptive icons crop correctly
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        // Precache everything vite builds — app shell, JS, CSS
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],

        // Don't precache TF.js model shards — they are huge and loaded on demand
        globIgnores: [
          "**/graph_model*",
          "**/mobilenet*",
          "**/*.map",
        ],

        runtimeCaching: [
          // App navigation: network-first with offline fallback to cached shell
          {
            urlPattern: ({ request }) =>
              request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "agro-pages",
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [200] },
            },
          },

          // Fonts: cache-first, long TTL
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "agro-fonts",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // Weather API: network-first, 30-min cache so offline shows last data
          {
            urlPattern: /^https:\/\/api\.weatherapi\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "agro-weather",
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 30 },
              cacheableResponse: { statuses: [200] },
            },
          },

          // Open-Meteo fallback: same policy
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "agro-open-meteo",
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 30 },
              cacheableResponse: { statuses: [200] },
            },
          },

          // Open-Meteo reverse geocoding
          {
            urlPattern: /^https:\/\/geocoding-api\.open-meteo\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "agro-geocoding",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // TF.js model shards: cache-first once downloaded (they never change)
          {
            urlPattern: /^https:\/\/tfhub\.dev\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "agro-tfjs-models",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 90,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // Opaque cross-origin requests (CDN assets etc.)
          {
            urlPattern: ({ url }) =>
              url.origin !== self.location.origin &&
              !url.hostname.includes("groq") &&
              !url.hostname.includes("plant.id") &&
              !url.hostname.includes("data.gov.in"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "agro-cross-origin",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],

        // Clean up old caches from previous SW versions
        cleanupOutdatedCaches: true,

        // Skip waiting so updates apply immediately on next load
        skipWaiting: true,
        clientsClaim: true,
      },

      devOptions: {
        // Enable SW in dev so you can test installability locally
        enabled: true,
        type: "module",
      },
    }),
  ],

  build: {
    chunkSizeWarningLimit: 1000,
  },
});
