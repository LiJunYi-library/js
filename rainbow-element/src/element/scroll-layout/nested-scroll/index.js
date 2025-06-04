import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { createCustomEvent, findParentByLocalName } from "../../../utils/index";
import { extendedSlideEvents } from "../../../events/slide.js";
const LOG = (...arg) => console.log(...arg);

export class RNestedScroll extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-scroll-direction": String,
  });

  get $$isScrollToBottomEnd() {
    return Math.round(this.scrollTop + this.offsetHeight) >= this.scrollHeight;
  }

  get $$isScrollToTopEnd() {
    return this.scrollTop <= 0;
  }

  $$ = {
    nestedChild: undefined,
    nestedChildren: [],
    nestedParent: undefined,
    disabledScroll: () => {},
    dispatchWheel: () => {},
    slideEvent: extendedSlideEvents(this, {}),
    onWheel: (event) => {
      console.log("onWheel");
      if (event.deltaY > 0) return;
      if (this.$$isScrollToTopEnd) return;
      event.stopPropagation();
      event.preventDefault();
      this.scrollTop = event.deltaY + this.scrollTop;
      this.dispatchEvent(createCustomEvent("scroll", event));
    },
    onCaptureWheel: (event) => {
      console.log("onCaptureWheel");

      if (event.deltaY < 0) return;
      if (this.$$isScrollToBottomEnd) return;
      event.stopPropagation();
      event.preventDefault();
      this.scrollTop = event.deltaY + this.scrollTop;
    },
    onWheelUp: (event) => {},
    onWheelDown: (event) => {},
    onCapturePointerdown: (event) => {
      console.log("onCapturePointerdown", [this.$$.nestedParent]);
      if (this.$$.nestedParent) this.$$.nestedParent.$$.nestedChild = this;
    },
    onPointermove: (event) => {
      event.stopPropagation();
      event.preventDefault();
      console.log("onPointermove");
    },
  };

  isVerdict = false;

  constructor(...arg) {
    super(...arg);
    const opt = (c) => ({ passive: false, capture: true, ...c });
    this.addEventListener("wheel", this.$$.onCaptureWheel, opt());
    this.addEventListener("wheel", this.$$.onWheel, opt({ capture: false }));

    //
    this.addEventListener("pointerdown", this.$$.onCapturePointerdown, opt());
    this.addEventListener("pointermove", this.$$.onPointermove, opt());
    this.addEventListener("touchstart", (event) => {});
    this.addEventListener("touchmove", (eeee) => {});
    this.addEventListener("touchend", (event) => {});
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.nestedParent = findParentByLocalName("r-nested-scroll", this);
    if (this.$$.nestedParent) this.$$.nestedParent.$$.nestedChild = this;
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
