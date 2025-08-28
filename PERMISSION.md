# 权限管理系统文档

## 概述

本项目实现了一套完整的基于角色的访问控制（RBAC）权限管理系统，包含用户管理、角色管理、菜单权限管理等核心功能。系统采用前后端分离架构，前端基于 Vue 3 + TDesign 构建，提供直观的权限管理界面。

## 权限管理架构

### 核心概念

- **用户（User）**：系统的使用者，可以分配多个角色
- **角色（Role）**：权限的集合，用户通过角色获得权限
- **菜单（Menu）**：系统功能的载体，包含目录、菜单、按钮三种类型
- **权限（Permission）**：对系统资源的访问控制

### 权限模型

```
用户 (User) ←→ 角色 (Role) ←→ 菜单权限 (Menu Permission)
     ↓              ↓                    ↓
  用户信息        角色信息            菜单/按钮权限
```

## 功能模块详解

### 1. 用户管理模块

**文件位置**: `src/views/permission/user/Index.vue`

#### 核心功能

- **用户列表管理**：支持分页查询、条件搜索、批量操作
- **用户信息维护**：新增、编辑、删除用户信息
- **用户状态控制**：启用/禁用用户账户
- **角色分配**：为用户分配和管理角色
- **密码管理**：重置用户密码
- **全屏适配**：支持全屏模式下的表格高度自适应

#### 主要特性

1. **搜索功能**
   - 用户名模糊搜索
   - 手机号精确搜索
   - 状态筛选（启用/禁用）

2. **表格操作**
   - 多选批量删除
   - 行内编辑、删除
   - 下拉菜单更多操作

3. **用户表单**
   - 双列网格布局
   - 表单验证（用户名、邮箱、密码等）
   - 编辑时用户名禁用

4. **角色分配界面**
   - 已分配角色展示
   - 可分配角色选择
   - 拖拽式角色管理

#### API 接口

```javascript
// 用户管理相关接口
import {
  getUserListPage,     // 分页查询用户列表
  createUser,         // 创建用户
  updateUser,         // 更新用户信息
  deleteUser,         // 删除用户
  batchDeleteUser,    // 批量删除用户
  updateUserStatus,   // 更新用户状态
  resetUserPassword,  // 重置用户密码
  getUserRoles,       // 获取用户角色
  saveUserRoles       // 保存用户角色分配
} from '@/api/user'
```

### 2. 角色管理模块

**文件位置**: `src/views/permission/role/Index.vue`

#### 核心功能

- **角色列表管理**：角色的增删改查操作
- **角色状态控制**：启用/禁用角色
- **权限分配**：为角色分配菜单权限
- **权限可视化**：树形结构展示权限分配
- **全屏适配**：支持全屏模式下的表格高度自适应

#### 权限分配功能

**组件位置**: `src/components/permission-assign/PermissionAssignDialog.vue`

1. **权限树展示**
   - 树形结构显示所有权限
   - 支持展开/收起操作
   - 虚拟滚动优化性能

2. **权限操作**
   - 全选/取消全选
   - 父子节点联动选择
   - 半屏模式支持

3. **交互优化**
   - 实时权限状态更新
   - 权限分配结果预览
   - 操作确认机制

#### API 接口

```javascript
// 角色管理相关接口
import {
  getRoleListPage,    // 分页查询角色列表
  createRole,         // 创建角色
  updateRole,         // 更新角色信息
  deleteRole,         // 删除角色
  updateRoleStatus,   // 更新角色状态
  saveRolePermission  // 保存角色权限分配
} from '@/api/role'
```

### 3. 菜单管理模块

**文件位置**: `src/views/permission/menu/Index.vue`

#### 核心功能

- **菜单树管理**：树形结构的菜单管理
- **菜单类型支持**：目录、菜单、按钮三种类型
- **层级关系控制**：严格的菜单层级约束
- **权限标识管理**：按钮级权限控制
- **全屏适配**：支持全屏模式下的表格高度自适应

#### 菜单类型说明

1. **目录（Directory）**
   - 用于组织菜单结构
   - 不对应具体页面
   - 可包含子目录和菜单

2. **菜单（Menu）**
   - 对应具体的页面组件
   - 需要配置组件路径
   - 可包含按钮权限

3. **按钮（Button）**
   - 页面内的操作权限
   - 配置权限标识
   - 不能包含子节点

#### 层级约束规则

- **表格头部新增**：只能创建顶级目录（parent = 0）
- **操作列新增**：
  - 目录下可创建：目录、菜单
  - 菜单下可创建：按钮
  - 按钮下不可创建子节点
- **编辑限制**：
  - 上级菜单不可修改
  - 菜单类型不可修改

#### 表单字段控制

```javascript
// 根据菜单类型动态显示字段
- 英文名称：按钮类型时隐藏
- 组件路径：仅菜单类型显示
- 权限标识：仅按钮类型显示
```

#### API 接口

```javascript
// 菜单管理相关接口
import {
  queryMenuList,        // 查询菜单列表
  queryMenuListByLike,  // 模糊查询菜单
  addMenu,             // 新增菜单
  updateMenu,          // 更新菜单
  deleteMenu,          // 删除菜单
  echoMenu             // 菜单数据回显
} from '@/api/menu'
```

## 权限控制机制

### 1. 路由权限控制

**文件位置**: `src/permission.js`

#### 路由守卫流程

```javascript
// 路由前置守卫逻辑
1. 检查用户Token
2. 获取用户信息和权限
3. 动态生成用户路由
4. 添加路由到路由器
5. 权限验证通过后放行
```

#### 路由分类

**常量路由** (`constantRoutes`):
- 登录页面
- 首页
- 404页面
- 不需要权限验证

**动态路由** (`asyncRoutes`):
- 权限管理模块
- 系统管理模块
- 需要权限验证

**任意路由** (`anyRoutes`):
- 404重定向
- 处理未匹配路由

### 2. 用户状态管理

**文件位置**: `src/store/modules/user.js`

#### 状态数据

```javascript
state: {
  userInfo: null,        // 用户基本信息
  token: null,           // 认证令牌
  menuRoutes: [],        // 用户可访问的路由
  permissions: []        // 用户权限列表
}
```

#### 核心方法

1. **登录处理** (`login`)
   - 调用登录API
   - 存储Token
   - 返回登录结果

2. **获取用户信息** (`getUserInfo`)
   - 获取用户基本信息
   - 获取用户权限列表
   - 过滤并生成用户路由
   - 动态添加路由

3. **路由过滤** (`filterAsyncRoute`)
   - 根据后端返回的路由名称
   - 过滤本地异步路由
   - 递归处理子路由

4. **退出登录** (`logout`)
   - 调用退出API
   - 清除本地状态
   - 重置路由

### 3. HTTP请求拦截

**文件位置**: `src/utils/request.js`

#### 请求拦截器

```javascript
// 自动添加Token到请求头
config.headers.Authorization = `Bearer ${token}`
```

#### 响应拦截器

```javascript
// 处理Token过期
if (response.code === 401) {
  // 清除Token，跳转登录页
  userStore.logout()
  router.push('/login')
}
```

## 界面优化功能

### 全屏适配功能

所有权限管理页面都支持全屏模式下的表格高度自适应：

#### 实现原理

1. **全屏状态监听**
   ```javascript
   // 监听浏览器全屏状态变化
   const handleFullscreenChange = () => {
     isFullscreen.value = !!document.fullscreenElement
   }
   
   // 注册事件监听器
   document.addEventListener('fullscreenchange', handleFullscreenChange)
   ```

2. **动态高度计算**
   ```javascript
   // 根据全屏状态动态设置表格高度
   const tableMaxHeight = computed(() => {
     return isFullscreen.value ? undefined : 420
   })
   ```

3. **生命周期管理**
   ```javascript
   onMounted(() => {
     // 初始化全屏状态
     isFullscreen.value = !!document.fullscreenElement
     // 注册事件监听器
     document.addEventListener('fullscreenchange', handleFullscreenChange)
   })
   
   onUnmounted(() => {
     // 清理事件监听器
     document.removeEventListener('fullscreenchange', handleFullscreenChange)
   })
   ```

#### 适配页面

- 用户管理页面 (`src/views/permission/user/Index.vue`)
- 角色管理页面 (`src/views/permission/role/Index.vue`)
- 菜单管理页面 (`src/views/permission/menu/Index.vue`)

## 开发规范

### 1. API接口规范

#### 命名规范

```javascript
// 基础CRUD操作
export const create[Entity] = (data) => { /* 创建 */ }
export const update[Entity] = (id, data) => { /* 更新 */ }
export const delete[Entity] = (id) => { /* 删除 */ }
export const get[Entity] = (id) => { /* 获取单个 */ }
export const get[Entity]List = (params) => { /* 获取列表 */ }
export const get[Entity]ListPage = (params) => { /* 分页查询 */ }

// 状态管理
export const update[Entity]Status = (id, status) => { /* 状态更新 */ }
export const batch[Operation][Entity] = (ids) => { /* 批量操作 */ }
```

#### 响应格式

```javascript
// 统一响应格式
{
  code: 200,           // 状态码
  message: 'success',  // 响应消息
  data: {},           // 响应数据
  timestamp: 1234567890 // 时间戳
}
```

### 2. 组件开发规范

#### 文件结构

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
// 导入依赖
// 响应式数据定义
// 计算属性
// 生命周期钩子
// 业务方法
</script>

<style scoped>
/* 组件样式 */
</style>
```

#### 响应式数据组织

```javascript
// 加载状态
const loading = ref(false)
const submitLoading = ref(false)

// 表格数据
const tableData = ref([])
const selectedRowKeys = ref([])

// 表单数据
const formData = reactive({})
const formRules = reactive({})

// 对话框状态
const dialogVisible = ref(false)
const isEdit = ref(false)
```

### 3. 权限验证规范

#### 页面级权限

```javascript
// 路由元信息配置
meta: {
  title: '页面标题',
  icon: '图标名称',
  hide: false,        // 是否隐藏菜单
  permission: 'user:list' // 权限标识
}
```

#### 按钮级权限

```vue
<!-- 使用v-if进行权限控制 -->
<t-button v-if="hasPermission('user:add')" @click="handleAdd">
  新增用户
</t-button>
```

## 部署说明

### 1. 环境配置

#### 开发环境

```env
NODE_ENV = 'development'
VITE_APP_BASE_API = '/api'
VITE_DEV_SERVE = 'http://localhost:9101'
```

#### 生产环境

```env
NODE_ENV = 'production'
VITE_APP_BASE_API = '/api'
VITE_PROD_SERVE = 'http://localhost:9900'
```

### 2. 构建部署

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 生产环境构建
npm run build

# 预览构建结果
npm run preview
```

## 常见问题

### 1. 权限相关问题

**Q: 用户登录后看不到菜单？**
A: 检查用户是否分配了角色，角色是否分配了菜单权限。

**Q: 页面刷新后出现白屏？**
A: 确保在路由守卫中正确处理了动态路由的添加。

**Q: 权限修改后不生效？**
A: 需要重新登录或刷新页面以获取最新权限。

### 2. 界面相关问题

**Q: 全屏模式下表格显示异常？**
A: 检查是否正确实现了全屏状态监听和表格高度自适应。

**Q: 表单验证不生效？**
A: 确保表单规则配置正确，并在提交时调用表单验证方法。

### 3. 开发相关问题

**Q: API请求失败？**
A: 检查请求拦截器中的Token配置和后端接口地址。

**Q: 组件自动导入失败？**
A: 确保vite.config.js中正确配置了自动导入插件。

## 更新日志

### v1.0.0 (2024-01-XX)

- ✨ 实现完整的RBAC权限管理系统
- ✨ 新增用户管理模块
- ✨ 新增角色管理模块
- ✨ 新增菜单管理模块
- ✨ 实现权限分配功能
- ✨ 添加全屏适配功能
- 🐛 修复菜单层级约束问题
- 🐛 修复全屏状态监听器数量不一致问题
- 💄 优化权限分配界面交互
- 📝 完善权限管理文档

---

**文档维护**: 开发团队  
**最后更新**: 2024年1月  
**版本**: v1.0.0