import "./index.css";
import {
  RainbowElement,

  createCustomEvent,
} from "../../base/index.js";

export class RPulldown extends RainbowElement {
  $$ = {
    value: false,
    get dialog() {
      return document.getElementById("aaa-dialog");
    },
    click: () => {
      console.log(this.$$.dialog);
      this.$$.dialog.value= !this.$$.dialog.value;
    },
  };

  set value(v) {
    this.$$.value = v;
    this.$$.dialog.value= v;
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

    console.log(this.$$.dialog);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
