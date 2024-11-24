import { camelCaseToKebabCase, assignStyle, convertToCamelCase, RainbowEvent } from './utils';
import { treeAttrsChangeIMP } from '../base/imps/index.js';
import { animationDebounced } from "@rainbow_ljy/rainbow-js";

// export class RainbowElement extends HTMLElement {
//     static $initProps(props) {
//         const defaultKeys = ['r-columns', 'r-min-auto-width'];
//         const keys = [];
//         const attrs = {};
//         for (const key in props) {
//             if (Object.prototype.hasOwnProperty.call(props, key)) {
//                 keys.push(key)
//                 if (props[key]?.default instanceof Function) attrs[key] = props[key].default(attrs)
//                 else attrs[key] = props[key]?.default;
//                 attrs[convertToCamelCase(key)] = attrs[key]
//             }
//         }
//         this.prototype.$props = props
//         this.prototype.$attrs = attrs
//         return [...defaultKeys, ...keys];
//     }

//     IMPS = [treeAttrsChangeIMP];

//     $isASTinit = false;
//     $childrenResizeObserver;
//     $resizeObserver;
//     $mutationObserver;
//     $mutationObserverInit = { childList: true, attributes: true, attributeOldValue: true };
//     $cache = { offset: {}, class: new Map(), style: {} };
//     $renderEvents = [];

//     constructor() {
//         super();





//         this.$initResizeObserver();
//         this.$initMutationObserver();
//         this.$initChildrenResizeObserver();


//         treeAttrsChange.add(this.$onTreeAttrsChange);
//     }

//     $onTreeAttrsChange = () => {
//         console.log("changeTreeAttrs", [this]);
//     }

//     $setStylePx(num) {
//         if (!isNaN(Number(num))) return num + 'px';
//         return ''
//     }

// $setStyle(fmtStyle = () => ({})) {
//     let ftStyle = fmtStyle(this.$attrs) || {};
//     let newStyle = ftStyle;
//     if (ftStyle instanceof Array) {
//         newStyle = ftStyle.filter(Boolean).reduce((add, value) => {
//             Object.assign(add, value);
//             return add
//         }, {})
//     }

//     deleteKey(newStyle, this.$cache.style);
//     deleteKey(this.$cache.style, this.style, true);
//     assignStyle(this.style, newStyle);
//     this.$cache.style = newStyle;
// }

//     $setClass(fmtClass = () => []) {
//         let newClass = fmtClass(this.$attrs)
//         if (newClass?.length === undefined) newClass = [newClass]
//         newClass = newClass.filter(Boolean);
//         let newMap = new Map();
//         newClass.forEach((key) => {
//             newMap.set(key, key);
//             this.$cache.class.delete(key);
//             this.classList.add(key)
//         });
//         this.$cache.class.forEach((key, v) => {
//             this.classList.remove(key)
//         })
//         this.$cache.class = newMap;
//     }

//     $createCustomEvent(name, event, eventInitDict = {},) {
//         const newEvent = new CustomEvent(name, { bubbles: true, cancelable: true, ...eventInitDict })
//         for (const key in event) {
//             try {
//                 if (newEvent[key] === undefined) newEvent[key] = event[key];
//             } catch (error) {
//                 console.warn(error);
//             }
//         }
//         return newEvent
//     }

//     $getParentByType(name, p = this) {
//         if (!p) return;
//         const parent = p.parentNode;
//         if (!parent) return;
//         const tName = parent.constructor.name;
//         if (tName === name || parent.$elementName === name) return parent;
//         return this.$getParentByType(name, parent)
//     }

//     $getOffsetTop(p, num = 0) {
//         let offsetTop = this.offsetTop;
//         let top = num + offsetTop;
//         if (this.offsetParent === p) return top;
//         return this.$getOffsetTop(this.offsetParent, top);
//     }

//     $dispatchOn(eName, ...args) {
//         this?.[eName]?.(...args)
//         if (this.$renderEvents.includes(eName)) this.$onRender(eName, ...args)
//     }

//     $initMutationObserver() {
//         try {
//             this.$mutationObserver = new MutationObserver(this.$mutationObserverCB.bind(this));
//             this.$mutationObserver.observe(this, this.$mutationObserverInit)
//         } catch (error) {
//             console.warn(error);
//         }
//     }
//     $mutationObserverCB(mutationsList, ...arg) {
//         this.$dispatchOn('$onMutation', mutationsList, ...arg)
//         for (let mutation of mutationsList) {
//             if (mutation.type === "childList") {
//                 const addedNodes = Array.from(mutation.addedNodes).filter(el => el.style);
//                 const removedNodes = Array.from(mutation.removedNodes).filter(el => el.style);
//                 addedNodes.forEach(ele => this.$childrenResizeObserver.observe(ele));
//                 removedNodes.forEach(ele => this.$childrenResizeObserver.unobserve(ele));
//                 this.$dispatchOn('$onChildChange', mutation)
//             } else if (mutation.type === "attributes") {
//                 this.$dispatchOn('$onAttributeChange', mutation)
//                 // console.log('$onAttributeChange', mutation)
//             }
//         }
//     }
//     $onRender() { }
//     $onMutation() { }
//     $onChildChange() { }
//     $onAttributeChange() { }


//     $initChildrenResizeObserver() {
//         try {
//             this.$childrenResizeObserver = new ResizeObserver(this.$childrenResizeObserverCB.bind(this));
//         } catch (error) {
//             console.warn(error);
//         }
//     }
//     $childrenResizeObserverCB(...arg) {
//         this.$dispatchOn('$onChildrenResize', ...arg);
//     }


//     $initResizeObserver() {
//         try {
//             this.$resizeObserver = new ResizeObserver(this.$resizeObserverCB.bind(this));
//             this.$resizeObserver.observe(this)
//         } catch (error) {
//             console.warn(error);
//         }
//     }
//     $resizeObserverCB(...arg) {
//         this.$dispatchOn('$onResizeObserver', ...arg);
//         const cacheOffset = this.$cache.offset;
//         const newOffset = this?.getBoundingClientRect?.();
//         if (cacheOffset.width !== newOffset.width || cacheOffset.height !== newOffset.height) this.$dispatchOn('$onResize', newOffset, ...arg)
//         if (cacheOffset.width !== newOffset.width) this.$dispatchOn('$onWidthChange', newOffset, ...arg);
//         if (cacheOffset.height !== newOffset.height) this.$dispatchOn('$onHeightChange', newOffset, ...arg);
//         this.$cache.offset = newOffset;
//     }
//     $onResize() { }
//     $onWidthChange() { }
//     $onHeightChange() { }


//     $setAttrsProperty(name, value) {
//         this.$attrs[name] = value;
//         this.$attrs[convertToCamelCase(name)] = value;
//     }
//     $setAttrsProp(name, value) {
//         const pop = this.$props[name];
//         if (!pop) return this.$setAttrsProperty(name, value);
//         let cto = pop.type || pop;
//         if (cto instanceof Array) {
//             let t = cto.map(el => el.name);
//             if (t.includes('String')) cto = String
//             else cto = cto[0];
//         }
//         let newV = (() => {
//             if (value === 'true') return true;
//             if (value === 'false') return false;
//             if (value === 'null') return null;
//             if (value === 'undefined') return undefined;
//             return cto(value);
//         })()
//         this.$setAttrsProperty(name, newV)
//     }
//     $onAttrsChange() { }
//     attributeChangedCallback(name, oldValue, newValue) {
//         this.$setAttrsProp(name, newValue)
//         if (this.$isASTinit === true) this.$dispatchOn('$onAttrsChange', this.$attrs, name, oldValue, newValue)
//     }


//     $onConnected() { }
//     connectedCallback() {
//         this.$isASTinit = true;
//         Array.from(this.children).forEach(child => this.$childrenResizeObserver.observe(child));
//         this.$dispatchOn('$onConnected')
//         // console.log('自定义元素添加至页面。', this.offsetWidth);
//         // var style = window.getComputedStyle(this);
//         // console.log(style)
//         // var absolute = style.getPropertyValue('--r-absolute').trim(); // 获取颜色值
//         // console.log(absolute);

//     }


//     $onAdopted() { }
//     adoptedCallback() {
//         this.$dispatchOn('$onAdopted')
//         // console.log("自定义元素移动至新页面。");
//     }


//     $onDisconnected() { }
//     disconnectedCallback() {
//         // console.log("自定义元素从页面中移除。");
//         this.$resizeObserver?.disconnect?.();
//         this.$childrenResizeObserver?.disconnect?.();
//         this.$mutationObserver?.disconnect?.();
//         this.$dispatchOn('$onDisconnected')
//     }

// }


export class RainbowElement extends HTMLElement {
    static $registerProps(types) {
        const keys = [];
        const props = {};
        for (const key in types) {
            if (Object.prototype.hasOwnProperty.call(types, key)) {
                keys.push(key)
                if (types[key]?.default instanceof Function) props[key] = types[key].default(props)
                else props[key] = types[key]?.default;
            }
        }
        this.prototype.$types = types
        this.prototype.$props = props
        return keys;
    }

    static registerIMPS(imps = []) {
        this.prototype.IMPS = [treeAttrsChangeIMP, ...imps]
    }

    static IMPS = this.registerIMPS();

    $ = {
        isInitAttrs: false,
        data: {},
        attrs: {},
        computePixel(str = '') {
            try {
                return Number(str.match(/(\d*?)px/)[1])
            } catch (error) {
                return undefined
            }
        },
        DATA: new Proxy({}, { get: (target, prop) => this.$.data[camelCaseToKebabCase(prop)] }),
        resolveFunCss: {
            'r-attr': (key) => {
                return this.$props[key];
            }
        },
        cache: {
            data: {},
            style: {},
        },
        setStyle: (fmtStyle = () => ({})) => {
            let ftStyle = fmtStyle(this.$.data) || {};
            let newStyle = ftStyle;
            if (ftStyle instanceof Array) {
                newStyle = ftStyle.filter(Boolean).reduce((add, value) => {
                    Object.assign(add, value);
                    return add
                }, {})
            }
            for (const key in newStyle) {
                if (Object.prototype.hasOwnProperty.call(newStyle, key)) {
                    if (this.$.cache.style[key] !== newStyle[key]) {
                        this.style[key] = '';
                        this.style[key] = newStyle[key];
                    }
                    delete this.$.cache.style[key];
                }
            }
            for (const key in this.$.cache.style) {
                if (Object.prototype.hasOwnProperty.call(this.$.cache.style, key)) {
                    this.style[key] = '';
                }
            }
            this.$.cache.style = newStyle;
        }
    }

    constructor(...arg) {
        super(...arg);
        this.$debouncedRender = animationDebounced((...pop) => this.$render(...pop))
        this.IMPS.map(el => el?.simult)?.forEach(el => el?.init?.call?.(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.$props[name] = newValue;
        if (this.$.isInitAttrs === true) this.$onAttributeChanged(name, oldValue, newValue);
    }

    $onAttributeChanged() {
        this.IMPS.map(el => el?.simult)?.forEach(el => el?.changeAttr?.call?.(this));
        this.$changePropsRender();
    }

    connectedCallback() {
        this.$.isInitAttrs = true;
        this.IMPS.map(el => el?.simult)?.forEach(el => el?.connected?.call?.(this));
        this.$changePropsRender();
    }

    adoptedCallback() {
        this.IMPS.map(el => el?.simult)?.forEach(el => el?.adopted?.call?.(this));
    }

    disconnectedCallback() {
        this.IMPS.map(el => el?.simult)?.forEach(el => el?.disconnected?.call?.(this));
    }

    $changePropsRender(force) {
        let isChange = false
        const css = {};
        const attrs = {}
        const style = window.getComputedStyle(this);
        for (const key in this.$props) {
            if (Object.prototype.hasOwnProperty.call(this.$props, key)) {
                css[key] = (() => {
                    const cssVal = style.getPropertyValue('--' + key).trim();
                    const isFunstr = /([^\(]*?)\([^\)]*?\)/.test(cssVal);
                    if (isFunstr) {
                        const match = cssVal.match(/([^\(]*?)\(([^\)]*?)\)/);
                        const FunName = match[1];
                        const isRFunName = /r-.*?/.test(FunName);
                        const args = match[2].split(',').map(s => s.trim()).filter(Boolean);
                        try {
                            attrs[key] = this.$.resolveFunCss[FunName](...args);
                            attrs[convertToCamelCase(key)] = attrs[key];
                            if (isRFunName) return attrs[key]
                        } catch (error) {
                            console.error(`暂时不支持这个方法${FunName}`)
                        }
                    }
                    return cssVal;
                })()
                if (this.$.cache.data[key] !== css[key]) isChange = true
            }
        }
        this.$.data = css;
        this.$.attrs = attrs
        this.$.cache.data = css
        // console.log('attrs', this.$.attrs);
        // console.log(isChange);
        if (isChange || force === true)  this.$debouncedRender(css);
        return css
    }


    $render() { }





}
