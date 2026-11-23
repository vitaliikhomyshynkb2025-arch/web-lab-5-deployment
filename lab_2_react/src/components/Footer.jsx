import { useEffect, useState } from 'react'
import { collectSystemInfo, prettyValue, storageEntries } from '../core'

export default function Footer() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    let writeError = ''
    function refresh() {
      try { setEntries(storageEntries(localStorage)); setError(writeError) }
      catch { setError('Браузер не дозволяє доступ до localStorage.') }
    }
    try { localStorage.setItem('browserInfo', JSON.stringify(collectSystemInfo())) }
    catch { writeError = 'Браузер не дозволяє збереження в localStorage.' }
    window.addEventListener('storage', refresh)
    window.addEventListener('lab4:storage', refresh)
    window.dispatchEvent(new Event('lab4:storage'))
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('lab4:storage', refresh)
    }
  }, [])
  return (
    <footer className="mx-auto mb-4 flex w-[calc(100%-2rem)] max-w-[1120px] flex-wrap justify-between gap-4 px-1 py-4 text-sm text-[#52665d] md:mb-10 md:w-[calc(100%-4rem)] dark:text-[#b9c9ba]">
      <p>© 2026 Хомишин Віталій. Навчальне резюме.</p>
      <a href="#" className="underline underline-offset-4 focus-visible:outline-3">На початок сторінки</a>
      <details className="min-w-0 basis-full border-t border-[#d6ddd4] pt-4 dark:border-[#43594b]">
        <summary className="cursor-pointer font-bold focus-visible:outline-3">Дані браузера та localStorage</summary>
        <p className="mt-3">Значення, які повідомляє браузер; це не точна діагностика ОС.</p>
        {error && <p role="status">{error}</p>}
        <dl>
          {entries.map(({ key, value }) => (
            <div key={key}>
              <dt className="mt-3 font-bold">{key}</dt>
              <dd><pre className="mt-1 whitespace-pre-wrap rounded-lg bg-[#fffefa] p-4 font-mono text-xs leading-normal wrap-anywhere dark:bg-[#1b2d24]">{prettyValue(value)}</pre></dd>
            </div>
          ))}
        </dl>
      </details>
    </footer>
  )
}
