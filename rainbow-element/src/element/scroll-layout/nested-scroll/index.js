import "./index.css";
import { RainbowElement, createCustomEvent } from "../../base/index.js";
import { extendedSlideEvents } from "../../events/slide.js";
import { inheritSlideEvent } from "../../events/scroll.js";
import { arrayRemove, arrayWipeRepetition } from "@rainbow_ljy/rainbow-js";
const LOG = (...arg) => console.log(...arg);

export class RNestedScroll extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-scroll-direction": String,
  });


  $$ = {
    nestedChild: undefined,
    nestedChildren: [],
    nestedParent: undefined,
    setNestedChild: () => {
      if (this.$$.nestedChildren.length === 1) {
        this.$$.nestedChild = this.$$.nestedChildren[0];
        return;
      }
      if (!this.$$.nestedChildren.length) return;
      const mOffset = this.getBoundingClientRect();
      // console.log(mOffset);
      //   this.$$.nestedChildren.forEach(element => {
      //     const offset = element.getBoundingClientRect()
      //    console.log(offset);
      //  });
      this.$$.nestedChild = this.$$.nestedChildren.find((ele) => {
        const offset = ele.getBoundingClientRect();
        return offset.left - mOffset.left >= -1 && offset.right <= mOffset.right + 1;
      });

      // console.log( "this.$$.nestedChild");
      // console.log( this.$$.nestedChild);
    },

    captureOptions: { passive: false, capture: true },
    slideEvent: extendedSlideEvents(this, {
      // direction: ["top", "bottom"],
      // customEventName: "scroll",
    }),
    scrollEvent: setup({
      scrollEl: this,
      container: this,
    }),
    disabledScroll: () => {},
    unDisabledScroll: () => {},
    pointerdown: (event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      console.log('--pointerdown')
    },
    pointermove: (event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      console.log('--pointermove')
    },
    touchstart: (event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      console.log('--touchstart')
    },
    touchmove: (event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      console.log('--touchmove')
    },
  };

  constructor(...arg) {
    super(...arg);
    const opt = { passive: true, capture: true };
    this.addEventListener("pointerdown", this.$$.pointerdown, opt);
    this.addEventListener("pointermove", this.$$.pointermove, opt);
    this.addEventListener('touchstart', this.$$.touchstart, opt);
    this.addEventListener('touchmove', this.$$.touchmove, opt);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$.appendChild(this.$slotContainer.default);
    this.$$.nestedParent = this.$.findParentByLocalName(["r-nested-scroll"]);
    if (this.$$.nestedParent) this.$$.nestedParent.$$.nestedChildren.push(this);
    this.$$.setNestedChild();
    this.$slotContainer.default.classList.add("r-nested-scroll-content");
    this.classList.add("r-nested-scroll");
    this.$$.slideEvent.bindEvents();
    this.$$.scrollEvent.bindEvents();
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
    if (this.$$.nestedParent) arrayRemove(this.$$.nestedParent.$$.nestedChildren, this);
    this.$$.slideEvent.destroy();
    this.$$.scrollEvent.destroy();
  }

  // append(...nodes) {
  //   // console.log("append");
  //   nodes.forEach((node, index) => {
  //     if (this.$._getSC(node)) return this.$._getSC(node)?.append?.(node);
  //     if (this === this.$slotContainer.default) return super.append?.(node);
  //     this.$slotContainer.default?.append?.(node);
  //   });
  // }

  // appendChild(node) {
  //   // console.log("appendChild");
  //   if (this.$._getSC(node)) return this.$._getSC(node)?.appendChild?.(node);
  //   if (this === this.$slotContainer.default) return super.appendChild?.(node);
  //   return this.$slotContainer.default?.appendChild?.(node);
  // }

  // insertBefore(node, child) {
  //   // console.log("insertBefore");
  //   if (this.$._getSC(node)) return this.$._getSC(node)?.insertBefore?.(node, child);
  //   if (this === this.$slotContainer.default) return super.insertBefore?.(node, child);
  //   return this.$slotContainer.default.insertBefore?.(node, child);
  // }

  // removeChild(child) {
  //   // console.log("removeChild");
  //   if (this.$._getSC(child)) return this.$._getSC(child)?.removeChild?.(child);
  //   if (this === this.$slotContainer.default) return super.removeChild?.(child);
  //   return this.$slotContainer.default.removeChild?.(child);
  // }
}

function setup(props) {
  const { scrollEl, container, view = scrollEl } = props;
  let ani;
  let adsorbAni;
  const coefficient = 20;
  let isScrollToBottomEnd = () =>
    scrollEl.offsetHeight + Math.ceil(scrollEl.scrollTop) >= container.offsetHeight;
  let isScrollToTopEnd = () => scrollEl.scrollTop <= 0;
  let maxScrollTop = () => container.offsetHeight - scrollEl.offsetHeight;
  let isScrollRightEnd = () => scrollEl.offsetWidth + scrollEl.scrollLeft >= container.offsetWidth;
  let isScrollLeftEnd = () => scrollEl.scrollLeft <= 0;
  let maxScrollLeft = () => container.offsetWidth - scrollEl.offsetWidth;

  let parent = () => view.$.findParentByLocalName(["r-nested-scroll"]);

  let rollingConflict = (event, orientation = "vertical") => {
    let conflict = event.srcViews.every((el) => el.$.DATA.rScrollDirection === orientation);
    if (!conflict && event.orientation !== orientation) return true;
    return false;
  };

  function slideCaptureTop(event) {
    if (rollingConflict(event, "vertical")) return;
    // 如果滚动到了底部 就不消费事件 return 出去
    // 如果没滚动到底部消费事件 并阻止事件向下传递
    // console.log(view.className, isScrollToBottomEnd());
    if (isScrollToBottomEnd()) return;
    event.stopPropagation();
    doScrollTop(event.moveY, event);
  }

  function slideBottom(event) {
    if (rollingConflict(event, "vertical")) return;
    // 如果滚动到了顶部 就不消费事件 return 出去
    // 如果没滚动顶部 就去消费事件 并阻止事件向上冒泡
    if (isScrollToTopEnd()) return;
    event.stopPropagation();
    doScrollBottom(event.moveY);
  }

  function slideCaptureTopEnd(event) {
    if (rollingConflict(event, "vertical")) return;
    // 如果滚动到了底部 就不消费事件 return 出去
    // 如果没滚动到底部消费事件 并阻止事件向下传递
    if (isScrollToBottomEnd()) return;
    event.stopPropagation();
    // LOG('清除动画 滚动结束并产生速度 slideCaptureTopEnd', event.velocityY);
    dispatchScrollTopFlying(event.velocityY, event);
  }

  function slideBottomEnd(event) {
    if (rollingConflict(event, "vertical")) return;
    // 如果滚动到了顶部 就不消费事件 return 出去
    // 如果没滚动顶部 就去消费事件 并阻止事件向上冒泡
    if (isScrollToTopEnd()) return;
    event.stopPropagation();
    // LOG('清除动画 滚动结束并产生速度 slideBottomEnd', event.velocityY);
    dispatchScrollBottomFlying(event.velocityY, event);
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
            view.$$.nestedChild?.$$?.scrollEvent?.dispatchScrollTopFlying?.(v, event);
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

  function slideLeft(event) {
    if (event.orientation !== "horizontal") return;
    // 如果没有滚动到了最右边 就不消费事件 return 出去
    // 如果滚动到了最右边 就去消费事件 并阻止事件向上冒泡
    if (isScrollRightEnd()) return;
    event.stopPropagation();

    let scrollLeft = scrollEl.scrollLeft + event.moveX;
    if (scrollLeft > maxScrollLeft()) scrollLeft = maxScrollLeft() + 2;
    scrollEl.scrollLeft = scrollLeft;
    view.$$.setNestedChild();
  }

  function slideRight(event) {
    if (event.orientation !== "horizontal") return;
    // 如果没有滚动到了最左边 就不消费事件 return 出去
    // 如果滚动到了最左边 就去消费事件 并阻止事件向上冒泡
    if (isScrollLeftEnd()) return;
    event.stopPropagation();

    let scrollLeft = scrollEl.scrollLeft + event.moveX;
    if (scrollLeft < 0) scrollLeft = 0;
    scrollEl.scrollLeft = scrollLeft;
    view.$$.setNestedChild();
  }

  function slideLeftEnd(event) {
    slideLeftRightEnd(event);
  }

  function slideRightEnd(event) {
    slideLeftRightEnd(event);
  }

  function slideLeftRightEnd(event) {
    if (event.orientation !== "horizontal") return;
    if (isScrollRightEnd()) return;
    if (isScrollLeftEnd()) return;
    event.stopPropagation();

    const from = scrollEl.scrollLeft;
    const index = Math.floor(from / scrollEl.offsetWidth);
    const roundIndex = Math.round(from / scrollEl.offsetWidth);
    let adsIndex = roundIndex;
    if (event.velocityX > 0.4) adsIndex = index + 1;
    if (event.velocityX < -0.4) adsIndex = index;
    console.log(index, roundIndex);
    const to = scrollEl.offsetWidth * adsIndex;
    adsorbAni = Animation({
      from: from,
      to: to,
      avg: 30,
      onanimation(aLeft) {
        scrollEl.scrollLeft = aLeft;
        view.$$.setNestedChild();
      },
      onanimationend() {
        //   expose.index = index;
        //   if (parent) parent.child = expose?.children?.[expose.index];
        //   props.listHook?.updateIndex?.(expose.index);
      },
    });
    adsorbAni.start();
  }

  function bindEvents() {
    const { rScrollDirection } = scrollEl.$.DATA;
    const bubble = { passive: true, capture: false };
    const capture = { passive: true, capture: true };
    console.log("rScrollDirection", rScrollDirection);

    if (rScrollDirection === "vertical") {
      scrollEl.addEventListener("slideTop", slideCaptureTop, capture);
      scrollEl.addEventListener("slideBottom", slideBottom, bubble);
      scrollEl.addEventListener("slideTopEnd", slideCaptureTopEnd, capture);
      scrollEl.addEventListener("slideBottomEnd", slideBottomEnd, bubble);
    }

    if (rScrollDirection === "horizontal") {
      scrollEl.addEventListener("slideLeft", slideLeft, bubble);
      scrollEl.addEventListener("slideRight", slideRight, bubble);
      scrollEl.addEventListener("slideLeftEnd", slideLeftEnd, bubble);
      scrollEl.addEventListener("slideRightEnd", slideRightEnd, bubble);
    }
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
    ...config,
  };
  let value = opt.from;

  function flash() {
    if (opt.from < opt.to) {
      value = value + opt.avg;
      if (value >= opt.to) value = opt.to;
      opt.onanimation(value);
      if (value >= opt.to) {
        opt.onanimationend(value);
        stop();
        return;
      }
    }

    if (opt.from > opt.to) {
      value = value - opt.avg;
      if (value <= opt.to) value = opt.to;
      opt.onanimation(value);
      if (value <= opt.to) {
        opt.onanimationend(value);
        stop();
        return;
      }
    }
  }

  function start() {
    if (stopAction) return cancelAnimationFrame(timer);
    timer = requestAnimationFrame(() => {
      if (stopAction) return cancelAnimationFrame(timer);
      flash();
      start();
    });
  }

  function stop() {
    stopAction = true;
    cancelAnimationFrame(timer);
  }

  return { start, stop };
}
