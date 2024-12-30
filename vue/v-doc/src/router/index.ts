import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { markRaw } from 'vue';

// const routes: any[] = [];
const modules = import.meta.glob('../views/**/*.vue', { eager: false });

const routes = Object.keys(modules).map((file) => {
  // 提取文件名作为路由的 name 和 path
  const name = file
    .replace(/(\.\.\/views|\.vue)/g, '') // 去掉 './' 和 '.vue'
    .split('/')
    .filter(Boolean)
    .join('/'); // 将路径中的多个斜杠合并为一个

  return {
    path: `/${name}`,
    name: name,
    component: markRaw(modules[file]()), // 异步加载组件
  };
});

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;


// const filesR = require.context("../views", true, /\.(vue)$/);
// const routes: any[] = [];
// filesR.keys().forEach((file) => {
//   const name = file.replace(/\.\/([^]*?)\.(vue|tsx|jsx)/g, "$1");
//   const p = "/" + name;
//   const route = {
//     path: p,
//     name: name,
//     component: async () => filesR(file),
//   };

//   routes.push(route);
// });
