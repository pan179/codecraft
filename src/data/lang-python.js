/* ============================================================
   CodeCraft 数据 · Python
   ============================================================ */
window.LANGS = window.LANGS || {};

window.LANGS.python = {
  id: 'python', name: 'Python', en: 'Python 3', icon: '🐍', color: '#3776ab',
  blurb: '语法最轻、生态最广的一门语言。数据分析、AI、爬虫、后端脚本，都能用它先跑起来。',
  hello: 'print("Hello, Python!")',
  lab: [
    { name: 'Hello World', code: 'print("Hello, Python!")\nprint("今天开始学编程")' },
    { name: '读输入求和', code: 'a, b = map(int, input().split())\nprint("和 =", a + b)' },
    { name: '列表推导式', code: 'nums = [1, 2, 3, 4, 5, 6]\neven = [n * n for n in nums if n % 2 == 0]\nprint(even)' },
    { name: '字典计数', code: 'words = "the cat the dog the bird".split()\ncount = {}\nfor w in words:\n    count[w] = count.get(w, 0) + 1\nprint(count)' }
  ],
  chapters: [
    {
      id: 'py1', num: 1, title: '从零开始：第一个 Python 程序', icon: '🚀',
      intro: '这一章解决三件事：程序到底是什么、Python 怎么把代码跑起来、变量和值之间是什么关系。别急着背语法，先把「程序是按顺序执行的指令」和「变量是贴在对象上的标签」这两个模型立住，后面会省很多力气。',
      goals: ['说清解释器做了什么', '用 print / f-string 输出结果', '用引用模型解释赋值', '认出语法错误、运行错误、逻辑错误'],
      lessons: [
        {
          id: 'py1l1', title: '程序、解释器与第一行代码', key: '解释执行 · print', time: 10,
          blocks: [
            { t: 'p', x: '计算机不会思考，它只会严格按顺序执行指令。**程序**就是这些指令的集合，**算法**是解决问题的步骤。写程序本质上是把脑子里的步骤翻译成机器能执行的语言。' },
            { t: 'h', x: 'Python 是怎么跑起来的' },
            { t: 'p', x: '你写的 `.py` 文件是纯文本。执行 `python main.py` 时，解释器做三件事：把源码编译成**字节码** → 交给 Python 虚拟机 → 逐条执行。所以 Python 是「先编译成字节码，再解释执行」的混合模式，这也是你会看到 `__pycache__` 文件夹的原因。' },
            { t: 'table', head: ['对比项', '编译型（C/C++）', '解释型（Python）'], rows: [
              ['翻译时机', '运行前一次性翻成机器码', '运行时逐条翻译字节码'],
              ['执行速度', '快', '较慢（每行都要现场处理）'],
              ['调试体验', '改一行要重新编译', '改完立刻跑'],
              ['跨平台', '换平台要重新编译', '有解释器就能跑']
            ] },
            { t: 'h', x: '第一个程序' },
            { t: 'code', x: '# 井号开头是注释，解释器会忽略这一行\nprint("Hello, Python!")\nprint(3 + 4)                 # 数字相加是算术\nprint("3" + "4")             # 字符串相加是拼接\nprint("总分", 95, "分")       # 一行打印多个值，用空格分隔', out: 'Hello, Python!\n7\n34\n总分 95 分' },
            { t: 'note', x: '`print` 是内置函数，括号里可以放任意多个值，默认用空格连接、结尾换行。想改分隔符用 `print(a, b, sep="-")`，想不换行用 `print(a, end="")`。' },
            { t: 'h', x: '三类错误，三种排查路径' },
            { t: 'table', head: ['类型', '什么时候发生', '典型现象', '谁来发现'], rows: [
              ['语法错误', '代码还没开始执行', '少了冒号、括号不配对、缩进不对', '解释器直接拒绝执行'],
              ['运行时错误', '执行到那一行才炸', '除以 0、索引越界、类型不匹配', '解释器中途崩溃'],
              ['逻辑错误', '程序能跑但结果不对', '该求和算成了平均', '只有你自己（靠测试）']
            ] },
            { t: 'code', x: '# 语法错误：括号没闭合（把下面这行的注释去掉试试）\n# print("hello"\n\n# 运行时错误：类型不匹配\n# print("我今年" + 18 + "岁")\n\n# 逻辑错误：能跑，但算错了\nprice, count = 100, 3\nprint("总价：", price + count, "（写错了，应该是 300）")', out: '总价： 103 （写错了，应该是 300）' },
            { t: 'warn', x: '**报错信息不是敌人，是路标。** 永远先看最后一行（错误类型 + 说明），再往上找 `line N` 定位行号。九成的报错看这两行就能自己解决。' },
            { t: 'principle', x: '**先写中文步骤，再翻译成代码。** 90% 的「不会写」其实是「没想清楚步骤」。把「输入什么、算什么、输出什么」用中文列出来，代码几乎是照着抄。' }
          ]
        },
        {
          id: 'py1l2', title: '变量、对象与赋值（引用模型）', key: '变量是标签', time: 12,
          blocks: [
            { t: 'p', x: '很多人把变量想成「盒子」，把值放进去。这个比喻在 Python 里会害你。更准确的说法是：**变量是贴在对象上的标签**，赋值是把标签贴到另一个对象上。' },
            { t: 'code', x: 'a = [1, 2, 3]\nb = a          # 不是复制，是给同一个列表贴了两张标签\nb.append(4)\nprint(a)       # a 也变了\n\nx = 1\ny = x\ny = y + 1      # y 指向了一个新的整数对象\nprint(x, y)    # x 还是 1', out: '[1, 2, 3, 4]\n1 2' },
            { t: 'p', x: '为什么列表会一起变、整数不会？因为**整数是不可变对象**，`y + 1` 只能造一个新对象；而**列表是可变对象**，`append` 是在原对象上修改，所有指向它的标签都会看到变化。' },
            { t: 'h', x: 'id() 与 is：看清是不是同一个对象' },
            { t: 'code', x: 'a = [1, 2, 3]\nb = a\nc = a.copy()\n\nprint(a is b)      # True：同一个对象\nprint(a is c)      # False：内容相同但是两个对象\nprint(a == c)      # True：内容相等\nprint(id(a) == id(b))', out: 'True\nFalse\nTrue\nTrue' },
            { t: 'table', head: ['比较方式', '问的问题', '用在哪'], rows: [
              ['a == b', '内容一样吗', '判断值相等，业务逻辑几乎都用它'],
              ['a is b', '是同一个对象吗', '只用来和 None 比较：`if x is None`'],
              ['id(a)', '对象的内存地址', '调试时确认有没有复制']
            ] },
            { t: 'h', x: '命名规范（写给人看的代码）' },
            { t: 'ul', x: [
              '用小写字母 + 下划线：`user_name`、`total_price`',
              '不要用关键字和内置名：`list`、`str`、`sum`、`type` 都是内置函数，覆盖了会出事',
              '常量全大写：`MAX_RETRY = 3`',
              '名字要能读出意思：`s` 不如 `score`，`d` 不如 `deadline`'
            ] },
            { t: 'warn', x: '**可变对象做默认参数是经典坑**：`def f(items=[])` 里的 `[]` 只创建一次，多次调用会共享同一个列表。正确写法是 `def f(items=None)` 再在函数体里 `items = items or []`。' },
            { t: 'tip', x: '背一个判断口诀：**改内容会互相影响的，是可变对象（list / dict / set）；改内容要造新对象的，是不可变对象（int / float / str / tuple）。**' }
          ]
        },
        {
          id: 'py1l3', title: '数字、字符串与输入输出', key: '类型转换 · f-string', time: 12,
          blocks: [
            { t: 'h', x: '数字：三种运算细节很容易踩' },
            { t: 'code', x: 'print(7 / 2)     # 真除法，结果一定是 float\nprint(7 // 2)    # 整除，向下取整\nprint(-7 // 2)   # 注意：向下取整，不是向零\nprint(7 % 2)     # 取余\nprint(2 ** 10)   # 幂\nprint(0.1 + 0.2) # 浮点误差', out: '3.5\n3\n-4\n1\n1024\n0.30000000000000004' },
            { t: 'p', x: '`-7 // 2` 结果是 `-4` 而不是 `-3`，因为整除是**向下取整**（往负无穷方向），而 `int(-3.5)` 是**向零截断**得 `-3`。算分页、算分组时这个差别很致命。' },
            { t: 'h', x: '字符串：拼接与格式化' },
            { t: 'code', x: 'name, score = "小明", 92.567\n\n# 1) 逗号拼接（print 自动加空格）\nprint("姓名", name, "分数", score)\n\n# 2) f-string（推荐，最直观）\nprint(f"{name} 考了 {score:.1f} 分")     # .1f 保留一位小数\nprint(f"{score:>10.2f}|")                # 宽度 10，右对齐\nprint(f"{0.256:.1%}")                    # 百分比\n\n# 3) join：把列表拼成字符串\nprint("-".join(["a", "b", "c"]))', out: '姓名 小明 分数 92.567\n小明 考了 92.6 分\n     92.57|\n25.6%\na-b-c' },
            { t: 'note', x: '`+` 拼接字符串和数字会报 `TypeError`：`"年龄" + 18` 不行，必须 `"年龄" + str(18)` 或直接用 f-string。这是初学者最高频的报错之一。' },
            { t: 'h', x: 'input 与类型转换' },
            { t: 'code', x: '# input 的返回值永远是字符串\nage_text = "18"        # 相当于 input("请输入年龄：")\nage = int(age_text)    # 手动转成整数才能算\nprint("明年你", age + 1, "岁")\n\n# 常见写法：一行读入两个整数\n# a, b = map(int, input().split())\nprint(int("42"), float("3.14"), str(42), bool("0"))', out: '明年你 19 岁\n42 3.14 42 True' },
            { t: 'warn', x: '**`bool("0")` 是 True**，因为非空字符串都是真。只有空串 `""`、`0`、`0.0`、`[]`、`{}`、`None` 才是假。判断用户是否输入内容要写 `if s == "":`。' },
            { t: 'table', head: ['转换', '结果', '注意'], rows: [
              ['int("12")', '12', '带小数点的字符串会报错，要先用 float'],
              ['int(3.99)', '3', '向零截断，不是四舍五入'],
              ['round(3.99)', '4', '四舍五入，返回 int'],
              ['float("1e3")', '1000.0', '支持科学计数法'],
              ['str(3.0)', '"3.0"', '打印时不会自动去掉 .0']
            ] },
            { t: 'tip', x: '本站在线运行没有真实键盘输入，练习里的 `input()` 会读到空字符串。写练习题时用**变量赋值**代替输入，语法与真实环境完全一样。' }
          ]
        }
      ]
    },
    {
      id: 'py2', num: 2, title: '数据类型与容器', icon: '📦',
      intro: 'Python 的程序基本就是「拿数据 → 变形 → 输出」。这一章把 int / float / str / bool / None 的脾气摸清，再拿下四大容器：list、tuple、dict、set。它们的区别不是背出来的，是用出来的。',
      goals: ['准确判断一个字面量是什么类型', '熟练做字符串切分与格式化', '用列表和字典解决真实小问题', '知道什么时候该用 set 去重'],
      lessons: [
        {
          id: 'py2l1', title: '类型系统与转换陷阱', key: 'int/float/str/bool/None', time: 10,
          blocks: [
            { t: 'p', x: 'Python 是动态类型语言：变量没有类型，值才有类型。`type(x)` 看类型，`isinstance(x, int)` 做判断（后者更稳妥，因为它把 bool 当 int 的子类处理）。' },
            { t: 'table', head: ['类型', '字面量', '可变', '典型用途'], rows: [
              ['int', '42, -7, 0b1010', '否', '计数、索引、金额（分）'],
              ['float', '3.14, 1e-3', '否', '测量值、比例'],
              ['str', '"abc"', '否', '文本、路径、日志'],
              ['bool', 'True / False', '否', '条件、开关'],
              ['NoneType', 'None', '否', '表示"还没有值"']
            ] },
            { t: 'code', x: 'print(type(3), type(3.0), type("3"), type(True))\nprint(1 == True, 0 == False)      # True True：bool 是 int 的子类\nprint(isinstance(True, int))      # True\n\nx = None\nprint(x is None)                  # 判空用 is None，不要用 == None\nprint(len("中文"), len("abc"))     # 都是 3：len 数字符，不是字节', out: "<class 'int'> <class 'float'> <class 'str'> <class 'bool'>\nTrue True\nTrue\nTrue\n2 3" },
            { t: 'h', x: '四个转换坑' },
            { t: 'ul', x: [
              '`int("3.5")` 报错 → 要 `int(float("3.5"))`',
              '`int(-3.9)` 得 `-3`（向零截断），负数要小心',
              '浮点比较别用 `==`：`0.1 + 0.2 == 0.3` 是 False',
              '`str(1e20)` 会变成科学计数法，展示金额要格式化'
            ] },
            { t: 'code', x: 'print(abs(0.1 + 0.2 - 0.3) < 1e-9)   # 浮点比较的正确姿势\nprint(round(2.675, 2))            # 2.67，因为二进制存不下 2.675\nfrom decimal import Decimal\nprint(Decimal("0.1") + Decimal("0.2"))   # 需要精确就用 Decimal', out: 'True\n2.67\n0.3' },
            { t: 'warn', x: '涉及**金额**千万别用 float 累加。要么用 `Decimal`，要么统一换算成「分」用整数算，最后再除以 100 显示。' },
            { t: 'principle', x: '**None 表示"没有值"，不是 0 也不是空串。** 函数没写 `return` 时返回的就是 None。判断只有一种正确写法：`if x is None`。' }
          ]
        },
        {
          id: 'py2l2', title: '字符串：切片与常用方法', key: '切片 · split/join', time: 12,
          blocks: [
            { t: 'p', x: '字符串是**不可变序列**：所有「修改」方法其实都返回新字符串，原串不动。这一点决定了你必须写 `s = s.strip()`，而不是 `s.strip()`。' },
            { t: 'h', x: '索引与切片：左闭右开' },
            { t: 'code', x: 's = "CodeCraft"\nprint(s[0], s[-1])       # 正数从左，负数从右\nprint(s[0:4])            # Code  —— 含 0 不含 4\nprint(s[4:])             # Craft\nprint(s[:4])             # Code\nprint(s[::2])            # 步长 2\nprint(s[::-1])           # 反转\nprint(len(s), "Cra" in s)', out: 'C t\nCode\nCraft\nCode\nCdCat\ntfarCedoC\n9 True' },
            { t: 'h', x: '最常用的 10 个方法' },
            { t: 'table', head: ['方法', '作用', '例子'], rows: [
              ['strip()', '去两端空白', '"  hi ".strip() → "hi"'],
              ['split()', '按分隔符切分', '"a,b,c".split(",") → ["a","b","c"]'],
              ['join()', '把列表拼起来', '"-".join(["a","b"]) → "a-b"'],
              ['replace()', '替换子串', '"aXb".replace("X","-") → "a-b"'],
              ['find() / index()', '找位置，找不到时 find 返回 -1', '"abc".find("z") → -1'],
              ['startswith() / endswith()', '前后缀判断', '"a.py".endswith(".py") → True'],
              ['upper() / lower()', '大小写转换', '"Ab".lower() → "ab"'],
              ['count()', '出现次数', '"aaa".count("a") → 3'],
              ['isdigit() / isalpha()', '纯数字/纯字母判断', '"12".isdigit() → True'],
              ['zfill()', '左侧补零', '"7".zfill(3) → "007"']
            ] },
            { t: 'code', x: 'line = "  2026-11-11  score=92  "\nclean = line.strip()\nparts = clean.split()\nprint(parts)\n\ndate, kv = parts\nkey, val = kv.split("=")\nprint(date, key, val, int(val) + 8)\n\nprint("|".join(["a", "b", "c"]))\nprint("hello world".title())\nprint("A-B-C".replace("-", ""))', out: "['2026-11-11', 'score=92']\n2026-11-11 score 92 100\na|b|c\nHello World\nABC" },
            { t: 'note', x: '解析文本的三板斧：`strip()` 清空白 → `split()` 切字段 → `int()/float()` 转数值。日志、CSV、命令行参数，几乎都这么处理。' },
            { t: 'warn', x: '`split()` 和 `split(" ")` 不一样：不带参数会合并连续空白并去掉首尾空串，带空格参数会保留空字段。解析不定长空格分隔的数据时，用不带参数的版本。' }
          ]
        },
        {
          id: 'py2l3', title: '列表与元组：最常用的容器', key: 'list / tuple', time: 13,
          blocks: [
            { t: 'p', x: '列表是有序、可变、可重复的容器，几乎是 Python 里最常用的数据结构。元组是有序、**不可变**的版本，适合表达「一条记录」或作为字典的键。' },
            { t: 'code', x: 'nums = [3, 1, 4, 1, 5]\nnums.append(9)        # 尾部追加\nnums.insert(0, 0)     # 指定位置插入\nnums.remove(1)        # 删除第一个值为 1 的元素\nlast = nums.pop()     # 弹出末尾\nprint(nums, last)\n\nnums.sort()               # 原地排序，返回 None\nprint(nums)\nprint(sorted(nums, reverse=True))   # 返回新列表', out: '[0, 3, 4, 1, 5] 9\n[0, 1, 3, 4, 5]\n[5, 4, 3, 1, 0]' },
            { t: 'table', head: ['操作', '写法', '复杂度'], rows: [
              ['按下标取', 'lst[0] / lst[-1]', 'O(1)'],
              ['尾部追加', 'lst.append(x)', 'O(1)'],
              ['中间插入', 'lst.insert(i, x)', 'O(n)'],
              ['按值删除', 'lst.remove(x)', 'O(n)'],
              ['判断存在', 'x in lst', 'O(n)（列表）/ O(1)（集合）'],
              ['切片', 'lst[1:3]', 'O(k)']
            ] },
            { t: 'h', x: '浅拷贝的坑（重点）' },
            { t: 'code', x: 'a = [[1, 2], [3, 4]]\nb = a.copy()          # 只复制了外层\nb[0].append(99)\nprint(a)              # 内层还是同一个对象\n\nimport copy\nc = copy.deepcopy(a)  # 连内层一起复制\nc[0].append(7)\nprint(a, c)', out: '[[1, 2, 99], [3, 4]]\n[[1, 2, 99], [3, 4]] [[1, 2, 99, 7], [3, 4]]' },
            { t: 'p', x: '`list.copy()`、`a[:]`、`list(a)` 都是**浅拷贝**。嵌套列表要独立复制，只能用 `copy.deepcopy()`。这个坑在「二维表格」类数据上几乎必踩一次。' },
            { t: 'h', x: '列表推导式：一行完成筛选 + 变形' },
            { t: 'code', x: 'scores = [88, 42, 95, 67, 73]\npass_line = [s for s in scores if s >= 60]\ncurve = [min(100, s + 5) for s in scores]\npairs = [(i, s) for i, s in enumerate(scores) if s < 60]\n\nprint(pass_line)\nprint(curve)\nprint(pairs)\nprint(sum(scores) / len(scores))', out: '[88, 95, 67, 73]\n[93, 47, 100, 72, 78]\n[(1, 42)]\n73.0' },
            { t: 'note', x: '推导式写得太长就该拆开。超过两层的嵌套推导（`[[... for ...] for ...]`）可读性会崩溃，老老实实写 for 循环更专业。' },
            { t: 'code', x: 'point = (3, 5)          # 元组：不可变\nx, y = point            # 解包\nprint(x + y)\n\n# 常见用途：函数返回多个值\ndef min_max(nums):\n    return min(nums), max(nums)\n\nlo, hi = min_max([3, 1, 4])\nprint(lo, hi)', out: '8\n1 4' }
          ]
        },
        {
          id: 'py2l4', title: '字典与集合', key: 'dict / set', time: 13,
          blocks: [
            { t: 'p', x: '字典存的是一组「键 → 值」映射，查询是 O(1)。只要你要「按名字找东西」，就该用字典；只要你要「去重 / 判断存在」，就该用集合。' },
            { t: 'code', x: 'stu = {"name": "小明", "age": 19}\nstu["major"] = "人工智能"      # 新增\nstu["age"] = 20                # 覆盖\nprint(stu.get("score", 0))     # 取不到时给默认值，不报错\nprint("name" in stu)\ndel stu["major"]\nprint(stu)', out: '0\nTrue\n{\'name\': \'小明\', \'age\': 20}' },
            { t: 'table', head: ['需求', '写法', '不要这样做'], rows: [
              ['取可能不存在的键', 'd.get(k, 默认值)', 'd[k] 会抛 KeyError'],
              ['统计次数', 'd[k] = d.get(k, 0) + 1', '先 if k in d 再分支'],
              ['遍历键值', 'for k, v in d.items()', 'for k in d 再 d[k]'],
              ['安全设置默认', 'd.setdefault(k, []).append(x)', '手动判断两次'],
              ['合并字典', '{**a, **b} 或 a | b', '循环逐项赋值']
            ] },
            { t: 'code', x: 'text = "the cat and the dog and the bird"\ncount = {}\nfor w in text.split():\n    count[w] = count.get(w, 0) + 1\nprint(count)\n\n# 按次数排序\nrank = sorted(count.items(), key=lambda kv: -kv[1])\nprint(rank[:2])', out: "{'the': 3, 'cat': 1, 'and': 2, 'dog': 1, 'bird': 1}\n[('the', 3), ('and', 2)]" },
            { t: 'h', x: '集合：去重与集合运算' },
            { t: 'code', x: 'a = [1, 2, 2, 3, 3, 3]\nprint(set(a))\n\ns1, s2 = {1, 2, 3}, {3, 4}\nprint(s1 & s2)    # 交集\nprint(s1 | s2)    # 并集\nprint(s1 - s2)    # 差集\n\n# 判断存在，集合比列表快得多\nseen = set()\nfor x in [5, 5, 6]:\n    if x not in seen:\n        seen.add(x)\nprint(seen)', out: '{1, 2, 3}\n{3}\n{1, 2, 3, 4}\n{1, 2}\n{5, 6}' },
            { t: 'warn', x: '集合的元素必须**可哈希**（不可变）。列表不能放进 set，要放元组。同理，列表也不能当字典的键。' },
            { t: 'principle', x: '**选容器的顺序**：要顺序、要重复 → list；要按名字查 → dict；只要去重和存在性 → set；表达一条不可变的记录 → tuple。想清楚这一点，代码结构就顺了。' }
          ]
        }
      ]
    },
    {
      id: 'py3', num: 3, title: '流程控制：条件、循环与嵌套', icon: '🔀',
      intro: '程序之所以有用，是因为它能「根据情况做不同的事」并且「重复做很多次」。这一章把 if / for / while 写熟，重点练边界条件：什么时候开始、什么时候停、什么时候跳过。',
      goals: ['写出覆盖完整分支的 if 链', '用 for / range 精确控制次数', '用 while 处理"不知道要循环几次"的场景', '用 break / continue 控制循环走向'],
      lessons: [
        {
          id: 'py3l1', title: '条件判断与真值', key: 'if / elif / else', time: 11,
          blocks: [
            { t: 'p', x: '`if` 后面跟的是任意表达式，Python 会把它转成布尔值。所以 `if name:`、`if items:`、`if not err:` 都是合法且地道的写法。' },
            { t: 'code', x: 'score = 78\nif score >= 90:\n    level = "优秀"\nelif score >= 75:\n    level = "良好"\nelif score >= 60:\n    level = "及格"\nelse:\n    level = "不及格"\nprint(level)', out: '良好' },
            { t: 'p', x: '注意 `elif` 的顺序：条件从上往下判断，**第一个成立的分支执行完就跳出整条链**。如果把 `>= 60` 放在最前面，所有人都会变成「及格」。这是最典型的逻辑错误。' },
            { t: 'h', x: '哪些值是假的' },
            { t: 'table', head: ['假值', '说明'], rows: [
              ['False、None', '本身'],
              ['0、0.0、0j', '数值零'],
              ['""、\'\'', '空字符串'],
              ['[]、()、{}、set()', '空容器'],
              ['其它一切', '都是真，包括 "0"、[0]、"False"']
            ] },
            { t: 'code', x: 'print(bool("0"), bool([0]), bool(0), bool(""))\n\nage = 0\nif age:                      # 0 是假\n    print("有年龄")\nelse:\n    print("年龄未知（0 被当成没填）")', out: 'True True False False\n年龄未知（0 被当成没填）' },
            { t: 'warn', x: '用 `if age:` 判断「有没有填年龄」会漏掉 0。要区分「没填」和「填了 0」，应该判断 `if age is not None:`。' },
            { t: 'h', x: '组合条件与三元表达式' },
            { t: 'code', x: 'n = 15\nprint(n % 3 == 0 and n % 5 == 0)\nprint(n < 0 or n > 100)\nprint(not (n == 15))\n\n# 三元表达式：简单的 if-else 可以一行写完\nlabel = "偶数" if n % 2 == 0 else "奇数"\nprint(label)\n\n# 链式比较：Python 特有\nprint(0 <= n <= 100)', out: 'True\nFalse\nFalse\n奇数\nTrue' },
            { t: 'note', x: '`and` / `or` 有短路特性：`a and b` 里 a 为假就不再看 b。所以 `if user and user.name:` 是安全的，`if user.name and user:` 会炸。' }
          ]
        },
        {
          id: 'py3l2', title: 'for 循环与 range', key: 'for / range / enumerate', time: 12,
          blocks: [
            { t: 'p', x: 'Python 的 `for` 是「遍历可迭代对象」，不是 C 那种「计数器循环」。想要计数器就用 `range()`。' },
            { t: 'code', x: 'for i in range(5):        # 0 1 2 3 4\n    print(i, end=" ")\nprint()\n\nfor i in range(1, 6):     # 1..5\n    print(i, end=" ")\nprint()\n\nfor i in range(10, 0, -3):  # 起点 10，终点（不含），步长 -3\n    print(i, end=" ")\nprint()', out: '0 1 2 3 4 \n1 2 3 4 5 \n10 7 4 1 ' },
            { t: 'table', head: ['写法', '含义', '结果'], rows: [
              ['range(5)', '0 到 4', '长度 5'],
              ['range(2, 5)', '2 到 4', '长度 3'],
              ['range(0, 10, 2)', '0 2 4 6 8', '长度 5'],
              ['range(5, 0, -1)', '5 4 3 2 1', '倒着数'],
              ['range(0)', '空', '一次都不执行']
            ] },
            { t: 'h', x: '遍历容器时同时拿到下标' },
            { t: 'code', x: 'names = ["小明", "小红", "小刚"]\n\nfor i, n in enumerate(names, start=1):\n    print(i, n)\n\nfor name, score in zip(names, [88, 92, 75]):\n    print(name, score)', out: '1 小明\n2 小红\n3 小刚\n小明 88\n小红 92\n小刚 75' },
            { t: 'warn', x: '**不要在遍历列表时删除元素**，索引会错位导致漏删。要筛选用推导式生成新列表，或者倒着删、遍历副本 `for x in lst[:]`。' },
            { t: 'code', x: 'nums = [1, 2, 3, 4, 5, 6]\n\n# 错误做法（会漏删）：\n# for x in nums:\n#     if x % 2 == 0: nums.remove(x)\n\n# 正确做法：生成新列表\nodd = [x for x in nums if x % 2 == 1]\nprint(odd)', out: '[1, 3, 5]' },
            { t: 'tip', x: '需要「带下标 + 值」就用 `enumerate`，需要「两个列表并行」就用 `zip`。这两件事用 `for i in range(len(lst))` 硬写，是新手最明显的痕迹。' }
          ]
        },
        {
          id: 'py3l3', title: 'while、break 与嵌套循环', key: 'while / break / continue', time: 12,
          blocks: [
            { t: 'p', x: '`for` 适合「次数已知」，`while` 适合「条件满足就一直做」。用 while 的三件套必须齐全：**初值、判断条件、让条件趋近结束的更新**。缺一个就是死循环。' },
            { t: 'code', x: '# 猜数字（固定答案，方便在线运行）\ntarget, guess, tries = 42, 0, 0\nwhile guess != target:\n    tries += 1\n    guess = tries * 14          # 模拟每次逼近\nprint("猜了", tries, "次，猜中", guess)', out: '猜了 3 次，猜中 42' },
            { t: 'h', x: 'break / continue / else' },
            { t: 'code', x: 'for n in range(2, 20):\n    if n % 2 == 0:\n        continue        # 跳过本轮剩余语句\n    if n > 11:\n        break           # 直接跳出整个循环\n    print(n, end=" ")\nprint("\\n循环结束")\n\n# for-else：循环"正常跑完"才执行 else\nfor n in [4, 6, 8]:\n    if n % 2:\n        print("找到奇数", n)\n        break\nelse:\n    print("全是偶数")', out: '3 5 7 9 11 \n循环结束\n全是偶数' },
            { t: 'table', head: ['关键字', '作用', '常见误用'], rows: [
              ['break', '跳出当前这一层循环', '以为能跳出两层（不能）'],
              ['continue', '跳过本轮，进入下一轮', '写在循环最后一行（等于没写）'],
              ['for-else', '循环未被 break 时执行', '误以为是"循环结束就执行"'],
              ['while-else', '同上', '几乎不用，容易读错']
            ] },
            { t: 'h', x: '嵌套循环与跳出技巧' },
            { t: 'code', x: '# 打印乘法表前 3 行\nfor i in range(1, 4):\n    row = ""\n    for j in range(1, i + 1):\n        row += f"{j}x{i}={i*j}  "\n    print(row)\n\n# 想在嵌套里"一次跳出两层"：用标志位或函数返回\nfound = None\nfor i in range(3):\n    for j in range(3):\n        if i * j == 4:\n            found = (i, j)\n            break\n    if found:\n        break\nprint(found)', out: '1x1=1  \n1x2=2  2x2=4  \n1x3=3  2x3=6  3x3=9  \n(2, 2)' },
            { t: 'warn', x: '死循环不可怕，可怕的是不知道自己在死循环。调试时先加 `print(i)` 看变量有没有在变，再看循环条件是不是永远为真。' },
            { t: 'principle', x: '**循环设计的三个问题**：从哪开始？什么时候停？每次怎么变？把这三句写成注释再动手，循环几乎不会写错。' }
          ]
        }
      ]
    },
    {
      id: 'py4', num: 4, title: '函数：把逻辑打包', icon: '🧰',
      intro: '函数不只是「省点重复代码」，它是把问题拆小的工具。这一章把参数、返回值、作用域讲透，顺便说清 Python 那几个让人困惑的默认参数坑。',
      goals: ['写出职责单一、有返回值的函数', '分清位置参数 / 关键字参数 / 默认参数', '解释局部变量与全局变量的差别', '用递归和 lambda 解决合适的问题'],
      lessons: [
        {
          id: 'py4l1', title: '定义、参数与返回值', key: 'def / return', time: 12,
          blocks: [
            { t: 'p', x: '一个函数只做一件事，并且**用名字说明它做什么**。判断标准很简单：如果你需要写注释解释这个函数在干嘛，说明名字没起好或者它做了太多事。' },
            { t: 'code', x: 'def bmi(weight, height):\n    """返回 BMI，保留两位小数"""\n    if height <= 0:\n        return None\n    return round(weight / (height ** 2), 2)\n\ndef bmi_level(v):\n    if v is None:\n        return "数据无效"\n    if v < 18.5:\n        return "偏瘦"\n    if v <= 24:\n        return "正常"\n    return "偏胖"\n\nval = bmi(65, 1.75)\nprint(val, bmi_level(val))', out: '21.22 正常' },
            { t: 'p', x: '`return` 一旦执行，函数立即结束。没写 return 的函数返回 `None`。想返回多个值就写 `return a, b`，调用处用 `x, y = f()` 接住（本质是返回了一个元组）。' },
            { t: 'h', x: '参数的四种形态' },
            { t: 'code', x: 'def order(name, count=1, *, urgent=False):\n    tag = "[加急]" if urgent else ""\n    return f"{tag}{name} x{count}"\n\nprint(order("咖啡"))                    # 默认 1 杯\nprint(order("咖啡", 3))                  # 位置参数\nprint(order(count=2, name="茶"))          # 关键字参数，顺序无关\nprint(order("面", urgent=True))           # 只能关键字传\n# order("面", False, True)  ← 会报错，* 后面的参数必须写名字', out: '咖啡 x1\n咖啡 x3\n茶 x2\n[加急]面 x1' },
            { t: 'table', head: ['写法', '名称', '说明'], rows: [
              ['def f(a, b)', '位置参数', '按顺序传，最常用'],
              ['def f(a=1)', '默认参数', '调用时可省略，必须放在无默认值参数后面'],
              ['def f(*args)', '可变位置参数', '收成元组，用于任意个参数'],
              ['def f(**kwargs)', '可变关键字参数', '收成字典'],
              ['def f(*, a)', '仅关键字参数', '强制调用方写 a=...'],
              ['f(a=1, b=2)', '关键字传参', '可读性好，顺序无关']
            ] },
            { t: 'warn', x: '**默认参数在定义时求值一次**。`def f(x, items=[])` 里的列表是所有调用共享的，第二次调用会看到上一次追加的内容。正确写法：默认值用 `None`。' },
            { t: 'code', x: 'def bad(items=[]):\n    items.append(1)\n    return items\n\nprint(bad(), bad())     # 同一个列表被改了两次\n\ndef good(items=None):\n    items = [] if items is None else items\n    items.append(1)\n    return items\n\nprint(good(), good())', out: '[1, 1] [1, 1]\n[1] [1]' },
            { t: 'note', x: '函数签名越简单越好用。参数超过 4 个，就该考虑用一个字典/数据类收起来，或者拆成两个函数。' }
          ]
        },
        {
          id: 'py4l2', title: '作用域、闭包与 lambda', key: '作用域 / lambda', time: 12,
          blocks: [
            { t: 'p', x: 'Python 查找变量按 **LEGB** 顺序：Local（函数内）→ Enclosing（外层函数）→ Global（模块）→ Builtin（内置）。函数内部赋值会创建局部变量，除非你用 `global` / `nonlocal` 声明。' },
            { t: 'code', x: 'total = 0\n\ndef add(n):\n    total = n          # 这是新的局部变量，不是修改全局\n    return total\n\nprint(add(5), total)\n\ndef add_global(n):\n    global total\n    total += n\n    return total\n\nprint(add_global(5), total)', out: '5 0\n5 5' },
            { t: 'h', x: '闭包：把状态藏在函数里' },
            { t: 'code', x: 'def counter():\n    n = 0\n    def step():\n        nonlocal n      # 声明 n 来自外层函数\n        n += 1\n        return n\n    return step\n\nc = counter()\nprint(c(), c(), c())', out: '1 2 3' },
            { t: 'p', x: '`step` 记住了外层函数里的 `n`，即使 `counter()` 已经执行完了。这就是闭包：**函数 + 它捕获的环境**。做计数器、缓存、装饰器都靠它。' },
            { t: 'h', x: 'lambda：只适合一行表达式' },
            { t: 'code', x: 'pairs = [("b", 2), ("a", 3), ("c", 1)]\n\nprint(sorted(pairs))                       # 默认按元组第一个元素\nprint(sorted(pairs, key=lambda x: x[1]))    # 按第二个元素\nprint(sorted(pairs, key=lambda x: -x[1]))   # 按第二个元素降序\n\nnums = [1, 2, 3, 4]\nprint(list(map(lambda x: x * 2, nums)))\nprint(list(filter(lambda x: x % 2 == 0, nums)))', out: "[('a', 3), ('b', 2), ('c', 1)]\n[('c', 1), ('b', 2), ('a', 3)]\n[('a', 3), ('b', 2), ('c', 1)]\n[2, 4, 6, 8]\n[2, 4]" },
            { t: 'note', x: '`key=` 传的是「打分函数」：`sorted` 会给每个元素调用它，按返回值排序。这比写 `cmp` 函数直观得多，也是 Python 排序的标准姿势。' },
            { t: 'h', x: '递归：自己调用自己' },
            { t: 'code', x: 'def fact(n):\n    if n <= 1:          # 必须有出口，否则无限递归\n        return 1\n    return n * fact(n - 1)\n\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nprint(fact(5), fib(10))', out: '120 55' },
            { t: 'warn', x: '递归必须有**出口条件**，并且每次调用要朝着出口靠近。Python 默认递归深度约 1000 层，超过就 `RecursionError`。能用循环解决的，优先用循环。' }
          ]
        },
        {
          id: 'py4l3', title: '函数式小工具与代码组织', key: '解包 / 高阶函数', time: 10,
          blocks: [
            { t: 'p', x: 'Python 提供了一批「接收函数作为参数」的工具，用对了能显著减少样板代码。前提是你能一眼看懂 `key` / `lambda` 的组合。' },
            { t: 'code', x: 'students = [\n    {"name": "小明", "score": 88},\n    {"name": "小红", "score": 95},\n    {"name": "小刚", "score": 61},\n]\n\ntop = max(students, key=lambda s: s["score"])\nbottoms = [s["name"] for s in students if s["score"] < 70]\navg = sum(s["score"] for s in students) / len(students)\n\nprint(top["name"], bottoms, round(avg, 1))', out: '小红 [\'小刚\'] 81.3' },
            { t: 'table', head: ['函数', '用途', '例子'], rows: [
              ['sorted(..., key=)', '排序', 'sorted(d, key=len)'],
              ['max / min(..., key=)', '取极值的那一项', 'max(d, key=lambda x: x[1])'],
              ['sum(生成器)', '求和', 'sum(x for x in nums if x > 0)'],
              ['any / all', '任一 / 全部成立', 'all(s >= 60 for s in scores)'],
              ['map / filter', '批量变形 / 筛选', '一般用推导式替代更清晰']
            ] },
            { t: 'h', x: '让函数更好用的三个习惯' },
            { t: 'ul', x: [
              '**单一职责**：一个函数只做一件事，长度尽量控制在 30 行内',
              '**明确返回**：要么稳定返回一种类型，要么返回 None 并在文档里说清',
              '**写 docstring**：一行说明「做什么、参数、返回」，`help(f)` 就能看到'
            ] },
            { t: 'code', x: 'def parse_score(text):\n    """把 \'92\' 或 \'92分\' 转成整数，失败返回 None。"""\n    digits = "".join(ch for ch in text if ch.isdigit())\n    return int(digits) if digits else None\n\nfor t in ["92", "88分", "缺考"]:\n    print(t, "->", parse_score(t))', out: '92 -> 92\n88分 -> 88\n缺考 -> None' },
            { t: 'principle', x: '**函数是给自己下周看的。** 起个能读的名字、写一行说明、只做一件事——做到这三点，你三个月后还能一眼看懂自己写的东西。' }
          ]
        }
      ]
    },
    {
      id: 'py5', num: 5, title: '异常、文件与模块', icon: '🛡️',
      intro: '真实程序一定会遇到「意外」：文件不存在、网络断了、用户输入了奇怪的东西。这一章学的是让程序不崩、以及把数据存下来再读出来。',
      goals: ['用 try/except 处理预期内的错误', '分清 except 的粒度，避免吞掉 bug', '读写文本与 JSON 文件', '用模块组织代码、用 pip 装包'],
      lessons: [
        {
          id: 'py5l1', title: '异常处理：让程序优雅地失败', key: 'try / except / raise', time: 12,
          blocks: [
            { t: 'p', x: '异常不是「错误」，而是 Python 报错的机制。`int("abc")` 抛 `ValueError`，`d["missing"]` 抛 `KeyError`，`1/0` 抛 `ZeroDivisionError`。捕获它，程序就能继续跑。' },
            { t: 'code', x: 'def to_int(text):\n    try:\n        return int(text)\n    except ValueError:\n        print(f"「{text}」不是整数")\n        return None\n\nprint(to_int("42"))\nprint(to_int("4.2"))\nprint(to_int("abc"))', out: '42\n「4.2」不是整数\nNone\n「abc」不是整数\nNone' },
            { t: 'h', x: '完整结构：else 与 finally' },
            { t: 'code', x: 'def divide(a, b):\n    try:\n        result = a / b\n    except ZeroDivisionError as e:\n        print("除零：", e)\n        return None\n    except TypeError:\n        print("参数类型不对")\n        return None\n    else:\n        print("计算成功")\n        return result\n    finally:\n        print("— 这一句一定执行 —")\n\nprint(divide(10, 2))\nprint(divide(1, 0))', out: '计算成功\n— 这一句一定执行 —\n5.0\n除零： division by zero\n— 这一句一定执行 —\nNone' },
            { t: 'table', head: ['子句', '什么时候执行', '典型用途'], rows: [
              ['try', '总是', '放可能出错的代码'],
              ['except', '对应异常发生时', '给出提示 / 兜底值'],
              ['else', '没发生异常时', '放「成功之后」的逻辑'],
              ['finally', '无论如何', '关闭文件、释放连接']
            ] },
            { t: 'warn', x: '**不要写裸 `except:`**。它会连 `KeyboardInterrupt`（Ctrl+C）一起吞掉，还会掩盖真正的 bug。至少写成 `except Exception as e:` 并把 e 打出来。' },
            { t: 'code', x: '# 主动抛异常：给调用方一个明确的失败信号\ndef set_age(age):\n    if not isinstance(age, int):\n        raise TypeError("年龄必须是整数")\n    if age < 0 or age > 150:\n        raise ValueError(f"年龄不合理：{age}")\n    return age\n\ntry:\n    set_age(200)\nexcept ValueError as e:\n    print("捕获到：", e)', out: '捕获到： 年龄不合理：200' },
            { t: 'principle', x: '**该崩的时候要崩。** 数据格式不对就抛异常，别悄悄返回 0 —— 那会让错误在几百行之后以更诡异的形式出现。异常处理是给「可预期的意外」用的，不是用来掩盖 bug 的。' }
          ]
        },
        {
          id: 'py5l2', title: '文件读写与 JSON', key: 'open / with / json', time: 12,
          blocks: [
            { t: 'p', x: '读写文件的标准写法是 `with open(...) as f:`。`with` 保证即使中途抛异常，文件也会被正确关闭——这是 Python 最值得记住的语法糖之一。' },
            { t: 'code', x: 'import os\n\npath = "demo.txt"\nwith open(path, "w", encoding="utf-8") as f:\n    f.write("第一行\\n")\n    f.write("第二行\\n")\n\nwith open(path, "r", encoding="utf-8") as f:\n    text = f.read()\nprint(repr(text))\n\nwith open(path, "r", encoding="utf-8") as f:\n    for i, line in enumerate(f, 1):\n        print(i, line.strip())\n\nos.remove(path)   # 清理演示文件', out: "'第一行\\n第二行\\n'\n1 第一行\n2 第二行" },
            { t: 'table', head: ['模式', '含义', '注意'], rows: [
              ['"r"', '只读（默认）', '文件不存在会报错'],
              ['"w"', '写入，清空原内容', '最危险的模式，会直接覆盖'],
              ['"a"', '追加', '日志常用'],
              ['"x"', '新建，已存在则报错', '防止误覆盖'],
              ['"rb"/"wb"', '二进制', '图片、压缩包']
            ] },
            { t: 'code', x: 'import json\n\npath = "data.json"\ninfo = {"name": "小明", "scores": [88, 92], "active": True}\n\nwith open(path, "w", encoding="utf-8") as f:\n    json.dump(info, f, ensure_ascii=False, indent=2)\n\nwith open(path, "r", encoding="utf-8") as f:\n    back = json.load(f)\n\nprint(back["name"], back["scores"], type(back).__name__)\nprint(json.dumps(back, ensure_ascii=False))', out: '小明 [88, 92] dict\n{"name": "小明", "scores": [88, 92], "active": true}' },
            { t: 'note', x: '`json.dump/load` 操作**文件对象**；`json.dumps/loads` 操作**字符串**（多一个 s = string）。这两个别记混，报错信息会很不友好。' },
            { t: 'warn', x: '不写 `encoding="utf-8"` 时，Windows 默认用 GBK，读中文文件常报 `UnicodeDecodeError`。养成习惯：**读写文本永远带上 encoding**。' },
            { t: 'h', x: '模块与包' },
            { t: 'code', x: 'import math\nfrom random import randint, seed\n\nseed(7)                     # 固定随机种子，结果可复现\nprint(math.sqrt(16), math.floor(3.9))\nprint(randint(1, 6))    # 固定种子后每次都是 3\n\n# 自己的模块：同目录下 utils.py 里写了 def add(a,b)，就能这样用\n# import utils\n# print(utils.add(1, 2))', out: '4.0 3\n3' },
            { t: 'principle', x: '代码超过 300 行就该拆文件。`import` 不是「高级技巧」，是让文件能读懂的基本手段。装第三方库用 `pip install 包名`，在代码里 `import` 就能用。' }
          ]
        }
      ]
    },
    {
      id: 'py6', num: 6, title: '面向对象与综合实战', icon: '🏗️',
      intro: '当你需要「把数据和操作数据的方法绑在一起」时，就该用类了。这一章不追求把 OOP 讲全，只求你能写出一个能用、能扩展的小类，并用它完成一个真实小项目。',
      goals: ['写出带构造函数的类并创建对象', '理解 self 到底指什么', '用继承复用代码、用魔法方法让对象更自然', '独立完成词频统计与通讯录两个小项目'],
      lessons: [
        {
          id: 'py6l1', title: '类与对象：把数据和动作绑在一起', key: 'class / __init__ / self', time: 13,
          blocks: [
            { t: 'p', x: '类（class）是模板，对象（instance）是按模板造出来的实例。`__init__` 在创建对象时自动执行，用来初始化属性；`self` 就是「这个对象自己」。' },
            { t: 'code', x: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n        self.history = []\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("金额必须为正")\n        self.balance += amount\n        self.history.append(("存入", amount))\n        return self.balance\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            print("余额不足")\n            return self.balance\n        self.balance -= amount\n        self.history.append(("取出", amount))\n        return self.balance\n\nacc = BankAccount("小明", 100)\nacc.deposit(50)\nacc.withdraw(30)\nacc.withdraw(999)\nprint(acc.owner, acc.balance, acc.history)', out: "余额不足\n小明 120 [('存入', 50), ('取出', 30)]" },
            { t: 'h', x: 'self 到底是什么' },
            { t: 'p', x: '`acc.deposit(50)` 等价于 `BankAccount.deposit(acc, 50)`。Python 自动把对象作为第一个参数传进去，名字叫 `self` 只是约定。所以方法里访问属性必须写 `self.balance`，直接写 `balance` 会被当成局部变量。' },
            { t: 'table', head: ['概念', '写法', '说明'], rows: [
              ['属性', 'self.balance', '每个对象各有一份'],
              ['类属性', '在 class 里直接写 count = 0', '所有对象共享'],
              ['实例方法', 'def f(self)', '最常见'],
              ['类方法', '@classmethod def f(cls)', '操作类本身，常用于备用构造函数'],
              ['静态方法', '@staticmethod def f()', '不需要 self，就是个普通函数']
            ] },
            { t: 'code', x: 'class Counter:\n    total = 0                 # 类属性，所有实例共享\n\n    def __init__(self):\n        Counter.total += 1\n\n    @staticmethod\n    def is_positive(n):\n        return n > 0\n\n    def __str__(self):         # 魔法方法：print 时显示什么\n        return f"<Counter #{Counter.total}>"\n\na, b = Counter(), Counter()\nprint(a, b, Counter.total, Counter.is_positive(3))', out: '<Counter #2> <Counter #2> 2 True' },
            { t: 'note', x: '`__str__` 决定 `print(obj)` 的输出，`__repr__` 决定调试时看到的样子。写类时至少给一个，否则打印出来是 `<__main__.Obj object at 0x...>`，毫无信息量。' },
            { t: 'warn', x: '别在 `__init__` 里写太多逻辑（读文件、发请求）。构造函数应该轻，只做赋值；重活交给单独的方法。' }
          ]
        },
        {
          id: 'py6l2', title: '继承、魔法方法与小项目', key: '继承 / __len__ / 小项目', time: 14,
          blocks: [
            { t: 'p', x: '继承解决的是「有一批对象共享大部分行为，只有少数不同」。`super().__init__()` 先让父类把公共部分初始化好，再补自己的。' },
            { t: 'code', x: 'class Shape:\n    def __init__(self, name):\n        self.name = name\n    def area(self):\n        raise NotImplementedError("子类必须实现 area")\n    def __str__(self):\n        return f"{self.name}(面积={self.area():.2f})"\n\nclass Rect(Shape):\n    def __init__(self, w, h):\n        super().__init__("矩形")\n        self.w, self.h = w, h\n    def area(self):\n        return self.w * self.h\n\nclass Circle(Shape):\n    def __init__(self, r):\n        super().__init__("圆")\n        self.r = r\n    def area(self):\n        return 3.14159 * self.r ** 2\n\nfor s in [Rect(3, 4), Circle(2)]:\n    print(s)', out: '矩形(面积=12.00)\n圆(面积=12.57)' },
            { t: 'p', x: '同一个 `print(s)`，不同对象给出不同结果——因为 `area()` 被子类重写了。这就是多态：**调用同一接口，执行各自的实现**。' },
            { t: 'h', x: '常用魔法方法速查' },
            { t: 'table', head: ['魔法方法', '触发时机', '例子'], rows: [
              ['__init__', '创建对象', 'Obj()'],
              ['__str__', 'print / str()', 'print(o)'],
              ['__len__', 'len(o)', '容器类必写'],
              ['__eq__', '==', '按内容比较两个对象'],
              ['__getitem__', 'o[key]', '让对象支持下标'],
              ['__iter__', 'for x in o', '让对象可迭代']
            ] },
            { t: 'h', x: '小项目 1：词频统计' },
            { t: 'code', x: 'from collections import Counter\n\nwords = ["python", "c", "python", "java", "python", "c"]\n\nfor w, c in Counter(words).most_common(2):\n    print(w, c)\n\n# 不依赖标准库的手写版本，思路更通用\ncount = {}\nfor w in words:\n    count[w] = count.get(w, 0) + 1\nprint(count)', out: 'python 3\nc 2\n{\'python\': 3, \'c\': 2, \'java\': 1}' },
            { t: 'h', x: '小项目 2：通讯录（增删查）' },
            { t: 'code', x: 'class Contact:\n    def __init__(self):\n        self.book = {}\n    def add(self, name, phone):\n        self.book[name] = phone\n        return f"已添加 {name}"\n    def remove(self, name):\n        return f"已删除 {name}" if self.book.pop(name, None) else "查无此人"\n    def find(self, key):\n        return {k: v for k, v in self.book.items() if key in k or key in v}\n\nc = Contact()\nc.add("小明", "13800000000")\nc.add("小红", "13900000000")\nprint(c.find("小红"))\nprint(c.remove("小明"))\nprint(c.book)', out: "{'小红': '13900000000'}\n已删除 小明\n{'小红': '13900000000'}" },
            { t: 'principle', x: '**类不是越多越好。** 只有当一个概念同时有「数据」和「行为」，并且会在多处复用时，才值得写成类。纯数据用字典、纯函数用 def，代码会更短。' }
          ]
        }
      ]
    }
  ],

  /* ==================== 章节测试题库 ==================== */
  quiz: [
    { id: 'pyq1', ch: 'py1', lesson: 'py1l1', point: '执行模型', type: 'choice', diff: 1,
      prompt: '关于 Python 的执行方式，下面哪种说法准确？',
      opts: ['先把源码整体编译成可执行文件，再运行', '先编译成字节码，再由虚拟机逐条解释执行', '完全不需要编译，解释器直接逐字读源码执行', '只在第一次运行时编译，之后不再需要解释器'],
      ans: 1,
      explain: 'Python 会先把 `.py` 编译成字节码（缓存在 `__pycache__`），再由 CPython 虚拟机执行。所以它既有编译环节，也依赖解释器，速度介于纯编译型和纯解释型之间。' },
    { id: 'pyq2', ch: 'py1', lesson: 'py1l1', point: 'print 细节', type: 'output', diff: 1,
      prompt: '写出下面代码的输出。',
      code: 'print("3" + "4")\nprint(3 + 4)\nprint("a", "b", sep="-")\nprint("x", end="!")\nprint("y")',
      answer: '34\n7\na-b\nx!y',
      explain: '`"3" + "4"` 是字符串拼接得 `34`；数字相加得 `7`；`sep` 改分隔符；`end="!"` 让这行不换行，下一句紧接着输出，所以最后一行是 `x!y`。' },
    { id: 'pyq3', ch: 'py1', lesson: 'py1l2', point: '引用模型', type: 'choice', diff: 2,
      prompt: '下面代码打印什么？',
      code: 'a = [1, 2]\nb = a\nb += [3]\nprint(a, a is b)',
      opts: ['[1, 2] False', '[1, 2, 3] True', '[1, 2, 3] False', '[1, 2] True'],
      ans: 1,
      explain: '`b = a` 只是贴了第二张标签，`b += [3]` 对列表是原地修改（`__iadd__`），a 看到的是同一个对象，所以一起变成 `[1,2,3]`，`is` 判断仍是同一对象。' },

    { id: 'pyq4', ch: 'py2', lesson: 'py2l1', point: '类型转换', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'print(int(3.99))\nprint(int(-3.99))\nprint(round(3.99))\nprint(round(2.5))',
      answer: '3\n-3\n4\n2',
      explain: '`int()` 向零截断；`round()` 是四舍六入五取偶（banker\'s rounding），所以 `round(2.5)` 得 2，`round(3.5)` 得 4。' },
    { id: 'pyq5', ch: 'py2', lesson: 'py2l2', point: '切片', type: 'choice', diff: 2,
      prompt: '`s = "abcdefg"`，`s[1:6:2]` 的结果是？',
      opts: ['"bdf"', '"bcd"', '"bdfg"', '"ace"'],
      ans: 0,
      explain: '从下标 1 开始（b），到下标 6 结束但不含（不含 g），步长 2：b(1)、d(3)、f(5) → `"bdf"`。' },
    { id: 'pyq6', ch: 'py2', lesson: 'py2l4', point: '字典计数', type: 'code', diff: 2,
      scene: '你在做一份课程作业提交统计，需要知道每个学生交了几次。',
      prompt: '实现 `count_submit(records)`：records 是形如 `[("小明","第1次"),("小红","第1次"),("小明","第2次")]` 的列表，返回字典，键是姓名，值是提交次数。（返回值的键顺序不影响判题）',
      starter: 'def count_submit(records):\n    # 在这里写代码\n    pass\n\nprint(count_submit([("小明","第1次"),("小红","第1次"),("小明","第2次")]))',
      tests: [{ in: '', out: "{'小明': 2, '小红': 1}" }],
      solution: 'def count_submit(records):\n    result = {}\n    for name, _ in records:\n        result[name] = result.get(name, 0) + 1\n    return result\n\nprint(count_submit([("小明","第1次"),("小红","第1次"),("小明","第2次")]))',
      explain: '核心是 `d[k] = d.get(k, 0) + 1` 这一行：取不到就给 0，再加 1。这是 Python 里最高频的计数写法。' },

    { id: 'pyq7', ch: 'py3', lesson: 'py3l1', point: '条件顺序', type: 'choice', diff: 2,
      prompt: '下面代码对 score = 45 输出什么？',
      code: 'if score >= 60:\n    print("及格")\nelif score >= 90:\n    print("优秀")\nelse:\n    print("不及格")',
      opts: ['优秀', '及格', '不及格', '什么都不输出'],
      ans: 2,
      explain: '45 不满足前两个条件，走 else。另外要注意这里的顺序本身是错的：`>=90` 永远轮不到，因为 `>=60` 先命中。写 if 链要从最严格的条件开始。' },
    { id: 'pyq8', ch: 'py3', lesson: 'py3l2', point: 'range', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'print(list(range(3)))\nprint(list(range(5, 0, -2)))\nprint(sum(range(1, 5)))',
      answer: '[0, 1, 2]\n[5, 3, 1]\n10',
      explain: '`range(3)` → 0,1,2；`range(5,0,-2)` → 5,3,1（不含 0）；`sum(1..4)` = 10。' },
    { id: 'pyq9', ch: 'py3', lesson: 'py3l3', point: '循环控制', type: 'code', diff: 2,
      scene: '统计一个班里第一个不及格的分数出现的位置（从 1 开始数），找不到就返回 -1。',
      prompt: '实现 `first_fail(scores)`：返回第一个小于 60 的分数的位置（从 1 开始），没有则返回 -1。',
      starter: 'def first_fail(scores):\n    # 在这里写代码\n    pass\n\nprint(first_fail([88, 92, 55, 40]))\nprint(first_fail([70, 80]))',
      tests: [
        { in: '', out: '3\n-1' }
      ],
      solution: 'def first_fail(scores):\n    for i, s in enumerate(scores, start=1):\n        if s < 60:\n            return i\n    return -1\n\nprint(first_fail([88, 92, 55, 40]))\nprint(first_fail([70, 80]))',
      explain: '用 `enumerate(scores, start=1)` 同时拿到位置和值，找到就 `return`；循环走完还没返回，说明都不及格以外，返回 -1。注意这里不能用 break，因为要带出位置。' },

    { id: 'pyq10', ch: 'py4', lesson: 'py4l1', point: '默认参数', type: 'choice', diff: 3,
      prompt: '两次调用 `f()` 分别返回什么？',
      code: 'def f(x, box=[]):\n    box.append(x)\n    return box\n\nprint(f(1))\nprint(f(2))',
      opts: ['[1] 然后 [2]', '[1] 然后 [1, 2]', '[1, 2] 然后 [1, 2]', '报错'],
      ans: 1,
      explain: '默认参数 `[]` 在**函数定义时**只创建一次，之后所有调用共享同一个列表。所以第二次调用时 box 里已经有 1 了。正确写法是 `box=None` 再在函数体内初始化。' },
    { id: 'pyq11', ch: 'py4', lesson: 'py4l2', point: '作用域', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'x = 10\n\ndef f():\n    x = 20\n    return x\n\nprint(f(), x)',
      answer: '20 10',
      explain: '函数里 `x = 20` 创建的是**局部变量**，不影响全局的 x。要在函数里改全局变量必须写 `global x`。' },
    { id: 'pyq12', ch: 'py4', lesson: 'py4l2', point: '排序 key', type: 'code', diff: 2,
      scene: '一份商品列表需要按价格从高到低展示。',
      prompt: '实现 `top_prices(items, n)`：items 是 `[(名称, 价格), ...]`，返回价格最高的 n 项（保持降序），结果形如 `[\'A\', \'B\']`。',
      starter: 'def top_prices(items, n):\n    # 在这里写代码\n    pass\n\nprint(top_prices([("笔", 3), ("书", 25), ("包", 88)], 2))',
      tests: [{ in: '', out: "['包', '书']" }],
      solution: 'def top_prices(items, n):\n    ordered = sorted(items, key=lambda x: x[1], reverse=True)\n    return [name for name, _ in ordered[:n]]\n\nprint(top_prices([("笔", 3), ("书", 25), ("包", 88)], 2))',
      explain: '`key=lambda x: x[1]` 指定按元组第 2 个元素（价格）排序，`reverse=True` 降序，再用列表推导式取出名字。' },

    { id: 'pyq13', ch: 'py5', lesson: 'py5l1', point: '异常粒度', type: 'choice', diff: 2,
      prompt: '下面哪种写法最不推荐？',
      opts: ['except ValueError as e: print(e)', 'except (ValueError, TypeError): pass', 'except:', 'except Exception as e: print(type(e).__name__, e)'],
      ans: 2,
      explain: '裸 `except:` 会连 Ctrl+C（KeyboardInterrupt）和系统退出都吞掉，还会掩盖真正的 bug。至少要捕获 `Exception` 并把信息打出来。' },
    { id: 'pyq14', ch: 'py5', lesson: 'py5l2', point: '文件模式', type: 'choice', diff: 1,
      prompt: '用 `open("log.txt", "w")` 打开一个已有内容的文件，会发生什么？',
      opts: ['在原内容后面追加', '原内容被清空，从头写', '报错，文件已存在', '以只读方式打开'],
      ans: 1,
      explain: '`"w"` 会**先清空**再写。想保留原内容用 `"a"`（追加）；想确保不覆盖已有文件用 `"x"`。' },
    { id: 'pyq15', ch: 'py5', lesson: 'py5l2', point: 'json', type: 'output', diff: 2,
      prompt: '下面代码打印什么？',
      code: 'import json\nd = {"a": 1, "b": [1, 2]}\ns = json.dumps(d, ensure_ascii=False)\nprint(type(s).__name__)\nprint(json.loads(s)["b"][1])',
      answer: 'str\n2',
      explain: '`json.dumps` 返回**字符串**（dumps 的 s = string），`json.loads` 把字符串解析回 Python 对象。如果是操作文件对象，用不带 s 的 `dump` / `load`。' },

    { id: 'pyq16', ch: 'py6', lesson: 'py6l1', point: 'self', type: 'choice', diff: 2,
      prompt: '`acc.deposit(50)` 在内部等价于下面哪个调用？',
      opts: ['BankAccount.deposit(50)', 'BankAccount.deposit(acc, 50)', 'deposit(acc, 50)', 'BankAccount.deposit(self, acc, 50)'],
      ans: 1,
      explain: 'Python 通过实例调用方法时，会自动把实例作为第一个参数传进去，所以方法定义里要写 `self`。这就是 `self` 的全部秘密。' },
    { id: 'pyq17', ch: 'py6', lesson: 'py6l2', point: '多态', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class A:\n    def hi(self):\n        return "A"\n\nclass B(A):\n    def hi(self):\n        return "B" + super().hi()\n\nprint(B().hi())',
      answer: 'BA',
      explain: '`B().hi()` 调用子类实现，`super().hi()` 再调父类拿到 `"A"`，拼起来就是 `"BA"`。' },
    { id: 'pyq18', ch: 'py6', lesson: 'py6l2', point: '小项目', type: 'code', diff: 3,
      scene: '给班级做一个成绩单汇总，需要算平均分和最高分。',
      prompt: '实现 `report(scores)`：输入一个整数列表，返回字符串 `"人数=3 平均=73.3 最高=88"`（平均保留 1 位小数）。空列表返回 `"无数据"`。',
      starter: 'def report(scores):\n    # 在这里写代码\n    pass\n\nprint(report([88, 42, 90]))',
      tests: [
        { in: '', out: '人数=3 平均=73.3 最高=90' }
      ],
      solution: 'def report(scores):\n    if not scores:\n        return "无数据"\n    avg = sum(scores) / len(scores)\n    return f"人数={len(scores)} 平均={avg:.1f} 最高={max(scores)}"\n\nprint(report([88, 42, 90]))',
      explain: '先处理空列表这个边界，再用 f-string 的格式说明符 `:.1f` 控制小数位。`len` / `sum` / `max` 三个内置函数一次到位。' }
  ],

  /* ==================== 每日打卡题库（与上面完全独立） ==================== */
  checkin: [
    { id: 'pyk1', ch: 'py1', point: '输出分隔', type: 'choice', diff: 1,
      prompt: '想在一行里输出「2026 11 11」三个数字，中间用短横线连接，下面哪种写法能实现？',
      opts: ['print(2026, 11, 11, sep="-")', 'print(2026, 11, 11, end="-")', 'print("2026-11-11", sep="-")', 'print(2026-11-11)'],
      ans: 0,
      explain: '`sep` 控制多个值之间的分隔符；`end` 控制这一行结束符（默认换行）。`print(2026-11-11)` 会先做减法输出 2004。' },
    { id: 'pyk2', ch: 'py1', point: '变量命名', type: 'choice', diff: 1,
      prompt: '下面哪个变量名在 Python 里是**不合法**的？',
      opts: ['user_name', '_temp', '2nd_score', 'totalPrice'],
      ans: 2,
      explain: '标识符不能以数字开头。`2nd_score` 非法；`user_name`、`_temp`、`totalPrice` 都合法（驼峰能用，但 Python 习惯蛇形命名）。' },
    { id: 'pyk3', ch: 'py1', point: '类型转换', type: 'output', diff: 1,
      prompt: '写出这行的输出。',
      code: 'print("年龄：" + str(19))\nprint(int("19") + 1)',
      answer: '年龄：19\n20',
      explain: '字符串和数字不能直接 `+`，必须先用 `str()` 转换；反过来 `int("19")` 把字符串转成数字才能做算术。' },

    { id: 'pyk4', ch: 'py2', point: '布尔判断', type: 'choice', diff: 2,
      prompt: '`name = ""` 时，`if name:` 会进入哪个分支？',
      opts: ['if 分支（空字符串为真）', 'else 分支（空字符串为假）', '报错', '两个都执行'],
      ans: 1,
      explain: '空字符串是假值，`if name:` 相当于 `if len(name) > 0:`。这正是「用户没填名字」的常用判断方式。' },
    { id: 'pyk5', ch: 'py2', point: '切片', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 's = "2026-11-11"\nprint(s[:4])\nprint(s[-2:])\nprint(len(s.split("-")))',
      answer: '2026\n11\n3',
      explain: '`[:4]` 取前四个字符；`[-2:]` 取最后两个；`split("-")` 切成 `["2026","11","11"]` 三个部分。' },
    { id: 'pyk6', ch: 'py2', point: '去重', type: 'code', diff: 2,
      scene: '一次活动报名里有人重复提交，需要统计实际报名人数。',
      prompt: '实现 `unique_count(names)`：返回去重后的人数（整数）。',
      starter: 'def unique_count(names):\n    # 在这里写代码\n    pass\n\nprint(unique_count(["小明", "小红", "小明", "小刚"]))',
      tests: [{ in: '', out: '3' }],
      solution: 'def unique_count(names):\n    return len(set(names))\n\nprint(unique_count(["小明", "小红", "小明", "小刚"]))',
      explain: '`set()` 天然去重，再 `len()` 就是人数。这比手动遍历判断存在要快得多（O(n) 而不是 O(n²)）。' },

    { id: 'pyk7', ch: 'py3', point: '循环次数', type: 'choice', diff: 1,
      prompt: '`for i in range(1, 10, 3)` 会循环几次？',
      opts: ['3 次', '4 次', '9 次', '10 次'],
      ans: 0,
      explain: '取值是 1、4、7（下一次 10 已超出范围，因为终点不含），共 3 次。' },
    { id: 'pyk8', ch: 'py3', point: '累加', type: 'code', diff: 2,
      scene: '统计一份打卡记录里一共有多少天完成了任务。',
      prompt: '实现 `total_days(flags)`：flags 是只含 0/1 的列表（1 表示当天完成），返回完成的次数。',
      starter: 'def total_days(flags):\n    # 在这里写代码\n    pass\n\nprint(total_days([1, 0, 1, 1, 0]))',
      tests: [{ in: '', out: '3' }],
      solution: 'def total_days(flags):\n    total = 0\n    for f in flags:\n        if f == 1:\n            total += 1\n    return total\n\nprint(total_days([1, 0, 1, 1, 0]))',
      explain: '也可以一行写完：`sum(1 for f in flags if f == 1)`，甚至直接 `sum(flags)`。遍历 + 条件累加是最基础的循环模式。' },
    { id: 'pyk9', ch: 'py3', point: '循环控制', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'for i in range(5):\n    if i == 1:\n        continue\n    if i == 4:\n        break\n    print(i, end=" ")',
      answer: '0 2 3',
      explain: '`continue` 跳过 i=1；`break` 在 i=4 时直接结束循环，所以只打印 0、2、3。' },

    { id: 'pyk10', ch: 'py4', point: '返回值', type: 'choice', diff: 1,
      prompt: '一个函数体内没有任何 `return` 语句，调用它会得到什么？',
      opts: ['0', '空字符串', 'None', '报错'],
      ans: 2,
      explain: 'Python 函数没写 return 时默认返回 None。这也是「调用完发现结果是 None」最常见的原因。' },
    { id: 'pyk11', ch: 'py4', point: '参数传递', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'def greet(name, prefix="你好"):\n    return prefix + "，" + name\n\nprint(greet("小明"))\nprint(greet("小红", prefix="早上好"))',
      answer: '你好，小明\n早上好，小红',
      explain: '第二个参数有默认值，省略就用默认；用 `prefix=` 传关键字参数可以跳过位置限制，可读性更好。' },
    { id: 'pyk12', ch: 'py4', point: '函数设计', type: 'code', diff: 2,
      scene: '把一段重复出现的「打折计算」抽成函数，方便以后统一改规则。',
      prompt: '实现 `discount(price, rate)`：rate 是折扣率（0.8 表示八折），返回四舍五入到 2 位小数的价格。',
      starter: 'def discount(price, rate):\n    # 在这里写代码\n    pass\n\nprint(discount(199, 0.8))',
      tests: [{ in: '', out: '159.2' }],
      solution: 'def discount(price, rate):\n    return round(price * rate, 2)\n\nprint(discount(199, 0.8))',
      explain: '`round(x, 2)` 保留两位小数。注意它返回 float，打印 159.2 而不是 159.20，格式化展示要用 `f"{x:.2f}"`。' },

    { id: 'pyk13', ch: 'py5', point: '异常类型', type: 'choice', diff: 2,
      prompt: '`int("abc")` 会抛出哪种异常？',
      opts: ['TypeError', 'ValueError', 'SyntaxError', 'KeyError'],
      ans: 1,
      explain: '类型是对的（str 是合法输入类型），但值不合法，所以是 ValueError。`int([1])` 才是 TypeError。' },
    { id: 'pyk14', ch: 'py5', point: '文件读写', type: 'code', diff: 2,
      scene: '把一组分数写进文件再读出来校验，是很多作业的基本流程。',
      prompt: '实现 `save_and_count(path, lines)`：把 lines 中每一项写成一行（用换行符分隔）写入 path（utf-8），返回写入的行数。',
      starter: 'def save_and_count(path, lines):\n    # 在这里写代码\n    pass\n\nprint(save_and_count("tmp_demo.txt", ["a", "b", "c"]))',
      tests: [{ in: '', out: '3' }],
      solution: 'def save_and_count(path, lines):\n    with open(path, "w", encoding="utf-8") as f:\n        for line in lines:\n            f.write(str(line) + "\\n")\n    return len(lines)\n\nprint(save_and_count("tmp_demo.txt", ["a", "b", "c"]))',
      explain: '用 `with` 保证文件关闭；每条记录手动补 `\\n`。也可以 `f.write("\\n".join(map(str, lines)))`。' },

    { id: 'pyk15', ch: 'py6', point: '构造函数', type: 'choice', diff: 2,
      prompt: '创建对象 `Dog("旺财")` 时，哪个方法会被自动调用？',
      opts: ['__str__', '__init__', '__call__', '__new__ 之后的 __del__'],
      ans: 1,
      explain: '实例化时自动执行 `__init__` 完成初始化。`__new__` 也会参与（负责创建对象），但日常写的都是 `__init__`。' },
    { id: 'pyk16', ch: 'py6', point: '属性访问', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class P:\n    def __init__(self, x):\n        self.x = x\n    def double(self):\n        return self.x * 2\n\np = P(7)\nprint(p.x, p.double())',
      answer: '7 14',
      explain: '`self.x` 在 `__init__` 里被赋值为 7；`double()` 通过 `self.x` 读到 7 并乘 2。方法内部访问属性必须带 `self.`。' },
    { id: 'pyk17', ch: 'py1', point: '注释', type: 'choice', diff: 1,
      prompt: 'Python 里单行注释用什么符号？',
      opts: ['//', '#', '--', '/* */'],
      ans: 1,
      explain: 'Python 用 `#`。`//` 是整除运算符，`/* */` 是 C 系语言的块注释。' },
    { id: 'pyk18', ch: 'py2', point: '字典取值', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'd = {"a": 1}\nprint(d.get("b", 0))\nprint(len(d))',
      answer: '0\n1',
      explain: '`get` 取不到时返回给定的默认值 0，且不会修改字典，所以长度仍是 1。' }
  ]
};
