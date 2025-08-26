<template>
  <!-- 页面标签展示区域 -->
  <div class="page-tags-section" 
       :class="{
         'page-tags-section--elevated': appStore.pageTagsElevationVisible,
         'page-tags-section--flat': !appStore.pageTagsElevationVisible
       }"
       v-if="visitedPages.length > 0">
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
          :class="{ 'page-tag--active': page.path === route.path}">
          <template #icon>
            <icon-font :name="page.icon" size="15px" style="margin-right: 5px;margin-bottom: 5px;" />
          </template>
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
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { IconFont } from 'tdesign-icons-vue-next';
import { useRouter, useRoute } from 'vue-router'
import { useTabsStore } from '@/store/modules/tabs'
import { useAppStore } from '@/store/modules/app'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const appStore = useAppStore()

// 页面标签相关
const visitedPages = computed(() => tabsStore.getVisitedPages)
const tagsContainer = ref(null)
const showScrollButtons = ref(false)

// 添加页面到标签列表
const addPageTag = (path, title, icon) => {
  tabsStore.addPageTag({ path, title, icon })
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
      document.title = `${route.meta.title} - TDesign Pro`
      // 添加页面到标签列表
      addPageTag(newPath, route.meta.title, route.meta.icon)
      // 滚动到当前激活的标签
      scrollToActiveTag()
    }
  },
  { immediate: true }
)

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

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 初始检查滚动按钮
  nextTick(() => {
    checkScrollButtons()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.page-tags-section {
  background: var(--td-bg-color-container);
  padding: 4px 16px;
  position: relative;
  transition: all 0.3s ease;
}

/* 抬高效果样式 */
.page-tags-section--elevated {
  box-shadow: var(--td-shadow-1), 0 1px 2px rgba(244, 243, 243, 0.05);
  z-index: 10;
}

/* 平铺效果样式 */
.page-tags-section--flat {
  box-shadow: none;
  z-index: 1;
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
  background: var(--td-brand-color-1);
  color: var(--td-brand-color) !important;
}

.page-tag__text {
  position: relative;
  z-index: 1;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>