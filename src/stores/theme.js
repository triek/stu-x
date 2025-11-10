import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'stux-theme'

const applyThemeClass = (theme) => {
  if (typeof document === 'undefined') {
    return
  }

  const isDark = theme === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = isDark ? 'dark light' : 'light dark'
}

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref('light')
  const initialized = ref(false)

  const isDarkMode = computed(() => currentTheme.value === 'dark')

  const setTheme = (nextTheme, { persist = true } = {}) => {
    const normalizedTheme = nextTheme === 'dark' ? 'dark' : 'light'
    currentTheme.value = normalizedTheme
    applyThemeClass(normalizedTheme)

    if (persist && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, normalizedTheme)
    }
  }

  const toggleTheme = () => {
    setTheme(isDarkMode.value ? 'light' : 'dark')
  }

  const initTheme = () => {
    if (initialized.value) {
      return
    }

    let preferredTheme = 'light'

    if (typeof window !== 'undefined') {
      const storedTheme = window.localStorage.getItem(STORAGE_KEY)

      if (storedTheme === 'dark' || storedTheme === 'light') {
        preferredTheme = storedTheme
      }
    }

    setTheme(preferredTheme, { persist: false })
    initialized.value = true
  }

  return {
    currentTheme,
    isDarkMode,
    toggleTheme,
    setTheme,
    initTheme,
  }
})
