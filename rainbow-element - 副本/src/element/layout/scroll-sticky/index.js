import "./index.css";
import { RainbowElement, toggleClass } from "../../base/index.js";

export class RScrollSticky extends RainbowElement {
  static observedAttributes = this.$registerProps({
    top: Number,
    bottom: Number,
    "r-active-top": Number, // r-scroll-sticky-act 的高度
    "r-active-bottom": Number, // r-scroll-sticky-act 的高度
    "r-scroll-anima": Number,
    "r-opacity-ani": Boolean,
    "r-opacity-top": Number,
    "r-visible-ani": Boolean,
    "r-visible-top": Number,
    "r-opacity-delay": Number,
  });

  $$ = {
    class: this.$$onGetClass(),
    top: {
      isSticky: false,
      isStickyTop: false,
      isStickyBottom: false,
      isStickyAct: false,
    },
    bottom: {
      isSticky: false,
      isStickyTop: false,
      isStickyBottom: false,
      isStickyAct: false,
    },
    scrollParent: document.createElement("div"),
    onScroll: (event) => {
      let { scrollTop } = event;
      const offsetTop = this.$.getOffsetTop(this);
      this.$$.stickyBottom(scrollTop, offsetTop);
      this.$$.stickyTop(scrollTop, offsetTop);
    },
    stickyTop: (scrollTop, offsetTop) => {
      const { top, rActiveTop } = this.$.DATA;
      let stickyTop = offsetTop - scrollTop;
      if (Math.abs(stickyTop - top) < 0.5) stickyTop = top;
      this.$$.top.isSticky = top === stickyTop;
      this.$$.top.isStickyTop = top >= stickyTop;
      this.$$.top.isStickyBottom = top <= stickyTop;
      this.$$.top.isStickyAct = scrollTop >= rActiveTop;
      const { isSticky, isStickyAct, isStickyTop, isStickyBottom } = this.$$.top;
      const topClass = this.$$.class.top;
      toggleClass(this, isSticky, topClass.isSticky, topClass.unSticky);
      toggleClass(this, isStickyAct, topClass.isStickyAct, topClass.unStickyAct);
      toggleClass(this, isStickyTop, topClass.isStickyTop, topClass.unStickyTop);
      toggleClass(this, isStickyBottom, topClass.isStickyBottom, topClass.unStickyBottom);
    },
    stickyBottom: (scrollTop, offsetTop) => {
      const { bottom, rActiveBottom } = this.$.DATA;
      let stickyTop = offsetTop - scrollTop;
      let pTop = Math.round(this.$$.scrollParent.offsetHeight - bottom - this.offsetHeight);
      if (Math.abs(stickyTop - pTop) < 0.8) stickyTop = pTop;
      this.$$.bottom.isSticky = pTop === stickyTop;
      const { isSticky, isStickyAct, isStickyTop, isStickyBottom } = this.$$.bottom;
      const bottomClass = this.$$.class.bottom;
      toggleClass(this, isSticky, bottomClass.isSticky, bottomClass.unSticky);
      // console.log(stickyTop);
    },
  };

  $$onGetClass() {
    return {
      top: {
        isSticky: "r-scroll-sticky-sticky-top",
        unSticky: "r-scroll-sticky-unsticky-top",
        isStickyAct: "r-scroll-sticky-act-top",
        unStickyAct: "r-scroll-sticky-unact-top",
        isStickyTop: "r-scroll-sticky-top-top",
        unStickyTop: "r-scroll-sticky-untop-top",
        isStickyBottom: "r-scroll-sticky-bottom-top",
        unStickyBottom: "r-scroll-sticky-unbottom-top",
      },
      bottom: {
        isSticky: "r-scroll-sticky-sticky-bottom",
        unSticky: "r-scroll-sticky-unsticky-bottom",
      },
    };
  }

  $render() {
    console.log(this.$.data);
    this.$$.onScroll({ scrollTop: this.$$.scrollParent.scrollTop });
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.scrollParent = this.$.findParentByLocalName([
      "r-scroll",
      "r-scroll-view",
      "r-nested-scroll",
    ]);
    this.$$.scrollParent.addEventListener("scroll", this.$$.onScroll.bind(this));
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.scrollParent.removeEventListener("scroll", this.$$.onScroll.bind(this));
  }
}

export class RScrollFixed extends RScrollSticky {
  $$onGetClass() {
    return {
      top: {
        isSticky: "r-scroll-fixed-fixed-top",
        unSticky: "r-scroll-fixed-unfixed-top",
        isStickyAct: "r-scroll-fixed-act-top",
        unStickyAct: "r-scroll-fixed-unact-top",
        isStickyTop: "r-scroll-fixed-top-top",
        unStickyTop: "r-scroll-fixed-untop-top",
        isStickyBottom: "r-scroll-fixed-bottom-top",
        unStickyBottom: "r-scroll-fixed-unbottom-top",
      },
      bottom: {
        isSticky: "r-scroll-fixed-fixed-bottom",
        unSticky: "r-scroll-fixed-unfixed-bottom",
      },
    };
  }
}

// get $$opacityTop() {
//     if (this.$attrs['opacity-top'] !== undefined) return this.$attrs['opacity-top']
//     return this.$initTop
// }

// get $visibleTop() {
//     if (this.$attrs['visible-top'] !== undefined) return this.$attrs['visible-top']
//     return this.$$opacityTop
// }

// $$onScroll(event) {
//   console.log("onScroll", event);
//   // console.log(this.$attrs);
//   // if (this.$attrs.top === undefined) return;
//   // const { scrollTop, } = this.$scrollParent;
//   // const { top, opacityDelay } = this.$attrs;
//   // let oTop = Math.round(this.$getOffsetTop(this) - scrollTop);
//   // this.$$isSticky = top === oTop;
//   // this.$$isStickyTop = top >= oTop;
//   // this.$$isStickyBottom = top <= oTop;
//   // if (this.$attrs['active-top'] !== undefined) this.$$isStickyAct = scrollTop >= this.$attrs['active-top'];

//   // const opacity = ((scrollTop - opacityDelay) / (this.$$opacityTop - top)).toFixed(3)
//   // if (this.$attrs['opacity-ani'] === true) this.$$opacity = opacity
//   // if (this.$attrs['opacity-ani'] === false) this.$$opacity = 1 - opacity

//   // const visible = ((scrollTop) / (this.$visibleTop - top))
//   // if (this.$attrs['visible-ani'] === true) this.$$display = visible > 1 ? 'block' : 'none';
//   // if (this.$attrs['visible-ani'] === false) this.$$display = (1 - visible) < 0 ? 'none' : 'block';

//   // this.$bindClass();
//   // this.$bindStyle();
// }
