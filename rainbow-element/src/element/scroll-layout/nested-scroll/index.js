import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { createCustomEvent, findParentByLocalName } from "../../../utils/index";
import { usePointerScroll } from "../../../events/index.js";
import { createSpeedAnimation } from "../../../animation/index.js";
const LOG = (...arg) => console.log(...arg);

export class RNestedScroll extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-scroll-direction": String,
  });

  get $$isScrollToBottomEnd() {
    return Math.round(this.scrollTop + this.offsetHeight) >= this.scrollHeight;
  }

  get $$isScrollToTopEnd() {
    return this.scrollTop <= 0;
  }

  $$ = {
    nestedChild: undefined,
    nestedChildren: [],
    nestedParent: undefined,
    flyingAni: undefined,
    coefficient: 15,
    disabledScroll: () => {},
    dispatchWheel: () => {},
    onWheel: (event) => {
      console.log("onWheel");
      if (event.deltaY > 0) return;
      if (this.$$isScrollToTopEnd) return;
      event.stopPropagation();
      event.preventDefault();
      this.scrollTop = event.deltaY + this.scrollTop;
      this.dispatchEvent(createCustomEvent("scroll", event));
    },
    onCaptureWheel: (event) => {
      console.log("onCaptureWheel");
      if (event.deltaY < 0) return;
      if (this.$$isScrollToBottomEnd) return;
      event.stopPropagation();
      event.preventDefault();
      this.scrollTop = event.deltaY + this.scrollTop;
    },
    onWheelUp: (event) => {},
    onWheelDown: (event) => {},
    onCapturePointerdown: (event) => {
      event.preventDefault();
      this.$$.flyingAni?.stop?.();
      this.$$.capturePointer.start(event);
      // console.log(event.orientation);
      console.log("onCapturePointerdown");
    },
    onCapturePointermove: (event) => {
      event.preventDefault();
      console.log(this.className, event, this.$$isScrollToBottomEnd);
      this.$$.capturePointer.move(event);
    },
    onCapturePointerup: (event) => {
      event.preventDefault();
      this.$$.capturePointer.end(event);
    },
    doScrollTopFlying: (event, velocity) => {
      const moveY = Math.ceil(velocity * this.$$.coefficient);
      if (moveY <= 0) return;
      this.scrollTop = moveY + this.scrollTop;
      if (this.$$isScrollToBottomEnd) {
        this.$$.flyingAni?.stop?.();
        this.$$.nestedChild?.$$?.dispatchScrollTopFlying?.(event, velocity);
      }
    },
    doScrollTopFlyingEnd: (event, velocity) => {},
    dispatchScrollTopFlying: (event, velocity) => {
      this.$$.flyingAni?.stop?.();
      this.$$.flyingAni = createSpeedAnimation({
        velocity,
        onanimation: (v) => this.$$.doScrollTopFlying(event, v),
        onanimationEnd: (v) => this.$$.doScrollTopFlyingEnd(event, v),
        // onanimation: (v) => {
        //   console.log("onanimation");
        //   const moveY = Math.ceil(v * coefficient);
        //   if (moveY <= 0) return;
        //   this.scrollTop = moveY + this.scrollTop;
        //   // if (moveY > 0) {
        //   //   // this.scrollTop = moveY + this.scrollTop;
        //   //   // doScrollTop(moveY, event);
        //   //   // if (isScrollToBottomEnd()) {
        //   //   //   ani?.stop?.();
        //   //   //   LOG("滚动停止 到底停止");
        //   //   //   // view.$$.nestedChild?.$$?.scrollEvent?.dispatchScrollTopFlying?.(v, event);
        //   //   // }
        //   // }
        // },
        // onanimationEnd(v) {
        //   LOG("滚动停止 scrollEnd ");
        //   // view.dispatchEvent(createEvent("scrollEnd", event));
        // },
      });
      this.$$.flyingAni.start();
    },
    capturePointer: usePointerScroll({
      onMoveTop: (event) => {
        // 如果滚动到了顶部 就不消费事件 return 出去
        // console.log(this.className, event, this.$$isScrollToBottomEnd);
        if (this.$$isScrollToBottomEnd) return;
        // 如果没滚动顶部 就去消费事件 并阻止事件向上冒泡
        event.stopPropagation();
        // console.log(this.className);
        this.scrollTop = event.moveY + this.scrollTop;
      },
      onEndTop: (event) => {
        this.$$.dispatchScrollTopFlying(event, event.velocityY);
      },
      onMoveBottom: (event) => {
        this.scrollTop = event.moveY + this.scrollTop;
      },
      onEndBottom: (event) => {
        const coefficient = 15;
        this.$$.flyingAni?.stop?.();
        this.$$.flyingAni = createSpeedAnimation({
          velocity: event.velocityY,
          onanimation: (v) => {
            const moveY = Math.ceil(v * coefficient);
            if (moveY >= 0) return;
            this.scrollTop = moveY + this.scrollTop;
            if (this.$$isScrollToTopEnd) {
              this.$$.flyingAni?.stop?.();
            }
            // if (moveY < 0) {
            //   doScrollBottom(moveY, event);
            //   if (isScrollToTopEnd()) {
            //     ani?.stop?.();
            //     LOG("滚动停止 到顶部停止");
            //     parent()?.$$?.scrollEvent?.dispatchScrollBottomFlying?.(v, event);
            //     // expose.parent?.dispatchScrollBottomFlying?.(v)
            //   }
            // }
          },
          onanimationEnd(v) {
            LOG("滚动停止 scrollEnd ");
            // view.dispatchEvent(createEvent("scrollEnd", event));
          },
        });
        this.$$.flyingAni.start();
      },
    }),
  };

  isVerdict = false;

  constructor(...arg) {
    super(...arg);
    const opt = (c) => ({ passive: false, capture: true, ...c });
    this.addEventListener("wheel", this.$$.onCaptureWheel, opt());
    this.addEventListener("wheel", this.$$.onWheel, opt({ capture: false }));

    //
    this.addEventListener("pointerdown", this.$$.onCapturePointerdown, opt());
    this.addEventListener("pointermove", this.$$.onCapturePointermove, opt());
    this.addEventListener("pointerup", this.$$.onCapturePointerup, opt());
    this.addEventListener("touchstart", (event) => {});
    this.addEventListener("touchmove", (eeee) => {});
    this.addEventListener("touchend", (event) => {});
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.nestedParent = findParentByLocalName("r-nested-scroll", this);
    if (this.$$.nestedParent) this.$$.nestedParent.$$.nestedChild = this;
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
