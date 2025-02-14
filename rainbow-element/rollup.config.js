
import resolve from '@rollup/plugin-node-resolve'; // 使 Rollup 能够查找外部模块
import commonjs from '@rollup/plugin-commonjs'; // 将 CommonJS 转换为 ES6 模块
import { terser } from 'rollup-plugin-terser'; // 压缩 JavaScript 代码
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
    input: 'src/index.js', // 入口文件
    // output: [
    //     {
    //         file: 'index.esm.js',
    //         format: 'esm',
    //         sourcemap: true
    //     },
    //     {
    //         file: 'index.js',
    //         format: 'esm',
    //         name: 'rainbowElement',
    //         sourcemap: true
    //     },
    //     {
    //         file: 'index.main.js',
    //         format: 'iife',
    //         name: 'rainbowElement',
    //         sourcemap: true
    //     },
    // ],
    output: {
      file: 'dist/bundle.js', // 输出文件
      format: 'es' // 输出格式
    },
    plugins: [
        resolve(), // 查找外部模块
        commonjs(), // 将 CommonJS 转换为 ES6 模块
        terser(),// 压缩代码
        postcss({
            extract: true, // 提取 CSS 到单独的文件
            extract: 'index.css', // 指定输出文件名
            modules: false, // 如果你使用 CSS Modules，设置为 true
            plugins: [ // 配置 PostCSS 插件
                cssnano({ // 使用 cssnano 压缩 CSS
                    preset: 'default' // 使用默认压缩配置
                })
            ]
        }),
        serve({
          contentBase: 'dist', // 静态文件目录
          port: 3000, // 端口号
          open: true // 自动打开浏览器
        }),
        livereload({ watch: 'dist' }) // 监听 dist 文件夹并触发重载
    ]
};
