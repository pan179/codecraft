/* ============================================================
   CodeCraft · 每日打卡闭环测试（用 JavaScript，代码可在浏览器内跑）
   自动答完当天全部题目 → 打卡按钮解锁 → 点击打卡 → 记录落库
   ============================================================ */
const path = require('path');
const { launch } = require('./cdp');

const URL0 = 'http://127.0.0.1:8777/CodeCraft%20%E5%AD%A6%E4%B9%A0%E7%AB%99.html';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async function () {
  const { session: s, proc } = await launch(9338);
  const errs = [];
  try {
    await s.send('Page.navigate', { url: URL0 });
    await sleep(1600);
    await s.eval(`localStorage.clear(); 'ok'`);
    await s.send('Page.reload');
    await sleep(2000);

    /* 选 JavaScript + 7 天，直接开始 */
    await s.eval(`document.querySelector('[data-lang="javascript"]').click(); 'ok'`);
    await sleep(200);
    await s.eval(`document.querySelector('#ob-next').click(); 'ok'`);
    await sleep(300);
    await s.eval(`(document.querySelector('[data-days="7"]')||document.querySelector('.day-card')).click(); 'ok'`);
    await sleep(200);
    await s.eval(`document.querySelector('#ob-next').click(); 'ok'`);
    await sleep(300);
    await s.eval(`document.querySelector('#ob-start').click(); 'ok'`);
    await sleep(1000);

    /* 难度切到「轻松」，减少当天题量 */
    await s.eval(`document.querySelector('#level-switch [data-level="easy"]').click(); 'ok'`);
    await sleep(400);
    await s.eval(`location.hash = '#/daily'; 'ok'`);
    await sleep(1000);

    const plan = await s.eval(`(() => {
      const st = App.st, key = CORE.todayKey();
      const d = st.daily[key];
      const L = App.L;
      const all = L.quiz.concat(L.checkin);
      return {
        qids: d ? d.qids : [],
        qs: (d ? d.qids : []).map(id => {
          const q = all.find(x => x.id === id);
          return q ? { id: q.id, type: q.type, ans: q.ans, answer: q.answer, solution: q.solution } : null;
        })
      };
    })()`);
    console.log('今日题目:', plan.qs.map(q => q.id + '(' + q.type + ')').join(' '));
    if (plan.qs.length !== 4) errs.push('轻松难度应有 4 题，实际 ' + plan.qs.length);

    /* 逐题作答 */
    for (const q of plan.qs) {
      if (!q) continue;
      if (q.type === 'choice') {
        await s.eval(`(() => {
          const c = document.querySelector('[data-qid="${q.id}"]');
          c.querySelector('.opt[data-opt="${q.ans}"]').click();
          return 'ok';
        })()`);
        await sleep(220);
      } else if (q.type === 'output') {
        await s.eval(`(() => {
          const c = document.querySelector('[data-qid="${q.id}"]');
          const ta = c.querySelector('[data-ans]');
          ta.value = ${JSON.stringify(q.answer)};
          c.querySelector('[data-act="check"]').click();
          return 'ok';
        })()`);
        await sleep(300);
      } else {
        await s.eval(`(() => {
          const c = document.querySelector('[data-qid="${q.id}"]');
          const ta = c.querySelector('textarea');
          ta.value = ${JSON.stringify(q.solution)};
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          c.querySelector('[data-act="run"]').click();
          return 'ok';
        })()`);
        await sleep(2200);
      }
      const state = await s.eval(`(() => {
        const c = document.querySelector('[data-qid="${q.id}"]');
        return { solved: c.classList.contains('solved'), state: (c.querySelector('[data-state]')||{}).textContent || '' };
      })()`);
      console.log('  ' + q.id + ' -> ' + (state.solved ? '✓' : '✗') + ' ' + state.state.replace(/\s+/g, ' ').slice(0, 60));
      if (!state.solved) errs.push(q.id + ' 没有判定通过：' + state.state);
    }

    /* 打卡按钮是否解锁 */
    const before = await s.eval(`(() => {
      const b = document.querySelector('#btn-checkin');
      return { exists: !!b, disabled: b ? b.disabled : null, text: b ? b.textContent.trim() : '' };
    })()`);
    console.log('打卡按钮:', JSON.stringify(before));
    if (!before.exists) errs.push('没有打卡按钮');
    else if (before.disabled) errs.push('全部答对后打卡按钮仍是禁用状态');

    await s.shot(path.join(__dirname, '..', 'shots', '15-daily-solved.png'), true);

    await s.eval(`document.querySelector('#btn-checkin').click(); 'ok'`);
    await sleep(900);
    const after = await s.eval(`(() => {
      const st = App.st, key = CORE.todayKey();
      const rec = st.days[key] || {};
      return { checkin: !!rec.checkin, streak: CORE.streak(st), bar: (document.querySelector('.checkin-bar')||{}).textContent || '',
               heat: document.querySelectorAll('.hm-cell.on, .hm-day.on').length };
    })()`);
    console.log('打卡结果:', JSON.stringify(after));
    if (!after.checkin) errs.push('点击打卡后没有写入 checkin 记录');
    if (after.streak < 1) errs.push('连续打卡天数没有变成 1');

    /* 刷新后是否仍是已打卡 */
    await s.send('Page.reload');
    await sleep(2200);
    const persist = await s.eval(`(() => {
      const st = (JSON.parse(localStorage.getItem('codecraft.v2')||'{}').langs||{}).javascript || {};
      const key = Object.keys(st.days||{})[0];
      return { anyChecked: Object.keys(st.days||{}).some(k => st.days[k].checkin), days: Object.keys(st.days||{}).length };
    })()`);
    console.log('刷新后记录:', JSON.stringify(persist));
    if (!persist.anyChecked) errs.push('刷新后打卡记录丢失');

    const logs = s.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
    const exs = s.events.filter(e => e.method === 'Runtime.exceptionThrown');
    if (logs.length) errs.push('控制台错误：' + logs.slice(0, 2).map(l => l.params.entry.text).join(' | '));
    if (exs.length) errs.push('未捕获异常：' + exs.length + ' 条');
  } catch (e) {
    errs.push('测试中断：' + e.message);
  } finally {
    try { proc.kill(); } catch (e) {}
  }

  console.log('\n' + (errs.length ? '发现 ' + errs.length + ' 个问题：\n - ' + errs.join('\n - ') : '每日打卡闭环通过 ✓'));
  process.exitCode = errs.length ? 1 : 0;
  setTimeout(() => process.exit(process.exitCode), 300);
})();
