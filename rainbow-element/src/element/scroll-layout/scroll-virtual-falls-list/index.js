import {
  arrayRewriteFunction,
  arrayLoopMap,
  arrayBinaryFindIndex,
  arrayLoop,
  arrayLoops,
} from "@rainbow_ljy/rainbow-js";
import { RainbowElement } from "../../base/index.js";
import {
  findParentByLocalName,
  createCustomEvent,
  renderChildren,
  getOffsetTop,
  getBoundingClientRect,
} from "../../../utils/index.js";
import "./index.css";

class ItemCache {
  list = [];
  width = undefined;
  height = undefined;
  left = undefined;
  top = undefined;
  vTop = undefined;
  bottom = undefined;
  vBottom = undefined;
}

export class RScrollVirtualFallsList extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-columns": { type: Number, default: 1 },
    "r-min-auto-width": Number,
    "r-gap": [Number, String],
    "r-row-gap": [Number, String],
    "r-column-gap": [Number, String],
    "r-avg-height": [Number, String],
  });

  keyExtractor = (val) => val.item;
  itemClassName = () => "";
  onrenderItems = () => undefined;
  visibleCount = 50;

  get $$columns() {
    let { rColumns, rMinAutoWidth } = this.$.DATA;
    if (rMinAutoWidth) return Math.floor(this.offsetWidth / rMinAutoWidth);
    return rColumns;
  }

  $$ = {
    resizeObserver: new ResizeObserver((entries) => {
      let isChange = false;
      entries.forEach((entrie) => {
        const offset = getBoundingClientRect(entrie.target);
        const __cache__ = entrie.target?.__bindData__?.__cache__;
        if (__cache__ && __cache__.height !== offset.height) {
          isChange = true;
          entrie.target.__bindData__.__cache__.height = offset.height;
        }
      });
      if (isChange) this.$$.layout();
    }),
    renderChildren: renderChildren({ parentNode: this }),
    value: [],
    preLoadIndex: 0,
    visible: {
      end: 0,
      start: 0,
      setEnd: (cache, offsetTop, scrollTop, winHeight, index) => {
        if (!cache) return false;
        if (cache.top + offsetTop >= scrollTop && cache.top + offsetTop <= scrollTop + winHeight) {
          this.$$.visible.end = index;
        }
      },
    },
    cache: {
      start: undefined,
      end: undefined,
    },
    createElement: () => {
      let node = document.createElement("div");
      this.$$.resizeObserver.observe(node);
      return node;
    },
    scrollParent: undefined,
    onScroll: (event) => {
      this.$$.layout(false);
    },
    findIndex: (scrollTop) => {
      const first = this.value[0];
      if (!first?.__cache__) return 0;
      const last = this.value.at(-1);
      if (last.__cache__) {
        if (scrollTop > last.__cache__.vBottom) return this.value.length - 1;
      }
      return arrayBinaryFindIndex(
        this.value,
        (item) => {
          if (!item.__cache__) return false;
          return item.__cache__.vTop <= scrollTop && scrollTop <= item.__cache__.vBottom;
        },
        (item) => {
          if (!item.__cache__) return false;
          return item.__cache__.vTop < scrollTop;
        },
      );
    },
    falls: {
      list: [],
    },
    create__cache__: (o) => {
      Object.defineProperties(o, {
        __cache__: {
          value: new ItemCache(),
          configurable: true,
        },
      });
      return o;
    },
    getCssValues: () => {
      const { rAvgHeight, rGap, rColumnGap, rRowGap } = this.$.DATA;
      const columnGap = rColumnGap || rGap || 0;
      const rowGap = rRowGap || rGap || 0;
      const offsetTop = getOffsetTop(this, this.$$.scrollParent);
      const recycleTop = -window.innerHeight + offsetTop;
      const recycleBottom = window.innerHeight * 2 + offsetTop;
      const scrollTop = this.$$.scrollParent.scrollTop;
      const winHeight = this.$$.scrollParent.offsetHeight;
      return {
        scrollTop,
        recycleBottom,
        recycleTop,
        offsetTop,
        rowGap,
        columnGap,
        rAvgHeight,
        winHeight,
      };
    },
    layout: (isForce = true, startIndex) => {
      if (!this.$$.scrollParent) return;
      const { scrollTop, recycleBottom, recycleTop, rowGap, offsetTop, winHeight } =
        this.$$.getCssValues();
      let start = this.$$.findIndex(scrollTop);
      if (start === -1) start = 0;
      if (typeof startIndex === "number") start = startIndex;
      let end = start + this.visibleCount;
      if (end > this.value.length) end = this.value.length;
      let isRender = !(this.$$.cache.start === start && this.$$.cache.end === end);
      this.$$.cache.start = start;
      this.$$.cache.end = end;
      this.$$.visible.start = start;
      if (isForce === false && isRender === false) {
        arrayLoops(start, end, (i) =>
          this.$$.visible.setEnd(this.value[i].__cache__, offsetTop, scrollTop, winHeight, i),
        );
        return;
      }
      let startItem = this.value[start];
      let list = this.value.slice(start, end);
      let renderList = list.map((item, sub) => ({ index: start + sub, item, data: item }));
      if (startItem?.__cache__) this.$$.falls.list = startItem.__cache__.list;
      else this.$$.falls.list = initList.call(this);
      let minColumn = getMinHeightItem(this.$$.falls.list);
      let __cache__ = new ItemCache();
      this.$$.renderChildren.renderList(renderList, {
        keyExtractor: this.keyExtractor,
        onCreateNode: (val, index, key) => {
          let ele = this.$$.createElement();
          ele.setAttribute("key", key);
          ele.classList.add(
            ...[
              "r-scroll-virtual-falls-list-item",
              this.itemClassName({ ele: ele, ...val, key }),
            ].filter(Boolean),
          );
          ele.style.position = "absolute";
          const event = createCustomEvent("renderItems", { ele: ele, ...val, key });
          this.dispatchEvent(event);
          this.onrenderItems(event);
          return ele;
        },
        onCacheNode: (ele, val, index, key) => {
          ele.setAttribute("key", key);
          const event = createCustomEvent("renderItems", { ele: ele, ...val, key });
          this.onrenderItems(event);
          this.dispatchEvent(event);
          return ele;
        },
        onBeforeInsertNode: (val, index, key) => {
          minColumn = getMinHeightItem(this.$$.falls.list);
          if (!val.item.__cache__) this.$$.create__cache__(val.item);
          __cache__ = val.item.__cache__;
          __cache__.list = this.$$.falls.list.map((el) => ({ ...el }));
        },
        onInsertBeforeNode: (ele, val, index, key) => {
          if (minColumn.height) minColumn.height = minColumn.height + rowGap;
          ele.style.width = minColumn.width;
          ele.style.left = minColumn.left;
          ele.style.top = minColumn.height + "px";
          const offset = getBoundingClientRect(ele);
          __cache__.height = offset.height;
          __cache__.width = ele.offsetWidth;
          __cache__.top = minColumn.height;
          __cache__.vTop = minColumn.height + recycleTop;
          __cache__.left = ele.style.left;
          minColumn.height = minColumn.height + offset.height;
          __cache__.bottom = minColumn.height;
          __cache__.vBottom = minColumn.height + recycleBottom;
          this.$$.visible.setEnd(__cache__, offsetTop, scrollTop, winHeight, val.index);
          __cache__.calculateList = this.$$.falls.list.map((el) => ({ ...el }));
          ele.__bindData__ = val.item;
        },
        onRemoveNode: (ele, key) => {
          ele.setAttribute("key", "");
          this.$$.resizeObserver.unobserve(ele);
        },
      });
      this.$$.preLoadIndex = end;
      this.$$.preLoads();
      this.$$.setHeight();
      if (!renderList.length) {
        this.$$.visible.start = 0;
        this.$$.visible.end = 0;
      }
      this.$$.backstage.reStart();
    },
    setHeight: () => {
      const calculateList = this.value.at(-1)?.__cache__?.calculateList;
      if (!calculateList?.length) {
        const { rAvgHeight, rowGap } = this.$$.getCssValues();
        let height = Math.max(
          0,
          (rAvgHeight + rowGap) * Math.ceil(this.value.length / this.$$columns) - rowGap,
        );
        this.style.height = `${height}px`;
        return;
      }
      this.style.height = `${getMaxHeightItem(calculateList).height}px`;
    },
    onValueChange: () => {
      this.$$.layout();
    },
    preLoads: (count = 100) => {
      let maxCount = this.value.length - this.$$.preLoadIndex;
      if (count > maxCount) count = maxCount;
      arrayLoop(count, () => {
        this.$$.preLoad();
        this.$$.preLoadIndex++;
      });
    },
    preLoad: () => {
      const item = this.value[this.$$.preLoadIndex];
      if (!item) return;
      const { scrollTop, recycleBottom, recycleTop, rowGap, rAvgHeight } = this.$$.getCssValues();
      let __cache__ = new ItemCache();
      if (!item.__cache__) this.$$.create__cache__(item);
      __cache__ = item.__cache__;
      __cache__.list = this.$$.falls.list.map((el) => ({ ...el }));
      let minColumn = getMinHeightItem(this.$$.falls.list);
      if (!__cache__.height) __cache__.height = rAvgHeight;
      if (minColumn.height) minColumn.height = minColumn.height + rowGap;
      __cache__.top = minColumn.height;
      __cache__.vTop = minColumn.height + recycleTop;
      __cache__.left = minColumn.left;
      __cache__.width = minColumn.width;
      minColumn.height = minColumn.height + __cache__.height;
      __cache__.bottom = minColumn.height;
      __cache__.vBottom = minColumn.height + recycleBottom;
      __cache__.calculateList = this.$$.falls.list.map((el) => ({ ...el }));
    },
    backstage: createBackstage(
      () => {
        this.$$.preLoads(100);
        this.$$.setHeight();
      },
      () => this.$$.preLoadIndex >= this.value.length,
    ),
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
    this.$$.falls.list = initList.call(this);
    this.$$.layout();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.scrollParent.removeEventListener("scroll", this.$$.onScroll);
    this.$$.backstage.stop();
    this.$$.resizeObserver.disconnect();
  }

  $onStyleChang(...arg) {
    super.$onStyleChang(...arg);
    this.$render();
  }

  $onWidthChange(...arg) {
    super.$onWidthChange(...arg);
    this.$render();
  }

  $layout(...args) {
    this.$$.layout(...args);
  }

  $render(isForce = true) {
    this.$$.layout(isForce, 0);
  }
}

function initList() {
  const columns = this.$$columns || 1;
  const { rAvgHeight, rGap, rColumnGap, rRowGap } = this.$.DATA;
  const columnGap = rColumnGap || rGap || 0;
  const rowGap = rRowGap || rGap || 0;

  return arrayLoopMap(columns, (i) => ({
    width: `calc( ${100 / columns}% - ${((columns - 1) * columnGap) / columns}px )`,
    left: `calc( ${(100 / columns) * i}% - ${(((columns - 1) * columnGap) / columns) * i}px + ${i * columnGap}px )`,
    height: 0,
    top: 0,
    index: i,
  }));
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

function createBackstage(callback, stopFmt) {
  let timer = null;
  const requestTimer = window.requestIdleCallback || window.requestAnimationFrame;
  const cancelRequestTimer = window.requestIdleCallback ? window.cancelIdleCallback : window.cancelAnimationFrame;

  function idleCallback(deadline) {
    if (stopFmt()) {
      stop();
      return;
    }

    const hasTimeRemaining =
      typeof deadline === "object" && deadline.timeRemaining && deadline.timeRemaining() > 0;

    if (hasTimeRemaining || typeof deadline === "number") {
      try {
        callback(); // 执行回调函数
      } catch (error) {
        console.error("Error in callback:", error);
      }

      if ((typeof deadline === "object" && !deadline.didTimeout) || typeof deadline === "number") {
        timer = requestTimer(idleCallback);
      }
    }
  }

  function start() {
    if (!timer) {
      timer = requestTimer(idleCallback);
    }
  }

  function stop() {
    if (timer) {
      cancelRequestTimer(timer);
      timer = null;
    }
  }

  function reStart() {
    stop();
    start();
  }

  return { start, stop, reStart };
}
