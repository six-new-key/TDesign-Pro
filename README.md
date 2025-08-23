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
- 系统概览
- 数据统计展示
- 快捷操作入口

### 📊 控制台模块
- 实时数据监控
- 系统状态展示
- 操作日志记录

### 👥 用户管理模块
- **用户列表**：用户信息管理
- **角色管理**：权限角色配置

### 📝 内容管理模块
- **文章管理**
  - 文章列表：查看和管理所有文章
  - 创建文章：富文本编辑器支持
  - 编辑文章：文章内容修改
  - 文章分类：内容分类管理
- **媒体管理**
  - 图片管理：图片上传和管理
  - 视频管理：视频文件管理

### 📈 营销管理模块
- **活动管理**：营销活动创建和管理
- **优惠券管理**：优惠券发放和使用
- **数据分析**：营销效果分析

### 💰 财务管理模块
- **收入管理**：收入记录和统计
- **支出管理**：支出记录和分析
- **财务报表**：财务数据报表

### ⚙️ 系统管理模块
- **系统配置**：系统参数设置
- **系统日志**：操作日志查看
- **数据备份**：数据备份和恢复

### 📄 关于页面
- 系统信息展示
- 版本信息
- 联系方式

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

### PageTags 组件
- 多标签页管理
- 标签拖拽排序
- 标签右键菜单
- 标签持久化存储

### SearchDialog 组件
- 全局搜索功能
- 键盘快捷键支持
- 搜索结果高亮
- 历史搜索记录

### SvgIcon 组件
- SVG 图标渲染
- 动态图标加载
- 图标样式定制

## 📦 状态管理

### App Store
- 应用主题管理
- 页面标题管理
- 页面刷新控制
- 菜单数据缓存

### User Store
- 用户信息管理
- 登录状态维护
- 用户权限控制

### Tabs Store
- 页面标签管理
- 标签历史记录
- 标签操作控制

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

### 代码规范
- 使用 Vue 3 Composition API
- 遵循 ESLint 代码规范
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### 组件开发
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
// 使用 Composition API
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const count = ref(0)

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>

<style scoped>
/* 组件样式 */
</style>
```

### 状态管理
```javascript
// store/modules/example.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // state
  const data = ref([])
  
  // getters
  const dataCount = computed(() => data.value.length)
  
  // actions
  const setData = (newData) => {
    data.value = newData
  }
  
  return {
    data,
    dataCount,
    setData
  }
}, {
  persist: {
    key: 'example-store',
    storage: localStorage,
    paths: ['data']
  }
})
```

## 🚀 部署指南

### 构建优化
- 代码分割和懒加载
- 静态资源压缩
- Tree Shaking 优化
- 缓存策略配置

### 部署步骤
1. 构建生产版本：`npm run build`
2. 将 `dist` 目录部署到服务器
3. 配置 Nginx 或 Apache
4. 设置 HTTPS 和域名

### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
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
