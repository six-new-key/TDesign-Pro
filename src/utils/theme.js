/**
 * 主题模式枚举
 */
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
}

/**
 * 设置主题模式
 * @param {string} mode - 主题模式 ('light' | 'dark')
 */
export function setThemeMode(mode) {
  const root = document.documentElement
  
  if (mode === THEME_MODE.AUTO) {
    const systemMode = getSystemThemeMode()
    root.setAttribute('theme-mode', systemMode)
  } else {
    root.setAttribute('theme-mode', mode)
  }
}

/**
 * 应用主题配置
 * @param {Object} theme - 主题配置
 * @param {string} theme.mode - 主题模式 ('light' | 'dark')
 */
export function applyTheme(theme) {
  setThemeMode(theme.mode)
}

/**
 * 获取系统主题模式
 * @returns {string} 'light' | 'dark'
 */
export function getSystemThemeMode() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

/**
 * 监听系统主题变化
 * @param {Function} callback - 回调函数
 * @returns {Function} 取消监听函数
 */
export function watchSystemThemeChange(callback) {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      callback(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }

  return () => { }
}

/**
 * 从本地存储获取主题配置
 * @returns {Object} 主题配置
 */
export function getThemeFromStorage() {
  try {
    const stored = localStorage.getItem('theme-config')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('读取主题配置失败:', error)
  }

  return {
    mode: THEME_MODE.AUTO
  }
}

/**
 * 保存主题配置到本地存储
 * @param {Object} config - 主题配置
 */
export function saveThemeToStorage(config) {
  try {
    localStorage.setItem('theme-config', JSON.stringify(config))
  } catch (error) {
    console.error('保存主题配置失败:', error)
  }
}

/**
 * 初始化主题系统
 */
export function initTheme() {
  const config = getThemeFromStorage()
  let actualMode = config.mode

  // 如果是自动模式，获取系统主题
  if (config.mode === THEME_MODE.AUTO) {
    actualMode = getSystemThemeMode()

    // 监听系统主题变化
    watchSystemThemeChange((systemMode) => {
      if (getThemeFromStorage().mode === THEME_MODE.AUTO) {
        applyTheme({
          mode: systemMode
        })
      }
    })
  }

  // 应用主题
  applyTheme({
    mode: actualMode
  })

  return config
}