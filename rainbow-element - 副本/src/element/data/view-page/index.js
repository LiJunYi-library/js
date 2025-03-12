import { arrayForEachFindIndex } from "@rainbow_ljy/rainbow-js";
import {
  RainbowElement,
  toggleClass,
  createCustomEvent,
  createElement,
  createSlot,
  resizeObserver,
  getBoundingClientRect,
} from "../../base/index.js";
import "./index.css";

export class RTabs extends RainbowElement {
  static observedAttributes = this.$registerProps({});

  $$ = (() => {
    const onResize = (ets) => {
      const Offset = getBoundingClientRect(this.$$.activeChild);
      const activeOffset = getBoundingClientRect(this.$$.active);
      if (Offset.width === activeOffset.width && Offset.height === activeOffset.height) return;
      this.$$.setActiveStyle("instant");
    };
    return {
      value: undefined,
      active: createElement("div", "r-tab-active"),
      activeSlot: createSlot("slot", "r-tab-active-solt", "active"),
      def: createElement("div", "r-tab-def"),
      defSlot: createSlot("slot"),
      activeChild: createElement("div"),
      activeLine: createElement("div", "r-tab-active-line"),
      updateValue: (value) => {
        this.value = value;
        this.dispatchEvent(createCustomEvent("input", { value }));
        this.dispatchEvent(createCustomEvent("change", value));
      },
      setChildrenClass: (behavior = "smooth") => {
        toggleClass(this, behavior === "smooth", "r-tab-active-transition");
        if (this.value === undefined) {
          this.$$.active.style.width = 0 + "px";
          this.$$.active.style.height = 0 + "px";
          this.$$.active.style.left = `${0}px`;
          this.$$.active.style.top = `${0}px`;
          return;
        }
        const index = arrayForEachFindIndex(Array.from(this.children), (child) => {
          if (child.localName !== "r-tab-item") return false;
          const bool = this.value === child.value;
          toggleClass(child, bool, "r-tab-item-act");
          return bool;
        });
        this.$$.resizeObserver.unobserve(this.$$.activeChild);
        this.$$.activeChild = this.children[index];
        this.$$.setActiveStyle(behavior);
      },
      setActiveStyle: (behavior = "smooth") => {
        const { activeChild } = this.$$;
        const activeOffset = activeChild.getBoundingClientRect();
        const parentOffset = this.getBoundingClientRect();
        const scrollLeft = activeChild.offsetLeft - (parentOffset.width - activeOffset.width) / 2;
        this.$$.active.style.width = activeOffset.width + "px";
        this.$$.active.style.height = activeOffset.height + "px";
        this.$$.active.style.left = `${activeChild.offsetLeft}px`;
        this.$$.active.style.top = `${activeOffset.top - parentOffset.top}px`;
        this.scrollTo({ left: scrollLeft, behavior });
        this.$$.resizeObserver.observe(activeChild);
      },
      onResize,
      resizeObserver: resizeObserver(onResize),
    };
  })();

  set value(v) {
    const oldVal = this.$$.value;
    this.$$.value = v;
    if (oldVal === undefined) this.$$.setChildrenClass("instant");
    else this.$$.setChildrenClass("smooth");
  }

  get value() {
    return this.$$.value;
  }

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$$.active.appendChild(this.$$.activeLine);
    this.$$.active.appendChild(this.$$.activeSlot);
    this.shadowRoot.appendChild(this.$$.defSlot);
    this.shadowRoot.appendChild(this.$$.active);
    this.$$.resizeObserver.observe(this);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.setChildrenClass("instant");
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.resizeObserver.disconnect();
  }

  $render() {}
}

export class RTabItem extends RainbowElement {
  static observedAttributes = this.$registerProps({});

  $$ = {
    value: undefined,
    valueParent: undefined,
    click: () => {
      this.$$.valueParent?.$$?.updateValue?.(this.value);
    },
  };

  set value(v) {
    this.$$.value = v;
    toggleClass(this, this.value === this.$$.valueParent?.value, "r-tab-item-act");
  }

  get value() {
    return this.$$.value;
  }

  constructor(...arg) {
    super(...arg);
    this.addEventListener("click", this.$$.click);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.valueParent = this.$.findParentByLocalName("r-tabs");
    toggleClass(this, this.value === this.$$.valueParent?.value, "r-tab-item-act");
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
