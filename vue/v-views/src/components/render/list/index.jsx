import { ref, onMounted, renderList, h, defineComponent, Comment } from "vue";

export const VRRenderList = defineComponent({
  props: {
    listHook: { type: Object, default: () => ({}) },
    beforeTrigger: { type: Function, default: () => undefined },
    eventName: { type: String, default: "onClick" },
    hideItemDefaultChildren: Boolean,
    stopPropagation: Boolean,
    preventDefault: Boolean,
  },
  emits: ["change", "triggerDisabled"],
  setup(props, context) {
    return () => {
      async function trigger(event, item, index) {
        if (props.stopPropagation) event.stopPropagation();
        if (props.preventDefault) event.preventDefault();
        if (props.beforeTrigger) await props.beforeTrigger(item, index, event);
        if (props.listHook?.formatterDisabled?.(item, index)) {
          context.emit("triggerDisabled", item, index, event);
          return;
        }
        const bool = await props.listHook?.onSelect?.(item, index);
        if (bool) return;
        context.emit("change", item, index, event);
      }

      const itemVNodeList = renderList(props.listHook.list, (item, index) => {
        const itemNodes = context.slots?.item?.({ item, index });
        let nodes = itemNodes;

        nodes = itemNodes.map((el) => {
          if (el.type === Comment) return el;
          return h(
            el.type,
            {
              disabled: props.listHook?.formatterDisabled?.(item, index),
              [props.eventName]: (e) => trigger(e, item, index),
              ...el.props,
              class: [
                el.props.class,
                "select-item",
                props.listHook?.same?.(props.listHook.list[index + 1], index + 1) &&
                  "select-item-prve",
                props.listHook?.same?.(item, index) && "select-item-checked",
                props.listHook?.same?.(props.listHook.list[index - 1], index - 1) &&
                  "select-item-next",
                props.listHook?.formatterDisabled?.(item, index) && "select-item-disabled",
              ],
            },
            [
              el.children ??
                (props.hideItemDefaultChildren
                  ? undefined
                  : props.listHook?.formatterLabel?.(item, index)),
            ].filter((el) => el !== undefined),
          );
        });

        return nodes;
      });

      const defaultNodes = context.slots?.default?.();

      if (!defaultNodes?.length) return itemVNodeList;

      return defaultNodes.map((el) => {
        return h(el.type, { ...el.props }, [...itemVNodeList, context.slots?.children?.()]);
      });
    };
  },
});
