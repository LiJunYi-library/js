import { defineComponent, renderSlot } from "vue";
import { RPulldown } from "./pulldown";
import { RListSelect, RListSelectProps } from "../list";

export const RPulldownSelect = defineComponent({
  props: {
    label: { type: [String, Number], default: "" },
    secondaryConfirm: { type: Boolean, default: false },
    ...RListSelectProps,
  },
  emits: ["change", "beforeOpen", "close"],
  setup(props, context) {


    function onChange(item, index, popCtx) {
      if (props.secondaryConfirm) return;
      context.emit("change", props.listHook.value);
      popCtx.setVisible(false);
    }

    function onBeforeOpen() {
      if (props.secondaryConfirm) props.listHook.save_changeContextToStore();
      context.emit("beforeOpen");
    }

    function onClose() {
      if (props.secondaryConfirm) props.listHook.changeContextToProxy();
      context.emit("close");
    }

    function confirm(popCtx) {
      if (props.secondaryConfirm) props.listHook.restore_changeContextToProxy();
      context.emit("change", props.listHook.value);
      popCtx.setVisible(false);
    }

    function reset(popCtx) {
      props.listHook.reset();
      if (props.secondaryConfirm) props.listHook.restore_changeContextToProxy();
      context.emit("change", props.listHook.value);
      popCtx.setVisible(false);
    }

    function revLabel(params) {
      if (params instanceof Array) return params.join(",");
      return params;
    }

    return () => {
      return (
        <RPulldown {...context.attrs} onBeforeOpen={onBeforeOpen} onClose={onClose}>
          {{
            content: (popCtx) => (
              <div class={["r-pulldown-text", revLabel(props.listHook.label) && "r-pulldown-text-act"]}>
                {renderSlot(context.slots, "label", popCtx, () => [
                  <div class="r-pulldown-label"> {revLabel(props.listHook.label) || props.label} </div>,
                ])}
                <span class={["r-pulldown-icon", !popCtx.visible && "rote"]}>
                  {renderSlot(context.slots, "icon", popCtx, () => [
                    <i class={["iconfont"]}>&#xe887;</i>,
                  ])}
                </span>
              </div>
            ),
            default: (popCtx) => (
              <div class={"r-pulldown-list-select"}>
                <RListSelect {...props} onChange={(item, index) => onChange(item, index, popCtx)}>
                  {{ default: context.slots.default, item: context.slots.item }}
                </RListSelect>
                {props.secondaryConfirm &&
                  renderSlot(context.slots, "footer", { popCtx, reset, confirm, context }, () => [
                    <div class={"r-pulldown-list-select-footer"}>
                      <button
                        onClick={() => reset(popCtx)}
                        class={"r-pulldown-list-select-footer-reset reset"}
                      >
                        重置
                      </button>
                      <button
                        onClick={() => confirm(popCtx)}
                        class={"r-pulldown-list-select-footer-confirm confirm"}
                      >
                        确认
                      </button>
                    </div>,
                  ])}
              </div>
            ),
          }}
        </RPulldown>
      );
    };
  },
});


