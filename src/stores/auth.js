import { defineStore } from 'pinia'

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
}

const ADMIN_PROFILE = {
  id: 'admin',
  username: 'admin',
  name: 'Admin User',
  role: 'Administrator',
  balance: 100,
  bio: 'StuX administrator account overseeing insights, exchange, and community programs.',
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    stunixBalance: (state) => state.user?.balance ?? 0,
    displayName: (state) => state.user?.name ?? '',
  },
  actions: {
    login({ username, password }) {
      const normalizedUsername = username?.trim().toLowerCase()
      const normalizedPassword = password?.trim()

      if (
        normalizedUsername === ADMIN_CREDENTIALS.username &&
        normalizedPassword === ADMIN_CREDENTIALS.password
      ) {
        this.user = { ...ADMIN_PROFILE }
        this.error = null
        return { success: true }
      }

      this.user = null
      this.error = 'Invalid username or password. Please try again.'
      return { success: false, message: this.error }
    },
    logout() {
      this.user = null
      this.error = null
    },
  },
})
