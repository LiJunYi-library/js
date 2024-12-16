const mGlobal = require("../global");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const isDevelopment = process.env.NODE_ENV !== "production";

const webpackConfig = (config = {}) => ({
  entry: ["webpack-hot-middleware/client", config.entry || mGlobal.path.entry],
  output: {
    path: config.output || mGlobal.path.output,
    filename: `js/${config.name}_[name].js`,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: true,
        },
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@vue/cli-plugin-babel/preset"],
          },
        },
      },
      {
        test: /\.(vue)$/,
        loader: "vue-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: config.title || "自定义",
      template: mGlobal.path.html,
      inject: true,
      templateParameters: {
        NODE_ENV: "哈哈哈哈哈哈哈哈哈哈",
        title: "哈哈哈哈哈哈哈哈哈哈",
      },
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      "process.env": { NODE_ENV: '"development"' },
    }),
  ].filter(Boolean),
  mode: "development",
  devtool: "cheap-module-source-map",
  resolve: {
    alias: {
      "@": mGlobal.path.src,
    },
    extensions: [".vue", ".js", ".jsx", ".json"],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
    usedExports: true,
  },
  devServer: {
    host: "localhost",
    open: true,
    hot: true,
    historyApiFallback: true,
  },
  performance: false,
});

module.exports = webpackConfig;
