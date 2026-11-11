/* 校验 data 里所有 code 块的 out 是否与真实运行结果一致
   用法: node test/check-code.js python   （也支持 c / cpp / java，但这两类需在线编译） */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const lang = process.argv[2] || 'python';

const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of [lang + '.js']) {
  const p = path.join(ROOT, 'src', 'data', 'lang-' + (lang === 'c' ? 'c' : lang) + '.js');
  if (!fs.existsSync(p)) { console.log('找不到数据文件:', p); process.exit(1); }
  vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: p });
}
const L = sandbox.window.LANGS[lang];
if (!L) { console.log('数据里没有语言:', lang); process.exit(1); }

function runPython(code) {
  return execFileSync('python', ['-c', code], {
    encoding: 'utf8',
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    timeout: 20000,
  });
}

const norm = s => String(s == null ? '' : s)
  .replace(/\r\n/g, '\n')
  .replace(/\s+$/,'')
  .replace(/\s+$/gm, '');

let total = 0, bad = 0;
for (const ch of L.chapters) {
  for (const ls of ch.lessons) {
    (ls.blocks || []).forEach((b, i) => {
      if (b.t !== 'code' || b.out == null) return;
      total++;
      let got;
      try { got = runPython(b.x); }
      catch (e) { bad++; console.log(`\n✗ ${ls.id} 第${i}块 运行报错`); console.log('  代码:', JSON.stringify(b.x).slice(0,120)); console.log('  错误:', String(e.stderr || e.message).split('\n').slice(-3).join(' ')); return; }
      if (norm(got) !== norm(b.out)) {
        bad++;
        console.log(`\n✗ ${ls.id} 第${i}块 输出不一致`);
        console.log('  期望:', JSON.stringify(b.out));
        console.log('  实际:', JSON.stringify(got));
        console.log('  代码:', JSON.stringify(b.x).slice(0, 200));
      }
    });
  }
}

const chapters = L.chapters.length;
const lessons = L.chapters.reduce((n, c) => n + c.lessons.length, 0);
const q = (L.quiz || []).length, k = (L.checkin || []).length;

console.log('\n' + '='.repeat(50));
console.log(`${L.name}: ${chapters} 章 / ${lessons} 课 / 测试题 ${q} / 打卡题 ${k}`);
console.log(`代码块核对: ${total - bad} / ${total} 通过` + (bad ? `，${bad} 处有问题` : '  ✓'));
process.exitCode = bad ? 1 : 0;
