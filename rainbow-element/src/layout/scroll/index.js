import "./index.css";
import { RainbowElement, createCustomEvent } from "../../base/index.js";

export class RScroll extends RainbowElement {
  $$ = {
    default: document.createElement("div"),
    top: document.createElement("div"),
    content: document.createElement("div"),
    prveScrollTop: 0,
    onScroll: (event) => {
      event.scrollTop = this.$$.default.scrollTop;
      event.moveY = this.$$.prveScrollTop - this.$$.default.scrollTop;
      if (event.moveY < 0) this.dispatchEvent(createCustomEvent("scrollUp", event));
      if (this.onscroll) this.onscroll(event);
      this.dispatchEvent(createCustomEvent("scroll", event));
      if (event.moveY > 0) this.dispatchEvent(createCustomEvent("scrollDown", event));
      this.$$.prveScrollTop = this.$$.default.scrollTop;
    },
    disabledScroll: () => {
      this.$$.default.classList.add("r-scroll-element-disabled-scroll");
    },
    unDisabledScroll: () => {
      this.$$.default.classList.remove("r-scroll-element-disabled-scroll");
    },
  };

  $slotContainer = {
    default: this.$$.default,
    top: this.$$.top,
  };

  get scrollTop() {
    return this.$$.default?.scrollTop;
  }

  set scrollTop(v) {
    this.$$.default.scrollTop = v;
  }

  scrollBy(...arg) {
    this.$$.default?.scrollBy?.(...arg);
  }

  scrollTo(...arg) {
    this.$$.default?.scrollTo?.(...arg);
  }

  constructor(...arg) {
    super(...arg);
    this.$$.default.addEventListener("scroll", this.$$.onScroll);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.default.removeEventListener("scroll", this.$$.onScroll);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.top.classList.add("r-scroll-top");
    this.$$.content.classList.add("r-scroll-content");
    this.$$.default.classList.add("r-scroll-element");
    this.$$.content.append(this.$$.default);
    this.$.append(this.$$.top);
    this.$.append(this.$$.content);
    this.$$.prveScrollTop = this.$$.default.scrollTop;
  }
}

