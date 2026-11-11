/* ============================================================
   CodeCraft 数据 · C++
   ============================================================ */
window.LANGS = window.LANGS || {};

window.LANGS.cpp = {
  id: 'cpp', name: 'C++', en: 'C++17', icon: '⚡', color: '#00599c',
  blurb: 'C 的性能加上抽象能力。类、容器、模板、智能指针，让它既能写操作系统内核，也能写游戏引擎和高频交易。',
  hello: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}',
  lab: [
    { name: 'Hello World', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}' },
    { name: '读两数求和', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    if (!(cin >> a >> b)) return 1;\n    cout << "sum = " << a + b << endl;\n    return 0;\n}' },
    { name: 'vector 求和平均', code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {80, 92, 66, 100};\n    int s = 0;\n    for (int x : v) s += x;\n    cout << "sum = " << s << endl;\n    cout << "avg = " << (double)s / v.size() << endl;\n    return 0;\n}' },
    { name: 'map 计数', code: '#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    map<string, int> cnt;\n    for (string w : {"a", "b", "a", "c", "a"}) cnt[w]++;\n    for (auto &p : cnt) cout << p.first << ":" << p.second << "\\n";\n    return 0;\n}' }
  ],
  chapters: [
    {
      id: 'cp1', num: 1, title: '从 C 到 C++：更安全的起点', icon: '🚪',
      intro: 'C++ 不是「带类的 C」这么简单，但它确实先从三个地方改善了你写 C 的体验：类型安全的输入输出、引用、以及能自己管长度的字符串。这三样用熟了，就能少写一半的错误。',
      goals: ['用 cin / cout 完成输入输出', '解释引用与指针的区别', '用 std::string 替代 char 数组', '知道 string 什么时候会自动扩容'],
      lessons: [
        {
          id: 'cp1l1', title: 'iostream：不再对着格式符猜', key: 'cin · cout · 类型安全', time: 10,
          blocks: [
            { t: 'p', x: 'C 的 `printf` 靠格式符告诉程序「这个参数是什么类型」，写错就是未定义行为。C++ 的 `<<` 会根据变量类型自己选怎么输出，写错了编译器直接报错。' },
            { t: 'code', x: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 42;\n    double d = 3.14159;\n    string s = "hi";\n\n    cout << n << " " << d << " " << s << "\\n";\n    cout << 7 / 2 << " " << 7 / 2.0 << "\\n";\n    cout << (n > 10) << "\\n";        /* bool 默认输出 1，不是 true */\n    cout << boolalpha << (n > 10) << "\\n";\n    return 0;\n}', out: '42 3.14159 hi\n3 3.5\n1\ntrue' },
            { t: 'table', head: ['C 写法', 'C++ 写法', '差别'], rows: [
              ['`printf("%d", n)`', '`cout << n`', '不用记格式符，类型自动匹配'],
              ['`scanf("%d", &n)`', '`cin >> n`', '不用写 `&`，也不怕漏'],
              ['`printf("%.2f")`', '`cout << fixed << setprecision(2)`', '需要 `<iomanip>`'],
              ['`printf("\\n")`', '`cout << "\\n"` 或 `endl`', '`endl` 会额外刷新缓冲区，循环里别用']
            ] },
            { t: 'code', x: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cout << "输入两个整数：";\n    if (!(cin >> a >> b)) {\n        cout << "输入不合法\\n";\n        return 1;\n    }\n    cout << "和 = " << a + b << "\\n";\n    return 0;\n}', out: '输入两个整数：3 5\n和 = 8' },
            { t: 'note', x: '`cin >> a >> b` 的返回值是 `cin` 本身，它可以隐式转成 bool：读成功为 true，遇到非法输入或文件尾为 false。所以 `if (!(cin >> x))` 是判断输入是否有效的标准写法。' },
            { t: 'warn', x: '`using namespace std;` 在练习和小工具里很方便，但在头文件里写是坏习惯——它会把 `std` 里上百个名字倒进别人的全局空间，容易撞名。真实项目里写 `std::cout`。' }
          ]
        },
        {
          id: 'cp1l2', title: '引用：给变量起个别名', key: '& · 引用传参', time: 12,
          blocks: [
            { t: 'p', x: '引用不是新变量，它是已有变量的**另一个名字**。`int &r = a;` 之后，`r` 和 `a` 就是同一块内存，改 r 就是改 a。' },
            { t: 'code', x: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 10;\n    int &r = a;      /* r 是 a 的别名 */\n    r = 20;\n    cout << a << " " << r << "\\n";\n\n    int b = 99;\n    r = b;           /* 这是赋值，不是让 r 改指向 b！ */\n    cout << a << " " << b << "\\n";\n    return 0;\n}', out: '20 20\n99 99' },
            { t: 'warn', x: '引用一旦绑定就不能改绑。上面 `r = b` 不是「r 指向 b」，而是「把 b 的值赋给 a」。想中途换目标，只能用指针。这是引用和指针最本质的区别。' },
            { t: 'h', x: '引用传参：既省拷贝又能改原值' },
            { t: 'code', x: '#include <iostream>\n#include <string>\nusing namespace std;\n\nvoid addOne(int &x) { x += 1; }                 /* 能改到外面 */\nvoid show(const string &s) { cout << s << "\\n"; } /* 不拷贝，也不许改 */\n\nint main() {\n    int n = 5;\n    addOne(n);\n    cout << n << "\\n";\n    show("const 引用最适合传大对象");\n    return 0;\n}', out: '6\nconst 引用最适合传大对象' },
            { t: 'table', head: ['参数写法', '是否拷贝', '能否改实参', '什么时候用'], rows: [
              ['`int x`', '拷贝（小对象无所谓）', '不能', '内置类型、小结构体'],
              ['`int &x`', '不拷贝', '能', '需要修改调用方的变量'],
              ['`const int &x`', '不拷贝', '不能', '传大对象只读，最常用'],
              ['`int *x`', '拷贝指针', '能（需 `*x`）', '需要表达「可能为空」']
            ] },
            { t: 'principle', x: '**默认用 `const T&` 传参**。既避免拷贝，又表明函数不会改你的数据。只有当参数可能为空、或需要指针算术时，才换成指针。' }
          ]
        },
        {
          id: 'cp1l3', title: 'std::string：能自己管长度', key: 'string · size · 拼接', time: 12,
          blocks: [
            { t: 'p', x: '`std::string` 内部管着一块堆内存，长度自动增长，不用你算缓冲区多大，也不会忘记 `\\0`。这一个类型就消掉了 C 里大半的字符串 bug。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s = "Code";\n    s += "Craft";                 /* 直接拼接，自动扩容 */\n    cout << s << " " << s.size() << "\\n";\n\n    cout << s.substr(0, 4) << "\\n";\n    cout << s.find("Craft") << "\\n";\n    cout << s[0] << s.back() << "\\n";\n\n    string t = s + "!";            /* + 也是拼接 */\n    cout << (t == "CodeCraft!") << "\\n";\n    return 0;\n}', out: 'CodeCraft 9\nCode\n4\nCt\n1' },
            { t: 'table', head: ['操作', '写法', '注意'], rows: [
              ['长度', '`s.size()` / `s.length()`', '返回 `size_t`（无符号），和 int 比较会有警告'],
              ['拼接', '`s += x` 或 `s1 + s2`', '`+=` 更省，不产生临时对象'],
              ['取子串', '`s.substr(pos, len)`', 'pos 越界会抛 `out_of_range`'],
              ['查找', '`s.find(x)`', '找不到返回 `string::npos`，不是 -1'],
              ['转数字', '`stoi(s)` / `stod(s)`', '失败会抛异常']
            ] },
            { t: 'code', x: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);          /* 读一整行，含空格 */\n\n    int spaces = 0;\n    for (char c : line) if (c == \' \') spaces++;\n    cout << "字符数 " << line.size() << "，空格 " << spaces << "\\n";\n    return 0;\n}', out: '字符数 11，空格 2' },
            { t: 'warn', x: '**`cin >> s` 遇到空格就停**，只能读一个词。要读整行（比如「张 三」这种带空格的名字）必须用 `getline(cin, s)`。混用两者时还要注意 `cin >> n` 会留下换行符，`getline` 会立刻读到空行——用 `cin.ignore()` 清掉。' }
          ]
        }
      ]
    },
    {
      id: 'cp2', num: 2, title: '类与对象', icon: '📦',
      intro: '类把「数据」和「操作这些数据的函数」绑在一起，并且能控制谁能访问。这一章从构造函数讲到析构函数，重点是搞清楚「对象什么时候生、什么时候死、死的时候要做什么」。',
      goals: ['定义 class 与构造函数', '区分 class 与 struct 的默认访问权限', '用析构函数释放资源（RAII）', '用 const 成员函数表达「不修改对象」'],
      lessons: [
        {
          id: 'cp2l1', title: 'class、构造函数与 this', key: '构造 · 初始化列表', time: 14,
          blocks: [
            { t: 'p', x: '`class` 默认成员是 private，`struct` 默认 public —— 这是 C++ 里两者唯一的差别（习惯上 struct 用来装纯数据，class 用来封装行为）。' },
            { t: 'code', x: '#include <iostream>\nusing namespace std;\n\nclass Counter {\nprivate:\n    int value;          /* 外部改不到，只能通过方法 */\npublic:\n    Counter() : value(0) {}          /* 默认构造 */\n    Counter(int v) : value(v) {}     /* 带参构造 */\n\n    void inc() { value++; }\n    int get() const { return value; }   /* const：承诺不改成员 */\n};\n\nint main() {\n    Counter a;         /* 走默认构造 */\n    Counter b(10);     /* 走带参构造 */\n    a.inc(); a.inc();\n    b.inc();\n    cout << a.get() << " " << b.get() << "\\n";\n    return 0;\n}', out: '2 11' },
            { t: 'p', x: '`Counter() : value(0) {}` 里冒号后面那段叫**初始化列表**。它在构造函体执行前就完成了成员初始化，比在函数体里写 `value = 0;` 更规范——对 `const` 成员和引用成员，只能用初始化列表。' },
            { t: 'table', head: ['写法', '含义'], rows: [
              ['`Counter() {}`', '默认构造函数，无参'],
              ['`Counter(int v) : value(v) {}`', '带参构造 + 初始化列表'],
              ['`Counter(const Counter &o)`', '拷贝构造，用另一个对象初始化'],
              ['`~Counter() {}`', '析构函数，对象销毁时自动调用'],
              ['`Counter c{};`', 'C++11 统一初始化，等价于默认构造']
            ] },
            { t: 'code', x: '#include <iostream>\nusing namespace std;\n\nclass Point {\npublic:\n    int x, y;\n    Point(int x, int y) : x(x), y(y) {}   /* 形参同名也安全 */\n    Point add(const Point &o) const {\n        return Point(x + o.x, y + o.y);\n    }\n};\n\nint main() {\n    Point a(1, 2), b(10, 20);\n    Point c = a.add(b);\n    cout << c.x << "," << c.y << "\\n";\n    return 0;\n}', out: '11,22' },
            { t: 'note', x: '成员函数后面加 `const`，意思是「这个函数不会修改本对象」。好处有两个：`const` 对象也能调用它；写错了真去改成员，编译器会立刻拦下来。' }
          ]
        },
        {
          id: 'cp2l2', title: '析构函数与 RAII', key: 'RAII · 自动释放', time: 12,
          blocks: [
            { t: 'p', x: '**RAII**（资源获取即初始化）是 C++ 最核心的思想：把资源（内存、文件、锁）的释放写在析构函数里。对象离开作用域，析构函数就一定被调用，资源就一定被释放——不管中间有没有 `return`，有没有抛异常。' },
            { t: 'code', x: '#include <iostream>\nusing namespace std;\n\nclass Tracer {\n    string name;\npublic:\n    Tracer(string n) : name(n) { cout << "创建 " << name << "\\n"; }\n    ~Tracer() { cout << "销毁 " << name << "\\n"; }\n};\n\nvoid work() {\n    Tracer a("a");\n    {\n        Tracer b("b");     /* 内层作用域 */\n    }                      /* b 在这里销毁 */\n    cout << "work 主体结束\\n";\n}                          /* a 在这里销毁 */\n\nint main() {\n    work();\n    cout << "回到 main\\n";\n    return 0;\n}', out: '创建 a\n创建 b\n销毁 b\nwork 主体结束\n销毁 a\n回到 main' },
            { t: 'p', x: '观察销毁顺序：**后创建的先销毁**，和栈一样。这就是为什么 RAII 能保证正确性——局部对象的销毁时机由作用域唯一决定，不依赖你是否记得写 `free`。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v;               /* vector 内部自己 malloc */\n    for (int i = 0; i < 5; i++) v.push_back(i * i);\n    cout << v.size() << " " << v.back() << "\\n";\n    /* 不需要 free：v 离开作用域时析构函数自动释放那块内存 */\n    return 0;\n}', out: '5 16' },
            { t: 'warn', x: '有析构函数管理资源的类，如果不写**拷贝构造 / 拷贝赋值**，默认的浅拷贝会让两个对象指向同一块内存，析构两次就崩。这条规则叫「**三法则**」：需要析构函数，通常也需要拷贝构造和拷贝赋值（C++11 之后还要移动构造，即五法则）。' },
            { t: 'principle', x: '**别自己 new/delete。** 用 `vector`、`string`、`unique_ptr` 这些已经实现好 RAII 的类型，你就几乎不会写出内存泄漏。' }
          ]
        },
        {
          id: 'cp2l3', title: '封装、static 与友元', key: '访问控制 · static', time: 10,
          blocks: [
            { t: 'p', x: '把成员设成 private，只暴露必要的方法，好处不是「显得专业」，而是**你能保证对象永远处于合法状态**：所有修改都经过你的检查。' },
            { t: 'code', x: '#include <iostream>\nusing namespace std;\n\nclass Account {\nprivate:\n    double balance;\npublic:\n    Account(double init) : balance(init > 0 ? init : 0) {}\n    bool withdraw(double amount) {\n        if (amount <= 0 || amount > balance) return false;   /* 唯一的修改入口 */\n        balance -= amount;\n        return true;\n    }\n    double get() const { return balance; }\n};\n\nint main() {\n    Account a(100);\n    cout << a.withdraw(30) << " " << a.get() << "\\n";\n    cout << a.withdraw(1000) << " " << a.get() << "\\n";\n    return 0;\n}', out: '1 70\n0 70' },
            { t: 'h', x: 'static 成员：属于类，不属于对象' },
            { t: 'code', x: '#include <iostream>\nusing namespace std;\n\nclass User {\npublic:\n    static int count;              /* 声明：所有对象共享一个 */\n    User() { count++; }\n};\n\nint User::count = 0;               /* 定义：必须在类外分配空间 */\n\nint main() {\n    User a, b, c;\n    cout << User::count << "\\n";\n    return 0;\n}', out: '3' },
            { t: 'table', head: ['关键字', '作用'], rows: [
              ['`private`', '只有本类成员能访问（默认）'],
              ['`public`', '谁都能访问'],
              ['`protected`', '本类和派生类能访问'],
              ['`static`', '属于类本身，所有对象共享一份'],
              ['`friend`', '特批某个函数/类可以访问 private，慎用']
            ] },
            { t: 'note', x: '`static` 成员变量只是**声明**，必须在类外再写一行 `int User::count = 0;` 来分配空间。漏了这行会得到 `undefined reference` —— 链接错误，不是编译错误。' }
          ]
        }
      ]
    },
    {
      id: 'cp3', num: 3, title: 'STL：容器与算法', icon: '🧰',
      intro: '标准模板库是 C++ 最值钱的部分。你几乎不需要自己写动态数组、哈希表、排序——它们都已经被打磨了二十年。这一章学会按场景挑容器，并用算法库代替手写循环。',
      goals: ['用 vector 替代裸数组', '按场景选择 vector / map / set', '用 sort、find、count_if 简化代码', '会写 lambda 作为比较器'],
      lessons: [
        {
          id: 'cp3l1', title: 'vector：会自己长大的数组', key: 'vector · 遍历 · 扩容', time: 12,
          blocks: [
            { t: 'p', x: '`vector<T>` 是连续内存的动态数组，既能 `v[i]` 随机访问，又能 `push_back` 自动扩容。它是 C++ 里默认首选的容器——不确定用什么就用它。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {5, 3, 8};\n    v.push_back(1);\n    v.push_back(9);\n\n    cout << v.size() << " " << v.front() << " " << v.back() << "\\n";\n\n    for (int x : v) cout << x << " ";      /* 只读遍历，最快 */\n    cout << "\\n";\n    for (int &x : v) x *= 2;               /* 引用遍历可以改值 */\n    for (int x : v) cout << x << " ";\n    cout << "\\n";\n    return 0;\n}', out: '5 5 9\n5 3 8 1 9 \n10 6 16 2 18 ' },
            { t: 'table', head: ['操作', '写法', '复杂度'], rows: [
              ['尾部添加', '`v.push_back(x)`', '均摊 O(1)'],
              ['随机访问', '`v[i]` / `v.at(i)`', 'O(1)；`at` 会检查越界并抛异常'],
              ['删除末尾', '`v.pop_back()`', 'O(1)'],
              ['插入中间', '`v.insert(v.begin()+i, x)`', 'O(n)，会移动后面所有元素'],
              ['求长度', '`v.size()`', 'O(1)'],
              ['清空', '`v.clear()`', 'O(n)（要析构每个元素）']
            ] },
            { t: 'warn', x: '`push_back` 可能触发**扩容**：申请一块更大的内存、把元素搬过去、释放旧的。所以扩容后**之前保存的指针和迭代器全部失效**。循环里别边保存 `&v[0]` 边 push_back。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {3, 1, 4, 1, 5};\n    int s = 0, mx = v[0];\n    for (int x : v) { s += x; if (x > mx) mx = x; }\n    cout << "sum=" << s << " max=" << mx << "\\n";\n    cout << "avg=" << (double)s / v.size() << "\\n";\n    return 0;\n}', out: 'sum=14 max=5\navg=2.8' }
          ]
        },
        {
          id: 'cp3l2', title: 'map 与 set：靠 key 找东西', key: 'map · set · 哈希', time: 12,
          blocks: [
            { t: 'p', x: '`map` 是按键排好序的字典（底层红黑树），`set` 是排好序的不重复集合。要更快但不要顺序，就用 `unordered_map` / `unordered_set`（哈希表，平均 O(1)）。' },
            { t: 'code', x: '#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    map<string, int> score;\n    score["小明"] = 92;\n    score["小红"] = 88;\n    score["小刚"] = 75;\n\n    for (auto &p : score)                 /* 自动按 key 字典序 */\n        cout << p.first << ":" << p.second << " ";\n    cout << "\\n";\n\n    cout << score.count("小明") << " " << score["不存在"] << "\\n";\n    return 0;\n}', out: '小刚:75 小明:92 小红:88 \n1 0' },
            { t: 'warn', x: '**`m[key]` 会顺手插入**。查某个 key 是否存在用 `count()` 或 `find()`；用 `m[key]` 查询会创建一个默认值 0 的条目，把容器搞脏。只读场景下这是常见 bug。' },
            { t: 'code', x: '#include <iostream>\n#include <map>\nusing namespace std;\n\nint main() {\n    int data[] = {1, 2, 2, 3, 3, 3};\n    map<int, int> freq;\n    for (int x : data) freq[x]++;\n\n    for (auto &p : freq) cout << p.first << "出现" << p.second << "次 "; \n    cout << "\\n";\n\n    auto it = freq.find(2);\n    if (it != freq.end()) cout << "找到 2，次数 " << it->second << "\\n";\n    if (freq.find(99) == freq.end()) cout << "99 不存在\\n";\n    return 0;\n}', out: '1出现1次 2出现2次 3出现3次 \n找到 2，次数 2\n99 不存在' },
            { t: 'table', head: ['容器', '底层', '有序', '适用'], rows: [
              ['`vector`', '连续数组', '按插入顺序', '默认首选，遍历和随机访问多'],
              ['`map`', '红黑树', '按 key 排序', '需要有序输出、范围查询'],
              ['`unordered_map`', '哈希表', '无序', '只要查得快'],
              ['`set`', '红黑树', '排序去重', '去重后还要有序'],
              ['`deque`', '分段数组', '按插入顺序', '两端都要增删']
            ] }
          ]
        },
        {
          id: 'cp3l3', title: '算法库与 lambda', key: 'sort · lambda · 迭代器', time: 12,
          blocks: [
            { t: 'p', x: '`<algorithm>` 里有一百多个现成算法。它们的统一约定是收**迭代器区间** `[begin, end)` ——注意右边是开区间。学会这套约定，一行 `sort` 抵得上十行手写冒泡。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {5, 2, 9, 1, 7};\n\n    sort(v.begin(), v.end());                  /* 升序 */\n    for (int x : v) cout << x << " ";\n    cout << "\\n";\n\n    sort(v.begin(), v.end(), greater<int>());  /* 降序 */\n    for (int x : v) cout << x << " ";\n    cout << "\\n";\n\n    cout << *max_element(v.begin(), v.end()) << " ";\n    cout << count(v.begin(), v.end(), 7) << "\\n";\n    return 0;\n}', out: '1 2 5 7 9 \n9 7 5 2 1 \n9 1' },
            { t: 'h', x: 'lambda：就地写个函数' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<string> names = {"bob", "alice", "david", "cy"};\n\n    sort(names.begin(), names.end(), [](const string &a, const string &b) {\n        if (a.size() != b.size()) return a.size() < b.size();  /* 短的在前 */\n        return a < b;                                          /* 同长按字典序 */\n    });\n\n    for (auto &s : names) cout << s << " ";\n    cout << "\\n";\n    return 0;\n}', out: 'cy bob alice david ' },
            { t: 'p', x: 'lambda 的语法是 `[捕获](参数) { 函数体 }`。方括号里写要用到的外部变量：`[]` 不捕获，`[&]` 按引用捕获全部，`[=]` 按值捕获。排序比较器一般不需要捕获，所以是 `[]`。' },
            { t: 'note', x: '比较器必须满足**严格弱序**：`cmp(a,a)` 必须为 false，且不能出现 `a<b` 和 `b<a` 同时为 true。写成 `<=` 是经典错误，某些编译器下会直接段错误。' },
            { t: 'principle', x: '**先查算法库，再写循环。** `count_if`、`any_of`、`accumulate`、`find_if`、`remove_if` 基本覆盖了九成的手写遍历，而且比手写的更难写错。' }
          ]
        }
      ]
    },
    {
      id: 'cp4', num: 4, title: '继承与多态', icon: '🧬',
      intro: '多态让「同一句调用，不同对象做出不同反应」，这是框架和插件体系的基础。但继承也是 C++ 里最容易用错的东西——这一章既讲怎么写，也讲什么时候不该用。',
      goals: ['写派生类并调用基类构造', '用 virtual + override 实现多态', '解释虚析构为什么必须有', '分清「是一个」与「有一个」'],
      lessons: [
        {
          id: 'cp4l1', title: '继承与 override', key: '继承 · 虚函数', time: 14,
          blocks: [
            { t: 'p', x: '继承表达「是一个」（is-a）：`Dog` 是一种 `Animal`。派生类自动拥有基类的成员，还能重写基类的方法。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Animal {\nprotected:\n    string name;\npublic:\n    Animal(string n) : name(n) {}\n    virtual void speak() const { cout << name << " 发出声音\\n"; }\n    virtual ~Animal() {}          /* 基类有虚函数就该有虚析构 */\n};\n\nclass Dog : public Animal {\npublic:\n    Dog(string n) : Animal(n) {}  /* 基类构造要显式调用 */\n    void speak() const override { cout << name << " 汪汪\\n"; }\n};\n\nclass Cat : public Animal {\npublic:\n    Cat(string n) : Animal(n) {}\n    void speak() const override { cout << name << " 喵喵\\n"; }\n};\n\nint main() {\n    Dog d("旺财");\n    Cat c("咪咪");\n    d.speak();\n    c.speak();\n    return 0;\n}', out: '旺财 汪汪\n咪咪 喵喵' },
            { t: 'table', head: ['写法', '作用'], rows: [
              ['`class Dog : public Animal`', '公有继承，保持 is-a 关系'],
              ['`Dog(string n) : Animal(n)`', '派生类构造必须先构造基类'],
              ['`virtual void f()`', '声明可被重写的函数（有虚表，有运行时开销）'],
              ['`override`', '编译器帮你检查「确实重写了基类的虚函数」'],
              ['`~Animal() virtual`', '通过基类指针 delete 时能调对析构']
            ] },
            { t: 'code', x: '#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    void hello() { cout << "Base\\n"; }\n};\n\nclass Derived : public Base {\npublic:\n    void hello() { cout << "Derived\\n"; }   /* 没有 virtual，这叫隐藏 */\n};\n\nint main() {\n    Derived d;\n    Base *p = &d;\n    p->hello();      /* 静态绑定：看指针类型，输出 Base */\n    d.hello();\n    return 0;\n}', out: 'Base\nDerived' },
            { t: 'warn', x: '上面这段说明了**没有 `virtual` 就没有多态**。通过基类指针调用非虚函数，编译器按指针的静态类型决定调哪个版本。加上 `virtual` 才会变成运行时按实际类型查找。' },
            { t: 'note', x: '`override` 关键字不是必须的，但强烈建议写。它能挡住「参数写错导致没重写成」这种极难发现的 bug——比如基类 `speak() const`，派生类漏了 `const`，那就是两个不同的函数。' }
          ]
        },
        {
          id: 'cp4l2', title: '多态：同一句调用，不同行为', key: '多态 · 虚表', time: 12,
          blocks: [
            { t: 'p', x: '多态的价值在于**调用方不需要知道具体类型**。写一个 `for (Animal *a : zoo) a->speak();`，以后新增十种动物，这个循环一行都不用改。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <memory>\nusing namespace std;\n\nclass Shape {\npublic:\n    virtual double area() const = 0;      /* 纯虚函数：本类不能实例化 */\n    virtual string name() const = 0;\n    virtual ~Shape() {}\n};\n\nclass Rect : public Shape {\n    double w, h;\npublic:\n    Rect(double w, double h) : w(w), h(h) {}\n    double area() const override { return w * h; }\n    string name() const override { return "矩形"; }\n};\n\nclass Circle : public Shape {\n    double r;\npublic:\n    Circle(double r) : r(r) {}\n    double area() const override { return 3.14159 * r * r; }\n    string name() const override { return "圆"; }\n};\n\nint main() {\n    vector<unique_ptr<Shape>> v;\n    v.push_back(make_unique<Rect>(3, 4));\n    v.push_back(make_unique<Circle>(1));\n\n    for (auto &s : v)\n        cout << s->name() << " 面积 " << s->area() << "\\n";\n    return 0;\n}', out: '矩形 面积 12\n圆 面积 3.14159' },
            { t: 'p', x: '含**纯虚函数**（`= 0`）的类叫抽象类，不能直接创建对象，只能作为接口被继承。这就是「面向接口编程」在 C++ 里的写法。' },
            { t: 'warn', x: '**基类析构必须是 virtual。** `Animal *p = new Dog(); delete p;` 如果析构不是虚函数，只会调用 `~Animal()`，Dog 自己的资源泄漏，行为未定义。' },
            { t: 'table', head: ['场景', '该用什么'], rows: [
              ['需要运行时决定行为', '虚函数 + 基类指针/引用'],
              ['只是一组相关的数据', 'struct，不要继承'],
              ['想复用代码但语义不是 is-a', '组合（把对象当成员），别用继承'],
              ['接口（只有声明没有实现）', '纯虚函数 / 抽象类']
            ] },
            { t: 'principle', x: '**优先组合，谨慎继承。** 继承会把派生类和基类永久绑在一起，基类一改，所有派生类都要跟着看。组合只依赖公开接口，改起来自由得多。' }
          ]
        }
      ]
    },
    {
      id: 'cp5', num: 5, title: '模板、智能指针与异常', icon: '🚀',
      intro: '这三样是现代 C++ 的日常工具：模板让你写一份代码适配所有类型，智能指针让内存泄漏基本绝迹，异常让错误处理不再靠返回码层层传递。',
      goals: ['写简单的函数模板与类模板', '用 unique_ptr / shared_ptr 管理内存', '用 try / catch 捕获异常', '知道什么时候该抛异常'],
      lessons: [
        {
          id: 'cp5l1', title: '模板：一次编写，多处实例化', key: 'template · 泛型', time: 12,
          blocks: [
            { t: 'p', x: '模板是编译期的「代码生成器」。写 `template <typename T>` 的函数，编译器会在你调用时针对具体类型生成对应版本——没有运行时开销，也没有装箱拆箱。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\nusing namespace std;\n\ntemplate <typename T>\nT maxOf(T a, T b) {\n    return a > b ? a : b;\n}\n\nint main() {\n    cout << maxOf(3, 9) << " ";\n    cout << maxOf(2.5, 1.5) << " ";\n    cout << maxOf(string("abc"), string("abd")) << "\\n";\n    return 0;\n}', out: '9 2.5 abd' },
            { t: 'code', x: '#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nclass Box {\n    T value;\npublic:\n    Box(T v) : value(v) {}\n    T get() const { return value; }\n};\n\nint main() {\n    Box<int> a(42);\n    Box<string> b("装箱");\n    cout << a.get() << " " << b.get() << "\\n";\n    return 0;\n}', out: '42 装箱' },
            { t: 'note', x: '模板的报错信息出了名地长，因为编译器要把每个实例化过程都摊开给你看。读的时候**先看第一行「required from here」，再找「error:」开头的第一处**，别从头往下读。' },
            { t: 'warn', x: '模板的定义通常要放在头文件里，因为编译器在实例化时必须看到完整实现。把模板实现塞进 `.cpp` 会导致链接错误 `undefined reference`。' }
          ]
        },
        {
          id: 'cp5l2', title: '智能指针：让 delete 消失', key: 'unique_ptr · shared_ptr', time: 14,
          blocks: [
            { t: 'p', x: '裸指针的问题是「谁负责 delete」说不清。智能指针把这件事写进类型：`unique_ptr` 表示独占所有权，`shared_ptr` 表示共享所有权（引用计数归零才释放）。' },
            { t: 'code', x: '#include <iostream>\n#include <memory>\nusing namespace std;\n\nclass Res {\npublic:\n    Res() { cout << "申请资源\\n"; }\n    ~Res() { cout << "释放资源\\n"; }\n    void use() { cout << "使用中\\n"; }\n};\n\nint main() {\n    {\n        unique_ptr<Res> p = make_unique<Res>();\n        p->use();\n    }                     /* 离开作用域自动 delete，不需要写 delete */\n    cout << "作用域外\\n";\n    return 0;\n}', out: '申请资源\n使用中\n释放资源\n作用域外' },
            { t: 'table', head: ['类型', '所有权', '拷贝', '适用'], rows: [
              ['`unique_ptr`', '独占', '不能拷贝，可以 move', '默认首选，零额外开销'],
              ['`shared_ptr`', '共享（引用计数）', '可以拷贝，计数 +1', '确实需要多处共享时'],
              ['`weak_ptr`', '不持有', '可以拷贝', '打破 shared_ptr 循环引用'],
              ['裸指针 `T*`', '不表达所有权', '随意', '只作为「观察者」，不负责释放']
            ] },
            { t: 'code', x: '#include <iostream>\n#include <memory>\nusing namespace std;\n\nint main() {\n    shared_ptr<int> a = make_shared<int>(10);\n    cout << a.use_count() << "\\n";      /* 1 个持有者 */\n    {\n        shared_ptr<int> b = a;          /* 共享 */\n        cout << a.use_count() << " " << *b << "\\n";\n    }\n    cout << a.use_count() << "\\n";      /* b 走了，回到 1 */\n    return 0;\n}', out: '1\n2 10\n1' },
            { t: 'warn', x: '两个 `shared_ptr` 互相指向对方，引用计数永远不归零，内存永远不释放——这是 `shared_ptr` 唯一的坑。父子/双向关系里，其中一边要用 `weak_ptr`。' },
            { t: 'principle', x: '**先想所有权，再选指针类型。** 独占用 `unique_ptr`，共享才用 `shared_ptr`，只是借用就传 `T*` 或 `T&`。把这三句话刻进习惯，内存问题基本消失。' }
          ]
        },
        {
          id: 'cp5l3', title: '异常与错误处理', key: 'try · catch · 异常安全', time: 12,
          blocks: [
            { t: 'p', x: '异常把「正常流程」和「错误处理」分开写。不用每一层都判断返回值再往上传——只要有一层 `catch` 接住，中间层可以完全不管。' },
            { t: 'code', x: '#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\ndouble divide(double a, double b) {\n    if (b == 0) throw invalid_argument("除数不能为 0");\n    return a / b;\n}\n\nint main() {\n    try {\n        cout << divide(10, 4) << "\\n";\n        cout << divide(1, 0) << "\\n";     /* 这里抛出 */\n        cout << "这行不会执行\\n";\n    } catch (const invalid_argument &e) {\n        cout << "捕获：" << e.what() << "\\n";\n    } catch (...) {\n        cout << "其他异常\\n";\n    }\n    cout << "程序继续运行\\n";\n    return 0;\n}', out: '2.5\n捕获：除数不能为 0\n程序继续运行' },
            { t: 'table', head: ['异常类型', '什么时候用'], rows: [
              ['`invalid_argument`', '参数值不合法（如负数的平方根）'],
              ['`out_of_range`', '下标或取值超出范围（`vector::at`）'],
              ['`runtime_error`', '运行期才发现的错误（文件打不开）'],
              ['`bad_alloc`', '`new` 申请内存失败'],
              ['自定义异常', '继承 `std::exception` 并重写 `what()`']
            ] },
            { t: 'warn', x: '**catch 一律按 `const 引用` 接**：`catch (const std::exception &e)`。按值接会切片丢失派生类信息；接 `...` 会吞掉所有异常，让调试无从下手。' },
            { t: 'note', x: '不是所有错误都该抛异常。**可预期的业务分支**（比如「用户没找到」）用返回值或 `optional` 更清楚；**真正异常的情况**（内存不足、文件被删、参数违约）才用异常。' },
            { t: 'principle', x: '**RAII + 异常 = 异常安全。** 因为栈展开时局部对象的析构函数一定会被调用，资源不会漏。这也是为什么「别自己 new/delete」在异常场景下尤其重要。' }
          ]
        }
      ]
    }
  ],

  quiz: [
    { id: 'ppq1', ch: 'cp1', lesson: 'cp1l1', point: 'iostream', type: 'choice', diff: 1,
      prompt: '和 `printf` 相比，`cout` 最直接的优点是？',
      opts: ['运行速度更快', '不用写格式符，类型由编译器自动匹配', '不需要包含头文件', '能自动换行'],
      ans: 1,
      explain: '`cout << x` 会根据 x 的类型选择输出方式，不存在「格式符和参数类型不匹配」这类未定义行为。代价是语法更啰嗦，而且在某些场景下比 printf 稍慢。' },
    { id: 'ppq2', ch: 'cp1', lesson: 'cp1l1', point: 'bool 输出', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << (3 > 2) << " ";\n    cout << boolalpha << (3 > 2) << "\\n";\n    cout << 7 / 2 << " " << 7 / 2.0 << "\\n";\n    return 0;\n}',
      answer: '1 true\n3 3.5',
      explain: '`bool` 默认按整数输出 1/0，加上 `boolalpha` 才输出 true/false。整数除法仍是 7/2=3，但只要有一个浮点操作数就变成 3.5。' },
    { id: 'ppq3', ch: 'cp1', lesson: 'cp1l2', point: '引用语义', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\nusing namespace std;\nint main() {\n    int a = 1, b = 2;\n    int &r = a;\n    r = b;\n    b = 100;\n    cout << a << " " << b << "\\n";\n    return 0;\n}',
      answer: '2 100',
      explain: '`r = b` 是把 b 的值赋给 a（r 始终是 a 的别名，不能改绑），所以 a 变成 2。之后改 b 与 a 无关。' },
    { id: 'ppq4', ch: 'cp1', lesson: 'cp1l3', point: 'string 查找', type: 'choice', diff: 2,
      prompt: '`s.find("x")` 找不到时返回什么？',
      opts: ['-1', '0', '`string::npos`', '抛出异常'],
      ans: 2,
      explain: '返回 `string::npos`，它是一个很大的无符号数（通常是 `size_t(-1)`）。所以判断要写 `if (s.find(x) == string::npos)`，写成 `== -1` 会有符号比较警告。' },
    { id: 'ppq5', ch: 'cp1', lesson: 'cp1l3', point: '读整行', type: 'choice', diff: 2,
      prompt: '要读入可能含空格的整行文本，应该用？',
      opts: ['cin >> s', 'getline(cin, s)', 'cin.get(s)', 'scanf("%s", s)'],
      ans: 1,
      explain: '`cin >> s` 遇空格即停，只能读一个词；`getline(cin, s)` 读到换行为止，空格全保留。' },
    { id: 'ppq6', ch: 'cp2', lesson: 'cp2l1', point: '默认访问', type: 'choice', diff: 1,
      prompt: '`class` 与 `struct` 在 C++ 中的默认访问权限分别是？',
      opts: ['都是 public', 'class 是 private，struct 是 public', 'class 是 public，struct 是 private', '都是 private'],
      ans: 1,
      explain: '这是两者在 C++ 里几乎唯一的区别。习惯上 struct 用来装纯数据，class 用来封装行为。' },
    { id: 'ppq7', ch: 'cp2', lesson: 'cp2l1', point: 'const 成员', type: 'choice', diff: 2,
      prompt: '成员函数末尾的 `const`（如 `int get() const`）表示什么？',
      opts: ['返回值是常量', '函数不能修改本对象的成员', '函数只能被调用一次', '函数是静态的'],
      ans: 1,
      explain: '它修饰的是 `this` 指针，承诺函数体内不修改成员变量。副作用是 const 对象也能调用它，而且一旦误改成员，编译器会直接报错。' },
    { id: 'ppq8', ch: 'cp2', lesson: 'cp2l2', point: '析构顺序', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\nusing namespace std;\n\nstruct T {\n    string n;\n    T(string s) : n(s) { cout << "+" << n; }\n    ~T() { cout << "-" << n; }\n};\n\nint main() {\n    T a("a");\n    { T b("b"); }\n    T c("c");\n    return 0;\n}',
      answer: '+a+b-b+c-c-a',
      explain: '创建按顺序 a、b；b 在内层作用域结束时立刻销毁；再创建 c；main 结束时按「后创建先销毁」的顺序销毁 c 再销毁 a。' },
    { id: 'ppq9', ch: 'cp2', lesson: 'cp2l2', point: 'RAII', type: 'choice', diff: 2,
      prompt: 'RAII 的核心思想是？',
      opts: ['手动 new 后一定要 delete', '把资源释放写进析构函数，靠作用域自动管理', '用垃圾回收器回收内存', '尽量少用指针'],
      ans: 1,
      explain: '资源获取即初始化：构造时拿资源，析构时还资源。因为局部对象离开作用域必定析构（哪怕是异常栈展开），资源释放就不会被忘记。' },
    { id: 'ppq10', ch: 'cp2', lesson: 'cp2l3', point: 'static 成员', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\nusing namespace std;\n\nclass C {\npublic:\n    static int n;\n    C() { n++; }\n};\nint C::n = 0;\n\nint main() {\n    C a, b;\n    C c = a;\n    cout << C::n << "\\n";\n    return 0;\n}',
      answer: '2',
      explain: '`C a, b;` 执行两次默认构造，n 变成 2。`C c = a;` 走的是**编译器隐式生成的拷贝构造**，它只复制成员、不执行你写的 `C()`，所以 n 不再增加。注意：如果自己在拷贝构造里也写 `n++`，结果就会不同。' },
    { id: 'ppq11', ch: 'cp3', lesson: 'cp3l1', point: 'vector 越界', type: 'choice', diff: 2,
      prompt: '`vector<int> v(3);` 之后，`v[5]` 和 `v.at(5)` 的区别是？',
      opts: ['没有区别', '`v[5]` 是未定义行为，`v.at(5)` 抛 out_of_range', '`v[5]` 抛异常，`v.at(5)` 返回 0', '两者都会自动扩容'],
      ans: 1,
      explain: '`operator[]` 不做边界检查（为了性能），越界是未定义行为；`at()` 会检查并抛 `std::out_of_range`。调试期多用 `at`。' },
    { id: 'ppq12', ch: 'cp3', lesson: 'cp3l2', point: 'map 插入', type: 'choice', diff: 3,
      prompt: '`map<string,int> m;` 已有 3 个元素，执行 `cout << m["x"];` 之后，m 的大小是？',
      opts: ['仍是 3', '变成 4', '编译错误', '不确定'],
      ans: 1,
      explain: '`m[key]` 在 key 不存在时会**插入**一个值初始化为 0 的元素。所以查询要用 `find` 或 `count`，否则会悄悄改变容器。' },
    { id: 'ppq13', ch: 'cp3', lesson: 'cp3l3', point: '迭代器区间', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    vector<int> v = {4, 1, 3, 2};\n    sort(v.begin(), v.end());\n    for (int x : v) cout << x;\n    cout << "\\n";\n    cout << count(v.begin(), v.end(), 3) << "\\n";\n    return 0;\n}',
      answer: '1234\n1',
      explain: '`sort` 默认升序；`count` 统计等于 3 的元素个数，只有 1 个。注意区间是 `[begin, end)`，包含 begin 不含 end。' },
    { id: 'ppq14', ch: 'cp4', lesson: 'cp4l1', point: '多态条件', type: 'choice', diff: 2,
      prompt: '通过基类指针调用派生类重写的函数，必须满足什么条件？',
      opts: ['基类函数声明为 virtual', '派生类函数加 static', '基类函数是 private', '用对象而不是指针调用'],
      ans: 0,
      explain: '只有虚函数才在运行时按实际对象类型分派。没有 virtual 时，调用哪个版本由指针的静态类型决定。' },
    { id: 'ppq15', ch: 'cp4', lesson: 'cp4l2', point: '虚析构', type: 'choice', diff: 3,
      prompt: '基类指针 `delete` 一个派生类对象，若基类析构函数不是 virtual，会发生什么？',
      opts: ['正常调用派生类析构', '只调用基类析构，派生类资源泄漏（未定义行为）', '编译错误', '自动改成调用派生类析构'],
      ans: 1,
      explain: '析构函数不是虚函数时，`delete p` 按静态类型只调用 `~Base()`，派生类新增的资源不会释放。所以「基类有虚函数，就必须有虚析构」。' },
    { id: 'ppq16', ch: 'cp4', lesson: 'cp4l2', point: '抽象类', type: 'choice', diff: 2,
      prompt: '含有纯虚函数 `virtual void f() = 0;` 的类有什么特点？',
      opts: ['可以直接创建对象', '不能实例化，只能被继承', '不需要析构函数', '所有成员必须 public'],
      ans: 1,
      explain: '纯虚函数把类变成抽象类（接口），编译器禁止创建它的对象。派生类必须实现所有纯虚函数，否则派生类也是抽象的。' },
    { id: 'ppq17', ch: 'cp5', lesson: 'cp5l2', point: '智能指针', type: 'choice', diff: 2,
      prompt: '表示「独占所有权」、不能拷贝的智能指针是？',
      opts: ['shared_ptr', 'unique_ptr', 'weak_ptr', 'auto_ptr'],
      ans: 1,
      explain: '`unique_ptr` 独占所有权，拷贝构造被删除，只能 `std::move` 转移。`shared_ptr` 是共享计数，`weak_ptr` 不持有所有权，`auto_ptr` 已在 C++17 移除。' },
    { id: 'ppq18', ch: 'cp5', lesson: 'cp5l3', point: '异常捕获', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <stdexcept>\nusing namespace std;\nint main() {\n    try {\n        throw runtime_error("boom");\n    } catch (const exception &e) {\n        cout << "E:" << e.what() << "\\n";\n    }\n    cout << "done\\n";\n    return 0;\n}',
      answer: 'E:boom\ndone',
      explain: '`runtime_error` 继承自 `exception`，按基类引用捕获也能接住，`what()` 返回构造时传入的消息。catch 结束后程序继续往下执行。' }
  ],

  checkin: [
    { id: 'pk1', ch: 'cp1', point: '头文件', type: 'choice', diff: 1,
      prompt: '想用 `cout`，需要包含哪个头文件？',
      opts: ['<stdio.h>', '<iostream>', '<string>', '<vector>'],
      ans: 1,
      explain: '`<iostream>` 提供 cin / cout / cerr 等流对象。注意 C++ 里习惯写 `<iostream>` 而不是 `<iostream.h>`（后者是极早期的写法）。' },
    { id: 'pk2', ch: 'cp1', point: 'endl 与换行', type: 'choice', diff: 2,
      prompt: '`cout << endl` 和 `cout << "\\n"` 的区别是？',
      opts: ['完全等价', 'endl 会额外刷新输出缓冲区', '\\n 会额外刷新缓冲区', 'endl 只能用于文件'],
      ans: 1,
      explain: '`endl` 输出换行并 flush（强制把缓冲区内容推出去）。大量输出时频繁 flush 会明显拖慢速度，循环里用 `"\\n"`，需要立即看到输出时才用 `endl`。' },
    { id: 'pk3', ch: 'cp1', point: '初始化列表', type: 'choice', diff: 1,
      prompt: '构造函数里 `Point(int x, int y) : x(x), y(y) {}` 冒号后的部分叫什么？',
      opts: ['函数体', '初始化列表', '委托构造', '参数默认值'],
      ans: 1,
      explain: '初始化列表在构造函体之前执行，直接初始化成员。对 const 成员、引用成员和没有默认构造的成员，只能用这种方式。' },
    { id: 'pk4', ch: 'cp1', point: 'string 长度', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s = "hello";\n    s += "!";\n    cout << s.size() << " " << s[1] << "\\n";\n    return 0;\n}',
      answer: '6 e',
      explain: '拼接后长度 6；下标从 0 开始，`s[1]` 是第二个字符 e。' },
    { id: 'pk5', ch: 'cp1', point: 'const 引用', type: 'choice', diff: 2,
      prompt: '函数参数写成 `const string &s` 的好处是？',
      opts: ['能修改传入的字符串', '不拷贝、也不能修改，最省最安全', '会自动复制一份再传', '只能传字面量'],
      ans: 1,
      explain: '引用避免拷贝大对象，`const` 保证函数不会改它。这是 C++ 里传只读大对象的标准写法。' },
    { id: 'pk6', ch: 'cp2', point: '构造调用', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\nusing namespace std;\n\nclass A {\npublic:\n    int v;\n    A() : v(1) { cout << "默认 "; }\n    A(int x) : v(x) { cout << "带参 "; }\n};\n\nint main() {\n    A a;\n    A b(7);\n    cout << a.v + b.v << "\\n";\n    return 0;\n}',
      answer: '默认 带参 8',
      explain: '`A a;` 走默认构造 v=1，`A b(7);` 走带参构造 v=7，1+7=8。注意 `A a;` 不能写成 `A a();`——那会被解析成函数声明。' },
    { id: 'pk7', ch: 'cp2', point: '析构时机', type: 'choice', diff: 2,
      prompt: '局部对象什么时候调用析构函数？',
      opts: ['程序结束时统一调用', '离开其所在作用域时', '只在 delete 时', '由程序员手动调用'],
      ans: 1,
      explain: '栈上对象在离开作用域（函数返回、代码块结束）时自动析构，顺序与创建相反。这正是 RAII 能可靠工作的原因。' },
    { id: 'pk8', ch: 'cp2', point: '封装', type: 'code', diff: 2,
      scene: '写一个能自我校验的账户余额小类，避免直接改字段把余额改成负数。',
      prompt: '补全 `Account` 类：构造时若初始金额为负数则置 0；`add(double)` 加钱；`get()` 返回余额。输出保留一位小数。程序最后打印余额。',
      starter: '#include <iostream>\nusing namespace std;\n\nclass Account {\nprivate:\n    double balance;\npublic:\n    Account(double init) : balance(init > 0 ? init : 0) {}\n    void add(double x) { /* 在这里写代码 */ }\n    double get() const { return balance; }\n};\n\nint main() {\n    Account a(-50);\n    a.add(120.5);\n    cout << a.get() << "\\n";\n    return 0;\n}',
      tests: [{ in: '', out: '120.5' }],
      solution: '#include <iostream>\nusing namespace std;\n\nclass Account {\nprivate:\n    double balance;\npublic:\n    Account(double init) : balance(init > 0 ? init : 0) {}\n    void add(double x) { if (x > 0) balance += x; }\n    double get() const { return balance; }\n};\n\nint main() {\n    Account a(-50);\n    a.add(120.5);\n    cout << a.get() << "\\n";\n    return 0;\n}',
      explain: '两项校验都放在类内部：构造时把负数初始值归零，`add` 只接受正数。外部无论怎么调用，余额都不会变成不合理值——这就是封装的实际价值。' },
    { id: 'pk9', ch: 'cp3', point: 'vector 遍历', type: 'code', diff: 2,
      scene: '把一组成绩里的不及格分数（<60）全部加 5 分后输出，用来核对补考名单。',
      prompt: '读入 5 个整数存进 `vector<int>`，把所有小于 60 的元素加 5，然后按原顺序输出这 5 个数（空格分隔）。',
      starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v(5);\n    for (int i = 0; i < 5; i++) cin >> v[i];\n    /* 在这里写代码 */\n    for (int i = 0; i < 5; i++) cout << v[i] << (i == 4 ? "" : " ");\n    cout << "\\n";\n    return 0;\n}',
      tests: [{ in: '58 72 45 90 60', out: '63 72 50 90 60' }],
      solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v(5);\n    for (int i = 0; i < 5; i++) cin >> v[i];\n    for (int &x : v) if (x < 60) x += 5;\n    for (int i = 0; i < 5; i++) cout << v[i] << (i == 4 ? "" : " ");\n    cout << "\\n";\n    return 0;\n}',
      explain: '关键是 `for (int &x : v)` ——用引用才能改到容器里的元素。写成 `int x` 只是改了副本，输出时还是原值。' },
    { id: 'pk10', ch: 'cp3', point: 'set 去重', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <set>\nusing namespace std;\nint main() {\n    set<int> s;\n    for (int x : {3, 1, 3, 2, 1}) s.insert(x);\n    cout << s.size() << " ";\n    for (int x : s) cout << x;\n    cout << "\\n";\n    return 0;\n}',
      answer: '3 123',
      explain: '`set` 自动去重并按升序排列，所以 5 次插入只留下 3 个元素，输出顺序是 1 2 3。' },
    { id: 'pk11', ch: 'cp3', point: '排序比较器', type: 'choice', diff: 2,
      prompt: '要让 `sort` 按降序排，下面哪种写法可行？',
      opts: ['sort(v.begin(), v.end(), greater<int>())', 'sort(v.begin(), v.end(), less<int>())', 'sort(v.rbegin(), v.rend(), greater<int>())', 'sort(v.begin(), v.end() - 1)'],
      ans: 0,
      explain: '传入 `greater<int>()` 作为比较器即降序；默认（或不写）是 `less`，即升序。' },
    { id: 'pk12', ch: 'cp4', point: '基类构造', type: 'choice', diff: 2,
      prompt: '派生类构造函数里必须做什么？',
      opts: ['什么都不用做，基类会自动无参构造', '在初始化列表里显式调用基类构造（若基类没有默认构造）', '必须先调用基类的析构函数', '必须把基类成员设为 public'],
      ans: 1,
      explain: '派生类对象包含一个基类子对象，必须先构造它。基类有默认构造时可省略；没有的话必须在初始化列表里显式调用，否则编译报错。' },
    { id: 'pk13', ch: 'cp4', point: 'override 检查', type: 'code', diff: 2,
      scene: '用多态统一处理不同形状的面积计算，这是最常见的接口设计练习。',
      prompt: '补全 `Rect` 的 `area()`，让 `Shape *p = &r; p->area()` 通过虚函数算出 3×4=12。',
      starter: '#include <iostream>\nusing namespace std;\n\nclass Shape {\npublic:\n    virtual double area() const = 0;\n    virtual ~Shape() {}\n};\n\nclass Rect : public Shape {\n    double w, h;\npublic:\n    Rect(double w, double h) : w(w), h(h) {}\n    double area() const override { /* 在这里写代码 */ }\n};\n\nint main() {\n    Rect r(3, 4);\n    Shape *p = &r;\n    cout << p->area() << "\\n";\n    return 0;\n}',
      tests: [{ in: '', out: '12' }],
      solution: '#include <iostream>\nusing namespace std;\n\nclass Shape {\npublic:\n    virtual double area() const = 0;\n    virtual ~Shape() {}\n};\n\nclass Rect : public Shape {\n    double w, h;\npublic:\n    Rect(double w, double h) : w(w), h(h) {}\n    double area() const override { return w * h; }\n};\n\nint main() {\n    Rect r(3, 4);\n    Shape *p = &r;\n    cout << p->area() << "\\n";\n    return 0;\n}',
      explain: '返回 `w * h` 即可。因为 `area` 是虚函数，`p->area()` 会在运行时根据实际对象（Rect）找到正确实现，输出 12。' },
    { id: 'pk14', ch: 'cp5', point: '模板实例化', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nT twice(T x) { return x + x; }\n\nint main() {\n    cout << twice(4) << " " << twice(1.5) << " ";\n    cout << twice(string("ab")) << "\\n";\n    return 0;\n}',
      answer: '8 3 abab',
      explain: '编译器分别为 int、double、string 生成三个版本：4+4=8、1.5+1.5=3、字符串相加是拼接。' },
    { id: 'pk15', ch: 'cp5', point: '智能指针选择', type: 'choice', diff: 2,
      prompt: '需要一个独占所有权的指针，默认应该用？',
      opts: ['shared_ptr', 'unique_ptr', 'weak_ptr', '裸指针 + 手动 delete'],
      ans: 1,
      explain: '`unique_ptr` 零额外开销、语义最清晰，是默认选择。只有确实需要多处共享时才升级成 `shared_ptr`。' },
    { id: 'pk16', ch: 'cp5', point: '异常捕获顺序', type: 'choice', diff: 3,
      prompt: '有多个 catch 块时，关于顺序的说法正确的是？',
      opts: ['顺序无所谓', '应先捕获派生的具体异常，最后捕获基类', '应先捕获基类异常', '只能有一个 catch'],
      ans: 1,
      explain: 'catch 按顺序匹配，第一个匹配的生效。如果先写 `catch (const exception&)`，后面针对具体类型的 catch 永远不会执行。' },
    { id: 'pk17', ch: 'cp5', point: '异常输出', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\nusing namespace std;\nint main() {\n    int depth = 0;\n    try {\n        depth = 1;\n        throw 42;\n    } catch (int e) {\n        cout << "catch " << e << "\\n";\n    }\n    cout << depth << "\\n";\n    return 0;\n}',
      answer: 'catch 42\n1',
      explain: '抛出 int 42 被 `catch (int e)` 接住；depth 在抛出前已赋值为 1，catch 之后程序继续，所以打印 1。' },
    { id: 'pk18', ch: 'cp1', point: '命名空间', type: 'choice', diff: 1,
      prompt: '`using namespace std;` 的作用是？',
      opts: ['把 std 里的名字引入当前作用域，可省略 std:: 前缀', '定义一个叫 std 的新命名空间', '包含所有标准头文件', '提高程序运行速度'],
      ans: 0,
      explain: '它让 `cout` 可以代替 `std::cout`。方便但容易撞名，正式项目里建议在头文件中避免使用，只在小范围或 .cpp 里用。' }
  ]
};
