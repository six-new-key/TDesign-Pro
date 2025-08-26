<template>
  <!-- 锁屏状态下显示全屏锁定界面 -->
  <FullScreenLock v-if="appStore.lockStatus" />

  <!-- 正常布局 -->
  <t-layout v-else class="main-layout">
    <!-- 左侧：侧边导航 -->
    <Sidebar />

    <!-- 右侧：Header + 主内容区域 -->
    <t-layout class="right-layout">
      <!-- 顶部导航 -->
      <Header />

      <!-- 内容区域 -->
      <t-content class="main-content">
        <transition name="content-fade" mode="out-in">
          <router-view v-if="!isRefreshing" :key="routerViewKey" />
          <div v-else class="refresh-loading" key="loading">
            <t-loading text="页面刷新中..." />
          </div>
        </transition>
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script setup>
import { watch, nextTick, ref } from 'vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import FullScreenLock from '@/components/lock-screen/FullScreenLock.vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

// 刷新状态管理
const isRefreshing = ref(false)
const routerViewKey = ref(0)

// 监听刷新状态
watch(
  () => appStore.shouldRefresh,
  (shouldRefresh) => {
    if (shouldRefresh) {
      // 执行页面刷新
      handlePageRefresh()
      // 重置刷新状态
      appStore.resetRefresh()
    }
  }
)

// 处理页面刷新
const handlePageRefresh = async () => {
  // 显示刷新加载状态
  isRefreshing.value = true

  // 等待一小段时间让用户看到刷新提示
  await new Promise(resolve => setTimeout(resolve, 500))

  // 更新router-view的key来强制重新渲染组件
  routerViewKey.value += 1

  // 等待DOM更新完成
  await nextTick()

  // 隐藏刷新加载状态
  isRefreshing.value = false
}


</script>

<style scoped>
.main-layout {
  height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow: hidden;
}

.right-layout {
  height: 100vh;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.main-content {
  background: var(--td-bg-color-page);
  padding: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 140px);
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: var(--td-scrollbar-color);
}

.main-content::-webkit-scrollbar-thumb {
  background: var(--td-scrollbar-thumb-color);
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: var(--td-scroll-track-color);
}

.refresh-loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 内容区域过渡动画 - 纯淡入淡出效果 */
.content-fade-enter-active,
.content-fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
}

.content-fade-enter-to,
.content-fade-leave-from {
  opacity: 1;
}
</style>