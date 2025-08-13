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
} from "../../../utils/index.js";
import "./index.css";
import innerCss from "./index.icss";

export class RTab extends RainbowElement {
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
      active: createSlot("slot", "r-tab-active", "active"),
      defSlot: createSlot("slot"),
      activeChild: createElement("div"),
      updateValue: (value) => {
        this.value = value;
        this.dispatchEvent(createCustomEvent("input", { value }));
        this.dispatchEvent(createCustomEvent("change", { value }));
      },
      onActiveTransitionend: () => {
        this.$$.isActiveTransition = false;
        this.cssList.remove("r-tab-active-transition");
        this.$$.active.classList.remove("r-tab-active-transition");
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
    controller.tabs = this;
  }

  get controller() {
    return this.$$.controller;
  }

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.$.styleNode);
    this.innerCss = innerCss;
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
      const children = getChildren(this, "r-tab-item");
      return arrayForEachFind(children, (child, index) => {
        const bool = this.value === child.value;
        const prveChild = children[index - 1];
        const nextChild = children[index + 1];
        const prveBool = nextChild ? this.value === nextChild.value : false;
        const nextBool = prveChild ? this.value === prveChild.value : false;
        toggleClass(child, bool, "r-tab-item-act");
        toggleClass(child, prveBool, "r-tab-item-prve-act");
        toggleClass(child, nextBool, "r-tab-item-next-act");
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
    this.cssList.toggle(behavior === "smooth", "r-tab-active-transition");
    toggleClass(this.$$.active, behavior === "smooth", "r-tab-active-transition");
    if (behavior === "smooth") this.$$.isActiveTransition = true;
    const activeOffset = activeChild.getBoundingClientRect();
    const parentOffset = this.getBoundingClientRect();
    const scrollLeft = activeChild.offsetLeft - (parentOffset.width - activeOffset.width) / 2;
    const scrollTop = activeChild.offsetTop - (parentOffset.height - activeOffset.height) / 2;
    this.$$.active.style.width = activeOffset.width + "px";
    this.$$.active.style.height = activeOffset.height + "px";
    this.$$.active.style.left = `${activeChild.offsetLeft}px`;
    this.$$.active.style.top = `${activeChild.offsetTop}px`;
    this.scrollTo({ left: scrollLeft, behavior, top: scrollTop });
    this.$$.resizeObserver.observe(activeChild);
    this.$$.active.removeEventListener("transitionend", this.$$.onActiveTransitionend);
    this.$$.active.addEventListener("transitionend", this.$$.onActiveTransitionend);
  }
}

export class RTabItem extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-trigger": String,
  });

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
    if (this.getAttribute("value") !== null) this.value = this.getAttribute("value");
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.valueParent = findParentByLocalName("r-tab", this);
    this.$$.setActive();
    const { rTrigger } = this.$.DATA;
    if (rTrigger && rTrigger !== "none") addEventListenerOnce(this, rTrigger, this.$$.click);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    const { rTrigger } = this.$.DATA;
    removeEventListener(this, rTrigger, this.$$.click);
  }
}
