import router from './index'
import { useUserStore } from '@/store/modules/user'
import { getUserInfo } from '@/api/user'

// 白名单路由，不需要登录即可访问
const whiteList = ['/login', '/register', '/404', '/403']

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token
  
  // 如果有token
  if (token) {
    if (to.path === '/login') {
      // 已登录用户访问登录页，重定向到首页
      next({ path: '/' })
    } else {
      // 检查是否已获取用户信息
      if (!userStore.userInfo) {
        try {
          // 获取用户信息
          const response = await getUserInfo()
          if (response.code === 200) {
            userStore.setUserInfo(response.data)
            next()
          } else {
            // 获取用户信息失败，清除token并跳转到登录页
            userStore.logout()
            next(`/login?redirect=${to.path}`)
          }
        } catch (error) {
          console.error('获取用户信息失败:', error)
          // 获取用户信息异常，清除token并跳转到登录页
          userStore.logout()
          next(`/login?redirect=${to.path}`)
        }
      } else {
        // 已有用户信息，直接放行
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      // 在白名单中，直接放行
      next()
    } else {
      // 不在白名单中，跳转到登录页
      next(`/login?redirect=${to.path}`)
    }
  }
})

// 路由后置守卫
router.afterEach((to) => {
  // 设置页面标题
  document.title = to.meta?.title ? `${to.meta.title} - 微信公众号管理系统` : '微信公众号管理系统'
})

export default router