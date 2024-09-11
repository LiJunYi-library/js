export function r_resizeObserver(htmlNode, callBack, props = {}) {
  const { isOnce = false, isMerge = false, mergeTime = 60 } = props;
  if (!htmlNode) return console.error("htmlNode is necessary");
  let timer;
  // if (isMerge) timer = mergeEvent(mergeTime);
  const resizeObserver = new ResizeObserver(async (...arg) => {
    if (timer) await timer;
    callBack(...arg);
    if (isOnce) resizeObserver.disconnect();
  });
  resizeObserver.observe(htmlNode);
  return resizeObserver;
}

export function r_onceResizeObserver(htmlNode, callBack, props = {}) {
  return r_resizeObserver(htmlNode, callBack, { isOnce: true, ...props });
}

export function r_mergeResizeObserver(htmlNode, callBack, props = {}) {
  return r_resizeObserver(htmlNode, callBack, { isMerge: true, ...props });
}

export function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browserVersion, browserInfo;

  // 判断浏览器类型和版本号
  if (userAgent.indexOf("Chrome") > -1) {
    const regExp = /Chrome\/(\d+\.\d+)/;
    if (regExp.test(userAgent)) {
      browserVersion = RegExp.$1;
      browserInfo = "Chrome " + browserVersion;
    }
  } else if (userAgent.indexOf("Safari") > -1) {
    const regExp = /Version\/(\d+\.\d+)/;
    if (regExp.test(userAgent)) {
      browserVersion = RegExp.$1;
      browserInfo = "Safari " + browserVersion;
    }
  } else if (userAgent.indexOf("Firefox") > -1) {
    const regExp = /Firefox\/(\d+\.\d+)/;
    if (regExp.test(userAgent)) {
      browserVersion = RegExp.$1;
      browserInfo = "Firefox " + browserVersion;
    }
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    const regExp = /(?:Opera|OPR)\/(\d+\.\d+)/;
    if (regExp.test(userAgent)) {
      browserVersion = RegExp.$1;
      browserInfo = "Opera " + browserVersion;
    }
  } else if (userAgent.indexOf("Edge") > -1) {
    const regExp = /Edge\/(\d+\.\d+)/;
    if (regExp.test(userAgent)) {
      browserVersion = RegExp.$1;
      browserInfo = "Edge " + browserVersion;
    }
  } else if (
    userAgent.indexOf("IE") > -1 ||
    userAgent.indexOf("Trident") > -1
  ) {
    const regExp = /(?:MSIE|rv:)(\d+\.\d+)/;
    if (regExp.test(userAgent)) {
      browserVersion = RegExp.$1;
      browserInfo = "IE " + browserVersion;
    }
  } else {
    browserVersion = "Unknown";
    browserInfo = "Unknown";
  }

  // 输出结果
  console.log("浏览器版本号：" + browserVersion);
  console.log("浏览器版本信息：" + browserInfo);
  return { browserVersion, browserName: browserInfo };
}
