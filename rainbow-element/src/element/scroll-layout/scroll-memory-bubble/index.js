import "./index.css";
import { RainbowElement } from "../../base/index.js";
import {
  addEventListenerOnce,
  findParentByLocalName,
  removeEventListener,
  toggleClass,
  functionInvokeKey,
} from "../../../utils/element.js";
export class RScrollMemoryBubble extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-orientation": String, // "left" "right" "top" "bottom"
    "r-init-visibility": String, // 'hidden' 'visible'
    "r-visible-distance": String, // px
    "r-visible-reversal": String, // none reversal
  });

  $value = true;

  $$ = {
    cache: { move: { y: 0 } },
    scrollView: undefined,
    show: (event) => {
      if (this.value === true) {
        this.$$.cache.move.y = 0;
        return;
      }
      this.$$.cache.move.y = this.$$.cache.move.y + Math.abs(event.moveY);
      if (this.$$.cache.move.y >= this.$.DATA.rVisibleDistance) {
        this.$$.cache.move.y = 0;
        this.$updateValue(true);
        this.$$setClass();
      }
    },
    hide: (event) => {
      if (this.value === false) {
        this.$$.cache.move.y = 0;
        return;
      }
      this.$$.cache.move.y = this.$$.cache.move.y + Math.abs(event.moveY);
      if (this.$$.cache.move.y >= this.$.DATA.rVisibleDistance) {
        this.$$.cache.move.y = 0;
        this.$updateValue(false);
        this.$$setClass();
      }
    },
    onScrollUp: (event) => {
      if (this.$.DATA.rVisibleReversal === "reversal") this.$$.show(event);
      else this.$$.hide(event);
    },
    onScrollDown: (event) => {
      if (this.$.DATA.rVisibleReversal === "reversal") this.$$.hide(event);
      else this.$$.show(event);
    },
  };

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    if (this.$.DATA.rInitVisibility !== "visible") this.$updateValue(false);
    const pName = ["r-scroll", "r-scroll-view", "r-nested-scroll"];
    this.$$.scrollView = findParentByLocalName(pName, this);
    addEventListenerOnce(this.$$.scrollView, "scrollUp", this.$$.onScrollUp);
    addEventListenerOnce(this.$$.scrollView, "scrollDown", this.$$.onScrollDown);
    this.$render();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    removeEventListener(this.$$.scrollView, "scrollUp", this.$$.onScrollUp);
    removeEventListener(this.$$.scrollView, "scrollDown", this.$$.onScrollDown);
  }

  $$setClass() {
    const { rOrientation } = this.$.DATA;
    this.cssList.add("r-scroll-memory-bubble-" + rOrientation);
    this.cssList.toggle(
      this.value,
      `r-scroll-memory-bubble-visible`,
      `r-scroll-memory-bubble-hide`,
    );
    this.cssList.toggle(
      this.value,
      `r-scroll-memory-bubble-visible-${rOrientation}`,
      `r-scroll-memory-bubble-hide-${rOrientation}`,
    );
  }

  $render() {
    this.$$setClass();
  }
}
