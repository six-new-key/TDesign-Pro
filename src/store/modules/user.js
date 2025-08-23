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
  
  return {
    userInfo,
    username,
    setUserInfo
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    //只有添加到里面才会持久化
    paths: ['userInfo']
  }
})