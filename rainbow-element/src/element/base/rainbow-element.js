import { objectEqualitys } from "@rainbow_ljy/rainbow-js";
import {
  camelCaseToKebabCase,
  wipePX,
  createCustomEvent,
  getBoundingClientRect,
  resizeObserver,
  createDomTokenList,
} from "../../utils/index.js";

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
    this.prototype.$props = props;
    return keys;
  }

  cssList = createDomTokenList({
    element: this,
    attributeName: "css-name",
    formatterConnected: () => this?.$?.isConnected,
  });

  $config = {
    mutationOptions: { childList: true },
  };

  $events = {};

  $watchStyle = {};

  $ = (() => {
    const onResizeObserver = (...arg) => this.$onResizeObserver(...arg);
    const onMutationObserver = (...arg) => this.$onMutationObserver(...arg);
    const onChildrenResizeObserver = (...arg) => this.$onChildrenResizeObserver(...arg);
    return {
      value: undefined,
      updateValue: (val) => {
        this.$.value = val;
        this.dispatchEvent(createCustomEvent("input", { value: val }));
      },
      isRenderFinish: false,
      renderFinish: () => (this.$.isRenderFinish = true),
      renderFinishAnimationFrame: false,
      isConnected: false,
      resizeObserver: resizeObserver(onResizeObserver),
      childResizeObserver: resizeObserver(onChildrenResizeObserver),
      mutationObserver: new MutationObserver(onMutationObserver),
      props: { ...this.constructor.prototype.$props },
      cache: {
        offset: {},
      },
      data: {},
      DATA: new Proxy({}, { get: (target, prop) => this.$.data[camelCaseToKebabCase(prop)] }),
      documentMutation: (events) => {
        this.$.listenerStyle();
      },
      listenerStyle: () => {
        const parms = this.$.getStyles();
        const { isChange, changeCss, oldCss } = parms;
        if (isChange) this.$onStyleChang(parms);
        for (const key in changeCss) {
          this.$watchStyle?.[key]?.(changeCss[key], oldCss[key]);
        }
      },
      getStyles: () => {
        let isChange = false;
        const changeCss = {};
        const oldCss = { ...this.$.data };
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
            if (oldCss[key] !== css[key]) {
              changeCss[key] = css[key];
              isChange = true;
            }
          }
        }
        this.$.data = css;
        return { changeCss, css, oldCss, isChange };
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
    };
  })();

  set value(v) {
    if (this.$.value === v) return;
    this.$.value = v;
    this.$onValueChange(v);
  }

  get value() {
    return this.$.value;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.$.props[name] = newValue;
    if (!this.$.isConnected) return;
    this.$onAttributeChanged(name, oldValue, newValue);
  }

  constructor(...arg) {
    super(...arg);
    // console.log("constructor",[this]);
  }

  connectedCallback() {
    // console.log("connectedCallback",[this]);
    this.$.isConnected = true;
    this.cssList.add(this.getAttribute("css-name"));
    this.$.getStyles();
    const offset = getBoundingClientRect(this);
    this.$.cache.offset = { ...offset, __c__: 0 };
    window.addEventListener("documentMutation", this.$.documentMutation);
    this.$.resizeObserver.observe(this);
    this.$.mutationObserver.observe(this, this.$config.mutationOptions);
    Array.from(this.children)
      .filter((el) => el.style)
      .forEach((ele) => {
        ele.$cacheOffset = { ...getBoundingClientRect(ele) };
        this.$.childResizeObserver.observe(ele);
      });
    cancelAnimationFrame(this.$.renderFinishAnimationFrame);
    this.$.renderFinishAnimationFrame = requestAnimationFrame(this.$.renderFinish);
  }

  disconnectedCallback() {
    // console.log('disconnectedCallback')
    window.removeEventListener("documentMutation", this.$.documentMutation);
    this.$.resizeObserver.disconnect();
    this.$.mutationObserver.disconnect();
    this.$.childResizeObserver.disconnect();
    cancelAnimationFrame(this.$.renderFinishAnimationFrame);
    this.$.isRenderFinish = false;
  }

  $onAttributeChanged() {
    // console.log('onAttributeChanged')
    this.$.listenerStyle();
  }

  adoptedCallback() {
    // console.log('adoptedCallback')
  }

  $onStyleChang() {
    // console.log("onStyleChang");
  }

  $onResizeObserver(...args) {
    // console.log('onResizeObserver')
    const offset = getBoundingClientRect(this);
    const { offset: cacheOffset } = this.$.cache;
    let bool = objectEqualitys(offset, cacheOffset);
    if (!bool) this.$onResize(...args);
    if (offset.width !== cacheOffset.width) this.$onWidthChange(...args);
    if (offset.height !== cacheOffset.height) this.$onHeightChange(...args);
  }

  $onResize() {
    // console.log("onResize");
  }

  $onWidthChange() {
    // console.log("onWidthChange");
  }

  $onHeightChange() {
    // console.log("onHeightChange");
  }

  $onMutationObserver(mutations, ...args) {
    // console.log("onMutationObserver");
    const removedNodes = [];
    const addedNodes = [];
    const nodes = [];
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        removedNodes.push(...Array.from(mutation.removedNodes).filter((el) => el.style));
        addedNodes.push(...Array.from(mutation.addedNodes).filter((el) => el.style));
      } else if (mutation.type === "attributes") {
        //
      }
    }
    removedNodes.forEach((ele) => this.$.childResizeObserver.unobserve(ele));
    addedNodes.forEach((ele) => {
      ele.$cacheOffset = { ...getBoundingClientRect(ele) };
      this.$.childResizeObserver.observe(ele);
    });
    nodes.push(...removedNodes, ...addedNodes);
    const parms = { removedNodes, addedNodes, nodes };
    if (nodes.length) this.$onChildrenChanage(parms, mutations, ...args);
    if (addedNodes.length) this.$onChildrenAdd(parms, mutations, ...args);
    if (removedNodes.length) this.$onChildrenRemove(parms, mutations, ...args);
  }

  $onChildrenChanage(...arg) {
    // console.log("onChildrenChanage", ...arg);
  }

  $onChildrenAdd(...arg) {
    // console.log("onChildrenAdd", ...arg);
  }

  $onChildrenRemove(...arg) {
    // console.log("onChildrenRemove", ...arg);
  }

  $onChildrenResizeObserver(obs = [], ...args) {
    // console.log("onChildrenResizeObserver");
    const rc = [];
    const wc = [];
    const hc = [];
    obs.forEach((item) => {
      const ele = item.target;
      const offset = getBoundingClientRect(ele);
      const cacheOffset = ele.$cacheOffset || {};
      if (!objectEqualitys(offset, cacheOffset)) rc.push(ele);
      if (offset.width !== cacheOffset.width) wc.push(ele);
      if (offset.height !== cacheOffset.height) hc.push(ele);
      ele.$cacheOffset = { ...getBoundingClientRect(ele) };
    });
    if (rc.length) this.$onChildrenResize(rc, obs, ...args);
    if (wc.length) this.$onChildrenWidthChange(wc, obs, ...args);
    if (hc.length) this.$onChildrenHeightChange(hc, obs, ...args);
  }

  $onChildrenResize(...arg) {
    // console.log("onChildrenResize");
  }

  $onChildrenWidthChange(...arg) {
    // console.log("onChildrenWidthChange");
  }

  $onChildrenHeightChange(...arg) {
    // console.log("onChildrenHeightChange", ...arg);
  }

  $onValueChange() {
    // console.log("onResize");
  }

  $onRender() {
    // console.log('onRender')
  }
}
