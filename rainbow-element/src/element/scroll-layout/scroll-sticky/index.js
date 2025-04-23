import "./index.css";
import { RainbowElement } from "../../base/index.js";
import {
  findParentByLocalName,
  toggleClass,
  getOffsetTop,
  addEventListenerOnce,
  functionInvokeKey,
} from "../../../utils/index.js";

export class RScrollSticky extends RainbowElement {
  static observedAttributes = this.$registerProps({
    top: Number,
    bottom: Number,
    "r-active-top": Number, // r-scroll-sticky-act 的高度
    "r-active-bottom": Number, // r-scroll-sticky-act 的高度
    "r-opacity-top": Number,
    "r-opacity-bottom": Number,
    "r-opacity-sequence": String, // reverse none
  });

  $$ = {
    class: this.$$onGetClass(),
    top: {
      isSticky: false,
      isStickyTop: false,
      isStickyBottom: false,
      isStickyAct: false,
      opacity: {
        reverse: (scrollTop, top, rOpacityTop) => {
          const opacity = 1 - Math.min(1, scrollTop / (rOpacityTop - top));
          this.style.opacity = opacity;
        },
        default: (scrollTop, top, rOpacityTop) => {
          const opacity = Math.min(1, scrollTop / (rOpacityTop - top));
          this.style.opacity = opacity;
        },
      },
    },
    bottom: {
      isSticky: false,
      isStickyTop: false,
      isStickyBottom: false,
      isStickyAct: false,
      opacity: {
        reverse: (scrollBottom, bottom, rOpacityBottom) => {
          const opacity = 1 - Math.min(1, scrollBottom / (rOpacityBottom - bottom));
          this.style.opacity = opacity;
        },
        default: (scrollBottom, bottom, rOpacityBottom) => {
          const opacity = Math.min(1, scrollBottom / (rOpacityBottom - bottom));
          this.style.opacity = opacity;
        },
      },
    },
    scrollParent: document.createElement("div"),
    onScroll: () => {
      const scrollTop = this.$$.scrollParent.scrollTop;
      const offsetTop = getOffsetTop(this, this.$$.scrollParent);
      this.$$.stickyBottom(scrollTop, offsetTop);
      this.$$.stickyTop(scrollTop, offsetTop);
    },
    stickyTop: (scrollTop, offsetTop) => {
      const { top, rActiveTop, rOpacityTop, rOpacitySequence } = this.$.DATA;
      if (typeof top !== "number") return;
      let stickyTop = offsetTop - scrollTop;
      if (Math.abs(stickyTop - top) < 0.5) stickyTop = top;
      this.$$.top.isSticky = top === stickyTop;
      this.$$.top.isStickyTop = top >= stickyTop;
      this.$$.top.isStickyBottom = top <= stickyTop;
      this.$$.top.isStickyAct = scrollTop >= rActiveTop;
      const { isSticky, isStickyAct, isStickyTop, isStickyBottom } = this.$$.top;
      const topClass = this.$$.class.top;
      this.cssList.toggle(isSticky, topClass.isSticky, topClass.unSticky);
      this.cssList.toggle(isStickyAct, topClass.isStickyAct, topClass.unStickyAct);
      this.cssList.toggle(isStickyTop, topClass.isStickyTop, topClass.unStickyTop);
      this.cssList.toggle(isStickyBottom, topClass.isStickyBottom, topClass.unStickyBottom);
      if (rOpacityTop) {
        functionInvokeKey(this.$$.top.opacity, rOpacitySequence)(scrollTop, top, rOpacityTop);
      }
    },
    stickyBottom: (scrollTop, offsetTop) => {
      const { bottom, rActiveBottom, rOpacityBottom, rOpacitySequence } = this.$.DATA;
      if (typeof bottom !== "number") return;
      const height = this.$$.scrollParent.offsetHeight;
      const scrollHeight = this.$$.scrollParent.scrollHeight;
      let stickyBottom = height - offsetTop + scrollTop - this.offsetHeight;
      if (Math.abs(stickyBottom - bottom) < 0.5) stickyBottom = bottom;
      const scrollBottom = scrollHeight - scrollTop - height;
      this.$$.bottom.isSticky = bottom === stickyBottom;
      this.$$.bottom.isStickyAct = scrollBottom >= rActiveBottom;
      const { isSticky, isStickyAct, isStickyTop, isStickyBottom } = this.$$.bottom;
      const bClass = this.$$.class.bottom;
      this.cssList.toggle(isSticky, bClass.isSticky, bClass.unSticky);
      this.cssList.toggle(isStickyAct, bClass.isStickyAct, bClass.unStickyAct);
      if (rOpacityBottom) {
        functionInvokeKey(this.$$.bottom.opacity, rOpacitySequence)(
          scrollBottom,
          bottom,
          rOpacityBottom,
        );
      }
    },
  };

  $$onGetClass() {
    return {
      top: {
        isSticky: "r-scroll-sticky-top-sticky",
        unSticky: "r-scroll-sticky-top-unsticky",
        isStickyAct: "r-scroll-sticky-top-act",
        unStickyAct: "r-scroll-sticky-top-unact",
        isStickyTop: "r-scroll-sticky-top-top",
        unStickyTop: "r-scroll-sticky-top-untop",
        isStickyBottom: "r-scroll-sticky-top-bottom",
        unStickyBottom: "r-scroll-sticky-top-unbottom",
      },
      bottom: {
        isSticky: "r-scroll-sticky-bottom-sticky",
        unSticky: "r-scroll-sticky-bottom-unsticky",
        isStickyAct: "r-scroll-sticky-bottom-act",
        unStickyAct: "r-scroll-sticky-bottom-unact",
        isStickyTop: "r-scroll-sticky-bottom-top",
        unStickyTop: "r-scroll-sticky-bottom-untop",
        isStickyBottom: "r-scroll-sticky-bottom-bottom",
        unStickyBottom: "r-scroll-sticky-bottom-unbottom",
      },
    };
  }

  $render() {
    console.log(this.$.data);
    this.$$.onScroll({ scrollTop: this.$$.scrollParent.scrollTop });
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    const scrollName = ["r-scroll", "r-scroll-view", "r-nested-scroll"];
    this.$$.scrollParent = findParentByLocalName(scrollName, this);
    addEventListenerOnce(this.$$.scrollParent, "scroll", this.$$.onScroll);
    this.$$.onScroll();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.scrollParent.removeEventListener("scroll", this.$$.onScroll);
  }

  $onStyleChang(...arg) {
    super.$onStyleChang(...arg);
    this.$$.onScroll();
  }

  $onResize(...arg) {
    super.$onResize(...arg);
    this.$$.onScroll();
  }
}

export class RScrollFixed extends RScrollSticky {
  $$onGetClass() {
    return {
      top: {
        isSticky: "r-scroll-fixed-top-fixed",
        unSticky: "r-scroll-fixed-top-unfixed",
        isStickyAct: "r-scroll-fixed-top-act",
        unStickyAct: "r-scroll-fixed-top-unact",
        isStickyTop: "r-scroll-fixed-top-top",
        unStickyTop: "r-scroll-fixed-top-untop",
        isStickyBottom: "r-scroll-fixed-top-bottom",
        unStickyBottom: "r-scroll-fixed-top-unbottom",
      },
      bottom: {
        isSticky: "r-scroll-fixed-bottom-fixed",
        unSticky: "r-scroll-fixed-bottom-unfixed",
        isStickyAct: "r-scroll-fixed-bottom-act",
        unStickyAct: "r-scroll-fixed-bottom-unact",
        isStickyTop: "r-scroll-fixed-bottom-top",
        unStickyTop: "r-scroll-fixed-bottom-untop",
        isStickyBottom: "r-scroll-fixed-bottom-bottom",
        unStickyBottom: "r-scroll-fixed-bottom-unbottom",
      },
    };
  }
}
