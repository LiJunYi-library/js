import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import copy from "rollup-plugin-copy";
import vue from 'rollup-plugin-vue';
import autoprefixer from 'autoprefixer';
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/index.js', // 根据实际情况调整入口文件路径
  output: [
    {
      input: 'src/index.js',
      file: 'build/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
    // {
    //   input: 'src/main.js',
    //   file: 'build/iife/index.js',
    //   format: 'iife',
    //   name: 'rainbowElement',
    //   sourcemap: true,
    //   globals: {
    //     vue: 'Vue' // 告诉 Rollup，在全局环境中，vue 对应的是 window.Vue
    //   }
    // },
  ],
  plugins: [
    postcss({
      extract: true, // 提取 CSS 到单独的文件
      minimize: true, // 压缩 CSS
      extract: "main.css",
      modules: false, // 如果使用 CSS Modules，设置为 true
      extensions: ['.css', '.scss'], // 支持的文件扩展名
      use: [
        ['sass', { includePaths: ['./src/styles'] }], // 配置 SASS
      ],
      plugins: [
        autoprefixer(), // 自动添加浏览器前缀
        cssnano({  preset: 'default'  }),
      ],
    }),
    vue({
      target: 'browser',
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('r-'),
        },
      },
    }),
    commonjs(),
    babel({
      extensions: ['.js', '.jsx', '.vue'],
      include: ['src/**/*'],
    }),
  ],
};
