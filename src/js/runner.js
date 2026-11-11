/* ============================================================
   CodeCraft · 代码运行引擎
   · JavaScript：浏览器内 iframe 沙箱，完全离线
   · Python / C / C++ / Java：Wandbox 在线编译运行（需联网）
   ============================================================ */
window.Runner = (function () {
  'use strict';

  const API = 'https://wandbox.org/api/compile.json';
  const MAP = {
    python:     { compiler: 'cpython-3.13.8',  options: '', file: 'main.py' },
    c:          { compiler: 'gcc-13.2.0-c',    options: 'warning,c11', file: 'main.c' },
    cpp:        { compiler: 'gcc-13.2.0',      options: 'warning,c++17', file: 'main.cpp' },
    // Java 的 JVM 默认按系统编码输出，在服务器上会把中文变成 ?，必须显式指定 UTF-8
    java:       { compiler: 'openjdk-jdk-21+35', options: '', file: 'Main.java',
                  runtime: '-Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8' }
  };

  const caps = {
    python: '在线运行 · 需联网',
    c: '在线编译 · GCC 13 / C11',
    cpp: '在线编译 · GCC 13 / C++17',
    java: '在线编译 · OpenJDK 21（主类写 class Main）',
    javascript: '浏览器内运行 · 可离线'
  };

  /* ---------- 请求队列：避免高频打挂公共接口 ---------- */
  let chain = Promise.resolve();
  let lastAt = 0;
  function enqueue(task) {
    const run = chain.then(async () => {
      const wait = Math.max(0, 420 - (Date.now() - lastAt));
      if (wait) await new Promise(r => setTimeout(r, wait));
      lastAt = Date.now();
      return task();
    });
    chain = run.catch(() => {});
    return run;
  }

  function fetchJSON(body, timeout) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout || 25000);
    return fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal
    }).then(async res => {
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch (e) {}
      if (!data) {
        const brief = String(text || '').replace(/\s+/g, ' ').slice(0, 120);
        const err = new Error('接口返回异常（HTTP ' + res.status + '）' + (brief ? '：' + brief : ''));
        err.tooMany = /too many|rate.?limit|429/i.test(text || '') || res.status === 429;
        throw err;
      }
      return data;
    }).finally(() => clearTimeout(timer));
  }

  function runRemote(lang, code, stdin, attempt) {
    attempt = attempt || 0;
    const cfg = MAP[lang];
    if (!cfg) return Promise.resolve({ ok: false, out: '', err: '暂不支持这门语言在线运行', phase: 'config', note: '' });
    const t0 = Date.now();
    return enqueue(() => fetchJSON({
      compiler: cfg.compiler,
      code: code,
      stdin: stdin || '',
      options: cfg.options || '',
      'compiler-option-raw': '',
      'runtime-option-raw': cfg.runtime || ''
    })).then(d => {
      const out = d.program_output || '';
      const perr = d.program_error || '';
      const cerr = d.compiler_error || '';
      const ok = String(d.status) === '0' && !cerr;
      return {
        ok: ok,
        out: out || perr,
        err: cerr || (ok ? '' : perr) || '',
        phase: cerr ? 'compile' : 'run',
        timeMs: Date.now() - t0,
        note: (Date.now() - t0) + ' ms · ' + (caps[lang] || '在线运行')
      };
    }).catch(e => {
      /* 公共接口限流时稍等重试，最多两次 */
      if (e && e.tooMany && attempt < 2) {
        return new Promise(r => setTimeout(r, 1200 * (attempt + 1)))
          .then(() => runRemote(lang, code, stdin, attempt + 1));
      }
      const msg = e && e.name === 'AbortError'
        ? '在线编译超时（超过 25 秒），检查一下是不是死循环，或稍后重试'
        : '连不上在线编译服务：' + (e && e.message ? e.message : e) + '。请检查网络后重试（Python/C/C++/Java 需要联网运行）';
      return { ok: false, out: '', err: msg, phase: 'network', note: '网络/服务异常', timeMs: Date.now() - t0 };
    });
  }

  /* ---------- JavaScript：iframe 沙箱 ---------- */
  let jsSeq = 0;
  function jstr(s) {
    return JSON.stringify(String(s == null ? '' : s)).replace(/</g, '\\u003c').replace(/\u2028|\u2029/g, ' ');
  }

  function runJS(code, stdin, timeout) {
    return new Promise(resolve => {
      const id = 'jsr' + (++jsSeq) + '_' + Math.random().toString(36).slice(2, 6);
      const t0 = Date.now();
      const iframe = document.createElement('iframe');
      iframe.setAttribute('sandbox', 'allow-scripts');
      iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:2px;height:2px;border:0;opacity:0';
      let settled = false;

      const harness =
        '<!DOCTYPE html><html><body><script>(function(){' +
        'var INPUT=' + jstr(stdin) + ';' +
        'var LINES=String(INPUT).split("\\n"),P=0;' +
        'function readline(){return P<LINES.length?LINES[P++]:"";}' +
        'function readInt(){var v=String(readline()).trim();return v===""?0:Number(v);}' +
        'var buf=[];function fmt(v){if(typeof v==="string")return v;try{return JSON.stringify(v);}catch(e){return String(v);}}' +
        'function push(){buf.push(Array.prototype.slice.call(arguments).map(fmt).join(" "));}' +
        'var fake={log:push,error:push,warn:push,info:push,debug:push};' +
        'function finish(ok,err){if(window.__done)return;window.__done=1;' +
        'parent.postMessage({__cc:1,id:' + jstr(id) + ',ok:ok,out:buf.join("\\n"),err:err||""},"*");}' +
        'try{var fn=new Function("console","readline","readInt","print","INPUT",' + jstr(code) + ');' +
        'fn(fake,readline,readInt,push,INPUT);}catch(e){finish(false,(e&&e.stack)?e.stack:String(e));return;}' +
        'setTimeout(function(){finish(true,"");},140);' +
        '})();</script></body></html>';

      function onMsg(e) {
        const d = e.data;
        if (!d || d.__cc !== 1 || d.id !== id) return;
        settled = true;
        window.removeEventListener('message', onMsg);
        cleanup();
        resolve({ ok: !!d.ok, out: d.out || '', err: d.err || '', phase: d.ok ? 'run' : 'compile',
          timeMs: Date.now() - t0, note: (Date.now() - t0) + ' ms · 浏览器内运行' });
      }
      function cleanup() {
        try { iframe.remove(); } catch (e) {}
      }
      window.addEventListener('message', onMsg);
      setTimeout(() => {
        if (settled) return;
        settled = true;
        window.removeEventListener('message', onMsg);
        cleanup();
        resolve({ ok: false, out: '', err: '运行超时（超过 5 秒），可能是死循环', phase: 'timeout', note: '超时', timeMs: 5000 });
      }, timeout || 5000);

      iframe.srcdoc = harness;
      document.body.appendChild(iframe);
    });
  }

  function run(lang, code, stdin) {
    if (lang === 'javascript') return runJS(code, stdin);
    return runRemote(lang, code, stdin);
  }

  function caption(lang) { return caps[lang] || '在线运行'; }

  return { run, caption, runJS, runRemote, supports: Object.keys(MAP).concat(['javascript']) };
})();
