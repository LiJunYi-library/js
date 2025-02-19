import "./index.css";
import { RainbowElement, createCustomEvent, createElement, createSlot } from "../../base/index.js";

export class RScrollView extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-element-style": String,
    "r-container-style": String,
  });

  $$ = {
    top: createSlot("slot", "r-scroll-top"),
    container: createElement("div", "r-scroll-container"),
    default: createElement("div", "r-scroll-element"),
    defaultSlot: createSlot("slot", "r-scroll-element-slot", ""),
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
      this.classList.add("r-scroll-view-disabled");
    },
    unDisabledScroll: () => {
      this.classList.remove("r-scroll-view-disabled");
    },
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
    this.attachShadow({ mode: "open" });
    this.$$.default.append(this.$$.defaultSlot);
    this.$$.container.append(this.$$.default);
    this.shadowRoot.appendChild(this.$$.top);
    this.shadowRoot.appendChild(this.$$.container);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.default.addEventListener("scroll", this.$$.onScroll);
    this.$$.prveScrollTop = this.$$.default.scrollTop;
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.default.removeEventListener("scroll", this.$$.onScroll);
  }

  $render() {
    const { rElementStyle, rContainerStyle } = this.$.DATA;
    this.$$.default.setAttribute("style", rElementStyle);
    this.$$.container.setAttribute("style", rContainerStyle);
  }
}

