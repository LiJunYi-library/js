import "./index.css";
import { RainbowElement, createCustomEvent } from "../../base/index.js";
import { extendedSlideEvents } from "../../utils/slide";

export class RNestedScroll extends RainbowElement {
  $elementName = "RScroll";

  $$ = {
    slideEvent: extendedSlideEvents(this, {
      direction: ["top", "bottom"],
      customEventName: "scroll",
    }),
    slideCaptureDown: (event) => {
      console.log("slideCaptureDown", event);
    },
  };

  constructor(...arg) {
    super(...arg);
  }


  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.classList.add("r-nested-scroll");
    this.$$.slideEvent.bindEvents();
    this.addEventListener("scrollDown", this.$$.slideCaptureDown, {
      passive: false,
      capture: true,
    });
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.slideEvent.destroy();
  }
}

customElements.define("r-nested-scroll", RNestedScroll);
