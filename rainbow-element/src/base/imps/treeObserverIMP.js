export function treeObserverIMP(props = {}) {
    let mObserver;
    let rObserver;

    const config = {
        childrenResizeOptions: {},
        onChildrenSizeChange() { },
        resizeOptions: {},
        onSizeChange() { },
        onWidthChange() { },
        onHeightChange() { },



        mutationOptions: { childList: true },
        onChildChange() { },
        onAttributeChange() { },
        ...props
    }

    let cache = {
        offset: {},
    }

    return {
        simult: {
            init() {
                try {
                    rObserver = new ResizeObserver((entries, ...arg) => {
                        let offset = { width: this.offsetWidth, height: this.offsetHeight };
                        if (cache.offset.width !== offset.width) config.onWidthChange.call(this, entries, offset);
                        if (cache.offset.height !== offset.height) config.onHeightChange.call(this, entries, offset);
                        if (cache.offset.width !== offset.width || cache.offset.height !== offset.height) {
                            config.onSizeChange.call(this, entries, offset);
                        }
                        cache.offset = offset;
                        let includes = entries.some((el) => el.target === this)
                        if (includes === false) config.onChildrenSizeChange.call(this, entries);
                    });
                    rObserver?.observe?.(this, config.resizeOptions)
                } catch (error) {
                    console.warn(error);
                }
                mObserver = new MutationObserver((mutations, ...arg) => {
                    for (let mutation of mutations) {
                        if (mutation.type === "childList") {
                            const addedNodes = Array.from(mutation.addedNodes).filter(el => el.style);
                            const removedNodes = Array.from(mutation.removedNodes).filter(el => el.style);
                            addedNodes.forEach(ele => rObserver.observe(ele, config.childrenResizeOptions));
                            removedNodes.forEach(ele => rObserver.unobserve(ele));
                            config.onChildChange.call(this, mutation);
                        } else if (mutation.type === "attributes") {
                            config.onAttributeChange.call(this, mutation);
                        }
                    }
                })
                mObserver.observe(this, config.mutationOptions)
            },
            disconnected() {
                mObserver.disconnect(this)
                rObserver.disconnect(this)
            },
        },
    }

}




