import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { arrayLoopMap } from "@rainbow_ljy/rainbow-js";

export class RRollingTextNum extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-initial-animation": String, // true false
    "r-transition": String,
  });

  $$container = document.createElement("span");
  $$measure = document.createElement("span");
  $$rotes = arrayLoopMap(10, () => document.createElement("span"));
  $$num = 10;
  $$value = 0;
  $$isMonted = false;

  get $$deg() {
    return 360 / this.$$num;
  }

  get value() {
    return this.$$value;
  }

  set value(v) {
    this.$$value = v;
    console.log("set ------ value", v);
    // if (this.$$isMonted === false) return;
    this.$$rotateX(true);
    console.log("set value", v);
  }

  // setValue(v, ani = true) {
  //   this.$$value = v;
  //   if (this.$$isMonted === false) return;
  //   this.$$rotateX(ani);
  // }

  // constructor(...arg) {
  //   super(...arg);
  //   this.attachShadow({ mode: "open" });
  //   this.$$container.className = "r-rolling-num-container r-rolling-num-container-ani";
  //   this.$$container.setAttribute("part", "r-rolling-num-container r-rolling-num-container-ani ");
  //   this.$$measure.className = "r-rolling-num-measure";
  //   this.$$measure.setAttribute("part", "r-rolling-num-measure");
  //   this.$$measure.innerText = "9";
  //   this.$$container.appendChild(this.$$measure);
  //   this.shadowRoot.appendChild(this.$$container);
  // }

  $$renderNums() {
    const deg = this.$$deg;
    const sin = Math.sin((Math.PI / 180) * deg);
    const translateZ = (sin + 0.9) * (this.$$measure.offsetHeight || 1);

    this.$$rotes.forEach((div, index) => {
      div.style.transform = `rotateX(${deg * index}deg)  translateZ(${translateZ}px)`;
      div.setAttribute("part", "r-rolling-num-rotate");
      div.className = "r-rolling-num-rotate";
      div.innerText = index;
      this.$$container.appendChild(div);
    });
  }

  async $$rotateX(isTransition) {
    const { rTransition, rInitialAnimation } = this.$.DATA;
    const rotateX = -((this.$$value / this.$$num) * 360);
    let unactIndex = -Math.round(((rotateX - 180) % 360) / 36);

    this.$$rotes.forEach((div, index) => {
      let prveIndex = unactIndex - 1 < 0 ? 9 : unactIndex - 1;
      let nextIndex = unactIndex + 1 > 9 ? 0 : unactIndex + 1;
      let className = "r-rolling-num-rotate";
      if (unactIndex === index) className = "r-rolling-num-rotate r-rolling-num-rotate-unact";
      if (prveIndex === index) className = "r-rolling-num-rotate r-rolling-num-rotate-unprve";
      if (nextIndex === index) className = "r-rolling-num-rotate r-rolling-num-rotate-unnext";

      div.setAttribute("part", className);
      div.className = className;
    });
    this.$$container.style.transition = rTransition;
    // if (isTransition) {
    //   this.$$container.style.transition = "";
    //   this.$$container.style.transition = rTransition;
    // }
    // if (this.$$isMonted === false && rInitialAnimation === "true") {
    //   await new Promise((resolve) => requestAnimationFrame(() => resolve(true)));
    // }
    // this.$$container.style.transform = "";
    this.$$container.style.transform = `rotateX(${rotateX}deg)`;
  }

  // $render() {}

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    const { rTransition, rInitialAnimation } = this.$.DATA;
    this.$$container.className = "r-rolling-num-container r-rolling-num-container-ani";
    this.$$container.setAttribute("part", "r-rolling-num-container r-rolling-num-container-ani ");
    this.$$measure.className = "r-rolling-num-measure";
    this.$$measure.setAttribute("part", "r-rolling-num-measure");
    this.$$measure.innerText = "9";
    this.$$container.appendChild(this.$$measure);
    this.appendChild(this.$$container);
    this.$$renderNums();
    this.$$rotateX(rInitialAnimation === "true");
    this.$$isMonted = true;
  }

  disconnectedCallback(...arg) {
    super.connectedCallback(...arg);
  }
}

