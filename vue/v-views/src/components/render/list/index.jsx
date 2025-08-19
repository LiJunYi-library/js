import { objectForIn } from "@rainbow_ljy/rainbow-js";
import { resizeObserver } from "@rainbow_ljy/rainbow-element";
import { ref, onMounted, renderList, h, defineComponent, Comment, watch, onUnmounted } from "vue";

function extendVNode(vNode, props, children) {
  if (vNode.type === Comment) return vNode;
  let c = children;
  if (typeof vNode.type !== "string") c = () => children;
  let n = h(vNode.type, props, c);
  objectForIn(vNode, (val, key) => {
    if (["props", "type", "children", "el", "patchFlag", "shapeFlag", "ref"].includes(key)) {
      return;
    }
    n[key] = val;
  });
  // console.log("nnnnn", vNode.ref);
  // console.log("nnnnn", n.ref);
  const refs = [vNode.ref, n.ref].filter(Boolean);
  n.ref = !refs.length ? null : refs;
  return n;
}

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
    const activeEL = ref(document.createElement("div"));
    const pEL = ref();
    const activeItemEL = ref();
    const resizeObs = resizeObserver(onResize);
    watch(activeItemEL, watchActiveItemEL);
    onMounted(mounted);
    onUnmounted(unmounted);

    function getPEL(el) {
      pEL.value = el;
    }

    function getActiveEL(el) {
      activeEL.value = el;
    }

    function getActiveItemEL(el, item, index) {
      if (props.listHook?.same?.(item, index)) activeItemEL.value = el;
    }

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
      activeItemEL.value = event.currentTarget;
    }

    function moveActive(child, behavior = "smooth") {
      const active = activeEL.value;
      if (!child) {
        active.style.position = "absolute";
        active.style.width = `${0}px`;
        active.style.height = `${0}px`;
        active.style.left = `${0}px`;
        active.style.top = `${0}px`;
        return;
      }
      child.scrollIntoView({ behavior, block: "center", inline: "center" });
      if (behavior === "smooth") active.classList.add("select-active-transition");
      active.style.position = "absolute";
      active.style.width = child.offsetWidth + "px";
      active.style.height = child.offsetHeight + "px";
      active.style.left = `${child.offsetLeft}px`;
      active.style.top = `${child.offsetTop}px`;
    }

    function onActiveTransitionEnd() {
      activeEL.value.classList.remove("select-active-transition");
    }

    function watchActiveItemEL(newEL, oldEL) {
      if (oldEL) resizeObs.unobserve(oldEL);
      moveActive(activeItemEL.value);
      if (newEL) resizeObs.observe(newEL);
    }

    function mounted() {}

    function unmounted() {
      resizeObs.disconnect();
    }

    function onResize() {
      moveActive(activeItemEL.value, "instant");
    }

    return () => {
      const itemVNodeList = renderList(props.listHook.list, (item, index) => {
        const itemNodes = context.slots?.item?.({ item, index });
        let nodes = itemNodes;

        nodes = itemNodes.map((el) => {
          activeItemEL.value = undefined;
          return extendVNode(
            el,
            {
              disabled: props.listHook?.formatterDisabled?.(item, index),
              [props.eventName]: (e) => trigger(e, item, index),
              ...el.props,
              ref: (e) => getActiveItemEL(e, item, index),
              class: [
                el.props.class,
                "select-item",
                props.listHook?.same?.(props.listHook.list[index + 1], index + 1) &&
                  "select-item-prve-checked",
                props.listHook?.same?.(item, index) && "select-item-checked",
                props.listHook?.same?.(props.listHook.list[index - 1], index - 1) &&
                  "select-item-next-checked",
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

      const childrenNodes = [
        ...itemVNodeList,
        <div ref={getActiveEL} class={["select-active"]} onTransitionend={onActiveTransitionEnd} />,
        context.slots?.children?.(),
      ];

      if (!defaultNodes?.length) return childrenNodes;

      return defaultNodes.map((el) => {
        return extendVNode(
          el,
          {
            ...el.props,
            ref: getPEL,
            class: [el.props.class, "select-list"],
          },
          childrenNodes,
        );
      });
    };
  },
});
