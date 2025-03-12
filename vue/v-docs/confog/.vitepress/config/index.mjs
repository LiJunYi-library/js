import { defineConfig } from "vitepress";

import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('r-'),
        },
      },
    }),
    vueJsx(),
    vueDevTools(),
  ],
  title: "rainbow view vue view",
  description: "a vue and web Component views",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "组件", link: "/element/index" },
      { text: "例子", link: "/examples/index" },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],

    sidebar: {
      "/element/": [
        {
          items: [
            {
              text: "布局",
              items: [
                { text: "指南", link: "/element/layout/handbook" },
                { text: "grid", link: "/element/layout/grid" },
                { text: "flex", link: "/element/layout/flex" },
                { text: "falls", link: "/element/layout/falls" },
                { text: "row", link: "/element/layout/scroll" },
                { text: "column", link: "/element/layout/scroll" }
              ],
            },
            {
              text: "滚动布局",
              items: [
                { text: "指南", link: "/element/layout/handbook" },
                { text: "scroll", link: "/element/layout/grid" },
                { text: "nested-scroll", link: "/element/layout/flex" },
                { text: "scroll-refresh", link: "/element/layout/falls" },
                { text: "scroll-memory-bable", link: "/element/layout/scroll" },
                { text: "scroll-sticky", link: "/element/layout/scroll" },
                { text: "scroll-fixed", link: "/element/layout/scroll" },
                { text: "scroll-flotage", link: "/element/layout/scroll" },
                { text: "scroll-top", link: "/element/layout/scroll" },
              ],
            },
            {
              text: "数据",
              items: [
                { text: "rolling-text", link: "/element/data/rolling-text" },
              ],
            },
            {
              text: "list",
              items: [
                { text: "rolling-text", link: "/element/list/rolling-text" },
              ],
            },
          ],
        },
      ],
      "/examples/": [
        {
          text: "Examples",
          items: [
            { text: "Markdown Examples", link: "/examples/index" },
            { text: "Runtime API Examples", link: "/examples/api" },
          ],
        },
      ],
    },
  },
});
