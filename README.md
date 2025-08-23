# 微信公众号管理后台系统

一个基于 Vue 3 + Vite + TDesign 构建的现代化微信公众号管理后台系统，提供完整的内容管理、用户管理、财务管理等功能。

## ✨ 特性

- 🚀 **现代化技术栈**：基于 Vue 3 + Vite + TDesign 构建
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🎨 **主题切换**：支持明暗主题切换
- 🔍 **全局搜索**：快速搜索功能，支持键盘快捷键
- 📑 **页面标签**：多标签页管理，提升操作效率
- 🔐 **权限管理**：完整的用户权限控制系统
- 💾 **状态持久化**：基于 Pinia 的状态管理和持久化
- 🎯 **组件化开发**：高度模块化的组件架构

## 🛠️ 技术栈

### 核心框架
- **Vue 3.5.18** - 渐进式 JavaScript 框架
- **Vite 7.1.2** - 下一代前端构建工具
- **Vue Router 4.5.1** - Vue.js 官方路由管理器

### UI 组件库
- **TDesign Vue Next 1.15.5** - 腾讯企业级设计语言
- **TDesign Icons Vue Next 0.3.7** - TDesign 图标库

### 状态管理
- **Pinia 3.0.3** - Vue 的状态管理库
- **Pinia Plugin Persistedstate 4.5.0** - Pinia 持久化插件

### 开发工具
- **Unplugin Auto Import 20.0.0** - 自动导入插件
- **Unplugin Vue Components 29.0.0** - 组件自动导入
- **Vite Plugin SVG Icons 2.0.1** - SVG 图标插件
- **Fast Glob 3.3.3** - 文件匹配工具

## 📁 项目结构

```
wxgzh_admin_ui/
├── public/                     # 静态资源目录
│   └── vite.svg               # 网站图标
├── src/                       # 源代码目录
│   ├── assets/                # 静态资源
│   │   ├── icons/            # SVG 图标
│   │   └── vue.svg           # Vue 图标
│   ├── components/            # 公共组件
│   │   ├── custom/           # 自定义组件
│   │   ├── page-tags/        # 页面标签组件
│   │   └── search-dialog/    # 搜索对话框组件
│   ├── layout/               # 布局组件
│   │   ├── Header.vue        # 顶部导航
│   │   ├── MainLayout.vue    # 主布局
│   │   └── Sidebar.vue       # 侧边栏
│   ├── plugins/              # 插件配置
│   │   └── index.js          # 全局组件注册
│   ├── router/               # 路由配置
│   │   ├── index.js          # 路由实例
│   │   └── routes.js         # 路由定义
│   ├── store/                # 状态管理
│   │   ├── index.js          # Pinia 实例
│   │   └── modules/          # 状态模块
│   │       ├── app.js        # 应用状态
│   │       ├── tabs.js       # 标签页状态
│   │       └── user.js       # 用户状态
│   ├── style/                # 样式文件
│   ├── utils/                # 工具函数
│   ├── views/                # 页面组件
│   │   ├── about/            # 关于页面
│   │   ├── content/          # 内容管理
│   │   ├── dashboard/        # 控制台
│   │   ├── finance/          # 财务管理
│   │   ├── home/             # 首页
│   │   ├── login/            # 登录页面
│   │   ├── marketing/        # 营销管理
│   │   ├── system/           # 系统管理
│   │   └── user/             # 用户管理
│   ├── App.vue               # 根组件
│   ├── main.js               # 应用入口
│   └── style.css             # 全局样式
├── .env.development          # 开发环境配置
├── .env.production           # 生产环境配置
├── .gitignore                # Git 忽略文件
├── index.html                # HTML 模板
├── package.json              # 项目配置
├── README.md                 # 项目说明
└── vite.config.js            # Vite 配置
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发环境运行
```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产版本
```bash
npm run preview
# 或
yarn preview
```

## 🔧 配置说明

### 环境变量

#### 开发环境 (.env.development)
```env
NODE_ENV = 'development'
VITE_APP_BASE_API = '/api'
VITE_DEV_SERVE = 'http://localhost:9101'
```

#### 生产环境 (.env.production)

```env
NODE_ENV = 'production'
VITE_APP_BASE_API = '/api'
VITE_PROD_SERVE = 'http://localhost:9900'
```

### Vite 配置特性
- **路径别名**：`@` 指向 `src` 目录
- **自动导入**：TDesign 组件和 API 自动导入
- **SVG 图标**：支持 SVG 图标自动注册
- **开发代理**：API 请求代理到后端服务

## 📋 功能模块

### 🏠 首页模块
- **系统概览**：展示系统基本信息和使用说明
- **快捷操作**：提供常用功能的快速入口
- **欢迎界面**：友好的用户引导界面

### 📊 控制台模块
- **数据仪表板**：系统运行状态监控
- **统计图表**：数据可视化展示
- **实时监控**：系统性能实时监控

### 👥 用户管理模块
- **用户列表**：用户信息的增删改查
  - 用户基本信息管理
  - 用户状态控制（启用/禁用）
  - 用户权限分配
- **角色管理**：系统角色和权限配置
  - 角色创建和编辑
  - 权限分配和管理
  - 角色用户关联

### 📝 内容管理模块
- **文章管理**
  - **文章列表**：文章的查看、编辑、删除
  - **创建文章**：支持富文本编辑
  - **文章分类**：内容分类体系管理
  - 文章状态管理（草稿/发布/下线）
  - 文章标签和关键词管理
- **媒体管理**
  - **图片管理**：图片上传、预览、删除
  - **视频管理**：视频文件管理和播放
  - 媒体文件分类和搜索
  - 媒体库容量管理

### 📈 营销管理模块
- **营销活动**：活动策划和执行管理
  - 活动创建和配置
  - 活动效果跟踪
  - 参与用户统计
- **客户管理**：客户信息和关系维护
  - 客户档案管理
  - 客户分组和标签
  - 客户行为分析
- **营销分析**：数据分析和报表
  - 营销效果统计
  - ROI 分析报告
  - 用户转化漏斗

### 💰 财务管理模块
- **收入管理**：收入记录和统计分析
  - 收入来源分类
  - 收入趋势分析
  - 收入预测和目标管理
- **支出管理**：支出记录和成本控制
  - 支出分类和标签
  - 预算管理和控制
  - 成本分析报告
- **财务报表**：综合财务数据报表
  - 收支明细报表
  - 利润分析报表
  - 财务健康度评估

### ⚙️ 系统管理模块
- **系统配置**：系统参数和功能配置
  - 基础参数设置
  - 功能开关控制
  - 系统主题和界面配置
- **系统日志**：操作记录和审计
  - 用户操作日志
  - 系统错误日志
  - 安全审计记录
- **数据备份**：数据安全和恢复
  - 自动备份策略
  - 手动备份操作
  - 数据恢复功能

### 📄 关于页面
- **系统信息**：版本信息和技术栈
- **使用帮助**：功能使用指南
- **联系支持**：技术支持和反馈渠道

## 🎨 UI 特性

### 主题系统
- **明暗主题切换**：支持 light/dark 主题
- **侧边栏主题**：独立的侧边栏主题配置
- **主题持久化**：主题选择自动保存

### 布局特性
- **响应式布局**：适配不同屏幕尺寸
- **侧边栏折叠**：可折叠的导航菜单
- **面包屑导航**：清晰的页面层级导航
- **页面标签**：多标签页管理
- **全屏模式**：支持全屏显示

### 交互特性
- **全局搜索**：Ctrl+K 快捷键唤起搜索
- **页面切换动画**：流畅的页面过渡效果
- **加载状态**：友好的加载提示
- **错误处理**：完善的错误提示机制

## 🔍 核心组件

### PageTags 页面标签组件
**功能特性：**
- **标签管理**：显示已访问页面的标签列表
- **标签操作**：支持标签切换、关闭单个标签、关闭其他标签
- **标签导航**：点击标签快速跳转到对应页面
- **持久化存储**：标签状态自动保存，刷新后保持
- **滚动支持**：标签过多时支持水平滚动
- **当前标签高亮**：自动高亮当前激活的页面标签

**使用方法：**
```vue
<template>
  <PageTags />
</template>
```

### SearchDialog 全局搜索组件
**功能特性：**
- **全局搜索**：搜索所有可访问的菜单项和页面
- **快捷键支持**：Ctrl+K 快速打开搜索对话框
- **实时搜索**：输入时实时显示搜索结果
- **智能匹配**：支持模糊搜索和关键词匹配
- **快速导航**：点击搜索结果直接跳转到对应页面
- **键盘导航**：支持上下键选择，回车确认

**使用方法：**
```vue
<template>
  <SearchDialog v-model:visible="searchVisible" />
</template>

<script setup>
import { ref } from 'vue'
const searchVisible = ref(false)
</script>
```

### SvgIcon 图标组件
**功能特性：**
- **SVG 渲染**：高质量矢量图标显示
- **自定义样式**：支持自定义颜色、大小和样式
- **图标库管理**：统一的图标资源管理
- **响应式设计**：自适应不同屏幕尺寸
- **性能优化**：按需加载，减少资源消耗

**使用方法：**
```vue
<template>
  <SvgIcon name="user" :size="24" color="#1890ff" />
</template>
```

### LockScreenDialog 锁屏组件
**功能特性：**
- **屏幕锁定**：保护用户会话安全
- **密码验证**：输入密码解锁屏幕
- **用户信息显示**：显示当前用户头像和用户名
- **自动对焦**：打开时自动对焦到密码输入框
- **加载状态**：解锁过程中显示加载动画

**使用方法：**
```vue
<template>
  <LockScreenDialog v-model:visible="lockVisible" />
</template>
```

### UserDropdown 用户下拉菜单
**功能特性：**
- **用户信息展示**：显示用户头像、姓名等信息
- **快捷操作**：提供锁定屏幕、退出登录等操作
- **个人设置**：访问个人资料和设置页面
- **状态指示**：显示用户在线状态

**使用方法：**
```vue
<template>
  <UserDropdown />
</template>
```

## 📦 状态管理

项目使用 **Pinia** 进行状态管理，配合 `pinia-plugin-persistedstate` 实现状态持久化。

### App Store (`useAppStore`)
**管理应用全局状态和配置**

**状态属性：**
```javascript
{
  title: '微信公众号管理系统',        // 应用标题
  theme: 'light',                    // 主题模式 (light/dark)
  sidebarTheme: 'light',            // 侧边栏主题
  isPageRefreshing: false,          // 页面刷新状态
  menuItems: [],                    // 菜单项列表
  isLocked: false,                  // 锁屏状态
  lockPassword: ''                  // 锁屏密码
}
```

**主要方法：**
```javascript
// 设置应用标题
setTitle(title)

// 切换主题
toggleTheme()
setTheme(theme)

// 侧边栏主题管理
toggleSidebarTheme()
setSidebarTheme(theme)

// 页面刷新控制
setPageRefreshing(status)

// 菜单管理
setMenuItems(items)

// 锁屏功能
lockScreen(password)
unlockScreen()
```

**使用示例：**
```javascript
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

// 切换主题
appStore.toggleTheme()

// 设置菜单
appStore.setMenuItems(menuData)

// 锁定屏幕
appStore.lockScreen('123456')
```

### User Store (`useUserStore`)
**管理用户信息和认证状态**

**状态属性：**
```javascript
{
  userInfo: null,                   // 用户信息对象
  token: '',                        // 认证令牌
  permissions: [],                  // 用户权限列表
  roles: []                         // 用户角色列表
}
```

**主要方法：**
```javascript
// 用户登录
login(credentials)

// 用户登出
logout()

// 设置用户信息
setUserInfo(userInfo)

// 更新用户权限
setPermissions(permissions)

// 检查权限
hasPermission(permission)

// 检查角色
hasRole(role)
```

**使用示例：**
```javascript
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

// 用户登录
await userStore.login({
  username: 'admin',
  password: '123456'
})

// 检查权限
if (userStore.hasPermission('user:create')) {
  // 有创建用户权限
}

// 用户登出
userStore.logout()
```

### Tabs Store (`useTabsStore`)
**管理页面标签状态和导航历史**

**状态属性：**
```javascript
{
  visitedViews: [],                 // 已访问页面列表
  cachedViews: []                   // 缓存页面列表
}
```

**主要方法：**
```javascript
// 添加页面标签
addView(view)

// 移除页面标签
removeView(view)

// 移除其他标签
removeOtherViews(activeView)

// 移除左侧标签
removeLeftViews(activeView)

// 移除右侧标签
removeRightViews(activeView)

// 清空所有标签
clearAllViews()

// 初始化首页标签
initHomeTab()
```

**使用示例：**
```javascript
import { useTabsStore } from '@/store/modules/tabs'
import { useRoute } from 'vue-router'

const tabsStore = useTabsStore()
const route = useRoute()

// 添加当前页面到标签
tabsStore.addView(route)

// 关闭当前标签
tabsStore.removeView(route)

// 关闭其他标签
tabsStore.removeOtherViews(route)
```

**持久化配置：**
所有 Store 都配置了持久化存储，页面刷新后状态会自动恢复：
```javascript
// 持久化配置示例
persist: {
  key: 'app-store',
  storage: localStorage,
  paths: ['title', 'theme', 'sidebarTheme', 'isLocked', 'lockPassword']
}
```

## 🛣️ 路由系统

### 路由特性
- **嵌套路由**：支持多层级路由嵌套
- **路由守卫**：权限验证和登录检查
- **动态路由**：基于权限的动态路由生成
- **路由元信息**：丰富的路由元数据支持

### 路由结构
- **常量路由**：无需权限验证的公共路由
- **异步路由**：需要权限验证的业务路由
- **错误路由**：404 等错误页面路由

## 🔧 开发指南

### 📋 代码规范

**基础规范：**
- 使用 **ESLint + Prettier** 进行代码格式化和质量检查
- 采用 **Vue 3 Composition API** 开发模式
- 支持 **TypeScript**（可选，推荐使用）
- 遵循 **Vue 官方风格指南**

**命名规范：**
```javascript
// 组件命名：PascalCase
UserProfile.vue
SearchDialog.vue
PageTags.vue

// 文件命名：kebab-case
user-profile.vue
search-dialog.vue
page-tags.vue

// 变量和函数：camelCase
const userName = 'admin'
const getUserInfo = () => {}

// 常量：UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_COUNT = 3

// CSS 类名：kebab-case
.user-profile {}
.search-dialog {}
```

**目录结构规范：**
```
src/
├── components/          # 公共组件
│   ├── common/         # 通用组件
│   └── custom/         # 自定义组件
├── views/              # 页面组件
│   ├── user/          # 用户管理页面
│   ├── system/        # 系统管理页面
│   └── ...
├── store/              # 状态管理
│   └── modules/       # 模块化 store
├── router/             # 路由配置
├── assets/             # 静态资源
└── plugins/            # 插件配置
```

### 🧩 组件开发规范

**标准组件模板：**
```vue
<template>
  <div class="custom-component">
    <!-- 使用 TDesign 组件 -->
    <t-card :title="title" :loading="loading">
      <template #header-extra>
        <t-button @click="handleRefresh">
          <template #icon><refresh-icon /></template>
          刷新
        </t-button>
      </template>
      
      <!-- 主要内容 -->
      <div class="content">
        <slot name="content">
          <p>{{ description }}</p>
        </slot>
      </div>
      
      <!-- 操作区域 -->
      <template #footer>
        <div class="actions">
          <t-button variant="outline" @click="handleCancel">
            取消
          </t-button>
          <t-button theme="primary" @click="handleConfirm">
            确认
          </t-button>
        </div>
      </template>
    </t-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RefreshIcon } from 'tdesign-icons-vue-next'

// Props 定义（使用 TypeScript）
interface Props {
  title?: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '默认标题',
  description: '默认描述',
  disabled: false
})

// Emits 定义
interface Emits {
  confirm: [value: string]
  cancel: []
  refresh: []
}

const emit = defineEmits<Emits>()

// 响应式数据
const loading = ref(false)
const formData = ref({
  name: '',
  email: ''
})

// 计算属性
const isValid = computed(() => {
  return formData.value.name && formData.value.email
})

// 方法定义
const handleConfirm = () => {
  if (!isValid.value) return
  emit('confirm', formData.value.name)
}

const handleCancel = () => {
  emit('cancel')
}

const handleRefresh = async () => {
  loading.value = true
  try {
    // 刷新逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('refresh')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>

<style scoped>
.custom-component {
  padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-l);
}

.content {
  margin: var(--td-comp-margin-s) 0;
}

.actions {
  display: flex;
  gap: var(--td-comp-margin-s);
  justify-content: flex-end;
}
</style>
```

### 📦 状态管理规范

**Store 模块示例：**
```javascript
// store/modules/example.js
import { defineStore } from 'pinia'
import { api } from '@/api'

export const useExampleStore = defineStore('example', {
  // 状态定义
  state: () => ({
    items: [],
    loading: false,
    error: null,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  }),
  
  // 计算属性
  getters: {
    itemCount: (state) => state.items.length,
    hasItems: (state) => state.items.length > 0,
    hasError: (state) => !!state.error,
    
    // 分页信息
    paginationInfo: (state) => {
      const { current, pageSize, total } = state.pagination
      return {
        start: (current - 1) * pageSize + 1,
        end: Math.min(current * pageSize, total),
        total
      }
    }
  },
  
  // 操作方法
  actions: {
    // 获取列表数据
    async fetchItems(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.getItems({
          page: this.pagination.current,
          size: this.pagination.pageSize,
          ...params
        })
        
        this.items = response.data.list
        this.pagination.total = response.data.total
      } catch (error) {
        this.error = error.message || '获取数据失败'
        console.error('获取数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 添加项目
    async addItem(item) {
      try {
        const response = await api.createItem(item)
        this.items.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.message || '添加失败'
        throw error
      }
    },
    
    // 更新项目
    async updateItem(id, updates) {
      try {
        const response = await api.updateItem(id, updates)
        const index = this.items.findIndex(item => item.id === id)
        if (index > -1) {
          this.items[index] = { ...this.items[index], ...response.data }
        }
        return response.data
      } catch (error) {
        this.error = error.message || '更新失败'
        throw error
      }
    },
    
    // 删除项目
    async removeItem(id) {
      try {
        await api.deleteItem(id)
        const index = this.items.findIndex(item => item.id === id)
        if (index > -1) {
          this.items.splice(index, 1)
        }
      } catch (error) {
        this.error = error.message || '删除失败'
        throw error
      }
    },
    
    // 设置分页
    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
    },
    
    // 重置状态
    resetState() {
      this.items = []
      this.loading = false
      this.error = null
      this.pagination = {
        current: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  
  // 持久化配置
  persist: {
    key: 'example-store',
    storage: localStorage,
    paths: ['items', 'pagination']
  }
})
```

### 🔌 API 集成规范

**API 服务示例：**
```javascript
// api/modules/user.js
import { request } from '@/api/request'

export const userApi = {
  // 获取用户列表
  getUsers(params) {
    return request({
      url: '/users',
      method: 'GET',
      params
    })
  },
  
  // 获取用户详情
  getUserById(id) {
    return request({
      url: `/users/${id}`,
      method: 'GET'
    })
  },
  
  // 创建用户
  createUser(data) {
    return request({
      url: '/users',
      method: 'POST',
      data
    })
  },
  
  // 更新用户
  updateUser(id, data) {
    return request({
      url: `/users/${id}`,
      method: 'PUT',
      data
    })
  },
  
  // 删除用户
  deleteUser(id) {
    return request({
      url: `/users/${id}`,
      method: 'DELETE'
    })
  }
}
```

### 🎯 最佳实践

**性能优化：**
```javascript
// 1. 使用 defineAsyncComponent 异步加载组件
const AsyncComponent = defineAsyncComponent(() => 
  import('@/components/HeavyComponent.vue')
)

// 2. 使用 v-memo 优化列表渲染
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.status]">
    {{ item.name }}
  </div>
</template>

// 3. 使用 shallowRef 优化大对象
const largeData = shallowRef({})

// 4. 合理使用 computed 缓存计算结果
const expensiveValue = computed(() => {
  return heavyCalculation(props.data)
})
```

**错误处理：**
```javascript
// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err, info)
  // 发送错误报告
}

// 组件内错误处理
const handleAsyncOperation = async () => {
  try {
    loading.value = true
    const result = await someAsyncOperation()
    // 处理成功结果
  } catch (error) {
    // 处理错误
    console.error('操作失败:', error)
    // 显示用户友好的错误信息
  } finally {
    loading.value = false
  }
}
```

## 🚀 部署指南

### 📦 构建优化

**Vite 构建配置优化：**
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  // 构建配置
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 资源内联阈值
    assetsInlineLimit: 4096,
    
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    
    // 构建后是否生成 source map
    sourcemap: false,
    
    // 混淆器配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // Rollup 配置
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks: {
          // 将 Vue 相关库打包到一个 chunk
          vue: ['vue', 'vue-router', 'pinia'],
          // 将 TDesign 组件库单独打包
          tdesign: ['tdesign-vue-next'],
          // 将工具库单独打包
          utils: ['lodash-es', 'dayjs']
        },
        
        // 文件命名规则
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    }
  },
  
  // 优化配置
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'tdesign-vue-next']
  }
})
```

**性能优化策略：**
- **代码分割**：按路由和组件库进行代码分割
- **资源压缩**：启用 Gzip/Brotli 压缩
- **缓存策略**：合理设置静态资源缓存时间
- **CDN 加速**：将静态资源部署到 CDN
- **预加载优化**：关键资源预加载

### 🔧 部署步骤

**1. 环境准备**
```bash
# 确保 Node.js 版本 >= 16
node --version
npm --version

# 安装依赖
npm install
```

**2. 构建生产版本**
```bash
# 构建生产环境
npm run build

# 预览构建结果（可选）
npm run preview
```

**3. 部署到服务器**

**方式一：手动部署**
```bash
# 压缩构建文件
tar -czf dist.tar.gz dist/

# 上传到服务器
scp dist.tar.gz user@server:/var/www/

# 在服务器上解压
ssh user@server
cd /var/www/
tar -xzf dist.tar.gz
mv dist html
```

**方式二：使用 CI/CD**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/scp-action@v0.1.4
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        source: "dist/*"
        target: "/var/www/html/"
```

### 🌐 Web 服务器配置

**Nginx 配置示例：**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;
    
    # HTTPS 重定向（推荐）
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com;
    
    # SSL 证书配置
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/private.key;
    
    # 网站根目录
    root /var/www/html/dist;
    index index.html;
    
    # 安全头设置
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # 启用压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/svg+xml;
    
    # Vue Router History 模式支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存策略
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # API 代理（如果需要）
    location /api/ {
        proxy_pass http://backend-server:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 禁止访问敏感文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

**Apache 配置示例：**
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html/dist
    
    # 启用重写模块
    RewriteEngine On
    
    # Vue Router History 模式支持
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
    
    # 启用压缩
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain
        AddOutputFilterByType DEFLATE text/html
        AddOutputFilterByType DEFLATE text/xml
        AddOutputFilterByType DEFLATE text/css
        AddOutputFilterByType DEFLATE application/xml
        AddOutputFilterByType DEFLATE application/xhtml+xml
        AddOutputFilterByType DEFLATE application/rss+xml
        AddOutputFilterByType DEFLATE application/javascript
        AddOutputFilterByType DEFLATE application/x-javascript
    </IfModule>
    
    # 静态资源缓存
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/jpg "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/gif "access plus 1 year"
        ExpiresByType image/svg+xml "access plus 1 year"
    </IfModule>
</VirtualHost>
```

### 🐳 Docker 部署

**Dockerfile：**
```dockerfile
# 构建阶段
FROM node:18-alpine as build-stage

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine as production-stage

# 复制构建结果
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml：**
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    
  # 如果有后端服务
  api:
    image: your-api-image
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### 📊 性能监控

**构建分析：**
```bash
# 安装分析工具
npm install --save-dev rollup-plugin-visualizer

# 生成构建分析报告
npm run build -- --analyze
```

**运行时监控：**
```javascript
// 性能监控代码
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0]
    console.log('页面加载时间:', perfData.loadEventEnd - perfData.fetchStart)
  })
}
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

- 项目地址：[GitHub Repository]
- 问题反馈：[Issues]

---

**微信公众号管理后台系统** - 让内容管理更简单高效！
