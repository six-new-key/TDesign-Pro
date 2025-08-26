<template>
    <t-drawer v-model:visible="visible" title="主题设置" placement="right" size="320px" :show-overlay="true"
        :close-on-overlay-click="true" :footer="true" class="theme-drawer">
        <div class="theme-drawer-content">
            <!-- 主题模式设置 -->
            <div class="setting-section">
                <h4 class="section-title">
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

            <!-- 界面显示设置 -->
            <div class="setting-section">
                <h4 class="section-title">
                    界面显示
                </h4>
                <div class="ui-control-options">
                    <!-- 侧边栏主题控制 -->
                    <div class="ui-control-item">
                        <div class="control-info">
                            <t-icon :name="appStore.sidebarTheme === 'dark' ? 'sunny' : 'moon'" class="control-icon" />
                            <span class="control-label">侧边栏主题</span>
                        </div>
                        <t-switch v-model="sidebarThemeSwitch" @change="handleSidebarThemeChange" size="medium" />
                    </div>

                    <!-- 面包屑导航控制 -->
                    <div class="ui-control-item">
                        <div class="control-info">
                            <t-icon name="location" class="control-icon" />
                            <span class="control-label">面包屑导航</span>
                        </div>
                        <t-switch v-model="appStore.showBreadcrumb" @change="handleBreadcrumbChange" size="medium" />
                    </div>

                    <!-- 页签组件控制 -->
                    <div class="ui-control-item">
                        <div class="control-info">
                            <t-icon name="view-module" class="control-icon" />
                            <span class="control-label">页面标签</span>
                        </div>
                        <t-switch v-model="appStore.showPageTags" @change="handlePageTagsChange" size="medium" />
                    </div>

                    <!-- 页签抬高效果控制 -->
                    <div class="ui-control-item">
                        <div class="control-info">
                            <t-icon name="layers" class="control-icon" />
                            <span class="control-label">页签效果</span>
                        </div>
                        <t-switch v-model="appStore.showPageTagsElevation" @change="handlePageTagsElevationChange"
                            size="medium" />
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="theme-actions">

                <t-button theme="primary" @click="handleApply" size="medium" class="action-button">
                    应用主题
                </t-button>
            </div>
        </template>
    </t-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { THEME_MODE } from '@/utils/theme'

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

// 主题模式选项
const themeModes = [
    { value: THEME_MODE.LIGHT, label: '浅色', icon: 'sunny' },
    { value: THEME_MODE.DARK, label: '深色', icon: 'moon' },
    { value: THEME_MODE.AUTO, label: '系统', icon: 'desktop' }
]

// 侧边栏主题开关状态
const sidebarThemeSwitch = computed({
    get: () => appStore.sidebarTheme === 'dark',
    set: (value) => {
        appStore.setSidebarTheme(value ? 'dark' : 'light')
    }
})

// 方法
const handleThemeModeChange = (mode) => {
    appStore.setThemeMode(mode)
}

// 处理面包屑导航开关变化
const handleBreadcrumbChange = (value) => {
    appStore.setBreadcrumbVisible(value)
}

// 处理侧边栏主题开关变化
const handleSidebarThemeChange = (value) => {
    appStore.setSidebarTheme(value ? 'dark' : 'light')
}

// 处理页签组件开关变化
const handlePageTagsChange = (value) => {
    appStore.setPageTagsVisible(value)
}

// 处理页签抬高效果开关变化
const handlePageTagsElevationChange = (value) => {
    appStore.setPageTagsElevation(value)
}

const handleApply = () => {
    // 主题变化是实时应用的，这里只需要关闭抽屉
    visible.value = false
}



// 导出方法和数据
defineExpose({
    visible,
    handleApply
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

/* 隐藏滚动条 */
.theme-drawer-content::-webkit-scrollbar {
    display: none;
}

.setting-section {
    padding: 0;
}

.setting-section:last-of-type {
    border-bottom: none;
    flex: 1;
}

.section-title {
    display: flex;
    align-items: center;
    font-size: 15px;
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
    padding: 15px;
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

/* 界面控制选项 */
.ui-control-options {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.ui-control-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
}

.control-info {
    display: flex;
    align-items: center;
    flex: 1;
}

.control-icon {
    margin-right: 12px;
    font-size: 16px;
    color: var(--td-text-color-secondary);
}

.control-label {
    font-size: 14px;
    color: var(--td-text-color-primary);
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