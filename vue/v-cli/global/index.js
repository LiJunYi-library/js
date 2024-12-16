const fs = require("fs");
const path = require("path");

const mGlobal = {
  path: {
    cli: "",
    ctx: "",
    src: "",
    html: "",
    entry: "",
    output: "",
    pages: "",
  },
  package: {
    path: "",
    content: {},
    allDependencies: {},
  },
  init,
};

module.exports = mGlobal;

function init() {
  mGlobal.path.cli = path.resolve(__dirname);
  mGlobal.path.ctx = path.resolve("");
  mGlobal.path.src = path.resolve("src");
  mGlobal.path.html = path.resolve("public/index.html");
  mGlobal.path.entry = path.resolve("src/main.js");
  mGlobal.path.output = path.resolve("dist");
  mGlobal.path.pages = path.resolve("src/pages");

  mGlobal.package.path = path.resolve("package.json");
  mGlobal.package.content = (() => {
    const c = fs.readFileSync(mGlobal.package.path, "utf8");
    return JSON.parse(c);
  })();
  Object.assign(
    mGlobal.package.allDependencies,
    mGlobal.package.content.dependencies,
    mGlobal.package.content.devDependencies,
  );
}
