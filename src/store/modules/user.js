import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, logout as logoutApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // state
  const userInfo = ref(null)
  const token = ref('')

  // getters
  const username = computed(() => userInfo.value?.username || '')
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // actions
  const setUserInfo = (info) => {
    userInfo.value = info
  }
  // 设置token
  const setToken = (newToken) => {
    token.value = newToken
  }

  const login = async (loginData) => {
    try {
      const response = await loginApi(loginData)
      if (response.code === 200) {
        setToken(response.data)
        return { success: true, data: response.data }
      } else {
        return { success: false, message: response.message || '登录失败' }
      }
    } catch (error) {
      console.error('登录请求失败:', error)
      return { success: false, message: '网络错误，请稍后重试' }
    }
  }

  const logout = async () => {
    try {
      // 调用后端退出登录API
      await logoutApi()
    } catch (error) {
      console.error('调用退出登录API失败:', error)
    } finally {
      // 无论API调用是否成功，都清除本地状态
      userInfo.value = null
      token.value = ''
    }
  }

  return {
    userInfo,
    token,
    username,
    isLoggedIn,
    setUserInfo,
    setToken,
    login,
    logout
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    //只有添加到里面才会持久化
    paths: ['userInfo', 'token']
  }
})