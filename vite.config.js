// Update vite.config.js to:
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add the tailwind plugin
  ],
  optimizeDeps: {
    include: ["lodash-es", "lucide-react"],
  },
});
