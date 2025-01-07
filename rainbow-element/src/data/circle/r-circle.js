import { RainbowElement } from "../../base/index.js";
import { resizeObserverIMP } from "../../base/imps/index.js";

export class RCircle extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-start-angle": String,
    "r-outer-radius": String,
    "r-inner-radius": String,
    "r-origin-x": String,
    "r-origin-y": String,
    "r-stroke-width": String,
    "r-layer-stroke-width": String,
    "r-direction": String, // clockwise anticlockwise
    "r-range-max": String,
    "r-range-min": String,
  });

  $onRegisterIMPS() {
    return [resizeObserverIMP()];
  }

  $slotContainer = {
    default: document.createElement("div"),
  };

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$.borderDiv.classList.add("r-circle-border");
    this.$$.layerDiv.classList.add("r-circle-layer");
    this.$slotContainer.default.classList.add("r-circle-content");
    this.$.append(this.$$.layerDiv);
    this.$.append(this.$$.borderDiv);
    this.$.append(this.$slotContainer.default);
  }

  $$ = {
    borderDiv: document.createElement("div"),
    layerDiv: document.createElement("div"),
    value: 0,
    toRadians: (angle) => (angle * Math.PI) / 180,
    getAngleDiff: (startAng, endAng) => {
      if (endAng === startAng) return 0;
      let age = (endAng - startAng + 360) % 360;
      if (age === 0) return 360;
      return age;
    },
    clockwise: {
      anglePosition: (ang, x, y, radius) => {
        const angle = this.$$.toRadians(ang);
        return { angle, x: x + radius * Math.cos(angle), y: y + radius * Math.sin(angle) };
      },
      arcTo: (x, y, radius, startAng, endAng, backward = false) => {
        if (endAng !== startAng && (endAng - startAng + 360) % 360 === 0) endAng = endAng - 0.001;
        const start = this.$$.clockwise.anglePosition(startAng, x, y, radius);
        const end = this.$$.clockwise.anglePosition(endAng, x, y, radius);
        const angleDiff = this.$$.getAngleDiff(startAng, endAng);
        const largeArcFlag = angleDiff > 180 ? 1 : 0;
        if (backward) return { start: end, end: start, largeArcFlag, sweepFlag: 0 };
        return { start, end, largeArcFlag, sweepFlag: 1 };
      },
    },
    anticlockwise: {
      anglePosition: (ang, x, y, radius) => {
        const angle = this.$$.toRadians(ang);
        return { angle, x: x + radius * Math.sin(angle), y: y + radius * Math.cos(angle) };
      },
      arcTo: (x, y, radius, startAng, endAng, backward = false) => {
        if (endAng !== startAng && (endAng - startAng + 360) % 360 === 0) endAng = endAng - 0.001;
        const start = this.$$.anticlockwise.anglePosition(startAng, x, y, radius);
        const end = this.$$.anticlockwise.anglePosition(endAng, x, y, radius);
        const angleDiff = this.$$.getAngleDiff(startAng, endAng);
        const largeArcFlag = angleDiff > 180 ? 1 : 0;
        if (backward) return { start: end, end: start, largeArcFlag, sweepFlag: 1 };
        return { start, end, largeArcFlag, sweepFlag: 0 };
      },
    },
    arcTo: (x, y, radius, startAng, endAng, backward, type) => {
      if (type) return this.$$[type].arcTo(x, y, radius, startAng, endAng, backward);
      return this.$$.clockwise.arcTo(x, y, radius, startAng, endAng, backward);
    },
    getRangeValue: (min, max) => {
      if (typeof this.value === "string" && /\d+?%/.test(this.value)) {
        return (parseInt(this.value.replace(/%/, ""), 10) / 100) * 360;
      }
      if (typeof min !== "number" || typeof max !== "number") return this.value;
      let val = this.value;
      if (this.value < min) val = min;
      if (this.value > max) val = max;
      return (val / (max - min)) * 360;
    },
    getAnnulusPath: (x, y, outerRadius, innerRadius, startAng, endAng, type) => {
      const out = this.$$.arcTo(x, y, outerRadius, startAng, endAng, false, type);
      const inner = this.$$.arcTo(x, y, innerRadius, startAng, endAng, true, type);
      const pathData = [
        `M ${out.start.x} ${out.start.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${out.largeArcFlag} ${out.sweepFlag} ${out.end.x} ${out.end.y}`,
        `L ${inner.start.x} ${inner.start.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${inner.largeArcFlag} ${inner.sweepFlag} ${inner.end.x} ${inner.end.y}`,
        `L ${out.start.x} ${out.start.y}`,
        "Z",
      ].join(" ");
      return `path('${pathData}')`;
    },
    getcirclePath: (x, y, radius, startAng, endAng, type) => {
      const out = this.$$.arcTo(x, y, radius, startAng, endAng, false, type);
      const pathData = [
        `M ${out.start.x} ${out.start.y}`,
        `A ${radius} ${radius} 0 ${out.largeArcFlag} ${out.sweepFlag} ${out.end.x} ${out.end.y}`,
        "Z",
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
    let {
      rStartAngle,
      rOuterRadius,
      rInnerRadius,
      rOriginX,
      rOriginY,
      rStrokeWidth,
      rDirection,
      rLayerStrokeWidth,
      rRangeMin,
      rRangeMax,
    } = this.$.DATA;
    if (rOuterRadius === "auto") rOuterRadius = Math.min(this.offsetHeight, this.offsetWidth) / 2;
    if (rInnerRadius === "auto") rInnerRadius = rOuterRadius;
    if (!rOuterRadius) rOuterRadius = 0;
    if (!rInnerRadius) rInnerRadius = 0;
    rOriginX = this.$.resolvePercentum(rOriginX);
    rOriginY = this.$.resolvePercentumH(rOriginY);

    this.$$.borderDiv.style.clipPath = this.$$.getAnnulusPath(
      rOriginX,
      rOriginY,
      rOuterRadius - rLayerStrokeWidth,
      rInnerRadius - rStrokeWidth - rLayerStrokeWidth,
      rStartAngle,
      rStartAngle + this.$$.getRangeValue(rRangeMin, rRangeMax),
      rDirection,
    );

    this.$$.layerDiv.style.clipPath = this.$$.getAnnulusPath(
      rOriginX,
      rOriginY,
      rOuterRadius,
      rInnerRadius - rLayerStrokeWidth - rStrokeWidth - rLayerStrokeWidth,
      rStartAngle,
      rStartAngle + 360,
      rDirection,
    );

    this.$slotContainer.default.style.clipPath = this.$$.getcirclePath(
      rOriginX,
      rOriginY,
      rInnerRadius - rLayerStrokeWidth - rStrokeWidth - rLayerStrokeWidth,
      rStartAngle,
      rStartAngle + 360,
      rDirection,
    );
  }
}

customElements.define("r-circle", RCircle);
