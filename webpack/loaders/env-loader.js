const loaderUtils = require('loader-utils');

module.exports = function (source) {
  this.cacheable && this.cacheable();
  const options = loaderUtils.getOptions(this) || {};

  const env = options.env || 'mmb';
  const envVariables = {};
  const envobj = options.envVariables || {};
  for (const key in envobj) {
    envVariables[`~${key}~`] = envobj[key];
  }
  const replaceObj = {
    ...envVariables,
    ...(options.replaces || {}),
    '<#mmb>[\\s\\S]*?<\\/#mmb>': '',
  };
  const replaceKeys = Object.keys(replaceObj);
  const pattern = replaceKeys.join('|');

  const regex = new RegExp(pattern, 'g');

  function replace(code) {
    return code.replaceAll(regex, a => {
      if (replaceKeys.includes(a)) return replaceObj[a];
      return replaceObj[a];
    });
  }

  function formatter(code) {
    return code.replaceAll(
      /<#jms>([\s\S]*?)<\/#jms>|<#mmb>([\s\S]*?)<\/#mmb>/g,
      (a, jmsContent, mmbContent) => {
        if (env === 'jms') {
          if (/<#jms>([\s\S]*?)<\/#jms>/.test(a)) return jmsContent;
          if (/<#mmb>([\s\S]*?)<\/#mmb>/.test(a)) return '';
        }

        if (env === 'mmb') {
          if (/<#mmb>([\s\S]*?)<\/#mmb>/.test(a)) return mmbContent;
          if (/<#jms>([\s\S]*?)<\/#jms>/.test(a)) return '';
        }

        return a;
      },
    );
  }

  if (Buffer.isBuffer(source)) {
    const content = source.toString('utf-8');
    const newContent = replace(formatter(content));
    return Buffer.from(newContent, 'utf-8');
  }
  return replace(formatter(source));
};

module.exports.raw = true;
