<template>
  <div class="theme-page">
    <div class="page-header">
      <h2 class="page-title">
        <t-icon name="palette" class="title-icon" />
        主题设置
      </h2>
      <p class="page-description">
        自定义应用的外观主题，包括主题模式和主色调设置
      </p>
    </div>
    
    <div class="page-content">
      <ThemeSettings />
    </div>
  </div>
</template>

<script setup>
import ThemeSettings from '@/components/custom/ThemeSettings.vue'

// 设置页面标题
defineOptions({
  name: 'ThemePage'
})
</script>

<style scoped>
.theme-page {
  padding: 24px;
  min-height: 100vh;
  background: var(--td-bg-color-page);
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.title-icon {
  color: var(--td-brand-color);
  font-size: 32px;
}

.page-description {
  margin: 0;
  font-size: 16px;
  color: var(--td-text-color-secondary);
  line-height: 1.5;
}

.page-content {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .theme-page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .title-icon {
    font-size: 28px;
  }
  
  .page-description {
    font-size: 14px;
  }
}
</style>