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
    fold: document.createElement("span"),
    unfold: document.createElement("span"),
  };

  $$ = {
    value: "",
    isFold: false,
    foldText: "",
    rowHeight: 0,
    click: () => {
      if (!this.$$.foldText) return;
      const { text: span, default: content, end, fold, unfold } = this.$slotContainer;
      if (this.$$.isFold === true) span.innerText = this.value;
      if (this.$$.isFold === false) span.innerText = this.$$.foldText;
      this.$$.isFold = !this.$$.isFold;
      const offset = content.getBoundingClientRect();
      this.style.height = offset.height + "px";
      if (this.$$.isFold) {
        end.classList.add("r-fold-text-end-fold");
        end.classList.remove("r-fold-text-end-unfold");
      } else {
        end.classList.add("r-fold-text-end-unfold");
        end.classList.remove("r-fold-text-end-fold");
      }
    },
    setInnerText: (index = 0, line = 0, height = 0) => {
      index++;
      if (index > this.value.length) return " ";
      const { text: span, default: content, end, fold, unfold } = this.$slotContainer;
      const text = this.value.slice(0, index);
      span.innerText = text;
      const offset = content.getBoundingClientRect();
      if (height !== offset.height) {
        height = offset.height;
        line += 1;
        // debugger;
        if (line > 2) {
          // debugger
          return this.value.slice(0, index - 1);
        }
      }
      return this.$$.setInnerText(index, line, height);
    },
    draw: (index = 0, line = 0, height = 0) => {
      index++;
      if (index > this.value.length) return;
      const { text: span, default: content, end, fold, unfold } = this.$slotContainer;
      const text = this.value.slice(0, index);
      span.innerText = text;
      const offset = content.getBoundingClientRect();
      if (height !== offset.height) {
        height = offset.height;
        line += 1;
        if (line > 2) {
          this.style.height = this.rowHeight + "px";
          end.classList.remove("r-fold-text-end-none");
          // requestAnimationFrame(() => {
          this.$$.foldText = this.$$.setInnerText();
          span.innerText = this.$$.foldText;
          this.$$.isFold = true;

          if (this.$$.isFold) {
            end.classList.add("r-fold-text-end-fold");
            end.classList.remove("r-fold-text-end-unfold");
          } else {
            end.classList.add("r-fold-text-end-unfold");
            end.classList.remove("r-fold-text-end-fold");
          }
          // });
          // debugger
          return;
        }
        this.rowHeight = height;
      }
      this.$$.draw(index, line, height);
    },
  };

  set value(v) {
    this.$$.value = v;
    this.$slotContainer.end.classList.add("r-fold-text-end-none");
    this.$$.draw();
  }

  get value() {
    return this.$$.value;
  }

  connectedCallback(...arg) {
    console.log("connectedCallback-connectedCallback")
    super.connectedCallback(...arg);
    this.addEventListener("click", this.$$.click.bind(this));
    this.$slotContainer.default.classList.add("r-fold-text-default");
    this.$slotContainer.text.classList.add("r-fold-text-text");
    this.$slotContainer.end.classList.add("r-fold-text-end", "iconfont");
    this.$slotContainer.fold.classList.add("r-fold-text-end-fold-solt");
    this.$slotContainer.unfold.classList.add("r-fold-text-end-unfold-solt");
    if (!this.$slotContainer.end.innerHTML) {
      this.$slotContainer.end.innerHTML = "&#xe745;&#xe745;&#xe745";
    }
    this.$.append(this.$slotContainer.default);
    this.$slotContainer.default.append(this.$slotContainer.text);
    this.$slotContainer.default.append(this.$slotContainer.end);
    this.$slotContainer.default.append(this.$slotContainer.fold);
    this.$slotContainer.default.append(this.$slotContainer.unfold);

  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.removeEventListener("click", this.$$.click.bind(this));
  }
}
