import {defineElements} from '@rainbow_ljy/rainbow-element/main'
import '@rainbow_ljy/rainbow-element/build/main.css'
import { createApp, render } from 'vue'
import App from './App.vue'
import router from './router'
// import "element-plus/dist/index.css";
// import "vant/lib/index.css";


defineElements();
rainbow.customRender = render;
const app = createApp(App)
app.use(router)
app.mount('#app')
app.config.globalProperties.$log = console.log
export default app
