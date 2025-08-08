import { defineElements } from '@rainbow_ljy/rainbow-element/main'
// import '@rainbow_ljy/rainbow-element/build/index.css'
// import "@rainbow_ljy/v-views/build/esm/index.css"
import { createApp, render } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
// import "vant/lib/index.css";

export const directiveEvents = {
  install(app: any) {
    app.directive('on-resize', {
      created(el: any, binding: any) {
        // width height console.log(binding.modifiers);
        let Observer = window.ResizeObserver || MutationObserver
        el?.v_directive_onResize?.disconnect?.()
        el.v_directive_onResize = new Observer(binding.value)
        el?.v_directive_onResize?.observe?.(el)
      },
      beforeUnmount(el: any) {
        el?.v_directive_onResize?.disconnect?.()
        delete el.v_directive_onResize
      },
    })

    app.directive('on-intersection', {
      created(el: any, binding: any) {
        // show hide console.log(binding.modifiers);show hide
        let Observer = window.IntersectionObserver || MutationObserver
        el?.v_directive_onIntersection?.disconnect?.()
        el.v_directive_onIntersection = new Observer(binding.value)
        el?.v_directive_onIntersection?.observe?.(el)
      },
      beforeUnmount(el: any) {
        el?.v_directive_onIntersection?.disconnect?.()
        delete el.v_directive_onIntersection
      },
    })
  },
}

defineElements()
rainbow.customRender = render
const app = createApp(App)
app.use(directiveEvents)
app.use(router)
app.mount('#app')
app.config.globalProperties.$log = console.log

export default app
