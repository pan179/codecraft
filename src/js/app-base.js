/* ============================================================
   CodeCraft · 应用主体（状态 / 首次引导 / 路由 / 外壳）
   ============================================================ */
(function () {
  'use strict';

  const App = window.App = {};
  const UI = window.UI, CORE = window.CORE, LANGS = window.LANGS || {};
  App.UI = UI; App.CORE = CORE; App.LANGS = LANGS;
  const esc = UI.esc;

  App.KEY = 'codecraft.v2';
  App.VER = 'k1';
  App.ORDER = ['python', 'c', 'cpp', 'java', 'javascript'];
  App.list = App.ORDER.filter(id => LANGS[id]);

  /* ---------------- 状态 ---------------- */
  function defaults() {
    return {
      v: 2,
      profile: { lang: '', days: 0, startDate: '', level: 'normal' },
      langs: {}
    };
  }

  App.load = function () {
    let raw = {};
    try { raw = JSON.parse(localStorage.getItem(App.KEY) || '{}') || {}; } catch (e) { raw = {}; }
    const d = defaults();
    const S = {
      v: 2,
      profile: Object.assign(d.profile, raw.profile || {}),
      langs: raw.langs || {}
    };
    if (S.profile.lang && !LANGS[S.profile.lang]) S.profile.lang = '';
    App.S = S;
    return S;
  };

  App.save = function () {
    try { localStorage.setItem(App.KEY, JSON.stringify(App.S)); } catch (e) {}
  };

  App.langState = function (id) {
    const S = App.S;
    if (!S.langs[id]) {
      S.langs[id] = {
        done: {}, solved: {}, tries: {}, wrong: {}, days: {}, daily: {},
        plan: null, planDays: 0, level: 'normal', startDate: ''
      };
    }
    const st = S.langs[id];
    ['done', 'solved', 'tries', 'wrong', 'days', 'daily'].forEach(k => { if (!st[k]) st[k] = {}; });
    if (!st.level) st.level = 'normal';
    return st;
  };

  /* 当前语言上下文 */
  App.bindLang = function (id) {
    id = id || App.S.profile.lang;
    App.langId = id;
    App.L = LANGS[id] || null;
    App.st = id ? App.langState(id) : null;
    App.ix = App.L ? CORE.index(App.L) : null;
    if (App.st && !App.st.plan && App.st.planDays) {
      App.st.plan = CORE.buildPlan(App.L, App.st.planDays);
    }
    return App.L;
  };

  /* 每日记录（打卡热力图 / 统计用） */
  App.touchDay = function (field, inc) {
    if (!App.st) return;
    const k = CORE.todayKey();
    const rec = App.st.days[k] || (App.st.days[k] = { checkin: false, lessons: 0, solved: 0 });
    if (field) rec[field] = (rec[field] || 0) + (inc == null ? 1 : inc);
    App.save();
  };

  /* ---------------- 通用工具 ---------------- */
  App.go = function (hash) {
    if (location.hash === hash) App.route();
    else location.hash = hash;
  };
  App.toast = UI.toast;
  App.planDay = function () {
    const st = App.st;
    if (!st || !st.plan) return null;
    return CORE.planDayOf(st.plan, st.startDate || App.S.profile.startDate || CORE.todayKey(), CORE.todayKey());
  };
  App.planDayIdx = function (dateKey) {
    const st = App.st;
    if (!st || !st.plan) return 0;
    const start = st.startDate || App.S.profile.startDate || CORE.todayKey();
    const d = CORE.diffDays(start, dateKey || CORE.todayKey());
    return Math.max(0, Math.min(st.plan.plan.length - 1, d)) + 1;
  };

  /* ---------------- 首次引导 ---------------- */
  let obState = { step: 1, lang: '', days: 14 };

  App.showOnboarding = function (resume) {
    const root = document.getElementById('ob-root') || (function () {
      const d = document.createElement('div');
      d.id = 'ob-root';
      document.body.appendChild(d);
      return d;
    })();
    document.body.style.overflow = 'hidden';
    if (resume) {
      /* 保留已选语言，重排天数 */
      obState.lang = App.S.profile.lang || '';
      obState.days = App.S.profile.days || 14;
      obState.step = obState.lang ? 2 : 1;
    } else {
      obState = { step: 1, lang: '', days: 14 };
    }
    renderOb();
  };

  function closeOnboarding() {
    const root = document.getElementById('ob-root');
    if (root) root.innerHTML = '';
    document.body.style.overflow = '';
  }

  function dayOptions(lang) {
    const n = lang.lessonsCount || (lang.chapters || []).reduce((a, c) => a + c.lessons.length, 0);
    /* 天数上限跟着课时量走：最多给到「一课时配两天」，避免出现 60 天里 44 天都在复习 */
    const cap = Math.max(21, Math.round(n * 2));
    let presets = [7, 14, 21, 30, 42, 60].filter(d => d <= cap);
    if (presets.length < 4) presets = [7, 14, 21, Math.max(21, cap)];
    return presets.map(d => {
      const p = CORE.buildPlan(lang, d);
      const learn = p.plan.filter(x => x.type === 'learn');
      const perDay = learn.length ? Math.ceil(n / learn.length) : n;
      return {
        days: d,
        perDay: perDay,
        learn: learn.length,
        extra: p.days - learn.length,
        title: d + ' 天'
      };
    });
  }

  function renderOb() {
    const root = document.getElementById('ob-root');
    if (!root) return;
    const steps = ['选语言', '定天数', '确认计划'];
    let h = '<div class="ob-wrap"><div class="ob-inner">';
    h += '<div class="ob-brand"><span class="brand-mark">CC</span><div>' +
      '<strong>CodeCraft · 多语言编程训练场</strong>' +
      '<span>一次把一门语言学透：精讲 + 在线运行 + 章节测试 + 每日打卡</span></div></div>';
    h += '<div class="ob-steps">' + steps.map((s, i) => {
      const n = i + 1;
      const cls = obState.step === n ? 'on' : (obState.step > n ? 'done' : '');
      return (i ? '<span class="ob-sep"></span>' : '') +
        '<span class="ob-step ' + cls + '"><i>' + (obState.step > n ? '✓' : n) + '</i>' + s + '</span>';
    }).join('') + '</div>';

    if (obState.step === 1) {
      h += '<div class="ob-card"><h1 class="ob-title">你想先学哪门语言？</h1>' +
        '<p class="ob-desc">选一门作为起点。进度、计划、打卡记录都按语言分开保存，之后随时能在右上角切换，互不影响。</p>';
      h += '<div class="lang-grid">' + App.list.map(id => {
        const L = LANGS[id];
        const lessons = L.chapters.reduce((a, c) => a + c.lessons.length, 0);
        const on = obState.lang === id;
        return '<button class="lang-card' + (on ? ' on' : '') + '" data-lang="' + id + '">' +
          '<span class="lc-tick">✓</span>' +
          '<span class="lc-top"><span class="lc-ico" style="background:' + L.color + '1a;color:' + L.color + '">' + L.icon + '</span>' +
          '<span><span class="lc-name">' + esc(L.name) + '</span><br><span class="lc-sub">' + esc(L.en) + '</span></span></span>' +
          '<span class="lc-desc">' + esc(L.blurb) + '</span>' +
          '<span class="lc-meta"><span><b>' + L.chapters.length + '</b> 章</span>' +
          '<span><b>' + lessons + '</b> 课</span>' +
          '<span><b>' + L.quiz.length + '</b> 测试题</span>' +
          '<span><b>' + L.checkin.length + '</b> 打卡题</span></span>' +
          '</button>';
      }).join('') + '</div>';
      h += '<div class="ob-actions"><span class="ob-hint">不确定？Python 语法最轻、上手最快；C 最能打基础。</span>' +
        '<button class="btn btn-primary" id="ob-next" ' + (obState.lang ? '' : 'disabled style="opacity:.5;cursor:not-allowed"') + '>下一步 →</button></div></div>';
    }

    if (obState.step === 2) {
      const L = LANGS[obState.lang];
      const opts = dayOptions(L);
      h += '<div class="ob-card"><h1 class="ob-title">打算用多少天学完 ' + esc(L.name) + '？</h1>' +
        '<p class="ob-desc">天数决定每天的学习强度。课多天少 → 一天多学几课；天多课少 → 多出来的天数自动排成复习日和冲刺日。之后可以在设置里重新规划。</p>';
      h += '<div class="day-grid">' + opts.map(o => {
        const on = obState.days === o.days;
        return '<button class="day-card' + (on ? ' on' : '') + '" data-days="' + o.days + '">' +
          '<b>' + o.days + '</b><span>天</span>' +
          '<em>每天 ' + o.perDay + ' 课 · 学习 ' + o.learn + ' 天' + (o.extra ? ' + 复盘 ' + o.extra + ' 天' : '') + '</em>' +
          '</button>';
      }).join('') + '</div>';
      const custom = opts.every(o => o.days !== obState.days);
      h += '<div class="ob-custom">' +
        '<span>想要别的节奏？自己填：</span>' +
        '<input type="number" id="ob-days-input" min="3" max="200" step="1" value="' + obState.days + '"' + (custom ? ' class="on"' : '') + '>' +
        '<span>天</span>' +
        '<button class="btn btn-ghost btn-sm" id="ob-days-apply">使用这个天数</button>' +
        '</div>';
      h += '<div class="ob-actions"><button class="btn btn-ghost" id="ob-back">← 上一步</button>' +
        '<button class="btn btn-primary" id="ob-next">查看我的计划 →</button></div></div>';
    }

    if (obState.step === 3) {
      const L = LANGS[obState.lang];
      const plan = CORE.buildPlan(L, obState.days);
      const lessons = L.chapters.reduce((a, c) => a + c.lessons.length, 0);
      const firstDay = plan.plan[0];
      h += '<div class="ob-card"><h1 class="ob-title">这是你的 ' + esc(L.name) + ' 学习计划</h1>' +
        '<p class="ob-desc">计划已按课时长度和章节顺序排好。每天打开网站，首页会直接告诉你今天学哪几课、做什么题。</p>';
      h += '<div class="ob-summary">' +
        '<div><b>' + plan.days + '</b>总天数</div>' +
        '<div><b>' + plan.learnDays + '</b>学习日</div>' +
        '<div><b>' + (plan.days - plan.learnDays) + '</b>复习/冲刺日</div>' +
        '<div><b>' + lessons + '</b>节课时</div>' +
        '<div><b>' + L.quiz.length + '</b>章节测试题</div>' +
        '<div><b>' + L.checkin.length + '</b>每日打卡题</div>' +
        '</div>';
      h += '<div style="border:1px solid var(--line);border-radius:12px;padding:14px 16px;background:#fcfdff">' +
        '<div style="font-size:12px;color:var(--mut);font-weight:700;letter-spacing:.4px;margin-bottom:8px">第 1 天</div>' +
        '<div style="font-weight:700;font-size:14px;margin-bottom:6px">' + esc(firstDay.title) + '</div>' +
        '<div style="font-size:12.5px;color:var(--mut);line-height:1.7">' + esc(firstDay.desc) + '</div>' +
        '<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">' +
        firstDay.lessons.map(l => '<span class="dl-lesson">' + esc(l.title) + '</span>').join('') + '</div></div>';
      h += '<div class="callout note" style="margin-top:16px"><span class="ci">💡</span><div>每天的学习进度、题目作答、打卡记录都保存在本机浏览器里，关掉网页再打开会接着上次继续。建议偶尔在「设置」里导出一次备份。</div></div>';
      h += '<div class="ob-actions"><button class="btn btn-ghost" id="ob-back">← 改天数</button>' +
        '<button class="btn btn-primary" id="ob-start">开始学习 →</button></div></div>';
    }

    h += '</div></div>';
    root.innerHTML = h;

    /* 事件 */
    root.querySelectorAll('[data-lang]').forEach(b => {
      b.addEventListener('click', () => {
        obState.lang = b.getAttribute('data-lang');
        const L = LANGS[obState.lang];
        obState.days = dayOptions(L).slice(1, 2)[0].days;
        renderOb();
      });
    });
    root.querySelectorAll('[data-days]').forEach(b => {
      b.addEventListener('click', () => { obState.days = +b.getAttribute('data-days'); renderOb(); });
    });
    const applyDays = root.querySelector('#ob-days-apply');
    if (applyDays) applyDays.addEventListener('click', () => {
      const inp = root.querySelector('#ob-days-input');
      const v = Math.max(3, Math.min(200, Math.round(+inp.value) || 0));
      if (!v) { App.toast('请填一个 3 ~ 200 之间的天数'); return; }
      obState.days = v;
      renderOb();
    });
    const daysInput = root.querySelector('#ob-days-input');
    if (daysInput) daysInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); if (applyDays) applyDays.click(); }
    });
    const nx = root.querySelector('#ob-next');
    if (nx) nx.addEventListener('click', () => { obState.step = Math.min(3, obState.step + 1); renderOb(); });
    const bk = root.querySelector('#ob-back');
    if (bk) bk.addEventListener('click', () => { obState.step = Math.max(1, obState.step - 1); renderOb(); });
    const start = root.querySelector('#ob-start');
    if (start) start.addEventListener('click', () => finishOnboarding());
  }

  function finishOnboarding() {
    const S = App.S;
    S.profile.lang = obState.lang;
    S.profile.days = obState.days;
    S.profile.startDate = CORE.todayKey();
    const st = App.langState(obState.lang);
    st.planDays = obState.days;
    st.startDate = S.profile.startDate;
    st.plan = CORE.buildPlan(LANGS[obState.lang], obState.days);
    App.save();
    closeOnboarding();
    App.bindLang(obState.lang);
    initShell();
    App.go('#/home');
    App.toast('计划已生成：' + st.plan.days + ' 天，加油！', 'ok');
  }

  /* ---------------- 选择语言弹窗 ---------------- */
  App.openLangPicker = function () {
    const cur = App.S.profile.lang;
    const m = UI.modal(
      '<h3 style="margin:0 0 4px;font-size:17px">切换学习语言</h3>' +
      '<p style="margin:0 0 14px;font-size:12.5px;color:#7c8798">每门语言的课程进度、打卡记录独立保存，切换不会互相覆盖。</p>' +
      '<div class="lang-grid">' + App.list.map(id => {
        const L = LANGS[id];
        const has = App.S.langs[id];
        const doneN = has ? Object.keys(has.done).length : 0;
        const lessons = L.chapters.reduce((a, c) => a + c.lessons.length, 0);
        return '<button class="lang-card' + (id === cur ? ' on' : '') + '" data-pick="' + id + '">' +
          (id === cur ? '<span class="lc-tick">✓</span>' : '') +
          '<span class="lc-top"><span class="lc-ico" style="background:' + L.color + '1a;color:' + L.color + '">' + L.icon + '</span>' +
          '<span><span class="lc-name">' + esc(L.name) + '</span><br><span class="lc-sub">' + esc(L.en) + '</span></span></span>' +
          '<span class="lc-meta"><span>已学 <b>' + doneN + '/' + lessons + '</b> 课</span></span></button>';
      }).join('') + '</div>',
      { width: 720 });
    m.querySelectorAll('[data-pick]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-pick');
        UI.closeModal();
        if (id === cur) return;
        App.switchLang(id);
      });
    });
  };

  App.switchLang = function (id) {
    if (!LANGS[id]) return;
    const S = App.S;
    const st = App.langState(id);
    if (!st.plan || !st.planDays) {
      /* 第一次进入这门语言：沿用当前的天数偏好 */
      const days = S.profile.days || 21;
      st.planDays = days;
      st.startDate = CORE.todayKey();
      st.plan = CORE.buildPlan(LANGS[id], days);
    }
    S.profile.lang = id;
    S.profile.days = st.planDays;
    S.profile.startDate = st.startDate || S.profile.startDate;
    App.save();
    App.bindLang(id);
    initShell();
    App.go('#/home');
    App.toast('已切换到 ' + LANGS[id].name + '，进度单独保存', 'ok');
  };

  /* ---------------- 顶栏 / 侧边栏 ---------------- */
  function initShell() {
    const L = App.L, st = App.st;
    if (!L) return;
    document.getElementById('lang-ico').textContent = L.icon;
    document.getElementById('lang-name').textContent = L.name;
    document.getElementById('brand-sub').textContent = L.name + ' 训练场';
    document.querySelectorAll('#level-switch button').forEach(b => {
      b.classList.toggle('on', b.getAttribute('data-level') === (st.level || 'normal'));
    });
    document.getElementById('streak-num').textContent = CORE.streak(st);
    document.getElementById('btn-settings').onclick = () => App.go('#/settings');
    document.getElementById('lang-pill').onclick = () => App.openLangPicker();

    document.querySelectorAll('#level-switch button').forEach(b => {
      b.onclick = () => {
        st.level = b.getAttribute('data-level');
        App.save();
        initShell();
        const d = st.daily[CORE.todayKey()];
        if (d) { delete st.daily[CORE.todayKey()]; App.save(); }
        App.toast('难度：' + CORE.LEVELS[st.level].name + ' · 每天 ' + CORE.LEVELS[st.level].total + ' 题');
        if (location.hash.indexOf('#/daily') === 0) App.route();
      };
    });
  }
  App.initShell = initShell;

  function renderSidebar(activeLesson, activeCh) {
    const L = App.L, st = App.st, ix = App.ix;
    const nav = document.getElementById('sidebar-nav');
    const hash = location.hash || '#/home';
    const link = (href, icon, text, on, extra) =>
      '<a class="nav-link' + (on ? ' active' : '') + '" href="' + href + '">' +
      '<span class="ico">' + icon + '</span><span>' + text + '</span>' + (extra || '') + '</a>';

    let h = '<div class="nav-group-title">学习面板</div>';
    h += link('#/home', '🏠', '总览与今日任务', hash === '#/home' || hash === '' || hash === '#/');
    h += link('#/daily', '📅', '每日打卡', hash.indexOf('#/daily') === 0);
    h += link('#/plan', '🗺️', '我的 ' + (st.plan ? st.plan.days : App.S.profile.days) + ' 天计划', hash.indexOf('#/plan') === 0);
    h += link('#/calendar', '🔥', '打卡记录', hash.indexOf('#/calendar') === 0);
    h += link('#/lab', '🧪', '代码实验室', hash.indexOf('#/lab') === 0);
    h += link('#/wrong', '📕', '错题本 (' + Object.keys(st.wrong).length + ')', hash.indexOf('#/wrong') === 0);
    h += link('#/settings', '⚙️', '设置与备份', hash.indexOf('#/settings') === 0);

    h += '<div class="nav-group-title">' + esc(L.name) + ' 课程目录</div><div class="nav-chapters">';
    L.chapters.forEach((c, ci) => {
      const pct = CORE.chapterPct(L, st, c.id);
      const isOn = activeCh === c.id;
      const allDone = pct === 100;
      h += '<div class="ch-wrap">';
      h += '<div class="ch-head' + (isOn ? ' on' : '') + (allDone ? ' done' : '') + '" data-ch="' + c.id + '">' +
        '<span class="ch-num">' + (allDone ? '✓' : (c.num != null ? c.num : ci + 1)) + '</span>' +
        '<span class="ch-name">' + esc(c.title) + '</span>' +
        '<span class="ch-pct">' + pct + '%</span></div>';
      h += '<div class="ch-rest' + (isOn ? ' show' : '') + '">';
      c.lessons.forEach(l => {
        h += '<div class="ch-lesson' + (st.done[l.id] ? ' read' : '') + (activeLesson === l.id ? ' active' : '') +
          '" data-lesson="' + l.id + '"><span class="tick">✓</span><span>' + esc(l.title) + '</span></div>';
      });
      h += '</div></div>';
    });
    h += '</div>';
    nav.innerHTML = h;

    nav.querySelectorAll('.ch-head').forEach(el => {
      el.addEventListener('click', e => {
        const id = el.getAttribute('data-ch');
        const rest = el.nextElementSibling;
        const wasOpen = rest.classList.contains('show');
        nav.querySelectorAll('.ch-rest').forEach(r => r.classList.remove('show'));
        nav.querySelectorAll('.ch-head').forEach(r => r.classList.remove('on'));
        if (!wasOpen) { rest.classList.add('show'); el.classList.add('on'); }
        if (!activeCh || activeCh !== id) App.go('#/ch/' + id);
      });
    });
    nav.querySelectorAll('[data-lesson]').forEach(el => {
      el.addEventListener('click', () => App.go('#/lesson/' + el.getAttribute('data-lesson')));
    });

    const pct = CORE.overallPct(L, st);
    const mpText = document.getElementById('mp-text');
    if (mpText) {
      mpText.textContent = pct + '%';
      document.getElementById('mp-bar').style.width = pct + '%';
      document.getElementById('mp-sub').textContent =
        '已读 ' + CORE.doneCount(L, st) + ' / ' + ix.ALL.length + ' 课 · 做对 ' +
        Object.keys(st.solved).length + ' 题';
    }
  }

  /* ---------------- 路由 ---------------- */
  App.route = function () {
    const hash = location.hash || '#/home';
    const parts = hash.replace(/^#\/?/, '').split('/');
    const page = parts[0] || 'home';
    const view = document.getElementById('view');
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');

    if (!App.L || !App.st) {
      view.innerHTML = '<div class="empty">正在准备…</div>';
      return;
    }
    UI.resetStore();
    window.scrollTo({ top: 0, behavior: 'auto' });

    try {
      if (page === 'lesson') {
        const l = App.ix.LMAP[parts[1]];
        if (!l) { view.innerHTML = '<div class="empty">没有找到这一课</div>'; return; }
        renderSidebar(l.id, l.ch);
        App.renderLesson(l);
      } else if (page === 'ch') {
        const c = App.ix.CH[parts[1]];
        if (!c) { view.innerHTML = '<div class="empty">没有找到这一章</div>'; return; }
        renderSidebar(null, c.id);
        App.renderChapter(c);
      } else if (page === 'practice') {
        const c = App.ix.CH[parts[1]];
        if (!c) { view.innerHTML = '<div class="empty">没有找到这一章</div>'; return; }
        renderSidebar(null, c.id);
        App.renderPractice(c);
      } else if (page === 'daily') { renderSidebar(null, null); App.renderDaily(); }
      else if (page === 'plan') { renderSidebar(null, null); App.renderPlan(); }
      else if (page === 'calendar') { renderSidebar(null, null); App.renderCalendar(); }
      else if (page === 'lab') { renderSidebar(null, null); App.renderLab(); }
      else if (page === 'wrong') { renderSidebar(null, null); App.renderWrong(); }
      else if (page === 'settings') { renderSidebar(null, null); App.renderSettings(); }
      else { renderSidebar(null, null); App.renderHome(); }
    } catch (err) {
      view.innerHTML = '<div class="empty">页面渲染出错：' + esc(err && err.message) +
        '<br><button class="btn btn-ghost btn-sm" onclick="location.reload()" style="margin-top:12px">刷新重试</button></div>';
      console.error(err);
    }
  };

  /* ---------------- 启动 ---------------- */
  App.boot = function () {
    App.load();
    window.addEventListener('hashchange', App.route);

    document.querySelector('.brand').addEventListener('click', e => {
      e.preventDefault();
      App.go('#/home');
    });
    const menu = document.getElementById('btn-menu');
    if (menu) menu.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    if (!App.S.profile.lang || !LANGS[App.S.profile.lang]) {
      App.showOnboarding();
      return;
    }

    App.bindLang(App.S.profile.lang);
    const st = App.st;
    if (!st.plan || !st.plan.plan || !st.plan.plan.length) {
      /* 老数据 / 计划丢失：按已选天数重建，不动已有进度 */
      st.planDays = st.planDays || App.S.profile.days || 21;
      st.startDate = st.startDate || App.S.profile.startDate || CORE.todayKey();
      st.plan = CORE.buildPlan(App.L, st.planDays);
      App.save();
    }
    initShell();
    if (!location.hash) location.hash = '#/home';
    App.route();
  };

  window.addEventListener('DOMContentLoaded', App.boot);
})();
