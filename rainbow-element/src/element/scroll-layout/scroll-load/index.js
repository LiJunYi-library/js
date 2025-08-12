import "./index.css";
import { RainbowElement } from "../../base/index.js";
import {
  findParentByLocalName,
  createCustomEvent,
  createElement,
  createSlot,
  resizeObserver,
  getBoundingClientRect,
} from "../../../utils/index.js";

export class RScrollLoad extends RainbowElement {
  $$ = {
    loading: false,
    finished: false,
    empty: false,
    begin: false,
    beginError: false,
    error: false,

    defaultSlot: createSlot("slot"),

    loadingEl: createElement("div", "r-scroll-load-loading"),
    loadingSlot: createSlot("loading-slot"),

    finishedEl: createElement("div", "r-scroll-load-finished"),
    finishedSlot: createSlot("finished-slot"),

    emptyEl: createElement("div", "r-scroll-load-empty"),
    emptySlot: createSlot("empty-slot"),

    beginEl: createElement("div", "r-scroll-load-begin"),
    beginSlot: createSlot("begin-slot"),

    beginErrorEl: createElement("div", "r-scroll-load-begin-error"),
    beginErrorSlot: createSlot("begin-error-slot"),

    errorEl: createElement("div", "r-scroll-load-error"),
    errorSlot: createSlot("error-slot"),
  };

  get loading() {
    return this.$$.loading;
  }
  set loading(v) {
    this.$$.loading = v;
  }

  get finished() {
    return this.$$.finished;
  }
  set finished(v) {
    this.$$.finished = v;
  }

  get empty() {
    return this.$$.empty;
  }
  set empty(v) {
    this.$$.empty = v;
  }

  get begin() {
    return this.$$.begin;
  }

  set begin(v) {
    this.$$.begin = v;
  }

  get beginError() {
    return this.$$.beginError;
  }
  set beginError(v) {
    this.$$.beginError = v;
  }

  get error() {
    return this.$$.error;
  }
  set error(v) {
    this.$$.error = v;
  }

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.appendChild(this.$$.defaultSlot)
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }

  renderState() {
    this.removeChild(this.loadingEl);
    this.removeChild(this.finishedEl);
    this.removeChild(this.emptyEl);
    this.removeChild(this.beginEl);
    this.removeChild(this.beginErrorEl);
    this.removeChild(this.errorEl);
  }
}
