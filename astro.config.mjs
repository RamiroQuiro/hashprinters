// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import node from "@astrojs/node";

export default defineConfig({
  server: {
    port: 1234,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [react()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
