import "./index.css";
import { RainbowElement } from "../../base/index.js";
import {
  createElement,
  createSlot,
  transition,
  createCustomEvent,
  addEventListenerOnce,
  findParentByLocalName,
  toggleClass,
  isNum,
} from "../../../utils/index.js";
import { RAsyncClick } from "../../async/asyncClick.js";

export class RDialog extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-orientation": String, // "left" "right" "top" "bottom" "center"
    "r-back-pressed": String, // close
    "r-blank-inner": String, // margin
    "r-blank-left": String, // 0px
    "r-blank-right": String, // 0px
    "r-blank-top": String, // 0px
    "r-blank-bottom": String, // 0px
    "r-overlay-class": String,
    "r-overlay-visibility": String, // visible  hidden
  });

  $watchStyle = {
    "r-orientation": () => {
      this.$$.bindAnimation();
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
      setOverlayBlankStyle: () => {
        const { rBlankTop, rBlankBottom, rBlankLeft, rBlankRight, rBlankInner, rOverlayClass } =
          this.$.DATA;
        rainbow.overlay.className = rOverlayClass;
        rainbow.overlay.style.top = "";
        rainbow.overlay.style.bottom = "";
        rainbow.overlay.style.left = "";
        rainbow.overlay.style.right = "";
        if (isNum(rBlankTop)) {
          rainbow.overlay.style.top = rBlankTop + "px";
          rainbow.overlay.style.bottom = "auto";
        }
        if (isNum(rBlankBottom)) {
          rainbow.overlay.style.bottom = rBlankBottom + "px";
          rainbow.overlay.style.top = "auto";
        }
        if (isNum(rBlankLeft)) {
          rainbow.overlay.style.left = rBlankLeft + "px";
          rainbow.overlay.style.right = "auto";
        }
        if (isNum(rBlankRight)) {
          rainbow.overlay.style.right = rBlankRight + "px";
          rainbow.overlay.style.left = "auto";
        }
        rainbow.overlay.style.zIndex = (rainbow.overlayQueue.queue.at(-1)?.style?.zIndex ?? 1) - 1;
      },
      setBlankStyle: () => {
        const { rBlankTop, rBlankBottom, rBlankLeft, rBlankRight, rBlankInner } = this.$.DATA;
        if (rBlankInner === "margin") {
          if (isNum(rBlankTop)) this.style.marginTop = rBlankTop + "px";
          if (isNum(rBlankBottom)) this.style.marginBottom = rBlankBottom + "px";
          if (isNum(rBlankLeft)) this.style.marginLeft = rBlankLeft + "px";
          if (isNum(rBlankRight)) this.style.marginTop = rBlankRight + "px";
        }
        this.style.maxHeight = `calc( 100vh - ${(rBlankTop || 0) + (rBlankBottom || 0)}px )`;
        this.style.maxWidth = `calc( 100vw - ${(rBlankLeft || 0) + (rBlankRight || 0)}px )`;
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
      bindAnimation: () => {
        const { rOrientation } = this.$.DATA;
        this.cssList.empty();
        this.cssList.add(`r-dialog-${rOrientation}`);
        if (this.value === false) this.cssList.add("r-dialog-hide");
        this.$$.transition = transition({
          node: this,
          dispatchNode: this,
          eventNode: this.$$.content,
          name: "r-dialog-" + rOrientation,
          hideName: "r-dialog-hide",
        });
      },
      open: () => {
        this.dispatchEvent(createCustomEvent("beforeOpen"));
        rainbow.dialogQueue.push(this);
        rainbow.overlayQueue.push(this);
        this.style.zIndex = rainbow.zIndexPlus();
        this.$$.setBlankStyle();
        this.$$.transition.show();
        this.$$.setOverlayBlankStyle();
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
        if (rainbow.dialogQueue.queue.at(-1) !== this) return;
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
        this.$$.setOverlayBlankStyle();
      },
      onAfterLeave: () => {
        const prveDialog = rainbow.dialogQueue.queue.at(-1);
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
    this.$$.bindAnimation();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    if (this.value === true) {
      history.back();
      rainbow.overlayQueue.remove(this);
      rainbow.dialogQueue.remove(this);
    }
  }

  $onStyleChang(...arg) {
    super.$onStyleChang(...arg);
    this.$$.setBlankStyle();
  }
}

export class RDialogClose extends RAsyncClick {
  $$ = (() => {
    return {
      ...this.$$,
      onfinally: () => {
        if (!this.$$.dialogParent) return;
        this.$$.dialogParent.$updateValue(false);
        this.$$.dialogParent.$$.close();
      },
    };
  })();

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.dialogParent = findParentByLocalName("r-dialog", this);
  }
}
