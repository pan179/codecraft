/* ============================================================
   CodeCraft · UI 组件层
   ============================================================ */
window.UI = (function () {
  'use strict';

  /* ---------------- 转义 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------------- 语法高亮 ---------------- */
  const KW = {
    python: 'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case',
    c: 'auto break case char const continue default do double else enum extern float for goto if inline int long register return short signed sizeof static struct switch typedef union unsigned void volatile while bool',
    cpp: 'auto break case catch char class const constexpr continue default delete do double else enum explicit extern false float for friend goto if inline int long namespace new nullptr operator private protected public return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while override include define',
    java: 'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null var record',
    javascript: 'async await break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new of return static super switch this throw try typeof var void while with yield true false null undefined'
  };
  const BI = {
    python: 'print len range input int str float bool list dict set tuple abs sum max min sorted enumerate zip map filter open isinstance type super repr round any all divmod',
    c: 'printf scanf malloc free strlen strcpy strcmp strcat memset sizeof fprintf fgets puts gets strncpy sprintf',
    cpp: 'cout cin endl string vector map set unordered_map sort printf scanf push_back size',
    java: 'System String Math Integer Double Object Arrays List ArrayList HashMap Map Scanner StringBuilder Character Long',
    javascript: 'console Math JSON Object Array String Number Boolean Promise fetch document window parseInt parseFloat Map Set'
  };
  const LIT = { python: '# ', c: '// ', cpp: '// ', java: '// ', javascript: '// ' };

  function hl(code, lang) {
    lang = lang || 'python';
    const kws = new Set((KW[lang] || KW.python).split(' '));
    const bis = new Set((BI[lang] || '').split(' '));
    const hashCmt = (lang === 'python');
    const src = String(code == null ? '' : code);

    // 主扫描：注释 | 字符串 | 数字 | 标识符 | 其他
    const re = hashCmt
      ? /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?j?\b)|([A-Za-z_$][\w$]*)/g
      : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|^[ \t]*#[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?[fFlLuU]*\b)|([A-Za-z_$][\w$]*)/gm;

    let out = '', last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      const [full, cmt, str, num, ident] = m;
      if (cmt) out += '<span class="c">' + esc(cmt) + '</span>';
      else if (str) out += '<span class="s">' + esc(str) + '</span>';
      else if (num) out += '<span class="n">' + esc(num) + '</span>';
      else if (ident) {
        if (kws.has(ident)) out += '<span class="k">' + esc(ident) + '</span>';
        else if (bis.has(ident)) out += '<span class="b">' + esc(ident) + '</span>';
        else if (/^\s*\(/.test(src.slice(re.lastIndex, re.lastIndex + 3))) out += '<span class="f">' + esc(ident) + '</span>';
        else out += esc(ident);
      } else out += esc(full);
      last = re.lastIndex;
    }
    out += esc(src.slice(last));
    return out;
  }

  function inline(s) {
    // 支持正文里的行内标记：`code` 与 **加粗**（先转义，避免把代码里的 < > 当标签）
    let out = esc(String(s == null ? '' : s));
    out = out.replace(/`([^`]+)`/g, (m, p1) => '<code class="inline">' + p1 + '</code>');
    out = out.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    return out;
  }

  /* ---------------- 代码块 ---------------- */
  const store = {};
  let seq = 0;
  function resetStore() { for (const k in store) delete store[k]; seq = 0; }
  function putCode(code) { const id = 'c' + (++seq); store[id] = code; return id; }
  function getCode(id) { return store[id]; }

  function codeBox(code, opts) {
    opts = opts || {};
    const lang = opts.lang || 'python';
    const id = putCode(String(code == null ? '' : code).replace(/\s+$/, ''));
    let h = '<div class="codebox">';
    h += '<div class="codebox-head"><span class="dots"><i></i><i></i><i></i></span>' +
      '<span>' + esc(opts.label || (code[0] === '>' ? '终端' : (opts.fileName || lang))) + '</span><span class="sp"></span>';
    h += '<button data-copy="' + id + '">复制</button>';
    if (opts.run) h += '<button data-run="' + id + '" data-lang="' + lang + '">▶ 运行</button>';
    h += '</div>';
    h += '<pre class="code"><code>' + hl(code, lang) + '</code></pre>';
    if (opts.out != null) h += '<div class="outbox">' + esc(opts.out) + '</div>';
    h += '<div class="outbox err" data-out-for="' + id + '" hidden></div>';
    h += '</div>';
    return h;
  }

  /* ---------------- 正文块 ---------------- */
  function blocksHtml(blocks, lang) {
    let h = '';
    (blocks || []).forEach(b => {
      if (typeof b === 'string') { h += '<p>' + inline(b) + '</p>'; return; }
      switch (b.t) {
        case 'h': h += '<h3>' + inline(b.x) + '</h3>'; break;
        case 'p': h += '<p>' + inline(b.x) + '</p>'; break;
        case 'quote': h += '<p style="border-left:3px solid #dbe6f7;padding-left:14px;color:#5b6b82">' + inline(b.x) + '</p>'; break;
        case 'ul': h += '<ul>' + (b.x || []).map(x => '<li>' + inline(x) + '</li>').join('') + '</ul>'; break;
        case 'ol': h += '<ol>' + (b.x || []).map(x => '<li>' + inline(x) + '</li>').join('') + '</ol>'; break;
        case 'table': {
          h += '<div style="overflow-x:auto"><table class="tbl"><thead><tr>' +
            b.head.map(x => '<th>' + inline(x) + '</th>').join('') + '</tr></thead><tbody>';
          b.rows.forEach(r => {
            h += '<tr>' + r.map((c, i) => '<td>' + (i === 0 ? '<strong>' + inline(c) + '</strong>' : inline(c)) + '</td>').join('') + '</tr>';
          });
          h += '</tbody></table></div>';
          break;
        }
        case 'code':
          h += codeBox(b.x, { lang: lang, run: b.run !== false, out: b.out, label: b.label, fileName: b.file });
          break;
        case 'note': h += callout('note', '💡', b.x); break;
        case 'warn': h += callout('warn', '⚠️', b.x); break;
        case 'tip': h += callout('tip', '✅', b.x); break;
        case 'principle': h += callout('principle', '🎯', b.x); break;
        default: if (b.x) h += '<p>' + inline(b.x) + '</p>';
      }
    });
    return h;
  }

  const CI = { note: '💡', warn: '⚠️', tip: '✅', principle: '🎯' };
  function callout(kind, icon, html) {
    return '<div class="callout ' + kind + '"><span class="ci">' + (icon || CI[kind] || '💡') +
      '</span><div>' + inline(html) + '</div></div>';
  }

  /* ---------------- Toast / Modal ---------------- */
  function toast(msg, type) {
    const wrap = document.getElementById('toast-wrap');
    if (!wrap) return;
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'ok' ? ' ok' : type === 'bad' ? ' bad' : '');
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(-6px)'; }, 2300);
    setTimeout(() => el.remove(), 2700);
  }

  function modal(html, opts) {
    opts = opts || {};
    const root = document.getElementById('modal-root');
    root.innerHTML = '<div class="modal-mask" data-close="1"><div class="modal" style="max-width:' +
      (opts.width || 520) + 'px">' + html + '</div></div>';
    const mask = root.firstChild;
    mask.addEventListener('click', e => {
      if (e.target.getAttribute('data-close') === '1' && opts.dismissable !== false) closeModal();
    });
    return root.querySelector('.modal');
  }
  function closeModal() {
    const root = document.getElementById('modal-root');
    if (root) root.innerHTML = '';
  }

  /* ---------------- 小部件 ---------------- */
  function ring(pct, size, color) {
    size = size || 84;
    const r = (size - 10) / 2, c = 2 * Math.PI * r;
    const off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" style="transform:rotate(-90deg)">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="#eef2f8" stroke-width="8"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + (color || '#2f6be0') +
      '" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
      '</svg>';
  }

  function heatmap(dayMap, weeks) {
    weeks = weeks || 16;
    const today = new Date();
    const cells = [];
    // 从 weeks 周前的周日开始
    const start = new Date(today);
    start.setDate(start.getDate() - ((today.getDay()) + (weeks - 1) * 7));
    const cur = new Date(start);
    let h = '';
    let count = 0;
    for (let i = 0; i < weeks * 7; i++) {
      const key = fmtDate(cur);
      const rec = dayMap[key];
      let cls = 'hm-cell';
      if (rec && rec.checkin) {
        const score = (rec.lessons || 0) + (rec.solved || 0) / 2;
        cls += score >= 6 ? ' l4' : score >= 3 ? ' l3' : score >= 1 ? ' l2' : ' l1';
      }
      if (key === fmtDate(today)) cls += ' today';
      h += '<div class="' + cls + '" data-day="' + key + '" title="' + key + (rec && rec.checkin ? ' · 已打卡' : '') + '"></div>';
      count++;
      cur.setDate(cur.getDate() + 1);
    }
    return '<div class="heatmap">' + h + '</div>' +
      '<div class="hm-legend"><span>少</span><i class="hm-cell" style="width:10px;height:10px"></i>' +
      '<i class="hm-cell l2" style="width:10px;height:10px"></i><i class="hm-cell l3" style="width:10px;height:10px"></i>' +
      '<i class="hm-cell l4" style="width:10px;height:10px"></i><span>多</span></div>';
  }
  function fmtDate(d) {
    const p = n => (n < 10 ? '0' : '') + n;
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function diffHint(got, want) {
    const g = String(got == null ? '' : got).replace(/\r/g, '').trim();
    const w = String(want == null ? '' : want).replace(/\r/g, '').trim();
    if (g === w) return '';
    const gl = g.split('\n'), wl = w.split('\n');
    const tips = [];
    if (gl.length !== wl.length) tips.push('行数不一致：你输出 ' + gl.length + ' 行，期望 ' + wl.length + ' 行');
    for (let i = 0; i < Math.min(gl.length, wl.length); i++) {
      if (gl[i].replace(/\s+$/, '') !== wl[i].replace(/\s+$/, '')) {
        tips.push('第 ' + (i + 1) + ' 行不同：你的是 <code>' + esc(gl[i]) + '</code>，期望 <code>' + esc(wl[i]) + '</code>');
        break;
      }
    }
    if (!tips.length) tips.push('内容几乎一样，检查一下空格、换行或大小写');
    return tips.join('；');
  }

  /* ---------------- 编辑器 ---------------- */
  function mountEditor(box, opts) {
    const lang = opts.lang || 'python';
    const taId = 'ta' + Math.random().toString(36).slice(2, 8);
    box.innerHTML =
      '<div class="editor">' +
        '<div class="editor-head"><span>' + esc(opts.file || ('main.' + extOf(lang))) + '</span><span class="sp"></span>' +
        '<span class="kbd">Ctrl + Enter 运行</span></div>' +
        '<div class="editor-body"><div class="gutter" data-gutter></div>' +
        '<textarea spellcheck="false" id="' + taId + '"></textarea></div>' +
        '<div class="editor-foot"><button class="btn btn-primary btn-sm" data-act="run">▶ 运行</button>' +
        '<button class="btn btn-ghost btn-sm" data-act="reset">重置代码</button>' +
        '<span class="sp"></span><span class="hintline">' + esc(opts.hint || '') + '</span></div>' +
      '</div>' +
      '<div data-result></div>';

    const ta = box.querySelector('textarea');
    const gutter = box.querySelector('[data-gutter]');
    ta.value = opts.code || '';
    function sync() {
      const lines = ta.value.split('\n').length;
      let g = '';
      for (let i = 1; i <= Math.max(lines, 8); i++) g += i + '\n';
      gutter.textContent = g;
      ta.style.height = 'auto';
      ta.style.height = Math.max(150, ta.scrollHeight + 4) + 'px';
    }
    ta.addEventListener('input', sync);
    ta.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
        sync();
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (opts.onRun) opts.onRun(ta.value);
      }
    });
    box.querySelector('[data-act="reset"]').addEventListener('click', () => {
      ta.value = opts.code || ''; sync();
    });
    box.querySelector('[data-act="run"]').addEventListener('click', () => {
      if (opts.onRun) opts.onRun(ta.value);
    });
    sync();
    return { getValue: () => ta.value, setValue: v => { ta.value = v; sync(); }, textarea: ta };
  }

  function extOf(lang) {
    return { python: 'py', c: 'c', cpp: 'cpp', java: 'java', javascript: 'js' }[lang] || 'txt';
  }

  function renderRun(el, r) {
    if (!el) return;
    const kind = r.ok ? 'ok' : 'bad';
    let body = '';
    if (r.phase === 'compile' && r.err) {
      body = '<div style="font-size:12.5px;color:#a83232;margin-bottom:6px">编译没有通过：</div><pre>' + esc(r.err) + '</pre>';
    } else if (r.ok) {
      body = '<pre>' + esc(r.out || '(没有输出)') + '</pre>';
    } else {
      body = r.err ? '<pre>' + esc(r.err) + '</pre>' : '<div>没有执行结果</div>';
    }
    el.innerHTML = '<div class="runpanel ' + kind + '">' +
      '<div class="rp-head">' + (r.ok ? '✓ 运行成功' : '✕ 运行失败') +
      '<span style="margin-left:auto;font-weight:500;font-size:11.5px;opacity:.8">' + esc(r.note || '') + '</span></div>' +
      '<div class="rp-body">' + body + '</div></div>';
  }

  return {
    esc, hl, inline, codeBox, blocksHtml, callout, toast, modal, closeModal,
    ring, heatmap, diffHint, mountEditor, renderRun, fmtDate,
    putCode, getCode, resetStore, extOf
  };
})();
