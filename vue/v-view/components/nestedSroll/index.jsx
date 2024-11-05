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
            dispatchScrollUp,
            dispatchScrollDown,
            props,
            layer: (parent?.layer ?? 0) + 1,
            disableTouch: Boolean(parent),
        })
        provide("RNestedViewsContext", expose);
        if (parent) parent.children.push(expose);
        if (parent) parent.child = parent.children[0];
        if (props.isRoot) {
            console.log('RNestedScrollContext');
            console.log(expose);
        }


        const scrollEl = ref('scrollEl')
        const container = ref('container')
        let scrollTop = 0;
        let ani;



        function cAni(config = {}) {
            let time;
            const opt = {
                velocity: 0,
                deceleration: 0.03,
                onanimationend: () => undefined,
                ...config
            }
            let stopAction = false;

            const isReduce = opt.velocity < 0;


            function animaMinus() {
                if (stopAction) return;
                time = requestAnimationFrame(() => {
                    opt.velocity = Number((opt.velocity + opt.deceleration).toFixed(3));
                    if (opt.velocity > 0) opt.velocity = 0;
                    if (opt.velocity >= 0) {
                        stop()
                        return
                    }
                    if (stopAction) return;
                    opt.onanimationend(opt.velocity)
                    animaMinus()
                })
            }



            function animaAdd() {
                if (stopAction) return;
                time = requestAnimationFrame(() => {
                    opt.velocity = Number((opt.velocity - opt.deceleration).toFixed(3));
                    if (opt.velocity < 0) opt.velocity = 0;
                    if (opt.velocity <= 0) {
                        stop()
                        return
                    }
                    if (stopAction) return;
                    opt.onanimationend(opt.velocity)
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
                // console.log('停止动画');
            }


            function start() {
                stopAction = false;
                anima()
            }

            return { start, stop }
        }







        function slideEnd(event) {
            // if (expose.disableTouch) return
            console.log('scroll-slideEnd', event);
            ani = cAni({
                velocity: event.velocityY,
                onanimationend(v) {
                    const event = { moveY: v * 15 }
                    // console.log('vvvvvv', v);
                    if (event.moveY < 0) onScrollUp(event);
                    if (event.moveY > 0) onScrollDown(event);
                }
            });
            ani.start();
        }

        function dispatchScrollUp(moveY) {
            const stop = scrollTop + moveY;
            if (isScrollBottom()) {
                expose.child?.dispatchScrollUp?.(moveY)
            } else {
                scrollTop = stop
                if (scrollTop > container.value.offsetHeight) scrollTop = container.value.offsetHeight
                scrollEl.value.scrollTop = scrollTop
            }
        }

        function dispatchScrollDown(moveY) {
            const stop = scrollTop + moveY;
            if (isScrollTop()) {
                expose.parent?.dispatchScrollDown?.(moveY)
            } else {
                scrollTop = stop
                if (scrollTop < 0) scrollTop = 0
                scrollEl.value.scrollTop = scrollTop
            }
        }

        function isScrollTop() {
            return scrollEl.value.scrollTop <= 0;
        }

        function isScrollBottom() {
            const top = Math.ceil(scrollEl.value.scrollTop)
            return (scrollEl.value.offsetHeight + top) >= container.value.offsetHeight
        }

        function slideDown(event) {
            console.log('slideDown', event.currentTarget);
            ani?.stop?.();
        }

        function slideBottom(event) {
            event.stopPropagation();
            console.log('slideBottom', event.moveY);
            onScrollDown(event);
        }

        function slideTop(event) {
            event.stopPropagation();
            console.log('slideTop', event.moveY);
            onScrollUp(event);
        }

        function onScrollDown(event) {
            dispatchScrollUp(event.moveY)
        }

        function onScrollUp(event) {
            const lastChild = getLastChild(expose)
            lastChild?.dispatchScrollDown?.(event.moveY);
        }

        function getLastChild(current) {
            if (!current.child) return current;
            return getLastChild(current.child);
        }




        onMounted(() => {
            extendedSlideEvents(scrollEl.value, { direction: ['top', 'bottom'], customEventName: 'scroll', })
            scrollEl.value.addEventListener('slideDown', slideDown, { passive: false, capture: true });
            scrollEl.value.addEventListener('slideBottom', slideBottom, { passive: false, capture: true });
            scrollEl.value.addEventListener('slideTop', slideTop, { passive: false, capture: true });
            scrollEl.value.addEventListener('scrollEnd', slideEnd, { passive: false, capture: true });
        })


        onBeforeUnmount(() => {
            scrollEl.value.removeEventListener('slideDown', slideDown, { passive: false, capture: true });
            scrollEl.value.removeEventListener('slideBottom', slideBottom, { passive: false, capture: true });
            scrollEl.value.removeEventListener('slideTop', slideTop, { passive: false, capture: true });
            scrollEl.value.removeEventListener('scrollEnd', slideEnd, { passive: false, capture: true });

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
        onanimationend: () => undefined,
        onanimation: () => undefined,
        ...config
    }
    let stopAction = false;

    const isReduce = opt.velocity < 0;


    function animaMinus() {
        if (stopAction) return;
        time = requestAnimationFrame(() => {
            opt.velocity = Number((opt.velocity + opt.deceleration).toFixed(3));
            if (opt.velocity > 0) opt.velocity = 0;
            if (opt.velocity >= 0) {
                stop()
                opt.onanimationend(opt.velocity)
                return
            }
            if (stopAction) return;
            opt.onanimation(opt.velocity)
            animaMinus()
        })
    }



    function animaAdd() {
        if (stopAction) return;
        time = requestAnimationFrame(() => {
            opt.velocity = Number((opt.velocity - opt.deceleration).toFixed(3));
            if (opt.velocity < 0) opt.velocity = 0;
            if (opt.velocity <= 0) {
                stop()
                opt.onanimationend(opt.velocity)
                return
            }
            if (stopAction) return;
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
        // console.log('停止动画');
    }


    function start() {
        stopAction = false;
        anima()
    }

    return { start, stop }
}