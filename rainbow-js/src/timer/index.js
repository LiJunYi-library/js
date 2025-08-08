/**
 * 创建一个防抖函数
 * @param {Function} callback - 要执行的回调函数
 * @param {number} delay - 延迟时间，默认为500毫秒
 * @returns {Function} - 返回一个防抖函数
 */
export function timerDebounced(callback, delay = 500) {
  let timeout;
  return function fun(...arg) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...arg);
    }, delay);
  };
}

export function animationDebounced(callback) {
  let id;
  return function fun(...arg) {
    cancelAnimationFrame(id);
    id = requestAnimationFrame((time) => {
      callback(...arg);
    });
  };
}

/**
 * 定时器节流函数
 * @param {Function} callback - 需要节流的回调函数
 * @param {number} delay - 节流的时间间隔，默认为500毫秒
 * @returns {Function} - 节流后的回调函数
 */
export function timerThrottle(callback, delay = 500) {
  let isThrottled = false;
  return function throttledCallback(...args) {
    if (isThrottled) return;
    isThrottled = true;
    callback(...args);
    setTimeout(() => {
      isThrottled = false;
    }, delay);
  };
}
/***
 *
 */
export function timeRefush(props = {}) {
  const config = {
    formatterTime: (date) => date.getDate(),
    onChange: () => undefined,
    once: false,
    ms: 1000,
    ...props,
  };
  let prveTime = config.formatterTime(new Date());
  const timer = setInterval(() => {
    const date = new Date();
    const time = config.formatterTime(date);
    if (prveTime !== time) {
      config.onChange(time);
      if (config.once) clearInterval(timer);
    }
    prveTime = time;
  }, config.ms);
}
