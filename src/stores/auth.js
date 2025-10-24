import { defineStore } from 'pinia'

const createId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`

const createWalletEntry = ({ amount, description, type = 'credit', date }) => ({
  id: createId('wallet'),
  amount,
  type,
  description,
  date: date ?? new Date().toISOString(),
})

const createActivityEntry = ({ description, type = 'milestone', timestamp }) => ({
  id: createId('activity'),
  description,
  type,
  timestamp: timestamp ?? new Date().toISOString(),
})

const sanitizeAccount = (account) => {
  if (!account) {
    return null
  }

  const { password, ...profile } = account
  return JSON.parse(JSON.stringify(profile))
}

const ADMIN_ACCOUNT = {
  id: 'admin',
  username: 'admin',
  email: 'admin@stux.community',
  password: 'admin',
  name: 'Admin User',
  role: 'Administrator',
  school: 'StuX HQ',
  region: 'Global',
  balance: 340,
  bio: 'StuX administrator account overseeing insights, exchange, and community programs.',
  posts: [
    {
      id: 'post-admin-1',
      title: 'Mentor Circle: Design your semester impact plan',
      summary:
        'Shared facilitation notes from this week’s mentor circle on setting measurable, student-led impact goals.',
      createdAt: '2025-01-22T13:10:00.000Z',
    },
    {
      id: 'post-admin-2',
      title: 'Exchange recap: Micro-internship partnerships',
      summary:
        'Posted a recap on how micro-internship partners can source projects that respect student time and learning.',
      createdAt: '2025-02-05T09:45:00.000Z',
    },
  ],
  activity: [
    createActivityEntry({
      description: 'Awarded 120 Stunix for facilitating an inclusion workshop.',
      type: 'earn',
      timestamp: '2025-02-14T16:20:00.000Z',
    }),
    createActivityEntry({
      description: 'Redeemed 80 Stunix to sponsor a student research sprint.',
      type: 'spend',
      timestamp: '2025-02-18T10:05:00.000Z',
    }),
    createActivityEntry({
      description: 'Published a new insight prompt for community review.',
      type: 'insight',
      timestamp: '2025-03-03T08:15:00.000Z',
    }),
  ],
  wallet: [
    createWalletEntry({
      amount: 220,
      description: 'Balance forward',
      type: 'info',
      date: '2025-01-01T08:00:00.000Z',
    }),
    createWalletEntry({
      amount: 120,
      description: 'Facilitated inclusion workshop',
      type: 'credit',
      date: '2025-02-14T16:20:00.000Z',
    }),
    createWalletEntry({
      amount: -80,
      description: 'Sponsored student research sprint',
      type: 'debit',
      date: '2025-02-18T10:05:00.000Z',
    }),
    createWalletEntry({
      amount: 80,
      description: 'Insight prompt milestone bonus',
      type: 'credit',
      date: '2025-03-03T08:15:00.000Z',
    }),
  ],
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accounts: [ADMIN_ACCOUNT],
    user: null,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    stunixBalance: (state) => state.user?.balance ?? 0,
    displayName: (state) => state.user?.name ?? '',
    profilePosts: (state) => state.user?.posts ?? [],
    activityFeed: (state) => state.user?.activity ?? [],
    walletHistory: (state) => state.user?.wallet ?? [],
  },
  actions: {
    login({ username, password }) {
      const normalizedIdentifier = username?.trim().toLowerCase()
      const normalizedPassword = password?.trim()

      if (!normalizedIdentifier || !normalizedPassword) {
        this.user = null
        this.error = 'Please enter both a username/email and password.'
        return { success: false, message: this.error }
      }

      const matchingAccount = this.accounts.find((account) => {
        const accountUsername = account.username?.toLowerCase()
        const accountEmail = account.email?.toLowerCase()

        return (
          normalizedIdentifier === accountUsername ||
          normalizedIdentifier === accountEmail
        )
      })

      if (matchingAccount && matchingAccount.password === normalizedPassword) {
        this.user = sanitizeAccount(matchingAccount)
        this.error = null
        return { success: true }
      }

      this.user = null
      this.error = 'Invalid username or password. Please try again.'
      return { success: false, message: this.error }
    },
    signup({ name, email, school, region, password }) {
      const trimmedName = name?.trim()
      const normalizedEmail = email?.trim().toLowerCase()
      const trimmedSchool = school?.trim()
      const trimmedRegion = region?.trim()
      const normalizedPassword = password?.trim()

      if (!trimmedName || !normalizedEmail || !normalizedPassword) {
        this.error = 'Name, email, and password are required to create an account.'
        return { success: false, message: this.error }
      }

      const existingAccount = this.accounts.find(
        (account) => account.email?.toLowerCase() === normalizedEmail
      )

      if (existingAccount) {
        this.error = 'An account with that email already exists. Try logging in.'
        return { success: false, message: this.error }
      }

      const username = normalizedEmail.split('@')[0] ?? normalizedEmail

      const welcomeActivity = createActivityEntry({
        description: 'Joined StuX and unlocked the welcome toolkit.',
        type: 'milestone',
      })

      const welcomeCredit = createWalletEntry({
        amount: 120,
        description: 'Welcome bonus for joining StuX',
        type: 'credit',
      })

      const newAccount = {
        id: createId('user'),
        username,
        email: normalizedEmail,
        password: normalizedPassword,
        name: trimmedName,
        role: 'Member',
        school: trimmedSchool || 'Independent learner',
        region: trimmedRegion || 'Global',
        balance: 120,
        bio: 'New StuX member ready to collaborate, learn, and earn Stunix.',
        posts: [],
        activity: [welcomeActivity],
        wallet: [
          createWalletEntry({
            amount: 0,
            description: 'Initial balance',
            type: 'info',
          }),
          welcomeCredit,
        ],
      }

      this.accounts.push(newAccount)
      this.user = sanitizeAccount(newAccount)
      this.error = null

      return { success: true }
    },
    updateProfile({ school, region, activityEntry }) {
      if (!this.user) {
        this.error = 'You need to be signed in to update your profile.'
        return { success: false, message: this.error }
      }

      const accountIndex = this.accounts.findIndex(
        (account) => account.id === this.user.id
      )

      if (accountIndex === -1) {
        this.error = 'Unable to locate your account record.'
        return { success: false, message: this.error }
      }

      const currentAccount = this.accounts[accountIndex]
      const updatedAccount = {
        ...currentAccount,
        school: school ?? currentAccount.school,
        region: region ?? currentAccount.region,
      }

      if (activityEntry) {
        updatedAccount.activity = [activityEntry, ...currentAccount.activity]
      }

      this.accounts.splice(accountIndex, 1, updatedAccount)
      this.user = sanitizeAccount(updatedAccount)
      this.error = null

      return { success: true }
    },
    logout() {
      this.user = null
      this.error = null
    },
  },
})
