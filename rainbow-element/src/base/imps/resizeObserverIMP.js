export function resizeObserverIMP(props = {}) {
    let obs;
    const config = {
        isOnlyResizeWidth: false,
        isOnlyResizeHeight: false,
        resizeCallback: undefined,
        resizeOptions: {},
        ...props
    }

    let cache = {}

    return {
        simult: {
            init() {
                const cb = config.resizeCallback ? config.resizeCallback.bind(this) : (...arg)=>this.$debouncedRender(...arg);
                console.log('ResizeObserver',[this])
                try {
                    obs = new ResizeObserver((...arg) => {
                        console.log('ResizeObserver',[this])
                        let offset = { width: this.offsetWidth, height: this.offsetHeight };
                        if (config.isOnlyResizeWidth && cache.width !== offset.width) this.$debouncedRender(...arg)
                        if (config.isOnlyResizeHeight && cache.height !== offset.height) this.$debouncedRender(...arg)
                        if (!config.isOnlyResizeWidth && !config.isOnlyResizeHeight) this.$debouncedRender(...arg)
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




