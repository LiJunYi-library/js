import { defineComponent, ref, onMounted, computed, renderSlot } from 'vue';
import './index.scss';

function is0(num) {
  if (num === 0) return true;
  return Boolean(num);
}

export const RScrollFloatingBubble = defineComponent({
  props: {
    left: Number,
    right: { type: Number, default: () => 20 },
    top: Number,
    bottom: Number,
    sticky: Boolean,
  },
  setup(props, context) {
    let html













    function onRef(el) {
      html = el;
    }

    return () => {
      return (
        <div
          ref={onRef}
          class={["r-scroll-floating-bubble"]}>
          {renderSlot(context.slots, 'default')}
        </div>
      );
    };
  },
});


