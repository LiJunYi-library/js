import { camelCaseToKebabCase, assignStyle, convertToCamelCase, RainbowEvent } from "./utils";
import { treeAttrsChangeIMP } from "../base/imps/index.js";
import { animationDebounced } from "@rainbow_ljy/rainbow-js";

export class RainbowElement extends HTMLElement {
  static $registerProps(types) {
    const keys = [];
    const props = {};
    for (const key in types) {
      if (Object.prototype.hasOwnProperty.call(types, key)) {
        keys.push(key);
        if (types[key]?.default instanceof Function) props[key] = types[key].default(props);
        else props[key] = types[key]?.default;
      }
    }
    this.prototype.$types = types;
    this.prototype.$props = props;
    return keys;
  }

  IMPS = [treeAttrsChangeIMP];

  $ = {
    isInitAttrs: false,
    data: {},
    DATA: new Proxy({}, { get: (target, prop) => this.$.data[camelCaseToKebabCase(prop)] }),
    props: { ...this.constructor.prototype.$props },
    resolveFunCss: {
      calc: (v, ...arg) => {
        return v;
      },
    },
    resolveCss: (key, str = "") => {
      try {
        const isAttrFun = /r-attr\([^\)]*?\)/.test(str);
        if (isAttrFun) str = this.$.props[key];

        let cssVal = str.replace(/\d+px|\d+vw|\d+vh/g, (len) => {
          if (/\d+px/.test(len)) return Number(len.replaceAll("px", ""));
          if (/\d+vw/.test(len))
            return (Number(len.replaceAll("vw", "")) / 100) * window.innerWidth;
          if (/\d+vh/.test(len))
            return (Number(len.replaceAll("vh", "")) / 100) * window.innerHeight;
          return len;
        });

        const isFunstr = /([^\(]*?)\([^\)]*?\)/.test(cssVal);
        if (isFunstr) return eval(`this.$.resolveFunCss.${cssVal}`);

        let number = Number(cssVal);
        if (!isNaN(number)) return number;

        // console.log(key, cssVal, isFunstr);
        return cssVal;
      } catch (error) {
        console.log(error);

        return str;
      }
    },
    cache: {
      data: {},
      style: {},
      class: new Map(),
    },
    setStyle: (fmtStyle = () => ({})) => {
      let ftStyle = fmtStyle(this.$.data) || {};
      let newStyle = ftStyle;
      if (ftStyle instanceof Array) {
        newStyle = ftStyle.filter(Boolean).reduce((add, value) => {
          Object.assign(add, value);
          return add;
        }, {});
      }
      for (const key in newStyle) {
        if (Object.prototype.hasOwnProperty.call(newStyle, key)) {
          if (this.$.cache.style[key] !== newStyle[key]) {
            this.style[key] = "";
            this.style[key] = newStyle[key];
          }
          delete this.$.cache.style[key];
        }
      }
      for (const key in this.$.cache.style) {
        if (Object.prototype.hasOwnProperty.call(this.$.cache.style, key)) {
          this.style[key] = "";
        }
      }
      this.$.cache.style = newStyle;
    },
    setClass: (fmtClass = () => []) => {
      let newClass = fmtClass(this.$.data);
      if (newClass?.length === undefined) newClass = [newClass];
      newClass = newClass.filter(Boolean);
      let newMap = new Map();
      newClass.forEach((key) => {
        newMap.set(key, key);
        this.$.cache.class.delete(key);
        this.classList.add(key);
      });
      this.$.cache.class.forEach((key, v) => {
        this.classList.remove(key);
      });
      this.$.cache.class = newMap;
    },
    findParentByType: (name, p = this) => {
      if (!p) return;
      const parent = p.parentNode;
      if (!parent) return;
      const tName = parent.constructor.name;
      if (tName === name || parent.$elementName === name) return parent;
      return this.$.findParentByType(name, parent);
    },
    getOffsetTop: (p, num = 0) => {
      let offsetTop = this.offsetTop;
      let top = num + offsetTop;
      if (this.offsetParent === p) return top;
      return this.$.getOffsetTop(this.offsetParent, top);
    },
  };

  constructor(...arg) {
    super(...arg);
    this.IMPS.push(...(this.$onRegisterIMPS?.() || []));
    this.$debouncedRender = animationDebounced((...pop) => this.$render(...pop));
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.init?.call?.(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.$.props[name] = newValue;
    if (this.$.isInitAttrs === true) this.$onAttributeChanged(name, oldValue, newValue);
  }

  $onAttributeChanged() {
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.changeAttr?.call?.(this));
    this.$changePropsRender();
  }

  connectedCallback() {
    this.$.isInitAttrs = true;
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.connected?.call?.(this));
    this.$changePropsRender();
  }

  adoptedCallback() {
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.adopted?.call?.(this));
  }

  disconnectedCallback() {
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.disconnected?.call?.(this));
  }

  $changePropsRender(force) {
    let isChange = false;
    const css = {};
    const style = window.getComputedStyle(this);
    for (const key in this.$.props) {
      if (Object.prototype.hasOwnProperty.call(this.$.props, key)) {
        const cssVal = style.getPropertyValue("--" + key).trim();
        css[key] = this.$.resolveCss(key, cssVal);
        if (this.$.cache.data[key] !== css[key]) isChange = true;
      }
    }
    this.$.data = css;
    this.$.cache.data = css;
    // console.log(isChange);
    if (isChange || force === true) this.$debouncedRender(css);
    return css;
  }

  $onRegisterIMPS() {
    return [];
  }

  $render() {}
}
