import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // state
  const userInfo = ref(null)
  
  // getters
  const username = computed(() => userInfo.value?.username || '')
  
  // actions
  const setUserInfo = (info) => {
    userInfo.value = info
  }
  
  const logout = async () => {
    // 清除用户信息
    userInfo.value = null
    
    // 这里可以添加调用后端退出登录API的逻辑
    // try {
    //   await api.logout()
    // } catch (error) {
    //   console.error('调用退出登录API失败:', error)
    // }
  }
  
  return {
    userInfo,
    username,
    setUserInfo,
    logout
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    //只有添加到里面才会持久化
    paths: ['userInfo']
  }
})