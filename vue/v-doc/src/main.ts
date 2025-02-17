import '@rainbow_ljy/rainbow-element'
import '@rainbow_ljy/rainbow-element/build/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import "element-plus/dist/index.css";
// import "vant/lib/index.css";



const app = createApp(App)
app.use(router)
app.mount('#app')

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
