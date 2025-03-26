import { useQueue } from "@rainbow_ljy/rainbow-js";

window.rainbow = (() => {
  const overlay = document.createElement("r-overlay");
  document.body.append(overlay);
  return {
    overlay,
    zIndex: 100,
    zIndexAdd: 3,
    zIndexPlus() {
      this.zIndex = this.zIndex + this.zIndexAdd;
      return this.zIndex;
    },
    overlayQueue: useQueue(),
    dialogQueue: useQueue(),
    customRender(node, dialog) {
      dialog.innerHTML = "";
      dialog.append(node);
    },
  };
})();
