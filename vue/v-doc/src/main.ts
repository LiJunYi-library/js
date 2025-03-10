import '@rainbow_ljy/rainbow-element/main'
// import '@rainbow_ljy/rainbow-element/build/index.css'
import { createApp, render } from 'vue'
import App from './App.vue'
import router from './router'
// import "element-plus/dist/index.css";
// import "vant/lib/index.css";
rainbow.customRender = render

const app = createApp(App)
app.use(router)
app.mount('#app')

app.config.globalProperties.$log = console.log

function onStorageChange() {
  console.log('onStorageChange--------')
}

app.directive('riles', {
  updated(el, binding, vnode, prevVnode) {
    console.log('updated')
  },
  mounted(el, binding, vnode) {
    console.log('mounted')

    binding.onStorageChange = () => {
      console.log('onStorageChange--------')
    }

    window.addEventListener('storage', binding.onStorageChange)
  },
  beforeUnmount(el, binding, vnode) {
    console.log('beforeUnmount')
    window.removeEventListener('storage', binding.onStorageChange)
  },
})
export default app
