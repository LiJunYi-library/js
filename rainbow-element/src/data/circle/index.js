import "./index.css";
import { RainbowElement, renderChildren } from "../../base/index.js";
import { arrayLoop, arrayLoopMap } from "@rainbow_ljy/rainbow-js";

export class RCircle extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-start-angle": String,
    "r-outer-radius": String,
    "r-inner-radius": String,
    'r-origin': String,
  });

  $$ = {
    value: 0,
    arcToClipPathRing: (
      x,
      y,
      outerRadius,
      innerRadius,
      startAngleDeg,
      endAngleDeg,
      anticlockwise = false,
    ) => {
      // 将度数转换为弧度
      const toRadians = (angle) => (angle * Math.PI) / 180;
      if (endAngleDeg !== startAngleDeg && (endAngleDeg - startAngleDeg + 360) % 360 === 0) {
        endAngleDeg = endAngleDeg - 0.001;
      }
      // 将起始和结束角度转换为弧度
      const startAngleRad = toRadians(startAngleDeg);
      const endAngleRad = toRadians(endAngleDeg);
      // 计算外圆的起始点和结束点的坐标
      const outerStartX = x + outerRadius * Math.cos(startAngleRad);
      const outerStartY = y + outerRadius * Math.sin(startAngleRad);
      const outerEndX = x + outerRadius * Math.cos(endAngleRad);
      const outerEndY = y + outerRadius * Math.sin(endAngleRad);
      // 计算内圆的起始点和结束点的坐标
      const innerStartX = x + innerRadius * Math.cos(startAngleRad);
      const innerStartY = y + innerRadius * Math.sin(startAngleRad);
      const innerEndX = x + innerRadius * Math.cos(endAngleRad);
      const innerEndY = y + innerRadius * Math.sin(endAngleRad);

      const angleDiff = (() => {
        if (endAngleDeg === startAngleDeg) return 0;
        let age = (endAngleDeg - startAngleDeg + 360) % 360;
        if (age === 0) return 360;
        return age;
      })(); // 确保角度差为正值
      const largeArcFlagOuter = angleDiff > 180 ? 1 : 0;
      const sweepFlagOuter = anticlockwise ? 0 : 1;

      const largeArcFlagInner = angleDiff <= 180 ? 0 : 1;
      const sweepFlagInner = anticlockwise ? 1 : 0; // 内圆的方向与外圆相反

      // 构建路径字符串
      const pathData = [
        `M ${outerStartX} ${outerStartY}`, // 移动画笔到外圆的起始点
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlagOuter} ${sweepFlagOuter} ${outerEndX} ${outerEndY}`, // 绘制外圆弧
        `L ${innerEndX} ${innerEndY}`, // 画一条直线到内圆的结束点
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlagInner} ${sweepFlagInner} ${innerStartX} ${innerStartY}`, // 绘制内圆弧
        `L ${outerStartX} ${outerStartY}`,
        "Z", // 关闭路径
      ].join(" ");

      return `path('${pathData}')`;
    },
  };

  get value() {
    return this.$$.value;
  }

  set value(v) {
    this.$$.value = v;
    this.$debouncedRender();
  }

  $render() {
    let { rStartAngle, rOuterRadius, rInnerRadius ,rOrigin} = this.$.DATA;
    if (rOuterRadius === "auto") {
      rOuterRadius = Math.min(this.offsetHeight, this.offsetWidth) / 2 || 0;
    }
    if (rInnerRadius === "auto") rInnerRadius = rOuterRadius - 2;

    console.log(rOrigin)

    this.style.clipPath = this.$$.arcToClipPathRing(
      100,
      100,
      rOuterRadius,
      rInnerRadius,
      rStartAngle,
      rStartAngle + this.value,
      false,
    );
  }
}

customElements.define("r-circle", RCircle);
