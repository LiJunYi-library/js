import "./index.css";
import {
  findParentByLocalName,
  createCustomEvent,
  addEventListenerOnce,
  removeEventListener,
  createElement,
} from "../../../utils/index.js";
import { RMove } from "../../layout";

export class RScrollTop extends RMove {
  listView = "";

  $$ = {
    ...this.$$,
    caches: {
      ...this.$$.caches,
      scrollTop: 0,
    },
    lock: false,
    text: createElement("div", "r-scroll-top-text", ""),
    icon: createElement("div", "r-scroll-top-icon", ""),
    lookHistory: false,
    scrollView: undefined,
    listView: undefined,
    onClick: () => {
      this.$$.setListView();
      this.$$.lock = true;
      (() => {
        if (this.$$.lookHistory === false) return this.$$.scrollToTop();
        if (this.$$.lookHistory === true) return this.$$.scrollToHistory();
      })();
      requestAnimationFrame(() => {
        this.$$.setTextInnerHTML();
        this.$$.lock = false;
      });
    },
    scrollToTop: () => {
      this.$$.caches.scrollTop = this.$$.scrollView.scrollTop;
      this.$$.scrollView.scrollTop = 0;
      this.$$.lookHistory = true;
      this.cssList.toggle(this.$$.lookHistory, "r-scroll-top-history");
    },
    scrollToHistory: () => {
      this.$$.scrollView.scrollTop = this.$$.caches.scrollTop;
      this.$$.lookHistory = false;
      this.cssList.toggle(this.$$.lookHistory, "r-scroll-top-history");
    },
    onScroll: ({ scrollTop }) => {
      this.$$.setListView();
      if (this.$$.lock === true) return;
      this.cssList.toggle(scrollTop >= 1200, "r-scroll-top-show", "r-scroll-top-hide");
      this.$$.lookHistory = false;
      this.cssList.toggle(this.$$.lookHistory, "r-scroll-top-history");
      this.$$.setTextInnerHTML();
    },
    setTextInnerHTML: () => {
      const { text, listView } = this.$$;
      if (!listView) return (text.innerHTML = "");
      text.innerHTML = `${listView.$$.visible.end + 1}/${listView.value.length}`;
    },
    setListView: () => {
      if (this.$$.listView instanceof Element) return;
      let lv = findParentByLocalName("r-scroll-virtual-falls-list", this);
      if (lv) return (this.$$.listView = lv);
      if (this.listView instanceof Element) return (this.$$.listView = this.listView);
      lv = document.getElementById(this.listView);
      if (lv) return (this.$$.listView = lv);
    },
  };

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.append(this.$$.text, this.$$.icon);
    const pName = ["r-scroll", "r-scroll-view", "r-nested-scroll"];
    this.$$.setListView();
    this.$$.scrollView = findParentByLocalName(pName, this);
    addEventListenerOnce(this, "click", this.$$.onClick);
    addEventListenerOnce(this.$$.scrollView, "scroll", this.$$.onScroll);
    this.$$.onScroll({ scrollTop: 0 });
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    removeEventListener(this, "click", this.$$.onClick);
  }
}
