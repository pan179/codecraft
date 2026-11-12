/* ============================================================
   CodeCraft 数据 · JavaScript（8 章 36 课）
   ============================================================ */
window.LANGS = window.LANGS || {};

window.LANGS.javascript = {
  id: 'javascript', name: 'JavaScript', en: 'JavaScript (ES2023)', icon: '🌐', color: '#f0db4f',
  blurb: '唯一能在浏览器里跑的语言。前端离不开它，后端也能用 Node.js，学会它就能做出看得见摸得着的东西。',
  hello: 'console.log("Hello, JavaScript!");\nconsole.log("今天开始学编程");',
  lab: [
    { name: 'Hello World', code: 'console.log("Hello, JavaScript!");\nconsole.log(3 + 4);\nconsole.log("3" + 4);' },
    { name: '数组方法链', code: 'const nums = [1, 2, 3, 4, 5, 6];\nconst r = nums.filter(n => n % 2 === 0).map(n => n * n);\nconsole.log(r.join(","));' },
    { name: '对象与解构', code: 'const user = { name: "小明", age: 19 };\nconst { name, age = 0 } = user;\nconsole.log(`${name} 今年 ${age} 岁`);' },
    { name: '一个 Promise', code: 'const p = new Promise(r => setTimeout(() => r("拿到结果"), 50));\np.then(v => console.log(v));' }
  ],
  chapters: [
    {
      id: 'js1', num: 1, title: '语言基础', icon: '🚀',
      intro: 'JavaScript 是动态类型、弱类型的语言：变量不声明类型，运算时会自动转换。这带来便利，也带来一堆「为什么是 34」的困惑。这一章把这些规则讲清楚。',
      goals: ['说清 let / const / var 的区别', '认识七种原始类型与 typeof 的坑', '理解 == 与 === 的差别', '用模板字符串和常用字符串方法'],
      lessons: [
        {
          id: 'js1l1', title: '它在哪里运行：浏览器与 Node', key: 'console · 运行环境', time: 10,
          blocks: [
            { t: 'p', x: 'JavaScript 由**引擎**执行：浏览器里是 V8 / SpiderMonkey，服务器上是 Node.js。语言本身只有语法和内置对象（Array、Object、Promise），`document`、`window` 是浏览器额外给的，`fs`、`process` 是 Node 额外给的。' },
            { t: 'code', x: 'console.log("Hello, JavaScript!");\nconsole.log(3 + 4);          // 数字相加\nconsole.log("3" + "4");      // 字符串拼接\nconsole.log("3" + 4);        // 一边是字符串 → 拼接\nconsole.log(3 + "4" - 1);    // 先拼成 "34"，减号又转回数字\nconsole.log("总分", 95, "分");', out: 'Hello, JavaScript!\n7\n34\n34\n33\n总分 95 分' },
            { t: 'p', x: '最后一行 `console.log` 可以传多个参数，会**用空格连起来**打印。而 `+` 是运算，两边都是数字才做加法——这就是为什么 `"3" + 4` 得 `"34"`。' },
            { t: 'table', head: ['环境', '有什么', '没什么'], rows: [
              ['浏览器', '`document` `window` `localStorage` `fetch`', '文件系统、进程'],
              ['Node.js', '`fs` `process` `http`', '`document`、DOM 事件'],
              ['两者都有', '语法、Array、Object、Promise、JSON、`fetch`', '—']
            ] },
            { t: 'note', x: '本页的代码运行在浏览器沙箱里，所以 DOM 示例（`document.querySelector`）在这里跑不了，需要在真实浏览器里试。纯逻辑代码则可以正常运行。' },
            { t: 'warn', x: '`console.log` 是调试工具，不是输出语句。它打印的是对象的**引用快照**，在浏览器控制台里展开时可能已经变了。要确认某一刻的值，请 `JSON.parse(JSON.stringify(x))` 或 `console.log(JSON.stringify(x))`。' }
          ]
        },
        {
          id: 'js1l2', title: 'let、const 与 var', key: '声明 · 块级作用域', time: 12,
          blocks: [
            { t: 'p', x: '**默认用 `const`，需要重新赋值才用 `let`，别用 `var`。** 这不是风格偏好：`var` 有变量提升和函数作用域两个历史包袱，会让代码行为变得难以预料。' },
            { t: 'code', x: 'var a = 1;\nlet b = 2;\nconst c = 3;\n\n{\n  var a = 10;    // var 不认块，改的是外面的 a\n  let b = 20;    // let 是块级作用域，这是新的 b\n}\n\nconsole.log(a, b, c);\nconsole.log(typeof d);   // 未声明也不会抛错（typeof 特殊）', out: '10 2 3\nundefined' },
            { t: 'table', head: ['对比项', 'var', 'let', 'const'], rows: [
              ['作用域', '函数级', '块级 `{}`', '块级 `{}`'],
              ['重复声明', '允许', '报错', '报错'],
              ['变量提升', '提升为 undefined', '提升但不可访问（TDZ）', '同 let'],
              ['必须初始化', '否', '否', '**是**'],
              ['能否改值', '能', '能', '不能（但对象内容能改）']
            ] },
            { t: 'code', x: 'const user = { name: "小明" };\nuser.name = "小红";        // 可以：改的是对象内容\nconsole.log(user.name);\n\ntry {\n  user = {};               // 不行：不能重新绑定\n} catch (e) {\n  console.log(e.name);\n}\n\nconst arr = [1, 2];\narr.push(3);               // 可以\nconsole.log(arr.join(","));', out: '小红\nTypeError\n1,2,3' },
            { t: 'warn', x: '`const` 锁的是**绑定**，不是内容。要真正冻结对象用 `Object.freeze(obj)`（浅冻结，嵌套对象还能改）。' },
            { t: 'note', x: '`for (let i = 0; ...)` 每轮循环都会创建新的 i，所以闭包能记住当轮的值；`var` 则共享同一个 i，回调里全是最终值。这个差别是无数 bug 的源头。' }
          ]
        },
        {
          id: 'js1l3', title: '七种原始类型与类型转换', key: 'typeof · Number · Boolean', time: 14,
          blocks: [
            { t: 'p', x: '原始类型有 7 种：`number`、`string`、`boolean`、`undefined`、`null`、`symbol`、`bigint`。除此之外都是**对象**（包括数组和函数）。`typeof` 能区分大部分，但有一个著名的坑。' },
            { t: 'code', x: 'console.log(typeof 1, typeof "a", typeof true);\nconsole.log(typeof undefined, typeof null);\nconsole.log(typeof [], typeof {}, typeof function () {});\nconsole.log(typeof 10n, typeof Symbol("s"));', out: 'number string boolean\nundefined object\nobject object function\nbigint symbol' },
            { t: 'warn', x: '**`typeof null` 是 `"object"`**，这是 1995 年留下的 bug，因为修它会破坏无数老代码，所以永远保留了下来。判断 null 要用 `x === null`。' },
            { t: 'h', x: '显式转换：三种最常用' },
            { t: 'code', x: 'console.log(Number("42"), Number("  42  "), Number(""));\nconsole.log(String(Number("abc")), Number(null), String(Number(undefined)));\nconsole.log(parseInt("42px"), parseFloat("3.14abc"));\nconsole.log(String(42), (255).toString(16));\nconsole.log(Boolean(0), Boolean(""), Boolean("0"), Boolean([]));', out: '42 42 0\nNaN 0 NaN\n42 3.14\n42 ff\nfalse false true true' },
            { t: 'table', head: ['值', 'Boolean(x)', '说明'], rows: [
              ['`0` / `-0`', 'false', '唯一的假数字'],
              ['`NaN`', 'false', '不是数字，也是假'],
              ['`""`', 'false', '空字符串'],
              ['`"0"` / `"false"`', '**true**', '非空字符串都是真'],
              ['`null` / `undefined`', 'false', '—'],
              ['`[]` / `{}`', '**true**', '对象永远是真（哪怕空）']
            ] },
            { t: 'note', x: '`parseInt` 会从开头一直解析到第一个非法字符，所以 `"42px"` 得 42；`Number` 则是「整体必须能转」，所以 `"42px"` 得 `NaN`。这两个用途不同，别混。' },
            { t: 'principle', x: '**`NaN` 不等于自己**：`NaN === NaN` 是 false。判断用 `Number.isNaN(x)`，别用 `x === NaN`。' }
          ]
        },
        {
          id: 'js1l4', title: '== 与 ===：只用一个', key: '相等 · 隐式转换', time: 12,
          blocks: [
            { t: 'p', x: '`==` 会先做类型转换再比较，`===` 要求类型和值都相同。**业务代码里永远用 `===`**，`==` 只在一个地方有用：`x == null` 能同时判断 null 和 undefined。' },
            { t: 'code', x: 'console.log(1 == "1", 1 === "1");\nconsole.log(null == undefined, null === undefined);\nconsole.log(0 == false, 0 === false);\nconsole.log("" == 0, "" === 0);\nconsole.log([] == false, [] === false);\nconsole.log(NaN === NaN, Number.isNaN(NaN));', out: 'true false\ntrue false\ntrue false\ntrue false\ntrue false\nfalse true' },
            { t: 'table', head: ['写法', '结果', '原因'], rows: [
              ['`1 == "1"`', 'true', '字符串被转成数字'],
              ['`0 == false`', 'true', '两边都转成数字 0'],
              ['`"" == 0`', 'true', '空字符串转成 0'],
              ['`[] == false`', 'true', '`[]` 转成 ""，再转成 0'],
              ['`null == 0`', '**false**', 'null 只和 undefined 相等'],
              ['`NaN == NaN`', 'false', 'NaN 不等于任何值']
            ] },
            { t: 'code', x: 'const v = undefined;\nconsole.log(v == null);        // 同时覆盖 null 和 undefined\nconsole.log(v === null);\nconsole.log(Object.is(NaN, NaN));\nconsole.log(Object.is(0, -0), 0 === -0);', out: 'true\nfalse\ntrue\nfalse true' },
            { t: 'note', x: '`Object.is` 和 `===` 几乎一样，区别只有两处：`Object.is(NaN, NaN)` 是 true，`Object.is(0, -0)` 是 false。它主要用于框架内部精确比较。' },
            { t: 'warn', x: '**`if (x)` 和 `if (x === true)` 不是一回事。** `x` 是 `"false"` 字符串时前者为真、后者为假。判断布尔值请明确写 `x === true` 或 `Boolean(x)`。' }
          ]
        },
        {
          id: 'js1l5', title: '模板字符串与字符串方法', key: '反引号 · 常用方法', time: 12,
          blocks: [
            { t: 'p', x: '模板字符串用反引号，能插值、能换行：`${表达式}`。比 `"a" + b + "c"` 清楚得多，也不需要为换行写 `\\n`。' },
            { t: 'code', x: 'const name = "小明", score = 92.456;\nconsole.log(`我是 ${name}，得分 ${score.toFixed(1)}`);\nconsole.log(`1 + 2 = ${1 + 2}`);\n\nconst s = "  Hello World  ";\nconsole.log(`[${s.trim()}]`);\nconsole.log(s.trim().toLowerCase());\nconsole.log(s.includes("World"));\nconsole.log("a-b-c".split("-").join("|"));\nconsole.log("abc".padStart(6, "*"));\nconsole.log("hello".at(-1));\nconsole.log("x".repeat(3));', out: '我是 小明，得分 92.5\n1 + 2 = 3\n[Hello World]\nhello world\ntrue\na|b|c\n***abc\no\nxxx' },
            { t: 'table', head: ['方法', '作用', '注意'], rows: [
              ['`trim()`', '去掉首尾空白', '返回新字符串'],
              ['`split(sep)`', '切成数组', 'sep 可以是字符串或正则'],
              ['`slice(a, b)`', '截取 `[a, b)`', '支持负数下标'],
              ['`includes(str)`', '是否包含', '区分大小写'],
              ['`padStart(n, c)`', '左侧补到 n 位', '对齐、补零很方便'],
              ['`at(i)`', '支持负下标取字符', '`at(-1)` 是最后一个']
            ] },
            { t: 'code', x: 'const price = 3.5, qty = 3;\nconsole.log(`合计：${(price * qty).toFixed(2)} 元`);\nconsole.log("2024-03-01".split("-").map(Number).join("/"));\nconsole.log("13812345678".slice(0, 3) + "****" + "13812345678".slice(-4));', out: '合计：10.50 元\n2024/3/1\n138****5678' },
            { t: 'warn', x: '字符串**不可变**，所有方法都返回新字符串。`s.trim();` 不接收返回值等于什么都没做。' },
            { t: 'tip', x: '手机号脱敏这种需求，用 `slice(0,3) + "****" + slice(-4)` 比正则更好读。先把 `slice` 的负下标用熟。' }
          ]
        }
      ]
    },
    {
      id: 'js2', num: 2, title: '函数与作用域', icon: '🧩',
      intro: 'JavaScript 里函数是「一等公民」：可以赋值、可以传参、可以返回。这一章讲清三种函数写法、作用域链、闭包，以及最容易被问倒的 `this`。',
      goals: ['区分函数声明、函数表达式、箭头函数', '用默认参数与 rest 参数写灵活接口', '解释变量提升与暂时性死区', '用闭包保存状态、写私有变量', '说清 this 的四种绑定'],
      lessons: [
        {
          id: 'js2l1', title: '三种函数写法', key: '声明 · 表达式 · 箭头', time: 14,
          blocks: [
            { t: 'p', x: '函数声明会被**整体提升**，可以在定义之前调用；函数表达式赋给变量，必须先定义后用；箭头函数是简写，但它**没有自己的 this**。' },
            { t: 'code', x: 'console.log(hoisted());        // 声明可以先用\n\nfunction hoisted() {\n  return "函数声明：提升了";\n}\n\nconst expr = function (a, b) { return a + b; };\nconst arrow = (a, b) => a + b;          // 单表达式可省略 return\nconst square = x => x * x;              // 单参数可省略括号\nconst obj = () => ({ ok: true });       // 返回对象要包一层括号\n\nconsole.log(expr(1, 2), arrow(3, 4), square(5));\nconsole.log(obj().ok);', out: '函数声明：提升了\n3 7 25\ntrue' },
            { t: 'table', head: ['写法', '提升', '`this`', '能否 new', '适合'], rows: [
              ['`function f(){}`', '整体提升', '调用时决定', '能', '需要提升、需要 this'],
              ['`const f = function(){}`', '只提升变量（TDZ）', '调用时决定', '能', '按条件定义、作回调'],
              ['`const f = () => {}`', '只提升变量（TDZ）', '**继承外层**', '不能', '回调、数组方法、短函数']
            ] },
            { t: 'code', x: 'const o = {\n  name: "小明",\n  normal() { return this.name; },\n  arrow: () => (this && this.name) || "没有 this"   // 箭头函数没有自己的 this\n};\nconsole.log(o.normal());\nconsole.log(o.arrow());', out: '小明\n没有 this' },
            { t: 'warn', x: '**箭头函数不能当方法用。** `o.arrow()` 里的 `this` 不是 `o`，而是定义时外层的 `this`（模块顶层是 undefined）。方法一律用普通函数或简写 `normal() {}`。' },
            { t: 'note', x: '箭头函数另一个方便之处：在回调里能直接用外层 `this`，不用写 `const self = this`。这也是它最开始的用途。' }
          ]
        },
        {
          id: 'js2l2', title: '参数：默认值、rest 与 arguments', key: '默认参数 · ...rest', time: 12,
          blocks: [
            { t: 'p', x: 'JS 不检查参数个数：少传是 `undefined`，多传会被忽略（但能用 rest 收集）。**默认参数只在传 `undefined` 时生效**，传 `null` 不会触发。' },
            { t: 'code', x: 'function greet(name = "朋友") {\n  return `你好，${name}`;\n}\nconsole.log(greet());\nconsole.log(greet("小明"));\nconsole.log(greet(null));       // null 不触发默认值\n\nfunction sum(...nums) {\n  return nums.reduce((a, b) => a + b, 0);\n}\nconsole.log(sum(1, 2, 3), sum());\n\nfunction spread(a, b, c) { return a + b + c; }\nconsole.log(spread(...[1, 2, 3]));', out: '你好，朋友\n你好，小明\n你好，null\n6 0\n6' },
            { t: 'code', x: 'function oldStyle() {\n  return arguments.length;      // 老写法：类数组，不是真数组\n}\nconsole.log(oldStyle(1, 2, 3));\n\nfunction withDefaults(a = 1, b = a * 2) {   // 后面的默认值能引用前面的参数\n  return [a, b];\n}\nconsole.log(withDefaults(3).join(","));', out: '3\n3,6' },
            { t: 'table', head: ['需求', '写法'], rows: [
              ['固定参数', '`function f(a, b)`'],
              ['可选参数', '`function f(a = 1)`'],
              ['任意个参数', '`function f(...rest)`'],
              ['动态转发参数', '`fn(...args)`'],
              ['参数解构', '`function f({ x, y = 0 })`']
            ] },
            { t: 'warn', x: '`arguments` 不是真数组（没有 `map`、`forEach`），新代码用 `...rest` 更省事。箭头函数里也没有 `arguments`——它会取到外层的。' },
            { t: 'tip', x: '参数超过 3 个就换成一个配置对象：`createUser({ name, age, role })`。调用时看得懂每个值是什么，加参数也不用改调用点。' }
          ]
        },
        {
          id: 'js2l3', title: '作用域、提升与 TDZ', key: '作用域链 · 暂时性死区', time: 14,
          blocks: [
            { t: 'p', x: 'JS 是**词法作用域**：函数能访问哪些变量，看它写在哪里，不看它在哪里被调用。查找变量时沿作用域链一层层往外找，找到就停。' },
            { t: 'code', x: 'var a = "外层 a";\n\nfunction outer() {\n  var b = "outer 的 b";\n  function inner() {\n    var c = "inner 的 c";\n    return [a, b, c].join(" / ");   // 三层都能拿到\n  }\n  return inner();\n}\nconsole.log(outer());', out: '外层 a / outer 的 b / inner 的 c' },
            { t: 'h', x: '提升：var 与 let 的区别' },
            { t: 'code', x: 'console.log(String(v));   // undefined：声明被提升，赋值没提\nvar v = 1;\nconsole.log(v);\n\ntry {\n  console.log(x);      // TDZ：声明提升了但还没初始化\n  let x = 2;\n} catch (e) {\n  console.log(e.name);\n}\n\nconsole.log(typeof y);  // 完全没声明过：undefined，不报错', out: 'undefined\n1\nReferenceError\nundefined' },
            { t: 'p', x: '最后两行的对比很关键：**完全没声明**的变量，`typeof` 返回 `"undefined"`；而**声明了但还在 TDZ**的变量，`typeof` 会抛 `ReferenceError`。所以 `typeof` 也不能随便用来「探测变量是否存在」。' },
            { t: 'code', x: 'const fns = [];\nfor (var i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns.map(f => f()).join(","));   // var：共享一个 i\n\nconst fns2 = [];\nfor (let j = 0; j < 3; j++) fns2.push(() => j);\nconsole.log(fns2.map(f => f()).join(","));  // let：每轮一个新 j', out: '3,3,3\n0,1,2' },
            { t: 'warn', x: '上面这 6 行就是「闭包捕获 var 导致全变成最终值」的经典案例。面试常考，实际写代码时用 `let` 就不会遇到。' },
            { t: 'principle', x: '**变量尽量声明在离使用最近的地方。** 作用域越窄，能出错的地方越少。' }
          ]
        },
        {
          id: 'js2l4', title: '闭包：带着环境一起走', key: '闭包 · 私有状态 · 工厂', time: 16,
          blocks: [
            { t: 'p', x: '**闭包 = 函数 + 它定义时所在的作用域**。函数被返回到外面之后，仍然能访问当初的那些变量。这让「私有变量」和「记住状态」成为可能。' },
            { t: 'code', x: 'function counter() {\n  let n = 0;                    // 外部访问不到\n  return {\n    inc: () => ++n,\n    get: () => n\n  };\n}\n\nconst c = counter();\nc.inc(); c.inc();\nconsole.log(c.get());\n\nconst c2 = counter();           // 每次调用都是全新的 n\nconsole.log(c2.get());', out: '2\n0' },
            { t: 'h', x: '用途一：只执行一次' },
            { t: 'code', x: 'function once(fn) {\n  let done = false, result;\n  return (...args) => {\n    if (!done) { done = true; result = fn(...args); }\n    return result;\n  };\n}\n\nconst init = once(x => {\n  console.log("只初始化一次");\n  return x * 2;\n});\nconsole.log(init(5), init(100));', out: '只初始化一次\n10 10' },
            { t: 'h', x: '用途二：带配置的函数工厂' },
            { t: 'code', x: 'const makeGreeter = greeting => name => `${greeting}，${name}`;\nconst hi = makeGreeter("你好");\nconst morning = makeGreeter("早上好");\nconsole.log(hi("小明"));\nconsole.log(morning("小红"));', out: '你好，小明\n早上好，小红' },
            { t: 'table', head: ['场景', '闭包解决什么'], rows: [
              ['私有变量', '模块内的变量外部改不到'],
              ['记忆化', '缓存已经算过的结果'],
              ['防抖节流', '保存上一次的定时器 id'],
              ['函数工厂', '预先绑定一部分参数'],
              ['React hooks', '每次渲染记住上一次的状态']
            ] },
            { t: 'warn', x: '闭包会让外层变量**一直留在内存里**，不被回收。如果闭包引用了很大的对象又长期存活，就成了内存泄漏。用完记得把引用置空。' }
          ]
        },
        {
          id: 'js2l5', title: 'this 的四种绑定', key: 'this · call/apply/bind', time: 16,
          blocks: [
            { t: 'p', x: '`this` 的值**在调用时确定**，跟定义位置无关。按优先级从高到低：`new` 绑定 > 显式绑定（call/apply/bind）> 隐式绑定（`obj.fn()`）> 默认绑定（严格模式下是 undefined）。' },
            { t: 'code', x: 'const obj = {\n  name: "小明",\n  say() { return `我是 ${this.name}`; }\n};\n\nconsole.log(obj.say());          // 隐式绑定：this = obj\n\nconst fn = obj.say;              // 函数被「摘」出来了\nconsole.log(fn === obj.say);\n\nconst bound = obj.say.bind(obj); // 显式绑定，之后永远指向 obj\nconsole.log(bound());\n\nfunction greet(greeting) { return `${greeting}，${this.name}`; }\nconsole.log(greet.call({ name: "小红" }, "你好"));\nconsole.log(greet.apply({ name: "阿伟" }, ["早上好"]));', out: '我是 小明\ntrue\n我是 小明\n你好，小红\n早上好，阿伟' },
            { t: 'table', head: ['方式', '写法', '区别'], rows: [
              ['`call`', '`fn.call(ctx, a, b)`', '参数逐个传'],
              ['`apply`', '`fn.apply(ctx, [a, b])`', '参数用数组传'],
              ['`bind`', '`const g = fn.bind(ctx)`', '返回新函数，不立即执行'],
              ['箭头函数', '没有自己的 this', '`call/apply/bind` 都改不了它']
            ] },
            { t: 'code', x: 'class Timer {\n  constructor() { this.n = 0; }\n  start() {\n    /* 普通函数作为回调，this 会丢 */\n    setTimeout(function () {\n      console.log("普通函数 this 是 Timer 吗：", this instanceof Timer);\n    }, 10);\n\n    /* 箭头函数继承外层 this，这是最常用的写法 */\n    setTimeout(() => {\n      this.n++;\n      console.log("箭头函数 this.n =", this.n);\n    }, 20);\n  }\n}\nnew Timer().start();', out: '普通函数 this 是 Timer 吗： false\n箭头函数 this.n = 1' },
            { t: 'warn', x: '**把方法当回调传出去，`this` 一定会丢。** 三种解法：`bind(this)`、箭头函数包一层、或者写成类字段 `handle = () => {}`。选定一种用到底，别混。' },
            { t: 'note', x: '「this 丢了吗」的判断方法：看调用形式。写成 `obj.fn()` 的，this 就是 obj；写成 `fn()` 的，this 是 undefined（严格模式）。跟 fn 是在哪定义的没关系。' }
          ]
        }
      ]
    },
    {
      id: 'js3', num: 3, title: '对象与原型', icon: '🧬',
      intro: 'JS 的对象本质是「键值对 + 一条原型链」。理解原型链，`class` 就只是语法糖；理解 JSON 的边界，接口联调就不会莫名其妙丢字段。',
      goals: ['用字面量、解构、展开操作对象', '读懂原型链并解释 instanceof', '用 class 写继承与 super', '分清 JSON 会丢掉什么'],
      lessons: [
        {
          id: 'js3l1', title: '对象字面量与解构', key: '对象 · 解构 · 键遍历', time: 14,
          blocks: [
            { t: 'p', x: '对象是键值集合，键是字符串（或 symbol）。`{}` 字面量最常用；解构能从对象里按名字取值，展开 `...` 能复制和合并。' },
            { t: 'code', x: 'const user = { name: "小明", age: 19, tags: ["a", "b"] };\nconsole.log(user.name, user["age"]);\n\nconst { name, age = 0 } = user;\nconsole.log(name, age);\n\nconst { tags: [first] } = user;     // 解构里套解构\nconsole.log(first);\n\nconst copy = { ...user, city: "广州" };\nconsole.log(Object.keys(copy).join(","));\nconsole.log(Object.values(copy).length);\nconsole.log("name" in copy);', out: '小明 19\n小明 19\na\nname,age,tags,city\n4\ntrue' },
            { t: 'code', x: 'const base = { a: 1, b: 2 };\nconst merged = { ...base, b: 99 };      // 后面的覆盖前面的\nconsole.log(merged.b);\n\nconst { a, ...rest } = merged;          // rest 收集剩下的键\nconsole.log(a, Object.keys(rest).join(","));\n\nconst key = "dyn";\nconst o = { [key]: 1 };                 // 计算属性名\nconsole.log(o.dyn);\n\nconsole.log(Object.entries(base).map(([k, v]) => `${k}=${v}`).join(" "));', out: '99\n1 b\n1\na=1 b=2' },
            { t: 'table', head: ['方法', '返回', '用途'], rows: [
              ['`Object.keys(o)`', '键数组', '遍历、校验'],
              ['`Object.values(o)`', '值数组', '只关心值'],
              ['`Object.entries(o)`', '`[k, v]` 数组', '转 Map、拼字符串'],
              ['`Object.assign(t, s)`', '合并（会改 t）', '老写法，优先用 `...`'],
              ['`Object.fromEntries(arr)`', '对象', '和 entries 互逆']
            ] },
            { t: 'warn', x: '`const copy = { ...user }` 是**浅拷贝**：嵌套的 `tags` 数组还是同一个。改 `copy.tags.push("c")` 会连带改到 `user`。要深拷贝用 `structuredClone(user)`（现代浏览器和 Node 17+ 都支持）。' },
            { t: 'note', x: '`in` 会检查原型链（`"toString" in {}` 是 true），`hasOwnProperty` 只查自身。判断「这个对象自己有没有这个键」用 `Object.hasOwn(o, k)`。' }
          ]
        },
        {
          id: 'js3l2', title: '原型链：继承的底层机制', key: 'prototype · __proto__', time: 16,
          blocks: [
            { t: 'p', x: '每个对象都有一个内部链接指向「原型对象」。访问属性时，先找自己，找不到就顺着原型往上找，直到 `null`。这条链就是**原型链**。' },
            { t: 'code', x: 'function Animal(name) {\n  this.name = name;\n}\nAnimal.prototype.speak = function () {\n  return `${this.name} 发声`;\n};\n\nconst a = new Animal("旺财");\nconsole.log(a.speak());\nconsole.log(Object.getPrototypeOf(a) === Animal.prototype);\nconsole.log(a.hasOwnProperty("name"), a.hasOwnProperty("speak"));\nconsole.log(a instanceof Animal);', out: '旺财 发声\ntrue\ntrue false\ntrue' },
            { t: 'p', x: '`speak` 不在 `a` 自己身上，而是挂在 `Animal.prototype` 上——所有实例共享同一份，省内存。这就是原型链的第一个用处。' },
            { t: 'code', x: 'function Animal(name) { this.name = name; }\nAnimal.prototype.speak = function () { return `${this.name} 发声`; };\n\nclass Dog extends Animal {\n  speak() { return `${this.name} 汪汪`; }\n}\n\nconst d = new Dog("小白");\nconsole.log(d.speak());\nconsole.log(d instanceof Dog, d instanceof Animal);\nconsole.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype);', out: '小白 汪汪\ntrue true\ntrue' },
            { t: 'table', head: ['概念', '是什么', '怎么用'], rows: [
              ['`prototype`', '函数才有的属性，是即将被 new 出来的对象的原型', '`F.prototype.m = fn`'],
              ['`__proto__` / `[[Prototype]]`', '对象自己的原型引用', '`Object.getPrototypeOf(o)`'],
              ['`constructor`', '原型上的属性，指回构造函数', '`o.constructor === F`'],
              ['`instanceof`', '沿原型链检查构造函数是否出现', '`o instanceof F`']
            ] },
            { t: 'code', x: 'console.log(typeof {}.toString);\nconsole.log(Object.getPrototypeOf([]) === Array.prototype);\nconsole.log(Object.getPrototypeOf(Object.prototype));\nconsole.log(Object.getPrototypeOf("a") === String.prototype);', out: 'function\ntrue\nnull\ntrue' },
            { t: 'warn', x: '**别直接改内置对象的原型**（比如给 `Array.prototype` 加方法）。这会影响所有代码，一旦和库重名就会互相覆盖，极难排查。' },
            { t: 'note', x: '`class` 只是原型继承的语法糖，本质一样。新代码用 `class` 更清楚；读老代码或面试题时，要能从 class 还原出原型链。' }
          ]
        },
        {
          id: 'js3l3', title: 'class 与继承', key: 'constructor · super · static', time: 14,
          blocks: [
            { t: 'p', x: '`class` 让原型继承写起来像 Java。注意三点：**`constructor` 里必须 `super()` 之后才能用 `this`**、方法之间不加逗号、类不会被提升（必须先定义后用）。' },
            { t: 'code', x: 'class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return `${this.name} 发声`; }\n  static create(name) { return new this(name); }\n}\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name);            // 必须先调用，才能用 this\n    this.breed = breed;\n  }\n  speak() { return `${super.speak()}，汪汪`; }\n}\n\nconst d = new Dog("旺财", "柴犬");\nconsole.log(d.speak());\nconsole.log(d.breed);\nconsole.log(Animal.create("无名").speak());\nconsole.log(d instanceof Dog, d instanceof Animal);', out: '旺财 发声，汪汪\n柴犬\n无名 发声\ntrue true' },
            { t: 'h', x: '私有字段与类字段' },
            { t: 'code', x: 'class Counter {\n  #n = 0;                       // 真私有，外部完全访问不到\n  step = 1;                     // 实例字段\n\n  inc() { this.#n += this.step; return this; }\n  get value() { return this.#n; }\n}\n\nconst c = new Counter();\nc.step = 5;\nc.inc().inc();                  // 链式调用\nconsole.log(c.value);\nconsole.log(Object.keys(c).join(","));\nconsole.log("#n" in c);', out: '10\nstep\nfalse' },
            { t: 'table', head: ['写法', '含义'], rows: [
              ['`#field`', '真私有字段，只能在类内部访问'],
              ['`static x`', '挂在类上，实例访问不到'],
              ['`get / set`', '拦截读写，可以加校验'],
              ['`#method()`', '私有方法'],
              ['`super.m()`', '调用父类同名方法']
            ] },
            { t: 'warn', x: '`class` **不会**像函数声明那样提升。在定义之前 `new Foo()` 会抛 `ReferenceError: Cannot access \'Foo\' before initialization`。' },
            { t: 'note', x: '`super()` 只能在构造函数里调用一次，而且必须在 `this` 之前。想「不调用 super 也能用 this」是不可能的——子类实例是由父类构造过程创建的。' }
          ]
        },
        {
          id: 'js3l4', title: 'getter、setter 与 Symbol', key: '访问器 · Symbol', time: 12,
          blocks: [
            { t: 'p', x: '`get` / `set` 让「属性式访问」背后跑一段逻辑：可以做校验、可以算出来、可以懒加载。`Symbol` 是唯一的值，常用来做「不会撞名的键」。' },
            { t: 'code', x: 'class Temp {\n  constructor(c) { this._c = c; }\n  get f() { return this._c * 9 / 5 + 32; }\n  get c() { return this._c; }\n  set c(v) {\n    if (v < -273.15) throw new RangeError("低于绝对零度");\n    this._c = v;\n  }\n}\n\nconst t = new Temp(0);\nconsole.log(t.f);\nt.c = 100;\nconsole.log(t.f);\ntry { t.c = -300; } catch (e) { console.log(e.name); }', out: '32\n212\nRangeError' },
            { t: 'code', x: 'const id = Symbol("id");\nconst o = { [id]: 1, name: "小明" };\nconsole.log(o[id]);\nconsole.log(Object.keys(o).length);      // Symbol 键不会出现在 keys 里\nconsole.log(Object.getOwnPropertySymbols(o).length);\n\nconst uid = Symbol.for("app.uid");       // 全局注册表：同名拿到同一个\nconsole.log(Symbol.for("app.uid") === uid);', out: '1\n1\n1\ntrue' },
            { t: 'table', head: ['用法', '说明'], rows: [
              ['`get x()`', '读 `o.x` 时调用'],
              ['`set x(v)`', '写 `o.x = v` 时调用'],
              ['`Symbol("desc")`', '每次都是新的唯一值'],
              ['`Symbol.for(k)`', '全局注册，同名同一个'],
              ['`Symbol.iterator`', '让对象可被 for...of 遍历']
            ] },
            { t: 'warn', x: 'getter / setter 里不要访问同名属性（`get x() { return this.x; }`），会无限递归直接爆栈。内部用另一个名字存值，比如 `this._x`。' },
            { t: 'note', x: '`JSON.stringify` 会**丢掉** Symbol 键、undefined 值、函数。所以 Symbol 做键的数据天然不会被序列化，适合放内部标记。' }
          ]
        },
        {
          id: 'js3l5', title: 'JSON 的边界', key: 'stringify · parse · 深拷贝', time: 12,
          blocks: [
            { t: 'p', x: 'JSON 是**文本格式**，不是 JS 对象。`JSON.stringify` 把对象变成字符串，`JSON.parse` 变回来。这个过程会丢掉 JSON 表达不了的东西——这是接口联调时最常见的「字段去哪了」。' },
            { t: 'code', x: 'const u = { name: "小明", age: 19, tags: ["a", "b"], extra: undefined, say() {}, when: new Date(0) };\nconst s = JSON.stringify(u);\nconsole.log(s);\nconsole.log(JSON.parse(s).name);\nconsole.log(Object.keys(JSON.parse(s)).join(","));', out: '{"name":"小明","age":19,"tags":["a","b"],"when":"1970-01-01T00:00:00.000Z"}\n小明\nname,age,tags,when' },
            { t: 'p', x: '`extra: undefined` 和 `say` 函数被直接丢掉了；`Date` 变成了 ISO 字符串——**parse 回来是字符串，不是 Date**。这两个问题在实际项目里非常常见。' },
            { t: 'code', x: 'const src = { a: 1, nested: { b: 2 }, list: [1, 2] };\n\nconst shallow = { ...src };\nshallow.nested.b = 99;\nconsole.log(src.nested.b);           // 浅拷贝：原对象被改了\n\nconst deep = structuredClone(src);\ndeep.nested.b = 7;\nconsole.log(src.nested.b, deep.nested.b);\n\nconst viaJson = JSON.parse(JSON.stringify(src));\nconsole.log(viaJson.list.length);', out: '99\n99 7\n2' },
            { t: 'table', head: ['会丢掉 / 变形', '变成什么'], rows: [
              ['`undefined`、函数、Symbol', '整个键被删掉'],
              ['`Date`', 'ISO 字符串'],
              ['`NaN`、`Infinity`', '`null`'],
              ['`Map`、`Set`', '`{}`（空对象）'],
              ['循环引用', '抛 `TypeError`']
            ] },
            { t: 'warn', x: '**别用 `JSON.parse(JSON.stringify(x))` 做深拷贝**：它会丢函数、把 Date 变字符串、遇到循环引用直接抛错。用 `structuredClone(x)`，它支持 Date、Map、Set、循环引用。' },
            { t: 'note', x: '发给后端的日期建议显式 `toISOString()`，接收时用 `new Date(str)` 转回来。不要依赖「它自动就是 Date」——JSON 里没有日期类型。' }
          ]
        }
      ]
    },
    {
      id: 'js4', num: 4, title: '数组与数据处理', icon: '📊',
      intro: '实际项目里 80% 的数据处理都是「拿一个数组、筛一部分、转个形状、算个总数」。这一章把 `map / filter / reduce` 三个方法练到条件反射，再讲清深浅拷贝。',
      goals: ['熟练增删改查数组', '用 map/filter/reduce 替代 for 循环', '正确排序（数字与对象）', '分清浅拷贝与深拷贝'],
      lessons: [
        {
          id: 'js4l1', title: '增删改查与切片', key: 'push · splice · slice', time: 14,
          blocks: [
            { t: 'p', x: '数组方法分两类：**会改原数组的**（push / pop / shift / unshift / splice / sort / reverse）和**返回新数组的**（slice / concat / map / filter）。混用会导致「我的数据怎么被改了」这类 bug。' },
            { t: 'code', x: 'const a = [1, 2, 3];\nconsole.log(a.length, a[0], a.at(-1));\n\na.push(4);      console.log(a.join(","));   // 尾部加\n\na.pop();        console.log(a.join(","));   // 尾部删\n\na.unshift(0);   console.log(a.join(","));   // 头部加\n\na.shift();      console.log(a.join(","));   // 头部删\n\nconsole.log(a.includes(2), a.indexOf(9));\nconsole.log([1, 2, 3].concat([4, 5]).join(","));\nconsole.log([1, 2, 3, 4].slice(1, 3).join(","));', out: '3 1 3\n1,2,3,4\n1,2,3\n0,1,2,3\n1,2,3\ntrue -1\n1,2,3,4,5\n2,3' },
            { t: 'h', x: 'splice：最强的原地修改' },
            { t: 'code', x: 'const b = [1, 2, 3, 4];\nconst removed = b.splice(1, 2);        // 从下标 1 删 2 个\nconsole.log(removed.join(","), b.join(","));\n\nb.splice(1, 0, 9, 9);                 // 在下标 1 插入两个 9\nconsole.log(b.join(","));\n\nb.splice(-1, 1, "末");                 // 替换最后一个\nconsole.log(b.join(","));', out: '2,3 1,4\n1,9,9,4\n1,9,9,末' },
            { t: 'table', head: ['方法', '是否改原数组', '作用'], rows: [
              ['`push / pop`', '改', '尾部增删'],
              ['`unshift / shift`', '改', '头部增删（O(n)，数据量大时慢）'],
              ['`splice(i, n, ...x)`', '改', '删除并插入，返回被删的元素'],
              ['`slice(a, b)`', '不改', '截取一段，返回新数组'],
              ['`concat`', '不改', '拼接'],
              ['`sort / reverse`', '改', '排序 / 反转'],
              ['`map / filter`', '不改', '转换 / 筛选']
            ] },
            { t: 'code', x: 'const arr = [3, 1, 2];\nconst sorted = [...arr].sort();      // 想保留原数组，先复制\nconsole.log(arr.join(","), sorted.join(","));\nconsole.log(Array.isArray(arr), Array.from("abc").join("-"));\nconsole.log(Array.from({ length: 3 }, (_, i) => i * 2).join(","));', out: '3,1,2 1,2,3\ntrue a-b-c\n0,2,4' },
            { t: 'warn', x: '`sort()` 和 `reverse()` **会改原数组**，而且 `sort()` 返回的是同一个数组，不是副本。要不变式操作，先 `[...arr]` 或 `arr.slice()` 复制一份。' }
          ]
        },
        {
          id: 'js4l2', title: 'map / filter / reduce', key: '声明式数据处理', time: 16,
          blocks: [
            { t: 'p', x: '这三个方法覆盖了绝大多数数组处理：`map` 一对一转换、`filter` 筛选、`reduce` 归约成一个值。它们都**不改原数组**，返回新的结果。' },
            { t: 'code', x: 'const nums = [1, 2, 3, 4, 5];\nconsole.log(nums.map(n => n * 2).join(","));\nconsole.log(nums.filter(n => n % 2).join(","));\nconsole.log(nums.reduce((s, n) => s + n, 0));\nconsole.log(nums.reduce((m, n) => (n > m ? n : m)));\nconsole.log(nums.find(n => n > 3), nums.findIndex(n => n > 3));\nconsole.log(nums.some(n => n > 4), nums.every(n => n > 0));', out: '2,4,6,8,10\n1,3,5\n15\n5\n4 3\ntrue true' },
            { t: 'table', head: ['方法', '返回', '什么时候用'], rows: [
              ['`map`', '等长新数组', '把每个元素变成别的形状'],
              ['`filter`', '变短的数组', '只保留满足条件的'],
              ['`reduce`', '任意值', '求和、求最大、分组、去重'],
              ['`find` / `findIndex`', '元素 / 下标（找不到 -1）', '找第一个满足的'],
              ['`some` / `every`', '布尔', '存在 / 全部'],
              ['`flat` / `flatMap`', '拍平的数组', '处理嵌套结构']
            ] },
            { t: 'h', x: '链式调用的真实例子' },
            { t: 'code', x: 'const orders = [\n  { id: 1, amount: 120, paid: true },\n  { id: 2, amount: 80, paid: false },\n  { id: 3, amount: 300, paid: true }\n];\n\nconst paidTotal = orders\n  .filter(o => o.paid)\n  .map(o => o.amount)\n  .reduce((s, v) => s + v, 0);\nconsole.log("已支付合计", paidTotal);\n\nconst names = orders.map(o => `#${o.id}`).join(" ");\nconsole.log(names);', out: '已支付合计 420\n#1 #2 #3' },
            { t: 'code', x: 'console.log([[1, 2], [3], [4, 5]].flat().join(","));\nconsole.log([1, 2, 3].flatMap(n => [n, n * 10]).join(","));\n\nconst arr = [1, 1, 2, 3, 3];\nconst uniq = arr.reduce((acc, n) => (acc.includes(n) ? acc : [...acc, n]), []);\nconsole.log(uniq.join(","), [...new Set(arr)].join(","));', out: '1,2,3,4,5\n1,10,2,20,3,30\n1,2,3 1,2,3' },
            { t: 'warn', x: '**`reduce` 一定要传初始值。** 不传时，空数组会直接抛 `TypeError: Reduce of empty array with no initial value`；而且累加器会从第一个元素开始，类型可能出乎意料。' },
            { t: 'tip', x: '去重一行就够：`[...new Set(arr)]`。别用 `indexOf` 手写循环——可读性差、还是 O(n²)。' }
          ]
        },
        {
          id: 'js4l3', title: '排序、查找与分组', key: 'sort · 比较函数', time: 14,
          blocks: [
            { t: 'p', x: '`sort()` 不带参数时，把所有元素**转成字符串**按字典序排。所以 `[10, 9, 2].sort()` 得到 `[10, 2, 9]`——这是 JS 最著名的反直觉行为之一。' },
            { t: 'code', x: 'const a = [10, 9, 2];\nconsole.log(a.sort().join(","));\nconsole.log([10, 9, 2].sort((x, y) => x - y).join(","));\nconsole.log([10, 9, 2].sort((x, y) => y - x).join(","));', out: '10,2,9\n2,9,10\n10,9,2' },
            { t: 'p', x: '比较函数的规则只有一条：**返回负数表示 x 排前面，返回正数表示 y 排前面，返回 0 表示相等**。所以 `x - y` 是升序，`y - x` 是降序。' },
            { t: 'h', x: '对象数组排序' },
            { t: 'code', x: 'const users = [\n  { id: 1, name: "小明", score: 92 },\n  { id: 2, name: "小红", score: 88 },\n  { id: 3, name: "阿伟", score: 92 }\n];\n\nconst byScore = [...users].sort((a, b) => b.score - a.score);\nconsole.log(byScore.map(u => u.score).join(","));\n\n/* 分数相同按 id 排（多级排序：前一个条件为 0 时才看后一个） */\nconst byScoreThenId = [...users].sort((a, b) => b.score - a.score || a.id - b.id);\nconsole.log(byScoreThenId.map(u => u.name).join(","));', out: '92,92,88\n小明,阿伟,小红' },
            { t: 'code', x: 'const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];\nconsole.log(arr.find(o => o.id === 2).id);\nconsole.log(arr.findIndex(o => o.id === 3));\nconsole.log(arr.findIndex(o => o.id === 9));\n\n/* 按字段分组 */\nconst group = arr.reduce((acc, o) => {\n  const k = o.id % 2 === 0 ? "偶" : "奇";\n  (acc[k] ||= []).push(o.id);\n  return acc;\n}, {});\nconsole.log(JSON.stringify(group));', out: '2\n2\n-1\n{"奇":[1,3],"偶":[2]}' },
            { t: 'warn', x: '中文排序要用 `localeCompare`：`a.name.localeCompare(b.name, "zh")`。直接比字符串比的是 Unicode 码点，结果和拼音顺序不一致。' },
            { t: 'note', x: '`(acc[k] ||= []).push(x)` 是现代写法：如果 `acc[k]` 是 falsy 就先赋 `[]`，然后 push。比写三行 if 判断清爽得多。' }
          ]
        },
        {
          id: 'js4l4', title: '浅拷贝、深拷贝与不可变', key: 'spread · structuredClone', time: 14,
          blocks: [
            { t: 'p', x: '赋值 `b = a` 只是复制引用，改 b 就是改 a。`{ ...a }` / `[...a]` 是**浅拷贝**：第一层是新的，嵌套对象还是共享的。要完全独立必须**深拷贝**。' },
            { t: 'code', x: 'const src = { a: 1, nested: { b: 2 } };\nconst shallow = { ...src };\nshallow.nested.b = 99;\nconsole.log(src.nested.b);           // 原对象被改了\n\nconst deep = structuredClone(src);\ndeep.nested.b = 7;\nconsole.log(src.nested.b, deep.nested.b);', out: '99\n99 7' },
            { t: 'code', x: 'const arr = [1, [2]];\nconst copy = [...arr];\ncopy[1].push(3);\nconsole.log(arr[1].length);        // 嵌套数组被共享\n\nconst frozen = Object.freeze({ x: 1 });\nfrozen.x = 2;                      // 静默失败（非严格模式）\nconsole.log(frozen.x);\n\nconst deepFrozen = { o: Object.freeze({ y: 1 }) };\nconsole.log(Object.isFrozen(deepFrozen.o), Object.isFrozen(deepFrozen));', out: '2\n1\ntrue false' },
            { t: 'table', head: ['方式', '深度', '支持 Date/Map', '适用'], rows: [
              ['`b = a`', '不复制', '—', '只是别名'],
              ['`{ ...a }` / `[...a]`', '浅', '—', '单层配置对象'],
              ['`structuredClone(a)`', '深', '支持', '**首选**'],
              ['`JSON.parse(JSON.stringify(a))`', '深', '丢失/变形', '老环境兜底'],
              ['手写递归', '深', '取决于实现', '需要特殊处理时']
            ] },
            { t: 'p', x: '上面 `Object.freeze` 只冻结了第一层——`deepFrozen` 自己没冻结，所以还能加属性。要递归冻结得自己写函数，这就是「浅冻结」的坑。' },
            { t: 'warn', x: '**冻结只在非严格模式静默失败**。在 ES Module 或 `"use strict"` 下，给冻结对象赋值会直接抛 `TypeError`。同一个操作在不同文件里表现不同，很容易困惑。' },
            { t: 'note', x: '现在的趋势是「不可变更新」：不修改原对象，而是创建新对象（React 状态管理就是这样）。`{ ...state, count: state.count + 1 }` 比 `state.count++` 更安全，因为可以随时回退到旧状态。' }
          ]
        }
      ]
    },
    {
      id: 'js5', num: 5, title: '异步编程', icon: '⏱️',
      intro: 'JS 是单线程的：一次只能做一件事。异步不是「同时做」，而是「等的时候先去干别的」。这一章从事件循环讲到 async/await，把这条主线打通。',
      goals: ['画出事件循环的执行顺序', '用 Promise 串联异步任务', '用 async/await 写出像同步的异步代码', '正确并发与捕获错误'],
      lessons: [
        {
          id: 'js5l1', title: '事件循环：谁先谁后', key: '调用栈 · 微任务 · 宏任务', time: 16,
          blocks: [
            { t: 'p', x: 'JS 只有一个调用栈，同步代码执行完才轮到异步回调。异步任务分两种：**微任务**（Promise.then、queueMicrotask）优先级高，**宏任务**（setTimeout、事件回调）排在后面。每轮事件循环都会**先清空所有微任务，再取一个宏任务**。' },
            { t: 'code', x: 'console.log("1 同步");\n\nsetTimeout(() => console.log("4 setTimeout 宏任务"), 0);\n\nPromise.resolve().then(() => console.log("3 Promise 微任务"));\n\nconsole.log("2 同步");', out: '1 同步\n2 同步\n3 Promise 微任务\n4 setTimeout 宏任务' },
            { t: 'p', x: '执行顺序：先跑完所有同步代码（1、2），再清空微任务队列（3），最后才是宏任务（4）。`setTimeout(..., 0)` 不是「立刻」，只是「尽快排到宏任务队列」。' },
            { t: 'code', x: 'setTimeout(() => {\n  console.log("timeout 1");\n  Promise.resolve().then(() => console.log("timeout 1 里的微任务"));\n}, 0);\n\nPromise.resolve()\n  .then(() => console.log("微任务 1"))\n  .then(() => console.log("微任务 2"));\n\nconsole.log("同步");', out: '同步\n微任务 1\n微任务 2\ntimeout 1\ntimeout 1 里的微任务' },
            { t: 'table', head: ['类型', '有哪些', '执行时机'], rows: [
              ['同步代码', '普通语句、函数调用', '立即，压栈执行'],
              ['微任务', '`Promise.then`、`queueMicrotask`、`MutationObserver`', '当前同步代码结束后立刻清空'],
              ['宏任务', '`setTimeout`、`setInterval`、DOM 事件、`fetch` 回调', '每轮取一个'],
              ['渲染', '样式计算、布局、绘制', '宏任务之间（浏览器决定）']
            ] },
            { t: 'warn', x: '**死循环会卡住整个页面**，因为渲染也要排队。一个 `while(true)` 会让页面完全无响应。要跑耗时计算，用 Web Worker 或拆成多个 `setTimeout`。' },
            { t: 'note', x: '`Promise.then` 里再返回 Promise，会「自动展开」（等内层完成才继续）。这就是链式 then 能按顺序执行的原因。' }
          ]
        },
        {
          id: 'js5l2', title: '回调与定时器', key: 'setTimeout · setInterval · 回调地狱', time: 12,
          blocks: [
            { t: 'p', x: '最早的异步写法是回调：把「完成后要做什么」作为函数传进去。简单场景很直接，但多层嵌套就成了「回调地狱」——错误处理分散、顺序难读。' },
            { t: 'code', x: 'console.log("同步先执行");\n\nsetTimeout(() => console.log("0ms 后"), 0);\nsetTimeout(() => console.log("50ms 后"), 50);\n\nlet n = 0;\nconst id = setInterval(() => {\n  n++;\n  console.log("interval", n);\n  if (n === 2) clearInterval(id);   // 必须自己停，否则永远跑\n}, 5);', out: '同步先执行\n0ms 后\ninterval 1\ninterval 2\n50ms 后' },
            { t: 'code', x: '/* 回调地狱：三层嵌套，错误处理要写三次 */\nfunction step1(cb) { setTimeout(() => cb(null, "第一步"), 5); }\nfunction step2(v, cb) { setTimeout(() => cb(null, v + " → 第二步"), 5); }\nfunction step3(v, cb) { setTimeout(() => cb(null, v + " → 第三步"), 5); }\n\nstep1((e1, r1) => {\n  if (e1) return console.log("失败", e1);\n  step2(r1, (e2, r2) => {\n    if (e2) return console.log("失败", e2);\n    step3(r2, (e3, r3) => {\n      if (e3) return console.log("失败", e3);\n      console.log(r3);\n    });\n  });\n});', out: '第一步 → 第二步 → 第三步' },
            { t: 'table', head: ['问题', '回调写法', 'Promise 写法'], rows: [
              ['顺序', '层层嵌套', '`.then().then()` 平铺'],
              ['错误处理', '每层都要判', '一个 `.catch` 兜底'],
              ['并发', '手动计数', '`Promise.all`'],
              ['可读性', '缩进越来越深', '接近同步代码']
            ] },
            { t: 'warn', x: '`setInterval` **不会等上一次执行完**。如果回调耗时超过间隔，任务会堆积。需要「上一次结束再排下一次」时，用递归 `setTimeout`。' },
            { t: 'note', x: '定时器的最小间隔受浏览器限制（嵌套超过 5 层后至少 4ms），所以 `setTimeout(fn, 0)` 实际大约 1~4ms。别用它做精确计时，也别指望它「立即」执行。' }
          ]
        },
        {
          id: 'js5l3', title: 'Promise：把回调拉平', key: 'then · catch · finally · all', time: 16,
          blocks: [
            { t: 'p', x: 'Promise 有三种状态：`pending`（进行中）、`fulfilled`（成功）、`rejected`（失败）。状态一旦改变就**永久固定**，之后不能再改——这是它比回调可靠的根本原因。' },
            { t: 'code', x: 'const p = new Promise(resolve => {\n  setTimeout(() => resolve(42), 10);\n});\n\np.then(v => {\n  console.log("拿到", v);\n  return v * 2;            // 返回值会传给下一个 then\n}).then(v => console.log("链式", v));\n\nPromise.reject(new Error("出错了"))\n  .catch(e => console.log("捕获", e.message));\n\nPromise.all([Promise.resolve(1), Promise.resolve(2)])\n  .then(v => console.log("all", v.join(",")));', out: '捕获 出错了\nall 1,2\n拿到 42\n链式 84' },
            { t: 'h', x: '四个组合方法' },
            { t: 'table', head: ['方法', '何时成功', '何时失败', '典型用途'], rows: [
              ['`Promise.all`', '全部成功', '任一失败', '并行请求，缺一不可'],
              ['`Promise.allSettled`', '全部结束（不管成败）', '不会失败', '批量操作，要拿到每个结果'],
              ['`Promise.race`', '第一个结束的', '第一个失败', '超时控制'],
              ['`Promise.any`', '第一个成功', '全部失败', '多个镜像源']
            ] },
            { t: 'code', x: 'const slow = ms => new Promise(r => setTimeout(() => r(ms), ms));\n\nPromise.allSettled([\n  Promise.resolve("ok"),\n  Promise.reject(new Error("bad")),\n  slow(5)\n]).then(rs => {\n  console.log(rs.map(r => r.status).join(","));\n});\n\nPromise.race([slow(2), slow(30)]).then(v => console.log("race 赢家", v));', out: 'race 赢家 2\nfulfilled,rejected,fulfilled' },
            { t: 'warn', x: '**忘了 `return` 会断链**。`.then(v => { doSomething(v); })` 里没 return，下一个 then 收到的是 undefined。想继续传值必须 `return`。' },
            { t: 'note', x: '`Promise` 里抛出的异常会变成 rejected 状态，自动被后面的 `.catch` 接住。所以 `.then` 里可以直接 `throw new Error(...)`，不用手动 reject。' }
          ]
        },
        {
          id: 'js5l4', title: 'async / await', key: 'await · try-catch', time: 14,
          blocks: [
            { t: 'p', x: '`async` 函数总是返回 Promise；`await` 会暂停这个函数，等 Promise 完成再继续——但**不会阻塞整个线程**，其他代码照常执行。这让异步代码读起来像同步。' },
            { t: 'code', x: 'const sleep = ms => new Promise(r => setTimeout(r, ms));\nconst fetchUser = async () => { await sleep(10); return { name: "小明" }; };\n\nasync function main() {\n  console.log("开始");\n  const u = await fetchUser();       // 等一下，但不卡住别人\n  console.log("拿到", u.name);\n  try {\n    await Promise.reject(new Error("接口挂了"));\n  } catch (e) {\n    console.log("捕获", e.message);\n  }\n  console.log("结束");\n}\n\nmain();\nconsole.log("main 之后（同步继续）");', out: '开始\nmain 之后（同步继续）\n拿到 小明\n捕获 接口挂了\n结束' },
            { t: 'p', x: '注意「main 之后」排在「拿到 小明」前面：`main()` 一被调用就同步执行到第一个 `await`，然后**让出控制权**，外面继续跑。等 10ms 后 Promise 完成，才回来接着执行。' },
            { t: 'code', x: 'const sleep = ms => new Promise(r => setTimeout(r, ms));\n\nasync function parallel() {\n  const t0 = Date.now();\n  const [a, b] = await Promise.all([sleep(20), sleep(20)]);   // 并发\n  console.log("并发耗时 < 40ms：", Date.now() - t0 < 40);\n}\n\nasync function serial() {\n  const t0 = Date.now();\n  await sleep(20);\n  await sleep(20);                                            // 串行\n  console.log("串行耗时 >= 40ms：", Date.now() - t0 >= 40);\n}\n\nparallel().then(() => serial());', out: '并发耗时 < 40ms： true\n串行耗时 >= 40ms： true' },
            { t: 'table', head: ['写法', '区别'], rows: [
              ['`await a; await b;`', '串行，总耗时相加'],
              ['`await Promise.all([a, b])`', '并发，总耗时取最大'],
              ['`forEach(async ...)`', '**不会等待**，容易写出假并发'],
              ['`for (const x of arr) await f(x)`', '真的串行等待'],
              ['`await Promise.all(arr.map(f))`', '真并发，推荐']
            ] },
            { t: 'warn', x: '**`arr.forEach(async x => { await f(x) })` 是个陷阱**：forEach 不管回调返回的 Promise，循环立刻结束，你以为的「全部完成」其实一个都没完成。要用 `for...of` 或 `Promise.all(arr.map(...))`。' },
            { t: 'note', x: '在 `async` 函数里，`await` 一个 rejected 的 Promise 会**抛出异常**，所以要用 `try-catch` 包住。这是 async/await 最容易被忽略的一点。' }
          ]
        },
        {
          id: 'js5l5', title: '并发控制与错误处理', key: '并发限制 · 重试 · 超时', time: 16,
          blocks: [
            { t: 'p', x: '真实的并发不是「全部一起发」，而是「同时最多 N 个」。请求太多会被限流、拖垮浏览器。手写一个并发控制只需要一个简单的思路：**维持 N 个「工人」不停取任务**。' },
            { t: 'code', x: 'async function runWithLimit(tasks, limit) {\n  const results = [];\n  let next = 0;\n\n  async function worker() {\n    while (next < tasks.length) {\n      const i = next++;              // 取任务的瞬间就自增，天然去重\n      results[i] = await tasks[i]();\n    }\n  }\n\n  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));\n  return results;\n}\n\nconst task = id => async () => {\n  await new Promise(r => setTimeout(r, 5));\n  return id;\n};\n\nrunWithLimit([1, 2, 3, 4, 5].map(task), 2)\n  .then(r => console.log("结果", r.join(",")));', out: '结果 1,2,3,4,5' },
            { t: 'h', x: '超时与重试' },
            { t: 'code', x: 'const sleep = ms => new Promise(r => setTimeout(r, ms));\n\nfunction withTimeout(promise, ms) {\n  const timeout = new Promise((_, reject) =>\n    setTimeout(() => reject(new Error(`超时 ${ms}ms`)), ms)\n  );\n  return Promise.race([promise, timeout]);\n}\n\nasync function retry(fn, times = 3) {\n  let lastErr;\n  for (let i = 1; i <= times; i++) {\n    try {\n      return await fn(i);\n    } catch (e) {\n      lastErr = e;\n    }\n  }\n  throw lastErr;\n}\n\nwithTimeout(new Promise(r => setTimeout(() => r("ok"), 30)), 10)\n  .catch(e => console.log(e.message));\n\nlet n = 0;\nretry(async attempt => {\n  n++;\n  if (n < 3) throw new Error("第" + n + "次失败");\n  return "第" + attempt + "次成功";\n}).then(v => console.log(v));', out: '第3次成功\n超时 10ms' },
            { t: 'table', head: ['问题', '解法'], rows: [
              ['请求太多', '并发池（上面那个 `runWithLimit`）'],
              ['一直不返回', '`Promise.race` 加超时'],
              ['偶发失败', '重试 + 退避（间隔递增）'],
              ['部分失败', '`Promise.allSettled` 逐条判断'],
              ['错误被吞', '统一 `.catch` 记日志，别写空 catch']
            ] },
            { t: 'warn', x: '**超时不是「取消请求」**。`Promise.race` 只是让你先拿到超时的结果，原来那个请求还在跑。真要取消得用 `AbortController`，把 `signal` 传进 `fetch`。' },
            { t: 'note', x: '重试要区分「值得重试」的错误：网络抖动、5xx 可以重试；400 参数错误重试一万次也不会成功，只会加重服务器负担。' }
          ]
        }
      ]
    },
    {
      id: 'js6', num: 6, title: 'DOM 与事件', icon: '🖱️',
      intro: 'DOM 是浏览器把 HTML 变成的树，JS 通过它读写页面。这一章的示例需要在真实浏览器里跑（本页沙箱没有 document），但代码本身就是你要写的全部。',
      goals: ['用选择器找到元素并修改内容', '理解事件流与冒泡', '做表单校验', '用事件委托减少监听器'],
      lessons: [
        {
          id: 'js6l1', title: '选择与修改元素', key: 'querySelector · textContent', time: 14,
          blocks: [
            { t: 'p', x: '`document.querySelector(css)` 按 CSS 选择器找**第一个**匹配，`querySelectorAll` 返回**全部**（NodeList，可以用 `forEach`）。改文本用 `textContent`，改 HTML 用 `innerHTML`。' },
            { t: 'code', run: false, label: 'index.html 片段', x: '<ul id="list">\n  <li class="item" data-id="1">第一项</li>\n  <li class="item" data-id="2">第二项</li>\n</ul>\n<p class="tip">提示文字</p>' },
            { t: 'code', run: false, label: 'main.js', x: 'const list = document.querySelector("#list");\nconst first = document.querySelector(".item");\nconst all = document.querySelectorAll(".item");\n\nconsole.log(first.textContent);        // 第一项\nconsole.log(all.length);               // 2\n\nfirst.textContent = "改过的文字";       // 只改文本，安全\nlist.innerHTML += \'<li class="item">新增</li>\';   // 解析 HTML\n\nall.forEach((el, i) => {\n  el.style.color = i === 0 ? "red" : "";\n  console.log(el.dataset.id);          // 读 data-id\n});' },
            { t: 'table', head: ['操作', '用哪个', '注意'], rows: [
              ['改文本', '`textContent`', '**推荐**，不会解析标签，防 XSS'],
              ['改 HTML', '`innerHTML`', '会解析标签，用户输入慎用'],
              ['改属性', '`el.setAttribute / el.id`', '`data-*` 用 `el.dataset.xxx`'],
              ['改 class', '`classList.add/remove/toggle`', '比字符串拼接安全'],
              ['改样式', '`el.style.color = "red"`', '只影响内联样式'],
              ['创建元素', '`document.createElement`', '配 `append` 插入']
            ] },
            { t: 'code', run: false, label: '创建与插入', x: 'const li = document.createElement("li");\nli.className = "item";\nli.textContent = "用 JS 创建的行";\nli.addEventListener("click", () => li.remove());\n\nlist.append(li);          // 插到末尾\n// list.prepend(li);      // 插到最前\n// li.remove();           // 删除自己' },
            { t: 'warn', x: '**别用 `innerHTML` 拼接用户输入**，那是 XSS 漏洞的标准入口。用户输入 `&lt;img src=x onerror=alert(1)&gt;` 就会执行脚本。要插文本用 `textContent`，要插结构用 `createElement`。' }
          ]
        },
        {
          id: 'js6l2', title: '事件、冒泡与委托', key: 'addEventListener · 事件流', time: 16,
          blocks: [
            { t: 'p', x: '事件从 `window` 往下传到目标（捕获阶段），再从目标往上冒（冒泡阶段）。`addEventListener` 默认在**冒泡阶段**触发，所以点内层元素，外层的监听器也会被触发。' },
            { t: 'code', run: false, label: '冒泡示例', x: '<div id="outer">\n  外层\n  <button id="inner">内层按钮</button>\n</div>\n\n<script>\n  document.querySelector("#outer").addEventListener("click", e => {\n    console.log("外层收到", e.target.id, "阶段：冒泡");\n  });\n\n  document.querySelector("#inner").addEventListener("click", e => {\n    console.log("内层收到");\n    // e.stopPropagation();   // 阻止继续冒泡\n  });\n</script>' },
            { t: 'p', x: '点按钮时输出顺序是「内层收到」→「外层收到」。如果在外层监听器里看到 `e.target` 是 `inner`，说明事件从它冒上来的——`e.target` 是真正的触发者，`e.currentTarget` 是当前正在处理的元素。' },
            { t: 'h', x: '事件委托：一个监听器管所有子元素' },
            { t: 'code', run: false, label: '事件委托', x: '<ul id="todo">\n  <li data-id="1">买牛奶 <button class="del">删除</button></li>\n  <li data-id="2">写作业 <button class="del">删除</button></li>\n</ul>\n\n<script>\n  document.querySelector("#todo").addEventListener("click", e => {\n    const btn = e.target.closest(".del");\n    if (!btn) return;                     // 点的不是删除按钮\n    const li = btn.closest("li");\n    console.log("删除", li.dataset.id);\n    li.remove();\n  });\n</script>' },
            { t: 'table', head: ['属性 / 方法', '含义'], rows: [
              ['`e.target`', '真正触发事件的元素（可能是子元素）'],
              ['`e.currentTarget`', '绑定监听器的元素'],
              ['`e.preventDefault()`', '阻止默认行为（表单提交、链接跳转）'],
              ['`e.stopPropagation()`', '阻止冒泡到父元素'],
              ['`closest(sel)`', '从当前元素往上找最近的匹配祖先'],
              ['`{ once: true }`', '只触发一次后自动移除']
            ] },
            { t: 'warn', x: '**不要给每个列表项都加监听器。** 1000 条数据就是 1000 个监听器，而且动态新增的元素还得重新绑定。用事件委托绑在父容器上，一次搞定，新增元素自动生效。' },
            { t: 'note', x: '`closest` 是事件委托的关键：`e.target` 可能点中的是按钮里的文字或图标，`closest(".del")` 能往上找到真正想要的元素。' }
          ]
        },
        {
          id: 'js6l3', title: '表单与校验', key: 'value · submit · 校验', time: 14,
          blocks: [
            { t: 'p', x: '表单处理的标准流程是：监听 `submit`（不是按钮的 click）→ `preventDefault()` → 读取 `value` → 校验 → 通过再提交。监听 submit 才能同时覆盖「点按钮」和「在输入框按回车」。' },
            { t: 'code', run: false, label: '表单校验', x: '<form id="signup">\n  <input name="email" type="email" placeholder="邮箱">\n  <input name="age" type="number" placeholder="年龄">\n  <button type="submit">注册</button>\n  <p id="msg"></p>\n</form>\n\n<script>\n  const form = document.querySelector("#signup");\n  const msg = document.querySelector("#msg");\n\n  form.addEventListener("submit", e => {\n    e.preventDefault();                     // 阻止页面刷新\n\n    const email = form.email.value.trim();\n    const age = Number(form.age.value);\n\n    if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) {\n      msg.textContent = "邮箱格式不对";\n      return;\n    }\n    if (!Number.isInteger(age) || age < 0 || age > 150) {\n      msg.textContent = "年龄要在 0~150 之间";\n      return;\n    }\n    msg.textContent = "校验通过，可以提交";\n    console.log({ email, age });\n  });\n</script>' },
            { t: 'table', head: ['元素', '取值方式', '说明'], rows: [
              ['`<input>`', '`el.value`', '永远是字符串'],
              ['`<input type="checkbox">`', '`el.checked`', '布尔值'],
              ['`<select>`', '`el.value`', '选中项的 value'],
              ['`<form>`', '`form.name.value`', '按 name 直接访问'],
              ['数字转换', '`Number(el.value)`', '空字符串会变 0，要额外判断']
            ] },
            { t: 'p', x: '`Number("")` 是 `0`，所以「用户什么都没填」会被当成 0。校验数字时先判空：`if (el.value === "") return "必填"`，再转数字。' },
            { t: 'warn', x: '**表单一定要 `e.preventDefault()`**，否则浏览器会刷新整个页面，你的 JS 状态全丢。这是新手最常遇到的问题——「点提交后页面闪一下就白了」。' },
            { t: 'note', x: '能用 HTML 原生校验就别自己写：`required`、`type="email"`、`min`、`max`、`pattern`。浏览器免费提供，无 JS 也能工作。JS 校验只是补充。' }
          ]
        },
        {
          id: 'js6l4', title: '样式、动画与渲染性能', key: 'classList · requestAnimationFrame', time: 14,
          blocks: [
            { t: 'p', x: '改样式优先切换 class，而不是逐个写 `style.xxx`。因为 class 能被 CSS 统一管理，也更容易做过渡动画。`classList.toggle(name, force)` 是最好用的一个。' },
            { t: 'code', run: false, label: 'class 与过渡', x: '<style>\n  .box { width: 100px; height: 100px; background: #4a90d9;\n         transition: transform .3s, opacity .3s; }\n  .box.moved { transform: translateX(200px); opacity: .5; }\n</style>\n\n<div class="box" id="box"></div>\n\n<script>\n  const box = document.querySelector("#box");\n  box.addEventListener("click", () => {\n    box.classList.toggle("moved");        // 加/去掉，CSS 负责动画\n  });\n</script>' },
            { t: 'h', x: '逐帧动画：requestAnimationFrame' },
            { t: 'code', run: false, label: 'rAF 动画', x: 'let x = 0;\nfunction step() {\n  x += 2;\n  box.style.transform = `translateX(${x}px)`;\n  if (x < 200) requestAnimationFrame(step);   // 下一帧继续\n}\nrequestAnimationFrame(step);\n\n/* 它比 setInterval(step, 16) 好在：\n   1. 和屏幕刷新同步，不会丢帧或抖动\n   2. 页面不可见时自动暂停，省电 */' },
            { t: 'table', head: ['做法', '性能', '说明'], rows: [
              ['改 `transform` / `opacity`', '好', '只触发合成，不重排'],
              ['改 `width` / `top` / `margin`', '差', '触发布局重排，整页重算'],
              ['批量改 DOM', '用 `DocumentFragment`', '只插入一次，减少重排'],
              ['读布局后立刻写', '避免', '强制同步布局（layout thrashing）'],
              ['逐帧动画', '`requestAnimationFrame`', '与刷新率同步']
            ] },
            { t: 'code', run: false, label: '批量插入', x: 'const frag = document.createDocumentFragment();\nfor (let i = 0; i < 1000; i++) {\n  const li = document.createElement("li");\n  li.textContent = "第 " + i + " 行";\n  frag.append(li);          // 先在内存里拼好\n}\nlist.append(frag);          // 一次性插入，只重排一次' },
            { t: 'warn', x: '**别在循环里读 `offsetHeight` 之类的布局属性。** 浏览器为了给你准确值会强制执行一次重排，循环 1000 次就是 1000 次重排，页面直接卡死。要读就一次性读完再统一改。' },
            { t: 'note', x: '动画优先用 CSS `transition` / `animation`：浏览器能交给合成线程，甚至不占主线程。JS 逐帧动画只在需要复杂逻辑（跟随鼠标、物理效果）时才用。' }
          ]
        },
        {
          id: 'js6l5', title: '事件委托实战：待办清单', key: '委托 · 状态 · 渲染', time: 16,
          blocks: [
            { t: 'p', x: '把前面学的拼起来：数据（数组）+ 渲染（生成 DOM）+ 事件委派（一个监听器）+ 不可变更新（每次重建列表）。这是最朴素的「数据驱动视图」，也是所有框架的核心思想。' },
            { t: 'code', run: false, label: 'index.html', x: '<form id="add">\n  <input id="text" placeholder="要做什么？" autocomplete="off">\n  <button>添加</button>\n</form>\n<ul id="todo"></ul>\n<p id="count"></p>' },
            { t: 'code', run: false, label: 'main.js', x: 'let todos = [];\nconst listEl = document.querySelector("#todo");\nconst countEl = document.querySelector("#count");\n\nfunction render() {\n  listEl.innerHTML = "";\n  const frag = document.createDocumentFragment();\n\n  todos.forEach(t => {\n    const li = document.createElement("li");\n    li.dataset.id = t.id;\n    li.className = t.done ? "done" : "";\n    li.innerHTML = `<span>${t.text}</span><button class="del">×</button>`;\n    frag.append(li);\n  });\n\n  listEl.append(frag);\n  countEl.textContent = `共 ${todos.length} 条，未完成 ${todos.filter(t => !t.done).length} 条`;\n}\n\n/* 添加 */\ndocument.querySelector("#add").addEventListener("submit", e => {\n  e.preventDefault();\n  const input = document.querySelector("#text");\n  const text = input.value.trim();\n  if (!text) return;\n  todos = [...todos, { id: Date.now(), text, done: false }];\n  input.value = "";\n  render();\n});\n\n/* 一个监听器同时处理「勾选」和「删除」 */\nlistEl.addEventListener("click", e => {\n  const li = e.target.closest("li");\n  if (!li) return;\n  const id = Number(li.dataset.id);\n\n  if (e.target.classList.contains("del")) {\n    todos = todos.filter(t => t.id !== id);\n  } else {\n    todos = todos.map(t => (t.id === id ? { ...t, done: !t.done } : t));\n  }\n  render();\n});' },
            { t: 'table', head: ['设计点', '为什么这样做'], rows: [
              ['数据是唯一来源', '渲染结果永远由 `todos` 决定，不会出现「页面和数据不一致」'],
              ['每次全量重建', '逻辑简单，不用手写增删改 DOM；数据量大时再优化'],
              ['`DocumentFragment`', '拼好一次插入，只触发一次重排'],
              ['事件委托', '新增的 li 自动生效，不需要重新绑定'],
              ['不可变更新', '`map` / `filter` 返回新数组，方便回退和比较']
            ] },
            { t: 'warn', x: '**`li.innerHTML = `<span>${t.text}</span>...` 有 XSS 风险**：如果用户输入 `<img src=x onerror=alert(1)>` 就会被执行。正确做法是用 `textContent` 单独设置文本，或先做转义。' },
            { t: 'note', x: '「全量重建」在数据量大时会卡（每次创建几千个节点）。真实项目会用虚拟 DOM（React）或只更新变化的节点。但**先让逻辑正确，再谈性能**——这个顺序不能反过来。' }
          ]
        }
      ]
    },
    {
      id: 'js7', num: 7, title: '浏览器与网络', icon: '🌍',
      intro: '页面要拿数据、要记住用户的选择、要把代码拆成多个文件。这三件事分别对应 `fetch`、`localStorage`、ES Module——是前端工程的地基。',
      goals: ['用 fetch 发 GET / POST 并处理错误', '用 localStorage 存用户设置', '知道什么该存、什么不该存', '用 ESM 拆分与引入模块'],
      lessons: [
        {
          id: 'js7l1', title: 'fetch 与接口调用', key: 'GET · POST · 错误处理', time: 16,
          blocks: [
            { t: 'p', x: '`fetch(url)` 返回一个 Promise，解析出 `Response`。注意两个坑：**只有网络故障才 reject**，服务器返回 500 也是 resolve；**要拿 JSON 得再 `await res.json()`**（这也是异步的）。' },
            { t: 'code', x: '/* 用一个假的 fetch 演示调用方式，真实环境直接用浏览器的 fetch */\nconst fakeFetch = url => Promise.resolve({\n  ok: true,\n  status: 200,\n  json: () => Promise.resolve({ code: 0, data: { name: "小明" } })\n});\n\nasync function getUser() {\n  const res = await fakeFetch("/api/user/1");\n  if (!res.ok) throw new Error("HTTP " + res.status);   // 必须自己判断\n  const body = await res.json();\n  return body.data.name;\n}\n\ngetUser().then(n => console.log("用户名", n));', out: '用户名 小明' },
            { t: 'h', x: 'POST 请求与业务错误' },
            { t: 'code', x: 'const fakeFetch = (url, opt) => Promise.resolve(\n  url === "/api/login"\n    ? { ok: true, status: 200, json: () => Promise.resolve({ token: "abc" }) }\n    : { ok: false, status: 404, json: () => Promise.resolve({ message: "没有这个接口" }) }\n);\n\nasync function post(path, data) {\n  const res = await fakeFetch(path, {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(data)\n  });\n  if (!res.ok) {\n    const err = await res.json();\n    throw new Error(err.message);\n  }\n  return res.json();\n}\n\n(async () => {\n  const r = await post("/api/login", { user: "a" });\n  console.log("登录成功", r.token);\n  try {\n    await post("/api/nope", {});\n  } catch (e) {\n    console.log("失败", e.message);\n  }\n})();', out: '登录成功 abc\n失败 没有这个接口' },
            { t: 'table', head: ['状态', '`res.ok`', '要不要处理'], rows: [
              ['200~299', 'true', '正常取数据'],
              ['400 参数错', 'false', '提示用户改输入'],
              ['401 未登录', 'false', '跳登录页'],
              ['403 无权限', 'false', '提示无权限'],
              ['404', 'false', '提示不存在'],
              ['500 / 502', 'false', '提示稍后重试，可上报日志']
            ] },
            { t: 'warn', x: '**`fetch` 不会因为 404/500 而 reject。** 只有断网、DNS 失败这类网络层问题才会。所以每次都必须自己检查 `res.ok`，否则你会拿着一个「错误页面的 HTML」去 `res.json()`，报出莫名其妙的解析错误。' },
            { t: 'note', x: '要取消请求或加超时，用 `AbortController`：`fetch(url, { signal: ctrl.signal })`，需要时 `ctrl.abort()`。这是浏览器原生支持，不用引库。' }
          ]
        },
        {
          id: 'js7l2', title: '本地存储与持久化', key: 'localStorage · JSON', time: 14,
          blocks: [
            { t: 'p', x: '`localStorage` 存键值对，**值只能是字符串**，容量约 5MB，永不过期（除非手动清）。所以存对象必须先 `JSON.stringify`，读出来再 `JSON.parse`。' },
            { t: 'code', x: '/* 用 Map 模拟 localStorage，演示「序列化 → 读取 → 兜底」的完整套路 */\nconst raw = new Map();\nconst storage = {\n  set(k, v) { raw.set(k, JSON.stringify(v)); },\n  get(k, fallback = null) {\n    const s = raw.get(k);\n    if (s == null) return fallback;\n    try { return JSON.parse(s); } catch (e) { return fallback; }\n  }\n};\n\nstorage.set("settings", { theme: "dark", fontSize: 14 });\nconst s = storage.get("settings", {});\nconsole.log(s.theme, s.fontSize);\nconsole.log(storage.get("missing", "默认值"));\nconsole.log(typeof raw.get("settings"));', out: 'dark 14\n默认值\nstring' },
            { t: 'code', run: false, label: '真实 localStorage 用法', x: '// 存\nlocalStorage.setItem("token", "abc123");\nlocalStorage.setItem("settings", JSON.stringify({ theme: "dark" }));\n\n// 读（带兜底，防止第一次访问时是 null）\nconst settings = JSON.parse(localStorage.getItem("settings") || "{}");\n\n// 删\nlocalStorage.removeItem("token");\n\n// 全清（慎用，会把用户所有设置都清掉）\n// localStorage.clear();' },
            { t: 'table', head: ['存储', '容量', '生命周期', '适合'], rows: [
              ['`localStorage`', '约 5MB', '永久，除非清除', '用户设置、草稿、进度'],
              ['`sessionStorage`', '约 5MB', '关闭标签页即清', '一次性表单、临时状态'],
              ['`Cookie`', '约 4KB', '可设过期时间', '需要随请求发到服务器的 token'],
              ['`IndexedDB`', '很大', '永久', '大量结构化数据、离线缓存']
            ] },
            { t: 'warn', x: '**别把敏感信息放 localStorage**：它没有任何保护，同源的任何 JS（包括被注入的第三方脚本）都能读。密码、身份证、长期有效的 token 都不该放这里。' },
            { t: 'note', x: '`JSON.parse(localStorage.getItem(k) || "{}")` 是标准兜底写法。如果直接 parse `null` 会抛 `SyntaxError`，而这在「用户第一次访问」时必然发生。' }
          ]
        },
        {
          id: 'js7l3', title: '模块化：import 与 export', key: 'ESM · 默认导出', time: 14,
          blocks: [
            { t: 'p', x: 'ES Module 用 `export` 导出、`import` 引入。它有三个好处：**作用域隔离**（不会污染全局）、**依赖清晰**（谁引了谁一目了然）、**支持 tree-shaking**（打包时去掉没用的代码）。' },
            { t: 'code', run: false, label: 'math.js（具名导出）', x: 'export const PI = 3.14159;\n\nexport function add(a, b) { return a + b; }\n\nexport default function multiply(a, b) { return a * b; }\n\n// 也可以统一在末尾导出\n// export { PI, add };' },
            { t: 'code', run: false, label: 'main.js（引入）', x: '// 具名导入：名字必须对上\nimport { add, PI } from "./math.js";\n\n// 默认导入：名字随便起\nimport multiply from "./math.js";\n\n// 全部导入成一个命名空间\nimport * as math from "./math.js";\n\nconsole.log(add(1, 2), multiply(3, 4), math.PI);\n\n// 别名\nimport { add as plus } from "./math.js";' },
            { t: 'table', head: ['写法', '导出', '引入'], rows: [
              ['具名', '`export const x = 1`', '`import { x } from "./m.js"`'],
              ['默认', '`export default fn`', '`import fn from "./m.js"`'],
              ['全部', '—', '`import * as m from "./m.js"`'],
              ['别名', '`export { a as b }`', '`import { a as c }`'],
              ['只执行不引入', '—', '`import "./style.css"`']
            ] },
            { t: 'p', x: '浏览器里用 ESM 必须在 `<script>` 上写 `type="module"`，而且**通过 http 协议访问**（`file://` 会被 CORS 拦）。本地调试用 `python -m http.server` 或 VS Code 的 Live Server。' },
            { t: 'warn', x: '**CommonJS（`require` / `module.exports`）和 ESM 不能随便混用**。Node 里靠 `package.json` 的 `"type": "module"` 切换；混用会报 `require is not defined` 或 `Cannot use import statement outside a module`。' },
            { t: 'note', x: '默认导出适合「一个文件就一个主要东西」（一个组件、一个类）；具名导出适合「工具集合」。团队项目里统一风格比选哪种更重要。' }
          ]
        }
      ]
    },
    {
      id: 'js8', num: 8, title: 'ES6+ 与工程实践', icon: '⚡',
      intro: '这一章是「让代码变短变稳」的语法糖合集，以及两个高频面试题（生成器、防抖节流）。语法糖不是炫技，它们消除的是整类空值判断和样板代码。',
      goals: ['用可选链与空值合并消灭层层判断', '写生成器并理解惰性求值', '读懂常用正则并会写分组替换', '手写防抖与节流'],
      lessons: [
        {
          id: 'js8l1', title: '解构、展开与可选链', key: '?. · ?? · ...', time: 14,
          blocks: [
            { t: 'p', x: '可选链 `?.` 在遇到 `null` / `undefined` 时**立刻短路返回 undefined**，不再往下取；空值合并 `??` 只在 `null` / `undefined` 时用默认值（`||` 会把 0 和 "" 也当假）。' },
            { t: 'code', x: 'const user = { name: "小明", address: { city: "广州" }, tags: ["a", "b"] };\n\nconsole.log(user?.address?.city);\nconsole.log(user?.contact?.phone ?? "没有电话");\nconsole.log(user.tags?.[1]);\nconsole.log(String(user.missing?.[0]));\n\nconst cfg = { retry: 0, name: "" };\nconsole.log(`?? 得 ${JSON.stringify(cfg.name ?? "默认")}，|| 得 ${cfg.name || "默认"}`);\nconsole.log(cfg.retry ?? 3, cfg.retry || 3);', out: '广州\n没有电话\nb\nundefined\n?? 得 ""，|| 得 默认\n0 3' },
            { t: 'table', head: ['写法', '等价于', '什么时候用'], rows: [
              ['`a?.b`', '`a == null ? undefined : a.b`', '不确定 a 是否存在'],
              ['`a?.()`', 'a 存在才调用', '回调可能没传'],
              ['`a?.[i]`', 'a 存在才取下标', '数组可能不存在'],
              ['`a ?? b`', 'a 是 null/undefined 才用 b', '默认值（保留 0 和 ""）'],
              ['`a \|\| b`', 'a 为假就用 b', '布尔兜底'],

            ] },
            { t: 'code', x: 'const [first, second = "默认", ...others] = [1];\nconsole.log(first, second, others.length);\n\nconst { a = 1, b: { c } = { c: 9 } } = { a: undefined };\nconsole.log(a, c);\n\nconst arr = [3, 1, 2];\nconsole.log(Math.max(...arr));\nconsole.log([...new Set([1, 1, 2])].join(","));\n\nfunction f({ x = 0, y = 0 } = {}) { return x + y; }\nconsole.log(f(), f({ x: 2 }));', out: '1 默认 0\n1 9\n3\n1,2\n0 2' },
            { t: 'warn', x: '`?.` **不能用在赋值左边**：`obj?.a = 1` 是语法错误。只能读，不能写。' },
            { t: 'note', x: '`??` 不能和 `||` / `&&` 混用而不加括号，`a ?? b || c` 会直接语法报错。要混用就写 `(a ?? b) || c`，顺便也让读的人知道你什么意思。' }
          ]
        },
        {
          id: 'js8l2', title: '迭代器与生成器', key: 'yield · Symbol.iterator', time: 16,
          blocks: [
            { t: 'p', x: '生成器函数（`function*`）用 `yield` 一次次交出值，**被调用时才逐步计算**——这叫惰性求值。它能表示无限序列，也能把异步流程写成同步的样子。' },
            { t: 'code', x: 'function* range(start, end, step = 1) {\n  for (let i = start; i < end; i += step) yield i;\n}\n\nconsole.log([...range(0, 5)].join(","));\nconsole.log([...range(0, 10, 3)].join(","));\n\nconst it = range(1, 4);\nconsole.log(it.next().value, it.next().value, it.next().value, it.next().done);', out: '0,1,2,3,4\n0,3,6,9\n1 2 3 true' },
            { t: 'code', x: 'function* fib(n) {\n  let [a, b] = [0, 1];\n  for (let i = 0; i < n; i++) {\n    yield a;\n    [a, b] = [b, a + b];\n  }\n}\nconsole.log([...fib(8)].join(","));\n\n/* 无限序列也能表示，因为按需取 */\nfunction* naturals() { let n = 1; while (true) yield n++; }\nconst g = naturals();\nconsole.log(g.next().value, g.next().value, g.next().value);', out: '0,1,1,2,3,5,8,13\n1 2 3' },
            { t: 'h', x: '自己实现可迭代对象' },
            { t: 'code', x: 'const obj = {\n  data: [10, 20],\n  [Symbol.iterator]() {\n    return this.data[Symbol.iterator]();\n  }\n};\nconsole.log([...obj].join(","));\nconsole.log(Array.from(obj).join("-"));\n\nfor (const v of obj) console.log("遍历", v);', out: '10,20\n10-20\n遍历 10\n遍历 20' },
            { t: 'table', head: ['场景', '为什么用生成器'], rows: [
              ['分页读取', '每次只取一页，不用一次加载全部'],
              ['无限序列', '按需生成，永不结束也不占内存'],
              ['自定义遍历', '实现 `Symbol.iterator` 让对象能用 `for...of`'],
              ['状态机', '`yield` 天然保存了执行位置']
            ] },
            { t: 'warn', x: '生成器**只能遍历一次**。取完就没有了，要重新遍历必须再调用一次生成器函数拿新的迭代器。' },
            { t: 'note', x: '`async/await` 本质上就是生成器 + Promise 的自动执行器（babel 编译出来的代码能看到这个痕迹）。理解了生成器，就理解了 async 的实现原理。' }
          ]
        },
        {
          id: 'js8l3', title: '正则表达式实战', key: '分组 · 命名捕获 · 替换', time: 16,
          blocks: [
            { t: 'p', x: '正则的四个常用操作：`test`（是否匹配）、`match`（取出匹配内容）、`replace`（替换）、`split`（切分）。写正则先想清楚「要匹配的最小单位是什么」，再拼量词。' },
            { t: 'code', x: 'console.log(/\\d+/.test("abc123"));\nconsole.log("a1b22c333".match(/\\d+/g).join(","));\nconsole.log("a1b22c333".replace(/\\d+/g, "#"));\nconsole.log("2024-03-01".split("-").join("/"));', out: 'true\n1,22,333\na#b#c#\n2024/03/01' },
            { t: 'h', x: '分组与反向引用' },
            { t: 'code', x: 'console.log("2024-03-01".replace(/(\\d+)-(\\d+)-(\\d+)/, "$3/$2/$1"));\n\nconst m = "abc123".match(/([a-z]+)(\\d+)/);\nconsole.log(m[1], m[2]);\n\nconst { groups } = /(?<year>\\d{4})-(?<month>\\d{2})/.exec("2024-03");\nconsole.log(groups.year, groups.month);\n\nconsole.log(/^\\S+@\\S+\\.\\S+$/.test("a@b.com"));\nconsole.log(/^1[3-9]\\d{9}$/.test("13812345678"));', out: '01/03/2024\nabc 123\n2024 03\ntrue\ntrue' },
            { t: 'table', head: ['符号', '含义', '例子'], rows: [
              ['`\\d` `\\w` `\\s`', '数字 / 字母数字下划线 / 空白', '`\\d{3}` 三个数字'],
              ['`+` `*` `?`', '1 次以上 / 0 次以上 / 0 或 1 次', '`a+` 至少一个 a'],
              ['`{n,m}`', 'n 到 m 次', '`\\d{2,4}`'],
              ['`( )`', '分组，可捕获', '`(\\d+)-(\\d+)`'],
              ['`(?: )`', '只分组不捕获', '性能略好'],
              ['`(?<name> )`', '命名捕获', '`groups.name`'],
              ['`^` `$`', '开头 / 结尾', '校验要用'],
              ['`g` `i`', '全局 / 忽略大小写', '`/abc/gi`']
            ] },
            { t: 'code', x: 'const text = "价格：￥128，折扣：￥32";\nconsole.log(text.replace(/￥(\\d+)/g, (_, n) => `￥${Number(n) * 0.8}`));\nconsole.log(text.match(/￥\\d+/g).length);', out: '价格：￥102.4，折扣：￥25.6\n2' },
            { t: 'warn', x: '**校验一定要加 `^` 和 `$`**（或用 `test` 配 `/^...$/`）。`/\\d+/.test("abc123")` 是 true，因为「包含数字」就算匹配；要「整个字符串都是数字」必须写 `/^\\d+$/`。' },
            { t: 'note', x: '带 `g` 标志的正则对象**有状态**（内部记录 `lastIndex`），重复用同一个对象调 `test` 会出现「一次 true 一次 false」。每次新建，或者用字符串方法（它们不共享状态）。' }
          ]
        },
        {
          id: 'js8l4', title: '防抖、节流与工程习惯', key: 'debounce · throttle', time: 16,
          blocks: [
            { t: 'p', x: '**防抖（debounce）**：等用户停下来再执行，适合搜索框输入。**节流（throttle）**：固定频率最多执行一次，适合滚动、拖拽、resize。两者都用闭包保存状态。' },
            { t: 'code', x: 'function debounce(fn, ms) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}\n\nfunction throttle(fn, ms) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= ms) {\n      last = now;\n      fn(...args);\n    }\n  };\n}\n\nlet calls = 0;\nconst d = debounce(() => { calls++; }, 20);\nd(); d(); d();\nconsole.log("防抖：连续三次只排了一次，立即调用次数", calls);\n\nconst t = throttle(() => { calls++; }, 30);\nt(); t(); t();\nconsole.log("节流：三次里只有第一次生效，累计", calls);\n\nsetTimeout(() => console.log("20ms 后防抖真正执行，累计", calls), 60);', out: '防抖：连续三次只排了一次，立即调用次数 0\n节流：三次里只有第一次生效，累计 1\n20ms 后防抖真正执行，累计 2' },
            { t: 'table', head: ['场景', '用哪个', '原因'], rows: [
              ['搜索框输入联想', '防抖', '等用户打完字再请求'],
              ['窗口 resize 重算布局', '防抖', '停下来才算'],
              ['滚动加载更多', '节流', '滑动过程中定期检查'],
              ['按钮防连点', '节流（或禁用按钮）', '固定间隔只响应一次'],
              ['鼠标移动画图', '节流', '每帧一次就够']
            ] },
            { t: 'h', x: '几个能省很多事的工程习惯' },
            { t: 'code', x: '/* 1. 提前返回，减少嵌套 */\nfunction pay(order) {\n  if (!order) return "订单不存在";\n  if (order.paid) return "已支付";\n  if (order.amount <= 0) return "金额不合法";\n  return "可以支付";\n}\nconsole.log(pay(null), "|", pay({ paid: true }), "|", pay({ amount: 10 }));\n\n/* 2. 用对象表代替长 if-else */\nconst actions = {\n  add: x => x + 1,\n  sub: x => x - 1\n};\nconsole.log(actions.add(1), actions.sub(1), actions.unknown === undefined);', out: '订单不存在 | 已支付 | 可以支付\n2 0 true' },
            { t: 'warn', x: '防抖和节流都返回**新函数**，必须把它保存下来复用。每次 `addEventListener("input", debounce(fn, 300))` 都会创建新的计时器上下文，防抖完全失效——这是最常见的误用。' },
            { t: 'note', x: '需要「立即执行一次、之后再防抖」用 `debounce(fn, ms, { leading: true })`；需要「停止后也补一次」用 trailing。自己写不清楚时，直接用 lodash 的 `debounce` / `throttle`，它们把边界情况都处理好了。' },
            { t: 'principle', x: '**先写出能用的版本，再优化性能。** 大多数页面的瓶颈不在 JS 计算，而在网络和渲染。别过早把所有函数都包上防抖——代码会变得难读，收益却可能是 0。' }
          ]
        }
      ]
    },
/*CHAPTERS*/
  ],
  quiz: [
    { id: 'jsq1', ch: 'js1', lesson: 'js1l2', point: 'var 与 let 的作用域', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'var a = 1;\nlet b = 2;\n{\n  var a = 3;\n  let b = 4;\n  console.log(a, b);\n}\nconsole.log(a, b);',
      answer: '3 4\n3 2',
      explain: '`var` 只有函数作用域，块里的 `var a` 直接改掉了外面那个 a，所以出了块还是 3；`let` 是块作用域，块里的 b 是另一个变量，出来还是 2。' },

    { id: 'jsq2', ch: 'js1', lesson: 'js1l3', point: '类型转换规则', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'console.log(String(0.1 + 0.2));\nconsole.log(String(Number("12px")));\nconsole.log(typeof null);\nconsole.log(Boolean(""), Boolean("0"), Boolean(0));',
      answer: '0.30000000000000004\nNaN\nobject\nfalse true false',
      explain: '浮点数用二进制存，0.1 + 0.2 有尾差；`Number("12px")` 转不了就得到 `NaN`；`typeof null` 是历史遗留的 `"object"`；空字符串转布尔是 false，但字符串 `"0"` 是非空字符串所以是 true，数字 0 是 false。' },

    { id: 'jsq3', ch: 'js1', lesson: 'js1l4', point: '== 的类型转换', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'console.log(null == undefined);\nconsole.log(null === undefined);\nconsole.log(0 == "");\nconsole.log(0 === "");\nconsole.log([1] == 1);',
      answer: 'true\nfalse\ntrue\nfalse\ntrue',
      explain: '`==` 时 null 与 undefined 互等（且只与彼此相等）；`0 == ""` 会把空字符串转成 0；数组 `[1]` 会先转成原始值 `"1"` 再转成 1，所以等于 1。`===` 不做转换，类型不同直接 false。' },

    { id: 'jsq4', ch: 'js1', lesson: 'js1l5', point: '模板字符串', type: 'choice', diff: 1,
      prompt: '关于模板字符串，下面哪个说法是**错的**？',
      opts: ['用反引号包裹，可以跨行', '`${}` 里可以写任意表达式', '`${}` 里的值会自动调用 toString 拼接', '模板字符串拼接大量内容时比数组 join 慢一个量级'],
      ans: 3,
      explain: '模板字符串由引擎优化，拼接性能通常不输（甚至优于）字符串 `+`。前三个都是它的正常行为：可跨行、可放表达式、非字符串值会被转成字符串。' },

    { id: 'jsq5', ch: 'js1', lesson: 'js1l1', point: '运行环境', type: 'choice', diff: 1,
      prompt: '同一段 JS 在浏览器和 Node 里，最本质的区别是什么？',
      opts: ['语法不一样，Node 用的不是标准 JS', '宿主环境提供的全局 API 不一样：浏览器有 document，Node 有 fs', 'Node 里不能写箭头函数', '浏览器里的变量不需要声明'],
      ans: 1,
      explain: '语言本身（语法、类型、原型、Promise）是同一套规范。差异在**宿主**：浏览器给 `window`/`document`，Node 给 `process`/`fs`/`require`。' },

    { id: 'jsq6', ch: 'js2', lesson: 'js2l3', point: '提升', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'console.log(typeof f);\nfunction f() {}\nconsole.log(typeof g);\nvar g = function () {};',
      answer: 'function\nundefined',
      explain: '函数声明整体提升，所以第一行就能用；`var g` 只提升了声明，赋值还没执行，此时值是 `undefined`，`typeof` 得到 `"undefined"`。' },

    { id: 'jsq7', ch: 'js2', lesson: 'js2l3', point: 'TDZ', type: 'choice', diff: 2,
      prompt: '`let` 声明的变量在「暂时性死区」里访问会怎样？',
      opts: ['返回 undefined', '抛出 ReferenceError', '返回 null', '自动取到外层的同名变量'],
      ans: 1,
      explain: '`let`/`const` 也会提升，但在声明语句执行前处于 TDZ，此时访问是**运行时错误** `ReferenceError`，而不是 undefined。' },

    { id: 'jsq8', ch: 'js2', lesson: 'js2l4', point: '闭包保留状态', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'function counter() {\n  let n = 0;\n  return () => ++n;\n}\nconst c = counter();\nc(); c();\nconsole.log(c());\nconst d = counter();\nconsole.log(d());',
      answer: '3\n1',
      explain: '每次调用 `counter()` 都创建一份全新的 `n`。`c` 连着的那个 n 被加到了 3；`d` 是另一个闭包，从 0 开始。' },

    { id: 'jsq9', ch: 'js2', lesson: 'js2l5', point: 'this 的绑定', type: 'choice', diff: 3,
      prompt: '`const f = obj.method; f();` 执行时，`f` 里的 `this` 是什么？',
      opts: ['一定是 obj', '是 undefined（严格模式）或全局对象（非严格模式）', '是 f 函数本身', '报错，无法调用'],
      ans: 1,
      explain: '`this` 由**调用方式**决定，跟函数定义在哪里无关。`f()` 是普通调用，没有接收者，严格模式下 this 就是 undefined。想要 obj，必须 `obj.method()` 或 `f.call(obj)`。' },

    { id: 'jsq10', ch: 'js2', lesson: 'js2l2', point: 'rest 参数', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'function sum(...xs) {\n  return xs.reduce((a, b) => a + b, 0);\n}\nconsole.log(sum(1, 2, 3));\nconsole.log(sum());\nconsole.log(Array.isArray(sum(1)));',
      answer: '6\n0\nfalse',
      explain: 'rest 参数永远是一个**真数组**（这是它和 `arguments` 的关键区别）。没传参时是空数组，reduce 用初始值 0 得 0。最后一行返回的是数字 6 再传给 isArray，当然是 false。' },

    { id: 'jsq11', ch: 'js3', lesson: 'js3l1', point: '解构与默认值', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const { a, b = 2, c: cc } = { a: 1, c: 3 };\nconsole.log(a, b, cc);\nconst [x, , y = 9] = [10, 20];\nconsole.log(x, y);',
      answer: '1 2 3\n10 9',
      explain: '`b` 在源对象里不存在（undefined），默认值生效；`c: cc` 是**重命名**，把 c 的值绑给 cc；数组里空一位表示跳过 20，`y` 对应 undefined 所以取默认值 9。' },

    { id: 'jsq12', ch: 'js3', lesson: 'js3l2', point: '原型链查找', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'function Animal(name) { this.name = name; }\nAnimal.prototype.speak = function () { return this.name + " 叫"; };\nconst a = new Animal("猫");\nconsole.log(a.speak());\nconsole.log(Object.getPrototypeOf(a) === Animal.prototype);\nconsole.log(a.hasOwnProperty("speak"));',
      answer: '猫 叫\ntrue\nfalse',
      explain: '`speak` 挂在原型上，实例自己没有，所以 `hasOwnProperty` 为 false，但沿原型链能查到并调用。`new` 会把实例的 `[[Prototype]]` 指向 `Animal.prototype`。' },

    { id: 'jsq13', ch: 'js3', lesson: 'js3l3', point: 'class 继承', type: 'choice', diff: 2,
      prompt: '子类构造器里想用 `this`，必须先做什么？',
      opts: ['先调用 `super()`', '先给 this 赋值', '什么都不用做', '先执行 `Object.create(this)`'],
      ans: 0,
      explain: '派生类的 `this` 由父类构造器创建，`super()` 之前 `this` 还不存在，访问会抛 ReferenceError。这也是为什么 `super()` 必须写在 `this` 之前。' },

    { id: 'jsq14', ch: 'js3', lesson: 'js3l5', point: 'JSON 的边界', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'const o = { d: new Date(0), f() {}, u: undefined, n: null, a: [1, undefined] };\nconsole.log(JSON.stringify(o));\nconsole.log(JSON.stringify({ x: 1 }).length);',
      answer: '{"d":"1970-01-01T00:00:00.000Z","n":null,"a":[1,null]}\n7',
      explain: 'JSON 里没有函数和 undefined：对象的这两个键被**直接丢掉**，数组里的 undefined 则被转成 `null`（保持长度）。Date 会走 `toJSON` 变成 ISO 字符串。' },

    { id: 'jsq15', ch: 'js3', lesson: 'js3l4', point: 'getter 与 setter', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const user = {\n  first: "小", last: "明",\n  get full() { return this.last + this.first; },\n  set full(v) { [this.last, this.first] = v.split(" "); }\n};\nconsole.log(user.full);\nuser.full = "王 五";\nconsole.log(user.full);',
      answer: '明小\n王五',
      explain: '`get full()` 让 `user.full` 像属性一样读，实际执行函数，返回「姓 + 名」；赋值时走 setter，把 `"王 五"` 拆成 last 和 first，再读就拼成 `王五`。' },

    { id: 'jsq16', ch: 'js4', lesson: 'js4l2', point: 'map / filter / reduce', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const nums = [1, 2, 3, 4, 5];\nconsole.log(nums.filter(n => n % 2).map(n => n * 10));\nconsole.log(nums.reduce((a, n) => a + n, 0));\nconsole.log(nums.reduce((a, n) => a + n));',
      answer: '[10,30,50]\n15\n15',
      explain: '`filter(n => n % 2)` 保留奇数（1、3、5），再乘 10。reduce 带初始值 0 从 0 累加；不带初始值时拿第一个元素当起点，结果一样是 15。' },

    { id: 'jsq17', ch: 'js4', lesson: 'js4l1', point: 'slice 与 splice', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const a = [1, 2, 3, 4, 5];\nconsole.log(a.slice(1, 3));\nconsole.log(a.splice(1, 2));\nconsole.log(a);',
      answer: '[2,3]\n[2,3]\n[1,4,5]',
      explain: '`slice(1, 3)` 取下标 1 到 2（不含 3），**不改原数组**；`splice(1, 2)` 从下标 1 删 2 个，**返回被删的元素**并改变原数组，所以最后只剩 `[1,4,5]`。' },

    { id: 'jsq18', ch: 'js4', lesson: 'js4l3', point: 'sort 的默认行为', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const s = ["10", "9", "100"];\nconsole.log([...s].sort());\nconsole.log([...s].sort((a, b) => a - b));',
      answer: '["10","100","9"]\n["9","10","100"]',
      explain: '不传比较函数时 sort 把元素转成**字符串**按字典序比，`"9"` 比 `"10"` 大；传 `(a,b) => a-b` 才按数值排。注意数字数组不传比较函数也会出错。' },

    { id: 'jsq19', ch: 'js4', lesson: 'js4l4', point: '深浅拷贝', type: 'choice', diff: 2,
      prompt: '下面哪个是**深拷贝**？',
      opts: ['`{ ...obj }`', '`Object.assign({}, obj)`', '`structuredClone(obj)`', '`obj.slice()`'],
      ans: 2,
      explain: '前两个都只复制第一层，嵌套对象仍共享引用。`structuredClone` 会递归复制，并且能处理 Date、Map、Set、循环引用（函数不行）。' },

    { id: 'jsq20', ch: 'js4', lesson: 'js4l2', point: 'forEach 的局限', type: 'choice', diff: 2,
      prompt: '想遍历数组、遇到第一个满足条件的元素就**提前结束**，应该用哪个？',
      opts: ['forEach', 'map', 'for...of（或 some / find）', 'filter'],
      ans: 2,
      explain: '`forEach` 和 `map` 都会跑完全部元素，`return` 只能跳出当前回调，不能中断循环。要中途退出就用 `for...of` 配 `break`，或者用 `some`/`find` 这类语义化方法。' },

    { id: 'jsq21', ch: 'js5', lesson: 'js5l1', point: '微任务与宏任务', type: 'output', diff: 3,
      prompt: '写出输出顺序。',
      code: 'console.log("1");\nsetTimeout(() => console.log("2"), 0);\nPromise.resolve().then(() => console.log("3"));\nconsole.log("4");',
      answer: '1\n4\n3\n2',
      explain: '同步代码先跑完（1、4），然后清空**微任务**队列（Promise 的 then，输出 3），最后才轮到**宏任务**（setTimeout，输出 2）。哪怕延时写 0，定时器也排在微任务之后。' },

    { id: 'jsq22', ch: 'js5', lesson: 'js5l3', point: 'catch 之后链还能继续', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'Promise.resolve(1)\n  .then(v => v + 1)\n  .then(v => { throw new Error("x"); })\n  .catch(e => 0)\n  .then(v => console.log(v));',
      answer: '0',
      explain: '中间抛错会跳到最近的 `catch`，`catch` 的返回值 0 让链条**恢复正常**，后面的 then 拿到 0。如果 catch 里又抛，就会继续往后找下一个 catch。' },

    { id: 'jsq23', ch: 'js5', lesson: 'js5l4', point: 'async 的返回值', type: 'choice', diff: 2,
      prompt: '`async function f() { return 1; }`，调用 `f()` 得到什么？',
      opts: ['数字 1', 'Promise，resolve 值是 1', 'undefined', '需要再调用一次才执行'],
      ans: 1,
      explain: '`async` 函数的返回值会被自动包成 Promise。所以拿结果要 `await f()` 或 `f().then(...)`。函数体是同步开始执行的，只是返回被包装了。' },

    { id: 'jsq24', ch: 'js5', lesson: 'js5l5', point: 'allSettled 的结果', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'Promise.allSettled([Promise.resolve(1), Promise.reject(new Error("坏"))])\n  .then(r => console.log(r.map(x => x.status)));',
      answer: '["fulfilled","rejected"]',
      explain: '`allSettled` 等所有任务都有结果才 resolve，不管成功失败，每项带着 `status`。`Promise.all` 则是一遇到 reject 就整体失败，拿不到后面的结果。' },

    { id: 'jsq25', ch: 'js5', lesson: 'js5l2', point: '清除定时器', type: 'choice', diff: 1,
      prompt: '`setInterval` 创建后想让它停下来，应该调用什么？',
      opts: ['clearTimeout', 'clearInterval（传入返回的 id）', 'stop()', 'return false'],
      ans: 1,
      explain: '`setInterval` 返回一个 id，用 `clearInterval(id)` 清除。把 id 存到变量里很关键，否则组件卸载后就再也停不掉，会造成定时器泄漏。' },

    { id: 'jsq26', ch: 'js6', lesson: 'js6l1', point: 'textContent 与 innerHTML', type: 'choice', diff: 1,
      prompt: '要把用户输入的一段文字显示到页面，用哪个更安全？',
      opts: ['`el.innerHTML = text`', '`el.textContent = text`', '`el.outerHTML = text`', '`el.insertAdjacentHTML("beforeend", text)`'],
      ans: 1,
      explain: '`textContent` 把内容当**纯文本**，`<` 会被转义显示。用 innerHTML 系列拼接用户输入，等于给自己开了 XSS 的后门。' },

    { id: 'jsq27', ch: 'js6', lesson: 'js6l2', point: '事件冒泡', type: 'choice', diff: 2,
      prompt: '点击按钮时，想让事件**不再往上冒泡**给父元素，调用什么？',
      opts: ['`e.preventDefault()`', '`e.stopPropagation()`', '`e.target = null`', '`return true`'],
      ans: 1,
      explain: '`stopPropagation()` 阻止冒泡（和捕获阶段的继续传播）；`preventDefault()` 是取消默认行为（比如表单提交、链接跳转），两件事完全不同。' },

    { id: 'jsq28', ch: 'js6', lesson: 'js6l3', point: '阻止表单提交', type: 'choice', diff: 1,
      prompt: '用 JS 校验表单，校验不通过时想阻止页面刷新，应该在 submit 回调里做什么？',
      opts: ['`e.preventDefault()`', '`e.stopPropagation()`', '`form.reset()`', '`throw new Error()`'],
      ans: 0,
      explain: '表单提交会触发默认的导航行为，`preventDefault()` 正好取消它。`stopPropagation` 只管事件传播，表单照样提交。' },

    { id: 'jsq29', ch: 'js6', lesson: 'js6l4', point: '重排与重绘', type: 'choice', diff: 3,
      prompt: '做位移动画时，为什么推荐 `transform: translateX()` 而不是改 `left`？',
      opts: ['因为 left 不支持动画', '因为 transform 走合成层，通常不触发重排，只做合成', '因为 left 只能用整数', '两者性能完全一样'],
      ans: 1,
      explain: '改 `left`/`top`/`width` 会让浏览器重新计算布局（reflow），代价高；`transform` 和 `opacity` 可以只走合成（composite），由 GPU 处理，动画更顺。' },

    { id: 'jsq30', ch: 'js6', lesson: 'js6l5', point: '事件委托', type: 'choice', diff: 2,
      prompt: '给列表做事件委托，为了确认「点的是不是某个 li」，最合适的做法是？',
      opts: ['比较 `e.target === ul`', '用 `e.target.closest("li")` 判断并拿到那个 li', '给每个 li 都绑一次监听', '用 `e.target.id` 判断'],
      ans: 1,
      explain: '`e.target` 可能是 li 里面的 span，`closest("li")` 会沿祖先往上找最近的 li，既准确又不用管内部结构。给每个 li 绑监听就失去委托的意义了。' },

    { id: 'jsq31', ch: 'js7', lesson: 'js7l1', point: 'fetch 的错误处理', type: 'choice', diff: 3,
      prompt: '`fetch("/api/x")` 服务端返回 404 时，会怎样？',
      opts: ['Promise 直接 reject', 'Promise resolve，但 `res.ok` 是 false', '抛出同步异常', '自动重试一次'],
      ans: 1,
      explain: 'fetch 只在**网络层失败**（断网、DNS 错）时 reject。HTTP 4xx/5xx 算「请求成功完成」，需要自己判断 `res.ok`（或 `res.status`）后手动 `throw`。' },

    { id: 'jsq32', ch: 'js7', lesson: 'js7l1', point: '响应体只能读一次', type: 'choice', diff: 2,
      prompt: '已经调用过 `await res.json()`，再调用一次 `await res.json()` 会怎样？',
      opts: ['再返回一份同样的数据', '抛出 TypeError：body 已被读取', '返回空对象', '返回字符串'],
      ans: 1,
      explain: '响应体是**流**，只能消费一次。需要多次使用就先存到变量里：`const data = await res.json()`，后面都用 data。' },

    { id: 'jsq33', ch: 'js7', lesson: 'js7l2', point: 'localStorage 的限制', type: 'choice', diff: 2,
      prompt: '关于 localStorage，下面哪个说法对？',
      opts: ['可以直接存对象', '只能存字符串，存对象要先 JSON.stringify', '关闭浏览器就清空', '容量有几 GB'],
      ans: 1,
      explain: 'localStorage 的值统一按字符串存，存对象会被转成 `"[object Object]"`。容量一般 5MB 左右，不会随会话清空（那是 sessionStorage），并且是**同步** API，大量读写会卡主线程。' },

    { id: 'jsq34', ch: 'js7', lesson: 'js7l3', point: '模块导出', type: 'choice', diff: 2,
      prompt: '一个模块里能写几个 `export default`？',
      opts: ['任意多个', '最多一个', '必须至少一个', '一个都不能有'],
      ans: 1,
      explain: '`export default` 是「这个模块的主出口」，只能有一个；具名导出 `export const a = ...` 可以有任意多个，导入时用 `import { a }`。' },

    { id: 'jsq35', ch: 'js7', lesson: 'js7l3', point: '模块作用域', type: 'choice', diff: 3,
      prompt: '用 `<script type="module">` 引入的代码，和普通 script 相比有什么不同？',
      opts: ['没有区别', '默认严格模式、有独立作用域、自动延迟执行', '不能使用箭头函数', '必须写 window.onload'],
      ans: 1,
      explain: '模块默认 `"use strict"`，顶层变量不会挂到 window 上（有自己的作用域），并且默认 `defer`（等 HTML 解析完再执行），还支持 import/export。' },

    { id: 'jsq36', ch: 'js8', lesson: 'js8l1', point: '可选链与空值合并', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const o = { a: { b: 0 } };\nconsole.log(o?.a?.b ?? "默认");\nconsole.log(o?.x?.y ?? "默认");\nconsole.log(o.a.b || "默认");',
      answer: '0\n默认\n默认',
      explain: '`??` 只在左值是 `null`/`undefined` 时取右边，0 是有效值所以照常输出；`o?.x` 是 undefined，`?.y` 短路后整体 undefined，取默认值。`||` 把 0 当成假值，所以最后一行也给了默认值——这就是 `??` 存在的理由。' },

    { id: 'jsq37', ch: 'js8', lesson: 'js8l2', point: '生成器的返回值', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'function* gen() { yield 1; yield 2; return 3; }\nconst it = gen();\nconsole.log(it.next());\nconsole.log([...gen()]);',
      answer: '{"value":1,"done":false}\n[1,2]',
      explain: '`next()` 返回 `{value, done}` 对象。展开运算符只收集 `yield` 出来的值，`return 3` 只是提前结束并把 3 放进最后一次 `next()` 的 value，不会被展开收集。' },

    { id: 'jsq38', ch: 'js8', lesson: 'js8l3', point: '全局匹配与替换', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const s = "a1 b22 c333";\nconsole.log(s.match(/\\d+/g));\nconsole.log(s.replace(/\\d+/g, "#"));\nconsole.log(/\\d+/.test(s));',
      answer: '["1","22","333"]\na# b# c#\ntrue',
      explain: '带 `g` 的 `match` 返回所有匹配组成的数组（此时没有分组信息）；`replace` 配 `g` 会把每一处数字整体换成 #；`test` 只问「有没有匹配」，返回布尔值。' },

    { id: 'jsq39', ch: 'js8', lesson: 'js8l4', point: '防抖与节流', type: 'choice', diff: 2,
      prompt: '搜索框输入联想，希望「用户停手 300ms 后再请求」，应该用？',
      opts: ['节流（throttle）', '防抖（debounce）', 'requestAnimationFrame', 'setInterval 轮询'],
      ans: 1,
      explain: '防抖是「等你不再触发一段时间后才执行一次」，正是输入联想的场景。节流是「固定频率最多执行一次」，适合滚动、拖拽、resize 这类需要持续响应的场景。' },

    { id: 'jsq40', ch: 'js8', lesson: 'js8l1', point: '展开是浅拷贝', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const a = { x: 1, y: { z: 2 } };\nconst b = { ...a };\nb.x = 9;\nb.y.z = 9;\nconsole.log(a.x, a.y.z);',
      answer: '1 9',
      explain: '`{ ...a }` 只复制第一层的值：`x` 是基本类型，改了互不影响；`y` 复制的是**同一个对象的引用**，通过 b 改内部属性，a 看到的也变了。要彻底隔离得用深拷贝。' },
  ],
  checkin: [
    { id: 'jsk1', ch: 'js1', lesson: 'js1l1', point: 'Node 的全局对象', type: 'choice', diff: 1,
      prompt: '下面哪个在浏览器里**没有**、但在 Node 里能用？',
      opts: ['setTimeout', 'require', 'console', 'Promise'],
      ans: 1,
      explain: '`setTimeout`、`console`、`Promise` 在两边都有。`require`（以及 `process`、`fs`）是 Node 宿主提供的，浏览器里没有。' },

    { id: 'jsk2', ch: 'js1', lesson: 'js1l2', point: '块作用域', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'let x = 1;\n{\n  let x = 2;\n  x++;\n}\nconsole.log(x);',
      answer: '1',
      explain: '花括号里那个 `x` 用 `let` 声明，是块内的新变量，和外面完全无关。块内加到了 3 也不会影响外面，外面还是 1。' },

    { id: 'jsk3', ch: 'js1', lesson: 'js1l3', point: 'typeof 的结果', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'console.log(typeof "1", typeof 1, typeof true, typeof undefined);\nconsole.log(typeof []);',
      answer: 'string number boolean undefined\nobject',
      explain: '前四个好记。`typeof []` 是 `"object"`——数组在 JS 里就是对象，判断数组要用 `Array.isArray()`。' },

    { id: 'jsk4', ch: 'js1', lesson: 'js1l4', point: '比较运算符', type: 'choice', diff: 1,
      prompt: '日常写代码时，比较两个值应该默认用哪个？',
      opts: ['`==`', '`===`', '`Object.is` 之外都行', '三种完全等价'],
      ans: 1,
      explain: '`===` 不做类型转换，行为可预测。`==` 的转换规则很容易踩坑（`"" == 0` 是 true）。`Object.is` 只在处理 NaN、-0 这些极端情况时才需要。' },

    { id: 'jsk5', ch: 'js1', lesson: 'js1l5', point: '常用字符串方法', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'const name = "小明";\nconsole.log(`你好，${name}！${1 + 1}`);\nconsole.log("abc".toUpperCase(), "ABC".toLowerCase());\nconsole.log("a,b,c".split(",").length);',
      answer: '你好，小明！2\nABC abc\n3',
      explain: '模板字符串里 `${}` 可以是任意表达式，`1 + 1` 先算成 2 再拼进去。`split` 按逗号切成数组，长度是 3。' },

    { id: 'jsk6', ch: 'js2', lesson: 'js2l1', point: '箭头函数没有 this', type: 'choice', diff: 2,
      prompt: '箭头函数和普通函数相比，少了什么？',
      opts: ['返回值', '自己的 this 和 arguments', '参数列表', '函数名'],
      ans: 1,
      explain: '箭头函数不创建自己的 `this`，它会向外层作用域借用；也没有自己的 `arguments`（要用 rest 参数）。所以它不适合当对象方法或构造器。' },

    { id: 'jsk7', ch: 'js2', lesson: 'js2l2', point: '参数默认值', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'function f(a, b = a * 2) {\n  return a + b;\n}\nconsole.log(f(3));\nconsole.log(f(3, 1));',
      answer: '9\n4',
      explain: '默认值可以是**引用前面参数**的表达式，`f(3)` 时 b 取 3*2=6，返回 9；显式传了 1 就覆盖默认值，返回 4。' },

    { id: 'jsk8', ch: 'js2', lesson: 'js2l3', point: 'var 的提升陷阱', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'var v = 1;\nfunction t() {\n  console.log(String(v));\n  var v = 2;\n}\nt();',
      answer: 'undefined',
      explain: '函数内部声明了 `var v`，声明被提到函数顶部，于是这个 v **遮蔽**了外面的全局 v。打印时赋值还没执行，值是 undefined——这就是经典的提升陷阱。' },

    { id: 'jsk9', ch: 'js2', lesson: 'js2l4', point: '闭包的作用', type: 'choice', diff: 1,
      prompt: '闭包最核心的能力是什么？',
      opts: ['让代码运行更快', '让函数在离开定义环境后，仍能访问那里的变量', '自动回收内存', '替代 class'],
      ans: 1,
      explain: '函数被返回或传出后，它携带的作用域链还在，外层变量不会被回收，所以能持续读写那些变量。计数器、私有变量、缓存都是靠这个实现的。' },

    { id: 'jsk10', ch: 'js2', lesson: 'js2l5', point: 'call 改变 this', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const o = { n: 7, get() { return this.n; } };\nconsole.log(o.get());\nconsole.log(o.get.call({ n: 9 }));',
      answer: '7\n9',
      explain: '`o.get()` 里 this 是 o，得到 7；`call` 把 this 临时换成 `{n: 9}`，同一个函数返回 9。函数体没变，只是接收者变了。' },

    { id: 'jsk11', ch: 'js3', lesson: 'js3l1', point: '剩余属性', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const p = { name: "小明", age: 18, city: "上海" };\nconst { name, ...rest } = p;\nconsole.log(name, rest);',
      answer: '小明 {"age":18,"city":"上海"}',
      explain: '`...rest` 收集**剩下的可枚举自有属性**，组成一个新对象。常用在「排除某个字段」：`const { password, ...safe } = user`。' },

    { id: 'jsk12', ch: 'js3', lesson: 'js3l2', point: 'instanceof 的依据', type: 'choice', diff: 2,
      prompt: '`a instanceof B` 判断的是什么？',
      opts: ['a 是不是 B 的实例', 'B.prototype 是否在 a 的原型链上', 'a 和 B 的类型是否相同', 'a 能否调用 B 的方法'],
      ans: 1,
      explain: '本质是沿 a 的原型链往上找，看有没有 `B.prototype`。所以原型被改动时 instanceof 的结果也会变，跨 iframe 时还会失效。' },

    { id: 'jsk13', ch: 'js3', lesson: 'js3l3', point: 'super 调用父类方法', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class A { hi() { return "A"; } }\nclass B extends A { hi() { return super.hi() + "B"; } }\nconsole.log(new B().hi());\nconsole.log(new B() instanceof A);',
      answer: 'AB\ntrue',
      explain: '`super.hi()` 调用父类的同名方法拿到 "A"，再拼上 "B"。B 的实例原型链上有 A.prototype，所以 instanceof A 为 true。' },

    { id: 'jsk14', ch: 'js3', lesson: 'js3l5', point: 'JSON 往返', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'const o = JSON.parse(\'{"a":1,"b":[2,3]}\');\nconsole.log(o.b.length);\nconsole.log(JSON.stringify(o));',
      answer: '2\n{"a":1,"b":[2,3]}',
      explain: '`JSON.parse` 把字符串变成真正的对象，可以正常取属性；`JSON.stringify` 再序列化回去，键的顺序按对象自有属性的顺序输出，所以和原文一致。' },

    { id: 'jsk15', ch: 'js3', lesson: 'js3l4', point: 'Symbol 的用途', type: 'choice', diff: 2,
      prompt: '`Symbol("x")` 主要解决什么问题？',
      opts: ['提供一种更快的字符串', '创建不会重名、不会出现在 for...in 里的对象键', '压缩 JSON 体积', '替代数字下标'],
      ans: 1,
      explain: '每个 Symbol 都独一无二，用它当键不会和任何已有属性冲突，也不会被 `for...in`、`Object.keys` 枚举到（要用 `Object.getOwnPropertySymbols`）。框架内部属性常用它。' },

    { id: 'jsk16', ch: 'js4', lesson: 'js4l1', point: 'push 与 unshift', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'const a = [1, 2, 3];\na.push(4);\na.unshift(0);\nconsole.log(a);\nconsole.log(a.pop(), a.length);',
      answer: '[0,1,2,3,4]\n4 4',
      explain: '`push` 加在尾部，`unshift` 加在头部；`pop` 从尾部取走一个并返回它（4），此时剩 4 个元素。' },

    { id: 'jsk17', ch: 'js4', lesson: 'js4l2', point: 'map 与 find', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'const words = ["a", "bb", "ccc"];\nconsole.log(words.map(w => w.length));\nconsole.log(words.find(w => w.length > 1));',
      answer: '[1,2,3]\nbb',
      explain: '`map` 把每个元素映射成新值，得到等长数组；`find` 返回**第一个**满足条件的元素本身（不是下标，也不是数组），找不到返回 undefined。' },

    { id: 'jsk18', ch: 'js4', lesson: 'js4l3', point: '数字排序', type: 'choice', diff: 1,
      prompt: '`[3, 10, 2].sort()` 的结果是什么？',
      opts: ['`[2, 3, 10]`', '`[10, 2, 3]`', '`[3, 10, 2]`', '报错'],
      ans: 1,
      explain: '默认 sort 把元素转字符串按字典序比，`"10"` 排在 `"2"` 前面。数字数组必须写 `.sort((a, b) => a - b)`。' },

    { id: 'jsk19', ch: 'js4', lesson: 'js4l4', point: '不可变的写法', type: 'choice', diff: 2,
      prompt: '想「往数组末尾加一个元素但不动原数组」，应该写？',
      opts: ['`arr.push(x)`', '`arr.concat([x])` 或 `[...arr, x]`', '`arr[arr.length] = x`', '`arr.splice(arr.length, 0, x)`'],
      ans: 1,
      explain: '`push`、下标赋值、`splice` 都会**原地修改**。`concat` 和展开语法返回新数组。React/Vue 的状态更新就要求这种不可变写法。' },

    { id: 'jsk20', ch: 'js4', lesson: 'js4l2', point: '用 reduce 计数', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const arr = ["a", "b", "a"];\nconst m = arr.reduce((acc, k) => ((acc[k] = (acc[k] || 0) + 1), acc), {});\nconsole.log(m);',
      answer: '{"a":2,"b":1}',
      explain: '初始值 `{}` 当累加器，每次把 `acc[k]` 自增再原样返回。外层加括号是因为箭头函数用圆括号直接返回逗号表达式的值（返回 `acc`）。' },

    { id: 'jsk21', ch: 'js5', lesson: 'js5l1', point: '同步先于异步', type: 'output', diff: 1,
      prompt: '写出输出顺序。',
      code: 'setTimeout(() => console.log("timeout"), 0);\nconsole.log("sync");',
      answer: 'sync\ntimeout',
      explain: '定时器回调是异步任务，要等当前所有同步代码跑完、调用栈清空后才执行。所以哪怕写 0 毫秒，也是 sync 先打印。' },

    { id: 'jsk22', ch: 'js5', lesson: 'js5l3', point: 'then 的链式传递', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'Promise.resolve("a").then(v => v + "b").then(v => console.log(v));',
      answer: 'ab',
      explain: '第一个 then 的返回值会成为下一个 then 的入参，所以依次拼成 "ab" 再打印。每个 then 都返回一个新的 Promise。' },

    { id: 'jsk23', ch: 'js5', lesson: 'js5l4', point: 'await 的作用', type: 'choice', diff: 2,
      prompt: '`await` 后面跟一个 Promise 时，它做了什么？',
      opts: ['阻塞整个进程直到完成', '暂停当前 async 函数，等 Promise 落定后拿结果继续', '把 Promise 转成普通值', '取消这个 Promise'],
      ans: 1,
      explain: 'await 只是**暂停当前这个 async 函数**，把控制权交回事件循环，其它代码照常跑（不阻塞主线程）。Promise 失败时 await 会抛出异常，要用 try/catch 接。' },

    { id: 'jsk24', ch: 'js5', lesson: 'js5l5', point: 'async 里的抛错', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'async function f() { throw new Error("x"); }\nf().catch(e => console.log("捕获到", e.message));',
      answer: '捕获到 x',
      explain: '`async` 函数里抛出的错误不会炸掉当前调用栈，而是变成返回 Promise 的 reject，所以能用 `.catch` 接住，也能用 `try/await` 接住。' },

    { id: 'jsk25', ch: 'js5', lesson: 'js5l2', point: '定时器只跑一次', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const id = setInterval(() => {\n  console.log("tick");\n  clearInterval(id);\n}, 20);\nconsole.log("开始");',
      answer: '开始\ntick',
      explain: '同步代码先打印「开始」。20 毫秒后第一次回调打印 tick，随即把自己清掉，所以只会 tick 一次。`clearInterval` 在回调内部引用自身 id 是常见写法。' },

    { id: 'jsk26', ch: 'js6', lesson: 'js6l1', point: '取元素', type: 'choice', diff: 1,
      prompt: '想取页面上第一个 class 为 `item` 的元素，用哪个？',
      opts: ['`document.querySelector(".item")`', '`document.querySelector("item")`', '`document.getId("item")`', '`document.getElementsByClass("item")`'],
      ans: 0,
      explain: '`querySelector` 接收 **CSS 选择器**，class 要带点。`getElementsByClassName` 才是按类名（但返回的是实时的 HTMLCollection）。`getId` 这个 API 不存在。' },

    { id: 'jsk27', ch: 'js6', lesson: 'js6l2', point: '捕获阶段', type: 'choice', diff: 3,
      prompt: '`addEventListener("click", fn, true)` 里的 `true` 表示什么？',
      opts: ['只触发一次', '在捕获阶段触发', '阻止默认行为', '使用被动监听'],
      ans: 1,
      explain: '第三个参数为 `true`（或 `{capture: true}`）表示在**捕获阶段**（从外往里）就触发，而不是默认的冒泡阶段（从里往外）。只触发一次要写 `{once: true}`。' },

    { id: 'jsk28', ch: 'js6', lesson: 'js6l3', point: 'input 与 change', type: 'choice', diff: 2,
      prompt: '想在用户**每敲一个字**时就拿到输入框的新值，监听哪个事件？',
      opts: ['change', 'input', 'blur', 'submit'],
      ans: 1,
      explain: '`input` 每次值变化都触发，适合实时校验、联想；`change` 要等失焦或回车才触发一次；`blur` 是失焦，`submit` 是表单提交。' },

    { id: 'jsk29', ch: 'js6', lesson: 'js6l4', point: '批量修改样式', type: 'choice', diff: 2,
      prompt: '要连续修改一个元素的 5 个样式，怎样最不容易引起多次重排？',
      opts: ['依次写 5 次 `el.style.x = ...`', '换成 class 一次切换，或用 `cssText` 一次写入', '每改一次就强制读一次 offsetHeight', '用 setTimeout 隔开每次修改'],
      ans: 1,
      explain: '每个样式单独写都可能触发一次样式计算，若中间还读取布局属性会强制同步重排（layout thrashing）。合并成 class 或一次 cssText，浏览器只在最后统一算一次。' },

    { id: 'jsk30', ch: 'js6', lesson: 'js6l5', point: '委托的优势', type: 'choice', diff: 2,
      prompt: '列表项是动态增删的，用事件委托最大的好处是？',
      opts: ['代码更短', '新加的元素不用再单独绑监听，天然生效', '能阻止冒泡', '性能一定比直接绑定快 10 倍'],
      ans: 1,
      explain: '监听挂在父容器上，事件从子元素冒泡上来统一处理，所以后来新增的 li 也能被捕获。缺点是排查时需要判断来源（`closest`），且不是所有事件都冒泡（如 `focus`）。' },

    { id: 'jsk31', ch: 'js7', lesson: 'js7l1', point: 'fetch 默认请求', type: 'choice', diff: 1,
      prompt: '`fetch("/api/list")` 不写第二个参数时，默认是什么请求？',
      opts: ['POST', 'GET', 'PUT', 'HEAD'],
      ans: 1,
      explain: '默认 GET，且不带 body。要 POST 就写 `fetch(url, { method: "POST", headers, body })`，body 是 JSON 时记得设 `Content-Type: application/json`。' },

    { id: 'jsk32', ch: 'js7', lesson: 'js7l1', point: '解析响应', type: 'choice', diff: 2,
      prompt: '`res.json()` 返回的是什么？',
      opts: ['已经解析好的对象', '一个 Promise，resolve 后才是对象', '字符串', 'undefined'],
      ans: 1,
      explain: '读响应体是**异步**的（要等流读完），所以返回 Promise，必须 `await res.json()`。忘了 await 就会拿到一个 Promise 对象，取属性全是 undefined。' },

    { id: 'jsk33', ch: 'js7', lesson: 'js7l2', point: '同步存储的代价', type: 'choice', diff: 2,
      prompt: 'localStorage 的读写是什么特性？',
      opts: ['异步非阻塞', '同步阻塞主线程', '需要 await', '只在 Web Worker 里可用'],
      ans: 1,
      explain: 'localStorage 是**同步** API，写入大数据量会卡住主线程；而且它只能存字符串、容量约 5MB。数据量大或结构复杂时，应该考虑 IndexedDB。' },

    { id: 'jsk34', ch: 'js7', lesson: 'js7l3', point: '具名导入', type: 'choice', diff: 2,
      prompt: '模块里写了 `export const a = 1;`，导入时应该写？',
      opts: ['`import a from "./m.js"`', '`import { a } from "./m.js"`', '`import * as a from "./m.js"`', '`const a = require("./m.js")`'],
      ans: 1,
      explain: '具名导出要用**同名解构**的方式导入，`import a from` 对应的是 `export default`。`import * as ns` 会把所有导出收进一个命名空间对象。' },

    { id: 'jsk35', ch: 'js7', lesson: 'js7l3', point: '动态导入', type: 'choice', diff: 3,
      prompt: '`import("./heavy.js")` 这种动态导入返回什么？',
      opts: ['直接返回模块对象', '返回 Promise，resolve 后是模块对象', '返回字符串路径', '什么都不返回'],
      ans: 1,
      explain: '动态 import 是异步的，返回 Promise，所以常配 `await` 使用。它的价值在于**按需加载**：只有用户点了某个功能，才把这个大模块拉下来。' },

    { id: 'jsk36', ch: 'js8', lesson: 'js8l1', point: '解构默认值的触发条件', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const [a = 1, b = 2] = [undefined, null];\nconsole.log(a, b);',
      answer: '1 null',
      explain: '默认值**只在 undefined 时生效**。第一个是 undefined，取 1；第二个是 null，null 是有效值，不触发默认值，所以输出 null。' },

    { id: 'jsk37', ch: 'js8', lesson: 'js8l2', point: '生成器做迭代', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'function* range(n) {\n  for (let i = 1; i <= n; i++) yield i;\n}\nlet sum = 0;\nfor (const x of range(4)) sum += x;\nconsole.log(sum);',
      answer: '10',
      explain: '生成器函数被 `for...of` 驱动时，每次 `yield` 交出一个值并暂停，下一次循环继续往下跑。1+2+3+4 = 10，全部算完才打印。' },

    { id: 'jsk38', ch: 'js8', lesson: 'js8l3', point: '分组捕获', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const s = "2024-05-01";\nconst m = s.match(/(\\d{4})-(\\d{2})-(\\d{2})/);\nconsole.log(m[1], m[2], m[3]);\nconsole.log(s.split("-").join("/"));',
      answer: '2024 05 01\n2024/05/01',
      explain: '`match` 不带 `g` 时返回数组：第 0 项是整体匹配，后面依次是每个括号捕获组。`split` 切完再用 `join("/")` 拼回去，是最直接的格式转换写法。' },

    { id: 'jsk39', ch: 'js8', lesson: 'js8l4', point: '节流的场景', type: 'choice', diff: 2,
      prompt: '监听滚动位置做「回到顶部」按钮的显隐，用哪个更合适？',
      opts: ['防抖，等滚动停下再判断', '节流，最多每 100ms 判断一次', '每次都立刻执行，不做限制', '用 setTimeout 嵌套自己'],
      ans: 1,
      explain: '滚动中按钮的显隐应该**持续跟随**，节流能在固定频率内响应；防抖要等完全停下才有反馈，体验会迟钝。scroll 事件高频触发，一定要做限制。' },

    { id: 'jsk40', ch: 'js8', lesson: 'js8l1', point: '可选调用的返回值', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const fn = null;\nconsole.log(String(fn?.()));\nconsole.log(fn?.() ?? "没调用");',
      answer: 'undefined\n没调用',
      explain: '`fn?.()` 在 fn 是 null 时不执行调用，整体结果是 undefined（不会报错）；第二行 `??` 接住这个 undefined，给出「没调用」。' },
  ],
};
