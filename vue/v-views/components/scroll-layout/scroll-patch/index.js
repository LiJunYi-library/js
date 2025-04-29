import {  onBeforeUnmount, inject, reactive, } from "vue";
import { arrayRemove } from "@rainbow_ljy/rainbow-js";

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
