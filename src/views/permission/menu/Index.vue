<template>
    <!-- 搜索和操作区域 -->
    <t-card :bordered="false" class="search-card">
        <!-- 搜索表单容器：左右布局，左侧表单自适应，右侧按钮固定宽度 -->
        <div class="search-form">
            <!-- 左侧表单区域：包含搜索条件 -->
            <div class="search-form-left">
                <t-form ref="searchFormRef" :data="searchForm" layout="inline" :label-width="0">
                    <!-- 菜单名称搜索 -->
                    <t-form-item name="title">
                        <t-input v-model="searchForm.title" placeholder="请输入菜单名称" clearable style="width: 200px" />
                    </t-form-item>
                    <!-- 菜单类型筛选 -->
                    <t-form-item name="type">
                        <t-select v-model="searchForm.type" placeholder="请选择菜单类型" clearable style="width: 200px">
                            <t-option :value="0" label="目录" />
                            <t-option :value="1" label="菜单" />
                            <t-option :value="2" label="按钮" />
                        </t-select>
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
            <div class="table-header-actions">
                <!-- 新增菜单按钮 -->
                <t-button theme="primary" @click="handleAdd">
                    <template #icon><t-icon name="add" /></template>
                    新增菜单
                </t-button>
                <!-- 展开/收起按钮 -->
                <t-button theme="default" variant="outline" @click="handleExpandAll">
                    <template #icon><t-icon :name="isExpandAll ? 'unfold-less' : 'unfold-more'" /></template>
                    {{ isExpandAll ? '收起全部' : '展开全部' }}
                </t-button>
            </div>
        </template>
        <!-- 菜单数据表格：树形结构显示 -->
        <t-enhanced-table maxHeight="420px" ref="tableRef" :data="tableData" :columns="columns" :loading="loading"
            :tree="{ childrenKey: 'children', treeNodeColumnIndex: 0, expandTreeNodeOnClick: true }" row-key="id" stripe
            hover>
            <!-- 菜单类型列自定义渲染 -->
            <template #type="{ row }">
                <t-tag :theme="getTypeTheme(row.type)" variant="light">
                    {{ getTypeLabel(row.type) }}
                </t-tag>
            </template>

            <!-- 菜单图标列自定义渲染 -->
            <template #icon="{ row }">
                <t-icon v-if="row.icon" :name="row.icon" />
                <span v-else class="text-placeholder">-</span>
            </template>

            <!-- 状态列自定义渲染：显示启用/禁用标签 -->
            <template #status="{ row }">
                <t-tag :theme="row.status === 1 ? 'success' : 'danger'" variant="light">
                    {{ row.status === 1 ? '启用' : '禁用' }}
                </t-tag>
            </template>

            <!-- 操作列自定义渲染：编辑、删除、更多操作 -->
            <template #operation="{ row }">
                <t-space>
                    <!-- 编辑按钮 -->
                    <t-button theme="primary" variant="text" size="small" @click="handleEdit(row)">
                        <template #icon><t-icon name="edit" /></template>
                        编辑
                    </t-button>
                    <!-- 删除按钮：带确认弹窗 -->
                    <t-popconfirm content="确认删除该菜单吗？" @confirm="handleDelete(row)">
                        <t-button theme="danger" variant="text" size="small">
                            <template #icon><t-icon name="delete" /></template>
                            删除
                        </t-button>
                    </t-popconfirm>
                    <!-- 新增子菜单按钮 -->
                    <t-button theme="default" variant="text" size="small" @click="handleAddChild(row)">
                        <template #icon><t-icon name="add" /></template>
                        新增
                    </t-button>
                </t-space>
            </template>
        </t-enhanced-table>
    </t-card>

    <!-- 新增/编辑菜单弹窗：根据isEdit状态动态显示标题和按钮文本 -->
    <t-dialog v-model:visible="menuDialogVisible" :header="isEdit ? '编辑菜单' : '新增菜单'" width="800px" :confirm-btn="null"
        :cancel-btn="null" class="menu-form-dialog">
        <!-- 菜单表单：支持表单验证和提交 -->
        <t-form ref="menuFormRef" label-align="top" :data="menuForm" :rules="menuFormRules" label-width="100px"
            @submit="handleMenuSubmit" class="menu-form">
            <!-- 表单网格布局：两列显示 -->
            <div class="form-grid">
                <!-- 上级菜单选择 -->
                <t-form-item label="上级菜单" name="parentId" class="form-item full-width">
                    <t-tree-select v-model="menuForm.parentId" :data="parentMenuOptions"
                        :keys="{ value: 'id', label: 'title', children: 'children' }" placeholder="请选择上级菜单（不选择则为顶级菜单）"
                        clearable />
                </t-form-item>
                <!-- 菜单类型选择 -->
                <t-form-item label="菜单类型" name="type" class="form-item">
                    <t-radio-group v-model="menuForm.type" @change="handleTypeChange">
                        <t-radio :value="0">目录</t-radio>
                        <t-radio :value="1">菜单</t-radio>
                        <t-radio :value="2">按钮</t-radio>
                    </t-radio-group>
                </t-form-item>
                <!-- 菜单名称输入 -->
                <t-form-item label="菜单名称" name="title" class="form-item">
                    <t-input v-model="menuForm.title" placeholder="请输入菜单名称" />
                </t-form-item>
                <!-- 菜单名称（英文） -->
                <t-form-item label="菜单名称（英文）" name="name" class="form-item">
                    <t-input v-model="menuForm.name" placeholder="请输入菜单名称（英文）" />
                </t-form-item>
                <!-- 组件路径（菜单类型显示） -->
                <t-form-item v-if="menuForm.type === 1" label="组件路径" name="component" class="form-item">
                    <t-input v-model="menuForm.component" placeholder="请输入组件路径" />
                </t-form-item>
                <!-- 权限标识（按钮类型显示） -->
                <t-form-item v-if="menuForm.type === 2" label="权限标识" name="permission" class="form-item">
                    <t-input v-model="menuForm.permission" placeholder="请输入权限标识" />
                </t-form-item>
                <!-- 显示状态 -->
                <t-form-item label="显示状态" name="visible" class="form-item">
                    <t-radio-group v-model="menuForm.visible">
                        <t-radio :value="1">显示</t-radio>
                        <t-radio :value="0">隐藏</t-radio>
                    </t-radio-group>
                </t-form-item>
                <!-- 菜单状态 -->
                <t-form-item label="菜单状态" name="status" class="form-item">
                    <t-radio-group v-model="menuForm.status">
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
                <t-button theme="default" @click="menuDialogVisible = false">取消</t-button>
                <!-- 提交按钮：根据编辑状态显示不同文本 -->
                <t-button theme="primary" @click="handleMenuSubmit" :loading="submitLoading">
                    {{ isEdit ? '更新' : '创建' }}
                </t-button>
            </t-space>
        </template>
    </t-dialog>
</template>

<script setup>
// Vue 3 Composition API 相关导入
import { ref, reactive, onMounted, computed } from 'vue'
// TDesign 组件库相关导入
import { MessagePlugin, EnhancedTable } from 'tdesign-vue-next'
// 菜单管理相关 API 导入
import {
    queryMenuList,        // 查询菜单列表
    queryMenuListByLike,  // 模糊查询菜单
    addMenu,             // 新增菜单
    updateMenu,          // 更新菜单
    deleteMenu,          // 删除菜单
    echoMenu             // 菜单数据回显
} from '@/api/menu'

// ==================== 响应式数据定义 ====================
// 加载状态控制
const loading = ref(false)                    // 表格数据加载状态
const submitLoading = ref(false)              // 菜单表单提交状态

// 表格相关数据
const tableData = ref([])                     // 表格数据

// 弹窗显示控制
const menuDialogVisible = ref(false)          // 菜单表单弹窗显示状态

// 业务状态控制
const isEdit = ref(false)                     // 是否为编辑模式
const parentMenuOptions = ref([])             // 上级菜单选项

// 表单引用
const menuFormRef = ref()                     // 菜单表单引用

// ==================== 表单数据定义 ====================
// 搜索表单数据
const searchForm = reactive({
    title: '',       // 菜单名称搜索条件
    type: '',        // 菜单类型搜索条件（0-目录，1-菜单，2-按钮）
    status: ''       // 状态搜索条件（1-启用，0-禁用）
})

// 菜单表单数据
const menuForm = reactive({
    id: null,              // 菜单ID（编辑时使用）
    parentId: '0',         // 上级菜单ID
    title: '',             // 菜单名称
    type: 0,               // 菜单类型（0-目录，1-菜单，2-按钮）
    name: '',              // 菜单名称（英文）
    permission: '',        // 权限标识
    component: '',         // 组件路径
    status: 1              // 菜单状态（1-启用，0-禁用）
})

// ==================== 表格列配置 ====================
const columns = [
    {
        colKey: 'title',        // 菜单名称列
        title: '菜单名称',
        width: 200,
        fixed: 'left'
    },
    {
        colKey: 'type',         // 菜单类型列（自定义渲染）
        title: '类型',
        width: 100,
        cell: 'type'
    },
    {
        colKey: 'name',         // 菜单名称（英文）列
        title: '菜单名称',
        width: 150
    },
    {
        colKey: 'component',    // 组件路径列
        title: '组件路径',
        width: 180
    },
    {
        colKey: 'permission',   // 权限标识列
        title: '权限标识',
        width: 200
    },
    {
        colKey: 'status',       // 状态列（自定义渲染）
        title: '状态',
        width: 100,
        cell: 'status'
    },
    {
        colKey: 'operation',    // 操作列（固定右侧，自定义渲染）
        title: '操作',
        width: 180,
        fixed: 'right',
        cell: 'operation'
    }
]

// ==================== 表单验证规则 ====================
// 菜单表单验证规则
const menuFormRules = {
    title: [
        { required: true, message: '菜单名称不能为空' },
        { min: 1, max: 50, message: '菜单名称长度为1-50个字符' }
    ],
    type: [
        { required: true, message: '菜单类型不能为空' }
    ],
    name: [
        { required: true, message: '菜单名称（英文）不能为空', trigger: 'blur' }
    ],
    component: [
        { required: true, message: '组件路径不能为空', trigger: 'blur' }
    ],
    permission: [
        { required: true, message: '权限标识不能为空', trigger: 'blur' }
    ]
}

// ==================== 业务方法定义 ====================
/**
 * 获取菜单列表数据
 */
const fetchMenuList = async () => {
    loading.value = true

    // 如果有搜索条件，使用模糊查询
    if (searchForm.title || searchForm.type || searchForm.status !== '') {
        const params = {
            title: searchForm.title ? searchForm.title.trim() : '',
            type: searchForm.type || '',
            status: searchForm.status !== '' ? Number(searchForm.status) : ''
        }
        const response = await queryMenuListByLike(params)
        if (response.code === 200) {
            tableData.value = response.data || []
        }
    } else {
        // 否则查询所有菜单
        const response = await queryMenuList()
        if (response.code === 200) {
            tableData.value = response.data || []
        }
    }

    loading.value = false
}

/**
 * 获取上级菜单选项（用于新增/编辑时选择上级菜单）
 */
const fetchParentMenuOptions = async () => {
    const response = await queryMenuList()
    if (response.code === 200) {
        // 过滤出目录和菜单类型作为上级菜单选项
        const filterMenus = (menus) => {
            return menus.filter(menu => menu.type !== 2).map(menu => ({
                ...menu,
                children: menu.children ? filterMenus(menu.children) : []
            }))
        }
        parentMenuOptions.value = filterMenus(response.data || [])
    }
}

/**
 * 处理搜索操作
 */
const handleSearch = () => {
    fetchMenuList()
}

/**
 * 处理重置操作
 */
const handleReset = () => {
    Object.assign(searchForm, {
        title: '',
        type: '',
        status: ''
    })
    fetchMenuList()
}

/**
 * 处理展开/收起全部
 */
const handleExpandAll = () => {
    // 展开/收起功能由EnhancedTable组件内部处理
}

/**
 * 处理新增菜单操作
 */
const handleAdd = () => {
    isEdit.value = false
    resetMenuForm()
    fetchParentMenuOptions()
    menuDialogVisible.value = true
}

/**
 * 处理新增子菜单操作
 */
const handleAddChild = (row) => {
    isEdit.value = false
    resetMenuForm()
    menuForm.parentId = row.id
    fetchParentMenuOptions()
    menuDialogVisible.value = true
}

/**
 * 处理编辑菜单操作
 */
const handleEdit = async (row) => {
    isEdit.value = true
    const response = await echoMenu(row.id)
    if (response.code === 200) {
        Object.assign(menuForm, response.data)
        fetchParentMenuOptions()
        menuDialogVisible.value = true
    }
}

/**
 * 处理删除菜单操作
 */
const handleDelete = async (row) => {
    const response = await deleteMenu(row.id)
    if (response.code === 200) {
        MessagePlugin.success('删除成功')
        fetchMenuList()
    }
}

/**
 * 处理菜单类型变化
 */
const handleTypeChange = (value) => {
    // 根据菜单类型清空相关字段
    if (value === 2) {
        // 按钮类型清空组件相关字段
        menuForm.component = ''
    } else if (value === 0) {
        // 目录类型清空组件和权限相关字段
        menuForm.component = ''
        menuForm.permission = ''
    } else if (value === 1) {
        // 菜单类型清空权限标识
        menuForm.permission = ''
    }
}

/**
 * 处理菜单表单提交
 */
const handleMenuSubmit = async () => {
    // 表单验证
    const valid = await menuFormRef.value?.validate()
    if (!valid) return

    submitLoading.value = true

    const response = isEdit.value
        ? await updateMenu(menuForm)
        : await addMenu(menuForm)

    if (response.code === 200) {
        MessagePlugin.success(isEdit.value ? '更新成功' : '创建成功')
        menuDialogVisible.value = false
        fetchMenuList()
    }

    submitLoading.value = false
}

/**
 * 重置菜单表单
 */
const resetMenuForm = () => {
    Object.assign(menuForm, {
        id: null,
        parentId: '0',
        title: '',
        type: 0,
        name: '',
        permission: '',
        component: '',
        status: 1
    })
    menuFormRef.value?.clearValidate()
}

/**
 * 获取菜单类型标签主题
 */
const getTypeTheme = (type) => {
    const themeMap = {
        0: 'primary',   // 目录
        1: 'success',   // 菜单
        2: 'warning'    // 按钮
    }
    return themeMap[type] || 'default'
}

/**
 * 获取菜单类型标签文本
 */
const getTypeLabel = (type) => {
    const labelMap = {
        0: '目录',
        1: '菜单',
        2: '按钮'
    }
    return labelMap[type] || '未知'
}

// ==================== 生命周期钩子 ====================
onMounted(() => {
    fetchMenuList()
})
</script>

<style scoped>
/* 搜索卡片样式 */
.search-card {
    margin-bottom: 16px;
}

/* 搜索表单样式 */
.search-form {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
}

.search-form-left {
    flex: 1;
    min-width: 0;
}

.search-form-right {
    flex-shrink: 0;
}

/* 表格卡片样式 */
.table-card {
    margin-bottom: 16px;
}

/* 表格头部操作区域样式 */
.table-header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
}

/* 菜单表单弹窗样式 */
.menu-form-dialog {
    .menu-form {
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px 24px;

            .form-item {
                margin-bottom: 0;

                &.full-width {
                    grid-column: 1 / -1;
                }
            }
        }
    }
}

/* 占位符文本样式 */
.text-placeholder {
    color: var(--td-text-color-placeholder);
    font-style: italic;
}

/* 响应式布局 */
@media (max-width: 768px) {
    .search-form {
        flex-direction: column;
        align-items: stretch;
    }

    .search-form-right {
        align-self: flex-end;
    }

    .menu-form .form-grid {
        grid-template-columns: 1fr;

        .form-item.full-width {
            grid-column: 1;
        }
    }
}
</style>