import '@rainbow_ljy/rainbow-element'
// import '@rainbow_ljy/rainbow-element/index.css'
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import "element-plus/dist/index.css";
// import "vant/lib/index.css";
// import page from  './views/grid/index.vue'





const app = createApp(App);
// app.config.compilerOptions.isCustomElement = tag => tag.startsWith('r-');
app.use(router)
app.mount("#app");
export default app;
