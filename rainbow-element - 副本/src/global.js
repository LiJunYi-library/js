import { useQueue } from "@rainbow_ljy/rainbow-js";

const rainbow = (() => {
  const overlay = document.createElement("r-overlay");
  document.body.append(overlay);
  return {
    overlay,
    zIndex: 100,
    zIndexAdd: 3,
    overlayQueue: useQueue(),
    dialogQueue: useQueue(),
    customRender(node, dialog) {
      dialog.innerHTML = "";
      dialog.append(node);
    },
  };
})();
window.rainbow = rainbow;
export { rainbow };
