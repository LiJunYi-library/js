import { defineComponent, renderSlot, ref, reactive, onMounted, computed } from "vue";
import { useScrollController } from "../";
import './index.scss'

export const RScrollSticky = defineComponent({
    props: {
        zIndex: [Number, String],
        top: Number,
        bottom: Number,
        changeTop: Number, // r-scroll-sticky-act 的高度
        fluctuate: { type: Number, default: 1 }, // 波动范围
        slotsHaveScrollTop: Boolean, // 插槽传递时是否需要scrollTop参数 //会影响性能
        isMeasure: Boolean,
    },
    setup(props, context) {
        let html;
        let measureHtml;
        const isChangeTop = ref(false);
        const isSticky = ref(false);
        const unStickyTop = ref(false);
        const unStickyBottom = ref(false);
        const scrollTop = ref(0);
        const expose = reactive({ isChangeTop, isSticky, unStickyTop, unStickyBottom, scrollTop, getStickyScrollTop, scrollToSticky });
        context.expose(expose);

        const scrollController = useScrollController({
            type: "sticky",
            onScroll(event, sTop) {
                layoutTop(sTop);
            },
            onResize(event, sTop) {
                layoutTop(sTop);
            },
        });

        function refHtml(ref) {
            html = ref;
        }

        function layoutTop(sTop) {
            if (!html) return;
            if (props.slotsHaveScrollTop) scrollTop.value = sTop;
            if (props.top === undefined) return;
            if (props.changeTop !== undefined) isChangeTop.value = sTop >= props.changeTop;
            const value = scrollController.getOffsetTop(html) - sTop;
            isSticky.value = value - props.fluctuate <= props.top && props.top <= value + props.fluctuate;
            unStickyTop.value = value - props.fluctuate > props.top;
            unStickyBottom.value = value + props.fluctuate < props.top;
        }

        onMounted(() => {
            const sTop = scrollController?.context?.element?.scrollTop ?? 0;
            layoutTop(sTop);
            if (props.isMeasure) {
                measureHtml = document.createElement('div')
                measureHtml.classList.add('r-scroll-sticky-measure');
                html.parentElement.insertBefore(measureHtml, html);
            }
        });


        function scrollToSticky(arg = {}) {
            if (arg.isSticky && !isSticky.value) return;
            let top = getStickyScrollTop();
            let element = scrollController?.context?.element;
            if (!element) return
            element.scrollTo({ top, ...arg })
        }

        function getStickyScrollTop() {
            return scrollController.getOffsetTop(measureHtml) - props.top
        }

        const style = computed(() => {
            const s = {
                zIndex: props.zIndex,
                top: `${props.top}px`,
                bottom: `${props.bottom}px`,
            };
            if (props.top === undefined && props.bottom === undefined) positionStyle.top = 0 + "px";
            return s
        })


        return (vm) => {
            return (
                <div
                    ref={refHtml}
                    class={[
                        "r-scroll-sticky",
                        isSticky.value && "r-scroll-sticky-sticky",
                        !isSticky.value && "r-scroll-sticky-un-sticky",
                        unStickyTop.value && "r-scroll-sticky-un-sticky-top",
                        unStickyBottom.value && "r-scroll-sticky-un-sticky-bottom",
                        isChangeTop.value && "r-scroll-sticky-act",
                    ]}
                    style={style.value}

                >
                    {renderSlot(context.slots, "default", expose)}
                </div>
            );
        };
    },
});
