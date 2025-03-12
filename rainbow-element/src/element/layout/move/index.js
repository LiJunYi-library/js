import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { wipePX, isNum } from "../../../utils/index.js";

export class RMove extends RainbowElement {
  static observedAttributes = this.$registerProps({
    top: Number,
    bottom: Number,
    left: Number,
    right: Number,
    "r-move-border-left": Number,
    "r-move-border-right": Number,
    "r-move-border-top": Number,
    "r-move-border-bottom": Number,
    "r-adsorb-border-left": Number,
    "r-adsorb-border-right": Number,
    "r-adsorb-border-top": Number,
    "r-adsorb-border-bottom": Number,
    "r-adsorb": String, // left top bottom right horizontal vertical nearby nook
  });

  $$ = {
    caches: {
      x: 0,
      y: 0,
    },
    startTouche: {},
    onTouchstart: (event) => {
      this.$$.startTouche = event.touches?.[0];
      event.stopPropagation();
      const style = window.getComputedStyle(this);
      this.$$.caches.x = wipePX(style.getPropertyValue("left").trim());
      this.$$.caches.y = wipePX(style.getPropertyValue("top").trim());
      this.style.transition = "none";
    },
    onTouchmove: (event) => {
      event.stopPropagation();
      const { rMoveBorderLeft, rMoveBorderTop, rMoveBorderRight, rMoveBorderBottom } = this.$.DATA;
      const touche = event.touches?.[0];
      const maxX = this.parentNode.offsetWidth - this.offsetWidth - rMoveBorderRight;
      const maxH = this.parentNode.offsetHeight - this.offsetHeight - rMoveBorderBottom;
      let x = touche.clientX - this.$$.startTouche.clientX + this.$$.caches.x;
      let y = touche.clientY - this.$$.startTouche.clientY + this.$$.caches.y;
      if (isNum(rMoveBorderRight)) if (x > maxX) x = maxX;
      if (isNum(rMoveBorderLeft)) if (x < rMoveBorderLeft) x = rMoveBorderLeft;
      if (isNum(rMoveBorderBottom)) if (y > maxH) y = maxH;
      if (isNum(rMoveBorderTop)) if (y < rMoveBorderTop) y = rMoveBorderTop;
      this.style.left = `${x}px`;
      this.style.top = `${y}px`;
      this.style.bottom = "auto";
      this.style.right = "auto";
    },
    onTouchend: (event) => {
      event.stopPropagation();
      const style = window.getComputedStyle(this);
      let left = wipePX(style.getPropertyValue("left").trim());
      let top = wipePX(style.getPropertyValue("top").trim());
      const {
        rAdsorbBorderLeft,
        rAdsorbBorderTop,
        rAdsorbBorderRight,
        rAdsorbBorderBottom,
        rAdsorb,
      } = this.$.DATA;
      let x = rAdsorbBorderLeft || 0;
      let y = rAdsorbBorderTop || 0;
      const maxX = this.parentNode.offsetWidth - this.offsetWidth - (rAdsorbBorderRight || 0);
      const maxH = this.parentNode.offsetHeight - this.offsetHeight - (rAdsorbBorderBottom || 0);
      let right = this.parentNode.offsetWidth - left - this.offsetWidth;
      let bottom = this.parentNode.offsetHeight - top - this.offsetHeight;
      if (rAdsorb) this.$$.adsorb[rAdsorb]({ x, y, maxX, maxH, left, top, right, bottom });
    },
    adsorb: {
      com: () => {
        this.style.transition = "0.2s";
      },
      left: ({ x }) => {
        this.style.left = `${x}px`;
        this.$$.adsorb.com();
      },
      right: ({ maxX }) => {
        this.style.left = `${maxX}px`;
        this.$$.adsorb.com();
      },
      horizontal: ({ x, maxX, left }) => {
        if (left + this.offsetWidth / 2 > this.parentNode.offsetWidth / 2) x = maxX;
        this.style.left = `${x}px`;
        this.$$.adsorb.com();
      },
      top: ({ y }) => {
        this.style.top = `${y}px`;
        this.$$.adsorb.com();
      },
      bottom: ({ maxH }) => {
        this.style.top = `${maxH}px`;
        this.$$.adsorb.com();
      },
      vertical: ({ y, maxH, top }) => {
        if (top + this.offsetHeight / 2 > this.parentNode.offsetHeight / 2) y = maxH;
        this.style.top = `${y}px`;
        this.$$.adsorb.com();
      },
      nook: ({ y, maxH, top, x, maxX, left }) => {
        if (left + this.offsetWidth / 2 > this.parentNode.offsetWidth / 2) x = maxX;
        if (top + this.offsetHeight / 2 > this.parentNode.offsetHeight / 2) y = maxH;
        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
        this.$$.adsorb.com();
      },
      nearby: ({ y, maxH, top, x, maxX, left, right, bottom }) => {
        let min = Math.min(left, right, bottom, top);
        if (left === min) this.style.left = `${x}px`;
        if (right === min) this.style.left = `${maxX}px`;
        if (top === min) this.style.top = `${y}px`;
        if (bottom === min) this.style.top = `${maxH}px`;
        this.$$.adsorb.com();
      },
    },
  };

  constructor(...arg) {
    super(...arg);
    this.addEventListener("touchstart", this.$$.onTouchstart);
    this.addEventListener("touchmove", this.$$.onTouchmove);
    this.addEventListener("touchend", this.$$.onTouchend);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
