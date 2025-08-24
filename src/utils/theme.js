/**
 * 主题模式枚举
 */
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
}

/**
 * 预设主题色
 */
export const PRESET_COLORS = {
  blue: '#0052d9',
  green: '#00a870',
  orange: '#ed7b2f',
  red: '#e34d59',
  purple: '#834ec2',
  cyan: '#029cd4',
  pink: '#ed49b4',
  yellow: '#e37318'
}

/**
 * 将十六进制颜色转换为 RGB
 * @param {string} hex - 十六进制颜色值
 * @returns {Object} RGB 对象
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * 将 RGB 转换为十六进制颜色
 * @param {number} r - 红色值 (0-255)
 * @param {number} g - 绿色值 (0-255)
 * @param {number} b - 蓝色值 (0-255)
 * @returns {string} 十六进制颜色值
 */
export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * 将 RGB 转换为 HSL
 * @param {number} r - 红色值 (0-255)
 * @param {number} g - 绿色值 (0-255)
 * @param {number} b - 蓝色值 (0-255)
 * @returns {Object} HSL 对象
 */
export function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

/**
 * 将 HSL 转换为 RGB
 * @param {number} h - 色相 (0-360)
 * @param {number} s - 饱和度 (0-100)
 * @param {number} l - 亮度 (0-100)
 * @returns {Object} RGB 对象
 */
export function hslToRgb(h, s, l) {
  h /= 360
  s /= 100
  l /= 100

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

/**
 * 生成颜色色阶（10个等级）
 * 使用 HSL 颜色空间，通过调整亮度生成色阶
 * @param {string} baseColor - 基础颜色（十六进制格式）
 * @returns {Object} 包含10个色阶的对象
 */
export function generateColorGradations(baseColor) {
  try {
    // 将十六进制颜色转换为 RGB
    const rgb = hexToRgb(baseColor)
    if (!rgb) {
      throw new Error('无效的颜色格式')
    }

    // 转换为 HSL
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

    // 定义10个色阶的亮度值（从浅到深）
    const lightness = [95, 85, 75, 65, 55, 45, 35, 25, 15, 8]

    const gradations = {}

    lightness.forEach((l, index) => {
      // 保持色相和饱和度，只调整亮度
      const newRgb = hslToRgb(hsl.h, hsl.s, l)
      gradations[index + 1] = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    })

    return gradations
  } catch (error) {
    console.error('生成颜色梯度时出错:', error)
    // 返回基础颜色作为所有梯度
    const fallback = {}
    for (let i = 1; i <= 10; i++) {
      fallback[i] = baseColor
    }
    return fallback
  }
}

/**
 * 设置主题模式
 * @param {string} mode - 主题模式 ('light' | 'dark')
 */
export function setThemeMode(mode) {
  const root = document.documentElement
  root.setAttribute('theme-mode', mode)
}

/**
 * 应用主色色阶
 * @param {string} primaryColor - 主色
 */
export function applyPrimaryColor(primaryColor) {
  const root = document.documentElement
  const brandColors = generateColorGradations(primaryColor)
  Object.entries(brandColors).forEach(([index, color]) => {
    root.style.setProperty(`--td-brand-color-${index}`, color)
  })
}

/**
 * 应用完整主题配置（兼容性函数）
 * @param {Object} theme - 主题配置
 * @param {string} theme.mode - 主题模式 ('light' | 'dark')
 * @param {string} theme.primaryColor - 主色
 */
export function applyTheme(theme) {
  setThemeMode(theme.mode)
  applyPrimaryColor(theme.primaryColor)
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
    mode: THEME_MODE.AUTO,
    primaryColor: PRESET_COLORS.blue
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
          mode: systemMode,
          primaryColor: config.primaryColor
        })
      }
    })
  }

  // 应用主题
  applyTheme({
    mode: actualMode,
    primaryColor: config.primaryColor
  })

  return config
}