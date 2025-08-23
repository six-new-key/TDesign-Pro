import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import router from './router'
import pinia from './store'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(TDesign)
app.use(pinia)
app.use(router)
app.mount('#app')
