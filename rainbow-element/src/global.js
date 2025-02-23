import { useQueue } from "@rainbow_ljy/rainbow-js";

const rainbow = (() => {
  const overlay = document.createElement("r-overlay");
  document.body.append(overlay);
  return {
    overlay,
    overlayQueue: useQueue(),
  };
})();
window.rainbow = rainbow;
export { rainbow };
