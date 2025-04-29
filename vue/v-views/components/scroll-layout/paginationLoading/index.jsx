import { defineComponent, onUnmounted, onMounted, renderSlot, renderList } from "vue";
import { findParentByLocalName } from "@rainbow_ljy/rainbow-element";
import { useScrollController } from "../../scroll-layout/scroll-patch";
import "./index.scss";

export const VRPaginationLoading = defineComponent({
  props: {
    triggerBottomDistance: { type: Number, default: 500 },
    loadingHook: { type: Object, default: () => ({}) },
    onErrorLoadClick: { type: Function },
    onBeginErrorClick: { type: Function },
  },
  emits: ["rollToBottom"],
  setup(props, ctx) {
    (() => {
      useScrollController({ onScrollDown });
      function onScrollDown(event) {
        const max = event.contentHeight - event.containerHeight - props.triggerBottomDistance;
        const bool = event.scrollTop >= max;
        if (bool) ctx.emit("rollToBottom", event);
      }
    })();
    let vm;
    let scrollView = document.createElement("div");
    onMounted(mounted);
    onUnmounted(unmounted);

    function mounted() {
      const scrollName = ["r-scroll", "r-scroll-view", "r-nested-scroll"];
      scrollView = findParentByLocalName(scrollName, vm.$el);
      if (!scrollView) return;
      scrollView.addEventListener("scrollUp", onScrollUp);
    }

    function unmounted() {
      if (!scrollView) return;
      scrollView.removeEventListener("scrollUp", onScrollUp);
    }

    function onScrollUp(event) {
      if (!scrollView) return;
      const max = scrollView.scrollHeight - scrollView.offsetHeight - props.triggerBottomDistance;
      const bool = scrollView.scrollTop >= max;
      if (bool) ctx.emit("rollToBottom", event);
    }

    function renderLoading() {
      return renderSlot(ctx.slots, "loading", {}, () => [
        <div class="r-pagination-loading-loading">
          <div class="r-pagination-loading-loading-prve"></div>
          <div class="r-pagination-loading-loading-text">加载中</div>
          <div class="r-pagination-loading-loading-next"></div>
        </div>,
      ]);
    }

    function renderFinished() {
      return renderSlot(ctx.slots, "finished", {}, () => [
        <div class="r-pagination-loading-finished">
          <div class="r-pagination-loading-finished-prve"></div>
          <div class="r-pagination-loading-finished-text">没有更多的了</div>
          <div class="r-pagination-loading-finished-next"></div>
        </div>,
      ]);
    }

    function renderEmpty() {
      return renderSlot(ctx.slots, "empty", {}, () => [
        <div class="r-pagination-loading-empty">
          <div class="r-pagination-loading-empty-prve"></div>
          <div class="r-pagination-loading-empty-text">暂无相关数据，试试其他条件吧</div>
          <div class="r-pagination-loading-empty-next"></div>
        </div>,
      ]);
    }

    function renderBegin() {
      return renderSlot(ctx.slots, "begin", {}, () => [
        <div class="r-pagination-loading-begin">
          <div class="r-pagination-loading-begin-loading">
            <div class="r-pagination-loading-begin-prve"></div>
            <div class="r-pagination-loading-begin-text">加载中</div>
            <div class="r-pagination-loading-begin-next"></div>
          </div>
          <div class="r-pagination-loading-begin-skeleton">
            {renderList(10, () => (
              <div class="r-pagination-loading-begin-skeleton-item" />
            ))}
          </div>
        </div>,
      ]);
    }

    function onBeginErrorClick() {
      if (props.onBeginErrorClick) props.onBeginErrorClick(...arg);
      else props.loadingHook?.nextBeginSend?.();
    }

    function renderError() {
      return renderSlot(ctx.slots, "error", {}, () => [
        <div class="r-pagination-loading-begin-error" onClick={onBeginErrorClick}>
          <div class="r-pagination-loading-begin-error-prve"></div>
          <div class="r-pagination-loading-begin-error-text">出错了 点击重新加载</div>
          <div class="r-pagination-loading-begin-error-next"></div>
        </div>,
      ]);
    }

    function onErrorLoadClick(...arg) {
      if (props.onErrorLoadClick) props.onErrorLoadClick(...arg);
      else props.loadingHook?.awaitSend?.();
    }

    function renderLoadError() {
      return renderSlot(ctx.slots, "errorLoad", {}, () => [
        <div class="r-pagination-loading-error" onClick={onErrorLoadClick}>
          <div class="r-pagination-loading-error-prve"></div>
          <div class="r-pagination-loading-error-text">出错了 点击重新加载</div>
          <div class="r-pagination-loading-error-next"></div>
        </div>,
      ]);
    }

    function renderState() {
      const ps = props.loadingHook;
      if (ps.begin === true && ps.error === true) return renderError();
      if (ps.error === true) return renderLoadError();
      if (ps.begin === true) return renderBegin();
      if (ps.empty === true && ps.finished === true) return renderEmpty();
      if (ps.finished === true) return renderFinished();
      if (ps.loading === true) return renderLoading();
    }

    return (v, a) => {
      vm = v;
      return [ctx.slots?.default?.(), renderState()];
    };
  },
});
