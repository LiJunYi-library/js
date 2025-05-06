export default {
  presets: [
    ['@babel/preset-env', {
      targets: {
        esmodules: true, // 目标是支持 ES 模块环境
      },
    }],
  ],
  plugins: [
    '@vue/babel-plugin-jsx',
  ],
};