/**
 * SelfCheck — Quiz Engine
 * Blocks applied: 1 (paywall), 2 (calculator), 3 (consent), 4 (email-capture), 5.2 (counter), 6 (button)
 */

(function () {
  'use strict';

  const API_BASE = window.SELFCHECK_API || '/api';

  const QUESTIONS = [
    { id: 1, text: 'Сколько заказчиков у вас одновременно?', hint: 'Один постоянный заказчик — ключевой признак трудовых отношений по критериям ФНС', options: [{ value: 'many', label: '3 и более заказчика' }, { value: 'two', label: '2 заказчика' }, { value: 'one', label: 'Только один заказчик' }] },
    { id: 2, text: 'Как оформлены ваши отношения с заказчиком?', hint: 'Договор должен описывать конкретный результат, а не процесс работы', options: [{ value: 'result_contract', label: 'Договор ГПХ на конкретный результат' }, { value: 'service_contract', label: 'Договор на оказание услуг (абонентский)' }, { value: 'verbal', label: 'Устная договорённость или без договора' }] },
    { id: 3, text: 'Как часто заказчик выплачивает вам вознаграждение?', hint: 'Регулярные ежемесячные выплаты фиксированной суммы — признак трудовых отношений', options: [{ value: 'per_project', label: 'По завершении каждого проекта/задачи' }, { value: 'irregular', label: 'Нерегулярно, по результату' }, { value: 'monthly_fixed', label: 'Ежемесячно, фиксированная сумма' }] },
    { id: 4, text: 'Кто контролирует ваш рабочий график и режим работы?', hint: 'Подчинение внутреннему распорядку — один из главных критериев переквалификации', options: [{ value: 'self', label: 'Я сам определяю время и место работы' }, { value: 'partial', label: 'Частично — есть дедлайны, онлайн-встречи' }, { value: 'employer', label: 'Заказчик устанавливает график и присутствие' }] },
    { id: 5, text: 'Чьим оборудованием и инструментами вы пользуетесь?', hint: 'Использование оборудования заказчика — признак трудовых отношений', options: [{ value: 'own', label: 'Только своими инструментами и оборудованием' }, { value: 'mixed', label: 'Смешанно — своими и заказчика' }, { value: 'employer', label: 'В основном оборудованием заказчика' }] },
    { id: 6, text: 'Можете ли вы привлекать субподрядчиков для выполнения работы?', hint: 'Обязанность выполнять работу лично — признак трудового договора', options: [{ value: 'yes', label: 'Да, могу делегировать часть работы' }, { value: 'sometimes', label: 'Иногда, с согласия заказчика' }, { value: 'no', label: 'Нет, только лично' }] },
    { id: 7, text: 'Несёте ли вы финансовую ответственность за ошибки в работе?', hint: 'Отсутствие финансовой ответственности исполнителя — признак трудовых отношений', options: [{ value: 'yes', label: 'Да, несу ответственность согласно договору' }, { value: 'partial', label: 'Частично, в некоторых случаях' }, { value: 'no', label: 'Нет, заказчик принимает все риски' }] },
    { id: 8, text: 'Есть ли у вас доступ к корпоративным системам заказчика?', hint: 'Интеграция в корпоративную инфраструктуру (CRM, Slack, внутренний портал) — признак трудовых отношений', options: [{ value: 'no', label: 'Нет корпоративного доступа' }, { value: 'limited', label: 'Только для проекта, временный доступ' }, { value: 'full', label: 'Полный доступ как у сотрудников' }] },
    { id: 9, text: 'Какую долю дохода составляют выплаты от основного заказчика?', hint: 'Более 80% дохода от одного источника — критический показатель риска', options: [{ value: 'less_50', label: 'Менее 50% от общего дохода' }, { value: '50_80', label: '50–80% от общего дохода' }, { value: 'over_80', label: 'Более 80% от одного заказчика' }] },
    { id: 10, text: 'Упоминается ли в договоре ваша должность или специальность?', hint: 'Указание должности вместо результата работы — прямой признак трудового договора', options: [{ value: 'no', label: 'Нет, указан только результат работ' }, { value: 'function', label: 'Указана функция, но не должность' }, { value: 'position', label: 'Да, указана должность или специальность' }] },
    { id: 11, text: 'Вы работаете на территории заказчика?', hint: 'Постоянное рабочее место у заказчика — признак трудовых отношений', options: [{ value: 'no', label: 'Нет, работаю удалённо или на своей территории' }, { value: 'sometimes', label: 'Частично, иногда приезжаю в офис' }, { value: 'yes', label: 'Да, постоянно работаю в офисе заказчика' }] },
    { id: 12, text: 'Есть ли у вас фиксированный рабочий график у заказчика?', hint: 'График 5/2 или смены — один из главных признаков трудовых отношений', options: [{ value: 'no', label: 'Нет, я сам планирую своё время' }, { value: 'soft', label: 'Есть пожелания по доступности, но жёсткого графика нет' }, { value: 'yes', label: 'Да, заказчик установил конкретный рабочий график' }] },
    { id: 13, text: 'Платит ли заказчик вам независимо от конкретного результата?', hint: 'Оплата процесса работы, а не результата — признак трудового договора', options: [{ value: 'result_only', label: 'Только за конкретный результат или объём работ' }, { value: 'mixed', label: 'Частично — есть как фиксированная часть, так и за результат' }, { value: 'process', label: 'Да, фиксированная оплата за нахождение в работе' }] },
    { id: 14, text: 'Выписываете ли вы чек через приложение «Мой налог» после каждой оплаты?', hint: 'Отсутствие чеков НПД — прямое нарушение 422-ФЗ и усиливает риск переквалификации', options: [{ value: 'always', label: 'Да, выписываю чек на каждое поступление' }, { value: 'sometimes', label: 'Иногда забываю или делаю с задержкой' }, { value: 'never', label: 'Нет, не выписываю регулярно' }] },
    { id: 15, text: 'Использует ли заказчик ваше рабочее место или оборудование?', hint: 'Предоставление рабочего места — признак трудовых отношений по ТК РФ', options: [{ value: 'no', label: 'Нет, у меня своё рабочее место и оборудование' }, { value: 'partial', label: 'Иногда использую офис заказчика, но есть своё' }, { value: 'yes', label: 'Да, заказчик предоставил мне рабочее место' }] },
    { id: 16, text: 'Есть ли в договоре фраза «трудовая функция», «рабочее место» или «должность»?', hint: 'Такие формулировки делают договор ГПХ де-факто трудовым в глазах суда', options: [{ value: 'no', label: 'Нет, договор описывает только результат работ' }, { value: 'function', label: 'Есть похожие формулировки, но не точные' }, { value: 'yes', label: 'Да, такие фразы присутствуют в договоре' }] },
  ];

  let state = { step: 'quiz', currentQ: 0, answers: [], result: null, selectedValue: null, _emailShown: false, _quizStarted: false, _sessionId: null };
  let quizEl = null;

  function init(containerId) {
    quizEl = document.getElementById(containerId);
    if (!quizEl) return;
    render();
  }

  function render() {
    if (!quizEl) return;
    switch (state.step) {
      case 'quiz':    quizEl.innerHTML = renderQuiz(); break;
      case 'loading': quizEl.innerHTML = renderLoading(); break;
      case 'result':  quizEl.innerHTML = renderResult(); break;
      case 'error':   quizEl.innerHTML = renderError(); break;
    }
    attachHandlers();
    window.dispatchEvent(new CustomEvent('quiz-step-change', {
      detail: { current: state.currentQ + 1, total: QUESTIONS.length }
    }));
  }

  function renderQuiz() {
    if (state.currentQ === 7 && !state._emailShown) {
      return renderEmailCapture();
    }
    const q = QUESTIONS[state.currentQ];
    const total = QUESTIONS.length;
    const progress = (state.currentQ / total) * 100;
    const canNext = state.selectedValue !== null;
    return `
    <div class="quiz-wrap">
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${progress}%"></div></div>
      <div class="quiz-meta">
        <span class="quiz-counter">Вопрос ${state.currentQ + 1} из ${total}</span>
        ${state.currentQ > 0 ? '<button class="quiz-back" data-action="back">← Назад</button>' : ''}
      </div>
      <div class="quiz-question-wrap">
        <h3 class="quiz-question">${q.text}</h3>
        <div class="quiz-options" role="radiogroup" aria-label="${q.text}">
          ${q.options.map(opt => `
            <label class="quiz-option ${state.selectedValue === opt.value ? 'selected' : ''}" data-value="${opt.value}">
              <input type="radio" name="q${q.id}" value="${opt.value}" ${state.selectedValue === opt.value ? 'checked' : ''} class="sr-only">
              <span class="quiz-option-indicator">${state.selectedValue === opt.value ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : ''}</span>
              <span class="quiz-option-text">${opt.label}</span>
            </label>`).join('')}
        </div>
      </div>
      <div class="quiz-actions">
        <button class="btn btn-primary btn-lg quiz-next ${!canNext ? 'disabled' : ''}" data-action="next" ${!canNext ? 'disabled' : ''}>
          ${state.currentQ === total - 1 ? 'Получить результат →' : 'Следующий вопрос →'}
        </button>
      </div>
    </div>`;
  }

  function renderEmailCapture() {
    return `
    <div class="quiz-wrap quiz-email-capture">
      <div class="quiz-ec-icon">⚠️</div>
      <h3 class="quiz-ec-title">Уже видны зоны риска</h3>
      <p class="quiz-ec-desc">Осталось 9 вопросов — после покажем точный балл<br>и конкретные признаки трудовых отношений в вашей ситуации.<br>Введите email, чтобы результат сохранился.</p>
      <div class="quiz-ec-form">
        <input type="email" id="ec-email" class="result-cta-email"
          placeholder="email@example.com" autocomplete="email">
        <button class="btn btn-primary" data-action="ec-submit">
          Продолжить →
        </button>
      </div>
      <button class="quiz-ec-skip" data-action="ec-skip">
        Пропустить и продолжить
      </button>
    </div>`;
  }

  function renderLoading() {
    return `<div class="quiz-loading"><div class="quiz-spinner"></div><p>Анализируем ваши ответы<br>по критериям ФНС и Минэк 2026…</p></div>`;
  }

  function getPaywalledSummary(r) {
    const full = r.summary || '';
    if (r.overall_risk === 'green') return full;
    if (full.length <= 120) return full;
    const dotIdx = full.indexOf('.', 70);
    const end = (dotIdx > 0 && dotIdx < 200) ? dotIdx + 1 : 120;
    return full.slice(0, end) + ' Детальный разбор всех факторов — в отчёте.';
  }

  function renderResult() {
    const r = state.result;
    const riskConfig = {
      green:  { label: 'Низкий риск',  color: '#16A34A', bg: '#DCFCE7', border: '#86EFAC', emoji: '✓' },
      yellow: { label: 'Средний риск', color: '#D97706', bg: '#FEF3C7', border: '#FCD34D', emoji: '!' },
      red:    { label: 'Высокий риск', color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5', emoji: '✕' },
    };
    const cfg = riskConfig[r.overall_risk];
    const gaugeWidth = Math.min(100, r.score);

    const lockedCount = r.factors.filter(
      f => f.risk_level === 'yellow' || f.risk_level === 'red'
    ).length;

    const lockedBanner = lockedCount > 0
      ? `<div class="result-locked-banner">
          🔒 У вас <strong>${lockedCount}</strong> скрытых
          фактор${lockedCount === 1 ? '' : (lockedCount < 5 ? 'а' : 'ов')} риска из
          ${r.factors.length} — разблокируются в отчёте
         </div>`
      : '';

    const emailSavedHtml = window.quizEmail
      ? `<p class="result-email-saved">
          ✓ Результат будет отправлен на
          <strong>${window.quizEmail}</strong>
         </p>`
      : '';

    return `
    <div class="quiz-result">
      <div class="result-hero" style="border-color:${cfg.border};background:${cfg.bg};">
        <div class="result-emoji" style="color:${cfg.color};">${cfg.emoji}</div>
        <div class="result-label" style="color:${cfg.color};">${cfg.label}</div>
        <div class="result-score-label">Индекс риска: <strong>${r.score} / 100</strong></div>
        <div class="result-gauge-wrap">
          <div class="result-gauge-track"><div class="result-gauge-fill" style="width:${gaugeWidth}%;background:${cfg.color};"></div></div>
          <div class="result-gauge-labels"><span>Безопасно</span><span>Средний</span><span>Критично</span></div>
        </div>
      </div>
      <p class="result-summary">${getPaywalledSummary(r)}</p>
      ${emailSavedHtml}
      <div class="result-factors">
        <h4 class="result-section-title">Факторы риска по вашим ответам</h4>
        ${lockedBanner}
        <div class="result-factors-list">
          ${r.factors.map(f => {
      const fc = {green: '#16A34A', yellow: '#D97706', red: '#DC2626'}[f.risk_level];
      const fi = {green: '✓', yellow: '!', red: '✕'}[f.risk_level];
      return `<div class="factor-item factor-${f.risk_level}">
              <div class="factor-icon" style="color:${fc};">${fi}</div>
              <div class="factor-body">
                <div class="factor-question">${f.question_text}</div>
                <div class="factor-answer">Ваш ответ: <em>${f.answer}</em></div>
                ${f.risk_level !== 'green' ? '<div class="factor-explanation factor-explanation--locked">Подробный анализ и рекомендации — в полном отчёте</div>' : ''}
              </div>
            </div>`;
    }).join('')}
        </div>
      </div>
	  	<div class="result-calc">
        <h4 class="result-calc-title">
          ⚠️ Ваши потенциальные потери
        </h4>
        <div class="result-calc-row">
          <label class="result-calc-label">
            Среднемесячный доход от заказчика:
          </label>
          <div class="result-calc-input-wrap">
            <input type="range" id="calc-income-range"
              min="10000" max="500000" step="5000" value="50000"
              class="result-calc-range">
            <span class="result-calc-income-display"
              id="calc-income-display">50 000 ₽/мес</span>
          </div>
        </div>
        <div class="result-calc-periods" id="calc-periods">
          <button class="calc-period-btn active" data-months="6">6 мес</button>
          <button class="calc-period-btn" data-months="12">12 мес</button>
          <button class="calc-period-btn" data-months="24">24 мес</button>
        </div>
        <div class="result-calc-breakdown">
          <div class="result-calc-line">
            <span>НДФЛ 13%:</span>
            <span id="calc-ndfl">—</span>
          </div>
          <div class="result-calc-line">
            <span>Страховые взносы ~30%:</span>
            <span id="calc-contributions">—</span>
          </div>
          <div class="result-calc-line">
            <span>Штраф 20–40%:</span>
            <span id="calc-penalty">—</span>
          </div>
          <div class="result-calc-line result-calc-total">
            <span>ИТОГО под угрозой:</span>
            <span id="calc-total" class="result-calc-total-value">—</span>
          </div>
        </div>
        <button class="btn result-calc-cta"
          id="calc-cta-btn" onclick="
            document.querySelector('#tier-tabs [data-tier=protection]')
                    ?.click();
            document.querySelector('.result-cta-card')
                    ?.scrollIntoView({behavior:'smooth',block:'center'});
          ">
          🛡 Защититься за 990 ₽ →
        </button>
      </div>
      <div class="result-cta-block">
        <div class="result-cta-card">
          <div class="result-cta-icon">📋</div>
          <div class="result-cta-text">
            <strong>Полный отчёт + защитные документы</strong>
            <span>Персональный анализ, рекомендации и готовые документы</span>
          </div>
          <div class="tier-tabs" id="tier-tabs">
            <button class="tier-tab active" data-tier="protection" data-price="990">
              <span class="tier-tab-name">Стандарт</span>
              <span class="tier-tab-price">990 ₽</span>
              <span class="tier-tab-desc">PDF + шаблоны</span>
            </button>
            <button class="tier-tab" data-tier="shield" data-price="1790">
              <span class="tier-tab-name">Щит ✦</span>
              <span class="tier-tab-price">1 790 ₽</span>
              <span class="tier-tab-desc">+ персональный договор</span>
            </button>
            <button class="tier-tab" data-tier="armor" data-price="2990">
              <span class="tier-tab-name">Броня</span>
              <span class="tier-tab-price">2 990 ₽</span>
              <span class="tier-tab-desc">+ возражение в ФНС</span>
            </button>
          </div>
          <ul class="tier-features" id="tier-features"></ul>
          <div class="result-cta-form" id="cta-form">
            <input type="email" id="cta-email" class="result-cta-email" placeholder="Ваш email для получения отчёта" autocomplete="email"${window.quizEmail ? ` value="${window.quizEmail}"` : ''}>
            <button class="btn btn-buy" data-action="get-report" id="cta-pay-btn">
              🛡 Защититься — <span id="cta-price-label">990</span> ₽
            </button>
          </div>
          <p class="result-micro-guarantee">
            ✓ Мгновенная выдача&nbsp;&nbsp;
            ✓ Файлы навсегда&nbsp;&nbsp;
            ✓ Возврат если не помогло
          </p>
          <p class="result-offer-note">
            Нажимая кнопку, вы принимаете
            <a href="offer.html" target="_blank">условия оферты</a>
            и <a href="privacy.html" target="_blank">политику конфиденциальности</a>
          </p>
          <p class="result-cta-hint" id="cta-hint"></p>
        </div>
        <button class="quiz-restart" data-action="restart">← Пройти заново</button>
      </div>

      <p class="result-disclaimer">Результат носит информационный характер и не является юридической консультацией.</p>
    </div>`;
  }

  function renderError() {
    return `<div class="quiz-error"><div class="quiz-error-icon">⚠</div><p>Не удалось получить результат.<br>Проверьте подключение и попробуйте ещё раз.</p><button class="btn btn-outline" data-action="restart">Попробовать снова</button></div>`;
  }

  const TIER_FEATURES = {
    protection: [
      'Персональный PDF-отчёт с анализом рисков',
      'Шаблон договора ГПХ (.docx)',
      'Шаблон акта выполненных работ (.docx)',
      'Чек-лист безопасности НПД (12 пунктов)',
      'Калькулятор налоговых последствий',
    ],
    shield: [
      'Всё из тарифа Стандарт',
      'Персонализированный договор ГПХ под ваши данные',
      'Персонализированный чек-лист из 15 пунктов по вашим ответам на квиз',
      'AI-анализ договора ГПХ — загрузи файл, получи список рисков за 60 секунд',
    ],
    armor: [
      'Всё из тарифа Щит',
      'Шаблон официального ответа на требование ФНС о переквалификации (форма КНД 1165050)',
      'Готовые возражения при оспаривании статуса самозанятого — 3 сценария',
      'Приоритетная поддержка',
    ],
  };

  function updateTierUI(tier, price) {
    window.selectedTier = tier;
    window.selectedPrice = price;
    quizEl.querySelectorAll('.tier-tab').forEach(t => t.classList.toggle('active', t.dataset.tier === tier));
    const featEl = quizEl.querySelector('#tier-features');
    if (featEl) featEl.innerHTML = (TIER_FEATURES[tier] || []).map(f => `<li>${f}</li>`).join('');
    const priceLabel = quizEl.querySelector('#cta-price-label');
    if (priceLabel) priceLabel.textContent = Number(price).toLocaleString('ru');
  }

  function calcUpdate() {
    const rangeEl = document.getElementById('calc-income-range');
    const displayEl = document.getElementById('calc-income-display');
    const income = rangeEl ? parseFloat(rangeEl.value) : 0;
    if (displayEl) {
      displayEl.textContent = income.toLocaleString('ru') + ' ₽/мес';
    }
    if (!income) return;

    const activeBtn = document.querySelector('.calc-period-btn.active');
    const months = activeBtn ? parseInt(activeBtn.dataset.months) : 6;

    const ndfl     = Math.round(income * months * 0.13);
    const contrib  = Math.round(income * months * 0.30);
    const penalty  = Math.round((ndfl + contrib) * 0.30);
    const total    = ndfl + contrib + penalty;

    const fmt = v => v.toLocaleString('ru') + ' ₽';
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = fmt(val);
    };
    set('calc-ndfl', ndfl);
    set('calc-contributions', contrib);
    set('calc-penalty', penalty);
    set('calc-total', total);

    const totalEl = document.getElementById('calc-total');
    if (totalEl) {
      totalEl.style.transition = 'none';
      totalEl.style.transform = 'scale(1.06)';
      requestAnimationFrame(() => {
        totalEl.style.transition = 'transform 300ms ease';
        totalEl.style.transform = 'scale(1)';
      });
    }
  }
  window.calcUpdate = calcUpdate;

  function attachHandlers() {
    if (!quizEl) return;

    const ecEmailInput = quizEl.querySelector('#ec-email');
		if (ecEmailInput) {
			ecEmailInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
				e.preventDefault();
				quizEl.querySelector('[data-action="ec-submit"]')?.click();
				}
			});
		}
		const ecSubmit = quizEl.querySelector('[data-action="ec-submit"]');
		if (ecSubmit) ecSubmit.addEventListener('click', async () => {
        const email = quizEl.querySelector('#ec-email')?.value.trim();
        state._emailShown = true;
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          window.quizEmail = email;
          try {
            await fetch(`${API_BASE}/leads`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                step: 8,
                partial: true,
                session_id: state._sessionId || null,
              }),
            });
          } catch(e) {}
        }
        render();
      });
    }

    const ecSkip = quizEl.querySelector('[data-action="ec-skip"]');
    if (ecSkip) {
      ecSkip.addEventListener('click', () => {
        state._emailShown = true;
        render();
      });
    }

    quizEl.querySelectorAll('.quiz-option').forEach(el => {
      el.addEventListener('click', () => {
        const val = el.dataset.value;
        if (state.currentQ === 0 && state.answers.length === 0 && !state._quizStarted) {
          state._quizStarted = true;
          ymGoal('quiz_start');
        }
        state.selectedValue = val;
        render();
      });
    });

    const nextBtn = quizEl.querySelector('[data-action="next"]');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!state.selectedValue) return;
        const qId = QUESTIONS[state.currentQ].id;
        state.answers = state.answers.filter(a => a.question_id !== qId);
        state.answers.push({ question_id: qId, value: state.selectedValue });
        if (state.currentQ < QUESTIONS.length - 1) {
          state.currentQ++;
          const existing = state.answers.find(a => a.question_id === QUESTIONS[state.currentQ].id);
          state.selectedValue = existing ? existing.value : null;
          render();
        } else {
          submitAnswers();
        }
      });
    }

    const backBtn = quizEl.querySelector('[data-action="back"]');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.currentQ--;
        const existing = state.answers.find(a => a.question_id === QUESTIONS[state.currentQ].id);
        state.selectedValue = existing ? existing.value : null;
        render();
      });
    }

    quizEl.querySelectorAll('[data-action="restart"]').forEach(btn => {
      btn.addEventListener('click', () => {
        state = { step: 'quiz', currentQ: 0, answers: [], result: null, selectedValue: null, _emailShown: false, _quizStarted: false, _sessionId: null };
        render();
      });
    });

    updateTierUI(window.selectedTier || 'protection', window.selectedPrice || 990);
    quizEl.querySelectorAll('.tier-tab').forEach(tab => {
      tab.addEventListener('click', () => updateTierUI(tab.dataset.tier, tab.dataset.price));
    });

    const rangeInput = quizEl.querySelector('#calc-income-range');
    if (rangeInput) rangeInput.addEventListener('input', calcUpdate);

    quizEl.querySelectorAll('.calc-period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        quizEl.querySelectorAll('.calc-period-btn')
              .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        calcUpdate();
      });
    });

    if (quizEl.querySelector('#calc-income-range')) {
      setTimeout(calcUpdate, 50);
    }

    const reportBtn = quizEl.querySelector('[data-action="get-report"]');
    if (reportBtn) reportBtn.addEventListener('click', () => startPayment());

    const emailInput = quizEl.querySelector('#cta-email');
    if (emailInput) emailInput.addEventListener('keydown', e => { if (e.key === 'Enter') startPayment(); });
  }

  function ymGoal(goal) {
    try { if (window.ym) ym(108266785, 'reachGoal', goal); } catch(e) {}
  }

  async function submitAnswers() {
    ymGoal('quiz_complete');
    state.step = 'loading';
    render();
    try {
      const resp = await fetch(`${API_BASE}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: state.answers }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      state.result = await resp.json();
      state.step = 'result';
    } catch (err) {
      console.error('SelfCheck API error:', err);
      state.step = 'error';
    }
    render();
  }

  async function startPayment() {
    ymGoal('payment_click');
    const emailInput = quizEl.querySelector('#cta-email');
    const btn        = quizEl.querySelector('[data-action="get-report"]');
    const hint       = quizEl.querySelector('#cta-hint');
    const email      = emailInput ? emailInput.value.trim() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (hint) { hint.style.color = '#DC2626'; hint.textContent = 'Введите корректный email для получения отчёта'; }
      if (emailInput) emailInput.focus();
      return;
    }

    if (btn)  { btn.innerHTML = 'Создаём заказ…'; btn.disabled = true; }
    if (hint) { hint.style.color = '#616784'; hint.textContent = 'Подключаемся к платёжной системе…'; }

    try {
      const sessionResp = await fetch(`${API_BASE}/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: state.answers }),
      });
      if (!sessionResp.ok) throw new Error(`Ошибка создания сессии: HTTP ${sessionResp.status}`);
      const { session_id } = await sessionResp.json();
      state._sessionId = session_id;

      const tier = (window.selectedTier && window.selectedTier !== 'free') ? window.selectedTier : 'protection';
      const paymentResp = await fetch(`${API_BASE}/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id, email, tier }),
      });
      if (!paymentResp.ok) {
        const errData = await paymentResp.json().catch(() => ({}));
        throw new Error(errData.detail || `Ошибка платежа: HTTP ${paymentResp.status}`);
      }
      const paymentData = await paymentResp.json();

      if (paymentData.already_paid && paymentData.report_token) {
        window.location.href = `/report/${paymentData.report_token}`;
        return;
      }
      if (paymentData.payment_url) {
        window.location.href = paymentData.payment_url;
      } else {
        throw new Error('Не получена ссылка на оплату');
      }
    } catch (err) {
      console.error('SelfCheck payment error:', err);
      if (hint) { hint.style.color = '#DC2626'; hint.textContent = err.message || 'Ошибка. Попробуйте ещё раз.'; }
      if (btn)  {
        btn.innerHTML = '🛡 Защититься — <span id="cta-price-label">' + (window.selectedPrice || 990).toLocaleString('ru') + '</span> ₽';
        btn.disabled = false;
      }
    }
  }

  // Lazy init
  const quizSection = document.querySelector('.quiz-section');
  if (quizSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          init('quiz-root');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    observer.observe(quizSection);
  } else {
    init('quiz-root');
  }

  window.initQuiz = init;

})();
