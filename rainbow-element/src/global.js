import { useQueue } from "@rainbow_ljy/rainbow-js";
import { createCustomEvent } from "./utils/index.js";

window.rainbow = (() => {
  const overlay = document.createElement("r-overlay");
  document.body.append(overlay);
  return {
    toast: undefined,
    overlay,
    customRender(node, parent) {},
    zIndex: 100,
    zIndexAdd: 3,
    zIndexPlus() {
      this.zIndex = this.zIndex + this.zIndexAdd;
      return this.zIndex;
    },
    overlayQueue: useQueue(),
    dialogQueue: useQueue(),
    history: createHistory(),
  };
})();

function createHistory() {
  let historyStack = 0;
  let state = "none";
  window.addEventListener("popstate", (event) => {
    event.stateType = state;
    event.historyStack = historyStack;
    state = "none";
  });

  function pushState(...args) {
    historyStack++;
    history.pushState(...args);
  }

  function replaceState(...args) {
    history.replaceState(...args);
  }

  function back(...args) {
    if (historyStack <= 0) return;
    console.log("historyStack", historyStack);
    state = "back";
    historyStack--;
    console.log("historyStack--", historyStack);
    history.back(...args);
  }

  function forward(...args) {
    state = "forward";
    historyStack++;
    history.forward(...args);
  }

  return {
    back,
    forward,
    pushState,
    replaceState,
  };
}
