import "./index.css";
import {
  RainbowElement,
  createElement,
  createSlot,
  transition,
  createCustomEvent,
} from "../../base/index.js";

export class ROverlay extends RainbowElement {
  $$ = (() => {
    return {
      value: false,
      transition: transition({
        node: this,
        dispatchNode: this,
        eventNode: this,
        name: "r-overlay",
        hideClassName: "r-overlay-hide",
      }),
    };
  })();

  set value(v) {
    if (this.$$.value === v) return;
    this.$$.value = v;
    if (this.$$.value) this.$$.transition.show();
    else this.$$.transition.hide();
  }

  get value() {
    return this.$$.value;
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    if (this.value === false) this.classList.add("r-overlay-hide");
    this.$$.transition = transition({
      node: this,
      dispatchNode: this,
      eventNode: this,
      name: "r-overlay",
      hideClassName: "r-overlay-hide",
    });
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}

export class RDialog extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-orientation": String, // "left" "right" "top" "bottom" "center"
  });

  $$ = (() => {
    const content = createElement("div", "r-dialog-content");
    return {
      value: false,
      content,
      defaultSlot: createSlot("slot", "", ""),
      transition: transition({
        node: this,
        dispatchNode: this,
        eventNode: content,
        name: "r-dialog",
        hideClassName: "r-dialog-hide",
      }),
      onOverlayClick: (event) => {
        event.stopPropagation();
        console.log("onOverlayClick");
        if (window.rainbow.overlayQueue.queue.at(-1) !== this) return;
        this.value = false;
        this.dispatchEvent(createCustomEvent("input", { value: false }));
      },
      onDocumentClick: (event) => {
        console.log("onDocumentClick", window.rainbow.overlayQueue.queue.length);
        this.value = false;
        this.dispatchEvent(createCustomEvent("input", { value: false }));
      },
      click: (event) => {
        event.stopPropagation();
        console.log("click");
      },
      open: () => {
        const prveDialog = rainbow.dialogQueue.queue.at(-1);
        rainbow.zIndex = rainbow.zIndex + rainbow.zIndexAdd;
        this.style.zIndex = rainbow.zIndex;
        this.style.top = "50px";
        rainbow.overlay.style.top = "50px";
        this.$$.transition.show();
        rainbow.overlay.value = true;
        rainbow.overlayQueue.push(this);
        if (prveDialog && prveDialog !== this) {
          prveDialog.value = false;
          prveDialog.dispatchEvent(createCustomEvent("input", { value: false }));
        }
        rainbow.dialogQueue.push(this);
        rainbow.overlay.style.zIndex = (rainbow.overlayQueue.queue.at(-1)?.style?.zIndex ?? 1) - 1;
        rainbow.overlay.addEventListener("click", this.$$.onOverlayClick);

        document.removeEventListener("click", this.$$.onDocumentClick);
      },
      close: () => {
        this.$$.transition.hide();
        rainbow.overlayQueue.remove(this);
        rainbow.dialogQueue.remove(this);
        if (rainbow.overlayQueue.queue.length === 0) rainbow.overlay.value = false;
        rainbow.overlay.removeEventListener("click", this.$$.onOverlayClick);
        document.removeEventListener("click", this.$$.onDocumentClick);
      },
      afterLeave: () => {
        rainbow.overlay.style.zIndex = (rainbow.overlayQueue.queue.at(-1)?.style?.zIndex ?? 1) - 1;
      },
      afterEnter: () => {
        // document.addEventListener("click", this.$$.onDocumentClick);
        // console.log("afterEnter");
      },
    };
  })();

  set value(v) {
    if (this.$$.value === v) return;
    this.$$.value = v;
    if (this.$$.value) this.$$.open();
    else this.$$.close();
  }

  get value() {
    return this.$$.value;
  }

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$$.content.append(this.$$.defaultSlot);
    this.shadowRoot.appendChild(this.$$.content);
    this.addEventListener("afterEnter", this.$$.afterEnter);
    this.addEventListener("afterLeave", this.$$.afterLeave);
    this.addEventListener("click", this.$$.click);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    const { rOrientation } = this.$.DATA;
    this.classList.add(`r-dialog-${rOrientation}`);
    if (this.value === false) this.classList.add("r-dialog-hide");
    this.$$.transition = transition({
      node: this,
      dispatchNode: this,
      eventNode: this.$$.content,
      name: "r-dialog-" + rOrientation,
      hideClassName: "r-dialog-hide",
    });
    console.log(" connectedCallback ", rOrientation);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}

export function createDialog(params) {
  const dialog = document.createElement("r-dialog");
  document.body.appendChild(dialog);

  function fun(node) {
    rainbow.customRender(node, dialog);
    dialog.value = true;
  }

  fun.ele = dialog;

  fun.close = () => {
    dialog.value = false;
  };

  return fun;
}
