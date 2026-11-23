import { useEffect, useRef, useState } from 'react'
import { CONTACT_DELAY, submitContact } from '../core'
import { FORM_ENDPOINT } from '../config'

const inputClass = 'w-full min-w-0 rounded-lg border border-[#d6ddd4] bg-[#f5f3ed] p-2.5 text-[#173c34] focus-visible:outline-3 focus-visible:outline-[#7b9a42] dark:border-[#43594b] dark:bg-[#111e19] dark:text-[#e8eee3]'

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const dialogRef = useRef(null)
  const busyRef = useRef(false)
  const dismissedRef = useRef(false)
  useEffect(() => {
    try { if (sessionStorage.getItem('contactDismissed') === '1') return } catch { /* пам’ять */ }
    const timer = setTimeout(() => { if (!dismissedRef.current) setIsOpen(true) }, CONTACT_DELAY)
    return () => clearTimeout(timer)
  }, [])
  useEffect(() => {
    if (isOpen && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal()
  }, [isOpen])
  function close() {
    dismissedRef.current = true
    setIsOpen(false)
    try { sessionStorage.setItem('contactDismissed', '1') } catch { /* пам’ять */ }
  }
  async function send(event) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity() || busyRef.current) return
    busyRef.current = true; setSending(true); setMessage('Надсилаємо повідомлення…')
    try {
      await submitContact(FORM_ENDPOINT, new FormData(form))
      form.reset(); setMessage('Повідомлення надіслано. Дякую за зворотний зв’язок!')
    } catch (error) { setMessage(`${error.message} Ваш текст залишився у формі.`) }
    finally { busyRef.current = false; setSending(false) }
  }
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="rounded-lg border border-[#e7eedf] bg-[#e7eedf] px-3.5 py-2 text-sm text-[#173c34] hover:brightness-95 focus-visible:outline-3">Написати мені</button>
      {isOpen && (
        <dialog ref={dialogRef} onClose={close} aria-labelledby="contact-title" className="m-auto max-h-[calc(100dvh-2rem)] w-[min(560px,calc(100%-2rem))] overflow-y-auto rounded-[1.25rem] border border-[#d6ddd4] bg-[#fffefa] p-5 text-[#173c34] backdrop:bg-black/65 md:p-7 dark:border-[#43594b] dark:bg-[#1b2d24] dark:text-[#e8eee3]">
          <div className="flex items-start justify-between gap-4">
            <h2 id="contact-title" className="font-[Georgia,serif] text-[1.65rem]">Напиши мені</h2>
            <button type="button" aria-label="Закрити форму" onClick={() => dialogRef.current.close()} className="rounded-lg border px-3 py-2 text-sm focus-visible:outline-3">Закрити</button>
          </div>
          <p className="my-4">Залиш запитання або відгук про навчальне резюме.</p>
          <form action={FORM_ENDPOINT} method="POST" onSubmit={send} className="grid gap-2">
            <input type="hidden" name="_subject" value="ЛР4 — React і Tailwind" />
            <label htmlFor="contact-name" className="text-sm font-bold">Ім’я</label>
            <input id="contact-name" name="name" autoComplete="name" maxLength={100} required className={inputClass} />
            <label htmlFor="contact-email" className="text-sm font-bold">Email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={200} required className={inputClass} />
            <label htmlFor="contact-phone" className="text-sm font-bold">Номер телефону</label>
            <input id="contact-phone" name="phone" type="tel" autoComplete="tel" pattern="[+]?[0-9][0-9 ]{5,23}[0-9]" title="Від 7 до 25 цифр і пробілів; необов’язковий + на початку" required className={inputClass} />
            <label htmlFor="contact-message" className="text-sm font-bold">Повідомлення</label>
            <textarea id="contact-message" name="message" rows={4} maxLength={5000} required className={inputClass} />
            <p className="my-1 text-xs text-[#52665d] dark:text-[#b9c9ba]">Повідомлення буде передано через Formspree на пошту власника резюме.</p>
            <button type="submit" disabled={sending} className="mt-2 rounded-lg bg-[#173c34] p-3 text-[#f5f3ed] focus-visible:outline-3 disabled:opacity-60">{sending ? 'Надсилаємо…' : 'Надіслати'}</button>
            <p role="status" aria-live="polite" className="text-sm">{message}</p>
          </form>
        </dialog>
      )}
    </>
  )
}
