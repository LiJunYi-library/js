import "./index.css";
import { RainbowElement } from "../../base/index.js";
import {
  findParentByLocalName,
  createCustomEvent,
  createElement,
  createSlot,
  resizeObserver,
  getBoundingClientRect,
} from "../../../utils/index.js";

export class RScroll extends RainbowElement {
  $$ = {
    cache: {
      container: { offset: {} },
    },
    def: createElement("div", "r-scroll-container"),
    defSlot: createSlot("slot"),
    refreshView: undefined,
    prveScrollTop: 0,
    onScroll: (event) => {
      event.scrollTop = this.scrollTop;
      this.style.setProperty("--scrollTopPx", this.scrollTop + "px");
      this.style.setProperty("--scrollTop", this.scrollTop);
      event.moveY = this.$$.prveScrollTop - this.scrollTop;
      if (event.moveY < 0) {
        const max = this.scrollHeight - this.offsetHeight - 0;
        const bool = this.scrollTop >= max;
        this.dispatchEvent(createCustomEvent("scrollUp", event));
        if (bool) this.dispatchEvent(createCustomEvent("scrollArriveBottom", event));
      }
      if (event.moveY > 0) {
        this.dispatchEvent(createCustomEvent("scrollDown", event));
      }
      this.$$.prveScrollTop = this.scrollTop;
    },
    disabledScroll: () => {
      this.cssList.add("r-scroll-disabled");
    },
    unDisabledScroll: () => {
      this.cssList.remove("r-scroll-disabled");
    },
    resizeObserver: resizeObserver(() => {
      const offset = getBoundingClientRect(this.$$.def);
      const cacheOffset = this.$$.cache.container.offset;
      if (offset.height !== cacheOffset.height) {
        const event = { scrollHeight: this.scrollHeight, scrollTop: this.scrollTop };
        this.dispatchEvent(createCustomEvent("scrollHeightChange", event));
      }
      this.$$.cache.container.offset = { ...offset };
    }),
  };

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$$.def.appendChild(this.$$.defSlot);
    this.shadowRoot.appendChild(this.$$.def);
    this.addEventListener("scroll", this.$$.onScroll);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.refreshView = findParentByLocalName("r-scroll-window", this);
    if (this.$$.refreshView) this.$$.refreshView.$$.scrollView = this;
    this.$$.cache.container.offset = { ...getBoundingClientRect(this.$$.def) };
    this.$$.resizeObserver.observe(this.$$.def);
    this.style.setProperty("--scrollTopPx", this.scrollTop + "px");
    this.style.setProperty("--scrollTop", this.scrollTop);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.resizeObserver.disconnect();
  }
}
