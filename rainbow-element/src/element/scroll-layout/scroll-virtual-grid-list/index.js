import { arrayRewriteFunction } from "@rainbow_ljy/rainbow-js";
import { RainbowElement } from "../../base/index.js";
import {
  renderChildren,
  findParentByLocalName,
  createCustomEvent,
  getOffsetTop,
} from "../../../utils/index.js";
import "./index.css";

export class RScrollVirtualGridList extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-columns": { type: Number, default: 1 },
    "r-min-auto-width": Number,
    "r-gap": [Number, String],
    "r-row-gap": [Number, String],
    "r-column-gap": [Number, String],
    "r-avg-height": [Number, String],
  });

  keyExtractor = (val) => val.item;
  onrenderItems = () => undefined;

  get $$columns() {
    let { rColumns, rMinAutoWidth } = this.$.DATA;
    if (rMinAutoWidth) return Math.floor(this.offsetWidth / rMinAutoWidth);
    return rColumns;
  }

  $$ = {
    renderChildren: renderChildren({ parentNode: this }),
    value: [],
    cache: {
      end: 0,
      start: 0,
    },
    visible: {
      end: 0,
      start: 0,
    },
    recycle: {
      divs: [],
    },
    createElement: () => {
      let node = this.$$.recycle.divs.shift();
      if (node) return node;
      return document.createElement("div");
    },
    scrollParent: undefined,
    onScroll: (event) => {
      this.$$.layout(false);
    },
    layout: (isForce = true) => {
      if (!this.$$.scrollParent) return;
      const { rAvgHeight, rGap, rColumnGap, rRowGap } = this.$.DATA;
      const columnGap = rColumnGap || rGap || 0;
      const rowGap = rRowGap || rGap || 0;
      // console.log(columnGap);
      const offsetTop = getOffsetTop(this, this.$$.scrollParent);
      const scrollTop = this.$$.scrollParent.scrollTop;
      let recycleCount = Math.ceil(window.innerHeight / (rAvgHeight + rRowGap)) * this.$$columns;
      let nth = Math.floor((scrollTop - offsetTop) / (rAvgHeight + rRowGap)) * this.$$columns;
      let last =
        Math.floor((scrollTop - offsetTop + window.innerHeight) / (rAvgHeight + rRowGap)) *
          this.$$columns +
        (this.$$columns - 1);
      let index = nth - recycleCount;
      let start = index < 0 ? 0 : index;
      let count = Math.max(0, this.value.length - 1);
      this.$$.visible.start = Math.min(Math.max(0, nth), count);
      this.$$.visible.end = Math.max(0, Math.min(last, count));
      // console.log(this.$$.visible.start, this.$$.visible.end);
      let end = index + recycleCount * 3;
      if (end < 0) end = 0;
      let list = this.value.slice(start, end);
      let renderList = list.map((item, sub) => ({ index: start + sub, item, data: item }));
      let isRender = !(this.$$.cache.start === start && this.$$.cache.end === end);
      this.$$.cache.start = start;
      this.$$.cache.end = end;
      let height = Math.max(
        0,
        (rAvgHeight + rowGap) * Math.ceil(this.value.length / this.$$columns) - rowGap,
      );
      this.style.height = `${height}px`;
      if (isForce === false && isRender === false) return;
      // console.log(start, end);
      this.$$.renderChildren.renderList(renderList, {
        keyExtractor: this.keyExtractor,
        onCreateNode: (val, index, key) => {
          let node = this.$$.createElement();
          // console.log( this.$$.recycle.divs.length);
          node.setAttribute("key", key);
          node.classList.add("r-scroll-virtual-grid-list-item");
          node.style.height = `${rAvgHeight}px`;
          node.style.position = "absolute";
          this.$$.measure(node, val, rAvgHeight, rowGap, columnGap);
          const event = createCustomEvent("renderItems", { ele: node, ...val, key });
          this.dispatchEvent(event);
          this.onrenderItems(event);
          return node;
        },
        onCacheNode: (node, val, index, key) => {
          node.setAttribute("key", key);
          this.$$.measure(node, val, rAvgHeight, rowGap, columnGap);
          const event = createCustomEvent("renderItems", { ele: node, ...val, key });
          this.dispatchEvent(event);
          this.onrenderItems(event);
          return node;
        },
        onRemoveNode: (node, key) => {
          node.setAttribute("key", "");
          node.classList.remove("r-scroll-virtual-grid-list-item");
          this.$$.recycle.divs.push(node);
        },
      });
    },
    measure: (node, val, rAvgHeight, rowGap, columnGap) => {
      let columns = this.$$columns;
      let rem = val.index % columns;
      let ret = Math.floor(val.index / columns);
      node.style.width = `calc( ${100 / columns}% - ${((columns - 1) * columnGap) / columns}px )`;
      node.style.left = `calc( ${(100 / columns) * rem}% - ${(((columns - 1) * columnGap) / columns) * rem}px + ${rem * columnGap}px )`;
      node.style.top = ret * (rAvgHeight + rowGap) + "px";
    },
    onValueChange: () => {
      this.$$.layout();
    },
  };

  set value(v) {
    arrayRewriteFunction(v, () => this.$$.layout());
    this.$$.value = v;
    this.$$.layout();
  }

  get value() {
    return this.$$.value;
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.scrollParent = findParentByLocalName(
      ["r-scroll", "r-scroll-view", "r-nested-scroll"],
      this,
    );
    this.$$.scrollParent.addEventListener("scroll", this.$$.onScroll);
    this.$$.layout();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.scrollParent.removeEventListener("scroll", this.$$.onScroll);
  }

  $onStyleChang(...arg) {
    super.$onStyleChang(...arg);
    this.$$.layout();
  }

  $onWidthChange(...arg) {
    super.$onWidthChange(...arg);
    this.$$.layout();
  }

  $render(...arg) {
    this.$$.layout(...arg);
  }
}
