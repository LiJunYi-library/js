import { RainbowElement } from "../../base/index.js";
import { resizeObserverIMP } from "../../base/imps/index.js";
{/* <div class="van-circle" style="width: 100px; height: 100px;">
  <svg viewBox="0 0 1040 1040">
    <path d="M 520 520 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000"
    class="van-circle__hover"
    style="fill: none; stroke: rgb(255, 255, 255); stroke-width: 40px;"></path>
    <path d="M 520 520 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000"
    stroke="#1989fa" class="van-circle__layer" style="stroke: rgb(25, 137, 250); stroke-width: 41px; s
    troke-dasharray: 2198px, 3140px;"></path>
    </svg>
    <div class="van-circle__text">70%</div>
    </div> */}
export class RSvgCircle extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-start-angle": String,
    "r-outer-radius": String,
    "r-inner-radius": String,
    "r-origin-x": String,
    "r-origin-y": String,
  });

  $onRegisterIMPS() {
    return [resizeObserverIMP()];
  }

  $$ = {
    value: 0,
  };

  get value() {
    return this.$$.value;
  }

  set value(v) {
    this.$$.value = v;
    this.$debouncedRender();
  }

  $render() {
    // let { rStartAngle, rOuterRadius, rInnerRadius, rOriginX, rOriginY } = this.$.DATA;
    // if (rOuterRadius === "auto") {
    //   rOuterRadius = Math.min(this.offsetHeight, this.offsetWidth) / 2 || 0;
    // }
    // if (rInnerRadius === "auto") rInnerRadius = rOuterRadius - 2;
    // rOriginX = this.$.resolvePercentum(rOriginX);
    // rOriginY = this.$.resolvePercentumH(rOriginY);
    // let args = [
    //   rOriginX,
    //   rOriginY,
    //   rOuterRadius,
    //   rInnerRadius,
    //   rStartAngle,
    //   rStartAngle + this.value,
    //   false,
    // ];
    // console.log(args);
    // this.style.clipPath = this.$$.arcToClipPathRing(...args);
  }
}


