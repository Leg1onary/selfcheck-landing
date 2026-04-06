# SelfCheck WOW Audit — Changelog

## Файлы
- `/home/user/workspace/npd-check/index.html` — обновлённый лендинг
- `/home/user/workspace/npd-check/success.html` — страница успешной оплаты
- `/home/user/workspace/npd-check/cancel.html` — страница отмены оплаты
- `/home/user/workspace/npd-check/quiz.js` — без изменений (как в задаче)

## Скриншоты
- `wow-desktop-full.jpeg` — полная страница, desktop 1280px
- `wow-mobile-hero.jpeg` — hero, mobile 390px
- `wow-mobile-full.jpeg` — полная страница, mobile 390px
- `wow-mobile-pricing-cards.jpeg` — pricing, mobile
- `wow-success-desktop.jpeg` — success page, desktop
- `wow-cancel-desktop.jpeg` — cancel page, desktop
- `wow-mobile-success.jpeg` — success page, mobile
- `wow-mobile-cancel.jpeg` — cancel page, mobile

## Все изменения в index.html

### 1. Конверсия и UX
- [x] Счётчик «Уже прошли проверку: **847 человек**» — зелёная пульсирующая точка, под CTA
- [x] 3 отзыва в новой секции «Отзывы»: Алексей К. (Backend-разработчик), Марина С. (UX/UI дизайнер), Дмитрий Л. (Репетитор)
- [x] Hero CTA `href="#check"` подтверждён
- [x] Urgency баннер: «⚡ Новые критерии Минэк вступили в силу в 2026 году — проверьте свой статус»
- [x] Новый FAQ: «Что будет, если я не проверюсь?» с описанием рисков (НДФЛ 13%, страховые ~30%, штрафы)

### 2. Визуальный уровень "из 2027 года"
- [x] Animated gradient background в hero (CSS-only `hero-bg-animated` с 12s анимацией)
- [x] Ripple effect на кнопках — `--ripple-x`/`--ripple-y` CSS vars через pointerdown event
- [x] Micro-interactions: `scale(1.02)` на hover, `scale(0.98)` на active
- [x] Risk preview gauge анимируется при появлении (0% → 72% через IntersectionObserver)
- [x] Criteria items появляются с задержкой (staggered fade-in)
- [x] Pricing featured card: animated glow border (gradient 300% animation), box-shadow glow, `scale(1.03)`, badge «Популярный»
- [x] Улучшенные scroll-анимации: `translateY(28px)`, `0.7s` duration, easing `cubic-bezier(0.16, 1, 0.3, 1)`
- [x] Темная тема — усиленный glow на featured карточке

### 3. Страницы /success и /cancel
- [x] `success.html`: зелёная галочка с CSS draw animation (stroke-dashoffset), список документов, CTA
- [x] `cancel.html`: мягкий серый X, успокаивающий текст, CTA «Вернуться к результатам» + «Попробовать снова»
- [x] Оба файла используют тот же header/footer, темную/светлую тему

### 4. Технические улучшения
- [x] OG image — inline SVG data URI с логотипом, текстом, визуальным элементом
- [x] `og:locale="ru_RU"` добавлен
- [x] Footer ссылки: `/privacy.html`, `/offer.html`, `/terms.html` — уже были корректными
- [x] `<html lang="ru">` — уже было
- [x] JSON-LD WebApplication schema — уже был, подтверждён с creator
- [x] Perplexity attribution — присутствует на всех 3 страницах

### 5. Мобильная версия
- [x] Hero title: `clamp(2rem, 8vw, 2.75rem)` на мобиле
- [x] Hero subtitle: уменьшен до `--text-base`
- [x] CTA кнопки: full-width на `<540px`
- [x] Pricing featured card: `scale(1)` на мобиле (без увеличения)
- [x] Quiz wrap: уменьшен padding на мобиле
- [x] Testimonials grid: 1 колонка на `<768px`
- [x] Hero badge: уменьшенный шрифт/padding на мобиле
