/* ============================================================
   CodeCraft 数据 · JavaScript
   ============================================================ */
window.LANGS = window.LANGS || {};

window.LANGS.javascript = {
  id: 'javascript', name: 'JavaScript', en: 'ES2023', icon: '🌐', color: '#b8860b',
  blurb: '唯一能在浏览器里直接跑的语言。前端交互、Node 后端、小程序、脚本工具，一个语言通吃全场。',
  hello: 'console.log("Hello, JavaScript!");',
  lab: [
    { name: 'Hello World', code: 'console.log("Hello, JavaScript!");\nconsole.log("1 + 1 =", 1 + 1);' },
    { name: '数组三件套', code: 'const nums = [1, 2, 3, 4, 5, 6];\nconst even = nums.filter(n => n % 2 === 0);\nconst squared = even.map(n => n * n);\nconst total = squared.reduce((a, b) => a + b, 0);\nconsole.log(even);\nconsole.log(squared);\nconsole.log("总和", total);' },
    { name: '对象解构', code: 'const user = { name: "小明", scores: [92, 88, 95] };\nconst { name, scores } = user;\nconst avg = scores.reduce((a, b) => a + b, 0) / scores.length;\nconsole.log(name, "平均", avg.toFixed(2));' },
    { name: '异步 await', code: 'async function main() {\n  const v = await Promise.resolve(21);\n  console.log("结果", v * 2);\n}\nmain();' }
  ],
  chapters: [
    {
      id: 'js1', num: 1, title: '值与类型：先看懂这门语言的脾气', icon: '🧠',
      intro: 'JavaScript 是动态类型、弱类型：变量不声明类型，运算时会自动转换。这带来灵活，也带来 `"1" + 1 === "11"` 这种反直觉结果。这一章把类型、转换和作用域这三件事一次讲清。',
      goals: ['用 typeof 判断类型并知道它的例外', '解释 + 号在字符串和数字间的行为', '说清 let / const / var 的区别', '避免隐式类型转换埋的坑'],
      lessons: [
        {
          id: 'js1l1', title: '七种原始类型与 typeof', key: 'typeof · 原始类型', time: 10,
          blocks: [
            { t: 'p', x: 'JavaScript 有 7 种**原始类型**：`number`、`string`、`boolean`、`undefined`、`null`、`symbol`、`bigint`，其余一切都是**对象**（包括数组和函数）。原始类型不可变，赋值是复制值；对象赋值是复制引用。' },
            { t: 'code', x: 'console.log(typeof 42);\nconsole.log(typeof "42");\nconsole.log(typeof true);\nconsole.log(typeof undefined);\nconsole.log(typeof null);\nconsole.log(typeof []);\nconsole.log(typeof function () {});', out: 'number\nstring\nboolean\nundefined\nobject\nobject\nfunction' },
            { t: 'warn', x: '`typeof null` 返回 `"object"` 是 1995 年留下的 bug，因为兼容性至今改不了。判断 null 要用 `x === null`；判断数组用 `Array.isArray(x)`。' },
            { t: 'table', head: ['判断目标', '正确写法', '不要用'], rows: [
              ['是不是 null', '`x === null`', '`typeof x`'],
              ['是不是数组', '`Array.isArray(x)`', '`typeof x`'],
              ['是不是普通对象', '`x !== null && typeof x === "object" && !Array.isArray(x)`', '`typeof x === "object"`'],
              ['是不是数字（含 NaN）', '`typeof x === "number"`', '`isNaN`（会做类型转换）'],
              ['是不是 NaN', '`Number.isNaN(x)`', '`x === NaN`（永远 false）']
            ] },
            { t: 'code', x: 'const a = [1, 2];\nconst b = a;          // 复制的是引用\nb.push(3);\nconsole.log(a);       // a 也变了\nconsole.log(a === b); // 同一个对象\n\nconst s1 = "hi";\nconst s2 = s1;        // 原始类型复制值\nconsole.log(s1.toUpperCase(), s1);  // 原字符串没变', out: '[1,2,3]\ntrue\nHI hi' },
            { t: 'note', x: '字符串有个「方法调用」的错觉：`"hi".toUpperCase()` 能跑，是因为 JS 临时把字符串包成 String 对象，用完就丢。字符串本身永远不变。' }
          ]
        },
        {
          id: 'js1l2', title: '+ 号的双面性与隐式转换', key: '类型转换 · NaN', time: 12,
          blocks: [
            { t: 'p', x: '`+` 有两种含义：**数字相加**和**字符串拼接**。规则是「只要有一边是字符串，就拼字符串」。而 `-` `*` `/` 只会做数学运算，会先把字符串转成数字。这个不对称是所有诡异结果的根源。' },
            { t: 'code', x: 'console.log(1 + "2");\nconsole.log("3" * "4");\nconsole.log("3" - 1);\nconsole.log(1 + 2 + "3");\nconsole.log("1" + 2 + 3);\nconsole.log(true + 1);\nconsole.log([] + 1);', out: '12\n12\n2\n33\n123\n2\n1' },
            { t: 'p', x: '最后两行值得琢磨：`true + 1` 把 true 转成 1；`[] + 1` 先把空数组转成空字符串 `""`，再拼成 `"1"`。JS 的转换规则是「对象 → 原始值 → 数字或字符串」三步走，空数组是 `""`，`[1]` 是 `"1"`。' },
            { t: 'code', x: 'console.log(Number(" 42 "));\nconsole.log(parseInt("42px"));\nconsole.log(parseFloat("3.14abc"));\nconsole.log(String(42) + 1);\nconsole.log(Number.isNaN(parseInt("px")));\nconsole.log(0.1 + 0.2);\nconsole.log((0.1 + 0.2).toFixed(2));', out: '42\n42\n3.14\n421\ntrue\n0.30000000000000004\n0.30' },
            { t: 'warn', x: '**别用 `==`，一律用 `===`。** `==` 会先做类型转换：`"1" == 1` 是 true，`0 == false` 是 true，`"" == false` 也是 true。`===` 要求类型和值都相同，结果才可预测。' },
            { t: 'principle', x: '**浮点数不要直接用 `===` 比较**，也不要用它算钱。`0.1 + 0.2 !== 0.3` 在几乎所有语言里都成立。金额用「分」为单位的整数，或 `toFixed(2)` 只用于显示。' }
          ]
        },
        {
          id: 'js1l3', title: 'let、const 与作用域', key: '块级作用域 · 提升', time: 12,
          blocks: [
            { t: 'p', x: '`var` 是函数作用域，`let` / `const` 是块级作用域（`{}` 内）。现代代码**默认用 `const`**，需要重新赋值时才用 `let`，`var` 基本不该再出现。' },
            { t: 'code', x: 'var a = 1;\n{ var a = 2; }\nconsole.log(a);\n\nlet b = 1;\n{ let b = 2; }\nconsole.log(b);\n\nconst c = 1;\n{ const c = 2; console.log(c); }\nconsole.log(c);', out: '2\n1\n2\n1' },
            { t: 'code', x: 'for (var i = 0; i < 3; i++) {}\nconsole.log(i);\n\nfor (let j = 0; j < 3; j++) {}\nconsole.log(typeof j);', out: '3\nundefined' },
            { t: 'p', x: '上面这段是 `let` 存在的最佳理由：`var` 声明的 i 泄漏到循环外，而 `let` 的 j 出了循环就不存在。这也解释了经典面试题——用 `var` 在循环里注册回调，所有回调看到的都是同一个最终值。' },
            { t: 'code', x: 'const fns = [];\nfor (var i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns.map(f => f()));\n\nconst fns2 = [];\nfor (let j = 0; j < 3; j++) fns2.push(() => j);\nconsole.log(fns2.map(f => f()));', out: '[3,3,3]\n[0,1,2]' },
            { t: 'warn', x: '`const` 保证的是**绑定不变**，不是值不可变。`const arr = []; arr.push(1)` 完全合法。要真正冻结对象用 `Object.freeze(obj)`（但只是浅冻结）。' },
            { t: 'note', x: '`let` 和 `const` 都有「暂时性死区」：在声明之前访问会抛 `ReferenceError`。`var` 则是「提升」成 undefined，访问不报错但拿到 undefined——这正是 bug 的温床。' }
          ]
        }
      ]
    },
    {
      id: 'js2', num: 2, title: '函数与闭包', icon: '🧩',
      intro: '函数是 JavaScript 的一等公民：能赋值给变量、能当参数传、能当返回值。理解函数、作用域链和闭包，是读懂一切 JS 代码（包括 React 和 Node）的前提。',
      goals: ['区分函数声明与函数表达式', '用箭头函数并知道 this 的差别', '写出利用闭包保存状态的函数', '理解回调为什么会「记住」外部变量'],
      lessons: [
        {
          id: 'js2l1', title: '声明、表达式与默认参数', key: '函数 · 默认参数 · rest', time: 12,
          blocks: [
            { t: 'code', x: 'function add(a, b = 10) {\n  return a + b;\n}\n\nconst mul = function (a, b) {\n  return a * b;\n};\n\nconsole.log(add(1));\nconsole.log(add(1, 2));\nconsole.log(mul(3, 4));\nconsole.log(add.length);', out: '11\n3\n12\n1' },
            { t: 'p', x: '`add.length` 是 1，因为长度只统计**默认参数之前**的参数个数。这个细节在做参数校验库时有用。' },
            { t: 'code', x: 'function sum(...nums) {\n  return nums.reduce((a, b) => a + b, 0);\n}\nconsole.log(sum(1, 2, 3));\nconsole.log(sum());\n\nfunction pick({ name, age }, tag = "user") {\n  return `${tag}: ${name} (${age})`;\n}\nconsole.log(pick({ name: "小明", age: 18 }));', out: '6\n0\nuser: 小明 (18)' },
            { t: 'table', head: ['写法', '提升', '适合'], rows: [
              ['`function f() {}`', '整体提升，可在定义前调用', '工具函数、模块内部'],
              ['`const f = function () {}`', '不提升（TDZ）', '需要按顺序执行的逻辑'],
              ['`const f = () => {}`', '不提升', '回调、短小的纯函数'],
              ['`(function () {})()`', '立即执行', '造独立作用域（老代码常见）']
            ] },
            { t: 'note', x: '函数声明会被整体提升到作用域顶部，所以「先调用后定义」也能跑。这看着方便，但会让阅读顺序和执行顺序脱节，团队规范里常要求改为「先定义后使用」。' }
          ]
        },
        {
          id: 'js2l2', title: '箭头函数与 this', key: '箭头 · this 绑定', time: 12,
          blocks: [
            { t: 'p', x: '箭头函数不只是写法短，它**没有自己的 this**：里面的 this 就是定义时外层作用域的 this。因此在方法里用箭头函数回调，this 不会被「换掉」。' },
            { t: 'code', x: 'const obj = {\n  name: "CodeCraft",\n  // 普通函数：this 由调用方式决定\n  normal() {\n    return [1].map(function () { return this === obj; })[0];\n  },\n  // 箭头函数：this 继承自 normalArrow 的 this（即 obj）\n  arrow() {\n    return [1].map(() => this === obj)[0];\n  }\n};\n\nconsole.log(obj.normal());\nconsole.log(obj.arrow());', out: 'false\ntrue' },
            { t: 'p', x: '第一行是 false，因为传给 `map` 的普通函数被独立调用，`this` 不是 obj（非严格模式下是全局对象）。第二行是 true，箭头函数沿用了 `arrow()` 被调用时的 this，也就是 obj。' },
            { t: 'code', x: 'const double = n => n * 2;\nconst obj = n => ({ value: n });   // 返回对象要加括号\nconst square = (n) => {\n  const r = n * n;\n  return r;\n};\n\nconsole.log(double(5), obj(1).value, square(3));', out: '10 1 9' },
            { t: 'warn', x: '箭头函数**不能用 `new`**、没有 `arguments`、没有 `prototype`，也不能被 `bind` 改变 this。所以它不适合当构造函数，也不适合做需要动态 this 的对象方法。' },
            { t: 'table', head: ['场景', '用哪个'], rows: [
              ['对象的方法', '普通函数 / 方法简写（需要 this 指向对象）'],
              ['数组方法的回调', '箭头函数 ✅（不关心 this）'],
              ['事件处理里要用外层 this', '箭头函数 ✅'],
              ['需要 `arguments` 或 `new`', '普通函数']
            ] }
          ]
        },
        {
          id: 'js2l3', title: '闭包：函数记住了它的出生地', key: '闭包 · 状态封装', time: 12,
          blocks: [
            { t: 'p', x: '函数在定义时会记住它所在的**词法作用域**。即使外层函数已经返回，内层函数仍然能访问那些变量——这就是闭包。它不是语法特性，而是作用域链的必然结果。' },
            { t: 'code', x: 'function makeCounter() {\n  let count = 0;              // 外部访问不到\n  return () => ++count;       // 但返回的函数能访问\n}\n\nconst c1 = makeCounter();\nconst c2 = makeCounter();\nconsole.log(c1(), c1(), c1());\nconsole.log(c2());\nconsole.log(typeof c1.count);', out: '1 2 3\n1\nundefined' },
            { t: 'p', x: 'c1 和 c2 各自持有一份独立的 `count`，因为每次调用 `makeCounter()` 都创建了新的作用域。`c1.count` 是 undefined，说明 count 真的被封装住了——这就是用闭包实现「私有变量」的方式。' },
            { t: 'code', x: 'function once(fn) {\n  let done = false;\n  let result;\n  return function (...args) {\n    if (!done) {\n      done = true;\n      result = fn(...args);\n    }\n    return result;\n  };\n}\n\nconst init = once(() => "只执行一次");\nconsole.log(init());\nconsole.log(init());', out: '只执行一次\n只执行一次' },
            { t: 'warn', x: '闭包会**延长变量的生命周期**。在循环里给 DOM 绑定大量事件、或者缓存大对象时，如果忘了清理，内存会一直涨。现代浏览器开发者工具的 Memory 面板就是查这个的。' },
            { t: 'note', x: 'React 的 hooks 依赖闭包才能「记住」上一次的 state；防抖、节流、模块模式（IIFE）也都是闭包的应用。可以说看不懂闭包就读不懂现代前端代码。' }
          ]
        }
      ]
    },
    {
      id: 'js3', num: 3, title: '数组与对象', icon: '📦',
      intro: '日常写 JS，八成时间在处理数组和对象。map / filter / reduce 三件套替代了手写 for 循环，解构和展开让取值和复制变得极短——这一章把它们练成肌肉记忆。',
      goals: ['用 map / filter / reduce 处理数据', '用解构和可选链安全取值', '分清浅拷贝与深拷贝', '知道 sort 的默认行为为什么会出错'],
      lessons: [
        {
          id: 'js3l1', title: 'map、filter、reduce', key: '数组方法 · 链式调用', time: 14,
          blocks: [
            { t: 'code', x: 'const nums = [1, 2, 3, 4, 5];\n\nconsole.log(nums.map(n => n * 2));\nconsole.log(nums.filter(n => n % 2 === 0));\nconsole.log(nums.reduce((a, b) => a + b, 0));\nconsole.log(nums.find(n => n > 3));\nconsole.log(nums.some(n => n > 4), nums.every(n => n > 0));\nconsole.log(nums.slice(1, 3));', out: '[2,4,6,8,10]\n[2,4]\n15\n4\ntrue true\n[2,3]' },
            { t: 'table', head: ['方法', '作用', '返回'], rows: [
              ['`map(fn)`', '每个元素变换一次', '新数组，长度不变'],
              ['`filter(fn)`', '保留返回 true 的元素', '新数组，可能变短'],
              ['`reduce(fn, init)`', '累积成一个值', '任意类型'],
              ['`find(fn)`', '找第一个满足的', '元素或 undefined'],
              ['`some` / `every`', '是否存在 / 是否全部', 'boolean'],
              ['`forEach(fn)`', '只遍历', 'undefined（不能链式）']
            ] },
            { t: 'code', x: 'const students = [\n  { name: "小明", score: 92 },\n  { name: "小红", score: 58 },\n  { name: "小刚", score: 76 }\n];\n\nconst passed = students\n  .filter(s => s.score >= 60)\n  .map(s => s.name)\n  .join("、");\nconsole.log(passed);\n\nconst avg = students.reduce((sum, s) => sum + s.score, 0) / students.length;\nconsole.log(avg.toFixed(1));', out: '小明、小刚\n75.3' },
            { t: 'warn', x: '**`sort` 默认按字符串排序！** `[10, 9, 1].sort()` 得到 `[1, 10, 9]`，因为它是逐个字符比较的。数字排序必须传比较器：`arr.sort((a, b) => a - b)`。' },
            { t: 'code', x: 'console.log([10, 9, 1].sort());\nconsole.log([10, 9, 1].sort((a, b) => a - b));\nconsole.log([10, 9, 1].sort((a, b) => b - a));', out: '[1,10,9]\n[1,9,10]\n[10,9,1]' },
            { t: 'note', x: '`map` / `filter` / `slice` 都返回**新数组**，不改原数组；`sort` / `reverse` / `splice` / `push` 会**原地修改**。混着用容易出现「数据莫名其妙被改了」。' }
          ]
        },
        {
          id: 'js3l2', title: '对象、解构与可选链', key: '解构 · ?. · ??', time: 12,
          blocks: [
            { t: 'code', x: 'const user = { name: "小明", age: 18, tags: ["a", "b"] };\n\nconst { name, age } = user;\nconsole.log(name, age);\n\nconst { city = "北京" } = user;\nconsole.log(city);\n\nconst [first, second] = user.tags;\nconsole.log(first, second);\n\nconst { name: userName } = user;   // 重命名\nconsole.log(userName);', out: '小明 18\n北京\na b\n小明' },
            { t: 'code', x: 'const user = { name: "小明", address: null };\n\nconsole.log(user.address?.city ?? "未填写");\nconsole.log(user.getName?.() ?? "没有这个方法");\nconsole.log(Object.keys(user));\nconsole.log(Object.entries(user).length);', out: '未填写\n没有这个方法\n["name","address"]\n2' },
            { t: 'p', x: '`?.` 遇到 null / undefined 会**短路**并返回 undefined，不会抛错；`??` 只在左边是 null 或 undefined 时才用右边（`||` 会把 `0` 和 `""` 也当假值，这是重要区别）。' },
            { t: 'code', x: 'const cfg = { retry: 0, name: "" };\nconsole.log(cfg.retry || 3);\nconsole.log(cfg.retry ?? 3);\nconsole.log(cfg.name || "匿名");\nconsole.log(cfg.name ?? "匿名");', out: '3\n0\n匿名\n' },
            { t: 'warn', x: '上面最后一行输出是空字符串，因为 `??` 认为 `""` 是有效值。如果你要「空字符串也当成没填」，就该用 `||`。**选 `||` 还是 `??` 取决于业务语义**，不能一概而论。' },
            { t: 'note', x: '解构可以设默认值 `const { a = 1 } = obj`，但默认值只在值是 `undefined` 时生效。`null` 不会触发默认值，这一点常被忽略。' }
          ]
        },
        {
          id: 'js3l3', title: 'JSON 与深浅拷贝', key: '浅拷贝 · 深拷贝 · JSON', time: 12,
          blocks: [
            { t: 'code', x: 'const obj = { a: 1, b: { c: 2 } };\n\nconst shallow = { ...obj };\nshallow.b.c = 99;\nconsole.log(obj.b.c);\n\nconst deep = JSON.parse(JSON.stringify(obj));\ndeep.b.c = 1;\nconsole.log(obj.b.c);\n\nconsole.log(JSON.stringify(obj));', out: '99\n99\n{"a":1,"b":{"c":99}}' },
            { t: 'p', x: '展开运算符 `{...obj}` 和 `Object.assign` 都只做**浅拷贝**：第一层是新的，嵌套对象还是共享的。所以改 `shallow.b.c` 会连带改到 `obj.b.c`。' },
            { t: 'table', head: ['方式', '深度', '局限'], rows: [
              ['`{...obj}` / `Object.assign`', '浅', '嵌套对象共享'],
              ['`JSON.parse(JSON.stringify(x))`', '深', '丢函数、丢 undefined、Date 变字符串'],
              ['`structuredClone(x)`', '深', '现代浏览器 / Node 17+ 支持，推荐'],
              ['手写递归', '深', '要自己处理循环引用']
            ] },
            { t: 'code', x: 'const raw = \'{"name":"小明","scores":[90,80]}\';\nconst data = JSON.parse(raw);\nconsole.log(data.name, data.scores[1]);\nconsole.log(JSON.stringify({ ok: true, n: 1 }));\n\nconst obj = { a: 1 };\nconst copy = structuredClone(obj);\ncopy.a = 2;\nconsole.log(obj.a, copy.a);', out: '小明 80\n{"ok":true,"n":1}\n1 2' },
            { t: 'warn', x: '`JSON.stringify` 会跳过值为 `undefined` 和函数的属性。所以「深拷贝一个含方法的对象」用 JSON 法会丢方法——这类 bug 在配置对象上特别隐蔽。' }
          ]
        }
      ]
    },
    {
      id: 'js4', num: 4, title: '异步：Promise 与 async/await', icon: '⏳',
      intro: 'JS 是单线程的，所有耗时操作（网络、定时器、文件）都得异步。这一章讲清回调的问题、Promise 的链式写法，以及 async/await 为什么更好读。',
      goals: ['理解同步与异步的执行顺序', '用 then / catch 处理 Promise', '用 async/await + try-catch 写异步流程', '知道 Promise.all 与 for 循环 await 的区别'],
      lessons: [
        {
          id: 'js4l1', title: 'Promise：把回调理顺', key: 'Promise · then · catch', time: 14,
          blocks: [
            { t: 'p', x: 'Promise 表示「一个现在还没有、但将来会有（或失败）的结果」。它有三种状态：pending（进行中）、fulfilled（成功）、rejected（失败），状态一旦改变就固定。' },
            { t: 'code', x: 'Promise.resolve(1)\n  .then(v => {\n    console.log("拿到", v);\n    return v + 1;\n  })\n  .then(v => console.log("再加一", v));\n\nPromise.reject(new Error("出错了"))\n  .catch(e => console.log("捕获", e.message))\n  .finally(() => console.log("无论如何都执行"));', out: '拿到 1\n捕获 出错了\n再加一 2\n无论如何都执行' },
            { t: 'p', x: '这个顺序值得琢磨：`拿到 1` 最先，因为那条链的 `.then` 在同步阶段就入队了；`捕获 出错了` 紧随其后，因为 `Promise.reject(...).catch(...)` 的 catch 回调也是同步入队、排在第一位之后。等到 A 执行完，它后面的 `then` 才被排进队列——这就是 `再加一 2` 排在 catch 之后的原因。**同步注册的顺序决定了微任务的执行顺序**，不是代码书写的顺序。' },
            { t: 'code', x: 'console.log("1 同步");\n\nsetTimeout(() => console.log("4 定时器"), 0);\n\nPromise.resolve().then(() => console.log("3 微任务"));\n\nconsole.log("2 同步");', out: '1 同步\n2 同步\n3 微任务\n4 定时器' },
            { t: 'table', head: ['类型', '例子', '执行时机'], rows: [
              ['同步代码', '普通语句', '立刻'],
              ['微任务', 'Promise.then、queueMicrotask', '当前同步代码跑完后，优先执行'],
              ['宏任务', 'setTimeout、事件回调', '微任务清空后']
            ] },
            { t: 'warn', x: '忘了 `catch` 的 Promise 失败时不会有任何提示（浏览器只在控制台给个 unhandled rejection 警告）。异步链一定要以 `.catch()` 收尾，或者用 try-catch 包住 await。' }
          ]
        },
        {
          id: 'js4l2', title: 'async / await', key: 'async · await · 并发', time: 14,
          blocks: [
            { t: 'p', x: '`async` 函数总是返回一个 Promise；`await` 会暂停函数执行，等 Promise 有结果再继续。关键是：**暂停的只是这个函数，整个线程不会被阻塞**，其他代码照常跑。' },
            { t: 'code', x: 'function delay(ms, v) {\n  return new Promise(resolve => setTimeout(() => resolve(v), ms));\n}\n\nasync function main() {\n  console.log("开始");\n  const a = await delay(10, "A");\n  const b = await delay(10, "B");\n  console.log(a, b);\n  console.log("结束");\n}\nmain();', out: '开始\nA B\n结束' },
            { t: 'code', x: 'function fetchUser(id) {\n  return new Promise((resolve, reject) => {\n    if (id > 0) resolve({ id, name: "用户" + id });\n    else reject(new Error("id 必须为正"));\n  });\n}\n\nasync function main() {\n  try {\n    const u = await fetchUser(7);\n    console.log(u.name);\n    await fetchUser(-1);\n    console.log("这行不会执行");\n  } catch (e) {\n    console.log("失败：", e.message);\n  } finally {\n    console.log("流程结束");\n  }\n}\nmain();', out: '用户7\n失败： id 必须为正\n流程结束' },
            { t: 'code', x: 'const p = n => Promise.resolve(n * 10);\n\nasync function main() {\n  // 串行：一个等一个，总耗时是两者之和\n  const s1 = await p(1);\n  const s2 = await p(2);\n  console.log("串行", s1, s2);\n\n  // 并发：同时发起，一起等\n  const [c1, c2] = await Promise.all([p(1), p(2)]);\n  console.log("并发", c1, c2);\n}\nmain();', out: '串行 10 20\n并发 10 20' },
            { t: 'warn', x: '`for (const x of list) { await handle(x); }` 是**串行**的，一百个请求就等一百倍时间。要并发就用 `Promise.all(list.map(handle))`。这是后端性能优化里最常见的一处改动。' },
            { t: 'note', x: '`Promise.all` 只要有一个失败就整体失败（快速失败）；想「全部跑完再报告」用 `Promise.allSettled`；想「谁先成功用谁」用 `Promise.race`。' }
          ]
        }
      ]
    },
    {
      id: 'js5', num: 5, title: '浏览器：DOM 与存储', icon: '🖱️',
      intro: 'JavaScript 在浏览器里的主要工作就是：找到页面元素、改它、响应点击、把数据存下来。这一章的例子需要真实浏览器环境，所以不在这里直接运行——复制到自己的页面里试最有效。',
      goals: ['用 querySelector 选中元素并改内容', '绑定事件并读取输入', '用 localStorage 保存简单数据', '知道为什么脚本要放在 body 末尾'],
      lessons: [
        {
          id: 'js5l1', title: '选中元素与修改页面', key: 'querySelector · textContent', time: 12,
          blocks: [
            { t: 'p', x: '浏览器把 HTML 解析成一棵 DOM 树，JS 通过 `document` 访问它。最常用的选择器是 `querySelector`（返回第一个匹配）和 `querySelectorAll`（返回全部，是 NodeList）。' },
            { t: 'code', x: '<ul id="list">\n  <li>第一项</li>\n  <li>第二项</li>\n</ul>\n\n<script>\n  const list = document.querySelector("#list");\n  const items = document.querySelectorAll("#list li");\n\n  console.log(items.length);\n\n  // 改内容：textContent 安全，innerHTML 会解析标签\n  items[0].textContent = "改过的第一项";\n\n  // 新增元素\n  const li = document.createElement("li");\n  li.textContent = "新增项";\n  list.appendChild(li);\n\n  console.log(list.children.length);\n</script>', run: false },
            { t: 'table', head: ['API', '作用', '注意'], rows: [
              ['`querySelector(sel)`', '取第一个匹配', '没有返回 null，用之前要判断'],
              ['`querySelectorAll(sel)`', '取全部', '是 NodeList，可用 forEach 但不能 map'],
              ['`textContent`', '纯文本内容', '推荐，不会执行 HTML'],
              ['`innerHTML`', '按 HTML 解析', '拼接用户输入会有 XSS 风险'],
              ['`classList.add/remove/toggle`', '改样式类', '比直接改 className 更安全']
            ] },
            { t: 'note', x: '`querySelectorAll` 返回的是**静态**集合，DOM 再变它也不会更新；`getElementsByClassName` 返回的是**动态**的 HTMLCollection。混用时容易遇到「循环里长度越变越少」的问题。' },
            { t: 'warn', x: '用 `innerHTML` 拼接用户输入是 XSS 漏洞的头号来源。用户提交 `<img src=x onerror=alert(1)>`，你的页面就会执行它。展示用户内容一律用 `textContent`。' },
            { t: 'p', x: '脚本一般放在 `<body>` 末尾，或者加 `defer` 属性。因为脚本执行时，它前面的 DOM 必须已经解析完成，否则 `querySelector` 拿到 null。' }
          ]
        },
        {
          id: 'js5l2', title: '事件与 localStorage', key: 'addEventListener · 本地存储', time: 12,
          blocks: [
            { t: 'code', x: '<input id="name" placeholder="输入名字">\n<button id="save">保存</button>\n<p id="out"></p>\n\n<script>\n  const input = document.querySelector("#name");\n  const out = document.querySelector("#out");\n\n  document.querySelector("#save").addEventListener("click", () => {\n    const v = input.value.trim();\n    if (!v) {\n      out.textContent = "名字不能为空";\n      return;\n    }\n    localStorage.setItem("cc_name", v);\n    out.textContent = "已保存：" + v;\n  });\n\n  // 页面加载时恢复\n  const saved = localStorage.getItem("cc_name");\n  if (saved) out.textContent = "上次保存：" + saved;\n</script>', run: false },
            { t: 'p', x: '`localStorage` 存的是**字符串**，读写都要自己转换。存对象先 `JSON.stringify`，取出来再 `JSON.parse`，否则会拿到 `[object Object]`。' },
            { t: 'code', x: 'const state = { lang: "python", day: 3 };\n\n// 写：对象要先序列化\nlocalStorage.setItem("cc_state", JSON.stringify(state));\n\n// 读：不存在时 getItem 返回 null，要兜底\nconst raw = localStorage.getItem("cc_state");\nconst loaded = raw ? JSON.parse(raw) : {};\n\nconsole.log(loaded.lang, loaded.day);\n\n// 删：单个键 / 全部\nlocalStorage.removeItem("cc_state");\n// localStorage.clear();', run: false },
            { t: 'table', head: ['特性', 'localStorage', 'sessionStorage'], rows: [
              ['生命周期', '永久，除非手动删', '关闭标签页就清空'],
              ['容量', '约 5MB', '约 5MB'],
              ['作用域', '同源共享', '同标签页内'],
              ['存对象', '需 JSON 序列化', '同样需要']
            ] },
            { t: 'warn', x: '`localStorage` 是**同步**的：数据大时读写会卡住主线程。别往里面塞几 MB 的列表，也不要用它存敏感信息（比如密码、token），因为它对同源的任何脚本都可读。' },
            { t: 'note', x: '用户的浏览器设置成「禁止站点数据」时，`localStorage.setItem` 会抛异常。生产代码里要 `try / catch` 包一层，避免整个页面因此崩溃。' }
          ]
        }
      ]
    }
  ],

  quiz: [
    { id: 'jsq1', ch: 'js1', lesson: 'js1l1', point: 'typeof', type: 'choice', diff: 1,
      prompt: '`typeof null` 的结果是？',
      opts: ['"null"', '"object"', '"undefined"', '"number"'],
      ans: 1,
      explain: '这是语言早期的实现 bug，因为兼容性保留至今。判断 null 要用 `x === null`。' },
    { id: 'jsq2', ch: 'js1', lesson: 'js1l1', point: '数组判断', type: 'choice', diff: 2,
      prompt: '判断一个变量是不是数组，最可靠的方式是？',
      opts: ['typeof x === "array"', 'Array.isArray(x)', 'x.length !== undefined', 'x instanceof Object'],
      ans: 1,
      explain: '`typeof []` 是 "object"；`x instanceof Object` 对数组和普通对象都为 true。`Array.isArray` 能跨 iframe 正确判断。' },
    { id: 'jsq3', ch: 'js1', lesson: 'js1l2', point: '隐式转换', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'console.log(1 + "2");\nconsole.log("3" * "4");\nconsole.log(1 + 2 + "3");\nconsole.log("1" + 2 + 3);\nconsole.log([] + 1);',
      answer: '12\n12\n33\n123\n1',
      explain: '`+` 遇字符串就拼接，其余算术运算符会先把字符串转数字。`1+2+"3"` 先算 1+2=3 再拼 "3" 得 "33"；`[]+1` 把空数组转成 "" 再拼成 "1"。' },
    { id: 'jsq4', ch: 'js1', lesson: 'js1l2', point: '相等比较', type: 'choice', diff: 2,
      prompt: '下面哪个表达式的结果是 true？',
      opts: ['"1" === 1', 'null === undefined', '0 == false', 'NaN === NaN'],
      ans: 2,
      explain: '`0 == false` 会做类型转换，两边都变成 0 所以为 true。`===` 要求类型相同；`null === undefined` 是 false（但 `==` 是 true）；NaN 与任何值都不相等，包括自己。' },
    { id: 'jsq5', ch: 'js1', lesson: 'js1l3', point: '块级作用域', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'var a = 1;\n{ var a = 2; }\nconsole.log(a);\n\nlet b = 1;\n{ let b = 2; }\nconsole.log(b);',
      answer: '2\n1',
      explain: '`var` 是函数作用域，块里的 `var a = 2` 声明的还是同一个变量，所以打印 2。`let` 是块级作用域，块内的 b 是新的变量，外面的 b 仍是 1。' },
    { id: 'jsq6', ch: 'js1', lesson: 'js1l3', point: '闭包与 var', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'const fns = [];\nfor (var i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns.map(f => f()));\n\nconst fns2 = [];\nfor (let j = 0; j < 3; j++) fns2.push(() => j);\nconsole.log(fns2.map(f => f()));',
      answer: '[3,3,3]\n[0,1,2]',
      explain: '`var` 只有一个变量 i，循环结束后 i 是 3，所有闭包看到的都是它。`let` 每次迭代都创建新的绑定，所以每个闭包记住了各自的值。这是「为什么该用 let」最经典的例子。' },
    { id: 'jsq7', ch: 'js2', lesson: 'js2l1', point: '提升', type: 'choice', diff: 2,
      prompt: '关于函数声明和函数表达式，正确的是？',
      opts: ['两者都能在定义前调用', '函数声明能提升，`const f = function(){}` 不能', '函数表达式能提升，函数声明不能', '两者都不能提升'],
      ans: 1,
      explain: '函数声明整体提升，可以在定义之前调用；用 `const` 声明的函数表达式存在暂时性死区，提前调用会抛 ReferenceError。' },
    { id: 'jsq8', ch: 'js2', lesson: 'js2l2', point: '箭头函数', type: 'choice', diff: 2,
      prompt: '关于箭头函数，下面说法错误的是？',
      opts: ['没有自己的 this', '不能用作构造函数', '没有 arguments 对象', '可以用 bind 改变内部的 this'],
      ans: 3,
      explain: '箭头函数的 this 在定义时确定，`bind` / `call` / `apply` 都改不了它。其余三条都正确。' },
    { id: 'jsq9', ch: 'js2', lesson: 'js2l2', point: '简洁返回', type: 'choice', diff: 1,
      prompt: '要让箭头函数返回一个对象 `{ a: 1 }`，正确写法是？',
      opts: ['n => { a: 1 }', 'n => ({ a: 1 })', 'n => { return { a: 1 } }', 'n => Object({ a: 1 })'],
      ans: 1,
      explain: '`() => { a: 1 }` 里的大括号会被当成函数体，`a: 1` 被解析成标签语句，函数返回 undefined。加圆括号才能让它被当成对象字面量。' },
    { id: 'jsq10', ch: 'js2', lesson: 'js2l3', point: '闭包', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'function makeCounter() {\n  let n = 0;\n  return () => ++n;\n}\nconst c1 = makeCounter();\nconst c2 = makeCounter();\nconsole.log(c1(), c1());\nconsole.log(c2());',
      answer: '1 2\n1',
      explain: '每次调用 `makeCounter` 都创建新的作用域和独立的 n。c1 调用两次得到 1、2；c2 是另一个计数器，从 1 开始。' },
    { id: 'jsq11', ch: 'js3', lesson: 'js3l1', point: 'reduce', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const nums = [1, 2, 3, 4];\nconsole.log(nums.reduce((a, b) => a + b, 0));\nconsole.log(nums.filter(n => n > 2));\nconsole.log(nums.map(n => n * n));',
      answer: '10\n[3,4]\n[1,4,9,16]',
      explain: '`reduce` 从初始值 0 开始累加得 10；`filter` 保留大于 2 的元素；`map` 返回平方后的新数组。三者都不修改原数组。' },
    { id: 'jsq12', ch: 'js3', lesson: 'js3l1', point: 'sort 默认行为', type: 'choice', diff: 3,
      prompt: '`[10, 9, 1].sort()` 的结果是？',
      opts: ['[1, 9, 10]', '[1, 10, 9]', '[10, 9, 1]', '抛出异常'],
      ans: 1,
      explain: '不传比较器时，`sort` 把所有元素转成字符串按字典序比较："1" < "10" < "9"。数字排序必须写 `sort((a, b) => a - b)`。' },
    { id: 'jsq13', ch: 'js3', lesson: 'js3l2', point: '可选链', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const user = { name: "小明", address: null };\nconsole.log(user.address?.city ?? "未填写");\nconsole.log(user.name ?? "匿名");\nconsole.log(user.age ?? 0);',
      answer: '未填写\n小明\n0',
      explain: '`?.` 在 null 上短路返回 undefined，`??` 再取默认值。`user.name` 是 "小明" 所以不取默认；`user.age` 是 undefined，取 0。' },
    { id: 'jsq14', ch: 'js3', lesson: 'js3l3', point: '浅拷贝', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'const a = { x: 1, inner: { y: 2 } };\nconst b = { ...a };\nb.x = 9;\nb.inner.y = 8;\nconsole.log(a.x, a.inner.y);',
      answer: '1 8',
      explain: '展开是浅拷贝：第一层属性复制了新值，所以改 b.x 不影响 a.x；但 `inner` 复制的是引用，改 b.inner.y 就等于改 a.inner.y。' },
    { id: 'jsq15', ch: 'js4', lesson: 'js4l1', point: '执行顺序', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'console.log("A");\nsetTimeout(() => console.log("D"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("B");',
      answer: 'A\nB\nC\nD',
      explain: '同步代码先执行完（A、B），然后清空微任务队列（Promise.then 的 C），最后才执行宏任务（setTimeout 的 D）。' },
    { id: 'jsq16', ch: 'js4', lesson: 'js4l1', point: 'catch 链', type: 'choice', diff: 2,
      prompt: '`Promise.reject(new Error("x")).then(v => ...)` 后面没有 catch，会发生什么？',
      opts: ['错误被静默丢弃，什么都不会发生', '页面崩溃', '产生未处理的 rejection 警告', '自动重试一次'],
      ans: 2,
      explain: '失败会跳过所有 then，没有 catch 就是「未处理的 Promise 拒绝」，浏览器控制台会报 unhandled rejection 警告。写完 then 记得加 catch。' },
    { id: 'jsq17', ch: 'js4', lesson: 'js4l2', point: 'async 返回值', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'async function f() {\n  return 42;\n}\nconsole.log(f() instanceof Promise);\nf().then(v => console.log(v));',
      answer: 'true\n42',
      explain: '`async` 函数的返回值总会被包成 Promise，所以 `f()` 是 Promise 实例；用 then 才能取到真正的 42。' },
    { id: 'jsq18', ch: 'js5', lesson: 'js5l1', point: 'XSS 防护', type: 'choice', diff: 2,
      prompt: '要把用户输入的文本显示到页面上，应该用？',
      opts: ['element.innerHTML = text', 'element.textContent = text', 'document.write(text)', 'element.outerHTML = text'],
      ans: 1,
      explain: '`textContent` 按纯文本处理，不会解析标签，天然防 XSS。用 `innerHTML` 拼用户输入会让 `<img onerror=...>` 这类内容被执行。' }
  ],

  checkin: [
    { id: 'jsk1', ch: 'js1', point: 'const 不可变', type: 'choice', diff: 1,
      prompt: '`const arr = [1, 2];` 之后，哪个操作是非法的？',
      opts: ['arr.push(3)', 'arr[0] = 9', 'arr = [4, 5]', 'arr.length = 0'],
      ans: 2,
      explain: '`const` 锁的是「绑定」，不是内容。可以修改数组内部，但不能让 arr 指向另一个数组——那是重新赋值。' },
    { id: 'jsk2', ch: 'js1', point: '字符串模板', type: 'code', diff: 1,
      scene: '拼输出文案时，模板字符串比一堆加号好读得多。',
      prompt: '用模板字符串输出 `你好，<名字>！你今年 <年龄> 岁。`，输入一行 `名字 年龄`。例如输入 `小明 18`，输出 `你好，小明！你今年 18 岁。`',
      starter: 'const line = readline().trim().split(" ");\nconst name = line[0];\nconst age = line[1];\n// 在这里写代码\n',
      tests: [{ in: '小明 18', out: '你好，小明！你今年 18 岁。' }],
      solution: 'const line = readline().trim().split(" ");\nconst name = line[0];\nconst age = line[1];\nconsole.log(`你好，${name}！你今年 ${age} 岁。`);\n',
      explain: '模板字符串用反引号，`${}` 里可以放任意表达式（包括运算和三元）。比 `"a" + b + "c"` 更容易读，也不容易漏空格。' },
    { id: 'jsk3', ch: 'js1', point: '数字精度', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'console.log(0.1 + 0.2);\nconsole.log((0.1 + 0.2).toFixed(2));\nconsole.log(0.1 + 0.2 === 0.3);',
      answer: '0.30000000000000004\n0.30\nfalse',
      explain: 'IEEE 754 双精度无法精确表示 0.1 和 0.2，相加会有极小误差。`toFixed(2)` 只影响显示，比较时仍不相等。' },
    { id: 'jsk4', ch: 'js1', point: '数字转换', type: 'choice', diff: 2,
      prompt: '`Number("12abc")` 的结果是？',
      opts: ['12', 'NaN', '"12abc"', '抛出异常'],
      ans: 1,
      explain: '`Number()` 要求整个字符串都是合法数字，否则返回 NaN。`parseInt("12abc")` 才会返回 12（遇到非数字就停）。' },
    { id: 'jsk5', ch: 'js2', point: '默认参数', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'function greet(name = "陌生人", greeting = "你好") {\n  return `${greeting}，${name}`;\n}\nconsole.log(greet());\nconsole.log(greet("小明"));',
      answer: '你好，陌生人\n你好，小明',
      explain: '没传参时用默认值。只传第一个参数时，后面的仍然用默认值，不需要像某些语言那样用占位符跳过。' },
    { id: 'jsk6', ch: 'js2', point: '回调与 this', type: 'choice', diff: 3,
      prompt: '对象方法里用 `array.map(function(){ return this.x })`，this 指向什么？',
      opts: ['外层对象', '数组元素', 'undefined 或全局对象', 'map 方法的返回值'],
      ans: 2,
      explain: '普通函数作为回调被独立调用，this 不是外层对象（严格模式下是 undefined，非严格是全局对象）。改用箭头函数才能继承外层的 this。' },
    { id: 'jsk7', ch: 'js2', point: '函数求和', type: 'code', diff: 2,
      scene: '写一个能接收任意个数参数的工具函数，是 rest 参数的典型场景。',
      prompt: '实现 `sumAll(...nums)`，返回所有参数之和（无参数返回 0）。程序最后输出 `sumAll(2, 3, 5)` 的结果。',
      starter: 'function sumAll(...nums) {\n  // 在这里写代码\n}\n\nconsole.log(sumAll(2, 3, 5));\n',
      tests: [{ in: '', out: '10' }],
      solution: 'function sumAll(...nums) {\n  return nums.reduce((a, b) => a + b, 0);\n}\n\nconsole.log(sumAll(2, 3, 5));\n',
      explain: '`...nums` 把任意个参数收成一个真数组，所以可以直接用 `reduce`。初始值 0 保证无参数时返回 0 而不是报错。' },
    { id: 'jsk8', ch: 'js3', point: '数组去重', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const arr = [1, 2, 2, 3, 3, 3];\nconst uniq = [...new Set(arr)];\nconsole.log(uniq);\nconsole.log(uniq.length);',
      answer: '[1,2,3]\n3',
      explain: '`Set` 天然去重，再用展开运算符转回数组。这是 JS 里最短的去重写法，比手写 filter + indexOf 快得多。' },
    { id: 'jsk9', ch: 'js3', point: '链式处理', type: 'code', diff: 2,
      scene: '从一组成绩里取出及格的分数，算平均分并保留一位小数。',
      prompt: '读入一行用空格分隔的整数（至多 20 个），输出所有 ≥60 的数的平均分，保留一位小数；若一个都没有，输出 `0`。',
      starter: 'const nums = readline().trim().split(/\\s+/).map(Number);\n// 在这里写代码\n',
      tests: [{ in: '58 72 90 61', out: '74.3' }, { in: '10 20', out: '0' }],
      solution: 'const nums = readline().trim().split(/\\s+/).map(Number);\nconst passed = nums.filter(n => n >= 60);\nif (passed.length === 0) {\n  console.log(0);\n} else {\n  const avg = passed.reduce((a, b) => a + b, 0) / passed.length;\n  console.log(avg.toFixed(1));\n}\n',
      explain: '(72 + 90 + 61) / 3 = 74.333… → 74.3。先 filter 再 reduce 求平均，是处理列表数据的固定套路；空数组要单独判断，否则除零会得到 NaN。' },
    { id: 'jsk10', ch: 'js3', point: '对象取值', type: 'choice', diff: 2,
      prompt: '`const { a = 1 } = { a: undefined };` 之后 a 的值是？',
      opts: ['undefined', '1', 'null', '报错'],
      ans: 1,
      explain: '解构默认值只在取到的值是 `undefined` 时生效，所以 a 是 1。如果值是 `null`，则不会用默认值，a 就是 null。' },
    { id: 'jsk11', ch: 'js3', point: '对象转数组', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'const scores = { 小明: 92, 小红: 88 };\nconsole.log(Object.keys(scores));\nconsole.log(Object.values(scores));\nconsole.log(Object.entries(scores)[0]);',
      answer: '["小明","小红"]\n[92,88]\n["小明",92]',
      explain: '`Object.keys` 取键、`values` 取值、`entries` 取 [键, 值] 二元组。注意 entries 的第一个元素本身是个数组，所以打印成 `["小明",92]`。' },
    { id: 'jsk12', ch: 'js4', point: 'Promise 链', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'Promise.resolve(2)\n  .then(v => v * 3)\n  .then(v => v + 1)\n  .then(v => console.log(v));',
      answer: '7',
      explain: 'then 的返回值会传给下一个 then：2×3=6，6+1=7，最后打印 7。每一步都会自动包成新的 Promise。' },
    { id: 'jsk13', ch: 'js4', point: 'async 顺序', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'async function main() {\n  console.log("1");\n  await null;\n  console.log("3");\n}\nconsole.log("2");\nmain();\nconsole.log("4");',
      answer: '2\n1\n4\n3',
      explain: '先执行同步部分：打印 2，调用 main 后进入函数体打印 1，遇 `await null` 让出主线程；继续执行外面的 `console.log("4")`；微任务队列里恢复 main 打印 3。' },
    { id: 'jsk14', ch: 'js4', point: '并发请求', type: 'choice', diff: 3,
      prompt: '要同时发起多个异步请求并等全部完成，应该用？',
      opts: ['在 for 循环里逐个 await', 'Promise.all([...])', '嵌套多层 then', 'setTimeout 依次调用'],
      ans: 1,
      explain: '在循环里 await 是串行的，总耗时是各个请求之和。`Promise.all` 同时发起，总耗时约等于最慢的那个。' },
    { id: 'jsk15', ch: 'js4', point: 'try-catch', type: 'code', diff: 2,
      scene: '异步流程里出错要能兜住，不能静默失败。',
      prompt: '实现 `safeParse`：用 JSON.parse 解析字符串，解析失败时返回 `null`，不要抛出异常。最后输出 `safeParse("{\\"a\\":1}").a` 和 `safeParse("坏数据")`。',
      starter: 'function safeParse(text) {\n  // 在这里写代码\n}\n\nconsole.log(safeParse(\'{"a":1}\').a);\nconsole.log(safeParse("坏数据"));\n',
      tests: [{ in: '', out: '1\nnull' }],
      solution: 'function safeParse(text) {\n  try {\n    return JSON.parse(text);\n  } catch (e) {\n    return null;\n  }\n}\n\nconsole.log(safeParse(\'{"a":1}\').a);\nconsole.log(safeParse("坏数据"));\n',
      explain: '`JSON.parse` 遇到非法字符串会抛 SyntaxError，必须 try/catch 包住。返回 null 让调用方用 `?.` 或 `??` 处理。' },
    { id: 'jsk16', ch: 'js5', point: 'DOM 查询', type: 'choice', diff: 1,
      prompt: '要选中页面上 id 为 `app` 的元素，正确的写法是？',
      opts: ['document.querySelector("app")', 'document.querySelector("#app")', 'document.getElementById(".app")', 'document.getElementsById("app")'],
      ans: 1,
      explain: 'CSS 选择器里 id 要带 `#`。`querySelector("app")` 找的是 `<app>` 标签。`getElementsById` 这个名字不存在（正确的是 `getElementById`，且是单数）。' },
    { id: 'jsk17', ch: 'js5', point: '本地存储', type: 'choice', diff: 2,
      prompt: '往 `localStorage` 存一个对象，正确做法是？',
      opts: ['localStorage.setItem("k", obj)', 'localStorage.setItem("k", JSON.stringify(obj))', 'localStorage.setItem("k", String(obj))', 'localStorage.push(obj)'],
      ans: 1,
      explain: '`localStorage` 只能存字符串。直接塞对象会被转成 `[object Object]`；必须 `JSON.stringify` 序列化，读的时候再 `JSON.parse` 还原。' },
    { id: 'jsk18', ch: 'js1', point: '模板字符串', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'const name = "小明";\nconst score = 92;\nconsole.log(`${name} 考了 ${score} 分`);\nconsole.log(`1 + 1 = ${1 + 1}`);',
      answer: '小明 考了 92 分\n1 + 1 = 2',
      explain: '`${}` 里可以放任意表达式，会被求值后转成字符串插入。所以 `${1 + 1}` 得到 2，而不是字符串 "1 + 1"。' }
  ]
};
