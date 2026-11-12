/* ============================================================
   CodeCraft · 核对 JavaScript 代码块的 out
   用与应用内沙箱一致的 console 格式（非字符串走 JSON.stringify）
   用法：node test/check-js.js
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'src/js/core.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'src/data/lang-javascript.js'), 'utf8'), sandbox, { filename: 'lang-javascript.js' });

const L = sandbox.window.LANGS.javascript;
const normalize = s => sandbox.window.CORE.normalizeOut(s);

const fmt = v => (typeof v === 'string' ? v : (() => { try { return JSON.stringify(v); } catch (e) { return String(v); } })());

async function runCode(code, wait) {
  const buf = [];
  const push = (...args) => buf.push(args.map(fmt).join(' '));
  const ctx = {
    console: { log: push, error: push, warn: push, info: push, debug: push },
    setTimeout, clearTimeout, setInterval, clearInterval,
    structuredClone: typeof structuredClone === 'function' ? structuredClone : undefined,
    readline: () => '', readInt: () => 0, print: push,
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  try {
    vm.runInContext(code, ctx, { timeout: 5000 });
  } catch (e) {
    return { ok: false, out: buf.join('\n'), err: String(e && e.message || e) };
  }
  await new Promise(r => setTimeout(r, wait || 350));
  return { ok: true, out: buf.join('\n'), err: '' };
}

(async () => {
  let total = 0, bad = 0, skipped = 0;
  for (const ch of L.chapters) {
    for (const ls of ch.lessons) {
      for (let i = 0; i < (ls.blocks || []).length; i++) {
        const b = ls.blocks[i];
        if (b.t !== 'code') continue;
        if (b.out == null) { skipped++; continue; }
        if (b.run === false) { skipped++; continue; }
        total++;
        const r = await runCode(b.x);
        if (!r.ok) {
          bad++;
          console.log(`\n✗ ${ls.id} 第${i}块 运行报错`);
          console.log('  错误:', r.err);
          console.log('  代码:', JSON.stringify(b.x).slice(0, 160));
          continue;
        }
        if (normalize(r.out) !== normalize(b.out)) {
          bad++;
          console.log(`\n✗ ${ls.id} 第${i}块 输出不一致`);
          console.log('  期望:', JSON.stringify(b.out));
          console.log('  实际:', JSON.stringify(r.out));
        }
      }
    }
  }
  const lessons = L.chapters.reduce((n, c) => n + c.lessons.length, 0);
  console.log('\n' + '='.repeat(50));
  console.log(`JavaScript: ${L.chapters.length} 章 / ${lessons} 课 / 测试题 ${(L.quiz || []).length} / 打卡题 ${(L.checkin || []).length}`);
  console.log(`代码块核对: ${total - bad} / ${total} 通过（跳过 ${skipped} 个无 out 或需 DOM）` + (bad ? `，${bad} 处有问题` : '  ✓'));
  process.exitCode = bad ? 1 : 0;
})();
