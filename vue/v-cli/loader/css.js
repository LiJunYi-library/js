const mGlobal = require("../global");

module.exports = { configSetCss };

function configSetCss(config) {
  //   console.log("configSetCss");
  //   console.log(config);

  const { allDependencies } = mGlobal.package;

  const getStyleLoader = (pre) => {
    return [
      "vue-style-loader",
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: ["postcss-preset-env"],
          },
        },
      },
      pre,
    ].filter(Boolean);
  };

  config.module.rules.unshift({ test: /\.styl$/, use: getStyleLoader("stylus-loader") });

  if (allDependencies["less-loader"]) {
    // console.log("有less模块");
    config.module.rules.unshift({ test: /\.less$/, use: getStyleLoader("less-loader") });
  }

  if (allDependencies.sass && allDependencies["sass-loader"]) {
    // console.log("有sass模块");
    config.module.rules.unshift(
      { test: /\.scss$/, use: getStyleLoader("sass-loader") },
      { test: /\.sass$/, use: getStyleLoader("sass-loader") },
    );
  }

  config.module.rules.unshift({ test: /\.css$/, use: getStyleLoader() });
}
