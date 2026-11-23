import useTheme from './useTheme'
import Reviews from './components/Reviews'
import ContactForm from './components/ContactForm'
import Header from './components/Header'
import About from './components/About'
import Education from './components/Education'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Resources from './components/Resources'
import Footer from './components/Footer'

const skills = [
  'HTML: структура документа, семантичні теги, списки та посилання.',
  'React: компоненти, JSX і передавання даних через props.',
  'Git: відстеження змін і створення комітів.',
  'Chrome DevTools: аналіз мережі та захищеного з’єднання.',
]

export default function App() {
  const { theme, mode, setMode, toggle } = useTheme()
  return (
    <div data-theme={theme} className="dark:bg-[#111e19] dark:text-[#e8eee3] min-h-screen bg-[#f5f3ed] font-[Trebuchet_MS,sans-serif] leading-[1.65] text-[#173c34] flow-root">
      <Header
        name="Хомишин Віталій Вікторович"
        role="Студент групи КБ-208 · Кібербезпека та вебтехнології"
      >
        <div className="mt-6 flex flex-wrap items-center gap-2.5 text-sm" aria-label="Налаштування сторінки">
          <button type="button" onClick={toggle} aria-pressed={theme === 'dark'} className="rounded-lg border border-[#e7eedf] bg-[#e7eedf] px-3.5 py-2 text-[#173c34] hover:brightness-95 focus-visible:outline-3">{theme === 'dark' ? 'Світла тема' : 'Темна тема'}</button>
          <button type="button" onClick={() => setMode('auto')} disabled={mode === 'auto'} className="rounded-lg border border-[#e7eedf] bg-[#e7eedf] px-3.5 py-2 text-[#173c34] focus-visible:outline-3 disabled:opacity-60">Авто</button>
          <span role="status" className="text-[#d5e5cd]">{theme === 'dark' ? 'Нічна' : 'Денна'} · {mode === 'auto' ? 'автоматично' : 'ручний вибір'}</span>
          <ContactForm />
        </div>
      </Header>
      <main className="mx-auto w-[calc(100%-2rem)] my-4 grid max-w-[1120px] grid-cols-1 gap-4 md:w-[calc(100%-4rem)] md:my-6 md:grid-cols-[1.4fr_1fr] md:gap-6">
        <About />
        <Education />
        <Experience />
        <Skills items={skills} />
        <Resources />
        <Reviews />
      </main>
      <Footer />
    </div>
  )
}
