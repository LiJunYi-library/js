import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { markRaw } from 'vue'

const modules = import.meta.glob('../views/**/*.vue', { eager: false })
const routes = Object.keys(modules).map((file) => {
  const name = file
    .replace(/(\.\.\/views|\.vue)/g, '')
    .split('/')
    .filter(Boolean)
    .join('/')
  return {
    path: `/${name}`,
    name: name,
    component: () => markRaw(modules[file]()),
  }
})

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
