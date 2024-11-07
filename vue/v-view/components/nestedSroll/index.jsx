import { onMounted, ref, defineComponent, onBeforeUnmount, inject, reactive, provide } from 'vue'
import './index.scss'
import { extendedSlideEvents } from '../../utils/slide'
const RNestedScrollProps = { tag: String, isRoot: Boolean };

export const RNestedScroll = defineComponent({
    props: RNestedScrollProps,
    setup(props, ctx) {
        const parent = props.isRoot ? undefined : inject("RNestedViewsContext");
        const expose = reactive({
            name: 'RNestedScrollContext',
            child: undefined,
            children: [],
            parent: parent,
            dispatchScrollTopFlying,
            dispatchScrollBottomFlying,
            props,
            layer: (parent?.layer ?? 0) + 1,
            isWork: false,
            index: 0,
        })
        provide("RNestedViewsContext", expose);
        if (parent) parent.children.push(expose);
        if (parent) parent.child = parent.children[0];
        const LOG = (...arg) => console.log(...arg);

        const scrollEl = ref('scrollEl')
        const container = ref('container')
        let scrollTop = 0;
        let ani;
        const coefficient = 20;

        function isScrollToTopEnd() {
            return scrollEl.value.scrollTop <= 0;
        }

        function isScrollToBottomEnd() {
            const top = Math.ceil(scrollEl.value.scrollTop)
            return (scrollEl.value.offsetHeight + top) >= container.value.offsetHeight
        }

        function maxScrollTop() {
            return container.value.offsetHeight - scrollEl.value.offsetHeight;
        }

        function slideCaptureDown() {
            ani?.stop?.();
        }

        function slideCaptureStrat(event) {
            if (event.orientation !== 'vertical') return;
        }

        function slideCaptureTop(event) {
            if (event.orientation !== 'vertical') return;
            // 如果滚动到了底部 就不消费事件 return 出去
            // 如果没滚动到底部消费事件 并阻止事件向下传递
            if (isScrollToBottomEnd()) return;
            event.stopPropagation();
            doScrollTop(event.moveY)
        }

        function doScrollTop(moveY) {
            let stop = scrollTop + moveY;
            scrollTop = stop
            scrollEl.value.scrollTop = scrollTop
            if (stop > maxScrollTop()) {
                scrollTop = maxScrollTop()
                scrollEl.value.scrollTop = maxScrollTop() + 10
            }
        }

        function slideBottom(event) {
            if (event.orientation !== 'vertical') return;
            // 如果滚动到了顶部 就不消费事件 return 出去
            // 如果没滚动顶部 就去消费事件 并阻止事件向上冒泡
            if (isScrollToTopEnd()) return;
            event.stopPropagation();
            doScrollBottom(event.moveY)
        }

        function doScrollBottom(moveY) {
            let stop = scrollTop + moveY;
            if (stop < 0) stop = 0
            scrollTop = stop
            scrollEl.value.scrollTop = scrollTop
        }

        function dispatchScrollTopFlying(velocity) {
            ani?.stop?.();
            ani = cAni({
                velocity,
                onanimation(v) {
                    const moveY = Math.ceil(v * coefficient);
                    if (moveY > 0) {
                        doScrollTop(moveY)
                        if (isScrollToBottomEnd()) {
                            ani?.stop?.();
                            expose.child?.dispatchScrollTopFlying?.(v)
                        }
                    }
                }
            });
            ani.start();
        }

        function dispatchScrollBottomFlying(velocity) {
            ani?.stop?.();
            ani = cAni({
                velocity,
                onanimation(v) {
                    const moveY = Math.ceil(v * coefficient);
                    if (moveY < 0){
                        doScrollBottom(moveY)
                        if (isScrollToTopEnd()) {
                            ani?.stop?.();
                            expose.parent?.dispatchScrollBottomFlying?.(v)
                        }
                    }
                }
            });
            ani.start();
        }

        function slideCaptureTopEnd(event) {
            if (event.orientation !== 'vertical') return;
            // LOG('slideCaptureTopEnd', event.orientation);
            // 如果滚动到了底部 就不消费事件 return 出去
            // 如果没滚动到底部消费事件 并阻止事件向下传递
            if (isScrollToBottomEnd()) return;
            event.stopPropagation();
            LOG('清除动画 slideCaptureTopEnd', event.velocityY);
            dispatchScrollTopFlying(event.velocityY)
            // ani?.stop?.();
            // ani = cAni({
            //     velocity: event.velocityY,
            //     onanimation(v) {
            //         const moveY = Math.ceil(v * coefficient);
            //         if (moveY > 0) dispatchScrollTop(moveY);
            //     }
            // });
            // ani.start();
        }

        function slideBottomEnd(event) {
            if (event.orientation !== 'vertical') return;
            // 如果滚动到了顶部 就不消费事件 return 出去
            // 如果没滚动顶部 就去消费事件 并阻止事件向上冒泡
            if (isScrollToTopEnd()) return;
            event.stopPropagation();
            LOG('清除动画 slideBottomEnd', event.velocityY);
            dispatchScrollBottomFlying(event.velocityY);
            // ani?.stop?.();
            // ani = cAni({
            //     velocity: event.velocityY,
            //     onanimation(v) {
            //         const moveY = Math.ceil(v * coefficient);
            //         if (moveY < 0) dispatchScrollBottom(moveY);
            //     }
            // });
            // ani.start();
        }

        let mSlide;
        onMounted(() => {
            mSlide = extendedSlideEvents(scrollEl.value, { direction: ['top', 'bottom'], customEventName: 'scroll', })
            scrollEl.value.addEventListener('scrollDown', slideCaptureDown, { passive: false, capture: true });
            scrollEl.value.addEventListener('scrollStrat', slideCaptureStrat, { passive: false, capture: true });
            scrollEl.value.addEventListener('scrollTop', slideCaptureTop, { passive: false, capture: true });
            scrollEl.value.addEventListener('scrollBottom', slideBottom, { passive: false, capture: false });
            scrollEl.value.addEventListener('scrollTopEnd', slideCaptureTopEnd, { passive: false, capture: true });
            scrollEl.value.addEventListener('scrollBottomEnd', slideBottomEnd, { passive: false, capture: false });
        })

        onBeforeUnmount(() => {
            mSlide.destroy()
            scrollEl.value.removeEventListener('scrollDown', slideCaptureDown, { passive: false, capture: true });
            scrollEl.value.removeEventListener('scrollStrat', slideCaptureStrat, { passive: false, capture: true });
            scrollEl.value.removeEventListener('scrollTop', slideCaptureTop, { passive: false, capture: true });
            scrollEl.value.removeEventListener('scrollBottom', slideBottom, { passive: false, capture: false });
            scrollEl.value.removeEventListener('scrollTopEnd', slideCaptureTopEnd, { passive: false, capture: true });
            scrollEl.value.removeEventListener('scrollBottomEnd', slideBottomEnd, { passive: false, capture: false });
        })

        return () => {
            return <div class="r-nested-scroll" ref={(el) => scrollEl.value = el}>
                <div ref={(el) => container.value = el} class="r-nested-scroll-container">
                    {ctx.slots?.default?.()}
                </div>
            </div>
        }
    }
})


function cAni(config = {}) {
    let time;
    const opt = {
        velocity: 0,
        deceleration: 0.03,
        onanimation: () => undefined,
        ...config
    }
    let stopAction = false;

    const isReduce = opt.velocity < 0;


    function animaMinus() {
        if (stopAction) return cancelAnimationFrame(time);
        time = requestAnimationFrame(() => {
            if (stopAction) return cancelAnimationFrame(time);
            opt.velocity = Number((opt.velocity + opt.deceleration).toFixed(3));
            if (opt.velocity > 0) opt.velocity = 0;
            if (opt.velocity >= 0) {
                stop()
                return
            }
            if (stopAction) return cancelAnimationFrame(time);
            opt.onanimation(opt.velocity)
            animaMinus()
        })
    }



    function animaAdd() {
        if (stopAction) return cancelAnimationFrame(time);
        time = requestAnimationFrame(() => {
            if (stopAction) return cancelAnimationFrame(time);
            opt.velocity = Number((opt.velocity - opt.deceleration).toFixed(3));
            if (opt.velocity < 0) opt.velocity = 0;
            if (opt.velocity <= 0) {
                stop()
                return
            }
            if (stopAction) return cancelAnimationFrame(time);
            opt.onanimation(opt.velocity)
            animaAdd()
        })
    }

    function anima() {
        if (isReduce) animaMinus()
        else animaAdd()
    }


    function stop() {
        stopAction = true;
        cancelAnimationFrame(time)
    }


    function start() {
        stopAction = false;
        anima()
    }

    return { start, stop }
}