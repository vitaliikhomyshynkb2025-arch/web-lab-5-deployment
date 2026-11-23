import test from 'node:test'
import assert from 'node:assert/strict'
import { CONTACT_DELAY, fetchReviews, prettyValue, storageEntries, submitContact, themeAtHour } from '../core.js'

test('Тема на всіх годинах доби, включно з 06:59/07:00/20:59/21:00', () => {
  for (let hour = 0; hour < 24; hour++) assert.equal(themeAtHour(hour), hour >= 7 && hour < 21 ? 'light' : 'dark')
  assert.equal(CONTACT_DELAY, 60000)
})
test('Коментарі: правильний endpoint і збереження порядку', async () => {
  const data = [115, 111].map((id) => ({ postId: 23, id, name: 'Title', email: 'test@example.com', body: '<img onerror=alert(1)>' }))
  const result = await fetchReviews({ request: async (url) => {
    assert.equal(url, 'https://jsonplaceholder.typicode.com/posts/23/comments')
    return { ok: true, json: async () => data }
  } })
  assert.deepEqual(result.map((r) => r.id), [115, 111])
  assert.equal(result[0].body, data[0].body)
})
test('HTTP 500 не стає успішним списком', async () => {
  await assert.rejects(fetchReviews({ request: async () => ({ ok: false, status: 500 }) }), /HTTP 500/)
})
test('Пошкоджений формат і чужий варіант відхиляються', async () => {
  for (const data of [{}, [{ postId: 1, id: 1, name: 'x', body: 'x', email: 'x' }], [null]]) {
    await assert.rejects(fetchReviews({ request: async () => ({ ok: true, json: async () => data }) }))
  }
})
test('Мережева помилка передається для показу користувачу', async () => {
  await assert.rejects(fetchReviews({ request: async () => { throw new Error('offline') } }), /offline/)
})
test('Сигнал скасування запиту передається fetch', async () => {
  const controller = new AbortController()
  await fetchReviews({ signal: controller.signal, request: async (_, options) => {
    assert.equal(options.signal, controller.signal)
    return { ok: true, json: async () => [] }
  } })
})
test('Formspree: POST, FormData, Accept JSON і реальний endpoint', async () => {
  const data = new FormData(); data.set('message', 'test')
  const result = await submitContact('https://formspree.io/f/xwllrgkg', data, async (url, options) => {
    assert.equal(url, 'https://formspree.io/f/xwllrgkg'); assert.equal(options.method, 'POST')
    assert.equal(options.body, data); assert.equal(options.headers.Accept, 'application/json')
    return { ok: true, json: async () => ({ ok: true }) }
  })
  assert.equal(result.ok, true)
})
test('Некоректна адреса не надсилає дані на інший сервер', async () => {
  let calls = 0
  await assert.rejects(submitContact('https://example.com/f/x', new FormData(), async () => { calls++ }), /не налаштовано/)
  assert.equal(calls, 0)
})
test('Відмова форми не показує помилковий успіх', async () => {
  await assert.rejects(submitContact('https://formspree.io/f/xwllrgkg', new FormData(), async () => ({ ok: false, status: 422, json: async () => ({ errors: [{ message: 'Invalid email' }] }) })), /Invalid email/)
})
test('Усі ключі localStorage, JSON і звичайні рядки', () => {
  const storage = { length: 2, key: (i) => ['browserInfo', 'custom'][i], getItem: (key) => key === 'custom' ? '<script>text</script>' : '{"platform":"MacIntel"}' }
  assert.deepEqual(storageEntries(storage).map((e) => e.key), ['browserInfo', 'custom'])
  assert.equal(prettyValue('hello'), 'hello')
  assert.equal(prettyValue('{"a":1}'), '{\n  "a": 1\n}')
})
