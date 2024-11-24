export function resizeObserverIMP(props = {}) {
    let obs;
    const config = {
        isOnlyResizeWidth: false,
        isOnlyResizeHeight: false,
        debounced: true,
        resizeCallback: undefined,
        resizeOptions: {},
        ...props
    }

    let cache = {}

    return {
        simult: {
            init() {
                const cb = config.resizeCallback ? config.resizeCallback.bind(this) : this.$debouncedRender.bind(this);
                try {
                    obs = new ResizeObserver((...arg) => {
                        let offset = { width: this.offsetWidth, height: this.offsetHeight };
                        if (config.isOnlyResizeWidth && cache.width !== offset.width) cb(...arg)
                        if (config.isOnlyResizeHeight && cache.height !== offset.height) cb(...arg)
                        if (!config.isOnlyResizeWidth && !config.isOnlyResizeHeight) cb(...arg)
                        cache = offset;
                    });
                    obs.observe(this, config.resizeOptions)
                } catch (error) {
                    console.warn(error);
                }
            },
            disconnected() {
                obs.disconnect(this)
            },
        },
    }

}




