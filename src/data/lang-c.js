/* ============================================================
   CodeCraft 数据 · C
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
      goals: ['说清预处理、编译、汇编、链接各做什么', '用 gcc 编译并看懂 -Wall 的警告', '用 printf 正确格式化输出', '认识 int / char / double 的大小与范围'],
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
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int age;\n    char name[32];\n    printf("输入姓名和年龄：");\n    if (scanf("%31s %d", name, &age) != 2) {\n        printf("输入格式不对\\n");\n        return 1;\n    }\n    printf("%s 明年 %d 岁\\n", name, age + 1);\n    return 0;\n}', out: '输入姓名和年龄：小明 20\n小明 明年 21 岁' },
            { t: 'warn', x: '`scanf` 两个高频坑：① 读 `int` / `double` 必须加 `&` 取地址，漏了程序会崩；② 读字符串**不加** `&`，因为数组名本身就是地址。这两点写反了是新手最常见的崩溃原因。' },
            { t: 'note', x: '`scanf` 的返回值是「成功读到了几个值」。判断 `!= 2` 就能知道输入是不是格式不对，比读进来一堆垃圾值再去排查要省事得多。' }
          ]
        },
        {
          id: 'c1l3', title: '变量、类型与 sizeof', key: '整型 · 浮点 · 大小', time: 12,
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
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    printf("char   %zu\\n", sizeof(char));\n    printf("int    %zu\\n", sizeof(int));\n    printf("double %zu\\n", sizeof(double));\n    printf("pointer %zu\\n", sizeof(int *));\n    printf("array  %zu\\n", sizeof(int[5]));\n    return 0;\n}', out: 'char   1\nint    4\ndouble 8\npointer 8\narray  20' },
            { t: 'h', x: '类型转换：整数除法最容易翻车' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    printf("%d\\n", 7 / 2);        /* 整数除法，向零截断 */\n    printf("%d\\n", -7 / 2);\n    printf("%.2f\\n", 7 / 2.0);    /* 有一个是浮点就走浮点 */\n    printf("%d\\n", (int)3.99);    /* 强制转换也是截断 */\n    printf("%d\\n", 7 % -2);       /* 取模结果符号跟着被除数 */\n    return 0;\n}', out: '3\n-3\n3.50\n3\n1' },
            { t: 'warn', x: '**整数溢出在 C 里是未定义行为**，不是「变成负数」这么简单。`int` 装不下的计算，编译器可以做任何事。要处理大数就换 `long long`，别赌运气。' },
            { t: 'principle', x: '**先想清楚「这个值会不会超范围」，再选类型。** 金额用整数分存储、计数用 `long long`、需要精确小数就别用浮点——这三个决定能省掉后期最难查的 bug。' }
          ]
        }
      ]
    },
    {
      id: 'c2', num: 2, title: '运算符与流程控制', icon: '🔀',
      intro: 'C 的运算符有小脾气：除法看类型、自增看顺序、逻辑运算会短路。这一章把这些坑一次讲透，再把 if / for / while 的写法定型。',
      goals: ['正确使用整除、取模与复合赋值', '解释 i++ 与 ++i 的区别', '用短路求值避免空指针访问', '熟练写 for / while 与 break / continue'],
      lessons: [
        {
          id: 'c2l1', title: '整数运算与自增的坑', key: '整除 · 取模 · i++', time: 12,
          blocks: [
            { t: 'p', x: '在 C 里，**两个整数相除结果还是整数**，小数部分直接扔掉（不是四舍五入）。想把平均值算对，得让其中一个操作数变成浮点。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a = 7, b = 2;\n    printf("%d\\n", a / b);            /* 3：小数部分被丢掉 */\n    printf("%d\\n", a % b);             /* 余数 1 */\n    printf("%.1f\\n", (double)a / b);   /* 3.5：先转再除 */\n    printf("%.1f\\n", a * 1.0 / b);     /* 3.5：乘浮点也能升格 */\n    return 0;\n}', out: '3\n1\n3.5\n3.5' },
            { t: 'h', x: '前置 ++ 与后置 ++' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int i = 5;\n    printf("%d\\n", i++);   /* 先用 5，再变 6 */\n    printf("%d\\n", i);\n    printf("%d\\n", ++i);   /* 先变 7，再用 7 */\n    printf("%d\\n", i);\n    return 0;\n}', out: '5\n6\n7\n7' },
            { t: 'warn', x: '**同一表达式里不要对同一个变量多次自增**，比如 `i = i++ + ++i;`。C 标准规定这种行为是未定义的，不同编译器给出不同结果甚至直接优化掉。' },
            { t: 'note', x: '`+=` `-=` `*=` `/=%=` 这些复合赋值不只是简写：对 `a[i++] += 1` 这种表达式，下标只算一次，比 `a[i] = a[i] + 1` 更安全。' }
          ]
        },
        {
          id: 'c2l2', title: 'if、逻辑短路与三目运算', key: '条件 · 短路 · 真假', time: 10,
          blocks: [
            { t: 'p', x: 'C 里没有真正的布尔类型（C99 之前）：**0 是假，非 0 都是真**。所以 `if (1)`、`if (-1)`、`if ("x")` 都成立。理解这一点，才看得懂老代码里的 `if (!ptr)`。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int score = 85;\n    if (score >= 90)      printf("优秀\\n");\n    else if (score >= 60) printf("及格\\n");\n    else                  printf("不及格\\n");\n\n    /* 三目：适合「二选一取值」，不适合堆逻辑 */\n    printf("%s\\n", score >= 60 ? "pass" : "fail");\n    return 0;\n}', out: '及格\npass' },
            { t: 'h', x: '短路求值：一个免费的安全网' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int *p = NULL;\n    /* 左边为假，右边根本不会执行，所以不会崩 */\n    if (p != NULL && *p > 0) {\n        printf("有值\\n");\n    } else {\n        printf("空指针，已跳过\\n");\n    }\n    /* 反过来写 p != NULL 在后面就晚了 */\n    return 0;\n}', out: '空指针，已跳过' },
            { t: 'table', head: ['运算符', '含义', '备注'], rows: [
              ['&&', '逻辑与', '左边假 → 右边不求值'],
              ['||', '逻辑或', '左边真 → 右边不求值'],
              ['!', '逻辑非', '`!0` 得 1'],
              ['& | ^', '按位与 / 或 / 异或', '整数的每一位独立运算，别和逻辑混用']
            ] },
            { t: 'warn', x: '**`=` 和 `==` 打错是 C 里最经典的 bug。** `if (x = 5)` 不是比较，是把 5 赋给 x 然后判断非零 → 永远成立。开 `-Wall` 会警告 `suggest parentheses around assignment`。' }
          ]
        },
        {
          id: 'c2l3', title: 'for、while 与循环控制', key: '循环 · break · continue', time: 10,
          blocks: [
            { t: 'p', x: '三种循环各有适用场景：**次数确定用 for**，**条件驱动用 while**，**至少执行一次用 do-while**。选错了不是不能跑，但读起来会别扭。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 0; i < 3; i++) {\n        printf("i=%d ", i);\n    }\n    printf("\\n");\n\n    int n = 100, steps = 0;\n    while (n != 1) {              /* 冰雹序列，长度不可预知 → while */\n        n = (n % 2 == 0) ? n / 2 : 3 * n + 1;\n        steps++;\n    }\n    printf("步骤数 %d\\n", steps);\n    return 0;\n}', out: 'i=0 i=1 i=2 \n步骤数 25' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 0; i < 10; i++) {\n        if (i % 2 == 0) continue;   /* 跳过偶数 */\n        if (i > 7) break;           /* 超过 7 就结束整个循环 */\n        printf("%d ", i);\n    }\n    printf("\\n");\n    return 0;\n}', out: '1 3 5 7' },
            { t: 'note', x: '`break` 只跳出**最内层**循环。要从两层循环里一起退出，用标志变量或 `goto done;`（在 C 里，跳出多层循环是 `goto` 少见的正当用途）。' },
            { t: 'warn', x: '`for (int i = 0; i <= n; i++)` 里的 `<=` 是经典越界源头：数组长度 n 时合法下标是 0~n-1。写 `i < n` 几乎总是对的。' }
          ]
        }
      ]
    },
    {
      id: 'c3', num: 3, title: '数组与字符串', icon: '📚',
      intro: 'C 的数组不带长度信息，字符串没有专门的类型。这两个「缺失」是所有缓冲区溢出的根源，也是 C 必须学指针的伏笔。这一章讲清「连续内存 + 长度自己记」这个模型。',
      goals: ['声明、初始化、遍历数组', '理解数组下标从 0 开始且不做越界检查', '说清字符串结尾的 \\0 是什么', '会用 strlen / strcpy / strcmp'],
      lessons: [
        {
          id: 'c3l1', title: '数组：一段连续的内存', key: '数组 · 越界', time: 12,
          blocks: [
            { t: 'p', x: '`int a[5]` 在内存里就是**连续的 5 个 int**，共 20 字节。数组名在大多数场合会退化成指向首元素的指针，所以 `a` 和 `&a[0]` 的值一样。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[5] = {80, 92, 66, 100, 71};\n    int sum = 0;\n    for (int i = 0; i < 5; i++) sum += a[i];\n    printf("总分 %d，平均 %.2f\\n", sum, sum / 5.0);\n\n    /* 只初始化前两个，其余自动为 0 */\n    int b[5] = {1, 2};\n    printf("%d %d %d\\n", b[0], b[2], b[4]);\n    return 0;\n}', out: '总分 409，平均 81.80\n1 0 0' },
            { t: 'warn', x: '**C 不会检查数组越界。** `int a[5]; a[10] = 1;` 照样编译通过，运行时直接踩坏别的变量或崩溃。这类 bug 往往在别处表现出来，最难查。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[3] = {1, 2, 3};\n    /* 求长度：总字节数 / 单个元素字节数，只在数组本体上有效 */\n    int n = sizeof(a) / sizeof(a[0]);\n    printf("n = %d\\n", n);\n\n    int max = a[0];\n    for (int i = 1; i < n; i++) if (a[i] > max) max = a[i];\n    printf("max = %d\\n", max);\n    return 0;\n}', out: 'n = 3\nmax = 3' },
            { t: 'note', x: '`sizeof(a) / sizeof(a[0])` 在函数参数里会失效——数组传参会退化成指针，`sizeof` 只剩 8。所以传数组时必须**另外传长度**，这是 C 接口的固定套路。' }
          ]
        },
        {
          id: 'c3l2', title: '字符串就是字符数组', key: 'char[] · \\0', time: 10,
          blocks: [
            { t: 'p', x: 'C 没有 String 类型。所谓字符串，就是**以 `\'\\0\'` 结尾的 char 数组**。`"hello"` 实际占 6 个字节：h e l l o \\0。所有字符串函数都靠这个 `\\0` 判断结束。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    char s1[] = "hello";        /* 编译器自动补 \\0，长度 6 */\n    char s2[8] = "hi";          /* 剩余位置填 0 */\n    char s3[] = {\'h\', \'i\'};      /* 没有 \\0！不是字符串 */\n\n    printf("%zu %zu %zu\\n", sizeof(s1), sizeof(s2), sizeof(s3));\n    printf("%s|%s\\n", s1, s2);\n    printf("s3 的第一个字符：%c\\n", s3[0]);\n    return 0;\n}', out: '6 8 2\nhello|hi\ns3 的第一个字符：h' },
            { t: 'warn', x: '用 `printf("%s", s3)` 打印上例的 `s3` 会越界读到垃圾，直到偶然遇到 0 才停——这就是「乱码」的来历。字符串一定要有 `\\0`。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    char buf[32];\n    int k = 0;\n    for (char c = \'a\'; c <= \'e\'; c++) {\n        buf[k++] = c;\n    }\n    buf[k] = \'\\0\';          /* 手动封口，必做 */\n    printf("%s 长度 %d\\n", buf, k);\n    return 0;\n}', out: 'abcde 长度 5' },
            { t: 'principle', x: '**在 C 里处理字符串，永远先问两个问题：缓冲区多大？有没有 `\\0`？** 想清楚这两个，就不会写出经典的安全漏洞。' }
          ]
        },
        {
          id: 'c3l3', title: 'string.h 的正确用法', key: 'strlen · strcpy · strcmp', time: 10,
          blocks: [
            { t: 'table', head: ['函数', '作用', '注意'], rows: [
              ['strlen(s)', '长度，不含 `\\0`', '每次都要从头数，循环里别反复调'],
              ['strcpy(d, s)', '复制', 'd 必须够大，否则溢出；安全版是 `strncpy`'],
              ['strcmp(a, b)', '比较，返回 0 表示相等', '别用 `==` 比较字符串！那比的是地址'],
              ['strcat(d, s)', '拼接', '同样要求 d 空间足够'],
              ['strchr(s, c)', '找字符，返回指针或 NULL', '配合指针可以继续找下一个']
            ] },
            { t: 'code', x: '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char a[16] = "abc";\n    char b[16] = "abd";\n\n    printf("len=%zu\\n", strlen(a));\n    printf("cmp=%d\\n", strcmp(a, b));       /* a<b → 负数 */\n    printf("eq=%d\\n", strcmp(a, a));        /* 相等 → 0 */\n\n    strcat(a, "def");\n    printf("%s\\n", a);\n    return 0;\n}', out: 'len=3\ncmp=-1\neq=0\nabcdef' },
            { t: 'warn', x: '`strcmp` 的返回值**不保证是 -1 或 1**，标准只说「负数 / 0 / 正数」。写成 `if (strcmp(a,b) == -1)` 在别的平台上可能不成立，要写 `< 0`。' },
            { t: 'note', x: '字符串比较的语义是**字典序**，逐字符比 ASCII 值。所以 `"10" < "9"` 是成立的（\'1\' < \'9\'）。要按数字比，先 `atoi` 转成整数。' }
          ]
        }
      ]
    },
    {
      id: 'c4', num: 4, title: '函数与指针', icon: '🎯',
      intro: '指针是 C 的分水岭。其实它只有一个意思：**存地址的变量**。把「变量有地址」和「* 是去那个地址取东西」这两句记住，剩下的都是组合。',
      goals: ['定义、声明、调用函数', '解释 C 只有值传递', '读懂 & 与 *，画出指针指向关系', '用指针参数让函数「改到外面」'],
      lessons: [
        {
          id: 'c4l1', title: '函数与值传递', key: '函数 · 值传递', time: 12,
          blocks: [
            { t: 'p', x: 'C 的函数**只有值传递**：调用时把实参的值复制一份给形参，函数里改的是副本，改不到外面。想修改外部变量，只能把它的**地址**传进去。' },
            { t: 'code', x: '#include <stdio.h>\n\nvoid swap_wrong(int a, int b) {   /* 改的是副本 */\n    int t = a; a = b; b = t;\n}\n\nint main(void) {\n    int x = 1, y = 2;\n    swap_wrong(x, y);\n    printf("%d %d\\n", x, y);\n    return 0;\n}', out: '1 2' },
            { t: 'code', x: '#include <stdio.h>\n\nvoid swap(int *a, int *b) {       /* 收到的是地址 */\n    int t = *a; *a = *b; *b = t;  /* 通过地址改原变量 */\n}\n\nint main(void) {\n    int x = 1, y = 2;\n    swap(&x, &y);\n    printf("%d %d\\n", x, y);\n    return 0;\n}', out: '2 1' },
            { t: 'note', x: '函数要先声明（或先定义）再使用。把头文件里的函数原型抄到 `.h`，实现放 `.c`，是最基本的工程拆分方式：`int add(int a, int b);` 这句声明告诉编译器「有这么个函数，参数和返回值是这样」。' },
            { t: 'table', head: ['写法', '含义'], rows: [
              ['`void f(int a)`', '按值传，函数内改不到外面'],
              ['`void f(int *a)`', '传地址，函数内 `*a = 1` 能改到外面'],
              ['`int f(void)`', '不收参数，返回 int'],
              ['`static int f()`', '只在本文件可见，避免命名冲突']
            ] }
          ]
        },
        {
          id: 'c4l2', title: '指针：地址与解引用', key: '& · * · NULL', time: 14,
          blocks: [
            { t: 'p', x: '每个变量都住在内存的某个位置，这个位置有个编号，叫**地址**。`&x` 取出 x 的地址，`int *p = &x` 把这个地址存进 p——p 就是指针。`*p` 表示「去 p 存的地址，取那里的值」。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int x = 42;\n    int *p = &x;\n\n    printf("x = %d\\n", x);\n    printf("*p = %d\\n", *p);        /* 解引用：拿到 42 */\n    *p = 100;                        /* 通过指针改 x */\n    printf("x = %d\\n", x);\n    printf("p 是地址：%s\\n", p == &x ? "和 &x 相同" : "不同");\n    return 0;\n}', out: 'x = 42\n*p = 42\nx = 100\np 是地址：和 &x 相同' },
            { t: 'table', head: ['写法', '读法', '类型'], rows: [
              ['`int x`', '一个整数', 'int'],
              ['`&x`', 'x 的地址', 'int *'],
              ['`int *p`', '存 int 地址的指针', 'int *'],
              ['`*p`', 'p 指向的那个 int', 'int'],
              ['`int **pp`', '指向指针的指针', 'int **']
            ] },
            { t: 'warn', x: '**`*` 在声明里和表达式里意思不同**：`int *p` 的 `*` 表示「p 是指针」；`*p = 1` 的 `*` 表示「取 p 指向的东西」。看到 `*` 先判断自己在声明里还是表达式里。' },
            { t: 'warn', x: '野指针比越界更危险：`int *p; *p = 1;` 里 p 没初始化，指向一个随机地址，写进去就是随机的破坏。指针声明时就初始化成 `NULL`，用之前判断非空。' }
          ]
        },
        {
          id: 'c4l3', title: '指针做参数与数组退化', key: '数组 → 指针', time: 12,
          blocks: [
            { t: 'p', x: '数组作为参数传给函数时，会**退化**成指向首元素的指针，长度信息丢了。所以 C 的数组处理函数标准写法是两个参数：`(int *a, int n)`。' },
            { t: 'code', x: '#include <stdio.h>\n\nint sum(int *a, int n) {       /* 等价于 int a[] */\n    int s = 0;\n    for (int i = 0; i < n; i++) s += a[i];\n    return s;\n}\n\nvoid fill(int *a, int n, int v) {\n    for (int i = 0; i < n; i++) a[i] = v;\n}\n\nint main(void) {\n    int data[4] = {1, 2, 3, 4};\n    printf("sum = %d\\n", sum(data, 4));\n    fill(data, 4, 9);\n    printf("%d %d %d %d\\n", data[0], data[1], data[2], data[3]);\n    return 0;\n}', out: 'sum = 10\n9 9 9 9' },
            { t: 'p', x: '为什么 `a[i]` 和 `*(a + i)` 完全等价？因为 `a[i]` 的定义就是 `*(a + i)`。指针加 1 不是加 1 字节，而是**跳过一整个元素**（int 就是 4 字节）。这也是 `a[i]` 能写成 `i[a]` 的原因——虽然没人这么写。' },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[4] = {10, 20, 30, 40};\n    int *p = a;\n    printf("%d\\n", *p);\n    p++;\n    printf("%d\\n", *p);\n    printf("%d\\n", *(p + 2));\n    printf("%d\\n", p[2]);      /* 同一个东西 */\n    return 0;\n}', out: '10\n20\n40\n40' },
            { t: 'note', x: '想「改到外面」的函数，除了传指针，还可以 `return` 一个值。只有当需要**返回多个值**（如同时给出最大和最小）或**修改已有数组**时，指针参数才是必需的。' }
          ]
        }
      ]
    },
    {
      id: 'c5', num: 5, title: '结构体与动态内存', icon: '🧱',
      intro: '结构体让你把相关的数据打包成一个整体，动态内存让你按需申请空间。这两块合起来，C 才能表达链表、树这些真正的数据结构。',
      goals: ['用 struct / typedef 定义复合类型', '用 . 和 -> 访问成员', '用 malloc / free 管理堆内存', '认出内存泄漏与悬空指针'],
      lessons: [
        {
          id: 'c5l1', title: 'struct：把数据打成一包', key: 'struct · typedef · ->', time: 12,
          blocks: [
            { t: 'p', x: '现实中一个「学生」有姓名、学号、成绩，用一个 struct 装起来，函数参数就能从三个变成一个。' },
            { t: 'code', x: '#include <stdio.h>\n#include <string.h>\n\ntypedef struct {\n    char name[16];\n    int id;\n    double score;\n} Student;\n\nint main(void) {\n    Student s;\n    strcpy(s.name, "小明");\n    s.id = 1001;\n    s.score = 92.5;\n    printf("%s %d %.1f\\n", s.name, s.id, s.score);\n\n    Student t = {"小红", 1002, 88.0};   /* 按顺序初始化 */\n    printf("%s %d %.1f\\n", t.name, t.id, t.score);\n    return 0;\n}', out: '小明 1001 92.5\n小红 1002 88.0' },
            { t: 'h', x: '指针访问用 ->' },
            { t: 'code', x: '#include <stdio.h>\n#include <string.h>\n\ntypedef struct { char name[16]; int age; } Person;\n\nvoid birthday(Person *p) {\n    p->age++;                 /* 等价于 (*p).age++ */\n}\n\nint main(void) {\n    Person a;\n    strcpy(a.name, "阿伟");\n    a.age = 20;\n    birthday(&a);\n    printf("%s %d\\n", a.name, a.age);\n    return 0;\n}', out: '阿伟 21' },
            { t: 'table', head: ['写法', '用在什么上'], rows: [
              ['`s.name`', '结构体变量本体'],
              ['`p->name`', '结构体指针，`->` 是 `(*p).name` 的简写'],
              ['`(*p).name`', '同上，老老实实的写法'],
              ['`s = t`', '同类型结构体可以整体赋值（成员逐个复制）']
            ] },
            { t: 'note', x: '结构体里含数组时不能直接 `s.name = "小明"` —— 数组名不是左值。要么 `strcpy`，要么用初始化列表。这是从其他语言过来最容易踩的一脚。' }
          ]
        },
        {
          id: 'c5l2', title: 'malloc 与 free', key: '堆内存 · 泄漏', time: 14,
          blocks: [
            { t: 'p', x: '数组大小必须在编译时确定，或者至少是栈上固定的。要在运行时决定大小，就得用**堆内存**：`malloc` 申请，用指针访问，`free` 归还。申请多少字节由你算，C 不会帮你检查。' },
            { t: 'code', x: '#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n = 5;\n    int *a = malloc(n * sizeof(int));   /* 申请 5 个 int */\n    if (a == NULL) {                    /* 一定要判断 */\n        printf("内存不足\\n");\n        return 1;\n    }\n    for (int i = 0; i < n; i++) a[i] = i * i;\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    printf("\\n");\n\n    free(a);        /* 还给系统 */\n    a = NULL;       /* 防止悬空指针 */\n    return 0;\n}', out: '0 1 4 9 16 ' },
            { t: 'table', head: ['函数', '作用'], rows: [
              ['`malloc(n)`', '申请 n 字节，内容**不初始化**'],
              ['`calloc(k, n)`', '申请 k×n 字节并清零'],
              ['`realloc(p, n)`', '把 p 调整到 n 字节，可能搬家'],
              ['`free(p)`', '释放，之后 p 不能再解引用']
            ] },
            { t: 'warn', x: '三种经典错误：① **内存泄漏**——malloc 了没 free，程序越跑越吃内存；② **double free**——同一个指针 free 两次，直接崩；③ **use after free**——free 之后还通过指针读写，拿到的是垃圾。free 后立刻置 NULL 能挡住第三条。' },
            { t: 'principle', x: '**谁申请，谁释放。** 写函数时先想清楚：这块内存是「调用方负责 free」还是「函数内部 free」？把这条规则写进注释，比事后用工具查泄漏便宜得多。' }
          ]
        }
      ]
    },
    {
      id: 'c6', num: 6, title: '文件与调试', icon: '🔍',
      intro: '最后一块拼图：让数据在程序退出后还在，以及程序崩了怎么查。这两件事决定你的代码能不能真正被人用起来。',
      goals: ['用 fopen / fclose 读写文本文件', '判断常见崩溃原因', '用 -Wall 和打印排查问题'],
      lessons: [
        {
          id: 'c6l1', title: '文件读写', key: 'fopen · fprintf · EOF', time: 12,
          blocks: [
            { t: 'p', x: '文件操作的固定节奏：`fopen` 拿到文件指针 → 读写 → `fclose`。打开失败时 `fopen` 返回 `NULL`，不判断就用会立刻崩溃。' },
            { t: 'table', head: ['模式', '含义', '文件不存在时'], rows: [
              ['"r"', '只读', '失败，返回 NULL'],
              ['"w"', '只写，清空原内容', '新建'],
              ['"a"', '追加', '新建'],
              ['"r+"', '读写，不清空', '失败'],
              ['"rb" "wb"', '二进制模式', 'Windows 上必须用它处理非文本']
            ] },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    const char *path = "demo_cc.txt";\n\n    FILE *fp = fopen(path, "w");\n    if (fp == NULL) { printf("打开失败\\n"); return 1; }\n    for (int i = 1; i <= 3; i++) fprintf(fp, "第 %d 行\\n", i);\n    fclose(fp);\n\n    fp = fopen(path, "r");\n    if (fp == NULL) { printf("打开失败\\n"); return 1; }\n    char line[64];\n    int cnt = 0;\n    while (fgets(line, sizeof(line), fp) != NULL) cnt++;\n    fclose(fp);\n\n    printf("读回 %d 行\\n", cnt);\n    return 0;\n}', out: '读回 3 行' },
            { t: 'note', x: '`fgets` 会把换行符一起读进来（如果放得下），并且最多读 `size-1` 个字符，天然防溢出——比 `gets` 安全得多（`gets` 已被 C11 移除）。' },
            { t: 'warn', x: '在线环境里通常允许写临时文件，但**别指望文件在下次运行还在**。真实项目要检查 `fopen` 失败并给出可读的提示，而不是让用户面对一个段错误。' }
          ]
        },
        {
          id: 'c6l2', title: '崩溃排查：段错误与未定义行为', key: 'segfault · UB', time: 12,
          blocks: [
            { t: 'p', x: 'C 不会在你犯错时喊停，它只会照做，然后在某个毫无关系的地方崩掉。学会从「崩在哪」反推「错在哪」，是 C 的核心技能。' },
            { t: 'table', head: ['症状', '最可能的原因', '怎么查'], rows: [
              ['Segmentation fault', '空指针解引用 / 越界写 / 野指针', '在可疑位置加 `printf` 或 fprintf(stderr)'],
              ['输出全是乱码', '字符串缺 `\\0`，或 `%s` 传了非字符串', '检查结尾有没有封口'],
              ['数字大得离谱', '`scanf` 漏了 `&`，或格式符与类型不匹配', '对照 `%d`/`%f`/`%lf`'],
              ['程序卡住不动', '循环条件永远成立 / 死循环', '在循环里打印计数器'],
              ['结果每次都不一样', '读了未初始化变量 / 未定义行为', '用 `-Wall -Wextra` 重编']
            ] },
            { t: 'code', x: '#include <stdio.h>\n\nint main(void) {\n    int a[3] = {1, 2, 3};\n    /* 三类危险的写法，注释掉才能安全运行 */\n    /* int *p = NULL; printf("%d", *p); */\n    /* a[5] = 10;                       */\n    /* char s[3] = "abc"; printf("%s", s); */\n\n    printf("安全地遍历：");\n    for (int i = 0; i < 3; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}', out: '安全地遍历：1 2 3 ' },
            { t: 'code', x: '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char s[4] = "abc";     /* 4 字节刚好装下 a b c \\0 */\n    printf("len=%zu size=%zu\\n", strlen(s), sizeof(s));\n    char t[3] = {\'a\', \'b\', \'c\'};   /* 没封口 */\n    printf("t[0]=%c 三个字符仍然可读\\n", t[0]);\n    return 0;\n}', out: 'len=3 size=4\nt[0]=a 三个字符仍然可读' },
            { t: 'principle', x: '**先用 -Wall 把警告清零，再谈逻辑对不对。** C 的编译器能帮你抓掉大半低级错误，前提是你愿意看它的提示。' }
          ]
        }
      ]
    }
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
      explain: '`%5d` 右对齐补空格到 5 位，`%-5d` 左对齐。`%.2f` 保留两位小数并四舍五入。`\'A\'+1` 是 B，`\'Z\'-25` 是 A（字符本质是整数）。' },
    { id: 'cq4', ch: 'c1', lesson: 'c1l3', point: 'sizeof', type: 'choice', diff: 1,
      prompt: '在常见 64 位平台上，`sizeof(double)` 和 `sizeof(char)` 分别是？',
      opts: ['4 和 1', '8 和 1', '8 和 2', '4 和 2'],
      ans: 1,
      explain: '`char` 恒为 1 字节（C 标准规定），`double` 通常是 8 字节。`float` 才是 4 字节。' },
    { id: 'cq5', ch: 'c1', lesson: 'c1l3', point: '整数除法', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int a = 7, b = 2;\n    printf("%d\\n", a / b);\n    printf("%.1f\\n", a / (double)b);\n    printf("%.1f\\n", (a + 0.0) / b);\n    return 0;\n}',
      answer: '3\n3.5\n3.5',
      explain: '两个整数相除结果是整数，7/2 得 3，小数被截掉。只要有一个操作数是浮点，运算就会升格成浮点除法，所以后两行都是 3.5。' },
    { id: 'cq6', ch: 'c2', lesson: 'c2l1', point: '自增顺序', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int i = 3;\n    printf("%d ", i++);\n    printf("%d ", ++i);\n    printf("%d\\n", i);\n    return 0;\n}',
      answer: '3 5 5',
      explain: '`i++` 先输出 3 再变 4；`++i` 先加到 5 再输出 5；最后 i 就是 5。' },
    { id: 'cq7', ch: 'c2', lesson: 'c2l2', point: '短路求值', type: 'choice', diff: 2,
      prompt: '`int *p = NULL; if (p != NULL && *p > 0) {...}` 这段代码会怎样？',
      opts: ['崩溃，因为解引用了空指针', '条件为假，跳过分支，不会崩溃', '条件为真，进入分支', '编译报错'],
      ans: 1,
      explain: '`&&` 左边 `p != NULL` 为假，右边 `*p > 0` 根本不会被求值，所以安全。把顺序反过来写就必崩——这就是短路求值的实用价值。' },
    { id: 'cq8', ch: 'c2', lesson: 'c2l3', point: '循环', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    for (int i = 0; i < 6; i++) {\n        if (i == 1) continue;\n        if (i == 4) break;\n        printf("%d", i);\n    }\n    return 0;\n}',
      answer: '023',
      explain: 'i=0 打印 0；i=1 被 continue 跳过；i=2、3 打印；i=4 触发 break 结束循环。' },
    { id: 'cq9', ch: 'c3', lesson: 'c3l1', point: '数组长度', type: 'choice', diff: 2,
      prompt: '`int a[6];` 中，合法的下标范围是？',
      opts: ['1 到 6', '0 到 6', '0 到 5', '1 到 5'],
      ans: 2,
      explain: '长度 6 的数组下标是 0~5。写 `a[6]` 越界，而 C 不会报错，只会悄悄破坏别的内存。' },
    { id: 'cq10', ch: 'c3', lesson: 'c3l2', point: '字符串结尾', type: 'choice', diff: 1,
      prompt: '`char s[] = "hi";` 这个数组占几个字节？',
      opts: ['2', '3', '4', '取决于编译器'],
      ans: 1,
      explain: '`"hi"` 是 2 个字符加 1 个结尾的 `\\0`，共 3 字节。漏掉这个 0 是字符串乱码的头号原因。' },
    { id: 'cq11', ch: 'c3', lesson: 'c3l3', point: '字符串比较', type: 'choice', diff: 2,
      prompt: '判断两个字符串内容是否相等，正确写法是？',
      opts: ['if (a == b)', 'if (strcmp(a, b) == 0)', 'if (strlen(a) == strlen(b))', 'if (*a == *b)'],
      ans: 1,
      explain: '`==` 比较的是两个数组名退化成指针后的地址，永远不相等（除非同一个数组）。`strcmp` 返回 0 表示内容一致。' },
    { id: 'cq12', ch: 'c3', lesson: 'c3l3', point: 'strlen', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <stdio.h>\n#include <string.h>\nint main(void) {\n    char s[10] = "abc";\n    printf("%zu %zu\\n", strlen(s), sizeof(s));\n    return 0;\n}',
      answer: '3 10',
      explain: '`strlen` 数到 `\\0` 前的字符数，是 3；`sizeof` 是数组占的总字节，声明多大就是多大，即 10。' },
    { id: 'cq13', ch: 'c4', lesson: 'c4l1', point: '值传递', type: 'choice', diff: 2,
      prompt: '`void f(int x) { x = 99; }` 调用 `f(n)` 之后，n 的值是？',
      opts: ['99', '不变', '0', '未定义'],
      ans: 1,
      explain: 'C 只有值传递，函数里改的是形参这份副本，实参 n 不受影响。要改到外面必须传 `&n`。' },
    { id: 'cq14', ch: 'c4', lesson: 'c4l2', point: '指针解引用', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int x = 5;\n    int *p = &x;\n    *p = *p * 2;\n    printf("%d %d\\n", x, *p);\n    return 0;\n}',
      answer: '10 10',
      explain: '`p` 指向 `x`，`*p = *p * 2` 就是把 x 改成 10。之后 `x` 和 `*p` 是同一块内存，自然都是 10。' },
    { id: 'cq15', ch: 'c4', lesson: 'c4l3', point: '数组退化', type: 'choice', diff: 3,
      prompt: '在函数 `void f(int a[10])` 内部，`sizeof(a)` 的值是？',
      opts: ['40', '10', '8（指针大小）', '编译错误'],
      ans: 2,
      explain: '数组作参数会退化成指针，`int a[10]` 里的 10 只是给人看的注释。函数内 `sizeof(a)` 得到的是指针大小。所以长度必须单独传。' },
    { id: 'cq16', ch: 'c5', lesson: 'c5l1', point: 'struct 访问', type: 'choice', diff: 2,
      prompt: '`Person *p` 指向一个结构体，访问它的 age 成员应该写？',
      opts: ['p.age', 'p->age', '*p.age', '&p.age'],
      ans: 1,
      explain: '指针用 `->`；变量本体用 `.`。`p->age` 等价于 `(*p).age`，而 `*p.age` 会被解析成 `*(p.age)`，直接报错。' },
    { id: 'cq17', ch: 'c5', lesson: 'c5l2', point: 'malloc', type: 'choice', diff: 2,
      prompt: '`int *a = malloc(5 * sizeof(int));` 之后，正确做法是？',
      opts: ['直接使用，malloc 一定成功', '先判断 a 是否为 NULL，用完再 free(a)', '无需 free，程序结束会自动回收', '必须用 calloc，malloc 不给 int 用'],
      ans: 1,
      explain: 'malloc 失败会返回 NULL，不判断就解引用会崩。堆内存必须在不用时 free——虽然进程退出时系统会回收，但长期运行的程序会一路泄漏。' },
    { id: 'cq18', ch: 'c6', lesson: 'c6l2', point: '崩溃排查', type: 'choice', diff: 2,
      prompt: '程序运行时立刻 `Segmentation fault`，最不可能的原因是？',
      opts: ['解引用了 NULL 指针', '数组下标越界写', '用了未初始化的指针', 'printf 里字符串写成了中文'],
      ans: 3,
      explain: '中文在 printf 里只是字节更多（UTF-8 每个汉字 3 字节），不会导致段错误。前三个都会访问非法内存，是段错误的主要来源。' }
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
      opts: ['scanf("%d", n)', 'scanf("%d", &n)', 'scanf("%f", &n)', 'n = scanf("%d")'],
      ans: 1,
      explain: '读 int 必须传地址 `&n`，scanf 要往那个地址写数据。漏掉 `&` 是运行崩溃的经典原因。' },
    { id: 'ck4', ch: 'c1', point: 'sizeof 运算', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int a[4];\n    printf("%zu %zu\\n", sizeof(a), sizeof(a) / sizeof(a[0]));\n    return 0;\n}',
      answer: '16 4',
      explain: '4 个 int 共 16 字节；除以单个 int 的 4 字节得元素个数 4。这是 C 里求数组长度的标准写法。' },
    { id: 'ck5', ch: 'c2', point: '取模', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    printf("%d %d\\n", 17 % 5, -17 % 5);\n    return 0;\n}',
      answer: '2 -2',
      explain: '`%` 的结果符号跟被除数一致。17 = 5×3 + 2；-17 = 5×(-3) + (-2)。判断奇偶时建议用 `x % 2 != 0` 而不是 `== 1`，负数才不出错。' },
    { id: 'ck6', ch: 'c2', point: '逗号与赋值', type: 'choice', diff: 2,
      prompt: '`if (x = 0)` 这行代码的实际效果是？',
      opts: ['判断 x 是否等于 0', '把 0 赋给 x，条件为假', '把 0 赋给 x，条件为真', '编译错误'],
      ans: 1,
      explain: '单个 `=` 是赋值。赋值表达式的值就是赋进去的值，0 转成布尔是假，所以永远不进分支。这类 bug 一开 `-Wall` 就会警告。' },
    { id: 'ck7', ch: 'c2', point: 'while 循环', type: 'code', diff: 2,
      scene: '做个小工具：统计一个整数有几位数字，用来校验用户输入的卡号长度。',
      prompt: '读入一个正整数 n，输出它的位数。例如 2026 输出 4。',
      starter: '#include <stdio.h>\n\nint main(void) {\n    int n;\n    if (scanf("%d", &n) != 1) return 1;\n    /* 在这里写代码 */\n    return 0;\n}',
      tests: [{ in: '2026', out: '4' }, { in: '9', out: '1' }],
      solution: '#include <stdio.h>\n\nint main(void) {\n    int n;\n    if (scanf("%d", &n) != 1) return 1;\n    int cnt = 0;\n    while (n > 0) {\n        cnt++;\n        n /= 10;\n    }\n    printf("%d\\n", cnt);\n    return 0;\n}',
      explain: '每次 `n /= 10` 相当于砍掉最后一位，砍到 0 为止，砍了几次就是几位数。循环次数不确定，用 while 最自然。' },
    { id: 'ck8', ch: 'c3', point: '数组初始化', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: '#include <stdio.h>\nint main(void) {\n    int a[5] = {3, 1};\n    printf("%d %d %d\\n", a[0], a[1], a[4]);\n    return 0;\n}',
      answer: '3 1 0',
      explain: '前两个按给的初始化，未写到的元素在部分初始化时自动填 0。所以 a[2] 到 a[4] 都是 0。' },
    { id: 'ck9', ch: 'c3', point: '字符与整数', type: 'choice', diff: 2,
      prompt: '字符 `\'0\'` 的 ASCII 值是 48，那么 `\'0\' - \'0\'` 的结果是？',
      opts: ['字符 0', '整数 0', '48', '编译错误'],
      ans: 1,
      explain: '两个字符相减得到的是**整数**，48 - 48 = 0。这就是 `c - \'0\'` 能把数字字符转成数值的原因，例如 `\'7\' - \'0\'` 得 7。' },
    { id: 'ck10', ch: 'c3', point: '字符串拼接', type: 'code', diff: 2,
      scene: '生成用户名：把姓和名的首字母拼起来，中间不加空格。',
      prompt: '读入两个不含空格的字符串（各不超过 15 字符），把它们直接拼接后输出。例如输入 `hello` 和 `world`，输出 `helloworld`。',
      starter: '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char a[16], b[16], out[40];\n    if (scanf("%15s %15s", a, b) != 2) return 1;\n    /* 在这里写代码 */\n    return 0;\n}',
      tests: [{ in: 'hello world', out: 'helloworld' }, { in: 'C Craft', out: 'CCraft' }],
      solution: '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char a[16], b[16], out[40];\n    if (scanf("%15s %15s", a, b) != 2) return 1;\n    strcpy(out, a);\n    strcat(out, b);\n    printf("%s\\n", out);\n    return 0;\n}',
      explain: '先用 `strcpy` 把 a 放进 out，再用 `strcat` 追加 b。关键是 out 必须足够大（至少 31 字节），否则拼接会溢出。' },
    { id: 'ck11', ch: 'c4', point: '返回多个值', type: 'code', diff: 3,
      scene: '一次测量得到两个数，需要同时知道较大值和较小值，函数只能 return 一个，那就用指针带出来。',
      prompt: '读入两个整数，用一次函数调用同时得到最大值和最小值，按 `max min` 顺序输出。',
      starter: '#include <stdio.h>\n\nvoid minmax(int a, int b, int *mx, int *mn) {\n    /* 在这里写代码 */\n}\n\nint main(void) {\n    int a, b, mx, mn;\n    if (scanf("%d %d", &a, &b) != 2) return 1;\n    minmax(a, b, &mx, &mn);\n    printf("%d %d\\n", mx, mn);\n    return 0;\n}',
      tests: [{ in: '3 9', out: '9 3' }, { in: '7 2', out: '7 2' }],
      solution: '#include <stdio.h>\n\nvoid minmax(int a, int b, int *mx, int *mn) {\n    if (a > b) { *mx = a; *mn = b; }\n    else       { *mx = b; *mn = a; }\n}\n\nint main(void) {\n    int a, b, mx, mn;\n    if (scanf("%d %d", &a, &b) != 2) return 1;\n    minmax(a, b, &mx, &mn);\n    printf("%d %d\\n", mx, mn);\n    return 0;\n}',
      explain: '两个指针参数就是两个「出口」。写 `*mx = a` 是往调用方的变量里写值，这是 C 里返回多值的标准手法。' },
    { id: 'ck12', ch: 'c4', point: '指针与取地址', type: 'choice', diff: 1,
      prompt: '`int n = 10; int *p = &n;` 中，`&n` 表示什么？',
      opts: ['n 的值', 'n 的地址', '指向 n 的指针的大小', 'n 的副本'],
      ans: 1,
      explain: '`&` 是取地址运算符，`&n` 的类型是 `int *`。把它存进 p，p 就指向 n。' },
    { id: 'ck13', ch: 'c5', point: '结构体初始化', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: '#include <stdio.h>\n\ntypedef struct { int x, y; } Point;\n\nint main(void) {\n    Point p = {3, 4};\n    Point q = p;\n    q.x = 10;\n    printf("%d %d\\n", p.x, q.x);\n    return 0;\n}',
      answer: '3 10',
      explain: '`Point q = p` 是**整体复制**，q 是一份独立的数据，改 q.x 不影响 p.x。这和数组不能整体赋值形成对比。' },
    { id: 'ck14', ch: 'c5', point: 'free 之后', type: 'choice', diff: 2,
      prompt: '`free(p)` 之后立刻做什么最安全？',
      opts: ['什么都不用做', '把 p 置为 NULL', '再 free 一次确保释放干净', '把 p 指向别的变量'],
      ans: 1,
      explain: 'free 之后 p 变成悬空指针，再解引用就是未定义行为。置 NULL 后，任何误用都会立刻崩在明确的位置，好过随机破坏。' },
    { id: 'ck15', ch: 'c5', point: 'calloc', type: 'choice', diff: 2,
      prompt: '和 `malloc` 相比，`calloc` 的特点是？',
      opts: ['速度快一倍', '申请的内存自动清零', '不需要 free', '能申请更大空间'],
      ans: 1,
      explain: '`calloc(k, size)` 会把申请到的内存全部置 0。需要「初始为空」的数组（如计数数组）时用它可以少写一个清零循环。' },
    { id: 'ck16', ch: 'c6', point: '文件模式', type: 'choice', diff: 2,
      prompt: '想往一个已存在的文件末尾追加内容，应该用哪种模式打开？',
      opts: ['"r"', '"w"', '"a"', '"r+"'],
      ans: 2,
      explain: '`"a"` 是追加模式，写入总在末尾且不会清空原内容。`"w"` 会先把文件清空——这是误删数据最常见的原因。' },
    { id: 'ck17', ch: 'c6', point: '输入循环', type: 'code', diff: 2,
      scene: '成绩录入程序要一直读到没有数据为止，这是处理不定长输入的标准写法。',
      prompt: '不断读入整数，直到读到 0 为止（0 不计入），输出这些数的和。例如输入 `3 4 5 0`，输出 `12`。',
      starter: '#include <stdio.h>\n\nint main(void) {\n    int x, sum = 0;\n    /* 在这里写代码 */\n    printf("%d\\n", sum);\n    return 0;\n}',
      tests: [{ in: '3 4 5 0', out: '12' }, { in: '10 0', out: '10' }],
      solution: '#include <stdio.h>\n\nint main(void) {\n    int x, sum = 0;\n    while (scanf("%d", &x) == 1 && x != 0) {\n        sum += x;\n    }\n    printf("%d\\n", sum);\n    return 0;\n}',
      explain: '`scanf` 返回成功读到的个数，读到文件末尾会返回 EOF（-1），所以 `== 1` 既能判断格式也能判断结束。条件里再补 `x != 0` 就是终止符。' },
    { id: 'ck18', ch: 'c6', point: '警告的价值', type: 'choice', diff: 1,
      prompt: '编译时加 `-Wall` 的作用是？',
      opts: ['让程序运行更快', '打开常用警告，暴露潜在问题', '自动修复代码错误', '生成调试符号'],
      ans: 1,
      explain: '`-Wall` 打开一组常用警告（未使用变量、格式符不匹配、缺少 return 等）。它不改变生成的程序行为，但能提前发现大量隐患。' }
  ]
};
