/* 快速检查 Python 扩充后在页面上的渲染 */
const { launch, waitFor } = require('./cdp');
const path = require('path');

(async () => {
  const file = 'file:///' + path.join(__dirname, '..', 'dist', 'CodeCraft 学习站.html').replace(/\\/g, '/').replace(/ /g, '%20');
  const { session: s, proc } = await launch(9511);
  try {
    await s.send('Page.navigate', { url: file });
    await waitFor(async () => (await s.eval('document.querySelectorAll(".lang-card").length')) > 0, 20000, 300);
    await s.eval('localStorage.clear(); location.reload(); "ok"');
    await new Promise(r => setTimeout(r, 1500));
    await waitFor(async () => (await s.eval('document.querySelectorAll(".lang-card").length')) > 0, 15000, 300);

    await s.eval('document.querySelector(\'[data-lang="python"]\').click(); "ok"');
    await new Promise(r => setTimeout(r, 400));
    await s.eval('document.querySelector("#ob-next").click(); "ok"');
    await new Promise(r => setTimeout(r, 500));
    const days = await s.eval('[].map.call(document.querySelectorAll(".day-card"), d => d.dataset.days).join(",")');
    console.log('可选天数:', days);
    await s.eval('(document.querySelector(\'[data-days="30"]\')||document.querySelector(".day-card")).click(); "ok"');
    await new Promise(r => setTimeout(r, 300));
    await s.eval('document.querySelector("#ob-next").click(); "ok"');
    await new Promise(r => setTimeout(r, 500));
    await s.eval('document.querySelector("#ob-start").click(); "ok"');
    await new Promise(r => setTimeout(r, 900));

    const info = await s.eval(`(() => {
      const chs = document.querySelectorAll('.side-nav .nav-ch, #sidebar .nav-ch, .side-nav [data-ch]');
      const links = document.querySelectorAll('.side-nav a[href*="#/lesson/"]');
      const v = document.getElementById('view');
      return {
        chapters: chs.length,
        lessonLinks: links.length,
        homeLen: v ? v.innerHTML.length : 0,
        text: v ? v.textContent.replace(/\\s+/g,' ').slice(0, 120) : ''
      };
    })()`);
    console.log('侧栏章节:', info.chapters, '| 课时链接:', info.lessonLinks, '| 首页长度:', info.homeLen);
    console.log('首页摘要:', info.text.slice(0, 100));

    await s.eval('location.hash = "#/lesson/py8l4"; "ok"');
    await new Promise(r => setTimeout(r, 800));
    const lesson = await s.eval(`(() => {
      const v = document.getElementById('view');
      return { len: v ? v.innerHTML.length : 0, h1: (v && v.querySelector('h1') || {}).textContent || '', hasMark: !!document.querySelector('#mark-done') };
    })()`);
    console.log('课时页:', lesson.h1, '| 内容长度:', lesson.len, '| 有标记按钮:', lesson.hasMark);
    await s.shot(path.join(__dirname, '..', 'shots', 'py40-lesson.png'));

    await s.eval('location.hash = "#/plan"; "ok"');
    await new Promise(r => setTimeout(r, 700));
    const plan = await s.eval('(document.getElementById("view").textContent.replace(/\\s+/g," ")).slice(0,150)');
    console.log('计划页:', plan);
    await s.shot(path.join(__dirname, '..', 'shots', 'py40-plan.png'));

    const errs = s.events.filter(e => e.method === 'Runtime.exceptionThrown').length;
    console.log('JS 异常:', errs, '条');
  } catch (e) {
    console.log('✗ 异常:', e.message);
  } finally {
    try { proc.kill(); } catch (_) {}
  }
})();
