import { RainbowElement } from "../../base/index.js";
import { arrayLoopMap } from "@rainbow_ljy/rainbow-js";
import "./index.css";

export class RFalls extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-min-auto-width": Number,
    "r-columns": { type: Number, default: 2 },
    "r-gap": { type: Number, default: 0 },
    "r-row-gap": { type: Number, default: 0 },
    "r-column-gap": { type: Number, default: 0 },
  });

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$onRender();
  }

  $onWidthChange(...arg) {
    super.$onWidthChange(...arg);
    this.$onRender();
  }

  $onChildrenHeightChange(...arg) {
    super.$onChildrenHeightChange(...arg);
    this.$onRender();
  }

  $onChildrenChanage(...arg) {
    super.$onChildrenChanage(...arg);
    this.$onRender();
  }

  $onStyleChang(...arg) {
    super.$onStyleChang(...arg);
    this.$onRender();
  }

  $onRender() {
    let { rMinAutoWidth, rColumns, rGap, rRowGap, rColumnGap } = this.$.DATA;
    // console.log(rMinAutoWidth, rColumns, rGap, rRowGap, rColumnGap);
    const col = (() => {
      if (rMinAutoWidth) return Math.floor(this.offsetWidth / rMinAutoWidth);
      return rColumns;
    })();
    // console.log(col);
    let colGap = rColumnGap || rGap || 0;
    let rowGap = rRowGap || rGap || 0;
    let left = (i) =>
      `calc( ${(100 / col) * i}% - ${(((col - 1) * colGap) / col) * i}px + ${i * colGap}px )`;
    const list = arrayLoopMap(col, (i) => ({ height: 0, left: left(i), top: 0, index: i }));
    // console.log(list);
    let itemWidth = `calc( ${100 / col}% - ${((col - 1) * colGap) / col}px )`;
    // console.log(itemWidth);
    Array.from(this.children).forEach((child) => {
      child.classList.add("r-falls-item");
      child.style.position = "absolute";
      child.style.width = itemWidth;
      let node = getMinHeightItem(list);
      if (node.height) node.height = node.height + rowGap;
      child.style.left = node.left;
      child.style.top = node.height + "px";
      node.height = node.height + child.offsetHeight;
    });
    this.style.height = getMaxHeightItem(list).height + "px";
  }
}

function getMinHeightItem(list) {
  let item = list[0];
  list.forEach((el) => {
    if (el.height < item.height) item = el;
  });
  return item;
}

function getMaxHeightItem(list) {
  let item = list[0];
  list.forEach((el) => {
    if (el.height > item.height) item = el;
  });
  return item;
}
