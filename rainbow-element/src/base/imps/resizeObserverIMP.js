import { animationDebounced } from "@rainbow_ljy/rainbow-js";





export function resizeObserverIMP(params) {
    let obs;
    return {
        simult: {
            init() {
                const fun = animationDebounced(() => {
                    this.$render()
                })
                
                try {
                    obs = new ResizeObserver(fun);
                    obs.observe(this)
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




