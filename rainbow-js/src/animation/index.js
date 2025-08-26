export function animationDebounced(callback) {
  let id;
  return function fun(...arg) {
    cancelAnimationFrame(id);
    id = requestAnimationFrame((time) => {
      callback(...arg);
    });
  };
}
