import { arrayForEachFind } from "@rainbow_ljy/rainbow-js";
import { RainbowElement } from "../../base/index.js";
import {
  toggleClass,
  createCustomEvent,
  createElement,
  createSlot,
  resizeObserver,
  getBoundingClientRect,
  findParentByLocalName,
  addEventListenerOnce,
  removeEventListener,
  getChildren,
  getOffsetTop,
} from "../../../utils/index.js";
import "./index.css";

export class RScrollPage extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-scroll-offset-top": String, // px
  });
  $value = undefined;
  controller = undefined;
  $$ = (() => {
    return {
      index: -1,
      scrollView: undefined,
      activeChild: createElement("div"),
      updateValue: (value) => {
        this.$updateValue(value);
        this.dispatchEvent(createCustomEvent("change", { value }));
      },
      onScroll: (event) => {
        console.log("onScroll");

        const { scrollTop } = event;
        this.$$.activeChild = (() => {
          if (this.value === undefined) return undefined;
          const children = getChildren(this, "r-scroll-page-item");
          let min, max;
          let activeChild = arrayForEachFind(children, (child, index) => {
            const scrollOffsetTop = child.$.DATA.rScrollOffsetTop || 0;
            const offsetTop = getOffsetTop(child, this.$$.scrollView);
            const top = Math.max(0, offsetTop - scrollOffsetTop);
            min = Math.min(...[min, top].filter((el) => el !== undefined));
            const bottom = top + child.offsetHeight;
            max = Math.max(...[max, bottom].filter((el) => el !== undefined));
            const bool = top <= scrollTop && scrollTop <= bottom;
            toggleClass(child, bool, "r-scroll-page-item-act");
            const ratioH = Math.max(0, scrollTop - offsetTop + this.$$.scrollView.offsetHeight);
            const ratio = ratioH / child.offsetHeight;
            child.$$.ratio = Math.min(1, ratio);
            this.controller?.layout?.({ child, index });
            if (bool) this.$$.index = index;
            return bool;
          });
          if (scrollTop < min) {
            this.$$.index = 0;
            activeChild = children[0];
          }
          if (max < scrollTop) {
            this.$$.index = children.length - 1;
            activeChild = children[this.$$.index];
          }
          return activeChild;
        })();
        if (this.$$.activeChild?.value && this.value !== this.$$.activeChild?.value) {
          this.$$.updateValue(this.$$.activeChild?.value);
        }
      },
    };
  })();

  $onValueChange(...arg) {
    super.$onValueChange(...arg);
    this.$onRender();
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    const pName = ["r-scroll", "r-scroll-view", "r-nested-scroll"];
    this.$$.scrollView = findParentByLocalName(pName, this);
    addEventListenerOnce(this.$$.scrollView, "scroll", this.$$.onScroll);
    this.$onRender();
  }

  $onRender() {
    if (this.value === undefined) {
      this.$$.index = -1;
      this.$$.activeChild = undefined;
      return;
    }
    const children = getChildren(this, "r-scroll-page-item");
    this.$$.index = children.findIndex((c) => c.value === this.value);
    this.$$.activeChild = children.find((c) => c.value === this.value);
    const top = getOffsetTop(this.$$.activeChild, this.$$.scrollView);
    const scrollOffsetTop = this.$$.activeChild.$.DATA.rScrollOffsetTop || 0;
    this.$$.scrollView.scrollTop = Math.max(0, top - scrollOffsetTop);
  }
}

export class RScrollPageItem extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-scroll-offset-top": String,
  });

  $value = undefined;

  $$ = {
    valueParent: undefined,
    ratio: 0,
    click: () => {},
    setActive: () => {
      if (!this.$$.valueParent) return;
      this.$$.valueParent;
    },
  };

  constructor(...arg) {
    super(...arg);
  }

  $onValueChange(...arg) {
    super.$onValueChange(...arg);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.valueParent = findParentByLocalName("r-scroll-page", this);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
