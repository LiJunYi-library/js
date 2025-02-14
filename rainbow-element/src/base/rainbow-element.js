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
    self: this,
    getSlotContainer: (node) => {
      const soltName = node?.getAttribute?.("solt");
      if (!soltName) return undefined;
      const container = this.$slotContainer?.[soltName];
      return container;
    },
    _getSC: (...arg) => this.$.getSlotContainer(...arg),
    renderSolt: (node) => {
      if (["r-template", "template"].includes(node.localName)) {
        const soltName = node.getAttribute("solt");
        this.$slotContainer?.[soltName]?.append(node);
        return node;
      }
      return false;
    },
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
        const isAttrFun = /r-attr\([^\)]*?\)/.test(str); //如果是r-attr 使用属性参数
        if (isAttrFun) str = this.$.props[key];
        // 解析px  vw vh
        let cssVal = str.replace(/\d+px|\d+vw|\d+vh/g, (len) => {
          if (/\d+px/.test(len)) return Number(len.replaceAll("px", ""));
          if (/\d+vw/.test(len))
            return (Number(len.replaceAll("vw", "")) / 100) * window.innerWidth;
          if (/\d+vh/.test(len))
            return (Number(len.replaceAll("vh", "")) / 100) * window.innerHeight;
          return len;
        });
        // 如果是方法
        if (/([^\(]*?)\([^\)]*?\)/.test(cssVal)) {
          return eval(`this.$.resolveFunCss.${cssVal}`);
        }
        // 如果可以转换成数字
        let number = Number(cssVal);
        if (!isNaN(number)) return number;
        // 如果可以转换成数组
        if (/.*?,.*?/.test(cssVal)) return cssVal.trim().split(",").filter(Boolean);
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
    resolvePercentum: (v = "", node = this, fmt = (node) => node.offsetWidth) => {
      if (/\d+?%/.test(v)) return fmt(node) * (v.replaceAll("%", "") / 100);
      return v;
    },
    resolvePercentumH: (v, node, fmt = (node) => node.offsetHeight) => {
      return this.$.resolvePercentum(v, node, fmt);
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
    findParentByLocalName: (name, p = this) => {
      if (!p) return;
      const parent = p.parentNode;
      if (!parent) return;
      if (name instanceof Array && name.includes(parent.localName)) return parent;
      if (parent.localName === name) return parent;
      return this.$.findParentByLocalName(name, parent);
    },
    findChildByLocalName: (name, c = this) => {
      if (!c) return;
      const child = c.getElementsByTagName(name);
      return child;
    },
    getOffsetTop: (p, num = 0) => {
      if (this.offsetParent === p) return num;
      let offsetTop = this.offsetTop;
      let top = num + offsetTop;
      return this.$.getOffsetTop(this.offsetParent, top);
    },
    isAnimation: false,
    transitionrun: () => {
      this.$.isAnimation = true;
    },
    transitioncancel: () => {
      this.$.isAnimation = false;
    },
    transitionend: () => {
      this.$.isAnimation = false;
    },
    changePropsRender: (force) => {
      if (this.$.isAnimation) return;
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
    },
    append: (...nodes) => {
      return super.append(...nodes);
    },
    appendChild: (...nodes) => {
      return super.appendChild(...nodes);
    },
    insertBefore: (...nodes) => {
      return super.insertBefore(...nodes);
    },
    removeChild: (...nodes) => {
      return super.removeChild(...nodes);
    },
  };

  constructor(...arg) {
    super(...arg);
    this.IMPS.push(...(this.$onRegisterIMPS?.() || []));
    this.$debouncedRender = animationDebounced((...pop) => this.$render(...pop));
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.init?.call?.(this));
    this.addEventListener("transitionrun", this.$.transitionrun);
    this.addEventListener("transitioncancel", this.$.transitioncancel);
    this.addEventListener("transitionend", this.$.transitionend);
  }

  $slotContainer = {
    default: this,
  };

  append(...nodes) {
    console.log("append");
    nodes.forEach((node, index) => {
      if (this.$._getSC(node)) return this.$._getSC(node)?.append?.(node);
      if (this === this.$slotContainer.default) return super.append?.(node);
      this.$slotContainer.default?.append?.(node);
    });
  }

  appendChild(node) {
    console.log("appendChild");
    if (this.$._getSC(node)) return this.$._getSC(node)?.appendChild?.(node);
    if (this === this.$slotContainer.default) return super.appendChild?.(node);
    return this.$slotContainer.default?.appendChild?.(node);
  }

  insertBefore(node, child) {
    console.log("insertBefore");
    if (this.$._getSC(node)) return this.$._getSC(node)?.insertBefore?.(node, child);
    if (this === this.$slotContainer.default) return super.insertBefore?.(node, child);
    return this.$slotContainer.default.insertBefore?.(node, child);
  }

  removeChild(child) {
    console.log("removeChild");
    if (this.$._getSC(child)) return this.$._getSC(child)?.removeChild?.(child);
    if (this === this.$slotContainer.default) return super.removeChild?.(child);
    return this.$slotContainer.default.removeChild?.(child);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.$.props[name] = newValue;
    if (this.$.isInitAttrs === true) this.$onAttributeChanged(name, oldValue, newValue);
  }

  $onAttributeChanged() {
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.changeAttr?.call?.(this));
    this.$.changePropsRender();
  }

  connectedCallback() {
    this.$.isInitAttrs = true;
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.connected?.call?.(this));
    this.$.changePropsRender();
  }

  adoptedCallback() {
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.adopted?.call?.(this));
  }

  disconnectedCallback() {
    this.removeEventListener("transitionrun", this.$.transitionrun);
    this.removeEventListener("transitioncancel", this.$.transitioncancel);
    this.removeEventListener("transitionend", this.$.transitionend);
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.disconnected?.call?.(this));
  }

  $onRegisterIMPS() {
    return [];
  }

  $render() {}
}


