import assert from 'node:assert/strict'
import { mock, test } from 'node:test'

import { DEFAULT_REGION_ID } from '../constants/regions.js'
import {
  cloneSeedData,
  generatePostId,
  parsePositiveInt,
  parseTagString,
  resolveRegionIds,
} from './postForm.js'

test('cloneSeedData creates a deep clone of the provided array', () => {
  const seed = [
    { id: 1, nested: { value: 'a' } },
    { id: 2, nested: { value: 'b' } },
  ]

  const cloned = cloneSeedData(seed)

  assert.notStrictEqual(cloned, seed)
  assert.deepStrictEqual(cloned, seed)

  cloned[0].nested.value = 'updated'
  assert.equal(seed[0].nested.value, 'a')
})

test('parsePositiveInt parses numbers and clamps invalid input', () => {
  assert.equal(parsePositiveInt('42'), 42)
  assert.equal(parsePositiveInt(7), 7)
  assert.equal(parsePositiveInt('-5'), 0)
  assert.equal(parsePositiveInt('abc', 3), 3)
  assert.equal(parsePositiveInt(undefined), 0)
})

test('parseTagString splits comma and whitespace separated tags while stripping hashes', () => {
  assert.deepStrictEqual(parseTagString('design, #ux research  #student-life'), [
    'design',
    'ux',
    'research',
    'student-life',
  ])
  assert.deepStrictEqual(parseTagString(''), [])
  assert.deepStrictEqual(parseTagString(null), [])
})

test('generatePostId builds ids with optional prefixes', () => {
  const restoreNow = mock.method(Date, 'now', () => 1234567890)
  const restoreRandom = mock.method(Math, 'random', () => 0.123456)

  try {
    assert.equal(generatePostId('example'), 'example-1234567890-4fzyo8')
    assert.equal(generatePostId(), '1234567890-4fzyo8')
  } finally {
    restoreNow.mock.restore()
    restoreRandom.mock.restore()
  }
})

test('resolveRegionIds collects all region identifiers and applies fallbacks', () => {
  const regions = resolveRegionIds({
    region: ' Hanoi ',
    regionId: '  vietNam  ',
    regions: ['TPHCM', 'hanoi'],
  })

  assert.deepStrictEqual(regions, ['hanoi', 'vietnam', 'tphcm'])
  assert.deepStrictEqual(resolveRegionIds({}), [DEFAULT_REGION_ID])
  assert.deepStrictEqual(resolveRegionIds({}, { defaultRegionId: 'custom' }), ['custom'])
})
