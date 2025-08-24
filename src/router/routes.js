// 常量路由 - 不需要权限验证的路由
export const constantRoutes = [
  // 登录页面 - 独立布局
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: {
      title: '登录',
      icon: 'login',
      hide: true
    }
  },
  // 主布局路由 - 包含所有管理页面
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/home',
    children: [
      // 一层菜单 - 首页
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/Home.vue'),
        meta: {
          title: '首页',
          icon: 'home',
          hide: false
        }
      },
      // 一层菜单 - 控制台
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: {
          title: '控制台',
          icon: 'dashboard',
          hide: false
        }
      },
      // 二层菜单 - 用户管理
      {
        path: '/user',
        name: 'UserManagement',
        redirect: '/user/list',
        meta: {
          title: '用户管理',
          icon: 'user',
          hide: false
        },
        children: [
          {
            path: '/user/list',
            name: 'UserList',
            component: () => import('@/views/user/UserList.vue'),
            meta: {
              title: '用户列表',
              icon: 'usergroup',
              hide: false
            }
          },
          {
            path: '/user/roles',
            name: 'UserRoles',
            component: () => import('@/views/user/UserRoles.vue'),
            meta: {
              title: '角色管理',
              icon: 'secured',
              hide: false
            }
          }
        ]
      },
      // 三层菜单 - 内容管理
      {
        path: '/content',
        name: 'ContentManagement',
        redirect: '/content/article/list',
        meta: {
          title: '内容管理',
          icon: 'setting',
          hide: false
        },
        children: [
          {
            path: '/content/article',
            name: 'ArticleManagement',
            redirect: '/content/article/list',
            meta: {
              title: '文章管理',
              icon: 'edit',
              hide: false
            },
            children: [
              {
                path: '/content/article/list',
                name: 'ArticleList',
                component: () => import('@/views/content/article/ArticleList.vue'),
                meta: {
                  title: '文章列表',
                  icon: 'bulletpoint',
                  hide: false
                }
              },
              {
                path: '/content/article/create',
                name: 'ArticleCreate',
                component: () => import('@/views/content/article/ArticleCreate.vue'),
                meta: {
                  title: '创建文章',
                  icon: 'add',
                  hide: false
                }
              },
              {
                path: '/content/article/category',
                name: 'ArticleCategory',
                component: () => import('@/views/content/article/ArticleCategory.vue'),
                meta: {
                  title: '文章分类',
                  icon: 'chart-3d',
                  hide: false
                }
              }
            ]
          },
          {
            path: '/content/media',
            name: 'MediaManagement',
            redirect: '/content/media/images',
            meta: {
              title: '媒体管理',
              icon: 'brightness',
              hide: false
            },
            children: [
              {
                path: '/content/media/images',
                name: 'MediaImages',
                component: () => import('@/views/content/media/MediaImages.vue'),
                meta: {
                  title: '图片管理',
                  icon: 'face-retouching',
                  hide: false
                }
              },
              {
                path: '/content/media/videos',
                name: 'MediaVideos',
                component: () => import('@/views/content/media/MediaVideos.vue'),
                meta: {
                  title: '视频管理',
                  icon: 'markup',
                  hide: false
                }
              }
            ]
          }
        ]
      },
      // 二层菜单 - 系统管理
      {
        path: '/system',
        name: 'SystemManagement',
        redirect: '/system/config',
        meta: {
          title: '系统管理',
          icon: 'setting-1',
          hide: false
        },
        children: [
          {
            path: '/system/config',
            name: 'SystemConfig',
            component: () => import('@/views/system/SystemConfig.vue'),
            meta: {
              title: '系统配置',
              icon: 'palette',
              hide: false
            }
          },
          {
            path: '/system/logs',
            name: 'SystemLogs',
            component: () => import('@/views/system/SystemLogs.vue'),
            meta: {
              title: '系统日志',
              icon: 'pause-circle-stroke',
              hide: false
            }
          },
          {
            path: '/system/backup',
            name: 'SystemBackup',
            component: () => import('@/views/system/SystemBackup.vue'),
            meta: {
              title: '数据备份',
              icon: 'gesture-applause',
              hide: false
            }
          }
        ]
      },
      // 二层菜单 - 财务管理
      {
        path: '/finance',
        name: 'FinanceManagement',
        redirect: '/finance/income',
        meta: {
          title: '财务管理',
          icon: 'chart-pie',
          hide: false
        },
        children: [
          {
            path: '/finance/income',
            name: 'FinanceIncome',
            component: () => import('@/views/finance/FinanceIncome.vue'),
            meta: {
              title: '收入管理',
              icon: 'application',
              hide: false
            }
          },
          {
            path: '/finance/expense',
            name: 'FinanceExpense',
            component: () => import('@/views/finance/FinanceExpense.vue'),
            meta: {
              title: '支出管理',
              icon: 'arrow-right-circle',
              hide: false
            }
          },
          {
            path: '/finance/report',
            name: 'FinanceReport',
            component: () => import('@/views/finance/FinanceReport.vue'),
            meta: {
              title: '财务报表',
              icon: 'chart-bar',
              hide: false
            }
          }
        ]
      },
      // 二层菜单 - 营销管理
      {
        path: '/marketing',
        name: 'MarketingManagement',
        redirect: '/marketing/campaign',
        meta: {
          title: '营销管理',
          icon: 'notification',
          hide: false
        },
        children: [
          {
            path: '/marketing/campaign',
            name: 'MarketingCampaign',
            component: () => import('@/views/marketing/MarketingCampaign.vue'),
            meta: {
              title: '营销活动',
              icon: 'chevron-up-circle',
              hide: false
            }
          },
          {
            path: '/marketing/customer',
            name: 'MarketingCustomer',
            component: () => import('@/views/marketing/MarketingCustomer.vue'),
            meta: {
              title: '客户管理',
              icon: 'user',
              hide: false
            }
          },
          {
            path: '/marketing/analytics',
            name: 'MarketingAnalytics',
            component: () => import('@/views/marketing/MarketingAnalytics.vue'),
            meta: {
              title: '营销分析',
              icon: 'chart-line',
              hide: false
            }
          }
        ]
      },
      // 一层菜单 - 关于系统
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/about/About.vue'),
        meta: {
          title: '关于系统',
          icon: 'info-circle',
          hide: false
        }
      }
    ]
  }
]

// 动态路由 - 需要权限验证的路由
export const asyncRoutes = [
  // 这里可以放置需要权限验证的动态路由
  // 注意：不要与constantRoutes中的路由重复
]

// 任意路由 - 错误页面等
export const anyRoutes = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
    meta: {
      hidden: true
    }
  }
]