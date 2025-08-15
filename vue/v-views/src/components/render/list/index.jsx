import { ref, onMounted, renderList, h, defineComponent, cloneVNode } from "vue";

export const VRRenderList = defineComponent({
  props: {
    listHook: { type: Object, default: () => ({}) },
    beforeTrigger: { type: Function, default: () => undefined },
    eventName: { type: String, default: "onClick" },
  },
  emits: ["change", "triggerDisabled"],
  setup(props, context) {
    return () => {
      async function trigger(event, item, index) {
        if (props.beforeTrigger) await props.beforeTrigger(item, index);
        if (props.listHook?.formatterDisabled?.(item, index)) {
          context.emit("triggerDisabled", item, index);
          return;
        }
        const bool = await props.listHook?.onSelect?.(item, index);
        // console.log(bool);
        if (bool) return;
        // console.log("change");
        context.emit("change", item, index);
      }

      return renderList(props.listHook.list, (item, index) => {
        const itemNodes = context.slots?.item?.({ item, index });
        let nodes = itemNodes;
        if (itemNodes.length === 1 && itemNodes[0].children === null) {
          nodes = itemNodes.map((el) => {
            // console.log(el.props)
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
              [props.listHook?.formatterLabel?.(item, index)],
            );
          });
        }
        return nodes;
      });
    };
  },
});
