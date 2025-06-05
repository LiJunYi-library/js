import { arrayForEachFind } from "@rainbow_ljy/rainbow-js";
import { RainbowElement } from "../../base/index.js";
import {
  toggleClass,
  createCustomEvent,
  createElement,
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

  set controller(controller) {
    this.$$.controller = controller;
    controller.scrollPage = this;
  }

  get controller() {
    return this.$$.controller;
  }

  $$ = (() => {
    return {
      controller: {},
      index: -1,
      scrollView: undefined,
      activeChild: createElement("div"),
      updateValue: (value) => {
        this.$updateValue(value);
        this.dispatchEvent(createCustomEvent("change", { value }));
      },
      onScroll: (event) => {
        const { scrollTop } = event;
        const scrollBottom = scrollTop + this.$$.scrollView.offsetHeight;
        this.$$.activeChild = (() => {
          if (this.value === undefined) return undefined;
          const children = getChildren(this, "r-scroll-page-item");
          let min, max;
          let activeChild = arrayForEachFind(children, (child, index) => {
            const scrollOffsetTop = child.$.DATA.rScrollOffsetTop || 0;
            const offsetTop = getOffsetTop(child, this.$$.scrollView);
            const offsetBottom = offsetTop + child.offsetHeight;
            const top = Math.max(0, offsetTop - scrollOffsetTop);
            min = Math.min(...[min, top].filter((el) => el !== undefined));
            const bottom = top + child.offsetHeight;
            max = Math.max(...[max, bottom].filter((el) => el !== undefined));
            const bool = (() => {
              if (top <= scrollTop && scrollTop <= bottom) return true;
              if (top > scrollTop && scrollBottom >= offsetBottom) return true;
              return false;
            })();
            toggleClass(child, false, "r-scroll-page-item-act");
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
        toggleClass(this.$$.activeChild, true, "r-scroll-page-item-act");
        if (this.$$.activeChild?.value && this.value !== this.$$.activeChild?.value) {
          this.$$.updateValue(this.$$.activeChild?.value);
        }
      },
    };
  })();

  $onValueChange(...arg) {
    super.$onValueChange(...arg);
    this.$render();
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    const pName = ["r-scroll", "r-scroll-view", "r-nested-scroll"];
    this.$$.scrollView = findParentByLocalName(pName, this);
    addEventListenerOnce(this.$$.scrollView, "scroll", this.$$.onScroll);
    this.$render();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    removeEventListener(this.$$.scrollView, "scroll", this.$$.onScroll);
  }

  $render() {
    if (this.value === undefined) {
      this.$$.index = -1;
      this.$$.activeChild = undefined;
      return;
    }
    if (!this.$$.scrollView) return;
    const children = getChildren(this, "r-scroll-page-item");
    this.$$.index = children.findIndex((c) => c.value === this.value);
    this.$$.activeChild = children.find((c) => c.value === this.value);
    const { activeChild, scrollView } = this.$$;
    const offsetTop = getOffsetTop(activeChild, scrollView);
    const scrollOffsetTop = activeChild.$.DATA.rScrollOffsetTop || 0;
    let scrollTop = (() => {
      if (activeChild.offsetHeight < scrollView.offsetHeight - scrollOffsetTop) {
        return offsetTop - (scrollView.offsetHeight - activeChild.offsetHeight);
      }
      return offsetTop - scrollOffsetTop;
    })();
    scrollTop = Math.max(0, scrollTop);
    this.$$.scrollView.scrollTop = scrollTop;
    if (scrollTop === 0) this.$$.onScroll({ scrollTop });
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
    this.$$.valueParent.$render();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
