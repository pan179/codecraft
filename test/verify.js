/* ============================================================
   CodeCraft · 数据自检脚本
   1) 运行 JavaScript 示例，核对 out 是否与真实输出一致
   2) 运行 Python 示例（本机 python3），核对 out
   3) 题库隔离 / id 唯一 / 章节引用 检查
   4) 学习计划与每日出题在多种天数、难度、日期下的稳定性
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, '..', 'src');
const read = f => fs.readFileSync(path.join(SRC, f), 'utf8');

/* ---------- 载入数据与应用核心 ---------- */
const sandbox = { window: {}, console, setTimeout, Promise };
vm.createContext(sandbox);
vm.runInContext(read('js/core.js'), sandbox);
['data/lang-python.js', 'data/lang-c.js', 'data/lang-cpp.js', 'data/lang-java.js', 'data/lang-javascript.js']
  .forEach(f => vm.runInContext(read(f), sandbox));

const LANGS = sandbox.window.LANGS;
const CORE = sandbox.window.CORE;
const normalize = s => CORE.normalizeOut(s);

let errs = [];
const bad = m => errs.push(m);

/* ---------- 与前台一致的 console 格式化 ---------- */
function fmt(v) {
  if (typeof v === 'string') return v;
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}
function runJS(code, stdin) {
  const buf = [];
  const push = (...a) => buf.push(a.map(fmt).join(' '));
  const fake = { log: push, error: push, warn: push, info: push, debug: push };
  const lines = String(stdin || '').split('\n');
  let p = 0;
  const readline = () => (p < lines.length ? lines[p++] : '');
  const readInt = () => { const v = String(readline()).trim(); return v === '' ? 0 : Number(v); };
  const fn = new Function('console', 'readline', 'readInt', 'print', 'INPUT', code);
  fn(fake, readline, readInt, push, stdin || '');
  return buf;
}

/* 异步代码（Promise / setTimeout）需要等一会儿再收输出 */
const sleepMs = ms => new Promise(r => setTimeout(r, ms));
async function runJSAsync(code, stdin) {
  const buf = runJS(code, stdin);
  await sleepMs(180);
  return buf.join('\n');
}

/* ---------- Python 执行 ---------- */
function runPy(code, stdin) {
  try {
    const out = execFileSync('python', ['-c', code], {
      input: stdin || '', encoding: 'utf8', timeout: 15000,
      env: Object.assign({}, process.env, { PYTHONIOENCODING: 'utf-8' })
    });
    return out;
  } catch (e) {
    return (e.stdout || '') + (e.stderr || '');
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async function main() {
  /* ================= 1. JS 示例与题目 ================= */
  const jsLang = LANGS.javascript;
  const jsBlocks = [];
  jsLang.chapters.forEach(c => c.lessons.forEach(l => l.blocks.forEach(b => {
    if (b.t === 'code' && b.out != null && b.run !== false && !/document|localStorage|<script/i.test(b.x)) {
      jsBlocks.push({ id: l.id + '/' + l.title, code: b.x, out: b.out });
    }
  })));
  for (const b of jsBlocks) {
    const got = await runJSAsync(b.code, '');
    if (normalize(got) !== normalize(b.out)) {
      bad('[JS 示例] ' + b.id + '\n  期望: ' + JSON.stringify(b.out) + '\n  实际: ' + JSON.stringify(got));
    }
  }

  // JS output 型题目
  for (const q of jsLang.quiz.concat(jsLang.checkin)) {
    if (q.type !== 'output') continue;
    const got = await runJSAsync(q.code || '', '');
    if (normalize(got) !== normalize(q.answer)) {
      bad('[JS 题 ' + q.id + ']\n  期望: ' + JSON.stringify(q.answer) + '\n  实际: ' + JSON.stringify(got));
    }
  }

  // JS 编程题测试用例
  for (const q of jsLang.quiz.concat(jsLang.checkin)) {
    if (q.type !== 'code') continue;
    for (let i = 0; i < (q.tests || []).length; i++) {
      const t = q.tests[i];
      const got = await runJSAsync(q.solution || '', t.in || '');
      if (normalize(got) !== normalize(t.out)) {
        bad('[JS 编程题 ' + q.id + ' 用例' + i + ']\n  期望: ' + JSON.stringify(t.out) + '\n  实际: ' + JSON.stringify(got));
      }
    }
  }

  /* ================= 2. Python 示例与题目 ================= */
  const pyLang = LANGS.python;
  pyLang.chapters.forEach(c => c.lessons.forEach(l => l.blocks.forEach(b => {
    if (b.t === 'code' && b.out != null && b.run !== false && !/input\(/.test(b.x)) {
      const got = runPy(b.x, '');
      if (normalize(got) !== normalize(b.out)) {
        bad('[PY 示例] ' + l.id + ' ' + l.title + '\n  期望: ' + JSON.stringify(b.out) + '\n  实际: ' + JSON.stringify(got.slice(0, 400)));
      }
    }
  })));
  // Python 代码与示例中带 input 的单独验证：跳过（需要 stdin）

  pyLang.quiz.concat(pyLang.checkin).forEach(q => {
    if (q.type === 'output' && !/input\(/.test(q.code || '')) {
      const got = runPy(q.code || '', '');
      if (normalize(got) !== normalize(q.answer)) {
        bad('[PY 题 ' + q.id + ']\n  期望: ' + JSON.stringify(q.answer) + '\n  实际: ' + JSON.stringify(got.slice(0, 300)));
      }
    }
    if (q.type === 'code') {
      (q.tests || []).forEach((t, i) => {
        const got = runPy(q.solution || '', t.in || '');
        if (normalize(got) !== normalize(t.out)) {
          bad('[PY 编程题 ' + q.id + ' 用例' + i + ']\n  期望: ' + JSON.stringify(t.out) + '\n  实际: ' + JSON.stringify(got.slice(0, 300)));
        }
      });
    }
  });

  /* ================= 3. 数据完整性 ================= */
  const ORDER = ['python', 'c', 'cpp', 'java', 'javascript'];
  ORDER.forEach(id => {
    const L = LANGS[id];
    if (!L) { bad('缺少语言数据：' + id); return; }
    const ids = new Set();
    const chIds = new Set(L.chapters.map(c => c.id));
    L.chapters.forEach(c => {
      if (ids.has(c.id)) bad(id + ' 章节 id 重复: ' + c.id);
      ids.add(c.id);
      c.lessons.forEach(l => {
        if (ids.has(l.id)) bad(id + ' 课时 id 重复: ' + l.id);
        ids.add(l.id);
        if (!l.blocks || !l.blocks.length) bad(id + ' 课时没有内容: ' + l.id);
        l.blocks.forEach(b => {
          if (b.t === 'code' && typeof b.x !== 'string') bad(id + ' 代码块缺少内容: ' + l.id);
        });
      });
    });
    const all = L.quiz.concat(L.checkin);
    const seen = new Set();
    all.forEach(q => {
      if (seen.has(q.id)) bad(id + ' 题目 id 重复: ' + q.id);
      seen.add(q.id);
      if (!chIds.has(q.ch)) bad(id + ' 题目章节引用错误: ' + q.id + ' -> ' + q.ch);
      if (q.type === 'choice') {
        if (!Array.isArray(q.opts) || q.opts.length < 2) bad(id + ' 选择题选项不足: ' + q.id);
        if (typeof q.ans !== 'number' || q.ans < 0 || q.ans >= (q.opts || []).length) bad(id + ' 选择题答案越界: ' + q.id);
      } else if (q.type === 'output') {
        if (!q.answer) bad(id + ' 输出题缺少答案: ' + q.id);
      } else if (q.type === 'code') {
        if (!q.solution) bad(id + ' 编程题缺少参考答案: ' + q.id);
        if (!q.tests || !q.tests.length) bad(id + ' 编程题缺少测试用例: ' + q.id);
      }
    });
    const audit = CORE.auditBank(L);
    if (!audit.ok) {
      bad(id + ' 题库隔离检查失败: ' + JSON.stringify({ dupId: audit.dupId, dupPrompt: audit.dupPrompt, missQ: audit.missingQuizCh, missK: audit.missingChkCh }));
    }
    console.log(`  ${L.name}: ${L.chapters.length} 章 / ${L.chapters.reduce((a, c) => a + c.lessons.length, 0)} 课 / ${L.quiz.length} 测试题 / ${L.checkin.length} 打卡题`);
  });

  /* ================= 4. 计划与出题 ================= */
  let planCase = 0, pickCase = 0;
  ORDER.forEach(id => {
    const L = LANGS[id];
    [3, 7, 14, 21, 30, 42, 60, 90, 120].forEach(days => {
      const p = CORE.buildPlan(L, days);
      planCase++;
      if (!p.plan.length) bad(id + ' 计划为空 days=' + days);
      const want = Math.max(3, Math.min(200, days));
      if (p.days !== want) bad(id + ' 计划天数与所选不符：要 ' + days + ' 得 ' + p.days);
      const extra = p.plan.filter(d => d.type !== 'learn').length;
      if (p.plan.filter(d => d.type === 'learn').length !== p.learnDays) bad(id + ' 学习日统计不一致 days=' + days);
      if (p.learnDays + extra !== p.days) bad(id + ' 天数分类不闭合 days=' + days);
      p.plan.forEach((d, i) => {
        if (d.n !== i + 1) bad(id + ' 计划编号错乱 days=' + days);
        if (d.type === 'learn' && !d.lessons.length) bad(id + ' 学习日没有课时 days=' + days);
      });
      const learned = p.plan.filter(d => d.type === 'learn').reduce((a, d) => a + d.lessons.length, 0);
      const total = L.chapters.reduce((a, c) => a + c.lessons.length, 0);
      if (learned !== total) bad(id + ' 计划未覆盖全部课时 days=' + days + ' ' + learned + '/' + total);
    });

    // 出题：不同date/难度，校验不与章节测试重题
    const st = { done: {}, solved: {}, tries: {}, wrong: {}, days: {}, daily: {} };
    const quizIds = new Set(L.quiz.map(q => q.id));
    for (let k = 0; k < 40; k++) {
      const dateKey = CORE.addDays('2026-01-01', k * 3);
      ['easy', 'normal', 'hard'].forEach(level => {
        const picked = CORE.pickCheckin(L, st, dateKey, level);
        pickCase++;
        const cfg = CORE.LEVELS[level];
        if (picked.length !== cfg.total) bad(id + ' 出题数量不符 ' + dateKey + ' ' + level + ' ' + picked.length + '/' + cfg.total);
        if (new Set(picked).size !== picked.length) bad(id + ' 出题重复 ' + dateKey + ' ' + level);
        picked.forEach(pid => {
          if (quizIds.has(pid)) bad(id + ' 打卡题串到章节测试: ' + pid);
          if (!CORE.index(L).KMAP[pid]) bad(id + ' 出题不在打卡题库: ' + pid);
        });
      });
    }
    // 学完全书后仍能出题
    const st2 = { done: {}, solved: {}, tries: {}, wrong: {}, days: {}, daily: {} };
    CORE.index(L).ALL.forEach(l => st2.done[l.id] = 1);
    const full = CORE.pickCheckin(L, st2, '2026-12-31', 'hard');
    if (full.length !== 8) bad(id + ' 学完后出题不足 ' + full.length);
  });

  console.log(`\n计划用例 ${planCase} 个，出题用例 ${pickCase} 个`);

  if (errs.length) {
    console.log('\n===== 发现 ' + errs.length + ' 处问题 =====');
    errs.slice(0, 60).forEach(e => console.log('\n' + e));
    process.exitCode = 1;
  } else {
    console.log('\n全部检查通过 ✓');
  }
})();
