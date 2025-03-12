import { arrayForEachFindIndex } from "@rainbow_ljy/rainbow-js";
import { RainbowElement } from "../../base/index.js";
import { toggleClass, createCustomEvent } from "../../../utils/index.js";
import "./index.css";

export class RSwiper extends RainbowElement {
  static observedAttributes = this.$registerProps({});

  $$ = (() => {
    return {
      cache: { scrollLeft: 0 },
      value: undefined,
      updateValue: (value) => {
        this.value = value;
        this.dispatchEvent(createCustomEvent("input", { value }));
        this.dispatchEvent(createCustomEvent("change", value));
      },
      setChildrenClass: () => {
        const index = (() => {
          if (this.value === undefined) return -1;
          return arrayForEachFindIndex(Array.from(this.children), (child) => {
            const bool = this.value === child.value;
            toggleClass(child, bool, "r-swiper-item-act");
            return bool;
          });
        })();
        const offset = this.getBoundingClientRect();
        const scrollLeft = offset.width * index;
        let behavior = "smooth";
        if (this.$.isRenderFinish === false) behavior = "instant";
        this.scrollTo({ left: scrollLeft, behavior });
      },
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
    if (this.getAttribute("value") !== null) this.value = this.getAttribute("value");
    this.addEventListener("scrollend", (event) => {
      const index = Math.round(this.scrollLeft / this.offsetWidth);
      const child = this.children[index];
      this.$$.updateValue(child.value);
      this.$$.cache.scrollLeft = this.scrollLeft;
      console.log(child.value);
    });
    this.addEventListener("scroll", (event) => {
      console.log((this.scrollLeft - this.$$.cache.scrollLeft) / this.offsetWidth);
    });
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.setChildrenClass();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }

  $render() {}
}

export class RSwiperItem extends RainbowElement {
  static observedAttributes = this.$registerProps({});

  insertBefore(...arg) {
    console.log("insertBefore");
    super.insertBefore(...arg);
  }

  append(...arg) {
    console.log("append");
    super.append(...arg);
  }

  appendChild(...arg) {
    console.log("appendChild");
    super.appendChild(...arg);
  }

  $$ = {
    value: undefined,
    valueParent: undefined,
    setActive: () => {
      toggleClass(this, this.value === this.$$.valueParent?.value, "r-swiper-item-act");
      if (this.value === this.$$.valueParent?.value) this.$$.valueParent?.$$?.setChildrenClass?.();
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
    this.$$.valueParent = this.$.findParentByLocalName("r-swiper");
    this.$$.setActive();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
