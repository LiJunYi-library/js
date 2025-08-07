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
