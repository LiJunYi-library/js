import "./index.css";
import { RainbowElement, createCustomEvent } from "../base/index.js";

function Transition(params = {}) {
  const props = {
    node: document.createElement("div"),
    name: "",
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
  };

  const enter = {
    isAnimation: false,
    resolve: () => 0,
    clear: () => {
      props.node.classList.remove(
        `${props.name}enter-active`,
        `${props.name}enter-to`,
        `${props.name}enter-from`,
      );
      props.node.removeEventListener("transitionend", enter.transitionend);
      props.node.removeEventListener("transitioncancel", enter.transitioncancel);
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
    resolve: () => 0,
    clear: () => {
      props.node.classList.remove(
        `${props.name}leave-active`,
        `${props.name}leave-from`,
        `${props.name}leave-to`,
      );
      props.node.removeEventListener("transitionend", leave.transitionend);
      props.node.removeEventListener("transitioncancel", leave.transitioncancel);
    },
    transitionend: () => {
      console.log("leave transitionend");
      props.node.classList.remove(`${props.name}show`);
      props.node.classList.add(`${props.name}hide`);
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
    await leave.destroy();
    props.node.classList.add(
      `${props.name}show`,
      `${props.name}enter-active`,
      `${props.name}enter-from`,
    );
    props.node.classList.remove(`${props.name}enter-to`, `${props.name}hide`);
    props?.oBeforeEnter?.();
    requestAnimationFrame(() => {
      props.node.classList.add(`${props.name}enter-to`);
      props.node.classList.remove(`${props.name}enter-from`);
      props.onEnter();
      props.node.addEventListener("transitionend", enter.transitionend);
    //   props.node.addEventListener("transitioncancel", enter.transitioncancel);
    });
  }

  async function hide() {
    await enter.destroy();
    props.node.classList.add(`${props.name}leave-active`, `${props.name}leave-from`);
    props.node.classList.remove(`${props.name}leave-to`);

    requestAnimationFrame(() => {
      props.node.classList.add(`${props.name}leave-to`);
      props.node.classList.remove(`${props.name}leave-from`);
      props.node.addEventListener("transitionend", leave.transitionend);
    //   props.node.addEventListener("transitioncancel", leave.transitioncancel);
    });
  }

  return args;
}

export class RDialog extends RainbowElement {
  $$content;
  $$ = {
    Visible: false,
  };

  $$show = false;
  $$hide = true;

  $$transition = Transition({
    node: this,
    name: "r-dialog-",
  });

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$$content = document.createElement("div");
    this.$$content.className = "r-dialog-content";
    this.$$content.setAttribute("part", "r-dialog-content");
    const contentSlot = document.createElement("slot");
    contentSlot.className = "content";
    this.$$content.appendChild(contentSlot);
    this.shadowRoot.appendChild(this.$$content);
  }

  $$setClass() {
    this.$.setClass(() => [
      this.$$show && "r-dialog-show",
      this.$$hide && "r-dialog-hide",
      "r-dialog-dialog",
    ]);
  }

  open() {
    this.$$show = true;
    this.$$hide = false;
    // this.$$setClass();
    this.$$transition.visible();
  }

  close() {
    this.$$show = false;
    this.$$hide = true;
    // this.$$setClass();
    this.$$transition.hide();
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$setClass();
    // this.style.display = "";
    // if (this.$$show === false) this.style.display = "none";
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
}

customElements.define("r-dialog", RDialog);
