import "./index.css";
import { RainbowElement, createCustomEvent } from "../../base/index.js";
import { setTimeoutPromise } from "@rainbow_ljy/rainbow-js";

export class RScroll extends RainbowElement {
  $elementName = "RScroll";

  // $$renderRefresh() {
  //   const text = document.createElement("div");
  //   text.classList.add("r-scroll-refresh-text");
  //   const rang = document.createElement("div");
  //   this.$$.top.append(text);
  //   this.$$.top.append(rang);
  //   return () => {
  //     rang.innerText = `${this.$$.refresh.height} /155`;
  //     text.innerText = (() => {
  //       if (this.$$.refresh.loading) return "正在刷新";
  //       if (this.$$.refresh.release) return "释放刷新";
  //       return "下拉刷新";
  //     })();
  //   };
  // }

  onrefresh() {
    return setTimeoutPromise(3000, true);
  }

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
    disabledScroll: () => {},
    unDisabledScroll: () => {},
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

customElements.define("r-scroll", RScroll);

// const opt = { passive: false, capture: true };
// this.$$.default.addEventListener("pointerdown", this.$$.refresh.pointerdown, opt);
// this.$$.default.addEventListener("pointermove", this.$$.refresh.pointermove, opt);
// this.$$.default.addEventListener("touchstart", this.$$.refresh.touchstart);
// this.$$.default.addEventListener("touchmove", this.$$.refresh.touchmove);
// this.$$.default.addEventListener("touchend", this.$$.refresh.touchend);
// this.$$.default.removeEventListener("pointerdown", this.$$.refresh.pointerdown);
// this.$$.default.removeEventListener("pointermove", this.$$.refresh.pointermove);
// this.$$.default.removeEventListener("touchstart", this.$$.refresh.touchstart);
// this.$$.default.removeEventListener("touchmove", this.$$.refresh.touchmove);
// this.$$.default.removeEventListener("touchend", this.$$.refresh.touchend);

// refresh: {
//   loading: false,
//   get release() {
//     return this.height > 155;
//   },
//   render: () => {},
//   pointerdownEvent: undefined,
//   touchstartEvent: undefined,
//   lock: false,
//   height: 0,
//   pointerdown: (event) => {
//     event.stopPropagation();
//     this.$$.refresh.pointerdownEvent = event;
//     this.$$.refresh.lock = false;
//   },
//   pointermove: (event) => {
//     event.stopPropagation();
//     const moveY = event.pageY - this.$$.refresh.pointerdownEvent.pageY;
//     if (this.scrollTop > 0) {
//       this.$$.default.removeEventListener("pointermove", this.$$.refresh.pointermove);
//       this.$$.refresh.lock = false;
//       return;
//     }
//     if (moveY >= 8 && this.scrollTop <= 0) this.$$.refresh.lock = true;
//   },
//   touchstart: (event) => {
//     event.stopPropagation();
//     this.$$.refresh.touchstartEvent = event.touches[0];
//   },
//   touchmove: (event) => {
//     event.stopPropagation();
//     let moveY = event.touches[0].pageY - this.$$.refresh.touchstartEvent.pageY;
//     if (this.$$.refresh.lock) {
//       event.stopImmediatePropagation();
//       event.preventDefault();
//       if (moveY < 0) moveY = 0;
//       this.$$.top.classList.remove("r-scroll-top-transition");
//       this.$$.refresh.height = (moveY / (205 / 2 + moveY)) * 205;
//       event.refreshHeight = this.$$.refresh.height;
//       this.$$.top.style.height = this.$$.refresh.height + "px";
//       if (this.onscrollrefresh) this.onscrollrefresh(event);
//       this.dispatchEvent(createCustomEvent("scrollrefresh", event));
//       this.$$.refresh.render();
//     }
//   },
//   touchend: async (event) => {
//     if (!this.$$.refresh.lock) return;
//     event.stopPropagation();
//     this.$$.top.classList.add("r-scroll-top-transition");
//     const release = this.$$.refresh.release;
//     this.$$.refresh.height = release ? 155 : 0;
//     this.$$.refresh.lock = false;
//     event.refreshHeight = this.$$.refresh.height;
//     this.$$.top.style.height = this.$$.refresh.height + "px";
//     this.$$.refresh.render();

//     if (release) {
//       this.$$.refresh.loading = true;
//       this.$$.refresh.render();
//       await this.onrefresh();
//       this.$$.refresh.height = 0;
//       event.refreshHeight = this.$$.refresh.height;
//       this.$$.refresh.loading = false;
//       this.$$.top.style.height = this.$$.refresh.height + "px";
//       this.$$.refresh.render();
//     }
//   },
// },
