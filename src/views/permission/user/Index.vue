<template>
    <div class="user-management">
        <!-- 搜索和操作区域 -->
        <div class="search-section">
            <t-card :bordered="false" class="search-card">
                <t-form ref="searchFormRef" :data="searchForm" layout="inline" class="search-form">
                    <t-form-item label="用户名" name="username">
                        <t-input v-model="searchForm.username" placeholder="请输入用户名" clearable style="width: 200px" />
                    </t-form-item>
                    <t-form-item label="手机号" name="phone">
                        <t-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 200px" />
                    </t-form-item>
                    <t-form-item label="状态" name="status">
                        <t-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
                            <t-option value="1" label="启用" />
                            <t-option value="0" label="禁用" />
                        </t-select>
                    </t-form-item>
                    <t-form-item>
                        <t-space>
                            <t-button theme="primary" @click="handleSearch">
                                <template #icon><t-icon name="search" /></template>
                                搜索
                            </t-button>
                            <t-button variant="outline" @click="handleReset">
                                <template #icon><t-icon name="refresh" /></template>
                                重置
                            </t-button>
                        </t-space>
                    </t-form-item>
                </t-form>
            </t-card>
        </div>

        <!-- 数据表格 -->
        <div class="table-section">
            <t-table ref="tableRef" :data="tableData" :columns="columns" :loading="loading" :pagination="pagination"
                :selected-row-keys="selectedRowKeys" row-key="id" stripe hover @select-change="handleSelectChange"
                @page-change="handlePageChange" @page-size-change="handlePageSizeChange">
                <!-- 表格头部操作区域 -->
                <template #top-content>
                    <div class="table-header-actions">
                        <div class="header-title">
                            <t-icon name="user" class="title-icon" />
                            <span class="title-text">用户管理</span>
                            <t-tag theme="primary" variant="light" class="count-tag">
                                共 {{ pagination.total }} 条记录
                            </t-tag>
                        </div>
                        <div class="header-actions">
                            <t-space>
                                <t-button theme="primary" @click="handleAdd">
                                    <template #icon><t-icon name="add" /></template>
                                    新增用户
                                </t-button>
                                <t-button theme="danger" variant="outline" :disabled="selectedRowKeys.length === 0"
                                    @click="handleBatchDelete">
                                    <template #icon><t-icon name="delete" /></template>
                                    批量删除 {{ selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : '' }}
                                </t-button>
                            </t-space>
                        </div>
                    </div>
                </template>
                <!-- 状态列 -->
                <template #status="{ row }">
                    <t-tag :theme="row.status === 1 ? 'success' : 'danger'" variant="light">
                        {{ row.status === 1 ? '启用' : '禁用' }}
                    </t-tag>
                </template>

                <!-- 操作列 -->
                <template #operation="{ row }">
                    <t-space>
                        <t-button theme="primary" variant="text" size="small" @click="handleEdit(row)">
                            <template #icon><t-icon name="edit" /></template>
                            编辑
                        </t-button>
                        <t-popconfirm content="确认删除该用户吗？" @confirm="handleDelete(row)">
                            <t-button theme="danger" variant="text" size="small">
                                <template #icon><t-icon name="delete" /></template>
                                删除
                            </t-button>
                        </t-popconfirm>
                        <t-dropdown :options="getOperationOptions(row)" @click="handleOperationClick($event, row)">
                            <t-button theme="default" variant="outline" size="small">
                                <template #icon><t-icon name="ellipsis" /></template>
                            </t-button>
                        </t-dropdown>
                    </t-space>
                </template>
            </t-table>
        </div>

        <!-- 新增/编辑用户弹窗 -->
        <t-dialog v-model:visible="userDialogVisible" :header="isEdit ? '编辑用户' : '新增用户'" width="600px"
            :confirm-btn="null" :cancel-btn="null">
            <t-form ref="userFormRef" :data="userForm" :rules="userFormRules" label-align="right" label-width="100px"
                @submit="handleUserSubmit">
                <t-form-item label="用户名" name="username">
                    <t-input v-model="userForm.username" placeholder="请输入用户名" :disabled="isEdit" />
                </t-form-item>
                <t-form-item label="邮箱" name="email">
                    <t-input v-model="userForm.email" placeholder="请输入邮箱" />
                </t-form-item>
                <t-form-item label="手机号" name="phone">
                    <t-input v-model="userForm.phone" placeholder="请输入手机号" />
                </t-form-item>
                <t-form-item v-if="!isEdit" label="密码" name="password">
                    <t-input v-model="userForm.password" type="password" placeholder="请输入密码" />
                </t-form-item>
                <t-form-item v-if="!isEdit" label="确认密码" name="confirmPassword">
                    <t-input v-model="userForm.confirmPassword" type="password" placeholder="请再次输入密码" />
                </t-form-item>
                <t-form-item label="真实姓名" name="realName">
                    <t-input v-model="userForm.realName" placeholder="请输入真实姓名" />
                </t-form-item>
                <t-form-item label="状态" name="status">
                    <t-radio-group v-model="userForm.status">
                        <t-radio :value="1">启用</t-radio>
                        <t-radio :value="0">禁用</t-radio>
                    </t-radio-group>
                </t-form-item>
                <t-form-item label="备注" name="remark">
                    <t-textarea v-model="userForm.remark" placeholder="请输入备注" :maxlength="200" />
                </t-form-item>
            </t-form>
            <template #footer>
                <t-space>
                    <t-button @click="userDialogVisible = false">取消</t-button>
                    <t-button theme="primary" @click="handleUserSubmit" :loading="submitLoading">
                        {{ isEdit ? '更新' : '创建' }}
                    </t-button>
                </t-space>
            </template>
        </t-dialog>

        <!-- 角色分配弹窗 -->
        <t-dialog v-model:visible="roleDialogVisible" header="分配角色" width="800px" :confirm-btn="null"
            :cancel-btn="null">
            <div class="role-assign-content">
                <p class="assign-user-info">
                    为用户 <strong>{{ currentUser.username }}</strong> 分配角色：
                </p>
                <div class="role-layout">
                    <div class="role-section">
                        <h4 class="section-title">已分配角色</h4>
                        <div class="role-grid">
                            <div v-for="role in selectedRoles" :key="role" class="role-tag assigned">
                                {{ role }}
                                <t-icon name="close" class="remove-icon" @click="removeRole(role)" />
                            </div>
                            <div v-if="selectedRoles.length === 0" class="empty-state">
                                暂无已分配角色
                            </div>
                        </div>
                    </div>
                    <div class="role-section">
                        <h4 class="section-title">可分配角色</h4>
                        <div class="role-grid">
                            <div v-for="role in availableRoles" :key="role" class="role-tag available"
                                @click="addRole(role)">
                                {{ role }}
                                <t-icon name="add" class="add-icon" />
                            </div>
                            <div v-if="availableRoles.length === 0" class="empty-state">
                                暂无可分配角色
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <t-space>
                    <t-button theme="default" @click="roleDialogVisible = false">取消</t-button>
                    <t-button theme="primary" @click="handleSaveRoles" :loading="roleSubmitLoading">
                        保存
                    </t-button>
                </t-space>
            </template>
        </t-dialog>

        <!-- 重置密码弹窗 -->
        <t-dialog v-model:visible="passwordDialogVisible" header="重置密码" width="500px" :confirm-btn="null"
            :cancel-btn="null" class="password-reset-dialog">
            <div class="password-reset-content">
                <div class="user-info-section">
                    <t-icon name="user-circle" size="24px" class="user-icon" />
                    <div class="user-details">
                        <h4 class="user-title">为以下用户重置密码</h4>
                        <p class="username-display">{{ currentUser.username }}</p>
                    </div>
                </div>

                <t-divider />

                <t-form ref="passwordFormRef" :data="passwordForm" :rules="passwordFormRules" label-align="right"
                    label-width="120px" class="password-form">
                    <t-form-item label="新密码" name="newPassword">
                        <t-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" clearable>
                            <template #prefix-icon>
                                <t-icon name="lock-on" />
                            </template>
                        </t-input>
                    </t-form-item>
                    <t-form-item label="确认密码" name="confirmPassword">
                        <t-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码"
                            clearable>
                            <template #prefix-icon>
                                <t-icon name="lock-on" />
                            </template>
                        </t-input>
                    </t-form-item>
                </t-form>

                <div class="password-tips">
                    <t-icon name="info-circle" class="tip-icon" />
                    <span class="tip-text">密码长度为6-20个字符，建议包含字母、数字和特殊字符</span>
                </div>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <t-button variant="outline" @click="passwordDialogVisible = false">
                        <template #icon><t-icon name="close" /></template>
                        取消
                    </t-button>
                    <t-button theme="primary" @click="handlePasswordSubmit" :loading="passwordSubmitLoading">
                        <template #icon><t-icon name="refresh" /></template>
                        重置密码
                    </t-button>
                </div>
            </template>
        </t-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import {
    queryUserList,
    addUser,
    updateUser,
    deleteUser,
    batchDeleteUser,
    updateUserStatus,
    echoUserById,
    queryUserRoles,
    saveUserRoles,
    resetUserPassword
} from '@/api/user'
import { queryRoleList } from '@/api/role'

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const roleSubmitLoading = ref(false)
const passwordSubmitLoading = ref(false)
const tableData = ref([])
const selectedRowKeys = ref([])
const userDialogVisible = ref(false)
const roleDialogVisible = ref(false)
const passwordDialogVisible = ref(false)
const isEdit = ref(false)
const currentUser = ref({})
const roleList = ref([])
const selectedRoles = ref([])
const passwordFormRef = ref()

// 搜索表单
const searchForm = reactive({
    username: '',
    phone: '',
    status: ''
})

// 用户表单
const userForm = reactive({
    id: null,
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    realName: '',
    status: 1,
    remark: ''
})

// 密码重置表单
const passwordForm = reactive({
    username: '',
    newPassword: '',
    confirmPassword: ''
})

// 分页配置
const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showJumper: true,
    showSizer: true,
    pageSizeOptions: [10, 20, 50, 100]
})

// 表格列配置
const columns = [
    {
        colKey: 'row-select',
        type: 'multiple-select',
        width: 50
    },
    {
        colKey: 'id',
        title: 'ID',
        width: 80
    },
    {
        colKey: 'username',
        title: '用户名',
        width: 120
    },
    {
        colKey: 'email',
        title: '邮箱',
        width: 180
    },
    {
        colKey: 'phone',
        title: '手机号',
        width: 130
    },

    {
        colKey: 'status',
        title: '状态',
        width: 80,
        cell: 'status'
    },
    {
        colKey: 'createTime',
        title: '创建时间',
        width: 160
    },
    {
        colKey: 'operation',
        title: '操作',
        width: 300,
        fixed: 'right',
        cell: 'operation'
    }
]

// 表单验证规则
const userFormRules = {
    username: [
        { required: true, message: '用户名不能为空' },
        { min: 3, max: 20, message: '用户名长度为3-20个字符' }
    ],
    email: [
        { required: true, message: '邮箱不能为空' },
        { email: true, message: '请输入正确的邮箱格式' }
    ],
    phone: [
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
    ],
    password: [
        { required: true, message: '密码不能为空' },
        { min: 6, max: 20, message: '密码长度为6-20个字符' }
    ],
    confirmPassword: [
        { required: true, message: '确认密码不能为空' },
        {
            validator: (val) => val === userForm.password,
            message: '两次输入的密码不一致'
        }
    ],
    realName: [
        { required: true, message: '真实姓名不能为空' }
    ]
}

const passwordFormRules = {
    newPassword: [
        { required: true, message: '新密码不能为空' },
        { min: 6, max: 20, message: '密码长度为6-20个字符' }
    ],
    confirmPassword: [
        { required: true, message: '确认密码不能为空' },
        {
            validator: (val) => val === passwordForm.newPassword,
            message: '两次输入的密码不一致'
        }
    ]
}

// 方法
const fetchUserList = async () => {
    try {
        loading.value = true
        // 构建请求参数，空字段设置为空字符串
        const params = {
            username: searchForm.username ? searchForm.username.trim() : '',
            phone: searchForm.phone ? searchForm.phone.trim() : '',
            status: searchForm.status !== '' ? Number(searchForm.status) : ''
        }

        const response = await queryUserList(pagination.current, pagination.pageSize, params)
        if (response.code === 200) {
            tableData.value = response.data.data || []
            pagination.total = response.data.total || 0
        } else {
            MessagePlugin.error(response.message || '获取用户列表失败')
        }
    } catch (error) {
        MessagePlugin.error('获取用户列表失败')
        console.error('获取用户列表失败:', error)
    } finally {
        loading.value = false
    }
}

const fetchRoleList = async () => {
    try {
        const response = await queryRoleList()
        if (response.code === 200) {
            roleList.value = response.data || []
        }
    } catch (error) {
        console.error('获取角色列表失败:', error)
    }
}

const handleSearch = () => {
    pagination.current = 1
    fetchUserList()
}

const handleReset = () => {
    Object.assign(searchForm, {
        username: '',
        phone: '',
        status: ''
    })
    pagination.current = 1
    fetchUserList()
}

const handleAdd = () => {
    isEdit.value = false
    resetUserForm()
    userDialogVisible.value = true
}

const handleEdit = async (row) => {
    try {
        isEdit.value = true
        const response = await echoUserById(row.id)
        if (response.code === 200) {
            Object.assign(userForm, response.data)
            userDialogVisible.value = true
        } else {
            MessagePlugin.error(response.message || '获取用户信息失败')
        }
    } catch (error) {
        MessagePlugin.error('获取用户信息失败')
        console.error('获取用户信息失败:', error)
    }
}

const handleDelete = async (row) => {
    try {
        const response = await deleteUser(row.id)
        if (response.code === 200) {
            MessagePlugin.success('删除成功')
            fetchUserList()
        } else {
            MessagePlugin.error(response.message || '删除失败')
        }
    } catch (error) {
        MessagePlugin.error('删除失败')
        console.error('删除失败:', error)
    }
}

const handleBatchDelete = async () => {
    if (selectedRowKeys.value.length === 0) {
        MessagePlugin.warning('请选择要删除的用户')
        return
    }

    try {
        const response = await batchDeleteUser(selectedRowKeys.value)
        if (response.code === 200) {
            MessagePlugin.success('批量删除成功')
            selectedRowKeys.value = []
            fetchUserList()
        } else {
            MessagePlugin.error(response.message || '批量删除失败')
        }
    } catch (error) {
        MessagePlugin.error('批量删除失败')
        console.error('批量删除失败:', error)
    }
}

const handleToggleStatus = (row) => {
    const action = row.status === 1 ? '禁用' : '启用'
    const theme = row.status === 1 ? 'danger' : 'success'

    const dialogInstance = DialogPlugin.confirm({
        header: '确认操作',
        body: `确定要${action}用户 "${row.username}" 吗？`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        theme: theme,
        onConfirm: async () => {
            try {
                const response = await updateUserStatus(row.id)
                if (response.code === 200) {
                    MessagePlugin.success(`${action}成功`)
                    fetchUserList()
                    dialogInstance.destroy()
                } else {
                    MessagePlugin.error(response.message || '状态更新失败')
                }
            } catch (error) {
                MessagePlugin.error('状态更新失败')
                console.error('状态更新失败:', error)
            }
        },
        onCancel: () => {
            console.log('用户取消了操作')
        }
    })
}

const handleAssignRole = async (row) => {
    try {
        currentUser.value = row
        const response = await queryUserRoles(row.id)
        if (response.code === 200) {
            selectedRoles.value = response.data || []
            roleDialogVisible.value = true
        } else {
            MessagePlugin.error(response.message || '获取用户角色失败')
        }
    } catch (error) {
        MessagePlugin.error('获取用户角色失败')
        console.error('获取用户角色失败:', error)
    }
}

const handleResetPassword = (row) => {
    currentUser.value = row
    passwordForm.username = row.username
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    passwordDialogVisible.value = true
}

const handleUserSubmit = async () => {
    try {
        const formRef = isEdit.value ? 'userFormRef' : 'userFormRef'
        const valid = await formRef.validate()
        if (!valid) return

        submitLoading.value = true
        const apiMethod = isEdit.value ? updateUser : addUser
        const response = await apiMethod(userForm)

        if (response.code === 200) {
            MessagePlugin.success(`${isEdit.value ? '更新' : '创建'}成功`)
            userDialogVisible.value = false
            fetchUserList()
        } else {
            MessagePlugin.error(response.message || `${isEdit.value ? '更新' : '创建'}失败`)
        }
    } catch (error) {
        MessagePlugin.error(`${isEdit.value ? '更新' : '创建'}失败`)
        console.error(`${isEdit.value ? '更新' : '创建'}失败:`, error)
    } finally {
        submitLoading.value = false
    }
}

// 计算可分配角色
const availableRoles = computed(() => {
    return roleList.value.filter(role => !selectedRoles.value.includes(role))
})

// 添加角色
const addRole = (role) => {
    if (!selectedRoles.value.includes(role)) {
        selectedRoles.value.push(role)
    }
}

// 移除角色
const removeRole = (role) => {
    const index = selectedRoles.value.indexOf(role)
    if (index > -1) {
        selectedRoles.value.splice(index, 1)
    }
}

const handleSaveRoles = async () => {
    try {
        roleSubmitLoading.value = true
        const response = await saveUserRoles(currentUser.value.username, selectedRoles.value)
        if (response.code === 200) {
            MessagePlugin.success('角色分配成功')
            roleDialogVisible.value = false
        } else {
            MessagePlugin.error(response.message || '角色分配失败')
        }
    } catch (error) {
        MessagePlugin.error('角色分配失败')
        console.error('角色分配失败:', error)
    } finally {
        roleSubmitLoading.value = false
    }
}

const handlePasswordSubmit = async () => {
    try {
        const valid = await passwordFormRef.value.validate()
        if (!valid) return

        passwordSubmitLoading.value = true
        const response = await resetUserPassword({
            id: currentUser.value.id,
            password: passwordForm.newPassword
        })

        if (response.code === 200) {
            MessagePlugin.success('密码重置成功')
            passwordDialogVisible.value = false
        } else {
            MessagePlugin.error(response.message || '密码重置失败')
        }
    } catch (error) {
        MessagePlugin.error('密码重置失败')
        console.error('密码重置失败:', error)
    } finally {
        passwordSubmitLoading.value = false
    }
}

const handleSelectChange = (value) => {
    selectedRowKeys.value = value
}

const handlePageChange = (pageInfo) => {
    pagination.current = pageInfo.current
    fetchUserList()
}

const handlePageSizeChange = (pageInfo) => {
    pagination.pageSize = pageInfo.pageSize
    pagination.current = 1
    fetchUserList()
}

const resetUserForm = () => {
    Object.assign(userForm, {
        id: null,
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        realName: '',
        status: 1,
        remark: ''
    })
}

// 生成操作下拉菜单选项
const getOperationOptions = (row) => {
    return [
        {
            content: '分配角色',
            value: 'assignRole',
            active: true,
            theme: 'success',
            divider: true
        },
        {
            content: '重置密码',
            value: 'resetPassword',
            active: true,
            theme: 'warning',
            divider: true
        },
        {
            content: row.status === 1 ? '禁用' : '启用',
            value: 'toggleStatus',
            active: true,
            theme: 'error',
            divider: true
        },
    ]
}

// 处理操作下拉菜单点击
const handleOperationClick = (data, row) => {
    const { value } = data

    switch (value) {
        case 'toggleStatus':
            handleToggleStatus(row)
            break
        case 'assignRole':
            handleAssignRole(row)
            break
        case 'resetPassword':
            handleResetPassword(row)
            break
    }
}

// 生命周期
onMounted(() => {
    fetchUserList()
    fetchRoleList()
})
</script>

<style scoped>
.user-management {
    background: var(--td-bg-color-page);
    min-height: 100vh;
}

.page-header {
    margin-bottom: 24px;
}

.page-title {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--td-text-color-primary);
}

.page-description {
    margin: 0;
    color: var(--td-text-color-secondary);
    font-size: 14px;
}

.search-section {
    margin-bottom: 16px;
}

.search-card {
    padding: 16px;
}

.search-form {
    margin-bottom: 0;
}

.action-section {
    margin-bottom: 16px;
}

.table-section {
    background: var(--td-bg-color-container);
    border-radius: 6px;
    padding: 16px;
}

.role-assign-content {
    padding: 0;
}

.assign-user-info {
    margin-bottom: 10px;
    font-size: 14px;
    color: var(--td-text-color-primary);
}

.role-layout {
    display: flex;
    gap: 24px;
    min-height: 300px;
}

.role-section {
    flex: 1;
    border: 1px solid var(--td-border-level-1-color);
    border-radius: 6px;
    padding: 10px;
    background: var(--td-bg-color-container);
}

.section-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--td-text-color-primary);
    border-bottom: 1px solid var(--td-border-level-1-color);
    padding-bottom: 8px;
}

.role-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    max-height: 240px;
    overflow-y: auto;
}

.role-tag {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    word-break: break-all;
}

.role-tag.assigned {
    background: var(--td-success-color-1);
    border: 1px solid var(--td-success-color-3);
    color: var(--td-success-color-7);
}

.role-tag.assigned:hover {
    background: var(--td-success-color-2);
    border-color: var(--td-success-color-4);
}

.role-tag.available {
    background: var(--td-bg-color-container);
    border: 1px solid var(--td-border-level-1-color);
    color: var(--td-text-color-primary);
}

.role-tag.available:hover {
    background: var(--td-brand-color-1);
    border-color: var(--td-brand-color-3);
    color: var(--td-brand-color-7);
}

.remove-icon,
.add-icon {
    font-size: 12px;
    margin-left: 4px;
    opacity: 0.7;
}

.remove-icon:hover {
    opacity: 1;
    color: var(--td-error-color);
}

.add-icon:hover {
    opacity: 1;
    color: var(--td-brand-color);
}

.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px 20px;
    color: var(--td-text-color-placeholder);
    font-size: 14px;
}

/* 重置密码对话框样式 */
.password-reset-dialog .password-reset-content {
    padding: 8px 0;
}

.password-reset-dialog .user-info-section {
    display: flex;
    align-items: center;
    padding: 16px 0;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 16px;
    padding-left: 16px;
}

.password-reset-dialog .user-icon {
    color: #0052d9;
    margin-right: 12px;
}

.password-reset-dialog .user-details {
    flex: 1;
}

.password-reset-dialog .user-title {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: #666;
    font-weight: normal;
}

.password-reset-dialog .username-display {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #0052d9;
}

.password-reset-dialog .password-form {
    margin: 20px 0;
}

.password-reset-dialog .password-tips {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 6px;
    margin-top: 16px;
}

.password-reset-dialog .tip-icon {
    color: #856404;
    margin-right: 8px;
    flex-shrink: 0;
}

.password-reset-dialog .tip-text {
    font-size: 13px;
    color: #856404;
    line-height: 1.4;
}

.password-reset-dialog .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

/* 表格头部操作区域样式 */
.table-header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: #fafafa;
    border-bottom: 1px solid #e7e7e7;
    margin: -16px -24px 16px -24px;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-icon {
    color: #0052d9;
    font-size: 18px;
}

.title-text {
    font-size: 16px;
    font-weight: 600;
    color: #262626;
}

.count-tag {
    margin-left: 8px;
}

.header-actions {
    display: flex;
    align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .user-management {
        padding: 16px;
    }

    .search-form {
        flex-direction: column;
    }

    .search-form :deep(.t-form-item) {
        margin-bottom: 16px;
    }
}
</style>