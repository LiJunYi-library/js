import { defineComponent, renderList, h } from "vue";

const RenderList = defineComponent({
  props: {
    className: String,
    tagName: String,
    tagItemName: String,
    listHook: { type: Object, default: () => ({}) },
  },
  setup(props, context) {
    return () => {
      return h(
        props.tagName,
        { ...context.attrs, class: props.className },
        renderList(props.listHook.list, (item, index) => {
          return h(props.tagItemName, {
            value: props.listHook?.formatterValue?.(item, index),
            class: props.className + "-item",
          });
        }),
      );
    };
  },
});
