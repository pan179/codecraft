/* ============================================================
   CodeCraft · 端到端流程测试（真实浏览器）
   首次引导 → 选语言 → 选天数 → 计划 → 首页 → 课时 → 打卡
   → 计划页 → 打卡记录 → 实验室 → 刷新后进度是否保留
   ============================================================ */
const path = require('path');
const { launch } = require('./cdp');

const URL0 = process.argv[2] || 'http://127.0.0.1:8777/CodeCraft%20%E5%AD%A6%E4%B9%A0%E7%AB%99.html';
const SHOTS = path.join(__dirname, '..', 'shots');
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async function () {
  const { session: s, proc } = await launch(9333);
  const errs = [];

  try {
    await s.send('Page.navigate', { url: URL0 });
    await sleep(1800);
    /* 每次测试从干净状态开始，否则会直接进首页 */
    await s.eval(`localStorage.clear(); 'ok'`);
    await s.send('Page.reload', { ignoreCache: true });
    await sleep(2200);

    /* ---------- 1. 首屏引导 ---------- */
    const ob = await s.eval(`(() => ({
      hasWrap: !!document.querySelector('.ob-wrap'),
      title: (document.querySelector('.ob-title') || {}).textContent || '',
      cards: [...document.querySelectorAll('.lang-card')].map(b => b.getAttribute('data-lang')),
      step: document.querySelectorAll('.ob-step').length
    }))()`);
    console.log('引导页:', JSON.stringify(ob));
    if (!ob.hasWrap) errs.push('首屏没有出现引导页');
    if (ob.cards.length !== 5) errs.push('语言卡片数量不是 5：' + ob.cards.join(','));
    await s.shot(path.join(SHOTS, '01-ob-lang.png'));

    /* ---------- 2. 选 C ---------- */
    await s.eval(`document.querySelector('[data-lang="c"]').click(); 'ok'`);
    await sleep(250);
    await s.eval(`document.querySelector('#ob-next').click(); 'ok'`);
    await sleep(350);
    const days = await s.eval(`(() => ({
      cards: [...document.querySelectorAll('.day-card')].map(b => +b.getAttribute('data-days')),
      title: (document.querySelector('.ob-title') || {}).textContent || ''
    }))()`);
    console.log('天数页:', JSON.stringify(days));
    if (!days.cards.length) errs.push('天数选项没有渲染');
    await s.shot(path.join(SHOTS, '02-ob-days.png'));

    /* ---------- 3. 选 21 天 → 计划预览 ---------- */
    await s.eval(`(document.querySelector('[data-days="21"]')||document.querySelector('.day-card')).click(); 'ok'`);
    await sleep(200);
    await s.eval(`document.querySelector('#ob-next').click(); 'ok'`);
    await sleep(350);
    const summary = await s.eval(`(() => ({
      title: (document.querySelector('.ob-title')||{}).textContent || '',
      nums: [...document.querySelectorAll('.ob-summary b')].map(b => b.textContent)
    }))()`);
    console.log('计划预览:', JSON.stringify(summary));
    if (!summary.nums.length) errs.push('计划预览没有数据');
    await s.shot(path.join(SHOTS, '03-ob-plan.png'));

    /* ---------- 4. 开始学习 → 首页 ---------- */
    await s.eval(`document.querySelector('#ob-start').click(); 'ok'`);
    await sleep(900);
    const home = await s.eval(`(() => ({
      hash: location.hash,
      navCount: document.querySelectorAll('.nav-link').length,
      chapterCount: document.querySelectorAll('.ch-head').length,
      hasHero: !!document.querySelector('.lang-hero'),
      langName: (document.getElementById('lang-name')||{}).textContent,
      viewLen: document.getElementById('view').innerHTML.length,
      mp: (document.getElementById('mp-text')||{}).textContent
    }))()`);
    console.log('首页:', JSON.stringify(home));
    if (home.hash !== '#/home') errs.push('开始学习后没有跳到首页：' + home.hash);
    if (home.chapterCount !== 6) errs.push('C 语言章节数不是 6：' + home.chapterCount);
    if (home.langName !== 'C') errs.push('顶栏语言没有切换成 C：' + home.langName);
    if (home.viewLen < 500) errs.push('首页内容过少');
    await s.shot(path.join(SHOTS, '04-home.png'), true);

    /* ---------- 5. 打开第一课 ---------- */
    await s.eval(`location.hash = '#/lesson/c1l1'; 'ok'`);
    await sleep(700);
    const lesson = await s.eval(`(() => ({
      h1: (document.querySelector('.view h1, .lesson-head h1, h1')||{}).textContent || '',
      codeBlocks: document.querySelectorAll('.codebox').length,
      runBtns: document.querySelectorAll('[data-run]').length,
      hasNext: !!document.querySelector('[data-next], .lesson-nav')
    }))()`);
    console.log('课时页:', JSON.stringify(lesson));
    if (!lesson.codeBlocks) errs.push('课时页没有代码块');
    await s.shot(path.join(SHOTS, '05-lesson.png'), true);

    /* ---------- 6. 标记已读，检查进度 ---------- */
    await s.eval(`document.querySelector('#mark-done').click(); 'ok'`);
    await sleep(700);
    const marked = await s.eval(`(() => ({
      done: (document.querySelector('#mark-done')||{}).textContent.trim(),
      mp: (document.getElementById('mp-text')||{}).textContent,
      sub: (document.getElementById('mp-sub')||{}).textContent,
      sidebarTick: document.querySelectorAll('.ch-lesson.read').length,
      stored: (JSON.parse(localStorage.getItem('codecraft.v2')||'{}').langs||{}).c ? Object.keys(JSON.parse(localStorage.getItem('codecraft.v2')).langs.c.done).length : -1
    }))()`);
    console.log('标记已读:', JSON.stringify(marked));
    if (marked.stored !== 1) errs.push('已读进度没有写入 localStorage：' + marked.stored);
    if (marked.sidebarTick !== 1) errs.push('侧边栏没有显示已读勾选');

    /* ---------- 7. 每日打卡 ---------- */
    await s.eval(`location.hash = '#/daily'; 'ok'`);
    await sleep(900);
    const daily = await s.eval(`(() => ({
      hasQ: !!document.querySelector('.qcard, .q-card, [data-qid]'),
      textLen: document.getElementById('view').innerHTML.length,
      level: (document.querySelector('#level-switch .on')||{}).textContent
    }))()`);
    console.log('打卡页:', JSON.stringify(daily));
    if (!daily.hasQ) errs.push('打卡页没有渲染题目');

    /* 答一道选择题（选择题点选项即判定），看有没有反馈 */
    const answered = await s.eval(`(() => {
      const cards = [...document.querySelectorAll('.qcard')];
      for (let i = 0; i < cards.length; i++) {
        const opt = cards[i].querySelector('.opt');
        if (!opt) continue;
        opt.click();
        return { idx: i, text: (cards[i].querySelector('[data-state]')||{}).textContent || '' };
      }
      return null;
    })()`);
    await sleep(400);
    const feedback = await s.eval(`(() => {
      const cards = [...document.querySelectorAll('.qcard')];
      const c = cards[${'${'}0${'}'}] || null;
      return {};
    })()`).catch(() => ({}));
    const fb2 = await s.eval(`(() => {
      const cards = [...document.querySelectorAll('.qcard')];
      const c = cards[` + (answered ? answered.idx : 0) + `];
      const st = c && c.querySelector('[data-state]');
      const expl = c && c.querySelector('.q-expl');
      const store = JSON.parse(localStorage.getItem('codecraft.v2')||'{}');
      const solvedN = Object.keys((store.langs && store.langs.c && store.langs.c.solved) || {}).length;
      return { state: st ? st.textContent.trim() : '', explShown: expl ? !expl.hidden : false, solvedN,
               tries: Object.keys((store.langs && store.langs.c && store.langs.c.tries) || {}).length };
    })()`);
    console.log('答题反馈:', JSON.stringify(answered), JSON.stringify(fb2));
    if (!fb2.state) errs.push('点选答案后没有反馈');
    if (!fb2.tries) errs.push('答题记录没有写入 tries');
    await s.shot(path.join(SHOTS, '06-daily.png'), true);

    /* ---------- 8. 计划 / 记录 / 实验室 ---------- */
    for (const [hash, name] of [['#/plan', '07-plan'], ['#/calendar', '08-calendar'], ['#/lab', '09-lab'], ['#/settings', '10-settings']]) {
      await s.eval(`location.hash = '${hash}'; 'ok'`);
      await sleep(700);
      const len = await s.eval(`document.getElementById('view').innerHTML.length`);
      const bad = await s.eval(`document.getElementById('view').innerHTML.indexOf('页面渲染出错') >= 0 || document.getElementById('view').innerHTML.indexOf('没有找到') >= 0`);
      console.log(hash + ' 内容长度=' + len + (bad ? ' [报错]' : ''));
      if (bad) errs.push(hash + ' 渲染报错');
      await s.shot(path.join(SHOTS, name + '.png'), true);
    }

    /* ---------- 9. 刷新后是否保留 ---------- */
    await s.eval(`location.hash = '#/home'; 'ok'`);
    await s.send('Page.reload', { ignoreCache: false });
    await sleep(2200);
    const after = await s.eval(`(() => ({
      onboarding: !!document.querySelector('.ob-wrap'),
      hash: location.hash,
      lang: (document.getElementById('lang-name')||{}).textContent,
      chapters: document.querySelectorAll('.ch-head').length
    }))()`);
    console.log('刷新后:', JSON.stringify(after));
    if (after.onboarding) errs.push('刷新后又弹出了引导页（进度没保存）');
    if (after.lang !== 'C') errs.push('刷新后语言丢失');

    /* ---------- 10. 切到 JavaScript 语言 ---------- */
    await s.eval(`App.switchLang('javascript'); 'ok'`);
    await sleep(900);
    const sw = await s.eval(`(() => ({
      lang: (document.getElementById('lang-name')||{}).textContent,
      chapters: document.querySelectorAll('.ch-head').length,
      plan: document.querySelectorAll('.nav-link').length
    }))()`);
    console.log('切换 JS:', JSON.stringify(sw));
    if (sw.lang !== 'JavaScript') errs.push('切换语言失败');
    await s.shot(path.join(SHOTS, '11-js-home.png'), true);

    /* ---------- 11. 实验室真跑一段 JS ---------- */
    await s.eval(`location.hash = '#/lab'; 'ok'`);
    await sleep(800);
    await s.eval(`(() => {
      const ta = document.querySelector('#lab-editor textarea');
      ta.value = 'console.log("实验室正常：" + [1,2,3].map(n => n * 2).join("-"));';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#lab-editor [data-act="run"]').click();
      return 'ok';
    })()`);
    await sleep(1500);
    const labOut = await s.eval(`(() => {
      const el = document.querySelector('#lab-result');
      return el ? el.textContent.replace(/\s+/g, ' ').trim().slice(0, 120) : '';
    })()`);
    console.log('实验室输出:', labOut);
    if (labOut.indexOf('实验室正常：2-4-6') < 0) errs.push('实验室没有正确执行代码：' + labOut);
    await s.shot(path.join(SHOTS, '12-lab-run.png'));

    /* ---------- 12. 控制台错误 ---------- */
    const logs = s.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
    const exs = s.events.filter(e => e.method === 'Runtime.exceptionThrown');
    if (logs.length) errs.push('控制台错误 ' + logs.length + ' 条：' + logs.slice(0, 3).map(l => l.params.entry.text).join(' | '));
    if (exs.length) errs.push('未捕获异常 ' + exs.length + ' 条：' + exs.slice(0, 2).map(e => (e.params.exceptionDetails.exception || {}).description || e.params.exceptionDetails.text).join(' | '));
  } catch (e) {
    errs.push('测试中断：' + e.message);
  } finally {
    try { proc.kill(); } catch (e) {}
  }

  console.log('\n' + (errs.length ? '发现 ' + errs.length + ' 个问题：\n - ' + errs.join('\n - ') : '端到端流程全部通过 ✓'));
  process.exitCode = errs.length ? 1 : 0;
  setTimeout(() => process.exit(process.exitCode), 300);
})();
