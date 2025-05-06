import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.js",
      name: "rainbow",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "vue",
        "@rainbow_ljy/rainbow-element",
        "@rainbow_ljy/rainbow-js",
        "@rainbow_ljy/v-hooks",
      ],
      output: {
        dir: "build/esm",
        entryFileNames: "index.js",
        sourcemap: true,
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("r-"),
        },
      },
    }),
    vueJsx({
      isCustomElement: (tag) => tag.startsWith("r-"),
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("r-"),
        },
      },
    }),
  ],
});
