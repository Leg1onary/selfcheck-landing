# SelfCheck Landing Page Restructure — Changelog

## Date: 2026-03-26

## New Section Order (was → now)

### Before:
1. Header
2. Hero (with "Как это работает →" button)
3. Trust Row
4. Risk Preview
5. How It Works
6. Testimonials
7. Risks
8. Pricing
9. FAQ
10. **Quiz (#check)** — at the very bottom
11. Footer

### After:
1. Header (unchanged)
2. Hero — removed "Как это работает →" button, kept only "Проверить бесплатно"
3. **Quiz (#check)** — moved to right after hero, seamless transition
4. Trust Row — moved after quiz for safety reassurance
5. How It Works — explains flow for those who scrolled past quiz
6. Risk Preview — card with example result
7. **Media Placeholder** — NEW section for future video/image
8. Testimonials
9. Risks — what happens on reclassification
10. Pricing — only here, after value is understood
11. FAQ
12. Footer (unchanged)

## Detailed Changes

### 1. Hero Section
- Removed the "Как это работает →" ghost button from `.hero-cta-group`
- Reduced bottom padding: `clamp(var(--space-12), 8vw, var(--space-24))` → `clamp(var(--space-8), 4vw, var(--space-12))` so quiz flows naturally
- Mobile bottom padding also reduced

### 2. Quiz Section (#check)
- Moved from position #10 (very last) to position #3 (right after hero)
- New CSS: `background: var(--color-bg)` (same as hero, no visual break)
- Removed `border-top: 1px solid var(--color-divider)` 
- Removed old heading "Пройдите аудит прямо сейчас"
- Added subtle hint text: "↓ Ответьте на 10 вопросов" (`.quiz-section-hint`)
- Container max-width: 640px, centered
- `padding: 0 0 clamp(var(--space-12), 7vw, var(--space-20))` — no top padding for seamless hero continuation

### 3. Media Placeholder Section (NEW)
- Position: between Risk Preview and Testimonials
- HTML: `<section class="media-section section">` with `data-media-slot="hero-video"`
- CSS class: `.media-placeholder`
- Specs: `aspect-ratio: 16/9`, `max-width: 900px`, `background: #16192B`
- Subtle grid background via `::before` pseudo-element
- SVG play icon in `.media-play-icon` (72×72px circle)
- Label: "Видео о сервисе — скоро"
- HTML comment: `<!-- MEDIA_SLOT: hero-video — заменить на <video> или <img> когда будет готово -->`

### 4. Section Reordering
- Trust Row: moved from position #3 → #4 (after quiz)
- Risk Preview: moved from position #4 → #6 
- How It Works: moved from position #5 → #5 (same relative to risk preview)
- Pricing: moved from position #8 → #10 (after risks, before FAQ)

### What Was NOT Changed
- No JS logic modified (quiz.js untouched)
- CSS variables and design system unchanged
- Section content unchanged — only order
- Dark theme untouched
- Fade-up animations preserved
- Header and Footer unchanged

## Screenshots
- `screenshot-hero-desktop.jpg` — hero section at 1280px
- `screenshot-quiz-desktop.jpg` — quiz visible after minimal scroll
- `screenshot-fullpage-desktop.jpg` — full page layout
