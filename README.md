# Лабораторна робота № 5. Розгортання вебсайту

Хомишин Віталій, КБ-208. Варіант 23. Проєкт містить дві версії резюме з ЛР4: HTML з JavaScript у корені та React з Tailwind CSS у `lab_2_react`. Обидві версії завантажують коментарі для варіанта 23, показують дані localStorage, перемикають тему та використовують контактну форму Formspree.

## Локальний запуск

- HTML і JavaScript: `npm run dev` у корені. Відкрити http://127.0.0.1:8080. Пакети не потрібні.
- React: `cd lab_2_react`, `npm ci`, `npm run dev`. Адреса з’явиться в терміналі.
- Перевірки: `npm test` у корені. У `lab_2_react` виконати `npm run lint` і `npm run build`.

## Розгортання на Vercel

Імпортуйте цей репозиторій у два проєкти Vercel. Налаштування збірки у кожній папці задані у відповідному `vercel.json`.

| Проєкт | Root Directory | Framework Preset | Install Command | Build Command | Output Directory |
| --- | --- | --- | --- | --- | --- |
| HTML та JavaScript | `.` | Other | Пропустити | Пропустити | `.` |
| React та Tailwind | `lab_2_react` | Vite | `npm ci` | `npm run build` | `dist` |

Після першого розгортання обох проєктів зміна зовнішнього вигляду має потрапити в `main` окремим комітом. Статус нового production deployment, SHA коміту та зміну на тій самій публічній адресі перевіряють у Vercel.
