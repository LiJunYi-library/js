module.exports = { configSetImg };

function configSetImg(config) {
  //   let imgLoader = {
  //     test: /\.(png|jpg|gif|svg)$/,
  //     type: "asset",
  //     parser: {
  //       dataUrlCondition: {
  //         maxSize: 0 * 1024,
  //       },
  //     },
  //   };

  let imgLoader = {
    test: /\.(png|jpg|gif|svg)$/,
    type: "asset/resource",
  };

  config.module.rules.unshift(imgLoader);
}
