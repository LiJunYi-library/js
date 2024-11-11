import { onMounted, ref, defineComponent, computed, inject, reactive, provide, watchEffect } from 'vue'
import './index.scss'
import { extendedSlideEvents } from '../../utils/slide'
const RNestedViewPageProps = { tag: String, isRoot: Boolean, collectVnode: [], listHook: Object };

export const RNestedViewPage = defineComponent({
    props: RNestedViewPageProps,
    setup(props, ctx) {
        const parent = props.isRoot ? undefined : inject("RNestedViewsContext");
        const expose = reactive({
            name: 'RNestedViewPageContext',
            child: undefined,
            children: [],
            parent,
            dispatchScrollTopFlying,
            dispatchScrollBottomFlying,
            props,
            layer: (parent?.layer ?? 0) + 1,
            isWork: false,
            index: 0,
        })
        provide("RNestedViewsContext", expose);
        expose.root = parent?.root || expose;
        if (parent) parent.children.push(expose);
        if (parent) parent.child = parent.children[0];

        const LOG = (...arg) => console.log(...arg);
        const scrollEl = ref()
        const container = ref()
        let scrollLeft = 0;
        let ani;
        let adsorbAni;
        const childrens = computed(() => props.collectVnode.map((el) => el.component).filter(Boolean));

        function dispatchScrollTopFlying(...arg) {
            expose.child?.dispatchScrollTopFlying?.(...arg)
        }

        function dispatchScrollBottomFlying(...arg) {
            expose.parent?.dispatchScrollBottomFlying?.(...arg)
        }

        function maxScrollLeft() {
            return container.value.offsetWidth - scrollEl.value.offsetWidth;
        }

        function isScrollRightEnd() {
            return (scrollEl.value.offsetWidth + scrollEl.value.scrollLeft) >= container.value.offsetWidth
        }

        function isScrollLeftEnd() {
            return scrollEl.value.scrollLeft <= 0
        }

        function slideDown(event) {
            ani?.stop?.();
            adsorbAni?.stop?.();
        }

        function slideLeft(event) {
            if (event.orientation !== 'horizontal') return;
            if (parent && parent.isWork) return;
            // 如果没有滚动到了最右边 就不消费事件 return 出去
            // 如果滚动到了最右边 就去消费事件 并阻止事件向上冒泡
            if (isScrollRightEnd()) return;
            event.stopPropagation();
            expose.isWork = true;
            let sLeft = scrollLeft + event.moveX;
            if (sLeft > maxScrollLeft()) sLeft = maxScrollLeft() + 0.2;
            scrollLeft = sLeft;
            scrollEl.value.scrollLeft = scrollLeft
        }

        function slideRight(event) {
            if (event.orientation !== 'horizontal') return;
            if (parent && parent.isWork) return;
            // 如果没有滚动到了最左边 就不消费事件 return 出去
            // 如果滚动到了最左边 就去消费事件 并阻止事件向上冒泡
            if (isScrollLeftEnd()) return;
            event.stopPropagation();
            expose.isWork = true;
            let sLeft = scrollLeft + event.moveX;
            if (sLeft < 0) sLeft = 0
            scrollLeft = sLeft
            scrollEl.value.scrollLeft = scrollLeft
        }

        function slideEnd(event) {
            if (event.orientation !== 'horizontal') return;
            if (isScrollRightEnd()) return;
            if (isScrollLeftEnd()) return;
            event.stopPropagation();
            expose.isWork = false;

            const max = scrollEl.value.offsetWidth * (expose.index + 1)
            let minIndex = expose.index - 1
            if (minIndex < 0) minIndex = 0
            const min = scrollEl.value.offsetWidth * minIndex;

            ani = cAni({
                deceleration: 0.02,
                velocity: event.velocityX,
                onanimation(v) {
                    const event = { moveX: v * 30 }
                    let sLeft = scrollLeft + event.moveX;
                    if (sLeft > max) {
                        ani.stop();
                        sLeft = max + 0.2;
                        expose.index = expose.index + 1
                        parent.child = expose?.children?.[expose.index]
                        props.listHook?.updateIndex?.(expose.index)
                    }
                    if (sLeft < min) {
                        ani.stop();
                        sLeft = min
                        expose.index = expose.index - 1
                        parent.child = expose?.children?.[expose.index]
                        props.listHook?.updateIndex?.(expose.index)
                    }
                    scrollLeft = sLeft;
                    scrollEl.value.scrollLeft = scrollLeft
                },
                onanimationend(v) {
                    const oldLeft = scrollEl.value.scrollLeft;
                    const index = Math.round(scrollLeft / scrollEl.value.offsetWidth)
                    scrollLeft = scrollEl.value.offsetWidth * index
                    adsorbAni = Animation({
                        from: oldLeft,
                        to: scrollLeft,
                        avg: 10,
                        onanimation(aLeft) {
                            console.log(aLeft);
                            scrollEl.value.scrollLeft = aLeft
                        },
                        onanimationend() {
                            expose.index = index
                            parent.child = expose?.children?.[expose.index]
                            props.listHook?.updateIndex?.(expose.index)
                        }
                    })
                    adsorbAni.start();
                }
            });
            ani.start();
        }

        function slideLeftEnd(event) {
            // if (event.orientation !== 'horizontal') return;
            // if (parent && parent.isWork) return;
            // // 如果没有滚动到了最右边 就不消费事件 return 出去
            // // 如果滚动到了最右边 就去消费事件 并阻止事件向上冒泡
            // if (isScrollRightEnd()) return;
            // event.stopPropagation();
            // expose.isWork = false;
        }


        function slideRightEnd(event) {
            LOG('slideRightEnd')
        }

        watchEffect(() => {
            if (!scrollEl.value?.offsetWidth) return
            scrollLeft = scrollEl.value.offsetWidth * props.listHook.index
            scrollEl.value.scrollLeft = scrollLeft
            expose.index = props.listHook.index
            parent.child = expose?.children?.[props.listHook.index]
        });


        onMounted(() => {
            extendedSlideEvents(scrollEl.value, { direction: ['left', 'right'], customEventName: 'swarp', })
            scrollEl.value.addEventListener('swarpDown', slideDown, { passive: false, capture: false });
            scrollEl.value.addEventListener('swarpLeft', slideLeft, { passive: false, capture: false });
            scrollEl.value.addEventListener('swarpRight', slideRight, { passive: false, capture: false });
            scrollEl.value.addEventListener('swarpEnd', slideEnd, { passive: false, capture: false });
            // scrollEl.value.addEventListener('swarpLeftEnd', slideLeftEnd, { passive: false, capture: false });
            // scrollEl.value.addEventListener('swarpRightEnd', slideRightEnd, { passive: false, capture: false });
        });

        const width = () => {
            if (scrollEl.value) return scrollEl.value.offsetWidth + 'px'
            return '100vw'
        }

        const containerWidth = (length = 1) => {
            if (scrollEl.value) return scrollEl.value.offsetWidth * length + 'px'
            return `calc(  100vw  * ${length}  )`
        }

        return () => {
            const children = ctx.slots?.default?.();
            console.log(children);
            return <div class="r-nested-view-page" ref={(el) => scrollEl.value = el} >
                <div class="r-nested-view-page-list"
                    ref={(el) => container.value = el}
                    style={{ width: containerWidth(children.length) }}
                >
                    {children.map(node => (<div class="r-nested-view-page-item" style={{ width: width() }} > {node} </div>))}
                </div>
            </div >
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
        if (stopAction) return cancelAnimationFrame(time);
        time = requestAnimationFrame(() => {
            if (stopAction) return cancelAnimationFrame(time);
            opt.velocity = Number((opt.velocity + opt.deceleration).toFixed(3));
            if (opt.velocity > 0) opt.velocity = 0;
            if (opt.velocity >= 0) {
                stop()
                opt.onanimationend(opt.velocity)
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
                opt.onanimationend(opt.velocity)
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

function Animation(config = {}) {
    let timer;
    let stopAction = false;
    const opt = {
        from: 0,
        to: 300,
        avg: 10,
        duration: 500,
        onanimationend: () => undefined,
        onanimation: () => undefined,
        ...config
    }
    let value = opt.from;


    function flash() {
        if (opt.from < opt.to) {
            value = value + opt.avg;
            if (value >= opt.to) value = opt.to
            opt.onanimation(value)
            if (value >= opt.to) {
                opt.onanimationend(value)
                stop()
                return
            }
        }

        if (opt.from > opt.to) {
            value = value - opt.avg;
            if (value <= opt.to) value = opt.to
            opt.onanimation(value)
            if (value <= opt.to) {
                opt.onanimationend(value)
                stop()
                return
            }
        }
    }


    function start() {
        if (stopAction) return cancelAnimationFrame(timer);
        timer = requestAnimationFrame(() => {
            if (stopAction) return cancelAnimationFrame(timer);
            flash()
            start()
        })
    }


    function stop() {
        stopAction = true;
        cancelAnimationFrame(timer)
    }

    return { start, stop }
}