import "./index.css";
import { RainbowElement, createCustomEvent } from "../../base/index.js";
import { extendedSlideEvents } from "../../utils/slide";

export class RNestedScroll extends RainbowElement {
  $elementName = "RScroll";

  $slotContainer = {
    default: document.createElement("div"),
  };

  $$ = {
    captureOptions: { passive: false, capture: true },
    slideEvent: extendedSlideEvents(this, {
      direction: ["top", "bottom"],
      customEventName: "scroll",
    }),
    isScrollToBottomEnd: () => {
      const top = Math.ceil(scrollEl.value.scrollTop);
      return scrollEl.value.offsetHeight + top >= container.value.offsetHeight;
    },
    slideCaptureDown: (event) => {
      // console.log("slideCaptureDown", event);
    },
    slideCaptureTop: (event) => {
      // console.log("slideCaptureTop", event);
      if (event.orientation !== "vertical") return;
      // 如果滚动到了底部 就不消费事件 return 出去
      // 如果没滚动到底部消费事件 并阻止事件向下传递
      console.log("slideCaptureTop", event);
    },
  };

  constructor(...arg) {
    super(...arg);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$.appendChild(this.$slotContainer.default);
    this.$slotContainer.default.classList.add("r-nested-scroll-content");
    this.classList.add("r-nested-scroll");
    this.$$.slideEvent.bindEvents();
    this.addEventListener("scrollDown", this.$$.slideCaptureDown, this.$$.captureOptions);
    this.addEventListener("scrollTop", this.$$.slideCaptureTop, this.$$.captureOptions);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.slideEvent.destroy();
  }
}

customElements.define("r-nested-scroll", RNestedScroll);
