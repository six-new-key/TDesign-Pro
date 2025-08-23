# 微信公众号管理系统 - 开发文档

## 项目概述

本项目是一个基于 Vue 3 + Vite + TDesign 的现代化管理后台系统，专为微信公众号管理而设计。采用组合式 API、TypeScript 支持、响应式设计等现代前端技术栈。

## 技术架构

### 核心技术栈
- **前端框架**: Vue 3.x (Composition API)
- **构建工具**: Vite 4.x
- **UI 组件库**: TDesign Vue Next
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **路由管理**: Vue Router 4.x
- **图标系统**: vite-plugin-svg-icons
- **开发工具**: unplugin-auto-import, unplugin-vue-components

### 项目结构

```
src/
├── components/          # 自定义组件
│   ├── custom/         # 通用自定义组件
│   ├── lock-screen/    # 锁屏相关组件
│   ├── page-tags/      # 页面标签组件
│   └── search-dialog/  # 搜索对话框组件
├── layout/             # 布局组件
│   ├── MainLayout.vue  # 主布局
│   ├── Header.vue      # 顶部导航
│   └── Sidebar.vue     # 侧边栏
├── router/             # 路由配置
│   ├── index.js        # 路由实例
│   └── routes.js       # 路由定义
├── store/              # 状态管理
│   ├── index.js        # Pinia 实例
│   └── modules/        # Store 模块
├── views/              # 页面组件
├── plugins/            # 自定义插件
├── assets/             # 静态资源
├── style.css           # 全局样式
├── App.vue             # 根组件
└── main.js             # 应用入口
```

## 自定义组件详解

### 1. SvgIcon 组件

**位置**: `src/components/custom/SvgIcon.vue`

**功能**: 统一的 SVG 图标组件，支持动态图标渲染和样式定制。

**Props**:
- `prefix` (String): xlink:href 属性值前缀，默认 '#icon-'
- `name` (String): SVG 图标名称
- `color` (String): 图标颜色
- `width` (String): 图标宽度，默认 '45px'
- `height` (String): 图标高度，默认 '45px'

**使用方法**:
```vue
<template>
  <!-- 基础使用 -->
  <SvgIcon name="home" />
  
  <!-- 自定义样式 -->
  <SvgIcon 
    name="user" 
    width="24px" 
    height="24px" 
    color="#1890ff" 
  />
</template>
```

**实现原理**:
- 使用 `vite-plugin-svg-icons` 插件自动注册 SVG 图标
- 通过 `use` 标签引用 SVG sprite 中的图标
- 支持动态样式绑定和颜色定制

### 2. UserDropdown 组件

**位置**: `src/components/custom/UserDropdown.vue`

**功能**: 用户信息下拉菜单，包含用户信息展示、快捷操作和系统功能。

**主要功能**:
- 用户头像和信息展示
- 快捷菜单（文档、GitHub、帮助等）
- 锁定屏幕功能
- 退出登录功能
- 键盘快捷键支持（Alt+L 锁屏，Alt+Q 退出）
- 点击外部区域自动关闭

**使用方法**:
```vue
<template>
  <UserDropdown />
</template>
```

**核心方法**:
- `toggleDropdown()`: 切换下拉菜单显示状态
- `handleMenuClick(item)`: 处理菜单项点击事件
- `handleLockScreen()`: 触发锁屏功能
- `handleLogout()`: 处理用户退出登录

### 3. LockScreenDialog 组件

**位置**: `src/components/lock-screen/LockScreenDialog.vue`

**功能**: 锁屏密码输入对话框，用于设置锁屏密码。

**Props**:
- `modelValue` (Boolean): 对话框显示状态

**Events**:
- `update:modelValue`: 更新显示状态
- `locked`: 锁定完成事件，传递锁定信息

**使用方法**:
```vue
<template>
  <LockScreenDialog 
    v-model="showDialog" 
    @locked="handleLocked" 
  />
</template>

<script setup>
const showDialog = ref(false)
const handleLocked = (lockData) => {
  console.log('锁屏设置完成:', lockData)
}
</script>
```

### 4. FullScreenLock 组件

**位置**: `src/components/lock-screen/FullScreenLock.vue`

**功能**: 全屏锁定界面，显示时钟和解锁功能。

**主要特性**:
- 实时时钟显示（24小时制）
- 日期和星期显示
- 密码解锁功能
- 优雅的动画效果
- 响应式设计

**核心方法**:
- `updateTime()`: 更新时间显示
- `handleUnlock()`: 处理解锁操作
- `startClock()` / `stopClock()`: 控制时钟更新

### 5. PageTags 组件

**位置**: `src/components/page-tags/PageTags.vue`

**功能**: 页面标签管理，提供多标签页导航功能。

**主要特性**:
- 动态页面标签生成
- 标签关闭功能（首页标签不可关闭）
- 水平滚动支持
- 滚动按钮显示/隐藏
- 自动滚动到当前激活标签
- 响应式布局

**核心方法**:
- `addPageTag(path, title)`: 添加页面标签
- `removePageTag(path)`: 移除页面标签
- `navigateToPage(path)`: 导航到指定页面
- `scrollToActiveTag()`: 滚动到激活标签

**使用方法**:
```vue
<template>
  <PageTags />
</template>
```

### 6. SearchDialog 组件

**位置**: `src/components/search-dialog/SearchDialog.vue`

**功能**: 全局搜索对话框，支持菜单项快速搜索和导航。

**Props**:
- `modelValue` (Boolean): 对话框显示状态

**主要特性**:
- 实时搜索功能
- 键盘快捷键支持（Ctrl+K 打开）
- ESC 键关闭
- 搜索结果高亮显示
- 点击结果直接导航

**使用方法**:
```vue
<template>
  <SearchDialog v-model="showSearch" />
</template>

<script setup>
const showSearch = ref(false)

// 通过 ref 调用组件方法
const searchDialogRef = ref()
const openSearch = () => {
  searchDialogRef.value.open()
}
</script>
```

## 布局系统详解

### MainLayout 主布局

**位置**: `src/layout/MainLayout.vue`

**功能**: 应用主布局容器，管理整体布局结构和页面切换。

**主要特性**:
- 锁屏状态检测和切换
- 页面切换动画
- 组件强制刷新机制
- 响应式布局

**布局结构**:
```
┌─────────────────────────────────────┐
│  FullScreenLock (锁屏时显示)          │
├─────────────┬───────────────────────┤
│             │  Header (顶部导航)      │
│  Sidebar    ├───────────────────────┤
│  (侧边栏)    │                      │
│             │  Main Content        │
│             │  (主内容区域)          │
│             │                      │
└─────────────┴───────────────────────┘
```

### Header 顶部导航

**位置**: `src/layout/Header.vue`

**功能**: 顶部导航栏，包含面包屑、搜索、主题切换等功能。

**主要组件**:
- 面包屑导航
- 搜索触发器
- 刷新按钮
- 主题切换按钮
- 全屏切换按钮
- 用户下拉菜单
- 页面标签组件

**核心方法**:
- `openSearchDialog()`: 打开搜索对话框
- `handleRefresh()`: 触发页面刷新
- `toggleFullscreen()`: 切换全屏模式
- `toggleGlobalTheme()`: 切换全局主题

### Sidebar 侧边栏

**位置**: `src/layout/Sidebar.vue`

**功能**: 侧边导航菜单，支持多层级菜单和主题切换。

**主要特性**:
- 动态菜单渲染（支持1-3层菜单）
- 菜单折叠/展开
- 菜单主题切换
- 路由激活状态同步
- Logo 和系统标题显示

**菜单层级支持**:
- **一层菜单**: 直接页面链接
- **二层菜单**: 带子菜单的分组
- **三层菜单**: 嵌套子菜单结构

**核心方法**:
- `toggleSidebar()`: 切换侧边栏折叠状态
- `toggleSidebarTheme()`: 切换菜单主题
- `handleMenuChange(value)`: 处理菜单点击事件
- `hasThirdLevel(route)`: 判断是否有三层菜单

## 状态管理详解

### App Store

**位置**: `src/store/modules/app.js`

**功能**: 应用全局状态管理，包含主题、锁屏、菜单等状态。

**状态属性**:
- `title`: 页面标题
- `theme`: 全局主题 ('light' | 'dark')
- `sidebarTheme`: 侧边栏主题 ('light' | 'dark')
- `shouldRefresh`: 页面刷新标志
- `menuItems`: 缓存的菜单项数据
- `isLocked`: 锁屏状态
- `lockPassword`: 锁屏密码

**主要方法**:
- `setTitle(title)`: 设置页面标题
- `setTheme(theme)` / `toggleTheme()`: 主题管理
- `setSidebarTheme(theme)` / `toggleSidebarTheme()`: 侧边栏主题管理
- `lockScreen()` / `unlockScreen()`: 锁屏状态管理
- `setLockPassword(password)` / `clearLockPassword()`: 锁屏密码管理
- `triggerRefresh()` / `resetRefresh()`: 页面刷新控制
- `initMenuItems()`: 初始化菜单数据
- `searchMenuItems(keyword)`: 搜索菜单项

**持久化配置**:
```javascript
persist: {
  key: 'app-store',
  storage: localStorage,
  paths: ['title', 'theme', 'sidebarTheme', 'isLocked', 'lockPassword']
}
```

### User Store

**位置**: `src/store/modules/user.js`

**功能**: 用户信息状态管理。

**状态属性**:
- `userInfo`: 用户信息对象

**计算属性**:
- `username`: 用户名

**主要方法**:
- `setUserInfo(info)`: 设置用户信息

### Tabs Store

**位置**: `src/store/modules/tabs.js`

**功能**: 页面标签状态管理，维护访问过的页面列表。

**状态属性**:
- `visitedPages`: 访问过的页面列表

**页面对象结构**:
```javascript
{
  path: '/home',        // 页面路径
  title: '首页',        // 页面标题
  isHome: true,        // 是否为首页
  timestamp: 0         // 访问时间戳
}
```

**主要方法**:
- `addPageTag(page)`: 添加页面标签
- `removePageTag(path)`: 移除页面标签
- `clearAllTags()`: 清空所有标签（保留首页）
- `removeOtherTags(currentPath)`: 移除其他标签
- `removeLeftTags(currentPath)` / `removeRightTags(currentPath)`: 移除左侧/右侧标签

## 路由系统详解

### 路由配置

**位置**: `src/router/routes.js`

**路由类型**:
- `constantRoutes`: 常量路由（不需要权限验证）
- `asyncRoutes`: 异步路由（需要权限验证，当前为空）
- `anyRoutes`: 通配符路由（404 处理）

**路由元信息 (meta)**:
```javascript
meta: {
  title: '页面标题',      // 页面标题
  icon: 'icon-name',     // 菜单图标
  hide: false,           // 是否在菜单中隐藏
  hidden: true           // 是否完全隐藏
}
```

**菜单层级结构**:
```javascript
// 一层菜单
{
  path: '/home',
  component: () => import('@/views/home/Home.vue'),
  meta: { title: '首页', icon: 'home' }
}

// 二层菜单
{
  path: '/user',
  redirect: '/user/list',
  meta: { title: '用户管理', icon: 'user' },
  children: [
    {
      path: '/user/list',
      component: () => import('@/views/user/UserList.vue'),
      meta: { title: '用户列表', icon: 'usergroup' }
    }
  ]
}

// 三层菜单
{
  path: '/content',
  redirect: '/content/article/list',
  meta: { title: '内容管理', icon: 'setting' },
  children: [
    {
      path: '/content/article',
      redirect: '/content/article/list',
      meta: { title: '文章管理', icon: 'edit' },
      children: [
        {
          path: '/content/article/list',
          component: () => import('@/views/content/article/ArticleList.vue'),
          meta: { title: '文章列表', icon: 'bulletpoint' }
        }
      ]
    }
  ]
}
```

### 路由守卫

当前项目未实现路由守卫，但预留了扩展空间。可以在 `src/router/index.js` 中添加：

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 权限验证逻辑
  next()
})

// 全局后置守卫
router.afterEach((to, from) => {
  // 页面访问统计等
})
```

## 功能实现详解

### 1. 主题系统

**实现原理**:
- 使用 TDesign 的主题系统
- 通过 CSS 变量实现主题切换
- 支持全局主题和侧边栏主题独立控制

**主题切换流程**:
1. 用户点击主题切换按钮
2. 调用 `appStore.toggleTheme()`
3. 更新 `document.documentElement.setAttribute('theme-mode', theme)`
4. CSS 变量自动更新，实现主题切换

**CSS 变量示例**:
```css
:root {
  --td-bg-color-container: #ffffff;
  --td-text-color-primary: #000000;
}

[theme-mode="dark"] {
  --td-bg-color-container: #1a1a1a;
  --td-text-color-primary: #ffffff;
}
```

### 2. 锁屏功能

**实现流程**:
1. 用户点击锁定屏幕
2. 显示 `LockScreenDialog` 设置密码
3. 密码保存到 `appStore.lockPassword`
4. 设置 `appStore.isLocked = true`
5. `MainLayout` 检测锁屏状态，显示 `FullScreenLock`
6. 用户输入正确密码解锁

**安全考虑**:
- 密码存储在内存中，页面刷新后清除
- 支持键盘快捷键 (Alt+L)
- 解锁后自动清除密码

### 3. 页面标签系统

**实现原理**:
- 监听路由变化自动添加标签
- 使用 `TabsStore` 管理标签状态
- 首页标签永远存在且不可关闭
- 支持标签关闭和页面导航

**标签生命周期**:
1. 用户访问新页面
2. 路由守卫触发，检查是否已存在标签
3. 不存在则添加新标签到 `visitedPages`
4. 更新激活状态和滚动位置
5. 用户关闭标签时从列表中移除

### 4. 搜索功能

**实现原理**:
- 预处理路由配置，提取所有可搜索的菜单项
- 使用模糊匹配算法搜索标题
- 支持键盘快捷键和实时搜索

**搜索流程**:
1. 用户按 Ctrl+K 或点击搜索框
2. 打开 `SearchDialog` 组件
3. 输入关键词触发实时搜索
4. 调用 `appStore.searchMenuItems(keyword)`
5. 显示匹配结果，点击直接导航

### 5. 响应式布局

**断点设计**:
- 桌面端: > 768px
- 平板端: 768px - 480px
- 移动端: < 480px

**响应式策略**:
- 侧边栏在移动端自动折叠
- 搜索框在小屏幕下调整宽度
- 页面标签支持水平滚动
- 时钟组件字体大小自适应

### 6. 动画系统

**页面切换动画**:
```css
.page-transition-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}
```

**组件动画**:
- 下拉菜单: 淡入淡出 + 位移
- 按钮悬停: 缩放 + 颜色变化
- 标签切换: 平滑滚动

## 开发规范

### 组件开发规范

1. **组件命名**: 使用 PascalCase
2. **文件结构**: 单文件组件 (.vue)
3. **Props 定义**: 明确类型和默认值
4. **事件命名**: 使用 kebab-case
5. **样式作用域**: 使用 scoped 样式

### 代码风格

1. **缩进**: 2 个空格
2. **引号**: 单引号
3. **分号**: 不使用分号
4. **命名**: camelCase (变量/函数), PascalCase (组件/类)

### Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 性能优化

### 1. 代码分割
- 路由懒加载
- 组件按需引入
- 第三方库按需加载

### 2. 构建优化
- Vite 构建优化
- 资源压缩
- Tree Shaking

### 3. 运行时优化
- 组件缓存
- 事件监听器清理
- 内存泄漏防护

## 部署指南

### 开发环境
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产构建
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 环境变量配置

**.env.development**:
```
NODE_ENV=development
VITE_APP_BASE_API=/api
VITE_DEV_SERVE=http://localhost:3000
```

**.env.production**:
```
NODE_ENV=production
VITE_APP_BASE_API=/api
VITE_PROD_SERVE=https://your-api-domain.com
```

## 常见问题

### 1. 图标不显示
- 检查 SVG 文件是否放在 `src/assets/icons` 目录
- 确认图标名称是否正确
- 检查 `vite-plugin-svg-icons` 配置

### 2. 主题切换不生效
- 检查 CSS 变量是否正确定义
- 确认 `theme-mode` 属性是否正确设置
- 检查组件是否使用了正确的 CSS 变量

### 3. 路由跳转问题
- 检查路由配置是否正确
- 确认组件是否正确导入
- 检查路由守卫逻辑

### 4. 状态持久化失效
- 检查 localStorage 是否可用
- 确认 persist 配置是否正确
- 检查 paths 配置是否包含需要持久化的字段

## 扩展开发

### 添加新页面
1. 在 `src/views` 创建页面组件
2. 在 `src/router/routes.js` 添加路由配置
3. 更新菜单图标和标题
4. 测试页面功能和导航

### 添加新组件
1. 在 `src/components` 创建组件文件
2. 定义 Props 和 Events
3. 实现组件逻辑和样式
4. 在需要的地方引入使用

### 扩展 Store 模块
1. 在 `src/store/modules` 创建新模块
2. 定义状态、计算属性和方法
3. 配置持久化选项
4. 在组件中使用 Store

---

本文档涵盖了项目的核心架构、组件实现和开发规范。如有疑问或需要补充，请及时更新文档内容。