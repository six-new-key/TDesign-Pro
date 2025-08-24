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

      <!-- 主色调设置 -->
      <div class="setting-section">
        <h4 class="section-title">
          <t-icon name="color-palette" class="section-icon" />
          主色调
        </h4>
        
        <!-- 预设颜色 -->
        <div class="preset-colors">
          <div class="color-label">预设颜色</div>
          <div class="color-grid">
            <div 
              v-for="(color, name) in PRESET_COLORS" 
              :key="name"
              class="color-item"
              :class="{ active: currentPrimaryColor === color }"
              :style="{ backgroundColor: color }"
              @click="handleColorChange(color)"
              :title="getColorName(name)"
            >
              <t-icon v-if="currentPrimaryColor === color" name="check" class="check-icon" />
            </div>
          </div>
        </div>

        <!-- 自定义颜色 -->
        <div class="custom-color">
          <div class="color-label">自定义颜色</div>
          <div class="color-input-wrapper">
            <input 
              type="color" 
              v-model="customColor" 
              @change="handleCustomColorChange"
              class="color-input"
            />
            <t-input 
              v-model="customColorHex" 
              placeholder="#0052d9"
              @blur="handleHexColorChange"
              @keyup.enter="handleHexColorChange"
              class="hex-input"
            />
            <t-button 
              @click="handleCustomColorApply"
              variant="outline"
              size="small"
            >
              应用
            </t-button>
          </div>
        </div>
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
import { THEME_MODE, PRESET_COLORS } from '@/utils/theme'
import { MessagePlugin } from 'tdesign-vue-next'

const appStore = useAppStore()

// 响应式数据
const currentThemeMode = ref(appStore.currentThemeMode)
const currentPrimaryColor = ref(appStore.currentPrimaryColor)
const customColor = ref(appStore.currentPrimaryColor)
const customColorHex = ref(appStore.currentPrimaryColor)

// 计算属性
const actualModeText = computed(() => {
  const mode = appStore.currentActualThemeMode
  return mode === 'dark' ? '深色模式' : '浅色模式'
})

// 监听 store 变化
watch(() => appStore.currentThemeMode, (newMode) => {
  currentThemeMode.value = newMode
})

watch(() => appStore.currentPrimaryColor, (newColor) => {
  currentPrimaryColor.value = newColor
  customColor.value = newColor
  customColorHex.value = newColor
})

// 方法
const handleThemeModeChange = (mode) => {
  appStore.setThemeMode(mode)
  MessagePlugin.success(`已切换到${getThemeModeText(mode)}`)
}

const handleColorChange = (color) => {
  appStore.setPrimaryColor(color)
  MessagePlugin.success('主色调已更新')
}

const handleCustomColorChange = () => {
  customColorHex.value = customColor.value
}

const handleHexColorChange = () => {
  if (isValidHexColor(customColorHex.value)) {
    customColor.value = customColorHex.value
  } else {
    MessagePlugin.error('请输入有效的十六进制颜色值')
    customColorHex.value = currentPrimaryColor.value
  }
}

const handleCustomColorApply = () => {
  if (isValidHexColor(customColor.value)) {
    appStore.setPrimaryColor(customColor.value)
    MessagePlugin.success('自定义颜色已应用')
  } else {
    MessagePlugin.error('请选择有效的颜色')
  }
}

const handleReset = () => {
  appStore.setThemeMode(THEME_MODE.AUTO)
  appStore.setPrimaryColor(PRESET_COLORS.blue)
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

const getColorName = (name) => {
  const nameMap = {
    blue: '蓝色',
    green: '绿色',
    orange: '橙色',
    red: '红色',
    purple: '紫色',
    cyan: '青色',
    pink: '粉色',
    yellow: '黄色'
  }
  return nameMap[name] || name
}

const isValidHexColor = (color) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
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

.preset-colors {
  margin-bottom: 24px;
}

.color-label {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--td-text-color-primary);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 12px;
  max-width: 320px;
}

.color-item {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-item:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.color-item.active {
  border-color: var(--td-text-color-primary);
  box-shadow: 0 0 0 2px var(--td-bg-color-container);
}

.check-icon {
  color: white;
  font-size: 16px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.custom-color {
  margin-top: 24px;
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.color-input {
  width: 60px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: none;
}

.color-input::-webkit-color-swatch {
  border: 2px solid var(--td-border-level-1-color);
  border-radius: 6px;
}

.hex-input {
  width: 120px;
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
  
  .color-input-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .hex-input {
    width: 100%;
  }
}
</style>