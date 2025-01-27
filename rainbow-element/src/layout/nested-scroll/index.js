import "./index.css";
import { RainbowElement, createCustomEvent } from "../../base/index.js";
import { extendedSlideEvents } from "../../events/slide";
import { inheritSlideEvent } from "../../events/scroll";
const LOG = (...arg) => console.log(...arg);

export class RNestedScroll extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "--r-scrolling-direction": String,
  });

  $slotContainer = {
    default: document.createElement("div"),
  };

  $$ = {
    captureOptions: { passive: false, capture: true },
    slideEvent: extendedSlideEvents(this, {
      direction: ["top", "bottom"],
      // customEventName: "scroll",
    }),
    scrollEvent: setup({
      scrollEl: this,
      container: this.$slotContainer.default,
    }),
    disabledScroll: () => {},
    unDisabledScroll: () => {},
  };

  constructor(...arg) {
    super(...arg);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$.appendChild(this.$slotContainer.default);
    this.$slotContainer.default.classList.add("r-nested-scroll-content");
    this.classList.add("r-nested-scroll");
    this.$$.slideEvent.bindEvents();
    this.$$.scrollEvent.bindEvents();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    this.$$.slideEvent.destroy();
    this.$$.scrollEvent.destroy();
  }
}
customElements.define("r-nested-scroll", RNestedScroll);

function setup(props) {
  const { scrollEl, container, view = scrollEl } = props;
  let ani;
  const coefficient = 20;
  let isScrollToBottomEnd = () =>
    scrollEl.offsetHeight + scrollEl.scrollTop >= container.offsetHeight;
  let isScrollToTopEnd = () => scrollEl.scrollTop <= 0;
  let maxScrollTop = () => container.offsetHeight - scrollEl.offsetHeight;
  let isScrollRightEnd = () => scrollEl.offsetWidth + scrollEl.scrollLeft >= container.offsetWidth;
  let isScrollLeftEnd = () => scrollEl.value.scrollLeft <= 0;
  let maxScrollLeft = () => container.value.offsetWidth - scrollEl.value.offsetWidth;

  let child = () => view.$.findChildByLocalName("r-nested-scroll");
  let parent = () => view.$.findParentByLocalName(["r-nested-scroll"]);

  let rollingConflict = (event) => {
    console.log(event.srcViews[0].$.DATA.rScrollingDirection);
  };

  function slideCaptureTop(event) {
    rollingConflict(event);
    if (event.orientation !== "vertical") return;
    // 如果滚动到了底部 就不消费事件 return 出去
    // 如果没滚动到底部消费事件 并阻止事件向下传递
    if (isScrollToBottomEnd()) return;
    event.stopPropagation();
    doScrollTop(event.moveY, event);
  }

  function slideBottom(event) {
    if (event.orientation !== "vertical") return;
    // 如果滚动到了顶部 就不消费事件 return 出去
    // 如果没滚动顶部 就去消费事件 并阻止事件向上冒泡
    if (isScrollToTopEnd()) return;
    event.stopPropagation();
    doScrollBottom(event.moveY);
  }

  function doScrollBottom(moveY, event) {
    let scrollTop = scrollEl.scrollTop + moveY;
    if (scrollTop < 0) scrollTop = 0;
    scrollEl.scrollTop = scrollTop;
    view.dispatchEvent(createEvent("scrollDown", event));
    view.dispatchEvent(createEvent("scrollChange", event));
    if (isScrollToTopEnd()) view.dispatchEvent(createEvent("scrollTop", event));
  }

  function createEvent(name, event = {}) {
    return inheritSlideEvent(name, {
      ...event,
      scrollTop: scrollEl.scrollTop,
      scrollHeight: scrollEl.offsetHeight,
      containerHeight: container.offsetHeight,
      space: event?.moveY,
    });
  }

  function doScrollTop(moveY, event = {}) {
    let scrollTop = scrollEl.scrollTop + moveY;
    if (scrollTop > maxScrollTop()) scrollTop = maxScrollTop() + 2;
    scrollEl.scrollTop = scrollTop;
    view.dispatchEvent(createEvent("scrollUp", event));
    view.dispatchEvent(createEvent("scrollChange", event));
    if (isScrollToBottomEnd()) view.dispatchEvent(createEvent("scrollBottom", event));
  }

  function dispatchScrollTopFlying(velocity, event) {
    ani?.stop?.();
    ani = cAni({
      velocity,
      onanimation(v) {
        const moveY = Math.ceil(v * coefficient);
        if (moveY > 0) {
          doScrollTop(moveY, event);
          if (isScrollToBottomEnd()) {
            ani?.stop?.();
            LOG("滚动停止 到底停止");
            console.log(child());
            child()?.[0]?.$$?.scrollEvent?.dispatchScrollTopFlying?.(v, event);
            // expose.child?.dispatchScrollTopFlying?.(v)
          }
        }
      },
      onanimationEnd(v) {
        LOG("滚动停止 scrollEnd ");
        view.dispatchEvent(createEvent("scrollEnd", event));
      },
    });
    ani.start();
  }

  function slideCaptureTopEnd(event) {
    if (event.orientation !== "vertical") return;
    // 如果滚动到了底部 就不消费事件 return 出去
    // 如果没滚动到底部消费事件 并阻止事件向下传递
    if (isScrollToBottomEnd()) return;
    event.stopPropagation();
    // LOG('清除动画 滚动结束并产生速度 slideCaptureTopEnd', event.velocityY);
    dispatchScrollTopFlying(event.velocityY, event);
  }

  function dispatchScrollBottomFlying(velocity, event) {
    ani?.stop?.();
    ani = cAni({
      velocity,
      onanimation(v) {
        const moveY = Math.ceil(v * coefficient);
        if (moveY < 0) {
          doScrollBottom(moveY, event);
          if (isScrollToTopEnd()) {
            ani?.stop?.();
            LOG("滚动停止 到顶部停止");
            parent()?.$$?.scrollEvent?.dispatchScrollBottomFlying?.(v, event);
            // expose.parent?.dispatchScrollBottomFlying?.(v)
          }
        }
      },
      onanimationEnd(v) {
        LOG("滚动停止");
        view.dispatchEvent(createEvent("scrollEnd", event));
      },
    });
    ani.start();
  }

  function slideBottomEnd(event) {
    if (event.orientation !== "vertical") return;
    // 如果滚动到了顶部 就不消费事件 return 出去
    // 如果没滚动顶部 就去消费事件 并阻止事件向上冒泡
    if (isScrollToTopEnd()) return;
    event.stopPropagation();
    // LOG('清除动画 滚动结束并产生速度 slideBottomEnd', event.velocityY);
    dispatchScrollBottomFlying(event.velocityY, event);
  }

  function bindEvents() {
    scrollEl.addEventListener("slideTop", slideCaptureTop, { passive: true, capture: true });
    scrollEl.addEventListener("slideBottom", slideBottom, { passive: true, capture: false });
    scrollEl.addEventListener("slideTopEnd", slideCaptureTopEnd, { passive: true, capture: true });
    scrollEl.addEventListener("slideBottomEnd", slideBottomEnd, { passive: true, capture: false });
  }

  function destroy() {}

  return { bindEvents, destroy, dispatchScrollTopFlying, dispatchScrollBottomFlying };
}

function cAni(config = {}) {
  let time;
  const opt = {
    velocity: 0,
    deceleration: 0.04,
    onanimation: () => undefined,
    onanimationEnd: () => undefined,
    ...config,
  };
  let stopAction = false;

  const isReduce = opt.velocity < 0;

  function animaMinus() {
    if (stopAction) return cancelAnimationFrame(time);
    time = requestAnimationFrame(() => {
      if (stopAction) return cancelAnimationFrame(time);
      opt.velocity = Number((opt.velocity + opt.deceleration).toFixed(3));
      if (opt.velocity > 0) opt.velocity = 0;
      if (opt.velocity >= 0) {
        stop();
        opt.onanimationEnd(opt.velocity);
        return;
      }
      if (stopAction) return cancelAnimationFrame(time);
      // LOG('onanimation')
      opt.onanimation(opt.velocity);
      animaMinus();
    });
  }

  function animaAdd() {
    if (stopAction) return cancelAnimationFrame(time);
    time = requestAnimationFrame(() => {
      if (stopAction) return cancelAnimationFrame(time);
      opt.velocity = Number((opt.velocity - opt.deceleration).toFixed(3));
      if (opt.velocity < 0) opt.velocity = 0;
      if (opt.velocity <= 0) {
        stop();
        opt.onanimationEnd(opt.velocity);
        return;
      }
      if (stopAction) return cancelAnimationFrame(time);
      // LOG('onanimation')
      opt.onanimation(opt.velocity);
      animaAdd();
    });
  }

  function anima() {
    if (isReduce) animaMinus();
    else animaAdd();
  }

  function stop() {
    stopAction = true;
    cancelAnimationFrame(time);
  }

  function start() {
    stopAction = false;
    anima();
  }

  return { start, stop };
}
