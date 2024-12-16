module.exports = { configSetFont };

function configSetFont(config) {
  config.module.rules.unshift({
    test: /\.(woff2|ttf)$/,
    type: "asset/resource",
  });
}
