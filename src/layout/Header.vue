<template>
  <t-header class="layout-header">
    <div class="header-content">
      <!-- 左侧区域 -->
      <div class="header-left">
        <!-- 面包屑导航 -->
        <t-breadcrumb class="breadcrumb">
          <t-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path" :to="item.path">
            {{ item.title }}
          </t-breadcrumb-item>
        </t-breadcrumb>
      </div>

      <!-- 右侧区域 -->
      <div class="header-right">
        <t-space>
          <!-- 搜索框 -->
          <div class="search-trigger" @click="openSearchDialog">
            <t-icon name="search" class="search-icon" />
            <span class="search-placeholder">搜索</span>
            <span class="search-shortcut">Ctrl K</span>
          </div>

          <!-- 刷新按钮 -->
          <t-tooltip content="刷新">
            <t-button theme="default" shape="square" variant="text" @click="handleRefresh">
              <template #icon>
                <t-icon name="refresh" />
              </template>
            </t-button>
          </t-tooltip>

          <!-- 全局主题切换 -->
          <t-tooltip :content="appStore.theme === 'dark' ? '明亮模式' : '暗黑模式'">
            <t-button theme="default" shape="square" variant="text" @click="toggleGlobalTheme">
              <template #icon>
                <t-icon :name="appStore.theme === 'dark' ? 'sunny' : 'moon'" />
              </template>
            </t-button>
          </t-tooltip>

          <!-- 全屏切换 -->
          <t-tooltip :content="isFullscreen ? '退出全屏' : '进入全屏'">
            <t-button theme="default" shape="square" variant="text" @click="toggleFullscreen">
              <template #icon>
                <t-icon :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" />
              </template>
            </t-button>
          </t-tooltip>

          <!-- 用户信息下拉菜单 -->
          <UserDropdown />
        </t-space>
      </div>
    </div>
  </t-header>

  <!-- 页面标签组件 -->
  <PageTags />
  
  <!-- 搜索对话框组件 -->
  <SearchDialog v-model="showSearchDialog" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import PageTags from '@/components/page-tags/PageTags.vue'
import SearchDialog from '@/components/search-dialog/SearchDialog.vue'
import UserDropdown from '@/components/custom/UserDropdown.vue'


const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()


// 搜索相关
const showSearchDialog = ref(false)

// 全屏相关
const isFullscreen = ref(false)

// 面包屑导航
const breadcrumbItems = computed(() => {
  const items = []

  // 获取匹配的路由层级
  const matched = route.matched.filter(item => item.meta && item.meta.title)

  // 总是添加首页作为第一项（除非当前就是首页）
  if (route.path !== '/' && route.path !== '/home') {
    items.push({ title: '首页', path: '/home' })
  }

  // 添加路由层级中的每一级
  matched.forEach((match, index) => {
    // 跳过根路径
    if (match.path === '/') return

    // 对于中间层级，如果没有实际页面组件，使用 # 作为路径
    let itemPath = match.path
    if (index < matched.length - 1 && !match.component) {
      itemPath = '#'
    }

    items.push({
      title: match.meta.title,
      path: itemPath
    })
  })

  return items
})



// 打开搜索对话框
const openSearchDialog = () => {
  showSearchDialog.value = true
}

// 刷新页面
const handleRefresh = () => {
  appStore.triggerRefresh()
}

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}



// 生命周期
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

// 切换全局主题
const toggleGlobalTheme = () => {
  appStore.toggleTheme()
}


</script>

<style scoped>
.layout-header {
  background: var(--td-bg-color-container);
  border-bottom: 1px solid var(--td-border-level-1-color);
  box-shadow: var(--td-shadow-1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.breadcrumb {
  margin: 0;
}

/* 搜索触发器样式 */
.search-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--td-bg-color-container-hover);
  border: 1px solid var(--td-border-level-1-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 115px;
}

.search-trigger:hover {
  background: var(--td-bg-color-container-active);
  border-color: var(--td-border-level-2-color);
}

.search-icon {
  color: var(--td-text-color-placeholder);
  font-size: 15px;
}

.search-placeholder {
  color: var(--td-text-color-placeholder);
  font-size: 12px;
  flex: 1;
}

.search-shortcut {
  color: var(--td-text-color-placeholder);
  font-size: 10px;
  background: var(--td-mask-background);
  padding: 3px 5px;
  border-radius: 4px;
  max-height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}

.username {
  margin-left: 8px;
  font-size: 14px;
  color: var(--td-text-color-primary);
}

/* 深色主题适配 */
:global(.t-theme-dark) .layout-header {
  background: var(--td-bg-color-container);
  border-bottom-color: var(--td-border-level-1-color);
}

:global(.t-theme-dark) .username {
  color: var(--td-text-color-primary);
}
</style>