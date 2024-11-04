import { defineComponent, renderSlot, ref, reactive, computed } from "vue";
import { RPopup } from "../popup";

export const RDropdown = defineComponent({
  props: {
    label: { type: [String, Number, Array], default: "" },
    activeLabel: [String, Number],
    visible: { type: Boolean, default: undefined },
    zIndex: { type: [String, Number], default: 2000 },
    popTop: [String, Number, Function],
    popLeft: [String, Number, Function],
    teleport: [String, Number, HTMLElement],
  },
  emits: ["labelClick", "update:visible"],
  setup(props, context) {
    const pulldownHtml = ref('');
    const visibility  = ref(false);

    const offset = ()=>{
      if(!pulldownHtml.value) return {};
      return pulldownHtml.value.getBoundingClientRect();
    }

    const visible = computed({
      set(val) {
        if(props.visible === undefined) return visibility.value = val;
        context.emit("update:visible", val);
      },
      get() {
        if(props.visible === undefined) return visibility.value;
        return props.visible
      }
    })

    const ctx = reactive({ visible, setVisible, pulldownHtml, offset });

    context.expose(ctx)

    function setVisible(v) {
      visible.value = v;
    }

    function getPosition(proto) {
      if(proto === undefined ) return false;
      if (proto instanceof Function) proto(ctx)
      return proto;
    }

    function getTop() {
      const position = getPosition(props.popTop);
      if( position !==false  ) return position;
      if (props.teleport === "body") return offset().bottom + "px";
      return offset().height + "px";
    }

    function getLeft() {
      const position = getPosition(props.popLeft);
      if( position !==false  ) return position;
      if (props.teleport === "body") return 0;
      return -offset().left + "px";
    }

    function bool0(v) {
      if (v === 0) return true
      return Boolean(v)
    }

    function actClass(v) {
      if (!bool0(props.activeLabel)) return ''
      return v
    }

    function createClass(v) {
      return [v, actClass(v + '-act'), visible.value && v + '-visible'].filter(Boolean)
    }

    function onClick(event) {
      setVisible(!visible.value);
      context.emit("labelClick",event);
    }

    function onTouchstart(event) {
      event.stopPropagation();
    }

    function createRPopupAttrs() {
      const attrs = { ...context.attrs };
      delete attrs.class;
      delete attrs.style;
      return  attrs
    }

  const label =  computed(()=>{
    if(props.activeLabel === true ) return props.label;
    return props.activeLabel || props.label
  })

    return () => {
      return (
        <div
          class={createClass("r-dropdown")}
          ref={(el) => (pulldownHtml.value = el)}
          onTouchstart={onTouchstart}
          onClick={onClick}
          style={{ zIndex: visible.value ? props.zIndex + 1 : props.zIndex }}
        >
          <div class={createClass("r-dropdown-content")}>
            {renderSlot(context.slots, "content", ctx, () => [
              <div class={createClass("r-dropdown-text")}>
                {renderSlot(context.slots, "label", ctx, () => [
                  <div class={createClass("r-dropdown-label")}> {label.value} </div>,
                ])}
                <span class={createClass("r-dropdown-icon")}>
                  {renderSlot(context.slots, "icon", ctx, () => [
                    <i class={["iconfont"]}>&#xe887;</i>,
                  ])}
                </span>
              </div>,
            ])}
          </div>
          <RPopup
            {...createRPopupAttrs()}
            teleport={props.teleport}
            left={getLeft()}
            top={getTop()}
            position="top"
            v-model:visible={visible.value}
          >
            {renderSlot(context.slots, "default", ctx)}
          </RPopup>
        </div>
      );
    };
  },
});


