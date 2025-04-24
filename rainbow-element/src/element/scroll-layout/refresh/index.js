import "./index.css";
import { setTimeoutPromise } from "@rainbow_ljy/rainbow-js";
import { RainbowElement } from "../../base/index.js";
import { createCustomEvent, createElement, createSlot } from "../../../utils/index.js";

export class RRefresh extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-refresh-heignt": { type: String, default: "0" },
    "r-max-refresh-heignt": { type: String, default: "0" },
    "r-min-time": { type: String, default: "500" },
  });

  onrefresh() {}

  $$renderRefresh() {
    // const circle = document.createElement("r-circle");
    // circle.classList.add("r-scroll-refresh-circle");
    // const loadIcon = document.createElement("i");
    // loadIcon.classList.add("loading-icon", "iconfont", "r-scroll-refresh-loading");
    // loadIcon.innerHTML = "&#xe607;";
    // const text = document.createElement("div");
    // text.classList.add("r-scroll-refresh-text");

    // this.$.append(circle);
    // this.$.append(loadIcon);
    // this.$.append(text);

    // const handleLoading = () => {
    //   if (!this.$$.loading) {
    //     loadIcon.classList.add("r-scroll-refresh-loading-hide");
    //     circle.classList.remove("r-scroll-refresh-circle-hide");
    //   } else {
    //     loadIcon.classList.remove("r-scroll-refresh-loading-hide");
    //     circle.classList.add("r-scroll-refresh-circle-hide");
    //   }
    // };

    // handleLoading();
    return () => {
      // handleLoading();
      // const { rRefreshHeignt } = this.$.DATA;
      // circle.value = (this.$$.height / rRefreshHeignt) * 100;
      // text.innerText = (() => {
      //   if (this.$$.loading) return "正在刷新";
      //   if (this.$$.release) return "释放刷新";
      //   return "下拉刷新";
      // })();
    };
  }

  $$ = {
    createPromise: () => {
      return new Promise((resolve) => {
        this.$$.resolve = resolve;
      });
    },
    resolve: () => 0,
    promise: undefined,
    scrollView: createElement("div"),
    loading: false,
    DATA: this.$.DATA,
    get release() {
      const { rRefreshHeignt } = this.DATA;
      return this.height > rRefreshHeignt;
    },
    render: () => {},
    defaultSlot: createSlot("slot", "r-refresh-default-slot", ""),
    topSlot: createSlot("slot", "r-refresh-top-slot", "top"),
    content: createElement("div", "r-refresh-content"),
    pointerdownEvent: undefined,
    touchstartEvent: undefined,
    lock: false,
    height: 0,
    pointerdown: (event) => {
      if (this.$$.loading === true) return;
      // event.stopPropagation();
      this.$$.pointerdownEvent = event;
      this.$$.lock = false;
    },
    pointermove: (event) => {
      console.log(this.$$.loading);
      if (this.$$.loading === true) return;
      // event.stopPropagation();
      const moveY = event.pageY - this.$$.pointerdownEvent.pageY;
      const { scrollView } = this.$$;
      if (scrollView.scrollTop > 0) {
        scrollView.removeEventListener("pointermove", this.$$.pointermove);
        this.$$.lock = false;
        return;
      }
      if (moveY >= 8 && scrollView.scrollTop <= 0) this.$$.lock = true;
    },
    touchstart: (event) => {
      if (this.$$.loading === true) return;
      // event.stopPropagation();
      this.$$.touchstartEvent = event.touches[0];
    },
    touchmove: (event) => {
      if (this.$$.loading === true) return;
      if (!this.$$.lock) return;
      const { rMaxRefreshHeignt } = this.$.DATA;
      // event.stopPropagation();
      let moveY = event.touches[0].pageY - this.$$.touchstartEvent.pageY;
      event.stopImmediatePropagation();
      event.preventDefault();
      if (moveY < 0) moveY = 0;
      this.classList.remove("r-scroll-refresh-transition");
      this.$$.height = (moveY / (rMaxRefreshHeignt / 2 + moveY)) * rMaxRefreshHeignt;
      event.refreshHeight = this.$$.height;
      this.style.height = this.$$.height + "px";
      this.$$.render();
    },
    touchend: async (event) => {
      if (this.$$.loading === true) return;
      if (!this.$$.lock) return;
      // event.stopPropagation();
      const { scrollView } = this.$$;
      const { rRefreshHeignt, rMinTime } = this.$.DATA;
      this.classList.add("r-scroll-refresh-transition");
      const release = this.$$.release;
      this.$$.height = release ? rRefreshHeignt : 0;
      this.$$.lock = false;
      event.refreshHeight = this.$$.height;
      this.style.height = this.$$.height + "px";
      this.$$.render();
      if (release) {
        this.$$.loading = true;
        this.$$.render();
        scrollView.$$.disabledScroll();
        this.$$.promise = this.$$.createPromise();
        event.resolve = this.$$.resolve;
        this.dispatchEvent(createCustomEvent("refresh", event));
        await Promise.allSettled(
          [setTimeoutPromise(rMinTime, true), this.onrefresh(), this.$$.promise].filter(Boolean),
        );
        this.$$.height = 0;
        event.refreshHeight = this.$$.height;
        this.$$.loading = false;
        this.style.height = this.$$.height + "px";
        this.$$.render();
        scrollView.$$.unDisabledScroll();
      }
    },
    bindEvents: (scrollView) => {
      this.$$.scrollView = scrollView;
      const opt = { passive: false, capture: true };
      scrollView.addEventListener("pointerdown", this.$$.pointerdown, opt);
      scrollView.addEventListener("pointermove", this.$$.pointermove, opt);
      scrollView.addEventListener("touchstart", this.$$.touchstart);
      scrollView.addEventListener("touchmove", this.$$.touchmove);
      scrollView.addEventListener("touchend", this.$$.touchend);
      this.$$.render = this.$$renderRefresh();
    },
    unbindEvents: () => {
      const { scrollView } = this.$$;
      scrollView.removeEventListener("pointerdown", this.$$.pointerdown);
      scrollView.removeEventListener("pointermove", this.$$.pointermove);
      scrollView.removeEventListener("touchstart", this.$$.touchstart);
      scrollView.removeEventListener("touchmove", this.$$.touchmove);
      scrollView.removeEventListener("touchend", this.$$.touchend);
    },
  };

  constructor(...arg) {
    super(...arg);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.$$.topSlot);
    this.$$.content.appendChild(this.$$.defaultSlot )
    this.shadowRoot.appendChild(this.$$.content);
    // this.$$.scrollView = this.$.findChildByLocalName(["r-scroll"]);
    // const child = document.getElementsByTagName("r-scroll");
    // console.log(this.$$.scrollView);
    // const { scrollView } = this.$$;
    // const opt = { passive: false, capture: true };
    // scrollView.addEventListener("pointerdown", this.$$.pointerdown, opt);
    // scrollView.addEventListener("pointermove", this.$$.pointermove, opt);
    // scrollView.addEventListener("touchstart", this.$$.touchstart);
    // scrollView.addEventListener("touchmove", this.$$.touchmove);
    // scrollView.addEventListener("touchend", this.$$.touchend);
    // this.$$.render = this.$$renderRefresh();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    // const { scrollView } = this.$$;
    // scrollView.removeEventListener("pointerdown", this.$$.pointerdown);
    // scrollView.removeEventListener("pointermove", this.$$.pointermove);
    // scrollView.removeEventListener("touchstart", this.$$.touchstart);
    // scrollView.removeEventListener("touchmove", this.$$.touchmove);
    // scrollView.removeEventListener("touchend", this.$$.touchend);
  }
}
