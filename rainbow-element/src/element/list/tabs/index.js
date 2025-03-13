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
} from "../../../utils/index.js";
import "./index.css";

export class RTabs extends RainbowElement {
  static observedAttributes = this.$registerProps({});

  $$ = (() => {
    const onResize = (ets) => {
      const Offset = getBoundingClientRect(this.$$.activeChild);
      const activeOffset = getBoundingClientRect(this.$$.active);
      if (Offset.width === activeOffset.width && Offset.height === activeOffset.height) return;
      this.$layout("instant");
    };
    return {
      controller: {},
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
        this.dispatchEvent(createCustomEvent("change", { value }));
      },
      onActiveTransitionend: () => {
        this.$$.isActiveTransition = false;
        this.classList.remove("r-tab-active-transition");
        this.$$.active.removeEventListener("transitionend", this.$$.onActiveTransitionend);
      },
      onResize,
      resizeObserver: resizeObserver(onResize),
    };
  })();

  set value(v) {
    this.$$.value = v;
    this.$onRender();
  }

  get value() {
    return this.$$.value;
  }

  set controller(controller) {
    this.$$.controller = controller;
  }

  get controller() {
    return this.$$.controller;
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
    this.$onRender();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.resizeObserver.disconnect();
  }

  $onRender(forceBehavior) {
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
      if (this.$.isRenderFinish === false) {
        this.$layout("instant", forceBehavior);
        return;
      }
      this.$layout("smooth", forceBehavior);
    })();
    this.$$.cache.value = this.value;
  }

  $layout(behavior = "smooth", forceBehavior) {
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
  }
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
        this.$$.valueParent?.$onRender?.();
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
    this.$$.valueParent = findParentByLocalName("r-tabs", this);
    this.$$.setActive();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
