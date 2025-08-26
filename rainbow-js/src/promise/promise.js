export function promiseSetTimeout(time = 0, resolveValue = time) {
  return new Promise((resolve) => setTimeout(() => resolve(resolveValue), time));
}

export function promiseRequestAnimationFrame(value) {
  return new Promise((resolve) => requestAnimationFrame(() => resolve(value)));
}

export function promiseSignalAbort(fn) {
  return function (config, ...args) {
    const signal = config?.signal;

    // 如果没有 signal，直接执行原函数
    if (!signal) {
      const result = fn(...args);
      return Promise.resolve(result);
    }

    // 如果已经中止，立即返回 rejected promise
    if (signal.aborted) {
      return Promise.reject(signal.reason || new DOMException("Aborted", "AbortError"));
    }

    return new Promise((resolve, reject) => {
      // 监听 abort 事件
      const onAbort = () => {
        reject(signal.reason || new DOMException("Aborted", "AbortError"));
      };

      signal.addEventListener("abort", onAbort);

      let result;
      try {
        result = fn(...args);
      } catch (err) {
        signal.removeEventListener("abort", onAbort);
        return reject(err);
      }

      // 如果不是 Promise，直接 resolve
      if (!(result instanceof Promise)) {
        signal.removeEventListener("abort", onAbort);
        return resolve(result);
      }

      // 是 Promise，处理 then/catch
      result.then(
        (value) => {
          signal.removeEventListener("abort", onAbort);
          if (signal.aborted) return; // 可选：双重检查
          resolve(value);
        },
        (reason) => {
          signal.removeEventListener("abort", onAbort);
          if (signal.aborted) return;
          reject(reason);
        },
      );
    });
  };
}
