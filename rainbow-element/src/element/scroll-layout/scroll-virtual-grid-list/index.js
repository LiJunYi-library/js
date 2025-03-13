import { arrayRewriteFunction, ListArray } from "@rainbow_ljy/rainbow-js";
import { RainbowElement, createCustomEvent, renderChildren } from "../../base/index.js";
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
      const offsetTop = this.$.getOffsetTop(this);
      const scrollTop = this.$$.scrollParent.scrollTop;
      let recycleCount = Math.ceil(window.innerHeight / (rAvgHeight + columnGap)) * this.$$columns;
      let nth = Math.floor((scrollTop - offsetTop) / (rAvgHeight + columnGap)) * this.$$columns;
      let index = nth - recycleCount;
      let start = index < 0 ? 0 : index;
      this.$$.visible.start = nth < 0 ? 0 : nth;
      this.$$.visible.end = nth + recycleCount;
      // console.log(this.$$.visible.start, this.$$.visible.end);
      let end = index + recycleCount * 3;
      if (end < 0) end = 0;
      let list = this.value.slice(start, end);
      let renderList = list.map((item, sub) => ({ index: start + sub, item, data: item }));
      let isRender = !(this.$$.cache.start === start && this.$$.cache.end === end);
      this.$$.cache.start = start;
      this.$$.cache.end = end;
      this.style.height = `${(rAvgHeight + columnGap) * Math.ceil(this.value.length / this.$$columns) - columnGap}px`;
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
          this.dispatchEvent(createCustomEvent("renderList", { ele: node, ...val, key }));
          return node;
        },
        onCacheNode: (node, val, index, key) => {
          node.setAttribute("key", key);
          this.$$.measure(node, val, rAvgHeight, rowGap, columnGap);
          this.dispatchEvent(createCustomEvent("renderList", { ele: node, ...val, key }));
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
    if (v instanceof ListArray) {
      v.removeEventListener("change", this.$$.onValueChange);
      v.addEventListener("change", this.$$.onValueChange);
    } else arrayRewriteFunction(v, () => this.$$.layout());
    this.$$.value = v;
    this.$$.layout();
  }

  get value() {
    return this.$$.value;
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.scrollParent = this.$.findParentByLocalName([
      "r-scroll",
      "r-scroll-view",
      "r-nested-scroll",
    ]);
    this.$$.scrollParent.addEventListener("scroll", this.$$.onScroll);
    this.$$.layout();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.scrollParent.removeEventListener("scroll", this.$$.onScroll);
  }

  $onStyleChang(...arg) {
    super.$onStyleChang(...arg);
    this.$onRender();
  }

  $onWidthChange(...arg) {
    super.$onWidthChange(...arg);
    this.$onRender();
  }

  $onRender() {
    this.$$.layout();
  }


}
