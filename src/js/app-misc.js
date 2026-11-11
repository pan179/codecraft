/* ============================================================
   CodeCraft · 每日打卡 / 计划 / 日历 / 实验室 / 错题本 / 设置
   ============================================================ */
(function () {
  'use strict';

  const App = window.App, UI = App.UI, CORE = App.CORE, esc = UI.esc;

  /* ================= 每日打卡 ================= */
  function getDaily() {
    const st = App.st, date = CORE.todayKey();
    const level = st.level || 'normal';
    const key = App.VER + '|' + App.L.id + '|' + date + '|' + level;
    let d = st.daily[date];
    const checked = !!(st.days[date] && st.days[date].checkin);
    if (!d || (d.key !== key && !checked && !Object.keys(d.answers || {}).length)) {
      d = {
        key: key, level: level, checked: checked,
        qids: CORE.pickCheckin(App.L, st, date, level),
        answers: (d && d.answers) || {}
      };
      st.daily[date] = d;
      pruneDaily(st);
      App.save();
    }
    return d;
  }

  function pruneDaily(st) {
    const keys = Object.keys(st.daily).sort();
    if (keys.length > 60) {
      keys.slice(0, keys.length - 60).forEach(k => {
        if (!(st.days[k] && st.days[k].checkin)) delete st.daily[k];
      });
    }
  }

  App.renderDaily = function () {
    const view = document.getElementById('view');
    const st = App.st, L = App.L;
    const d = getDaily();
    const cfg = CORE.LEVELS[st.level] || CORE.LEVELS.normal;
    const today = CoreFmt();
    const rec = st.days[CORE.todayKey()] || {};
    const checked = !!rec.checkin;
    const okN = d.qids.filter(id => d.answers[id] && d.answers[id].ok).length;
    const scope = CORE.learnedChapters(L, st).map(id => App.ix.CH[id] ? App.ix.CH[id].title : id);

    let h = '';
    h += '<div class="daily-head"><div class="dh-top">' +
      '<div style="flex:1;min-width:240px">' +
      '<div class="dh-date">' + today + ' · ' + cfg.name + '模式（每天 ' + cfg.total + ' 题）</div>' +
      '<h1 style="margin:6px 0 8px;font-size:22px">📅 ' + esc(L.name) + ' 每日打卡</h1>' +
      '<div style="font-size:12.5px;color:#7c8798;line-height:1.8">' +
      '出题范围：<b style="color:#4b5768">' + esc(scope.join(' / ')) + '</b>（跟着你的学习进度走）<br>' +
      '这一套题来自独立的「打卡题库」，<b style="color:#4b5768">和章节测试题完全不重复</b>。</div></div>' +
      '<div style="text-align:center;flex:none">' +
      '<div style="position:relative;display:inline-block">' + UI.ring(checked ? 100 : Math.round(okN / Math.max(1, d.qids.length) * 100), 92, checked ? '#0f9d58' : '#2f6be0') +
      '<div style="position:absolute;inset:0;display:grid;place-items:center">' +
      '<div style="text-align:center"><div style="font-size:19px;font-weight:800;color:' + (checked ? '#0f9d58' : '#1c2431') + '">' +
      (checked ? '✓' : okN + '/' + d.qids.length) + '</div>' +
      '<div style="font-size:10px;color:#7c8798">' + (checked ? '已打卡' : '做对') + '</div></div></div></div>' +
      '<div style="font-size:11.5px;color:#7c8798;margin-top:8px">🔥 连续 ' + CORE.streak(st) + ' 天</div></div>' +
      '</div>';

    h += '<div class="checkin-bar" style="display:flex;gap:10px;align-items:center;margin-top:16px;flex-wrap:wrap">';
    if (checked) {
      h += '<span class="tag tag-green" style="font-size:12px;padding:5px 12px">✓ 今天已经打卡</span>' +
        '<span style="font-size:12px;color:#7c8798">今天读了 ' + (rec.lessons || 0) + ' 课，做对 ' + (rec.solved || 0) + ' 题</span>';
    } else {
      h += '<button class="btn btn-primary" id="btn-checkin"' + (okN === d.qids.length ? '' : ' disabled style="opacity:.5;cursor:not-allowed"') + '>🔥 今日打卡</button>' +
        '<span style="font-size:12px;color:#7c8798">' +
        (okN === d.qids.length ? '全部做对，可以打卡了' : '还有 ' + (d.qids.length - okN) + ' 题没做对，做完就能打卡') + '</span>';
    }
    h += '<span style="flex:1"></span>' +
      '<button class="btn btn-ghost btn-sm" id="btn-replan">换一组题</button></div></div>';

    h += '<div id="qlist">' + d.qids.map((id, i) => {
      const q = App.ix.KMAP[id];
      if (!q) return '';
      return App.qCardHtml(q, i, { src: 'daily', daily: true, onChange: refresh });
    }).join('') + '</div>';

    view.innerHTML = h;

    d.qids.forEach((id, i) => {
      const q = App.ix.KMAP[id];
      const card = view.querySelector('[data-qid="' + id + '"]');
      if (card && q) App.bindQuestion(card, q, { src: 'daily', daily: true, onChange: refresh });
    });
    App.bindCodeBoxes(view);

    const ck = view.querySelector('#btn-checkin');
    if (ck) ck.addEventListener('click', doCheckin);
    const rp = view.querySelector('#btn-replan');
    if (rp) rp.addEventListener('click', () => {
      if (checked) { App.toast('今天已经打卡，明天再换题吧'); return; }
      UI.modal('<h3 style="margin:0 0 6px;font-size:16px">换一组打卡题？</h3>' +
        '<p style="margin:0 0 16px;font-size:13px;color:#4b5768">会从同一范围内重新抽题，当前作答记录清空，但不会影响章节测试。</p>' +
        '<div class="modal-actions"><button class="btn btn-ghost" data-close="1">取消</button>' +
        '<button class="btn btn-primary" id="m-ok">重新抽题</button></div>').querySelector('#m-ok')
        .addEventListener('click', () => {
          const stt = App.st;
          delete stt.daily[CORE.todayKey()];
          App.save();
          UI.closeModal();
          App.route();
        });
    });

    function refresh() {
      const dd = App.st.daily[CORE.todayKey()];
      const n = dd.qids.filter(id => dd.answers[id] && dd.answers[id].ok).length;
      const btn = view.querySelector('#btn-checkin');
      if (btn) {
        const ready = n === dd.qids.length;
        btn.disabled = !ready;
        btn.style.opacity = ready ? '1' : '.5';
        btn.style.cursor = ready ? 'pointer' : 'not-allowed';
        const hint = btn.nextElementSibling;
        if (hint) hint.textContent = ready ? '全部做对，可以打卡了' : '还有 ' + (dd.qids.length - n) + ' 题没做对，做完就能打卡';
      }
      App.initShell();
    }
  };

  function CoreFmt() {
    const d = new Date();
    const w = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
    return (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · 星期' + w;
  }

  function doCheckin() {
    const st = App.st, date = CORE.todayKey();
    const d = st.daily[date];
    const okAll = d && d.qids.every(id => d.answers[id] && d.answers[id].ok);
    if (!okAll) { App.toast('还有题没做对，再检查一下', 'bad'); return; }
    const rec = st.days[date] || (st.days[date] = { checkin: false, lessons: 0, solved: 0 });
    rec.checkin = true;
    rec.checkinAt = new Date().toISOString();
    d.checked = true;
    App.save();
    const s = CORE.streak(st);
    UI.modal('<div style="text-align:center;padding:8px 4px 0">' +
      '<div style="font-size:42px;line-height:1">🔥</div>' +
      '<h3 style="margin:12px 0 6px;font-size:19px">打卡成功！连续第 ' + s + ' 天</h3>' +
      '<p style="margin:0 0 18px;font-size:13px;color:#4b5768;line-height:1.8">' +
      '今天做对 ' + d.qids.length + ' 道打卡题，读了 ' + (rec.lessons || 0) + ' 课。<br>' +
      '明天同一时间再来，别断档——连续天数比一次学很多更重要。</p>' +
      '<div class="modal-actions" style="justify-content:center"><button class="btn btn-primary" data-close="1">好，收工</button></div></div>',
      { width: 400 });
    App.initShell();
    setTimeout(() => App.route(), 60);
  }

  /* ================= 学习计划 ================= */
  App.renderPlan = function () {
    const view = document.getElementById('view');
    const st = App.st, L = App.L;
    const plan = st.plan;
    if (!plan) { view.innerHTML = '<div class="empty">还没有计划</div>'; return; }
    const todayN = App.planDayIdx();
    const doneLessons = CORE.doneCount(L, st);

    let h = '';
    h += '<div class="page-head"><div>' +
      '<h1 style="margin:0 0 8px">🗺️ 我的 ' + plan.days + ' 天 ' + esc(L.name) + ' 计划</h1>' +
      '<p class="page-desc">开始日期 ' + esc(st.startDate || App.S.profile.startDate) + ' · 今天是第 ' + todayN + ' 天 · ' +
      '已完成 ' + doneLessons + '/' + App.ix.ALL.length + ' 课</p></div>' +
      '<div style="display:flex;gap:8px"><button class="btn btn-ghost btn-sm" id="btn-replan-day">重新规划天数</button></div></div>';

    h += '<div class="card card-pad" style="margin-bottom:16px"><div class="plan-toolbar">' +
      '<span class="tag tag-blue">学习日 ' + plan.learnDays + '</span>' +
      '<span class="tag tag-yellow">复习日 ' + plan.plan.filter(x => x.type === 'review').length + '</span>' +
      '<span class="tag tag-purple">冲刺日 ' + plan.plan.filter(x => x.type === 'sprint').length + '</span>' +
      '<span style="flex:1"></span>' +
      '<div class="bar" style="width:180px"><i style="width:' + Math.round(doneLessons / App.ix.ALL.length * 100) + '%"></i></div>' +
      '<span style="font-size:12px;color:#7c8798">' + Math.round(doneLessons / App.ix.ALL.length * 100) + '%</span></div></div>';

    h += '<div class="card card-pad">';
    plan.plan.forEach(day => {
      const isToday = day.n === todayN;
      const isDone = day.type === 'learn'
        ? day.lessons.every(l => st.done[l.id])
        : (st.days[CORE.addDays(st.startDate, day.n - 1)] && st.days[CORE.addDays(st.startDate, day.n - 1)].checkin);
      const badge = { learn: '学习日', review: '复习日', sprint: '冲刺日' }[day.type] || '学习';
      h += '<div class="day-line' + (isToday ? ' today' : '') + (isDone ? ' done' : '') + '">' +
        '<div class="dl-n">' + (isDone && !isToday ? '✓' : day.n) + '</div>' +
        '<div><div class="dl-title"><span class="dl-badge ' + day.type + '">' + badge + '</span>' +
        (isToday ? '<span class="tag tag-blue" style="font-size:10px">今天</span>' : '') +
        esc(day.title) + '</div>' +
        '<div class="dl-desc">' + esc(day.desc) + '</div>';
      if (day.lessons.length) {
        h += '<div class="dl-lessons">' + day.lessons.map(l =>
          '<span class="dl-lesson' + (st.done[l.id] ? ' ok' : '') + '" data-go="#/lesson/' + l.id + '">' +
          (st.done[l.id] ? '✓ ' : '') + esc(l.title) + '</span>').join('') + '</div>';
      } else {
        h += '<div class="dl-lessons"><span class="dl-lesson" data-go="#/practice/' + (day.chIds[0] || '') + '">本章测试</span>' +
          '<span class="dl-lesson" data-go="#/daily">今日打卡</span>' +
          '<span class="dl-lesson" data-go="#/wrong">错题本</span></div>';
      }
      h += '</div></div>';
    });
    h += '</div>';

    view.innerHTML = h;
    view.querySelectorAll('[data-go]').forEach(el => {
      el.addEventListener('click', () => App.go(el.getAttribute('data-go')));
    });
    view.querySelector('#btn-replan-day').onclick = () => App.openReplan();
  };

  App.openReplan = function () {
    const L = App.L;
    const cur = App.st.planDays || App.S.profile.days;
    const opts = [7, 14, 21, 30, 42, 60].map(d => {
      const p = CORE.buildPlan(L, d);
      const learn = p.plan.filter(x => x.type === 'learn').length;
      return { d: p.days, per: Math.ceil(App.ix.ALL.length / learn), extra: p.days - learn };
    });
    const uniq = [];
    opts.forEach(o => { if (!uniq.some(x => x.d === o.d)) uniq.push(o); });

    const m = UI.modal('<h3 style="margin:0 0 6px;font-size:16px">重新规划天数</h3>' +
      '<p style="margin:0 0 14px;font-size:12.5px;color:#7c8798">已读课时和做题记录都会保留，只是把剩下的内容重新排期。今天会按新计划的第 1 天算。</p>' +
      '<div class="day-grid">' + uniq.map(o =>
        '<button class="day-card' + (o.d === cur ? ' on' : '') + '" data-d="' + o.d + '"><b>' + o.d + '</b><span>天</span>' +
        '<em>每天 ' + o.per + ' 课' + (o.extra > 0 ? ' + ' + o.extra + ' 天复盘' : '') + '</em></button>').join('') +
      '</div><div class="modal-actions"><button class="btn btn-ghost" data-close="1">取消</button></div>',
      { width: 620 });

    m.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => {
      const d = +b.getAttribute('data-d');
      const st = App.st;
      st.planDays = d;
      st.startDate = CORE.todayKey();
      st.plan = CORE.buildPlan(App.L, d);
      App.S.profile.days = d;
      App.S.profile.startDate = st.startDate;
      App.save();
      UI.closeModal();
      App.toast('已重排为 ' + d + ' 天计划', 'ok');
      App.route();
      App.initShell();
    }));
  };

  /* ================= 打卡记录 ================= */
  App.renderCalendar = function () {
    const view = document.getElementById('view');
    const st = App.st, L = App.L;
    const days = Object.keys(st.days).filter(k => st.days[k].checkin).sort().reverse();
    const totalLessons = Object.keys(st.done).length;
    const totalSolved = Object.keys(st.solved).length;

    let h = '';
    h += '<div class="page-head"><div><h1 style="margin:0 0 8px">🔥 打卡记录</h1>' +
      '<p class="page-desc">每天完成打卡题的记录。颜色越深，说明那天读的课和做的题越多。</p></div></div>';

    h += '<div class="stat-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:16px">' +
      [['连续打卡', CORE.streak(st) + ' 天'], ['累计打卡', days.length + ' 天'],
       ['已读课时', totalLessons + ' / ' + App.ix.ALL.length], ['做对的题', totalSolved + ' 道']]
        .map(x => '<div class="card card-pad" style="padding:16px 18px"><div style="font-size:11.5px;color:#7c8798">' +
          x[0] + '</div><div style="font-size:21px;font-weight:800;letter-spacing:-.4px;margin-top:4px">' + x[1] + '</div></div>').join('') +
      '</div>';

    h += '<div class="card card-pad"><h4 style="margin:0 0 14px;font-size:14px">近 16 周</h4>' +
      UI.heatmap(st.days, 16) + '</div>';

    h += '<div class="card card-pad" style="margin-top:16px"><h4 style="margin:0 0 12px;font-size:14px">打卡明细</h4>';
    if (!days.length) {
      h += '<div class="empty" style="padding:16px 0">还没有打卡记录，去「每日打卡」做今天的题吧</div>';
    } else {
      h += '<div style="display:flex;flex-direction:column;gap:8px">' + days.slice(0, 30).map(k => {
        const r = st.days[k];
        const dq = st.daily[k];
        return '<div style="display:flex;gap:12px;align-items:center;padding:9px 12px;border-radius:10px;background:#fafcff;border:1px solid #eef3fa">' +
          '<span style="font-family:var(--mono);font-size:12px;color:#4b5768">' + k + '</span>' +
          '<span class="tag tag-green" style="font-size:10.5px">已打卡</span>' +
          '<span style="font-size:12px;color:#7c8798">读 ' + (r.lessons || 0) + ' 课 · 做对 ' + (r.solved || 0) + ' 题' +
          (dq ? ' · ' + dq.qids.length + ' 道打卡题' : '') + '</span></div>';
      }).join('') + '</div>';
    }
    h += '</div>';
    view.innerHTML = h;
  };

  /* ================= 代码实验室 ================= */
  App.renderLab = function () {
    const view = document.getElementById('view');
    const L = App.L;
    const samples = L.lab && L.lab.length ? L.lab : [{ name: 'Hello World', code: L.hello || 'print("Hello")' }];

    let h = '';
    h += '<div class="page-head"><div><h1 style="margin:0 0 8px">🧪 ' + esc(L.name) + ' 代码实验室</h1>' +
      '<p class="page-desc">随手写点代码验证想法。' + esc(window.Runner.caption(L.id)) +
      (L.id === 'javascript' ? '。读输入用 readline()，读整数用 readInt()。' : '') + '</p></div></div>';

    h += '<div class="card card-pad lab-col">';
    h += '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
      '<span style="font-size:12px;color:#7c8798">示例</span>' +
      samples.map((s, i) => '<button class="chip' + (i === 0 ? ' on' : '') + '" data-sample="' + i + '">' + esc(s.name) + '</button>').join('') +
      '</div>';
    h += '<div id="lab-editor"></div>';
    h += '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start">' +
      '<div style="flex:1;min-width:220px"><div style="font-size:11.5px;color:#7c8798;margin-bottom:5px">标准输入（每行一个输入，可选）</div>' +
      '<textarea class="lab-stdin" id="lab-stdin" placeholder="例如：&#10;3 5"></textarea></div></div>';
    h += '<div id="lab-result"></div></div>';

    view.innerHTML = h;

    const host = view.querySelector('#lab-editor');
    const ed = UI.mountEditor(host, {
      lang: L.id, code: samples[0].code, file: 'playground.' + UI.extOf(L.id),
      hint: window.Runner.caption(L.id),
      onRun: async code => {
        const resEl = view.querySelector('#lab-result');
        resEl.innerHTML = '<div class="runpanel"><div class="rp-head"><span class="dot"></span> 正在运行…</div><div class="rp-body">' +
          (L.id === 'javascript' ? '浏览器内执行' : '正在提交在线编译，通常 1–3 秒') + '</div></div>';
        const stdin = (view.querySelector('#lab-stdin') || {}).value || '';
        const r = await window.Runner.run(L.id, code, stdin);
        UI.renderRun(resEl, r);
      }
    });

    view.querySelectorAll('[data-sample]').forEach(b => b.addEventListener('click', () => {
      view.querySelectorAll('[data-sample]').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      ed.setValue(samples[+b.getAttribute('data-sample')].code);
    }));
  };

  /* ================= 错题本 ================= */
  App.renderWrong = function () {
    const view = document.getElementById('view');
    const st = App.st;
    const ids = Object.keys(st.wrong).filter(id => App.ix.QMAP[id] || App.ix.KMAP[id]);

    let h = '';
    h += '<div class="page-head"><div><h1 style="margin:0 0 8px">📕 错题本</h1>' +
      '<p class="page-desc">做错过的题会自动收进来，做对之后自动移出。这里既有章节测试题，也有每日打卡题。</p></div>' +
      (ids.length ? '<button class="btn btn-ghost btn-sm" id="btn-clear-wrong">清空（已掌握的会移出）</button>' : '') + '</div>';

    if (!ids.length) {
      h += '<div class="empty">错题本空空如也，继续保持 👍</div>';
      view.innerHTML = h;
      return;
    }

    h += '<div id="qlist">' + ids.map((id, i) => {
      const q = App.ix.QMAP[id] || App.ix.KMAP[id];
      return App.qCardHtml(q, i, { src: 'wrong', onChange: () => App.route() });
    }).join('') + '</div>';

    view.innerHTML = h;
    ids.forEach((id, i) => {
      const q = App.ix.QMAP[id] || App.ix.KMAP[id];
      const card = view.querySelector('[data-qid="' + id + '"]');
      if (card) App.bindQuestion(card, q, { src: 'wrong', onChange: () => App.initShell() });
    });
    App.bindCodeBoxes(view);

    const cl = view.querySelector('#btn-clear-wrong');
    if (cl) cl.addEventListener('click', () => {
      Object.keys(App.st.wrong).forEach(k => {
        if (App.st.solved[k]) delete App.st.wrong[k];
      });
      App.save();
      App.toast('已移出做对过的题');
      App.route();
    });
  };

  /* ================= 设置 / 备份 ================= */
  App.backupProgress = function () {
    const payload = {
      app: 'codecraft', version: 2, savedAt: new Date().toISOString(),
      profile: App.S.profile, langs: App.S.langs
    };
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'codecraft-backup-' + CORE.todayKey() + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      App.toast('备份文件已下载', 'ok');
    } catch (e) {
      App.toast('备份失败：' + (e && e.message ? e.message : e), 'bad');
    }
  };

  App.restoreProgress = function () {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json,application/json';
    inp.onchange = () => {
      const f = inp.files && inp.files[0];
      if (!f) return;
      const fr = new FileReader();
      fr.onload = () => {
        try {
          const obj = JSON.parse(String(fr.result));
          const data = obj && obj.langs ? obj : (obj && obj.data && obj.data.langs ? obj.data : null);
          if (!data) throw new Error('这不是 CodeCraft 的备份文件');
          if (!confirm('恢复备份会合并到当前进度（同一天取作答更多的一份），继续？')) return;
          Object.keys(data.langs || {}).forEach(id => {
            if (!window.LANGS[id]) return;
            const src = data.langs[id];
            const dst = App.langState(id);
            ['done', 'solved', 'wrong'].forEach(k => {
              Object.keys(src[k] || {}).forEach(x => { if (src[k][x]) dst[k][x] = true; });
            });
            Object.keys(src.tries || {}).forEach(x => {
              dst.tries[x] = Math.max(dst.tries[x] || 0, src.tries[x] || 0);
            });
            Object.keys(src.days || {}).forEach(k => { if (!dst.days[k]) dst.days[k] = src.days[k]; });
            Object.keys(src.daily || {}).forEach(k => {
              if (!dst.daily[k] || Object.keys((src.daily[k].answers || {})).length > Object.keys((dst.daily[k].answers || {})).length) {
                dst.daily[k] = src.daily[k];
              }
            });
            if (!dst.planDays && src.planDays) {
              dst.planDays = src.planDays;
              dst.startDate = src.startDate || CORE.todayKey();
              dst.plan = CORE.buildPlan(window.LANGS[id], dst.planDays);
            }
          });
          if (data.profile && data.profile.lang && !App.S.profile.lang) {
            App.S.profile.lang = data.profile.lang;
            App.S.profile.days = data.profile.days || 21;
            App.S.profile.startDate = data.profile.startDate || CORE.todayKey();
          }
          App.save();
          App.toast('恢复完成', 'ok');
          if (App.S.profile.lang) { App.bindLang(App.S.profile.lang); App.initShell(); }
          App.route();
        } catch (e) {
          App.toast('恢复失败：' + (e && e.message ? e.message : e), 'bad');
        }
      };
      fr.readAsText(f);
    };
    inp.click();
  };

  App.renderSettings = function () {
    const view = document.getElementById('view');
    const st = App.st, L = App.L;
    const lessons = App.ix.ALL.length;

    let h = '';
    h += '<div class="page-head"><div><h1 style="margin:0 0 8px">⚙️ 设置与备份</h1>' +
      '<p class="page-desc">学习进度保存在这台电脑的浏览器里，不会上传。换设备就用下面的备份文件搬过去。</p></div></div>';

    h += '<div class="card card-pad">';
    h += '<div class="setting-row"><div class="sr-txt"><b>正在学：' + esc(L.name) + '（' + esc(L.en) + '）</b>' +
      '<span>' + L.chapters.length + ' 章 · ' + lessons + ' 课 · 已读 ' + CORE.doneCount(L, st) + ' 课 · 做对 ' +
      Object.keys(st.solved).length + ' 题</span></div>' +
      '<button class="btn btn-ghost btn-sm" id="s-lang">切换语言</button></div>';

    h += '<div class="setting-row"><div class="sr-txt"><b>学习计划：' + (st.plan ? st.plan.days : 0) + ' 天</b>' +
      '<span>开始于 ' + esc(st.startDate || '-') + ' · 今天是第 ' + App.planDayIdx() + ' 天</span></div>' +
      '<button class="btn btn-ghost btn-sm" id="s-replan">重新规划</button></div>';

    h += '<div class="setting-row"><div class="sr-txt"><b>每日题量：' + (CORE.LEVELS[st.level] || CORE.LEVELS.normal).name + '</b>' +
      '<span>' + (CORE.LEVELS[st.level] || CORE.LEVELS.normal).desc + '</span></div>' +
      '<div class="level-switch">' + ['easy', 'normal', 'hard'].map(k =>
        '<button data-set-level="' + k + '" class="' + (st.level === k ? 'on' : '') + '">' + CORE.LEVELS[k].name + '</button>').join('') +
      '</div></div>';

    h += '<div class="setting-row"><div class="sr-txt"><b>进度备份</b>' +
      '<span>导出一个 json 文件；换浏览器或换电脑时再导入回来</span></div>' +
      '<button class="btn btn-ghost btn-sm" id="s-backup">导出备份</button>' +
      '<button class="btn btn-ghost btn-sm" id="s-restore">从文件恢复</button></div>';

    h += '<div class="setting-row"><div class="sr-txt"><b>重新选择语言与计划</b>' +
      '<span>回到首次打开的引导流程，重新选语言和天数（已有进度不会被删）</span></div>' +
      '<button class="btn btn-ghost btn-sm" id="s-onboard">重新引导</button></div>';

    h += '<div class="setting-row"><div class="sr-txt"><b class="danger">清空「' + esc(L.name) + '」的学习进度</b>' +
      '<span>只清空当前这门语言：已读记录、答题记录、打卡记录都会删掉，计划保留</span></div>' +
      '<button class="btn btn-ghost btn-sm danger" id="s-reset-lang">清空本语言</button></div>';

    h += '<div class="setting-row"><div class="sr-txt"><b class="danger">清空全部数据</b>' +
      '<span>所有语言的进度和计划一起删掉，网站回到刚打开的状态</span></div>' +
      '<button class="btn btn-ghost btn-sm danger" id="s-reset-all">全部清空</button></div>';
    h += '</div>';

    h += '<div class="callout note" style="margin-top:16px"><span class="ci">ℹ️</span><div>' +
      '<b>运行环境</b><br>JavaScript 在本机浏览器内运行，断网也能跑；Python / C / C++ / Java 走在线编译服务，需要联网。' +
      '所有代码只用于你点「运行」的那一刻，不会保存到任何服务器。</div></div>';

    view.innerHTML = h;

    view.querySelector('#s-lang').onclick = () => App.openLangPicker();
    view.querySelector('#s-replan').onclick = () => App.openReplan();
    view.querySelector('#s-backup').onclick = () => App.backupProgress();
    view.querySelector('#s-restore').onclick = () => App.restoreProgress();
    view.querySelector('#s-onboard').onclick = () => App.showOnboarding(false);
    view.querySelectorAll('[data-set-level]').forEach(b => b.onclick = () => {
      App.st.level = b.getAttribute('data-set-level');
      delete App.st.daily[CORE.todayKey()];
      App.save();
      App.initShell();
      App.route();
    });
    view.querySelector('#s-reset-lang').onclick = () => {
      if (!confirm('确定清空「' + L.name + '」的全部学习进度？此操作不可撤销。')) return;
      const keepPlan = App.st.plan, keepDays = App.st.planDays, keepStart = App.st.startDate, keepLevel = App.st.level;
      App.S.langs[App.langId] = {
        done: {}, solved: {}, tries: {}, wrong: {}, days: {}, daily: {},
        plan: keepPlan, planDays: keepDays, startDate: keepStart, level: keepLevel
      };
      App.save();
      App.bindLang(App.langId);
      App.toast('已清空本语言进度');
      App.route();
    };
    view.querySelector('#s-reset-all').onclick = () => {
      if (!confirm('确定清空全部数据？所有语言的学习进度都会丢失。')) return;
      try { localStorage.removeItem(App.KEY); } catch (e) {}
      location.hash = '';
      location.reload();
    };
  };
})();
