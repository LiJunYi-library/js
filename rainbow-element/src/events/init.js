import { createCustomEvent } from "../utils/index.js";

window.addEventListener("load", () => {
  new MutationObserver((mutations) => {
    window.dispatchEvent(createCustomEvent("documentMutation", { mutations }));
  }).observe(document, { subtree: true, attributes: true, attributeOldValue: true });
});
