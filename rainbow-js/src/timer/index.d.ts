/**
 * 创建一个防抖函数
 * @param {Function} callback - 要执行的回调函数
 * @param {number} delay - 延迟时间，默认为500毫秒
 * @returns {Function} - 返回一个防抖函数
 */
export declare function timerDebounced(
  callback: Function,
  delay?: number
): Function;

export declare function animationDebounced(
  callback: (...arg: any) => any
): (...arg: any) => any;

/**
 * 定时器节流函数
 * @param {Function} callback - 需要节流的回调函数
 * @param {number} delay - 节流的时间间隔，默认为500毫秒
 * @returns {Function} - 节流后的回调函数
 */
export declare function timerThrottle(
  callback: Function,
  delay?: number
): Function;

export declare function timeRefush(props: {
  formatterTime?: (date: Date) => any;
  onChange?: (time: any) => undefined;
  once?: boolean;
  ms?: number;
}): void;
