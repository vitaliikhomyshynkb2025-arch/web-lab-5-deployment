import { useEffect, useState } from 'react'
import { themeAtHour } from './core'

export default function useTheme() {
  const [mode, setMode] = useState(() => {
    try { const saved = localStorage.getItem('themeMode'); return ['light', 'dark'].includes(saved) ? saved : 'auto' }
    catch { return 'auto' }
  })
  const [theme, setTheme] = useState(() => themeAtHour(new Date().getHours()))
  useEffect(() => {
    const update = () => setTheme(mode === 'auto' ? themeAtHour(new Date().getHours()) : mode)
    update()
    const timer = setInterval(update, 30_000)
    document.addEventListener('visibilitychange', update)
    try { localStorage.setItem('themeMode', mode) } catch { /* Тема діє в пам’яті. */ }
    window.dispatchEvent(new Event('lab4:storage'))
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', update) }
  }, [mode])
  useEffect(() => {
    const sync = (event) => {
      if (event.key === 'themeMode' || event.key === null) setMode(['light', 'dark'].includes(event.newValue) ? event.newValue : 'auto')
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  return { theme, mode, setMode, toggle: () => setMode(theme === 'dark' ? 'light' : 'dark') }
}
