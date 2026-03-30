/**
 * SelfCheck — Quiz Engine
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

  let state = { step: 'quiz', currentQ: 0, answers: [], result: null, selectedValue: null };
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
  }

  function renderQuiz() {
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

  function renderLoading() {
    return `<div class="quiz-loading"><div class="quiz-spinner"></div><p>Анализируем ваши ответы<br>по критериям ФНС и Минэк 2026…</p></div>`;
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
      <p class="result-summary">${r.summary}</p>
      <div class="result-factors">
        <h4 class="result-section-title">Факторы риска по вашим ответам</h4>
        <div class="result-factors-list">
          ${r.factors.map(f => {
            const fc = { green: '#16A34A', yellow: '#D97706', red: '#DC2626' }[f.risk_level];
            const fi = { green: '✓', yellow: '!', red: '✕' }[f.risk_level];
            return `<div class="factor-item factor-${f.risk_level}">
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
          <label class="result-consent" style="display:flex;align-items:flex-start;gap:8px;margin-bottom:12px;cursor:pointer;font-size:0.8125rem;color:var(--text-faint)">
            <input type="checkbox" id="cta-consent" style="margin-top:2px;flex-shrink:0;">
            <span>Я принимаю <a href="offer.html" target="_blank" style="color:var(--accent)">условия оферты</a> и <a href="privacy.html" target="_blank" style="color:var(--accent)">политику конфиденциальности</a></span>
          </label>
          <div class="result-cta-form" id="cta-form">
            <input type="email" id="cta-email" class="result-cta-email" placeholder="Ваш email для получения отчёта" autocomplete="email">
            <button class="btn btn-primary" data-action="get-report" id="cta-pay-btn">
              Получить за <span id="cta-price-label">990</span> ₽
            </button>
          </div>
          <p class="result-cta-hint" id="cta-hint"></p>
        </div>
        <button class="quiz-restart" data-action="restart">← Пройти заново</button>
      </div>
      <div class="result-calc" style="background:linear-gradient(135deg,#1E2235,#2A1F3D);border:1px solid #3A3E5C;border-radius:14px;padding:20px 24px;margin:16px 0;">
        <h4 style="color:#E8EAFB;font-size:1rem;font-weight:600;margin:0 0 12px;">Калькулятор последствий переквалификации</h4>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
          <label style="color:#9BA3C4;font-size:0.875rem;white-space:nowrap;">Доход от заказчика в месяц:</label>
          <input type="number" id="calc-income" placeholder="100000" min="0" max="99999999"
            style="background:#131525;border:1px solid #3A3E5C;color:#E8EAFB;border-radius:8px;padding:8px 12px;font-size:0.875rem;width:120px;">
          <span style="color:#9BA3C4;font-size:0.875rem;">₽</span>
        </div>
        <div id="calc-results" style="display:none;">
          <div style="background:#0D0F1C;border-radius:10px;padding:14px 16px;margin-bottom:10px;">
            <div style="color:#E85D04;font-size:0.8125rem;font-weight:600;margin-bottom:8px;">Ваши риски (самозанятый):</div>
            <div style="display:flex;justify-content:space-between;color:#9BA3C4;font-size:0.8125rem;margin-bottom:4px;"><span>Доначисление НДФЛ 13%:</span><span id="calc-ndfl" style="color:#E8EAFB;font-weight:600;"></span></div>
            <div style="display:flex;justify-content:space-between;color:#9BA3C4;font-size:0.8125rem;margin-bottom:4px;"><span>Штраф за неуплату 20%:</span><span id="calc-penalty" style="color:#E8EAFB;font-weight:600;"></span></div>
            <div style="display:flex;justify-content:space-between;font-size:0.875rem;margin-top:8px;padding-top:8px;border-top:1px solid #2A2D45;"><span style="color:#E8EAFB;font-weight:600;">Итого ваши доначисления:</span><span id="calc-total" style="color:#E85D04;font-weight:700;"></span></div>
          </div>
          <div style="background:#0D0F1C;border-radius:10px;padding:14px 16px;">
            <div style="color:#F59E0B;font-size:0.8125rem;font-weight:600;margin-bottom:8px;">Риски вашего заказчика:</div>
            <div style="display:flex;justify-content:space-between;color:#9BA3C4;font-size:0.8125rem;"><span>Страховые взносы ~30%:</span><span id="calc-employer" style="color:#E8EAFB;font-weight:600;"></span></div>
            <div style="color:#9BA3C4;font-size:0.75rem;margin-top:6px;">Платит заказчик — но именно это часто становится причиной расторжения договора</div>
          </div>
        </div>
      </div>
      <p class="result-disclaimer">Результат носит информационный характер и не является юридической консультацией.</p>
    </div>`;
  }

  function renderError() {
    return `<div class="quiz-error"><div class="quiz-error-icon">⚠</div><p>Не удалось получить результат.<br>Проверьте подключение и попробуйте ещё раз.</p><button class="btn btn-outline" data-action="restart">Попробовать снова</button></div>`;
  }

  const TIER_FEATURES = {
    protection: ['Персональный PDF-отчёт с анализом рисков','Шаблон договора ГПХ (.docx)','Шаблон акта выполненных работ (.docx)','Чек-лист безопасности НПД (12 пунктов)','Калькулятор налоговых последствий'],
    shield:     ['Всё из тарифа Стандарт','Персонализированный договор ГПХ под ваши данные','Письмо заказчику с защитными формулировками','Консультация в чате 24ч'],
    armor:      ['Всё из тарифа Щит','Возражение в ФНС на акт проверки (PDF)','Приоритетная поддержка'],
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
    const income = parseFloat(document.getElementById('calc-income')?.value) || 0;
    if (income > 0) {
      const ndfl = Math.round(income * 0.13);
      const penalty = Math.round(ndfl * 0.20);
      const total = ndfl + penalty;
      const employer = Math.round(income * 0.30);
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val.toLocaleString('ru'); };
      set('calc-ndfl', ndfl); set('calc-penalty', penalty); set('calc-total', total); set('calc-employer', employer);
      const res = document.getElementById('calc-results');
      if (res) res.style.display = 'block';
    } else {
      const res = document.getElementById('calc-results');
      if (res) res.style.display = 'none';
    }
  }
  window.calcUpdate = calcUpdate;

  function attachHandlers() {
    if (!quizEl) return;

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
        state = { step: 'quiz', currentQ: 0, answers: [], result: null, selectedValue: null };
        render();
      });
    });

    updateTierUI(window.selectedTier || 'protection', window.selectedPrice || 990);
    quizEl.querySelectorAll('.tier-tab').forEach(tab => {
      tab.addEventListener('click', () => updateTierUI(tab.dataset.tier, tab.dataset.price));
    });

    const calcInput = quizEl.querySelector('#calc-income');
    if (calcInput) calcInput.addEventListener('input', calcUpdate);

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

    const consentBox = quizEl.querySelector('#cta-consent');
    if (consentBox && !consentBox.checked) {
      if (hint) { hint.style.color = '#DC2626'; hint.textContent = 'Необходимо принять условия оферты'; }
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (hint) { hint.style.color = '#DC2626'; hint.textContent = 'Введите корректный email для получения отчёта'; }
      if (emailInput) emailInput.focus();
      return;
    }

    if (btn)  { btn.textContent = 'Создаём заказ…'; btn.disabled = true; }
    if (hint) { hint.style.color = '#616784'; hint.textContent = 'Подключаемся к платёжной системе…'; }

    try {
      const sessionResp = await fetch(`${API_BASE}/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: state.answers }),
      });
      if (!sessionResp.ok) throw new Error(`Ошибка создания сессии: HTTP ${sessionResp.status}`);
      const { session_id } = await sessionResp.json();

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
      if (btn)  { btn.textContent = 'Получить за ' + (window.selectedPrice || 990).toLocaleString('ru') + ' ₽'; btn.disabled = false; }
    }
  }

  window.SelfCheckQuiz = { init };
})();