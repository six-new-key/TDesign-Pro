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
          <t-dropdown :options="userMenuOptions" @click="handleUserMenuClick">
            <t-button theme="default" variant="text">
              <t-avatar size="small">管</t-avatar>
              <span class="username">管理员</span>
              <t-icon name="chevron-down" />
            </t-button>
          </t-dropdown>
        </t-space>
      </div>
    </div>
  </t-header>

  <!-- 页面标签展示区域 -->
  <div class="page-tags-section" v-if="visitedPages.length > 0">
    <div class="page-tags-wrapper">
      <!-- 左滚动按钮 -->
      <t-button v-show="showScrollButtons" class="scroll-button scroll-button--left" variant="text" size="small"
        @click="scrollLeft">
        <t-icon name="chevron-left" />
      </t-button>

      <!-- 页面标签容器 -->
      <div ref="tagsContainer" class="page-tags-container" @scroll="handleScroll">
        <t-tag size="large" v-for="page in visitedPages" :key="page.path"
          :closable="!page.isHome && visitedPages.length > 1" @close="removePageTag(page.path)"
          @click="navigateToPage(page.path)" :variant="page.path === route.path ? 'primary' : 'default'"
          :theme="page.path === route.path ? 'primary' : 'default'" class="page-tag"
          :class="{ 'page-tag--active': page.path === route.path, 'page-tag--home': page.isHome }">
          <span class="page-tag__text">{{ page.title }}</span>
        </t-tag>
      </div>

      <!-- 右滚动按钮 -->
      <t-button v-show="showScrollButtons" class="scroll-button scroll-button--right" variant="text" size="small"
        @click="scrollRight">
        <t-icon name="chevron-right" />
      </t-button>
    </div>
  </div>

  <!-- 搜索对话框 -->
  <t-dialog v-model:visible="showSearchDialog" width="550px" :footer="false" @close="closeSearchDialog">
    <template #header>
      <div class="search-input-wrapper">
        <t-icon name="search" size="small" />
        <input v-model="searchValue" placeholder="搜索导航菜单" class="search-input" @keydown.esc="closeSearchDialog" />
      </div>
    </template>

    <!-- 搜索结果 -->
    <div class="search-results" v-if="searchResults.length > 0">
      <div class="search-result-item" v-for="item in searchResults" :key="item.name"
        @click="navigateToSearchResult(item)">
        <t-icon :name="item.icon" class="result-icon" />
        <span class="result-text">{{ item.title }}</span>
      </div>
    </div>
    <div class="no-results" v-else-if="searchValue && searchResults.length === 0">
      <p>暂无搜索结果</p>
    </div>
  </t-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { useTabsStore } from '@/store/modules/tabs'


const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const tabsStore = useTabsStore()


// 搜索相关
const searchValue = ref('')
const showSearchDialog = ref(false)
const searchResults = ref([])

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

// 页面标签相关
const visitedPages = computed(() => tabsStore.getVisitedPages)
const tagsContainer = ref(null)
const showScrollButtons = ref(false)

// 添加页面到标签列表
const addPageTag = (path, title) => {
  tabsStore.addPageTag({ path, title })
}

// 移除页面标签
const removePageTag = (path) => {
  const lastPage = tabsStore.removePageTag(path)
  // 如果移除的是当前页面，跳转到最后一个标签页面
  if (path === route.path && lastPage) {
    router.push(lastPage.path)
  }
}

// 导航到指定页面
const navigateToPage = (path) => {
  if (path !== route.path) {
    router.push(path)
  }
}

// 滚动到当前激活的标签
const scrollToActiveTag = () => {
  nextTick(() => {
    if (!tagsContainer.value) return
    
    const activeTag = tagsContainer.value.querySelector('.page-tag--active')
    if (!activeTag) return
    
    const container = tagsContainer.value
    const containerRect = container.getBoundingClientRect()
    const tagRect = activeTag.getBoundingClientRect()
    
    // 计算标签相对于容器的位置
    const tagLeft = activeTag.offsetLeft
    const tagRight = tagLeft + activeTag.offsetWidth
    const containerScrollLeft = container.scrollLeft
    const containerWidth = container.clientWidth
    
    // 如果标签在可视区域左侧，滚动到标签位置
    if (tagLeft < containerScrollLeft) {
      container.scrollTo({
        left: tagLeft - 20, // 留一些边距
        behavior: 'smooth'
      })
    }
    // 如果标签在可视区域右侧，滚动到标签位置
    else if (tagRight > containerScrollLeft + containerWidth) {
      container.scrollTo({
        left: tagRight - containerWidth + 20, // 留一些边距
        behavior: 'smooth'
      })
    }
  })
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    // 更新页面标题
    if (route.meta?.title) {
      document.title = `${route.meta.title} - 微信公众号管理系统`
      // 添加页面到标签列表
      addPageTag(newPath, route.meta.title)
      // 滚动到当前激活的标签
      scrollToActiveTag()
    }
  },
  { immediate: true }
)

// 用户菜单选项
const userMenuOptions = ref([
  {
    content: '个人中心',
    value: 'profile',
    prefixIcon: 'user'
  },
  {
    content: '系统设置',
    value: 'settings',
    prefixIcon: 'setting'
  },
  {
    content: '退出登录',
    value: 'logout',
    prefixIcon: 'logout'
  }
])

// 处理用户菜单点击
const handleUserMenuClick = (data) => {
  const { value } = data
  switch (value) {
    case 'profile':
      console.log('跳转到个人中心')
      break
    case 'settings':
      console.log('跳转到系统设置')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 处理退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

// 打开搜索对话框
const openSearchDialog = () => {
  showSearchDialog.value = true
  // 确保菜单数据已初始化
  if (appStore.menuItems.length === 0) {
    appStore.initMenuItems()
  }
}

// 关闭搜索对话框
const closeSearchDialog = () => {
  showSearchDialog.value = false
  searchValue.value = ''
  searchResults.value = []
}

// 搜索功能 - 实时搜索
const performSearch = () => {
  if (searchValue.value.trim()) {
    searchResults.value = appStore.searchMenuItems(searchValue.value)
  } else {
    searchResults.value = []
  }
}

// 导航到搜索结果
const navigateToSearchResult = (item) => {
  router.push(item.path)
  closeSearchDialog()
}

// 监听搜索输入变化
watch(searchValue, () => {
  performSearch()
})

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

// 键盘快捷键处理
const handleKeydown = (event) => {
  // Ctrl + K 打开搜索
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    openSearchDialog()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)

  // 初始检查滚动按钮
  nextTick(() => {
    checkScrollButtons()
  })
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
})

// 切换全局主题
const toggleGlobalTheme = () => {
  appStore.toggleTheme()
}

// 页面标签滚动相关方法
const scrollLeft = () => {
  if (tagsContainer.value) {
    tagsContainer.value.scrollBy({
      left: -200,
      behavior: 'smooth'
    })
  }
}

const scrollRight = () => {
  if (tagsContainer.value) {
    tagsContainer.value.scrollBy({
      left: 200,
      behavior: 'smooth'
    })
  }
}

const handleScroll = () => {
  // 滚动时可以添加其他逻辑，比如更新按钮状态
}

// 检查是否需要显示滚动按钮
const checkScrollButtons = () => {
  if (tagsContainer.value) {
    const container = tagsContainer.value
    showScrollButtons.value = container.scrollWidth > container.clientWidth
  }
}

// 监听窗口大小变化
const handleResize = () => {
  checkScrollButtons()
}

// 监听页面标签变化
watch(visitedPages, () => {
  nextTick(() => {
    checkScrollButtons()
    scrollToActiveTag()
  })
}, { deep: true })
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

/* 搜索输入框区域 */
.search-input-wrapper {
  display: flex;
  align-items: center;
  background: var(--td-bg-color-container);
  width: 97%;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--td-text-color-primary);
  line-height: 1.5;
  font-size: 15px;
}

.search-input::placeholder {
  color: var(--td-text-color-placeholder);
}

/* 搜索结果区域 */
.search-results {
  padding: 8px 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--td-brand-color-light);
  margin-bottom: 10px;
  border-radius: 6px;
}

.search-result-item:hover {
  background: var(--td-brand-color-focus);
  transform: translateY(-1px);
}

.search-result-item:active {
  transform: translateY(0);
  background: var(--td-brand-color);
}

.result-icon {
  color: var(--td-brand-color);
  font-size: 16px;
  margin-right: 12px;
}

.result-text {
  flex: 1;
  color: var(--td-brand-color);
  font-size: 14px;
  font-weight: 500;
}

.no-results {
  display: flex;
  justify-content: center;
  padding: 15px 0;
}

.page-tags-section {
  background: var(--td-bg-color-container);
  padding: 3px 16px;
  border-bottom: 1px solid var(--td-border-level-1-color);
  box-shadow: var(--td-shadow-1);
}

.page-tags-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.page-tags-container {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
  scroll-behavior: smooth;
}

.page-tags-container::-webkit-scrollbar {
  display: none;
}

/* 滚动按钮样式 */
.scroll-button {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-border-level-1-color);
  color: var(--td-text-color-secondary);
  transition: all 0.2s;
  z-index: 1;
}

.scroll-button:hover {
  background: var(--td-bg-color-container-hover);
  color: var(--td-text-color-primary);
  border-color: var(--td-border-level-2-color);
}

.scroll-button--left {
  margin-right: 8px;
}

.scroll-button--right {
  margin-left: 8px;
}

.page-tag {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 16px !important;
  border: 1px solid var(--td-border-level-1-color);
  background: var(--td-bg-color-container);
  color: var(--td-text-color-secondary);
  position: relative;
  overflow: hidden;
}

.page-tag--active {
  background: var(--td-brand-color-light) !important;
  color: var(--td-brand-color) !important;
  border-color: var(--td-brand-color-light) !important;
}

.page-tag--home {
  font-weight: 600;
}

.page-tag__text {
  position: relative;
  z-index: 1;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* 移除深色主题下的重复样式，因为已经使用CSS变量 */
</style>