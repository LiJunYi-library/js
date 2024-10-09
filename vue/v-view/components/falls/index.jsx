import { RResize } from "../resize";
import { defineComponent, computed, renderSlot, renderList, onMounted, onBeforeUnmount } from "vue";
import "./index.scss";

export const RGridProps = {
  columns: { type: Number, default: 1 },
  gap: [Number, String],
  inline: Boolean,
  minWidth: Number,
};

export const RGridListProps = {
  ...RGridProps,
  listHook: Object,
  list: Array,
  renderCount: Number,
};

export const RFalls = defineComponent({
  props: RGridProps,
  setup(props, context) {

    var observerOptions = {
      childList: true,
      attributes: true,
      subtree: true,

    };

    var observer = new MutationObserver(callback);

    observer.observe(targetNode, observerOptions);


    function changeWidth(offset) {
      if (!props.minWidth) return;
      const newColumns = Math.floor(offset.width / props.minWidth);
      style["grid-template-columns"] = ` repeat(${newColumns}, 1fr)`;
    }

    const style = computed(() => ({
      "grid-template-columns": ` repeat(${props.columns}, 1fr)`,
      "grid-gap": props.gap + "px",
    }));

    return () => {
      return (
        <RResize class={["r-falls"]} onChangeWidth={changeWidth} time={true}>
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
