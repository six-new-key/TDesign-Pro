import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { constantRoutes } from '@/router/routes'

export const useAppStore = defineStore('app', () => {
  // state
  const title = ref('')
  const theme = ref('light') // 全局主题
  const sidebarTheme = ref('dark') // 菜单栏主题
  const shouldRefresh = ref(false) // 页面刷新标志
  const menuItems = ref([]) // 缓存的菜单项数据
  const isLocked = ref(false) // 锁屏状态
  const lockPassword = ref('') // 锁屏密码
  
  // getters
  const currentTitle = computed(() => title.value)
  const currentTheme = computed(() => theme.value)
  const currentSidebarTheme = computed(() => sidebarTheme.value)
  const lockStatus = computed(() => isLocked.value)
  const currentLockPassword = computed(() => lockPassword.value)
  
  // actions
  const setTitle = (newTitle) => {
    title.value = newTitle
  }
  
  const setTheme = (newTheme) => {
    theme.value = newTheme
    // 设置HTML元素的theme-mode属性
    document.documentElement.setAttribute('theme-mode', newTheme)
  }
  
  const setSidebarTheme = (newTheme) => {
    sidebarTheme.value = newTheme
  }
  
  const toggleTheme = () => {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }
  
  const toggleSidebarTheme = () => {
    const newTheme = sidebarTheme.value === 'dark' ? 'light' : 'dark'
    setSidebarTheme(newTheme)
  }
  
  // 初始化主题
  const initTheme = () => {
    document.documentElement.setAttribute('theme-mode', theme.value)
  }

  // 锁屏相关方法
  const setLockStatus = (status) => {
    isLocked.value = status
  }

  const lockScreen = () => {
    isLocked.value = true
  }

  const unlockScreen = () => {
    isLocked.value = false
  }

  // 设置锁屏密码
  const setLockPassword = (password) => {
    lockPassword.value = password
  }

  // 清除锁屏密码
  const clearLockPassword = () => {
    lockPassword.value = ''
  }

  // 刷新相关方法
  const triggerRefresh = () => {
    shouldRefresh.value = true
  }

  const resetRefresh = () => {
    shouldRefresh.value = false
  }

  // 初始化菜单数据
  const initMenuItems = () => {
    const items = []
    
    // 递归提取菜单项，只缓存最深层的子菜单
    const extractMenuItems = (routes, parentPath = '') => {
      routes.forEach(route => {
        // 跳过隐藏的菜单项和Layout根路由
        if (route.meta?.hide || route.name === 'Layout') {
          if (route.children) {
            extractMenuItems(route.children, parentPath)
          }
          return
        }
        
        // 如果有子路由，递归处理子路由，不添加当前路由
        if (route.children && route.children.length > 0) {
          extractMenuItems(route.children, route.path)
        } else {
          // 只有没有子路由的最深层菜单项才添加到缓存中
          if (route.meta?.title) {
            items.push({
              title: route.meta.title,
              icon: route.meta.icon || 'default',
              path: route.path,
              name: route.name
            })
          }
        }
      })
    }
    
    extractMenuItems(constantRoutes)
    menuItems.value = items
  }

  // 搜索菜单项
  const searchMenuItems = (keyword) => {
    if (!keyword.trim()) {
      return []
    }
    
    const lowerKeyword = keyword.toLowerCase()
    return menuItems.value.filter(item => 
      item.title.toLowerCase().includes(lowerKeyword)
    )
  }
  
  return {
    title,
    theme,
    sidebarTheme,
    shouldRefresh,
    menuItems,
    isLocked,
    lockPassword,
    currentTitle,
    currentTheme,
    currentSidebarTheme,
    lockStatus,
    currentLockPassword,
    setTitle,
    setTheme,
    setSidebarTheme,
    toggleTheme,
    toggleSidebarTheme,
    initTheme,
    setLockStatus,
    lockScreen,
    unlockScreen,
    setLockPassword,
    clearLockPassword,
    triggerRefresh,
    resetRefresh,
    initMenuItems,
    searchMenuItems
  }
}, {
  persist: {
    key: 'app-store',
    storage: localStorage,
    //只有添加到里面才会持久化
    paths: ['title', 'theme', 'sidebarTheme', 'isLocked', 'lockPassword']
  }
})