
class RainbowElement extends HTMLElement {
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

    $attrs = {};
    $ASTProps = {};
    $isASTinit = false;
    $resizeObserver;
    $mutationObserver;
    $mutationObserverInit = { childList: true };
    $cache = { offset: {} };
    $renderEvents = [];

    constructor() {
        super();
        this.$initResizeObserver();
        this.$initMutationObserver();
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
        this.$dispatchOn('$onMutation', mutationsList, ...arg)
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
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


    $initResizeObserver() {
        try {
            this.$resizeObserver = new ResizeObserver(this.$resizeObserverCB.bind(this));
            this.$resizeObserver.observe(this)
        } catch (error) {
            console.warn(error);
        }
    }
    $resizeObserverCB(...arg) {
        const newOffset = this?.getBoundingClientRect?.();
        this.$dispatchOn('$onResize', newOffset, ...arg)
        if (this.$cache.offset.width !== newOffset.width) this.$dispatchOn('$onWidthChange', newOffset, ...arg);
        if (this.$cache.offset.height !== newOffset.height) this.$dispatchOn('$onHeightChange', newOffset, ...arg);
        this.$cache.offset = newOffset;
    }
    $onResize() { }
    $onWidthChange() { }
    $onHeightChange() { }


    $onAttrsChange() { }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.$isASTinit === false) this.$ASTProps[name] = newValue;
        this.$attrs[name] = newValue;
        if (this.$isASTinit === true) this.$onAttrsChange(this.$attrs, name, oldValue, newValue);
    }


    connectedCallback() {
        this.$isASTinit = true;
        // console.log('自定义元素添加至页面。', this.offsetWidth);
    }

    adoptedCallback() {
        // console.log("自定义元素移动至新页面。");
    }

    disconnectedCallback() {
        // console.log("自定义元素从页面中移除。");
        this.$resizeObserver?.disconnect?.();
        this.$mutationObserver?.disconnect?.();
    }

}



class RGrids extends RainbowElement {
    static observedAttributes = this.$initProps({
        columns: { type: [Number, String], default: 1 },
        gap: [Number, String],
        'row-gap': [Number, String],
        'column-gap': [Number, String],
        inline: Boolean,
        'min-auto-width': Number,
        wrap: Boolean,
        stretch: Boolean,
        onred: Function
    });

    $renderEvents = ['$onMutation', '$onWidthChange', '$onAttrsChange']

    get $columns() {
        if (this.$attrs['min-auto-width']) return Math.floor(this.offsetWidth / this.$attrs['min-auto-width']);
        return this.$attrs.columns
    };

    $bindStyle(props) {
        Object.assign(this.style, {
            "display": "grid",
            "grid-template-columns": ` repeat(${this.$columns}, 1fr)`,
            "grid-gap": props.gap + "px",
            "row-gap": (props['row-gap'] || props.gap) + "px",
            "column-gap": (props['column-gap'] || props.gap) + "px",
        })
    }

    $doLayout() {
        let props = this.$attrs;
        let children = Array.from(this.children)
        let clumnList = children.map(el => el.getAttribute('grid-column') * 1 || 1)
        let start = 1;
        let gridColumns = [];
        let maxColumn = this.$columns + 1;
        clumnList.forEach((num, index) => {
            let end = start + num;
            if (props.wrap) {
                if (end > maxColumn) {
                    if (props.stretch) {
                        if (gridColumns[index - 1]) gridColumns[index - 1].end = maxColumn;
                    }
                    start = 1;
                    let end2 = start + num
                    end = end2 > maxColumn ? maxColumn : end2;
                }
            } else {
                if (end > maxColumn) end = maxColumn
            }
            gridColumns.push({
                start: start,
                end: end,
                index
            })
            start = start + num
            if (start > this.$columns) start = 1
        });
        children.forEach((el, index) => {
            el.classList.add('r-grid-item')
            el.style['grid-column-start'] = gridColumns[index].start
            el.style['grid-column-end'] = gridColumns[index].end
        });
    }

    $onRender() {
        this.$bindStyle(this.$attrs);
        this.$doLayout();
        this.classList.add('r-grid')
    }

}



customElements.define("r-grid-s", RGrids);