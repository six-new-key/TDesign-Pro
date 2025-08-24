<template>
    <t-drawer v-model:visible="visible" title="主题设置" placement="right" size="330px" :show-overlay="true"
        :close-on-overlay-click="true" :footer="true" class="theme-drawer">
        <template #footer>
            <div class="theme-actions">
                <t-button theme="default" variant="base" @click="handleReset" size="medium" class="action-button">
                    重置主题
                </t-button>
                <t-button theme="primary" @click="handleApply" size="medium" class="action-button">
                    应用主题
                </t-button>
            </div>
        </template>
        <div class="theme-drawer-content">
            <!-- 主题模式设置 -->
            <div class="setting-section">
                <h4 class="section-title">
                    <t-icon name="palette" class="section-icon" />
                    主题模式
                </h4>
                <div class="theme-mode-options">
                    <div v-for="mode in themeModes" :key="mode.value" class="theme-mode-item"
                        :class="{ active: appStore.themeMode === mode.value }"
                        @click="handleThemeModeChange(mode.value)">
                        <t-icon :name="mode.icon" class="mode-icon" />
                        <span class="mode-label">{{ mode.label }}</span>
                        <t-icon v-if="appStore.themeMode === mode.value" name="check" class="check-icon" />
                    </div>
                </div>
            </div>

            <!-- 主色调设置 -->
            <div class="setting-section">
                <h4 class="section-title">
                    <t-icon name="palette" class="section-icon" />
                    主色调
                </h4>

                <!-- 预设颜色 -->
                <div class="preset-colors">
                    <div v-for="color in presetColors" :key="color.value" class="color-item"
                        :class="{ active: appStore.primaryColor === color.value }"
                        :style="{ backgroundColor: color.value }" @click="handlePrimaryColorChange(color.value)">
                        <t-icon v-if="appStore.primaryColor === color.value" name="check" class="color-check" />
                    </div>
                </div>

                <!-- 自定义颜色 -->
                <div class="custom-color-section">
                    <h4 class="section-title">
                        <t-icon name="palette" class="section-icon" />
                        自定义颜色
                    </h4>
                    <t-color-picker v-model="customColor" :color-modes="['monochrome']" size="small"
                        @change="handleCustomColorChange" class="color-picker" />
                </div>
            </div>
        </div>
    </t-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { THEME_MODE, PRESET_COLORS } from '@/utils/theme'

// Props
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Store
const appStore = useAppStore()

// 响应式数据
const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const customColor = ref(appStore.primaryColor)

// 主题模式选项
const themeModes = [
    { value: THEME_MODE.LIGHT, label: '浅色', icon: 'sunny' },
    { value: THEME_MODE.DARK, label: '深色', icon: 'moon' },
    { value: THEME_MODE.AUTO, label: '跟随系统', icon: 'desktop' }
]

// 预设颜色
const presetColors = Object.entries(PRESET_COLORS).map(([name, value]) => ({
    value,
    label: name,
    name
}))

// 方法
const handleThemeModeChange = (mode) => {
    appStore.setThemeMode(mode)
}

const handlePrimaryColorChange = (color) => {
    // alert(color)
    appStore.setPrimaryColor(color)
}

// 将rgb格式转换为十六进制格式
const rgbToHex = (rgb) => {
    if (typeof rgb === 'string' && rgb.startsWith('#')) {
        return rgb // 已经是十六进制格式
    }

    if (typeof rgb === 'string' && rgb.startsWith('rgb')) {
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (match) {
            const r = parseInt(match[1])
            const g = parseInt(match[2])
            const b = parseInt(match[3])
            return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        }
    }

    return rgb // 返回原值
}

const handleCustomColorChange = (color) => {
    // alert(color)
    // 如果传入了颜色参数，使用该参数；否则使用当前customColor值
    const colorValue = color || customColor.value
    const hexColor = rgbToHex(colorValue)

    if (hexColor && /^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
        appStore.setPrimaryColor(hexColor)
    }
}

const handleReset = () => {
    // 重置为默认主题色
    const defaultColor = '#0052d9'
    appStore.setPrimaryColor(defaultColor)
    // 关闭抽屉
    visible.value = false
}

const handleApply = () => {
    // 主题变化是实时应用的，这里只需要关闭抽屉
    visible.value = false
}

// 监听主色调变化
watch(() => appStore.primaryColor, (newColor) => {
    customColor.value = newColor
})

// 导出方法和数据
defineExpose({
    visible,
    customColor,
    handleCustomColorChange,
    handleReset,
    handleApply,
    rgbToHex
})
</script>

<style scoped>
.theme-drawer-content {
    padding: 0;
    height: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
}

.setting-section {
    padding: 20px;
    border-bottom: 1px solid var(--td-border-level-1-color);
}

.setting-section:last-of-type {
    border-bottom: none;
    flex: 1;
}

.section-title {
    display: flex;
    align-items: center;
    margin: 0 0 16px 0;
    font-size: 14px;
    font-weight: bold;
    color: var(--td-text-color-primary);
}

.section-icon {
    margin-right: 8px;
    color: var(--td-text-color-secondary);
}

/* 主题模式选项 */
.theme-mode-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.theme-mode-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid var(--td-border-level-1-color);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--td-bg-color-container);
}

.theme-mode-item:hover {
    border-color: var(--td-brand-color);
    background: var(--td-bg-color-container-hover);
}

.theme-mode-item.active {
    border-color: var(--td-brand-color);
}

.mode-icon {
    margin-right: 12px;
    font-size: 16px;
    color: var(--td-text-color-secondary);
}

.theme-mode-item.active .mode-icon {
    color: var(--td-brand-color);
}

.mode-label {
    flex: 1;
    font-size: 14px;
    color: var(--td-text-color-primary);
}

.check-icon {
    color: var(--td-brand-color);
    font-size: 16px;
}

/* 预设颜色 */
.preset-colors {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 16px;
}

.color-item {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    border: 2px solid transparent;
    transition: all 0.2s;
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
    box-shadow: 0 0 0 2px var(--td-bg-color-container), 0 0 0 4px var(--td-brand-color);
}

.color-check {
    color: white;
    font-size: 16px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 自定义颜色 */
.custom-color-section {
    margin-top: 16px;
}

.color-picker {
    width: 100%;
}

.theme-actions {
    display: flex;
    gap: 12px;
    width: 100%;
}

.action-button {
    flex: 1;
}
</style>