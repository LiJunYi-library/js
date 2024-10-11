import { RResize } from "../resize";
import { useResizeObserver } from "@rainbow_ljy/v-hooks";
import { defineComponent, computed, renderSlot, renderList, watch, onMounted, onBeforeUnmount } from "vue";
import "./index.scss";
import { timerDebounced, animationDebounced, arrayLoopMap } from "@rainbow_ljy/rainbow-js";


export const RFallsProps = {
  columns: { type: Number, default: 1 },
  gap: [Number, String],
  minAutoWidth: Number,
};

export const RFallsListProps = {
  ...RFallsProps,
  listHook: Object,
  list: Array,
  renderCount: Number,
};

function useFallsLayout(options = {}) {
  const config = { ...options }

  const args = {
    width: getWidth(),
    list: undefined,
    setColumns,
    afreshConfig,
    push,
    layout,
    setConfig,
    setWidth,
    afreshLayout,
    getMaxHeightItem,
  }

  setList();

  function setWidth() {
    args.width = getWidth()
  }

  function getWidth() {
    return `calc( ${100 / config.columns}% - ${((config.columns - 1) * config.gap) / config.columns}px )`;
  }

  function setList() {
    args.list = getList();
  }

  function getList() {
    return arrayLoopMap(config.columns, (i) => ({ height: 0, width: args.width, left: getLeft(i), top: 0, children: [] }));
  }

  function getColumns(width) {
    if (!config.minAutoWidth) return config.columns;
    return Math.floor(width / config.minAutoWidth);
  }

  function setColumns(width) {
    config.columns = getColumns(width);
    setWidth();
    setList();
  }

  function getMaxHeightItem() {
    let item = args.list[0];
    args.list.forEach((el) => { if (el.height > item.height) item = el });
    return item;
  }

  function getMinHeightItem() {
    let item = args.list[0];
    args.list.forEach((el) => { if (el.height < item.height) item = el });
    return item;
  }


  function setConfig(conf) {
    Object.assign(config, conf)
    config.columns = getColumns(conf.width)
  }

  function afreshConfig(conf) {
    setConfig(conf)
    setWidth();
    setList();
  }


  function afreshLayout(conf, items = []) {
    setConfig(conf)
    setWidth();
    layout(items)
  }

  function layout(items = []) {
    setList();
    push(...items);
  }


  function push(...items) {
    items.forEach(ele => {
      if (!ele) return
      if (!ele.style) return
      let node = getMinHeightItem();
      if (node.height) node.height = node.height + config.gap;
      ele.style.left = node.left;
      ele.style.top = node.height + 'px';
      node.height = node.height + ele.offsetHeight;
    })
  }

  function remove(...items) {

  }

  function update(...items) {

  }

  function getLeft(i) {
    return `calc( ${(100 / config.columns) * i}% - ${(((config.columns - 1) * config.gap) / config.columns) * i}px + ${i * config.gap}px )`;
  }

  return args
}

export const RFalls = defineComponent({
  props: RFallsProps,
  setup(props, context) {
    let vm;
    let container = computed(() => vm.$el);
    const falls = useFallsLayout(props);

    const mObserver = (() => {
      function callback(mutationsList) {
        for (let mutation of mutationsList) {
          if (mutation.type === "childList") {
            onChildChange(mutation)
          } else if (mutation.type === "attributes") {
            onAttributeChange(mutation)
          }
        }
      };
      const obs = new MutationObserver(callback);
      obs.observeChildren = (node) => {
        //subtree: true,attributes: true,
        obs.observe(node, { childList: true, })
      }
      return obs
    })()

    const rObserver = useResizeObserver(undefined, onSizeChange)

    const layout = animationDebounced(() => {
      falls.layout(container.value.children);
      container.value.style.height = falls.getMaxHeightItem().height + 'px'
    })

    function setChildrenAbsolute(children = container.value.children) {
      for (let index = 0; index < children.length; index++) {
        const child = children[index];
        child.classList.add('r-falls-item')
        child.style.width = falls.width;
      }
    }

    function onSizeChange(entries) {
      layout()
    }

    function onChildChange(mutation) {
      const addedNodes = Array.from(mutation.addedNodes).filter(el => el.style);
      const removedNodes = Array.from(mutation.removedNodes).filter(el => el.style);
      setChildrenAbsolute(addedNodes);
      addedNodes.forEach(ele => rObserver.observe(ele));
      removedNodes.forEach(ele => rObserver.unobserve(ele));
      if (!addedNodes.length && !removedNodes.length) return
      layout()
    }

    function onAttributeChange() {
      console.log('onAttributeChange');
    }

    function onChangeWidth(offset) {
      falls.setColumns(offset.width)
      setChildrenAbsolute()
      layout()
    }

    watch(() => [props.columns, props.gap, props.minAutoWidth], () => {
      falls.afreshConfig({ ...props, width: container.value.offsetWidth })
      setChildrenAbsolute()
      layout()
    })

    onMounted(() => {
      setChildrenAbsolute()
      mObserver.observeChildren(container.value);
      Array.from(container.value.children).forEach(ele => rObserver.observe(ele));
      layout()
    })

    onBeforeUnmount(() => {
      mObserver.disconnect();
    })

    return (v) => {
      vm = v;
      return (
        <RResize class={["r-falls"]} time={true} onChangeWidth={onChangeWidth}>
          {renderSlot(context.slots, "default")}
        </RResize>
      );
    };
  },
});

// export const RFallsList = defineComponent({
//   props: RGridListProps,
//   setup(props, context) {
//     return () => {
//       const LIST = (props.listHook ? props.listHook.list : props.list) || [];
//       return (
//         <RGrid {...props}>
//           {renderList(props.renderCount || LIST, (item, index) => {
//             return context.slots?.default?.({ item, index });
//           })}
//         </RGrid>
//       );
//     };
//   },
// });

// export const RFallsListSelect = defineComponent({
//   props: RGridListProps,
//   emits: ["change"],
//   setup(props, context) {
//     return () => {
//       return (
//         <RFallsList  {...props}>
//           {{
//             default: ({ item, index }) => {
//               return (
//                 <div
//                   class={[
//                     "r-grid-item",
//                     props.listHook.formatterDisabled(item, index) && "r-grid-item-disabled",
//                     props.listHook.same(item) && "r-grid-item-same",
//                   ]}
//                   key={index}
//                   onClick={(event) => {
//                     if (props.listHook.formatterDisabled(item, index)) return;
//                     if (props.listHook.onSelect(item, index)) return;
//                     context.emit("change", item, index);
//                   }}
//                 >
//                   {renderSlot(context.slots, "default", { index, item }, () => [
//                     <div> {props.listHook.formatterLabel(item)} </div>,
//                   ])}
//                 </div>
//               );
//             },
//           }}
//         </RFallsList>
//       );
//     };
//   },
// });
