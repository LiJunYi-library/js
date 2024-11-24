export function resizeObserverIMP(props = {}) {
    let obs;
    const config = {
        debounced: true,
        resizeCallback: undefined,
        resizeOptions: {},
        ...props
    }
    return {
        simult: {
            init() {
                const cb = config.resizeCallback ? config.resizeCallback.bind(this) : this.$debouncedRender.bind(this);
                try {
                    obs = new ResizeObserver(cb);
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




