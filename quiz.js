/**
 * SelfCheck — Quiz Engine
 * Встроенный опросник: 10 вопросов → оценка риска → результат
 * Подключается к API /api/check и /api/report/generate
 */

(function () {
  'use strict';

  // ─── Config ─────────────────────────────────────────────────────────────────
  const API_BASE = window.SELFCHECK_API || '/api';

  // ─── Questions (дублируем из backend для offline-режима) ────────────────────
  const QUESTIONS = [
    {
      id: 1,
      text: 'Сколько заказчиков у вас одновременно?',
      hint: 'Один постоянный заказчик — ключевой признак трудовых отношений по критериям ФНС',
      options: [
        { value: 'many',  label: '3 и более заказчика' },
        { value: 'two',   label: '2 заказчика' },
        { value: 'one',   label: 'Только один заказчик' },
      ],
    },
    {
      id: 2,
      text: 'Как оформлены ваши отношения с заказчиком?',
      hint: 'Договор должен описывать конкретный результат, а не процесс работы',
      options: [
        { value: 'result_contract', label: 'Договор ГПХ на конкретный результат' },
        { value: 'service_contract', label: 'Договор на оказание услуг (абонентский)' },
        { value: 'verbal',           label: 'Устная договорённость или без договора' },
      ],
    },
    {
      id: 3,
      text: 'Как часто заказчик выплачивает вам вознаграждение?',
      hint: 'Регулярные ежемесячные выплаты фиксированной суммы — признак трудовых отношений',
      options: [
        { value: 'per_project',    label: 'По завершении каждого проекта/задачи' },
        { value: 'irregular',      label: 'Нерегулярно, по результату' },
        { value: 'monthly_fixed',  label: 'Ежемесячно, фиксированная сумма' },
      ],
    },
    {
      id: 4,
      text: 'Кто контролирует ваш рабочий график и режим работы?',
      hint: 'Подчинение внутреннему распорядку — один из главных критериев переквалификации',
      options: [
        { value: 'self',     label: 'Я сам определяю время и место работы' },
        { value: 'partial',  label: "Частично — есть дедлайны, онлайн-встречи" },
        { value: 'employer', label: 'Заказчик устанавливает график и присутствие' },
      ],
    },
    {
      id: 5,
      text: 'Чьим оборудованием и инструментами вы пользуетесь?',
      hint: 'Использование оборудования заказчика — признак трудовых отношений',
      options: [
        { value: 'own',      label: 'Только своими инструментами и оборудованием' },
        { value: 'mixed',    label: 'Смешанно — своими и заказчика' },
        { value: 'employer', label: 'В основном оборудованием заказчика' },
      ],
    },
    {
      id: 6,
      text: 'Можете ли вы привлекать субподрядчиков для выполнения работы?',
      hint: 'Обязанность выполнять работу лично — признак трудового договора',
      options: [
        { value: 'yes',       label: 'Да, могу делегировать часть работы' },
        { value: 'sometimes', label: 'Иногда, с согласия заказчика' },
        { value: 'no',        label: 'Нет, только лично' },
      ],
    },
    {
      id: 7,
      text: 'Несёте ли вы финансовую ответственность за ошибки в работе?',
      hint: 'Отсутствие финансовой ответственности исполнителя — признак трудовых отношений',
      options: [
        { value: 'yes',     label: 'Да, несу ответственность согласно договору' },
        { value: 'partial', label: 'Частично, в некоторых случаях' },
        { value: 'no',      label: 'Нет, заказчик принимает все риски' },
      ],
    },
    {
      id: 8,
      text: 'Есть ли у вас доступ к корпоративным системам заказчика?',
      hint: 'Интеграция в корпоративную инфраструктуру (CRM, Slack, внутренний портал) — признак трудовых отношений',
      options: [
        { value: 'no',      label: 'Нет корпоративного доступа' },
        { value: 'limited', label: 'Только для проекта, временный доступ' },
        { value: 'full',    label: 'Полный доступ как у сотрудников' },
      ],
    },
    {
      id: 9,
      text: 'Какую долю дохода составляют выплаты от основного заказчика?',
      hint: 'Более 80% дохода от одного источника — критический показатель риска',
      options: [
        { value: 'less_50', label: 'Менее 50% от общего дохода' },
        { value: '50_80',   label: '50–80% от общего дохода' },
        { value: 'over_80', label: 'Более 80% от одного заказчика' },
      ],
    },
    {
      id: 10,
      text: 'Упоминается ли в договоре ваша должность или специальность?',
      hint: 'Указание должности вместо результата работы — прямой признак трудового договора',
      options: [
        { value: 'no',       label: 'Нет, указан только результат работ' },
        { value: 'function', label: 'Указана функция, но не должность' },
        { value: 'position', label: 'Да, указана должность или специальность' },
      ],
    },
  ];

  // ─── State ──────────────────────────────────────────────────────────────────
  let state = {
    step: 'quiz',       // 'quiz' | 'loading' | 'result' | 'error'
    currentQ: 0,
    answers: [],        // [{question_id, value}]
    result: null,
    selectedValue: null,
  };

  // ─── DOM refs ────────────────────────────────────────────────────────────────
  let quizEl = null;

  // ─── Init ────────────────────────────────────────────────────────────────────
  function init(containerId) {
    quizEl = document.getElementById(containerId);
    if (!quizEl) return;
    render();
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  function render() {
    if (!quizEl) return;
    switch (state.step) {
      case 'quiz':    quizEl.innerHTML = renderQuiz(); break;
      case 'loading': quizEl.innerHTML = renderLoading(); break;
      case 'result':  quizEl.innerHTML = renderResult(); break;
      case 'error':   quizEl.innerHTML = renderError(); break;
    }
    attachHandlers();
  }

  // ─── Quiz step ───────────────────────────────────────────────────────────────
  function renderQuiz() {
    const q = QUESTIONS[state.currentQ];
    const total = QUESTIONS.length;
    const progress = ((state.currentQ) / total) * 100;
    const canNext = state.selectedValue !== null;

    return `
    <div class="quiz-wrap">
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width:${progress}%"></div>
      </div>
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
              <span class="quiz-option-indicator">
                ${state.selectedValue === opt.value
                  ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
                  : ''}
              </span>
              <span class="quiz-option-text">${opt.label}</span>
            </label>
          `).join('')}
        </div>

      </div>

      <div class="quiz-actions">
        <button class="btn btn-primary btn-lg quiz-next ${!canNext ? 'disabled' : ''}"
                data-action="next" ${!canNext ? 'disabled' : ''}>
          ${state.currentQ === total - 1 ? 'Получить результат →' : 'Следующий вопрос →'}
        </button>
      </div>
    </div>`;
  }

  // ─── Loading ─────────────────────────────────────────────────────────────────
  function renderLoading() {
    return `
    <div class="quiz-loading">
      <div class="quiz-spinner"></div>
      <p>Анализируем ваши ответы<br>по критериям ФНС и Минэк 2026…</p>
    </div>`;
  }

  // ─── Result ──────────────────────────────────────────────────────────────────
  function renderResult() {
    const r = state.result;
    const riskConfig = {
      green:  { label: 'Низкий риск',    color: '#16A34A', bg: '#DCFCE7', border: '#86EFAC', emoji: '✓', gauge: 15 },
      yellow: { label: 'Средний риск',   color: '#D97706', bg: '#FEF3C7', border: '#FCD34D', emoji: '!', gauge: 55 },
      red:    { label: 'Высокий риск',   color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5', emoji: '✕', gauge: 88 },
    };
    const cfg = riskConfig[r.overall_risk];
    const gaugeWidth = Math.min(100, r.score);

    return `
    <div class="quiz-result">

      <!-- Risk badge -->
      <div class="result-hero" style="border-color:${cfg.border}; background:${cfg.bg};">
        <div class="result-emoji" style="color:${cfg.color};">${cfg.emoji}</div>
        <div class="result-label" style="color:${cfg.color};">${cfg.label}</div>
        <div class="result-score-label">Индекс риска: <strong>${r.score} / 100</strong></div>

        <div class="result-gauge-wrap">
          <div class="result-gauge-track">
            <div class="result-gauge-fill" style="width:${gaugeWidth}%; background:${cfg.color};"></div>
          </div>
          <div class="result-gauge-labels">
            <span>Безопасно</span>
            <span>Средний</span>
            <span>Критично</span>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <p class="result-summary">${r.summary}</p>

      <!-- Factors -->
      <div class="result-factors">
        <h4 class="result-section-title">Факторы риска по вашим ответам</h4>
        <div class="result-factors-list">
          ${r.factors.map(f => {
            const fc = { green: '#16A34A', yellow: '#D97706', red: '#DC2626' }[f.risk_level];
            const fi = { green: '✓', yellow: '!', red: '✕' }[f.risk_level];
            return `
            <div class="factor-item factor-${f.risk_level}">
              <div class="factor-icon" style="color:${fc};">${fi}</div>
              <div class="factor-body">
                <div class="factor-question">${f.question_text}</div>
                <div class="factor-answer">Ваш ответ: <em>${f.answer}</em></div>
                ${f.risk_level !== 'green' ? '<div class="factor-explanation factor-explanation--locked">🔒 Подробный анализ и рекомендации — в полном отчёте</div>' : ''}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Recommendations — только в платном отчёте -->

      <!-- CTA -->
      <div class="result-cta-block">
        <div class="result-cta-card">
          <div class="result-cta-icon">📄</div>
          <div class="result-cta-text">
            <strong>Полный отчёт + документы</strong>
            <span>Подробный анализ каждого фактора, рекомендации, договор ГПХ и акт</span>
          </div>
          <div class="result-cta-form" id="cta-form">
            <input
              type="email"
              id="cta-email"
              class="result-cta-email"
              placeholder="Ваш email для получения отчёта"
              autocomplete="email"
            />
            <button class="btn btn-primary" data-action="get-report">
              Получить за 390 ₽
            </button>
          </div>
          <p class="result-cta-hint" id="cta-hint"></p>
        </div>
        <button class="quiz-restart" data-action="restart">
          ← Пройти заново
        </button>
      </div>

      <p class="result-disclaimer">
        Результат носит информационный характер и не является юридической консультацией.
      </p>
    </div>`;
  }

  // ─── Error ───────────────────────────────────────────────────────────────────
  function renderError() {
    return `
    <div class="quiz-error">
      <div class="quiz-error-icon">⚠</div>
      <p>Не удалось получить результат.<br>Проверьте подключение и попробуйте ещё раз.</p>
      <button class="btn btn-outline" data-action="restart">Попробовать снова</button>
    </div>`;
  }

  // ─── Event handlers ──────────────────────────────────────────────────────────
  function attachHandlers() {
    if (!quizEl) return;

    // Option select
    quizEl.querySelectorAll('.quiz-option').forEach(el => {
      el.addEventListener('click', () => {
        const val = el.dataset.value;
        state.selectedValue = val;
        render();
      });
    });

    // Next button
    const nextBtn = quizEl.querySelector('[data-action="next"]');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!state.selectedValue) return;
        // Save answer
        const qId = QUESTIONS[state.currentQ].id;
        state.answers = state.answers.filter(a => a.question_id !== qId);
        state.answers.push({ question_id: qId, value: state.selectedValue });

        if (state.currentQ < QUESTIONS.length - 1) {
          // Pre-fill if we already answered this question (going forward again)
          state.currentQ++;
          const existing = state.answers.find(a => a.question_id === QUESTIONS[state.currentQ].id);
          state.selectedValue = existing ? existing.value : null;
          render();
        } else {
          submitAnswers();
        }
      });
    }

    // Back button
    const backBtn = quizEl.querySelector('[data-action="back"]');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.currentQ--;
        const existing = state.answers.find(a => a.question_id === QUESTIONS[state.currentQ].id);
        state.selectedValue = existing ? existing.value : null;
        render();
      });
    }

    // Restart
    quizEl.querySelectorAll('[data-action="restart"]').forEach(btn => {
      btn.addEventListener('click', () => {
        state = { step: 'quiz', currentQ: 0, answers: [], result: null, selectedValue: null };
        render();
      });
    });

    // Get report
    const reportBtn = quizEl.querySelector('[data-action="get-report"]');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => downloadReport());
    }
  }

  // ─── API calls ───────────────────────────────────────────────────────────────
  async function submitAnswers() {
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

  async function downloadReport() {
    const btn = quizEl.querySelector('[data-action="get-report"]');
    const emailInput = quizEl.querySelector('#cta-email');
    const hint = quizEl.querySelector('#cta-hint');

    // Валидация email
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email || !email.includes('@')) {
      if (hint) {
        hint.textContent = 'Введите email — отчёт придёт на почту после оплаты';
        hint.style.color = '#DC2626';
      }
      if (emailInput) emailInput.focus();
      return;
    }

    if (btn) {
      btn.textContent = 'Создаём платёж…';
      btn.disabled = true;
    }
    if (hint) { hint.textContent = ''; }

    try {
      // 1. Сохраняем сессию
      const sessionResp = await fetch(`${API_BASE}/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: state.answers, session_id: state.result?.session_id }),
      });
      if (!sessionResp.ok) throw new Error('session');
      const { session_id } = await sessionResp.json();

      // 2. Создаём платёж
      const payResp = await fetch(`${API_BASE}/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id, email }),
      });
      if (!payResp.ok) throw new Error('payment');
      const { payment_url } = await payResp.json();

      // 3. Редирект на ЮКасса
      window.location.href = payment_url;

    } catch (err) {
      console.error('Payment error:', err);
      if (hint) {
        hint.textContent = 'Ошибка создания платежа. Попробуйте ещё раз.';
        hint.style.color = '#DC2626';
      }
      if (btn) {
        btn.textContent = 'Получить за 390 ₽';
        btn.disabled = false;
      }
    }
  }

  // ─── Public API ──────────────────────────────────────────────────────────────
  window.SelfCheckQuiz = { init };
})();
