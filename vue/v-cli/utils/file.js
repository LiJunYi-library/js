const fs = require("fs");
const path = require("path");
const mGlobal = require("../global");

module.exports = { findFiles };

function findFiles(dir, regex, fileList = {}, root = dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      findFiles(filePath, regex, fileList, root);
    } else if (regex.test(filePath)) {
      //   fileList.push(filePath);path.sep
      let relativePath = path.relative(root, dir).replaceAll(path.sep, "/");

      fileList[relativePath] = {
        name: relativePath,
        entry: filePath,
        serverPath: "/" + relativePath + "/index.html",
        output: path.join(mGlobal.path.ctx, "/build/" + relativePath),
      };
    }
  }

  return fileList;
}
