import {defineElements} from '@rainbow_ljy/rainbow-element'
import '@rainbow_ljy/rainbow-element/build/index.css'
import "@rainbow_ljy/v-views/build/esm/index.css"
import { createApp, render } from 'vue'
import App from './App.vue'
import router from './router'
import "element-plus/dist/index.css";
// import "vant/lib/index.css";


defineElements();
rainbow.customRender = render;
const app = createApp(App)
app.use(router)
app.mount('#app')
app.config.globalProperties.$log = console.log
export default app
