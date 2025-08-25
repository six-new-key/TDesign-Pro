# 微信公众号管理系统 - 开发文档

## 项目概述

本项目是一个基于 Vue 3 + Vite + TDesign 的现代化管理后台系统，专为微信公众号管理而设计。采用组合式 API、TypeScript 支持、响应式设计等现代前端技术栈。

## 技术架构

### 核心技术栈
- **前端框架**: Vue 3.x (Composition API)
- **构建工具**: Vite 4.x
- **UI 组件库**: TDesign Vue Next
- **HTTP 客户端**: Axios 1.7.9
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **路由管理**: Vue Router 4.x
- **图标系统**: vite-plugin-svg-icons
- **开发工具**: unplugin-auto-import, unplugin-vue-components

### 项目结构

```
src/
├── api/                # API 接口管理
│   ├── auth.js         # 认证相关接口
│   ├── user/           # 用户管理接口
│   │   └── index.js    # 用户 CRUD 接口
│   ├── role/           # 角色管理接口
│   │   └── index.js    # 角色 CRUD 接口
│   ├── menu/           # 菜单管理接口
│   │   └── index.js    # 菜单 CRUD 接口
│   ├── dictData/       # 字典数据接口
│   │   └── index.js    # 字典数据 CRUD 接口
│   ├── dictType/       # 字典类型接口
│   │   └── index.js    # 字典类型 CRUD 接口
│   └── index.js        # API 统一导出
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
├── utils/              # 工具函数
│   ├── request.js      # HTTP 请求封装
│   └── theme.js        # 主题工具函数
├── views/              # 页面组件
├── plugins/            # 自定义插件
├── assets/             # 静态资源
├── style.css           # 全局样式
├── App.vue             # 根组件
└── main.js             # 应用入口
```

## API 接口管理

### HTTP 请求封装

**位置**: `src/utils/request.js`

**功能**: 基于 Axios 的统一 HTTP 请求工具，提供请求/响应拦截、错误处理、Token 管理等功能。

**核心特性**:
- 统一的请求/响应拦截器
- 自动 Token 管理和刷新
- 统一错误处理和消息提示
- 请求超时控制（默认 10 秒）
- 支持请求取消和重复请求防护

**使用方法**:
```javascript
import { httpRequest } from '@/utils/request'

// GET 请求
const getUserList = (params) => {
  return httpRequest({
    url: '/api/users',
    method: 'GET',
    params
  })
}

// POST 请求
const createUser = (data) => {
  return httpRequest({
    url: '/api/users',
    method: 'POST',
    data
  })
}

// PUT 请求
const updateUser = (id, data) => {
  return httpRequest({
    url: `/api/users/${id}`,
    method: 'PUT',
    data
  })
}

// DELETE 请求
const deleteUser = (id) => {
  return httpRequest({
    url: `/api/users/${id}`,
    method: 'DELETE'
  })
}
```

### API 接口模块化

项目采用模块化的 API 接口管理方式，按业务功能划分不同的接口模块：

#### 1. 用户管理接口 (`src/api/user/index.js`)

**功能模块**:
- 用户认证（登录、登出、注册）
- 用户信息管理（获取、更新个人信息）
- 用户管理（CRUD 操作）
- 用户状态管理（启用/禁用）
- 密码管理（重置、修改）
- 用户角色管理

**接口示例**:
```javascript
// 用户登录
export const loginUser = (data) => {
  return httpRequest({
    url: '/api/auth/login',
    method: 'POST',
    data
  })
}

// 获取用户列表（分页）
export const getUserListPage = (params) => {
  return httpRequest({
    url: '/api/users/page',
    method: 'GET',
    params
  })
}

// 创建用户
export const createUser = (data) => {
  return httpRequest({
    url: '/api/users',
    method: 'POST',
    data
  })
}
```

#### 2. 角色管理接口 (`src/api/role/index.js`)

**功能模块**:
- 角色 CRUD 操作
- 角色状态管理
- 角色权限分配
- 角色数据回显

#### 3. 菜单管理接口 (`src/api/menu/index.js`)

**功能模块**:
- 菜单 CRUD 操作
- 菜单权限查询
- 菜单树形数据获取
- 适配 PrimeVue 框架的查询接口

#### 4. 字典管理接口

**字典类型** (`src/api/dictType/index.js`):
- 字典类型 CRUD 操作
- 字典类型状态管理
- 字典类型数据回显

**字典数据** (`src/api/dictData/index.js`):
- 字典数据 CRUD 操作
- 字典数据状态管理
- 字典标签数据查询

### API 接口开发规范

#### 1. 接口命名规范

```javascript
// 基础 CRUD 操作
export const create[Entity] = (data) => { /* 创建 */ }
export const update[Entity] = (id, data) => { /* 更新 */ }
export const delete[Entity] = (id) => { /* 删除 */ }
export const get[Entity] = (id) => { /* 获取单个 */ }
export const get[Entity]List = (params) => { /* 获取列表 */ }
export const get[Entity]ListPage = (params) => { /* 分页查询 */ }

// 批量操作
export const batchDelete[Entity] = (ids) => { /* 批量删除 */ }
export const batchUpdate[Entity] = (data) => { /* 批量更新 */ }

// 状态管理
export const update[Entity]Status = (id, status) => { /* 状态更新 */ }

// 数据回显
export const echo[Entity] = (id) => { /* 数据回显 */ }
```

#### 2. 请求参数规范

```javascript
// 分页查询参数
const pageParams = {
  page: 1,        // 页码
  size: 10,       // 每页大小
  keyword: '',    // 搜索关键词
  status: null,   // 状态筛选
  startTime: '',  // 开始时间
  endTime: ''     // 结束时间
}

// 创建/更新参数
const entityData = {
  name: '',       // 名称
  description: '', // 描述
  status: 1,      // 状态
  sort: 0         // 排序
}
```

#### 3. 响应数据格式

```javascript
// 统一响应格式
{
  "code": 200,           // 状态码
  "message": "操作成功",  // 消息
  "data": {             // 数据
    // 具体业务数据
  },
  "timestamp": 1640995200000 // 时间戳
}

// 分页响应格式
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "records": [],      // 数据列表
    "total": 100,       // 总数
    "page": 1,          // 当前页
    "size": 10,         // 每页大小
    "pages": 10         // 总页数
  }
}
```

#### 4. 错误处理

```javascript
// 在 request.js 中统一处理错误
response.interceptors.response.use(
  (response) => {
    const { code, message } = response.data
    if (code !== 200) {
      MessagePlugin.error(message || '请求失败')
      return Promise.reject(new Error(message))
    }
    return response.data
  },
  (error) => {
    const { status, data } = error.response || {}
    const message = data?.message || '网络错误'
    
    switch (status) {
      case 401:
        MessagePlugin.error('登录已过期，请重新登录')
        // 跳转到登录页
        break
      case 403:
        MessagePlugin.error('没有权限访问')
        break
      case 404:
        MessagePlugin.error('请求的资源不存在')
        break
      case 500:
        MessagePlugin.error('服务器内部错误')
        break
      default:
        MessagePlugin.error(message)
    }
    
    return Promise.reject(error)
  }
)
```

### API 接口使用示例

#### 在组件中使用 API

```vue
<template>
  <div>
    <t-table
      :data="userList"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
    >
      <!-- 表格列定义 -->
    </t-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserListPage, deleteUser } from '@/api/user'
import { MessagePlugin } from 'tdesign-vue-next'

const userList = ref([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
})

// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.value.current,
      size: pagination.value.pageSize
    }
    
    const response = await getUserListPage(params)
    userList.value = response.data.records
    pagination.value.total = response.data.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 删除用户
const handleDelete = async (userId) => {
  try {
    await deleteUser(userId)
    MessagePlugin.success('删除成功')
    fetchUserList() // 重新加载列表
  } catch (error) {
    console.error('删除用户失败:', error)
  }
}

// 分页变化处理
const handlePageChange = (pageInfo) => {
  pagination.value.current = pageInfo.current
  pagination.value.pageSize = pageInfo.pageSize
  fetchUserList()
}

onMounted(() => {
  fetchUserList()
})
</script>
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

## ECharts 图表系统详解

### ECharts 集成配置

**位置**: `src/echarts/index.js`

**功能**: ECharts 库的统一导入和配置管理。

```javascript
import * as echarts from 'echarts'

// 导出 echarts 实例
export { echarts }
export default echarts
```

**依赖版本**: `echarts: ^6.0.0`

### 图表组件使用指南

#### 基础使用流程

1. **引入 ECharts**:
```javascript
import { echarts } from '@/echarts'
```

2. **创建图表容器引用**:
```javascript
const chartRef = ref(null)
let chartInstance = null
```

3. **初始化图表**:
```javascript
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption(getChartOption())
  }
}
```

4. **响应式处理**:
```javascript
const handleResize = () => {
  chartInstance?.resize()
}

// 监听窗口大小变化
window.addEventListener('resize', handleResize)

// 监听侧边栏折叠状态变化
watch(
  () => appStore.isSidebarCollapsed,
  () => {
    setTimeout(() => {
      handleResize()
    }, 300) // 等待CSS动画完成
  }
)
```

5. **生命周期管理**:
```javascript
onMounted(async () => {
  await nextTick()
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
```

### 支持的图表类型

#### 1. 面积图 (Area Chart)

**配置示例**:
```javascript
const getAreaChartOption = () => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['流量趋势', '月访问量'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['6:00', '7:00', '8:00', ...] // 时间数据
    },
    yAxis: {
      type: 'value',
      max: 80000
    },
    series: [
      {
        name: '流量趋势',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.8)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
            ]
          }
        },
        data: [0, 15000, 25000, ...] // 数据数组
      }
    ]
  }
}
```

**特性**:
- 支持渐变填充
- 多系列数据展示
- 交互式提示框
- 图例控制

#### 2. 雷达图 (Radar Chart)

**配置示例**:
```javascript
const getRadarChartOption = () => {
  return {
    tooltip: {},
    radar: {
      indicator: [
        { name: '移动端', max: 100 },
        { name: 'PC端', max: 100 },
        { name: '平板', max: 100 },
        { name: '其他', max: 100 }
      ],
      radius: '60%'
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [80, 60, 40, 30],
            name: '访问设备',
            areaStyle: {
              color: 'rgba(64, 158, 255, 0.3)'
            },
            lineStyle: {
              color: '#409eff'
            },
            itemStyle: {
              color: '#409eff'
            }
          }
        ]
      }
    ]
  }
}
```

**特性**:
- 多维度数据展示
- 自定义指标轴
- 区域填充效果
- 颜色主题定制

#### 3. 环形图 (Doughnut Chart)

**配置示例**:
```javascript
const getDoughnutChartOption = () => {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'], // 内外半径
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 35, name: '搜索引擎', itemStyle: { color: '#409eff' } },
          { value: 25, name: '直接访问', itemStyle: { color: '#67c23a' } },
          // ...
        ]
      }
    ]
  }
}
```

**特性**:
- 环形展示
- 悬停高亮效果
- 自定义颜色
- 图例交互

#### 4. 饼图 (Pie Chart)

**配置示例**:
```javascript
const getPieChartOption = () => {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        center: ['40%', '50%'],
        data: [
          { value: 45, name: '搜索引擎', itemStyle: { color: '#67c23a' } },
          { value: 30, name: '外站', itemStyle: { color: '#409eff' } },
          { value: 25, name: '其他', itemStyle: { color: '#e6a23c' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}
```

**特性**:
- 标准饼图展示
- 阴影效果
- 垂直图例布局
- 强调样式

### 响应式图表实现

#### 容器尺寸自适应

```javascript
// 监听窗口大小变化
const handleResize = () => {
  areaChart?.resize()
  radarChart?.resize()
  doughnutChart?.resize()
  pieChart?.resize()
}

// 监听侧边栏状态变化
watch(
  () => appStore.isSidebarCollapsed,
  () => {
    // 延迟执行resize，等待CSS动画完成
    setTimeout(() => {
      handleResize()
    }, 300)
  }
)
```

#### CSS 响应式设计

```css
.chart-container {
  width: 100%;
  height: 400px;
}

.chart-container-small {
  width: 100%;
  height: 280px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
  
  .chart-container-small {
    height: 250px;
  }
}
```

### 图表主题和样式

#### 颜色配置

项目使用统一的颜色主题：

```javascript
const CHART_COLORS = {
  primary: '#409eff',    // 主色调
  success: '#67c23a',    // 成功色
  warning: '#e6a23c',    // 警告色
  danger: '#f56c6c',     // 危险色
  info: '#909399'        // 信息色
}
```

#### 渐变效果

```javascript
// 线性渐变配置
const getLinearGradient = (color1, color2) => {
  return {
    type: 'linear',
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: color1 },
      { offset: 1, color: color2 }
    ]
  }
}
```

### 性能优化建议

#### 1. 图表实例管理

```javascript
// 正确的实例销毁
onUnmounted(() => {
  chartInstance?.dispose()
  chartInstance = null
})
```

#### 2. 数据更新优化

```javascript
// 增量更新而非重新创建
const updateChartData = (newData) => {
  if (chartInstance) {
    chartInstance.setOption({
      series: [{
        data: newData
      }]
    }, false, true) // 不合并，静默更新
  }
}
```

#### 3. 事件监听器清理

```javascript
// 确保清理所有事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.off('click') // 清理图表事件
  chartInstance?.dispose()
})
```

### 常见问题和解决方案

#### 1. 图表不显示

**原因**: 容器尺寸为0或初始化时机不当

**解决方案**:
```javascript
// 确保在DOM渲染完成后初始化
onMounted(async () => {
  await nextTick()
  initChart()
})

// 确保容器有明确的宽高
.chart-container {
  width: 100%;
  height: 400px; /* 明确指定高度 */
}
```

#### 2. 图表不响应容器尺寸变化

**原因**: 未调用resize方法

**解决方案**:
```javascript
// 监听所有可能的尺寸变化事件
watch(
  () => appStore.isSidebarCollapsed,
  () => {
    setTimeout(() => {
      chartInstance?.resize()
    }, 300)
  }
)
```

#### 3. 内存泄漏

**原因**: 图表实例未正确销毁

**解决方案**:
```javascript
// 组件销毁时清理资源
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  chartInstance = null
})
```

### 扩展图表类型

如需添加新的图表类型，请遵循以下步骤：

1. **创建配置函数**:
```javascript
const getNewChartOption = () => {
  return {
    // ECharts配置
  }
}
```

2. **添加初始化逻辑**:
```javascript
if (newChartRef.value) {
  newChart = echarts.init(newChartRef.value)
  newChart.setOption(getNewChartOption())
}
```

3. **包含在响应式处理中**:
```javascript
const handleResize = () => {
  // 其他图表...
  newChart?.resize()
}
```

4. **添加销毁逻辑**:
```javascript
onUnmounted(() => {
  // 其他清理...
  newChart?.dispose()
})
```

## 扩展开发

### 添加新的 API 接口模块
1. **创建接口文件**:
   ```bash
   # 在 src/api 下创建新的业务模块文件夹
   mkdir src/api/newModule
   touch src/api/newModule/index.js
   ```

2. **定义接口函数**:
   ```javascript
   // src/api/newModule/index.js
   import { httpRequest } from '@/utils/request'
   
   // 获取列表（分页）
   export const getNewModuleListPage = (params) => {
     return httpRequest({
       url: '/api/newModule/page',
       method: 'GET',
       params
     })
   }
   
   // 创建
   export const createNewModule = (data) => {
     return httpRequest({
       url: '/api/newModule',
       method: 'POST',
       data
     })
   }
   
   // 更新
   export const updateNewModule = (id, data) => {
     return httpRequest({
       url: `/api/newModule/${id}`,
       method: 'PUT',
       data
     })
   }
   
   // 删除
   export const deleteNewModule = (id) => {
     return httpRequest({
       url: `/api/newModule/${id}`,
       method: 'DELETE'
     })
   }
   ```

3. **在统一导出文件中注册**:
   ```javascript
   // src/api/index.js
   export * as newModule from './newModule'
   ```

4. **在组件中使用**:
   ```javascript
   import { getNewModuleListPage } from '@/api/newModule'
   // 或者
   import { newModule } from '@/api'
   ```

### 添加新页面
1. 在 `src/views` 创建页面组件
2. 在 `src/router/routes.js` 添加路由配置
3. 更新菜单图标和标题
4. 集成相应的 API 接口
5. 测试页面功能和导航

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

### API 接口调试

#### 1. 开发环境配置
```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

#### 2. 环境变量配置
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=微信公众号管理系统（开发环境）

# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=微信公众号管理系统
```

#### 3. 接口测试
```javascript
// 在浏览器控制台中测试接口
import { getUserListPage } from '@/api/user'

// 测试获取用户列表
getUserListPage({ page: 1, size: 10 })
  .then(response => {
    console.log('接口响应:', response)
  })
  .catch(error => {
    console.error('接口错误:', error)
  })
```

---

本文档涵盖了项目的核心架构、组件实现和开发规范。如有疑问或需要补充，请及时更新文档内容。