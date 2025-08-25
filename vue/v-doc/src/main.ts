import { defineElements } from '@rainbow_ljy/rainbow-element/main'
import directiveEvents from '@rainbow_ljy/v-directives';
import { createApp, render } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
// import "vant/lib/index.css";
// import '@rainbow_ljy/rainbow-element/build/index.css'
// import "@rainbow_ljy/v-views/build/esm/index.css"



defineElements({customRender: render})
const app = createApp(App)
app.use(directiveEvents)
app.use(router)
app.mount('#app')
app.config.globalProperties.$log = console.log
// console.log("app",app)
export default app
