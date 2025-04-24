import "./index.css";
import { setTimeoutPromise } from "@rainbow_ljy/rainbow-js";
import { RainbowElement } from "../../base/index.js";
import {
  findParentByLocalName,
  addEventListenerOnce,
  removeEventListener,
} from "../../../utils/index.js";

export class RScrollRefresh extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-refresh-heignt": { type: String, default: "0" },
    "r-max-refresh-heignt": { type: String, default: "0" },
    "r-min-time": { type: String, default: "500" },
  });

  async onrefresh() {}

  $$renderRefresh() {
    const circle = document.createElement("r-circle");
    circle.classList.add("r-scroll-refresh-circle");
    const loadIcon = document.createElement("i");
    loadIcon.classList.add("loading-icon", "iconfont", "r-scroll-refresh-loading");
    const text = document.createElement("div");
    text.classList.add("r-scroll-refresh-text");

    this.$.append(circle);
    this.$.append(loadIcon);
    this.$.append(text);

    const handleLoading = () => {
      if (!this.$$.loading) {
        loadIcon.classList.add("r-scroll-refresh-loading-hide");
        circle.classList.remove("r-scroll-refresh-circle-hide");
      } else {
        loadIcon.classList.remove("r-scroll-refresh-loading-hide");
        circle.classList.add("r-scroll-refresh-circle-hide");
      }
    };

    handleLoading();
    return () => {
      handleLoading();
      const { rRefreshHeignt } = this.$.DATA;
      circle.value = (this.$$.height / rRefreshHeignt) * 100;
      text.innerText = (() => {
        if (this.$$.loading) return "正在刷新";
        if (this.$$.release) return "释放刷新";
        return "下拉刷新";
      })();
    };
  }

  $$ = {
    scrollView: undefined,
    eventView: undefined,
    loading: false,
    DATA: this.$.DATA,
    get release() {
      const { rRefreshHeignt } = this.DATA;
      return this.height > rRefreshHeignt;
    },
    render: () => {},
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
      if (this.$$.loading === true) return;
      // event.stopPropagation();
      const moveY = event.pageY - this.$$.pointerdownEvent.pageY;
      if (this.$$scrollView.scrollTop > 0) {
        this.$$eventView.removeEventListener("pointermove", this.$$.pointermove);
        this.$$.lock = false;
        return;
      }
      if (moveY >= 8 && this.$$scrollView.scrollTop <= 0) this.$$.lock = true;
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
        this.$$scrollView.$$.disabledScroll();
        await Promise.allSettled([setTimeoutPromise(rMinTime, true), this.onrefresh()]);
        this.$$.height = 0;
        event.refreshHeight = this.$$.height;
        this.$$.loading = false;
        this.style.height = this.$$.height + "px";
        this.$$.render();
        this.$$scrollView.$$.unDisabledScroll();
      }
    },
  };

  constructor(...arg) {
    super(...arg);
  }

  get $$eventView() {
    if (this.$$.scrollView) return this.$$.scrollView;
    return this.$$.eventView;
  }

  get $$scrollView() {
    if (this.$$.scrollView) return this.$$.scrollView;
    return this.$$.eventView?.$$?.scrollView;
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.classList.add("r-scroll-refresh");
    const pName = ["r-scroll", "r-scroll-view", "r-nested-scroll"];
    this.$$.scrollView = findParentByLocalName(pName, this);
    this.$$.eventView = findParentByLocalName(["r-scroll-window"], this);
    const opt = { passive: false, capture: true };
    addEventListenerOnce(this.$$eventView, "pointerdown", this.$$.pointerdown, opt);
    addEventListenerOnce(this.$$eventView, "pointermove", this.$$.pointermove, opt);
    addEventListenerOnce(this.$$eventView, "touchstart", this.$$.touchstart);
    addEventListenerOnce(this.$$eventView, "touchmove", this.$$.touchmove);
    addEventListenerOnce(this.$$eventView, "touchend", this.$$.touchend);
    this.$$.render = this.$$renderRefresh();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    removeEventListener(this.$$eventView, "pointerdown", this.$$.pointerdown);
    removeEventListener(this.$$eventView, "pointermove", this.$$.pointermove);
    removeEventListener(this.$$eventView, "touchstart", this.$$.touchstart);
    removeEventListener(this.$$eventView, "touchmove", this.$$.touchmove);
    removeEventListener(this.$$eventView, "touchend", this.$$.touchend);
  }
}
