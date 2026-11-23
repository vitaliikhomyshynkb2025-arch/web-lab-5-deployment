import { useEffect, useState } from 'react'
import { fetchReviews } from '../core'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    fetchReviews({ signal: controller.signal }).then((data) => {
      if (!controller.signal.aborted) { setReviews(data); setStatus('success') }
    }).catch((reason) => {
      if (!controller.signal.aborted) { setError(reason.message); setStatus('error') }
    })
    return () => controller.abort()
  }, [attempt])
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="min-w-0 rounded-[1.25rem] border border-[#d6ddd4] bg-[#fffefa] p-6 md:col-span-2 md:p-8 dark:border-[#43594b] dark:bg-[#1b2d24]">
      <h2 id="reviews-title" className="mb-5 font-[Georgia,serif] text-[1.65rem]">Відгуки</h2>
      <p>Навчальні коментарі JSONPlaceholder. Це вигадані дані, не реальні рекомендації роботодавців.</p>
      <p role="status" className="mt-3">{status === 'loading' ? 'Завантажуємо коментарі…' : status === 'error' ? `Не вдалося завантажити коментарі. ${error}` : `Отримано коментарів: ${reviews.length}. Варіант 23.`}</p>
      {status === 'error' && <button type="button" className="mt-3 rounded-lg border p-2 focus-visible:outline-3" onClick={() => { setStatus('loading'); setAttempt((value) => value + 1) }}>Спробувати ще раз</button>}
      <ol className="mt-6 grid list-none gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <li key={review.id} data-review-id={review.id} className="min-w-0 rounded-xl border border-[#d6ddd4] p-5 wrap-anywhere dark:border-[#43594b]">
            <h3 className="mb-2 font-bold">{review.name}</h3>
            <p className="text-sm text-[#52665d] dark:text-[#b9c9ba]">{review.email}</p>
            <p className="mt-3">{review.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
