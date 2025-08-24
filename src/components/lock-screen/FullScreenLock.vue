<template>
  <!-- 全屏锁定界面 -->
  <div class="lock-screen-fullscreen">
    <!-- 点击解锁提示 - 顶部居中 -->
    <div class="unlock-hint" @click="handleUnlockClick">
      <div class="lock-icon">
        <t-icon name="lock-on" size="24px" />
      </div>
      <div class="unlock-text">
        点击解锁
      </div>
    </div>

    <!-- 时钟显示 - 中间位置 -->
    <div class="clock-display">
      <div class="time-label">{{ timeLabel }}</div>
      <div class="time-container">
        <div class="time-block">
          <div class="time-number">{{ currentTime }}</div>
        </div>
        <div class="time-block">
          <div class="time-number">{{ currentMinutes }}</div>
        </div>
      </div>
    </div>

    <!-- 日期显示 - 底部居中 -->
    <div class="date-display">
      {{ currentDate }}
    </div>

    <!-- 解锁对话框 -->
    <t-dialog v-model:visible="showUnlockDialog" width="460px" :footer="false" placement="center">
      <template #header>
        <div class="unlock-header">
          <div class="unlock-avatar">
            <div class="avatar-emoji">🤓</div>
          </div>
          <div class="unlock-username">{{ userInfo.name || 'TDesign Pro' }}</div>
        </div>
      </template>

      <t-input ref="unlockPasswordRef" size="large" v-model="unlockPassword" type="password" placeholder="请输入锁屏密码"
        class="unlock-input" @enter="handleUnlock" @input="handlePasswordInput" :status="inputStatus" :tips="inputTips">
        <template #suffix-icon>
          <t-icon name="browse-off" />
        </template>
      </t-input>

      <t-space direction=vertical style="width: 100%;">
        <t-button theme="primary" size="large" block @click="handleUnlock" :loading="isUnlocking" class="unlock-button">
          进入系统
        </t-button>
        <t-button theme="default" size="large" block @click="handleClose" class="close-button">
          返回登录
        </t-button>
      </t-space>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { MessagePlugin } from 'tdesign-vue-next'

const userStore = useUserStore()
const appStore = useAppStore()

// 解锁相关
const showUnlockDialog = ref(false)
const unlockPassword = ref('')
const isUnlocking = ref(false)
const unlockPasswordRef = ref(null)

// 校验相关
const inputStatus = ref('')
const inputTips = ref('')

// 清除校验状态
const clearValidation = () => {
  inputStatus.value = ''
  inputTips.value = ''
}

// 监听密码输入变化，清除校验状态
const handlePasswordInput = () => {
  if (inputStatus.value) {
    clearValidation()
  }
}

// 时钟相关
const currentTime = ref('')
const currentMinutes = ref('')
const currentDate = ref('')
const timeLabel = ref('')
let timeInterval = null

// 用户信息
const userInfo = computed(() => userStore.userInfo || {})

// 更新时间显示
const updateTime = () => {
  const now = new Date()
  const hours24 = now.getHours()
  const minutes = now.getMinutes()

  // 24小时制时间显示
  currentTime.value = hours24.toString().padStart(2, '0')
  currentMinutes.value = minutes.toString().padStart(2, '0')

  // AM/PM 标签
  timeLabel.value = hours24 >= 12 ? 'PM' : 'AM'

  // 日期显示
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const date = now.getDate().toString().padStart(2, '0')
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekday = weekdays[now.getDay()]

  currentDate.value = `${year}年${month}月${date}日 ${weekday}`
}

// 开始时钟更新
const startClock = () => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
}

// 停止时钟更新
const stopClock = () => {
  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }
}

// 处理点击解锁
const handleUnlockClick = () => {
  showUnlockDialog.value = true
  // 清除之前的校验状态
  clearValidation()
  // 自动聚焦到解锁密码输入框
  setTimeout(() => {
    if (unlockPasswordRef.value) {
      unlockPasswordRef.value.focus()
    }
  }, 100)
}

// 处理解锁操作
const handleUnlock = async () => {
  // 从store获取密码
  const storedPassword = appStore.currentLockPassword || ''

  if (!unlockPassword.value.trim()) {
    inputStatus.value = 'error'
    inputTips.value = '请输入解锁密码'
    return
  }

  if (unlockPassword.value !== storedPassword) {
    inputStatus.value = 'error'
    inputTips.value = '密码错误，请重新输入'
    unlockPassword.value = ''
    return
  }

  isUnlocking.value = true

  try {
    // 模拟解锁验证过程
    await new Promise(resolve => setTimeout(resolve, 500))

    // 解除全局锁屏状态
    appStore.unlockScreen()
    showUnlockDialog.value = false

    // 停止时钟更新
    stopClock()

    // 清空相关数据
    unlockPassword.value = ''
    // 清空store中的密码
    appStore.clearLockPassword()
    // 清除校验状态
    clearValidation()

    MessagePlugin.success('解锁成功')
  } catch (error) {
    MessagePlugin.error('解锁失败，请重试')
  } finally {
    isUnlocking.value = false
  }
}

// 组件挂载时开始时钟
onMounted(() => {
  startClock()
})

// 组件卸载时停止时钟
onUnmounted(() => {
  stopClock()
})
</script>

<style scoped>
.lock-screen-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: var(--td-bg-color-page);
  color: var(--td-text-color-primary);
}

/* 解锁提示 */
.unlock-hint {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding-top: 40px;
  border-radius: 12px;
}

.unlock-hint:hover {
  transform: translateY(-2px);
}

.lock-icon {
  margin-bottom: 12px;
  opacity: 0.9;
}

.unlock-text {
  font-size: 18px;
  font-weight: bold;
}

/* 时钟显示 */
.clock-display {
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.time-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.time-block {
  background-color: var(--td-bg-color-container-select);
  border-radius: 20px;
  text-align: center;
}

.time-label {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.time-number {
  font-size: 120px;
  font-weight: 200;
  line-height: 1;
  padding: 20px 30px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid var(--td-border-level-1-color);
}

/* 日期显示 */
.date-display {
  flex: 1;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
}

/* 解锁对话框样式 */
.unlock-header {
  display: flex;
  align-items: center;
}

.unlock-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--td-brand-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: var(--td-shadow-2);
}

.avatar-emoji {
  font-size: 32px;
}

.unlock-username {
  font-size: 18px;
  font-weight: 500;
  margin-left: 20px;
  color: var(--td-text-color-primary);
}

.unlock-input {
  margin-bottom: 20px;
}

.unlock-button {
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .lock-screen-fullscreen {
    padding: 60px 20px 40px;
  }

  .time-number {
    font-size: 80px;
    padding: 15px 20px;
    border-radius: 15px;
  }

  .time-container {
    gap: 20px;
  }

  .date-display {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .time-number {
    font-size: 60px;
    padding: 12px 16px;
    border-radius: 12px;
  }

  .time-container {
    gap: 15px;
  }

  .date-display {
    font-size: 16px;
  }
}
</style>