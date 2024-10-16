import { RResize } from "../resize";
import { defineComponent, computed, renderSlot, renderList, ref, onMounted, onBeforeUnmount } from "vue";
import "./index.scss";

export const RGridProps = {
  columns: { type: Number, default: 1 },
  gap: [Number, String],
  inline: Boolean,
  minAutoWidth: Number,
  wrap: Boolean,
  stretch: Boolean,
};

export const RGrid = defineComponent({
  props: RGridProps,
  setup(props, context) {
    let vm;
    const offset = ref();
    const container = computed(() => vm.$el);
    const newColumns = computed(() => {
      if (props.minAutoWidth && offset.value) return Math.floor(offset.value.width / props.minAutoWidth);
      return props.columns
    });
    const style = computed(() => {
      return {
        "grid-template-columns": ` repeat(${newColumns.value}, 1fr)`,
        "grid-gap": props.gap + "px",
      }
    });

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


    function setGridColumn() {
      let children = Array.from(container.value.children)
      let clumnList = children.map(el => el.getAttribute('grid-column') * 1 || 1)
      let start = 1;
      let gridColumns = [];
      let maxColumn = newColumns.value + 1;
      clumnList.forEach((num, index) => {
        let end = start + num;
        if (props.wrap) {
          if (end > maxColumn) {
            if (props.stretch) {
              if (gridColumns[index - 1]) gridColumns[index - 1].end = maxColumn;
            }
            start = 1;
            let end2 = start + num
            end = end2 > maxColumn ? maxColumn : end2;
          }
        } else {
          if (end > maxColumn) end = maxColumn
        }
        gridColumns.push({
          start: start,
          end: end,
          index
        })
        start = start + num
        if (start > newColumns.value) start = 1
      });
      children.forEach((el, index) => {
        el.style['grid-column-start'] = gridColumns[index].start
        el.style['grid-column-end'] = gridColumns[index].end
      });
    }

    function onWidthChange(off) {
      offset.value = off;
      setGridColumn();
    }

    function onChildChange() {
      setGridColumn();
    }

    function onAttributeChange() {

    }

    onMounted(() => {
      offset.value = container.value.getBoundingClientRect();
      mObserver.observeChildren(container.value);
      // setGridColumn()
    })

    onBeforeUnmount(() => {
      mObserver.disconnect();
    })



    return (v) => {
      vm = v;
      return (
        <RResize class={["r-grid", props.inline && "r-grid-inline"]} style={style.value} onChangeWidth={onWidthChange} time={true}>
          {renderSlot(context.slots, "default")}
        </RResize>
      );
    };
  },
});

export const RGridListProps = {
  ...RGridProps,
  listHook: Object,
  list: Array,
  renderCount: Number,
};

export const RGridList = defineComponent({
  props: RGridListProps,
  setup(props, context) {
    return () => {
      const LIST = (props.listHook ? props.listHook.list : props.list) || [];
      return (
        <RGrid {...props}>
          {renderList(props.renderCount || LIST, (item, index) => {
            return context.slots?.default?.({ item, index });
          })}
        </RGrid>
      );
    };
  },
});

export const RGridListSelect = defineComponent({
  props: RGridListProps,
  emits: ["change"],
  setup(props, context) {
    return () => {
      return (
        <RGridList  {...props}>
          {{
            default: ({ item, index }) => {
              return (
                <div
                  class={[
                    "r-grid-item",
                    props.listHook.formatterDisabled(item, index) && "r-grid-item-disabled",
                    props.listHook.same(item) && "r-grid-item-same",
                  ]}
                  key={index}
                  onClick={(event) => {
                    if (props.listHook.formatterDisabled(item, index)) return;
                    if (props.listHook.onSelect(item, index)) return;
                    context.emit("change", item, index);
                  }}
                >
                  {renderSlot(context.slots, "default", { index, item }, () => [
                    <div> {props.listHook.formatterLabel(item)} </div>,
                  ])}
                </div>
              );
            },
          }}
        </RGridList>
      );
    };
  },
});
