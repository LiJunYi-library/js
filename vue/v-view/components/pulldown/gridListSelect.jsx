
import { defineComponent, renderSlot } from "vue";
import { RPulldown2 } from "./pulldown2";
import { RGridListSelect, RGridListProps } from '../grid';

export const RPulldownGridListSelect = defineComponent({
    props: {
        secondaryConfirm: { type: Boolean, default: false },
        ...RGridListProps,
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
                <RPulldown2 activeLabel={revLabel(props.listHook?.label)} {...context.attrs} onBeforeOpen={onBeforeOpen} onClose={onClose}>
                    {{
                        default: (popCtx) => (
                            <div class={"r-pulldown-grid-list-select"}>
                                <RGridListSelect {...props} onChange={(item, index) => onChange(item, index, popCtx)}>
                                    {{ default: context.slots.default, item: context.slots.item }}
                                </RGridListSelect>
                                {props.secondaryConfirm &&
                                    renderSlot(context.slots, "footer", { popCtx, reset, confirm, context }, () => [
                                        <div class={"r-pulldown-grid-list-select-footer"}>
                                            <button
                                                onClick={() => reset(popCtx)}
                                                class={"r-pulldown-grid-list-select-footer-reset reset"}
                                            >
                                                重置
                                            </button>
                                            <button
                                                onClick={() => confirm(popCtx)}
                                                class={"r-pulldown-grid-list-select-footer-confirm confirm"}
                                            >
                                                确认
                                            </button>
                                        </div>,
                                    ])}
                            </div>
                        ),
                    }}
                </RPulldown2>
            );
        };
    },
});
