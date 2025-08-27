<template>
    <!-- 搜索和操作区域 -->
    <t-card :bordered="false" class="search-card">
        <!-- 搜索表单容器：左右布局，左侧表单自适应，右侧按钮固定宽度 -->
        <div class="search-form">
            <!-- 左侧表单区域：包含搜索条件 -->
            <div class="search-form-left">
                <t-form ref="searchFormRef" :data="searchForm" layout="inline" :label-width="0">
                    <!-- 角色名称搜索 -->
                    <t-form-item name="name">
                        <t-input v-model="searchForm.name" placeholder="请输入角色名称" clearable style="width: 200px" />
                    </t-form-item>
                    <!-- 角色编码搜索 -->
                    <t-form-item name="code">
                        <t-input v-model="searchForm.code" placeholder="请输入角色编码" clearable style="width: 200px" />
                    </t-form-item>
                    <!-- 状态筛选 -->
                    <t-form-item name="status">
                        <t-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 200px">
                            <t-option value="1" label="启用" />
                            <t-option value="0" label="禁用" />
                        </t-select>
                    </t-form-item>
                </t-form>
            </div>
            <!-- 右侧操作按钮区域：搜索和重置按钮 -->
            <div class="search-form-right">
                <t-space>
                    <!-- 搜索按钮 -->
                    <t-button theme="primary" @click="handleSearch">
                        <template #icon><t-icon name="search" /></template>
                        搜索
                    </t-button>
                    <!-- 重置按钮 -->
                    <t-button theme="default" @click="handleReset">
                        <template #icon><t-icon name="refresh" /></template>
                        重置
                    </t-button>
                </t-space>
            </div>
        </div>
    </t-card>

    <!-- 数据表格区域 -->
    <t-card :bordered="false" class="table-card">
        <!-- 表格头部操作区域 -->
        <template #header>
            <div class="button-layout">
                <!-- 新增角色按钮 -->
                <t-button theme="primary" @click="handleAdd">
                    <template #icon><t-icon name="add" /></template>
                    新增角色
                </t-button>
                <!-- 批量删除按钮：根据选中状态动态显示数量 -->
                <t-button theme="danger" variant="outline" :disabled="selectedRowKeys.length === 0"
                    @click="handleBatchDelete">
                    <template #icon><t-icon name="delete" /></template>
                    批量删除 {{ selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : '' }}
                </t-button>
            </div>
        </template>
        <!-- 角色数据表格：支持多选、分页、排序等功能 -->
        <t-table maxHeight="420px" ref="tableRef" :data="tableData" :columns="columns" :loading="loading"
            :pagination="pagination" :selected-row-keys="selectedRowKeys" row-key="id" stripe hover
            @select-change="handleSelectChange" @page-change="handlePageChange">
            <!-- 状态列自定义渲染：显示启用/禁用标签 -->
            <template #status="{ row }">
                <t-tag :theme="row.status === 1 ? 'success' : 'danger'" variant="light">
                    {{ row.status === 1 ? '启用' : '禁用' }}
                </t-tag>
            </template>

            <!-- 操作列自定义渲染：编辑、删除、分配权限、状态切换 -->
            <template #operation="{ row }">
                <t-space>
                    <!-- 编辑按钮 -->
                    <t-button theme="primary" variant="text" size="small" @click="handleEdit(row)">
                        <template #icon><t-icon name="edit" /></template>
                        编辑
                    </t-button>
                    <!-- 删除按钮：带确认弹窗 -->
                    <t-popconfirm content="确认删除该角色吗？" @confirm="handleDelete(row)">
                        <t-button theme="danger" variant="text" size="small">
                            <template #icon><t-icon name="delete" /></template>
                            删除
                        </t-button>
                    </t-popconfirm>
                    <!-- 分配权限按钮 -->
                    <t-button theme="success" variant="text" size="small" @click="handleAssignPermission(row)">
                        <template #icon><t-icon name="user" /></template>
                        分配权限
                    </t-button>
                    <!-- 状态切换按钮 -->
                    <t-button :theme="row.status === 1 ? 'warning' : 'success'" variant="text" size="small"
                        @click="handleToggleStatus(row)">
                        <template #icon><t-icon :name="row.status === 1 ? 'poweroff' : 'check-circle'" /></template>
                        {{ row.status === 1 ? '禁用' : '启用' }}
                    </t-button>
                </t-space>
            </template>
        </t-table>
    </t-card>

    <!-- 新增/编辑角色弹窗：根据isEdit状态动态显示标题和按钮文本 -->
    <t-dialog v-model:visible="roleDialogVisible" :header="isEdit ? '编辑角色' : '新增角色'" width="700px" :confirm-btn="null"
        :cancel-btn="null" class="role-form-dialog">
        <!-- 角色表单：支持表单验证和提交 -->
        <t-form ref="roleFormRef" label-align="top" :data="roleForm" :rules="roleFormRules" label-width="100px"
            @submit="handleRoleSubmit" class="role-form">
            <!-- 表单网格布局：两列显示 -->
            <div class="form-grid">
                <!-- 角色名称输入 -->
                <t-form-item label="角色名称" name="name" class="form-item">
                    <t-input v-model="roleForm.name" placeholder="请输入角色名称" />
                </t-form-item>
                <!-- 角色编码输入 -->
                <t-form-item label="角色编码" name="code" class="form-item">
                    <t-input v-model="roleForm.code" placeholder="请输入角色编码" />
                </t-form-item>

                <!-- 状态选择：启用/禁用 -->
                <t-form-item label="状态" name="status" class="form-item">
                    <t-radio-group v-model="roleForm.status">
                        <t-radio :value="1">启用</t-radio>
                        <t-radio :value="0">禁用</t-radio>
                    </t-radio-group>
                </t-form-item>
            </div>
        </t-form>
        <!-- 弹窗底部按钮 -->
        <template #footer>
            <t-space>
                <!-- 取消按钮 -->
                <t-button theme="default" @click="roleDialogVisible = false">取消</t-button>
                <!-- 提交按钮：根据编辑状态显示不同文本 -->
                <t-button theme="primary" @click="handleRoleSubmit" :loading="submitLoading">
                    {{ isEdit ? '更新' : '创建' }}
                </t-button>
            </t-space>
        </template>
    </t-dialog>

    <!-- 权限分配弹窗 -->
    <t-dialog v-model:visible="permissionDialogVisible" header="分配权限" width="800px" :confirm-btn="null"
        :cancel-btn="null">
        <div class="permission-assign-content">
            <p class="assign-role-info">
                为角色 <strong>{{ currentRole.name }}</strong> 分配权限：
            </p>
            <div class="permission-layout">
                <div class="permission-section">
                    <h4 class="section-title">已分配权限</h4>
                    <div class="permission-grid">
                        <div v-for="permission in selectedPermissions" :key="permission"
                            class="permission-tag assigned">
                            {{ permission }}
                            <t-icon name="close" class="remove-icon" @click="removePermission(permission)" />
                        </div>
                        <div v-if="selectedPermissions.length === 0" class="empty-state">
                            暂无已分配权限
                        </div>
                    </div>
                </div>
                <div class="permission-section">
                    <h4 class="section-title">可分配权限</h4>
                    <div class="permission-grid">
                        <div v-for="permission in availablePermissions" :key="permission"
                            class="permission-tag available" @click="addPermission(permission)">
                            {{ permission }}
                            <t-icon name="add" class="add-icon" />
                        </div>
                        <div v-if="availablePermissions.length === 0" class="empty-state">
                            暂无可分配权限
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <t-space>
                <t-button theme="default" @click="permissionDialogVisible = false">取消</t-button>
                <t-button theme="primary" @click="handleSavePermissions" :loading="permissionSubmitLoading">
                    保存
                </t-button>
            </t-space>
        </template>
    </t-dialog>
</template>

<script setup>
// Vue 3 Composition API 相关导入
import { ref, reactive, onMounted, computed } from 'vue'
// TDesign 组件库相关导入
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
// 角色管理相关 API 导入
import {
    addRole,                    // 新增角色
    updateRole,                 // 更新角色
    deleteRole,                 // 删除角色
    batchDeleteRole,            // 批量删除角色
    updateRoleStatus,           // 更新角色状态
    queryRoleListByPage,        // 分页查询角色数据
    echoRole,                   // 角色数据回显
    saveRolePermission          // 角色分配权限
} from '@/api/role'

// ==================== 响应式数据定义 ====================
// 加载状态控制
const loading = ref(false)                    // 表格数据加载状态
const submitLoading = ref(false)              // 角色表单提交状态
const permissionSubmitLoading = ref(false)    // 权限分配提交状态

// 表格相关数据
const tableData = ref([])                     // 表格数据
const selectedRowKeys = ref([])               // 选中的行键值

// 弹窗显示控制
const roleDialogVisible = ref(false)          // 角色表单弹窗显示状态
const permissionDialogVisible = ref(false)    // 权限分配弹窗显示状态

// 业务状态控制
const isEdit = ref(false)                     // 是否为编辑模式
const currentRole = ref({})                   // 当前操作的角色信息

// 权限相关数据
const permissionList = ref([])                // 所有权限列表
const selectedPermissions = ref([])           // 已选中的权限列表

// 表单引用
const roleFormRef = ref()                     // 角色表单引用

// ==================== 表单数据定义 ====================
// 搜索表单数据
const searchForm = reactive({
    name: '',    // 角色名称搜索条件
    code: '',    // 角色编码搜索条件
    status: ''       // 状态搜索条件（1-启用，0-禁用）
})

// 角色表单数据
const roleForm = reactive({
    id: null,              // 角色ID（编辑时使用）
    name: '',          // 角色名称
    code: '',          // 角色编码
    status: 1              // 角色状态（1-启用，0-禁用）
})

// ==================== 分页配置 ====================
const pagination = reactive({
    current: 1,                        // 当前页码
    pageSize: 10,                      // 每页显示数量
    total: 0,                          // 总记录数
    showJumper: true,                  // 显示页码跳转
    showSizer: true,                   // 显示每页数量选择器
    pageSizeOptions: [10, 20, 50, 100] // 每页数量选项
})

// ==================== 表格列配置 ====================
const columns = [
    {
        colKey: 'row-select',    // 多选列
        type: 'multiple',
        width: 50
    },
    {
        colKey: 'id',           // ID列
        title: 'ID',
        width: 80,
        fixed: 'left'
    },
    {
        colKey: 'name',     // 角色名称列
        title: '角色名称',
        width: 120
    },
    {
        colKey: 'code',     // 角色编码列
        title: '角色编码',
        width: 120
    },

    {
        colKey: 'status',       // 状态列（自定义渲染）
        title: '状态',
        width: 100,
        cell: 'status'
    },
    {
        colKey: 'createTime',   // 创建时间列
        title: '创建时间',
        width: 150
    },
    {
        colKey: 'operation',    // 操作列（固定右侧，自定义渲染）
        title: '操作',
        width: 270,
        fixed: 'right',
        cell: 'operation'
    }
]

// ==================== 表单验证规则 ====================
// 角色表单验证规则
const roleFormRules = {
    name: [
        { required: true, message: '角色名称不能为空' },
        { min: 2, max: 20, message: '角色名称长度为2-20个字符' }
    ],
    code: [
        { required: true, message: '角色编码不能为空' },
        { min: 2, max: 20, message: '角色编码长度为2-20个字符' }
    ],

}

// ==================== 业务方法定义 ====================
/**
 * 获取角色列表数据
 * 根据搜索条件和分页参数查询角色列表
 */
const fetchRoleList = async () => {
    loading.value = true
    // 构建请求参数，空字段设置为空字符串
    const params = {
        name: searchForm.name ? searchForm.name.trim() : '',
        code: searchForm.code ? searchForm.code.trim() : '',
        status: searchForm.status !== '' ? Number(searchForm.status) : null
    }

    const response = await queryRoleListByPage(pagination.current, pagination.pageSize, params)
    if (response.code === 200 && response.data !== null) {
        tableData.value = response.data.data || []
        pagination.total = response.data.total || 0
    }
    loading.value = false
}

/**
 * 处理搜索操作
 * 重置到第一页并重新查询数据
 */
const handleSearch = () => {
    pagination.current = 1
    fetchRoleList()
}

/**
 * 处理重置操作
 * 清空搜索条件并重新查询数据
 */
const handleReset = () => {
    Object.assign(searchForm, {
        name: '',
        code: '',
        status: ''
    })
    pagination.current = 1
    fetchRoleList()
}

/**
 * 处理新增角色操作
 * 打开角色表单弹窗（新增模式）
 */
const handleAdd = () => {
    isEdit.value = false
    resetRoleForm()
    roleDialogVisible.value = true
}

/**
 * 处理编辑角色操作
 * 获取角色详情并打开表单弹窗（编辑模式）
 */
const handleEdit = async (row) => {
    isEdit.value = true
    const response = await echoRole(row.id)
    if (response.code === 200) {
        Object.assign(roleForm, response.data)
        roleDialogVisible.value = true
    }
}

/**
 * 处理删除角色操作
 * 删除指定角色并刷新列表
 */
const handleDelete = async (row) => {
    const response = await deleteRole(row.id)
    if (response.code === 200) {
        MessagePlugin.success('删除成功')
        fetchRoleList()
    }
}

/**
 * 处理批量删除操作
 * 批量删除选中的角色
 */
const handleBatchDelete = async () => {
    if (selectedRowKeys.value.length === 0) {
        MessagePlugin.warning('请选择要删除的角色')
        return
    }

    const dialogInstance = DialogPlugin.confirm({
        header: '确认批量删除',
        body: `确定要删除选中的 ${selectedRowKeys.value.length} 个角色吗？此操作不可撤销。`,
        confirmBtn: '确定删除',
        cancelBtn: '取消',
        theme: 'danger',
        onConfirm: async () => {
            const response = await batchDeleteRole(selectedRowKeys.value)
            if (response.code === 200) {
                MessagePlugin.success('批量删除成功')
                selectedRowKeys.value = []
                fetchRoleList()
                dialogInstance.destroy()
            }
        },
        onCancel: () => {
            console.log('用户取消了批量删除操作')
        }
    })
}

/**
 * 处理状态切换操作
 * 启用或禁用角色
 */
const handleToggleStatus = (row) => {
    const action = row.status === 1 ? '禁用' : '启用'
    const theme = row.status === 1 ? 'danger' : 'success'

    const dialogInstance = DialogPlugin.confirm({
        header: '确认操作',
        body: `确定要${action}角色 "${row.name}" 吗？`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        theme: theme,
        onConfirm: async () => {
            const response = await updateRoleStatus(row.id)
            if (response.code === 200) {
                MessagePlugin.success(`${action}成功`)
                fetchRoleList()
                dialogInstance.destroy()
            }
        },
        onCancel: () => {
            console.log('用户取消了操作')
        }
    })
}

/**
 * 处理权限分配操作
 * 打开权限分配弹窗
 */
const handleAssignPermission = (row) => {
    currentRole.value = row
    // TODO: 获取角色权限和所有权限列表
    selectedPermissions.value = []
    permissionDialogVisible.value = true
}

/**
 * 处理角色表单提交
 * 新增或更新角色
 */
const handleRoleSubmit = async () => {
    const valid = await roleFormRef.value.validate()
    if (!valid) return

    submitLoading.value = true
    const apiMethod = isEdit.value ? updateRole : addRole
    const response = await apiMethod(roleForm)

    if (response.code === 200) {
        MessagePlugin.success(`${isEdit.value ? '更新' : '创建'}成功`)
        roleDialogVisible.value = false
        fetchRoleList()
    }
    submitLoading.value = false
}

/**
 * 处理权限保存操作
 * 保存角色权限分配
 */
const handleSavePermissions = async () => {
    permissionSubmitLoading.value = true
    const response = await saveRolePermission(currentRole.value.id, selectedPermissions.value)
    if (response.code === 200) {
        MessagePlugin.success('权限分配成功')
        permissionDialogVisible.value = false
    }
    permissionSubmitLoading.value = false
}

// ==================== 辅助方法 ====================
/**
 * 重置角色表单
 */
const resetRoleForm = () => {
    Object.assign(roleForm, {
        id: null,
        name: '',
        code: '',
        status: 1
    })
}



/**
 * 处理表格选择变化
 */
const handleSelectChange = (value) => {
    selectedRowKeys.value = value
}

/**
 * 处理分页变化
 */
const handlePageChange = (pageInfo) => {
    pagination.current = pageInfo.current
    pagination.pageSize = pageInfo.pageSize
    fetchRoleList()
}



// 计算可分配权限
const availablePermissions = computed(() => {
    return permissionList.value.filter(permission => !selectedPermissions.value.includes(permission))
})

// 添加权限
const addPermission = (permission) => {
    if (!selectedPermissions.value.includes(permission)) {
        selectedPermissions.value.push(permission)
    }
}

// 移除权限
const removePermission = (permission) => {
    const index = selectedPermissions.value.indexOf(permission)
    if (index > -1) {
        selectedPermissions.value.splice(index, 1)
    }
}

// ==================== 生命周期钩子 ====================
onMounted(() => {
    fetchRoleList()
})
</script>

<style scoped lang="scss">
/* 搜索卡片容器 */
.search-card {
    margin-bottom: var(--td-comp-margin-s);
}

/* 搜索表单主容器：左右布局 */
.search-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--td-comp-margin-s);
}

/* 左侧表单区域 */
.search-form-left {
    flex: 1;
}

/* 右侧操作按钮区域 */
.search-form-right {
    flex-shrink: 0;
}

/* 表格操作区 */
/* 按钮布局：左右排列 */
.button-layout {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

/* 角色表单弹窗 */
.role-form-dialog {
    .role-form {
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--td-comp-margin-s);

            .form-item-full {
                grid-column: 1 / -1;
            }
        }
    }
}

/* 权限分配弹窗 */
.permission-assign-content {
    .assign-role-info {
        margin-bottom: var(--td-comp-margin-l);
        font-size: var(--td-font-size-body-medium);
        color: var(--td-text-color-primary);

        strong {
            color: var(--td-brand-color);
            font-weight: var(--td-font-weight-semi-bold);
        }
    }

    .permission-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--td-comp-margin-l);

        .permission-section {
            .section-title {
                margin-bottom: var(--td-comp-margin-s);
                font-size: var(--td-font-size-body-medium);
                font-weight: var(--td-font-weight-semi-bold);
                color: var(--td-text-color-primary);
            }

            .permission-grid {
                display: flex;
                flex-wrap: wrap;
                gap: var(--td-comp-margin-xs);
                min-height: 200px;
                padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
                border: 1px solid var(--td-component-border);
                border-radius: var(--td-radius-default);
                background-color: var(--td-bg-color-container);

                .permission-tag {
                    display: flex;
                    align-items: center;
                    gap: var(--td-comp-margin-xxs);
                    padding: var(--td-comp-paddingTB-xs) var(--td-comp-paddingLR-s);
                    border-radius: var(--td-radius-small);
                    font-size: var(--td-font-size-body-small);
                    cursor: pointer;
                    transition: all var(--td-transition);

                    &.assigned {
                        background-color: var(--td-success-color-1);
                        color: var(--td-success-color-7);
                        border: 1px solid var(--td-success-color-3);

                        &:hover {
                            background-color: var(--td-success-color-2);
                        }

                        .remove-icon {
                            color: var(--td-success-color-6);

                            &:hover {
                                color: var(--td-error-color);
                            }
                        }
                    }

                    &.available {
                        background-color: var(--td-bg-color-secondarycontainer);
                        color: var(--td-text-color-secondary);
                        border: 1px solid var(--td-component-border);

                        &:hover {
                            background-color: var(--td-brand-color-1);
                            color: var(--td-brand-color-7);
                            border-color: var(--td-brand-color-3);
                        }

                        .add-icon {
                            color: var(--td-text-color-placeholder);
                        }

                        &:hover .add-icon {
                            color: var(--td-brand-color-6);
                        }
                    }
                }

                .empty-state {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100px;
                    color: var(--td-text-color-placeholder);
                    font-size: var(--td-font-size-body-small);
                }
            }
        }
    }
}
</style>