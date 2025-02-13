const loaderUtils = require('loader-utils');

module.exports = function (source) {
  this.cacheable && this.cacheable();
  const options = loaderUtils.getOptions(this) || {};
  if (options.appName === '慢慢买') return source;
  if (!options.appName) return source;
  if (Buffer.isBuffer(source)) {
    const content = source.toString('utf-8');
    const newContent = content.replace(new RegExp('慢慢买', 'g'), options.appName);
    return Buffer.from(newContent, 'utf-8');
  }
  return source.replace(new RegExp('慢慢买', 'g'), options.appName);
};

module.exports.raw = true;
