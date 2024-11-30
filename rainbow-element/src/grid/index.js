import { RainbowElement } from "../base/index.js";
import { resizeObserverIMP } from "../base/imps/index.js";
import "./index.css";

export class RGrid extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-columns": { type: Number, default: 1 },
    "r-min-auto-width": Number,
    "r-gap": [Number, String],
    "r-row-gap": [Number, String],
    "r-column-gap": [Number, String],
    "r-grid-wrap": String,
    "r-grid-stretch": String,
  });

  $onRegisterIMPS() {
    return [resizeObserverIMP({ isOnlyResizeWidth: true })];
  }

  $render() {
    // console.log([this], this.$.data);
    const { rGap, rRowGap, rColumnGap } = this.$.DATA;
    this.$.setStyle(() => [
      {
        "grid-template-columns": `repeat(${this.$$columns}, 1fr)`,
        "grid-gap": rGap + "px",
        "row-gap": (rRowGap || rGap) + "px",
        "column-gap": (rColumnGap || rGap) + "px",
      },
    ]);
    this.$$doLayout();
  }

  get $$columns() {
    let { rColumns, rMinAutoWidth } = this.$.DATA;
    if (rMinAutoWidth) return Math.floor(this.offsetWidth / rMinAutoWidth);
    return rColumns;
  }

  $$doLayout() {
    const { rGridWrap, rGridStretch } = this.$.DATA;
    let children = Array.from(this.children);
    let clumnList = children.map((el) => el.getAttribute("grid-column") * 1 || 1);
    let start = 1;
    let gridColumns = [];
    let maxColumn = this.$$columns + 1;
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
      if (start > this.$$columns) start = 1;
    });
    children.forEach((el, index) => {
      el.classList.add("r-grid-item");
      el.style["grid-column-start"] = gridColumns[index].start;
      el.style["grid-column-end"] = gridColumns[index].end;
    });
  }
}

customElements.define("r-grid", RGrid);
