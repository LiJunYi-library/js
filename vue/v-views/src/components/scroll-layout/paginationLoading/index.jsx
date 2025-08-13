import { defineComponent, onUnmounted, onMounted, renderSlot, renderList, watch } from "vue";
import { findParentByLocalName } from "@rainbow_ljy/rainbow-element";

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

    function onBeginErrorClick() {
      if (props.onBeginErrorClick) props.onBeginErrorClick(...arg);
      else props.loadingHook?.nextBeginSend?.();
    }

    function onErrorLoadClick(...arg) {
      if (props.onErrorLoadClick) props.onErrorLoadClick(...arg);
      else props.loadingHook?.awaitSend?.();
    }

    function renderLoading() {
      return renderSlot(ctx.slots, "loading", {}, () => [<r-result class="r-result-loading" />]);
    }

    function renderFinished() {
      return renderSlot(ctx.slots, "finished", {}, () => [<r-result class="r-result-finished" />]);
    }

    function renderEmpty() {
      return renderSlot(ctx.slots, "empty", {}, () => [<r-result class="r-result-empty" />]);
    }

    function renderBegin() {
      return renderSlot(ctx.slots, "begin", {}, () => [
        <div>
          <r-result class="r-result-loading" />
          <div class="r-skeleton-grid">
            {renderList(props.skeletonCount, () => (
              <div class="r-skeleton-animation" />
            ))}
          </div>
        </div>,
      ]);
    }

    function renderError() {
      return renderSlot(ctx.slots, "error", {}, () => [
        <r-result onClick={onBeginErrorClick} class="r-result-begin-error" />,
      ]);
    }

    function renderLoadError() {
      return renderSlot(ctx.slots, "errorLoad", {}, () => [
        <r-result onClick={onErrorLoadClick} class="r-result-error" />,
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
        console.log("console--", [vm.$el]);
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

export function VRScrollLoadStates(props = {}) {
  return [
    <div slot="begin">
      <r-result slot="loading" class="r-result-loading" />
      <div class="r-skeleton-grid">
        {renderList(props.skeletonCount ?? 10, () => (
          <div class="r-skeleton-animation" />
        ))}
      </div>
    </div>,
    <r-result slot="loading" class="r-result-loading" />,
    <r-result slot="finished" class="r-result-finished" />,
    <r-result slot="empty" class="r-result-empty" />,
    <r-result slot="error" class="r-result-error" />,
    <r-result slot="begin-error" class="r-result-begin-error" />,
  ];
}
