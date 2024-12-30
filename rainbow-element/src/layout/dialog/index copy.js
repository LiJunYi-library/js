import "./index.css";
import { RainbowElement, createCustomEvent } from "../base/index.js";
function Transition(params = {}) {
  const props = {
    node: document.createElement("div"),
    name: "",
    className: "",
    oBeforeEnter: () => 0,
    onEnter: () => 0,
    onAfterEnter: () => 0,
    onEnterCancelled: () => 0,
    ...params,
  };

  const args = {
    className: [],
    visible,
    hide,
    setName,
  };

  function setName(str) {
    props.name = str;
  }

  const enter = {
    isAnimation: false,
    resolve: () => 0,
    clear: () => {
      props.node.classList.remove(
        `${props.name}enter-active`,
        `${props.name}enter-to`,
        `${props.name}enter-from`,
      );
      props.node.setAttribute("part", props.node.className);
      props.node.removeEventListener("transitionend", enter.transitionend);
      props.node.removeEventListener("transitioncancel", enter.transitioncancel);
      enter.isAnimation = false;
    },
    transitionend: () => {
      console.log("enter transitionend");
      enter.clear();
    },
    transitioncancel: () => {
      console.log("enter transitioncancel");
      enter.clear();
    },
    destroy() {
      enter.clear();
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    },
  };

  const leave = {
    isAnimation: false,
    resolve: () => 0,
    clear: () => {
      props.node.classList.remove(
        `${props.name}leave-active`,
        `${props.name}leave-from`,
        `${props.name}leave-to`,
      );
      props.node.setAttribute("part", props.node.className);
      props.node.removeEventListener("transitionend", leave.transitionend);
      props.node.removeEventListener("transitioncancel", leave.transitioncancel);
      leave.isAnimation = false;
    },
    transitionend: () => {
      console.log("leave transitionend");
      props.node.classList.remove(`${props.className}show`);
      props.node.classList.add(`${props.className}hide`);
      props.node.setAttribute("part", props.node.className);
      leave.clear();
    },
    transitioncancel: () => {
      console.log("leave transitioncancel");
      leave.clear();
    },
    destroy() {
      leave.clear();
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    },
  };

  async function visible() {
    if (enter.isAnimation === true) return;
    enter.isAnimation = true;
    await leave.destroy();
    props.node.classList.add(
      `${props.className}show`,
      `${props.name}enter-active`,
      `${props.name}enter-from`,
    );
    props.node.classList.remove(`${props.name}enter-to`, `${props.className}hide`);
    props.node.setAttribute("part", props.node.className);
    props?.oBeforeEnter?.();
    requestAnimationFrame(() => {
      props.node.classList.add(`${props.name}enter-to`);
      props.node.classList.remove(`${props.name}enter-from`);
      props.node.setAttribute("part", props.node.className);
      props.onEnter();
      props.node.addEventListener("transitionend", enter.transitionend);
      //   props.node.addEventListener("transitioncancel", enter.transitioncancel);
    });
  }

  async function hide() {
    if (leave.isAnimation === true) return;
    leave.isAnimation = true;
    await enter.destroy();
    props.node.classList.add(`${props.name}leave-active`, `${props.name}leave-from`);
    props.node.classList.remove(`${props.name}leave-to`);
    props.node.setAttribute("part", props.node.className);
    requestAnimationFrame(() => {
      props.node.classList.add(`${props.name}leave-to`);
      props.node.classList.remove(`${props.name}leave-from`);
      props.node.setAttribute("part", props.node.className);
      props.node.addEventListener("transitionend", leave.transitionend);
      //   props.node.addEventListener("transitioncancel", leave.transitioncancel);
    });
  }

  return args;
}

class RVisibleAnimate extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-orientation": String, // "left" "right" "top" "bottom" "center"
  });

  $$transition = Transition({
    node: this,
    name: "r-dialog-",
    className: "r-dialog-",
  });
}

customElements.define("r-dialog-content", RVisibleAnimate);

export class RDialog extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-orientation": String, // "left" "right" "top" "bottom" "center"
  });

  $$content;
  $$ = {
    visible: false,
  };

  $$show = true;
  $$hide = false;

  $$transition = Transition({
    node: this,
    name: "r-dialog-",
    className: "r-dialog-",
  });

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$$content = document.createElement("div");
    // this.$$content.className = "r-dialog-content";
    // this.$$content.setAttribute("part", "r-dialog-content");
    const contentSlot = document.createElement("slot");
    contentSlot.className = "content";
    this.$$content.appendChild(contentSlot);
    this.shadowRoot.appendChild(this.$$content);

    this.$$transition = Transition({
      node: this.$$content,
      name: "r-dialog-",
      className: "r-dialog-",
    });
  }

  $$setClass() {
    const { rOrientation } = this.$.DATA;
    this.$.setClass(() => [
      this.$$show && "r-dialog-show",
      this.$$hide && "r-dialog-hide",
      rOrientation && "r-dialog-" + rOrientation,
    ]);
  }

  open() {
    this.$$show = true;
    this.$$hide = false;
    this.$$transition.visible();
  }

  close() {
    this.$$show = false;
    this.$$hide = true;
    this.$$transition.hide();
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$setClass();
    // console.log("connectedCallback");
  }

  adoptedCallback(...arg) {
    super.adoptedCallback(...arg);
    // console.log("adoptedCallback");
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    // console.log("disconnectedCallback");
  }

  $render() {
    const { rOrientation } = this.$.DATA;
    this.$$transition.setName(["r-dialog", rOrientation].filter(Boolean).join("-") + "-");
    this.$$setClass();
  }
}

customElements.define("r-dialog", RDialog);
