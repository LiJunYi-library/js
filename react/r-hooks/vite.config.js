import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./index.js",
      name: "rainbow",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "@rainbow_ljy/rainbow-js"],
      output: {
        dir: "build/esm",
        entryFileNames: "index.js",
        sourcemap: true,
        globals: {
          vue: "react",
        },
      },
    },
  },
  plugins: [],
});
