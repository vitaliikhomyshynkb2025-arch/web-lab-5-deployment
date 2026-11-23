import { CONTACT_DELAY, collectSystemInfo, fetchReviews, prettyValue,
  storageEntries, submitContact, themeAtHour } from './core.js'
import { FORM_ENDPOINT } from './config.js'

// 1. Сховище та системна інформація. Дані виводимо тільки через textContent.
const storageList = document.querySelector('#storage-list')
function showStorage() {
  storageList.replaceChildren()
  try {
    for (const { key, value } of storageEntries(localStorage)) {
      const term = document.createElement('dt')
      const description = document.createElement('dd')
      const pre = document.createElement('pre')
      term.textContent = key
      pre.textContent = prettyValue(value)
      description.append(pre)
      storageList.append(term, description)
    }
  } catch { storageList.textContent = 'Браузер не дозволяє доступ до localStorage.' }
}
try { localStorage.setItem('browserInfo', JSON.stringify(collectSystemInfo())) }
catch { /* Решта сторінки працює і з вимкненим сховищем. */ }
showStorage()
window.addEventListener('storage', showStorage)

// 2. Автоматична тема й ручний вибір. Авто знову враховує поточний час.
const themeToggle = document.querySelector('#theme-toggle')
const themeAuto = document.querySelector('#theme-auto')
const themeStatus = document.querySelector('#theme-status')
let mode = 'auto'
try { mode = localStorage.getItem('themeMode') || 'auto' } catch { /* auto */ }
if (!['auto', 'light', 'dark'].includes(mode)) mode = 'auto'
function applyTheme() {
  const theme = mode === 'auto' ? themeAtHour(new Date().getHours()) : mode
  document.documentElement.dataset.theme = theme
  themeToggle.textContent = theme === 'dark' ? 'Світла тема' : 'Темна тема'
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'))
  themeStatus.textContent = `${theme === 'dark' ? 'Нічна' : 'Денна'} · ${mode === 'auto' ? 'автоматично' : 'ручний вибір'}`
  themeAuto.disabled = mode === 'auto'
}
function setMode(nextMode) {
  mode = nextMode
  try { localStorage.setItem('themeMode', mode) } catch { /* Тема діє в пам’яті. */ }
  applyTheme()
  showStorage()
}
themeToggle.addEventListener('click', () => setMode(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'))
themeAuto.addEventListener('click', () => setMode('auto'))
window.addEventListener('storage', (event) => {
  if (event.key === 'themeMode' || event.key === null) {
    mode = ['light', 'dark'].includes(event.newValue) ? event.newValue : 'auto'
    applyTheme()
  }
})
applyTheme()
setInterval(() => { if (mode === 'auto') applyTheme() }, 30_000)
document.addEventListener('visibilitychange', () => { if (!document.hidden) applyTheme() })

// 3. Відгуки завантажуються з реального API, помилку можна повторити.
const reviewList = document.querySelector('#reviews-list')
const reviewStatus = document.querySelector('#reviews-status')
const retry = document.querySelector('#reviews-retry')
async function showReviews() {
  retry.hidden = true
  reviewStatus.textContent = 'Завантажуємо коментарі…'
  try {
    const reviews = await fetchReviews()
    reviewList.replaceChildren()
    for (const review of reviews) {
      const item = document.createElement('li')
      item.dataset.reviewId = review.id
      const heading = document.createElement('h3')
      const author = document.createElement('p')
      const body = document.createElement('p')
      heading.textContent = review.name
      author.textContent = review.email
      author.className = 'review-author'
      body.textContent = review.body
      item.append(heading, author, body)
      reviewList.append(item)
    }
    reviewStatus.textContent = `Отримано коментарів: ${reviews.length}. Варіант 23.`
  } catch (error) {
    reviewStatus.textContent = `Не вдалося завантажити коментарі. ${error.message}`
    retry.hidden = false
  }
}
retry.addEventListener('click', showReviews)
showReviews()

// 4. Нативний dialog утримує фокус і підтримує Escape.
const dialog = document.querySelector('#contact-dialog')
const form = document.querySelector('#contact-form')
const formStatus = document.querySelector('#form-status')
const submit = form.querySelector('[type="submit"]')
form.action = FORM_ENDPOINT
let dismissed = false
try { dismissed = sessionStorage.getItem('contactDismissed') === '1' } catch { /* пам’ять */ }
function openContact() { if (!dialog.open) dialog.showModal() }
const contactTimer = setTimeout(() => { if (!dismissed) openContact() }, CONTACT_DELAY)
document.querySelector('#contact-open').addEventListener('click', openContact)
document.querySelector('#contact-close').addEventListener('click', () => dialog.close())
dialog.addEventListener('close', () => {
  dismissed = true
  clearTimeout(contactTimer)
  try { sessionStorage.setItem('contactDismissed', '1') } catch { /* пам’ять */ }
})
form.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (!form.reportValidity() || submit.disabled) return
  submit.disabled = true
  formStatus.textContent = 'Надсилаємо повідомлення…'
  try {
    await submitContact(FORM_ENDPOINT, new FormData(form))
    form.reset()
    formStatus.textContent = 'Повідомлення надіслано. Дякую за зворотний зв’язок!'
  } catch (error) {
    formStatus.textContent = `${error.message} Ваш текст залишився у формі.`
  } finally { submit.disabled = false }
})
