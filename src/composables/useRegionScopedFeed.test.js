import assert from 'node:assert/strict'
import { beforeEach, describe, it } from 'node:test'
import { nextTick, ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

import { useRegionScopedFeed } from './useRegionScopedFeed.js'
import { useRegionStore } from '../stores/region.js'
import { useAuthStore } from '../stores/auth.js'

describe('useRegionScopedFeed', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const authStore = useAuthStore()
    authStore.user = { username: 'tester', region: 'Vietnam' }
  })

  it('scopes feed to the active region hierarchy', async () => {
    const items = ref([
      { id: '1', region: 'vietnam' },
      { id: '2', region: 'melbourne' },
      { id: '3', region: 'tphcm' },
    ])

    const regionStore = useRegionStore()
    regionStore.setRegion('vietnam')

    const { scopedFeed } = useRegionScopedFeed(items)

    assert.deepEqual(
      scopedFeed.value.map((item) => item.id),
      ['1', '3'],
    )

    regionStore.setRegion('melbourne')
    await nextTick()

    assert.deepEqual(scopedFeed.value.map((item) => item.id), ['2'])
  })

  it('keeps predicate-driven consumers in sync with scope updates', async () => {
    const items = ref([
      { id: '1', region: 'vietnam', category: 'a' },
      { id: '2', region: 'tphcm', category: 'b' },
      { id: '3', region: 'melbourne', category: 'a' },
    ])

    const regionStore = useRegionStore()
    regionStore.setRegion('vietnam')

    const activeCategory = ref('a')

    const primaryFeed = useRegionScopedFeed(items)
    const filteredFeed = useRegionScopedFeed(items, {
      predicate: (item) => item.category === activeCategory.value,
    })

    assert.deepEqual(primaryFeed.scopedFeed.value.map((item) => item.id), ['1', '2'])
    assert.deepEqual(filteredFeed.scopedFeed.value.map((item) => item.id), ['1'])

    activeCategory.value = 'b'
    await nextTick()

    assert.deepEqual(filteredFeed.scopedFeed.value.map((item) => item.id), ['2'])

    regionStore.setRegion('melbourne')
    await nextTick()

    assert.deepEqual(primaryFeed.scopedFeed.value.map((item) => item.id), ['3'])
    assert.deepEqual(filteredFeed.scopedFeed.value.map((item) => item.id), [])
  })

  it('derives a user region id with fallback to the active scope', async () => {
    const items = ref([])

    const regionStore = useRegionStore()
    regionStore.setRegion('melbourne')

    const authStore = useAuthStore()
    authStore.user = { username: 'demo', region: '  TPHCM ' }

    const { userRegionId, userRegionLabel } = useRegionScopedFeed(items)

    assert.equal(userRegionLabel.value, 'TPHCM')
    assert.equal(userRegionId.value, 'tphcm')

    authStore.user = { username: 'demo', region: '   ' }
    await nextTick()

    assert.equal(userRegionLabel.value, '')
    assert.equal(userRegionId.value, 'melbourne')
  })
})
