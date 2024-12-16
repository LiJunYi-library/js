#!/usr/bin/env node
const mGlobal = require("../global");
mGlobal.init();
const express = require("express");
const webpack = require("webpack");
const open = require('open');
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const WebpackDevServer = require("webpack-dev-server");
const fs = require("fs");
const { findFiles } = require("../utils/file");
const path = require("path");
const webpackConfig = require("../config");
const { configSetCss } = require("../loader/css");
const { configSetImg } = require("../loader/img");
const { configSetFont } = require("../loader/font");
const { merge } = require("webpack-merge");

// function dynamicWebpackConfig(config = {}) {
//   const newWebpackConfig = merge({}, webpackConfig);
//   newWebpackConfig.entry[1] = config.entry;
//   newWebpackConfig.output.path = config.output;
//   // newWebpackConfig.output.filename = `js/${config.name}_[name].js`;
//   return newWebpackConfig;
// }

// console.log("-----webpackConfig-------", JSON.stringify(webpackConfig));
const pagesOptions = {};
console.log(">>>>>>>>");
console.log(mGlobal.path.pages);

const files = findFiles(mGlobal.path.pages, /main\.(js|ts|jsx|tsx)$/);
console.log(files);

const app = express();
const port = 3333;

app.use(express.static(path.resolve("/build")));

for (const key in files) {
  const serverItem = files[key];
  app.get(serverItem.serverPath, (req, res) => {
    console.log("");
    console.log("--------------------------", serverItem.serverPath);

    if (!serverItem.compiler) {
      serverItem.title = serverItem.name;
      const newWebpackConfig = webpackConfig(serverItem);
      configSetFont(newWebpackConfig);
      configSetImg(newWebpackConfig);
      configSetCss(newWebpackConfig);

      console.log("newWebpackConfig");
      console.log(newWebpackConfig);
      serverItem.compiler = webpack(newWebpackConfig);

      app.use(
        webpackDevMiddleware(serverItem.compiler, {
          publicPath: newWebpackConfig.output.publicPath,
          writeToDisk: true,
          stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false,
          },
        }),
      );
      app.use(webpackHotMiddleware(serverItem.compiler));

      serverItem.compiler.hooks.done.tap("done", () => {
        if( serverItem.firstdone ) return
        const indexPath = path.join(serverItem.output, "index.html");
        console.log("-----done --sendFile---html----------------", indexPath);
        res.sendFile(indexPath);
        serverItem.firstdone = true
      });

    } else {
      try {
        const indexPath = path.join(serverItem.output, "index.html");
        console.log("-----------html---------------", indexPath);
        res.sendFile(indexPath);
      } catch (error) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(serverItem));
      }
    }
  });
}

// 启动服务器
app.listen(port, () => {
  open(`http://localhost:${port}`);
  console.log(`Server is running on http://localhost:${port}`);
});
