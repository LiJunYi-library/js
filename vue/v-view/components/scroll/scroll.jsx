import {
    defineComponent,
    renderSlot,
    computed,
    onMounted,
    onBeforeUnmount,
    inject,
    reactive,
    provide,
    ref,
} from "vue";
import "./index.scss";
import { arrayRemove } from "@rainbow_ljy/rainbow-js";
import { RGlobal } from "../../global";

export class ScrollController {
    onScroll = () => 0;
    onFlotage = () => 0;
    events = [];
    elements = [];
    currentElement = undefined;
    otherElements = [];
    constructor(obj = {}) {
        Object.assign(this, obj);
    }

    scrollAllTop(top) {
        this.elements.forEach((ctx) => {
            ctx.element.scrollTop = top;
        });
    }

    addEvent(eventFun) {
        this.events.push(eventFun);
    }

    removeEvent(eventFun) {
        arrayRemove(this.events, eventFun);
    }

    dispatchScroll(...arg) {
        this.events.forEach((fun) => {
            fun(...arg);
        });
    }

    addElement(ele) {
        this.elements.push(ele);
    }

    setCanScroll(bool) {
        this.elements.forEach((el) => {
            el.setCanScroll(bool);
        });
    }

    removeElement(ele) {
        arrayRemove(this.elements, ele);
    }
}

export function useScrollController(props = {}) {
    const RScrollContext = inject("RScrollContext") || {};
    const controller = reactive({
        onScrollTop: () => undefined,
        onScrollBottom: () => undefined,
        onScrollUp: () => undefined,
        onScrollDown: () => undefined,
        onScroll: () => undefined,
        onScrollend: () => undefined,
        onScrollRefresh: () => undefined,
        onResize: () => undefined,
        onMounted: () => undefined,
        onTouchstart: () => undefined,
        onTouchend: () => undefined,
        onFlotage: () => undefined,
        ...props,
        destroy,
        getOffsetTop,
        dispatchFlotage,
        context: RScrollContext,
    });

    RScrollContext?.children?.push?.(controller);

    function getOffsetTop(ele, top = 0) {
        if (!RScrollContext.element) return top;
        if (!ele) return top;
        top = top + ele.offsetTop;
        if (ele.offsetParent === RScrollContext.element) return top;
        return getOffsetTop(ele.offsetParent, top);
    }

    function dispatchFlotage(...arg) {
        RScrollContext.children.forEach((element) => {
            element.onFlotage(...arg);
        });
    }

    function destroy() {
        arrayRemove(RScrollContext?.children, controller);
    }

    onBeforeUnmount(() => {
        destroy();
    });

    return controller;
}

export const RScroll = defineComponent({
    props: {
        scrollController: Object,
        popupDisableScroll: { type: Boolean, default: false },
        contentStyle: [Object, String, Array],
        triggerScrollBottomHeight: { type: [Number, String], default: 2 },
        rubberBand: { type: Boolean, default: true },
    },
    emits: ["scrollDown", "scrollUp", "scrollChange", "scrollBottom", "scrollRefresh"],
    setup(props, context) {
        const { scrollController: SC } = props;
        const RScrollContext = reactive({
            element: null,
            scrollTop: 0,
            contentElement: null,
            otherElement: [],
            children: [],
            stickys: [],
            isHandActuated: false,
        });
        provide("RScrollContext", RScrollContext);
        const judgeorientation = useTouch();
        let prveTop = 0;
        let scrollTop = 0;
        let resizeObserver;
        let stratTouche;
        let refreshLock = false;
        let scrollLock = false;
        const docEvent = {
            startEvent: undefined,
            moveEvent: undefined,
            onTouchstart: (event) => {
                docEvent.startEvent = event;
            },
            onTouchmove: (event) => {
                docEvent.moveEvent = event;
                let move = docEvent.moveEvent?.touches?.[0]?.pageY ?? 0 - docEvent.startEvent?.touches?.[0]?.pageY ?? 0;
                const scrollTop = RScrollContext.element?.scrollTop;
                const maxTop = RScrollContext.element?.scrollHeight - RScrollContext.element?.offsetHeight;
                if (move < 0) {
                    if (scrollTop >= maxTop) {
                        docEvent.startEvent?.preventDefault?.();
                        docEvent.moveEvent?.preventDefault?.();
                        scrollEvent.startEvent?.preventDefault?.();
                        scrollEvent.moveEvent?.preventDefault?.();
                    }
                }
            },
        }
        const scrollEvent = {
            startEvent: undefined,
            moveEvent: undefined,
            onTouchstart: (event) => {
                scrollEvent.startEvent = event;
            },
            onTouchmove: (event) => {
                scrollEvent.moveEvent = event;
                let move = scrollEvent.moveEvent?.touches?.[0]?.pageY ?? 0 - scrollEvent.startEvent?.touches?.[0]?.pageY ?? 0;
                const scrollTop = RScrollContext.element?.scrollTop;
                const maxTop = RScrollContext.element?.scrollHeight - RScrollContext.element?.offsetHeight;
                if (move < 0) {
                    if (scrollTop >= maxTop) {
                        RScrollContext.element.scrollTop = maxTop
                        scrollEvent.startEvent?.preventDefault?.();
                        scrollEvent.moveEvent?.preventDefault?.();
                        docEvent.startEvent?.preventDefault?.();
                        docEvent.moveEvent?.preventDefault?.();
                    }
                }
            },
        }

        try {
            resizeObserver = new ResizeObserver(([entries]) => {
                RScrollContext.children.forEach((el) => {
                    el.onResize(entries, RScrollContext.element.scrollTop);
                });
            });
        } catch (error) {
            //
        }

        function onScroll(event) {
            if (RScrollContext.isHandActuated) {
                RScrollContext.isHandActuated = false;
                return;
            }

            if (SC) SC.currentElement = RScrollContext;

            if (SC) SC.otherElements = SC.elements.filter((el) => el !== SC.currentElement);

            scrollTop = RScrollContext.element?.scrollTop;

            RScrollContext.scrollTop = scrollTop;

            const maxTop = RScrollContext.element?.scrollHeight - RScrollContext.element?.offsetHeight;

            if(props.rubberBand){
              if (scrollTop < 0) scrollTop = 0;

              if (scrollTop > maxTop) {
                  scrollTop = maxTop;
                  RScrollContext.element.scrollTop = maxTop
              }
            }
         

            const space = scrollTop - prveTop;

            event.space = space;
            event.scrollTop = scrollTop;
            event.containerHeight = RScrollContext.element.offsetHeight;
            event.contentHeight = RScrollContext.contentElement.offsetHeight;

            if (space > 0) {
                RScrollContext.children.forEach((el) => {
                    el.onScrollDown(event, scrollTop);
                });
                context.emit("scrollDown", scrollTop);
            }

            if (space < 0) {
                RScrollContext.children.forEach((el) => {
                    el.onScrollUp(event, scrollTop);
                });
                context.emit("scrollUp", scrollTop);
            }

            RScrollContext.children.forEach((el) => {
                el.onScroll(event, scrollTop);
            });

            handleScrollBottom(event, scrollTop);

            if (SC) SC.dispatchScroll(event);

            context.emit("scrollChange", scrollTop);

            prveTop = scrollTop;
        }

        function onScrollend(event) {
            RScrollContext.children.forEach((el) => {
                el.onScrollend(event, scrollTop);
            });
        }

        function handleScrollBottom(event, STop) {
            if (
                RScrollContext.element.offsetHeight + STop >=
                RScrollContext.contentElement.offsetHeight - props.triggerScrollBottomHeight
            ) {
                RScrollContext.children.forEach((el) => {
                    el.onScrollBottom(event, scrollTop);
                });
                context.emit("scrollBottom", scrollTop);
            }
        }

        RScrollContext.scrollTo = (top, isHandActuated = true) => {
            RScrollContext.isHandActuated = isHandActuated;
            if (typeof top === "number") {
                RScrollContext.element.scrollTop = top;
                scrollTop = top;
                RScrollContext.scrollTop = scrollTop;
                prveTop = top;
            }
            if (typeof top === "object") {
                RScrollContext.element.scrollTo(top);
                prveTop = top.top;
                scrollTop = top.top;
                RScrollContext.scrollTop = scrollTop;
            }
        };

        RScrollContext.scrollAdd = (space, isHandActuated = true) => {
            RScrollContext.isHandActuated = isHandActuated;
            let st = RScrollContext.element.scrollTop + space;
            if (st < 0) st = 0;
            RScrollContext.element.scrollTop = st;
            scrollTop = st;
            prveTop = st;
            RScrollContext.scrollTop = scrollTop;
        };

        RScrollContext.setCanScroll = (bool = true) => {
            RScrollContext.element.setAttribute("data-scroll", bool);
        };

        if (SC) SC.addElement(RScrollContext);

        if (props.popupDisableScroll) RGlobal.scrolls.push(RScrollContext);

        onMounted(() => {
            RScrollContext.children.forEach((el) => {
                el.onMounted(RScrollContext.element.scrollTop);
            });
            resizeObserver?.observe?.(RScrollContext.contentElement);

            RScrollContext.element.addEventListener('touchstart', scrollEvent.onTouchstart, { passive: false });
            RScrollContext.element.addEventListener('touchmove', scrollEvent.onTouchmove, { passive: false });
            document.addEventListener('touchstart', docEvent.onTouchstart, { passive: false });
            document.addEventListener('touchmove', docEvent.onTouchmove, { passive: false });
        });

        onBeforeUnmount(() => {
            arrayRemove(RGlobal.scrolls, RScrollContext);
            if (SC) SC.removeElement(RScrollContext);
            resizeObserver?.disconnect?.();

            RScrollContext.element.removeEventListener('touchstart', scrollEvent.onTouchstart, { passive: false });
            RScrollContext.element.removeEventListener('touchmove', scrollEvent.onTouchmove, { passive: false });
            document.removeEventListener('touchstart', docEvent.onTouchstart, { passive: false });
            document.removeEventListener('touchmove', docEvent.onTouchmove, { passive: false });
        });

        function onRef(el) {
            RScrollContext.element = el;
        }

        function onContentRef(el) {
            RScrollContext.contentElement = el;
        }

        function onTouchstart(event) {
            RScrollContext.children.forEach((el) => {
                el?.onTouchstart?.(event);
            });
            if (scrollTop > 0) return scrollLock = true;
            judgeorientation.start(event);
            stratTouche = event.touches[0];
        }

        function onTouchmove(event) {
            if (!stratTouche) return;
            if (scrollTop > 0) return scrollLock = true;
            if (scrollLock === true) return console.log('滚动锁');
            judgeorientation.move(event);
            if( !judgeorientation.isVertical())return;
            const moveTouche = event.touches[0];
            if (!moveTouche) return;
            const moveY = moveTouche.pageY - stratTouche.pageY;
            if (moveY > 10 && refreshLock === false) refreshLock = true;
            if (refreshLock === true) {
                event.stopImmediatePropagation();
                event.preventDefault();
                let refreshHeight = moveY - 10;
                event.refreshHeight = refreshHeight
                RScrollContext.children.forEach((el) => {
                    el.onScrollRefresh(event, refreshHeight);
                });
                context.emit("scrollRefresh", refreshHeight);
            }
        }

        function onTouchend(event) {
            refreshLock = false;
            scrollLock = false;
            stratTouche = undefined;
            judgeorientation.reset();
            RScrollContext.children.forEach((el) => {
                el?.onTouchend?.(event);
            });
        }

        return (vm) => {
            return (
                <div ref={onRef}
                    class="r-scroll"
                    onTouchmove={onTouchmove}
                    onTouchstart={onTouchstart}
                    onTouchend={onTouchend}
                    onScroll={onScroll}
                    onScrollend={onScrollend}>
                    {renderSlot(context.slots, "top")}
                    <div class="r-scroll-content" ref={onContentRef} style={props.contentStyle}>
                        {renderSlot(context.slots, "default")}
                    </div>
                    {renderSlot(context.slots, "bottom")}
                </div>
            );
        };
    },
});


var MIN_DISTANCE = 10;

function getDirection(x, y) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal';
  }

  if (y > x && y > MIN_DISTANCE) {
    return 'vertical';
  }

  return '';
}

export function useTouch() {
  var startX = ref(0);
  var startY = ref(0);
  var deltaX = ref(0);
  var deltaY = ref(0);
  var offsetX = ref(0);
  var offsetY = ref(0);
  var direction = ref('');

  var isVertical = () => direction.value === 'vertical';

  var isHorizontal = () => direction.value === 'horizontal';

  var reset = () => {
    deltaX.value = 0;
    deltaY.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    direction.value = '';
  };

  var start = event => {
    reset();
    startX.value = event.touches[0].clientX;
    startY.value = event.touches[0].clientY;
  };

  var move = event => {
    var touch = event.touches[0];

    deltaX.value = touch.clientX < 0 ? 0 : touch.clientX - startX.value;
    deltaY.value = touch.clientY - startY.value;
    offsetX.value = Math.abs(deltaX.value);
    offsetY.value = Math.abs(deltaY.value);

    if (!direction.value) {
      direction.value = getDirection(offsetX.value, offsetY.value);
    }
  };

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal
  };
}