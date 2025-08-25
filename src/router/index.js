import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes, asyncRoutes, anyRoutes } from './routes'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes, ...asyncRoutes, ...anyRoutes],
  // 路由滚动行为
  scrollBehavior(savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 动态添加路由的方法
export const addRoutes = (routes) => {
  routes.forEach(route => {
    router.addRoute(route)
  })
}

// 重置路由的方法
export const resetRouter = () => {
  const newRouter = createRouter({
    history: createWebHistory(),
    routes: constantRoutes
  })
  router.matcher = newRouter.matcher
}

export default router