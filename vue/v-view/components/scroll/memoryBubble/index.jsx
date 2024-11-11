import { defineComponent, ref, renderSlot } from 'vue';
import { useScrollController } from "../scroll";
import './index.scss';


export const RScrollMemoryBubble = defineComponent({
  props: {
    top: Number,
    left: Number,
    right: Number,
    bottom: Number,
    position: { type: String, default: "right" },
    visible: { type: Boolean, default: true },
    visibleDistance: { type: Number, default: 100 },
    visibleReversal: Boolean
  },
  emits: ["update:visible"],
  setup(props, context) {
    let html;
    const visible = ref(props.visible);
    const cache = { stop: 0 }
    const scrollController = props.visibleReversal
      ? useScrollController({ onScrollUp: setVisibleTrue, onScrollDown: setVisibleFalse })
      : useScrollController({ onScrollUp: setVisibleFalse, onScrollDown: setVisibleTrue })

    function setVisibleTrue(event, stop) {
      if (visible.value === true) return;
      if (Math.abs(stop - cache.stop) >= props.visibleDistance) {
        cache.stop = stop;
        visible.value = true;
        context.emit("update:visible", true);
      }
    }

    function setVisibleFalse(event, stop) {
      if (visible.value === false) return;
      if (Math.abs(stop - cache.stop) >= props.visibleDistance) {
        cache.stop = stop;
        visible.value = false;
        context.emit("update:visible", false);
      }
    }

    function onRef(el) {
      html = el;
    }

    return () => {
      return (
        <div
          style={{ top: props.top, right: props.right, bottom: props.bottom, left: props.left, }}
          ref={onRef}
          class={[
            "r-scroll-memory-bubble",
            "r-scroll-memory-bubble-" + props.position,
            visible.value ?
              `r-scroll-memory-bubble-visible r-scroll-memory-bubble-visible-${props.position}`
              : `r-scroll-memory-bubble-hide r-scroll-memory-bubble-hide-${props.position}`
          ]}>
          {renderSlot(context.slots, 'default')}
        </div>
      );
    };
  },
});


