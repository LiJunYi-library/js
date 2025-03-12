import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { createElement, createSlot, toggleClass, createElementCB } from "../../../utils/index.js";

export class RPulldown extends RainbowElement {
  $$ = {
    value: false,
    content: createElement("div", "r-pulldown-content"),
    labelSlot: createSlot("slot", "", "label"),
    iconSlot: createSlot("slot", "", "icon"),
    icon: createElement("div", "r-pulldown-icon"),
    defaultIcon: createElementCB("i", (el) => {
      el.className = "r-pulldown-default-icon iconfont";
      el.innerHTML = "&#xe887;";
      el.setAttribute("slot", "icon");
    }),
    dialog: createElement("r-dialog", "r-pulldown-dialog"),
    click: () => {
      this.value = !this.value;
    },
    render: () => {
      toggleClass(this, this.value, "r-pulldown-show", "r-pulldown-hide");
      this.$$.dialog.value = this.value;
      const children = Array.from(this.children).filter((el) => el.getAttribute("slot") === null);
      this.$$.dialog.append(...children);
    },
    onDialogClose: () => {
      this.value = false;
    },
  };

  set value(v) {
    this.$$.value = v;
    this.$$.render();
  }

  get value() {
    return this.$$.value;
  }

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$$.content.appendChild(this.$$.labelSlot);
    this.$$.content.appendChild(this.$$.icon);
    this.$$.icon.appendChild(this.$$.iconSlot);
    this.shadowRoot.appendChild(this.$$.content);
    this.addEventListener("click", this.$$.click);
    this.$$.dialog.addEventListener("close", this.$$.onDialogClose);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.appendChild(this.$$.defaultIcon);
    document.body.append(this.$$.dialog);
    this.$$.render();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
