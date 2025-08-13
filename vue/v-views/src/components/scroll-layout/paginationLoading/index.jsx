import { defineComponent, onUnmounted, onMounted, renderSlot, renderList, watch } from "vue";
import { findParentByLocalName } from "@rainbow_ljy/rainbow-element";
import "./index.scss";

export const VRPaginationLoading = defineComponent({
  props: {
    triggerBottomDistance: { type: Number, default: 500 },
    loadingHook: { type: Object, default: () => ({}) },
    onErrorLoadClick: { type: Function },
    onBeginErrorClick: { type: Function },
    skeletonCount: { type: Number, default: 10 },
  },
  emits: ["rollToBottom", "scrollArriveBottom"],
  setup(props, ctx) {
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
      if (bool) {
        ctx.emit("rollToBottom", event);
        ctx.emit("scrollArriveBottom", event);
      }
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
      return renderSlot(ctx.slots, "empty", {}, () => (
        <r-result slot="empty" class="r-result-empty" />
      ));
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
            {renderList(props.skeletonCount, () => (
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
      return renderSlot(ctx.slots, "error", {}, () => (
        <r-result onClick={onBeginErrorClick} class="r-result-begin-error" />
      ));
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
      if (ps.error === true) return renderLoadError();
      if (ps.empty === true && ps.finished === true) return renderEmpty();
      if (ps.finished === true) return renderFinished();
      if (ps.loading === true) return renderLoading();
    }

    watch(
      () => props.loadingHook.begin,
      async () => {
        console.log([vm.$el]);
      },
    );

    return (v, a) => {
      vm = v;
      const ps = props.loadingHook;
      if (ps.begin === true && ps.error === true) return renderError();
      if (ps.begin === true) return renderBegin();
      return [ctx.slots?.default?.(), renderState()];
    };
  },
});
