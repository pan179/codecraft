/* ============================================================
   CodeCraft · 核心逻辑（纯函数，不依赖 DOM）
   计划生成 / 进度范围 / 每日打卡出题 / 答案比对
   ============================================================ */
window.CORE = (function () {
  'use strict';

  /* ---------------- 基础工具 ---------------- */
  function fmtDate(d) {
    const p = n => (n < 10 ? '0' : '') + n;
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function todayKey() { return fmtDate(new Date()); }
  function parseDate(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
    if (!m) return new Date();
    return new Date(+m[1], +m[2] - 1, +m[3]);
  }
  function diffDays(a, b) {
    const d1 = parseDate(a), d2 = parseDate(b);
    return Math.round((d2 - d1) / 86400000);
  }
  function addDays(s, n) {
    const d = parseDate(s);
    d.setDate(d.getDate() + n);
    return fmtDate(d);
  }
  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rnd) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------------- 课程索引 ---------------- */
  const idxCache = {};
  function index(lang) {
    if (idxCache[lang.id]) return idxCache[lang.id];
    const CH = {}, LMAP = {}, ALL = [], QMAP = {}, KMAP = {}, CH_Q = {}, CH_K = {};
    lang.chapters.forEach((c, ci) => {
      const chapter = Object.assign({}, c, { idx: ci });
      CH[c.id] = chapter;
      c.lessons.forEach((l, li) => {
        const item = Object.assign({}, l, {
          ch: c.id, chTitle: c.title, chNum: c.num != null ? c.num : ci + 1,
          chIdx: ci, li: li, flat: ALL.length
        });
        LMAP[l.id] = item;
        ALL.push(item);
      });
    });
    (lang.quiz || []).forEach(q => { QMAP[q.id] = q; (CH_Q[q.ch] = CH_Q[q.ch] || []).push(q); });
    (lang.checkin || []).forEach(q => { KMAP[q.id] = q; (CH_K[q.ch] = CH_K[q.ch] || []).push(q); });

    const ix = { CH, LMAP, ALL, QMAP, KMAP, CH_Q, CH_K, chapters: lang.chapters };
    idxCache[lang.id] = ix;
    return ix;
  }

  /* ---------------- 学习计划 ----------------
     规则：
     · 天数少 → 每天多学几课（最多 4 课/天）
     · 天数多 → 每天 1 课，多余的天变成「复习日 / 冲刺日」
     · 每 4 个学习日插一个复习日（如果还有余量）
  */
  function buildPlan(lang, days) {
    const ix = index(lang);
    const lessons = ix.ALL;
    const N = Math.max(3, Math.min(200, Math.floor(days) || 14));

    let learnWanted = N;
    if (N >= 10) learnWanted = Math.round(N * 0.84);
    if (N >= 30) learnWanted = Math.round(N * 0.8);
    learnWanted = Math.max(learnWanted, Math.ceil(lessons.length / 4));
    learnWanted = Math.min(learnWanted, Math.max(1, lessons.length));
    const learnDays = Math.max(1, Math.min(N, learnWanted));

    // 均衡切分课时
    const base = Math.floor(lessons.length / learnDays);
    const rem = lessons.length % learnDays;
    const chunks = [];
    let p = 0;
    for (let i = 0; i < learnDays; i++) {
      const size = base + (i < rem ? 1 : 0);
      chunks.push(lessons.slice(p, p + size));
      p += size;
    }

    const list = [];
    let n = 0;
    chunks.forEach((ch, i) => {
      if (!ch.length) return;
      list.push({
        n: ++n, type: 'learn',
        title: ch.map(l => l.title).join(' + ').slice(0, 80),
        chIds: uniq(ch.map(l => l.ch)),
        lessons: ch.map(l => ({ id: l.id, title: l.title, ch: l.ch, time: l.time || 10 })),
        desc: ch.length > 1
          ? '先读 ' + ch[0].title + ' 的讲解 → 跑示例 → 再看 ' + ch[ch.length - 1].title + '，最后做本章测试'
          : '读讲解 → 跑示例代码 → 做本章测试题，把这一课真正拿下来'
      });
    });

    const rest = N - list.length;
    if (rest > 0) {
      const reviewCount = Math.min(rest, Math.max(1, Math.round(rest * 0.42)));
      const sprintCount = rest - reviewCount;
      const chs = lang.chapters.map(c => c.id);

      /* 先按「复习 / 冲刺」交替生成额外日 */
      const extras = [];
      let r = reviewCount, sp = sprintCount, k = 0;
      while (extras.length < rest) {
        if ((k % 2 === 0 && r > 0) || sp === 0) { extras.push('review'); r--; }
        else { extras.push('sprint'); sp--; }
        k++;
      }

      /* 均匀分配到 n+1 个插槽里，再倒序插入，保证下标不被打乱 */
      const n = list.length;
      const buckets = [];
      for (let i = 0; i <= n; i++) buckets.push([]);
      extras.forEach((type, i) => {
        /* 位置取 1..n：永远排在学习日之后，第 1 天一定是学习日 */
        let pos = extras.length === 1
          ? Math.max(1, Math.floor(n / 2))
          : 1 + Math.round(i * (n - 1) / (extras.length - 1));
        buckets[Math.max(1, Math.min(n, pos))].push(type);
      });

      let sprintRound = 0;
      for (let p = n; p >= 0; p--) {
        const types = buckets[p];
        if (!types.length) continue;
        const prev = list[Math.max(0, p - 1)];
        const chIds = uniq(prev && prev.chIds && prev.chIds.length ? prev.chIds : [chs[0]]);
        const days = types.map(type => {
          if (type === 'review') {
            const c = ix.CH[chIds[0]];
            return {
              n: 0, type: 'review',
              title: '复习日 · ' + (c ? c.title : '错题清零'),
              chIds: chIds,
              lessons: [],
              desc: '把错题本里这几章的题重做一遍，错的题才是真正的知识盲区；再回读一遍最不熟的那一课'
            };
          }
          const chId = chs[sprintRound % chs.length];
          const c = ix.CH[chId];
          sprintRound++;
          return {
            n: 0, type: 'sprint',
            title: '冲刺 · ' + (c ? c.title : lang.name) + (sprintRound > chs.length ? ' 加练' : ''),
            chIds: [chId],
            lessons: [],
            desc: '从本章随机抽题连做，做完看错题解析；这一天的目标是「不用翻笔记也能写对」'
          };
        });
        list.splice.apply(list, [p, 0].concat(days));
      }
    }

    list.forEach((d, i) => { d.n = i + 1; });
    return {
      lang: lang.id, days: list.length, requested: N,
      learnDays: list.filter(d => d.type === 'learn').length,
      plan: list
    };
  }

  function uniq(a) {
    const out = [];
    a.forEach(x => { if (out.indexOf(x) < 0) out.push(x); });
    return out;
  }

  /* ---------------- 进度 ---------------- */
  function doneCount(lang, st) {
    const ix = index(lang);
    return ix.ALL.filter(l => st.done[l.id]).length;
  }
  function chapterPct(lang, st, chId) {
    const ix = index(lang);
    const ls = ix.CH[chId] ? ix.CH[chId].lessons : [];
    if (!ls.length) return 0;
    return Math.round(ls.filter(l => st.done[l.id]).length / ls.length * 100);
  }
  function overallPct(lang, st) {
    const ix = index(lang);
    const lp = ix.ALL.length ? doneCount(lang, st) / ix.ALL.length : 0;
    const qt = (lang.quiz || []).length || 1;
    const qp = Math.min(1, Object.keys(st.solved).length / qt);
    return Math.round((lp * 0.55 + qp * 0.45) * 100);
  }
  /* 已学范围：最后一个已读课时所在章节（含）之前的所有章节 */
  function learnedChapters(lang, st) {
    const ix = index(lang);
    let lastIdx = -1;
    ix.ALL.forEach(l => { if (st.done[l.id]) lastIdx = Math.max(lastIdx, l.chIdx); });
    if (lastIdx < 0) lastIdx = 0;
    return lang.chapters.slice(0, lastIdx + 1).map(c => c.id);
  }
  function nextLesson(lang, st) {
    const ix = index(lang);
    for (const l of ix.ALL) if (!st.done[l.id]) return l;
    return ix.ALL[ix.ALL.length - 1] || null;
  }
  function streak(st) {
    let c = 0;
    const d = new Date();
    for (let i = 0; i < 730; i++) {
      const rec = st.days[fmtDate(d)];
      if (rec && rec.checkin) c++;
      else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return c;
  }
  function planDayOf(plan, startDate, dateKey) {
    if (!plan || !plan.plan || !plan.plan.length) return null;
    const d = diffDays(startDate, dateKey || todayKey());
    const i = Math.max(0, Math.min(plan.plan.length - 1, d));
    return plan.plan[i];
  }
  function dayDone(st, day) {
    if (!day) return false;
    if (day.type === 'learn') return day.lessons.length > 0 && day.lessons.every(l => st.done[l.id]);
    return false;
  }

  /* ---------------- 每日打卡出题 ----------------
     硬性约束：打卡题库（checkin）与章节测试题库（quiz）完全隔离
     —— 不同 id、不同题干，且再按 id 交叉过滤一次防呆。
  */
  const LEVELS = {
    easy:   { name: '轻松', total: 4, theory: 2, code: 1, desc: '每天 4 题，适合忙碌日，保持手感不断档' },
    normal: { name: '标准', total: 6, theory: 3, code: 2, desc: '每天 6 题，默认节奏，稳扎稳打' },
    hard:   { name: '挑战', total: 8, theory: 4, code: 3, desc: '每天 8 题，含更多实景编程，进步最快' }
  };

  function pickCheckin(lang, st, dateKey, level) {
    const ix = index(lang);
    const cfg = LEVELS[level] || LEVELS.normal;
    const quizIds = new Set(Object.keys(ix.QMAP));
    const scope = learnedChapters(lang, st);
    const near = st.daily[dateKey];

    // 最近两天出过的题往后排，避免连着重复
    const recent = new Set();
    [addDays(dateKey, -1), addDays(dateKey, -2)].forEach(dk => {
      const rec = st.daily[dk];
      if (rec && rec.qids) rec.qids.forEach(id => recent.add(id));
    });

    let pool = (lang.checkin || []).filter(q => scope.indexOf(q.ch) >= 0 && !quizIds.has(q.id));
    if (pool.length < cfg.total + 2) {
      // 已学章节的题不够一天用时，放宽到全书（但仍不碰章节测试题）
      pool = (lang.checkin || []).filter(q => !quizIds.has(q.id));
    }
    const rnd = mulberry32(hashStr(lang.id + '|' + dateKey + '|' + level));
    const fresh = shuffle(pool.filter(q => !recent.has(q.id)), rnd);
    const older = shuffle(pool.filter(q => recent.has(q.id)), rnd);
    const ordered = fresh.concat(older);

    const picked = [];
    const takeOne = fn => {
      for (const q of ordered) {
        if (picked.indexOf(q) >= 0) continue;
        if (fn(q)) { picked.push(q); return true; }
      }
      return false;
    };

    // 1) 先保证一道实景编程题
    takeOne(q => q.type === 'code' && q.scene);
    // 2) 再补编程题到配额
    for (let i = 0; i < cfg.code && picked.filter(q => q.type === 'code').length < cfg.code; i++) {
      takeOne(q => q.type === 'code');
    }
    // 3) 理论题：选择 / 输出预测交替
    let guard = 0;
    while (picked.filter(q => q.type !== 'code').length < cfg.theory && guard < 40) {
      guard++;
      const wantChoice = picked.filter(q => q.type !== 'code').length % 2 === 0;
      if (!takeOne(q => q.type !== 'code' && (wantChoice ? q.type === 'choice' : q.type === 'output'))) {
        if (!takeOne(q => q.type !== 'code')) break;
      }
    }
    // 4) 不够就随便补
    while (picked.length < cfg.total && picked.length < ordered.length) {
      if (!takeOne(() => true)) break;
    }

    const out = shuffle(picked, rnd);
    // 最终防呆：绝对不能出现章节测试同 id 的题
    return out.filter(q => !quizIds.has(q.id)).map(q => q.id);
  }

  /* ---------------- 题库隔离自检 ---------------- */
  function auditBank(lang) {
    const quiz = lang.quiz || [], chk = lang.checkin || [];
    const qid = new Set(quiz.map(q => q.id));
    const kid = new Set(chk.map(q => q.id));
    const dupId = [...kid].filter(id => qid.has(id));
    const norm = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, '');
    const qp = new Map(quiz.map(q => [norm(q.prompt) + '|' + norm(q.code || ''), q.id]));
    const dupPrompt = [];
    chk.forEach(q => {
      const k = norm(q.prompt) + '|' + norm(q.code || '');
      if (qp.has(k)) dupPrompt.push(q.id + ' ↔ ' + qp.get(k));
    });
    const missingQuizCh = quiz.filter(q => !index(lang).CH[q.ch]).map(q => q.id);
    const missingChkCh = chk.filter(q => !index(lang).CH[q.ch]).map(q => q.id);
    return { quiz: quiz.length, checkin: chk.length, dupId, dupPrompt, missingQuizCh, missingChkCh,
             ok: !dupId.length && !dupPrompt.length && !missingQuizCh.length && !missingChkCh.length };
  }

  /* ---------------- 答案比对 ---------------- */
  function normalizeOut(s) {
    return String(s == null ? '' : s)
      .replace(/\r\n?/g, '\n')
      .split('\n').map(l => l.replace(/[ \t]+$/g, '')).join('\n')
      .replace(/^\n+/, '').replace(/\n+$/, '');
  }
  function sameOut(got, want) {
    return normalizeOut(got) === normalizeOut(want);
  }

  return {
    fmtDate, todayKey, parseDate, diffDays, addDays, hashStr, mulberry32, shuffle,
    index, buildPlan, LEVELS,
    doneCount, chapterPct, overallPct, learnedChapters, nextLesson, streak,
    planDayOf, dayDone, pickCheckin, auditBank, normalizeOut, sameOut
  };
})();
