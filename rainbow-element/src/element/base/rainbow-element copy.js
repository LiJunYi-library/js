import { camelCaseToKebabCase, wipePX } from "../../utils/index.js";
import { treeAttrsChangeIMP } from "../base/imps/index.js";

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
    isRenderFinish: false,
    renderFinish: () => (this.$.isRenderFinish = true),
    renderFinishAnimationFrame: false,
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
        if (str === "r-prop") return this.$.props[key];
        //
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
        if (/^-?\d+(\.\d+)?$/.test(cssVal)) return Number(cssVal);
        // 如果可以转换成数组
        if (/.*?,.*?/.test(cssVal)) return cssVal.trim().split(",").filter(Boolean);
        return cssVal;
      } catch (error) {
        // console.log(error);
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
    findChildByLocalName: (name, c = this) => {
      if (!c) return [];
      if (name instanceof Array) {
        return name.map((val) => c.getElementsByTagName(val)).flat(Infinity);
      }
      return c.getElementsByTagName(name);
    },
    getOffsetTop: (p, num = 0) => {
      if (this.offsetParent === p) return num;
      let offsetTop = this.offsetTop;
      let top = num + offsetTop;
      return this.$.getOffsetTop(this.offsetParent, top);
    },

    changePropsRender: (force) => {
      let isChange = false;
      const css = {};
      const style = window.getComputedStyle(this);
      for (const key in this.$.props) {
        if (Object.prototype.hasOwnProperty.call(this.$.props, key)) {
          if (key.startsWith("r-")) {
            const cssVal = style.getPropertyValue("--" + key).trim();
            css[key] = this.$.resolveCss(key, cssVal);
          } else {
            const cssVal = style.getPropertyValue(key).trim();
            css[key] = wipePX(cssVal);
          }
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
    this.$debouncedRender = this.$render; // animationDebounced((...pop) => this.$render(...pop));
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.init?.call?.(this));
  }

  $slotContainer = {
    default: this,
  };

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
    cancelAnimationFrame(this.$.renderFinishAnimationFrame);
    this.$.renderFinishAnimationFrame = requestAnimationFrame(this.$.renderFinish);
  }

  adoptedCallback() {
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.adopted?.call?.(this));
  }

  disconnectedCallback() {
    this.removeEventListener("transitionrun", this.$.transitionrun);
    this.removeEventListener("transitioncancel", this.$.transitioncancel);
    this.removeEventListener("transitionend", this.$.transitionend);
    this.IMPS.map((el) => el?.simult)?.forEach((el) => el?.disconnected?.call?.(this));
    this.$.isRenderFinish = false;
  }

  $onRegisterIMPS() {
    return [];
  }

  $render() {}
}
