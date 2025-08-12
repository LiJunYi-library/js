import "./index.css";
import { RainbowElement } from "../../base/index.js";
import {
  findParentByLocalName,
  createCustomEvent,
  createElement,
  createSlot,
  addEventListenerOnce,
  removeEventListener,
} from "../../../utils/index.js";

export class RScrollLoad extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-trigger-bottom-distance": String, // 0px
  });

  get loading() {
    return this.$$.loading;
  }
  set loading(v) {
    this.$$.loading = v;
    this.$render();
  }

  get finished() {
    return this.$$.finished;
  }
  set finished(v) {
    this.$$.finished = v;
    this.$render();
  }

  get empty() {
    return this.$$.empty;
  }
  set empty(v) {
    this.$$.empty = v;
    this.$render();
  }

  get begin() {
    return this.$$.begin;
  }

  set begin(v) {
    this.$$.begin = v;
    this.$render();
  }

  get beginError() {
    return this.$$.beginError;
  }
  set beginError(v) {
    this.$$.beginError = v;
    this.$render();
  }

  get error() {
    return this.$$.error;
  }
  set error(v) {
    this.$$.error = v;
    this.$render();
  }

  $$ = {
    loading: false,
    finished: false,
    empty: false,
    begin: false,
    beginError: false,
    error: false,
    scrollParent: document.createElement("div"),

    defaultSlot: createSlot("slot"),

    beginEl: createElement("div", "r-scroll-load-begin"),
    beginSlot: createSlot("slot", "begin"),

    loadingEl: createElement("div", "r-scroll-load-loading"),
    loadingSlot: createSlot("slot", "loading"),

    finishedEl: createElement("div", "r-scroll-load-finished"),
    finishedSlot: createSlot("slot", "finished"),

    emptyEl: createElement("div", "r-scroll-load-empty"),
    emptySlot: createSlot("slot", "empty"),

    beginErrorEl: createElement("div", "r-scroll-load-begin-error"),
    beginErrorSlot: createSlot("slot", "begin-error"),

    errorEl: createElement("div", "r-scroll-load-error"),
    errorSlot: createSlot("slot", "error"),

    renderState: (...nodes) => {
      [
        this.$$.defaultSlot,
        this.$$.loadingSlot,
        this.$$.finishedSlot,
        this.$$.emptySlot,
        this.$$.beginSlot,
        this.$$.beginErrorSlot,
        this.$$.errorSlot,
      ].forEach((item) => {
        if (nodes.includes(item)) this.shadowRoot.appendChild(item);
        else item.remove();
      });
    },

    onScrollUp: (event) => {
      const { rTriggerBottomDistance } = this.$.DATA;
      console.log(rTriggerBottomDistance);
      const { scrollParent: sp } = this.$$;
      const max = sp.scrollHeight - sp.offsetHeight - rTriggerBottomDistance;
      const bool = sp.scrollTop >= max;
      if (bool) this.dispatchEvent(createCustomEvent("rollToBottom", event));
    },
  };

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$render();
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$render();
    const scrollName = ["r-scroll", "r-scroll-view", "r-nested-scroll"];
    this.$$.scrollParent = findParentByLocalName(scrollName, this);
    addEventListenerOnce(this.$$.scrollParent, "scrollUp", this.$$.onScrollUp);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    removeEventListener(this.$$.scrollParent, "scrollUp", this.$$.onScrollUp);
  }

  $render() {
    if (this.begin === true && this.error === true) {
      this.$$.renderState(this.$$.beginErrorSlot);
      return;
    }

    if (this.begin === true) {
      this.$$.renderState(this.$$.loadingSlot, this.$$.beginSlot);
      return;
    }

    if (this.finished === true && this.empty === true) {
      this.$$.renderState(this.$$.emptySlot);
      return;
    }

    this.$$.renderState(
      ...[
        this.empty === true ? this.$$.emptySlot : this.$$.defaultSlot,
        this.loading === true && this.$$.loadingSlot,
        this.finished === true && this.$$.finishedSlot,
        this.error === true && this.$$.errorSlot,
      ].filter(Boolean),
    );
  }
}
