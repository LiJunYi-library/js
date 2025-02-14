import '@rainbow_ljy/rainbow-element'
// import '@rainbow_ljy/rainbow-element/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import "element-plus/dist/index.css";
// import "vant/lib/index.css";
// import page from  './views/grid/index.vue'

// import { useLocalStorageRef } from '@rainbow_ljy/v-hooks'

// const riles = window.localStorage.getItem

const app = createApp(App)
app.use(router)
app.mount('#app')


function onStorageChange() {
  console.log('onStorageChange--------');
}

window.addEventListener('storage', onStorageChange)

const riles = {
  onStorageChange(event){
    console.log('onStorageChange',event);

  },
  updated(el, binding, vnode, prevVnode) {
    console.log(this)

  },
  mounted(el, binding, vnode) {
    console.log('mounted')
    console.log(riles)

  },
  beforeUnmount(el, binding, vnode) {
    console.log('beforeUnmount')
    window.removeEventListener('storage', riles.onStorageChange)
  },
}
app.directive('riles', riles)
export default app
