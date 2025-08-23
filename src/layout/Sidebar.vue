<template>
  <t-aside :width="sidebarWidth">
    <t-menu v-model:value="activeMenu" v-model:expanded="expandedKeys" :collapsed="collapsed" :theme="sidebarTheme"
      :width="collapsed ? '64px' : '230px'" :default-value="'/home'" class="sidebar-menu" @change="handleMenuChange">
      <!-- Logo插槽 -->
      <template #logo>
        <div class="logo-section" :class="{ 'logo-section-collapsed': collapsed }">
          <img src="/vite.svg" alt="Logo" class="logo" />
          <span v-if="!collapsed" class="system-title" :class="`system-title--${sidebarTheme}`"
            :style="{ color: getTextColor() }">微信公众号管理后台</span>
        </div>
      </template>
      <!-- 动态渲染菜单 -->
      <template v-for="route in menuRoutes" :key="route.name">
        <!-- 一层菜单 -->
        <t-menu-item v-if="!route.children" :value="route.path">
          <template #icon>
            <t-icon :name="route.meta?.icon || 'default'" />
          </template>
          {{ route.meta?.title || route.name }}
        </t-menu-item>

        <!-- 二层菜单 -->
        <t-submenu v-else-if="route.children && !hasThirdLevel(route)" :value="route.path"
          :title="route.meta?.title || route.name">
          <template #icon>
            <t-icon :name="route.meta?.icon || 'default'" />
          </template>
          <t-menu-item v-for="child in route.children" :key="child.name" :value="child.path">
            <template #icon>
              <t-icon :name="child.meta?.icon || 'default'" />
            </template>
            {{ child.meta?.title || child.name }}
          </t-menu-item>
        </t-submenu>

        <!-- 三层菜单 -->
        <t-submenu v-else-if="route.children && hasThirdLevel(route)" :value="route.path"
          :title="route.meta?.title || route.name">
          <template #icon>
            <t-icon :name="route.meta?.icon || 'default'" />
          </template>
          <template v-for="child in route.children" :key="child.name">
            <t-submenu :value="child.path" :title="child.meta?.title || child.name">
              <template #icon>
                <t-icon :name="child.meta?.icon || 'default'" />
              </template>
              <t-menu-item v-for="grandChild in child.children" :key="grandChild.name" :value="grandChild.path">
                <template #icon>
                  <t-icon :name="grandChild.meta?.icon || 'default'" />
                </template>
                {{ grandChild.meta?.title || grandChild.name }}
              </t-menu-item>
            </t-submenu>
          </template>
        </t-submenu>
      </template>
      <!-- Operations插槽 -->
      <template #operations>
        <div class="sidebar-operations">
          <!-- 收缩按钮 -->
          <t-tooltip :content="collapsed ? '展开' : '收缩'">
            <t-button shape="square" variant="text" ghost @click="toggleSidebar" :style="{ color: getTextColor() }">
              <template #icon>
                <t-icon name="view-list" />
              </template>
            </t-button>
          </t-tooltip>

          <!-- 菜单栏主题切换按钮 -->
          <t-tooltip v-if="!collapsed" :content="sidebarTheme === 'dark' ? '明亮' : '暗黑'">
            <t-button shape="square" variant="text" ghost @click="toggleSidebarTheme" :style="{ color: getTextColor() }">
              <template #icon>
                <t-icon :name="sidebarTheme === 'dark' ? 'sunny' : 'moon'" />
              </template>
            </t-button>
          </t-tooltip>
        </div>
      </template>
    </t-menu>
  </t-aside>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { constantRoutes } from '@/router/routes'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

// 侧边栏折叠状态从store获取
const collapsed = computed(() => appStore.isSidebarCollapsed)

// 菜单栏主题状态从store获取
const sidebarTheme = computed(() => appStore.sidebarTheme)

// 全局主题状态从store获取
const globalTheme = computed(() => appStore.theme)

// 菜单路由数据
const menuRoutes = computed(() => {
  // 过滤掉登录页面和Layout父路由，只显示Layout的children
  const layoutRoute = constantRoutes.find(route => route.name === 'Layout')
  if (layoutRoute && layoutRoute.children) {
    return layoutRoute.children.filter(route => !route.meta?.hide)
  }
  return constantRoutes.filter(route => !route.meta?.hide && route.name !== 'Login')
})

// 判断是否有三层菜单
const hasThirdLevel = (route) => {
  return route.children && route.children.some(child => child.children && child.children.length > 0)
}

// 当前激活的菜单项
const activeMenu = ref('')

// 展开的菜单项
const expandedKeys = ref([])

// 侧边栏宽度
const sidebarWidth = computed(() => {
  return collapsed.value ? '64px' : '230px'
})

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  appStore.toggleSidebarCollapsed()
}

// 切换菜单栏主题
const toggleSidebarTheme = () => {
  appStore.toggleSidebarTheme()
}

// 获取文字颜色：优先考虑全局主题，然后考虑菜单栏主题
const getTextColor = () => {
  // 如果全局主题是dark，使用暗色主题的文字颜色
  if (globalTheme.value === 'dark') {
    return 'var(--td-text-color-primary)'
  }
  // 如果全局主题是light，根据菜单栏主题决定颜色
  return sidebarTheme.value === 'dark' ? 'var(--td-text-color-anti)' : 'var(--td-text-color-primary)'
}

// 处理菜单点击
const handleMenuChange = (value) => {
  console.log('菜单切换:', value)

  // 直接使用路径进行导航
  if (value && value !== route.path) {
    router.push(value)
  }
}

// 监听路由变化，更新激活菜单
watch(() => route.path, (newPath) => {
  activeMenu.value = newPath

  // 设置展开的菜单项
  const expandedPaths = []

  // 递归查找当前路径的所有父级菜单
  const findAllParentPaths = (routes, targetPath, currentParentPath = '') => {
    for (const route of routes) {
      const fullPath = currentParentPath + route.path

      if (route.children) {
        // 检查直接子路由是否匹配
        const directMatch = route.children.some(child => {
          const childPath = currentParentPath + child.path
          return childPath === targetPath
        })

        if (directMatch) {
          expandedPaths.push(fullPath)
        }

        // 检查嵌套子路由是否匹配
        const hasNestedMatch = route.children.some(child => {
          if (child.children) {
            return child.children.some(grandChild => {
              const grandChildPath = currentParentPath + grandChild.path
              return grandChildPath === targetPath
            })
          }
          return false
        })

        if (hasNestedMatch) {
          expandedPaths.push(fullPath)
          // 找到匹配的二级菜单也要展开
          route.children.forEach(child => {
            if (child.children) {
              const childHasMatch = child.children.some(grandChild => {
                const grandChildPath = currentParentPath + grandChild.path
                return grandChildPath === targetPath
              })
              if (childHasMatch) {
                expandedPaths.push(currentParentPath + child.path)
              }
            }
          })
        }

        // 递归处理子路由
        findAllParentPaths(route.children, targetPath, currentParentPath)
      }
    }
  }

  findAllParentPaths(menuRoutes.value, newPath)
  expandedKeys.value = [...new Set(expandedPaths)] // 去重
}, { immediate: true })

onMounted(() => {
  appStore.initTheme()
})
</script>

<style scoped>
.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.t-default-menu__inner .t-menu__logo:not(:empty)) {
  border-bottom: none;
}

:deep(.t-default-menu .t-menu__operations:not(:empty)) {
  border-top: none;
}

:deep(.t-default-menu__inner .t-menu) {
  padding: 10px 14px;
}

.logo-section-collapsed {
  justify-content: center;
  gap: 0;
}

.logo {
  width: 30px;
  height: 30px;
  border-radius: 4px;
}

.system-title {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-menu {
  border: none;
  min-height: 100%;
  border-right: 1px solid var(--td-component-border);
}

.sidebar-operations {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>