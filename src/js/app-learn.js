/* ============================================================
   CodeCraft · 学习页面：首页 / 课时 / 章节
   ============================================================ */
(function () {
  'use strict';

  const App = window.App, UI = App.UI, CORE = App.CORE, esc = UI.esc;

  /* 代码块：运行 / 复制 */
  App.bindCodeBoxes = function (root) {
    root = root || document.getElementById('view');
    root.querySelectorAll('[data-run]').forEach(btn => {
      if (btn.__bound) return;
      btn.__bound = 1;
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-run');
        const lang = btn.getAttribute('data-lang') || (App.L ? App.L.id : 'python');
        const code = UI.getCode(id);
        const out = root.querySelector('[data-out-for="' + id + '"]');
        const box = btn.closest('.codebox');
        const old = btn.textContent;
        btn.textContent = '运行中…';
        btn.disabled = true;
        if (out) { out.hidden = false; out.classList.remove('err'); out.textContent = '正在编译运行…'; }
        const r = await window.Runner.run(lang, code, '');
        btn.textContent = old;
        btn.disabled = false;
        if (!out) return;
        if (r.ok) {
          out.hidden = false;
          out.classList.remove('err');
          out.textContent = r.out || '(没有输出)';
          out.style.color = '#2b4a37';
          out.style.background = '#f6faf7';
        } else {
          out.hidden = false;
          out.classList.add('err');
          out.textContent = (r.err || '运行失败') + (r.note ? '\n— ' + r.note : '');
        }
        if (box) box.setAttribute('data-ran', '1');
      });
    });
    root.querySelectorAll('[data-copy]').forEach(btn => {
      if (btn.__bound) return;
      btn.__bound = 1;
      btn.addEventListener('click', () => {
        const code = UI.getCode(btn.getAttribute('data-copy')) || '';
        const done = () => App.toast('代码已复制', 'ok');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(done).catch(() => fallbackCopy(code, done));
        } else fallbackCopy(code, done);
      });
    });
  };

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); cb(); } catch (e) { App.toast('复制失败，请手动选中', 'bad'); }
    ta.remove();
  }

  function langHeroHtml(extra) {
    const L = App.L, st = App.st;
    const pct = CORE.overallPct(L, st);
    return '<div class="lang-hero" style="background:linear-gradient(135deg,' + L.color + ' 0%,' + shade(L.color, 18) + ' 100%)">' +
      '<h2><span>' + L.icon + '</span>' + esc(L.name) + ' · ' + esc(L.en) + '</h2>' +
      '<p>' + esc(L.blurb) + '</p>' +
      '<div class="lh-stats">' +
        '<div><b>' + pct + '%</b>总进度</div>' +
        '<div><b>' + CORE.doneCount(L, st) + '/' + App.ix.ALL.length + '</b>已读课时</div>' +
        '<div><b>' + Object.keys(st.solved).length + '</b>做对的题</div>' +
        '<div><b>' + CORE.streak(st) + '</b>连续打卡</div>' +
        (extra || '') +
      '</div></div>';
  }
  App.langHeroHtml = langHeroHtml;

  function shade(hex, amt) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#2f6be0');
    if (!m) return '#2f6be0';
    const c = [1, 2, 3].map(i => Math.min(255, parseInt(m[i], 16) + amt));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  }

  /* ---------------- 首页 ---------------- */
  App.renderHome = function () {
    const view = document.getElementById('view');
    const L = App.L, st = App.st;
    const nextL = CORE.nextLesson(L, st);
    const day = App.planDay();
    const dayIdx = App.planDayIdx();
    const today = CORE.todayKey();
    const rec = st.days[today] || {};
    const dq = st.daily[today];
    const checked = !!(rec && rec.checkin);
    const level = CORE.LEVELS[st.level] || CORE.LEVELS.normal;

    let h = '';
    h += langHeroHtml('<div><b>' + dayIdx + '/' + (st.plan ? st.plan.days : App.S.profile.days) + '</b>计划第几天</div>');

    h += '<div class="dash-grid">';

    /* 左：今日任务 */
    h += '<div class="dash-card"><h4>📌 今日任务 <span class="sp"></span>' +
      '<a href="#/plan">查看完整计划</a></h4>';
    if (day) {
      const badge = { learn: '学习日', review: '复习日', sprint: '冲刺日' }[day.type] || '学习';
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">' +
        '<span class="dl-badge ' + day.type + '">第 ' + day.n + ' 天 · ' + badge + '</span>' +
        '<span style="font-size:13.5px;font-weight:700">' + esc(day.title) + '</span></div>';
      h += '<div style="font-size:12.5px;color:#7c8798;line-height:1.7;margin-bottom:12px">' + esc(day.desc) + '</div>';

      if (day.lessons.length) {
        h += '<div class="today-list">' + day.lessons.map(l => {
          const done = !!st.done[l.id];
          return '<div class="today-item" data-go="#/lesson/' + l.id + '">' +
            '<span class="ti-ico">' + (done ? '✓' : '📖') + '</span>' +
            '<span class="ti-main"><b>' + esc(l.title) + '</b><span>' + (done ? '已读完' : '约 ' + (l.time || 10) + ' 分钟') + '</span></span>' +
            '<span style="font-size:11.5px;color:' + (done ? '#0f9d58' : '#2f6be0') + ';font-weight:700">' +
            (done ? '复习' : '开始') + ' →</span></div>';
        }).join('') + '</div>';
      } else {
        h += '<div class="today-list"><div class="today-item" data-go="#/practice/' + (day.chIds[0] || L.chapters[0].id) + '">' +
          '<span class="ti-ico">🧩</span><span class="ti-main"><b>本章综合练习</b><span>按计划今天不做新内容，专攻题目</span></span>' +
          '<span style="font-size:11.5px;color:#2f6be0;font-weight:700">去练习 →</span></div></div>';
      }
    } else {
      h += '<div class="empty" style="padding:20px 0">计划还没生成，去设置里重新规划一次</div>';
    }

    if (nextL) {
      h += '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">' +
        '<a class="btn btn-primary btn-sm" href="#/lesson/' + nextL.id + '">继续学习：' + esc(nextL.title.slice(0, 16)) + '</a>' +
        '<a class="btn btn-ghost btn-sm" href="#/lab">打开实验室</a></div>';
    }
    h += '</div>';

    /* 右：打卡 */
    h += '<div class="dash-card"><h4>🔥 今日打卡 <span class="sp"></span>' +
      '<a href="#/calendar">记录</a></h4>';
    const answered = dq ? dq.qids.filter(id => dq.answers[id] && dq.answers[id].ok).length : 0;
    const total = dq ? dq.qids.length : level.total;
    h += '<div style="display:flex;align-items:center;gap:14px;margin-bottom:6px">' +
      '<div style="position:relative;flex:none">' + UI.ring(checked ? 100 : (total ? answered / total * 100 : 0), 74, checked ? '#0f9d58' : '#2f6be0') +
      '<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:16px;font-weight:800;color:' +
      (checked ? '#0f9d58' : '#1c2431') + '">' + (checked ? '✓' : answered + '/' + total) + '</div></div>' +
      '<div style="font-size:12.5px;color:#4b5768;line-height:1.8">' +
        (checked
          ? '<b style="color:#0f9d58">今天已经打卡</b><br>连续 ' + CORE.streak(st) + ' 天，保持住'
          : '<b>' + (total - answered) + ' 题还没做完</b><br>完成后即可打卡 · ' + level.name + '模式') +
      '</div></div>';
    h += '<div style="font-size:11.5px;color:#7c8798;line-height:1.7;margin:10px 0 12px">' +
      '打卡题按你当前学到的章节出，和章节测试题完全不重复。</div>';
    h += '<a class="btn btn-primary btn-sm" href="#/daily" style="width:100%">' +
      (checked ? '看看今天的题' : '去做今日打卡 →') + '</a>';
    if (checked) {
      h += '<div style="margin-top:10px;text-align:center;font-size:12px;color:#7c8798">' +
        '今天读了 ' + (rec.lessons || 0) + ' 课，做对 ' + (rec.solved || 0) + ' 题</div>';
    }
    h += '</div>';
    h += '</div>';

    /* 章节进度 */
    h += '<div class="dash-card" style="margin-top:16px"><h4>📚 章节进度 <span class="sp"></span>' +
      '<a href="#/plan">我的计划</a></h4><div class="point-grid">' +
      L.chapters.map((c, i) => {
        const pct = CORE.chapterPct(L, st, c.id);
        return '<div class="point-card' + (pct === 100 ? ' read' : '') + '" data-go="#/ch/' + c.id + '" style="cursor:pointer">' +
          '<div class="pc-title">' + (c.icon || '📘') + ' 第 ' + (c.num != null ? c.num : i + 1) + ' 章 · ' + esc(c.title) + '</div>' +
          '<div class="pc-desc">' + c.lessons.length + ' 节课 · ' + (App.ix.CH_Q[c.id] || []).length + ' 道章节测试</div>' +
          '<div class="pc-foot"><div class="bar" style="flex:1"><i style="width:' + pct + '%"></i></div>' +
          '<span>' + pct + '%</span></div></div>';
      }).join('') + '</div></div>';

    h += '<div class="databar"><span class="db-ico">💾</span><div class="db-main">' +
      '学习进度保存在本机浏览器（localStorage）。换浏览器、清缓存会读不到，建议定期导出备份。</div>' +
      '<button class="btn btn-ghost btn-sm" id="home-backup">导出备份</button>' +
      '<button class="btn btn-ghost btn-sm" id="home-settings">设置</button></div>';

    view.innerHTML = h;

    view.querySelectorAll('[data-go]').forEach(el => {
      el.addEventListener('click', () => App.go(el.getAttribute('data-go')));
    });
    const b1 = view.querySelector('#home-backup');
    if (b1) b1.onclick = App.backupProgress;
    const b2 = view.querySelector('#home-settings');
    if (b2) b2.onclick = () => App.go('#/settings');
  };

  /* ---------------- 课时 ---------------- */
  App.renderLesson = function (l) {
    const view = document.getElementById('view');
    const L = App.L, st = App.st;
    const ch = App.ix.CH[l.ch];
    const idx = App.ix.ALL.indexOf(l);
    const prev = App.ix.ALL[idx - 1];
    const next = App.ix.ALL[idx + 1];
    const done = !!st.done[l.id];

    let h = '';
    h += '<div class="crumb"><a href="#/home">总览</a> / <a href="#/ch/' + l.ch + '">' + esc(l.chTitle) + '</a> / <span>' + esc(l.title) + '</span></div>';
    h += '<div class="page-head"><div><h1 style="margin:0 0 8px">' + esc(l.title) + '</h1>' +
      '<div class="chips">' +
      '<span class="tag tag-blue">' + esc(L.name) + '</span>' +
      '<span class="tag tag-gray">约 ' + (l.time || 10) + ' 分钟</span>' +
      (l.key ? '<span class="tag tag-purple">' + esc(l.key) + '</span>' : '') +
      (done ? '<span class="tag tag-green">✓ 已读完</span>' : '') +
      '</div></div></div>';

    h += '<div class="card card-pad" style="margin-top:16px"><div class="lesson-body">' +
      UI.blocksHtml(l.blocks, L.id) + '</div>';

    h += '<div class="lesson-nav">';
    h += prev
      ? '<a class="btn btn-ghost" href="#/lesson/' + prev.id + '"><small>← 上一课</small>' + esc(prev.title) + '</a>'
      : '<span style="flex:1"></span>';
    h += next
      ? '<a class="btn btn-primary next" href="#/lesson/' + next.id + '"><small>' + (done ? '下一课 →' : '我学完了，下一课 →') + '</small>' + esc(next.title) + '</a>'
      : '<a class="btn btn-primary next" href="#/practice/' + l.ch + '"><small>全部课时读完了 →</small>去做本章测试</a>';
    h += '</div></div>';

    h += '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">' +
      '<button class="btn ' + (done ? 'btn-ghost' : 'btn-ok') + '" id="mark-done">' +
      (done ? '✓ 已标记学完（点击取消）' : '✓ 我学完了这一课') + '</button>' +
      '<a class="btn btn-ghost" href="#/practice/' + l.ch + '">做本章测试（' + (App.ix.CH_Q[l.ch] || []).length + ' 题）</a>' +
      '<a class="btn btn-ghost" href="#/lab">在实验室里试试</a></div>';

    view.innerHTML = h;

    App.bindCodeBoxes(view);
    const btn = view.querySelector('#mark-done');
    if (btn) btn.addEventListener('click', () => {
      if (st.done[l.id]) {
        delete st.done[l.id];
        App.toast('已取消标记');
      } else {
        st.done[l.id] = true;
        st.doneAt = st.doneAt || {};
        st.doneAt[l.id] = CORE.todayKey();
        App.touchDay('lessons', 1);
        App.toast('这一课拿下了 ✓ 进度已保存', 'ok');
      }
      App.save();
      App.route();
    });
  };

  /* ---------------- 章节 ---------------- */
  App.renderChapter = function (c) {
    const view = document.getElementById('view');
    const L = App.L, st = App.st;
    const pct = CORE.chapterPct(L, st, c.id);
    const qs = App.ix.CH_Q[c.id] || [];

    let h = '';
    h += '<div class="crumb"><a href="#/home">总览</a> / <span>' + esc(c.title) + '</span></div>';
    h += '<div class="page-head"><div>' +
      '<div style="font-size:12px;color:#7c8798;font-weight:700;letter-spacing:.5px">第 ' + (c.num != null ? c.num : c.idx + 1) + ' 章</div>' +
      '<h1 style="margin:4px 0 10px">' + (c.icon || '📘') + ' ' + esc(c.title) + '</h1>' +
      '<p class="page-desc" style="max-width:720px">' + esc(c.intro || '') + '</p></div>' +
      '<div style="display:flex;gap:12px;align-items:center">' +
      '<div style="position:relative">' + UI.ring(pct, 76, pct === 100 ? '#0f9d58' : '#2f6be0') +
      '<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:15px;font-weight:800">' + pct + '%</div></div></div></div>';

    if (c.goals && c.goals.length) {
      h += '<div class="callout principle" style="margin-top:6px"><span class="ci">🎯</span><div>' +
        '<b>学完这一章，你应该能：</b><ul style="margin:6px 0 0;padding-left:20px">' +
        c.goals.map(g => '<li>' + esc(g) + '</li>').join('') + '</ul></div></div>';
    }

    h += '<div class="point-grid" style="margin-top:16px">' + c.lessons.map((l, i) => {
      const done = !!st.done[l.id];
      return '<div class="point-card' + (done ? ' read' : '') + '" data-go="#/lesson/' + l.id + '" style="cursor:pointer">' +
        '<div class="pc-title">' + (done ? '✅' : '📄') + ' ' + (i + 1) + '. ' + esc(l.title) + '</div>' +
        '<div class="pc-desc">' + esc(l.key || '') + '</div>' +
        '<div class="pc-foot"><span>约 ' + (l.time || 10) + ' 分钟</span><span class="sp" style="flex:1"></span>' +
        '<span style="color:' + (done ? '#0f9d58' : '#2f6be0') + ';font-weight:700">' + (done ? '重读' : '开始') + ' →</span></div></div>';
    }).join('') + '</div>';

    h += '<div class="dash-card" style="margin-top:18px"><h4>🧩 本章测试 <span class="sp"></span>' +
      '<span style="font-size:11.5px;color:#7c8798">共 ' + qs.length + ' 题 · 与打卡题不重复</span></h4>' +
      '<div style="font-size:12.5px;color:#7c8798;line-height:1.8;margin-bottom:12px">' +
      '学完讲解后做一遍，检验自己是真的懂了还是只是看懂了。做错的题会自动进错题本。</div>' +
      '<a class="btn btn-primary btn-sm" href="#/practice/' + c.id + '">开始本章测试 →</a></div>';

    view.innerHTML = h;
    view.querySelectorAll('[data-go]').forEach(el => {
      el.addEventListener('click', () => App.go(el.getAttribute('data-go')));
    });
  };
})();
