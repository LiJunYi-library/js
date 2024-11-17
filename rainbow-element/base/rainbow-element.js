export class RainbowElement extends HTMLElement {
    static $initProps = (props) => {
        const keys = [];
        const attrs = {};
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(props, key)) {
                keys.push(key)
                if (props[key]?.default instanceof Function) attrs[key] = props[key].default(attrs)
                else attrs[key] = props[key]?.default;

            }
        }
        this.prototype.$props = props
        this.prototype.$attrs = attrs
        return keys
    }


    $ASTProps = {};
    $isASTinit = false;
    $childrenResizeObserver;
    $resizeObserver;
    $mutationObserver;
    $mutationObserverInit = { childList: true };
    $cache = { offset: {} };
    $renderEvents = [];

    constructor() {
        super();
        this.$initResizeObserver();
        this.$initMutationObserver();
        this.$initChildrenResizeObserver();
    }

    $dispatchOn(eName, ...args) {
        this?.[eName]?.(...args)
        if (this.$renderEvents.includes(eName)) this.$onRender(eName, ...args)
    }

    $initMutationObserver() {
        try {
            this.$mutationObserver = new MutationObserver(this.$mutationObserverCB.bind(this));
            this.$mutationObserver.observe(this, this.$mutationObserverInit)
        } catch (error) {
            console.warn(error);
        }
    }
    $mutationObserverCB(mutationsList, ...arg) {
        console.log(' $onMutation ', mutationsList);
        this.$dispatchOn('$onMutation', mutationsList, ...arg)
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                const addedNodes = Array.from(mutation.addedNodes).filter(el => el.style);
                const removedNodes = Array.from(mutation.removedNodes).filter(el => el.style);
                addedNodes.forEach(ele => this.$childrenResizeObserver.observe(ele));
                removedNodes.forEach(ele => this.$childrenResizeObserver.unobserve(ele));
                this.$dispatchOn('$onChildChange', mutation)
            } else if (mutation.type === "attributes") {
                this.$dispatchOn('$onAttributeChange', mutation)
            }
        }
    }
    $onRender() { }
    $onMutation() { }
    $onChildChange() { }
    $onAttributeChange() { }


    $initChildrenResizeObserver() {
        try {
            this.$childrenResizeObserver = new ResizeObserver(this.$childrenResizeObserverCB.bind(this));
        } catch (error) {
            console.warn(error);
        }
    }

    $childrenResizeObserverCB(...arg) {
        this.$dispatchOn('$onChildrenResize', ...arg);
    }



    $initResizeObserver() {
        try {
            this.$resizeObserver = new ResizeObserver(this.$resizeObserverCB.bind(this));
            this.$resizeObserver.observe(this)
        } catch (error) {
            console.warn(error);
        }
    }
    $resizeObserverCB(...arg) {
        this.$dispatchOn('$onResizeObserver', ...arg);
        const cacheOffset = this.$cache.offset;
        const newOffset = this?.getBoundingClientRect?.();
        if (cacheOffset.width !== newOffset.width || cacheOffset.height !== newOffset.height) this.$dispatchOn('$onResize', newOffset, ...arg)
        if (cacheOffset.width !== newOffset.width) this.$dispatchOn('$onWidthChange', newOffset, ...arg);
        if (cacheOffset.height !== newOffset.height) this.$dispatchOn('$onHeightChange', newOffset, ...arg);
        this.$cache.offset = newOffset;
    }
    $onResize() { }
    $onWidthChange() { }
    $onHeightChange() { }


    $setAttrsProp(name, value) {
        const pop = this.$props[name];
        if (!pop) this.$attrs[name] = value;
        let cto = pop.type || pop;
        if (cto instanceof Array) {
            let t = cto.map(el => el.name);
            if (t.includes('String')) cto = String
            else cto = cto[0];
        }
        let newV = (() => {
            if (value === 'true') return true;
            if (value === 'false') return false;
            if (value === 'null') return null;
            if (value === 'undefined') return undefined;
            return cto(value);
        })()
        this.$attrs[name] = newV;
    }
    $onAttrsChange() { }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.$isASTinit === false) this.$ASTProps[name] = newValue;
        this.$attrs[name] = newValue;
        this.$setAttrsProp(name, newValue)
        if (this.$isASTinit === true) this.$onAttrsChange(this.$attrs, name, oldValue, newValue);
    }


    connectedCallback() {
        this.$isASTinit = true;
        Array.from(this.children).forEach(child => this.$childrenResizeObserver.observe(child));
        this.$dispatchOn('$onConnected')
        // console.log('自定义元素添加至页面。', this.offsetWidth);
    }

    adoptedCallback() {
        this.$dispatchOn('$onAdopted')
        // console.log("自定义元素移动至新页面。");
    }

    disconnectedCallback() {
        // console.log("自定义元素从页面中移除。");
        this.$resizeObserver?.disconnect?.();
        this.$childrenResizeObserver?.disconnect?.();
        this.$mutationObserver?.disconnect?.();
    }

}