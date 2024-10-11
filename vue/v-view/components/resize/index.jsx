import { useResizeObserver } from "@rainbow_ljy/v-hooks";
import { defineComponent, renderSlot, reactive } from "vue";

export const RResize = defineComponent({
  props: {
    name: { type: String, default: "" },
    time: { type: [Number, Boolean], default: false },
  },
  setup(props, ctx) {
    const context = reactive({
      html: undefined,
      offset: {},
    })

    ctx.expose(context)

    function getBoundingClientRect() {
      let offset = context.html.getBoundingClientRect();
      let obj = {}
      for (const key in offset) {
        obj[key] = offset[key];
      }
      return obj
    }

    useResizeObserver(
      () => context.html,
      (...arg) => {
        const oldOffset = { ...context.offset };
        context.offset = getBoundingClientRect();
        if (props.name) {
          document.body.style.setProperty(`--${props.name}Width`, `${context.offset.width}px`);
          document.body.style.setProperty(`--${props.name}Height`, `${context.offset.height}px`);
        }
        ctx.emit("resize", context.offset, ...arg);
        if (oldOffset.width !== context.offset.width) ctx.emit("changeWidth", context.offset, ...arg);
        if (oldOffset.height !== context.offset.height) ctx.emit("changeHeight", context.offset, ...arg);
      },
      props.time,
    );

    function getHtml(el) {
      context.html = el;
    }

    return () => {
      return <div ref={getHtml}>{renderSlot(ctx.slots, "default")}</div>;
    };
  },
});
