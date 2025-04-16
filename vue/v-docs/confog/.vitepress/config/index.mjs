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
              text: "基础组件",
              items: [
                { text: "button", link: "/element/layout/grid" },
                { text: "img", link: "/element/layout/flex" },
                { text: "a", link: "/element/layout/scroll" }
              ],
            },
            {
              text: "布局",
              items: [
                { text: "指南", link: "/element/layout/handbook" },
                { text: "absolute", link: "/element/layout/grid" },
                { text: "column", link: "/element/layout/scroll" },
                { text: "falls", link: "/element/layout/falls" },
                { text: "flex", link: "/element/layout/flex" },
                { text: "grid", link: "/element/layout/grid" },
                { text: "move", link: "/element/layout/scroll" },
                { text: "row", link: "/element/layout/scroll" },
                { text: "transition", link: "/element/layout/scroll" },
              ],
            },
            {
              text: "滚动布局",
              items: [
                { text: "指南", link: "/element/layout/handbook" },
                { text: "scroll", link: "/element/layout/grid" },
                { text: "nested-scroll", link: "/element/layout/flex" },
                { text: "refresh", link: "/element/layout/falls" },
                { text: "scroll-refresh", link: "/element/layout/falls" },
                { text: "scroll-memory-bable", link: "/element/layout/scroll" },
                { text: "scroll-sticky", link: "/element/layout/scroll" },
                { text: "scroll-fixed", link: "/element/layout/scroll" },
                { text: "scroll-flotage", link: "/element/layout/scroll" },
                { text: "scroll-top", link: "/element/layout/scroll" },
                { text: "scroll-page", link: "/element/layout/scroll" },
              ],
            },
            { 
              text: "表单组件",
              items: [
                { text: "Calendar 日历", link: "/element/data/rolling-text" },
                { text: "Cascader 级联选择", link: "/element/data/rolling-text" },
                { text: "Checkbox 复选框", link: "/element/data/rolling-text" },
                { text: "DatePicker 日期选择 ", link: "/element/data/rolling-text" },
                { text: "input ", link: "/element/data/rolling-text" },

             
              ],
            },
            {  
              text: "数据",
              items: [
                { text: "rolling-text", link: "/element/data/rolling-text" },
                { text: "Badge", link: "/element/data/rolling-text" },
                { text: "Circle", link: "/element/data/rolling-text" },
              ],
            },
            { //Collapse
              text: "list",
              items: [
                { text: "tabs", link: "/element/list/rolling-text" },
                { text: "swiper", link: "/element/list/rolling-text" },
              ],
            },
            { //SwipeCell 
              text: "反馈",
              items: [
                { text: "message", link: "/element/list/rolling-text" },
                { text: "notification", link: "/element/list/rolling-text" },
                { text: "NoticeBar", link: "/element/list/rolling-text" },
                { text: "Toast", link: "/element/list/rolling-text" },
              ],
            },
            {   
              text: "交互",
              items: [
                { text: "dialog", link: "/element/list/rolling-text" },
                { text: "popover", link: "/element/list/rolling-text" },
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
