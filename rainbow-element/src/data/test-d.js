import { RainbowElement } from "../base/index.js";


export class testD extends RainbowElement {
  $$ = {
    value: "",
  };

  set value(v) {
    this.$$.value = v;
    this.innerText = v;
  }


  get value() {
    return this.$$.value;
  }
}

customElements.define("r-test-d", testD);
