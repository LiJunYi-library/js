import "./index.css";
import { RainbowElement, createCustomEvent, createElement, createSlot } from "../../base/index.js";

export class RScroll extends RainbowElement {
  $$ = {
    prveScrollTop: 0,
    onScroll: (event) => {
      event.scrollTop = this.scrollTop;
      event.moveY = this.$$.prveScrollTop - this.scrollTop;
      if (event.moveY < 0) this.dispatchEvent(createCustomEvent("scrollUp", event));
      if (event.moveY > 0) this.dispatchEvent(createCustomEvent("scrollDown", event));
      this.$$.prveScrollTop = this.scrollTop;
    },
    disabledScroll: () => {
      this.classList.add("r-scroll-disabled");
    },
    unDisabledScroll: () => {
      this.classList.remove("r-scroll-disabled");
    },
  };

  constructor(...arg) {
    super(...arg);
    this.addEventListener("scroll", this.$$.onScroll);
  }

}
