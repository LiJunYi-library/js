import { onMounted, ref, defineComponent, computed, inject, reactive, provide } from 'vue'
import './index.scss'
import { extendedSlideEvents } from '../../utils/slide'
const RNestedViewPageProps = { tag: String, isRoot: Boolean, collectVnode: [] };

export const RNestedViewPage = defineComponent({
    props: RNestedViewPageProps,
    setup(props, ctx) {
        const parent = inject("RNestedViewsContext");
        const expose = reactive({
            name: 'RNestedViewPageContext',
            child: undefined,
            children: [],
            parent,
            dispatchScrollUp,
            dispatchScrollDown,
            props,
            layer: (parent?.layer ?? 0) + 1,
            isWork: false,
            index: 0,
        })
        provide("RNestedViewsContext", expose);
        if (parent) parent.children.push(expose);
        if (parent) parent.child = parent.children[0];

        // if (props.isRoot) {
        //     console.log('RNestedViewPageContext viewPageParent scrollParent');
        //     console.log(expose);
        // }


        const scrollEl = ref()
        const container = ref()
        let scrollLeft = 0;
        let ani;
        const childrens = computed(() => props.collectVnode.map((el) => el.component).filter(Boolean));

        function dispatchScrollUp(moveY) {
            expose.child?.dispatchScrollUp?.(moveY)
        }

        function dispatchScrollDown(moveY) {
            expose.parent?.dispatchScrollDown?.(moveY)
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
        }

        function slideLeft(event) {
            if (parent && parent.isWork) return;
            if (isScrollRightEnd()) return;
            event.stopPropagation();
            expose.isWork = true;
            let sLeft = scrollLeft + event.moveX;
            if (sLeft > maxScrollLeft()) sLeft = maxScrollLeft() + 0.2;
            scrollLeft = sLeft;
            scrollEl.value.scrollLeft = scrollLeft
        }

        function slideRight(event) {
            if (parent && parent.isWork) return;
            if (isScrollLeftEnd()) return;
            event.stopPropagation();
            // console.log('slideRight',props.tag);
            expose.isWork = true;
            let sLeft = scrollLeft + event.moveX;
            if (sLeft < 0) sLeft = 0
            scrollLeft = sLeft
            scrollEl.value.scrollLeft = scrollLeft
        }

        function slideEnd(event) {
            if (isScrollRightEnd()) return;
            if (isScrollLeftEnd()) return;
            console.log('page-slideEnd');
            event.stopPropagation();
            expose.isWork = false;

            // console.log(expose.index, 'slideEnd', event.speedX, event.velocityX);

            const max = scrollEl.value.offsetWidth * (expose.index + 1)
            let minIndex = expose.index - 1
            if (minIndex < 0) minIndex = 0
            const min = scrollEl.value.offsetWidth * minIndex;
            // console.log(max);


            ani = cAni({
                deceleration: 0.02,
                velocity: event.velocityX,
                onanimation(v) {
                    const event = { moveX: v * 30 }
                    // console.log('vvvvvv', v);
                    let sLeft = scrollLeft + event.moveX;
                    if (sLeft > max) {
                        sLeft = max + 0.2;
                        expose.index = expose.index + 1
                        parent.child = expose?.children?.[expose.index]
                        // console.log(expose?.children, expose.index, parent.child);
                        ani.stop();
                    }
                    if (sLeft < min) {
                        sLeft = min
                        expose.index = expose.index - 1
                        parent.child = expose?.children?.[expose.index]
                        // console.log(expose?.children, expose.index, parent.child);
                        ani.stop();
                    }
                    scrollLeft = sLeft;
                    scrollEl.value.scrollLeft = scrollLeft
                    // if (event.space < 0) onScrollUp(event);
                    // if (event.space > 0) onScrollDown(event);
                },
                onanimationend(v) {
                    const index = Math.round(scrollLeft / scrollEl.value.offsetWidth)
                    scrollLeft = scrollEl.value.offsetWidth * index
                    scrollEl.value.scrollLeft = scrollLeft
                    expose.index = index
                    parent.child = expose?.children?.[expose.index]
                    // console.log(expose?.children, expose.index, parent.child);

                }
            });
            ani.start();
        }


        onMounted(() => {
            extendedSlideEvents(scrollEl.value, { direction: ['left', 'right'] })
            scrollEl.value.addEventListener('slideDown', slideDown, { passive: false, capture: false });
            scrollEl.value.addEventListener('slideLeft', slideLeft, { passive: false, capture: false });
            scrollEl.value.addEventListener('slideRight', slideRight, { passive: false, capture: false });
            // scrollEl.value.addEventListener('slideEnd', slideEnd, { passive: false, capture: false });
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