import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { createElement, createSlot, transition, createCustomEvent } from "../../../utils/index.js";

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

  $watchStyle = {
    "r-orientation": () => {
      this.$onRender()
    },
  };

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
        console.log("event open");
        this.dispatchEvent(createCustomEvent("open"));
        const prveDialog = rainbow.dialogQueue.queue.at(-1);
        rainbow.zIndex = rainbow.zIndex + rainbow.zIndexAdd;
        this.style.zIndex = rainbow.zIndex;
        // this.style.top = "50px";
        // rainbow.overlay.style.top = "50px";
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
        console.log("event close");
        this.dispatchEvent(createCustomEvent("close"));
        rainbow.overlayQueue.remove(this);
        rainbow.dialogQueue.remove(this);
        if (rainbow.overlayQueue.queue.length === 0) rainbow.overlay.value = false;
        rainbow.overlay.removeEventListener("click", this.$$.onOverlayClick);
        document.removeEventListener("click", this.$$.onDocumentClick);
      },
      afterLeave: () => {
        rainbow.overlay.style.zIndex = (rainbow.overlayQueue.queue.at(-1)?.style?.zIndex ?? 1) - 1;
        console.log("event closed");
        this.dispatchEvent(createCustomEvent("closed"));
      },
      afterEnter: () => {
        document.addEventListener("click", this.$$.onDocumentClick);
        console.log("event opened");
        this.dispatchEvent(createCustomEvent("opened"));
        // console.log("afterEnter");
      },
    };
  })();

  set value(v) {
    if (this.$$.value === v) return;
    this.$$.value = v;
    console.log("-----------");
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
    const style = document.createElement('style');
                style.textContent = `
r-dialog::part(r-dialog-content),
.r-dialog-content {
    background: red;
    width: 100%;
    height: 100%;
    transform-origin: 50% 50%;
}`;

                // 将样式和内容添加到 shadow root
                this.shadowRoot.appendChild(style);
                const extraSheet = new CSSStyleSheet();
extraSheet.replaceSync("div { color: green; }");
this.shadowRoot.adoptedStyleSheets = [extraSheet];
    this.addEventListener("afterEnter", this.$$.afterEnter);
    this.addEventListener("afterLeave", this.$$.afterLeave);
    this.addEventListener("click", this.$$.click);
    console.log([this])
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$onRender()
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }

  $onRender() {
    const { rOrientation } = this.$.DATA;
    console.log(" rOrientation ", rOrientation);
    this.classList.add(`r-dialog-${rOrientation}`);
    if (this.value === false) this.classList.add("r-dialog-hide");
    this.$$.transition = transition({
      node: this,
      dispatchNode: this,
      eventNode: this.$$.content,
      name: "r-dialog-" + rOrientation,
      hideClassName: "r-dialog-hide",
    });
  }
}
