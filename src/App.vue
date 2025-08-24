<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

// 组件挂载时初始化主题系统
onMounted(() => {
  // 初始化新的主题系统
  appStore.initNewThemeSystem()
})
</script>

<style scoped>
</style>
