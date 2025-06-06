import { RainbowElement } from "../../base/index.js";
import "./index.css";

export class RGrid extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-columns": { type: Number, default: 1 },
    "r-min-auto-width": Number,
    "r-gap": [Number, String],
    "r-row-gap": [Number, String],
    "r-column-gap": [Number, String],
    "r-grid-wrap": String, // wrap
    "r-grid-stretch": String, // stretch
  });

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$onRender();
  }

  $onWidthChange(...arg) {
    super.$onWidthChange(...arg);
    this.$onRender();
  }

  $onStyleChang(...arg) {
    super.$onChildrenChanage(...arg);
    this.$onRender();
  }

  $onChildrenChanage(...arg) {
    super.$onChildrenChanage(...arg);
    this.$onRender();
  }

  $onRender() {
    let { rMinAutoWidth, rColumns, rGap, rRowGap, rColumnGap, rGridWrap, rGridStretch } =
      this.$.DATA;
    let colGap = rColumnGap || rGap || 0;
    let rowGap = rRowGap || rGap || 0;
    const columns = (() => {
      if (rMinAutoWidth) return Math.floor(this.offsetWidth / rMinAutoWidth);
      return rColumns;
    })();

    this.style["grid-template-columns"] = `repeat(${columns}, 1fr)`;
    this.style["gap"] = rGap + "px";
    this.style["row-gap"] = colGap + "px";
    this.style["column-gap"] = rowGap + "px";

    let children = Array.from(this.children);
    let clumnList = children.map((el) => el.getAttribute("grid-column") * 1 || 1);
    let start = 1;
    let gridColumns = [];
    let maxColumn = columns + 1;
    clumnList.forEach((num, index) => {
      let end = start + num;
      if (rGridWrap === "wrap") {
        if (end > maxColumn) {
          if (rGridStretch === "stretch") {
            if (gridColumns[index - 1]) gridColumns[index - 1].end = maxColumn;
          }
          start = 1;
          let end2 = start + num;
          end = end2 > maxColumn ? maxColumn : end2;
        }
      } else {
        if (end > maxColumn) end = maxColumn;
      }
      gridColumns.push({
        start: start,
        end: end,
        index,
      });
      start = start + num;
      if (start > columns) start = 1;
    });
    children.forEach((el, index) => {
      el.classList.add("r-grid-item");
      el.style["grid-column-start"] = gridColumns[index].start;
      el.style["grid-column-end"] = gridColumns[index].end;
    });
  }
}
