/* ============================================================
   CodeCraft · 题目引擎（选择 / 输出预测 / 编程题）
   ============================================================ */
(function () {
  'use strict';

  const App = window.App, UI = App.UI, CORE = App.CORE, esc = UI.esc;
  const DIFF = { 1: '基础', 2: '进阶', 3: '挑战' };
  const TYPE = { choice: '单选题', output: '输出预测', code: '编程题' };

  /* ---------------- 记录 ---------------- */
  App.record = function (q, ok, ctx) {
    const st = App.st;
    st.tries[q.id] = (st.tries[q.id] || 0) + 1;
    if (ok) {
      if (!st.solved[q.id]) {
        st.solved[q.id] = true;
        if (!ctx || !ctx.silent) App.touchDay('solved', 1);
      }
      delete st.wrong[q.id];
    } else {
      if (!st.solved[q.id]) st.wrong[q.id] = true;
    }
    if (ctx && ctx.daily) {
      const day = st.daily[CORE.todayKey()];
      if (day) {
        const a = day.answers[q.id] || { tries: 0, ok: false };
        a.tries++;
        a.ok = a.ok || !!ok;
        day.answers[q.id] = a;
      }
    }
    App.save();
  };

  /* ---------------- 卡片 HTML ---------------- */
  function qCardHtml(q, i, ctx) {
    const st = App.st;
    const solved = !!st.solved[q.id];
    const tries = st.tries[q.id] || 0;
    const srcLabel = ctx && ctx.src === 'daily' ? '每日打卡' : (ctx && ctx.src === 'wrong' ? '错题重做' : '章节测试');

    let h = '<div class="qcard' + (solved ? ' solved' : '') + '" data-qid="' + q.id + '">';
    h += '<div class="q-head"><span class="q-idx">' + (i + 1) + '</span>' +
      '<span class="tag tag-blue">' + (TYPE[q.type] || '题') + '</span>' +
      '<span class="tag ' + (q.diff >= 3 ? 'tag-red' : q.diff === 2 ? 'tag-yellow' : 'tag-gray') + '">' +
      (DIFF[q.diff] || '基础') + '</span>' +
      (q.point ? '<span class="tag tag-purple">' + esc(q.point) + '</span>' : '') +
      '<span class="q-src">' + srcLabel + '</span><span style="flex:1"></span>' +
      (solved ? '<span class="tag tag-green">✓ 已做对</span>' :
        (tries ? '<span class="tag tag-red">错了 ' + tries + ' 次</span>' : '')) +
      '</div>';

    if (q.scene) h += '<div class="scene"><b>场景</b>　' + UI.inline(q.scene) + '</div>';
    h += '<div class="q-prompt">' + UI.inline(q.prompt) + '</div>';
    if (q.code) h += UI.codeBox(q.code, { lang: App.L.id, run: false, label: App.L.name });

    if (q.type === 'choice') {
      h += '<div class="opts">' + q.opts.map((o, oi) =>
        '<div class="opt" data-opt="' + oi + '"><span class="k">' + String.fromCharCode(65 + oi) + '</span>' +
        '<span>' + UI.inline(o) + '</span></div>').join('') + '</div>';
    } else if (q.type === 'output') {
      h += '<div style="margin:12px 0"><div style="font-size:12px;color:#7c8798;margin-bottom:6px">写下你预计的输出（多行就用回车换行）</div>' +
        '<textarea class="lab-stdin" data-ans rows="3" placeholder="按程序实际打印的内容逐行写"></textarea></div>';
    } else {
      h += '<div data-editor></div>';
    }

    h += '<div class="q-actions">';
    if (q.type !== 'code') h += '<button class="btn btn-primary btn-sm" data-act="check">检查答案</button>';
    else h += '<div style="font-size:12px;color:#7c8798">在编辑器里写代码，点「运行测试」自动比对用例。</div>';
    h += '<button class="btn btn-ghost btn-sm" data-act="explain">看解析</button>';
    if (q.type === 'code' || q.type === 'output') {
      if (q.solution) h += '<button class="btn btn-ghost btn-sm" data-act="solution">参考答案</button>';
    }
    h += '<span class="sp" style="flex:1"></span><span data-state style="font-size:12px;color:#7c8798"></span></div>';
    h += '<div class="q-expl" hidden>' + UI.inline(q.explain || '') + '</div>';
    if (q.solution) h += '<div data-sol hidden style="margin-top:10px"></div>';
    h += '</div>';
    return h;
  }
  App.qCardHtml = qCardHtml;

  /* ---------------- 绑定 ---------------- */
  function bindQuestion(card, q, ctx) {
    const st = App.st;
    const stateEl = card.querySelector('[data-state]');
    const expl = card.querySelector('.q-expl');
    const say = (t, color) => { if (stateEl) { stateEl.textContent = t; stateEl.style.color = color || '#7c8798'; } };

    function markSolved() {
      card.classList.add('solved');
      App.record(q, true, ctx);
      say('✓ 正确', '#0f9d58');
      if (expl) expl.hidden = false;
      if (ctx && ctx.onChange) ctx.onChange();
    }
    function markWrong(msg) {
      App.record(q, false, ctx);
      say(msg || '✕ 再想想', '#e04a4a');
      if (expl) expl.hidden = false;
      if (ctx && ctx.onChange) ctx.onChange();
    }

    const exBtn = card.querySelector('[data-act="explain"]');
    if (exBtn) exBtn.addEventListener('click', () => {
      expl.hidden = !expl.hidden;
      exBtn.textContent = expl.hidden ? '看解析' : '收起解析';
    });

    const solBtn = card.querySelector('[data-act="solution"]');
    if (solBtn) solBtn.addEventListener('click', () => {
      const box = card.querySelector('[data-sol]');
      box.hidden = !box.hidden;
      if (!box.innerHTML) {
        box.innerHTML = UI.codeBox(q.solution, { lang: App.L.id, run: true, label: '参考实现' }) +
          (q.solutionNote ? '<div style="font-size:12.5px;color:#7c8798;margin-top:6px">' + UI.inline(q.solutionNote) + '</div>' : '');
        App.bindCodeBoxes(card);
      }
    });

    /* --- 选择题 --- */
    if (q.type === 'choice') {
      const opts = card.querySelectorAll('.opt');
      opts.forEach(op => op.addEventListener('click', () => {
        if (card.classList.contains('solved')) return;
        const pick = +op.getAttribute('data-opt');
        opts.forEach(o => o.classList.remove('sel'));
        op.classList.add('sel');
        opts.forEach(o => o.classList.remove('right', 'wrong'));
        if (pick === q.ans) {
          op.classList.add('right');
          markSolved();
        } else {
          op.classList.add('wrong');
          opts[q.ans].classList.add('right');
          markWrong('✕ 选错了，正确答案是 ' + String.fromCharCode(65 + q.ans));
        }
      }));
      return;
    }

    /* --- 输出预测 --- */
    if (q.type === 'output') {
      const ta = card.querySelector('[data-ans]');
      const btn = card.querySelector('[data-act="check"]');
      if (q.answer && btn) btn.addEventListener('click', () => {
        if (card.classList.contains('solved')) return;
        const got = ta.value;
        if (!got.trim()) { say('先写点什么', '#b7791f'); return; }
        if (CORE.sameOut(got, q.answer)) {
          markSolved();
        } else {
          const hint = UI.diffHint(got, q.answer);
          markWrong('✕ 不对：' + hint.replace(/<[^>]+>/g, '').slice(0, 60));
          if (expl) expl.hidden = false;
        }
      });
      return;
    }

    /* --- 编程题 --- */
    if (q.type === 'code') {
      const host = card.querySelector('[data-editor]');
      const tests = q.tests || [];
      let ed;
      ed = UI.mountEditor(host, {
        lang: App.L.id,
        code: st.codeDraft && st.codeDraft[q.id] ? st.codeDraft[q.id] : (q.starter || ''),
        file: 'main.' + UI.extOf(App.L.id),
        hint: tests.length ? tests.length + ' 个测试用例' : '自由练习',
        onRun: code => runTests(code)
      });

      function saveDraft(code) {
        st.codeDraft = st.codeDraft || {};
        st.codeDraft[q.id] = code;
        App.save();
      }

      async function runTests(code) {
        saveDraft(code);
        const resEl = host.querySelector('[data-result]') || (function () {
          const d = document.createElement('div');
          d.setAttribute('data-result', '1');
          host.appendChild(d);
          return d;
        })();
        const btn = host.querySelector('[data-act="run"]');
        if (btn) { btn.disabled = true; btn.textContent = '运行中…'; }

        if (!tests.length) {
          const r = await window.Runner.run(App.L.id, code, '');
          UI.renderRun(resEl, r);
          say(r.ok ? '已运行，自己对照输出' : '运行失败', r.ok ? '#0f9d58' : '#e04a4a');
          if (btn) { btn.disabled = false; btn.textContent = '▶ 运行'; }
          return;
        }

        const rows = [];
        for (let i = 0; i < tests.length; i++) {
          const t = tests[i];
          say('正在跑第 ' + (i + 1) + '/' + tests.length + ' 个用例…');
          let r;
          try { r = await window.Runner.run(App.L.id, code, t.in || ''); }
          catch (e) { r = { ok: false, out: '', err: String(e), phase: 'error', note: '' }; }
          const pass = r.ok && CORE.sameOut(r.out, t.out);
          rows.push({ t: t, r: r, pass: pass });
          if (!r.ok) break;
        }

        const allPass = rows.length === tests.length && rows.every(x => x.pass);
        let html = '<div class="runpanel ' + (allPass ? 'ok' : 'bad') + '"><div class="rp-head">' +
          (allPass ? '✓ 全部用例通过' : '✕ 还有用例没通过') +
          '<span style="margin-left:auto;font-weight:500;font-size:11.5px;opacity:.8">' +
          (rows[0] && rows[0].r.note ? esc(rows[0].r.note) : '') + '</span></div><div class="rp-body">';
        html += '<div class="tests">';
        rows.forEach((x, i) => {
          html += '<div class="test-row" style="display:flex;gap:8px;align-items:flex-start;padding:6px 0;border-bottom:1px dashed #eef2f8;font-size:12.5px">' +
            '<span style="color:' + (x.pass ? '#0f9d58' : '#e04a4a') + ';font-weight:800">' + (x.pass ? '✓' : '✕') + '</span>' +
            '<div style="flex:1"><div style="color:#4b5768">用例 ' + (i + 1) +
            (x.t.in ? ' · 输入 <code>' + esc(x.t.in) + '</code>' : ' · 无输入') + '</div>' +
            '<div style="color:#7c8798;margin-top:2px">期望 <code>' + esc(x.t.out) + '</code></div>' +
            (!x.pass ? '<div style="color:#e04a4a;margin-top:2px">实际 <code>' +
              esc(x.r.ok ? (x.r.out || '(无输出)') : (x.r.err || '运行失败')) + '</code></div>' : '') +
            '</div></div>';
        });
        html += '</div>';
        if (!allPass && rows.some(x => x.r.phase === 'compile')) {
          const cerr = rows.find(x => x.r.phase === 'compile');
          html += '<pre style="margin-top:10px;background:#fdf4f4;color:#a83232;border-radius:8px;padding:10px;white-space:pre-wrap">' +
            esc(cerr.r.err) + '</pre>';
        }
        html += '</div></div>';
        resEl.innerHTML = html;
        if (btn) { btn.disabled = false; btn.textContent = '▶ 运行测试'; }

        if (allPass) {
          if (!card.classList.contains('solved')) markSolved();
          say('✓ 全部通过', '#0f9d58');
        } else {
          markWrong('✕ ' + rows.filter(x => x.pass).length + '/' + tests.length + ' 通过');
        }
      }
      return;
    }
  }
  App.bindQuestion = bindQuestion;

  /* ---------------- 章节测试 ---------------- */
  App.renderPractice = function (c) {
    const view = document.getElementById('view');
    const st = App.st;
    const qs = (App.ix.CH_Q[c.id] || []).slice();
    const solvedN = qs.filter(q => st.solved[q.id]).length;

    let h = '';
    h += '<div class="crumb"><a href="#/home">总览</a> / <a href="#/ch/' + c.id + '">' + esc(c.title) + '</a> / <span>本章测试</span></div>';
    h += '<div class="page-head"><div>' +
      '<h1 style="margin:0 0 8px">🧩 ' + esc(c.title) + ' · 章节测试</h1>' +
      '<p class="page-desc">' + qs.length + ' 道题，覆盖本章全部知识点。做错的题自动进入错题本；这里的题和「每日打卡」的题是两套不同的题库，不会重复。</p>' +
      '</div><div style="text-align:right"><div style="font-size:26px;font-weight:800;letter-spacing:-.5px">' +
      solvedN + '<span style="font-size:14px;color:#7c8798;font-weight:600"> / ' + qs.length + '</span></div>' +
      '<div style="font-size:11.5px;color:#7c8798">已做对</div></div></div>';

    if (!qs.length) {
      h += '<div class="empty">这一章暂时没有配置测试题</div>';
      view.innerHTML = h;
      return;
    }

    h += '<div class="card card-pad" style="margin-top:8px"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
      '<div class="bar" style="flex:1;min-width:120px"><i style="width:' + Math.round(solvedN / qs.length * 100) + '%"></i></div>' +
      '<span style="font-size:12.5px;color:#7c8798">' + Math.round(solvedN / qs.length * 100) + '%</span>' +
      '<a class="btn btn-ghost btn-sm" href="#/lesson/' + (c.lessons[0] ? c.lessons[0].id : '') + '">回读本章第一课</a></div></div>';

    h += '<div style="margin-top:16px" id="qlist">' +
      qs.map((q, i) => qCardHtml(q, i, { src: 'quiz', onChange: refresh })).join('') + '</div>';

    view.innerHTML = h;
    qs.forEach(q => {
      const card = view.querySelector('[data-qid="' + q.id + '"]');
      if (card) bindQuestion(card, q, { src: 'quiz', onChange: refresh });
    });
    App.bindCodeBoxes(view);

    function refresh() {
      const n = qs.filter(x => App.st.solved[x.id]).length;
      const bar = view.querySelector('.bar i');
      if (bar) bar.style.width = Math.round(n / qs.length * 100) + '%';
      App.initShell();
    }
  };
})();
