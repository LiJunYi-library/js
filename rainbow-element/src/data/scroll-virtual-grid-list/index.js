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

  keyExtractor = (val) => val;

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
    recycle: {
      divs: [],
    },
    createElement: () => {
      let node = this.$$.recycle.divs.shift();
      if (node) return node;
      return document.createElement("div");
    },
    scrollParent: undefined,
    items: new Map(),
    onScroll: (event) => {
      this.$$.layout(false);
    },
    layout: (isForce = true) => {
      const { rAvgHeight, rGap, rColumnGap, rRowGap } = this.$.DATA;
      const columnGap = rColumnGap || rGap || 0;
      const rowGap = rRowGap || rGap || 0;
      // console.log(columnGap);
      const offsetTop = this.$.getOffsetTop(this.$$.scrollParent);
      const scrollTop = this.$$.scrollParent.scrollTop;
      let recycleCount = Math.ceil(window.innerHeight / (rAvgHeight + columnGap)) * this.$$columns;
      let nth = Math.ceil((scrollTop - offsetTop) / (rAvgHeight + columnGap)) * this.$$columns;
      let index = nth - recycleCount;
      let start = index < 0 ? 0 : index;
      let end = index + recycleCount * 3;
      if (end < 0) end = 0;
      let list = this.value.slice(start, end);
      let renderList = list.map((data, sub) => ({ index: start + sub, data }));
      let count = renderList.length;
      let isRender = !(this.$$.cache.start === start && this.$$.cache.end === end);
      this.$$.cache.start = start;
      this.$$.cache.end = end;
      if (isForce === false && isRender === false) return;
      // console.log(start, end);
      // console.log(count, renderList);
      this.$$.renderChildren.renderList(renderList, {
        keyExtractor: this.keyExtractor,
        onCreateNode: (val, index, key) => {
          let node = this.$$.createElement();
          // console.log(ret);
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
  };

  set value(v) {
    this.$$.value = v;
    const { rAvgHeight, rGap, rColumnGap } = this.$.DATA;
    const columnGap = rColumnGap || rGap || 0;
    this.style.height = this.value.length * (rAvgHeight + columnGap) + "px";
    this.$$.layout();
  }

  get value() {
    return this.$$.value;
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.scrollParent = this.$.findParentByLocalName("r-scroll");
    this.$$.scrollParent.addEventListener("scroll", this.$$.onScroll.bind(this));
    this.$$.layout();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.scrollParent.removeEventListener("scroll", this.$$.onScroll.bind(this));
  }
}
