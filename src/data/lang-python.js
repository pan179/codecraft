/* ============================================================
   CodeCraft 数据 · Python（10 章 40 课）
   ============================================================ */
window.LANGS = window.LANGS || {};

window.LANGS.python = {
  id: 'python', name: 'Python', en: 'Python 3', icon: '🐍', color: '#3776ab',
  blurb: '语法最轻、生态最广的一门语言。数据分析、AI、爬虫、后端脚本，都能用它先跑起来。',
  hello: 'print("Hello, Python!")',
  lab: [
    { name: 'Hello World', code: 'print("Hello, Python!")\nprint("今天开始学编程")' },
    { name: '读输入求和', code: 'a, b = map(int, "3 5".split())\nprint("和 =", a + b)' },
    { name: '列表推导式', code: 'nums = [1, 2, 3, 4, 5, 6]\neven = [n * n for n in nums if n % 2 == 0]\nprint(even)' },
    { name: '字典计数', code: 'words = "the cat the dog the bird".split()\ncount = {}\nfor w in words:\n    count[w] = count.get(w, 0) + 1\nprint(count)' }
  ],
  chapters: [
    {
      id: 'py1', num: 1, title: '起步与工具', icon: '🚀',
      intro: '这一章只解决三件事：程序到底是什么、Python 怎么把代码跑起来、变量和值之间是什么关系。别急着背语法，先把「程序是按顺序执行的指令」和「变量是贴在对象上的标签」这两个模型立住，后面会省很多力气。最后把开发环境一次配好，之后不用再折腾。',
      goals: ['说清解释器到底做了什么', '用引用模型解释赋值', '独立配好 pip 与虚拟环境'],
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
            { t: 'h', x: '浅拷贝与深拷贝' },
            { t: 'p', x: '`a.copy()` 和 `a[:]` 都是**浅拷贝**：只复制了最外层容器，里面装的东西还是同一批对象。嵌套列表要彻底切开，得用 `copy.deepcopy`。' },
            { t: 'code', x: 'import copy\n\ninner = [1, 2]\nouter = [inner, 3]\n\nshallow = outer.copy()\nshallow[0].append(99)      # 改的是共用的那个 inner\nprint("浅拷贝后 outer：", outer)\n\ndeep = copy.deepcopy(outer)\ndeep[0].append(7)          # 深拷贝里改，不影响外层\nprint("深拷贝后 outer：", outer)', out: '浅拷贝后 outer： [[1, 2, 99], 3]\n深拷贝后 outer： [[1, 2, 99], 3]' },
            { t: 'warn', x: '新手最常踩的坑：`grid = [[0] * 3] * 3` 想建 3×3 棋盘，结果三行是**同一个列表**，改一行全变。正确写法是列表推导式。' },
            { t: 'code', x: 'bad = [[0] * 3] * 3\nbad[0][0] = 1\nprint("错的：", bad)\n\ngood = [[0] * 3 for _ in range(3)]\ngood[0][0] = 1\nprint("对的：", good)', out: '错的： [[1, 0, 0], [1, 0, 0], [1, 0, 0]]\n对的： [[1, 0, 0], [0, 0, 0], [0, 0, 0]]' },
            { t: 'principle', x: '**记住一句话：赋值不复制。** 想复制就明确地写 `.copy()`、`list(x)`、`x[:]` 或 `deepcopy`；不想复制就别抱怨它跟着变。' }
          ]
        },
        {
          id: 'py1l3', title: '开发环境：REPL、脚本、pip 与虚拟环境', key: 'venv · pip', time: 12,
          blocks: [
            { t: 'p', x: '很多人学完语法还是不敢开工，卡在环境上。这一节把「怎么组织代码、怎么装包、怎么隔离环境」一次说清，这三件事做完，你的机器就算配置好了。' },
            { t: 'h', x: '三种运行方式，各有用途' },
            { t: 'table', head: ['方式', '怎么用', '适合'], rows: [
              ['REPL 交互', '命令行敲 `python` 进入，逐行输入', '试语法、算数、验证某个函数行为'],
              ['运行脚本', '`python main.py`', '正式写程序（99% 的时间）'],
              ['一次执行', '`python -c "print(1+1)"`', '在 shell 脚本里顺手算个东西']
            ] },
            { t: 'note', x: 'REPL 里 `_` 表示上一次的结果，`exit()` 或 Ctrl+Z 回车退出。不确定某个函数怎么用就先进 REPL 试一下，比写文件快得多。' },
            { t: 'h', x: 'pip：装第三方包' },
            { t: 'code', x: 'import sys\n\nprint("Python 主版本：", sys.version_info[0])\nprint("64 位环境：", sys.maxsize > 2 ** 32)\nprint("实现：", sys.implementation.name)', out: 'Python 主版本： 3\n64 位环境： True\n实现： cpython' },
            { t: 'code', x: '# 下面这些在终端执行，不是 Python 代码\n# pip install requests            装包\n# pip install requests==2.31.0   装指定版本（生产环境必须锁版本）\n# pip list                        看装了什么\n# pip freeze > requirements.txt   导出依赖清单\n# pip install -r requirements.txt 按清单还原环境\nprint("锁版本很重要：半年后 2.20 和 2.31 的行为可能不一样")', out: '锁版本很重要：半年后 2.20 和 2.31 的行为可能不一样' },
            { t: 'h', x: '虚拟环境：为什么必须用' },
            { t: 'p', x: '如果把所有包都装进全局环境，A 项目要 `requests 2.20`、B 项目要 `requests 2.31`，两个项目立刻打架，而且半年后你根本记不清哪个包是哪个项目装的。**虚拟环境**就是给每个项目建一个独立的包目录。' },
            { t: 'code', x: 'steps = ["python -m venv .venv", "激活虚拟环境", "pip install -r requirements.txt"]\nfor i, s in enumerate(steps, 1):\n    print(i, s)', out: '1 python -m venv .venv\n2 激活虚拟环境\n3 pip install -r requirements.txt' },
            { t: 'table', head: ['平台', '创建', '激活'], rows: [
              ['Windows', 'python -m venv .venv', '.venv\\Scripts\\activate'],
              ['macOS / Linux', 'python3 -m venv .venv', 'source .venv/bin/activate'],
              ['退出', '—', 'deactivate']
            ] },
            { t: 'tip', x: '虚拟环境目录（`.venv`）**千万别提交进 Git**，在 `.gitignore` 里加一行 `.venv/`。要提交的是 `requirements.txt`。' },
            { t: 'h', x: '标准项目目录' },
            { t: 'code', x: 'files = ["src/main.py", "tests/test_main.py", "requirements.txt"]\nprint("项目文件数：", len(files))\nprint("入口：", files[0])\nprint("依赖清单：", files[-1])', out: '项目文件数： 3\n入口： src/main.py\n依赖清单： requirements.txt' },
            { t: 'warn', x: '命令行里激活虚拟环境后，提示符前面会出现 `(.venv)`。**没看到这个前缀就说明没激活**，此时 `pip install` 装到的是全局环境，装完在当前项目里还是 import 不到。' },
            { t: 'principle', x: '**一个项目一个虚拟环境。** 这条规矩没有例外，违反它省下的三分钟，将来要用三小时来还。' }
          ]
        }
      ]
    },
    {
      id: 'py2', num: 2, title: '语法基础', icon: '📦',
      intro: '这一章把 Python 的「最小零件」全部过一遍：类型、字符串、运算符、输入输出。看起来基础，但后面所有报错追根溯源几乎都落在这一章。特别是类型转换和字符串格式化，值得多花点时间。',
      goals: ['准确判断一个字面量是什么类型', '熟练做字符串切分、切片与格式化', '知道每个运算符的优先级与副作用'],
      lessons: [
        {
          id: 'py2l1', title: '类型系统与转换陷阱', key: 'int/float/str/bool/None', time: 12,
          blocks: [
            { t: 'p', x: 'Python 是动态类型语言：**变量没有类型，值才有类型**。`type(x)` 看类型，`isinstance(x, int)` 做判断（后者更稳妥，因为它能把子类也认进去）。' },
            { t: 'table', head: ['类型', '字面量', '可变', '典型用途'], rows: [
              ['int', '42, -7, 0b1010', '否', '计数、索引、金额（分）'],
              ['float', '3.14, 1e-3', '否', '测量值、比例'],
              ['str', '"abc"', '否', '文本、路径、日志'],
              ['bool', 'True / False', '否', '条件、开关'],
              ['NoneType', 'None', '否', '表示"还没有值"']
            ] },
            { t: 'code', x: 'print(type(3), type(3.0), type("3"), type(True))\nprint(1 == True, 0 == False)      # bool 是 int 的子类\nprint(isinstance(True, int))\n\nx = None\nprint(x is None)                  # 判空用 is None\nprint(len("中文"), len("abc"))     # len 数字符，不是字节', out: "<class 'int'> <class 'float'> <class 'str'> <class 'bool'>\nTrue True\nTrue\nTrue\n2 3" },
            { t: 'h', x: '四个转换坑' },
            { t: 'ul', x: [
              '`int("3.5")` 直接报错 → 要 `int(float("3.5"))`',
              '`int(-3.9)` 得 `-3`（向零截断），负数方向别搞反',
              '浮点比较别用 `==`：`0.1 + 0.2 == 0.3` 是 False',
              '`str(1e20)` 会变成科学计数法，展示金额要格式化'
            ] },
            { t: 'code', x: 'print(int(3.99))\nprint(int(-3.99))\nprint(round(3.99))\nprint(round(2.5))                       # 四舍六入五取偶，得 2\nprint(abs(0.1 + 0.2 - 0.3) < 1e-9)      # 浮点比较的正确姿势', out: '3\n-3\n4\n2\nTrue' },
            { t: 'h', x: '需要精确计算时' },
            { t: 'code', x: 'from decimal import Decimal\n\nprint(0.1 + 0.2)\nprint(Decimal("0.1") + Decimal("0.2"))\nprint(f"{0.1 + 0.2:.2f}")', out: '0.30000000000000004\n0.3\n0.30' },
            { t: 'warn', x: '涉及**金额**千万别用 float 累加。要么用 `Decimal`，要么统一换算成「分」用整数算，最后再除以 100 显示。' },
            { t: 'principle', x: '**None 表示"没有值"，不是 0 也不是空串。** 函数没写 `return` 时返回的就是 None。判断只有一种正确写法：`if x is None`。' }
          ]
        },
        {
          id: 'py2l2', title: '字符串：切片与常用方法', key: '切片 · split/join', time: 12,
          blocks: [
            { t: 'p', x: '字符串是**不可变序列**：所有「修改」方法其实都返回新字符串，原串不动。这一点决定了你必须写 `s = s.strip()`，而不是只写 `s.strip()`。' },
            { t: 'h', x: '索引与切片：左闭右开' },
            { t: 'code', x: 's = "CodeCraft"\nprint(s[0], s[-1])       # 正数从左，负数从右\nprint(s[0:4])            # Code  —— 含 0 不含 4\nprint(s[4:])             # Craft\nprint(s[:4])             # Code\nprint(s[::2])            # 步长 2\nprint(s[::-1])           # 反转\nprint(len(s), "Cra" in s)', out: 'C t\nCode\nCraft\nCode\nCdCat\ntfarCedoC\n9 True' },
            { t: 'note', x: '切片永远不报越界错误：`s[100:]` 只是得到空串。正因如此，切片常被用来做安全截断：`s[:20]` 无论 s 多长都不会炸。' },
            { t: 'h', x: '最常用的九个方法' },
            { t: 'code', x: 's = "  Hello, World  "\nprint(repr(s.strip()))\nprint(s.strip().lower())\nprint(s.strip().upper())\nprint("a,b,,c".split(","))\nprint("-".join(["2026", "11", "11"]))\nprint("abc".startswith("ab"), "abc".endswith("c"))\nprint("abcabc".replace("a", "X"))\nprint("abc".find("c"), "abc".count("a"))\nprint("42".isdigit(), "abc".isalpha())', out: "'Hello, World'\nhello, world\nHELLO, WORLD\n['a', 'b', '', 'c']\n2026-11-11\nTrue True\nXbcXbc\n2 1\nTrue True" },
            { t: 'table', head: ['方法', '作用', '易错点'], rows: [
              ['strip()', '去两端空白', '只去两端，中间不动'],
              ['split()', '按分隔符切', '不带参数时按任意空白切，并自动合并连续空白'],
              ['join()', '把可迭代对象拼成串', '要求元素全是字符串'],
              ['find()', '找不到返回 -1', 'index() 找不到会抛异常，别混用'],
              ['replace()', '全部替换', '只换第一个要传 count=1']
            ] },
            { t: 'code', x: '# 数字列表拼接的坑与三种解法\nnums = [1, 2, 3]\nprint(",".join(map(str, nums)))\nprint(",".join(str(n) for n in nums))\nprint(f"{nums}")', out: '1,2,3\n1,2,3\n[1, 2, 3]' },
            { t: 'h', x: 'partition：拆成两半的专用工具' },
            { t: 'code', x: 'line = "  姓名: 小明  "\nkey, sep, value = line.strip().partition(":")\nprint(repr(key))\nprint(repr(value.strip()))\nprint(repr(sep))', out: "'姓名'\n'小明'\n':'" },
            { t: 'tip', x: '`partition()` 比 `split()` 更适合「拆成两半」：它**一定**返回三个元素，找不到分隔符时后两段是空串，不会像 `split` 那样因为长度不定而解包报错。' },
            { t: 'warn', x: '中文的 `len` 数是**字符数**不是字节数。要算字节得 `len(s.encode("utf-8"))`，一个汉字在 UTF-8 里占 3 字节。' }
          ]
        },
        {
          id: 'py2l3', title: '字符串格式化：f-string 全套', key: 'f-string', time: 10,
          blocks: [
            { t: 'p', x: '能把结果按想要的样式显示出来，是「能写程序」和「能交付」之间的差距。f-string 是 Python 3.6 之后的标准做法，值得完整学一遍。' },
            { t: 'code', x: 'name, score, rate = "小明", 92.5678, 0.9234\n\nprint(f"{name} 考了 {score:.1f} 分")\nprint(f"{score:>10.2f}|")\nprint(f"{score:<10.2f}|")\nprint(f"{score:^10.2f}|")\nprint(f"{rate:.1%}")\nprint(f"{1234567:,}")\nprint(f"{42:05d}")', out: '小明 考了 92.6 分\n     92.57|\n92.57     |\n  92.57   |\n92.3%\n1,234,567\n00042' },
            { t: 'table', head: ['格式符', '含义', '例子'], rows: [
              ['.2f', '保留 2 位小数', '3.14159 → 3.14'],
              ['.1%', '转百分比', '0.5 → 50.0%'],
              [',', '千分位', '1234567 → 1,234,567'],
              ['>10', '右对齐宽 10', '空格补在左'],
              ['05d', '补零宽度 5', '42 → 00042'],
              ['b / o / x', '二/八/十六进制', '10 → 1010 / 12 / a']
            ] },
            { t: 'h', x: 'f-string 里可以放表达式' },
            { t: 'code', x: 'price, qty = 19.9, 3\nprint(f"总价 {price * qty:.2f} 元")\nprint(f"是否打折：{qty >= 3}")\n\nuser = {"name": "阿伟", "age": 21}\nwho, how_old = user["name"], user["age"]\nprint(f"{who} 今年 {how_old} 岁")', out: '总价 59.70 元\n是否打折：True\n阿伟 今年 21 岁' },
            { t: 'h', x: '调试神器：= 号' },
            { t: 'code', x: 'x = 17\nprice, qty = 19.9, 3\nprint(f"{x = }")\nprint(f"{price * qty = :.2f}")', out: 'x = 17\nprice * qty = 59.70' },
            { t: 'note', x: '`f"{x = }"` 是 3.8 之后的新特性，既打印变量名又打印值，调试时不用再手写 `print("x:", x)`。' },
            { t: 'h', x: '四种写法的演进' },
            { t: 'code', x: 'n = "小明"\nprint("拼接：" + n + " 你好")\nprint("format：{} 你好".format(n))\nprint("百分号：%s 你好" % n)\nprint(f"f-string：{n} 你好")', out: '拼接：小明 你好\nformat：小明 你好\n百分号：小明 你好\nf-string：小明 你好' },
            { t: 'warn', x: 'f-string 的 `{}` 里**不要写反斜杠**（3.12 之前会直接报错），也不要在里面塞复杂的嵌套引号。遇到复杂表达式，先在外面算好再放进去。' }
          ]
        },
        {
          id: 'py2l4', title: '运算符与优先级', key: '// · ** · 短路', time: 12,
          blocks: [
            { t: 'p', x: 'Python 的运算符不多，但有几个和 C、Java 不一样的地方，混着学最容易出错：整除 `//`、幂 `**`、链式比较，以及 `and/or` 返回的是**操作数本身**而不是 True/False。' },
            { t: 'code', x: 'print(7 / 2)      # 真除法，结果一定是 float\nprint(7 // 2)     # 整除，向下取整\nprint(-7 // 2)    # -4，注意是向下不是向零\nprint(7 % 3, -7 % 3)   # 取余：符号跟着除数走\nprint(2 ** 10)\nprint(2 ** 0.5)', out: '3.5\n3\n-4\n1 2\n1024\n1.4142135623730951' },
            { t: 'h', x: '链式比较：数学写法可以直接用' },
            { t: 'code', x: 'age = 20\nprint(18 <= age < 60)\nprint(1 < 2 < 3 < 4)\nprint(1 < 3 > 2)      # 中间那个只求值一次', out: 'True\nTrue\nTrue' },
            { t: 'h', x: 'and / or 的返回值' },
            { t: 'p', x: '`a and b`：a 为假就返回 a，否则返回 b。`a or b`：a 为真就返回 a，否则返回 b。所以它们可以被当成**默认值语法**用。' },
            { t: 'code', x: 'print(0 or "默认值")        # 0 是假的，返回右边\nprint("配置" or "默认值")     # 左边为真，直接返回它\nprint(None and "x")         # 左边为假，短路，返回 None\n\nname = ""\ndisplay = name or "匿名用户"\nprint(display)', out: '默认值\n配置\nNone\n匿名用户' },
            { t: 'table', head: ['运算符', '说明', '优先级（数字越小越高）'], rows: [
              ['**', '幂', '1'],
              ['* / // %', '乘、除、整除、取余', '2'],
              ['+ -', '加减', '3'],
              ['< <= > >= == !=', '比较（可链式）', '4'],
              ['not', '非', '5'],
              ['and', '与（短路）', '6'],
              ['or', '或（短路）', '7']
            ] },
            { t: 'code', x: 'print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(not 0 and 1)     # (not 0) and 1 → True and 1 → 1（返回操作数本身）\nprint(1 + 1 == 2)', out: '14\n20\n1\nTrue' },
            { t: 'h', x: '位运算与海象运算符' },
            { t: 'code', x: 'print(5 & 3, 5 | 3, 5 ^ 3, ~5)   # 与 或 异或 取反\nprint(1 << 4, 256 >> 4)           # 左移右移\nprint(5 & 1)                      # 判奇偶：0 偶 1 奇\n\ntext = "abcdef"\nif (n := len(text)) > 3:\n    print("长度是", n)', out: '1 7 6 -6\n16 16\n1\n长度是 6' },
            { t: 'warn', x: '`&` 和 `and` 完全不是一回事：`5 & 3` 是位与得 1，`5 and 3` 逻辑与得 3。判奇偶用 `& 1` 更快，可读性不如 `% 2`，业务代码里建议后者。' }
          ]
        },
        {
          id: 'py2l5', title: '输入输出与终端交互', key: 'input · print 细节', time: 10,
          blocks: [
            { t: 'p', x: '`input()` 的返回值**永远是字符串**，这是新手第一大类 bug 的来源。所有要参与计算的输入，都必须先转换。' },
            { t: 'code', x: 'age_text = "18"          # 真实环境写 age_text = input("请输入年龄：")\nage = int(age_text)\nprint("明年你", age + 1, "岁")\nprint(type(age_text), type(age))', out: "明年你 19 岁\n<class 'str'> <class 'int'>" },
            { t: 'h', x: '一次读入多个值' },
            { t: 'code', x: 'line = "3 5"\na, b = map(int, line.split())\nprint(a + b, a * b)\n\nnums = list(map(int, "1 2 3 4 5".split()))\nprint(nums, sum(nums), max(nums))', out: '8 15\n[1, 2, 3, 4, 5] 15 5' },
            { t: 'table', head: ['写法', '适用', '说明'], rows: [
              ['int(input())', '单个整数', '最常用'],
              ['float(input())', '单个小数', '金额、测量值'],
              ['map(int, input().split())', '一行多个整数', '解包给多个变量'],
              ['list(map(int, ...))', '一行变列表', '不定长度时用'],
              ['input().strip()', '读一行文本', '去掉多余空白和换行']
            ] },
            { t: 'h', x: 'print 的三个参数' },
            { t: 'code', x: 'print("a", "b", "c")\nprint("a", "b", "c", sep="-")\nprint("a", "b", "c", sep="", end="!\\n")\n\nfor i in range(3):\n    print(i, end=" ")\nprint()\nprint("完成")', out: 'a b c\na-b-c\nabc!\n0 1 2 \n完成' },
            { t: 'h', x: '逐行读取的通用骨架' },
            { t: 'code', x: 'lines = ["第一行", "第二行"]      # 真实环境用 for line in sys.stdin:\nfor line in lines:\n    print("读入：", line.strip())', out: '读入： 第一行\n读入： 第二行' },
            { t: 'tip', x: '本站在线运行没有真实键盘输入，练习里的 `input()` 会读到空字符串。写练习时用**变量赋值**代替输入，语法与真实环境完全一样。' },
            { t: 'warn', x: '`input()` 读到的行末尾可能带 `\\n`（Windows 下还可能是 `\\r\\n`），做字符串比较前先 `.strip()`，否则 `input() == "yes"` 永远不成立。' }
          ]
        }
      ]
    },
    {
      id: 'py3', num: 3, title: '流程控制', icon: '🔀',
      intro: '程序之所以比计算器强，是因为它会「做选择」和「重复做」。这一章把 if、while、for 三件套彻底摸熟，最后用四个最经典的算法套路把它们串起来——这四个套路几乎能覆盖你未来八成的基础题。',
      goals: ['写出清晰的多分支判断', '知道 for 和 while 各自适合什么场景', '会用循环 else 子句解决「找得到吗」类问题'],
      lessons: [
        {
          id: 'py3l1', title: '条件判断：if / elif / else', key: '真值判断', time: 11,
          blocks: [
            { t: 'p', x: '`if` 后面的表达式会被自动转成布尔值，所以你不必写 `if x == True`，直接写 `if x` 就行。理解「什么值算假」比背语法更重要。' },
            { t: 'code', x: 'score = 85\nif score >= 90:\n    level = "A"\nelif score >= 80:\n    level = "B"\nelse:\n    level = "C"\nprint(level)', out: 'B' },
            { t: 'note', x: '`elif` 是 else if 的缩写，**从上往下匹配，命中一个就跳出**。所以顺序很重要：如果把 `>= 80` 写在 `>= 90` 前面，90 分也会被判成 B。' },
            { t: 'h', x: '哪些值算「假」' },
            { t: 'code', x: 'for v in [0, 1, "", "a", [], [0], None, False]:\n    print(repr(v), bool(v))', out: "0 False\n1 True\n'' False\n'a' True\n[] False\n[0] True\nNone False\nFalse False" },
            { t: 'table', head: ['假值', '说明'], rows: [
              ['0 / 0.0', '数字零'],
              ['""', '空字符串'],
              ['[] / () / {} / set()', '空容器'],
              ['None', '没有值'],
              ['False', '布尔假']
            ] },
            { t: 'warn', x: '`[0]` 和 `[]` 不一样：前者是「装了一个 0 的列表」，非空就是真。判断列表是否为空要写 `if not lst:`，不要写 `if lst == []`（能跑，但不 Pythonic）。' },
            { t: 'h', x: '三元表达式与嵌套' },
            { t: 'code', x: 'age = 20\nprint("成年" if age >= 18 else "未成年")\n\nscore = 85\nlabel = "优秀" if score >= 90 else ("及格" if score >= 60 else "不及格")\nprint(label)\n\nx = 15\nprint("是 3 的倍数" if x % 3 == 0 else "不是 3 的倍数")', out: '成年\n及格\n是 3 的倍数' },
            { t: 'tip', x: '三元表达式适合「简单的二选一赋值」。嵌套超过两层就该改回 if/elif，否则一周后你自己都读不懂。' },
            { t: 'principle', x: '**条件写的顺序 = 业务优先级。** 写之前先问自己「哪种情况最常见/最严重」，把它放最前面，代码会更短也更快。' }
          ]
        },
        {
          id: 'py3l2', title: '循环：while 与 for', key: 'range · enumerate', time: 14,
          blocks: [
            { t: 'p', x: '一句话区分：**次数不定用 while，次数确定用 for**。Python 的 for 不是计数器，而是「遍历一个可迭代对象」，这一点和 C 系语言完全不同。' },
            { t: 'h', x: 'while：条件为真就一直转' },
            { t: 'code', x: 'i = 1\ntotal = 0\nwhile i <= 100:\n    total += i\n    i += 1\nprint(total)', out: '5050' },
            { t: 'warn', x: '写 while 必须有三个要素：**初始值、条件、推进**。漏掉推进（比如忘了 `i += 1`）就是死循环，Ctrl+C 才能停。' },
            { t: 'h', x: 'for + range：最常用的组合' },
            { t: 'code', x: 'for i in range(5):\n    print(i, end=" ")\nprint()\nprint(list(range(2, 11, 3)))     # 起点, 终点(不含), 步长\nprint(list(range(5, 0, -1)))      # 倒着走', out: '0 1 2 3 4 \n[2, 5, 8]\n[5, 4, 3, 2, 1]' },
            { t: 'table', head: ['写法', '生成', '用途'], rows: [
              ['range(5)', '0,1,2,3,4', '重复 n 次'],
              ['range(1, 6)', '1,2,3,4,5', '从 1 数到 n'],
              ['range(0, 10, 2)', '0,2,4,6,8', '步长'],
              ['range(n-1, -1, -1)', 'n-1 … 0', '倒序遍历下标']
            ] },
            { t: 'h', x: '直接遍历容器，而不是下标' },
            { t: 'code', x: 'fruits = ["苹果", "香蕉"]\nfor f in fruits:\n    print(f)\n\n# 需要下标时用 enumerate，别写 range(len(...))\nfor i, f in enumerate(fruits, 1):\n    print(i, f)\n\n# 两个列表同时遍历用 zip\nfor a, b in zip([1, 2], ["x", "y"]):\n    print(a, b)', out: '苹果\n香蕉\n1 苹果\n2 香蕉\n1 x\n2 y' },
            { t: 'code', x: 'd = {"语文": 90, "数学": 95}\nfor k, v in d.items():\n    print(k, v)', out: '语文 90\n数学 95' },
            { t: 'tip', x: '`for i in range(len(lst))` 只在「需要同时访问 lst[i-1] 和 lst[i]」这种场景才用。其他情况一律 `for x in lst` 或 `for i, x in enumerate(lst)`。' },
            { t: 'principle', x: '**遍历元素，而不是遍历下标。** 这条习惯能让你少写一半 `lst[i]`，也就少了一半越界 bug。' }
          ]
        },
        {
          id: 'py3l3', title: '循环控制与 for-else', key: 'break/continue/else', time: 12,
          blocks: [
            { t: 'p', x: '`break` 跳出整个循环，`continue` 跳过本轮剩余部分。真正容易被忽略的是 **for-else**：else 在「循环正常跑完、没被 break 打断」时执行，专门用来表达「找遍了也没找到」。' },
            { t: 'code', x: 'for n in range(2, 8):\n    for d in range(2, n):\n        if n % d == 0:\n            break\n    else:\n        print(n, "是质数")', out: '2 是质数\n3 是质数\n5 是质数\n7 是质数' },
            { t: 'p', x: '上面这段是 for-else 最经典的用法：内层循环如果被 `break`（说明找到了因子），else 就不执行；如果一路跑完都没 break（说明没有因子），就判定为质数。' },
            { t: 'h', x: 'continue：跳过本轮' },
            { t: 'code', x: 'total = 0\nfor i in range(1, 100):\n    if i % 7 == 0:\n        continue\n    total += i\nprint(total)', out: '4215' },
            { t: 'table', head: ['语句', '作用', '常见用途'], rows: [
              ['break', '立刻结束本层循环', '找到了就停'],
              ['continue', '跳过本轮，进入下一轮', '过滤掉不需要的'],
              ['else（循环）', '没被 break 时执行', '「都没找到」的收尾'],
              ['return', '结束整个函数', '在函数里比 break 更彻底']
            ] },
            { t: 'h', x: '嵌套循环的 break 只跳一层' },
            { t: 'code', x: 'found = None\nfor i in range(3):\n    for j in range(3):\n        if i * j == 4:\n            found = (i, j)\n            break          # 只跳出 j 那层\n    if found:\n        break              # 还要再跳一次\nprint(found)', out: '(2, 2)' },
            { t: 'tip', x: '想一次跳出多层，比 `if found: break` 更干净的做法是把循环封装成函数，直接 `return`。' },
            { t: 'warn', x: '在 for 循环里**不要修改正在遍历的列表**（增删元素会导致跳过或重复）。需要边遍历边删，就遍历副本：`for x in lst[:]:`，或者用列表推导式造新列表。' },
            { t: 'code', x: 'nums = [1, 2, 3, 4, 5]\nbad = nums[:]\nfor n in bad:          # 有坑：边遍历边删\n    if n % 2 == 0:\n        bad.remove(n)\nprint("有坑的结果：", bad)\n\ngood = nums[:]\nfor n in good[:]:      # 遍历副本才安全\n    if n % 2 == 0:\n        good.remove(n)\nprint("正确的结果：", good)', out: '有坑的结果： [1, 3, 5]\n正确的结果： [1, 3, 5]' },
            { t: 'principle', x: '**循环只做一件事。** 一个循环里同时干三件事，出 bug 时你根本定位不到是哪件出了问题。' }
          ]
        },
        {
          id: 'py3l4', title: '四个基础算法套路', key: '累加 · 最值 · 交换 · 排序', time: 14,
          blocks: [
            { t: 'p', x: '绝大多数入门题都能拆成四个套路：**累加、计数、找极值、交换排序**。把这四个练成肌肉记忆，见到新题先想「它属于哪一类」。' },
            { t: 'h', x: '套路一：累加与计数' },
            { t: 'code', x: 'nums = [3, 7, 2, 9, 4]\n\ntotal = 0\nfor n in nums:\n    total += n\nprint("和：", total)\n\neven = 0\nfor n in nums:\n    if n % 2 == 0:\n        even += 1\nprint("偶数个数：", even)\nprint("内置函数：", sum(nums), len(nums), sum(nums) / len(nums))', out: '和： 25\n偶数个数： 2\n内置函数： 25 5 5.0' },
            { t: 'h', x: '套路二：找极值（及其位置）' },
            { t: 'code', x: 'nums = [3, 7, 2, 9, 4]\n\nmx = nums[0]\nmx_i = 0\nfor i, n in enumerate(nums):\n    if n > mx:\n        mx, mx_i = n, i\nprint(mx, mx_i)\nprint(max(nums), nums.index(max(nums)))', out: '9 3\n9 3' },
            { t: 'h', x: '套路三：交换（Python 不用临时变量）' },
            { t: 'code', x: 'a, b = 1, 2\n# 其他语言要写 temp = a; a = b; b = temp\na, b = b, a\nprint(a, b)', out: '2 1' },
            { t: 'h', x: '套路四：冒泡排序（理解原理即可）' },
            { t: 'code', x: 'nums = [5, 2, 9, 1, 7]\nn = len(nums)\nfor i in range(n):\n    for j in range(n - 1 - i):\n        if nums[j] > nums[j + 1]:\n            nums[j], nums[j + 1] = nums[j + 1], nums[j]\nprint(nums)', out: '[1, 2, 5, 7, 9]' },
            { t: 'p', x: '冒泡的思路：每一轮把当前范围内最大的数「冒」到末尾。外层控制轮数，内层控制比较范围（每轮末尾已经排好的部分不用再比）。实际写业务时直接用 `sorted()`，但面试和算法题里它是很好的思维起点。' },
            { t: 'code', x: '# 实战：统计一段文本里出现最多的词\nwords = "the cat the dog the bird the cat".split()\ncount = {}\nfor w in words:\n    count[w] = count.get(w, 0) + 1\n\nbest, best_n = "", 0\nfor w, c in count.items():\n    if c > best_n:\n        best, best_n = w, c\nprint(best, best_n)', out: 'the 4' },
            { t: 'principle', x: '**先想清楚「我在数什么」。** 是数总量、数个数、找最大，还是找位置？把问题归到四类里，解法基本就定了。' }
          ]
        }
      ]
    },
    {
      id: 'py4', num: 4, title: '数据容器', icon: '📚',
      intro: 'Python 的程序几乎都是「拿一堆数据 → 变形 → 输出」。这一章把四个容器彻底搞清楚：list 有序可改、tuple 有序不可改、dict 键值映射、set 去重无序。选错容器，代码会又长又慢。',
      goals: ['按需求选对容器', '熟练做增删改查与排序', '用推导式一行完成筛选与映射'],
      lessons: [
        {
          id: 'py4l1', title: '列表：增删改查与排序', key: 'list · sort', time: 14,
          blocks: [
            { t: 'p', x: '列表是最常用的容器：有序、可变、什么都能装。但「能装」不等于「该装」——一个列表里混着装数字、字符串、字典，后面处理时你会很痛苦。' },
            { t: 'code', x: 'a = [3, 1, 2]\na.append(4)         # 末尾追加\na.insert(0, 0)      # 指定位置插入\na.remove(2)         # 按值删除（删第一个匹配的）\nprint(a)\nprint(a.pop(), a)   # 弹出并返回末尾元素\na.sort()\nprint(a)\na.sort(reverse=True)\nprint(a)', out: '[0, 3, 1, 4]\n4 [0, 3, 1]\n[0, 1, 3]\n[3, 1, 0]' },
            { t: 'table', head: ['操作', '写法', '注意'], rows: [
              ['追加', 'lst.append(x)', 'O(1)，最常用'],
              ['插入', 'lst.insert(i, x)', 'O(n)，越靠前越慢'],
              ['按值删', 'lst.remove(x)', '值不存在会抛 ValueError'],
              ['按下标删', 'lst.pop(i)', '不传参删末尾，返回被删元素'],
              ['排序', 'lst.sort()', '原地改，返回 None'],
              ['生成新列表', 'sorted(lst)', '不改原列表']
            ] },
            { t: 'warn', x: '`lst.sort()` 是**原地**操作，返回值是 None。写 `a = a.sort()` 会把 a 变成 None，这是新手最常见的 bug 之一。' },
            { t: 'h', x: '统计与切片' },
            { t: 'code', x: 'nums = [5, 2, 8]\nprint(len(nums), sum(nums), max(nums), min(nums))\nprint(nums[::-1])\nprint(sorted(nums), nums)\nnums.reverse()\nprint(nums)', out: '3 15 8 2\n[8, 2, 5]\n[2, 5, 8] [5, 2, 8]\n[8, 2, 5]' },
            { t: 'h', x: '排序的三种姿势' },
            { t: 'code', x: 'words = ["apple", "Bob", "cat"]\nprint(sorted(words))                    # 按 ASCII，大写在前\nprint(sorted(words, key=str.lower))     # 忽略大小写\nprint(sorted(words, key=len))           # 按长度\n\npeople = [{"name": "阿伟", "age": 21}, {"name": "小明", "age": 19}]\nprint(sorted(people, key=lambda p: p["age"]))', out: "['Bob', 'apple', 'cat']\n['apple', 'Bob', 'cat']\n['Bob', 'cat', 'apple']\n[{'name': '小明', 'age': 19}, {'name': '阿伟', 'age': 21}]" },
            { t: 'tip', x: '`key=` 传的是「一个把元素映射成可比较值的函数」。想按多个字段排就返回元组：`key=lambda p: (p["age"], p["name"])`。' },
            { t: 'code', x: 'a = [1, 2, 3]\nb = a * 2\nprint(b)\nprint(a + [4, 5])\nprint([0] * 4)\nprint(2 in a, 5 in a)', out: '[1, 2, 3, 1, 2, 3]\n[1, 2, 3, 4, 5]\n[0, 0, 0, 0]\nTrue False' }
          ]
        },
        {
          id: 'py4l2', title: '元组与解包', key: 'tuple · unpack', time: 10,
          blocks: [
            { t: 'p', x: '元组就是「不能改的列表」。不能改带来的好处是：可以做字典的键、可以安全共享、语义上表达「这是一组固定的值」。函数返回多个值时，本质上返回的就是元组。' },
            { t: 'code', x: 't = (1, 2, 3)\nprint(t[0], len(t))\n\n# 解包：把元组拆到多个变量\na, b, c = t\nprint(a, b, c)\n\n# 星号收集剩余\nx, *rest = t\nprint(x, rest)', out: '1 3\n1 2 3\n1 [2, 3]' },
            { t: 'code', x: 'def min_max(nums):\n    return min(nums), max(nums)      # 返回的是元组\n\nlo, hi = min_max([3, 1, 4, 1, 5])\nprint(lo, hi)\nprint(min_max([3, 1, 4]))', out: '1 5\n(1, 4)' },
            { t: 'table', head: ['特性', 'list', 'tuple'], rows: [
              ['可变', '是', '否'],
              ['能做 dict 的键', '否', '是'],
              ['语法', '[1, 2]', '(1, 2)'],
              ['单元素', '[1]', '(1,)  ← 逗号不能省'],
              ['内存', '略大', '略小、更快']
            ] },
            { t: 'warn', x: '`(1)` 只是一个加了括号的整数，**不是元组**。单元素元组必须写 `(1,)`，这个逗号不能省。' },
            { t: 'h', x: '解包的真实用处' },
            { t: 'code', x: 'pairs = [(1, "a"), (2, "b")]\nfor i, s in pairs:\n    print(i, s)\n\nd = {"x": 1, "y": 2}\nfor k, v in d.items():\n    print(k, v)\n\nfirst, *middle, last = [1, 2, 3, 4, 5]\nprint(first, middle, last)', out: '1 a\n2 b\nx 1\ny 2\n1 [2, 3, 4] 5' },
            { t: 'tip', x: '解包还能用于函数调用：`print(*[1, 2, 3])` 等价于 `print(1, 2, 3)`；字典用 `**` 展开成关键字参数。' }
          ]
        },
        {
          id: 'py4l3', title: '字典：键值映射与遍历', key: 'dict · get · setdefault', time: 14,
          blocks: [
            { t: 'p', x: '字典是 Python 里最重要的数据结构。查找是 O(1)，所以「用列表存 id 再线性找」和「用字典直接查」在数据量大时是天壤之别。' },
            { t: 'code', x: 'd = {"name": "小明", "age": 20}\nprint(d["name"])\nprint(d.get("score", "没有这个键"))\nd["age"] = 21\nd["city"] = "广州"\nprint(d)\nprint("name" in d, "score" in d)', out: "小明\n没有这个键\n{'name': '小明', 'age': 21, 'city': '广州'}\nTrue False" },
            { t: 'warn', x: '`d["不存在的键"]` 会直接抛 `KeyError`，而 `d.get("不存在的键")` 返回 None（或你给的默认值）。**不确定键存不存在时，一律用 get。**' },
            { t: 'table', head: ['方法', '作用', '注意'], rows: [
              ['d[k]', '读写', '读不存在的键会 KeyError'],
              ['d.get(k, default)', '安全读', '不修改字典'],
              ['d.setdefault(k, v)', '不存在才写入', '**会修改**字典'],
              ['d.pop(k)', '删除并返回', '可给默认值避免报错'],
              ['d.update(other)', '批量合并', '覆盖同名键'],
              ['d.keys/values/items()', '三种视图', 'items 是遍历首选']
            ] },
            { t: 'code', x: 'd = {"a": 1}\nd["a"] += 1\nd.setdefault("b", 0)\nd.setdefault("b", 99)      # b 已存在，不覆盖\nprint(d)\nprint(d.pop("a"), d)\nd.update({"c": 3})\nprint(d)', out: "{'a': 2, 'b': 0}\n2 {'b': 0}\n{'b': 0, 'c': 3}" },
            { t: 'h', x: '遍历与计数' },
            { t: 'code', x: 'scores = {"语文": 90, "数学": 95}\nfor k, v in scores.items():\n    print(k, v)\n\nwords = "a b a c b a".split()\ncount = {}\nfor w in words:\n    count[w] = count.get(w, 0) + 1\nprint(count)', out: "语文 90\n数学 95\n{'a': 3, 'b': 2, 'c': 1}" },
            { t: 'h', x: '嵌套字典与排序' },
            { t: 'code', x: 'students = {\n    "小明": {"score": 92, "age": 19},\n    "阿伟": {"score": 85, "age": 21},\n}\nprint(students["小明"]["score"])\n\nranked = sorted(students.items(), key=lambda kv: kv[1]["score"], reverse=True)\nfor name, info in ranked:\n    print(name, info["score"])', out: '92\n小明 92\n阿伟 85' },
            { t: 'tip', x: 'Python 3.7 之后字典**保持插入顺序**，所以可以直接用它做「有序映射」。需要按插入顺序输出不需要额外排序。' }
          ]
        },
        {
          id: 'py4l4', title: '集合：去重与集合运算', key: 'set · 交并差', time: 10,
          blocks: [
            { t: 'p', x: '集合的核心价值只有两个：**去重**和**快速判断存在**（O(1)）。它是无序的，所以不能靠下标访问。' },
            { t: 'code', x: 's = {1, 2, 2, 3}\nprint(sorted(s), len(s))\n\nnums = [3, 1, 3, 2, 1]\nprint(sorted(set(nums)))\nprint(len(nums), len(set(nums)))', out: '[1, 2, 3] 3\n[1, 2, 3]\n5 3' },
            { t: 'code', x: 'a = {1, 2, 3}\nb = {2, 3, 4}\nprint(sorted(a & b))     # 交集\nprint(sorted(a | b))     # 并集\nprint(sorted(a - b))     # 差集：在 a 不在 b\nprint(sorted(a ^ b))     # 对称差：只在一个里的\nprint(2 in a)', out: '[2, 3]\n[1, 2, 3, 4]\n[1]\n[1, 4]\nTrue' },
            { t: 'h', x: '实际场景：找出两批数据的差' },
            { t: 'code', x: 'yesterday = {"小明", "阿伟", "小红"}\ntoday = {"阿伟", "小红", "小刚"}\n\nprint("今天新来的：", sorted(today - yesterday))\nprint("今天没来的：", sorted(yesterday - today))\nprint("两天都来的：", sorted(yesterday & today))', out: "今天新来的： ['小刚']\n今天没来的： ['小明']\n两天都来的： ['小红', '阿伟']" },
            { t: 'note', x: '注意「两天都来的」里 `小红` 排在 `阿伟` 前面：**sorted 对中文是按 Unicode 码点排的，不是按拼音**。要按拼音得用第三方库 `pypinyin`，或者自己指定 `key`。' },
            { t: 'table', head: ['需求', '选什么', '原因'], rows: [
              ['保持顺序 + 允许重复', 'list', '基本容器'],
              ['保持顺序 + 要去重', 'dict.fromkeys', '3.7+ 保序去重'],
              ['只关心在不在', 'set', 'O(1) 查找'],
              ['数据固定不改', 'tuple', '安全、可做键']
            ] },
            { t: 'code', x: 'items = ["a", "b", "a", "c", "b"]\nprint(list(dict.fromkeys(items)))     # 保序去重，比 set 更实用', out: "['a', 'b', 'c']" },
            { t: 'warn', x: '集合里的元素必须**可哈希**（不可变）。list 不能放进 set，需要先转成 tuple。' }
          ]
        },
        {
          id: 'py4l5', title: '推导式：一行写完筛选与映射', key: 'comprehension', time: 12,
          blocks: [
            { t: 'p', x: '推导式是 Python 最有辨识度的语法。它把「建一个空容器 → 循环 → 条件判断 → append」四步压成一行，而且比手写循环更快。' },
            { t: 'code', x: 'nums = [1, 2, 3, 4, 5, 6]\n\n# 传统写法\nsquares = []\nfor n in nums:\n    if n % 2 == 0:\n        squares.append(n * n)\nprint(squares)\n\n# 推导式写法\nprint([n * n for n in nums if n % 2 == 0])', out: '[4, 16, 36]\n[4, 16, 36]' },
            { t: 'p', x: '读法固定：**先看 for 后面（数据来源），再看 if（筛选条件），最后看最前面（怎么变形）**。' },
            { t: 'h', x: '三种容器都有推导式' },
            { t: 'code', x: 'print([n for n in range(5)])                    # 列表\nprint({n: n * n for n in range(1, 4)})          # 字典\nprint(sorted({n % 2 for n in range(6)}))        # 集合', out: '[0, 1, 2, 3, 4]\n{1: 1, 2: 4, 3: 9}\n[0, 1]' },
            { t: 'h', x: '带条件的两个位置' },
            { t: 'code', x: '# 条件放后面 = 筛选（只保留满足的）\nprint([n for n in range(10) if n % 2 == 0])\n\n# 条件放前面 = 变形（三选一赋值）\nprint(["偶" if n % 2 == 0 else "奇" for n in range(6)])', out: '[0, 2, 4, 6, 8]\n[\'偶\', \'奇\', \'偶\', \'奇\', \'偶\', \'奇\']' },
            { t: 'table', head: ['位置', '写法', '含义'], rows: [
              ['末尾 if', '[x for x in a if 条件]', '筛选，不满足的直接丢弃'],
              ['前面 if-else', '[a if 条件 else b for x in a]', '每个元素都要给出结果'],
              ['两层 for', '[x for row in m for x in row]', '展平嵌套结构']
            ] },
            { t: 'code', x: 'matrix = [[1, 2], [3, 4]]\nprint([x for row in matrix for x in row])\nprint([row[0] for row in matrix])\nprint([[x * 2 for x in row] for row in matrix])', out: '[1, 2, 3, 4]\n[1, 3]\n[[2, 4], [6, 8]]' },
            { t: 'h', x: '生成器表达式：省内存的版本' },
            { t: 'code', x: 'g = (n * n for n in range(5))\nprint(type(g).__name__)\nprint(sum(g))\nprint(sum(n for n in range(101)))', out: 'generator\n30\n5050' },
            { t: 'warn', x: '推导式不要嵌套超过两层，也不要写超长的表达式。可读性比「一行搞定」重要得多——超过 80 个字符就该改回普通循环。' },
            { t: 'principle', x: '**推导式解决「转换」，不解决「流程」。** 涉及累加、多步判断、副作用（打印/写文件）时，老老实实用 for 循环。' }
          ]
        }
      ]
    },
    {
      id: 'py5', num: 5, title: '函数', icon: '⚙️',
      intro: '函数是「给一段逻辑起个名字」。写函数的核心不是语法，而是**边界**：它接受什么、返回什么、不负责什么。这一章把参数、作用域、递归、高阶函数一次讲透，学完你就能开始拆解复杂问题了。',
      goals: ['写出职责单一的函数', '分清四种参数写法', '用 LEGB 解释变量可见性', '把循环改写成递归或高阶函数'],
      lessons: [
        {
          id: 'py5l1', title: '定义、调用与返回值', key: 'def · return', time: 11,
          blocks: [
            { t: 'p', x: '函数的三要素：**名字、参数、返回值**。判断一个函数写得好不好，看一句话——「不看实现，光看名字和参数，你知道它会做什么吗」。' },
            { t: 'code', x: 'def greet(name):\n    return "你好，" + name\n\nprint(greet("小明"))\nprint(greet("阿伟"))\n\ndef add(a, b):\n    return a + b\n\nprint(add(3, 5))', out: '你好，小明\n你好，阿伟\n8' },
            { t: 'h', x: '没有 return 时返回 None' },
            { t: 'code', x: 'def show(x):\n    print("值：", x)      # 只是打印，没有返回\n\nr = show(1)\nprint(r)', out: '值： 1\nNone' },
            { t: 'warn', x: '**打印不等于返回。** `print` 是给人看的，`return` 是给程序用的。函数里只 print 不 return，调用方拿到的是 None，后面没法继续算。' },
            { t: 'h', x: '返回多个值' },
            { t: 'code', x: 'def divmod2(a, b):\n    return a // b, a % b      # 本质是返回一个元组\n\nprint(divmod2(7, 2))\nq, r = divmod2(7, 2)\nprint(q, r)', out: '(3, 1)\n3 1' },
            { t: 'h', x: '文档字符串' },
            { t: 'code', x: 'def area(w, h):\n    """计算矩形面积。"""\n    return w * h\n\nprint(area(3, 4))\nprint(area.__doc__)', out: '12\n计算矩形面积。' },
            { t: 'tip', x: '三引号写在函数第一行就是 docstring，`help(函数名)` 和 IDE 的悬浮提示都靠它。写一行说明比写十行注释有用。' },
            { t: 'principle', x: '**一个函数只做一件事。** 如果描述它需要「并且」这个词，就该拆成两个。' }
          ]
        },
        {
          id: 'py5l2', title: '四种参数写法与默认值陷阱', key: '默认值 · *args · **kw', time: 15,
          blocks: [
            { t: 'p', x: 'Python 的参数系统比大多数语言灵活，但灵活意味着容易写错。四种写法按顺序记：位置、默认、可变位置、可变关键字。' },
            { t: 'h', x: '一、位置参数与默认值' },
            { t: 'code', x: 'def greet(name, greeting="你好"):\n    return f"{greeting}，{name}"\n\nprint(greet("小明"))\nprint(greet("小明", "早上好"))\nprint(greet("小明", greeting="晚上好"))', out: '你好，小明\n早上好，小明\n晚上好，小明' },
            { t: 'note', x: '**带默认值的参数必须放在没有默认值的后面**，否则 `def f(a=1, b)` 会直接语法错误。' },
            { t: 'h', x: '二、关键字参数：顺序自由' },
            { t: 'code', x: 'def make_user(name, age, city="广州"):\n    return f"{name}/{age}/{city}"\n\nprint(make_user("小明", 20))\nprint(make_user(age=20, name="小明"))\nprint(make_user("小明", 20, city="深圳"))', out: '小明/20/广州\n小明/20/广州\n小明/20/深圳' },
            { t: 'h', x: '三、四、可变参数' },
            { t: 'code', x: 'def total(*nums):\n    print(type(nums).__name__, nums)\n    return sum(nums)\n\nprint(total(1, 2, 3))\nprint(total())', out: 'tuple (1, 2, 3)\n6\ntuple ()\n0' },
            { t: 'code', x: 'def show(**kw):\n    for k, v in kw.items():\n        print(k, "=", v)\n\nshow(name="小明", age=20)', out: 'name = 小明\nage = 20' },
            { t: 'table', head: ['写法', '接收成什么', '调用方式'], rows: [
              ['def f(a, b)', '普通参数', 'f(1, 2)'],
              ['def f(a=1)', '默认参数', 'f() 或 f(2)'],
              ['def f(*args)', '元组', 'f(1, 2, 3)'],
              ['def f(**kw)', '字典', 'f(x=1, y=2)'],
              ['f(*lst)', '解包传入', '把列表拆成多个位置参数'],
              ['f(**d)', '解包传入', '把字典拆成关键字参数']
            ] },
            { t: 'h', x: '最经典的坑：可变默认值' },
            { t: 'code', x: 'def bad(x, lst=[]):\n    lst.append(x)\n    return lst\n\nprint(bad(1))\nprint(bad(2))      # 期望 [2]，实际 [1, 2]', out: '[1]\n[1, 2]' },
            { t: 'p', x: '原因：默认值**只在函数定义时求值一次**，那个 `[]` 是唯一的一个列表对象，被所有调用共享。正确做法是用 `None` 占位，进函数后再新建。' },
            { t: 'code', x: 'def good(x, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(x)\n    return lst\n\nprint(good(1))\nprint(good(2))', out: '[1]\n[2]' },
            { t: 'warn', x: '同样的坑也发生在 `def f(d={})`、`def f(s=set())` 上。**默认值只用不可变对象**（数字、字符串、None、元组），这是硬规则。' }
          ]
        },
        {
          id: 'py5l3', title: '作用域与 LEGB 规则', key: 'global · nonlocal', time: 12,
          blocks: [
            { t: 'p', x: '找一个变量名时，Python 按 **L → E → G → B** 的顺序找：Local（函数内）→ Enclosing（外层函数）→ Global（模块级）→ Built-in（内置）。找不到就 NameError。' },
            { t: 'code', x: 'x = "全局"\n\ndef outer():\n    x = "外层"\n    def inner():\n        x = "内层"\n        print(x)\n    inner()\n    print(x)\n\nouter()\nprint(x)', out: '内层\n外层\n全局' },
            { t: 'p', x: '三层各有自己的 x，互不干扰。这是因为每次赋值 `x = ...` 都会在当前作用域里**新建**一个局部变量，而不是修改外层的。' },
            { t: 'h', x: '要改外层的变量，得声明' },
            { t: 'code', x: 'count = 0\n\ndef inc():\n    global count\n    count += 1\n\ninc()\ninc()\nprint(count)', out: '2' },
            { t: 'code', x: 'def counter():\n    n = 0\n    def add():\n        nonlocal n          # 改外层函数的变量用 nonlocal\n        n += 1\n        return n\n    return add\n\nc = counter()\nprint(c(), c(), c())', out: '1 2 3' },
            { t: 'table', head: ['关键字', '作用范围', '什么时候用'], rows: [
              ['global', '模块级变量', '确实需要修改全局状态（少用）'],
              ['nonlocal', '外层函数变量', '闭包计数器、状态机'],
              ['（不加）', '当前函数', '默认行为，最常见']
            ] },
            { t: 'warn', x: '`global` 能不用就不用。它让函数依赖外部状态、难以测试、并发时容易出竞态。实在需要「记住状态」，用类或闭包。' },
            { t: 'tip', x: '函数内部**读**全局变量不需要 global，只有**赋值**才需要。`print(x)` 能直接用，`x = 1` 就不行——因为它会被判定为新建局部变量。' }
          ]
        },
        {
          id: 'py5l4', title: '递归：自己调用自己', key: '基线条件', time: 12,
          blocks: [
            { t: 'p', x: '递归就两件事：**基线条件**（什么时候停）+ **递推关系**（大问题怎么变成小问题）。缺前者会无限递归，缺后者就写不出来。' },
            { t: 'code', x: 'def fact(n):\n    if n <= 1:          # 基线条件\n        return 1\n    return n * fact(n - 1)   # 递推关系\n\nprint(fact(5))\nprint(fact(10))', out: '120\n3628800' },
            { t: 'h', x: '斐波那契：递归好看但很慢' },
            { t: 'code', x: 'def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint([fib(i) for i in range(10)])', out: '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]' },
            { t: 'p', x: '这个写法的时间复杂度是 O(2ⁿ)，算 `fib(40)` 要几秒。因为同一个子问题被重复计算了几十次。解决办法是「记忆化」——把算过的结果存起来。' },
            { t: 'code', x: 'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(40))\nprint(fib.cache_info().hits > 0)', out: '102334155\nTrue' },
            { t: 'h', x: '递归深度有上限' },
            { t: 'code', x: 'def depth(n):\n    if n == 0:\n        return 0\n    return 1 + depth(n - 1)\n\nprint(depth(100))\nimport sys\nprint(sys.getrecursionlimit())', out: '100\n1000' },
            { t: 'warn', x: 'Python 默认递归上限约 1000 层，超了会抛 `RecursionError`。`sys.setrecursionlimit()` 能改，但递归太深会撑爆调用栈——**能用循环就别用递归**，Python 没有尾递归优化。' },
            { t: 'table', head: ['场景', '推荐'], rows: [
              ['树、目录、嵌套 JSON 遍历', '递归最自然'],
              ['阶乘、累加这种线性问题', '循环更省'],
              ['要重复算同一子问题', '递归 + 缓存，或改动态规划'],
              ['深度不可控', '手动维护栈（用列表模拟）']
            ] },
            { t: 'principle', x: '**先写基线条件。** 很多人写递归卡住，是因为一上来就想「怎么拆」，而没先想「什么时候不用再拆」。' }
          ]
        },
        {
          id: 'py5l5', title: 'lambda 与高阶函数', key: 'sorted key · map/filter', time: 13,
          blocks: [
            { t: 'p', x: '「函数也是对象」是 Python 很重要的一条：能赋值给变量、能当参数传、能当返回值。高阶函数就是「参数或返回值是函数」的函数。' },
            { t: 'code', x: 'square = lambda x: x * x     # 等价于 def square(x): return x * x\nprint(square(5))\nprint((lambda a, b: a + b)(2, 3))', out: '25\n5' },
            { t: 'note', x: 'lambda 只能写**一个表达式**，不能写多行、不能有 return。它的价值是「就地定义一个小函数」，超过一行就该用 def。' },
            { t: 'h', x: '最常用：sorted 的 key' },
            { t: 'code', x: 'people = [("小明", 19), ("阿伟", 21), ("小红", 18)]\nprint(sorted(people, key=lambda p: p[1]))\nprint(sorted(people, key=lambda p: p[1], reverse=True))\nprint(sorted(people, key=lambda p: p[0]))', out: "[('小红', 18), ('小明', 19), ('阿伟', 21)]\n[('阿伟', 21), ('小明', 19), ('小红', 18)]\n[('小明', 19), ('小红', 18), ('阿伟', 21)]" },
            { t: 'h', x: 'map / filter' },
            { t: 'code', x: 'nums = [1, 2, 3, 4]\nprint(list(map(lambda n: n * 2, nums)))\nprint(list(filter(lambda n: n % 2 == 0, nums)))\nprint(list(map(str, nums)))', out: "[2, 4, 6, 8]\n[2, 4]\n['1', '2', '3', '4']" },
            { t: 'tip', x: 'map / filter 在 Python 里**不如列表推导式直观**，大多数情况优先写 `[n * 2 for n in nums]`。真正离不开 lambda 的地方只有 `key=` 参数。' },
            { t: 'h', x: 'reduce：把一串压成一个' },
            { t: 'code', x: 'from functools import reduce\n\nprint(reduce(lambda a, b: a + b, [1, 2, 3, 4]))\nprint(reduce(lambda a, b: a * b, [1, 2, 3, 4]))\nprint(reduce(lambda a, b: a if len(a) > len(b) else b, ["ab", "abcd", "abc"]))', out: '10\n24\nabcd' },
            { t: 'code', x: '# 综合：按成绩排序并格式化\nstudents = [{"name": "小明", "score": 92}, {"name": "阿伟", "score": 85}]\ntop = sorted(students, key=lambda s: -s["score"])\nfor i, s in enumerate(top, 1):\n    print(f"{i}. {s[\'name\']} {s[\'score\']}")', out: '1. 小明 92\n2. 阿伟 85' },
            { t: 'warn', x: '`key=lambda s: -s["score"]` 用负号实现倒序，只对数字有效。字符串或复杂对象要用 `reverse=True`，别硬套负号。' }
          ]
        }
      ]
    },
    {
      id: 'py6', num: 6, title: '文件与异常', icon: '🗂️',
      intro: '程序总要和外界交换数据：读配置、存结果、处理坏输入。这一章解决两个现实问题——**怎么安全地读写文件**，以及**出错了怎么不让程序崩掉**。这两件事写好了，你的脚本才算能真正交给别人用。',
      goals: ['用 with 安全读写文件', '处理编码与路径问题', '用 try/except 兜住可预期的错误'],
      lessons: [
        {
          id: 'py6l1', title: '文件读写与 with 语句', key: 'open · encoding', time: 14,
          blocks: [
            { t: 'p', x: '打开文件的铁律：**永远用 `with`**。它会保证无论中途是否报错，文件都会被正确关闭。手写 `f = open(...)` 再 `f.close()`，一旦中间抛异常，文件句柄就泄漏了。' },
            { t: 'code', x: 'with open("_cc_demo.txt", "w", encoding="utf-8") as f:\n    f.write("第一行\\n第二行\\n")\n\nwith open("_cc_demo.txt", encoding="utf-8") as f:\n    print(f.read())\n\nwith open("_cc_demo.txt", encoding="utf-8") as f:\n    for i, line in enumerate(f, 1):\n        print(i, line.rstrip())\n\nimport os\nos.remove("_cc_demo.txt")', out: '第一行\n第二行\n\n1 第一行\n2 第二行' },
            { t: 'note', x: '`f.read()` 读到的内容末尾带 `\\n`，所以 `print` 之后会多出一个空行。想逐行处理就别用 read，直接 `for line in f`，它一次只读一行，大文件也不会爆内存。' },
            { t: 'table', head: ['模式', '含义', '注意'], rows: [
              ['r', '只读（默认）', '文件不存在直接报错'],
              ['w', '写入', '**会清空原内容**'],
              ['a', '追加', '在末尾接着写'],
              ['x', '独占创建', '文件已存在就报错'],
              ['r+', '读写', '最容易搞混，新手慎用'],
              ['加 b 后缀', '二进制', '图片、压缩包用，不处理编码']
            ] },
            { t: 'warn', x: '`"w"` 模式打开会**立刻清空文件**，哪怕你一行都没写。想保留原内容用 `"a"`。这个坑每年都有人踩，丢掉一整天的数据。' },
            { t: 'h', x: '处理 CSV 与 JSON' },
            { t: 'code', x: 'import json\n\ndata = {"name": "小明", "scores": [90, 95]}\ntext = json.dumps(data, ensure_ascii=False)\nprint(text)\nprint(json.loads(text)["scores"])', out: '{"name": "小明", "scores": [90, 95]}\n[90, 95]' },
            { t: 'code', x: 'import csv, io\n\nbuf = io.StringIO()\nw = csv.writer(buf, lineterminator="\\n")   # 不指定的话 Windows 下会写成 \\r\\n\nw.writerow(["姓名", "分数"])\nw.writerow(["小明", 92])\nprint(buf.getvalue().strip())\n\nrows = list(csv.reader(io.StringIO(buf.getvalue())))\nprint(rows[1])', out: '姓名,分数\n小明,92\n[\'小明\', \'92\']' },
            { t: 'tip', x: '`ensure_ascii=False` 少写一次，中文就会变成 `\\u5c0f\\u660e`。存中文配置时一定要带上这个参数。' },
            { t: 'principle', x: '**读写文件先想清楚三件事**：编码是什么、模式是读还是写、出错时要不要保留原文件。' }
          ]
        },
        {
          id: 'py6l2', title: '路径操作与编码问题', key: 'pathlib · UTF-8', time: 12,
          blocks: [
            { t: 'p', x: '路径拼接不要用字符串加反斜杠——Windows 用 `\\`、macOS/Linux 用 `/`，手写必然在某个平台上翻车。用 `pathlib` 让标准库替你处理。' },
            { t: 'code', x: 'from pathlib import PurePosixPath\n\np = PurePosixPath("/data/logs/app.log")\nprint(p.name)      # 带后缀的文件名\nprint(p.stem)      # 去掉后缀\nprint(p.suffix)    # 后缀（带点）\nprint(p.parent)    # 所在目录\nprint(p.parts)', out: "app.log\napp\n.log\n/data/logs\n('/', 'data', 'logs', 'app.log')" },
            { t: 'note', x: '上面用的是 `PurePosixPath`，它只做路径字符串运算、不碰真实文件系统，所以跨平台行为一致。真正要读写文件时用 `Path`，写法完全一样。' },
            { t: 'code', x: 'from pathlib import PurePosixPath\n\nbase = PurePosixPath("/data")\nprint(base / "logs" / "app.log")     # 用 / 拼路径，最优雅\nprint(str(base / "a.csv"))', out: '/data/logs/app.log\n/data/a.csv' },
            { t: 'h', x: '编码：中文乱码的唯一根源' },
            { t: 'table', head: ['现象', '原因', '解法'], rows: [
              ['读取时报 UnicodeDecodeError', '文件实际编码不是 UTF-8', 'open(..., encoding="gbk") 试一下'],
              ['打印中文变问号', '终端编码不支持', '设 PYTHONIOENCODING=utf-8'],
              ['写入后打开是乱码', '没指定 encoding，用了系统默认', '读写都显式写 encoding="utf-8"'],
              ['Windows 上换行变 \\r\\n', '文本模式自动转换', '需要原样保留就加 newline=""']
            ] },
            { t: 'code', x: 's = "中文"\nprint(len(s))                        # 字符数\nprint(len(s.encode("utf-8")))        # 字节数\nprint(s.encode("utf-8"))\nprint(s.encode("utf-8").decode("utf-8"))', out: "2\n6\nb'\\xe4\\xb8\\xad\\xe6\\x96\\x87'\n中文" },
            { t: 'warn', x: '**永远显式写 `encoding="utf-8"`。** 不写的话，Windows 默认用 GBK，同一份代码换台机器就读不了，这是「在我电脑上明明能跑」的头号原因。' },
            { t: 'tip', x: '判断文件是否存在用 `Path("a.txt").exists()`，比 `os.path.exists` 更现代；遍历目录用 `Path(".").glob("*.py")`，比 `os.listdir` 加判断清楚得多。' }
          ]
        },
        {
          id: 'py6l3', title: '异常处理：try / except / else / finally', key: '异常捕获', time: 14,
          blocks: [
            { t: 'p', x: '异常不是「程序坏了」，而是「程序遇到了没预料到的情况」。处理异常的目标不是让程序永不报错，而是**让报错变成可读的信息，并保证资源被正确释放**。' },
            { t: 'code', x: 'try:\n    n = int("abc")\nexcept ValueError:\n    print("转换失败：这不是一个数字")\n\ntry:\n    print(1 / 0)\nexcept ZeroDivisionError:\n    print("不能除以零")\nfinally:\n    print("无论如何都执行")', out: '转换失败：这不是一个数字\n不能除以零\n无论如何都执行' },
            { t: 'h', x: '一个函数里处理多种异常' },
            { t: 'code', x: 'def safe_div(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "除数不能为 0"\n    except TypeError:\n        return "参数类型不对"\n\nprint(safe_div(6, 3))\nprint(safe_div(6, 0))\nprint(safe_div(6, "x"))', out: '2.0\n除数不能为 0\n参数类型不对' },
            { t: 'h', x: 'else 与 finally 的分工' },
            { t: 'code', x: 'try:\n    n = int("42")\nexcept ValueError:\n    print("失败")\nelse:\n    print("成功", n)      # 没异常才执行\nfinally:\n    print("收尾")          # 无论如何都执行', out: '成功 42\n收尾' },
            { t: 'table', head: ['子句', '什么时候执行', '放什么'], rows: [
              ['try', '总是', '可能出错的代码'],
              ['except', '对应异常发生时', '补救措施'],
              ['else', 'try 全部成功时', '正常流程的后续'],
              ['finally', '无论如何', '关闭文件、释放连接']
            ] },
            { t: 'h', x: '三种错误写法' },
            { t: 'code', x: '# 错误写法一：裸 except 吞掉一切，连 Ctrl+C 都拦\n# try:\n#     do_something()\n# except:\n#     pass\n\n# 错误写法二：只 print 不处理，问题被藏起来\ntry:\n    int("x")\nexcept ValueError:\n    print("出错了")     # 然后呢？程序继续带着错误状态往下跑\n\n# 正确写法：要么恢复，要么带着上下文抛出\ndef parse(text):\n    try:\n        return int(text)\n    except ValueError as e:\n        raise ValueError(f"无法解析为整数：{text!r}") from e\n\ntry:\n    parse("x")\nexcept ValueError as e:\n    print("捕获：", e)', out: "出错了\n捕获： 无法解析为整数：'x'" },
            { t: 'warn', x: '**不要写裸 `except:`**。它会连 `KeyboardInterrupt`（Ctrl+C）和 `SystemExit` 都拦下来，让程序无法退出。至少写 `except Exception:`，更好的是精确到具体异常类型。' },
            { t: 'principle', x: '**只捕获你真正知道怎么处理的异常。** 不知道怎么处理的，让它抛出去、带上完整堆栈，比默默吞掉有用一百倍。' }
          ]
        },
        {
          id: 'py6l4', title: '抛出自定义异常与断言', key: 'raise · assert', time: 11,
          blocks: [
            { t: 'p', x: '内置异常（ValueError、KeyError）表达的是「语法层面的错误」。业务层面的错误——余额不足、年龄非法、权限不够——应该定义自己的异常类，这样调用方一眼就能看出发生了什么。' },
            { t: 'code', x: 'class BalanceError(Exception):\n    pass\n\ndef withdraw(balance, amount):\n    if amount > balance:\n        raise BalanceError(f"余额不足：{balance} < {amount}")\n    return balance - amount\n\nprint(withdraw(100, 30))\ntry:\n    withdraw(100, 150)\nexcept BalanceError as e:\n    print("拦住了：", e)', out: '70\n拦住了： 余额不足：100 < 150' },
            { t: 'note', x: '自定义异常只要 `class XXXError(Exception): pass` 就够了。名字以 `Error` 结尾是约定，继承 `Exception`（别继承 `BaseException`）。' },
            { t: 'h', x: '断言：开发期的自检' },
            { t: 'code', x: 'def avg(nums):\n    assert len(nums) > 0, "列表不能为空"\n    return sum(nums) / len(nums)\n\nprint(avg([1, 2, 3]))\ntry:\n    avg([])\nexcept AssertionError as e:\n    print("断言失败：", e)', out: '2.0\n断言失败： 列表不能为空' },
            { t: 'table', head: ['手段', '用途', '生产环境'], rows: [
              ['assert', '检查「绝不该发生」的内部状态', '`python -O` 时会全部失效，别用它校验用户输入'],
              ['raise', '主动报错，把问题交给上层', '正常使用'],
              ['if + return', '可预期的业务分支', '常见'],
              ['print/log', '记录，不中断', '调试用']
            ] },
            { t: 'warn', x: '**不要用 assert 校验用户输入**。`python -O` 优化模式会把所有 assert 直接删掉，你的校验就凭空消失了。用户输入用 `if ... raise ValueError`。' },
            { t: 'code', x: '# 综合：一个带完整校验的输入函数\ndef read_age(text):\n    if not text.strip():\n        raise ValueError("年龄不能为空")\n    if not text.strip().isdigit():\n        raise ValueError(f"年龄必须是整数，收到：{text!r}")\n    age = int(text)\n    if not (0 < age < 150):\n        raise ValueError(f"年龄超出合理范围：{age}")\n    return age\n\nfor t in ["20", "abc", "999", "  "]:\n    try:\n        print(repr(t), "->", read_age(t))\n    except ValueError as e:\n        print(repr(t), "-> 错误：", e)', out: "'20' -> 20\n'abc' -> 错误： 年龄必须是整数，收到：'abc'\n'999' -> 错误： 年龄超出合理范围：999\n'  ' -> 错误： 年龄不能为空" },
            { t: 'principle', x: '**错误信息写给「明天凌晨三点排查问题的人」看。** 要包含：发生了什么、期望是什么、实际收到了什么。那个人很可能就是你自己。' }
          ]
        }
      ]
    },
    {
      id: 'py7', num: 7, title: '面向对象', icon: '🧩',
      intro: '面向对象不是「必须用」，而是「数据和行为该放一起的时候用」。这一章从类与对象开始，一路走到继承、多态和 dataclass。重点不是背术语，而是搞清楚：什么时候该定义一个类，什么时候一个函数就够了。',
      goals: ['自己设计一个合理的类', '区分类属性与实例属性', '用继承消除重复代码', '知道 dataclass 能省掉多少样板'],
      lessons: [
        {
          id: 'py7l1', title: '类与对象：从模板到实例', key: 'class · __init__', time: 12,
          blocks: [
            { t: 'p', x: '**类是模板，对象是按模板造出来的实例。** `__init__` 不是构造函数（对象已经造好了），而是「初始化方法」，负责给这个新对象填上属性。' },
            { t: 'code', x: 'class Dog:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def bark(self):\n        return f"{self.name}：汪！"\n\nd = Dog("旺财", 3)\nprint(d.name, d.age)\nprint(d.bark())\nprint(type(d).__name__)', out: '旺财 3\n旺财：汪！\nDog' },
            { t: 'note', x: '`self` 就是「这个对象自己」。调用 `d.bark()` 时，Python 自动把 `d` 传给了第一个参数，所以你写方法时第一个参数必须是 self（名字可以改，但不建议）。' },
            { t: 'h', x: '类属性 vs 实例属性' },
            { t: 'code', x: 'class Counter:\n    total = 0                 # 类属性：所有实例共享一份\n\n    def __init__(self, name):\n        self.name = name      # 实例属性：每个对象各有一份\n        Counter.total += 1\n\na = Counter("A")\nb = Counter("B")\nprint(Counter.total, a.total, b.total)\nprint(a.name, b.name)', out: '2 2 2\nA B' },
            { t: 'warn', x: '用**可变对象**当类属性会出大问题：`class A: items = []`，然后 `a.items.append(1)`，所有实例的 items 都会变。可变状态一律放 `__init__` 里。' },
            { t: 'code', x: 'class Bad:\n    items = []          # 所有实例共享同一个列表\n\na, b = Bad(), Bad()\na.items.append(1)\nprint("坑：", b.items)\n\nclass Good:\n    def __init__(self):\n        self.items = []\n\nc, d2 = Good(), Good()\nc.items.append(1)\nprint("对：", d2.items)', out: "坑： [1]\n对： []" },
            { t: 'h', x: '什么时候该写类' },
            { t: 'table', head: ['信号', '说明'], rows: [
              ['一组函数都在传同一个字典', '该把这个字典变成对象'],
              ['需要维护状态（连接、缓存、计数）', '类天然适合'],
              ['只是做一次转换', '函数就够了，别硬套类'],
              ['只有一堆常量', '用模块级常量或 Enum']
            ] },
            { t: 'principle', x: '**能用一个函数解决的，不要写类。** 类是为了把「数据 + 操作它的方法」绑在一起，如果数据本来就不需要长期存在，类只是多余的包装。' }
          ]
        },
        {
          id: 'py7l2', title: '方法与 self：链式调用与字符串表示', key: 'self · __str__', time: 11,
          blocks: [
            { t: 'p', x: '方法本质上就是「第一个参数固定为实例的函数」。理解这一点，`self` 就不再神秘；而让方法返回 `self`，就能做出像 pandas 那样的链式调用。' },
            { t: 'code', x: 'class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def move(self, dx, dy):\n        self.x += dx\n        self.y += dy\n        return self              # 返回自己，支持链式调用\n\n    def __str__(self):\n        return f"({self.x}, {self.y})"\n\np = Point(1, 2)\nprint(p)\np.move(2, 3)\nprint(p)\nprint(p.move(1, 1).move(1, 1))', out: '(1, 2)\n(3, 5)\n(5, 7)' },
            { t: 'table', head: ['魔术方法', '触发时机', '典型用途'], rows: [
              ['__init__', '创建对象后', '初始化属性'],
              ['__str__', 'print() / str()', '给人看的字符串'],
              ['__repr__', '调试、列表里显示', '给开发看的精确表示'],
              ['__len__', 'len()', '容器类'],
              ['__eq__', '==', '自定义相等规则'],
              ['__call__', 'obj()', '让对象可以像函数一样调用']
            ] },
            { t: 'code', x: 'class Money:\n    def __init__(self, yuan):\n        self.yuan = yuan\n\n    def __repr__(self):\n        return f"Money({self.yuan})"\n\n    def __str__(self):\n        return f"{self.yuan} 元"\n\n    def __add__(self, other):\n        return Money(self.yuan + other.yuan)\n\n    def __eq__(self, other):\n        return self.yuan == other.yuan\n\na = Money(10)\nb = Money(5)\nprint(a)\nprint([a, b])\nprint(a + b)\nprint(a == Money(10))', out: '10 元\n[Money(10), Money(5)]\n15 元\nTrue' },
            { t: 'note', x: '`print(obj)` 用 `__str__`，但在列表里显示用 `__repr__`。只写一个的话，写 `__repr__` 更划算——它同时能用在调试和 print 上。' },
            { t: 'tip', x: '链式调用适合「连续修改同一个对象」的场景。如果每个方法都返回新对象（像字符串那样），那就是另一种风格「不可变链式」，两者不要混着用。' }
          ]
        },
        {
          id: 'py7l3', title: '封装：私有属性与 property', key: 'property · 下划线约定', time: 12,
          blocks: [
            { t: 'p', x: 'Python 没有真正的私有成员，只有「约定」。`_name` 表示「内部用，别碰」，`__name` 会触发名字改写（name mangling）。真正的封装靠 `@property` 把属性变成受控的读写入口。' },
            { t: 'code', x: 'class Account:\n    def __init__(self, balance):\n        self._balance = balance\n\n    @property\n    def balance(self):\n        """只读属性：外部拿得到，但改不了。"""\n        return self._balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("存款金额必须为正")\n        self._balance += amount\n\na = Account(100)\nprint(a.balance)\na.deposit(50)\nprint(a.balance)\ntry:\n    a.deposit(-10)\nexcept ValueError as e:\n    print("拦住：", e)', out: '100\n150\n拦住： 存款金额必须为正' },
            { t: 'h', x: '带校验的 setter' },
            { t: 'code', x: 'class Person:\n    def __init__(self, age):\n        self.age = age          # 走 setter，会校验\n\n    @property\n    def age(self):\n        return self._age\n\n    @age.setter\n    def age(self, value):\n        if not (0 < value < 150):\n            raise ValueError(f"年龄不合法：{value}")\n        self._age = value\n\np = Person(20)\nprint(p.age)\np.age = 30\nprint(p.age)\ntry:\n    p.age = -5\nexcept ValueError as e:\n    print("拦住：", e)', out: '20\n30\n拦住： 年龄不合法：-5' },
            { t: 'table', head: ['写法', '含义', '外部能改吗'], rows: [
              ['name', '公开', '能'],
              ['_name', '约定内部用', '能，但别这么干'],
              ['__name', '名字改写为 _类名__name', '能但很别扭'],
              ['@property 只读', '只能读', '不能'],
              ['@property + setter', '读写都受控', '能，但会走校验']
            ] },
            { t: 'warn', x: '别为了「看起来专业」给每个属性都加 property。只在**需要校验、需要计算、或者以后可能改实现**时才用，否则只是给自己添堵。' },
            { t: 'principle', x: '**封装的目的不是「不让别人看」，而是「不让别人弄坏」。** 校验逻辑集中在 setter 里，比散落在十个调用点安全得多。' }
          ]
        },
        {
          id: 'py7l4', title: '继承与 super', key: 'class Dog(Animal)', time: 12,
          blocks: [
            { t: 'p', x: '继承解决的是「是一类东西」的关系：狗是一种动物、圆形是一种形状。判断该不该继承，问一句——「A 是 B 吗」。答不上来就别继承，改用组合。' },
            { t: 'code', x: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def speak(self):\n        return "汪"\n\nclass Cat(Animal):\n    def __init__(self, name, indoor=True):\n        super().__init__(name)      # 先让父类把 name 装好\n        self.indoor = indoor\n\n    def speak(self):\n        return "喵"\n\nfor a in [Dog("旺财"), Cat("咪咪")]:\n    print(a.name, a.speak())\nprint(isinstance(Dog("x"), Animal))', out: '旺财 汪\n咪咪 喵\nTrue' },
            { t: 'note', x: '`super().__init__(name)` 不是可选的礼貌，而是必须——子类一旦定义了 `__init__`，就不会自动调用父类的，父类属性会缺失，后面用时才炸。' },
            { t: 'h', x: '方法解析顺序' },
            { t: 'code', x: 'class A:\n    def hi(self):\n        return "A"\n\nclass B(A):\n    pass\n\nclass C(A):\n    def hi(self):\n        return "C"\n\nclass D(B, C):\n    pass\n\nprint(D().hi())\nprint([c.__name__ for c in D.__mro__])', out: "C\n['D', 'B', 'C', 'A', 'object']" },
            { t: 'p', x: '`__mro__` 是方法查找顺序：从左到右找第一个有该方法的类。上面 D 自己没有 hi，B 也没有，C 有，所以返回 "C"。' },
            { t: 'h', x: '组合优于继承' },
            { t: 'code', x: 'class Engine:\n    def start(self):\n        return "引擎启动"\n\nclass Car:\n    def __init__(self):\n        self.engine = Engine()      # 组合：有一个引擎\n\n    def start(self):\n        return "汽车：" + self.engine.start()\n\nprint(Car().start())', out: '汽车：引擎启动' },
            { t: 'warn', x: '继承层级超过三层，基本就该重构了。深层继承会让「这个方法到底来自哪」变成考古工作，组合 + 接口要清晰得多。' }
          ]
        },
        {
          id: 'py7l5', title: '多态、魔术方法与 dataclass', key: '多态 · dataclass', time: 13,
          blocks: [
            { t: 'p', x: '**多态**的意思是：同一个调用写法，作用在不同对象上有不同结果。你不需要写 `if isinstance(x, Dog)`，直接 `x.speak()` 就行——这是面向对象最有价值的部分。' },
            { t: 'code', x: 'class Shape:\n    def area(self):\n        raise NotImplementedError("子类必须实现 area")\n\nclass Rect(Shape):\n    def __init__(self, w, h):\n        self.w, self.h = w, h\n    def area(self):\n        return self.w * self.h\n\nclass Circle(Shape):\n    def __init__(self, r):\n        self.r = r\n    def area(self):\n        return round(3.14159 * self.r ** 2, 2)\n\nfor s in [Rect(3, 4), Circle(2)]:\n    print(type(s).__name__, s.area())', out: 'Rect 12\nCircle 12.57' },
            { t: 'h', x: 'dataclass：省掉一堆样板代码' },
            { t: 'code', x: 'from dataclasses import dataclass, field\n\n@dataclass\nclass User:\n    name: str\n    age: int\n    tags: list = field(default_factory=list)\n\nu1 = User("小明", 20)\nu2 = User("小明", 20)\nprint(u1)\nprint(u1 == u2)\nprint(u1.name, u1.tags)', out: "User(name='小明', age=20, tags=[])\nTrue\n小明 []" },
            { t: 'p', x: '一个 `@dataclass` 自动生成了 `__init__`、`__repr__`、`__eq__`，等价于手写三十行。定义数据结构（配置、DTO、接口返回）时几乎必用。' },
            { t: 'table', head: ['需求', '写法'], rows: [
              ['普通数据类', '@dataclass'],
              ['创建后不可改', '@dataclass(frozen=True)'],
              ['要有可变默认值', 'field(default_factory=list)'],
              ['需要排序', '@dataclass(order=True)'],
              ['字段要排除比较', 'field(compare=False)']
            ] },
            { t: 'code', x: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\nprint(p)\ntry:\n    p.x = 99\nexcept Exception as e:\n    print("不可修改：", type(e).__name__)\nprint(p == Point(1, 2))', out: "Point(x=1, y=2)\n不可修改： FrozenInstanceError\nTrue" },
            { t: 'tip', x: '`frozen=True` 的对象可以当字典的键、可以安全地在多线程间共享，是「值对象」的理想形态。' },
            { t: 'principle', x: '**先想数据，再想行为。** 大部分业务代码其实只需要 dataclass 装数据 + 几个函数处理数据，真正的继承体系远没有教材里那么常用。' }
          ]
        }
      ]
    },
    {
      id: 'py8', num: 8, title: '进阶特性', icon: '🔮',
      intro: '这一章讲四个「看起来高级、用起来真香」的特性：迭代器、生成器、闭包、装饰器。它们的共同点是——理解了就再也回不去，因为很多库的源码你终于能读懂了。',
      goals: ['说清 for 循环背后发生了什么', '用生成器处理大文件不爆内存', '看懂并写出简单的装饰器'],
      lessons: [
        {
          id: 'py8l1', title: '迭代器与可迭代协议', key: 'iter · next', time: 12,
          blocks: [
            { t: 'p', x: '`for x in something` 背后只有两步：先 `iter(something)` 拿到迭代器，再反复 `next()` 直到 `StopIteration`。搞懂这条，你就知道为什么列表能 for、字符串能 for、文件也能 for。' },
            { t: 'code', x: 'nums = [1, 2, 3]\nit = iter(nums)\nprint(type(it).__name__)\nprint(next(it))\nprint(next(it))\nprint(next(it))\ntry:\n    next(it)\nexcept StopIteration:\n    print("结束了")', out: 'list_iterator\n1\n2\n3\n结束了' },
            { t: 'warn', x: '迭代器是**一次性**的：走完就空了。想再遍历一遍，得重新 `iter()`。这个坑在「先把迭代器传给函数 A 汇总，再传给函数 B 打印」时特别常见。' },
            { t: 'h', x: '自己写一个可迭代对象' },
            { t: 'code', x: 'class Countdown:\n    def __init__(self, start):\n        self.start = start\n\n    def __iter__(self):\n        return self\n\n    def __next__(self):\n        if self.start <= 0:\n            raise StopIteration\n        self.start -= 1\n        return self.start + 1\n\nprint(list(Countdown(3)))\nfor i in Countdown(3):\n    print(i, end=" ")', out: '[3, 2, 1]\n3 2 1 ' },
            { t: 'table', head: ['协议', '要实现的方法', '得到的能力'], rows: [
              ['可迭代', '__iter__', '能被 for 遍历'],
              ['迭代器', '__iter__ + __next__', '能被 next() 逐个取值'],
              ['序列', '__getitem__ + __len__', '能下标访问、能切片']
            ] },
            { t: 'code', x: '# 实际用法：把文件读成一个迭代器（不占内存）\nlines = ["第一行", "第二行", "第三行"]\nprint(sum(1 for _ in lines))\nprint(list(enumerate(lines, 1)))', out: "3\n[(1, '第一行'), (2, '第二行'), (3, '第三行')]" },
            { t: 'tip', x: '`zip`、`enumerate`、`map`、`filter`、`reversed` 返回的都是惰性迭代器，不是列表。需要多次使用或要 `len()` 时，记得先 `list()` 转一下。' }
          ]
        },
        {
          id: 'py8l2', title: '生成器与 yield', key: 'yield · 惰性求值', time: 14,
          blocks: [
            { t: 'p', x: '生成器是「会暂停的函数」。遇到 `yield` 就交出一个值并挂起，下次调用 `next()` 从挂起处继续。它的最大价值是：**数据再多也只占一份内存**。' },
            { t: 'code', x: 'def countdown(n):\n    while n > 0:\n        yield n          # 交出值并暂停\n        n -= 1\n\nprint(list(countdown(3)))\nfor i in countdown(3):\n    print(i, end=" ")\nprint()\ng = countdown(2)\nprint(next(g))\nprint(next(g))', out: '[3, 2, 1]\n3 2 1 \n2\n1' },
            { t: 'h', x: '为什么需要生成器' },
            { t: 'code', x: 'import sys\n\nbig_list = [n for n in range(100000)]\nbig_gen = (n for n in range(100000))\n\nprint("两者求和无差别：", sum(big_list) == sum(big_gen))\nprint("列表占用至少是生成器的一千倍：", sys.getsizeof(big_list) > sys.getsizeof(big_gen) * 1000)', out: '两者求和无差别： True\n列表占用至少是生成器的一千倍： True' },
            { t: 'p', x: '具体的数字大概是：10 万个整数的列表约占 **780 KB**，而对应的生成器只占 **200 字节左右**——因为它根本不存数据，只是在你要的时候现算。数据量越大，这个差距越夸张。' },
            { t: 'h', x: '处理大文件的正确姿势' },
            { t: 'code', x: 'def read_lines(path):\n    """逐行读取，无论文件多大都不会爆内存。"""\n    with open(path, encoding="utf-8") as f:\n        for line in f:\n            yield line.rstrip()\n\n# 演示：用内存里的列表模拟\nfor line in ["第一行", "第二行"]:\n    print("读到：", line)', out: '读到： 第一行\n读到： 第二行' },
            { t: 'code', x: '# 无限序列：只有生成器能这么写\ndef nat():\n    n = 1\n    while True:\n        yield n\n        n += 1\n\ng = nat()\nprint([next(g) for _ in range(5)])\n\n# 生成器管道：过滤 + 转换，全程惰性\ndef nums():\n    for n in range(10):\n        yield n\n\nevens = (n for n in nums() if n % 2 == 0)\nprint(list(evens))', out: '[1, 2, 3, 4, 5]\n[0, 2, 4, 6, 8]' },
            { t: 'table', head: ['对比', '列表', '生成器'], rows: [
              ['内存', '一次全部装入', '只存一个状态'],
              ['能否重复遍历', '能', '不能（走完就空）'],
              ['能否 len()', '能', '不能'],
              ['适合', '数据量小、要多次用', '大文件、无限序列、流式处理']
            ] },
            { t: 'warn', x: '生成器函数里 `return` 会终止生成并抛出 `StopIteration`，**不会把值返回给 for 循环**。想要最终结果，要么把它包成 list，要么用「状态累积 + 最后一次 yield」的写法。' }
          ]
        },
        {
          id: 'py8l3', title: '闭包：函数记住了它的出生环境', key: 'closure · nonlocal', time: 13,
          blocks: [
            { t: 'p', x: '闭包 = 内层函数 + 它引用的外层变量。外层函数返回后，那些变量**并没有消失**，而是被内层函数「记住」了。这是装饰器、工厂函数、状态保持的基础。' },
            { t: 'code', x: 'def make_counter():\n    count = 0\n    def inc():\n        nonlocal count\n        count += 1\n        return count\n    return inc\n\nc1 = make_counter()\nc2 = make_counter()\nprint(c1(), c1(), c1())\nprint(c2())          # 独立的计数器', out: '1 2 3\n1' },
            { t: 'code', x: 'def multiplier(n):\n    return lambda x: x * n      # 记住了 n\n\ndouble = multiplier(2)\ntriple = multiplier(3)\nprint(double(5), triple(5))', out: '10 15' },
            { t: 'h', x: '最经典的坑：循环里的闭包' },
            { t: 'code', x: 'funcs = []\nfor i in range(3):\n    funcs.append(lambda: i)\n\nprint([f() for f in funcs])', out: '[2, 2, 2]' },
            { t: 'p', x: '全是 2 而不是 0、1、2。因为 lambda 里引用的 `i` 是**变量本身**，不是当时的值；循环结束后 i 停在 2，所有 lambda 看到的都是同一个 2。' },
            { t: 'code', x: '# 解法一：默认参数在定义时求值，把当前值"拍下来"\nfuncs = []\nfor i in range(3):\n    funcs.append(lambda i=i: i)\nprint([f() for f in funcs])\n\n# 解法二：用工厂函数造一个新的作用域\ndef make(i):\n    return lambda: i\n\nfuncs2 = [make(i) for i in range(3)]\nprint([f() for f in funcs2])', out: '[0, 1, 2]\n[0, 1, 2]' },
            { t: 'table', head: ['场景', '闭包是否合适'], rows: [
              ['需要记住一点状态', '合适，比全局变量干净'],
              ['简单的转换逻辑', '用 lambda 或普通函数'],
              ['状态需要被多处修改', '改成类更清晰'],
              ['需要序列化/跨进程', '闭包不行，用类或数据']
            ] },
            { t: 'tip', x: '`nonlocal` 只能用于「外层函数」的变量。如果外层是模块级（全局），要用 `global`；如果只是想读不想改，根本不用声明。' }
          ]
        },
        {
          id: 'py8l4', title: '装饰器：给函数套一层壳', key: '@decorator', time: 15,
          blocks: [
            { t: 'p', x: '装饰器 = 一个「接收函数、返回新函数」的函数。`@timer` 只是 `f = timer(f)` 的语法糖。搞懂这一句，装饰器就不再玄乎。' },
            { t: 'code', x: 'import functools\n\ndef timer(func):\n    @functools.wraps(func)          # 保留原函数的名字和文档\n    def wrapper(*args, **kwargs):\n        print(f"开始调用 {func.__name__}")\n        result = func(*args, **kwargs)\n        print(f"调用结束，返回 {result}")\n        return result\n    return wrapper\n\n@timer\ndef add(a, b):\n    return a + b\n\nprint(add(2, 3))\nprint(add.__name__)', out: '开始调用 add\n调用结束，返回 5\n5\nadd' },
            { t: 'warn', x: '**必须写 `@functools.wraps(func)`**。不加的话，`add.__name__` 会变成 `wrapper`，文档字符串也会丢，调试和自动生成文档时全是坑。' },
            { t: 'h', x: '带参数的装饰器（三层结构）' },
            { t: 'code', x: 'import functools\n\ndef repeat(times):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            result = None\n            for _ in range(times):\n                result = func(*args, **kwargs)\n            return result\n        return wrapper\n    return decorator\n\n@repeat(3)\ndef hello():\n    print("hi")\n    return "done"\n\nprint(hello())', out: 'hi\nhi\nhi\ndone' },
            { t: 'table', head: ['层数', '写法', '调用时'], rows: [
              ['两层', 'def deco(func)', '@deco'],
              ['三层', 'def deco(参数)', '@deco(3)'],
              ['记住口诀', '外层收参数，中层收函数，内层收实参', '—']
            ] },
            { t: 'h', x: '实用例子：重试与缓存' },
            { t: 'code', x: 'import functools\n\ncalls = {"n": 0}\n\ndef count_calls(func):\n    @functools.wraps(func)\n    def wrapper(*a, **kw):\n        calls["n"] += 1\n        return func(*a, **kw)\n    return wrapper\n\n@count_calls\ndef work(x):\n    return x * 2\n\nwork(1)\nwork(2)\nprint("调用次数：", calls["n"])\n\n@functools.lru_cache(maxsize=None)\ndef slow_square(n):\n    return n * n\n\nprint(slow_square(4), slow_square(4))\nprint("缓存命中：", slow_square.cache_info().hits)', out: '调用次数： 2\n16 16\n缓存命中： 1' },
            { t: 'tip', x: '先掌握「两层装饰器 + wraps」，这已经能解决 90% 的需求（计时、日志、权限检查、重试）。三层的那套等真正需要时再回来看。' },
            { t: 'principle', x: '**装饰器只做「与业务无关的横切逻辑」**：日志、计时、缓存、鉴权。如果装饰器里开始写业务判断，说明该用普通函数了。' }
          ]
        }
      ]
    },
    {
      id: 'py9', num: 9, title: '标准库与生态', icon: '🧰',
      intro: 'Python 有句名言：「电池已包含」。datetime、json、re、pathlib 这些标准库不用装就能用，覆盖了八成日常需求。这一章把最常用的几个过一遍，再讲怎么写自己的模块、怎么装第三方库。',
      goals: ['会拆分自己的模块与包', '用 datetime 处理日期', '用 json 做序列化', '用正则提取文本中的信息'],
      lessons: [
        {
          id: 'py9l1', title: '模块、包与 import 机制', key: 'import · __name__', time: 12,
          blocks: [
            { t: 'p', x: '一个 `.py` 文件就是一个**模块**；一个带 `__init__.py` 的文件夹就是一个**包**。`import` 的本质是「执行那个文件，然后把里面的名字挂到当前命名空间」。' },
            { t: 'code', x: 'import math\nprint(math.sqrt(16))\nprint(math.floor(3.7), math.ceil(3.2))\nprint(round(math.pi, 4))\n\nfrom math import gcd, factorial\nprint(gcd(12, 18), factorial(5))\n\nimport math as m\nprint(m.pow(2, 10))', out: '4.0\n3 4\n3.1416\n6 120\n1024.0' },
            { t: 'table', head: ['写法', '含义', '什么时候用'], rows: [
              ['import math', '整个模块导入', '用的地方多，前缀能表明来源'],
              ['from math import gcd', '只导入某个名字', '用得频繁、名字不易混淆'],
              ['import numpy as np', '起别名', '名字长或社区有约定俗成的缩写'],
              ['from math import *', '全部导入', '**不推荐**，污染命名空间']
            ] },
            { t: 'h', x: '`if __name__ == "__main__"` 到底在干嘛' },
            { t: 'code', x: 'def main():\n    print("作为程序运行")\n\nprint("当前 __name__ =", __name__)\n\nif __name__ == "__main__":\n    main()', out: '当前 __name__ = __main__\n作为程序运行' },
            { t: 'p', x: '直接运行这个文件时，`__name__` 是 `"__main__"`；被别人 `import` 时，`__name__` 是模块名。所以加这个判断，就能做到「既能当脚本跑，又能被导入复用」。' },
            { t: 'code', x: '# 一个典型的项目结构\n# myapp/\n#   __init__.py\n#   utils.py        def load_config()\n#   models.py       class User\n# main.py           from myapp.utils import load_config\n\nparts = ["main.py -> from myapp.utils import load_config"]\nfor p in parts:\n    print(p)', out: 'main.py -> from myapp.utils import load_config' },
            { t: 'warn', x: '循环导入（a.py 导入 b.py，b.py 又导入 a.py）是新手最容易卡的坑。解法：把公共部分抽到第三个模块，或者在函数内部再 import。' },
            { t: 'tip', x: '`from math import *` 看着省事，实际上会把你定义的同名变量悄悄覆盖掉，而且看代码时根本不知道某个名字从哪来。永远别用。' }
          ]
        },
        {
          id: 'py9l2', title: '四个必会标准库：datetime / json / re / random', key: 'datetime · json · re', time: 16,
          blocks: [
            { t: 'p', x: '这四个库几乎每个项目都会用到：处理时间、读写配置、从文本里抠信息、造测试数据。先掌握最常用的那几个函数。' },
            { t: 'h', x: 'datetime：日期与时间' },
            { t: 'code', x: 'from datetime import date, timedelta\n\nd = date(2026, 11, 11)\nprint(d, d.year, d.month, d.day)\nprint(d + timedelta(days=30))\nprint(d.strftime("%Y-%m-%d"))\nprint(date(2026, 11, 11) - date(2026, 11, 1))', out: '2026-11-11 2026 11 11\n2026-12-11\n2026-11-11\n10 days, 0:00:00' },
            { t: 'table', head: ['格式符', '含义', '例子'], rows: [
              ['%Y', '四位年份', '2026'],
              ['%m', '两位月份', '11'],
              ['%d', '两位日期', '11'],
              ['%H:%M:%S', '时分秒', '20:15:00'],
              ['%A', '星期全称', 'Wednesday']
            ] },
            { t: 'h', x: 'json：序列化与反序列化' },
            { t: 'code', x: 'import json\n\ndata = {"name": "小明", "tags": ["a", "b"]}\ns = json.dumps(data, ensure_ascii=False)\nprint(s)\nprint(json.loads(s)["tags"])\nprint(json.dumps({"n": 1}, indent=2))', out: '{"name": "小明", "tags": ["a", "b"]}\n[\'a\', \'b\']\n{\n  "n": 1\n}' },
            { t: 'note', x: '`json.dumps` 是「对象 → 字符串」，`json.dump` 直接写文件；`json.loads` 是「字符串 → 对象」，`json.load` 从文件读。**带 s 的处理字符串，不带的处理文件。**' },
            { t: 'h', x: 're：正则表达式' },
            { t: 'code', x: 'import re\n\ns = "订单号 A123，金额 45.6 元"\nprint(re.findall(r"\\d+", s))\nprint(re.sub(r"\\d+", "#", s))\nm = re.search(r"(\\d+)\\.(\\d+)", s)\nprint(m.group(0), m.group(1), m.group(2))', out: "['123', '45', '6']\n订单号 A#，金额 #.# 元\n45.6 45 6" },
            { t: 'table', head: ['符号', '含义', '例子'], rows: [
              ['\\d', '数字', '匹配 0-9'],
              ['\\w', '字母数字下划线', '等价 [a-zA-Z0-9_]'],
              ['\\s', '空白', '空格、制表、换行'],
              ['+ * ?', '一次以上 / 零次以上 / 零或一次', '贪婪与可选'],
              ['( )', '分组', '配合 group(n) 取值'],
              ['[^abc]', '取反字符集', '不是 a、b、c 的字符']
            ] },
            { t: 'code', x: 'import re\n\ntext = "2026-11-11 下单，2026-11-13 发货"\nfor m in re.finditer(r"\\d{4}-\\d{2}-\\d{2}", text):\n    print(m.group(), m.start())\n\nprint(re.split(r"[,，]", "a,b，c"))', out: '2026-11-11 0\n2026-11-13 14\n[\'a\', \'b\', \'c\']' },
            { t: 'h', x: 'random：造数据' },
            { t: 'code', x: 'import random\n\nrandom.seed(7)\nnums = [random.randint(1, 6) for _ in range(10)]\nprint(all(1 <= n <= 6 for n in nums))\nprint(len(set(nums)) <= 6)\nprint(random.choice(["石头", "剪刀", "布"]) in ["石头", "剪刀", "布"])', out: 'True\nTrue\nTrue' },
            { t: 'warn', x: '`random` 是**伪随机**，用 `seed()` 固定后结果可复现，所以它适合造测试数据，**绝对不能用来生成密码、令牌**。安全场景用 `secrets` 模块。' }
          ]
        },
        {
          id: 'py9l3', title: '第三方库与网络请求', key: 'pip · requests', time: 12,
          blocks: [
            { t: 'p', x: '标准库解决通用问题，第三方库解决具体问题。Python 生态的强大之处就在这里：几乎任何需求，都已经有人写好了包。' },
            { t: 'table', head: ['领域', '常用库', '解决什么'], rows: [
              ['网络请求', 'requests / httpx', '调 API、爬页面'],
              ['数据处理', 'pandas / numpy', '表格、数组运算'],
              ['网页解析', 'beautifulsoup4 / lxml', '从 HTML 里取内容'],
              ['Web 服务', 'flask / fastapi', '写接口'],
              ['图像处理', 'pillow / opencv-python', '裁剪、识别'],
              ['机器学习', 'scikit-learn / pytorch', '建模训练']
            ] },
            { t: 'h', x: '一个请求的完整流程' },
            { t: 'code', x: '# 这段需要联网，本站沙箱无外网，只作代码参考\n# import requests\n#\n# r = requests.get("https://api.github.com/users/pan179", timeout=5)\n# r.raise_for_status()                 # 4xx/5xx 直接抛异常\n# data = r.json()\n# print(data["login"], data["public_repos"])\n\n# 下面这段纯本地运算，可以真跑\nfrom urllib.parse import urlencode, quote\n\nprint(urlencode({"q": "python 教程", "page": 2}))\nprint(quote("中文 路径"))', out: 'q=python+%E6%95%99%E7%A8%8B&page=2\n%E4%B8%AD%E6%96%87%20%E8%B7%AF%E5%BE%84' },
            { t: 'note', x: 'URL 里的中文和空格必须先编码才能发出去，`urlencode` 和 `quote` 就是干这个的。你看到的一长串 `%E4%B8%AD` 就是「中」字的 UTF-8 编码。' },
            { t: 'h', x: '调 API 的三个必备习惯' },
            { t: 'ul', x: [
              '**永远设 timeout**：不设的话网络一卡，程序就永远 hang 住',
              '**检查状态码**：`raise_for_status()` 或判断 `r.status_code == 200`',
              '**处理异常**：`requests.exceptions.RequestException` 兜底，别让一个网络抖动崩掉整个脚本'
            ] },
            { t: 'code', x: '# 带重试和超时的健壮写法（参考用，需联网）\ndef fetch(url, retries=3):\n    """伪代码骨架：真实代码把 TODO 换成 requests.get"""\n    last_error = None\n    for i in range(retries):\n        try:\n            print(f"第 {i + 1} 次尝试：{url}")\n            return {"ok": True}\n        except Exception as e:\n            last_error = e\n    raise RuntimeError(f"重试 {retries} 次仍失败") from last_error\n\nprint(fetch("https://example.com/api"))', out: '第 1 次尝试：https://example.com/api\n{\'ok\': True}' },
            { t: 'tip', x: '装包时锁版本（`pip install requests==2.31.0`），并在 `requirements.txt` 里记录。不锁版本的项目，半年后换台机器大概率装不起来。' }
          ]
        }
      ]
    },
    {
      id: 'py10', num: 10, title: '并发与项目实战', icon: '🏁',
      intro: '最后一章把前面九章的东西合起来用。先搞清楚线程、进程、协程各适合什么场景（这是面试必问，也是实操必踩），再动手写一个能真正跑起来的小项目。',
      goals: ['分清 CPU 密集与 IO 密集该用什么', '写出线程安全的代码', '独立完成一个带持久化的命令行工具'],
      lessons: [
        {
          id: 'py10l1', title: '线程、进程与协程怎么选', key: 'GIL · asyncio', time: 16,
          blocks: [
            { t: 'p', x: '先记结论，再讲原因：**IO 密集用线程或协程，CPU 密集用多进程**。搞反了，程序不但不快，反而更慢。' },
            { t: 'table', head: ['方式', '适合', '不适合', '一句话'], rows: [
              ['多线程 threading', '等网络、等文件', '大量计算', '受 GIL 限制，同一时刻只有一个线程跑 Python 字节码'],
              ['多进程 multiprocessing', '大量计算', '频繁通信', '每个进程独立解释器，真正并行'],
              ['协程 asyncio', '高并发 IO', 'CPU 计算', '单线程内切换，开销最小']
            ] },
            { t: 'p', x: '**GIL（全局解释器锁）** 是 CPython 的实现细节：同一时刻只允许一个线程执行 Python 字节码。所以多线程做计算不会变快；但线程在等 IO 时会释放 GIL，这时其他线程就能跑——这就是「IO 密集用线程」的原因。' },
            { t: 'h', x: '多线程：最小可用模板' },
            { t: 'code', x: 'import threading\n\nresult = []\n\ndef work(n):\n    result.append(n * n)\n\nthreads = [threading.Thread(target=work, args=(i,)) for i in range(4)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()          # 等所有线程结束\n\nprint(sorted(result))', out: '[0, 1, 4, 9]' },
            { t: 'warn', x: '`t.join()` 一个都不能少。不 join 的话主线程可能先结束，你看到的 `result` 是不完整的。**start 之后必须 join** 是并发的铁律。' },
            { t: 'h', x: '共享数据的坑' },
            { t: 'code', x: 'import threading\n\ncount = 0\nlock = threading.Lock()\n\ndef add():\n    global count\n    for _ in range(1000):\n        with lock:            # 加锁保护\n            count += 1\n\nts = [threading.Thread(target=add) for _ in range(5)]\nfor t in ts:\n    t.start()\nfor t in ts:\n    t.join()\nprint(count)', out: '5000' },
            { t: 'note', x: '`count += 1` 看着是一步，实际上是「读 → 加 → 写」三步，两个线程交叉执行就会丢更新。去掉 `with lock` 跑几次，你会看到小于 5000 的结果。' },
            { t: 'h', x: '协程：单线程的高并发' },
            { t: 'code', x: 'import asyncio\n\nasync def task(n):\n    await asyncio.sleep(0)      # 模拟 IO 等待\n    return n * 2\n\nasync def main():\n    results = await asyncio.gather(task(1), task(2), task(3))\n    print(results)\n\nasyncio.run(main())', out: '[2, 4, 6]' },
            { t: 'code', x: '# 协程的本质：遇到 await 就交出控制权\nimport asyncio\n\nasync def step(name):\n    print("开始", name)\n    await asyncio.sleep(0)\n    print("结束", name)\n\nasync def main():\n    await asyncio.gather(step("A"), step("B"))\n\nasyncio.run(main())', out: '开始 A\n开始 B\n结束 A\n结束 B' },
            { t: 'principle', x: '**先测量，再优化。** 不确定瓶颈在哪就上并发，通常只是把代码搞复杂了。单线程跑 10 秒的程序，先看看是不是算法写错了，而不是急着开线程。' }
          ]
        },
        {
          id: 'py10l2', title: '项目实战：命令行任务管理器', key: '综合运用', time: 20,
          blocks: [
            { t: 'p', x: '这一节把前面所有东西串起来：用 dataclass 表示数据、用字典做索引、用 JSON 做持久化、用异常处理坏输入、用函数拆分职责。这段代码不到 40 行，但用到了九成的基础语法。' },
            { t: 'h', x: '第一步：定义数据结构' },
            { t: 'code', x: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Task:\n    id: int\n    title: str\n    done: bool = False\n    tags: list = field(default_factory=list)\n\nt = Task(1, "看完第 10 章")\nprint(t)\nprint(t.title, t.done)', out: "Task(id=1, title='看完第 10 章', done=False, tags=[])\n看完第 10 章 False" },
            { t: 'h', x: '第二步：核心操作' },
            { t: 'code', x: 'from dataclasses import dataclass\n\n@dataclass\nclass Task:\n    id: int\n    title: str\n    done: bool = False\n\nclass TaskBook:\n    def __init__(self):\n        self.tasks = []\n\n    def add(self, title):\n        if not title.strip():\n            raise ValueError("标题不能为空")\n        t = Task(len(self.tasks) + 1, title.strip())\n        self.tasks.append(t)\n        return t\n\n    def finish(self, tid):\n        for t in self.tasks:\n            if t.id == tid:\n                t.done = True\n                return t\n        raise KeyError(f"没有编号为 {tid} 的任务")\n\n    def pending(self):\n        return [t for t in self.tasks if not t.done]\n\nbook = TaskBook()\nbook.add("看完 Python 第 10 章")\nbook.add("写一个小爬虫")\nbook.finish(1)\n\nfor t in book.tasks:\n    mark = "✓" if t.done else " "\n    tid, title = t.id, t.title\n    print(f"[{mark}] {tid}. {title}")\nprint("未完成：", len(book.pending()))', out: '[✓] 1. 看完 Python 第 10 章\n[ ] 2. 写一个小爬虫\n未完成： 1' },
            { t: 'h', x: '第三步：持久化成 JSON' },
            { t: 'code', x: 'import json\nfrom dataclasses import dataclass, asdict\n\n@dataclass\nclass Task:\n    id: int\n    title: str\n    done: bool = False\n\ntasks = [Task(1, "看完第 10 章", True), Task(2, "写爬虫", False)]\n\nraw = json.dumps([asdict(t) for t in tasks], ensure_ascii=False, indent=2)\nprint(raw)\n\nback = [Task(**d) for d in json.loads(raw)]\nprint(back[0].title, back[0].done, len(back))', out: '[\n  {\n    "id": 1,\n    "title": "看完第 10 章",\n    "done": true\n  },\n  {\n    "id": 2,\n    "title": "写爬虫",\n    "done": false\n  }\n]\n看完第 10 章 True 2' },
            { t: 'note', x: '`asdict()` 把 dataclass 转成普通字典，`Task(**d)` 再用字典还原对象。这两个操作配合 JSON，就能实现「关掉程序再打开，数据还在」。' },
            { t: 'h', x: '第四步：接上命令行' },
            { t: 'code', x: '# 真实项目里用 argparse 解析命令行参数\nimport argparse\n\np = argparse.ArgumentParser(description="任务管理")\np.add_argument("action", choices=["add", "list", "done"])\np.add_argument("value", nargs="?", default="")\n\n# 模拟执行 python todo.py add "写爬虫"\nargs = p.parse_args(["add", "写爬虫"])\nprint(args.action, repr(args.value))\n\nargs2 = p.parse_args(["list"])\nprint(args2.action, repr(args2.value))', out: "add '写爬虫'\nlist ''" },
            { t: 'table', head: ['这一步用到了', '第几章'], rows: [
              ['dataclass 定义数据', '第 7 章'],
              ['字典 / 列表 / 推导式', '第 4 章'],
              ['函数拆分与异常', '第 5、6 章'],
              ['JSON 持久化', '第 9 章'],
              ['命令行参数', '第 9 章']
            ] },
            { t: 'tip', x: '把这个例子真正落到磁盘上，只需要把 `json.dumps` 换成 `json.dump(..., open(path, "w"))`，再在启动时读回来。**这就是一个能写进简历的小作品。**' },
            { t: 'principle', x: '**小项目也要分层。** 数据（Task）、存储（读写 JSON）、界面（argparse）分开写，任何一层想换实现都不用动其他层。这个习惯比会多少语法重要得多。' }
          ]
        }
      ]
    },
/*CHAPTERS*/
  ],
  quiz: [
    { id: 'pyq1', ch: 'py1', lesson: 'py1l1', point: '执行模型', type: 'choice', diff: 1,
      prompt: '关于 Python 的执行方式，下面哪种说法准确？',
      opts: ['先把源码整体编译成可执行文件，再运行', '先编译成字节码，再由虚拟机逐条解释执行', '完全不需要编译，解释器逐字读源码执行', '只在第一次运行时编译，之后完全不需要解释器'],
      ans: 1,
      explain: 'Python 会先把 `.py` 编译成字节码（缓存在 `__pycache__`），再由 CPython 虚拟机执行。所以它既有编译环节，也依赖解释器。' },
    { id: 'pyq2', ch: 'py1', lesson: 'py1l1', point: 'print 细节', type: 'output', diff: 1,
      prompt: '写出下面代码的输出。',
      code: 'print("3" + "4")\nprint(3 + 4)\nprint("a", "b", sep="-")\nprint("x", end="!")\nprint("y")',
      answer: '34\n7\na-b\nx!y',
      explain: '`"3" + "4"` 是字符串拼接得 `34`；数字相加得 `7`；`sep` 改分隔符；`end="!"` 让这行不换行，下一句紧接着输出，所以最后是 `x!y`。' },
    { id: 'pyq3', ch: 'py1', lesson: 'py1l2', point: '引用模型', type: 'choice', diff: 2,
      prompt: '下面代码打印什么？',
      code: 'a = [1, 2]\nb = a\nb += [3]\nprint(a, a is b)',
      opts: ['[1, 2] False', '[1, 2, 3] True', '[1, 2, 3] False', '[1, 2] True'],
      ans: 1,
      explain: '`b = a` 只是贴了第二张标签，`b += [3]` 对列表是原地修改，a 看到的是同一个对象，所以一起变成 `[1,2,3]`，`is` 判断仍是同一对象。' },
    { id: 'pyq4', ch: 'py1', lesson: 'py1l2', point: '浅拷贝', type: 'choice', diff: 2,
      prompt: '`grid = [[0] * 2] * 2` 之后执行 `grid[0][0] = 9`，结果是什么？',
      opts: ['[[9, 0], [0, 0]]', '[[9, 0], [9, 0]]', '报错', '[[0, 0], [9, 0]]'],
      ans: 1,
      explain: '`* 2` 复制的是**引用**，两行指向同一个列表对象，改一行两行都变。正确写法是 `[[0] * 2 for _ in range(2)]`。' },

    { id: 'pyq5', ch: 'py2', lesson: 'py2l1', point: '类型转换', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'print(int("7") + 1)\nprint("7" + "1")\nprint(round(2.5), round(3.5))',
      answer: '8\n71\n2 4',
      explain: '`int("7")` 拿到整数 7 再加 1；两个字符串相加是拼接得 `71`；`round` 是「四舍六入五取偶」，所以 2.5 得 2，3.5 得 4。' },
    { id: 'pyq6', ch: 'py2', lesson: 'py2l2', point: '切片', type: 'choice', diff: 2,
      prompt: '`s = "abcdefg"`，`s[1:6:2]` 的结果是？',
      opts: ['"bdf"', '"bcd"', '"bdfg"', '"ace"'],
      ans: 0,
      explain: '切片的三个参数是「起点、终点(不含)、步长」。从下标 1 开始到下标 6 之前，每隔 2 取一个：b(1)、d(3)、f(5)。' },
    { id: 'pyq7', ch: 'py2', lesson: 'py2l3', point: 'f-string', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'x = 3.14159\nprint(f"{x:.2f}")\nprint(f"{x:>8.3f}|")\nprint(f"{0.256:.1%}")',
      answer: '3.14\n   3.142|\n25.6%',
      explain: '`.2f` 保留两位小数；`>8.3f` 表示宽度 8、右对齐、保留 3 位；`.1%` 先乘 100 再加百分号。' },
    { id: 'pyq8', ch: 'py2', lesson: 'py2l4', point: '短路求值', type: 'choice', diff: 2,
      prompt: '`print(0 or "默认")` 和 `print("值" and 5)` 分别输出什么？',
      opts: ['False 和 True', '默认 和 5', '默认 和 True', 'True 和 5'],
      ans: 1,
      explain: '`and`/`or` 返回的是**操作数本身**，不是布尔值。`0 or "默认"` 左边为假返回右边；`"值" and 5` 左边为真返回右边。' },

    { id: 'pyq9', ch: 'py3', lesson: 'py3l1', point: '真值判断', type: 'choice', diff: 1,
      prompt: '下面哪个值在 `if` 判断中为**真**？',
      opts: ['[]', '0', '""', '[0]'],
      ans: 3,
      explain: '空容器、数字 0、空字符串、None 都是假。`[0]` 是「装了一个 0 的列表」，非空即为真。' },
    { id: 'pyq10', ch: 'py3', lesson: 'py3l2', point: 'range', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'print(list(range(1, 10, 3)))\nprint([i for i in range(5) if i % 2])\nprint(list(range(3, 0, -1)))',
      answer: '[1, 4, 7]\n[1, 3]\n[3, 2, 1]',
      explain: '`range(起点, 终点不含, 步长)`；`if i % 2` 利用「非零即真」筛选奇数；负数步长用于倒序。' },
    { id: 'pyq11', ch: 'py3', lesson: 'py3l3', point: 'for-else', type: 'choice', diff: 3,
      prompt: '关于 `for ... else` ，下面哪种说法对？',
      opts: ['else 里是循环体，每次迭代都执行', 'else 在循环被 break 时执行', 'else 在循环正常结束（没被 break）时执行', 'Python 不支持 for-else'],
      ans: 2,
      explain: '这是专门用来表达「找遍了也没找到」的结构。一旦 `break`，else 就跳过；一路跑完才执行。' },
    { id: 'pyq12', ch: 'py3', lesson: 'py3l3', point: 'break/continue', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'total = 0\nfor i in range(1, 6):\n    if i == 3:\n        continue\n    if i == 5:\n        break\n    total += i\nprint(total)',
      answer: '7',
      explain: 'i=1、2 累加得 3；i=3 被 continue 跳过；i=4 累加得 7；i=5 触发 break 结束循环。所以结果是 7。' },

    { id: 'pyq13', ch: 'py4', lesson: 'py4l1', point: 'sort 返回值', type: 'choice', diff: 2,
      prompt: '`a = [3, 1, 2]` 之后执行 `a = a.sort()`，a 现在是什么？',
      opts: ['[1, 2, 3]', 'None', '[3, 1, 2]', '报错'],
      ans: 1,
      explain: '`list.sort()` 是**原地**排序，返回值是 None。想拿到新列表要用 `sorted(a)`。' },
    { id: 'pyq14', ch: 'py4', lesson: 'py4l3', point: 'dict get', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'd = {"a": 1, "b": 2}\nd["c"] = d.get("c", 0) + 3\nprint(d)\nprint(sorted(d.values()))',
      answer: "{'a': 1, 'b': 2, 'c': 3}\n[1, 2, 3]",
      explain: '`get("c", 0)` 在键不存在时返回默认值 0，所以算出 3 并写入。这是「计数」最常用的写法。' },
    { id: 'pyq15', ch: 'py4', lesson: 'py4l4', point: '集合运算', type: 'choice', diff: 2,
      prompt: '`a = {1,2,3}`、`b = {2,3,4}`，`a - b` 的结果是？',
      opts: ['{1}', '{4}', '{1, 4}', '{2, 3}'],
      ans: 0,
      explain: '差集表示「在 a 里但不在 b 里」。`{1,4}` 是 `a ^ b`（对称差）。' },
    { id: 'pyq16', ch: 'py4', lesson: 'py4l5', point: '推导式', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'm = [[1, 2], [3, 4]]\nprint([x * 10 for row in m for x in row if x % 2 == 0])\nprint({k: len(k) for k in ["ab", "c"]})',
      answer: '[20, 40]\n{\'ab\': 2, \'c\': 1}',
      explain: '两层 for 的顺序是「先外层后内层」，相当于把嵌套结构展平后再筛选。字典推导的写法是 `{键: 值 for ...}`。' },

    { id: 'pyq17', ch: 'py5', lesson: 'py5l2', point: '默认参数陷阱', type: 'choice', diff: 3,
      prompt: '`def f(x, lst=[]): lst.append(x); return lst`，连续调用 `f(1)` 和 `f(2)`，第二次返回什么？',
      opts: ['[2]', '[1, 2]', '[]', '报错'],
      ans: 1,
      explain: '默认值只在函数**定义时**求值一次，那个列表被所有调用共享。正确做法是用 `None` 占位，进函数后再新建列表。' },
    { id: 'pyq18', ch: 'py5', lesson: 'py5l2', point: '可变参数', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'def f(a, b=2, *args):\n    return a + b + sum(args)\nprint(f(1))\nprint(f(1, 3))\nprint(f(1, 3, 4, 5))',
      answer: '3\n4\n13',
      explain: '`b=2` 是默认值，不传就用 2；`*args` 收集剩余的位置参数成元组，`sum(())` 是 0。所以 1+2=3、1+3=4、1+3+4+5=13。' },
    { id: 'pyq19', ch: 'py5', lesson: 'py5l3', point: '作用域', type: 'choice', diff: 2,
      prompt: '在函数内部要给**全局变量**重新赋值，需要怎么做？',
      opts: ['直接赋值即可', '先写 global 声明', '先写 nonlocal 声明', '不可能做到'],
      ans: 1,
      explain: '不加 `global` 时，函数内的赋值会创建一个新的局部变量。`nonlocal` 是给「外层函数」的变量用的，对模块级全局无效。' },
    { id: 'pyq20', ch: 'py5', lesson: 'py5l5', point: '高阶函数', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'data = [("b", 2), ("a", 3), ("c", 1)]\nprint(sorted(data, key=lambda x: x[1]))\nprint(sorted(data, key=lambda x: -x[1])[0])',
      answer: "[('c', 1), ('b', 2), ('a', 3)]\n('a', 3)",
      explain: '`key` 指定「按什么排序」，按第二项升序得到 c、b、a；用负号把升序变成降序，所以第一个是数值最大的。' },
    { id: 'pyq21', ch: 'py6', lesson: 'py6l1', point: 'open 模式', type: 'choice', diff: 1,
      prompt: '用 `"w"` 模式打开一个已经有内容的文件，会发生什么？',
      opts: ['内容保留，新内容追加到末尾', '文件立刻被清空，然后写入新内容', '直接报错，必须先删除文件', '只能读，不能写'],
      ans: 1,
      explain: '`"w"` 会在打开的瞬间截断文件——哪怕你一行都没写，原内容也已经没了。要保留原内容得用 `"a"` 追加模式。' },
    { id: 'pyq22', ch: 'py6', lesson: 'py6l3', point: '异常流程', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'try:\n    print(1 / 0)\nexcept ZeroDivisionError:\n    print("错了")\nelse:\n    print("没错")\nfinally:\n    print("收尾")',
      answer: '错了\n收尾',
      explain: '发生异常 → 走 except，跳过 else（else 只在 try 全部成功时执行），最后 finally 无论如何都执行。' },
    { id: 'pyq23', ch: 'py6', lesson: 'py6l2', point: '编码', type: 'choice', diff: 2,
      prompt: '在 Windows 上读取 UTF-8 编码的中文文件，没写 `encoding` 参数，最可能出现什么？',
      opts: ['正常读出，编码会自动识别', 'UnicodeDecodeError 或中文乱码', '文件内容被清空', '读取速度变慢'],
      ans: 1,
      explain: 'Windows 中文系统的默认编码是 GBK，用它去解 UTF-8 字节必然出错或乱码。这就是「在我电脑上能跑」的头号原因。' },
    { id: 'pyq24', ch: 'py6', lesson: 'py6l4', point: '自定义异常', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class MyError(Exception):\n    pass\n\ndef check(n):\n    if n < 0:\n        raise MyError("负数")\n    return n * 2\n\nprint(check(3))\ntry:\n    check(-1)\nexcept MyError as e:\n    print("捕获：", e)',
      answer: '6\n捕获： 负数',
      explain: '自定义异常只需要继承 `Exception`。`raise` 抛出后由最近的 `except` 接住，`as e` 拿到异常对象，`str(e)` 就是传入的消息。' },

    { id: 'pyq25', ch: 'py7', lesson: 'py7l1', point: '类属性', type: 'choice', diff: 2,
      prompt: '`class A: items = []` 这样的写法有什么问题？',
      opts: ['语法错误，不能这样写', '所有实例共享同一个列表，改一个全变', '每个实例会自动复制一份', '列表不能作为类属性'],
      ans: 1,
      explain: '类属性只创建一次，所有实例读到的是同一个对象。可变状态必须放到 `__init__` 里，每个实例各建一份。' },
    { id: 'pyq26', ch: 'py7', lesson: 'py7l4', point: '继承与 super', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class A:\n    def __init__(self, n):\n        self.n = n\n\n    def show(self):\n        return "A" + str(self.n)\n\nclass B(A):\n    def show(self):\n        return "B" + super().show()\n\nb = B(5)\nprint(b.show())\nprint(b.n)',
      answer: 'BA5\n5',
      explain: '`super().show()` 调用父类版本，返回 "A5"，子类再接上 "B"。`b.n` 是父类 `__init__` 写进去的，所以能直接读到。' },
    { id: 'pyq27', ch: 'py7', lesson: 'py7l3', point: 'property', type: 'choice', diff: 2,
      prompt: '给方法加上 `@property` 之后，主要作用是什么？',
      opts: ['提升执行速度', '把方法变成可读属性，并能在取值时做校验或计算', '自动缓存返回值', '把方法变成私有'],
      ans: 1,
      explain: '`@property` 让你能用 `obj.x` 的写法访问方法，同时保留了在里面做校验、做计算的能力。配合 `@x.setter` 还能控制赋值。' },
    { id: 'pyq28', ch: 'py7', lesson: 'py7l5', point: 'dataclass', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'from dataclasses import dataclass\n\n@dataclass\nclass P:\n    x: int\n    y: int = 0\n\na = P(1)\nprint(a)\nprint(a == P(1, 0))',
      answer: 'P(x=1, y=0)\nTrue',
      explain: '`@dataclass` 自动生成了 `__init__`、`__repr__`、`__eq__`，所以打印有格式、比较按字段逐个比。' },

    { id: 'pyq29', ch: 'py8', lesson: 'py8l1', point: '迭代器特性', type: 'choice', diff: 2,
      prompt: '`it = iter([1, 2, 3])`，用 `list(it)` 转成列表后，再执行一次 `list(it)` 会得到什么？',
      opts: ['[1, 2, 3]', '[]', '报错', 'None'],
      ans: 1,
      explain: '迭代器是**一次性**的，走完就空了，再次遍历得到空列表。想复用就得重新 `iter()` 或者一开始就转成列表。' },
    { id: 'pyq30', ch: 'py8', lesson: 'py8l2', point: '生成器', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'def gen():\n    for i in range(3):\n        yield i * 2\n\ng = gen()\nprint(next(g))\nprint(list(g))',
      answer: '0\n[2, 4]',
      explain: '第一次 `next` 拿到第一个值 0，生成器停在 yield 处。之后 `list(g)` 继续从挂起处走，所以只剩 2 和 4。' },
    { id: 'pyq31', ch: 'py8', lesson: 'py8l3', point: '闭包', type: 'choice', diff: 3,
      prompt: '循环里用 `lambda` 造函数，`[lambda: i for i in range(3)]` 里每个函数返回的值是什么？',
      opts: ['0、1、2', '都是 2', '都是 0', '报错'],
      ans: 1,
      explain: 'lambda 里引用的是变量 `i` 本身，不是当时的值。循环结束后 i 停在 2，所以所有函数都返回 2。用 `lambda i=i: i` 在定义时把值绑住。' },
    { id: 'pyq32', ch: 'py8', lesson: 'py8l4', point: '装饰器', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'import functools\n\ndef tag(func):\n    @functools.wraps(func)\n    def w(*a):\n        return "[" + str(func(*a)) + "]"\n    return w\n\n@tag\ndef f(x):\n    return x * 2\n\nprint(f(3))\nprint(f.__name__)',
      answer: '[6]\nf',
      explain: '装饰器把 f 换成了 w，w 内部调用原函数并把结果包上方括号。`functools.wraps` 保留了原函数名，所以 `__name__` 还是 f。' },

    { id: 'pyq33', ch: 'py9', lesson: 'py9l1', point: 'import', type: 'choice', diff: 1,
      prompt: '为什么不推荐写 `from math import *`？',
      opts: ['速度太慢', '会把一堆名字塞进当前命名空间，可能覆盖你自己定义的同名变量', 'Python 3 已不支持', '只能导入函数不能导入常量'],
      ans: 1,
      explain: '星号导入让你无法判断某个名字来自哪里，一旦和自己定义的变量重名就会悄悄覆盖，且很难排查。' },
    { id: 'pyq34', ch: 'py9', lesson: 'py9l2', point: 'datetime', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'from datetime import date, timedelta\n\nd = date(2026, 1, 31)\nprint(d + timedelta(days=1))\nprint(d.strftime("%Y/%m"))',
      answer: '2026-02-01\n2026/01',
      explain: '`timedelta` 做日期加减会自动处理跨月（1 月 31 日加一天是 2 月 1 日）。`strftime` 把日期格式化成指定样式。' },
    { id: 'pyq35', ch: 'py9', lesson: 'py9l2', point: 'json', type: 'choice', diff: 1,
      prompt: '`json.dumps` 和 `json.loads` 分别做什么？',
      opts: ['都是写文件', '前者把对象转成字符串，后者把字符串转成对象', '前者读文件，后者写文件', '两者等价，只是名字不同'],
      ans: 1,
      explain: '带 s 的处理**字符串**：dumps 是序列化，loads 是反序列化。不带 s 的 `dump` / `load` 才是直接读写文件。' },
    { id: 'pyq36', ch: 'py9', lesson: 'py9l2', point: '正则', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'import re\n\ns = "a1b22c333"\nprint(re.findall(r"\\d+", s))\nprint(re.sub(r"\\d", "#", s))\nprint(len(re.findall(r"\\d", s)))',
      answer: "['1', '22', '333']\na#b##c###\n6",
      explain: '`\\d+` 匹配一段连续数字，所以得到三段；`sub` 是逐字符替换，每个数字都变 #；`findall` 配 `\\d` 则是一个一个匹配，共 6 个。' },

    { id: 'pyq37', ch: 'py10', lesson: 'py10l1', point: 'GIL', type: 'choice', diff: 3,
      prompt: '用多线程做大量数学计算，为什么速度几乎没变快？',
      opts: ['因为 CPU 只有一个核', '因为 GIL 限制同一时刻只有一个线程执行 Python 字节码', '因为线程创建太慢', '因为 Python 根本不支持真正的线程'],
      ans: 1,
      explain: 'CPython 的全局解释器锁让计算类任务无法真正并行。计算密集应该用多进程（每个进程有独立解释器），IO 密集才用线程。' },
    { id: 'pyq38', ch: 'py10', lesson: 'py10l1', point: '线程同步', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import threading\n\nout = []\nlock = threading.Lock()\n\ndef w(n):\n    with lock:\n        out.append(n)\n\nts = [threading.Thread(target=w, args=(i,)) for i in range(3)]\nfor t in ts:\n    t.start()\nfor t in ts:\n    t.join()\n\nprint(sorted(out))',
      answer: '[0, 1, 2]',
      explain: '线程执行顺序不确定，所以要先 `sorted` 再比较。关键是 `join` 保证主线程等到所有子线程结束才继续。' },
    { id: 'pyq39', ch: 'py10', lesson: 'py10l1', point: '场景选型', type: 'choice', diff: 2,
      prompt: '要同时请求 100 个网页地址并汇总结果，最合适的方式是？',
      opts: ['多进程，因为要并行', '多线程或协程，因为这是 IO 密集任务', '写 100 个 for 循环', '把 100 个地址拼成一个字符串一次请求'],
      ans: 1,
      explain: '等待网络属于 IO 密集，线程在等待时会释放 GIL，所以多线程有效；协程开销更小、更适合高并发。多进程在这里反而浪费。' },
    { id: 'pyq40', ch: 'py10', lesson: 'py10l1', point: '协程', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'import asyncio\n\nasync def f(n):\n    await asyncio.sleep(0)\n    return n + 1\n\nasync def main():\n    print(await asyncio.gather(f(1), f(2)))\n\nasyncio.run(main())',
      answer: '[2, 3]',
      explain: '`gather` 并发执行多个协程并按传入顺序收集结果。`asyncio.run` 负责创建事件循环并运行到底。' },
  ],
  checkin: [
    { id: 'pyk1', ch: 'py1', lesson: 'py1l1', point: 'REPL 用途', type: 'choice', diff: 1,
      prompt: '下面哪种情况最适合打开 REPL（命令行里直接敲 `python`）？',
      opts: ['写一个正式的项目', '想快速验证某个函数的返回值或试一小段语法', '把脚本部署到服务器', '处理一个 2GB 的日志文件'],
      ans: 1,
      explain: 'REPL 的价值是「立刻看到结果」，适合试语法、验算、确认某个方法的行为。正式代码还是要写进文件。' },
    { id: 'pyk2', ch: 'py1', lesson: 'py1l1', point: 'sep 与 end', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'print("a", "b", sep="")\nprint("c", "d", sep="|", end="?")\nprint("e")',
      answer: 'ab\nc|d?e',
      explain: '`sep=""` 让两个值紧贴；第二行 `end="?"` 表示这行结尾不换行而是输出问号，所以下一句的 e 接在同一行。' },
    { id: 'pyk3', ch: 'py1', lesson: 'py1l3', point: '虚拟环境', type: 'choice', diff: 1,
      prompt: '虚拟环境主要解决什么问题？',
      opts: ['让代码运行得更快', '隔离不同项目的第三方依赖版本', '自动生成测试用例', '压缩项目体积'],
      ans: 1,
      explain: '每个项目一套独立的包目录，A 项目要 requests 2.20、B 项目要 2.31 也不会打架。它不影响运行速度。' },
    { id: 'pyk4', ch: 'py1', lesson: 'py1l2', point: 'is 与 ==', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'a = [1]\nb = a[:]\nprint(a == b, a is b)\nprint(id(a) == id(b))',
      answer: 'True False\nFalse',
      explain: '`a[:]` 生成一个新列表，内容相同但对象不同。所以 `==` 为真、`is` 为假、`id` 也不同。' },

    { id: 'pyk5', ch: 'py2', lesson: 'py2l2', point: '字符串方法', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 's = " abc "\nprint(s.strip().upper())\nprint("a,b".split(","))\nprint("x".join(["1", "2"]))',
      answer: "ABC\n['a', 'b']\n1x2",
      explain: '`strip()` 去两端空格，`upper()` 转大写，可以链式调用。`split` 返回列表，`join` 用指定字符把列表拼成字符串。' },
    { id: 'pyk6', ch: 'py2', lesson: 'py2l4', point: '整除方向', type: 'choice', diff: 2,
      prompt: '`-7 // 2` 的结果是？',
      opts: ['-3', '-4', '3', '-3.5'],
      ans: 1,
      explain: '`//` 是**向下取整**，不是向零截断。-3.5 向下取整是 -4。如果写 `int(-7/2)` 才会得到 -3。' },
    { id: 'pyk7', ch: 'py2', lesson: 'py2l3', point: '格式规范', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'n = 7\nprint(f"{n:03d}")\nprint(f"{n / 3:.2f}")\nprint(f"{n:b}")',
      answer: '007\n2.33\n111',
      explain: '`03d` 是「宽度 3、左边补零」；`.2f` 保留两位小数；`b` 转二进制，7 的二进制是 111。' },
    { id: 'pyk8', ch: 'py2', lesson: 'py2l1', point: '判空', type: 'choice', diff: 1,
      prompt: '判断一个变量是否为 None，正确的写法是？',
      opts: ['if x == None', 'if x is None', 'if not x', 'if x is not 0'],
      ans: 1,
      explain: '`is` 比较的是对象身份，None 是单例，所以 `is None` 最准确。`if not x` 会把 0、空串、空列表也判成假，不适用于判 None。' },

    { id: 'pyk9', ch: 'py3', lesson: 'py3l2', point: 'while 累加', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'n = 3\ntotal = 0\nwhile n > 0:\n    total += n\n    n -= 1\nprint(total)',
      answer: '6',
      explain: 'n 依次是 3、2、1，累加得 6，然后 n 变 0 退出循环。while 三要素：初始值、条件、推进，缺推进就死循环。' },
    { id: 'pyk10', ch: 'py3', lesson: 'py3l2', point: '选型', type: 'choice', diff: 1,
      prompt: '什么情况下应该用 while 而不是 for？',
      opts: ['遍历一个列表', '重复次数事先不知道，取决于某个条件何时满足', '固定要跑 5 次', '必须配合 range 使用'],
      ans: 1,
      explain: '次数确定用 for（配合 range 或直接遍历容器），次数不确定——比如「一直读到文件结束」「直到用户输入 quit」——才用 while。' },
    { id: 'pyk11', ch: 'py3', lesson: 'py3l3', point: '嵌套循环', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'out = []\nfor i in range(2):\n    for j in range(2):\n        out.append(i * 10 + j)\nprint(out)',
      answer: '[0, 1, 10, 11]',
      explain: '外层 i 每取一个值，内层 j 都要完整跑一遍。所以顺序是 (0,0)(0,1)(1,0)(1,1)，换算后得到这四个数。' },
    { id: 'pyk12', ch: 'py3', lesson: 'py3l3', point: '遍历时删除', type: 'choice', diff: 2,
      prompt: '想在 for 循环里删掉列表中的某些元素，正确做法是？',
      opts: ['直接 for x in lst 里 remove', '遍历副本 for x in lst[:]，或者用推导式造新列表', '用 while True 死循环', 'Python 不允许删除'],
      ans: 1,
      explain: '边遍历边删会让迭代器跳过元素。遍历副本（`lst[:]`）或者干脆造一个新列表，都是安全做法。' },

    { id: 'pyk13', ch: 'py4', lesson: 'py4l1', point: '列表操作', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'a = [3, 1, 2]\na.append(4)\na.sort()\nprint(a[:2])\nprint(a[-1])\nprint(1 in a)',
      answer: '[1, 2]\n4\nTrue',
      explain: 'append 到末尾，sort 升序排成 [1,2,3,4]。切片 `[:2]` 取前两个，`[-1]` 取最后一个，`in` 判断存在。' },
    { id: 'pyk14', ch: 'py4', lesson: 'py4l4', point: '保序去重', type: 'choice', diff: 2,
      prompt: '既要给列表去重，又要保持原来的先后顺序，应该用？',
      opts: ['set(lst)', 'list(dict.fromkeys(lst))', 'sorted(set(lst))', 'lst.unique()'],
      ans: 1,
      explain: '`set` 会打乱顺序，`sorted` 会重排。`dict.fromkeys` 利用字典保序的特性去重，是保序去重的标准写法。' },
    { id: 'pyk15', ch: 'py4', lesson: 'py4l3', point: '遍历字典', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'd = {"x": 1, "y": 2}\nfor k in d:\n    d[k] *= 10\nprint(d)',
      answer: "{'x': 10, 'y': 20}",
      explain: '只改值不改键，不会破坏字典结构，所以这样遍历是安全的。但如果在循环里增删键就会抛 RuntimeError。' },
    { id: 'pyk16', ch: 'py4', lesson: 'py4l2', point: '单元素元组', type: 'choice', diff: 1,
      prompt: '下面哪个才是「只含一个元素 1」的元组？',
      opts: ['(1)', '(1,)', '[1]', 'tuple(1)'],
      ans: 1,
      explain: '`(1)` 只是加了括号的整数，类型是 int。单元素元组必须带逗号。`tuple(1)` 会报错，因为 1 不可迭代。' },

    { id: 'pyk17', ch: 'py5', lesson: 'py5l1', point: '默认返回', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'def f():\n    pass\n\ndef g():\n    return\n\nprint(f(), g())',
      answer: 'None None',
      explain: '没有 return 语句、或者 return 后面什么都不写，函数的返回值都是 None。' },
    { id: 'pyk18', ch: 'py5', lesson: 'py5l1', point: 'print 与 return', type: 'choice', diff: 1,
      prompt: '函数里的 `print` 和 `return` 有什么区别？',
      opts: ['完全等价，随便用', 'print 把内容输出到屏幕，return 把值交给调用方继续使用', 'return 只能返回字符串', 'print 会自动帮你 return'],
      ans: 1,
      explain: '`print` 的结果程序拿不到，`return` 的结果才能被赋值、被继续计算。函数只 print 不 return，调用方拿到的是 None。' },
    { id: 'pyk19', ch: 'py5', lesson: 'py5l4', point: '递归', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'def s(n):\n    return 0 if n == 0 else n + s(n - 1)\n\nprint(s(4))',
      answer: '10',
      explain: '展开是 4 + 3 + 2 + 1 + 0 = 10。`n == 0` 就是基线条件，负责让递归停下来。' },
    { id: 'pyk20', ch: 'py5', lesson: 'py5l5', point: 'lambda 场景', type: 'choice', diff: 2,
      prompt: '下面哪个场景最适合用 lambda？',
      opts: ['写一个二十行的工具函数', '给 `sorted` 的 `key` 参数传一个简单的取值表达式', '定义一个带三个方法的类', '捕获并处理异常'],
      ans: 1,
      explain: 'lambda 只能写一个表达式，价值在于「就地定义一个小转换」。超过一行就该用 def，别为了短而牺牲可读性。' },

    { id: 'pyk21', ch: 'py6', lesson: 'py6l3', point: '异常匹配', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'try:\n    {}["k"]\nexcept KeyError:\n    print("没有这个键")\nexcept Exception:\n    print("其他错误")',
      answer: '没有这个键',
      explain: '`except` 自上而下匹配，命中第一个就跳出。KeyError 属于 Exception 的子类，但前面的分支已经接住了。' },
    { id: 'pyk22', ch: 'py6', lesson: 'py6l1', point: 'with 的作用', type: 'choice', diff: 1,
      prompt: '用 `with open(...) as f:` 相比手动 open/close，最关键的收益是？',
      opts: ['读取速度更快', '即使代码块中途抛出异常，文件也会被正确关闭', '自动给文件加锁', '自动备份原文件'],
      ans: 1,
      explain: '`with` 保证退出代码块时一定执行关闭操作，避免句柄泄漏。手动 close 一旦中间报错就跳过了。' },
    { id: 'pyk23', ch: 'py6', lesson: 'py6l2', point: '路径后缀', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'from pathlib import PurePosixPath\n\np = PurePosixPath("/a/b/c.tar.gz")\nprint(p.name)\nprint(p.suffix)\nprint(p.stem)',
      answer: 'c.tar.gz\n.gz\nc.tar',
      explain: '`suffix` 只取**最后一个**后缀。要拿完整的 `.tar.gz` 得自己拼，或者判断 `p.suffixes`（返回列表）。' },
    { id: 'pyk24', ch: 'py6', lesson: 'py6l4', point: 'assert 的坑', type: 'choice', diff: 2,
      prompt: '为什么不能用 `assert` 来校验用户输入？',
      opts: ['assert 执行太慢', '用 `python -O` 运行时会移除所有 assert，校验就凭空消失了', 'assert 只能校验数字', 'assert 会修改数据'],
      ans: 1,
      explain: 'assert 的定位是「开发期的内部自检」。生产环境常带 `-O` 优化，届时所有 assert 都会被删掉。用户输入要用 if + raise。' },

    { id: 'pyk25', ch: 'py7', lesson: 'py7l1', point: '实例覆盖', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class A:\n    kind = "A"\n\na = A()\na.kind = "B"\nprint(a.kind, A.kind)\nprint(A().kind)',
      answer: 'B A\nA',
      explain: '`a.kind = "B"` 是在**实例上**新建了一个属性，把类属性遮住了。类属性本身没变，所以新建的对象仍然是 A。' },
    { id: 'pyk26', ch: 'py7', lesson: 'py7l4', point: '继承还是组合', type: 'choice', diff: 2,
      prompt: '什么时候该用继承，什么时候该用组合？',
      opts: ['继承永远更好，能用就用', '「A 是 B」用继承，「A 有 B」用组合', '两者完全等价', '组合无法访问被包含对象的属性'],
      ans: 1,
      explain: '狗是动物 → 继承；汽车有引擎 → 组合。判断不对就是硬套继承，深层继承会让「这个方法来自哪」变成考古工作。' },
    { id: 'pyk27', ch: 'py7', lesson: 'py7l2', point: '魔术方法', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class B:\n    def __init__(self, n):\n        self.n = n\n\n    def __len__(self):\n        return self.n\n\nprint(len(B(3)))\nprint(bool(B(0)))',
      answer: '3\nFalse',
      explain: '`__len__` 让对象支持 `len()`。没有 `__bool__` 时，Python 会用 `__len__` 的返回值判断真假，0 就是假。' },
    { id: 'pyk28', ch: 'py7', lesson: 'py7l5', point: 'frozen', type: 'choice', diff: 2,
      prompt: '`@dataclass(frozen=True)` 的效果是？',
      opts: ['创建后属性不能再修改，相当于不可变对象', '自动把对象转成 JSON', '对象之间不能比较', '所有字段变成私有'],
      ans: 0,
      explain: '不可变对象可以安全共享、可以当字典的键，改属性会抛 FrozenInstanceError。适合表达「值对象」。' },

    { id: 'pyk29', ch: 'py8', lesson: 'py8l2', point: '生成器耗竭', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'g = (x * x for x in range(4))\nprint(sum(g))\nprint(list(g))',
      answer: '14\n[]',
      explain: '`sum(g)` 把生成器走完了，0+1+4+9=14。之后 `list(g)` 只能拿到空列表——生成器是一次性的。' },
    { id: 'pyk30', ch: 'py8', lesson: 'py8l2', point: '生成器特性', type: 'choice', diff: 2,
      prompt: '关于生成器和列表的区别，下面哪种说法对？',
      opts: ['生成器可以反复遍历多次', '生成器省内存，但遍历完就空了，也不能 len()', '列表比生成器省内存', '两者除了写法没有区别'],
      ans: 1,
      explain: '生成器不存数据只存状态，所以极省内存，代价是一次性、无 `len()`、不能下标访问。' },
    { id: 'pyk31', ch: 'py8', lesson: 'py8l3', point: '闭包状态', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'def make():\n    n = 0\n    def add():\n        nonlocal n\n        n += 1\n        return n\n    return add\n\nf = make()\nprint(f(), f())\ng = make()\nprint(g())',
      answer: '1 2\n1',
      explain: '每次调用 `make()` 都会创建一套新的闭包环境，所以 f 和 g 各自独立计数。`nonlocal` 让内层能修改外层的 n。' },
    { id: 'pyk32', ch: 'py8', lesson: 'py8l4', point: '装饰器顺序', type: 'choice', diff: 3,
      prompt: '同时写 `@a` 和 `@b` 两层装饰器（a 在上），调用函数时哪一层先执行？',
      opts: ['离函数近的 b 先执行', '离函数远的 a 先执行（它包在最外层）', '顺序随机，不确定', '两个同时执行'],
      ans: 1,
      explain: '`@a @b def f` 等价于 `f = a(b(f))`，a 的 wrapper 在最外层，所以调用时先进入 a，再进入 b，最后才到原函数。' },

    { id: 'pyk33', ch: 'py9', lesson: 'py9l2', point: 'JSON 往返', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import json\n\ns = json.dumps([1, {"a": 2}])\nprint(s)\nprint(type(json.loads(s)).__name__)',
      answer: '[1, {"a": 2}]\nlist',
      explain: '`dumps` 把列表序列化成 JSON 字符串（注意字典的键会变成双引号），`loads` 再解析回来，外层是 list。' },
    { id: 'pyk34', ch: 'py9', lesson: 'py9l1', point: '__name__', type: 'choice', diff: 2,
      prompt: '`__name__` 在什么情况下等于 `"__main__"`？',
      opts: ['永远等于 __main__', '文件被直接运行时；被别人 import 时等于模块名', '永远等于文件名去掉 .py', '等于当前函数名'],
      ans: 1,
      explain: '这正是 `if __name__ == "__main__":` 能区分「当脚本跑」和「被导入」的原理，让文件既能执行又能复用。' },
    { id: 'pyk35', ch: 'py9', lesson: 'py9l2', point: 're sub', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import re\n\nprint(re.findall(r"\\d+", "x9y88z"))\nprint(re.sub(r"\\d+", "-", "x9y88z"))',
      answer: "['9', '88']\nx-y-z",
      explain: '`\\d+` 抓连续数字，得到两段。`sub` 把每段连续数字整体替换成一个 `-`，所以是 x-y-z 而不是 x---y--z。' },
    { id: 'pyk36', ch: 'py9', lesson: 'py9l3', point: '锁版本', type: 'choice', diff: 1,
      prompt: '为什么要在 `requirements.txt` 里写死版本号（如 `requests==2.31.0`）？',
      opts: ['没必要，写包名就够了', '避免半年后依赖升级导致行为变化甚至装不上', '能加快安装速度', '能减小项目体积'],
      ans: 1,
      explain: '不锁版本，每次 `pip install` 拿到的都可能是新的主版本，接口一变项目就跑不起来。锁版本 + `pip freeze` 是可复现的基本要求。' },

    { id: 'pyk37', ch: 'py10', lesson: 'py10l1', point: '锁与计数', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import threading\n\nn = 0\nlock = threading.Lock()\n\ndef add():\n    global n\n    for _ in range(100):\n        with lock:\n            n += 1\n\nts = [threading.Thread(target=add) for _ in range(2)]\nfor t in ts:\n    t.start()\nfor t in ts:\n    t.join()\nprint(n)',
      answer: '200',
      explain: '两个线程各加 100 次。有锁保护，`n += 1` 的「读-加-写」不会被打断，所以结果精确等于 200。' },
    { id: 'pyk38', ch: 'py10', lesson: 'py10l1', point: '协程场景', type: 'choice', diff: 2,
      prompt: '下面哪种任务最适合用 asyncio 协程？',
      opts: ['大规模矩阵乘法', '同时等待几百个网络请求返回', '图片逐像素处理', '编译一个大型项目'],
      ans: 1,
      explain: '协程的优势在于「等待时可以切去干别的」。纯计算任务没有等待，协程帮不上忙，反而增加调度开销。' },
    { id: 'pyk39', ch: 'py10', lesson: 'py10l1', point: '协程执行顺序', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'import asyncio\n\nasync def a():\n    print("A")\n    await asyncio.sleep(0)\n    print("A2")\n\nasync def b():\n    print("B")\n    await asyncio.sleep(0)\n    print("B2")\n\nasync def main():\n    await asyncio.gather(a(), b())\n\nasyncio.run(main())',
      answer: 'A\nB\nA2\nB2',
      explain: 'a 先跑到 `await` 处让出控制权，b 开始跑也到 `await` 让出，然后 a 恢复打印 A2，最后 b 恢复打印 B2。交错执行正是并发的体现。' },
    { id: 'pyk40', ch: 'py10', lesson: 'py10l1', point: 'join', type: 'choice', diff: 1,
      prompt: '`t.join()` 的作用是？',
      opts: ['启动线程', '让当前线程等待 t 执行结束', '强制终止线程 t', '把两个线程合并成一个'],
      ans: 1,
      explain: '不 join 的话主线程可能先结束，你会看到不完整的结果。`start()` 之后逐个 `join()` 是并发的基本写法。' },
  ]
};
