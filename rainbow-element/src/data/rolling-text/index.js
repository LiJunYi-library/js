import "./index.css";
import { RainbowElement, renderChildren } from "../../base/index.js";
import { arrayLoop, arrayLoopMap } from "@rainbow_ljy/rainbow-js";

export class RRollingText extends RainbowElement {
  static observedAttributes = this.$registerProps({
    // "r-value": String,
    "r-math-type": String, // 'floor' , 'none'
  });

  $$renderNumNodes = renderChildren({ parentNode: this });

  $$ = {
    value: "",
  };

  get value() {
    return this.$$.value;
  }

  set value(v) {
    this.$$.value = v;
    this.$debouncedRender()
  }

  $render() {
    let { rMathType } = this.$.DATA;
    let rValue = this.value;
    console.log("rValue $render", rValue);
    let rValueStr = String(rValue);
    let values = (() => {
      return arrayLoopMap(rValueStr.length, (index) => {
        const size = Number([1, ...arrayLoopMap(index, () => 0)].join(""));
        if (rMathType === "floor") return Math.floor(rValue / size);
        return rValue / size;
      });
    })();

    this.$$renderNumNodes.renderList(values, {
      keyExtractor: (item, index) => index,
      onCreateNode: (item, index, key) => {
        let node = document.createElement("r-rolling-text-num");
        node.setAttribute("key", key);
        node.value = item;
        return node;
      },
      onCacheNode: (node, item, index, key) => {
        node.value = item;
        node.setAttribute("key", key);
        return node;
      },
    });
  }
}

customElements.define("r-rolling-text", RRollingText);
