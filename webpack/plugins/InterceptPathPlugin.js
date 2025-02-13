const path = require('path');
const fs = require('fs');

class InterceptPathPlugin {
  constructor(options = {}) {
    this.options = {
      env: 'jms',
      ...options,
    };
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('InterceptPathPlugin', factory => {
      factory.hooks.beforeResolve.tapAsync('InterceptPathPlugin', (result, callback) => {
        if (!result || !result.context || !result.request) {
          return callback();
        }

        const {context, request} = result;
        const resourcePath = path.resolve(context, request);

        const baseName = path.basename(resourcePath, path.extname(resourcePath));
        const dirName = path.dirname(resourcePath);
        const extName = path.extname(resourcePath);
        const jmsFilePath = path.join(dirName, `${baseName}.${this.options.env}${extName}`);

        if (fs.existsSync(jmsFilePath)) {
          const jmsRequest = request.replace(/\.[^.]+$/, ext => `.${this.options.env}${ext}`);
          result.request = jmsRequest;
        }

        callback();
      });
    });
  }
}

module.exports = InterceptPathPlugin;
