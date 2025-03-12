import { RainbowElement } from "../base/index.js";


export class RTestD extends RainbowElement {
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
