/* ============================================================
   CodeCraft · 在线核对 C / C++ / Java 示例输出
   把每个带 out 的代码块提交到 Wandbox 真实编译运行，比对 out
   用法：node test/verify-online.js [c,cpp,java]
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = path.join(__dirname, '..', 'src');
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(SRC, 'js/core.js'), 'utf8'), sandbox);
['lang-c.js', 'lang-cpp.js', 'lang-java.js'].forEach(f => {
  const p = path.join(SRC, 'data', f);
  if (!fs.existsSync(p)) return;
  vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox);
});

const LANGS = sandbox.window.LANGS;
const CORE = sandbox.window.CORE;
const normalize = s => CORE.normalizeOut(s);

const CFG = {
  c: { compiler: 'gcc-13.2.0-c', options: 'warning,c11' },
  cpp: { compiler: 'gcc-13.2.0', options: 'warning,c++17' },
  java: { compiler: 'openjdk-jdk-21+35', options: '', runtime: '-Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8' }
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
const api = 'https://wandbox.org/api/compile.json';

async function runOn(lang, code) {
  const cfg = CFG[lang];
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 40000);
  try {
    const res = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compiler: cfg.compiler, code, stdin: '', options: cfg.options, 'runtime-option-raw': cfg.runtime || '' }),
      signal: ctrl.signal
    });
    const text = await res.text();
    let d;
    try { d = JSON.parse(text); } catch (e) {
      return { ok: false, out: '', cerr: '非 JSON 响应：' + text.replace(/\s+/g, ' ').slice(0, 100), perr: '', retry: /too many|rate/i.test(text) };
    }
    const cerr = d.compiler_error || '';
    const out = d.program_output || '';
    const perr = d.program_error || '';
    const infra = /OCI runtime|Resource temporarily|too many|rate limit/i.test(cerr + perr + text);
    return { ok: String(d.status) === '0' && !cerr && !infra, out, cerr, perr, retry: infra };
  } catch (e) {
    return { ok: false, out: '', cerr: '请求失败：' + e.message, perr: '', retry: true };
  } finally {
    clearTimeout(timer);
  }
}

(async function main() {
  const only = process.argv[2] ? process.argv[2].split(',') : ['c', 'cpp', 'java'];
  const withQuiz = process.argv.includes('--quiz');
  const onlyArg = process.argv.find(a => a.startsWith('--only='));
  const filters = onlyArg ? onlyArg.slice(7).split(',').filter(Boolean) : null;
  let fail = 0, pass = 0, skip = 0;

  for (const lang of only) {
    const L = LANGS[lang];
    if (!L) continue;
    const cases = [];
    L.chapters.forEach(c => c.lessons.forEach(l => l.blocks.forEach(b => {
      if (b.t !== 'code' || b.out == null || b.run === false) return;
      if (/scanf\(|\bcin\s*>>|Scanner|getline\s*\(\s*cin/.test(b.x)) { skip++; return; }
      cases.push({ id: l.id + ' / ' + l.title, code: b.x, out: b.out });
    })));

    if (withQuiz) {
      [['quiz', L.quiz || []], ['checkin', L.checkin || []]].forEach(([kind, arr]) => arr.forEach(q => {
        if (q.type !== 'output') return;
        cases.push({ id: q.id + '（' + kind + '）/' + q.point, code: q.code, out: q.answer });
      }));
    }

    console.log('\n===== ' + L.name + '：' + cases.length + ' 个示例待核对 =====');
    for (const c of cases) {
      if (filters && !filters.some(f => c.id.includes(f))) continue;
      let r = await runOn(lang, c.code);
      let tries = 0;
      while (r.retry && tries < 6) {
        tries++;
        await sleep(3000 * tries);
        r = await runOn(lang, c.code);
      }
      const got = r.out;
      if (normalize(got) === normalize(c.out)) {
        pass++;
        console.log('  ✓ ' + c.id);
      } else {
        fail++;
        console.log('  ✗ ' + c.id);
        console.log('     期望: ' + JSON.stringify(c.out));
        console.log('     实际: ' + JSON.stringify(got));
        if (r.retry) console.log('     （Wandbox 资源繁忙，已重试仍失败）');
        if (r.cerr) console.log('     编译错误: ' + r.cerr.split('\n').slice(0, 4).join(' | '));
        if (r.perr) console.log('     运行错误: ' + r.perr.split('\n').slice(0, 3).join(' | '));
      }
      await sleep(2600);
    }
  }

  console.log('\n通过 ' + pass + '，失败 ' + fail + '，跳过（需 stdin）' + skip);
  if (fail) process.exitCode = 1;
})();
