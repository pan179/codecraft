/* ============================================================
   CodeCraft 数据 · C++（8 章 36 课）
   ============================================================ */
window.LANGS = window.LANGS || {};

window.LANGS.cpp = {
  id: 'cpp', name: 'C++', en: 'C++17', icon: '🔷', color: '#f34b7d',
  blurb: '在 C 的速度上补上了类、模板和自动资源管理。学完 C 再来，你会发现很多「手动挡」终于变成了「自动挡」，但代价是规则更多。',
  hello: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++!" << std::endl;\n    return 0;\n}',
  lab: [
    { name: 'Hello World', code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++!" << std::endl;\n    std::cout << "今天开始学 C++" << std::endl;\n    return 0;\n}' },
    { name: '读两个数求和', code: '#include <iostream>\n\nint main() {\n    int a = 0, b = 0;\n    std::cin >> a >> b;\n    std::cout << "和 = " << a + b << std::endl;\n    return 0;\n}' },
    { name: 'vector 求平均', code: '#include <iostream>\n#include <vector>\n#include <numeric>\n\nint main() {\n    std::vector<int> v = {80, 92, 66, 100, 71};\n    int sum = std::accumulate(v.begin(), v.end(), 0);\n    std::cout << "sum = " << sum << " avg = " << (double)sum / v.size() << std::endl;\n    return 0;\n}' },
    { name: 'map 统计词频', code: '#include <iostream>\n#include <map>\n#include <sstream>\n#include <string>\n\nint main() {\n    std::map<std::string, int> m;\n    std::istringstream in("the cat the dog the bird");\n    std::string w;\n    while (in >> w) ++m[w];\n    for (const auto& kv : m) std::cout << kv.first << ":" << kv.second << " ";\n    std::cout << std::endl;\n    return 0;\n}' }
  ],
  chapters: [
    {
      id: 'cpp1', num: 1, title: '从 C 到 C++', icon: '🚀',
      intro: 'C++ 不是「C 加几个语法糖」。它换了一套 I/O 方式、引入了**引用**这种真正的别名、把字符串和可变长数组做成了标准类型。这一章先把这些「新地基」摸清楚，后面写类才不会别扭。',
      goals: ['用 g++ 编译并理解 -std 与 -Wall', '用 cout / cin 做输入输出与格式化', '说清引用和指针的区别', '会用 auto、namespace 与 nullptr'],
      lessons: [
        {
          id: 'cpp1l1', title: '编译与工具链', key: 'g++ · -std=c++17 · 警告', time: 12,
          blocks: [
            { t: 'p', x: 'C++ 和 C 一样是编译型语言，走的是同一条流水线：预处理 → 编译 → 汇编 → 链接。区别只在于编译器换成 `g++`（或 `clang++`），并且要告诉它用哪个标准版本。' },
            { t: 'code', run: false, label: '终端', x: '> g++ -std=c++17 -Wall -O2 hello.cpp -o hello\n> ./hello\nHello, C++!\n\n# 分开看每一步\n> g++ -E hello.cpp        # 只预处理\n> g++ -S hello.cpp        # 只到汇编\n> g++ -c hello.cpp        # 只到 .o\n> g++ hello.o -o hello    # 只做链接' },
            { t: 'code', x: '#include <iostream>   // C++ 的头文件不带 .h\n\nint main() {\n    std::cout << "Hello, C++!" << std::endl;\n    std::cout << "标准版本：" << __cplusplus << std::endl;\n    return 0;\n}', out: 'Hello, C++!\n标准版本：201703' },
            { t: 'p', x: '`__cplusplus` 是编译器预先定义的宏，值是标准对应的数字：C++11 是 `201103`、C++14 是 `201402`、C++17 是 `201703`、C++20 是 `202002`。写库的时候常用来做条件编译。' },
            { t: 'table', head: ['参数', '作用', '不写会怎样'], rows: [['`-std=c++17`', '指定语言标准', 'g++ 13 默认已是 C++17，但换编译器可能退回老标准'], ['`-Wall -Wextra`', '打开常用警告', '未使用变量、有符号无符号比较等问题不会提示'], ['`-O2`', '开启优化', '发布版本慢几倍，且部分 UB 暴露不出来'], ['`-g`', '保留调试符号', 'gdb 里看不到变量名和行号'], ['`-fsanitize=address`', '内存错误检查', '越界、悬垂指针只能靠猜']] },
            { t: 'note', x: '**链接错误和编译错误要分清。** `expected \';\' before ...` 是编译期（语法/类型），`undefined reference to ...` 是链接期（函数只声明、没定义，或者漏写了 `.cpp` / 漏链库）。后者往往意味着「文件没加进编译命令」。' },
            { t: 'warn', x: '`main` 的标准签名只有 `int main()` 和 `int main(int argc, char* argv[])` 两种。写成 `void main()` 在多数编译器上能过，但不符合标准，换平台就会出问题。' }
          ]
        },
        {
          id: 'cpp1l2', title: 'iostream：cin、cout 与格式化', key: 'cout · cin · 格式化', time: 12,
          blocks: [
            { t: 'p', x: 'C++ 用**流**代替了 `printf` 系列。`std::cout` 是输出流，`<<` 是「把右边的东西塞进流里」；`std::cin` 是输入流，`>>` 是「从流里取出来」。好处是类型安全——写错类型编译器直接报错，而不是像 `printf` 那样悄悄打印垃圾值。' },
            { t: 'code', x: '#include <iostream>\n#include <iomanip>\n#include <string>\n\nint main() {\n    std::string name = "小明";\n    int age = 18;\n    double score = 92.567;\n\n    std::cout << "姓名：" << name << "，年龄：" << age << std::endl;\n    std::cout << std::fixed << std::setprecision(1) << score << std::endl;\n    std::cout << std::setw(6) << 42 << "|" << std::endl;\n    std::cout << std::setfill(\'0\') << std::setw(4) << 7 << std::endl;\n    return 0;\n}', out: '姓名：小明，年龄：18\n92.6\n    42|\n0007' },
            { t: 'p', x: '格式化的三个操纵符要记牢：`std::fixed` 改成定点表示，`std::setprecision(1)` 保留 1 位小数，`std::setw(n)` 设宽度（**只对下一次输出有效**）。`std::setfill` 改填充字符，会一直有效直到再次修改。' },
            { t: 'code', x: '#include <iostream>\n\nint main() {\n    int a = 0, b = 0;\n    std::cout << "输入两个整数：";\n    std::cin >> a >> b;\n    std::cout << a << " + " << b << " = " << a + b << std::endl;\n    return 0;\n}', out: '输入两个整数：3 4\n3 + 4 = 7' },
            { t: 'warn', x: '上面这段需要真的敲 `3 4` 才会往下走，所以别点运行按钮，直接看输出框就好。`cin >>` 会自动跳过空白符（空格、换行、制表），所以「3 4」和分两行输入效果一样。' },
            { t: 'table', head: ['需求', '`printf` 写法', '`cout` 写法'], rows: [['换行', '`\\n`', '`std::endl`（会 flush）或 `"\\n"`'], ['保留两位小数', '`%.2f`', '`std::fixed << std::setprecision(2)`'], ['左对齐占 8 宽', '`%-8d`', '`std::left << std::setw(8)`'], ['十六进制', '`%x`', '`std::hex`（之后一直是十六进制，要 `std::dec` 改回）']] },
            { t: 'principle', x: '**日常用 `"\\n"` 而不是 `std::endl`。** `endl` 每次都强制刷新缓冲区，循环里用会明显变慢。只有在需要立刻看到输出（比如打日志、交互提示）时才用 `endl`。' }
          ]
        },
        {
          id: 'cpp1l3', title: '引用与 const', key: '引用 · 别名 · const 正确性', time: 14,
          blocks: [
            { t: 'p', x: '**引用就是别名**：`int& r = a;` 之后 `r` 和 `a` 是同一个变量，不是副本，也不是指针。改 `r` 就是改 `a`，取地址也一样。它必须初始化，而且一旦绑上就不能改绑别人——这两点正好补上了指针最容易出错的地方。' },
            { t: 'code', x: '#include <iostream>\n\nvoid addOne(int& x) { ++x; }     // 传引用：直接改原变量\n\nint main() {\n    int a = 10;\n    int& r = a;                  // r 是 a 的别名\n    r = 20;\n    std::cout << a << " " << (&r == &a) << std::endl;\n\n    addOne(a);\n    std::cout << a << std::endl;\n    return 0;\n}', out: '20 1\n21' },
            { t: 'p', x: '`&r == &a` 为真（打印 1）说明它们地址相同，是同一个对象。这正是引用「零开销」的原因：编译后就是直接操作那块内存，不像指针还要解引用一次。' },
            { t: 'p', x: '`const` 在 C++ 里是**契约**：承诺「我不改」。它有两个位置，含义完全不同。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n\nvoid print(const std::string& s) {     // 传 const 引用：不拷贝，也不许改\n    std::cout << s << " (" << s.size() << ")" << std::endl;\n}\n\nint main() {\n    const std::string text = "hello";\n    print(text);\n\n    std::string a = "abc";\n    const std::string& ref = a;         // 通过 ref 只能读\n    a += "d";                           // 但原对象本身能改\n    std::cout << ref << std::endl;\n    return 0;\n}', out: 'hello (5)\nabcd' },
            { t: 'table', head: ['写法', '含义'], rows: [['`const int* p`', '指向的内容不能改，指针本身可以换目标'], ['`int* const p`', '指针本身不能改，指向的内容可以改'], ['`const int* const p`', '都不能改'], ['`const T& x`', '最常见的参数写法：不拷贝 + 不许改']] },
            { t: 'note', x: '**大对象一定用 `const T&` 传参。** `std::string`、`std::vector`、自定义类都别按值传——那会整份拷贝。小的基本类型（`int`、`double`、指针）直接按值传反而更快。' },
            { t: 'tip', x: '成员函数后面加 `const`（如 `double balance() const`）表示「这个函数不会改对象」。这样 `const` 对象才能调用它，也是别人判断你接口是否安全的第一眼依据。' }
          ]
        },
        {
          id: 'cpp1l4', title: '命名空间、auto 与 nullptr', key: 'namespace · auto · nullptr', time: 12,
          blocks: [
            { t: 'p', x: '三个「现代化」的小东西，几乎每个文件都会用到：`namespace` 解决重名，`auto` 让编译器帮你推类型，`nullptr` 替掉了有歧义的 `NULL`。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n\nnamespace app {\n    int version = 3;\n    std::string name() { return "CodeCraft"; }\n}\n\nint main() {\n    std::cout << app::name() << " v" << app::version << std::endl;\n\n    auto n = 42;              // 推导为 int\n    auto d = 3.14;            // 推导为 double\n    auto s = std::string("hi");\n    std::cout << sizeof(n) << " " << sizeof(d) << " " << s.size() << std::endl;\n\n    int* p = nullptr;         // 明确的空指针\n    std::cout << (p == nullptr) << std::endl;\n\n    int x = 5;\n    int* q = &x;\n    std::cout << *q << std::endl;\n    return 0;\n}', out: 'CodeCraft v3\n4 8 2\n1\n5' },
            { t: 'p', x: '为什么非要 `nullptr`？因为 `NULL` 在 C 里通常就是 `0`，遇到重载时会退化成 `int`，导致调错函数。`nullptr` 有自己的类型 `std::nullptr_t`，能隐式转成任意指针类型，但不会变成整数。' },
            { t: 'code', x: '#include <iostream>\n\nvoid take(int) { std::cout << "调用了 int 版本" << std::endl; }\nvoid take(int*) { std::cout << "调用了 指针版本" << std::endl; }\n\nint main() {\n    take(0);          // 0 是整数，走 int 版本\n    take(nullptr);    // 明确是空指针，走指针版本\n    return 0;\n}', out: '调用了 int 版本\n调用了 指针版本' },
            { t: 'warn', x: '**不要在头文件里写 `using namespace std;`。** 它会把整个 std 的名字倒进全局作用域，任何同名标识符都会打架。`.cpp` 文件里图省事可以写，头文件里一律用 `std::` 前缀。' },
            { t: 'note', x: '`auto` 只做**类型推导**，不是动态类型。`auto x = 1; x = "abc";` 照样编译不过。另外 `auto` 推导时会**丢掉引用和 const**，需要时得显式写 `const auto&`。' }
          ]
        }
      ]
    },
    {
      id: 'cpp2', num: 2, title: '类与对象', icon: '🧩',
      intro: '类是 C++ 的核心。它把「数据」和「操作数据的函数」绑在一起，再用 public / private 划出边界。这一章的重点不是语法，而是**对象的生命周期**：谁创建、谁拷贝、谁销毁。',
      goals: ['定义类并划分访问控制', '用初始化列表写构造器', '说清浅拷贝的灾难与拷贝构造的写法', '重载运算符并理解 static 成员'],
      lessons: [
        {
          id: 'cpp2l1', title: '类、成员与访问控制', key: 'class · public/private · const 成员函数', time: 12,
          blocks: [
            { t: 'p', x: '`class` 和 `struct` 的唯一区别是默认访问权限：`class` 默认 `private`，`struct` 默认 `public`。习惯上，「只是打包几个字段」用 `struct`，「有不变式要维护」用 `class`。' },
            { t: 'code', x: '#include <iostream>\n\nclass Account {\npublic:\n    void deposit(double amount) { balance_ += amount; }\n    double balance() const { return balance_; }\n\nprivate:\n    double balance_ = 0.0;      // 成员默认初始化\n};\n\nint main() {\n    Account a;\n    a.deposit(100);\n    a.deposit(50.5);\n    std::cout << a.balance() << std::endl;\n    // a.balance_ = 1e9;        // 编译错误：private 不可直接访问\n    return 0;\n}', out: '150.5' },
            { t: 'p', x: '`private` 不是「防君子」的摆设，它保证外部只能通过 `deposit` 改余额——你可以在里面加校验、加日志、加限制，而不用去改所有调用点。这就是**封装**的实际价值。' },
            { t: 'table', head: ['访问级别', '谁能访问'], rows: [['`public`', '任何人'], ['`protected`', '本类和派生类'], ['`private`', '只有本类（连派生类也不行）']] },
            { t: 'note', x: '成员变量命名常加后缀下划线（`balance_`），一眼区分「成员」和「参数」。这不是硬规定，但团队里统一了就能省掉大量 `this->`。' },
            { t: 'warn', x: '类定义末尾的 `};` 分号**不能省**。这是新手最常见、报错信息又最迷惑的一个错误——漏了分号，编译器会在下一行报一串莫名其妙的错。' }
          ]
        },
        {
          id: 'cpp2l2', title: '构造器、初始化列表与析构器', key: 'ctor · 初始化列表 · dtor', time: 14,
          blocks: [
            { t: 'p', x: '对象出生时调**构造器**，死亡时调**析构器**。析构器的执行时机是确定的：离开作用域、`delete`、或者栈展开（异常）时。这个「确定性析构」是 C++ 最值钱的特性之一。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n\nclass Logger {\npublic:\n    explicit Logger(std::string tag) : tag_(std::move(tag)) {\n        std::cout << "创建 " << tag_ << std::endl;\n    }\n    ~Logger() { std::cout << "销毁 " << tag_ << std::endl; }\n    const std::string& tag() const { return tag_; }\n\nprivate:\n    std::string tag_;\n};\n\nint main() {\n    Logger a("A");\n    {\n        Logger b("B");\n        std::cout << b.tag() << std::endl;\n    }                        // b 在这里析构\n    std::cout << "块结束" << std::endl;\n    return 0;\n}', out: '创建 A\n创建 B\nB\n销毁 B\n块结束\n销毁 A' },
            { t: 'p', x: '注意顺序：**先构造的后析构**（像叠盘子）。`b` 在花括号结束时立刻销毁，`a` 要等 `main` 返回。这个规律对成员变量同样成立：成员按**声明顺序**构造，按**逆序**析构。' },
            { t: 'p', x: '初始化列表 `: tag_(std::move(tag))` 是在**构造之前**直接初始化成员；写在函数体里的 `tag_ = tag` 则是先默认构造再赋值。对 `const` 成员、引用成员、没有默认构造器的成员，只有初始化列表这一条路。' },
            { t: 'code', x: '#include <iostream>\n\nclass Point {\npublic:\n    Point(int x, int y) : x_(x), y_(y) {}      // 必须用初始化列表\n    void show() const { std::cout << "(" << x_ << ", " << y_ << ")" << std::endl; }\n\nprivate:\n    const int x_;      // const 成员\n    int y_;\n};\n\nint main() {\n    Point p(3, 4);\n    p.show();\n    return 0;\n}', out: '(3, 4)' },
            { t: 'warn', x: '**成员初始化顺序看声明顺序，不看初始化列表的书写顺序。** 上面的 `x_` 声明在前，就一定先初始化 `x_`。如果写成 `y_(y), x_(y_)` 这种依赖关系，实际会用到还没初始化的值——编译器开 `-Wreorder` 会警告。' },
            { t: 'tip', x: '`explicit` 修饰单参数构造器，禁止 `Logger l = "A";` 这种隐式转换。养成习惯：**单参数构造器默认加 `explicit`**，除非你确实想要隐式转换。' }
          ]
        },
        {
          id: 'cpp2l3', title: '拷贝构造与深浅拷贝', key: '拷贝构造 · 深拷贝 · 三法则', time: 15,
          blocks: [
            { t: 'p', x: '编译器默认生成的拷贝构造是**逐成员复制**（浅拷贝）。成员里有裸指针时，复制的是指针值，两个对象指向同一块内存——析构时 `delete` 两次，程序直接崩。' },
            { t: 'code', run: false, label: '错误示例（别这样写）', x: 'class Buffer {\npublic:\n    explicit Buffer(const char* t) : data_(new char[std::strlen(t) + 1]) {\n        std::strcpy(data_, t);\n    }\n    ~Buffer() { delete[] data_; }\nprivate:\n    char* data_;\n};\n\nint main() {\n    Buffer a("hello");\n    Buffer b = a;        // 浅拷贝：b.data_ 和 a.data_ 是同一个地址\n}                        // 两个析构器各 delete 一次 → double free，崩溃' },
            { t: 'p', x: '解决办法是**自己写拷贝构造**，让新对象申请自己的内存并复制内容，这就是深拷贝。' },
            { t: 'code', x: '#include <iostream>\n#include <cstring>\n\nclass Buffer {\npublic:\n    explicit Buffer(const char* text)\n        : size_(std::strlen(text)), data_(new char[size_ + 1]) {\n        std::memcpy(data_, text, size_ + 1);\n    }\n\n    Buffer(const Buffer& other)                       // 拷贝构造\n        : size_(other.size_), data_(new char[size_ + 1]) {\n        std::memcpy(data_, other.data_, size_ + 1);\n        std::cout << "拷贝构造被调用" << std::endl;\n    }\n\n    ~Buffer() { delete[] data_; }\n\n    const char* get() const { return data_; }\n    void set(const char* text) {\n        delete[] data_;\n        size_ = std::strlen(text);\n        data_ = new char[size_ + 1];\n        std::memcpy(data_, text, size_ + 1);\n    }\n\nprivate:\n    size_t size_;\n    char* data_;\n};\n\nint main() {\n    Buffer a("hello");\n    Buffer b = a;        // 走拷贝构造\n    b.set("world");\n    std::cout << a.get() << " " << b.get() << std::endl;\n    return 0;\n}', out: '拷贝构造被调用\nhello world' },
            { t: 'p', x: '改 `b` 之后 `a` 还是 `hello`，说明两块内存彻底独立了。这就是深拷贝的效果。' },
            { t: 'principle', x: '**三法则（Rule of Three）：只要类里出现了析构函数、拷贝构造、拷贝赋值中的任何一个，另外两个大概率也需要写。** 因为「需要自定义析构」通常意味着「持有需要手动释放的资源」，而默认的拷贝方式对这类资源一定是错的。' },
            { t: 'note', x: '现代 C++ 更好的答案是**根本不持有裸指针**：用 `std::vector<char>` 代替 `new char[]`，用 `std::unique_ptr` 管理资源，编译器生成的拷贝/移动就自动是对的。第五章会详细讲。' }
          ]
        },
        {
          id: 'cpp2l4', title: '运算符重载', key: 'operator+ · ostream · 返回引用', time: 13,
          blocks: [
            { t: 'p', x: '运算符重载让自定义类型用起来像内置类型。`a + b` 本质是 `a.operator+(b)`。原则只有一条：**重载后的语义要符合直觉**，别让 `+` 表示减法。' },
            { t: 'code', x: '#include <iostream>\n\nstruct Vec2 {\n    double x = 0, y = 0;\n    Vec2(double x, double y) : x(x), y(y) {}\n\n    Vec2 operator+(const Vec2& o) const { return Vec2(x + o.x, y + o.y); }\n    Vec2& operator+=(const Vec2& o) { x += o.x; y += o.y; return *this; }\n    bool operator==(const Vec2& o) const { return x == o.x && y == o.y; }\n\n    friend std::ostream& operator<<(std::ostream& os, const Vec2& v) {\n        return os << "(" << v.x << ", " << v.y << ")";\n    }\n};\n\nint main() {\n    Vec2 a(1, 2), b(3, 4);\n    std::cout << a + b << std::endl;\n    a += b;\n    std::cout << a << std::endl;\n    std::cout << (a == Vec2(4, 6)) << std::endl;\n    return 0;\n}', out: '(4, 6)\n(4, 6)\n1' },
            { t: 'p', x: '`operator<<` 为什么要写成 `friend` 函数（或者类外的自由函数）？因为左操作数是 `std::ostream`，不是你的类，没法写成成员函数。写成友元只是让它能访问私有成员。' },
            { t: 'table', head: ['运算符', '推荐返回', '理由'], rows: [['`+` `-` `*`', '新对象（值）', '产生新结果，不修改操作数'], ['`+=` `-=`', '`T&`（`*this`）', '支持连续赋值并避免多余拷贝'], ['`==` `!=` `<`', '`bool`', '只回答真假'], ['`<<` `>>`', '`ostream&` / `istream&`', '必须返回流本身才能 `cout << a << b`']] },
            { t: 'warn', x: '`a == b` 里的 `a` 是 `const Vec2`，所以 `operator==` 必须加 `const`；否则 `const` 对象调不了它，编译器会满世界找别的匹配然后报一堆看不懂的错。' },
            { t: 'tip', x: 'C++20 只要写了 `operator<=>`（三路比较），`<`、`<=`、`>`、`>=` 会自动生成。如果你的编译器支持，能省掉一大段样板代码。' }
          ]
        },
        {
          id: 'cpp2l5', title: 'static 成员与友元', key: 'static · 类外定义 · friend', time: 12,
          blocks: [
            { t: 'p', x: '`static` 成员属于**类**，不属于某个对象：所有实例共用一份，可以用 `类名::成员` 直接访问。典型用途是计数器、单例、全局配置。' },
            { t: 'code', x: '#include <iostream>\n\nclass Counter {\npublic:\n    Counter() { ++count_; }\n    ~Counter() { --count_; }\n    static int count() { return count_; }\n\nprivate:\n    static int count_;        // 只是声明\n};\n\nint Counter::count_ = 0;      // 必须在类外定义一次\n\nint main() {\n    std::cout << Counter::count() << std::endl;\n    {\n        Counter a, b;\n        std::cout << Counter::count() << std::endl;\n    }\n    std::cout << Counter::count() << std::endl;\n    return 0;\n}', out: '0\n2\n0' },
            { t: 'p', x: '静态成员变量在类内只是**声明**，必须在类外给出定义（分配存储）。C++17 之后可以用 `inline static int count_ = 0;` 直接在类内定义，省掉类外那一行。' },
            { t: 'p', x: '`friend` 声明「这个函数/类可以访问我的私有成员」。它破坏了封装，所以只在**运算符重载**和**紧耦合的辅助类**里用，别拿它当常规手段。' },
            { t: 'code', x: '#include <iostream>\n\nclass Box {\npublic:\n    explicit Box(int v) : v_(v) {}\n    friend int peek(const Box& b);      // 友元函数\n\nprivate:\n    int v_;\n};\n\nint peek(const Box& b) { return b.v_; }   // 可以访问 private\n\nint main() {\n    Box b(42);\n    std::cout << peek(b) << std::endl;\n    return 0;\n}', out: '42' },
            { t: 'note', x: '友元关系**不能继承，也不能传递**：A 是 B 的友元，不代表 A 的儿子也是；B 是 A 的友元也不代表 B 能碰 A 的友元。它是单向且不可继承的。' }
          ]
        }
      ]
    },
    {
      id: 'cpp3', num: 3, title: '内存与资源管理', icon: '🧠',
      intro: 'C 里你要自己 `malloc` / `free`，C++ 把这件事交给了**对象**。RAII 的意思是「资源获取即初始化」：把资源交给一个对象，构造时拿、析构时还，从此不用再记得配对释放。这一章是 C++ 与 C 差距最大的地方。',
      goals: ['分清栈和堆的分配与释放', '用 RAII 让析构函数负责清理', '优先用 unique_ptr / shared_ptr 而不是裸指针', '理解移动语义解决什么性能问题'],
      lessons: [
        {
          id: 'cpp3l1', title: '栈与堆：new / delete', key: '栈 · 堆 · new[] / delete[]', time: 13,
          blocks: [
            { t: 'p', x: '**栈**上的对象由编译器管理，离开作用域自动回收，分配极快但大小有限（通常几 MB）。**堆**上的对象要自己 `new`、自己 `delete`，空间大但慢，而且忘了释放就是泄漏。' },
            { t: 'code', x: '#include <iostream>\n\nint main() {\n    int stackArr[3] = {1, 2, 3};\n    int* heapArr = new int[3]{4, 5, 6};\n\n    for (int i = 0; i < 3; ++i) std::cout << stackArr[i] << " ";\n    std::cout << std::endl;\n    for (int i = 0; i < 3; ++i) std::cout << heapArr[i] << " ";\n    std::cout << std::endl;\n\n    delete[] heapArr;       // new[] 必须配 delete[]\n    heapArr = nullptr;      // 置空，避免野指针\n    std::cout << (heapArr == nullptr) << std::endl;\n    return 0;\n}', out: '1 2 3\n4 5 6\n1' },
            { t: 'table', head: ['', '栈', '堆'], rows: [['谁释放', '编译器自动', '你自己（或智能指针）'], ['速度', '极快（只是移动栈指针）', '较慢（要查找合适的空闲块）'], ['大小', '有限（默认 1–8MB）', '受物理内存限制'], ['生命周期', '离开作用域就没了', '从 new 到 delete'], ['典型错误', '返回局部变量的地址', '泄漏、重复释放、越界']] },
            { t: 'warn', x: '`new[]` 一定要配 `delete[]`。写成 `delete p` 只调用第一个元素的析构函数，其余对象没被正确清理——对带析构函数的类型是明确的未定义行为。' },
            { t: 'code', run: false, label: '三种常见的堆错误', x: '// 1. 泄漏：指针被覆盖，那块内存再也找不到\nint* p = new int(1);\np = new int(2);            // 第一块永远泄漏\n\n// 2. 重复释放：程序崩溃\ndelete p;\ndelete p;                  // UB\n\n// 3. 用已释放的内存（悬垂指针）\ndelete p;\nstd::cout << *p;           // UB，可能打印垃圾也可能崩' },
            { t: 'principle', x: '**现代 C++ 里手写 `new` / `delete` 的场景已经很少了。** 需要动态数组用 `std::vector`，需要单个对象用 `std::make_unique`。它们的析构函数会替你释放，异常、提前 return 都不会漏。' }
          ]
        },
        {
          id: 'cpp3l2', title: 'RAII：把资源交给对象', key: 'RAII · 析构即清理 · 异常安全', time: 14,
          blocks: [
            { t: 'p', x: 'RAII 的核心思想一句话：**把「释放」写进析构函数，剩下的交给作用域。** 无论是正常返回、`break` 跳出、还是抛异常，只要对象离开作用域，析构一定被调用。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n#include <stdexcept>\n\nclass File {\npublic:\n    explicit File(std::string path) : path_(std::move(path)) {\n        std::cout << "打开 " << path_ << std::endl;\n    }\n    ~File() { std::cout << "关闭 " << path_ << std::endl; }\n    void write(const std::string& s) const { std::cout << "写入 " << s << std::endl; }\n\nprivate:\n    std::string path_;\n};\n\nint main() {\n    try {\n        File f("data.txt");\n        f.write("hello");\n        throw std::runtime_error("磁盘满了");\n    } catch (const std::exception& e) {\n        std::cout << "捕获：" << e.what() << std::endl;\n    }\n    std::cout << "main 结束" << std::endl;\n    return 0;\n}', out: '打开 data.txt\n写入 hello\n关闭 data.txt\n捕获：磁盘满了\nmain 结束' },
            { t: 'p', x: '注意「关闭 data.txt」出现在「捕获」**之前**——异常抛出时，栈上的 `f` 被销毁，析构函数正常执行。这就是 RAII 在异常场景下的价值：你不需要在每个 `return` 和 `throw` 前面写 `close()`。' },
            { t: 'p', x: '标准库到处是 RAII：`std::string` 管字符数组、`std::vector` 管一段内存、`std::fstream` 管文件句柄、`std::lock_guard` 管互斥锁、`std::unique_ptr` 管任意资源。**看到需要「配对操作」的东西，就该想到用 RAII 包一层。**' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n\nint main() {\n    {\n        std::vector<int> v = {1, 2, 3};\n        std::cout << "size " << v.size() << std::endl;\n    }                        // 内存自动归还\n\n    std::vector<int> w;\n    w.push_back(1);\n    w.push_back(2);\n    std::cout << w.size() << " " << w.capacity() << std::endl;\n    return 0;\n}', out: 'size 3\n2 2' },
            { t: 'note', x: '`capacity()` 是「已申请的空间能放多少」，`size()` 是「现在放了几个」。`push_back` 超出容量时会重新申请一块更大的内存并搬过去，所以容量常按 1、2、4、8 这样翻倍增长。' },
            { t: 'principle', x: '**写 C++ 的第一原则：不要用裸 `new`。** 每一个 `new` 都问自己「谁负责 delete，怎么保证一定执行」。答不上来就换成 `vector` 或 `unique_ptr`。' }
          ]
        },
        {
          id: 'cpp3l3', title: 'unique_ptr：独占所有权', key: 'unique_ptr · 所有权转移', time: 13,
          blocks: [
            { t: 'p', x: '`std::unique_ptr<T>` 是「独占」的智能指针：同一时刻只有一个 unique_ptr 拥有这个对象，它析构时自动 `delete`。它的大小和裸指针一样（零额外开销），所以完全可以当默认选择。' },
            { t: 'code', x: '#include <iostream>\n#include <memory>\n\nstruct Node {\n    int value;\n    explicit Node(int v) : value(v) {}\n    ~Node() { std::cout << "释放 " << value << std::endl; }\n};\n\nint main() {\n    std::unique_ptr<Node> a = std::make_unique<Node>(1);\n    std::cout << a->value << std::endl;\n\n    std::unique_ptr<Node> b = std::move(a);    // 所有权转移，a 变空\n    std::cout << (a == nullptr) << " " << b->value << std::endl;\n\n    b.reset();                                 // 立刻释放\n    std::cout << (b == nullptr) << std::endl;\n    return 0;\n}', out: '1\n1 1\n释放 1\n1' },
            { t: 'p', x: '`std::move(a)` 之后 `a` 变成空指针——这是**编译期**保证的：unique_ptr 禁止拷贝，只允许移动。所以「两个 unique_ptr 指向同一对象」这种错误根本写不出来。' },
            { t: 'code', x: '#include <iostream>\n#include <memory>\n#include <vector>\n\nstruct Task {\n    int id;\n    explicit Task(int i) : id(i) {}\n    ~Task() { std::cout << "完成 " << id << std::endl; }\n};\n\nint main() {\n    std::vector<std::unique_ptr<Task>> tasks;\n    tasks.push_back(std::make_unique<Task>(1));\n    tasks.push_back(std::make_unique<Task>(2));\n\n    for (const auto& t : tasks) std::cout << "处理 " << t->id << std::endl;\n    std::cout << "清空容器" << std::endl;\n    tasks.clear();\n    std::cout << "结束" << std::endl;\n    return 0;\n}', out: '处理 1\n处理 2\n清空容器\n完成 1\n完成 2\n结束' },
            { t: 'note', x: '析构顺序是 `完成 1` 再 `完成 2`——`vector` 销毁元素时按**从前往后**的顺序（和「同一作用域内局部变量逆序析构」不是一回事）。这也解释了为什么 `vector` 里放 unique_ptr 不需要手动清理：容器自己会负责。' },
            { t: 'table', head: ['操作', '写法', '说明'], rows: [['创建', '`std::make_unique<T>(args)`', '比 `unique_ptr<T>(new T)` 更安全高效'], ['取原始指针', '`p.get()`', '只借出去用，不转移所有权'], ['转移', '`std::move(p)`', '之后 p 为空'], ['提前释放', '`p.reset()`', '也可以 `p.reset(new T)` 换一个新对象'], ['放弃管理', '`p.release()`', '返回裸指针且 p 变空，**需要你自己 delete**']] },
            { t: 'warn', x: '`unique_ptr` 可以自定义删除器，用来管理非 `new` 出来的资源，比如 `std::unique_ptr<FILE, decltype(&fclose)> fp(fopen(...), &fclose);`。这样 C 的句柄也能享受 RAII。' }
          ]
        },
        {
          id: 'cpp3l4', title: 'shared_ptr 与 weak_ptr', key: '引用计数 · 循环引用', time: 13,
          blocks: [
            { t: 'p', x: '`std::shared_ptr` 用**引用计数**做共享所有权：每多一个 shared_ptr 指向同一对象，计数 +1；每销毁一个，-1；减到 0 才真正释放。代价是每个对象多一个控制块，且计数增减是原子操作（比 unique_ptr 慢）。' },
            { t: 'code', x: '#include <iostream>\n#include <memory>\n\nstruct Session {\n    int id;\n    explicit Session(int i) : id(i) {}\n    ~Session() { std::cout << "销毁 " << id << std::endl; }\n};\n\nint main() {\n    auto a = std::make_shared<Session>(7);\n    std::cout << a.use_count() << std::endl;\n    {\n        auto b = a;                        // 计数 +1\n        std::cout << a.use_count() << std::endl;\n        std::weak_ptr<Session> w = a;      // 弱引用，计数不变\n        std::cout << a.use_count() << " " << w.expired() << std::endl;\n    }\n    std::cout << a.use_count() << std::endl;\n    a.reset();\n    std::cout << "结束" << std::endl;\n    return 0;\n}', out: '1\n2\n2 0\n1\n销毁 7\n结束' },
            { t: 'p', x: '`weak_ptr` 不增加计数，只「观察」。`expired()` 问「对象还在吗」，要用的时候必须 `lock()` 拿到一个 shared_ptr（对象已销毁则拿到空指针）。它的主要用途是**打破循环引用**。' },
            { t: 'code', run: false, label: '循环引用导致内存泄漏', x: 'struct Node {\n    std::shared_ptr<Node> next;      // 互相持有\n    std::shared_ptr<Node> prev;\n};\n\nauto x = std::make_shared<Node>();\nauto y = std::make_shared<Node>();\nx->next = y;\ny->prev = x;      // 现在 x 的计数是 2，y 也是 2\n// 离开作用域后各自减到 1，永远不归零 → 两个对象都不会释放' },
            { t: 'p', x: '把其中一个方向改成 `std::weak_ptr` 就能解决：`std::weak_ptr<Node> prev;`。链表、树里的「父指针」通常都该用 weak_ptr。' },
            { t: 'table', head: ['指针', '所有权', '开销', '什么时候用'], rows: [['裸指针 `T*`', '无（只观察）', '无', '函数参数、不涉及生命周期的引用'], ['`unique_ptr`', '独占', '零额外开销', '**默认首选**'], ['`shared_ptr`', '共享', '控制块 + 原子计数', '确实需要多方共同持有'], ['`weak_ptr`', '无（观察）', '控制块', '打破循环、缓存、观察者']] },
            { t: 'warn', x: '`auto p = std::shared_ptr<T>(new T);` 不如 `std::make_shared<T>()`：后者把对象和控制块一次分配完，少一次内存分配，也避免了「两次求值顺序」导致的一类异常安全问题。' }
          ]
        },
        {
          id: 'cpp3l5', title: '移动语义与右值引用', key: 'std::move · 右值引用 · noexcept', time: 15,
          blocks: [
            { t: 'p', x: '拷贝的代价是「整份复制」。但很多时候源对象马上就要销毁了（临时值、要清空的容器），把它的内部缓冲区**偷过来**显然更划算——这就是移动语义。它不复制数据，只转移指针。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n\nclass Heavy {\npublic:\n    explicit Heavy(size_t n) : data(n, 0) { std::cout << "构造 " << n << std::endl; }\n    Heavy(const Heavy& o) : data(o.data) { std::cout << "拷贝构造" << std::endl; }\n    Heavy(Heavy&& o) noexcept : data(std::move(o.data)) { std::cout << "移动构造" << std::endl; }\n\n    size_t size() const { return data.size(); }\n\nprivate:\n    std::vector<int> data;\n};\n\nint main() {\n    Heavy a(3);\n    Heavy b = a;                // 左值 → 拷贝\n    Heavy c = std::move(a);     // 显式当右值 → 移动\n    std::cout << b.size() << " " << c.size() << std::endl;\n    return 0;\n}', out: '构造 3\n拷贝构造\n移动构造\n3 3' },
            { t: 'p', x: '`std::move` 本身**不移动任何东西**，它只是把左值强制转换成右值引用（`T&&`），告诉编译器「这个对象我不要了，你可以掏空它」。真正的转移发生在移动构造/移动赋值里。' },
            { t: 'p', x: '为什么移动构造要标 `noexcept`？因为 `std::vector` 扩容时需要把元素搬到新内存：如果移动构造可能抛异常，搬到一半失败就没法回滚，所以标准库会**退回用拷贝**。标了 `noexcept` 才会走移动，性能差好几倍。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n#include <utility>\n\nint main() {\n    std::string a = "hello";\n    std::string b = std::move(a);\n    std::cout << b << std::endl;\n\n    std::string c = "world";\n    c = std::move(b);            // 移动赋值\n    std::cout << c << std::endl;\n    return 0;\n}', out: 'hello\nhello' },
            { t: 'note', x: '被移动过的对象处于「有效但未指定」的状态：可以安全地析构、重新赋值，但**不要读它的值**。所以上面代码里没有打印 `a`。' },
            { t: 'principle', x: '**五法则（Rule of Five）：如果需要自定义析构、拷贝构造、拷贝赋值，那么移动构造和移动赋值也应该一起定义。** 只写拷贝不写移动，所有「本可以偷」的场景都会退化成完整复制。' }
          ]
        }
      ]
    },
    {
      id: 'cpp4', num: 4, title: 'STL 容器', icon: '📦',
      intro: 'STL 是 C++ 最值得学的一部分：容器 + 迭代器 + 算法三件套，让你不用再造轮子。这一章的重点是**知道该选哪个容器**——选错了，程序可能慢十倍。',
      goals: ['熟练使用 vector 的增删查与扩容', '用 string / string_view 处理文本', '按场景选择 map、set、unordered_*', '理解迭代器与范围 for 的关系'],
      lessons: [
        {
          id: 'cpp4l1', title: 'vector：最常用的容器', key: 'push_back · size/capacity · erase', time: 14,
          blocks: [
            { t: 'p', x: '`std::vector` 是**连续内存的动态数组**。它同时具备数组的随机访问（`v[i]` 是 O(1)）和动态扩容能力，所以日常九成场景都用它。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {3, 1, 4};\n    v.push_back(1);\n    v.push_back(5);\n    std::cout << v.size() << " " << v.front() << " " << v.back() << std::endl;\n    std::cout << v[0] << " " << v.at(1) << std::endl;\n\n    v.pop_back();                         // 去掉最后一个\n    for (int x : v) std::cout << x << " ";\n    std::cout << std::endl;\n\n    v.erase(v.begin());                   // 删除第一个，O(n)\n    std::cout << v.size() << " " << v[0] << std::endl;\n    return 0;\n}', out: '5 3 5\n3 1\n3 1 4 1\n3 1' },
            { t: 'p', x: '`v[i]` 和 `v.at(i)` 的区别：**越界时 `[]` 是未定义行为（可能静默读到垃圾），`at` 会抛 `std::out_of_range`。** 索引来自用户输入或计算时用 `at`，自己循环内确定范围时用 `[]` 更快。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> v;\n    std::cout << v.size() << " " << v.capacity() << std::endl;\n\n    for (int i = 1; i <= 5; ++i) {\n        v.push_back(i);\n        std::cout << "size=" << v.size() << " cap=" << v.capacity() << std::endl;\n    }\n\n    v.reserve(100);                       // 一次要够，避免反复扩容\n    std::cout << v.capacity() << std::endl;\n    return 0;\n}', out: '0 0\nsize=1 cap=1\nsize=2 cap=2\nsize=3 cap=4\nsize=4 cap=4\nsize=5 cap=8\n100' },
            { t: 'p', x: '扩容策略是**翻倍**（libstdc++ 实际按 2 倍增长）。每次扩容都要申请新内存、把旧元素搬过去、释放旧的，所以能预估大小时先 `reserve(n)` 是常见优化。' },
            { t: 'table', head: ['操作', '复杂度', '注意'], rows: [['`v[i]` / `v.at(i)`', 'O(1)', '连续内存，CPU 缓存友好'], ['`push_back`', '均摊 O(1)', '扩容时 O(n)'], ['`insert` / `erase` 中间位置', 'O(n)', '要搬移后面的元素'], ['`push_front`', '**不存在**', 'vector 没有这个操作，用 `deque` 或 `list`'], ['查找某个值', 'O(n)', '要 O(log n) 就用 `set` / `map`']] },
            { t: 'warn', x: '**`push_back` 可能导致所有迭代器、指针、引用失效**（因为内存可能搬走了）。循环里一边遍历一边 `push_back` 是经典 bug，正确做法是先算出结果再插入，或者用下标遍历。' }
          ]
        },
        {
          id: 'cpp4l2', title: 'string 与 string_view', key: 'substr · find · npos · string_view', time: 13,
          blocks: [
            { t: 'p', x: '`std::string` 是自带长度的字符序列（不是以 `\\0` 结尾的裸数组），可以随意拼接、查找、截取，内存自己管。这是 C++ 相比 C 最省心的地方之一。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n\nint main() {\n    std::string s = "Hello";\n    s += ", World";\n    std::cout << s.size() << " " << s.substr(7, 5) << std::endl;\n    std::cout << s.find("World") << std::endl;\n    std::cout << (s.find("xyz") == std::string::npos) << std::endl;\n\n    s.replace(7, 5, "C++");\n    std::cout << s << std::endl;\n\n    std::cout << std::stoi("42") + 1 << std::endl;\n    std::cout << std::to_string(3.5) << std::endl;\n    return 0;\n}', out: '12 World\n7\n1\nHello, C++\n43\n3.500000' },
            { t: 'p', x: '`find` 找不到时返回 `std::string::npos`（一个特殊的大数），**必须用它来判断**，别写 `if (s.find(x))`——找到位置 0 时也会被当成假。`std::to_string(3.5)` 默认给 6 位小数，这也是很多人踩过的坑。' },
            { t: 'p', x: '`std::string_view`（C++17）是「指向一段字符的只读视图」：不拥有内存、不拷贝，只存指针和长度。传参用它，可以同时接受 `std::string` 和字符串字面量，还零拷贝。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n#include <string_view>\n\nvoid show(std::string_view sv) {          // 不拷贝任何字符\n    std::cout << sv.substr(0, 5) << " " << sv.size() << std::endl;\n}\n\nint main() {\n    std::string s = "Hello, World";\n    show(s);                    // 传 string\n    show("Hello, C++");         // 传字面量\n    show(std::string_view(s).substr(7));\n    return 0;\n}', out: 'Hello 12\nHello 10\nWorld 5' },
            { t: 'warn', x: '`string_view` **不拥有内存**。如果它指向的临时 `std::string` 已经被销毁，视图就悬空了——访问它是未定义行为。所以它适合做**函数参数**，不要存成成员变量或长期持有。' },
            { t: 'table', head: ['场景', '推荐'], rows: [['需要修改内容', '`std::string`'], ['只读参数（不拷贝）', '`std::string_view`'], ['需要 C 风格接口', '`s.c_str()`'], ['字符串转数字', '`std::stoi` / `std::stod`（失败抛异常）'], ['数字转字符串', '`std::to_string`']] }
          ]
        },
        {
          id: 'cpp4l3', title: 'map、set 与无序版本', key: '红黑树 · 哈希 · 有序 vs 快速', time: 15,
          blocks: [
            { t: 'p', x: '`std::map` / `std::set` 是**有序**的（内部红黑树），查找、插入、删除都是 O(log n)；`std::unordered_map` / `unordered_set` 是**哈希表**，平均 O(1) 但无序。' },
            { t: 'code', x: '#include <iostream>\n#include <map>\n#include <set>\n#include <string>\n\nint main() {\n    std::map<std::string, int> age;\n    age["小明"] = 18;\n    age["小红"] = 20;\n    age["小明"] = 19;                    // 键已存在 → 覆盖\n    std::cout << age.size() << " " << age["小明"] << std::endl;\n\n    if (age.count("小刚") == 0) std::cout << "没有小刚" << std::endl;\n\n    age.erase("小红");\n    for (const auto& kv : age) std::cout << kv.first << "=" << kv.second << std::endl;\n\n    std::set<int> s = {3, 1, 2, 3};       // 自动去重 + 排序\n    std::cout << s.size() << " " << *s.begin() << std::endl;\n    return 0;\n}', out: '2 19\n没有小刚\n小明=19\n3 1' },
            { t: 'p', x: '注意 `age["小刚"]` 这种写法有副作用：**如果键不存在，它会插入一个默认值 0**。只想查询不想插入时，用 `find` 或 `count`。' },
            { t: 'code', x: '#include <iostream>\n#include <map>\n\nint main() {\n    std::map<std::string, int> m = {{"a", 1}, {"b", 2}};\n\n    std::cout << m["x"] << std::endl;      // 插入 x=0\n    std::cout << m.size() << std::endl;\n\n    auto it = m.find("y");\n    std::cout << (it == m.end()) << std::endl;   // 只查，不插入\n    std::cout << m.size() << std::endl;\n\n    if (auto jt = m.find("b"); jt != m.end()) {  // C++17 的 if 初始化\n        std::cout << jt->second << std::endl;\n    }\n    return 0;\n}', out: '0\n3\n1\n3\n2' },
            { t: 'table', head: ['容器', '底层', '查找', '有序', '适用'], rows: [['`map` / `set`', '红黑树', 'O(log n)', '是（按键排序）', '需要范围查询、按序遍历'], ['`unordered_map` / `unordered_set`', '哈希表', '平均 O(1)', '否', '纯查找、计数，不 care 顺序'], ['`vector`', '连续数组', 'O(n)', '按插入顺序', '元素少（<100）时比 map 更快']] },
            { t: 'note', x: '**元素很少时 `vector` 往往比 `map` 快。** 连续内存的缓存命中率碾压树结构。只有数据量上千、又需要频繁查找时，map/hash 的优势才体现出来。' },
            { t: 'warn', x: '用自定义类型当 `map` 的键，必须提供比较规则（`operator<` 或自定义比较器）；当 `unordered_map` 的键，必须提供哈希函数（`std::hash` 特化）。否则编译报错一大串模板信息。' }
          ]
        },
        {
          id: 'cpp4l4', title: '迭代器与范围 for', key: 'begin/end · 迭代器失效 · auto&', time: 12,
          blocks: [
            { t: 'p', x: '迭代器是「泛化的指针」：`*it` 取值、`++it` 前进、`it != end` 判断结束。STL 的算法全部只认迭代器，所以 `sort`、`find`、`count` 能同时用于 vector、deque、甚至裸数组。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v = {1, 2, 3, 4, 5};\n\n    for (auto it = v.begin(); it != v.end(); ++it) std::cout << *it;\n    std::cout << std::endl;\n\n    auto it = std::find(v.begin(), v.end(), 3);\n    std::cout << (it - v.begin()) << std::endl;      // 转成下标\n\n    for (int& x : v) x *= 2;                        // 必须用引用才能改\n    for (int x : v) std::cout << x << " ";\n    std::cout << std::endl;\n\n    v.erase(v.begin() + 1);                         // 删下标 1\n    std::cout << v.size() << std::endl;\n    return 0;\n}', out: '12345\n2\n2 4 6 8 10\n4' },
            { t: 'p', x: '`end()` 指向**最后一个元素的下一个位置**，是个「哨兵」，不能解引用。所以遍历的边界是 `it != v.end()` 而不是 `<=`。' },
            { t: 'p', x: '`for (int x : v)` 是**拷贝**每个元素（改 x 不影响 v）；`for (int& x : v)` 是引用（能改）；`for (const auto& x : v)` 是只读引用（大对象时最常用，零拷贝）。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <string>\n\nint main() {\n    std::vector<std::string> names = {"小明", "小红"};\n\n    for (auto n : names) n += "!";              // 拷贝，改的是副本\n    std::cout << names[0] << std::endl;\n\n    for (auto& n : names) n += "!";             // 引用，改的是元素\n    std::cout << names[0] << std::endl;\n    return 0;\n}', out: '小明\n小明!' },
            { t: 'warn', x: '**在遍历过程中 `erase` 会让当前迭代器失效**。正确写法是 `it = v.erase(it);`（erase 返回下一个有效位置），并且不要再 `++it`。' },
            { t: 'tip', x: '想删掉所有满足条件的元素，用「erase-remove 惯用法」最稳：`v.erase(std::remove_if(v.begin(), v.end(), pred), v.end());`，一次遍历完成，不用手写迭代器逻辑。' }
          ]
        },
        {
          id: 'cpp4l5', title: '容器选用与复杂度', key: '选型 · 复杂度 · 缓存友好', time: 12,
          blocks: [
            { t: 'p', x: '选容器不该靠习惯，而该看三件事：**要什么操作、数据多大、要不要有序**。下面这张表建议记住。' },
            { t: 'table', head: ['需求', '首选', '理由'], rows: [['默认情况', '`vector`', '连续内存、缓存友好、尾部增删均摊 O(1)'], ['频繁头尾增删', '`deque`', '两端都是 O(1)'], ['频繁中间插入/删除 + 已持有位置', '`list`', 'O(1) 插入，但遍历慢'], ['按键查找、需要排序遍历', '`map` / `set`', 'O(log n) 且有序'], ['纯查找计数、不 care 顺序', '`unordered_map`', '平均 O(1)'], ['固定大小、栈上分配', '`std::array`', '零开销，编译期定长'], ['需要优先级队列', '`priority_queue`', '堆，取最值 O(log n)']] },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <list>\n#include <map>\n\nint main() {\n    std::vector<int> v(1000000, 1);        // 一百万个 1\n    long long sum = 0;\n    for (int x : v) sum += x;\n    std::cout << sum << std::endl;\n\n    std::list<int> l = {1, 2, 3};\n    l.push_front(0);                       // list 才有高效的头部插入\n    std::cout << l.size() << " " << l.front() << std::endl;\n\n    std::map<int, int> m;\n    m[1] = 10;\n    std::cout << m.at(1) << " " << m.size() << std::endl;\n    return 0;\n}', out: '1000000\n4 0\n10 1' },
            { t: 'p', x: '注意 `std::list` 在现代 C++ 里其实**很少是正确答案**：它的每个节点单独分配，遍历时内存跳跃、缓存全失效，实践中常常比 `vector` 还慢。真实项目里 vector + 偶尔的 insert 通常更快。' },
            { t: 'note', x: '`std::array<int, 5>` 和 C 数组一样在栈上、大小固定，但它是真正的容器：有 `size()`、能范围 for、能传给算法。需要定长数组时用它替代 `int a[5]`。' },
            { t: 'principle', x: '**不确定就先写 `std::vector`，测出来慢再换。** 过早换成 list 或 map 往往让代码更复杂还更慢。先让它对，再让它快。' }
          ]
        }
      ]
    },
    {
      id: 'cpp5', num: 5, title: '算法与 Lambda', icon: '⚡',
      intro: '有了容器，接下来是「怎么处理里面的数据」。STL 提供了上百个算法，配上 lambda，你能把「遍历 + 判断 + 收集」压缩成一行，而且意图比手写 for 循环清楚得多。',
      goals: ['用 sort / find / count_if / accumulate 解决常见问题', '写出带捕获列表的 lambda', '给 sort 传自定义比较规则', '理解函数对象与 std::function 的取舍'],
      lessons: [
        {
          id: 'cpp5l1', title: 'algorithm 常用算法', key: 'sort · find · count · accumulate', time: 13,
          blocks: [
            { t: 'p', x: 'STL 算法都遵循同一个模式：**传一段迭代器区间 `[first, last)`，加上可选的判断函数**。它们不改容器结构，只读或重排元素，所以能用在任何提供迭代器的容器上。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <numeric>\n\nint main() {\n    std::vector<int> v = {5, 2, 8, 1, 9};\n\n    std::cout << *std::max_element(v.begin(), v.end()) << std::endl;\n    std::cout << *std::min_element(v.begin(), v.end()) << std::endl;\n    std::cout << std::count_if(v.begin(), v.end(), [](int x) { return x > 4; }) << std::endl;\n    std::cout << std::accumulate(v.begin(), v.end(), 0) << std::endl;\n\n    std::sort(v.begin(), v.end());\n    for (int x : v) std::cout << x << " ";\n    std::cout << std::endl;\n\n    std::reverse(v.begin(), v.end());\n    for (int x : v) std::cout << x << " ";\n    std::cout << std::endl;\n\n    std::cout << std::any_of(v.begin(), v.end(), [](int x) { return x == 8; }) << std::endl;\n    return 0;\n}', out: '9\n1\n3\n25\n1 2 5 8 9\n9 8 5 2 1\n1' },
            { t: 'table', head: ['想做什么', '算法', '返回'], rows: [['找最大/最小元素', '`max_element` / `min_element`', '迭代器（要 `*` 取值）'], ['统计满足条件的个数', '`count_if`', '整数'], ['求和/求积', '`accumulate`（在 `<numeric>` 里）', '累加值'], ['是否全部/任一满足', '`all_of` / `any_of` / `none_of`', 'bool'], ['排序 / 反转', '`sort` / `reverse`', 'void'], ['删除满足条件的元素', '`remove_if` + `erase`', '新末尾迭代器']] },
            { t: 'warn', x: '`std::remove_if` **不删除元素**，它只是把要保留的元素往前挪，返回新的逻辑末尾。必须再调 `erase` 才能真正缩短容器——这就是「erase-remove 惯用法」。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v = {1, 2, 3, 4, 5, 6};\n\n    auto newEnd = std::remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });\n    std::cout << v.size() << " " << (newEnd - v.begin()) << std::endl;\n\n    v.erase(newEnd, v.end());\n    std::cout << v.size() << " ";\n    for (int x : v) std::cout << x << " ";\n    std::cout << std::endl;\n    return 0;\n}', out: '6 3\n3 1 3 5' },
            { t: 'note', x: '`std::accumulate` 的第三个参数是**初始值，同时决定累加的类型**。`accumulate(v.begin(), v.end(), 0)` 用 int 累加，传 `0.0` 才是 double——算平均数时传错会得到整数除法的结果。' }
          ]
        },
        {
          id: 'cpp5l2', title: 'Lambda 表达式', key: '捕获列表 · 按值/按引用', time: 14,
          blocks: [
            { t: 'p', x: 'lambda 就是**就地定义的匿名函数**，语法是 `[捕获](参数) { 函数体 }`。它的价值在于把「一小段逻辑」直接写在用得着的地方，不用为了一个比较规则专门跑出去定义一个函数。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    int base = 10;\n\n    auto add = [base](int x) { return x + base; };     // 按值捕获\n    auto bump = [&base](int x) { base += x; };         // 按引用捕获\n\n    std::cout << add(5) << std::endl;\n    bump(3);\n    std::cout << base << std::endl;\n\n    std::vector<int> v = {3, 1, 2};\n    std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });\n    for (int x : v) std::cout << x << " ";\n    std::cout << std::endl;\n\n    int calls = 0;\n    v.erase(std::remove_if(v.begin(), v.end(),\n            [&calls](int x) { ++calls; return x < 2; }), v.end());\n    std::cout << calls << " " << v.size() << std::endl;\n    return 0;\n}', out: '15\n13\n3 2 1\n3 2' },
            { t: 'table', head: ['写法', '含义'], rows: [['`[]`', '不捕获任何外部变量'], ['`[x]`', '按值捕获 x（**拷贝一份**，之后改外部不影响副本）'], ['`[&x]`', '按引用捕获 x（改的就是外面那个）'], ['`[=]`', '按值捕获所有用到的变量'], ['`[&]`', '按引用捕获所有用到的变量'], ['`[this]`', '捕获当前对象的指针（类成员函数里用）']] },
            { t: 'warn', x: '**按引用捕获的 lambda 不能活得比被捕获的变量久。** 把它存进异步任务或返回出去，变量销毁后引用就悬空——这类 bug 极难查。要长期保存就用按值捕获（或 `[p = std::move(ptr)]` 初始化捕获）。' },
            { t: 'code', x: '#include <iostream>\n#include <functional>\n#include <vector>\n\nint apply(const std::function<int(int)>& f, int x) { return f(x); }\n\nint main() {\n    int factor = 3;\n    auto times = [factor](int x) { return x * factor; };\n\n    std::cout << apply(times, 7) << std::endl;\n\n    std::vector<std::function<int(int)>> pipeline;\n    pipeline.push_back([](int x) { return x + 1; });\n    pipeline.push_back([](int x) { return x * 2; });\n\n    int v = 5;\n    for (const auto& f : pipeline) v = f(v);\n    std::cout << v << std::endl;\n    return 0;\n}', out: '21\n12' },
            { t: 'note', x: '`std::function` 能装下任何可调用对象（函数、lambda、函数对象），代价是一次类型擦除（可能有堆分配、调用比直接调用慢）。追求极致性能时用模板参数接收 lambda，别用 `std::function`。' }
          ]
        },
        {
          id: 'cpp5l3', title: 'sort 与自定义比较', key: '严格弱序 · 多级排序 · stable_sort', time: 13,
          blocks: [
            { t: 'p', x: '`std::sort` 要求比较函数满足**严格弱序**：不能对相等元素返回 true。最常见的错误是写成 `a <= b`，看似无害，实际可能让排序越界访问内存、直接崩。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <string>\n\nstruct Person {\n    std::string name;\n    int age;\n};\n\nint main() {\n    std::vector<Person> ps = {{"小明", 18}, {"小红", 20}, {"小刚", 18}};\n\n    std::sort(ps.begin(), ps.end(), [](const Person& a, const Person& b) {\n        if (a.age != b.age) return a.age < b.age;   // 第一关键字：年龄升序\n        return a.name < b.name;                     // 第二关键字：姓名\n    });\n    for (const auto& p : ps) std::cout << p.name << " " << p.age << std::endl;\n\n    std::vector<Person> ps2 = {{"小明", 18}, {"小红", 20}, {"小刚", 18}};\n    std::stable_sort(ps2.begin(), ps2.end(), [](const Person& a, const Person& b) {\n        return a.age < b.age;\n    });\n    std::cout << ps2[0].name << std::endl;\n    return 0;\n}', out: '小刚 18\n小明 18\n小红 20\n小明' },
            { t: 'p', x: '两个 18 岁的人，`sort` 按姓名排出了「小刚 → 小明」；而 `stable_sort` 只按年龄排，相等的元素**保持原来的相对顺序**，所以 18 岁那组还是「小明 → 小刚」。需要「多级排序但最后一级保持原序」时，`stable_sort` 是标准解法。' },
            { t: 'note', x: '`std::string` 的比较是**按字节**（UTF-8 编码）比的，不是按拼音。所以中文排序的结果看起来「没有规律」——要按拼音或笔画排，得自己做映射或引入 ICU。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v = {3, 1, 4, 1, 5};\n\n    std::sort(v.begin(), v.end());\n    for (int x : v) std::cout << x << " ";\n    std::cout << std::endl;\n\n    std::sort(v.begin(), v.end(), std::greater<int>());\n    for (int x : v) std::cout << x << " ";\n    std::cout << std::endl;\n\n    std::cout << (std::is_sorted(v.begin(), v.end(), std::greater<int>())) << std::endl;\n    return 0;\n}', out: '1 1 3 4 5\n5 4 3 1 1\n1' },
            { t: 'warn', x: '比较函数里**不要做耗时操作**（打印、文件 IO、加锁）：`sort` 会调用它 O(n log n) 次，一个小 printf 就能让排序慢上百倍。' },
            { t: 'tip', x: '要「取前 k 个最大」而不是全排序时，用 `std::partial_sort` 或 `std::nth_element`，复杂度从 O(n log n) 降到 O(n log k) / O(n)。' }
          ]
        },
        {
          id: 'cpp5l4', title: 'transform、函数对象与组合', key: 'transform · 函数对象 · std::function', time: 13,
          blocks: [
            { t: 'p', x: '除了「查」和「排」，算法里还有一类是「变换」：把一个区间映射成另一个区间。`std::transform` 就是 map，`std::copy_if` 就是 filter。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\n#include <functional>\n\nint main() {\n    std::vector<int> v = {1, 2, 3, 4};\n\n    std::cout << std::accumulate(v.begin(), v.end(), 1, std::multiplies<int>()) << std::endl;\n\n    std::vector<int> out(v.size());\n    std::transform(v.begin(), v.end(), out.begin(), [](int x) { return x * x; });\n    for (int x : out) std::cout << x << " ";\n    std::cout << std::endl;\n\n    std::vector<int> even;\n    std::copy_if(v.begin(), v.end(), std::back_inserter(even),\n                 [](int x) { return x % 2 == 0; });\n    std::cout << even.size() << std::endl;\n    return 0;\n}', out: '24\n1 4 9 16\n2' },
            { t: 'p', x: '`std::back_inserter(even)` 是一个「插入迭代器」：往里写就等于 `push_back`，所以目标容器可以先空着，不用预先开好大小。' },
            { t: 'p', x: '**函数对象**就是重载了 `operator()` 的类。它比普通函数强的地方是**能带状态**——构造时传进去的参数就存在成员里，调用时用得上。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nstruct Above {\n    int limit;\n    explicit Above(int l) : limit(l) {}\n    bool operator()(int x) const { return x > limit; }\n};\n\nint main() {\n    std::vector<int> v = {1, 5, 10, 50};\n\n    std::cout << std::count_if(v.begin(), v.end(), Above(9)) << std::endl;\n\n    int sum = 0;\n    std::for_each(v.begin(), v.end(), [&sum](int x) { sum += x; });\n    std::cout << sum << std::endl;\n    return 0;\n}', out: '2\n66' },
            { t: 'note', x: '有了 lambda 之后，手写函数对象的机会少了很多。但**要在头文件里提供一个可配置的「策略」**时，函数对象仍然更好——lambda 的类型无法写在头文件里，函数对象有名字。' },
            { t: 'principle', x: '**能用算法就别手写循环。** `for` 循环里你得自己管下标、边界、累加；算法把「做什么」和「怎么做」分开了，读代码的人一眼就能看出意图，也不容易越界。' }
          ]
        }
      ]
    },
    {
      id: 'cpp6', num: 6, title: '继承与多态', icon: '🌳',
      intro: '继承解决「是一种（is-a）」的复用，虚函数解决「同一个调用，不同行为」。这两者是 C++ 面向对象的支柱，也是最容易被误用的地方——继承层次一旦设计错，后面全是补丁。',
      goals: ['写继承并理解 public 继承的语义', '用 virtual / override 实现运行时多态', '说清虚析构与对象切片的坑', '用纯虚函数定义接口'],
      lessons: [
        {
          id: 'cpp6l1', title: '继承与访问控制', key: 'public 继承 · protected · 构造顺序', time: 13,
          blocks: [
            { t: 'p', x: '`class Dog : public Animal` 读作「Dog 是一种 Animal」。`public` 继承意味着「is-a」：Dog 能用在任何需要 Animal 的地方，Animal 的 public 成员仍是 public，protected 仍是 protected。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n\nclass Animal {\npublic:\n    std::string name;\n    explicit Animal(std::string n) : name(std::move(n)) {\n        std::cout << "Animal 构造：" << name << std::endl;\n    }\n    void eat() const { std::cout << name << " 在吃东西" << std::endl; }\n\nprotected:\n    int energy_ = 100;      // 派生类能用，外部不能用\n};\n\nclass Dog : public Animal {\npublic:\n    explicit Dog(std::string n) : Animal(std::move(n)) {     // 必须调用父类构造\n        std::cout << "Dog 构造" << std::endl;\n    }\n    void bark() const { std::cout << name << " 汪汪，体力 " << energy_ << std::endl; }\n};\n\nint main() {\n    Dog d("旺财");\n    d.eat();\n    d.bark();\n    return 0;\n}', out: 'Animal 构造：旺财\nDog 构造\n旺财 在吃东西\n旺财 汪汪，体力 100' },
            { t: 'p', x: '构造顺序是**先父后子**：`Animal` 先构造完，`Dog` 的部分才开始。析构顺序正好相反，先子后父。`energy_` 是 `protected`，所以 `bark()` 能读，`main` 里读不到。' },
            { t: 'table', head: ['继承方式', '父类 public 成员在子类中变成', '典型用途'], rows: [['`public`', 'public', 'is-a 关系，**99% 的情况都用这个**'], ['`protected`', 'protected', '极少用'], ['`private`', 'private', '实现复用（has-a 的替代），但组合更好'], ['不写（class 默认）', 'private', '容易踩坑，务必显式写']] },
            { t: 'warn', x: '**优先用组合，别为了复用代码而继承。** 「狗有一个尾巴」不该写成 `class Dog : public Tail`。继承表达的是「是一种」，语义不对时，用成员变量（组合）几乎总是更好的选择。' },
            { t: 'note', x: '子类构造器必须初始化父类：要么在初始化列表里显式写 `Animal(n)`，要么调用父类的默认构造器。父类**没有默认构造器**时，不写就编译不过。' }
          ]
        },
        {
          id: 'cpp6l2', title: '虚函数与多态', key: 'virtual · override · 动态绑定', time: 15,
          blocks: [
            { t: 'p', x: '`virtual` 让函数调用在**运行时**才决定执行哪一个：通过基类指针调用时，实际执行的是对象的真实类型那一版。这就是多态，也是所有框架、插件机制的基础。' },
            { t: 'code', x: '#include <iostream>\n#include <memory>\n#include <vector>\n#include <string>\n\nclass Shape {\npublic:\n    virtual double area() const { return 0; }\n    virtual std::string name() const { return "形状"; }\n    virtual ~Shape() = default;\n};\n\nclass Rect : public Shape {\npublic:\n    Rect(double w, double h) : w_(w), h_(h) {}\n    double area() const override { return w_ * h_; }\n    std::string name() const override { return "矩形"; }\nprivate:\n    double w_, h_;\n};\n\nclass Circle : public Shape {\npublic:\n    explicit Circle(double r) : r_(r) {}\n    double area() const override { return 3.14159 * r_ * r_; }\n    std::string name() const override { return "圆"; }\nprivate:\n    double r_;\n};\n\nint main() {\n    std::vector<std::unique_ptr<Shape>> shapes;\n    shapes.push_back(std::make_unique<Rect>(2, 3));\n    shapes.push_back(std::make_unique<Circle>(1));\n\n    for (const auto& s : shapes) {\n        std::cout << s->name() << " " << s->area() << std::endl;\n    }\n    return 0;\n}', out: '矩形 6\n圆 3.14159' },
            { t: 'p', x: '循环里 `s` 的静态类型都是 `Shape*`，但输出各不相同——因为 `area()` 是虚函数，走的是**动态绑定**。如果去掉 `virtual`，两次都会打印 `0`（调用基类版本）。' },
            { t: 'p', x: '`override` 是 C++11 的关键字，作用是**让编译器检查你确实重写了一个虚函数**。参数写错（比如漏了 `const`）时，没写 `override` 会静默变成一个新函数，bug 极难发现；写了就直接编译报错。' },
            { t: 'code', x: '#include <iostream>\n\nclass Base {\npublic:\n    virtual void show(int x) const { std::cout << "Base " << x << std::endl; }\n};\n\nclass Derived : public Base {\npublic:\n    void show(int x) const override { std::cout << "Derived " << x << std::endl; }\n};\n\nint main() {\n    Derived d;\n    Base& b = d;\n    b.show(1);          // 动态绑定 → Derived\n\n    Base bb;\n    bb.show(2);         // 基类对象 → Base\n    return 0;\n}', out: 'Derived 1\nBase 2' },
            { t: 'table', head: ['概念', '何时决定', '靠什么'], rows: [['静态绑定', '编译期', '变量的静态类型'], ['动态绑定', '运行期', '对象的动态类型 + virtual']] },
            { t: 'warn', x: '虚函数有代价：每个对象多一个虚表指针（8 字节），每次调用多一次间接跳转（通常无法内联）。**别给所有函数都加 virtual**，只在确实需要「子类可替换」的地方用。' }
          ]
        },
        {
          id: 'cpp6l3', title: '虚析构与对象切片', key: 'virtual ~ · 切片 · 按引用传参', time: 13,
          blocks: [
            { t: 'p', x: '如果通过基类指针 `delete` 一个派生类对象，而基类的析构函数**不是虚的**，派生类的析构函数就不会被调用——资源泄漏。所以带虚函数的类，析构函数必须是 `virtual`。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n\nclass Base {\npublic:\n    virtual ~Base() { std::cout << "Base 析构" << std::endl; }\n    virtual std::string who() const { return "Base"; }\n};\n\nclass Derived : public Base {\npublic:\n    ~Derived() override { std::cout << "Derived 析构" << std::endl; }\n    std::string who() const override { return "Derived"; }\n    int extra = 42;\n};\n\nvoid byValue(Base b) { std::cout << "按值传参：" << b.who() << std::endl; }\nvoid byRef(const Base& b) { std::cout << "按引用传参：" << b.who() << std::endl; }\n\nint main() {\n    Base* p = new Derived();\n    delete p;                          // 虚析构 → 两个都调用\n\n    Derived d;\n    Base b = d;                        // 对象切片\n    std::cout << b.who() << std::endl;\n\n    byValue(d);\n    byRef(d);\n    return 0;\n}', out: 'Derived 析构\nBase 析构\nBase\n按值传参：Base\nBase 析构\n按引用传参：Derived\nBase 析构\nDerived 析构\nBase 析构' },
            { t: 'p', x: '`Base b = d;` 只复制了**基类那部分**，`extra` 和派生类的行为全丢了，这叫**对象切片**（slicing）。所以多态场景下**永远按指针或引用传参**，不要按值传基类。' },
            { t: 'p', x: '上面 `byValue(d)` 打印 `Base`，`byRef(d)` 打印 `Derived`——同一个 `d`，因为传参方式不同结果完全不同。这就是切片最隐蔽的破坏力：编译不报错，行为悄悄变了。' },
            { t: 'p', x: '仔细看输出里的 `Base 析构` 出现了四次：`delete p` 时一次、`byValue` 的**形参拷贝**销毁时一次、局部变量 `Base b` 析构时一次、`d` 的基类部分最后一次。**按值传基类 = 一次多余构造 + 一次多余析构**，所以多态场景下一律按引用传。' },
            { t: 'table', head: ['场景', '要不要虚析构'], rows: [['类有虚函数', '**必须要**'], ['类会被当基类用（哪怕现在没有虚函数）', '建议要'], ['不打算被继承（可加 `final`）', '不需要'], ['只当值类型用（如 `std::string` 风格）', '不需要']] },
            { t: 'tip', x: '不确定会不会被继承时，给类加 `final`（`class Foo final { ... };`）明确表态，编译器还能顺便做去虚化优化。比留个隐患好。' }
          ]
        },
        {
          id: 'cpp6l4', title: '纯虚函数与接口', key: '抽象类 · = 0 · 面向接口', time: 13,
          blocks: [
            { t: 'p', x: '`virtual void f() = 0;` 是**纯虚函数**：只声明「子类必须实现」，基类不提供实现。含纯虚函数的类是**抽象类**，不能创建对象，只能当接口用。' },
            { t: 'code', x: '#include <iostream>\n#include <memory>\n#include <string>\n#include <vector>\n\nclass Serializable {\npublic:\n    virtual std::string toJson() const = 0;      // 纯虚：契约\n    virtual ~Serializable() = default;\n};\n\nclass User : public Serializable {\npublic:\n    explicit User(std::string n) : name_(std::move(n)) {}\n    std::string toJson() const override { return "{\\"name\\":\\"" + name_ + "\\"}"; }\nprivate:\n    std::string name_;\n};\n\nclass Config : public Serializable {\npublic:\n    std::string toJson() const override { return "{\\"debug\\":true}"; }\n};\n\nint main() {\n    std::vector<std::unique_ptr<Serializable>> items;\n    items.push_back(std::make_unique<User>("小明"));\n    items.push_back(std::make_unique<Config>());\n\n    for (const auto& it : items) std::cout << it->toJson() << std::endl;\n    // Serializable s;      // 编译错误：抽象类不能实例化\n    return 0;\n}', out: '{"name":"小明"}\n{"debug":true}' },
            { t: 'p', x: '这段代码的价值在于：`main` 完全不知道具体有哪些类型，只依赖 `Serializable` 这个**契约**。以后加一个 `Order` 类，`main` 一行都不用改——这就是「面向接口编程」，也是插件系统、依赖注入的基础。' },
            { t: 'p', x: '纯虚函数**也可以有实现**（在类外定义 `void Base::f() { ... }`），子类仍然必须重写，但可以显式调用 `Base::f()` 复用。这种「默认实现 + 强制覆盖」的写法在框架里很常见。' },
            { t: 'table', head: ['写法', '含义'], rows: [['`virtual void f();`', '虚函数，有默认实现，子类可重写'], ['`virtual void f() = 0;`', '纯虚函数，子类必须重写'], ['`void f() = delete;`', '禁用这个函数'], ['`void f() = default;`', '让编译器生成默认版本']] },
            { t: 'note', x: 'C++ 没有 Java 那样的 `interface` 关键字，**「只有纯虚函数 + 虚析构」的类就是接口**。命名上常用 `I` 前缀或 `-able`/`-er` 后缀（`Serializable`、`Comparable`）。' },
            { t: 'warn', x: '抽象类的析构函数**不能**是纯虚且无定义：`virtual ~Base() = 0;` 必须再写一个类外定义 `Base::~Base() {}`，否则子类析构时链接不到它。图省事就写 `= default`。' }
          ]
        },
        {
          id: 'cpp6l5', title: '多重继承与虚继承', key: '菱形继承 · virtual 继承 · 何时该避免', time: 13,
          blocks: [
            { t: 'p', x: 'C++ 允许一个类继承多个基类。好处是能同时具备多种能力（比如「会飞」+「会游」），坏处是容易撞上**菱形继承**：两条路径继承同一个基类，对象里会有两份基类数据。' },
            { t: 'code', x: '#include <iostream>\n\nclass Flyer {\npublic:\n    void fly() const { std::cout << "飞" << std::endl; }\n};\n\nclass Swimmer {\npublic:\n    void swim() const { std::cout << "游" << std::endl; }\n};\n\nclass Duck : public Flyer, public Swimmer {};   // 同时具备两种能力\n\nint main() {\n    Duck d;\n    d.fly();\n    d.swim();\n    return 0;\n}', out: '飞\n游' },
            { t: 'p', x: '这种「多个互不相关的接口」组合是多重继承的合理用法。危险的是**多个基类又共享同一个祖先**：' },
            { t: 'code', run: false, label: '菱形继承的问题', x: 'class Base { public: int id = 1; };\nclass A : public Base {};\nclass B : public Base {};\nclass D : public A, public B {};\n\nD d;\nd.id = 7;      // 编译错误：ambiguous，A::id 还是 B::id？\n// d 里有两份 Base，一份来自 A，一份来自 B' },
            { t: 'p', x: '解决办法是**虚继承**：让 A、B 都 `virtual public Base`，这样 D 里只保留一份 Base，`id` 也不再歧义。' },
            { t: 'code', x: '#include <iostream>\n\nclass Base { public: int id = 1; };\nclass A : virtual public Base {};\nclass B : virtual public Base {};\nclass D : public A, public B {};\n\nint main() {\n    D d;\n    d.id = 7;                        // 只有一份 Base，不歧义\n    std::cout << d.id << std::endl;\n\n    A* pa = &d;\n    B* pb = &d;\n    std::cout << (static_cast<Base*>(pa) == static_cast<Base*>(pb)) << std::endl;\n    return 0;\n}', out: '7\n1' },
            { t: 'p', x: '最后一行打印 1，说明从 A 和 B 两条路径找到的 `Base` 子对象是**同一个**。虚继承的代价是对象布局变复杂、访问基类成员要多一次间接寻址，所以只在确实需要菱形结构时用。' },
            { t: 'table', head: ['多重继承的用法', '评价'], rows: [['继承多个「纯接口」（只有纯虚函数）', '**推荐**，等价于 Java 的 implements'], ['继承一个有状态的实现类 + 一个接口', '可以，但要小心命名冲突'], ['继承多个有状态的实现类', '**尽量避免**，用组合代替']] },
            { t: 'principle', x: '**接口可以多继承，状态不要多继承。** 一旦发现自己需要「多份实现」的继承，先问：能不能改成「持有两个成员对象」？组合几乎总能解决问题，而且耦合更低。' }
          ]
        }
      ]
    },
    {
      id: 'cpp7', num: 7, title: '模板与泛型', icon: '🧬',
      intro: '模板让「同一份代码适用于不同类型」成为可能，而且是**编译期**就确定下来的——没有运行时代价。STL 的所有容器和算法都是模板写出来的，看懂模板，你才算真正会用 STL。',
      goals: ['写函数模板并理解类型推导', '写类模板并实例化', '知道特化与可变参数模板解决什么问题', '理解 constexpr 的编译期计算'],
      lessons: [
        {
          id: 'cpp7l1', title: '函数模板与类型推导', key: 'template · 类型推导 · 头文件', time: 13,
          blocks: [
            { t: 'p', x: '函数模板就是「类型的参数化」：`template <typename T>` 声明一个类型参数，编译器在你调用时根据实参**自动推导** T 是什么，然后生成一份对应的函数。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n#include <vector>\n\ntemplate <typename T>\nT maxOf(T a, T b) { return a > b ? a : b; }\n\ntemplate <typename T>\nvoid printAll(const std::vector<T>& v) {\n    for (const auto& x : v) std::cout << x << " ";\n    std::cout << std::endl;\n}\n\nint main() {\n    std::cout << maxOf(3, 7) << std::endl;\n    std::cout << maxOf(2.5, 1.5) << std::endl;\n    std::cout << maxOf(std::string("abc"), std::string("abd")) << std::endl;\n\n    printAll(std::vector<int>{1, 2, 3});\n    printAll(std::vector<std::string>{"a", "b"});\n    return 0;\n}', out: '7\n2.5\nabd\n1 2 3 \na b ' },
            { t: 'p', x: '注意 `maxOf(3, 7)` 传入两个 `int` 推出 `T = int`；传入两个 `std::string` 推出 `T = std::string`。但如果写 `maxOf(3, 2.5)`，编译器推导出 `T` 既是 int 又是 double，**矛盾，直接报错**。这时要显式指定：`maxOf<double>(3, 2.5)`。' },
            { t: 'warn', x: '**模板的定义必须放在头文件里（或同一个 .cpp 里）。** 因为编译器需要看到完整定义才能生成具体类型的代码；如果只把声明放头文件、定义放 .cpp，别的文件一用就会报 `undefined reference`。这是模板与普通函数最大的工程差异。' },
            { t: 'p', x: '模板是**编译期展开**的：`maxOf(3, 7)` 和 `maxOf(1.0, 2.0)` 会生成两份独立的机器码。好处是零运行时开销（能内联、能优化），代价是编译变慢、二进制变大——这叫「代码膨胀」。' },
            { t: 'note', x: '`typename` 和 `class` 在声明类型参数时完全等价（`template <class T>` 也一样）。习惯上用 `typename`，因为它更准确地表达「这里可以是 int、指针、甚至函数类型」。' }
          ]
        },
        {
          id: 'cpp7l2', title: '类模板', key: '类模板 · 实例化 · 成员函数', time: 14,
          blocks: [
            { t: 'p', x: '把 `template` 加在类上，就得到一个「能装任意类型的容器」。`std::vector<int>`、`std::vector<std::string>` 就是这么来的——它们是同一个类模板的不同**实例**。' },
            { t: 'code', x: '#include <iostream>\n#include <vector>\n#include <string>\n#include <stdexcept>\n\ntemplate <typename T>\nclass Stack {\npublic:\n    void push(T v) { data_.push_back(std::move(v)); }\n\n    T pop() {\n        if (data_.empty()) throw std::out_of_range("栈为空");\n        T v = data_.back();\n        data_.pop_back();\n        return v;\n    }\n\n    size_t size() const { return data_.size(); }\n    bool empty() const { return data_.empty(); }\n\nprivate:\n    std::vector<T> data_;\n};\n\nint main() {\n    Stack<int> s;\n    s.push(1);\n    s.push(2);\n    std::cout << s.size() << " " << s.pop() << std::endl;\n    std::cout << s.size() << std::endl;\n\n    Stack<std::string> t;\n    t.push("hi");\n    std::cout << t.pop() << std::endl;\n\n    try {\n        s.pop();\n        s.pop();\n    } catch (const std::out_of_range& e) {\n        std::cout << e.what() << std::endl;\n    }\n    return 0;\n}', out: '2 2\n1\nhi\n栈为空' },
            { t: 'p', x: '一个类模板只有被**用到**的方法才会生成代码。`Stack<int>` 没调用过 `empty()`，就不会为它生成 `empty()` 的实现——这叫「惰性实例化」，也意味着模板里某些成员函数只有在你真调用时才会暴露编译错误。' },
            { t: 'p', x: '类模板的成员函数如果写在类外，要带上完整的模板前缀：' },
            { t: 'code', x: '#include <iostream>\n\ntemplate <typename T>\nclass Box {\npublic:\n    explicit Box(T v) : v_(v) {}\n    T get() const;\nprivate:\n    T v_;\n};\n\ntemplate <typename T>          // 每个类外成员都要重复这一行\nT Box<T>::get() const { return v_; }\n\nint main() {\n    Box<int> a(7);\n    Box<std::string> b("hi");\n    std::cout << a.get() << " " << b.get() << std::endl;\n    return 0;\n}', out: '7 hi' },
            { t: 'note', x: 'C++17 支持**类模板实参推导**（CTAD）：`std::pair p{1, 2.0};` 不用写 `<int, double>`。但只对构造函数能推出全部参数的场景有效，容器还是习惯显式写类型。' },
            { t: 'warn', x: '模板报错信息通常极长（几十行嵌套）。**从最上面第一条 "required from" 往下读**，真正的错误往往在第一行，后面全是「谁调用了谁」的传播链。' }
          ]
        },
        {
          id: 'cpp7l3', title: '模板特化与可变参数', key: '特化 · 可变参数 · 折叠表达式', time: 14,
          blocks: [
            { t: 'p', x: '有时候「通用逻辑」对某个类型不适用，需要给它开小灶——这就是**特化**。最典型的是「转成字符串」：数字用 `to_string`，字符串本身不该再套一层。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n\ntemplate <typename T>\nstd::string describe(const T& v) { return "值：" + std::to_string(v); }\n\ntemplate <>\nstd::string describe<std::string>(const std::string& v) { return "字符串：" + v; }\n\nint main() {\n    std::cout << describe(42) << std::endl;\n    std::cout << describe(3.5) << std::endl;\n    std::cout << describe(std::string("hi")) << std::endl;\n    return 0;\n}', out: '值：42\n值：3.500000\n字符串：hi' },
            { t: 'p', x: '`template <>` 表示「全特化」：为某一个具体类型提供单独实现。还有「偏特化」（只固定部分模板参数，如 `MyClass<T*>`），只对类模板可用。' },
            { t: 'p', x: '**可变参数模板**让函数接受任意个、任意类型的参数：`template <typename... Args> void f(Args... args)`。C++17 的**折叠表达式** `(expr op ...)` 能把它们一次性展开。' },
            { t: 'code', x: '#include <iostream>\n#include <string>\n\ntemplate <typename... Args>\nvoid printAll(Args... args) {\n    ((std::cout << args << " "), ...);      // 折叠：对每个参数都执行一次\n    std::cout << std::endl;\n}\n\ntemplate <typename... Args>\nauto sum(Args... args) { return (args + ... + 0); }\n\nint main() {\n    printAll(1, "two", 3.5);\n    printAll("单个");\n    std::cout << sum(1, 2, 3, 4) << std::endl;\n    std::cout << sum() << std::endl;\n    return 0;\n}', out: '1 two 3.5 \n单个 \n10\n0' },
            { t: 'p', x: '`(args + ... + 0)` 里的 `+ 0` 是给「零个参数」准备的初值——没有它，`sum()` 展开成空表达式会编译失败。折叠加初值是可变参数模板的常见写法。' },
            { t: 'warn', x: '可变参数模板会把每个参数的类型都编码进函数签名，所以 `printAll(1,2)` 和 `printAll(1,2,3)` 是**两个不同的函数**，各自生成一份代码。参数组合多时会让编译时间明显变长。' }
          ]
        },
        {
          id: 'cpp7l4', title: 'constexpr 与编译期计算', key: 'constexpr · 编译期 · static_assert', time: 13,
          blocks: [
            { t: 'p', x: '`constexpr` 的意思是「这个函数/变量**有可能**在编译期求值」。编译器看到用在需要常量的地方（数组大小、模板参数、`static_assert`）就当场算出来，否则退化成普通运行时计算。' },
            { t: 'code', x: '#include <iostream>\n\nconstexpr int factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }\n\nint main() {\n    constexpr int f5 = factorial(5);       // 编译期就算完了\n    std::cout << f5 << std::endl;\n\n    int arr[factorial(3)] = {};            // 编译期常量可以当数组大小\n    std::cout << sizeof(arr) / sizeof(arr[0]) << std::endl;\n\n    int n = 4;\n    std::cout << factorial(n) << std::endl; // 运行时算\n    return 0;\n}', out: '120\n6\n24' },
            { t: 'p', x: '`factorial` 在三种场景下的表现：赋给 `constexpr` 变量时编译期算；当数组大小时编译期算；传运行时变量 `n` 时就是普通函数调用。**同一份代码，两种时机**，不用写两份。' },
            { t: 'p', x: '`static_assert` 是编译期断言：条件不满足就**编译失败**，并打印你写的提示。它常配合 `constexpr` 做「类型/平台检查」，比运行时 `assert` 更早拦住问题。' },
            { t: 'code', x: '#include <iostream>\n\ntemplate <typename T>\nconstexpr T square(T x) { return x * x; }\n\nint main() {\n    static_assert(sizeof(int) >= 4, "int 至少 4 字节");\n    static_assert(square(3) == 9, "编译期就能检查逻辑");\n\n    std::cout << square(1.5) << std::endl;\n    std::cout << sizeof(int) << " " << sizeof(void*) << std::endl;\n    return 0;\n}', out: '2.25\n4 8' },
            { t: 'note', x: 'C++20 的 `consteval` 更严格：**必须**在编译期求值；`constinit` 保证变量在编译期初始化（避免静态初始化顺序问题）。看到这三个关键字别混：`constexpr` 是「可以」，`consteval` 是「必须」。' },
            { t: 'principle', x: '**能把计算挪到编译期，就别留给运行期。** 编译期算出来的常量没有运行时开销，还能被优化器进一步利用。这就是 C++ 模板元编程的基本动机。' }
          ]
        }
      ]
    },
    {
      id: 'cpp8', num: 8, title: '工程实践', icon: '🛠️',
      intro: '最后这一章讲「写真实项目」需要的四件事：怎么报错（异常）、怎么读写文件（流）、怎么组织多文件（头文件与编译单元）、以及怎么调试和优化。这些不是语法，但决定了你的代码能不能被别人接手。',
      goals: ['用异常表达「无法继续」的错误', '用流读写文件与字符串', '写规范的头文件并理解 ODR', '有一套自己的调试与性能排查方法'],
      lessons: [
        {
          id: 'cpp8l1', title: '异常与错误处理', key: 'throw · catch · 异常安全', time: 14,
          blocks: [
            { t: 'p', x: '异常用来表达「这个函数没法完成它承诺的事」。`throw` 抛出，`catch` 接住，中间的栈帧会被**完整展开**（局部对象正常析构）。相比返回错误码，它不会被调用者无意忽略。' },
            { t: 'code', x: '#include <iostream>\n#include <stdexcept>\n#include <string>\n\ndouble divide(double a, double b) {\n    if (b == 0) throw std::invalid_argument("除数不能为 0");\n    return a / b;\n}\n\nclass AppError : public std::runtime_error {\npublic:\n    explicit AppError(const std::string& msg) : std::runtime_error(msg) {}\n};\n\nint main() {\n    std::cout << divide(10, 4) << std::endl;\n\n    try {\n        divide(1, 0);\n    } catch (const std::invalid_argument& e) {\n        std::cout << "参数错误：" << e.what() << std::endl;\n    }\n\n    try {\n        throw AppError("配置缺失");\n    } catch (const std::exception& e) {\n        std::cout << "捕获：" << e.what() << std::endl;\n    }\n    return 0;\n}', out: '2.5\n参数错误：除数不能为 0\n捕获：配置缺失' },
            { t: 'p', x: '注意 `AppError` 被 `catch (const std::exception&)` 接住了——因为所有标准异常都继承自 `std::exception`。**捕获基类引用**是最常见的写法，一条 catch 兜住整族错误。' },
            { t: 'table', head: ['标准异常', '含义'], rows: [['`std::invalid_argument`', '参数不合法'], ['`std::out_of_range`', '下标/范围越界'], ['`std::runtime_error`', '运行时才能发现的错误'], ['`std::logic_error`', '程序逻辑错误（本该避免）'], ['`std::bad_alloc`', '内存分配失败']] },
            { t: 'warn', x: '**按值捕获会切片**（`catch (std::exception e)`），派生类的信息全丢。一律写 `catch (const std::exception& e)`：引用 + const，既不多拷贝也不切片。' },
            { t: 'note', x: '异常不适合「预期内的正常分支」。用户输错一个数字不是异常，返回 `optional` 或错误码更合适。异常该留给「真的没法继续」的情况，因为它有性能成本，也让控制流变得不直观。' },
            { t: 'tip', x: '如果确定某个函数不会抛异常（比如简单的 getter），标 `noexcept`。编译器能少生成异常处理代码，`std::vector` 扩容时也更愿意用移动。' }
          ]
        },
        {
          id: 'cpp8l2', title: '流与文件 IO', key: 'fstream · stringstream · getline', time: 13,
          blocks: [
            { t: 'p', x: 'C++ 的 IO 全是「流」：`cout`/`cin` 是控制台，`ifstream`/`ofstream` 是文件，`istringstream`/`ostringstream` 是内存里的字符串。**接口完全一致**，所以学会一套就能通用。' },
            { t: 'code', x: '#include <iostream>\n#include <sstream>\n#include <string>\n\nint main() {\n    std::ostringstream out;\n    out << "name=小明\\n" << "age=18\\n";\n\n    std::istringstream in(out.str());\n    std::string line;\n    int count = 0;\n    while (std::getline(in, line)) {\n        auto pos = line.find(\'=\');\n        std::cout << line.substr(0, pos) << " -> " << line.substr(pos + 1) << std::endl;\n        ++count;\n    }\n    std::cout << count << std::endl;\n    return 0;\n}', out: 'name -> 小明\nage -> 18\n2' },
            { t: 'p', x: '`std::getline(in, line)` 按行读，返回流本身，所以能直接放在 `while` 条件里——读到结尾流就变成 false，循环自然结束。这是读文本文件的标准写法。' },
            { t: 'code', x: '#include <fstream>\n#include <iostream>\n#include <string>\n\nint main() {\n    const std::string path = "demo.txt";\n\n    {\n        std::ofstream f(path);                 // 写（会清空原内容）\n        f << "line1\\n" << "line2\\n";\n    }                                          // 离开作用域自动关闭\n\n    std::ifstream in(path);\n    if (!in) {                                 // 一定要检查是否打开成功\n        std::cout << "打开失败" << std::endl;\n        return 1;\n    }\n\n    std::string line;\n    int n = 0;\n    while (std::getline(in, line)) ++n;\n    std::cout << "读了 " << n << " 行" << std::endl;\n    return 0;\n}', out: '读了 2 行' },
            { t: 'table', head: ['模式', '含义'], rows: [['`std::ofstream f("a.txt")`', '写，默认截断'], ['`std::ofstream f("a.txt", std::ios::app)`', '追加'], ['`std::ifstream f("a.txt")`', '读'], ['`std::fstream f("a.txt", std::ios::in | std::ios::out)`', '读写']] },
            { t: 'warn', x: '**打开文件后必须检查 `if (!f)`。** 路径写错、权限不足都不会抛异常，流只是变成「失败状态」，之后所有读写都静默无效——这是新手最常见的「为什么什么都没写进去」。' },
            { t: 'note', x: '上面这段代码会在运行目录生成 `demo.txt`，所以别在本地反复点运行留下垃圾文件。`ofstream` / `ifstream` 的析构函数会自动关闭文件，这正是 RAII 的典型应用。' }
          ]
        },
        {
          id: 'cpp8l3', title: '头文件、编译单元与 ODR', key: '头文件保护 · inline · ODR', time: 14,
          blocks: [
            { t: 'p', x: '一个 `.cpp` 加上它 `#include` 的所有头文件，构成一个**编译单元**，独立编译成一个 `.o`。最后链接器把所有 `.o` 拼起来。理解这条链路，才能看懂那些「重复定义」的报错。' },
            { t: 'code', run: false, label: '典型的三文件结构', x: '// math_utils.h —— 只放声明 + inline 函数\n#pragma once\nint add(int a, int b);\n\n// math_utils.cpp —— 放实现\n#include "math_utils.h"\nint add(int a, int b) { return a + b; }\n\n// main.cpp\n#include "math_utils.h"\nint main() { return add(1, 2); }\n\n// 编译：g++ main.cpp math_utils.cpp -o app' },
            { t: 'p', x: '**ODR（单一定义规则）** 说：同一个函数/变量在整个程序里只能有**一份定义**。头文件会被多个 `.cpp` 分别包含，所以头文件里**只能放声明**；如果非要放函数定义，必须加 `inline`（允许多份相同定义，链接器合并成一份）。' },
            { t: 'code', x: '#include <iostream>\n\n// 头文件里定义函数要加 inline，否则每个包含它的 .cpp 都会有一份 → 重复定义\ninline int square(int x) { return x * x; }\n\n// 匿名命名空间：只在本编译单元可见（内部链接）\nnamespace {\n    int counter = 0;\n}\n\nint main() {\n    std::cout << square(5) << std::endl;\n    ++counter;\n    std::cout << counter << std::endl;\n    return 0;\n}', out: '25\n1' },
            { t: 'table', head: ['放哪里', '什么东西'], rows: [['头文件（`.h`）', '类定义、函数声明、模板、`inline` 函数、`constexpr`、类型别名'], ['源文件（`.cpp`）', '普通函数实现、全局变量定义、内部辅助函数'], ['头文件里禁止', '普通函数定义、非 inline 全局变量、`using namespace`']] },
            { t: 'warn', x: '`#pragma once` 和传统的 `#ifndef XXX_H` 守卫作用相同：防止同一个头文件被**重复包含**。前者几乎所有编译器都支持且更简洁，新项目直接用它。' },
            { t: 'note', x: '模板的定义必须放头文件——原因不是 ODR，而是编译器在别的 `.cpp` 里实例化模板时**必须看到完整定义**。这也是为什么 STL 全是头文件。' }
          ]
        },
        {
          id: 'cpp8l4', title: '调试、性能与学习路线', key: 'gdb · sanitizer · 性能 · 路线', time: 13,
          blocks: [
            { t: 'p', x: '写 C++ 的效率，很大程度取决于**排查问题的速度**。这一节把最实用的几件工具串一遍，都是命令行里立刻能用的。' },
            { t: 'code', run: false, label: '常用调试命令', x: '# 编译时带上调试信息\n> g++ -g -O0 -Wall main.cpp -o app\n\n# gdb 基本操作\n> gdb ./app\n(gdb) break main        # 在 main 下断点\n(gdb) run               # 运行\n(gdb) next              # 下一行（不进入函数）\n(gdb) step              # 下一行（进入函数）\n(gdb) print x           # 打印变量\n(gdb) backtrace         # 看调用栈\n\n# 内存问题神器\n> g++ -fsanitize=address,undefined -g main.cpp -o app\n> ./app                 # 越界、泄漏、UB 会直接报错并给出行号' },
            { t: 'p', x: '**`-fsanitize=address` 值得成为默认习惯。** 它能抓住数组越界、use-after-free、内存泄漏、栈溢出，报错信息带完整调用栈。这些 bug 在没有 sanitizer 时往往表现为「偶尔崩一下」，能查一整天。' },
            { t: 'code', x: '#include <iostream>\n#include <cassert>\n\nint main() {\n    int a = 3, b = 4;\n    assert(a + b == 7);                        // 调试期断言，NDEBUG 下消失\n    static_assert(sizeof(int) >= 4, "int 至少 4 字节");   // 编译期断言\n\n    std::cout << "断言全部通过" << std::endl;\n    std::cout << sizeof(int) << " " << sizeof(void*) << std::endl;\n    return 0;\n}', out: '断言全部通过\n4 8' },
            { t: 'p', x: '`assert` 只在**调试版**生效（定义 `NDEBUG` 就全部消失），适合写「这里绝不该发生」的假设；`static_assert` 在编译期检查，适合写类型和平台约束。两者互补，都不是用来做输入校验的。' },
            { t: 'table', head: ['问题', '首选工具'], rows: [['程序崩溃 / 结果不对', '`gdb` + `-g -O0`'], ['越界、泄漏、悬垂指针', '`-fsanitize=address`'], ['未定义行为（溢出、类型双关）', '`-fsanitize=undefined`'], ['性能瓶颈', '`perf record` / `valgrind --tool=callgrind`'], ['模板报错看不懂', '从第一条 `required from` 开始读，或换 clang 看更短的报错']] },
            { t: 'principle', x: '**学 C++ 的顺序建议：** 先把 C 的指针和内存搞懂（你已经在做了），再学类与 RAII，然后 STL 容器与算法，最后才是模板、移动语义、并发。跳过 RAII 直接学模板，几乎必然卡住。' },
            { t: 'note', x: '不要一上来啃《C++ Primer》全本。**边写边查**效率高得多：写一个能跑的小项目（命令行工具、小游戏、简单的 HTTP 服务器），遇到问题再回去补那一章。语言是工具，不是目的。' }
          ]
        }
      ]
    }
  ],
  quiz: [
    { id: 'cppq1', ch: 'cpp1', lesson: 'cpp1l1', point: '链接错误', type: 'choice', diff: 2,
      prompt: '编译时报 `undefined reference to add(int, int)`，最可能的原因是？',
      opts: ['语法写错了', '函数只有声明没有定义，或定义所在的 .cpp 没参与编译', '头文件路径不对', '数组越界'],
      ans: 1,
      explain: '这是**链接期**错误：编译器看到了声明于是放行，链接器却找不到实现。常见原因有：只声明没定义、忘了把实现文件加进编译命令、函数签名（参数/const）和声明不一致导致是两个不同的函数。' },

    { id: 'cppq2', ch: 'cpp1', lesson: 'cpp1l2', point: '格式化操纵符', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <iomanip>\n\nint main() {\n    double x = 3.14159;\n    std::cout << std::fixed << std::setprecision(2) << x << std::endl;\n    std::cout << std::setw(5) << 42 << "|" << std::endl;\n    std::cout << 42 << "|" << std::endl;\n    return 0;\n}',
      answer: '3.14\n   42|\n42|',
      explain: '`fixed` + `setprecision(2)` 保留两位小数，而且**会一直生效**；`setw(5)` 只对下一次输出有效，所以第二行有 3 个空格补齐宽度 5，第三行就恢复原样了。' },

    { id: 'cppq3', ch: 'cpp1', lesson: 'cpp1l3', point: '引用是别名', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nint main() {\n    int a = 1;\n    int& r = a;\n    r++;\n    int b = r;\n    b++;\n    std::cout << a << " " << b << std::endl;\n    return 0;\n}',
      answer: '2 3',
      explain: '`r` 是 `a` 的别名，`r++` 就是把 `a` 加到 2。`int b = r;` 是**拷贝**，b 是独立变量，再 `b++` 不影响 a，所以是 `2 3`。' },

    { id: 'cppq4', ch: 'cpp1', lesson: 'cpp1l4', point: 'auto 推导', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nint main() {\n    auto x = 10;\n    auto y = x / 4.0;\n    std::cout << sizeof(x) << " " << y << std::endl;\n    return 0;\n}',
      answer: '4 2.5',
      explain: '`auto x = 10` 推出 `int`（4 字节）；`x / 4.0` 里 int 会提升成 double 再除，结果是 2.5。如果写成 `x / 4`（两个整数），得到的是 **2**。' },

    { id: 'cppq5', ch: 'cpp1', lesson: 'cpp1l2', point: 'endl 的代价', type: 'choice', diff: 2,
      prompt: '循环里输出十万行，为什么建议用 `"\\n"` 而不是 `std::endl`？',
      opts: ['`endl` 不能输出中文', '`endl` 每次都会强制刷新缓冲区，频繁 IO 很慢', '`endl` 会多输出一个空格', '两者没有区别'],
      ans: 1,
      explain: '`endl` = 换行 + `flush()`。每次 flush 都可能触发一次系统调用，十万次就是十万次。`"\\n"` 只换行，缓冲区满了才真正写出去，快几个数量级。' },

    { id: 'cppq6', ch: 'cpp2', lesson: 'cpp2l1', point: 'class 与 struct', type: 'choice', diff: 1,
      prompt: '`class Foo { int x; };` 里 `x` 的访问权限是？',
      opts: ['public', 'private', 'protected', '默认不可访问'],
      ans: 1,
      explain: '`class` 的默认访问权限是 `private`，`struct` 默认是 `public`。这是两者唯一的语言层面差异（习惯上 struct 用于纯数据聚合）。' },

    { id: 'cppq7', ch: 'cpp2', lesson: 'cpp2l2', point: '构造与析构顺序', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nclass A {\npublic:\n    A() { std::cout << "A()"; }\n    ~A() { std::cout << "~A()"; }\n};\n\nint main() {\n    { A a; }\n    std::cout << "|" << std::endl;\n    return 0;\n}',
      answer: 'A()~A()|',
      explain: '对象在 `{ }` 内构造，离开这个块立刻析构，所以 `~A()` 在 `|` 之前输出。这个「作用域决定生命周期」的规则是 RAII 的基础。' },

    { id: 'cppq8', ch: 'cpp2', lesson: 'cpp2l3', point: '三法则', type: 'choice', diff: 3,
      prompt: '一个类管理着 `new` 出来的裸指针，为什么必须自己写拷贝构造？',
      opts: ['为了提升性能', '默认的拷贝构造只复制指针值，两个对象会 delete 同一块内存', '不写的话无法通过编译', '为了支持移动语义'],
      ans: 1,
      explain: '默认拷贝是逐成员浅拷贝，两个对象的指针指向同一块内存，析构时各 `delete` 一次 → double free 崩溃。必须自己写拷贝构造做深拷贝（或者干脆用 `unique_ptr` / `vector` 避免裸指针）。' },

    { id: 'cppq9', ch: 'cpp2', lesson: 'cpp2l4', point: '成员运算符', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nstruct N {\n    int v;\n    N(int x) : v(x) {}\n    N operator+(const N& o) const { return N(v + o.v); }\n};\n\nint main() {\n    N a(2), b(5);\n    N c = a + b;\n    std::cout << c.v << std::endl;\n    return 0;\n}',
      answer: '7',
      explain: '`a + b` 调用 `a.operator+(b)`，返回一个新建的 N，值是 2+5=7。注意 `operator+` 不修改 a 和 b，所以加了 `const`。' },

    { id: 'cppq10', ch: 'cpp2', lesson: 'cpp2l5', point: 'static 成员', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nstruct S {\n    static int n;\n    S() { ++n; }\n};\n\nint S::n = 0;\n\nint main() {\n    S a, b, c;\n    std::cout << S::n << " " << a.n << std::endl;\n    return 0;\n}',
      answer: '3 3',
      explain: '`static` 成员属于类，所有实例共用一份。构造三个对象就加了 3 次，所以 `S::n` 和 `a.n`（通过对象访问同一份数据）都是 3。' },

    { id: 'cppq11', ch: 'cpp3', lesson: 'cpp3l1', point: 'new[] 与 delete[]', type: 'choice', diff: 2,
      prompt: '`int* p = new int[10];` 之后应该怎么释放？',
      opts: ['`delete p;`', '`delete[] p;`', '`free(p);`', '不用释放'],
      ans: 1,
      explain: '`new[]` 必须配 `delete[]`。对基本类型两者可能看不出区别，但对有析构函数的类型，`delete p` 只析构第一个元素，其余全部泄漏——是明确的未定义行为。' },

    { id: 'cppq12', ch: 'cpp3', lesson: 'cpp3l2', point: 'RAII 与作用域', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nstruct G {\n    const char* n;\n    G(const char* s) : n(s) { std::cout << "开" << n; }\n    ~G() { std::cout << "关" << n; }\n};\n\nint main() {\n    G a("A");\n    { G b("B"); }\n    std::cout << std::endl;\n    return 0;\n}',
      answer: '开A开B关B\n关A',
      explain: '外层 a 先构造，内层块里的 b 构造后立刻析构（关B），随后换行；a 的析构发生在 `main` 返回时，所以在下一行输出「关A」。**注意析构顺序和构造相反**：a 先构造，最后析构。' },

    { id: 'cppq13', ch: 'cpp3', lesson: 'cpp3l3', point: '所有权转移', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <memory>\n\nint main() {\n    auto p = std::make_unique<int>(5);\n    auto q = std::move(p);\n    std::cout << (p == nullptr) << " " << *q << std::endl;\n    return 0;\n}',
      answer: '1 5',
      explain: '`std::move(p)` 把所有权转给 q，p 变成空指针（`p == nullptr` 为真，打印 1）。这也是 unique_ptr 禁止拷贝的原因——同一时刻只能有一个所有者。' },

    { id: 'cppq14', ch: 'cpp3', lesson: 'cpp3l4', point: '引用计数', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <memory>\n\nint main() {\n    auto a = std::make_shared<int>(1);\n    std::cout << a.use_count() << " ";\n    {\n        auto b = a;\n        std::cout << a.use_count() << " ";\n    }\n    std::cout << a.use_count() << std::endl;\n    return 0;\n}',
      answer: '1 2 1',
      explain: '开始时只有 a 持有，计数 1；拷贝出 b 后变 2；b 离开作用域析构，计数回到 1。计数归零时对象才真正释放。' },

    { id: 'cppq15', ch: 'cpp3', lesson: 'cpp3l5', point: 'std::move 的本质', type: 'choice', diff: 3,
      prompt: '`std::move(x)` 到底做了什么？',
      opts: ['把 x 的内存搬到新地址', '把 x 强制转换成右值引用，让编译器选移动构造', '清空 x 的内容', '删除 x'],
      ans: 1,
      explain: '`std::move` 是个**类型转换**（等价于 `static_cast<T&&>(x)`），不搬运任何字节。真正的转移发生在移动构造/移动赋值里——它拿到右值引用后，就可以放心地把内部指针「偷」过来。' },

    { id: 'cppq16', ch: 'cpp4', lesson: 'cpp4l1', point: 'vector 增删', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> v{1, 2, 3};\n    v.push_back(4);\n    v.erase(v.begin());\n    std::cout << v.size() << " " << v.front() << " " << v.back() << std::endl;\n    return 0;\n}',
      answer: '3 2 4',
      explain: '先变成 `{1,2,3,4}`，删掉第一个后是 `{2,3,4}`：长度 3、首元素 2、尾元素 4。`erase` 中间/头部是 O(n)，因为要搬移后面的元素。' },

    { id: 'cppq17', ch: 'cpp4', lesson: 'cpp4l2', point: 'find 与 npos', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <string>\n\nint main() {\n    std::string s = "abcabc";\n    std::cout << s.find("bc") << " " << (s.find("z") == std::string::npos) << std::endl;\n    return 0;\n}',
      answer: '1 1',
      explain: '`"bc"` 第一次出现在下标 1；`"z"` 找不到，`find` 返回 `npos`，比较结果为真（打印 1）。判断「有没有找到」必须跟 `npos` 比，不能直接 `if (s.find(x))`。' },

    { id: 'cppq18', ch: 'cpp4', lesson: 'cpp4l3', point: 'map 的有序性', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <map>\n#include <string>\n\nint main() {\n    std::map<std::string, int> m;\n    m["b"] = 2;\n    m["a"] = 1;\n    for (const auto& kv : m) std::cout << kv.first;\n    std::cout << " " << m.size() << std::endl;\n    return 0;\n}',
      answer: 'ab 2',
      explain: '`std::map` 按**键排序**存储（红黑树），插入顺序是 b、a，遍历出来却是 a、b。如果要保持插入顺序，得用 `vector<pair>` 或额外记录顺序。' },

    { id: 'cppq19', ch: 'cpp4', lesson: 'cpp4l4', point: '迭代器运算', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v{4, 1, 3};\n    auto it = std::find(v.begin(), v.end(), 3);\n    std::cout << (it - v.begin()) << " " << *it << std::endl;\n    std::cout << (std::find(v.begin(), v.end(), 9) == v.end()) << std::endl;\n    return 0;\n}',
      answer: '2 3\n1',
      explain: '3 在下标 2，迭代器相减得到距离（也就是下标）。找 9 时返回 `end()`，所以比较为真打印 1——这是判断「查找失败」的标准写法。' },

    { id: 'cppq20', ch: 'cpp4', lesson: 'cpp4l5', point: '容器选型', type: 'choice', diff: 2,
      prompt: '需要「按 key 频繁查找、并且要能按键从小到大数据历」，应该选？',
      opts: ['`std::vector`', '`std::map`', '`std::unordered_map`', '`std::list`'],
      ans: 1,
      explain: '`map` 是红黑树，查找 O(log n) 且**天然有序**，可直接按序遍历。`unordered_map` 虽然更快（O(1)），但遍历顺序不确定，不适合「按序遍历」的需求。' },

    { id: 'cppq21', ch: 'cpp5', lesson: 'cpp5l1', point: 'accumulate 的初值', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <vector>\n#include <numeric>\n#include <functional>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v{1, 2, 3, 4};\n    std::cout << std::accumulate(v.begin(), v.end(), 0) << " ";\n    std::cout << std::accumulate(v.begin(), v.end(), 1, std::multiplies<int>()) << std::endl;\n    std::cout << std::count_if(v.begin(), v.end(), [](int x) { return x % 2; }) << std::endl;\n    return 0;\n}',
      answer: '10 24\n2',
      explain: '第一个是求和（初值 0）得 10；第二个换成乘法、初值 1，得 1×1×2×3×4=24；`count_if` 统计奇数（1、3）共 2 个。' },

    { id: 'cppq22', ch: 'cpp5', lesson: 'cpp5l2', point: '捕获的两种方式', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nint main() {\n    int n = 1;\n    auto byVal = [n]() { return n; };\n    auto byRef = [&n]() { return n; };\n    n = 10;\n    std::cout << byVal() << " " << byRef() << std::endl;\n    return 0;\n}',
      answer: '1 10',
      explain: '`[n]` 在 lambda **创建时**就拷贝了 n（当时是 1），之后外部改 n 也不影响；`[&n]` 存的是引用，调用时才去读，所以读到 10。' },

    { id: 'cppq23', ch: 'cpp5', lesson: 'cpp5l3', point: '严格弱序', type: 'choice', diff: 3,
      prompt: '给 `std::sort` 的比较函数写成 `[](int a, int b) { return a <= b; }` 有什么问题？',
      opts: ['没有问题的，只是慢一点', '违反严格弱序，相等元素会返回 true，可能导致越界或崩溃', '编译不过', '只会影响稳定性'],
      ans: 1,
      explain: '`sort` 要求比较函数在 a、b 相等时返回 **false**。写 `<=` 会让算法误判「a 小于 b 且 b 小于 a」，内部指针可能移到区间外——这是实实在在的 UB，轻则排序结果乱，重则崩溃。' },

    { id: 'cppq24', ch: 'cpp5', lesson: 'cpp5l4', point: 'transform', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v{1, 2, 3};\n    std::vector<int> o(v.size());\n    std::transform(v.begin(), v.end(), o.begin(), [](int x) { return x * 10; });\n    for (int x : o) std::cout << x << " ";\n    std::cout << std::endl;\n    return 0;\n}',
      answer: '10 20 30',
      explain: '`transform` 把区间里每个元素经过函数变换后写到输出迭代器，等价于「map」。目标容器必须**预先有足够空间**，否则会越界写。' },

    { id: 'cppq25', ch: 'cpp5', lesson: 'cpp5l1', point: 'erase-remove', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v{1, 2, 3, 4, 5};\n    v.erase(std::remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }), v.end());\n    std::cout << v.size() << std::endl;\n    for (int x : v) std::cout << x;\n    std::cout << std::endl;\n    return 0;\n}',
      answer: '3\n135',
      explain: '`remove_if` 把要保留的（1、3、5）往前挪，返回新的逻辑末尾；`erase` 把从那个位置到 `end` 的残留元素真正删掉。只写 `remove_if` 不 `erase`，长度不会变。' },

    { id: 'cppq26', ch: 'cpp6', lesson: 'cpp6l1', point: '构造析构顺序', type: 'choice', diff: 2,
      prompt: '`Derived d;` 创建对象时，构造函数的执行顺序是？',
      opts: ['先基类构造，再派生类构造', '先派生类构造，再基类构造', '同时执行', '取决于是否写了 virtual'],
      ans: 0,
      explain: '派生类对象「包含」一个基类子对象，所以必须先把它构造好，派生类的部分才能用。析构顺序相反：先派生后基类。' },

    { id: 'cppq27', ch: 'cpp6', lesson: 'cpp6l3', point: '对象切片', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nstruct B { virtual void f() const { std::cout << "B"; } };\nstruct D : B { void f() const override { std::cout << "D"; } };\n\nint main() {\n    D d;\n    B b = d;\n    const B& r = d;\n    b.f();\n    r.f();\n    std::cout << std::endl;\n    return 0;\n}',
      answer: 'BD',
      explain: '`B b = d;` 是**对象切片**：只复制了基类那一部分，b 的静态和动态类型都是 B，所以打印 B。`const B& r = d;` 是引用，仍指向原来那个 D 对象，虚函数表还是 D 的，打印 D。' },

    { id: 'cppq28', ch: 'cpp6', lesson: 'cpp6l2', point: '虚析构', type: 'choice', diff: 3,
      prompt: '基类析构函数不是虚函数，用基类指针 `delete` 派生类对象会发生什么？',
      opts: ['正常调用两个析构函数', '只调用基类析构函数，派生类的资源泄漏', '编译错误', '程序一定崩溃'],
      ans: 1,
      explain: '非虚析构时 `delete p` 只按静态类型（基类）调用析构，派生类的析构不会执行，它持有的资源就泄漏了。所以带虚函数的类必须写 `virtual ~Base()`。' },

    { id: 'cppq29', ch: 'cpp6', lesson: 'cpp6l4', point: '抽象类', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nstruct I {\n    virtual int v() const = 0;\n    virtual ~I() = default;\n};\n\nstruct A : I {\n    int v() const override { return 1; }\n};\n\nint main() {\n    I* p = new A();\n    std::cout << p->v() << std::endl;\n    delete p;\n    return 0;\n}',
      answer: '1',
      explain: '`I` 是抽象类（有纯虚函数），不能直接创建对象，但可以有 `I*` 指针。通过它调用 `v()` 走动态绑定，执行 A 的实现，返回 1。' },

    { id: 'cppq30', ch: 'cpp6', lesson: 'cpp6l2', point: 'override 的作用', type: 'choice', diff: 2,
      prompt: '重写虚函数时忘了写 `const`，又没加 `override`，会怎样？',
      opts: ['编译报错', '静默变成一个新函数，多态失效但编译通过', '自动被当作重写', '派生类无法编译'],
      ans: 1,
      explain: '参数列表（含 `const`）不同就是**另一个函数**，它没有重写基类的虚函数，通过基类指针调用时仍然执行基类版本。加了 `override` 编译器就会直接报错——这就是它存在的意义。' },

    { id: 'cppq31', ch: 'cpp7', lesson: 'cpp7l1', point: '模板实例化', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n\ntemplate <typename T>\nT twice(T x) { return x + x; }\n\nint main() {\n    std::cout << twice(3) << " " << twice(1.5) << std::endl;\n    return 0;\n}',
      answer: '6 3',
      explain: '同一个模板被实例化两次：`T=int` 生成一个函数，`T=double` 再生成一个。所以 3+3=6，1.5+1.5=3。' },

    { id: 'cppq32', ch: 'cpp7', lesson: 'cpp7l2', point: '类模板', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <string>\n#include <vector>\n\ntemplate <typename T>\nclass Box {\npublic:\n    void add(T v) { d_.push_back(v); }\n    size_t size() const { return d_.size(); }\nprivate:\n    std::vector<T> d_;\n};\n\nint main() {\n    Box<int> a;\n    Box<std::string> b;\n    a.add(1);\n    a.add(2);\n    b.add("x");\n    std::cout << a.size() << " " << b.size() << std::endl;\n    return 0;\n}',
      answer: '2 1',
      explain: '`Box<int>` 和 `Box<std::string>` 是两个**完全不同的类型**，各有自己的成员和实例。它们只是从同一个模板生成，互不影响。' },

    { id: 'cppq33', ch: 'cpp7', lesson: 'cpp7l3', point: '折叠表达式', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: '#include <iostream>\n\ntemplate <typename... T>\nint sum(T... v) { return (v + ... + 0); }\n\nint main() {\n    std::cout << sum(1, 2, 3, 4) << std::endl;\n    std::cout << sum() << std::endl;\n    return 0;\n}',
      answer: '10\n0',
      explain: '`(v + ... + 0)` 把参数包从左到右加一遍，末尾的 `+ 0` 是空包时的初值，所以 `sum()` 返回 0 而不是编译失败。' },

    { id: 'cppq34', ch: 'cpp7', lesson: 'cpp7l4', point: 'constexpr 当数组大小', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nconstexpr int sq(int n) { return n * n; }\n\nint main() {\n    int a[sq(3)] = {};\n    std::cout << sizeof(a) / sizeof(int) << " " << sq(5) << std::endl;\n    return 0;\n}',
      answer: '9 25',
      explain: '`sq(3)` 在编译期算出 9，所以数组长度是 9；`sizeof(a)/sizeof(int)` 得元素个数 9。`sq(5)` 也常量折叠成 25。' },

    { id: 'cppq35', ch: 'cpp7', lesson: 'cpp7l1', point: '模板为什么在头文件', type: 'choice', diff: 3,
      prompt: '为什么模板的定义通常要写在头文件里？',
      opts: ['头文件执行更快', '编译器必须在使用处看到完整定义才能实例化', 'C++ 标准强制要求', '为了减少编译时间'],
      ans: 1,
      explain: '模板本身不是代码，只有被具体类型实例化后才生成代码。别的 `.cpp` 用到它时必须能看见完整定义，否则无法生成那一份实例，链接时就找不到符号。' },

    { id: 'cppq36', ch: 'cpp8', lesson: 'cpp8l1', point: '异常基本流程', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <stdexcept>\n\nint main() {\n    try {\n        throw std::runtime_error("坏了");\n    } catch (const std::exception& e) {\n        std::cout << "捕获：" << e.what() << std::endl;\n    }\n    std::cout << "继续" << std::endl;\n    return 0;\n}',
      answer: '捕获：坏了\n继续',
      explain: '`runtime_error` 继承自 `std::exception`，所以能用基类引用接住；`what()` 返回构造时传的消息。catch 处理完后程序**继续往下执行**，不会终止。' },

    { id: 'cppq37', ch: 'cpp8', lesson: 'cpp8l1', point: '按引用捕获异常', type: 'choice', diff: 2,
      prompt: '`catch (std::exception e)` 和 `catch (const std::exception& e)` 的区别是？',
      opts: ['没有区别', '按值捕获会发生对象切片，派生类信息丢失', '按引用捕获更慢', '按值捕获不能调用 what()'],
      ans: 1,
      explain: '异常对象是有动态类型的（可能是 `std::out_of_range`），按值捕获会把它「切」成 `std::exception`，派生类的数据全丢。一律用 `const&`：不拷贝、不切片。' },

    { id: 'cppq38', ch: 'cpp8', lesson: 'cpp8l2', point: 'getline 的分隔符', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <sstream>\n#include <string>\n\nint main() {\n    std::ostringstream o;\n    o << 1 << "-" << 2;\n\n    std::istringstream in(o.str());\n    std::string s;\n    std::getline(in, s, \'-\');\n    std::cout << s << std::endl;\n    return 0;\n}',
      answer: '1',
      explain: '`getline(in, s, \'-\')` 用 `-` 当分隔符，读到第一个 `-` 就停，所以 s 是 `"1"`。不传第三个参数时默认按 `\\n` 分行。' },

    { id: 'cppq39', ch: 'cpp8', lesson: 'cpp8l3', point: '头文件里放什么', type: 'choice', diff: 2,
      prompt: '下面哪一项**不应该**放在头文件里？',
      opts: ['类的定义', '函数声明', '模板的定义', '普通（非 inline）函数的定义'],
      ans: 3,
      explain: '头文件会被多个 `.cpp` 包含，普通函数定义放进去就会产生多份定义，违反 ODR，链接时报 `multiple definition`。要么只放声明，要么加 `inline`。' },

    { id: 'cppq40', ch: 'cpp8', lesson: 'cpp8l4', point: 'sanitizer', type: 'choice', diff: 2,
      prompt: '程序偶尔崩溃，怀疑是数组越界或用了已释放的内存，最该先启用什么？',
      opts: ['`-O3` 优化', '`-fsanitize=address`', '`-static` 静态链接', '`-DNDEBUG`'],
      ans: 1,
      explain: 'AddressSanitizer 会在越界、use-after-free、双重释放、泄漏时立刻报错并给出准确行号和调用栈。这类 bug 不开 sanitizer 时往往表现为「偶发崩溃」，极难定位。' },
  ],
  checkin: [
    { id: 'cppk1', ch: 'cpp1', lesson: 'cpp1l1', point: '-Wall 的作用', type: 'choice', diff: 1,
      prompt: '编译时加 `-Wall` 的作用是什么？',
      opts: ['让程序跑得更快', '打开常用警告，提前发现隐患', '生成调试信息', '自动修复代码'],
      ans: 1,
      explain: '`-Wall` 打开一批「能编过但很可能是 bug」的警告：变量未使用、函数缺返回值、格式符与参数类型不符等。它不改变生成的代码，只是把风险提前暴露。' },

    { id: 'cppk2', ch: 'cpp1', lesson: 'cpp1l2', point: '整数除法', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nint main() {\n    int a = 7, b = 2;\n    std::cout << a / b << " " << a % b << " " << (double)a / b << std::endl;\n    return 0;\n}',
      answer: '3 1 3.5',
      explain: '两个整数相除是**整除**，得 3；取模得余数 1；只有把其中一个转成 `double` 才会做浮点除法，得 3.5。' },

    { id: 'cppk3', ch: 'cpp1', lesson: 'cpp1l3', point: '引用的约束', type: 'choice', diff: 2,
      prompt: '关于引用，哪个说法是对的？',
      opts: ['可以不初始化，之后再绑定', '必须初始化，且不能再改绑到别的变量', '可以为空（指向 nullptr）', 'sizeof(引用) 是指针大小'],
      ans: 1,
      explain: '引用在创建时必须绑定到一个已存在的对象，而且终身只能指它。没有「空引用」这种东西，`sizeof(r)` 得到的是被引用对象的大小。' },

    { id: 'cppk4', ch: 'cpp1', lesson: 'cpp1l4', point: '命名空间', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nnamespace n { int x = 1; }\n\nint main() {\n    int x = 2;\n    std::cout << x << " " << n::x << std::endl;\n    return 0;\n}',
      answer: '2 1',
      explain: '局部变量 `x` 遮蔽了全局同名变量，直接写 `x` 得到 2；要访问命名空间里的那份必须写全 `n::x`。这就是 `namespace` 隔离重名的方式。' },

    { id: 'cppk5', ch: 'cpp1', lesson: 'cpp1l2', point: 'char 与 int', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nint main() {\n    char c = \'A\';\n    std::cout << c << " " << (int)c << std::endl;\n    return 0;\n}',
      answer: 'A 65',
      explain: '`char` 存的是字符的编码值。`\'A\'` 在 ASCII 里是 65，直接输出 char 会当成字符打印，转成 int 才看到数字。' },

    { id: 'cppk6', ch: 'cpp2', lesson: 'cpp2l1', point: '访问控制生效', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nclass P {\npublic:\n    int x = 1;\nprivate:\n    int y = 2;\n};\n\nint main() {\n    P p;\n    std::cout << p.x << std::endl;\n    return 0;\n}',
      answer: '1',
      explain: '`x` 是 public 可以直接访问。`y` 是 private，`p.y` 编译不过——注意这是**编译期**的检查，不是运行时限制。' },

    { id: 'cppk7', ch: 'cpp2', lesson: 'cpp2l2', point: '构造器调用时机', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <string>\n\nclass T {\npublic:\n    T(std::string s) : s_(s) { std::cout << "构造" << s_ << std::endl; }\nprivate:\n    std::string s_;\n};\n\nint main() {\n    T a("1"), b("2");\n    return 0;\n}',
      answer: '构造1\n构造2',
      explain: '每个对象创建时都会调用一次构造器，顺序就是定义的顺序。注意初始化列表里 `s_(s)` 用的是成员名，别和参数名写成一样（写成一样就变成自己初始化自己了）。' },

    { id: 'cppk8', ch: 'cpp2', lesson: 'cpp2l3', point: '默认拷贝构造', type: 'choice', diff: 2,
      prompt: '编译器默认生成的拷贝构造函数做的是什么？',
      opts: ['调用每个成员的拷贝构造（逐成员复制）', '什么都不做', '把对象地址复制一份', '调用默认构造器'],
      ans: 0,
      explain: '默认拷贝构造对每个成员依次调用它自己的拷贝构造（基本类型就是按位复制）。所以「成员都是值类型或标准容器」时默认版本就是对；一旦有裸指针，就会变成浅拷贝。' },

    { id: 'cppk9', ch: 'cpp2', lesson: 'cpp2l4', point: '返回自身引用', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nstruct C {\n    int v = 0;\n    C& operator+=(int x) { v += x; return *this; }\n};\n\nint main() {\n    C c;\n    (c += 1) += 2;\n    std::cout << c.v << std::endl;\n    return 0;\n}',
      answer: '3',
      explain: '`operator+=` 返回 `*this`（引用），所以 `(c += 1)` 的结果还是 c 本身，能继续 `+= 2`。如果返回的是值，第二次加就作用在临时副本上，c 只会是 1。' },

    { id: 'cppk10', ch: 'cpp2', lesson: 'cpp2l5', point: 'static 的归属', type: 'choice', diff: 2,
      prompt: '类的 `static` 成员变量属于谁？',
      opts: ['每个对象各自一份', '属于类本身，所有对象共用一份', '属于第一个创建的对象', '属于命名空间'],
      ans: 1,
      explain: '静态成员属于**类**而不是对象：整个程序只有一份，可以用 `类名::成员` 直接访问。正因为它不属于对象，`sizeof` 一个对象时也不包含它。' },

    { id: 'cppk11', ch: 'cpp3', lesson: 'cpp3l1', point: 'new 一个 int', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nint main() {\n    int* p = new int(7);\n    std::cout << *p << std::endl;\n    delete p;\n    p = nullptr;\n    std::cout << (p == nullptr) << std::endl;\n    return 0;\n}',
      answer: '7\n1',
      explain: '`new int(7)` 在堆上分配一个 int 并初始化为 7。`delete` 之后把指针置空是好习惯——不置空就成悬垂指针，之后再误用就是 UB。' },

    { id: 'cppk12', ch: 'cpp3', lesson: 'cpp3l2', point: 'RAII 何时释放', type: 'choice', diff: 1,
      prompt: 'RAII 对象的资源是在什么时候释放的？',
      opts: ['程序退出时统一释放', '对象离开作用域、析构函数被调用时', '手动调用 release() 时', '垃圾回收器扫描到时'],
      ans: 1,
      explain: 'C++ 没有垃圾回收，资源释放靠**析构函数的确定性调用**：离开作用域、`delete`、异常栈展开，三种情况都会触发。这正是 RAII 可靠的原因。' },

    { id: 'cppk13', ch: 'cpp3', lesson: 'cpp3l3', point: 'unique_ptr 解引用', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <memory>\n\nint main() {\n    auto p = std::make_unique<int>(3);\n    *p = 8;\n    std::cout << *p << std::endl;\n    return 0;\n}',
      answer: '8',
      explain: '`unique_ptr` 重载了 `*` 和 `->`，用起来和裸指针一样。改完 `*p` 打印就是 8，不需要任何特殊语法。' },

    { id: 'cppk14', ch: 'cpp3', lesson: 'cpp3l4', point: 'weak_ptr 的观察', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <memory>\n\nint main() {\n    std::weak_ptr<int> w;\n    {\n        auto s = std::make_shared<int>(1);\n        w = s;\n        std::cout << w.expired() << " ";\n    }\n    std::cout << w.expired() << std::endl;\n    return 0;\n}',
      answer: '0 1',
      explain: '块内 shared_ptr 还活着，`expired()` 为假（0）；块结束 shared_ptr 析构、对象释放，weak_ptr 感知到对象没了，`expired()` 为真（1）。weak_ptr 不会延长寿命。' },

    { id: 'cppk15', ch: 'cpp3', lesson: 'cpp3l5', point: '为什么 noexcept', type: 'choice', diff: 3,
      prompt: '移动构造函数标 `noexcept` 为什么重要？',
      opts: ['让函数跑得更快', 'vector 扩容时才愿意用移动代替拷贝', '不加就无法编译', '只有加了才能被 std::move 使用'],
      ans: 1,
      explain: '`vector` 扩容要把元素搬到新内存，如果移动可能抛异常就无法回滚，所以标准库会**退回用拷贝**。标了 `noexcept` 才走移动，大数据量下性能差好几倍。' },

    { id: 'cppk16', ch: 'cpp4', lesson: 'cpp4l1', point: 'vector 基本操作', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> v;\n    for (int i = 1; i <= 4; ++i) v.push_back(i);\n    std::cout << v.size() << " " << v[0] << " " << v.back() << std::endl;\n    return 0;\n}',
      answer: '4 1 4',
      explain: '依次加入 1、2、3、4，长度 4；`v[0]` 是首元素 1，`back()` 是最后一个 4。注意下标从 0 开始，`v[4]` 就越界了。' },

    { id: 'cppk17', ch: 'cpp4', lesson: 'cpp4l2', point: 'substr', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <string>\n\nint main() {\n    std::string s = "hello";\n    std::cout << s.substr(1, 3) << " " << s.size() << std::endl;\n    std::cout << s + "!" << std::endl;\n    return 0;\n}',
      answer: 'ell 5\nhello!',
      explain: '`substr(1, 3)` 从下标 1 开始取 3 个字符，得 `ell`；`size()` 是 5。`+` 拼接返回新字符串，原 s 不变，所以第二行是 `hello!`。' },

    { id: 'cppk18', ch: 'cpp4', lesson: 'cpp4l3', point: 'set 去重排序', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <set>\n\nint main() {\n    std::set<int> s{3, 3, 1, 2};\n    std::cout << s.size() << " " << *s.begin() << " " << *s.rbegin() << std::endl;\n    return 0;\n}',
      answer: '3 1 3',
      explain: '`set` 自动去重并排序，4 个元素进去只剩 3 个。`begin()` 是最小的 1，`rbegin()` 是最大的 3（反向迭代器要解引用取到值）。' },

    { id: 'cppk19', ch: 'cpp4', lesson: 'cpp4l4', point: '范围 for 改元素', type: 'choice', diff: 2,
      prompt: '想用范围 for 修改容器里的元素，应该写成？',
      opts: ['`for (auto x : v)`', '`for (auto& x : v)`', '`for (auto* x : v)`', '`for (const auto& x : v)`'],
      ans: 1,
      explain: '`auto x` 是拷贝，改的是副本；`auto&` 是引用，改的才是原元素；`const auto&` 只读。大对象只读遍历用 `const auto&` 最划算（零拷贝又不许改）。' },

    { id: 'cppk20', ch: 'cpp4', lesson: 'cpp4l5', point: 'list 的代价', type: 'choice', diff: 2,
      prompt: '为什么现代 C++ 里 `std::list` 用得越来越少？',
      opts: ['功能太少', '节点单独分配，遍历时缓存不友好，常常比 vector 还慢', '不支持迭代器', '不能存自定义类型'],
      ans: 1,
      explain: 'list 的每个节点都是一次独立分配，内存分散、缓存命中率极低；而 vector 连续存储、预取友好。除非真的频繁在已知位置插入删除，否则 vector 通常更快。' },

    { id: 'cppk21', ch: 'cpp5', lesson: 'cpp5l1', point: 'is_sorted', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v{3, 1, 2};\n    std::sort(v.begin(), v.end());\n    std::cout << std::is_sorted(v.begin(), v.end()) << " " << v[0] << std::endl;\n    return 0;\n}',
      answer: '1 1',
      explain: '排完序后 `is_sorted` 为真（打印 1），首元素是 1。`sort` 默认升序，用的是元素自己的 `operator<`。' },

    { id: 'cppk22', ch: 'cpp5', lesson: 'cpp5l2', point: '按值捕获的时机', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nint main() {\n    int k = 5;\n    auto f = [k](int x) { return x + k; };\n    k = 100;\n    std::cout << f(1) << std::endl;\n    return 0;\n}',
      answer: '6',
      explain: '`[k]` 在 lambda **创建时**就把 k 拷贝进闭包了（当时是 5），之后外部把 k 改成 100 也不影响这个副本。所以 `f(1)` 是 1+5=6。' },

    { id: 'cppk23', ch: 'cpp5', lesson: 'cpp5l3', point: '降序排序', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v{1, 2, 3};\n    std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });\n    for (int x : v) std::cout << x;\n    std::cout << std::endl;\n    return 0;\n}',
      answer: '321',
      explain: '比较函数返回 `a > b` 表示「a 应该排在 b 前面」，于是从大到小排。等价的简写是 `std::greater<int>()`。' },

    { id: 'cppk24', ch: 'cpp5', lesson: 'cpp5l4', point: 'back_inserter', type: 'choice', diff: 2,
      prompt: '`std::copy_if(..., std::back_inserter(out))` 里的 `back_inserter` 起什么作用？',
      opts: ['把容器倒序', '往里写就等于 push_back，目标容器可以初始为空', '预先分配内存', '删除末尾元素'],
      ans: 1,
      explain: '它是「插入迭代器」：每次赋值都转成 `push_back`，容器自己扩容。这样目标容器不用预先 `resize`，也不会越界写。' },

    { id: 'cppk25', ch: 'cpp5', lesson: 'cpp5l1', point: 'count 与 count_if', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v{1, 2, 2, 3};\n    std::cout << std::count(v.begin(), v.end(), 2) << " ";\n    std::cout << std::count_if(v.begin(), v.end(), [](int x) { return x > 2; }) << std::endl;\n    return 0;\n}',
      answer: '2 1',
      explain: '`count` 数等于 2 的个数（2 个）；`count_if` 数满足条件的（大于 2 的只有 3，1 个）。前者是「等于某值」，后者是「满足某条件」。' },

    { id: 'cppk26', ch: 'cpp6', lesson: 'cpp6l1', point: '构造析构的完整顺序', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nstruct A {\n    A() { std::cout << "A"; }\n    ~A() { std::cout << "-A"; }\n};\n\nstruct B : A {\n    B() { std::cout << "B"; }\n    ~B() { std::cout << "-B"; }\n};\n\nint main() {\n    { B b; }\n    std::cout << std::endl;\n    return 0;\n}',
      answer: 'AB-B-A',
      explain: '构造：先父 A 再子 B；析构：先子 B 再父 A。所以完整序列是 `A` `B` `-B` `-A`。这对「派生类用基类资源」的场景至关重要——父类必须活得比子类久。' },

    { id: 'cppk27', ch: 'cpp6', lesson: 'cpp6l2', point: '多态的条件', type: 'choice', diff: 2,
      prompt: '要通过基类指针调用到派生类的实现，必须满足什么？',
      opts: ['函数在基类里是 virtual，且通过指针/引用调用', '函数在基类里是 virtual，用对象直接调用也行', '基类函数必须是纯虚的', '必须用 static_cast 转换'],
      ans: 0,
      explain: '两个条件缺一不可：函数必须是虚函数，调用必须通过**指针或引用**。用对象直接调用（`Base b = derived; b.f();`）会发生切片，静态绑定到基类版本。' },

    { id: 'cppk28', ch: 'cpp6', lesson: 'cpp6l3', point: '虚析构的效果', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nstruct B {\n    virtual ~B() { std::cout << "B"; }\n};\n\nstruct D : B {\n    ~D() override { std::cout << "D"; }\n};\n\nint main() {\n    B* p = new D();\n    delete p;\n    std::cout << std::endl;\n    return 0;\n}',
      answer: 'DB',
      explain: '有虚析构时，`delete p` 会沿动态类型调用 D 的析构，再自动调用基类析构，顺序是 D 然后 B。如果基类析构不是虚的，只会打印 B，D 里的资源就泄漏了。' },

    { id: 'cppk29', ch: 'cpp6', lesson: 'cpp6l4', point: '抽象类的使用', type: 'choice', diff: 1,
      prompt: '含有纯虚函数的类，能做什么？',
      opts: ['正常创建对象', '不能创建对象，但能定义指针和引用', '连指针都不能定义', '只能被继承一次'],
      ans: 1,
      explain: '抽象类不能实例化（`I i;` 编译报错），但 `I*` / `I&` 完全可以用——多态正是靠基类指针/引用来实现的。' },

    { id: 'cppk30', ch: 'cpp6', lesson: 'cpp6l5', point: '菱形继承', type: 'choice', diff: 3,
      prompt: '两个中间类都普通继承同一个基类，最内层再同时继承这两个类，会出什么问题？',
      opts: ['编译不通过', '对象里有两份基类子对象，访问基类成员时产生歧义', '基类构造器被调用两次但没影响', '自动合并成一份'],
      ans: 1,
      explain: '这就是菱形继承：两条路径各带一份基类，`d.id` 不知道用哪份，编译报 ambiguous。用**虚继承**（`virtual public Base`）可以让两条路径共享同一份基类子对象。' },

    { id: 'cppk31', ch: 'cpp7', lesson: 'cpp7l1', point: '模板的多种实例', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <string>\n\ntemplate <typename T>\nT add(T a, T b) { return a + b; }\n\nint main() {\n    std::cout << add(1, 2) << " " << add(std::string("a"), std::string("b")) << std::endl;\n    return 0;\n}',
      answer: '3 ab',
      explain: '同一个模板被 int 和 string 各实例化一次。int 版本做加法得 3，string 版本做拼接得 `ab`——只要类型支持 `+`，模板就能用。' },

    { id: 'cppk32', ch: 'cpp7', lesson: 'cpp7l2', point: '类模板实例', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n\ntemplate <typename T>\nstruct Pair {\n    T a, b;\n    T sum() const { return a + b; }\n};\n\nint main() {\n    Pair<int> p{1, 2};\n    Pair<double> q{1.5, 2.5};\n    std::cout << p.sum() << " " << q.sum() << std::endl;\n    return 0;\n}',
      answer: '3 4',
      explain: '`Pair<int>` 的 `sum()` 返回 int，1+2=3；`Pair<double>` 返回 double，1.5+2.5=4。两个实例各有自己的成员函数版本。' },

    { id: 'cppk33', ch: 'cpp7', lesson: 'cpp7l3', point: '可变参数', type: 'choice', diff: 3,
      prompt: '`template <typename... Args>` 里的 `...` 表示什么？',
      opts: ['省略号没有实际意义', '一个可以接受任意个类型的参数包', '只能接受三个参数', '表示可变长度的数组'],
      ans: 1,
      explain: '`Args...` 是**参数包**：调用时能传任意个、任意类型的实参，用折叠表达式或递归展开来处理。`std::make_unique`、`printf` 的安全版本都靠它。' },

    { id: 'cppk34', ch: 'cpp7', lesson: 'cpp7l4', point: 'constexpr 当数组长度', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nconstexpr int twice(int n) { return n * 2; }\n\nint main() {\n    int a[twice(2)] = {1, 2, 3, 4};\n    std::cout << sizeof(a) / sizeof(int) << std::endl;\n    return 0;\n}',
      answer: '4',
      explain: '`twice(2)` 在编译期算出 4，所以数组长度 4，初始列表正好塞满。用普通函数调用当数组长度是不允许的——那值要到运行期才知道。' },

    { id: 'cppk35', ch: 'cpp8', lesson: 'cpp8l1', point: '捕获任意类型', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n\nint main() {\n    try {\n        throw 42;\n    } catch (int e) {\n        std::cout << e << std::endl;\n    }\n    return 0;\n}',
      answer: '42',
      explain: 'C++ 可以抛任何类型（包括 int）。但**不要这么写**——抛基本类型无法携带上下文信息，调用方也无从知道你抛的是错误码还是普通数字。抛继承自 `std::exception` 的类才是规范做法。' },

    { id: 'cppk36', ch: 'cpp8', lesson: 'cpp8l1', point: '异常 vs 返回码', type: 'choice', diff: 2,
      prompt: '什么情况更适合返回错误码而不是抛异常？',
      opts: ['文件打不开这类致命的错误', '用户输入不合法这种预期内的常见情况', '内存分配失败', '程序内部状态被破坏'],
      ans: 1,
      explain: '异常适合「没法继续」的罕见情况。输入校验这种每次都可能发生、调用方必须处理的分支，用返回值（bool、`optional`、错误码）更清晰，也没有异常的开销。' },

    { id: 'cppk37', ch: 'cpp8', lesson: 'cpp8l2', point: 'stringstream 解析', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <sstream>\n\nint main() {\n    std::istringstream in("3 4");\n    int a = 0, b = 0;\n    in >> a >> b;\n    std::cout << a * b << std::endl;\n    return 0;\n}',
      answer: '12',
      explain: '`istringstream` 把字符串当输入流用，`>>` 会自动按空白切分并转成 int。这是解析一行数字最省事的写法，不需要手动 `split`。' },

    { id: 'cppk38', ch: 'cpp8', lesson: 'cpp8l3', point: 'ODR', type: 'choice', diff: 2,
      prompt: 'ODR（单一定义规则）要求的是什么？',
      opts: ['每个文件只能有一个函数', '同一个函数/变量在整个程序里只能有一份定义', '每个类只能有一个成员', '头文件只能被包含一次'],
      ans: 1,
      explain: '整份程序里同一实体只能有**一份定义**（声明可以有很多份）。所以头文件放定义、又被多个 `.cpp` 包含时，链接期就会报 `multiple definition`——除非标了 `inline`。' },

    { id: 'cppk39', ch: 'cpp8', lesson: 'cpp8l4', point: 'assert 的行为', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <iostream>\n#include <cassert>\n\nint main() {\n    int x = 3;\n    assert(x > 0);\n    std::cout << (x > 0) << std::endl;\n    return 0;\n}',
      answer: '1',
      explain: '条件为真时 `assert` 什么也不做，程序继续。条件为假会打印文件名和行号并 `abort()`。定义 `NDEBUG` 后整个 assert 会被编译器删掉，所以别在 assert 里写有副作用的表达式。' },

    { id: 'cppk40', ch: 'cpp8', lesson: 'cpp8l4', point: '学习路线', type: 'choice', diff: 1,
      prompt: '已经会 C 的指针和内存管理，接下来学 C++ 最合理的顺序是？',
      opts: ['直接学模板元编程', '类与 RAII → STL 容器与算法 → 模板与移动语义', '先啃完 1000 页语法书再说', '先学并发和多线程'],
      ans: 1,
      explain: '类与 RAII 是 C++ 的地基（不会 RAII 就写不出安全的代码），STL 是日常工具，模板和移动语义属于进阶。跳过前两步直接学模板，几乎必然卡在报错信息里。' },
  ],
};
