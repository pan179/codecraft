/* 验证 GitHub Pages 线上版：入口跳转、引导流程、进度持久化 */
const { launch, waitFor } = require('./cdp');
const path = require('path');

const BASE = 'https://pan179.github.io/codecraft/';
let pass = 0, fail = 0;
const ok = (cond, label, extra) => {
  if (cond) { pass++; console.log('  ✓ ' + label + (extra ? ' — ' + extra : '')); }
  else { fail++; console.log('  ✗ ' + label + (extra ? ' — ' + extra : '')); }
};

(async () => {
  const { session: s, proc } = await launch(9411);
  try {
    console.log('=== 线上版验证：' + BASE + ' ===\n');

    await s.send('Page.navigate', { url: BASE });
    await new Promise(r => setTimeout(r, 1500));

    // 用 Page.frameNavigated 事件判断跳转，避免导航瞬间调试上下文失效导致读不到
    let jumped = await waitFor(async () => {
      const nav = s.events
        .filter(e => e.method === 'Page.frameNavigated' && !e.params.frame.parentId)
        .map(e => e.params.frame.url);
      const hit = nav.filter(u => /CodeCraft\.html$/.test(u)).pop();
      return hit || null;
    }, 25000, 300);
    if (!jumped) {
      const cur = await s.eval('location.href').catch(() => '');
      if (/CodeCraft\.html$/.test(cur)) jumped = cur;
    }
    ok(!!jumped, '入口页自动跳转到应用', jumped || '超时');

    const loaded = await waitFor(async () => {
      const t = await s.eval('document.title');
      return /CodeCraft/.test(t || '') ? t : null;
    }, 20000, 400);
    ok(!!loaded, '页面标题正确', loaded || '');

    // 清掉本地状态，回到首次引导
    await s.eval(`localStorage.clear(); location.reload(); 'ok'`);
    await new Promise(r => setTimeout(r, 1800));
    await waitFor(async () => (await s.eval('document.querySelectorAll(".lang-card").length')) > 0, 15000, 300);

    const ob = await s.eval(`(() => ({
      cards: document.querySelectorAll('.lang-card').length,
      title: document.querySelector('.ob-title') ? document.querySelector('.ob-title').textContent.trim() : '',
      step: document.querySelector('.ob-step') ? document.querySelector('.ob-step').textContent.trim() : '',
      langs: [...document.querySelectorAll('.lang-card')].map(c => (c.dataset.lang||'') + ':' + (c.querySelector('h3,h2,strong')||{textContent:''}).textContent.trim())
    }))()`);
    ok(ob.cards === 5, '首次打开显示语言选择', '5 张卡');
    console.log('     语言卡:', ob.langs.join(' / '));
    console.log('     引导标题:', ob.title, '|', ob.step);
    await s.shot(path.join(__dirname, '..', 'shots', 'web-01-onboarding.png'));

    // 选 C → 21 天 → 开始
    await s.eval(`document.querySelector('[data-lang="c"]').click(); 'ok'`);
    await new Promise(r => setTimeout(r, 400));
    await s.eval(`document.querySelector('#ob-next').click(); 'ok'`);
    await new Promise(r => setTimeout(r, 500));
    const dayBox = await s.eval(`(() => ({
      n: document.querySelectorAll('.day-card').length,
      opts: [...document.querySelectorAll('.day-card')].map(d => d.dataset.days)
    }))()`);
    ok(dayBox.n >= 4, '天数选项出现', dayBox.opts.join(','));

    await s.eval(`(document.querySelector('[data-days="21"]')||document.querySelector('.day-card')).click(); 'ok'`);
    await new Promise(r => setTimeout(r, 300));
    await s.eval(`document.querySelector('#ob-next').click(); 'ok'`);
    await new Promise(r => setTimeout(r, 500));
    const sum = await s.eval(`(() => {
      const el = document.querySelector('.ob-summary');
      return { text: el ? el.textContent.replace(/\\s+/g,' ').trim().slice(0,120) : '' };
    })()`);
    ok(/21/.test(sum.text) || sum.text.length > 10, '计划预览生成', sum.text);
    await s.shot(path.join(__dirname, '..', 'shots', 'web-02-plan-preview.png'));

    await s.eval(`document.querySelector('#ob-start').click(); 'ok'`);
    await new Promise(r => setTimeout(r, 900));

    const home = await s.eval(`(() => {
      const v = document.getElementById('view');
      return {
        hasNav: !!document.querySelector('.side-nav, #sidebar'),
        textLen: v ? v.innerHTML.length : 0,
        cur: (document.querySelector('.lang-pill')||{textContent:''}).textContent.trim(),
        broken: v ? /页面渲染出错|没有找到/.test(v.textContent) : true
      };
    })()`);
    ok(home.textLen > 500 && !home.broken, '首页正常渲染', '内容 ' + home.textLen + ' 字符');
    ok(/C/.test(home.cur), '顶栏显示当前语言', home.cur);
    await s.shot(path.join(__dirname, '..', 'shots', 'web-03-home.png'));

    // 学习进度持久化
    await s.eval(`location.hash = '#/lesson/c1l1'; 'ok'`);
    await new Promise(r => setTimeout(r, 700));
    const hasMark = await s.eval(`!!document.querySelector('#mark-done')`);
    ok(hasMark, '课时页含“标记已读”按钮');
    if (hasMark) {
      await s.eval(`document.querySelector('#mark-done').click(); 'ok'`);
      await new Promise(r => setTimeout(r, 400));
    }

    await s.eval(`location.reload(); 'ok'`);
    await new Promise(r => setTimeout(r, 2200));
    await waitFor(async () => (await s.eval(`!!document.getElementById('view')`)), 15000, 300);
    const persist = await s.eval(`(() => {
      const raw = localStorage.getItem('codecraft.v2');
      if (!raw) return { ok: false, reason: '无本地数据' };
      const d = JSON.parse(raw);
      const st = d.langs && d.langs.c;
      return {
        ok: !!st && Object.keys(st.done || {}).length > 0,
        days: st ? Object.keys(st.days || {}).length : 0,
        done: st ? Object.keys(st.done || {}).length : 0
      };
    })()`);
    ok(persist.ok, '刷新后学习进度保留', '记录 ' + (persist.days || 0) + ' 天 / 已完成 ' + (persist.done || 0) + ' 课');

    // 各页面渲染（错题本无错题时是空状态卡片，内容天然短）
    for (const [hash, name, minLen] of [['#/daily', '今日一练', 200], ['#/plan', '学习计划', 200], ['#/calendar', '学习记录', 200], ['#/lab', '实验室', 200], ['#/wrong', '错题本', 100], ['#/settings', '设置', 200]]) {
      await s.eval(`location.hash = '${hash}'; 'ok'`);
      await new Promise(r => setTimeout(r, 500));
      const r = await s.eval(`(() => {
        const v = document.getElementById('view');
        return { len: v ? v.innerHTML.length : 0, bad: v ? /页面渲染出错|没有找到/.test(v.textContent) : true };
      })()`);
      ok(r.len > minLen && !r.bad, name + ' 页正常', r.len + ' 字符');
    }
    await s.eval(`location.hash = '#/daily'; 'ok'`);
    await new Promise(r => setTimeout(r, 600));
    await s.shot(path.join(__dirname, '..', 'shots', 'web-04-daily.png'));

    // 控制台错误
    const errs = s.events
      .filter(e => e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error')
      .map(e => (e.params.args || []).map(a => a.value || a.description || '').join(' '));
    const exc = s.events
      .filter(e => e.method === 'Runtime.exceptionThrown')
      .map(e => (e.params.exceptionDetails && e.params.exceptionDetails.text) || '');
    ok(errs.length === 0 && exc.length === 0, '无 JavaScript 报错',
      errs.concat(exc).slice(0, 3).join(' | ') || '0 条');

    console.log('\n=== 线上版：' + pass + ' 通过 / ' + fail + ' 失败 ===');
    process.exitCode = fail ? 1 : 0;
  } catch (e) {
    console.log('✗ 异常:', e.message);
    process.exitCode = 1;
  } finally {
    try { proc.kill(); } catch (_) {}
  }
})();
