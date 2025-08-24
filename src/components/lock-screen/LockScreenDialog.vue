<template>
    <!-- 锁定屏幕对话框 -->
    <t-dialog v-model:visible="visible" width="460px" :footer="false" @close="handleClose">
        <template #header>
            <div class="lock-screen-header">
                <h3>锁定屏幕</h3>
            </div>
        </template>

        <!-- 锁定屏幕内容 -->
        <div class="lock-screen-content">
            <!-- 用户头像 -->
            <div class="user-avatar">
                <div class="avatar-container">
                    <!-- 使用emoji作为头像，模拟UI图中的卡通形象 -->
                    <div class="avatar-emoji">🤓</div>
                </div>
                <!-- 用户名 -->
                <div class="username">
                    {{ userInfo.name || 'TDesign Pro' }}
                </div>
            </div>

            <!-- 密码输入框 -->
            <div class="password-input-wrapper">
                <t-input ref="passwordInputRef" size="large" v-model="password" type="password" placeholder="请输入锁屏密码"
                    class="password-input" @enter="handleLock">
                    <template #suffix-icon>
                        <t-icon name="browse-off" />
                    </template>
                </t-input>
            </div>

            <!-- 锁定按钮 -->
            <div class="lock-button-wrapper">
                <t-button theme="primary" size="large" block @click="handleLock" :loading="isLocking">
                    锁定
                </t-button>
            </div>
        </div>
    </t-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { MessagePlugin } from 'tdesign-vue-next'

const userStore = useUserStore()
const appStore = useAppStore()

// 定义props和emits
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'locked'])

// 锁定屏幕相关
const password = ref('')
const isLocking = ref(false)
const passwordInputRef = ref(null)

// 用户信息
const userInfo = computed(() => userStore.userInfo || {})

// 计算属性：对话框显示状态
const visible = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value)
    }
})

// 打开锁定屏幕对话框时的处理
const handleOpen = () => {
    // 自动对焦到密码输入框
    setTimeout(() => {
        if (passwordInputRef.value) {
            passwordInputRef.value.focus()
        }
    }, 100)
}

// 关闭锁定屏幕对话框
const handleClose = () => {
    visible.value = false
    password.value = ''
    isLocking.value = false
}

// 处理锁定操作
const handleLock = async () => {
    if (!password.value.trim()) {
        MessagePlugin.warning('请输入锁屏密码')
        return
    }

    isLocking.value = true

    try {
        // 模拟锁定验证过程
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 保存锁定密码到store
        appStore.setLockPassword(password.value)

        // 关闭当前对话框
        emit('update:modelValue', false)

        // 设置全局锁屏状态
        appStore.lockScreen()

        // 清空密码输入
        password.value = ''

        // 触发锁定事件
        emit('locked', {
            password: appStore.currentLockPassword,
            timestamp: Date.now()
        })
    } catch (error) {
        MessagePlugin.error('锁定失败，请重试')
    } finally {
        isLocking.value = false
    }
}
// 监听对话框打开状态
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        handleOpen()
    }
})

// 暴露打开方法给父组件
defineExpose({
    open: () => {
        visible.value = true
        handleOpen()
    }
})
</script>

<style scoped>
/* 锁定屏幕头部 */
.lock-screen-header {
    text-align: center;
}

.lock-screen-header h3 {
    margin: 0;
    color: var(--td-text-color-primary);
    font-size: 18px;
    font-weight: 500;
}

/* 锁定屏幕内容 */
.lock-screen-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
}

/* 用户头像 */
.user-avatar {
    margin-bottom: 20px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.avatar-container {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-emoji {
    font-size: 40px;
    line-height: 1;
}

/* 用户名 */
.username {
    font-size: 20px;
    font-weight: 500;
    color: var(--td-text-color-primary);
    margin-bottom: 20px;
    margin-left: 20px;
    text-align: center;
}

/* 密码输入框 */
.password-input-wrapper {
    width: 100%;
    margin-bottom: 20px;
}

.password-input {
    width: 100%;
}

:deep(.password-input .t-input__inner) {
    height: 44px;
    font-size: 16px;
}

/* 锁定按钮 */
.lock-button-wrapper {
    width: 100%;
}

:deep(.lock-button-wrapper .t-button) {
    height: 44px;
    font-size: 16px;
    font-weight: 500;
}
</style>