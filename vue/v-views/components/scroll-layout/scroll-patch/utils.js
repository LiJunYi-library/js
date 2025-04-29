import { onBeforeUnmount, inject, reactive } from "vue";
import { arrayRemove, arrayLoopMap } from "@rainbow_ljy/rainbow-js";

export function useScrollController(props = {}) {
  const RScrollContext = inject("RScrollContext") || {};
  const controller = reactive({
    onScrollTop: () => undefined,
    onScrollBottom: () => undefined,
    onScrollUp: () => undefined,
    onScrollDown: () => undefined,
    onScroll: () => undefined,
    onScrollend: () => undefined,
    onScrollRefreshMove: () => undefined,
    onResize: () => undefined,
    onMounted: () => undefined,
    onTouchstart: () => undefined,
    onTouchend: () => undefined,
    onFlotage: () => undefined,
    ...props,
    destroy,
    getOffsetTop,
    dispatchFlotage,
    context: RScrollContext,
  });

  RScrollContext?.children?.push?.(controller);

  function getOffsetTop(ele, top = 0) {
    if (!RScrollContext.element) return top;
    if (!ele) return top;
    top = top + ele.offsetTop;
    if (ele.offsetParent === RScrollContext.element) return top;
    return getOffsetTop(ele.offsetParent, top);
  }

  function dispatchFlotage(...arg) {
    RScrollContext.children.forEach((element) => {
      element.onFlotage(...arg);
    });
  }

  function destroy() {
    arrayRemove(RScrollContext?.children, controller);
  }

  onBeforeUnmount(() => {
    destroy();
  });

  return controller;
}

export function useFallsLayout(options = {}) {
  const config = { ...options };

  const args = {
    width: getWidth(),
    list: undefined,
    setColumns,
    afreshConfig,
    push,
    layout,
    setConfig,
    setWidth,
    afreshLayout,
    getMaxHeightItem,
    getMinHeightItem,
    setList,
  };

  setList();

  function setWidth() {
    args.width = getWidth();
  }

  function getWidth() {
    return `calc( ${100 / config.columns}% - ${((config.columns - 1) * config.gap) / config.columns}px )`;
  }

  function setList() {
    args.list = getList();
  }

  function getList() {
    return arrayLoopMap(config.columns, (i) => ({
      height: 0,
      width: args.width,
      left: getLeft(i),
      top: 0,
      children: [],
      index: i,
    }));
  }

  function getColumns(width) {
    if (!config.minAutoWidth) return config.columns;
    return Math.floor(width / config.minAutoWidth) || 1;
  }

  function setColumns(width) {
    config.columns = getColumns(width);
    setWidth();
    setList();
  }

  function getMaxHeightItem() {
    let item = args.list[0];
    args.list.forEach((el) => {
      if (el.height > item.height) item = el;
    });
    return item;
  }

  function getMinHeightItem(index) {
    if (typeof index === "number") return args.list[index];
    let item = args.list[0];
    args.list.forEach((el) => {
      if (el.height < item.height) item = el;
    });
    return item;
  }

  function setConfig(conf) {
    Object.assign(config, conf);
    config.columns = getColumns(conf.width);
  }

  function afreshConfig(conf) {
    setConfig(conf);
    setWidth();
    setList();
  }

  function afreshLayout(conf, items = []) {
    setConfig(conf);
    setWidth();
    layout(items);
  }

  function layout(items = []) {
    setList();
    push(...items);
  }

  function push(...items) {
    items.forEach((ele) => {
      if (!ele) return;
      if (!ele.style) return;
      let node = getMinHeightItem();
      if (node.height) node.height = node.height + config.gap;
      ele.style.left = node.left;
      ele.style.top = node.height + "px";
      node.height = node.height + ele.offsetHeight;
    });
  }

  function remove(...items) {}

  function update(...items) {}

  function getLeft(i) {
    return `calc( ${(100 / config.columns) * i}% - ${(((config.columns - 1) * config.gap) / config.columns) * i}px + ${i * config.gap}px )`;
  }

  return args;
}
