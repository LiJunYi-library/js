import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const filesR = require.context("../views", true, /\.(vue)$/);
const routes: any[] = [];
filesR.keys().forEach((file) => {
  const name = file.replace(/\.\/([^]*?)\.(vue|tsx|jsx)/g, "$1");
  const p = "/" + name;
  const route = {
    path: p,
    name: name,
    component: async () => filesR(file),
  };

  routes.push(route);
});

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
