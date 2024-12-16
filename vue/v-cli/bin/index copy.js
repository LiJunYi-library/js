#!/usr/bin/env node
const mGlobal = require("../global");
mGlobal.init();
const express = require("express");
const webpack = require("webpack");
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
configSetFont(webpackConfig);
configSetImg(webpackConfig);
configSetCss(webpackConfig);

function dynamicWebpackConfig(config = {}) {
  const newWebpackConfig = merge({}, webpackConfig);
  newWebpackConfig.entry[1] = config.entry;
  newWebpackConfig.output.path = config.output;
  // newWebpackConfig.output.filename = `js/${config.name}_[name].js`;
  return newWebpackConfig;
}

console.log("-----webpackConfig-------", JSON.stringify(webpackConfig));
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
      const newWebpackConfig = dynamicWebpackConfig(serverItem);
      serverItem.compiler = webpack(newWebpackConfig);
      app.use(
        webpackDevMiddleware(serverItem.compiler, {
          publicPath: newWebpackConfig.output.publicPath,
          // writeToDisk: true,
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
        const indexPath = path.join(serverItem.output, "index.html");
        console.log("----------html----------------", indexPath);
        res.sendFile(indexPath);
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
  console.log(`Server is running on http://localhost:${port}`);
});

// // const routes: any[] = [];
// files.keys().forEach((filePath) => {
// //   const name = file.replace(/\.\/([^]*?)\.(vue|tsx|jsx)/g, "$1");
// console.log(filePath);

// })

// const app = express();
// const compiler = webpack(webpackConfig);

// // 使用 webpack-dev-middleware
// app.use(
//   webpackDevMiddleware(compiler, {
//     publicPath: webpackConfig.output.publicPath,
//     stats: {
//       colors: true,
//       hash: false,
//       timings: true,
//       chunks: false,
//       chunkModules: false,
//       modules: false,
//     },
//   }),
// );

// // 使用 webpack-hot-middleware
// app.use(webpackHotMiddleware(compiler));

// // 指定静态文件目录
// // app.use(express.static(path.resolve("public")));
// app.use(express.static(path.resolve("dist")));

// // 处理所有其他请求
// app.get("*", (req, res) => {
//   const indexPath = path.resolve("dist", "index.html");
//   res.sendFile(indexPath);
// });

// // 启动服务器
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });

// const compiler = webpack(webpackConfig);
// const server = new WebpackDevServer(webpackConfig.devServer, compiler);
// server.start();

// const app = express();
// const port = 3333;
// let isFirst = true;

// // 缓存编译器实例
// const compilerCache = {};
// // 提供静态文件
// app.use(express.static(path.resolve("dist")));

// // 按需编译中间件
// function lazyCompileMiddleware(req, res, next) {
//   const pageName = "index1"; // 从 URL 中提取页面名称
//   console.log(">>>>>>>>>>>>>>>>>>>>>>>pageName", pageName);

//   // 如果缓存中已经有该页面的编译器实例，直接使用
//   if (compilerCache[pageName]) {
//     console.log(">>>>>>>>>> 缓存有name>>>>>>>>>>>>>pageName", pageName);
//     compilerCache[pageName].lastAccessed = Date.now(); // 更新最后访问时间
//     return next();
//   }

//   // 初始化 Webpack 编译器
//   const compiler = webpack(webpackConfig);

//   // 将编译器实例缓存起来
//   compilerCache[pageName] = compiler;
//   compiler.lastAccessed = Date.now(); // 记录最后访问时间

//   // 使用 webpack-dev-middleware 处理该页面的编译
//   const middleware = webpackDevMiddleware(compiler, {
//     publicPath: "/",
//     writeToDisk: true,
//   });
//   app.use(middleware);

//   // 使用 webpack-hot-middleware
//   app.use(webpackHotMiddleware(compiler,{
//     publicPath: "/",
//     writeToDisk: true,
//   }));
//   console.log(">>>>>>>>>> 缓存没有  编译结束 next>>>>>>>>>>>>>");
//   // 继续处理请求
//   compiler.hooks.done.tap("done", () => {
//     console.log(">>>>>>>>>>>>>>>> compiler.hooks.done.tap(done");
//     try {
//       console.log(">>>>>>>>>更新>>>>>>>>>>>>>更新>>>>>>>>>>>>>>>更新>>>>>>>>>>更新>>>>>>>>");

//         const indexPath = path.resolve("dist", "index.html");
//         res.sendFile(indexPath);

//     } catch (error) {}
//   });

//   // next();
// }

// app.get("/index1.html", lazyCompileMiddleware, (req, res) => {
//   // const compiler = webpack(webpackConfig);
//   // const middleware = webpackDevMiddleware(compiler, {
//   //   publicPath: "/",
//   //   writeToDisk: true,
//   // });
//   // app.use(middleware);
//   // app.use(webpackHotMiddleware(compiler));
//   // compiler.hooks.done.tap("done", () => {
//   //   try {
//   //     console.log(">>>>>>>>>更新>>>>>>>>>>>>>更新>>>>>>>>>>>>>>>更新>>>>>>>>>>更新>>>>>>>>");
//   //     const indexPath = path.resolve("dist", "index.html");
//   //     res.sendFile(indexPath);
//   //   } catch (error) {}
//   // });
//   //   const compiler =  compilerCache['index1'];
//   //  if(compiler) console.log( "有有有有有有有有有有有有有有有有有 compiler"     );
//   // compiler.hooks.done.tap("done", () => {
//   // try {
//   //   console.log(">>>>>>>>>更新>>>>>>>>>>>>>更新>>>>>>>>>>>>>>>更新>>>>>>>>>>更新>>>>>>>>");
//   //   const indexPath = path.resolve("dist", "index.html");
//   //   res.sendFile(indexPath);
//   // } catch (error) {}
//   // });
// });

// app.get("/index2.html", (req, res) => {
//   const compiler = webpack(webpackConfig2);
//   const middleware = webpackDevMiddleware(compiler, {
//     publicPath: "/",
//     writeToDisk: true,
//   });
//   app.use(middleware);
//   compiler.hooks.done.tap("done", () => {
//     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//     const indexPath = path.resolve("dist", "index.html");
//     res.sendFile(indexPath);
//   });
// });

// // 启动服务器
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// // const minimist = require("minimist");
// // const Service = require("../config/service");
// // const args = process.argv.slice(2);
// // const arguments = minimist(process.argv, {
// //   boolean: [
// //     "modern",
// //     "report",
// //     "report-json",
// //     "inline-vue",
// //     "watch",
// //     "open",
// //     "copy",
// //     "https",
// //     "verbose",
// //     "frame",
// //   ],
// //   string: ["mode"],
// // });
// // const commands = ["server", "build", "servers", "builds"];

// // const command = args[0];

// // if (!commands.includes(command)) {
// //   console.error("暂不支持这个命令");
// //   process.exit()
// // }

// // const server = new Service();

// // server[command](arguments);
