import { defineComponent, renderSlot, reactive, ref, inject, onMounted } from "vue";
import { useScrollController } from "../";
import './index.scss'

export const RScrollFlotage = defineComponent({
    props: {
        zIndex: [Number, String],
        top: { type: Number, default: 0 },
        flotageTop: { type: Number, default: 0 },
        fluctuate: { type: Number, default: 0 }, // 波动范围
        isMeasure: Boolean,
    },
    setup(props, context) {
        const top = ref(props.top);
        const isSticky = ref(false);
        const unStickyTop = ref(false);
        const unStickyBottom = ref(false);
        const isFlotage = ref(false);
        const unFlotageTop = ref(false);
        const unFlotageBottom = ref(false);
        let tY = props.top;
        let html;
        let measureHtml;

        const scrollController = useScrollController({
            onScroll(event, sTop) {
                const { space } = event;
                tY = tY - space;
                if (tY < props.top) tY = props.top;
                if (tY > props.flotageTop) tY = props.flotageTop;
                event.flotageTop = tY;
                event.flotageHeight = props.top + tY;
                top.value = tY;
                const value = scrollController.getOffsetTop(html) - sTop;

                isSticky.value = value - props.fluctuate <= props.top && props.top <= value + props.fluctuate;
                unStickyTop.value = value - props.fluctuate > props.top;
                unStickyBottom.value = value + props.fluctuate < props.top;

                isFlotage.value = value - props.fluctuate <= props.flotageTop && props.flotageTop <= value + props.fluctuate;
                unFlotageTop.value = value - props.fluctuate > props.flotageTop;
                unFlotageBottom.value = value + props.fluctuate < props.flotageTop;
            },
        });

        onMounted(() => {
            if (props.isMeasure) {
                measureHtml = document.createElement('div')
                measureHtml.classList.add('r-scroll-flotage-measure');
                html.parentElement.insertBefore(measureHtml, html);
            }
        })

        function scrollTo(arg = {}) {
            let mtop = getStickyScrollTop(arg.pTop);
            let element = scrollController?.context?.element;
            if (!element) return
            scrollController.context.scrollTo({ top: mtop, ...arg })
            top.value = arg.pTop
        }

        function scrollToSticky(arg = {}) {
            scrollTo({ pTop: props.top, ...arg })
        }

        function scrollToFlotage(arg = {}) {
            scrollTo({ pTop: props.flotageTop, ...arg })
        }

        function getStickyScrollTop(pTop = top.value) {
            return scrollController.getOffsetTop(measureHtml) - pTop
        }

        const expose = reactive({
            top,
            isSticky,
            unStickyTop,
            unStickyBottom,
            isFlotage,
            unFlotageTop,
            unFlotageBottom,
            scrollTo,
            scrollToSticky,
            getStickyScrollTop,
            scrollToFlotage,
        });

        context.expose(expose)

        return (vm) => {
            return (
                <div
                    ref={(el) => { html = el }}
                    style={{
                        zIndex: props.zIndex,
                        top: top.value + "px",
                    }}
                    class={[
                        "r-scroll-flotage",
                        isSticky.value && "r-scroll-flotage-sticky",
                        !isSticky.value && "r-scroll-flotage-un-sticky",
                        unStickyTop.value && "r-scroll-flotage-un-sticky-top",
                        unStickyBottom.value && "r-scroll-flotage-un-sticky-bottom",
                        isFlotage.value && "r-scroll-flotage-flotage",
                        !isFlotage.value && "r-scroll-flotage-un-flotage",
                        unFlotageTop.value && "r-scroll-flotage-un-flotage-top",
                        unFlotageBottom.value && "r-scroll-flotage-un-flotage-bottom",
                    ]}
                >
                    {renderSlot(context.slots, "default", expose)}
                </div>
            );
        };
    },
});
