export function setTimeoutPromise(time = 0, resolveValue = time) {
  return new Promise((resolve) => setTimeout(() => resolve(resolveValue), time));
}

export function requestAnimationFramePromise(value) {
  return new Promise((resolve) => requestAnimationFrame(() => resolve(value)));
}
