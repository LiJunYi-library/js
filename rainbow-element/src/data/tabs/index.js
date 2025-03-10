import { arrayForEachFind } from "@rainbow_ljy/rainbow-js";
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
      isRenderFinish: false,
      renderFinish: () => (this.$$.isRenderFinish = true),
      renderFinishAnimationFrame: false,
      isActiveTransition: false,
      cache: { value: undefined },
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
      setChildrenClass: (forceBehavior) => {
        this.$$.activeChild = (() => {
          if (this.value === undefined) return undefined;
          return arrayForEachFind(Array.from(this.children), (child) => {
            if (child.localName !== "r-tab-item") return false;
            const bool = this.value === child.value;
            toggleClass(child, bool, "r-tab-item-act");
            return bool;
          });
        })();
        (() => {
          if (this.value === undefined) {
            this.$$.active.style.width = 0 + "px";
            this.$$.active.style.height = 0 + "px";
            this.$$.active.style.left = `${0}px`;
            this.$$.active.style.top = `${0}px`;
            return;
          }
          if (this.$$.cache.value === this.value) return;
          if (this.$$.cache.value === undefined && this.$$.isRenderFinish === false) {
            this.$$.setActiveStyle("instant", forceBehavior);
            return;
          }
          this.$$.setActiveStyle("smooth", forceBehavior);
        })();
        this.$$.cache.value = this.value;
      },
      setActiveStyle: (behavior = "smooth", forceBehavior) => {
        const { activeChild } = this.$$;
        if (!activeChild) return;
        if (this.$$.isActiveTransition === true) behavior = "smooth";
        if (forceBehavior) behavior = forceBehavior;
        toggleClass(this, behavior === "smooth", "r-tab-active-transition");
        if (behavior === "smooth") this.$$.isActiveTransition = true;
        const activeOffset = activeChild.getBoundingClientRect();
        const parentOffset = this.getBoundingClientRect();
        const scrollLeft = activeChild.offsetLeft - (parentOffset.width - activeOffset.width) / 2;
        this.$$.active.style.width = activeOffset.width + "px";
        this.$$.active.style.height = activeOffset.height + "px";
        this.$$.active.style.left = `${activeChild.offsetLeft}px`;
        this.$$.active.style.top = `${activeOffset.top - parentOffset.top}px`;
        this.scrollTo({ left: scrollLeft, behavior });
        this.$$.resizeObserver.observe(activeChild);
        this.$$.active.removeEventListener("transitionend", this.$$.onActiveTransitionend);
        this.$$.active.addEventListener("transitionend", this.$$.onActiveTransitionend);
      },
      onActiveTransitionend: () => {
        this.$$.isActiveTransition = false;
        this.classList.remove("r-tab-active-transition");
      },
      onResize,
      resizeObserver: resizeObserver(onResize),
    };
  })();

  set value(v) {
    this.$$.value = v;
    this.$$.setChildrenClass();
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
    if (this.getAttribute("value") !== null) this.value = this.getAttribute("value");
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.setChildrenClass();
    cancelAnimationFrame(this.$$.renderFinishAnimationFrame);
    this.$$.renderFinishAnimationFrame = requestAnimationFrame(this.$$.renderFinish);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.resizeObserver.disconnect();
    this.$$.isRenderFinish = false;
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
    setActive: () => {
      toggleClass(this, this.value === this.$$.valueParent?.value, "r-tab-item-act");
      if (this.value === this.$$.valueParent?.value) {
        this.$$.valueParent?.$$?.setChildrenClass?.();
      }
    },
  };

  set value(v) {
    this.$$.value = v;
    this.$$.setActive();
  }

  get value() {
    return this.$$.value;
  }

  constructor(...arg) {
    super(...arg);
    const trigger = this.getAttribute("trigger") || "click";
    if (trigger !== "none") this.addEventListener("click", this.$$.click);
    if (this.getAttribute("value") !== null) this.value = this.getAttribute("value");
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.valueParent = this.$.findParentByLocalName("r-tabs");
    this.$$.setActive();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
