import { onMounted, ref, defineComponent, onBeforeUnmount, inject, reactive, provide, renderSlot } from 'vue'
import './index.scss'
import { extendedSlideEvents } from '../../utils/slide'
const RNestedScrollProps = { tag: String, isRoot: Boolean };
const LOG = (...arg) => console.log(...arg);
export const RNestedScroll = defineComponent({
    props: RNestedScrollProps,
    emits: ["scrollChange", "scrollDown", "scrollUp", "scrollTop", "scrollBottom", "scrollRefreshMove", "scrollEnd"],
    setup(props, ctx) {
        const parent = props.isRoot ? undefined : inject("RNestedViewsContext");
        const expose = reactive({
            name: 'RNestedScrollContext',
            child: undefined,
            children: [],
            parent: parent,
            dispatchScrollTopFlying,
            dispatchScrollBottomFlying,
            isScrollToTopEnd,
            isScrollToBottomEnd,
            props,
            layer: (parent?.layer ?? 0) + 1,
            isWork: false,
            index: 0,
        })
        provide("RNestedViewsContext", expose);
        if (parent) parent.children.push(expose);
        if (parent) parent.child = parent.children[0];
        const RScrollContext = reactive({
            element: null,
            contentElement: null,
            scrollTop: 0,
            otherElement: [],
            children: [],
            stickys: [],
            isHandActuated: false,
        });
        provide("RScrollContext", RScrollContext);

        const scrollEl = ref('scrollEl')
        const container = ref('container')
        let scrollTop = 0;
        let ani;
        const coefficient = 20;
        let isScrollMove = false;
        let isRefreshMove = false;


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

        function dispatchChildrenEvent(name, ...arg) {
            if (!name) return;
            RScrollContext.children.forEach((el) => {
                el?.[name]?.(...arg);
            });
        }

        function getAllNestedParent(current, arr = []) {
            if (!current) return arr;
            arr.push(current);
            return getAllNestedParent(current.parent, arr)
        }

        function doScrollTop(moveY) {
            let stop = scrollTop + moveY;
            scrollTop = stop
            scrollEl.value.scrollTop = scrollTop
            if (stop > maxScrollTop()) {
                scrollTop = maxScrollTop()
                scrollEl.value.scrollTop = maxScrollTop() + 10
            }
            // LOG('onScrollUp', scrollEl.value.scrollTop);
            ctx.emit('scrollUp');
            ctx.emit('scrollChange');
            RScrollContext.scrollTop = scrollEl.value.scrollTop;
            if (isScrollToBottomEnd()) {
                ctx.emit('scrollBottom');
                // LOG('滚动到--底部', scrollEl.value.scrollTop);
            }
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
                            LOG('滚动停止 到底停止');
                            expose.child?.dispatchScrollTopFlying?.(v)
                        }
                    }
                },
                onanimationEnd(v) {
                    LOG('滚动停止');
                }
            });
            ani.start();
        }

        function doScrollBottom(moveY) {
            let stop = scrollTop + moveY;
            if (stop < 0) stop = 0
            scrollTop = stop
            scrollEl.value.scrollTop = scrollTop
            // LOG('onScrollDown', scrollEl.value.scrollTop);
            ctx.emit('scrollDown')
            ctx.emit('scrollChange');
            RScrollContext.scrollTop = scrollEl.value.scrollTop;
            if (isScrollToTopEnd()) {
                ctx.emit('scrollTop');
                // LOG('滚动到顶部', scrollEl.value.scrollTop);
            }
        }

        function dispatchScrollBottomFlying(velocity) {
            ani?.stop?.();
            ani = cAni({
                velocity,
                onanimation(v) {
                    const moveY = Math.ceil(v * coefficient);
                    if (moveY < 0) {
                        doScrollBottom(moveY)
                        if (isScrollToTopEnd()) {
                            ani?.stop?.();
                            LOG('滚动停止 到顶部停止');
                            expose.parent?.dispatchScrollBottomFlying?.(v)
                        }
                    }
                },
                onanimationEnd(v) {
                    LOG('滚动停止');
                }
            });
            ani.start();
        }

        function slideCaptureDown() {
            ani?.stop?.();
            isScrollMove = false;
            isRefreshMove = false;
        }

        function slideCaptureStrat(event) {
            if (event.orientation !== 'vertical') return;
        }

        function slideCaptureTop(event) {
            if (event.orientation !== 'vertical') return;
            // 如果滚动到了底部 就不消费事件 return 出去
            // 如果没滚动到底部消费事件 并阻止事件向下传递
            if (isScrollToBottomEnd()) return isScrollMove = false;
            event.stopPropagation();
            if (isRefreshMove) return; //处于刷新状态中
            isScrollMove = true;
            doScrollTop(event.moveY)
        }

        function slideBottom(event) {
            if (event.orientation !== 'vertical') return;
            // 如果滚动到了顶部 就不消费事件 return 出去
            // 如果没滚动顶部 就去消费事件 并阻止事件向上冒泡
            if (isScrollToTopEnd()) return isScrollMove = false;
            event.stopPropagation();
            if (isRefreshMove) return; //处于刷新状态中
            isScrollMove = true;
            doScrollBottom(event.moveY)
        }

        function slideAfterMove(event) {
            if (event.orientation !== 'vertical') return;
            const isAllScrollToTopEnd = getAllNestedParent(expose).map(el => el.isScrollToTopEnd).filter(Boolean).every(fn => fn());

            if (event.direction === 'bottom' && isAllScrollToTopEnd && !isScrollMove) {
                isRefreshMove = true; // 设置为刷新状态 并阻止向上冒泡
                event.stopPropagation();
                ctx.emit('scrollRefreshMove', event, event.deltaY);
                dispatchChildrenEvent('onScrollRefreshMove', event, event.deltaY);
            }
        }

        function slideEnd(event) {
            if (event.orientation !== 'vertical') return;
            isScrollMove = false;
        }

        function slideCaptureTopEnd(event) {
            if (event.orientation !== 'vertical') return;
            // 如果滚动到了底部 就不消费事件 return 出去
            // 如果没滚动到底部消费事件 并阻止事件向下传递
            if (isScrollToBottomEnd()) return;
            event.stopPropagation();
            if (isRefreshMove) return; //处于刷新状态中
            // LOG('清除动画 滚动结束并产生速度 slideCaptureTopEnd', event.velocityY);
            dispatchScrollTopFlying(event.velocityY)
        }

        function slideBottomEnd(event) {
            if (event.orientation !== 'vertical') return;
            // 如果滚动到了顶部 就不消费事件 return 出去
            // 如果没滚动顶部 就去消费事件 并阻止事件向上冒泡
            if (isScrollToTopEnd()) return;
            event.stopPropagation();
            if (isRefreshMove) return; //处于刷新状态中
            // LOG('清除动画 滚动结束并产生速度 slideBottomEnd', event.velocityY);
            dispatchScrollBottomFlying(event.velocityY);
        }

        function onTouchstart(event) {
            dispatchChildrenEvent('onTouchstart', event);
        }

        function onTouchend(event) {
            dispatchChildrenEvent('onTouchend', event);
        }

        function onRef(el) {
            RScrollContext.element = el;
            scrollEl.value = el
        }

        function onContentRef(el) {
            RScrollContext.contentElement = el;
            container.value = el
        }

        let mSlide;
        onMounted(() => {
            mSlide = extendedSlideEvents(scrollEl.value, { direction: ['top', 'bottom'], customEventName: 'scroll', })
            scrollEl.value.addEventListener('scrollDown', slideCaptureDown, { passive: false, capture: true });
            scrollEl.value.addEventListener('scrollStrat', slideCaptureStrat, { passive: false, capture: true });

            scrollEl.value.addEventListener('scrollTop', slideCaptureTop, { passive: false, capture: true });
            scrollEl.value.addEventListener('scrollBottom', slideBottom, { passive: false, capture: false });
            scrollEl.value.addEventListener('scrollAfterMove', slideAfterMove, { passive: false, capture: false });

            scrollEl.value.addEventListener('scrollEnd', slideEnd, { passive: false, capture: true });
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
            return <div class="r-nested-scroll" ref={onRef} onTouchstart={onTouchstart} onTouchend={onTouchend} >
                {renderSlot(ctx.slots, "top")}
                <div ref={onContentRef} class="r-nested-scroll-container">
                    {ctx.slots?.default?.()}
                </div>
                {renderSlot(ctx.slots, "bottom")}
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
        onanimationEnd: () => undefined,
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
                opt.onanimationEnd(opt.velocity)
                return
            }
            if (stopAction) return cancelAnimationFrame(time);
            LOG('onanimation')
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
                opt.onanimationEnd(opt.velocity)
                return
            }
            if (stopAction) return cancelAnimationFrame(time);
            LOG('onanimation')
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