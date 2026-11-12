/* ============================================================
   CodeCraft · 题库自检
   1) 结构：id 唯一、lesson 存在、ch 对得上、选择题选项与答案合法
   2) 查重：章节测试与每日打卡不能有相同题干
   3) 跑答案：output 型题目用与应用内沙箱一致的规则真实跑一遍，比对 answer
   用法：node test/check-quiz.js [lang]
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = path.join(__dirname, '..', 'src');
const lang = process.argv[2] || 'javascript';

const sb = { window: {}, console };
vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(SRC, 'js', 'core.js'), 'utf8'), sb);
vm.runInContext(fs.readFileSync(path.join(SRC, 'data', `lang-${lang}.js`), 'utf8'), sb);
const L = sb.window.LANGS[lang];
const CORE = sb.window.CORE;

const lessons = {};
L.chapters.forEach(c => c.lessons.forEach(l => { lessons[l.id] = c.id; }));

let bad = 0;
const err = (...a) => { bad++; console.log('  ✗', ...a); };

const all = [];
[['quiz', L.quiz || []], ['checkin', L.checkin || []]].forEach(([kind, arr]) => {
  const seen = new Set();
  arr.forEach(q => {
    all.push([kind, q]);
    if (seen.has(q.id)) err(`重复 id：${q.id}`);
    seen.add(q.id);
    if (!lessons[q.lesson]) err(`${q.id} 的 lesson ${q.lesson} 不存在`);
    else if (lessons[q.lesson] !== q.ch) err(`${q.id} 的 ch=${q.ch}，但 lesson 属于 ${lessons[q.lesson]}`);
    if (!q.point) err(`${q.id} 缺 point`);
    if (!q.explain) err(`${q.id} 缺 explain`);
    if (!(q.diff >= 1 && q.diff <= 3)) err(`${q.id} 的 diff 非法：${q.diff}`);
    if (q.type === 'choice') {
      if (!Array.isArray(q.opts) || q.opts.length !== 4) err(`${q.id} 选项不是 4 个`);
      else if (new Set(q.opts).size !== 4) err(`${q.id} 选项有重复`);
      if (!(q.ans >= 0 && q.ans < (q.opts || []).length)) err(`${q.id} 的 ans 越界：${q.ans}`);
    } else if (q.type === 'output') {
      if (!q.code) err(`${q.id} 缺 code`);
      if (typeof q.answer !== 'string') err(`${q.id} 缺 answer`);
    } else err(`${q.id} 的 type 非法：${q.type}`);
  });
});

// 题干查重（跨两套题库）
const prompts = new Map();
all.forEach(([kind, q]) => {
  const key = (q.prompt + '|' + (q.code || '')).replace(/\s+/g, '');
  if (prompts.has(key)) err(`题干重复：${q.id} 与 ${prompts.get(key)}`);
  else prompts.set(key, q.id);
});

const fmt = v => (typeof v === 'string' ? v : (() => { try { return JSON.stringify(v); } catch (e) { return String(v); } })());

async function runCode(code, wait) {
  const buf = [];
  const push = (...args) => buf.push(args.map(fmt).join(' '));
  const ctx = {
    console: { log: push, error: push, warn: push, info: push, debug: push },
    setTimeout, clearTimeout, setInterval, clearInterval,
    structuredClone: typeof structuredClone === 'function' ? structuredClone : undefined,
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  try { vm.runInContext(code, ctx, { timeout: 5000 }); }
  catch (e) { return { ok: false, out: buf.join('\n'), err: String((e && e.message) || e) }; }
  await new Promise(r => setTimeout(r, wait || 400));
  return { ok: true, out: buf.join('\n'), err: '' };
}

(async function main() {
  console.log('='.repeat(50));
  console.log(`${L.name}: ${L.chapters.length} 章 / ${Object.keys(lessons).length} 课`);
  console.log(`章节测试 ${(L.quiz || []).length} 道 / 每日打卡 ${(L.checkin || []).length} 道`);

  let ran = 0, pass = 0;
  for (const [kind, q] of all) {
    if (q.type !== 'output') continue;
    ran++;
    const r = await runCode(q.code);
    const got = CORE.normalizeOut(r.out);
    const want = CORE.normalizeOut(q.answer);
    if (!r.ok) { err(`${q.id}（${kind}）运行报错：${r.err}`); continue; }
    if (got === want) pass++;
    else {
      err(`${q.id}（${kind}）/${q.point}`);
      console.log('     期望:', JSON.stringify(want));
      console.log('     实际:', JSON.stringify(got));
    }
  }
  console.log('-'.repeat(50));
  console.log(`output 型题目实跑：${pass} / ${ran} 通过`);
  console.log(bad === 0 ? '结构检查全部通过 ✓' : `结构问题 ${bad} 处 ✗`);
  process.exitCode = bad === 0 ? 0 : 1;
})();
