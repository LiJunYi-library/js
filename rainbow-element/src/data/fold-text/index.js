import "./index.css";
import { RainbowElement } from "../../base/index.js";

export class RFoldText extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-max-line": Number,
  });

  $slotContainer = {
    default: document.createElement("span"),
    text: document.createElement("span"),
    end: document.createElement("span"),
  };

  $$ = {
    value: "",
    isFold: false,
    foldText: "",
    click: () => {
      const span = this.$slotContainer.default;
      if (this.$$.isFold === true) span.innerText = this.value;
      if (this.$$.isFold === false) span.innerText = this.foldText;
      this.$slotContainer.default.append(this.$slotContainer.end);
      this.$$.isFold = !this.$$.isFold;
      const offset = span.getBoundingClientRect();
      this.style.height = offset.height + "px";
    },
    setInnerText: () => {},
    rowHeight: 0,
    draw: (index = 0, line = 0, height = 0) => {
      index++;
      if (index > this.value.length) return;
      const { text: span, default: content, end } = this.$slotContainer;
      const text = this.value.slice(0, index);
      span.innerText = text;
      const offset = content.getBoundingClientRect();
      if (height !== offset.height) {
        height = offset.height;
        line += 1;
        if (line > 2) {
          this.foldText = this.value.slice(0, index - 1);
          span.innerText = this.foldText;
          this.$$.isFold = true;
          const offset = content.getBoundingClientRect();
          this.style.height = offset.height + "px";
          return;
        }
      }
      this.$$.draw(index, line, height);
    },
  };

  set value(v) {
    this.$$.value = v;
    this.$$.draw();
  }

  get value() {
    return this.$$.value;
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.addEventListener("click", this.$$.click.bind(this));
    this.$slotContainer.default.classList.add("r-fold-text-default");
    this.$slotContainer.text.classList.add("r-fold-text-text");
    this.$slotContainer.end.classList.add("r-fold-text-end");
    // this.$slotContainer.end.innerText = ">";

    this.$.append(this.$slotContainer.default);
    this.$slotContainer.default.append(this.$slotContainer.text);
    this.$slotContainer.default.append(this.$slotContainer.end);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.removeEventListener("click", this.$$.click.bind(this));
  }
}
