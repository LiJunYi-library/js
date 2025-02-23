import "./index.css";
import {
  RainbowElement,
  createElement,
  createSlot,
  Transition,
  createCustomEvent,
} from "../../base/index.js";

export class ROverlay extends RainbowElement {
  $$ = (() => {
    return {
      value: false,
      transition: Transition({
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
    this.$$.transition = Transition({
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
      transition: Transition({
        node: this,
        dispatchNode: this,
        eventNode: content,
        name: "r-dialog",
        hideClassName: "r-dialog-hide",
      }),
      onOverlayClick: (event) => {
        if (window.rainbow.overlayQueue.queue.at(-1) !== this) return;
        this.value = false;
        this.dispatchEvent(createCustomEvent("input", { value: false }));
      },
      open: () => {
        this.$$.transition.show();
        window.rainbow.overlay.value = true;
        window.rainbow.overlayQueue.push(this);
        window.rainbow.overlay.addEventListener("click", this.$$.onOverlayClick);
      },
      close: () => {
        this.$$.transition.hide();
        window.rainbow.overlayQueue.remove(this);
        if (window.rainbow.overlayQueue.queue.length === 0) window.rainbow.overlay.value = false;
        window.rainbow.overlay.removeEventListener("click", this.$$.onOverlayClick);
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
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    const { rOrientation } = this.$.DATA;
    this.classList.add(`r-dialog-${rOrientation}`);
    if (this.value === false) this.classList.add("r-dialog-hide");
    this.$$.transition = Transition({
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
    dialog.innerHTML = "";
    dialog.append(node);
    dialog.value = true;
  }

  fun.ele = dialog;

  fun.close = () => {
    dialog.value = false;
  };

  return fun;
}
