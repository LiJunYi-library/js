import "./index.css";
import { RainbowElement } from "../../base/index.js";
import {
  createElement,
  createSlot,
  transition,
  createCustomEvent,
  addEventListenerOnce,
  findParentByLocalName,
  isNum,
} from "../../../utils/index.js";

export class RDialog extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-orientation": String, // "left" "right" "top" "bottom" "center"
    "r-back-pressed": String, // close
    "r-blank-inner": String, // margin
    "r-blank-left": String,
    "r-blank-right": String,
    "r-blank-top": String,
    "r-blank-bottom": String,
  });

  $watchStyle = {
    "r-orientation": () => {
      this.$onRender();
    },
  };

  $$ = (() => {
    const content = createElement("div", "r-dialog-content");
    return {
      isBack: false,
      content,
      defaultSlot: createSlot("slot", "r-dialog-default-slot", ""),
      transition: transition({
        node: this,
        dispatchNode: this,
        eventNode: content,
        name: "r-dialog",
        hideName: "r-dialog-hide",
      }),
      closePrveDialog: () => {
        const prveDialog = rainbow.dialogQueue.queue.at(-1);
        if (!prveDialog) return;
        if (prveDialog === this) return;
        prveDialog.$updateValue(false);
        prveDialog.$$.close();
      },
      setBlankStyle: () => {
        const { rBlankTop, rBlankBottom, rBlankLeft, rBlankRight, rBlankInner } = this.$.DATA;
        rainbow.overlay.style.top = "";
        rainbow.overlay.style.bottom = "";
        rainbow.overlay.style.left = "";
        rainbow.overlay.style.right = "";
        if (isNum(rBlankTop)) {
          if (rBlankInner === "margin") this.style.marginTop = rBlankTop + "px";
          rainbow.overlay.style.top = rBlankTop + "px";
          rainbow.overlay.style.bottom = "auto";
        }
        if (isNum(rBlankBottom)) {
          if (rBlankInner === "margin") this.style.marginBottom = rBlankBottom + "px";
          rainbow.overlay.style.bottom = rBlankBottom + "px";
          rainbow.overlay.style.top = "auto";
        }
        if (isNum(rBlankLeft)) {
          if (rBlankInner === "margin") this.style.marginLeft = rBlankLeft + "px";
          rainbow.overlay.style.left = rBlankLeft + "px";
          rainbow.overlay.style.right = "auto";
        }
        if (isNum(rBlankRight)) {
          if (rBlankInner === "margin") this.style.marginTop = rBlankRight + "px";
          rainbow.overlay.style.right = rBlankRight + "px";
          rainbow.overlay.style.left = "auto";
        }
        this.style.maxHeight = `calc( 100vh - ${(rBlankTop || 0) + (rBlankBottom || 0)}px )`;
        this.style.maxWidth = `calc( 100vh - ${(rBlankLeft || 0) + (rBlankRight || 0)}px )`;
      },
      historyBack: (unHistoryBack) => {
        if (this.$.DATA.rBackPressed !== "close") return;
        if (!unHistoryBack) {
          history.back();
          const prveDialog = rainbow.dialogQueue.queue.at(-1);
          if (prveDialog) prveDialog.$$.isBack = true;
        }
      },
      historyPushState: () => {
        if (this.$.DATA.rBackPressed !== "close") return;
        this.$$.isBack = false;
        history.pushState({}, "");
      },
      open: () => {
        this.dispatchEvent(createCustomEvent("beforeOpen"));
        rainbow.dialogQueue.push(this);
        rainbow.overlayQueue.push(this);
        this.style.zIndex = rainbow.zIndexPlus();
        rainbow.overlay.style.zIndex = (rainbow.overlayQueue.queue.at(-1)?.style?.zIndex ?? 1) - 1;
        this.$$.setBlankStyle();
        this.$$.transition.show();
        rainbow.overlay.value = true;
        this.dispatchEvent(createCustomEvent("open"));
        this.$$.historyPushState();
        addEventListenerOnce(rainbow.overlay, "click", this.$$.onOverlayClick);
        document.removeEventListener("click", this.$$.onDocumentClick);
      },
      close: ({ unHistoryBack } = {}) => {
        this.dispatchEvent(createCustomEvent("beforeClose"));
        this.$$.transition.hide();
        rainbow.overlayQueue.remove(this);
        rainbow.dialogQueue.remove(this);
        this.$$.historyBack(unHistoryBack);
        if (rainbow.overlayQueue.queue.length === 0) rainbow.overlay.value = false;
        this.dispatchEvent(createCustomEvent("close"));
        document.removeEventListener("click", this.$$.onDocumentClick);
      },
      onOverlayClick: (event) => {
        event.stopPropagation();
        if (window.rainbow.overlayQueue.queue.at(-1) !== this) return;
        this.$updateValue(false);
        this.$$.close();
      },
      onDocumentClick: (event) => {
        event.stopPropagation();
        if (window.rainbow.overlayQueue.queue.at(-1) !== this) return;
        this.$updateValue(false);
        this.$$.close();
      },
      onPopstate: (event) => {
        if (this.$.DATA.rBackPressed !== "close") return;
        const currentDialog = rainbow.dialogQueue.queue.at(-1);
        if (currentDialog !== this) return;
        if (this.$$.isBack) return (this.$$.isBack = false);
        this.$updateValue(false);
        this.$$.close({ unHistoryBack: true });
      },
      onClick: (event) => {
        event.stopPropagation();
      },
      onShow: (event) => {
        this.$$.setBlankStyle();
      },
      onAfterLeave: () => {
        const prveOverlay = rainbow.overlayQueue.queue.at(-1);
        const prveDialog = rainbow.dialogQueue.queue.at(-1);
        rainbow.overlay.style.zIndex = (prveOverlay?.style?.zIndex ?? 1) - 1;
        if (prveDialog) prveDialog.dispatchEvent(createCustomEvent("show"));
        this.dispatchEvent(createCustomEvent("closed"));
      },
      onAfterEnter: () => {
        document.addEventListener("click", this.$$.onDocumentClick);
        this.dispatchEvent(createCustomEvent("opened"));
      },
    };
  })();

  $value = false;

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$$.content.append(this.$$.defaultSlot);
    this.shadowRoot.appendChild(this.$$.content);
    this.shadowRoot.appendChild(this.$.styleNode);
  }

  $onValueChange(bool) {
    if (bool) this.$$.open();
    else this.$$.close();
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    addEventListenerOnce(this, "afterEnter", this.$$.onAfterEnter);
    addEventListenerOnce(this, "afterLeave", this.$$.onAfterLeave);
    addEventListenerOnce(this, "click", this.$$.onClick);
    addEventListenerOnce(this, "show", this.$$.onShow);
    addEventListenerOnce(window, "popstate", this.$$.onPopstate);
    this.$onRender();
  }

  $onStyleChang(...arg) {
    super.$onStyleChang(...arg);
    this.$$.setBlankStyle();
  }

  $onRender() {
    const { rOrientation } = this.$.DATA;
    this.cssList.add(`r-dialog-${rOrientation}`);
    if (this.value === false) this.cssList.add("r-dialog-hide");

    this.$$.transition = transition({
      node: this,
      dispatchNode: this,
      eventNode: this.$$.content,
      name: "r-dialog-" + rOrientation,
      hideName: "r-dialog-hide",
    });
  }
}

export class RDialogClose extends RainbowElement {
  $$ = {
    loading: false,
    onclick_: async () => undefined,
    onClick: async (...args) => {
      if (this.$$.loading === true) return;
      this.$$.loading = true;
      const res = this.$$.onclick_(...args);
      if (res instanceof Promise) {
        res.finally(this.$$.close);
        return;
      }
      this.$$.close();
    },
    close: () => {
      this.$$.dialogParent.$updateValue(false);
      this.$$.dialogParent.$$.close();
      this.$$.loading = false;
    },
  };

  set onclick(v) {
    this.$$.onclick_ = v;
  }

  get onclick() {
    return this.$$.onclick_;
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    addEventListenerOnce(this, "click", this.$$.onClick);
    this.$$.dialogParent = findParentByLocalName("r-dialog", this);
  }
}
