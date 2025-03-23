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
  };

  isVerdict = false;

  constructor(...arg) {
    super(...arg);
    const opt = (c) => ({ passive: false, capture: true, ...c });
    // this.addEventListener("wheel", this.$$.onCaptureWheel, opt());
    // this.addEventListener("wheel", this.$$.onWheel, opt({ capture: false }));
    // this.$$.slideEvent.bindEvents();
    this.addEventListener("touchstart", (event) => {
      console.log(event.touches[0]);
      this.beginEvent = event.touches[0];
      this.isVerdict = false;
    });

    this.addEventListener("touchmove", (eeee) => {
      const event = eeee.touches[0];
      const { beginEvent } = this;
      event.deltaX = event.pageX - (beginEvent?.pageX ?? 0);
      event.deltaY = event.pageY - (beginEvent?.pageY ?? 0);
      event.deltaC = calcHypotenuse(event.deltaX, event.deltaY);
      event.deltaAng = calculateAngle(event.deltaX, event.deltaY);
      let direction, orientation;

      if (!this.isVerdict) {
        this.offsetX = Math.abs(event.deltaX);
        this.offsetY = Math.abs(event.deltaY);
        if (this.offsetX < 10 && this.offsetY <  10) {
          orientation = getDirection(this.offsetX, this.offsetY);
          this.isVerdict = true;
          console.log(orientation);
          return;
        }
      }
    });

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

function calcHypotenuse(a, b) {
  return Math.sqrt(a * a + b * b);
}

function calculateAngle(dx, dy) {
  const angleRadians = Math.atan2(dy, dx);
  const angleDegrees = angleRadians * (180 / Math.PI);
  const angleNormalized = 360 - ((angleDegrees + 360) % 360);
  return angleNormalized;
}

function getDirection(x, y) {
  if (x > y) {
    return "horizontal";
  }
  if (y > x) {
    return "vertical";
  }
  return "";
}
