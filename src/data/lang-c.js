/* ============================================================
   CodeCraft 数据 · C（8 章 40 课）
   ============================================================ */
window.LANGS = window.LANGS || {};

window.LANGS.c = {
  id: 'c', name: 'C', en: 'C (C11)', icon: '🔧', color: '#5f6f8f',
  blurb: '所有现代语言的共同祖先。手动管内存、直接操作地址，学完再看其他语言会发现它们都在替你做什么。',
  hello: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, C!\\n");\n    return 0;\n}',
  lab: [
    { name: 'Hello World', code: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, C!\\n");\n    return 0;\n}' },
    { name: '读两个数求和', code: '#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    if (scanf("%d %d", &a, &b) != 2) return 1;\n    printf("sum = %d\\n", a + b);\n    return 0;\n}' },
    { name: '打印九九表的一行', code: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i <= 9; i++) {\n        printf("%d x 7 = %d\\n", i, i * 7);\n    }\n    return 0;\n}' },
    { name: '数组求平均', code: '#include <stdio.h>\n\nint main(void) {\n    int a[5] = {80, 92, 66, 100, 71};\n    int sum = 0;\n    for (int i = 0; i < 5; i++) sum += a[i];\n    printf("avg = %.2f\\n", sum / 5.0);\n    return 0;\n}' }
  ],
  chapters: [
    {
      id: 'c1', num: 1, title: '从源码到可执行文件', icon: '⚙️',
      intro: 'C 和 Python 最大的差别，是你写的文件不能直接「跑」——它要先变成机器码。这一章讲清这中间的四步，以及 main、printf、变量这些最基础的东西。把「编译」这件事搞明白，后面 80% 的报错都能自己看懂。',
      goals: ['说清预处理、编译、汇编、链接各做什么', '用 gcc 编译并看懂 -Wall 的警告', '用 printf 正确格式化输出', '认识各类型的大小与范围'],
      lessons: [
        {
          id: 'c1l1', title: '程序的一生：四个阶段', key: '预处理 · 编译 · 链接', time: 12,
          blocks: [
            { t: 'p', x: 'C 是**编译型语言**。你写的 `.c` 文件是给人看的文本，CPU 只认机器指令，中间必须经过翻译。这条流水线上有四道工序，每一道出错的表现都不一样。' },
            { t: 'table', head: ['阶段', '作用', '产物', '出错时你会看到'], rows: [
              ['预处理', '展开 `#include`、替换 `#define`、处理 `#if`', '纯 C 代码（.i）', '`xxx.h: No such file` —— 找不到头文件'],
              ['编译', '语法检查 + 翻译成汇编', '汇编文件（.s）', '`expected \';\' before ...` —— 语法错误'],
              ['汇编', '汇编转成机器指令', '目标文件（.o）', '极少出错，一般是编译器内部错误'],
              ['链接', '把多个 .o 和库拼成一个程序', '可执行文件', '`undefined reference to ...` —— 函数只声明没定义']
            ] },
            { t: 'code', x: '#include <stdio.h>   /* 预处理：把 stdio.h 的内容整段搬进来 */\n#define N 3            /* 预处理：之后所有 N 都被替换成 3 */\n\nint main(void) {       /* 程序入口，返回值给操作系统 */\n    printf("N = %d\\n", N);\n    return 0;          /* 0 表示正常结束 */\n}', out: 'N = 3' },
            { t: 'p', x: '在命令行里，一条 `gcc hello.c -o hello` 就串完了四步。想单独看某一步，用 `gcc -E`（只要预处理结果）、`gcc -S`（只要汇编）、`gcc -c`（只到 .o），这是排查「明明写了却没生效」最快的手段。' },
            { t: 'note', x: '**`-Wall` 一定要开。** 它打开常用警告：变量没用、函数没返回值、`printf` 格式符和参数类型对不上。这些在 C 里都是「能编过但一定会出事」的隐患。' },
            { t: 'warn', x: '`#include <stdio.h>` 里的尖括号表示去**系统目录**找；`#include "my.h"` 的引号表示先在**当前目录**找。写错符号的典型症状是 `fatal error: stdio.h: No such file or directory`。' }
          ]
        },
        {
          id: 'c1l2', title: 'main、printf 与 scanf', key: '输入输出 · 格式化', time: 12,
          blocks: [
            { t: 'p', x: '`main` 是程序唯一的入口，操作系统从这里开始执行。标准写法是 `int main(void)`，末尾 `return 0` 表示成功。现在很多教材写 `void main()`，那是非标准的，换编译器就可能报错。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    printf("整数：%d\\n", 42);\n    printf("小数：%.2f\\n", 3.14159);\n    printf("字符：%c  字符串：%s\\n", \'A\', "hello");\n    printf("百分号：100%%\\n");\n    printf("%5d|%-5d|%05d\\n", 42, 42, 42);\n    return 0;\n}', out: '整数：42\n小数：3.14\n字符：A  字符串：hello\n百分号：100%\n   42|42   |00042' },
            { t: 'table', head: ['格式符', '对应类型', '说明'], rows: [
              ['%d', 'int', '十进制整数，最常用'],
              ['%ld / %lld', 'long / long long', '类型不匹配会打印出乱值'],
              ['%f', 'double', '默认 6 位小数，`%.2f` 保留两位'],
              ['%c', 'char', '单个字符'],
              ['%s', 'char 数组', '遇到 `\\0` 停止'],
              ['%p', '指针', '打印地址，调试时有用'],
              ['%zu', 'size_t', '`sizeof` / `strlen` 的返回值用它']
            ] },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int age = 20;\n    char name[32] = "小明";\n    /* 真实场景：scanf("%31s %d", name, &age) 读取输入 */\n    printf("%s 明年 %d 岁\\n", name, age + 1);\n    return 0;\n}', out: '小明 明年 21 岁' },
            { t: 'warn', x: '`scanf` 两个高频坑：① 读 `int` / `double` 必须加 `&` 取地址，漏了程序会崩；② 读字符串**不加** `&`，因为数组名本身就是地址。这两点写反了是新手最常见的崩溃原因。' },
            { t: 'note', x: '`scanf` 的返回值是「成功读到了几个值」。判断 `!= 2` 就能知道输入是不是格式不对，比读进来一堆垃圾值再去排查要省事得多。' }
          ]
        },
        {
          id: 'c1l3', title: '变量、类型与 sizeof', key: '整型 · 大小 · 范围', time: 12,
          blocks: [
            { t: 'p', x: 'C 的每个变量都有**确定的类型**，类型决定了它占几个字节、能表示多大范围、参与运算时怎么解释这些二进制位。Python 帮你自动管这些，C 要你自己管。' },
            { t: 'table', head: ['类型', '常见大小（64 位）', '范围 / 说明'], rows: [
              ['char', '1 字节', '-128 ~ 127，本质是小整数'],
              ['short', '2 字节', '-32768 ~ 32767'],
              ['int', '4 字节', '约 ±21 亿，默认整数类型'],
              ['long', '8 字节（Linux/macOS）', 'Windows 上是 4 字节，别假设'],
              ['long long', '8 字节', '明确要 64 位就用它'],
              ['float', '4 字节', '约 7 位有效数字'],
              ['double', '8 字节', '约 15 位有效数字，浮点默认用它']
            ] },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    printf("char    %zu\\n", sizeof(char));\n    printf("int     %zu\\n", sizeof(int));\n    printf("double  %zu\\n", sizeof(double));\n    printf("pointer %zu\\n", sizeof(int *));\n    printf("array   %zu\\n", sizeof(int[5]));\n    return 0;\n}', out: 'char    1\nint     4\ndouble  8\npointer 8\narray   20' },
            { t: 'h', x: '声明时初始化的几种写法' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a = 10;          /* 十进制 */\n    int b = 0x1A;        /* 十六进制 26 */\n    int c = 012;         /* 八进制 10（前导 0 是八进制！） */\n    printf("%d %d %d\\n", a, b, c);\n\n    const int LIMIT = 100;   /* 只读，改它会编译报错 */\n    printf("limit=%d\\n", LIMIT);\n    return 0;\n}', out: '10 26 10\nlimit=100' },
            { t: 'warn', x: '**前导 0 表示八进制**，是 C 里最阴的坑之一。写日期 `int t = 08;` 直接编译报错（八进制没有 8），写 `010` 你以为是一百，其实是 8。' },
            { t: 'principle', x: '**不确定用哪个整数类型时，默认 `int`；需要 64 位就用 `long long`；存数组长度或 `sizeof` 结果用 `size_t`。** 这三条覆盖 95% 的场景。' }
          ]
        },
        {
          id: 'c1l4', title: '浮点数、精度与溢出', key: 'float · double · 范围', time: 12,
          blocks: [
            { t: 'p', x: '浮点数按 IEEE 754 存储：一部分位存符号，一部分存指数，剩下的存尾数。这意味着它**存不下精确的小数**——0.1 在二进制里是无限循环小数，只能近似。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    double d = 0.1;\n    float  f = 0.1f;\n    printf("%.20f\\n", d);\n    printf("%d\\n", f == d);            /* float 提升后并不等于 double 的 0.1 */\n    printf("%.10f\\n", 1.0 / 3);\n    printf("%.3f\\n", 1e20 + 1 - 1e20);  /* 大数把小数字吃掉了 */\n    return 0;\n}', out: '0.10000000000000000555\n0\n0.3333333333\n0.000' },
            { t: 'p', x: '三条实用结论：① **不要用 `==` 比较两个浮点数**，要判断差值小于某个精度（`fabs(a-b) < 1e-9`）；② 金额用「分」为单位的整数存，别用 `double`；③ `float` 只有约 7 位有效数字，科学计算一律用 `double`。' },
            { t: 'h', x: '整数溢出：有符号是真的危险' },
            { t: 'code', x: '#include <stdio.h>\n#include <limits.h>\n\nint main(void) {\n    printf("INT_MAX  %d\\n", INT_MAX);\n    printf("UINT_MAX %u\\n", UINT_MAX);\n\n    unsigned u = 0;\n    printf("无符号 0-1 = %u\\n", u - 1);   /* 回绕，明确定义 */\n\n    long long big = 3000000000LL;\n    printf("long long 存得下 %lld\\n", big);\n    return 0;\n}', out: 'INT_MAX  2147483647\nUINT_MAX 4294967295\n无符号 0-1 = 4294967295\nlong long 存得下 3000000000' },
            { t: 'warn', x: '**有符号整数溢出是未定义行为（UB）**，不是「变成负数」这么友好。编译器有权假设它永远不会溢出，从而做出完全出乎意料的优化。无符号的回绕才是明确定义的。' },
            { t: 'note', x: 'C 里 `%` 的结果符号跟**被除数**走：`-7 % 2` 是 `-1`，不是 `1`。想取「数学意义上的余数」（永远非负），写 `((a % b) + b) % b`。' }
          ]
        }
      ]
    },
    {
      id: 'c2', num: 2, title: '运算符与表达式', icon: '🔀',
      intro: 'C 的运算符有小脾气：除法看类型、自增看顺序、逻辑运算会短路、位运算和逻辑运算长得像但完全不是一回事。这一章把这些坑一次讲透。',
      goals: ['正确使用整除、取模与复合赋值', '解释 i++ 与 ++i 的区别', '看懂短路求值并利用它防崩溃', '用位掩码管理一组开关'],
      lessons: [
        {
          id: 'c2l1', title: '整数除法与取模', key: '整除 · 取模 · 复合赋值', time: 12,
          blocks: [
            { t: 'p', x: '在 C 里，**两个整数相除结果还是整数**，小数部分直接扔掉（向零截断，不是四舍五入）。想把平均值算对，得让其中一个操作数变成浮点。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a = 7, b = 2;\n    printf("%d\\n", a / b);            /* 3：小数部分被丢掉 */\n    printf("%d\\n", a % b);             /* 余数 1 */\n    printf("%.1f\\n", (double)a / b);   /* 3.5：先转再除 */\n    printf("%.1f\\n", a * 1.0 / b);     /* 3.5：乘浮点也能升格 */\n    printf("%d\\n", -7 / 2);            /* -3：向零截断 */\n    return 0;\n}', out: '3\n1\n3.5\n3.5\n-3' },
            { t: 'h', x: '取模能干的三件事' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int n = 47;\n    printf("个位 %d\\n", n % 10);\n    printf("奇偶 %s\\n", n % 2 ? "奇" : "偶");\n    printf("秒转时分 %02d:%02d\\n", 3725 / 60 % 60, 3725 % 60);\n    return 0;\n}', out: '个位 7\n奇偶 奇\n秒转时分 02:05' },
            { t: 'note', x: '复合赋值 `+= -= *= /= %=` 不只是简写。对 `a[i++] += 1` 这种表达式，下标只求值一次，而写成 `a[i] = a[i] + 1` 会自增两次——这是「宏参数」「副作用」问题的同源版本。' },
            { t: 'warn', x: '**除以 0 在 C 里是崩溃，不是异常。** 整数除零直接触发 SIGFPE 终止进程，浮点除零得到 `inf` 或 `nan` 并继续往后传染。做除法前先判一下除数。' }
          ]
        },
        {
          id: 'c2l2', title: '关系、逻辑与短路求值', key: 'if · && · ||', time: 12,
          blocks: [
            { t: 'p', x: 'C 里没有专门的布尔类型（C99 之前）：**0 是假，非 0 都是真**。所以 `if (1)`、`if (-1)`、`if ("x")` 都成立。理解这一点，才看得懂老代码里的 `if (!ptr)`。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int score = 85;\n    if (score >= 90)      printf("优秀\\n");\n    else if (score >= 60) printf("及格\\n");\n    else                  printf("不及格\\n");\n\n    /* 三目：适合「二选一取值」，不适合堆逻辑 */\n    printf("%s\\n", score >= 60 ? "pass" : "fail");\n    return 0;\n}', out: '及格\npass' },
            { t: 'h', x: '短路：一个免费的安全网' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int *p = NULL;\n    /* 左边为假，右边根本不执行，所以不会崩 */\n    if (p != NULL && *p > 0) {\n        printf("有值\\n");\n    } else {\n        printf("空指针，已跳过\\n");\n    }\n    return 0;\n}', out: '空指针，已跳过' },
            { t: 'table', head: ['运算符', '含义', '备注'], rows: [
              ['&&', '逻辑与', '左边为假 → 右边不求值'],
              ['||', '逻辑或', '左边为真 → 右边不求值'],
              ['!', '逻辑非', '`!0` 得 1，`!5` 得 0'],
              ['& | ^', '按位与 / 或 / 异或', '逐位运算，别和逻辑混用'],
              ['?:', '三目', '唯一的三元运算符']
            ] },
            { t: 'warn', x: '**`=` 和 `==` 打错是 C 里最经典的 bug。** `if (x = 5)` 不是比较，是把 5 赋给 x 然后判断非零 → 永远成立。开 `-Wall` 会警告 `suggest parentheses around assignment`。' },
            { t: 'tip', x: '把常量写在左边（`if (5 == x)`）叫 Yoda 写法，能让你把 `==` 打成 `=` 时报错。现代做法是开 `-Wall` 让编译器提醒，别牺牲可读性。' }
          ]
        },
        {
          id: 'c2l3', title: '位运算：直接操作二进制', key: '& | ^ ~ << >>', time: 12,
          blocks: [
            { t: 'p', x: '位运算把整数当成一排二进制位来操作。它在**权限标志、压缩存储、哈希、图形处理**里到处都在用，也是理解「为什么 2 的幂这么快」的入口。' },
            { t: 'table', head: ['运算符', '名字', '例子（4 位）'], rows: [
              ['a & b', '按位与', '1100 & 1010 = 1000，用来「取某几位」'],
              ['a | b', '按位或', '1100 | 1010 = 1110，用来「置位」'],
              ['a ^ b', '按位异或', '1100 ^ 1010 = 0110，相同为 0，不同为 1'],
              ['~a', '按位取反', '~1100 = 0011（所有位都翻转）'],
              ['a << n', '左移', '每移 1 位乘 2'],
              ['a >> n', '右移', '每移 1 位除 2（无符号补 0）']
            ] },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    unsigned a = 12;   /* 1100 */\n    unsigned b = 10;   /* 1010 */\n    printf("%u %u %u %u\\n", a & b, a | b, a ^ b, ~a & 0xF);\n    printf("%u %u\\n", a << 1, a >> 2);\n\n    unsigned x = 0xAB;\n    printf("%02X %02X %02X\\n", x & 0x0F, x | 0x100, x ^ 0xFF);\n    return 0;\n}', out: '8 14 6 3\n24 3\n0B 1AB 54' },
            { t: 'p', x: '上面最后一行演示了位运算的三种典型用法：`x & 0x0F` **取低 4 位**；`x | 0x100` **把第 8 位置 1**；`x ^ 0xFF` **把低 8 位全部翻转**。' },
            { t: 'h', x: '实战：用一位存一个开关' },
            { t: 'code', x: '#include <stdio.h>\n\n#define READ   (1u << 0)   /* 001 */\n#define WRITE  (1u << 1)   /* 010 */\n#define EXEC   (1u << 2)   /* 100 */\n\nint main(void) {\n    unsigned perm = READ | WRITE;\n    printf("权限位 %u\\n", perm);\n    printf("有读权限：%d\\n", (perm & READ) != 0);\n    printf("有执行权限：%d\\n", (perm & EXEC) != 0);\n\n    perm |= EXEC;      /* 加上执行 */\n    perm &= ~WRITE;    /* 去掉写 */\n    printf("改完 %u\\n", perm);\n    return 0;\n}', out: '权限位 3\n有读权限：1\n有执行权限：0\n改完 5' },
            { t: 'warn', x: '右移**有符号负数**是「实现定义」的（多数编译器做算术右移，补符号位）。要逻辑右移就用 `unsigned`，别拿 `int` 去移负数。' },
            { t: 'principle', x: '**`&` 是取位，`&&` 是判断整体真假。** 写成 `if (flags && MASK)` 永远为真（两个都非零），必须是 `if (flags & MASK)`。这个笔误编译器不会提醒。' }
          ]
        },
        {
          id: 'c2l4', title: '自增、优先级与结合性', key: 'i++ · ++i · 求值顺序', time: 10,
          blocks: [
            { t: 'p', x: '`i++` 和 `++i` 单独成句时完全一样；一旦混进表达式，就分别代表「先取值」和「先自增」。而**同一表达式里多次修改同一个变量是未定义行为**，结果不可依赖。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int i = 5;\n    printf("%d\\n", i++);   /* 先用 5，再变 6 */\n    printf("%d\\n", ++i);   /* 先变 7，再用 7 */\n    printf("%d\\n", i);\n\n    int a = 2, b = 3, c = 4;\n    printf("%d\\n", a + b * c);      /* 乘法优先 */\n    printf("%d\\n", (a + b) * c);\n    printf("%d\\n", a < b && b < c); /* 关系优先于逻辑 */\n    return 0;\n}', out: '5\n7\n7\n14\n20\n1' },
            { t: 'table', head: ['优先级（高→低）', '运算符'], rows: [
              ['1', '`()` `[]` `->` `.`'],
              ['2', '`!` `~` `++` `--` `(类型)` `*` `&` `sizeof`'],
              ['3', '`*` `/` `%`'],
              ['4', '`+` `-`'],
              ['5', '`<<` `>>`'],
              ['6', '`<` `<=` `>` `>=`'],
              ['7', '`==` `!=`'],
              ['8', '`&` → `^` → `|`'],
              ['9', '`&&` → `||`'],
              ['10', '`?:` → 赋值 → 逗号']
            ] },
            { t: 'warn', x: '`i = i++ + ++i;` 这种写法是**未定义行为**，gcc 在不同优化级别下结果可能不同。规则很简单：一个表达式里，同一个变量最多改一次。' },
            { t: 'note', x: '记不住优先级不要紧，**加括号**。`(a & 0x0F) == 3` 和 `a & (0x0F == 3)` 差别巨大，前者正常，后者恒为 0。位运算和比较混用时，永远加括号。' }
          ]
        },
        {
          id: 'c2l5', title: '类型提升与强制转换', key: '隐式转换 · 截断', time: 10,
          blocks: [
            { t: 'p', x: '两种不同类型一起运算时，C 会按「低精度 → 高精度」自动提升：`char` → `int` → `long` → `float` → `double`。这个规则大多数时候帮你，有时也会悄悄吃掉精度。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    char c = \'A\';\n    printf("%d\\n", c + 1);            /* char 提升为 int：66 */\n    printf("%c\\n", c + 1);            /* 当字符打印：B */\n\n    printf("%d\\n", (int)3.99);        /* 强制转换：截断，不是四舍五入 */\n    printf("%.2f\\n", (double)7 / 2);  /* 先转再除 */\n\n    int n = 300;\n    printf("%d\\n", (char)n);          /* 只留低 8 位：300-256 = 44 */\n    return 0;\n}', out: '66\nB\n3\n3.50\n44' },
            { t: 'warn', x: '**把大类型塞进小类型是「截断」，不会报错也不会警告（除非开 `-Wconversion`）。** `int` 转 `char` 只保留低 8 位，`double` 转 `int` 直接砍掉小数。这类错误在数据量小的时候看不出来，量大之后才爆发。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a = 5, b = 2;\n    /* 想让结果带小数，分子分母至少一个是浮点 */\n    printf("%d\\n", a / b);\n    printf("%.1f\\n", (double)a / b);\n    printf("%.1f\\n", a / (double)b);\n    printf("%.1f\\n", a * 1.0 / b);\n    return 0;\n}', out: '2\n2.5\n2.5\n2.5' },
            { t: 'principle', x: '**转换要么显式写出来，要么确认它绝对安全。** 显式 `(double)` 本身不改变运算结果，但它告诉读代码的人「我知道这里在转换」——这个信息比转换本身更值钱。' }
          ]
        }
      ]
    },
    {
      id: 'c3', num: 3, title: '分支与循环', icon: '🔁',
      intro: '程序的「智能」全靠分支和循环。这一章除了语法，更重要的是几个固定套路：分段判断、按值分发、逐位拆解、双层遍历。套路熟了，写起来就是填空。',
      goals: ['写出清晰的多分支判断', '用 switch 做按值分发并理解穿透', '在 for / while / do-while 之间正确选择', '用 break / continue 控制循环节奏'],
      lessons: [
        {
          id: 'c3l1', title: 'if-else 与条件表达式', key: '分支 · 三目 · 嵌套', time: 10,
          blocks: [
            { t: 'p', x: '`if` 后面跟一个表达式，**非 0 就走第一个分支**。多个条件按顺序判断，第一个成立的赢——所以顺序很重要：把最严格的条件放前面。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int year = 2024;\n    /* 闰年：能被 4 整除且不能被 100 整除，或者能被 400 整除 */\n    int leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;\n    printf("%d 是闰年吗：%d\\n", year, leap);\n\n    int score = 78;\n    char grade = score >= 90 ? \'A\' : score >= 80 ? \'B\' : score >= 60 ? \'C\' : \'D\';\n    printf("等级 %c\\n", grade);\n    return 0;\n}', out: '2024 是闰年吗：1\n等级 C' },
            { t: 'note', x: '三目运算符可以嵌套，但**超过两层就该改成 if-else 或查表**。可读性比行数重要。' },
            { t: 'h', x: '判断区间的两种写法' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int x = 55;\n    /* 写法一：链式 else if，条件互斥且有序 */\n    if (x < 0)        printf("负数\\n");\n    else if (x < 60)  printf("不及格\\n");\n    else if (x < 85)  printf("及格\\n");\n    else              printf("优秀\\n");\n\n    /* 写法二：数学上写成闭区间，读起来更直观 */\n    if (x >= 0 && x < 60) printf("同样是不及格\\n");\n    return 0;\n}', out: '不及格\n同样是不及格' },
            { t: 'warn', x: '`if (0 <= x <= 100)` 在 C 里**永远成立**。它先算 `(0 <= x)` 得到 0 或 1，再算 `1 <= 100`。区间判断必须用 `&&` 连接两个比较。' },
            { t: 'principle', x: '**先写最简单的分支，复杂的放后面。** 把「正常情况」写在前面、异常情况用 else 兜底，代码会短很多。' }
          ]
        },
        {
          id: 'c3l2', title: 'switch 与 case 穿透', key: 'switch · break · default', time: 10,
          blocks: [
            { t: 'p', x: '当判断依据是**同一个整数的多个具体值**时，`switch` 比一串 `else if` 更清楚。它只能用于整型（`int` / `char` / `enum`），不能比较区间、不能比较浮点和字符串。' },
            { t: 'code', x: '#include <stdio.h>\n\nint days_of(int m) {\n    switch (m) {\n        case 2:  return 28;\n        case 4:  case 6: case 9: case 11: return 30;   /* 故意穿透：共用一段逻辑 */\n        default: return 31;\n    }\n}\n\nint main(void) {\n    int ms[3] = {2, 4, 7};\n    for (int i = 0; i < 3; i++)\n        printf("%d 月 %d 天\\n", ms[i], days_of(ms[i]));\n    return 0;\n}', out: '2 月 28 天\n4 月 30 天\n7 月 31 天' },
            { t: 'h', x: '漏写 break 会「穿透」' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int x = 1;\n    switch (x) {\n        case 1: printf("一\\n");        /* 少了 break，继续往下执行 */\n        case 2: printf("二\\n"); break;\n        case 3: printf("三\\n"); break;\n    }\n    return 0;\n}', out: '一\n二' },
            { t: 'warn', x: '**穿透（fall through）不是 bug，是特性，但 99% 的时候是失误。** 有意穿透时写一行注释 `/* fall through */`，gcc 的 `-Wimplicit-fallthrough` 就不会报警。' },
            { t: 'note', x: '`default` 不是必须的，但建议总是写上——它让读代码的人知道「其余情况你考虑过了」。可以写 `default: break;` 表示什么都不做。' }
          ]
        },
        {
          id: 'c3l3', title: 'while 与 do-while', key: '条件循环 · 至少一次', time: 10,
          blocks: [
            { t: 'p', x: '`while` 是「先判断再执行」，可能一次都不执行；`do-while` 是「先执行再判断」，至少执行一次。后者适合「先读一次输入，再看要不要继续」这类场景。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int n = 12345, digits = 0, sum = 0;\n    int t = n;\n    while (t > 0) {          /* 逐位拆解的固定套路 */\n        sum += t % 10;       /* 取最后一位 */\n        t /= 10;             /* 砍掉最后一位 */\n        digits++;\n    }\n    printf("%d 有 %d 位，各位和 %d\\n", n, digits, sum);\n    return 0;\n}', out: '12345 有 5 位，各位和 15' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int i = 0;\n    do {\n        i += 3;\n    } while (i < 10);\n    printf("do-while 结束 i=%d\\n", i);\n\n    /* 对比：while 版本，条件一开始就不成立时一次都不执行 */\n    int j = 100;\n    while (j < 10) j++;\n    printf("while 结束 j=%d\\n", j);\n    return 0;\n}', out: 'do-while 结束 i=12\nwhile 结束 j=100' },
            { t: 'warn', x: '`while` 循环里**必须让条件有机会变假**。忘了 `i++` 会死循环，程序卡住但 CPU 占满——这种 bug 在评测系统里表现为「超时」。' },
            { t: 'tip', x: '读输入到文件尾的标准写法是 `while (scanf("%d", &x) == 1) { ... }`。`scanf` 返回成功读入的个数，读到 EOF 返回 -1，循环自然结束。' }
          ]
        },
        {
          id: 'c3l4', title: 'for 循环的四种变体', key: 'for · 步长 · 累加', time: 10,
          blocks: [
            { t: 'p', x: '`for (初始化; 条件; 步进)` 把循环的三要素写在一行，适合**次数已知**的场景。三部分都可以省略，也可以写多个表达式（用逗号分隔）。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 0; i < 5; i++) printf("%d ", i);\n    printf("\\n");\n\n    for (int i = 10; i > 0; i -= 3) printf("%d ", i);   /* 倒着走、步长 3 */\n    printf("\\n");\n\n    int s = 0;\n    for (int i = 1; i <= 100; i++) s += i;              /* 累加 */\n    printf("1..100 = %d\\n", s);\n    return 0;\n}', out: '0 1 2 3 4\n10 7 4 1\n1..100 = 5050' },
            { t: 'h', x: '多变量与提前结束' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    /* 双指针从两端往中间走 */\n    int a[6] = {1, 2, 3, 4, 5, 6};\n    for (int i = 0, j = 5; i < j; i++, j--) {\n        int t = a[i]; a[i] = a[j]; a[j] = t;\n    }\n    for (int i = 0; i < 6; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}', out: '6 5 4 3 2 1' },
            { t: 'note', x: 'C99 起允许 `for (int i = 0; ...)` 在循环内声明变量，作用域只在这个循环里。老代码里常见 `int i;` 提到外面声明，是为了兼容 C89。' },
            { t: 'warn', x: '`for (int i = 0; i <= 5; i++)` 遍历长度 5 的数组会越界一次。**遍历数组统一用 `i < n`**，把 `n = sizeof(a)/sizeof(a[0])` 单独算出来。' }
          ]
        },
        {
          id: 'c3l5', title: 'break、continue 与提前退出', key: '跳出 · 跳过', time: 10,
          blocks: [
            { t: 'p', x: '`break` 立刻结束**当前这一层**循环；`continue` 跳过本次剩余部分，直接进入下一轮。两者都只管最近的一层循环——嵌套时容易搞错。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 2; i < 20; i++) {\n        int is_prime = 1;\n        for (int d = 2; d * d <= i; d++) {\n            if (i % d == 0) { is_prime = 0; break; }   /* 只跳出内层 */\n        }\n        if (!is_prime) continue;                       /* 跳过本轮打印 */\n        printf("%d ", i);\n    }\n    printf("\\n");\n    return 0;\n}', out: '2 3 5 7 11 13 17 19' },
            { t: 'h', x: '如何从两层循环一起退出' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int target = 7;\n    int a[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};\n    int fi = -1, fj = -1;\n\n    for (int i = 0; i < 3 && fi < 0; i++) {     /* 办法一：把条件写进外层 */\n        for (int j = 0; j < 3; j++) {\n            if (a[i][j] == target) { fi = i; fj = j; break; }\n        }\n    }\n    printf("找到 %d 在 (%d,%d)\\n", target, fi, fj);\n    return 0;\n}', out: '找到 7 在 (2,0)' },
            { t: 'note', x: '另一个办法是 `goto done;`，跳到函数末尾的标签。很多人被教导「goto 有害」，但在 C 里用它做**统一的错误清理出口**是被广泛接受的写法（Linux 内核里到处都是）。' },
            { t: 'warn', x: '`continue` 在 `while` 里会**跳回条件判断**，在 `for` 里会**先执行步进再判断**。如果在 `continue` 前面改了计数器，行为会不一致，写的时候过一遍脑子。' }
          ]
        },
        {
          id: 'c3l6', title: '嵌套循环与三个经典算法', key: '嵌套 · 累乘 · 辗转相除', time: 12,
          blocks: [
            { t: 'p', x: '嵌套循环的复杂度是外层次数 × 内层次数。两层各 100 次就是 1 万次操作——这个「乘积」概念决定了程序在数据变大后会不会卡死。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i <= 3; i++) {\n        for (int j = 1; j <= 4; j++) printf("%2d ", i * j);\n        printf("\\n");\n    }\n    return 0;\n}', out: ' 1  2  3  4\n 2  4  6  8\n 3  6  9 12' },
            { t: 'h', x: '套路一：辗转相除求最大公约数' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a = 84, b = 36;\n    int x = a, y = b;\n    while (y) {\n        int t = x % y;\n        x = y;\n        y = t;\n    }\n    printf("gcd(%d,%d) = %d\\n", a, b, x);\n    printf("lcm = %d\\n", a / x * b);   /* 先除后乘，避免溢出 */\n    return 0;\n}', out: 'gcd(84,36) = 12\nlcm = 252' },
            { t: 'h', x: '套路二：判断回文数' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int n = 12321, rev = 0, t = n;\n    while (t > 0) {\n        rev = rev * 10 + t % 10;\n        t /= 10;\n    }\n    printf("%d 反转是 %d，回文：%s\\n", n, rev, rev == n ? "是" : "否");\n    return 0;\n}', out: '12321 反转是 12321，回文：是' },
            { t: 'principle', x: '**这三个套路（逐位拆解、辗转相除、反转比较）能解决一大半入门题。** 遇到新题先问：能不能套到其中一个上？' }
          ]
        }
      ]
    },
    {
      id: 'c4', num: 4, title: '数组与字符串', icon: '📚',
      intro: 'C 的数组不带长度信息，字符串没有专门的类型。这两个「缺失」是所有缓冲区溢出的根源，也是 C 必须学指针的伏笔。这一章讲清「连续内存 + 长度自己记」这个模型。',
      goals: ['声明、初始化、遍历一维与二维数组', '理解下标从 0 开始且不做越界检查', '说清字符串结尾的 \\0 是什么', '会用 strlen / strcpy / strcmp 与冒泡排序'],
      lessons: [
        {
          id: 'c4l1', title: '一维数组：一段连续的内存', key: '数组 · 越界', time: 12,
          blocks: [
            { t: 'p', x: '`int a[5]` 在内存里就是**连续的 5 个 int**，共 20 字节。数组名在大多数场合会退化成指向首元素的指针，所以 `a` 和 `&a[0]` 的值一样。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[5] = {80, 92, 66, 100, 71};\n    int sum = 0;\n    for (int i = 0; i < 5; i++) sum += a[i];\n    printf("总分 %d，平均 %.2f\\n", sum, sum / 5.0);\n\n    int b[5] = {1, 2};      /* 只初始化前两个，其余自动为 0 */\n    printf("%d %d %d\\n", b[0], b[2], b[4]);\n    return 0;\n}', out: '总分 409，平均 81.80\n1 0 0' },
            { t: 'warn', x: '**C 不会检查数组越界。** `int a[5]; a[10] = 1;` 照样编译通过，运行时直接踩坏别的变量或崩溃。这类 bug 往往在别处表现出来，最难查。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[5] = {3, 9, 2, 7, 5};\n    /* 求长度：总字节数 / 单个元素字节数，只在数组本体上有效 */\n    int n = sizeof(a) / sizeof(a[0]);\n    printf("n = %d\\n", n);\n\n    int max = a[0], min = a[0];\n    for (int i = 1; i < n; i++) {\n        if (a[i] > max) max = a[i];\n        if (a[i] < min) min = a[i];\n    }\n    printf("max=%d min=%d\\n", max, min);\n    return 0;\n}', out: 'n = 5\nmax=9 min=2' },
            { t: 'note', x: '`sizeof(a) / sizeof(a[0])` 在函数参数里会失效——数组传参会退化成指针，`sizeof` 只剩 8。所以传数组时必须**另外传长度**，这是 C 接口的固定套路。' },
            { t: 'principle', x: '**数组和长度永远成对出现。** 写函数时把 `(int a[], int n)` 当成一个整体，就不会出现「忘了传长度」这种低级错误。' }
          ]
        },
        {
          id: 'c4l2', title: '二维数组与矩阵', key: '二维 · 转置 · 内存布局', time: 12,
          blocks: [
            { t: 'p', x: '`int m[2][3]` 是「2 行 3 列」，内存里仍然是**一条连续的 24 字节**，按行优先排列：m[0][0] m[0][1] m[0][2] m[1][0]... 所谓二维只是下标的换算。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};\n    int sum = 0;\n    for (int i = 0; i < 2; i++)\n        for (int j = 0; j < 3; j++)\n            sum += m[i][j];\n    printf("sum=%d\\n", sum);\n    printf("整体 %zu 字节，一行 %zu 字节\\n", sizeof(m), sizeof(m[0]));\n    return 0;\n}', out: 'sum=21\n整体 24 字节，一行 12 字节' },
            { t: 'h', x: '转置：行列互换' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};\n    int t[3][2];\n    for (int i = 0; i < 2; i++)\n        for (int j = 0; j < 3; j++)\n            t[j][i] = m[i][j];\n\n    for (int i = 0; i < 3; i++) {\n        for (int j = 0; j < 2; j++) printf("%d ", t[i][j]);\n        printf("\\n");\n    }\n    return 0;\n}', out: '1 4\n2 5\n3 6' },
            { t: 'note', x: '二维数组作为函数参数时，**列数必须写死**：`void f(int m[][3], int rows)`。因为编译器要靠列数算 `m[i][j]` 的偏移，行数可以省、列数不行。' },
            { t: 'warn', x: '按行遍历比按列遍历快得多。因为 CPU 缓存按「连续的内存块」加载，跳着访问会让缓存不断失效——数据量大时能差好几倍。' }
          ]
        },
        {
          id: 'c4l3', title: '字符串就是字符数组', key: 'char[] · \\0', time: 10,
          blocks: [
            { t: 'p', x: 'C 没有 String 类型。所谓字符串，就是**以 `\'\\0\'` 结尾的 char 数组**。`"hello"` 实际占 6 个字节：h e l l o \\0。所有字符串函数都靠这个 `\\0` 判断结束。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    char s1[] = "hello";         /* 编译器自动补 \\0，长度 6 */\n    char s2[8] = "hi";           /* 剩余位置填 0 */\n    char s3[] = {\'h\', \'i\'};       /* 没有 \\0！不是字符串 */\n\n    printf("%zu %zu %zu\\n", sizeof(s1), sizeof(s2), sizeof(s3));\n    printf("%s|%s\\n", s1, s2);\n    printf("s3 首字符 %c\\n", s3[0]);\n    return 0;\n}', out: '6 8 2\nhello|hi\ns3 首字符 h' },
            { t: 'warn', x: '用 `printf("%s", s3)` 打印上例的 `s3` 会越界读到垃圾，直到偶然遇到 0 才停——这就是「乱码」的来历。字符串一定要有 `\\0`。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    char buf[32];\n    int k = 0;\n    for (char c = \'a\'; c <= \'e\'; c++) buf[k++] = c;\n    buf[k] = \'\\0\';          /* 手动封口，必做 */\n    printf("%s 长度 %d\\n", buf, k);\n    return 0;\n}', out: 'abcde 长度 5' },
            { t: 'principle', x: '**在 C 里处理字符串，永远先问两个问题：缓冲区多大？有没有 `\\0`？** 想清楚这两个，就不会写出经典的安全漏洞。' }
          ]
        },
        {
          id: 'c4l4', title: 'string.h 的正确用法', key: 'strlen · strcpy · strcmp', time: 12,
          blocks: [
            { t: 'table', head: ['函数', '作用', '注意'], rows: [
              ['strlen(s)', '长度，不含 `\\0`', '每次都要从头数，循环里别反复调'],
              ['strcpy(d, s)', '复制', 'd 必须够大，否则溢出；安全版是 `strncpy`'],
              ['strcmp(a, b)', '比较，返回 0 表示相等', '别用 `==` 比较字符串！那比的是地址'],
              ['strcat(d, s)', '拼接', '同样要求 d 空间足够'],
              ['strchr(s, c)', '找字符，返回指针或 NULL', '配合指针可以继续找下一个']
            ] },
            { t: 'code', x: '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char a[16] = "abc";\n    char b[16] = "abd";\n\n    printf("len=%zu\\n", strlen(a));\n    printf("cmp=%d\\n", strcmp(a, b) < 0 ? -1 : (strcmp(a, b) > 0 ? 1 : 0));\n    printf("eq=%d\\n", strcmp(a, a));\n\n    strcat(a, "def");\n    printf("%s\\n", a);\n    return 0;\n}', out: 'len=3\ncmp=-1\neq=0\nabcdef' },
            { t: 'warn', x: '`strcmp` 的返回值**不保证是 -1 或 1**，标准只说「负数 / 0 / 正数」。写成 `if (strcmp(a,b) == -1)` 在别的平台上可能不成立，要写 `< 0`。' },
            { t: 'h', x: '自己实现 strlen：理解它到底在干什么' },
            { t: 'code', x: '#include <stdio.h>\n\nint my_len(const char *s) {\n    int n = 0;\n    while (s[n] != \'\\0\') n++;\n    return n;\n}\n\nint main(void) {\n    printf("%d\\n", my_len(""));\n    printf("%d\\n", my_len("hello"));\n    printf("%d\\n", my_len("中文字符串"));\n    return 0;\n}', out: '0\n5\n15' },
            { t: 'note', x: '「中文字符串」在 UTF-8 里每个汉字占 3 字节，5 个字就是 15 字节。**strlen 数的是字节数，不是字符数**。要数汉字得用宽字符或专门的库。' },
            { t: 'tip', x: '复制字符串更安全的做法：`snprintf(dst, sizeof(dst), "%s", src)`。它保证不越界，也总能以 `\\0` 结尾，`strncpy` 在截断时反而不补 `\\0`。' }
          ]
        },
        {
          id: 'c4l5', title: '冒泡排序与二分查找', key: '排序 · 查找 · 复杂度', time: 14,
          blocks: [
            { t: 'p', x: '排序和查找是「数组」这一章必须手写一遍的两个算法。不是为了以后用它（标准库 `qsort` 更快），而是为了理解**循环怎么配合下标**。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[6] = {5, 2, 9, 1, 7, 3};\n    int n = 6;\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (a[j] > a[j + 1]) {\n                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;\n            }\n        }\n    }\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}', out: '1 2 3 5 7 9' },
            { t: 'p', x: '冒泡的思想是「相邻两两比较，大的往后挤」。每趟走完，最大的那个一定被挤到末尾，所以内层循环可以少走一遍（`n - 1 - i`）。总共约 n²/2 次比较。' },
            { t: 'h', x: '二分查找：有序数组上的 O(log n)' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[6] = {1, 2, 3, 5, 7, 9};\n    int key = 7, lo = 0, hi = 5, pos = -1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (a[mid] == key) { pos = mid; break; }\n        if (a[mid] < key) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    printf("7 在下标 %d\\n", pos);\n    printf("比较次数最多 %d 次（6 个数）\\n", 3);\n    return 0;\n}', out: '7 在下标 4\n比较次数最多 3 次（6 个数）' },
            { t: 'warn', x: '二分查找**必须是有序数组**，否则结果随机错。另外 `mid = (lo + hi) / 2` 在 lo + hi 超过 int 范围时会溢出，大数组要写 `lo + (hi - lo) / 2`。' },
            { t: 'table', head: ['算法', '时间复杂度', '前提'], rows: [
              ['线性查找', 'O(n)', '无需有序'],
              ['二分查找', 'O(log n)', '必须已排序'],
              ['冒泡排序', 'O(n²)', '无'],
              ['qsort（标准库）', '平均 O(n log n)', '需要提供比较函数']
            ] }
          ]
        }
      ]
    },
    {
      id: 'c5', num: 5, title: '函数与程序结构', icon: '🧩',
      intro: '函数是把一段逻辑打包、起名字、反复调用。C 的函数还有两个必须搞清楚的点：**只有值传递**、**先声明后使用**。把这两点吃透，多文件工程也就顺了。',
      goals: ['写声明、定义、调用并区分它们', '解释 C 只有值传递以及如何「改到外面」', '写递归并说清终止条件', '用 static 控制生命周期与可见性', '把代码拆成 .h + .c 多文件'],
      lessons: [
        {
          id: 'c5l1', title: '定义、声明与返回值', key: '函数 · 原型 · return', time: 12,
          blocks: [
            { t: 'p', x: '一个函数由**返回类型、函数名、参数列表、函数体**组成。声明（原型）只说「有这么个函数，长这样」；定义才给出具体实现。有了声明，编译器就敢让你在定义之前调用它。' },
            { t: 'code', x: '#include <stdio.h>\n\nint add(int a, int b);          /* 声明，分号结尾 */\nint max3(int a, int b, int c);\n\nint add(int a, int b) {         /* 定义，没有分号 */\n    return a + b;\n}\n\nint max3(int a, int b, int c) {\n    int m = a > b ? a : b;\n    return m > c ? m : c;\n}\n\nint main(void) {\n    printf("%d\\n", add(3, 4));\n    printf("%d\\n", max3(5, 9, 2));\n    return 0;\n}', out: '7\n9' },
            { t: 'h', x: 'void 与提前返回' },
            { t: 'code', x: '#include <stdio.h>\n\n/* void 表示不返回值，常用于「打印」「修改传进来的东西」 */\nvoid print_line(int n, char c) {\n    for (int i = 0; i < n; i++) putchar(c);\n    putchar(\'\\n\');\n}\n\n/* 双 return：一处成功出口、一处失败出口，比多层 if 嵌套清楚 */\nint safe_div(int a, int b, int *out) {\n    if (b == 0) return 0;\n    *out = a / b;\n    return 1;\n}\n\nint main(void) {\n    print_line(12, \'-\');\n    int r = 0;\n    if (safe_div(10, 2, &r)) printf("10/2 = %d\\n", r);\n    if (!safe_div(10, 0, &r)) printf("除数为 0，已拒绝\\n");\n    return 0;\n}', out: '------------\n10/2 = 5\n除数为 0，已拒绝' },
            { t: 'note', x: '`putchar` 和 `printf` 都在 `stdio.h` 里。`putchar(c)` 输出单个字符，比 `printf("%c", c)` 快——在大量输出时差别明显。' },
            { t: 'warn', x: '**声明了却没定义，链接期才会报错**（`undefined reference`）。而参数类型写错（声明 `int`、定义 `double`）编译器不一定管，运行时栈会错乱。把所有声明集中放进 `.h`，就是为了一次写对。' }
          ]
        },
        {
          id: 'c5l2', title: '只有值传递，所以需要指针', key: '值传递 · 地址传递', time: 12,
          blocks: [
            { t: 'p', x: 'C 的函数**只有值传递**：调用时把实参的值复制一份给形参，函数里改的是副本，改不到外面。想修改外部变量，只能把它的**地址**传进去。' },
            { t: 'code', x: '#include <stdio.h>\n\nvoid swap_wrong(int a, int b) {   /* 改的是副本 */\n    int t = a; a = b; b = t;\n}\n\nvoid swap(int *a, int *b) {       /* 收到的是地址 */\n    int t = *a; *a = *b; *b = t;\n}\n\nvoid add_one(int *p) { (*p)++; }\n\nint main(void) {\n    int x = 1, y = 2;\n    swap_wrong(x, y);\n    printf("%d %d\\n", x, y);\n    swap(&x, &y);\n    printf("%d %d\\n", x, y);\n    add_one(&x);\n    printf("%d\\n", x);\n    return 0;\n}', out: '1 2\n2 1\n3' },
            { t: 'table', head: ['写法', '含义'], rows: [
              ['`void f(int a)`', '按值传，函数内改不到外面'],
              ['`void f(int *a)`', '传地址，函数内 `*a = 1` 能改到外面'],
              ['`void f(int a[], int n)`', '数组退化成指针，等价于 `int *a`'],
              ['`int f(void)`', '不收参数，返回 int']
            ] },
            { t: 'h', x: '为什么数组「看起来」被改了' },
            { t: 'code', x: '#include <stdio.h>\n\nvoid zero(int a[], int n) {\n    for (int i = 0; i < n; i++) a[i] = 0;   /* 改的是原数组 */\n}\n\nint main(void) {\n    int a[4] = {1, 2, 3, 4};\n    zero(a, 4);\n    for (int i = 0; i < 4; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}', out: '0 0 0 0' },
            { t: 'note', x: '数组不是「按引用传」，而是**数组名退化成指针，传的是这个指针的值**。指针指向的还是原数组，所以能改到。本质上仍然是值传递——只是传的值是地址。' },
            { t: 'principle', x: '**要改值，传地址；只看值，传值。** 参数里出现 `*` 或 `[]`，就说明这个函数可能会改你的数据，读代码时先看它有没有副作用。' }
          ]
        },
        {
          id: 'c5l3', title: '递归：自己调用自己', key: '递归 · 终止条件', time: 12,
          blocks: [
            { t: 'p', x: '递归由两部分组成：**终止条件**（什么时候停）和**递推关系**（大问题怎么化小）。少写终止条件就是无限递归，最终栈溢出（Stack Overflow）。' },
            { t: 'code', x: '#include <stdio.h>\n\nlong long fact(int n) {\n    if (n <= 1) return 1;        /* 终止条件 */\n    return n * fact(n - 1);      /* 递推：n! = n * (n-1)! */\n}\n\nint fib(int n) {\n    if (n < 2) return n;\n    return fib(n - 1) + fib(n - 2);\n}\n\nint main(void) {\n    printf("5!  = %lld\\n", fact(5));\n    printf("10! = %lld\\n", fact(10));\n    for (int i = 0; i < 8; i++) printf("%d ", fib(i));\n    printf("\\n");\n    return 0;\n}', out: '5!  = 120\n10! = 3628800\n0 1 1 2 3 5 8 13' },
            { t: 'warn', x: '`fib` 这种朴素递归的时间复杂度是 **O(2ⁿ)**，n=40 就跑不动了。改成「记住算过的值」（记忆化）或直接写循环，是必须知道的优化。' },
            { t: 'h', x: '递归真正好用的地方：树的遍历' },
            { t: 'code', x: '#include <stdio.h>\n\nvoid hanoi(int n, char from, char to, char via) {\n    if (n == 0) return;\n    hanoi(n - 1, from, via, to);\n    printf("%d: %c -> %c\\n", n, from, to);\n    hanoi(n - 1, via, to, from);\n}\n\nint main(void) {\n    hanoi(3, \'A\', \'C\', \'B\');\n    return 0;\n}', out: '1: A -> C\n2: A -> B\n1: C -> B\n3: A -> C\n1: B -> A\n2: B -> C\n1: A -> C' },
            { t: 'note', x: '汉诺塔的递归代码只有 5 行，但要自己用循环写会非常痛苦。**当问题天然可以拆成「同样的子问题」时，递归是最短的表达方式。**' },
            { t: 'tip', x: '调试递归：在函数开头打印 `printf("enter n=%d\\n", n);`，结尾打印 `printf("leave n=%d\\n", n);`，缩进层级就一目了然了。' }
          ]
        },
        {
          id: 'c5l4', title: '作用域、static 与全局变量', key: '作用域 · 生命周期', time: 12,
          blocks: [
            { t: 'p', x: '**作用域**决定「这个名字在哪能看到」，**生命周期**决定「这块内存活多久」。两者常被混淆：局部变量作用域小、生命周期短；`static` 局部变量作用域仍然小，但生命周期拉到整个程序。' },
            { t: 'code', x: '#include <stdio.h>\n\nint counter(void) {\n    static int n = 0;   /* 只初始化一次，函数返回后值仍然保留 */\n    return ++n;\n}\n\nint g = 10;             /* 全局变量：本文件内处处可见 */\n\nint main(void) {\n    printf("%d ", counter());\n    printf("%d ", counter());\n    printf("%d\\n", counter());\n\n    printf("g=%d\\n", g);\n    {\n        int g = 20;     /* 局部变量遮蔽同名全局 */\n        printf("内层 g=%d\\n", g);\n    }\n    printf("外层 g=%d\\n", g);\n    return 0;\n}', out: '1 2 3\ng=10\n内层 g=20\n外层 g=10' },
            { t: 'table', head: ['写法', '作用域', '生命周期', '典型用途'], rows: [
              ['局部变量', '所在 `{}` 内', '函数返回即销毁', '临时计算'],
              ['`static` 局部', '所在 `{}` 内', '整个程序运行期', '计数器、缓存、单次初始化'],
              ['全局变量', '本文件（加 `extern` 可跨文件）', '整个程序运行期', '配置、共享状态'],
              ['`static` 全局 / 函数', '仅本文件', '整个程序运行期', '隐藏内部实现']
            ] },
            { t: 'warn', x: '**全局变量能让代码变简单，也能让 bug 变得无解。** 任何函数都能改它，出了问题时你无法从调用点推断值从哪来。除了常量配置，尽量用参数和返回值传递数据。' },
            { t: 'code', x: '#include <stdio.h>\n\nstatic int helper(int x) { return x * 2; }   /* 只在本文可见 */\n\nint main(void) {\n    printf("%d\\n", helper(21));\n    return 0;\n}', out: '42' },
            { t: 'note', x: '`static` 加在函数前表示「内部链接」，其他 `.c` 文件链接不到它。这是 C 里实现「私有函数」的唯一办法，写库时非常常用。' }
          ]
        },
        {
          id: 'c5l5', title: '多文件工程：拆分 .h 与 .c', key: '头文件 · 分文件编译', time: 14,
          blocks: [
            { t: 'p', x: '真实项目不会把所有代码塞进一个文件。标准做法是：**声明放 `.h`，实现放 `.c`**，谁要用就 `#include` 那个头文件。这样编译器知道函数长什么样，链接器负责把实现拼起来。' },
            { t: 'code', run: false, label: 'utils.h', x: '#ifndef UTILS_H          /* 头文件保护：防止被重复 include */\n#define UTILS_H\n\nint add(int a, int b);    /* 只有声明，没有函数体 */\nint max3(int a, int b, int c);\n\n#endif' },
            { t: 'code', run: false, label: 'utils.c', x: '#include "utils.h"       /* 引号：先在本目录找 */\n\nint add(int a, int b) { return a + b; }\n\nint max3(int a, int b, int c) {\n    int m = a > b ? a : b;\n    return m > c ? m : c;\n}' },
            { t: 'code', run: false, label: 'main.c', x: '#include <stdio.h>\n#include "utils.h"\n\nint main(void) {\n    printf("%d\\n", add(3, 4));\n    printf("%d\\n", max3(5, 9, 2));\n    return 0;\n}' },
            { t: 'code', run: false, label: '终端', x: '> gcc -Wall -c main.c utils.c      # 分别编译成 .o\n> gcc main.o utils.o -o app         # 链接成一个可执行文件\n> ./app\n7\n9', out: '7\n9' },
            { t: 'warn', x: '头文件里**只放声明**，不要放函数实现。被两个 `.c` 同时 include 就会出现「重复定义」链接错误。唯一的例外是 `static inline` 函数和宏。' },
            { t: 'note', x: '`#ifndef / #define / #endif` 叫头文件保护，现在也可以写 `#pragma once`（几乎所有编译器都支持，更短）。忘了写会导致「类型重复定义」的诡异报错。' },
            { t: 'principle', x: '**头文件是「对外承诺」，源文件是「内部实现」。** 改实现不用动头文件，用这个库的人就不需要重新理解接口——这是 C 工程能长期维护的根本原因。' }
          ]
        }
      ]
    },
    {
      id: 'c6', num: 6, title: '指针', icon: '🎯',
      intro: '指针是 C 的分水岭，其实它只有一个意思：**存地址的变量**。把「每个变量都有地址」和「* 是去那个地址取东西」这两句记住，剩下的全是组合。这一章从零讲到函数指针。',
      goals: ['读懂 & 与 *，画出指针指向关系', '用指针遍历数组并解释指针算术', '用指针参数让函数返回多个结果', '写函数指针与回调', '避开野指针、悬垂指针'],
      lessons: [
        {
          id: 'c6l1', title: '指针就是存地址的变量', key: '& · * · 解引用', time: 14,
          blocks: [
            { t: 'p', x: '内存像一排带编号的柜子，每个柜子有地址。普通变量存的是**数据**，指针变量存的是**某个柜子的编号**。`&a` 取地址，`*p` 顺着地址取出里面的东西。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a = 42;\n    int *p = &a;        /* p 里存的是 a 的地址 */\n\n    printf("a 的值    %d\\n", a);\n    printf("*p       %d\\n", *p);        /* 顺着地址取值 */\n    *p = 100;                            /* 顺着地址写值 */\n    printf("a 现在    %d\\n", a);\n    printf("p 指向 a：%d\\n", p == &a);\n    return 0;\n}', out: 'a 的值    42\n*p       42\na 现在    100\np 指向 a：1' },
            { t: 'table', head: ['写法', '读法', '结果'], rows: [
              ['`int a = 42;`', 'a 里存 42', '—'],
              ['`&a`', 'a 的地址', '一个地址值'],
              ['`int *p = &a;`', 'p 指向 a', 'p 的值就是 &a'],
              ['`*p`', 'p 指向的那个 int', '42'],
              ['`*p = 7;`', '改 p 指向的那个 int', 'a 变成 7'],
              ['`&p`', 'p 自己的地址', '又一个地址（二级指针）']
            ] },
            { t: 'h', x: '指针类型为什么重要' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[3] = {10, 20, 30};\n    int *pi = a;\n    char *pc = (char *)a;\n\n    printf("pi+1 偏移 %d 字节\\n", (int)((char *)(pi + 1) - (char *)pi));\n    printf("pc+1 偏移 %d 字节\\n", (int)((pc + 1) - pc));\n    printf("*(pi+2) = %d\\n", *(pi + 2));\n    return 0;\n}', out: 'pi+1 偏移 4 字节\npc+1 偏移 1 字节\n*(pi+2) = 30' },
            { t: 'p', x: '`int *` 加 1 前进 4 字节，`char *` 加 1 前进 1 字节。**指针的「1」是一个元素，不是一个字节**——由类型决定。这就是指针必须带类型的原因。' },
            { t: 'warn', x: '声明 `int *p, q;` 里只有 `p` 是指针，`q` 是普通 `int`。星号跟着变量走，多个指针要写 `int *p, *q;`。这个坑无数人踩过。' },
            { t: 'principle', x: '**把指针理解成「门牌号」，不要理解成「箭头」。** 门牌号可以复制、可以算、可以传给别人，但它指向的房子只有一栋。' }
          ]
        },
        {
          id: 'c6l2', title: '指针与数组的等价关系', key: '退化成指针 · 指针算术', time: 12,
          blocks: [
            { t: 'p', x: '数组名在表达式中会退化成「首元素地址」，所以 `a[i]`、`*(a+i)`、`*(p+i)`、`p[i]` 完全等价。理解这一点，看库函数签名就不慌了。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[5] = {10, 20, 30, 40, 50};\n    int *p = a;\n\n    printf("%d %d\\n", *p, *(p + 2));\n    printf("%d %d\\n", p[1], a[1]);\n\n    p++;                                  /* 前进一个元素 */\n    printf("%d\\n", *p);\n    printf("偏移 %d 字节\\n", (int)((char *)p - (char *)a));\n    return 0;\n}', out: '10 30\n20 20\n20\n偏移 4 字节' },
            { t: 'h', x: '用指针遍历的两种写法' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[5] = {1, 2, 3, 4, 5};\n    int sum = 0;\n\n    for (int i = 0; i < 5; i++) sum += a[i];      /* 下标法：清楚 */\n    printf("下标 sum=%d\\n", sum);\n\n    sum = 0;\n    for (int *p = a; p < a + 5; p++) sum += *p;   /* 指针法：C 惯用 */\n    printf("指针 sum=%d\\n", sum);\n    return 0;\n}', out: '下标 sum=15\n指针 sum=15' },
            { t: 'note', x: '两种写法编译后几乎一样快。**下标法可读性更好，指针法在写库和嵌入式时更常见。** 初学阶段优先用下标，别为了「显得懂 C」而难为自己。' },
            { t: 'warn', x: '`a + 5` 是「末尾再往后一个」的位置，可以拿来比较，但**不能解引用**。C 标准允许指针指向数组末尾的下一个位置，就是为了让 `p < a + n` 这种循环条件合法。' }
          ]
        },
        {
          id: 'c6l3', title: '用指针让函数返回多个结果', key: '输出参数 · 二级指针', time: 12,
          blocks: [
            { t: 'p', x: 'C 函数只能 `return` 一个值。想返回两个以上结果，标准做法是**让调用方准备好变量，把地址传进去**——这叫「输出参数」。' },
            { t: 'code', x: '#include <stdio.h>\n\nvoid minmax(int a[], int n, int *mn, int *mx) {\n    *mn = *mx = a[0];\n    for (int i = 1; i < n; i++) {\n        if (a[i] < *mn) *mn = a[i];\n        if (a[i] > *mx) *mx = a[i];\n    }\n}\n\nint main(void) {\n    int a[5] = {7, 3, 9, 1, 5};\n    int lo = 0, hi = 0;\n    minmax(a, 5, &lo, &hi);\n    printf("min=%d max=%d\\n", lo, hi);\n    return 0;\n}', out: 'min=1 max=9' },
            { t: 'h', x: '返回值表示「成功 / 失败」，结果走输出参数' },
            { t: 'code', x: '#include <stdio.h>\n\nint divide(int a, int b, int *q, int *r) {\n    if (b == 0) return 0;          /* 失败：返回 0，不写输出参数 */\n    *q = a / b;\n    *r = a % b;\n    return 1;                      /* 成功 */\n}\n\nint main(void) {\n    int q = 0, r = 0;\n    if (divide(17, 5, &q, &r)) printf("17 = 5 * %d + %d\\n", q, r);\n    printf("失败的返回：%d\\n", divide(17, 0, &q, &r));\n    return 0;\n}', out: '17 = 5 * 3 + 2\n失败的返回：0' },
            { t: 'table', head: ['场景', '推荐做法'], rows: [
              ['一个结果', '直接 `return`'],
              ['两个以上结果', '输出参数（传地址）'],
              ['结果可能失败', '返回值用 0/1 表示成败，结果走输出参数'],
              ['要改指针本身', '二级指针 `int **p`']
            ] },
            { t: 'warn', x: '**绝对不要返回局部变量的地址。** 函数一返回，栈上的局部变量就失效了，那个地址指向的是随时会被覆盖的垃圾。要返回新内存，用 `malloc`（下一章讲）。' },
            { t: 'note', x: '输出参数的名字建议加前缀 `out_`，调用点一眼能看出哪个参数会被改：`divide(17, 5, &out_q, &out_r)`。' }
          ]
        },
        {
          id: 'c6l4', title: '字符指针与 const', key: '字符串字面量 · 只读', time: 12,
          blocks: [
            { t: 'p', x: '`char *s = "hello";` 里的 `"hello"` 存在**只读的常量区**，`s` 只是指向它的指针。试图 `s[0] = \'H\'` 会直接崩溃（段错误）。要能改，就得用 `char s[] = "hello";`——那是复制到栈上的数组。' },
            { t: 'code', x: '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char arr[] = "hello";     /* 数组：可改 */\n    arr[0] = \'H\';\n    printf("%s\\n", arr);\n\n    const char *p = "hello";  /* 指针：只读，加 const 让编译器帮你把关 */\n    printf("len=%zu 首字符=%c\\n", strlen(p), *p);\n    return 0;\n}', out: 'Hello\nlen=5 首字符=h' },
            { t: 'h', x: '用指针走一遍字符串' },
            { t: 'code', x: '#include <stdio.h>\n\nint count_char(const char *s, char c) {\n    int n = 0;\n    for (; *s; s++) {          /* *s 为 \'\\0\' 时循环结束 */\n        if (*s == c) n++;\n    }\n    return n;\n}\n\nint main(void) {\n    const char *text = "banana";\n    printf("a 出现 %d 次\\n", count_char(text, \'a\'));\n    printf("n 出现 %d 次\\n", count_char(text, \'n\'));\n    return 0;\n}', out: 'a 出现 3 次\nn 出现 2 次' },
            { t: 'table', head: ['写法', '能改内容吗', '存在哪'], rows: [
              ['`char s[] = "hi";`', '能', '栈上的数组，内容是一份拷贝'],
              ['`char *s = "hi";`', '不能（UB）', '只读常量区'],
              ['`const char *s = "hi";`', '不能，且编译器会拦', '只读常量区，推荐写法'],
              ['`char * const s = buf;`', '能改内容，不能改指向', '指针本身只读']
            ] },
            { t: 'warn', x: '`const char *s` 的意思是「**通过 s 不能改指向的内容**」，不是「s 指向的东西一定不可变」。反过来 `char * const s` 表示「s 这个指针本身不能改指向」。两个 `const` 位置不同，含义相反。' }
          ]
        },
        {
          id: 'c6l5', title: '函数指针与回调', key: '回调 · 函数表', time: 14,
          blocks: [
            { t: 'p', x: '函数在内存里也有地址，可以存进指针、传给别的函数。当你能把「一段逻辑」当参数传进去，代码的复用方式就上了一个台阶——标准库的 `qsort` 就是这么做的。' },
            { t: 'code', x: '#include <stdio.h>\n\nint add(int a, int b) { return a + b; }\nint sub(int a, int b) { return a - b; }\nint mul(int a, int b) { return a * b; }\n\nint apply(int (*op)(int, int), int a, int b) {\n    return op(a, b);        /* 通过指针调用 */\n}\n\nint main(void) {\n    printf("%d\\n", apply(add, 6, 3));\n    printf("%d\\n", apply(sub, 6, 3));\n    printf("%d\\n", apply(mul, 6, 3));\n\n    int (*ops[3])(int, int) = {add, sub, mul};   /* 函数指针数组 = 函数表 */\n    for (int i = 0; i < 3; i++) printf("%d ", ops[i](5, 2));\n    printf("\\n");\n    return 0;\n}', out: '9\n3\n18\n7 3 10' },
            { t: 'p', x: '`int (*op)(int, int)` 读法：从 `op` 开始，先看左边有 `*` → op 是指针；再看右边 `(int, int)` → 指向带两个 int 参数的函数；最后看最左 `int` → 那个函数返回 int。' },
            { t: 'h', x: '回调的真实用途：让排序知道怎么比' },
            { t: 'code', x: '#include <stdio.h>\n#include <stdlib.h>\n\nint by_asc(const void *a, const void *b) {\n    return *(const int *)a - *(const int *)b;\n}\n\nint by_desc(const void *a, const void *b) {\n    return *(const int *)b - *(const int *)a;\n}\n\nint main(void) {\n    int a[5] = {3, 1, 4, 1, 5};\n    qsort(a, 5, sizeof(int), by_asc);\n    for (int i = 0; i < 5; i++) printf("%d ", a[i]);\n    printf("\\n");\n\n    qsort(a, 5, sizeof(int), by_desc);\n    for (int i = 0; i < 5; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}', out: '1 1 3 4 5\n5 4 3 1 1' },
            { t: 'note', x: '`qsort` 用 `void *` 接收任意类型，所以比较函数要先转回具体类型再取值。`void *` 是「无类型指针」，可以接任何指针，但不能直接解引用。' },
            { t: 'warn', x: '比较函数**必须返回负数 / 0 / 正数**表示大小关系，直接写 `return a > b;` 会返回 1 或 0，永远排不出正确顺序。' },
            { t: 'principle', x: '**把「做什么」和「怎么比 / 怎么处理」分开，是函数指针最大的价值。** 排序算法只关心比较结果，具体规则由调用方决定。' }
          ]
        },
        {
          id: 'c6l6', title: '指针的六个坑', key: '野指针 · 悬垂 · 越界', time: 14,
          blocks: [
            { t: 'p', x: '指针本身不难，难的是「它指向的东西还有效吗」。下面六种错误覆盖了 C 里九成的崩溃和诡异 bug，每一条都值得单独记住。' },
            { t: 'table', head: ['错误', '现象', '怎么防'], rows: [
              ['野指针（未初始化）', '随机崩溃，位置不固定', '声明时就 `= NULL`'],
              ['空指针解引用', '立即段错误', '用前判 `if (p)`'],
              ['悬垂指针（释放后仍用）', '数据错乱或崩溃', '`free` 后立刻 `p = NULL`'],
              ['数组越界', '踩坏别的变量，延迟暴露', '循环条件永远 `i < n`'],
              ['返回局部变量地址', '调用后拿到垃圾值', '用 `malloc` 或让调用方传缓冲区'],
              ['指针类型不匹配', '读到的值不对', '强制转换前想清楚布局']
            ] },
            { t: 'code', x: '#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int *p = NULL;\n    if (p) printf("%d\\n", *p);          /* 先判断再解引用 */\n    else   printf("p 是空的，跳过\\n");\n\n    int *m = malloc(sizeof(int));\n    if (!m) return 1;                    /* malloc 可能失败 */\n    *m = 7;\n    printf("m = %d\\n", *m);\n    free(m);\n    m = NULL;                            /* 释放后立刻置空 */\n    printf("已释放并置空\\n");\n    return 0;\n}', out: 'p 是空的，跳过\nm = 7\n已释放并置空' },
            { t: 'warn', x: '**`free(p)` 之后指针的值不会自动变成 NULL**，它仍然指向那块已经归还的内存。之后再用就是悬垂指针，行为完全不可预测——这类 bug 可能在几万行之外才爆发。' },
            { t: 'h', x: '一个真实会遇到的错误' },
            { t: 'code', run: false, label: '错误示例（别这样写）', x: 'int *make_bad(void) {\n    int x = 42;\n    return &x;          /* 函数返回后 x 已失效 */\n}\n\n/* 调用方拿到的是一个指向「已经不属于你」的栈地址。\n   gcc 会警告：warning: function returns address of local variable\n   实际行为完全不可预测：可能读到垃圾，也可能被优化成 NULL。 */' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[3] = {1, 2, 3};\n    int i = 0;\n    while (i < 3) { printf("%d ", a[i]); i++; }   /* 边界靠 i < 3 守住 */\n    printf("\\n");\n    printf("元素个数 %zu\\n", sizeof(a) / sizeof(a[0]));\n    return 0;\n}', out: '1 2 3\n元素个数 3' },
            { t: 'note', x: '上面的错误函数**返回的指针永远非空**，所以调用方判空根本防不住它——问题不是空，而是指向了无效内存。正确做法是让调用方传缓冲区进来，或 `malloc` 一块堆内存返回。' },
            { t: 'principle', x: '**每个指针在写出它的下一秒，都要能回答：它指向的东西现在还有效吗？** 答不上来，就先别往下写。' }
          ]
        }
      ]
    },
    {
      id: 'c7', num: 7, title: '结构体、内存与链表', icon: '🧱',
      intro: '结构体让 C 能描述「一个学生」「一个订单」这种复合数据；malloc 让数据能活过函数调用；链表把两者串起来。这一章学完，你就能写真正有用的程序了。',
      goals: ['定义并使用结构体、结构体指针', '说清内存对齐与 sizeof 的关系', '区分栈与堆，正确 malloc/free', '手写一条单链表的增删与遍历'],
      lessons: [
        {
          id: 'c7l1', title: '结构体：把数据打包', key: 'struct · 成员访问', time: 12,
          blocks: [
            { t: 'p', x: '结构体把几个不同类型的变量捆成一个整体。它让你能用一个名字表示「一个学生」，而不是散落的 `name` / `age` / `score` 三个变量。' },
            { t: 'code', x: '#include <stdio.h>\n#include <string.h>\n\nstruct Student {\n    char   name[16];\n    int    age;\n    double score;\n};\n\nint main(void) {\n    struct Student s1 = {"小明", 19, 92.5};\n    struct Student s2;\n    strcpy(s2.name, "小红");      /* 字符数组不能直接赋值 */\n    s2.age = 20;\n    s2.score = 88.0;\n\n    printf("%s %d %.1f\\n", s1.name, s1.age, s1.score);\n    printf("%s %d %.1f\\n", s2.name, s2.age, s2.score);\n    printf("sizeof = %zu\\n", sizeof(struct Student));\n    return 0;\n}', out: '小明 19 92.5\n小红 20 88.0\nsizeof = 32' },
            { t: 'note', x: '成员相加是 16 + 4 + 8 = 28 字节，但 `sizeof` 是 32。差出来的 4 字节是**内存对齐**填充：`double` 必须放在 8 的倍数偏移上，编译器自动补空。' },
            { t: 'h', x: '结构体数组与「对象」思维' },
            { t: 'code', x: '#include <stdio.h>\n\nstruct Student { char name[16]; int score; };\n\nint main(void) {\n    struct Student cls[3] = {\n        {"小明", 92}, {"小红", 88}, {"阿伟", 76}\n    };\n    int n = sizeof(cls) / sizeof(cls[0]);\n\n    int total = 0, best = 0;\n    for (int i = 0; i < n; i++) {\n        total += cls[i].score;\n        if (cls[i].score > cls[best].score) best = i;\n    }\n    printf("平均 %d\\n", total / n);\n    printf("最高 %s %d\\n", cls[best].name, cls[best].score);\n    return 0;\n}', out: '平均 85\n最高 小明 92' },
            { t: 'warn', x: '**结构体不能用 `==` 比较**。`s1 == s2` 直接编译报错。要比较就逐个成员比，或者用 `memcmp(&s1, &s2, sizeof s1)`——但后者会被对齐填充的垃圾字节影响，不推荐。' },
            { t: 'principle', x: '**结构体 = 数据的形状。** 定义结构体之前先问：这个「东西」由哪几个字段组成？想清楚这一点，后面的函数接口就自然出来了。' }
          ]
        },
        {
          id: 'c7l2', title: '结构体指针与 -> 运算符', key: '-> · 整体拷贝', time: 12,
          blocks: [
            { t: 'p', x: '传结构体给函数时，会**整体复制一份**。结构体一大，复制的开销就不可忽视，而且函数改不到外面的原值。所以标准做法是传指针：`void f(struct Point *p)`，用 `p->x` 访问成员。' },
            { t: 'code', x: '#include <stdio.h>\n\nstruct Point { int x, y; };\n\nvoid move(struct Point *p, int dx, int dy) {\n    p->x += dx;          /* p->x 就是 (*p).x 的简写 */\n    p->y += dy;\n}\n\nint main(void) {\n    struct Point a = {1, 2};\n    move(&a, 3, 4);\n    printf("(%d,%d)\\n", a.x, a.y);\n\n    struct Point b = a;   /* 结构体赋值 = 逐字节拷贝一份 */\n    b.x = 100;\n    printf("a=(%d,%d) b=(%d,%d)\\n", a.x, a.y, b.x, b.y);\n    return 0;\n}', out: '(4,6)\na=(4,6) b=(100,6)' },
            { t: 'table', head: ['写法', '含义'], rows: [
              ['`p->x`', '指针访问成员，等价 `(*p).x`'],
              ['`(*p).x`', '先解引用再取成员，括号不能省'],
              ['`*p.x`', '错误！`.` 优先级高于 `*`，等价 `*(p.x)`'],
              ['`s.x`', '结构体变量（非指针）访问成员']
            ] },
            { t: 'code', x: '#include <stdio.h>\n\nstruct Point { int x, y; };\n\n/* 只读用 const，避免误改，也允许传字面量 */\nint manhattan(const struct Point *p) {\n    int ax = p->x < 0 ? -p->x : p->x;\n    int ay = p->y < 0 ? -p->y : p->y;\n    return ax + ay;\n}\n\nint main(void) {\n    struct Point a = {-3, 4};\n    printf("曼哈顿距离 %d\\n", manhattan(&a));\n    return 0;\n}', out: '曼哈顿距离 7' },
            { t: 'warn', x: '**结构体里有指针成员时，整体赋值是「浅拷贝」。** `struct A b = a;` 只复制指针的值，两个结构体指向同一块内存，其中一个 `free` 之后另一个就成了悬垂指针。这种场景必须自己写深拷贝函数。' }
          ]
        },
        {
          id: 'c7l3', title: 'enum、union 与 typedef', key: '枚举 · 联合 · 别名', time: 12,
          blocks: [
            { t: 'p', x: '`enum` 给整数取名字，让状态码可读；`union` 让几个成员**共用同一块内存**，同一时刻只有一个有效；`typedef` 给类型起别名，省掉反复写 `struct`。' },
            { t: 'code', x: '#include <stdio.h>\n\ntypedef enum { RED, GREEN, BLUE } Color;\ntypedef struct { int x, y; } Point;     /* 有 typedef 就不用每次写 struct */\n\nint main(void) {\n    Color c = GREEN;\n    printf("RED=%d GREEN=%d BLUE=%d\\n", RED, GREEN, BLUE);\n    printf("c = %d\\n", c);\n\n    Point p = {3, 4};\n    printf("p = (%d,%d)\\n", p.x, p.y);\n    return 0;\n}', out: 'RED=0 GREEN=1 BLUE=2\nc = 1\np = (3,4)' },
            { t: 'h', x: 'union：同一块内存的不同解释' },
            { t: 'code', x: '#include <stdio.h>\n\ntypedef union {\n    unsigned int i;\n    unsigned char bytes[4];\n} Bits;\n\nint main(void) {\n    Bits b;\n    b.i = 0x41424344;\n    printf("i = %u\\n", b.i);\n    printf("bytes = %c%c%c%c\\n", b.bytes[0], b.bytes[1], b.bytes[2], b.bytes[3]);\n    printf("union 占 %zu 字节\\n", sizeof(Bits));\n    return 0;\n}', out: 'i = 1094861636\nbytes = DCBA\nunion 占 4 字节' },
            { t: 'p', x: '`0x41424344` 的四个字节是 41 42 43 44（ABCD）。x86 是**小端**，低位字节放在低地址，所以 `bytes[0]` 读到的是 44（\'D\'）。这就是「同一个内存，两种读法」。' },
            { t: 'note', x: '`enum` 默认从 0 开始递增，也可以显式指定：`enum { OK = 0, ERR_IO = -1, ERR_MEM = -2 };`。用它代替裸数字，日志和调试时能直接看出含义。' },
            { t: 'warn', x: '`union` 的大小等于**最大成员**的大小，而不是成员之和。而且「写一个成员、读另一个成员」属于类型双关，标准只保证「重新读回同一个成员」是安全的。' }
          ]
        },
        {
          id: 'c7l4', title: 'malloc、free 与堆内存', key: '堆 · 栈 · 泄漏', time: 14,
          blocks: [
            { t: 'p', x: '栈上的变量随函数结束自动销毁，大小在编译时就得定。要在运行时决定大小、或让数据活得更久，就得向**堆**申请内存：`malloc` 借，`free` 还。' },
            { t: 'table', head: ['区域', '存什么', '谁管', '生命周期'], rows: [
              ['栈', '局部变量、函数参数', '编译器自动', '函数返回即释放'],
              ['堆', '`malloc` / `calloc` / `realloc` 申请', '程序员手动 `free`', '直到 free 为止'],
              ['全局 / 静态区', '全局变量、`static` 变量、字符串字面量', '程序自动', '整个运行期'],
              ['常量区', '`"hello"` 这类字面量', '只读', '整个运行期']
            ] },
            { t: 'code', x: '#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n = 5;\n    int *a = malloc(n * sizeof(int));\n    if (!a) return 1;                    /* 一定判空 */\n\n    for (int i = 0; i < n; i++) a[i] = (i + 1) * (i + 1);\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    printf("\\n");\n\n    a = realloc(a, 10 * sizeof(int));    /* 扩容，可能搬移 */\n    if (!a) return 1;\n    for (int i = 5; i < 10; i++) a[i] = 0;\n    printf("扩到 10 个，a[9]=%d\\n", a[9]);\n\n    free(a);\n    a = NULL;\n    printf("已释放\\n");\n    return 0;\n}', out: '1 4 9 16 25\n扩到 10 个，a[9]=0\n已释放' },
            { t: 'warn', x: '**`realloc` 必须接收返回值**。它可能把内存搬到新位置，用旧指针会立刻失效：`a = realloc(a, ...)` 才是对的，`realloc(a, ...)` 之后继续用 `a` 是经典错误。' },
            { t: 'code', x: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* calloc：申请并清零，适合数组 */\n    int *z = calloc(4, sizeof(int));\n    if (!z) return 1;\n    printf("calloc 全部为 0：%d %d\\n", z[0], z[3]);\n\n    /* strdup 内部就是 malloc + strcpy */\n    char *s = malloc(16);\n    strcpy(s, "hello");\n    printf("%s\\n", s);\n\n    free(z);\n    free(s);\n    printf("两个都释放了\\n");\n    return 0;\n}', out: 'calloc 全部为 0：0 0\nhello\n两个都释放了' },
            { t: 'note', x: '`malloc` 不清零，拿到的内容是随机的；`calloc` 会清零。**内存泄漏**指申请了没还，程序跑得越久占用越大；**重复释放**（double free）会让堆管理器崩溃。两个都是靠纪律避免的。' },
            { t: 'principle', x: '**谁申请，谁释放；申请和释放写在同一屏代码里。** 如果一次 malloc 要在三个函数之外才 free，就该重新设计接口了。' }
          ]
        },
        {
          id: 'c7l5', title: '手写一条单链表', key: '链表 · 增删 · 释放', time: 16,
          blocks: [
            { t: 'p', x: '数组的元素必须连在一起，插入要挪一大片。链表每个节点单独申请，用指针串起来——插入删除是 O(1)，但查找是 O(n)。**结构体 + 指针 + malloc** 三件套的经典组合。' },
            { t: 'code', x: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int val;\n    struct Node *next;      /* 必须用 struct Node *，不能写 Node * */\n} Node;\n\nNode *push_front(Node *head, int v) {\n    Node *n = malloc(sizeof(Node));\n    if (!n) return head;\n    n->val = v;\n    n->next = head;\n    return n;               /* 新节点成为新的头 */\n}\n\nint main(void) {\n    Node *head = NULL;\n    for (int i = 1; i <= 4; i++) head = push_front(head, i);\n\n    for (Node *p = head; p; p = p->next) printf("%d -> ", p->val);\n    printf("NULL\\n");\n\n    while (head) {           /* 释放整条链表 */\n        Node *next = head->next;\n        free(head);\n        head = next;\n    }\n    printf("已释放全部节点\\n");\n    return 0;\n}', out: '4 -> 3 -> 2 -> 1 -> NULL\n已释放全部节点' },
            { t: 'p', x: '注意头插法的效果：依次插入 1 2 3 4，链表反而是 4 3 2 1。想保持顺序，要么改用尾插（维护一个 tail 指针），要么插入后反转。' },
            { t: 'h', x: '按值删除：最容易写错的地方' },
            { t: 'code', x: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node { int val; struct Node *next; } Node;\n\nNode *remove_val(Node *head, int v) {\n    Node dummy;                 /* 哑节点：统一处理「删头」的情况 */\n    dummy.next = head;\n    Node *prev = &dummy;\n    while (prev->next) {\n        if (prev->next->val == v) {\n            Node *kill = prev->next;\n            prev->next = kill->next;\n            free(kill);\n        } else {\n            prev = prev->next;\n        }\n    }\n    return dummy.next;\n}\n\nint main(void) {\n    Node *head = NULL;\n    for (int i = 5; i >= 1; i--) {\n        Node *n = malloc(sizeof(Node));\n        n->val = i; n->next = head; head = n;\n    }\n    head = remove_val(head, 3);\n    for (Node *p = head; p; p = p->next) printf("%d ", p->val);\n    printf("\\n");\n\n    while (head) { Node *n = head->next; free(head); head = n; }\n    return 0;\n}', out: '1 2 4 5' },
            { t: 'note', x: '**哑节点（dummy head）** 是链表题的通用技巧：在真正的头前面加一个假节点，这样「删除第一个元素」和「删除中间元素」就是同一套代码，不用写两遍特判。' },
            { t: 'warn', x: '释放链表时**必须先保存 `next` 再 `free` 当前节点**。顺序写反了，`free` 之后再去读 `head->next` 就是访问已释放内存，程序可能当场崩，也可能悄悄跑完。' },
            { t: 'table', head: ['操作', '数组', '链表'], rows: [
              ['按下标访问', 'O(1)', 'O(n)'],
              ['头部插入', 'O(n)', 'O(1)'],
              ['中间插入 / 删除', 'O(n)', 'O(1)（已知位置）'],
              ['内存连续性', '连续，缓存友好', '分散，缓存不友好']
            ] }
          ]
        }
      ]
    },
    {
      id: 'c8', num: 8, title: '文件与工程化', icon: '📦',
      intro: '程序不能只活在内存里。这一章讲怎么读写文件、怎么用二进制存结构体、怎么用宏把重复代码变短，最后把调试和构建工具过一遍。',
      goals: ['用 fopen / fgets / fprintf 读写文本文件', '用 fseek 随机访问二进制文件', '写带参数的宏并理解括号的必要性', '用 gdb 定位崩溃、用 make 组织构建'],
      lessons: [
        {
          id: 'c8l1', title: '文本文件读写', key: 'fopen · fgets · fprintf', time: 14,
          blocks: [
            { t: 'p', x: '文件操作四步：`fopen` 打开 → 读或写 → `fclose` 关闭。**每次 fopen 都要检查返回值**，文件不存在、没权限都会返回 `NULL`，不检查就会在下一行崩。' },
            { t: 'table', head: ['模式', '含义', '文件不存在时'], rows: [
              ['"r"', '只读', '返回 NULL'],
              ['"w"', '只写，清空原内容', '新建'],
              ['"a"', '追加到末尾', '新建'],
              ['"r+"', '读写，从开头', '返回 NULL'],
              ['"rb" / "wb"', '二进制读写', '同上，Windows 下必须加 b']
            ] },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    const char *path = "demo.txt";\n\n    FILE *fp = fopen(path, "w");\n    if (!fp) { perror("fopen"); return 1; }\n    fprintf(fp, "小明 92\\n小红 88\\n");\n    fclose(fp);\n\n    fp = fopen(path, "r");\n    if (!fp) { perror("fopen"); return 1; }\n    char line[64];\n    int total = 0, count = 0;\n    while (fgets(line, sizeof(line), fp)) {\n        char name[32];\n        int score;\n        if (sscanf(line, "%31s %d", name, &score) == 2) {\n            printf("%s: %d\\n", name, score);\n            total += score;\n            count++;\n        }\n    }\n    fclose(fp);\n    printf("平均 %.1f\\n", (double)total / count);\n    return 0;\n}', out: '小明: 92\n小红: 88\n平均 90.0' },
            { t: 'note', x: '`fgets` 会连换行符一起读进来，读到文件尾返回 `NULL`，所以 `while (fgets(...))` 就能安全遍历整个文件。它**必须给缓冲区大小**，这正是它比 `gets` 安全的地方（`gets` 已被标准删除）。' },
            { t: 'warn', x: '**忘了 `fclose` 会丢数据。** 写入的内容先待在缓冲区里，`fclose` 才真正刷到磁盘。程序异常退出时，没 fclose 的写入可能全部丢失。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    /* tmpfile：匿名临时文件，关闭时自动删除，适合中间数据 */\n    FILE *t = tmpfile();\n    if (!t) return 1;\n    fprintf(t, "临时内容 %d\\n", 42);\n    rewind(t);                       /* 回到开头再读 */\n    char buf[64];\n    if (fgets(buf, sizeof(buf), t)) printf("%s", buf);\n    fclose(t);\n    printf("临时文件已自动清理\\n");\n    return 0;\n}', out: '临时内容 42\n临时文件已自动清理' }
          ]
        },
        {
          id: 'c8l2', title: '二进制文件与随机访问', key: 'fwrite · fseek · ftell', time: 14,
          blocks: [
            { t: 'p', x: '文本文件存的是「人能读的字符」，二进制文件存的是「内存里的原始字节」。存结构体数组用二进制又快又省空间，代价是不能用记事本打开看。' },
            { t: 'code', x: '#include <stdio.h>\n\ntypedef struct { int id; char name[8]; double score; } Rec;\n\nint main(void) {\n    const char *path = "rec.bin";\n\n    FILE *fp = fopen(path, "wb");\n    if (!fp) { perror("fopen"); return 1; }\n    Rec a = {1, "小明", 92.5}, b = {2, "小红", 88.0};\n    fwrite(&a, sizeof(Rec), 1, fp);\n    fwrite(&b, sizeof(Rec), 1, fp);\n    fclose(fp);\n\n    fp = fopen(path, "rb");\n    if (!fp) { perror("fopen"); return 1; }\n    fseek(fp, 0, SEEK_END);\n    long size = ftell(fp);\n    printf("共 %ld 字节，每条约 %zu 字节\\n", size, sizeof(Rec));\n\n    fseek(fp, sizeof(Rec), SEEK_SET);      /* 直接跳到第二条 */\n    Rec r;\n    fread(&r, sizeof(Rec), 1, fp);\n    printf("第二条：%d %s %.1f\\n", r.id, r.name, r.score);\n    fclose(fp);\n    return 0;\n}', out: '共 48 字节，每条约 24 字节\n第二条：2 小红 88.0' },
            { t: 'table', head: ['函数', '作用'], rows: [
              ['`fwrite(ptr, size, n, fp)`', '把 n 个 size 字节的块写出去'],
              ['`fread(ptr, size, n, fp)`', '读回来，返回实际读到的块数'],
              ['`fseek(fp, offset, whence)`', '定位：SEEK_SET / SEEK_CUR / SEEK_END'],
              ['`ftell(fp)`', '当前偏移量，常用于求文件大小'],
              ['`rewind(fp)`', '回到开头，等价 `fseek(fp,0,SEEK_SET)`']
            ] },
            { t: 'warn', x: '**二进制文件不可跨平台直接搬。** 结构体大小受对齐规则影响（32 位和 64 位可能不同），字节序也分大小端。要跨平台传输，就老老实实用文本或自定义的定长格式。' },
            { t: 'note', x: '`sizeof(Rec)` 是 24 而不是 4+8+8=20，多出来的 4 字节是对齐填充。想确认实际布局，可以用 `offsetof(Rec, score)` 打印每个成员的偏移。' }
          ]
        },
        {
          id: 'c8l3', title: '预处理与宏', key: '#define · 括号 · 条件编译', time: 12,
          blocks: [
            { t: 'p', x: '预处理器在编译前做**纯文本替换**。它不懂类型、不做计算，只按字面换。所以宏里的括号不是风格问题，是正确性问题。' },
            { t: 'code', x: '#include <stdio.h>\n\n#define PI 3.14159\n#define SQUARE(x) ((x) * (x))        /* 每个参数和整体都要括号 */\n#define MAX(a, b) ((a) > (b) ? (a) : (b))\n#define STR(x) #x                     /* 转成字符串 */\n#define CAT(a, b) a##b                /* 拼接标识符 */\n\nint main(void) {\n    printf("%.2f\\n", PI * 2);\n    printf("%d\\n", SQUARE(3 + 1));       /* 有括号才是 16 */\n    printf("%d\\n", MAX(7, 12));\n    printf("%s\\n", STR(hello));\n\n    int CAT(var, 1) = 5;\n    printf("var1 = %d\\n", var1);\n    return 0;\n}', out: '6.28\n16\n12\nhello\nvar1 = 5' },
            { t: 'warn', x: '**`#define SQUARE(x) x * x` 写 `SQUARE(3+1)` 会得到 `3+1*3+1 = 7`。** 括号漏一个就错，这是宏最经典的坑。能用 `static inline` 函数就别用宏。' },
            { t: 'h', x: '条件编译：一份代码编出多个版本' },
            { t: 'code', x: '#include <stdio.h>\n\n#define VERSION 2\n\nint main(void) {\n#if VERSION >= 2\n    printf("新版：支持批量导入\\n");\n#else\n    printf("旧版\\n");\n#endif\n\n#ifdef DEBUG\n    printf("调试模式\\n");\n#else\n    printf("发布模式\\n");\n#endif\n    return 0;\n}', out: '新版：支持批量导入\n发布模式' },
            { t: 'note', x: '`#ifdef DEBUG` 是标准的调试开关：编译时加 `-DDEBUG` 才会输出日志，发布版本里这些代码在预处理阶段就被删掉了，不占体积也不影响性能。' },
            { t: 'principle', x: '**常量用 `#define` 或 `const`；带参数的逻辑优先写函数。** 宏只在三种场合无可替代：`#include` 保护、条件编译、需要字符串化/拼接的地方。' }
          ]
        },
        {
          id: 'c8l4', title: 'gdb 调试与 make 构建', key: '断点 · 单步 · Makefile', time: 14,
          blocks: [
            { t: 'p', x: '程序崩溃时，光看代码很难定位。`gdb` 能让你**停在出错的那一行**，查看每个变量的值——这是 C 程序员最核心的排错手段。' },
            { t: 'code', x: '#include <stdio.h>\n\nint sum(int a[], int n) {\n    int s = 0;\n    for (int i = 0; i < n; i++) s += a[i];\n    return s;\n}\n\nint main(void) {\n    int a[4] = {1, 2, 3, 4};\n    printf("%d\\n", sum(a, 4));\n    return 0;\n}', out: '10' },
            { t: 'code', run: false, label: '终端', x: '> gcc -g -Wall main.c -o app     # -g 生成调试信息，必须有\n> gdb ./app\n(gdb) break main                 # 在 main 处下断点\n(gdb) run                        # 启动\n(gdb) next                       # 执行下一行（不进入函数）\n(gdb) step                       # 进入函数内部\n(gdb) print a[0]                 # 查看变量\n(gdb) backtrace                  # 崩溃后看调用栈\n(gdb) quit' },
            { t: 'table', head: ['命令', '作用', '何时用'], rows: [
              ['`break 行号 / 函数名`', '下断点', '怀疑某段逻辑前'],
              ['`run` / `continue`', '启动 / 继续', '—'],
              ['`next` / `step`', '单步（不进 / 进函数）', '逐行确认执行路径'],
              ['`print 变量`', '查看值', '确认数据是否符合预期'],
              ['`backtrace`', '打印调用栈', '段错误后找「谁调用了谁」'],
              ['`watch 变量`', '值变化时自动停', '查「谁偷偷改了我的变量」']
            ] },
            { t: 'h', x: 'Makefile：只重新编译改过的文件' },
            { t: 'code', run: false, label: 'Makefile', x: 'CC = gcc\nCFLAGS = -Wall -g -std=c11\n\napp: main.o utils.o\n\t$(CC) main.o utils.o -o app\n\nmain.o: main.c utils.h\n\t$(CC) $(CFLAGS) -c main.c\n\nutils.o: utils.c utils.h\n\t$(CC) $(CFLAGS) -c utils.c\n\nclean:\n\trm -f *.o app' },
            { t: 'code', run: false, label: '终端', x: '> make          # 只编译需要更新的文件\n> make clean    # 清理产物\n> ./app' },
            { t: 'note', x: 'Makefile 的规则是「**目标: 依赖**」，下一行必须是 **Tab 开头**（不能用空格，这是新手最常犯的错）。依赖比目标新，才重新执行命令。' },
            { t: 'warn', x: '段错误（Segmentation fault）先用 `backtrace` 看崩在哪一层，再用 `print` 检查那个指针。**九成的段错误是空指针或越界**，先怀疑这两件事。' }
          ]
        }
      ]
    },
/*CHAPTERS*/
  ],
  quiz: [
    { id: 'cq1', ch: 'c1', lesson: 'c1l1', point: '编译流程', type: 'choice', diff: 1,
      prompt: '把 `hello.c` 变成可执行文件，正确的顺序是？',
      opts: ['预处理 → 汇编 → 编译 → 链接', '预处理 → 编译 → 汇编 → 链接', '编译 → 预处理 → 链接 → 汇编', '链接 → 编译 → 预处理 → 汇编'],
      ans: 1,
      explain: '先预处理展开头文件和宏，再把 C 代码编译成汇编，汇编转成机器码目标文件（.o），最后链接库和其他 .o 生成可执行文件。' },
    { id: 'cq2', ch: 'c1', lesson: 'c1l1', point: '链接错误', type: 'choice', diff: 2,
      prompt: '编译时提示 `undefined reference to \'add\'`，最可能的原因是？',
      opts: ['add 函数里语法写错了', 'add 只有声明，没有实现（或没参与链接）', '没有 include 对应的头文件', 'add 的返回类型写成了 void'],
      ans: 1,
      explain: '`undefined reference` 是**链接期**错误，意思是编译器知道有这么个函数（见过声明），但找不到它的实现。语法错误是编译期报错，找不到头文件是 `No such file or directory`。' },
    { id: 'cq3', ch: 'c1', lesson: 'c1l2', point: 'printf 格式', type: 'output', diff: 1,
      prompt: '写出下面程序的输出。',
      code: '#include <stdio.h>\nint main(void) {\n    printf("%d|%5d|%-5d|\\n", 7, 7, 7);\n    printf("%.2f\\n", 2.0 / 3);\n    printf("%c%c\\n", \'A\' + 1, \'Z\' - 25);\n    return 0;\n}',
      answer: '7|    7|7    |\n0.67\nBA',
      explain: '`%5d` 右对齐补到 5 位，`%-5d` 左对齐补到 5 位。`%.2f` 保留两位并四舍五入，所以 0.666… 得 0.67。字符可以直接参与算术：`\'A\'+1` 是 B，`\'Z\'-25` 是 A。' },
    { id: 'cq4', ch: 'c1', lesson: 'c1l3', point: '类型大小', type: 'choice', diff: 2,
      prompt: '关于 C 的整型大小，下面哪个说法是**错**的？',
      opts: ['char 一定是 1 字节', 'int 一般是 4 字节', 'long 在所有平台上都是 8 字节', 'long long 至少 8 字节'],
      ans: 2,
      explain: '`long` 的大小是「实现定义」的：Linux/macOS 64 位上是 8 字节，Windows 上是 4 字节。所以跨平台代码别假设 `long` 的宽度，需要 64 位就用 `long long` 或 `int64_t`。' },
    { id: 'cq5', ch: 'c1', lesson: 'c1l3', point: '进制前缀', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int a = 010, b = 0x10;\n    printf("%d %d\\n", a, b);\n    return 0;\n}',
      answer: '8 16',
      explain: '前导 `0` 表示八进制，`010` 就是十进制的 8；`0x` 表示十六进制，`0x10` 是 16。这个混淆点非常常见。' },

    { id: 'cq6', ch: 'c2', lesson: 'c2l1', point: '整除与取模', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    printf("%d %.1f %d\\n", 7 / 2, 7 / 2.0, -7 % 2);\n    return 0;\n}',
      answer: '3 3.5 -1',
      explain: '两个 int 相除得 3（截断）；有一个是 double 就走浮点得 3.5；`%` 的符号跟着**被除数**走，所以 -7 % 2 是 -1。' },
    { id: 'cq7', ch: 'c2', lesson: 'c2l3', point: '位运算', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    unsigned a = 12, b = 10;\n    printf("%u %u %u\\n", a & b, a | b, a ^ b);\n    printf("%u\\n", a << 2);\n    return 0;\n}',
      answer: '8 14 6\n48',
      explain: '12 = 1100，10 = 1010。与得 1000 = 8，或得 1110 = 14，异或得 0110 = 6。左移两位等于乘 4，12 × 4 = 48。' },
    { id: 'cq8', ch: 'c2', lesson: 'c2l2', point: '短路求值', type: 'choice', diff: 2,
      prompt: '下面哪个写法能安全地判断指针 p 指向的值是否大于 0？',
      opts: ['if (*p > 0 && p != NULL)', 'if (p != NULL && *p > 0)', 'if (p & *p > 0)', 'if (!p && *p > 0)'],
      ans: 1,
      explain: '`&&` 从左往右算，左边为假时右边**根本不执行**。所以必须先判空再解引用。写反了会在 p 为空时直接崩。' },
    { id: 'cq9', ch: 'c2', lesson: 'c2l4', point: '自增顺序', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int i = 3;\n    printf("%d ", i++);\n    printf("%d ", ++i);\n    printf("%d\\n", i--);\n    return 0;\n}',
      answer: '3 5 5',
      explain: '`i++` 先用 3 再变 4；`++i` 先变 5 再用 5；`i--` 先用 5 再变 4。所以依次是 3、5、5。' },
    { id: 'cq10', ch: 'c2', lesson: 'c2l5', point: '类型提升', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    char c = \'A\';\n    printf("%d %c\\n", c + 2, c + 2);\n    printf("%d\\n", (int)2.9);\n    return 0;\n}',
      answer: '67 C\n2',
      explain: '`\'A\'` 的 ASCII 码是 65，加 2 得 67，按 `%c` 打印就是 C。`(int)` 强制转换是**截断**，直接砍掉小数，不做四舍五入。' },

    { id: 'cq11', ch: 'c3', lesson: 'c3l1', point: '区间判断', type: 'choice', diff: 2,
      prompt: '想判断 x 是否在 [0, 100] 之间，正确写法是？',
      opts: ['if (0 <= x <= 100)', 'if (x >= 0 && x <= 100)', 'if (x >= 0 || x <= 100)', 'if (x in [0,100])'],
      ans: 1,
      explain: '`0 <= x <= 100` 会先算 `0 <= x` 得到 0 或 1，再算 `1 <= 100`，永远为真。C 没有链式比较，区间必须用 `&&` 连接两个独立比较。' },
    { id: 'cq12', ch: 'c3', lesson: 'c3l2', point: 'switch 穿透', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int x = 2, r = 0;\n    switch (x) {\n        case 1: r += 1;\n        case 2: r += 2;\n        case 3: r += 3; break;\n        default: r += 100;\n    }\n    printf("%d\\n", r);\n    return 0;\n}',
      answer: '5',
      explain: '从 `case 2` 进入后没有 break，会继续执行 `case 3`（穿透），累加 2 + 3 = 5，然后遇到 break 结束。' },
    { id: 'cq13', ch: 'c3', lesson: 'c3l3', point: '逐位拆解', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int n = 1234, s = 0;\n    while (n) { s += n % 10; n /= 10; }\n    printf("%d\\n", s);\n    return 0;\n}',
      answer: '10',
      explain: '每轮 `% 10` 取出最后一位、`/ 10` 砍掉最后一位，累加 4+3+2+1 = 10。这是「逐位处理整数」的固定套路。' },
    { id: 'cq14', ch: 'c3', lesson: 'c3l5', point: 'break 与 continue', type: 'choice', diff: 2,
      prompt: '在两层嵌套循环的内层写 `break;`，结果是？',
      opts: ['两层循环都结束', '只结束内层循环，外层继续下一轮', '跳过本轮进入内层下一轮', '程序报错'],
      ans: 1,
      explain: '`break` 只跳出**当前这一层**循环。要一次跳出两层，需要标志变量、把条件写进外层，或者用 `goto`。`continue` 才是跳过本轮。' },
    { id: 'cq15', ch: 'c3', lesson: 'c3l6', point: '嵌套循环次数', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int c = 0;\n    for (int i = 0; i < 3; i++)\n        for (int j = i; j < 3; j++) c++;\n    printf("%d\\n", c);\n    return 0;\n}',
      answer: '6',
      explain: 'i=0 时 j 走 3 次，i=1 时 2 次，i=2 时 1 次，合计 6 次。这种「内层起点跟着外层走」的结构是三角形遍历，次数是 n(n+1)/2。' },

    { id: 'cq16', ch: 'c4', lesson: 'c4l1', point: '数组越界', type: 'choice', diff: 2,
      prompt: '`int a[5];` 之后写 `a[5] = 10;`，会发生什么？',
      opts: ['编译报错', '运行时抛出异常', '编译通过，运行时踩坏相邻内存', '自动扩容成 6 个元素'],
      ans: 2,
      explain: 'C 不做边界检查。`a[5]` 已经超出数组，编译器不管，运行时直接写到相邻内存上——可能改掉别的变量，也可能立刻崩溃。' },
    { id: 'cq17', ch: 'c4', lesson: 'c4l2', point: '二维遍历', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int m[2][3] = {{1,2,3},{4,5,6}};\n    int s = 0;\n    for (int i = 0; i < 2; i++)\n        for (int j = 0; j < 3; j++)\n            if (j % 2 == 0) s += m[i][j];\n    printf("%d\\n", s);\n    return 0;\n}',
      answer: '14',
      explain: '只累加列下标为偶数的元素：第 0 列的 1+4=5，第 2 列的 3+6=9，合计 14。' },
    { id: 'cq18', ch: 'c4', lesson: 'c4l3', point: '字符串长度', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    char a[] = "hello";\n    char b[10] = "hi";\n    printf("%zu %zu %zu\\n", sizeof(a), sizeof(b), sizeof("abc"));\n    return 0;\n}',
      answer: '6 10 4',
      explain: '`sizeof` 数的是**字节数**：`"hello"` 有 5 个字符 + 1 个 `\\0` = 6；`b` 声明为 10 字节，就是 10；`"abc"` 是 3 + 1 = 4。注意这里不是 strlen。' },
    { id: 'cq19', ch: 'c4', lesson: 'c4l4', point: '字符串比较', type: 'choice', diff: 2,
      prompt: '判断两个字符串是否相同，应该用？',
      opts: ['if (s1 == s2)', 'if (strcmp(s1, s2) == 0)', 'if (strcmp(s1, s2) == 1)', 'if (*s1 == *s2)'],
      ans: 1,
      explain: '`==` 比的是两个数组/指针的**地址**，永远不相等。`strcmp` 相等时返回 0，所以判断 `== 0`。返回值不保证是 1，不能写 `== 1`。' },
    { id: 'cq20', ch: 'c4', lesson: 'c4l5', point: '冒泡排序', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int a[5] = {4, 2, 5, 1, 3};\n    for (int i = 0; i < 4; i++)\n        for (int j = 0; j < 4 - i; j++)\n            if (a[j] > a[j+1]) { int t=a[j]; a[j]=a[j+1]; a[j+1]=t; }\n    for (int i = 0; i < 5; i++) printf("%d", a[i]);\n    printf("\\n");\n    return 0;\n}',
      answer: '12345',
      explain: '冒泡排序把相邻的逆序对交换，每趟把当前最大的挤到末尾，最后得到升序 12345。' },

    { id: 'cq21', ch: 'c5', lesson: 'c5l1', point: '声明与定义', type: 'choice', diff: 2,
      prompt: '`int add(int a, int b);` 这句叫什么？',
      opts: ['函数定义', '函数声明（原型）', '函数调用', '宏定义'],
      ans: 1,
      explain: '结尾有分号、没有函数体的是**声明**，只告诉编译器「有这么个函数」；有 `{}` 函数体的才是**定义**。声明可以出现多次，定义只能一次。' },
    { id: 'cq22', ch: 'c5', lesson: 'c5l2', point: '值传递', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nvoid f(int x) { x = 100; }\nvoid g(int *x) { *x = 100; }\nint main(void) {\n    int a = 1, b = 1;\n    f(a); g(&b);\n    printf("%d %d\\n", a, b);\n    return 0;\n}',
      answer: '1 100',
      explain: '`f` 拿到的是 a 的副本，改副本不影响 a；`g` 拿到的是 b 的地址，通过 `*x = 100` 改到了原来的 b。这就是「要改值就传地址」。' },
    { id: 'cq23', ch: 'c5', lesson: 'c5l3', point: '递归', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint f(int n) { return n <= 1 ? 1 : n * f(n - 1); }\nint main(void) {\n    printf("%d\\n", f(4) + f(3));\n    return 0;\n}',
      answer: '30',
      explain: '`f` 就是阶乘：f(4) = 24，f(3) = 6，相加得 30。' },
    { id: 'cq24', ch: 'c5', lesson: 'c5l4', point: 'static 局部变量', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint next(void) { static int n = 0; return ++n; }\nint main(void) {\n    next(); next();\n    printf("%d\\n", next());\n    return 0;\n}',
      answer: '3',
      explain: '`static int n` 只初始化一次，函数返回后值保留在静态区。前两次调用虽然没有输出，但已经把 n 加到了 2，第三次返回 3。' },
    { id: 'cq25', ch: 'c5', lesson: 'c5l5', point: '头文件保护', type: 'choice', diff: 2,
      prompt: '头文件里的 `#ifndef XXX_H / #define XXX_H / #endif` 是干什么的？',
      opts: ['判断编译器版本', '防止头文件被重复 include 导致重复定义', '开启调试输出', '声明该文件是 C 语言'],
      ans: 1,
      explain: '这叫头文件保护（include guard）。同一个 .c 通过多条路径 include 同一个头文件时，第二次会被 `#ifndef` 挡掉，避免「重复定义」错误。' },

    { id: 'cq26', ch: 'c6', lesson: 'c6l1', point: '指针算术', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int a[4] = {10, 20, 30, 40};\n    int *p = a + 1;\n    printf("%d %d\\n", *p, *(p + 2));\n    printf("%d\\n", (int)(p - a));\n    return 0;\n}',
      answer: '20 40\n1',
      explain: '`a + 1` 指向下标 1（值 20），再加 2 到下标 3（值 40）。两个指针相减得到的是**相差几个元素**，不是字节数。' },
    { id: 'cq27', ch: 'c6', lesson: 'c6l2', point: '指针与数组', type: 'choice', diff: 2,
      prompt: '`int a[5]; int *p = a;` 之后，下面哪个**不等价**？',
      opts: ['a[2] 和 *(a+2)', 'p[2] 和 *(p+2)', 'a[2] 和 *(a+2) 与 p[2]', 'sizeof(a) 和 sizeof(p)'],
      ans: 3,
      explain: '`sizeof(a)` 是整个数组的字节数（20），`sizeof(p)` 是指针本身的大小（64 位下是 8）。数组一旦退化成指针，长度信息就丢了。' },
    { id: 'cq28', ch: 'c6', lesson: 'c6l3', point: '输出参数', type: 'choice', diff: 2,
      prompt: '想让函数返回「最小值」和「最大值」两个结果，最标准的做法是？',
      opts: ['return 一个数组', 'return 一个结构体 + 用全局变量', '多传两个 int 指针作为输出参数', '调用两次函数'],
      ans: 2,
      explain: 'C 只能 return 一个值。标准做法是传两个 `int *`，函数内部通过 `*mn = ...` / `*mx = ...` 写回调用方的变量。返回值可以用来表示成功与否。' },
    { id: 'cq29', ch: 'c6', lesson: 'c6l4', point: '字符指针', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    const char *s = "abcde";\n    printf("%c%c\\n", *s, *(s + 3));\n    printf("%d\\n", (int)(s[4] - s[0]));\n    return 0;\n}',
      answer: 'ad\n4',
      explain: '`*s` 是首字符 a，`*(s+3)` 是下标 3 的 d。`s[4]` 是 e（101），`s[0]` 是 a（97），差 4。' },
    { id: 'cq30', ch: 'c6', lesson: 'c6l5', point: '函数指针', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n    int (*op)(int, int) = add;\n    printf("%d\\n", op(3, 4));\n    return 0;\n}',
      answer: '7',
      explain: '`op` 是指向「两个 int 参数、返回 int」的函数的指针，赋值为 `add` 后 `op(3,4)` 等价于 `add(3,4)`，得 7。' },

    { id: 'cq31', ch: 'c7', lesson: 'c7l1', point: '结构体对齐', type: 'output', diff: 3,
      prompt: '写出 64 位平台（GCC）上的输出。',
      code: '#include <stdio.h>\nstruct S { char c; int i; double d; };\nint main(void) {\n    printf("%zu\\n", sizeof(struct S));\n    return 0;\n}',
      answer: '16',
      explain: '成员相加是 1+4+8 = 13，但 `int` 要对齐到 4 的倍数（c 后补 3 字节），`double` 要对齐到 8 的倍数，所以布局是 c(0) i(4) d(8)，共 16 字节。' },
    { id: 'cq32', ch: 'c7', lesson: 'c7l2', point: '-> 运算符', type: 'choice', diff: 1,
      prompt: '`struct Point *p;` 要访问 p 指向的 x 成员，正确写法是？',
      opts: ['p.x', '*p.x', 'p->x', '&p.x'],
      ans: 2,
      explain: '`p->x` 是 `(*p).x` 的简写。写 `*p.x` 会因为 `.` 优先级高于 `*` 变成 `*(p.x)`，编译报错。' },
    { id: 'cq33', ch: 'c7', lesson: 'c7l3', point: 'union 大小', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nunion U { int i; char c[4]; };\nint main(void) {\n    printf("%zu\\n", sizeof(union U));\n    return 0;\n}',
      answer: '4',
      explain: '`union` 的所有成员共用同一块内存，大小等于**最大的那个成员**（这里 int 和 char[4] 都是 4 字节），不是相加。' },
    { id: 'cq34', ch: 'c7', lesson: 'c7l4', point: 'realloc', type: 'choice', diff: 3,
      prompt: '关于 `realloc`，下面哪个说法正确？',
      opts: ['它总是原地扩容，指针不变', '它可能搬移内存，所以必须接收返回值', '它会把新扩容的部分清零', '它不需要配对 free'],
      ans: 1,
      explain: '`realloc` 在空间不够时会申请新内存并搬移数据，旧指针随之失效。所以必须写 `p = realloc(p, n)`；新扩容的部分**不清零**（要清零用 calloc 或在代码里手写）。' },
    { id: 'cq35', ch: 'c7', lesson: 'c7l5', point: '链表头插', type: 'output', diff: 2,
      prompt: '依次把 1、2、3 插到链表头部（头插法），从头遍历的输出是？',
      code: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node { int v; struct Node *next; } Node;\n\nNode *push_front(Node *head, int v) {\n    Node *n = malloc(sizeof(Node));\n    n->v = v;\n    n->next = head;      /* 新节点的 next 指向原来的头 */\n    return n;            /* 新节点成为新的头 */\n}\n\nint main(void) {\n    Node *head = NULL;\n    head = push_front(head, 1);\n    head = push_front(head, 2);\n    head = push_front(head, 3);\n\n    for (Node *p = head; p; p = p->next) printf("%d ", p->v);\n    printf("\\n");\n\n    while (head) { Node *t = head->next; free(head); head = t; }\n    return 0;\n}',
      answer: '3 2 1',
      explain: '头插法产生的顺序跟插入顺序相反：最后插入的 3 在最前面，所以遍历得到 3 → 2 → 1。想保持插入顺序要用尾插。' },

    { id: 'cq36', ch: 'c8', lesson: 'c8l1', point: 'fopen 模式', type: 'choice', diff: 2,
      prompt: '用 `fopen("data.txt", "w")` 打开一个已存在的文件，会发生什么？',
      opts: ['保留原内容，从开头覆盖写入', '清空原内容', '打开失败返回 NULL', '自动追加到末尾'],
      ans: 1,
      explain: '`"w"` 会**截断**文件（清空），危险就在这。想保留原内容追加用 `"a"`，想读写且不清空用 `"r+"`。' },
    { id: 'cq37', ch: 'c8', lesson: 'c8l2', point: 'fseek 定位', type: 'choice', diff: 2,
      prompt: '要从二进制文件里直接读第 3 条记录（每条 `sizeof(Rec)` 字节），应该先做什么？',
      opts: ['fseek(fp, sizeof(Rec), SEEK_SET)', 'fseek(fp, 2 * sizeof(Rec), SEEK_SET)', 'fseek(fp, 3, SEEK_SET)', 'rewind(fp)'],
      ans: 1,
      explain: '记录下标从 0 开始，第 3 条的下标是 2，偏移就是 `2 * sizeof(Rec)`。注意 `fseek` 的偏移单位是**字节**，不是记录数。' },
    { id: 'cq38', ch: 'c8', lesson: 'c8l3', point: '宏的括号', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: '#include <stdio.h>\n#define SQ(x) x * x\nint main(void) {\n    printf("%d\\n", SQ(2 + 3));\n    return 0;\n}',
      answer: '11',
      explain: '宏是纯文本替换，`SQ(2 + 3)` 展开成 `2 + 3 * 2 + 3`，按优先级算得 2 + 6 + 3 = 11。正确写法是 `#define SQ(x) ((x) * (x))`。' },
    { id: 'cq39', ch: 'c8', lesson: 'c8l3', point: '条件编译', type: 'choice', diff: 2,
      prompt: '`#ifdef DEBUG` 里的代码在什么情况下会被编译？',
      opts: ['永远编译', '永远不编译', '编译时定义了 DEBUG 宏才会编译', '运行时 DEBUG 变量为真才编译'],
      ans: 2,
      explain: '条件编译在**预处理阶段**判断。用 `gcc -DDEBUG` 或代码里 `#define DEBUG` 才会把那部分留下，否则整段在编译前就被删掉了，不占体积。' },
    { id: 'cq40', ch: 'c8', lesson: 'c8l4', point: '调试手段', type: 'choice', diff: 2,
      prompt: '程序运行时报「段错误」，想定位到具体哪一行，最有效的做法是？',
      opts: ['在每行加 printf 逐个试', '用 gcc -g 编译后跑 gdb，崩溃时执行 backtrace', '把优化开到 -O3 再试', '删除所有指针'],
      ans: 1,
      explain: '`-g` 保留调试信息，gdb 崩溃后 `backtrace` 能直接给出调用栈和行号，再用 `print` 检查指针。这比逐行加 printf 快得多。' }
  ],

  checkin: [
    { id: 'ck1', ch: 'c1', point: '头文件', type: 'choice', diff: 1,
      prompt: '想让 `printf` 能用，必须包含哪个头文件？',
      opts: ['<stdlib.h>', '<stdio.h>', '<string.h>', '<math.h>'],
      ans: 1,
      explain: '`stdio.h` 提供标准输入输出（printf / scanf / FILE）。`stdlib.h` 管 malloc、exit；`string.h` 管字符串函数。' },
    { id: 'ck2', ch: 'c1', point: 'main 返回值', type: 'choice', diff: 1,
      prompt: '`main` 函数末尾 `return 0;` 表示什么？',
      opts: ['返回一个无用值', '程序正常结束', '程序出错', '跳过后续代码'],
      ans: 1,
      explain: '返回值给操作系统，0 表示成功，非 0 表示异常结束。脚本和构建工具都靠这个值判断上一步是否成功。' },
    { id: 'ck3', ch: 'c1', point: 'scanf 取地址', type: 'choice', diff: 2,
      prompt: '`int n;` 要读入一个整数，正确写法是？',
      opts: ['scanf("%d", n)', 'scanf("%d", &n)', 'scanf("%d", *n)', 'scanf(&n, "%d")'],
      ans: 1,
      explain: '`scanf` 需要知道往哪块内存写，所以传地址 `&n`。漏了 `&` 是最常见的崩溃原因之一。' },
    { id: 'ck4', ch: 'c1', point: 'sizeof 格式符', type: 'choice', diff: 2,
      prompt: '`sizeof` 的返回值类型是 `size_t`，用 `printf` 打印它应该用哪个格式符？',
      opts: ['%d', '%zu', '%ld', '%f'],
      ans: 1,
      explain: '`size_t` 是无符号整数类型，标准对应的格式符是 `%zu`。用 `%d` 在 64 位平台上会打印错。' },
    { id: 'ck5', ch: 'c1', point: '语句结束', type: 'choice', diff: 1,
      prompt: 'C 的语句以什么结尾？',
      opts: ['句号', '分号', '冒号', '换行'],
      ans: 1,
      explain: 'C 用分号 `;` 结束语句，换行只是排版。少写分号的报错通常是 `expected \';\' before ...`，报错行号往往在真正出错位置的下一行。' },

    { id: 'ck6', ch: 'c2', point: '取余与整除', type: 'output', diff: 1,
      prompt: '写出输出（三门课总分 238，求平均分）：',
      code: '#include <stdio.h>\nint main(void) {\n    int total = 80 + 92 + 66;\n    printf("%d\\n", total / 3);\n    return 0;\n}',
      answer: '79',
      explain: '238 / 3 = 79.33…，但两个 int 相除会截断成 79。想得到 79.33 得写 `total / 3.0`。' },
    { id: 'ck7', ch: 'c2', point: '自增单独成句', type: 'choice', diff: 1,
      prompt: '`i++;` 和 `++i;` 单独作为一条语句时，区别是？',
      opts: ['完全没区别', 'i++ 多执行一次', '++i 结果更大', 'i++ 会报错'],
      ans: 0,
      explain: '单独成句时不关心返回值，两者都只是把 i 加 1，效果完全一样。区别只在「表达式里还要用这个值」时才体现。' },
    { id: 'ck8', ch: 'c2', point: '赋值与比较', type: 'choice', diff: 1,
      prompt: '`if (x = 0)` 这行代码的实际效果是？',
      opts: ['判断 x 是否等于 0', '把 0 赋给 x，条件永远为假', '编译错误', '把 x 加 0'],
      ans: 1,
      explain: '单个 `=` 是赋值。赋值表达式的值是赋进去的那个值，所以 `x = 0` 得 0 → 条件为假，这个分支永远进不去。比较要用 `==`。' },
    { id: 'ck9', ch: 'c2', point: '逻辑非', type: 'choice', diff: 1,
      prompt: '`!5` 的值是？',
      opts: ['5', '1', '0', '-5'],
      ans: 2,
      explain: '`!` 是逻辑非，只关心真假。5 非零即为真，取非得 0（假）。C 里逻辑运算的结果只有 0 和 1。' },
    { id: 'ck10', ch: 'c2', point: '位运算判奇偶', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    printf("%d %d\\n", 7 & 1, 8 & 1);\n    return 0;\n}',
      answer: '1 0',
      explain: '`n & 1` 取最低位：奇数的最低位是 1，偶数的是 0。这比 `n % 2` 更快，也是位运算最常用的技巧之一。' },

    { id: 'ck11', ch: 'c2', point: '三目运算符', type: 'choice', diff: 1,
      prompt: '`x > 0 ? "正" : "负"` 这个表达式的含义是？',
      opts: ['如果 x>0 就输出"正"', 'x>0 时取值为"正"，否则为"负"', '判断两个字符串是否相等', '把 x 变成字符串'],
      ans: 1,
      explain: '三目运算符是「条件 ? 值1 : 值2」，它产生一个**值**，本身不输出。要打印得写成 `printf("%s", x>0 ? "正" : "负")`。' },
    { id: 'ck12', ch: 'c3', point: 'switch 限制', type: 'choice', diff: 2,
      prompt: '`switch` 的括号里不能放哪种类型的表达式？',
      opts: ['int 变量', 'char 变量', '枚举值', 'double 变量'],
      ans: 3,
      explain: '`switch` 只能用于整型（int / char / enum / long 等），不能用于浮点数和字符串。判断浮点范围或字符串要用 if 或 strcmp。' },
    { id: 'ck13', ch: 'c3', point: 'for 语法', type: 'choice', diff: 1,
      prompt: '`for (int i = 0; i < 5; i++)` 里三部分是用什么分隔的？',
      opts: ['逗号', '分号', '空格', '冒号'],
      ans: 1,
      explain: '`for` 的三部分用**分号**分隔：初始化; 条件; 步进。写成逗号会变成一条「逗号表达式」，编译器会报错或行为异常。' },
    { id: 'ck14', ch: 'c3', point: '循环次数', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int n = 0;\n    for (int i = 1; i <= 4; i++) n += i;\n    printf("%d\\n", n);\n    return 0;\n}',
      answer: '10',
      explain: '1+2+3+4 = 10。注意条件是 `i <= 4`，所以 i 取到 4，一共 4 轮。写成 `i < 4` 就只加 1+2+3 = 6。' },
    { id: 'ck15', ch: 'c3', point: 'do-while 特点', type: 'choice', diff: 2,
      prompt: '`do { ... } while (0);` 这种写法执行几次循环体？',
      opts: ['0 次', '1 次', '无限次', '编译错误'],
      ans: 1,
      explain: '`do-while` 先执行后判断，条件即使是 0 也已经执行过一次了。这个写法常被用在宏里，把多条语句打包成「一个语句块」。' },

    { id: 'ck16', ch: 'c4', point: '数组下标', type: 'choice', diff: 1,
      prompt: '`int a[5];` 的合法下标范围是？',
      opts: ['1 ~ 5', '0 ~ 5', '0 ~ 4', '-5 ~ 0'],
      ans: 2,
      explain: 'C 数组下标从 0 开始，长度 5 的数组合法下标是 0、1、2、3、4。访问 `a[5]` 就越界了，而且编译器不会拦你。' },
    { id: 'ck17', ch: 'c4', point: '数组长度', type: 'choice', diff: 2,
      prompt: '在数组**本体**上求元素个数，正确写法是？',
      opts: ['sizeof(a)', 'sizeof(a) / sizeof(a[0])', 'strlen(a)', 'length(a)'],
      ans: 1,
      explain: '`sizeof(a)` 是整个数组的字节数，除以单个元素的字节数才是元素个数。注意这个技巧在函数参数里会失效（数组已退化成指针）。' },
    { id: 'ck18', ch: 'c4', point: '字符串结尾', type: 'choice', diff: 1,
      prompt: 'C 字符串靠什么标记结束？',
      opts: ['换行符 \\n', '空格', '空字符 \\0', '长度变量'],
      ans: 2,
      explain: '所有字符串函数（strlen / printf %s / strcpy）都靠 `\\0` 判断结束。少了它就会一直往后读，直到偶然遇到 0。' },
    { id: 'ck19', ch: 'c4', point: 'strlen', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <stdio.h>\n#include <string.h>\nint main(void) {\n    printf("%d\\n", (int)strlen("hello"));\n    return 0;\n}',
      answer: '5',
      explain: '`strlen` 数到 `\\0` 之前，不含 `\\0`，所以是 5。而 `sizeof("hello")` 是 6（含结尾的 `\\0`）。' },
    { id: 'ck20', ch: 'c4', point: 'strcpy 风险', type: 'choice', diff: 2,
      prompt: '`char buf[5]; strcpy(buf, "hello world");` 会怎样？',
      opts: ['自动截断成 hello', '缓冲区溢出，可能崩溃或踩坏内存', '编译报错', '正常工作'],
      ans: 1,
      explain: '`strcpy` 不检查目标空间，超长就溢出。安全版用 `snprintf(buf, sizeof(buf), "%s", src)`，它会截断并保证以 `\\0` 结尾。' },

    { id: 'ck21', ch: 'c5', point: 'void 返回', type: 'choice', diff: 1,
      prompt: '函数返回类型写 `void` 表示？',
      opts: ['返回 0', '不返回任何值', '返回任意类型', '函数没有参数'],
      ans: 1,
      explain: '`void f(void)` 中第一个 void 表示「不返回值」，括号里的 void 表示「不收参数」。两个 void 含义不同。' },
    { id: 'ck22', ch: 'c5', point: '参数传递', type: 'choice', diff: 2,
      prompt: 'C 的函数参数默认是怎么传的？',
      opts: ['按引用传', '按值传（复制一份）', '按指针传', '按名字传'],
      ans: 1,
      explain: 'C **只有值传递**：实参的值复制给形参。想改到外面必须传地址（指针），这也是 `swap` 要写成 `swap(&a, &b)` 的原因。' },
    { id: 'ck23', ch: 'c5', point: '递归必需', type: 'choice', diff: 2,
      prompt: '写递归函数时最不能少的是什么？',
      opts: ['循环变量', '终止条件', '全局变量', '返回值'],
      ans: 1,
      explain: '没有终止条件就是无限递归，最终栈溢出（Stack Overflow）。写递归先写「什么时候停」，再写「怎么化小」。' },
    { id: 'ck24', ch: 'c5', point: 'static 函数', type: 'choice', diff: 3,
      prompt: '函数前面加 `static` 的作用是？',
      opts: ['让函数运行更快', '让函数只能在本文件内被调用', '让函数变成全局可见', '让函数不能有参数'],
      ans: 1,
      explain: '`static` 加在函数前表示「内部链接」，其他 .c 文件链接不到它。这是 C 里实现「私有函数」的唯一办法。' },
    { id: 'ck25', ch: 'c5', point: '全局变量初值', type: 'choice', diff: 2,
      prompt: '声明了 `int g;` 但没有赋值，g 的初值是？',
      opts: ['随机值', '0', '1', '编译报错'],
      ans: 1,
      explain: '全局变量和 static 变量存在静态区，会被自动清零。而**局部变量不初始化就是随机值**（栈上的残留数据），这就是「野值」的来源。' },

    { id: 'ck26', ch: 'c6', point: '取地址', type: 'choice', diff: 1,
      prompt: '`&a` 表示什么？',
      opts: ['a 的值', 'a 的地址', 'a 的类型', 'a 的大小'],
      ans: 1,
      explain: '`&` 是取地址运算符，`&a` 得到 a 在内存中的地址。`scanf("%d", &a)` 正是把地址告诉它，让它能写进去。' },
    { id: 'ck27', ch: 'c6', point: '解引用', type: 'choice', diff: 2,
      prompt: '`int *p = &a; *p = 5;` 之后 a 的值是？',
      opts: ['还是原来的值', '5', 'p 的地址', '未定义'],
      ans: 1,
      explain: '`*p = 5` 是「顺着 p 存的地址，把 5 写进去」，也就是改 a 本身。`*` 在赋值左边表示写，在右边表示读。' },
    { id: 'ck28', ch: 'c6', point: '指针加法', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int a[5] = {1, 2, 3, 4, 5};\n    int *p = a;\n    p += 3;\n    printf("%d\\n", *p);\n    return 0;\n}',
      answer: '4',
      explain: '`p += 3` 让指针前进 3 个**元素**（12 字节），指向 `a[3]`，值是 4。指针的「1」永远是一个元素的大小。' },
    { id: 'ck29', ch: 'c6', point: '空指针判断', type: 'choice', diff: 1,
      prompt: '解引用指针前应该先做什么？',
      opts: ['强制类型转换', '判断是否为 NULL', '打印地址', '赋值给别的指针'],
      ans: 1,
      explain: '`if (p != NULL)` 或者简写成 `if (p)`。解引用空指针会立刻段错误，这是 C 程序崩溃最常见的原因。' },
    { id: 'ck30', ch: 'c6', point: '释放后置空', type: 'choice', diff: 2,
      prompt: '`free(p);` 之后最该做的下一件事是？',
      opts: ['什么都不用做', 'p = NULL;', '再 free 一次', '把 p 指向别的变量'],
      ans: 1,
      explain: '`free` 不会把指针改成 NULL，它仍然指向那块已归还的内存（悬垂指针）。立刻置空能让「误用」变成「崩溃」，便于发现。' },

    { id: 'ck31', ch: 'c7', point: 'malloc 返回值', type: 'choice', diff: 2,
      prompt: '`malloc` 返回的指针类型是？',
      opts: ['int *', 'void *', 'char *', 'size_t'],
      ans: 1,
      explain: '`malloc` 返回 `void *`，可以隐式转成任何指针类型。所以 `int *a = malloc(n * sizeof(int));` 不用强制转换（C++ 里才必须转）。' },
    { id: 'ck32', ch: 'c7', point: '结构体访问', type: 'choice', diff: 1,
      prompt: '`struct Student s;` 访问 s 的 name 成员用？',
      opts: ['s->name', 's.name', 's[name]', '*s.name'],
      ans: 1,
      explain: '结构体**变量**用 `.`，结构体**指针**用 `->`。两者不要混：`s->name` 用在这里会编译报错。' },
    { id: 'ck33', ch: 'c7', point: '结构体赋值', type: 'choice', diff: 2,
      prompt: '`struct A b; struct A a = b;` 这种赋值是？',
      opts: ['让 a 和 b 指向同一块内存', '把 b 的内容整体复制一份给 a', '编译错误', '只是复制了第一个成员'],
      ans: 1,
      explain: '同类型结构体可以直接赋值，效果是逐成员复制（浅拷贝）。之后改 a 不影响 b——但如果成员里有指针，两个结构体会指向同一块堆内存。' },
    { id: 'ck34', ch: 'c7', point: '内存泄漏', type: 'choice', diff: 2,
      prompt: '下面哪种情况会造成内存泄漏？',
      opts: ['free 了两次', 'malloc 之后再也没有 free，且丢了指针', '用 calloc 代替 malloc', '释放后把指针置 NULL'],
      ans: 1,
      explain: '申请了内存、又丢失了指向它的指针，这块内存就再也还不了了。程序长时间运行会越占越多，最终被系统杀掉。' },
    { id: 'ck35', ch: 'c7', point: '枚举默认值', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nenum Color { RED, GREEN, BLUE };\nint main(void) {\n    printf("%d %d\\n", RED, BLUE);\n    return 0;\n}',
      answer: '0 2',
      explain: '枚举默认从 0 开始依次递增：RED=0、GREEN=1、BLUE=2。也可以显式写 `enum { RED = 1, GREEN, BLUE };` 让它从 1 开始。' },

    { id: 'ck36', ch: 'c8', point: 'fopen 返回值', type: 'choice', diff: 1,
      prompt: '`fopen` 打开失败时返回什么？',
      opts: ['-1', 'NULL', '0', '空字符串'],
      ans: 1,
      explain: '失败返回 `NULL`。所以标准的写法是 `FILE *fp = fopen(...); if (!fp) { perror("fopen"); return 1; }`。不检查就会在下一行崩。' },
    { id: 'ck37', ch: 'c8', point: 'fgets 参数', type: 'choice', diff: 2,
      prompt: '`fgets(buf, sizeof(buf), fp)` 的第二个参数表示？',
      opts: ['要读多少行', '缓冲区大小（最多读这么多字节，含结尾 0）', '文件偏移量', '读到第几个字符停'],
      ans: 1,
      explain: '第二个参数是缓冲区容量。`fgets` 最多读 `size - 1` 个字符，然后补 `\\0`，保证不越界——这就是它比 `gets` 安全的地方。' },
    { id: 'ck38', ch: 'c8', point: '宏的定义', type: 'choice', diff: 2,
      prompt: '`#define MAX 100` 这一行末尾要不要加分号？',
      opts: ['必须加', '绝对不能加', '可加可不加', '只有数字才要加'],
      ans: 1,
      explain: '宏是文本替换，加分号会一起替换进去。`if (n < MAX) ;` 会变成 `if (n < 100;)`，直接语法错误。所以 `#define` 后面别写分号。' },
    { id: 'ck39', ch: 'c8', point: '编译警告', type: 'choice', diff: 2,
      prompt: '编译时加 `-Wall` 的作用是？',
      opts: ['开启所有优化', '打开常用警告，暴露潜在问题', '生成调试信息', '指定 C 标准版本'],
      ans: 1,
      explain: '`-Wall` 打开一批常用警告：变量未使用、函数缺返回值、格式符不匹配等。这些在 C 里都是「能编过但会出事」的隐患，应该当错误对待。' },
    { id: 'ck40', ch: 'c8', point: '断点调试', type: 'choice', diff: 2,
      prompt: '要能用 gdb 看到源码行号和变量名，编译时必须加哪个选项？',
      opts: ['-O2', '-g', '-Wall', '-std=c11'],
      ans: 1,
      explain: '`-g` 生成调试信息（符号表、行号映射）。没有它，gdb 只能看到地址，`list` 和 `print` 变量都用不了。通常会写 `gcc -g -Wall`。' }
  ]

};
