export const VARIANT = 23
export const REVIEWS_URL = `https://jsonplaceholder.typicode.com/posts/${VARIANT}/comments`
export const CONTACT_DELAY = 60_000

export function themeAtHour(hour) {
  return hour >= 7 && hour < 21 ? 'light' : 'dark'
}

export function collectSystemInfo(env = window) {
  const n = env.navigator
  return {
    userAgent: n.userAgent,
    platform: n.platform,
    appVersion: n.appVersion,
    vendor: n.vendor,
    language: n.language,
    languages: Array.from(n.languages || []),
    cookieEnabled: n.cookieEnabled,
    online: n.onLine,
    hardwareConcurrency: n.hardwareConcurrency ?? null,
    deviceMemoryGB: n.deviceMemory ?? null,
    maxTouchPoints: n.maxTouchPoints,
    userAgentData: n.userAgentData?.toJSON() ?? null,
    screen: {
      width: env.screen.width, height: env.screen.height,
      availWidth: env.screen.availWidth, availHeight: env.screen.availHeight,
      colorDepth: env.screen.colorDepth, pixelDepth: env.screen.pixelDepth,
    },
    viewport: { width: env.innerWidth, height: env.innerHeight, pixelRatio: env.devicePixelRatio },
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}

export function storageEntries(storage) {
  return Array.from({ length: storage.length }, (_, i) => storage.key(i))
    .filter((key) => key !== null)
    .map((key) => ({ key, value: storage.getItem(key) }))
}

export function prettyValue(value) {
  try { return JSON.stringify(JSON.parse(value), null, 2) }
  catch { return String(value) }
}

export async function fetchReviews({ signal, request = fetch } = {}) {
  const response = await request(REVIEWS_URL, { signal })
  if (!response.ok) throw new Error(`Сервер повернув HTTP ${response.status}.`)
  const reviews = await response.json()
  if (!Array.isArray(reviews) || reviews.some((r) =>
    !r || r.postId !== VARIANT || !Number.isInteger(r.id) || typeof r.name !== 'string'
    || typeof r.email !== 'string' || typeof r.body !== 'string')) {
    throw new Error('Сервер повернув некоректний список коментарів.')
  }
  return reviews // Порядок відповіді сервера збережено, сортування немає.
}

export async function submitContact(endpoint, data, request = fetch) {
  if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
    throw new Error('Адресу форми ще не налаштовано.')
  }
  const response = await request(endpoint, {
    method: 'POST', body: data, headers: { Accept: 'application/json' },
  })
  let result = {}
  try { result = await response.json() } catch { /* Можлива порожня відповідь. */ }
  if (!response.ok) {
    throw new Error(result.errors?.map((e) => e.message).join(' ') ||
      `Не вдалося надіслати повідомлення (HTTP ${response.status}). Спробуйте ще раз.`)
  }
  return result
}
