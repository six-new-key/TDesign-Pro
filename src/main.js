import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import router from './router'
import pinia from './store'
import './style.css'
import App from './App.vue'
import 'virtual:svg-icons-register'
//引入自定义插件用来注册全局组件
import globalComponent from "@/plugins";
// 引入路由权限控制
import './router/permission'

// 引入主题系统
const app = createApp(App)

app.use(globalComponent);
app.use(TDesign)
app.use(pinia)
app.use(router)

app.mount('#app')
