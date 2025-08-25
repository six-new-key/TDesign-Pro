<template>
  <div class="theme-settings">
    <t-card title="主题设置" :bordered="false">
      <!-- 主题模式设置 -->
      <div class="setting-section">
        <h4 class="section-title">
          <t-icon name="palette" class="section-icon" />
          主题模式
        </h4>
        <t-radio-group 
          v-model="currentThemeMode" 
          @change="handleThemeModeChange"
          class="theme-mode-group"
        >
          <t-radio-button value="light">
            <t-icon name="sunny" />
            浅色模式
          </t-radio-button>
          <t-radio-button value="dark">
            <t-icon name="moon" />
            深色模式
          </t-radio-button>
          <t-radio-button value="auto">
            <t-icon name="desktop" />
            跟随系统
          </t-radio-button>
        </t-radio-group>
        <p class="setting-desc">
          当前实际模式：{{ actualModeText }}
        </p>
      </div>



      <!-- 主题预览 -->
      <div class="setting-section">
        <h4 class="section-title">
          <t-icon name="view-module" class="section-icon" />
          主题预览
        </h4>
        <div class="theme-preview">
          <div class="preview-card">
            <div class="preview-header">
              <div class="preview-title">示例卡片</div>
              <t-button size="small" theme="primary">主要按钮</t-button>
            </div>
            <div class="preview-content">
              <p class="preview-text">这是一段示例文本，用于预览当前主题效果。</p>
              <div class="preview-buttons">
                <t-button variant="outline" size="small">次要按钮</t-button>
                <t-button variant="text" size="small">文本按钮</t-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 重置设置 -->
      <div class="setting-section">
        <t-button 
          @click="handleReset"
          variant="outline"
          theme="danger"
        >
          <t-icon name="refresh" />
          重置为默认设置
        </t-button>
      </div>
    </t-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { THEME_MODE } from '@/utils/theme'
import { MessagePlugin } from 'tdesign-vue-next'

const appStore = useAppStore()

// 响应式数据
const currentThemeMode = ref(appStore.currentThemeMode)

// 计算属性
const actualModeText = computed(() => {
  const mode = appStore.currentActualThemeMode
  return mode === 'dark' ? '深色模式' : '浅色模式'
})

// 监听 store 变化
watch(() => appStore.currentThemeMode, (newMode) => {
  currentThemeMode.value = newMode
})



// 方法
const handleThemeModeChange = (mode) => {
  appStore.setThemeMode(mode)
  MessagePlugin.success(`已切换到${getThemeModeText(mode)}`)
}

const handleReset = () => {
  appStore.setThemeMode(THEME_MODE.AUTO)
  MessagePlugin.success('主题设置已重置为默认值')
}

// 工具函数
const getThemeModeText = (mode) => {
  const modeMap = {
    light: '浅色模式',
    dark: '深色模式',
    auto: '跟随系统模式'
  }
  return modeMap[mode] || mode
}


</script>

<style scoped>
.theme-settings {
  max-width: 600px;
  margin: 0 auto;
}

.setting-section {
  margin-bottom: 32px;
}

.setting-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.section-icon {
  margin-right: 8px;
  color: var(--td-brand-color);
}

.theme-mode-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.theme-mode-group :deep(.t-radio-button) {
  display: flex;
  align-items: center;
  gap: 4px;
}

.setting-desc {
  margin: 12px 0 0 0;
  font-size: 14px;
  color: var(--td-text-color-secondary);
}





.theme-preview {
  padding: 16px;
  background: var(--td-bg-color-container);
  border-radius: 8px;
  border: 1px solid var(--td-border-level-1-color);
}

.preview-card {
  background: var(--td-bg-color-page);
  border-radius: 6px;
  padding: 16px;
  border: 1px solid var(--td-border-level-2-color);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.preview-content {
  margin-top: 12px;
}

.preview-text {
  margin: 0 0 12px 0;
  color: var(--td-text-color-secondary);
  line-height: 1.5;
}

.preview-buttons {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .theme-mode-group {
    flex-direction: column;
  }
}
</style>