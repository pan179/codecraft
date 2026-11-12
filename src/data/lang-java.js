/* ============================================================
   CodeCraft 数据 · Java（9 章 40 课）
   ============================================================ */
window.LANGS = window.LANGS || {};

window.LANGS.java = {
  id: 'java', name: 'Java', en: 'Java 21', icon: '☕', color: '#b07219',
  blurb: '企业级后端的主力语言。强类型、面向对象、生态成熟，学会它再去看 Spring、Android 会顺很多。',
  hello: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}',
  lab: [
    { name: 'Hello World', code: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n        System.out.println("今天开始学编程");\n    }\n}' },
    { name: '读两个数求和', code: 'import java.util.Scanner;\n\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println("和 = " + (a + b));\n    }\n}' },
    { name: '遍历数组求平均', code: 'class Main {\n    public static void main(String[] args) {\n        int[] a = {80, 92, 66, 100, 71};\n        int sum = 0;\n        for (int x : a) sum += x;\n        System.out.printf("avg = %.2f%n", (double) sum / a.length);\n    }\n}' },
    { name: '集合统计', code: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Map<String, Integer> m = new TreeMap<>();\n        for (String w : "the cat the dog the bird".split(" ")) {\n            m.merge(w, 1, Integer::sum);\n        }\n        System.out.println(m);\n    }\n}' }
  ],
  chapters: [
    {
      id: 'j1', num: 1, title: '入门与环境', icon: '🚀',
      intro: 'Java 和 C 一样要编译，但它编译出的不是机器码，而是**字节码**——由 JVM 执行。这个设计让「一次编译，到处运行」成为可能，也解释了为什么你只需要装 JDK，不用管 CPU 型号。',
      goals: ['说清 JDK、JRE、JVM 的关系', '用 javac / java 编译并运行一个类', '认识八种基本类型与取值范围', '正确做类型转换与字符串转数字'],
      lessons: [
        {
          id: 'j1l1', title: 'JVM、字节码与跨平台', key: 'JDK · JRE · 字节码', time: 12,
          blocks: [
            { t: 'p', x: 'Java 源码编译成**字节码**（`.class`），字节码不是给 CPU 的，而是给 **JVM**（Java 虚拟机）的。每个平台装一套自己的 JVM，同一份 `.class` 就能到处跑。' },
            { t: 'table', head: ['名字', '是什么', '包含什么'], rows: [
              ['JVM', '虚拟机，执行字节码', '解释器 + JIT 编译器 + 垃圾回收'],
              ['JRE', '运行环境', 'JVM + 标准类库'],
              ['JDK', '开发工具包', 'JRE + javac + javadoc + jdb 等工具']
            ] },
            { t: 'p', x: '**装 JDK 就够了**，它包含 JRE 和 JVM。只装 JRE 能运行别人的程序但编译不了自己的代码——这是新手最常见的困惑之一。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n        System.out.println(3 + 4);\n        System.out.println("3" + "4");\n        System.out.println("总分 " + 95 + " 分");\n    }\n}', out: 'Hello, Java!\n7\n34\n总分 95 分' },
            { t: 'note', x: '`System.out.println` 里，`+` 只要有一边是字符串就变成拼接。所以 `"总分 " + 95 + " 分"` 得到的是文字拼接，不是加法——想先算再加，用括号：`"总分 " + (90 + 5)`。' },
            { t: 'warn', x: '文件名必须和 `public class` 的名字完全一致（区分大小写）。`public class Main` 必须存在 `Main.java` 里，否则报 `class Main is public, should be declared in a file named Main.java`。' }
          ]
        },
        {
          id: 'j1l2', title: '第一段代码与运行流程', key: 'javac · java · main', time: 12,
          blocks: [
            { t: 'p', x: '一个 Java 程序从 `main` 开始。`main` 的签名是固定的：`public static void main(String[] args)`。四个部分少一个都跑不起来，JVM 就是按这个签名找入口的。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("参数个数：" + args.length);\n        for (String a : args) System.out.println("参数：" + a);\n        System.out.println("程序结束");\n    }\n}', out: '参数个数：0\n程序结束' },
            { t: 'code', run: false, label: '终端', x: '> javac Main.java          # 编译，生成 Main.class\n> java Main                # 运行（写类名，不写 .class）\n参数个数：0\n程序结束\n\n> java Main hello 世界     # 传命令行参数\n参数个数：2\n参数：hello\n参数：世界\n程序结束' },
            { t: 'table', head: ['关键字', '含义', '去掉会怎样'], rows: [
              ['`public`', 'JVM 需要从外部调用它', '找不到入口，报「main 方法不是 public」'],
              ['`static`', '不创建对象也能调用', 'JVM 无法在不 new 的情况下调用'],
              ['`void`', '不返回值', '签名不匹配，仍然找不到'],
              ['`String[] args`', '接收命令行参数', '签名不匹配']
            ] },
            { t: 'note', x: '`System.out.print` 不换行，`println` 换行，`printf` 支持格式化。想输出带小数位的数字用 `printf("%.2f%n", x)`，`%n` 是跨平台的换行符。' },
            { t: 'warn', x: '运行时要写 `java Main`，**不能写 `java Main.class`**。另外当前目录必须在 classpath 里（默认就是），换目录运行要加 `-cp`。' }
          ]
        },
        {
          id: 'j1l3', title: '八种基本类型', key: 'int · long · double · boolean', time: 14,
          blocks: [
            { t: 'p', x: 'Java 有八种基本类型，**大小在所有平台都一样**（这点比 C 友好）。它们不是对象，没有方法，存在栈上，速度最快。' },
            { t: 'table', head: ['类型', '大小', '范围 / 说明', '默认值'], rows: [
              ['byte', '1 字节', '-128 ~ 127', '0'],
              ['short', '2 字节', '-32768 ~ 32767', '0'],
              ['int', '4 字节', '约 ±21 亿，默认整数', '0'],
              ['long', '8 字节', '字面量要加 `L`', '0L'],
              ['float', '4 字节', '字面量要加 `f`', '0.0f'],
              ['double', '8 字节', '默认浮点类型', '0.0'],
              ['char', '2 字节', 'Unicode 字符，\'A\' 或 65', '\'\\u0000\''],
              ['boolean', '1 位（逻辑）', '只有 true / false', 'false']
            ] },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        byte b = 100;\n        int i = 2_000_000_000;\n        long l = 9_000_000_000L;      // 超过 int 范围必须加 L\n        float f = 3.14f;              // 必须加 f，否则被当成 double\n        double d = 3.14159;\n        char c = \'A\';\n        boolean ok = true;\n\n        System.out.println(b + " " + i);\n        System.out.println(l);\n        System.out.println(f + " " + d);\n        System.out.println(c + " " + ok);\n        System.out.println((int) c);\n    }\n}', out: '100 2000000000\n9000000000\n3.14 3.14159\nA true\n65' },
            { t: 'note', x: '数字里可以用下划线分组：`1_000_000` 和 `1000000` 完全一样，只是好读。这个特性从 Java 7 开始支持。' },
            { t: 'warn', x: '**Java 里没有无符号类型**（除了 Java 8 的 `Integer.parseUnsignedInt` 等工具方法）。所有整数都是有符号的，处理二进制协议时要注意。' },
            { t: 'principle', x: '**整数默认 `int`，小数默认 `double`，字符用 `char`，开关用 `boolean`。** 需要更大范围才用 `long`，需要省内存才用 `byte` / `short`。' }
          ]
        },
        {
          id: 'j1l4', title: '类型转换与字符串互转', key: '自动提升 · 强转 · parseInt', time: 12,
          blocks: [
            { t: 'p', x: '小范围转大范围是**自动**的（`byte → int → long → float → double`）；反过来必须**强制转换**，可能丢精度。这条规则和 C 一致，但 Java 会检查得更严。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        int i = 300;\n        byte b = (byte) i;          // 只留低 8 位\n        System.out.println(b);\n\n        double d = 3.99;\n        int t = (int) d;            // 截断，不是四舍五入\n        System.out.println(t);\n        System.out.println(Math.round(d));\n\n        System.out.println((double) 7 / 2);\n        System.out.println(7 / 2);\n    }\n}', out: '44\n3\n4\n3.5\n3' },
            { t: 'h', x: '字符串 ↔ 数字' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        String s = "42";\n        int n = Integer.parseInt(s);\n        System.out.println(n + 1);\n\n        double d = Double.parseDouble("3.14");\n        System.out.println(d * 2);\n\n        String back = String.valueOf(123);\n        System.out.println(back.length());\n        System.out.println("" + 456);\n        System.out.println(Integer.toBinaryString(10));\n    }\n}', out: '43\n6.28\n3\n456\n1010' },
            { t: 'warn', x: '`Integer.parseInt("abc")` 会抛 `NumberFormatException`。用户输入必须先判断或捕获异常——这是后端接口最常见的 500 错误来源之一。' },
            { t: 'note', x: '`Integer.parseInt("42")` 和 `Integer.valueOf("42")` 都行，前者返回 `int`，后者返回 `Integer` 对象。日常业务里前者更直接，集合里必须用后者。' }
          ]
        }
      ]
    },
    {
      id: 'j2', num: 2, title: '语法与流程控制', icon: '🔀',
      intro: 'Java 的语法和 C 很像，但多了几样顺手的工具：增强 for、switch 表达式、可变参数。这一章把流程控制写熟，后面面向对象才跑得起来。',
      goals: ['熟练使用算术、比较、逻辑与位运算', '用 if / switch 写多分支', '用 for / while / 增强 for 遍历', '定义数组并调用方法'],
      lessons: [
        {
          id: 'j2l1', title: '运算符与优先级', key: '算术 · 比较 · 位运算', time: 12,
          blocks: [
            { t: 'p', x: '运算符和 C 基本一致：算术、比较、逻辑、位运算、三目。区别在于 Java 的**逻辑运算只接受 boolean**，`if (1)` 直接编译报错，不像 C 里非零即真。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        System.out.println(7 / 2);\n        System.out.println(7 % 2);\n        System.out.println(7.0 / 2);\n\n        int i = 5;\n        System.out.println(i++);\n        System.out.println(++i);\n\n        System.out.println(1 == 1 && 2 > 1);\n        System.out.println(true ? "y" : "n");\n        System.out.println(0b1010 & 0b0110);\n        System.out.println(1 << 4);\n    }\n}', out: '3\n1\n3.5\n5\n7\ntrue\ny\n2\n16' },
            { t: 'table', head: ['运算符', '说明', '坑'], rows: [
              ['`/`', '整数相除截断', '想得小数先转 double'],
              ['`%`', '取余', '负数取余结果符号跟被除数'],
              ['`==`', '比较值', '比较**对象**时比的是地址，字符串要用 `equals`'],
              ['`instanceof`', '判断类型', 'Java 16+ 支持 `o instanceof String s` 直接转型'],
              ['`>>>`', '无符号右移', '高位补 0，`>>` 补符号位']
            ] },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        String a = "hi";\n        String b = "hi";\n        String c = new String("hi");\n\n        System.out.println(a == b);\n        System.out.println(a == c);\n        System.out.println(a.equals(c));\n        System.out.println(a.isEmpty());\n    }\n}', out: 'true\nfalse\ntrue\nfalse' },
            { t: 'warn', x: '**字符串比较永远用 `equals`，不要用 `==`。** `==` 比的是引用地址，两个内容相同的字符串可能因为创建方式不同而 `==` 为 false。这是 Java 里最容易踩的坑，没有之一。' },
            { t: 'note', x: '`a == b` 上面是 true，因为字面量 "hi" 存在常量池里，两个变量指向同一份。`new String("hi")` 强制在堆上新建，所以 `a == c` 是 false。' }
          ]
        },
        {
          id: 'j2l2', title: 'if 与 switch', key: '分支 · switch 表达式', time: 12,
          blocks: [
            { t: 'p', x: '`if` 的条件**必须是 boolean**。Java 不允许 `if (1)`、`if (ptr)` 这种写法，这消除了一整类 C 里的隐式转换 bug。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        int score = 85;\n        if (score >= 90) System.out.println("优秀");\n        else if (score >= 60) System.out.println("及格");\n        else System.out.println("不及格");\n\n        String grade = score >= 90 ? "A" : score >= 60 ? "B" : "C";\n        System.out.println(grade);\n    }\n}', out: '及格\nB' },
            { t: 'h', x: 'switch：从语句到表达式' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        int m = 3;\n\n        // 老写法：会穿透，要自己写 break\n        switch (m) {\n            case 3:\n            case 4: System.out.println("春季"); break;\n            default: System.out.println("其他");\n        }\n\n        // Java 14+ 新写法：箭头后面不用 break，也不会穿透\n        String s = switch (m) {\n            case 3, 4 -> "春季";\n            case 6, 7, 8 -> "夏季";\n            default -> "其他";\n        };\n        System.out.println(s);\n\n        // 需要多行逻辑时用 yield 返回\n        int days = switch (m) {\n            case 2 -> 28;\n            case 4, 6, 9, 11 -> 30;\n            default -> { yield 31; }\n        };\n        System.out.println(days);\n    }\n}', out: '春季\n春季\n31' },
            { t: 'note', x: '`switch` 支持 `int`、`String`、`enum`、`char`，**不支持 long 和 double**。判断范围用 if，判断具体值用 switch。' },
            { t: 'warn', x: '老式 `switch` 忘了 `break` 就会穿透（继续执行下一个 case）。新式箭头语法彻底消除了这个问题，新代码优先用它。' }
          ]
        },
        {
          id: 'j2l3', title: '循环与增强 for', key: 'for · while · for-each', time: 12,
          blocks: [
            { t: 'p', x: 'Java 的循环和 C 几乎一样，多了**增强 for（for-each）**：`for (int x : arr)`。它专门用来遍历，不能改下标、不能边遍历边删元素。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 3; i++) System.out.print(i + " ");\n        System.out.println();\n\n        int n = 0, sum = 0;\n        while (n < 10) { n += 3; sum += n; }\n        System.out.println("n=" + n + " sum=" + sum);\n\n        int k = 0;\n        do { k++; } while (k < 5);\n        System.out.println("k=" + k);\n    }\n}', out: '0 1 2 \nn=12 sum=30\nk=5' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        int[] a = {3, 1, 4, 1, 5};\n        int sum = 0;\n        for (int x : a) sum += x;\n        System.out.println("sum=" + sum);\n\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] % 2 == 0) continue;\n            if (i > 3) break;\n            System.out.print(a[i] + " ");\n        }\n        System.out.println();\n    }\n}', out: 'sum=14\n3 1 1 ' },
            { t: 'table', head: ['循环', '适用场景', '注意'], rows: [
              ['`for (i...)`', '次数已知、需要下标', '最常见'],
              ['`for (x : arr)`', '只读遍历', '不能拿到下标；遍历时删除元素会抛异常'],
              ['`while`', '条件驱动、次数未知', '别忘了让条件有机会变假'],
              ['`do-while`', '至少执行一次', '条件在末尾，末尾要分号']
            ] },
            { t: 'warn', x: '用增强 for 遍历集合时**不能 `list.remove(x)`**，会抛 `ConcurrentModificationException`。要删就用 `Iterator.remove()` 或 `removeIf`。' }
          ]
        },
        {
          id: 'j2l4', title: '数组与工具类', key: '数组 · Arrays', time: 12,
          blocks: [
            { t: 'p', x: 'Java 的数组是**对象**，有 `length` 属性（不是方法），创建时长度固定，且会自动做越界检查——越界立刻抛 `ArrayIndexOutOfBoundsException`，不像 C 那样默默踩内存。' },
            { t: 'code', x: 'import java.util.Arrays;\n\nclass Main {\n    public static void main(String[] args) {\n        int[] a = {5, 2, 9, 1};\n        System.out.println(a.length);\n        System.out.println(Arrays.toString(a));\n\n        Arrays.sort(a);\n        System.out.println(Arrays.toString(a));\n\n        int[] b = new int[3];\n        System.out.println(Arrays.toString(b));\n        System.out.println(Arrays.binarySearch(a, 5));\n    }\n}', out: '4\n[5, 2, 9, 1]\n[1, 2, 5, 9]\n[0, 0, 0]\n2' },
            { t: 'h', x: '二维数组与不规则数组' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        int[][] m = {{1, 2, 3}, {4, 5, 6}};\n        System.out.println(m.length + " " + m[0].length);\n        System.out.println(m[1][2]);\n\n        // 每行长度可以不同（Java 的二维数组是「数组的数组」）\n        int[][] t = new int[3][];\n        for (int i = 0; i < 3; i++) t[i] = new int[i + 1];\n        System.out.println(t[0].length + " " + t[2].length);\n    }\n}', out: '2 3\n6\n1 3' },
            { t: 'note', x: '`Arrays.toString(a)` 打印一维数组，`Arrays.deepToString(m)` 打印二维。直接 `System.out.println(a)` 会输出 `[I@1b6d3586` 这种地址串。' },
            { t: 'warn', x: '`Arrays.binarySearch` **要求数组已排序**，否则结果不可预测。它的返回值：找到了返回下标，没找到返回 `-(插入点) - 1`（负数）。' }
          ]
        },
        {
          id: 'j2l5', title: '方法、重载与递归', key: '方法 · 重载 · 值传递', time: 14,
          blocks: [
            { t: 'p', x: '方法是类的成员，必须写在类里。**同名但参数列表不同**叫重载（overload），编译器根据实参类型决定调哪个——这是 Java 多态的第一种形式（编译期）。' },
            { t: 'code', x: 'class Main {\n    static int add(int a, int b) { return a + b; }\n    static int add(int a, int b, int c) { return a + b + c; }\n    static double add(double a, double b) { return a + b; }\n    static String add(String a, String b) { return a + b; }\n\n    static int fact(int n) { return n <= 1 ? 1 : n * fact(n - 1); }\n\n    public static void main(String[] args) {\n        System.out.println(add(2, 3));\n        System.out.println(add(2, 3, 4));\n        System.out.println(add(2.5, 3.5));\n        System.out.println(add("ab", "cd"));\n        System.out.println(fact(5));\n    }\n}', out: '5\n9\n6.0\nabcd\n120' },
            { t: 'h', x: 'Java 也只有值传递' },
            { t: 'code', x: 'import java.util.Arrays;\n\nclass Main {\n    static void change(int x) { x = 100; }\n    static void changeArr(int[] a) { a[0] = 100; }\n    static void reassign(int[] a) { a = new int[]{9, 9}; }\n\n    public static void main(String[] args) {\n        int n = 1;\n        change(n);\n        System.out.println(n);\n\n        int[] arr = {1, 2, 3};\n        changeArr(arr);\n        System.out.println(Arrays.toString(arr));\n\n        reassign(arr);\n        System.out.println(Arrays.toString(arr));\n    }\n}', out: '1\n[100, 2, 3]\n[100, 2, 3]' },
            { t: 'p', x: '`changeArr` 改到了数组，是因为传的是**引用的副本**，副本和原变量指向同一个数组对象。`reassign` 想让 a 指向新数组，但改的只是副本，外面的 `arr` 不受影响——这就是「Java 只有值传递」的确切含义。' },
            { t: 'note', x: '可变参数 `static int sum(int... nums)` 让调用方随便传几个参数（含 0 个），函数里当数组用。它必须是参数列表的最后一个。' },
            { t: 'warn', x: '**重载不能只靠返回类型区分**。`int f()` 和 `double f()` 同时存在会编译报错，因为调用时编译器无法推断你要哪个。' }
          ]
        }
      ]
    },
    {
      id: 'j3', num: 3, title: '面向对象基础', icon: '🧱',
      intro: 'Java 的一切都在类里。这一章讲清「类 vs 对象」「构造器 vs 方法」「private vs public」，以及 static 到底属于谁。这些概念一旦立住，后面的继承、接口就都顺了。',
      goals: ['定义类、创建对象、访问成员', '写构造器并用 this 串联', '用 private + getter 实现封装', '说清 static 成员属于类而不属于对象'],
      lessons: [
        {
          id: 'j3l1', title: '类与对象', key: 'class · new · 成员', time: 14,
          blocks: [
            { t: 'p', x: '**类**是模板，**对象**是按模板造出来的实例。`new Student()` 做了三件事：在堆上分配内存 → 初始化成员变量为默认值 → 调用构造器。' },
            { t: 'code', x: 'class Student {\n    String name;\n    int age;\n    double score;\n\n    void say() {\n        System.out.println(name + " 今年 " + age + " 岁，成绩 " + score);\n    }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Student s = new Student();\n        s.name = "小明";\n        s.age = 19;\n        s.score = 92.5;\n        s.say();\n\n        Student t = new Student();\n        t.name = "小红";\n        t.age = 20;\n        t.say();\n    }\n}', out: '小明 今年 19 岁，成绩 92.5\n小红 今年 20 岁，成绩 0.0' },
            { t: 'p', x: '两个对象的 `score` 互不影响。`t` 没赋值，所以是默认值 `0.0`——**成员变量有默认值，局部变量没有**，这一条区别很重要。' },
            { t: 'table', head: ['概念', '说明'], rows: [
              ['成员变量', '写在类里，有默认值，随对象存活'],
              ['局部变量', '写在方法里，必须手动初始化'],
              ['方法', '对象的行为，可以访问成员变量'],
              ['引用', '`s` 里存的是对象地址，不是对象本身']
            ] },
            { t: 'code', x: 'class Counter { int n; }\n\nclass Main {\n    public static void main(String[] args) {\n        Counter a = new Counter();\n        Counter b = a;              // 复制的是引用，不是对象\n        b.n = 10;\n        System.out.println(a.n);    // a 也变了\n\n        Counter c = new Counter();\n        System.out.println(c.n);    // 新对象，还是默认值\n    }\n}', out: '10\n0' },
            { t: 'warn', x: '`Counter b = a;` 不会复制对象，只是让两个变量指向同一个对象。想要副本必须 `new` 一个新的再逐个字段复制，或者用 `clone()` / 拷贝构造器。' }
          ]
        },
        {
          id: 'j3l2', title: '构造器与 this', key: '构造 · 重载 · this()', time: 14,
          blocks: [
            { t: 'p', x: '构造器和类同名、没有返回类型，`new` 的时候自动调用。它可以重载；用 `this(...)` 在一个构造器里调用另一个，避免重复初始化代码。' },
            { t: 'code', x: 'class Student {\n    String name;\n    int age;\n\n    Student() { this("未命名", 0); }        // 必须放在第一行\n    Student(String name) { this(name, 18); }\n    Student(String name, int age) {\n        this.name = name;                    // this.name 指成员变量\n        this.age = age;\n    }\n\n    @Override\n    public String toString() {\n        return "Student(" + name + "," + age + ")";\n    }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(new Student());\n        System.out.println(new Student("小明"));\n        System.out.println(new Student("小红", 20));\n    }\n}', out: 'Student(未命名,0)\nStudent(小明,18)\nStudent(小红,20)' },
            { t: 'note', x: '`@Override` 是注解，写上后如果方法名拼错，编译会报错。它不改变行为，但能帮你当场发现错误——所有重写方法都该加。' },
            { t: 'code', x: 'class Point {\n    final int x, y;\n\n    Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    Point move(int dx, int dy) { return new Point(x + dx, y + dy); }\n\n    @Override\n    public String toString() { return "(" + x + "," + y + ")"; }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Point p = new Point(1, 2);\n        Point q = p.move(3, 4);\n        System.out.println(p);\n        System.out.println(q);\n    }\n}', out: '(1,2)\n(4,6)' },
            { t: 'warn', x: '**一旦自己写了带参数的构造器，编译器就不再自动生成无参构造器。** 很多框架（Spring、Jackson）要求类有无参构造器，所以习惯上顺手补一个 `public Foo() {}`。' },
            { t: 'principle', x: '**`final` 字段 = 创建后不可变。** 加上它就等于告诉所有人「这个对象是只读的」，多线程下也不用担心被改。' }
          ]
        },
        {
          id: 'j3l3', title: '封装与访问修饰符', key: 'private · getter · 校验', time: 12,
          blocks: [
            { t: 'p', x: '封装的意思是：**字段私有，行为公开**。外部只能通过你提供的方法改数据，你就有机会做校验、记日志、保持一致性。这是把「可能出错」变成「不可能出错」的基本手法。' },
            { t: 'table', head: ['修饰符', '本类', '同包', '子类', '任意'], rows: [
              ['`private`', '✓', '✗', '✗', '✗'],
              ['（默认，不写）', '✓', '✓', '✗', '✗'],
              ['`protected`', '✓', '✓', '✓', '✗'],
              ['`public`', '✓', '✓', '✓', '✓']
            ] },
            { t: 'code', x: 'class Account {\n    private double balance;              // 外部不能直接改\n\n    Account(double init) { if (init >= 0) balance = init; }\n\n    public double getBalance() { return balance; }\n\n    public void deposit(double v) {\n        if (v <= 0) throw new IllegalArgumentException("金额必须为正");\n        balance += v;\n    }\n\n    public boolean withdraw(double v) {\n        if (v <= 0 || v > balance) return false;\n        balance -= v;\n        return true;\n    }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Account a = new Account(100);\n        a.deposit(50);\n        System.out.println(a.getBalance());\n        System.out.println(a.withdraw(30));\n        System.out.println(a.getBalance());\n        System.out.println(a.withdraw(1000));\n        try { a.deposit(-1); }\n        catch (IllegalArgumentException e) { System.out.println("拒绝：" + e.getMessage()); }\n    }\n}', out: '150.0\ntrue\n120.0\nfalse\n拒绝：金额必须为正' },
            { t: 'p', x: '如果 `balance` 是 public，别人可以直接 `a.balance = -999`，你的所有校验都白做了。私有 + 方法，是唯一能让「规则始终成立」的结构。' },
            { t: 'note', x: 'IDE 能一键生成 getter / setter，但**不要无脑全生成**。只暴露真正需要读的字段；需要改的，优先提供有语义的方法（`deposit` 比 `setBalance` 好得多）。' },
            { t: 'warn', x: '`IllegalArgumentException` 是**非受检异常**，方法签名不用声明 throws。适合「参数本身就不合法」的情况，调用方愿意处理就处理。' }
          ]
        },
        {
          id: 'j3l4', title: 'static 与初始化顺序', key: 'static · 代码块 · 类变量', time: 12,
          blocks: [
            { t: 'p', x: '`static` 成员属于**类**，不属于对象：所有实例共享同一份，可以直接用 `类名.成员` 访问，不需要 new。它适合放常量、工具方法、全局计数。' },
            { t: 'code', x: 'class Counter {\n    static int total = 0;        // 类变量，所有对象共享\n    int id;                      // 实例变量，每个对象一份\n\n    static { System.out.println("静态块：类加载时执行一次"); }\n\n    { id = ++total; }            // 实例块：每次 new 都执行\n\n    static int getTotal() { return total; }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Counter a = new Counter();\n        Counter b = new Counter();\n        System.out.println(a.id + " " + b.id);\n        System.out.println(Counter.getTotal());\n        System.out.println(Counter.total);\n    }\n}', out: '静态块：类加载时执行一次\n1 2\n2\n2' },
            { t: 'table', head: ['执行顺序', '内容', '次数'], rows: [
              ['1', '静态变量默认值 → 静态初始化 → 静态块', '类加载时一次'],
              ['2', '实例变量默认值 → 实例初始化 → 实例块', '每次 new'],
              ['3', '构造器方法体', '每次 new']
            ] },
            { t: 'h', x: '工具类：全是 static 方法' },
            { t: 'code', x: 'class MathUtil {\n    private MathUtil() {}        // 私有构造器：禁止被 new\n\n    static int max(int a, int b) { return a > b ? a : b; }\n    static boolean isEven(int n) { return n % 2 == 0; }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(MathUtil.max(3, 7));\n        System.out.println(MathUtil.isEven(4));\n    }\n}', out: '7\ntrue' },
            { t: 'warn', x: '**static 方法里不能直接访问实例成员**（没有 this）。编译器会报 `non-static variable cannot be referenced from a static context`，这是新手最常见的报错之一。' },
            { t: 'note', x: '常量写成 `static final`：`public static final int MAX = 100;`。`static` 表示共享一份，`final` 表示不可改，两者合起来才是不变的全局常量。' }
          ]
        },
        {
          id: 'j3l5', title: '包、import 与访问控制', key: 'package · import', time: 10,
          blocks: [
            { t: 'p', x: '包（package）是类的命名空间，也是目录结构。`package com.demo.model;` 意味着这个文件必须放在 `com/demo/model/` 目录下，否则编译报错。' },
            { t: 'code', x: 'import java.util.ArrayList;\nimport java.util.List;\n\nclass Main {\n    public static void main(String[] args) {\n        List<String> list = new ArrayList<>();\n        list.add("a");\n        list.add("b");\n        System.out.println(list.size());\n        System.out.println(list);\n        System.out.println(list.contains("a"));\n    }\n}', out: '2\n[a, b]\ntrue' },
            { t: 'table', head: ['import 写法', '含义'], rows: [
              ['`import java.util.List;`', '引入单个类（推荐）'],
              ['`import java.util.*;`', '引入整个包（省事但可能撞名）'],
              ['`import static java.lang.Math.*;`', '引入静态成员，可直接写 `max(1,2)`'],
              ['`java.util.List<String> x`', '不 import 就写全限定名']
            ] },
            { t: 'note', x: '`java.lang` 包（String、System、Math、Object）是**自动导入**的，不用写 import。这就是为什么你从没 import 过 String 却能直接用。' },
            { t: 'warn', x: '不要用 `java.util.*` 和 `java.sql.*` 同时导入——两边都有 `Date`，编译器会报「引用不明确」。用到哪个导哪个，能避免这类冲突。' }
          ]
        }
      ]
    },
    {
      id: 'j4', num: 4, title: '面向对象进阶', icon: '🧬',
      intro: '继承复用代码，多态让代码「对扩展开放」，接口定义契约，抽象类提供半成品。这四个概念是 Java 设计的骨架，也是面试里问得最深的部分。',
      goals: ['写继承并用 super 调用父类', '解释重写与动态绑定', '区分抽象类与接口的使用场景', '写枚举和内部类'],
      lessons: [
        {
          id: 'j4l1', title: '继承与 super', key: 'extends · super', time: 14,
          blocks: [
            { t: 'p', x: '`extends` 表示「是一种」。子类自动拥有父类的**非私有**成员，还能加自己的东西。Java 只支持**单继承**（一个类只能有一个直接父类），多继承靠接口实现。' },
            { t: 'code', x: 'class Animal {\n    String name;\n\n    Animal(String name) { this.name = name; }\n\n    void speak() { System.out.println(name + " 发出声音"); }\n}\n\nclass Dog extends Animal {\n    Dog(String name) {\n        super(name);              // 调用父类构造器，必须是第一行\n    }\n\n    @Override\n    void speak() {\n        System.out.println(name + " 汪汪");\n    }\n\n    void fetch() { System.out.println(name + " 捡球"); }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Dog d = new Dog("旺财");\n        d.speak();\n        d.fetch();\n\n        Animal a = d;             // 向上转型，自动\n        a.speak();\n    }\n}', out: '旺财 汪汪\n旺财 捡球\n旺财 汪汪' },
            { t: 'p', x: '`Animal a = d;` 之后 `a.speak()` 仍然输出「汪汪」，这就是**动态绑定**：调哪个方法看对象的真实类型（Dog），不看变量的声明类型（Animal）。' },
            { t: 'table', head: ['关键字', '作用'], rows: [
              ['`super(...)`', '调用父类构造器，只能在构造器第一行'],
              ['`super.method()`', '调用父类被重写的方法'],
              ['`this(...)`', '调用本类另一个构造器，也只能在第一行'],
              ['`final` 类', '不能被继承（如 String）'],
              ['`final` 方法', '不能被重写']
            ] },
            { t: 'warn', x: '**父类没有无参构造器时，子类必须显式 `super(参数)`**。否则编译器报 `constructor Animal in class Animal cannot be applied to given types`。' },
            { t: 'note', x: '继承的坏处是「耦合」：父类一改，所有子类都受影响。所以设计原则是**优先组合，谨慎继承**——除非确实是「is-a」关系，否则用「有一个」代替「是一种」。' }
          ]
        },
        {
          id: 'j4l2', title: '重写、多态与类型判断', key: 'override · 动态绑定', time: 14,
          blocks: [
            { t: 'p', x: '**重写（override）** 是子类重新实现父类的方法，签名必须一致；**重载（overload）** 是同名不同参数。多态指的是：同一个方法调用，根据对象的真实类型执行不同代码。' },
            { t: 'code', x: 'class Animal { void speak() { System.out.println("..."); } }\nclass Dog extends Animal { @Override void speak() { System.out.println("汪汪"); } }\nclass Cat extends Animal { @Override void speak() { System.out.println("喵喵"); } }\n\nclass Main {\n    public static void main(String[] args) {\n        Animal[] zoo = { new Dog(), new Cat(), new Dog() };\n        for (Animal a : zoo) a.speak();    // 运行时才决定调哪个\n\n        for (Animal a : zoo) {\n            if (a instanceof Cat c) {       // Java 16+ 模式匹配\n                System.out.println("发现猫：" + c.getClass().getSimpleName());\n            }\n        }\n    }\n}', out: '汪汪\n喵喵\n汪汪\n发现猫：Cat' },
            { t: 'table', head: ['对比项', '重写 override', '重载 overload'], rows: [
              ['发生位置', '子类与父类之间', '同一个类里'],
              ['方法名', '相同', '相同'],
              ['参数列表', '必须完全相同', '必须不同'],
              ['返回类型', '相同或是子类型', '可以不同'],
              ['绑定时机', '运行时（动态）', '编译时（静态）']
            ] },
            { t: 'h', x: '向下转型要先用 instanceof 判断' },
            { t: 'code', x: 'class Animal { }\nclass Dog extends Animal { void fetch() { System.out.println("捡球"); } }\n\nclass Main {\n    public static void main(String[] args) {\n        Animal a = new Dog();\n        if (a instanceof Dog d) {\n            d.fetch();                      // 转型成功才能调子类方法\n        }\n\n        Animal b = new Animal();\n        System.out.println(b instanceof Dog);\n        try {\n            Dog bad = (Dog) b;              // 运行时抛异常\n            bad.fetch();\n        } catch (ClassCastException e) {\n            System.out.println("转型失败：" + e.getClass().getSimpleName());\n        }\n    }\n}', out: '捡球\nfalse\n转型失败：ClassCastException' },
            { t: 'warn', x: '**向下转型是运行时检查的**：`(Dog) new Animal()` 编译能过，运行会抛 `ClassCastException`。所以转之前一定要 `instanceof` 判断，或者直接用模式匹配 `if (a instanceof Dog d)`。' },
            { t: 'principle', x: '**多态的价值在于「新增类型不用改旧代码」。** 加一个 `Cat` 不需要动 `for (Animal a : zoo)` 那一行，这是开闭原则在代码里的具体样子。' }
          ]
        },
        {
          id: 'j4l3', title: '抽象类：半成品模板', key: 'abstract · 模板方法', time: 12,
          blocks: [
            { t: 'p', x: '抽象类用 `abstract` 声明，**不能 new**，可以有抽象方法（没方法体）也可以有具体方法。它适合「有一半逻辑能复用，另一半必须每个子类自己实现」的场景。' },
            { t: 'code', x: 'abstract class Shape {\n    abstract double area();              // 子类必须实现\n\n    void describe() {                    // 具体方法，子类直接复用\n        System.out.println(getName() + " 面积 " + area());\n    }\n\n    String getName() { return getClass().getSimpleName(); }\n}\n\nclass Circle extends Shape {\n    double r;\n    Circle(double r) { this.r = r; }\n    @Override double area() { return Math.PI * r * r; }\n}\n\nclass Rect extends Shape {\n    double w, h;\n    Rect(double w, double h) { this.w = w; this.h = h; }\n    @Override double area() { return w * h; }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Shape[] ss = { new Circle(1), new Rect(3, 4) };\n        for (Shape s : ss) s.describe();\n    }\n}', out: 'Circle 面积 3.141592653589793\nRect 面积 12.0' },
            { t: 'p', x: '`describe()` 是**模板方法**：它定义了「先取名字、再算面积、然后打印」的流程，具体面积怎么算交给子类。这种「父类定流程、子类填细节」的写法就是模板方法模式。' },
            { t: 'table', head: ['对比项', '抽象类', '接口'], rows: [
              ['能否有构造器', '有', '没有'],
              ['能否有实例字段', '能', '只能有 `public static final` 常量'],
              ['能否多继承', '只能单继承', '可以实现多个'],
              ['方法实现', '可以有具体方法', '默认方法 / 静态方法 / 私有方法'],
              ['什么关系', 'is-a（是一种）', 'can-do（能做）']
            ] },
            { t: 'warn', x: '抽象类**不能 new**，但可以声明引用：`Shape s = new Circle(1);`。`new Shape()` 会直接编译错误：`Shape is abstract; cannot be instantiated`。' },
            { t: 'note', x: '抽象类里可以不写任何抽象方法（此时只是「不允许实例化」），也可以全是抽象方法。有抽象方法的类**必须**声明为 abstract。' }
          ]
        },
        {
          id: 'j4l4', title: '接口：定义契约', key: 'interface · default · 多实现', time: 14,
          blocks: [
            { t: 'p', x: '接口只描述「能做什么」，不管怎么做。一个类可以 `implements` 多个接口，这是 Java 实现多继承能力的方式。Java 8 之后接口可以有 `default` 和 `static` 方法。' },
            { t: 'code', x: 'interface Payable {\n    double pay();                        // 默认就是 public abstract\n\n    default String receipt() {           // 默认方法：子类可复用可重写\n        return "金额 " + pay();\n    }\n\n    static Payable zero() { return () -> 0; }\n}\n\nclass Salary implements Payable {\n    private final double base;\n    Salary(double base) { this.base = base; }\n    @Override public double pay() { return base * 1.2; }\n}\n\nclass Bonus implements Payable {\n    private final double v;\n    Bonus(double v) { this.v = v; }\n    @Override public double pay() { return v; }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Payable[] ps = { new Salary(1000), new Bonus(500), Payable.zero() };\n        for (Payable p : ps) System.out.println(p.receipt());\n    }\n}', out: '金额 1200.0\n金额 500.0\n金额 0.0' },
            { t: 'h', x: '多接口组合' },
            { t: 'code', x: 'interface Flyable { default String move() { return "飞"; } }\ninterface Swimmable { default String move() { return "游"; } }\n\nclass Duck implements Flyable, Swimmable {\n    @Override public String move() {\n        return Flyable.super.move() + " + " + Swimmable.super.move();\n    }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(new Duck().move());\n    }\n}', out: '飞 + 游' },
            { t: 'note', x: '当两个接口有**同名的 default 方法**时，实现类必须重写它，并用 `接口名.super.方法()` 明确调哪个。不写就编译报错——这是 Java 避免「菱形继承歧义」的方式。' },
            { t: 'warn', x: '接口里的字段**隐式是 `public static final`**。写 `int X = 1;` 实际是常量，改不了。要在接口里放可变状态是不可能的。' },
            { t: 'principle', x: '**面向接口编程**：方法的参数和返回值尽量用接口类型（`List`、`Payable`），不用具体实现（`ArrayList`、`Salary`）。这样换实现时调用方一行都不用改。' }
          ]
        },
        {
          id: 'j4l5', title: '枚举、内部类与 record', key: 'enum · 内部类 · record', time: 14,
          blocks: [
            { t: 'p', x: '枚举不是「一堆常量的集合」那么简单：它可以有字段、构造器和方法，本质是一个**固定实例数的类**。用它代替 int 常量，类型安全和可读性都会好很多。' },
            { t: 'code', x: 'enum Level {\n    LOW(1), MID(5), HIGH(10);\n\n    private final int weight;\n    Level(int w) { this.weight = w; }\n    int weight() { return weight; }\n\n    Level next() { return this == LOW ? MID : HIGH; }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(Level.MID);\n        System.out.println(Level.MID.ordinal());\n        System.out.println(Level.MID.weight());\n        System.out.println(Level.MID.next());\n        for (Level l : Level.values()) System.out.print(l + "(" + l.weight() + ") ");\n        System.out.println();\n        System.out.println(Level.valueOf("HIGH"));\n    }\n}', out: 'MID\n1\n5\nHIGH\nLOW(1) MID(5) HIGH(10) \nHIGH' },
            { t: 'h', x: '内部类与 record' },
            { t: 'code', x: 'class Outer {\n    private int secret = 42;\n\n    class Inner {                       // 普通内部类：能访问外部实例成员\n        int peek() { return secret; }\n    }\n\n    static class Nested {               // 静态嵌套类：不依赖外部实例\n        int twice(int x) { return x * 2; }\n    }\n}\n\nrecord Point(int x, int y) {           // Java 16+：一行得到一个不可变值类\n    Point {\n        if (x < 0) throw new IllegalArgumentException("x 不能为负");\n    }\n    int manhattan() { return Math.abs(x) + Math.abs(y); }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Outer o = new Outer();\n        System.out.println(o.new Inner().peek());\n        System.out.println(new Outer.Nested().twice(21));\n\n        Point p = new Point(3, -4);\n        System.out.println(p);\n        System.out.println(p.x() + " " + p.y());\n        System.out.println(p.manhattan());\n        System.out.println(p.equals(new Point(3, -4)));\n    }\n}', out: '42\n42\nPoint[x=3, y=-4]\n3 -4\n7\ntrue' },
            { t: 'note', x: '`record` 自动生成构造器、`equals`、`hashCode`、`toString` 和访问器（`x()` 而不是 `getX()`）。用来传数据（DTO、返回值）非常省事，但它是**不可变**的。' },
            { t: 'warn', x: '普通内部类持有外部类的引用，容易造成**内存泄漏**（外部对象本该回收却被内部类拖着）。Android 里常见的「Handler 泄漏」就是这个原因，能静态就静态。' }
          ]
        }
      ]
    },
    {
      id: 'j5', num: 5, title: '常用 API', icon: '🧰',
      intro: '真正写业务时，80% 的代码在和 String、集合、时间、正则打交道。这一章把这些 API 的**常用方法**过一遍，并标出容易出错的地方。',
      goals: ['熟练用 String 的查找、截取、替换', '知道什么时候用 StringBuilder', '用 java.time 处理日期与格式化', '写基本的正则并理解贪婪匹配'],
      lessons: [
        {
          id: 'j5l1', title: 'String 的不可变性', key: 'String · 常用方法', time: 14,
          blocks: [
            { t: 'p', x: 'String 是**不可变对象**：所有「修改」方法都返回一个新字符串，原对象不变。这个设计让字符串可以安全共享、可以缓存哈希值，代价是频繁拼接会产生大量临时对象。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        String s = "  Hello, Java!  ";\n        System.out.println("[" + s.trim() + "]");\n        System.out.println(s.trim().toUpperCase());\n        System.out.println(s.contains("Java"));\n        System.out.println(s.trim().replace("Java", "World"));\n        System.out.println(s.length());\n        System.out.println(s.trim().charAt(1));\n        System.out.println(s.trim().substring(1, 4));\n        System.out.println(s.indexOf("Java"));\n    }\n}', out: '[Hello, Java!]\nHELLO, JAVA!\ntrue\nHello, World!\n16\ne\nell\n9' },
            { t: 'table', head: ['方法', '作用', '注意'], rows: [
              ['`length()`', '字符个数', '是方法，不是属性（区别于数组的 `length`）'],
              ['`substring(a, b)`', '截取 `[a, b)`', '不含 b；越界抛异常'],
              ['`indexOf(s)`', '首次出现位置', '找不到返回 -1'],
              ['`split(regex)`', '按正则切分', '参数是正则，`"."` 要转义成 `"\\\\."`'],
              ['`equals(o)`', '内容比较', '不要用 `==`'],
              ['`compareTo(s)`', '字典序比较', '返回负数/0/正数']
            ] },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        String a = "hello";\n        String b = a.toUpperCase();\n        System.out.println(a);          // 原对象没变\n        System.out.println(b);\n        System.out.println(a == b);\n\n        String c = "a" + "b";           // 编译期就合并成 "ab"\n        String d = "ab";\n        System.out.println(c == d);\n\n        String e = a + "!";             // 运行时拼的，是新对象\n        String f = "hello!";\n        System.out.println(e == f);\n        System.out.println(e.equals(f));\n    }\n}', out: 'hello\nHELLO\nfalse\ntrue\nfalse\ntrue' },
            { t: 'warn', x: '**`==` 的坑在于它有时为 true 有时为 false**：字面量在常量池里会复用，`new` 出来的和运行时拼出来的不会。所以规则只有一条——比较内容永远用 `equals`，比较是否是同一对象才用 `==`。' }
          ]
        },
        {
          id: 'j5l2', title: 'StringBuilder 与包装类', key: '可变字符串 · 装箱', time: 14,
          blocks: [
            { t: 'p', x: '循环里拼接字符串是性能杀手：每次 `+` 都创建一个新 String，n 次拼接产生 n 个对象。`StringBuilder` 内部是可变数组，只在最后 `toString()` 时生成一次字符串。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        StringBuilder sb = new StringBuilder("hello");\n        sb.append(" world").insert(0, ">> ");\n        System.out.println(sb);\n        System.out.println(sb.reverse());\n        System.out.println(sb.length());\n\n        String s = "";\n        for (int i = 0; i < 3; i++) s += i;\n        System.out.println(s);\n    }\n}', out: '>> hello world\ndlrow olleh >>\n14\n012' },
            { t: 'table', head: ['类', '可变', '线程安全', '用在'], rows: [
              ['`String`', '否', '是（因为不可变）', '常量、map 的 key'],
              ['`StringBuilder`', '是', '否', '单线程拼接（默认选它）'],
              ['`StringBuffer`', '是', '是（加锁）', '多线程共享拼接，很少用']
            ] },
            { t: 'h', x: '包装类与自动装箱' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        Integer a = 127, b = 127;\n        Integer c = 128, d = 128;\n        System.out.println(a == b);\n        System.out.println(c == d);\n        System.out.println(c.equals(d));\n\n        Integer n = null;\n        try {\n            int x = n;                  // 自动拆箱，空指针\n            System.out.println(x);\n        } catch (NullPointerException e) {\n            System.out.println("拆箱空指针：" + e.getClass().getSimpleName());\n        }\n\n        System.out.println(Integer.MAX_VALUE + 1);\n        System.out.println(Integer.toBinaryString(10));\n    }\n}', out: 'true\nfalse\ntrue\n拆箱空指针：NullPointerException\n-2147483648\n1010' },
            { t: 'p', x: '`Integer` 缓存了 -128~127 的对象，所以 `a == b` 为 true；128 超出缓存，两个独立对象，`==` 为 false。**这条规则不要背，直接记住「包装类用 equals」就行**。' },
            { t: 'warn', x: '**`Integer n = null; int x = n;` 会抛空指针**。自动拆箱时对 null 调用 `intValue()` 就崩了。接口里用包装类接参数时，这个坑非常常见。' },
            { t: 'note', x: '`Integer.MAX_VALUE + 1` 会**溢出成最小负数**，而且不报错。要处理大数用 `BigInteger`，要防溢出用 `Math.addExact`（溢出会抛异常）。' }
          ]
        },
        {
          id: 'j5l3', title: '日期与时间（java.time）', key: 'LocalDate · 格式化', time: 14,
          blocks: [
            { t: 'p', x: '老的 `Date` / `Calendar` 设计糟糕（月份从 0 开始、可变、非线程安全），Java 8 引入了 `java.time`：`LocalDate`（日期）、`LocalTime`（时间）、`LocalDateTime`（两者）、`Instant`（时间戳）。**新代码一律用它**。' },
            { t: 'code', x: 'import java.time.*;\nimport java.time.temporal.ChronoUnit;\n\nclass Main {\n    public static void main(String[] args) {\n        LocalDate d = LocalDate.of(2024, 2, 29);\n        System.out.println(d);\n        System.out.println(d.plusDays(1));\n        System.out.println(d.getDayOfWeek());\n        System.out.println(d.isLeapYear());\n\n        LocalDate end = LocalDate.of(2024, 12, 31);\n        System.out.println(ChronoUnit.DAYS.between(d, end));\n    }\n}', out: '2024-02-29\n2024-03-01\nTHURSDAY\ntrue\n306' },
            { t: 'code', x: 'import java.time.*;\nimport java.time.format.DateTimeFormatter;\n\nclass Main {\n    public static void main(String[] args) {\n        LocalTime t = LocalTime.of(9, 5, 3);\n        System.out.println(t);\n        System.out.println(t.format(DateTimeFormatter.ofPattern("HH:mm:ss")));\n        System.out.println(t.plusMinutes(60));\n\n        LocalDate d = LocalDate.parse("2024-03-01");\n        System.out.println(d.getMonthValue());\n        System.out.println(d.format(DateTimeFormatter.ofPattern("yyyy年MM月dd日")));\n\n        LocalDateTime dt = LocalDateTime.of(d, t);\n        System.out.println(dt);\n    }\n}', out: '09:05:03\n09:05:03\n10:05:03\n3\n2024年03月01日\n2024-03-01T09:05:03' },
            { t: 'table', head: ['需求', '用什么'], rows: [
              ['只要日期', '`LocalDate`'],
              ['只要时间', '`LocalTime`'],
              ['日期 + 时间', '`LocalDateTime`'],
              ['带时区', '`ZonedDateTime`'],
              ['机器时间戳', '`Instant` / `System.currentTimeMillis()`'],
              ['算相差多少天', '`ChronoUnit.DAYS.between(a, b)`']
            ] },
            { t: 'warn', x: '`java.time` 的所有对象都是**不可变**的：`d.plusDays(1)` 返回新对象，`d` 本身没变。要保存结果必须接收返回值，写成 `d.plusDays(1);` 是无效操作。' },
            { t: 'note', x: '格式化用 `DateTimeFormatter.ofPattern(...)`，它是线程安全的，可以做成静态常量复用。老代码里的 `SimpleDateFormat` 不是线程安全的，多线程下会出错。' }
          ]
        },
        {
          id: 'j5l4', title: 'Math、Random 与 Objects', key: '数学 · 随机 · 空判断', time: 12,
          blocks: [
            { t: 'p', x: '`Math` 全是静态方法，覆盖常用数学运算；`Random` 生成伪随机数（可固定种子复现）；`Objects` 是空值安全的工具类，处理 null 特别顺手。' },
            { t: 'code', x: 'import java.util.Random;\nimport java.util.Objects;\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(Math.abs(-5));\n        System.out.println(Math.max(3, 7));\n        System.out.println(Math.pow(2, 10));\n        System.out.println(Math.sqrt(16));\n        System.out.println(Math.round(2.5));\n        System.out.println(Math.floorDiv(-7, 2));\n        System.out.println(Math.floorMod(-7, 2));\n\n        Random r = new Random(42);\n        int v = r.nextInt(100);\n        System.out.println(v >= 0 && v < 100);\n\n        String s = null;\n        System.out.println(Objects.isNull(s));\n        System.out.println(Objects.requireNonNullElse(s, "默认值"));\n    }\n}', out: '5\n7\n1024.0\n4.0\n3\n-4\n1\ntrue\ntrue\n默认值' },
            { t: 'table', head: ['方法', '说明', '注意'], rows: [
              ['`Math.round(x)`', '四舍五入', '返回 long；2.5 → 3，-2.5 → -2'],
              ['`Math.floorDiv / floorMod`', '向下取整的除法和取模', '结果符号跟除数一致，处理负数更符合直觉'],
              ['`Math.pow / sqrt`', '幂和开方', '返回 double，精度有限'],
              ['`Random.nextInt(n)`', '`[0, n)` 的整数', '不含 n'],
              ['`Objects.requireNonNullElse`', 'null 就取默认值', '比三元判断更简洁']
            ] },
            { t: 'code', x: 'class Main {\n    static String name;\n\n    public static void main(String[] args) {\n        /* 手写一个 1~6 的骰子，注意 +1 */\n        int dice = (int) (Math.random() * 6) + 1;\n        System.out.println(dice >= 1 && dice <= 6);\n\n        /* Math.random() 返回 [0,1)，不含 1 */\n        System.out.println(Math.random() < 1);\n\n        try {\n            String s = java.util.Objects.requireNonNull(name, "name 不能为 null");\n            System.out.println(s);\n        } catch (NullPointerException e) {\n            System.out.println("拒绝：" + e.getMessage());\n        }\n    }\n}', out: 'true\ntrue\n拒绝：name 不能为 null' },
            { t: 'warn', x: '`Math.random()` 的范围是 **[0, 1)**，取不到 1。要生成 `[1, 6]` 必须写 `(int)(Math.random() * 6) + 1`，忘了加 1 就只能得到 0~5。' },
            { t: 'note', x: '安全场景（验证码、令牌、抽奖）必须用 `SecureRandom`，普通 `Random` 是可预测的伪随机，不能用于安全用途。' }
          ]
        },
        {
          id: 'j5l5', title: '正则表达式', key: 'Pattern · Matcher', time: 14,
          blocks: [
            { t: 'p', x: '正则用一套符号描述「什么样的字符串算匹配」。Java 里用 `String.matches` 做整体匹配，用 `Pattern` + `Matcher` 做查找和替换。' },
            { t: 'table', head: ['写法', '含义'], rows: [
              ['`\\\\d`', '一个数字（Java 字符串里要写双反斜杠）'],
              ['`\\\\w`', '字母、数字、下划线'],
              ['`\\\\s`', '空白字符'],
              ['`.`', '任意字符（默认不含换行）'],
              ['`*` / `+` / `?`', '0 次以上 / 1 次以上 / 0 或 1 次'],
              ['`{2,5}`', '重复 2 到 5 次'],
              ['`[abc]` / `[^abc]`', '其中一个 / 不是其中任何一个'],
              ['`^` / `$`', '开头 / 结尾']
            ] },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("13812345678".matches("1[3-9]\\\\d{9}"));\n        System.out.println("abc123".matches("[a-z]+\\\\d+"));\n        System.out.println("12345".matches("\\\\d+"));\n        System.out.println("abc".matches("\\\\d+"));\n    }\n}', out: 'true\ntrue\ntrue\nfalse' },
            { t: 'h', x: '查找与替换' },
            { t: 'code', x: 'import java.util.regex.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Pattern p = Pattern.compile("\\\\d+");\n        Matcher m = p.matcher("订单 A12 金额 350 元");\n        while (m.find()) System.out.print(m.group() + " ");\n        System.out.println();\n\n        System.out.println("a1b2c3".replaceAll("\\\\d", "#"));\n        System.out.println(String.join("|", "x,y,z,,".split(",")));\n        System.out.println(String.join("|", "x,y,z,,".split(",", -1)));\n    }\n}', out: '12 350 \na#b#c#\nx|y|z\nx|y|z||' },
            { t: 'warn', x: '**`split` 的参数是正则，不是普通字符串**。`"a.b".split(".")` 会返回空数组（`.` 匹配任意字符，所有字符都被当成分隔符）。要点号必须写 `"\\\\."`。' },
            { t: 'note', x: '正则默认是**贪婪匹配**：`a.*b` 会匹配到最后一个 b。要非贪婪就写 `a.*?b`，匹配到第一个 b 就停。这个差别在处理 HTML 或日志时影响很大。' },
            { t: 'principle', x: '**能用字符串方法解决的，不要用正则。** 正则适合「格式校验」和「批量查找替换」，用它解析嵌套结构（比如 HTML）会写出没人能维护的代码。' }
          ]
        }
      ]
    },
    {
      id: 'j6', num: 6, title: '集合与泛型', icon: '📦',
      intro: '数组长度固定，实际业务里几乎都用集合。List 有序可重复、Set 去重、Map 键值对——这三个接口覆盖了绝大多数需求。泛型让集合在编译期就能检查类型。',
      goals: ['在 ArrayList / LinkedList 之间选择', '用 Set 去重并说清三种实现区别', '熟练用 Map 做计数与分组', '写泛型类、泛型方法并读懂通配符'],
      lessons: [
        {
          id: 'j6l1', title: 'List：有序可重复', key: 'ArrayList · LinkedList', time: 14,
          blocks: [
            { t: 'p', x: '`List` 有序、可重复、能按下标访问。最常用 `ArrayList`（内部是数组，随机访问快），`LinkedList` 只在频繁在头部插入删除时才有优势。' },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<String> list = new ArrayList<>();\n        list.add("小明");\n        list.add("小红");\n        list.add(0, "阿伟");\n        System.out.println(list);\n        System.out.println(list.size() + " " + list.get(1));\n        System.out.println(list.contains("小红"));\n        System.out.println(list.indexOf("小红"));\n\n        list.set(0, "小刚");\n        System.out.println(list);\n        list.remove("小红");\n        System.out.println(list);\n        System.out.println(list.isEmpty());\n    }\n}', out: '[阿伟, 小明, 小红]\n3 小明\ntrue\n2\n[小刚, 小明, 小红]\n[小刚, 小明]\nfalse' },
            { t: 'table', head: ['操作', 'ArrayList', 'LinkedList'], rows: [
              ['`get(i)` 随机访问', 'O(1)', 'O(n)'],
              ['尾部 `add`', '均摊 O(1)', 'O(1)'],
              ['头部 `add(0, x)`', 'O(n)', 'O(1)'],
              ['`remove(i)`', 'O(n)', 'O(n)（要先找到）'],
              ['内存占用', '连续、紧凑', '每个节点额外两个指针']
            ] },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<Integer> a = new ArrayList<>(Arrays.asList(3, 1, 4, 1, 5));\n        System.out.println(a);\n\n        /* 注意：remove(int) 按下标删，remove(Object) 按值删 */\n        a.remove(1);\n        System.out.println(a);\n        a.remove(Integer.valueOf(1));\n        System.out.println(a);\n\n        List<Integer> b = List.of(1, 2, 3);   // 不可变\n        try { b.add(4); }\n        catch (UnsupportedOperationException e) { System.out.println("不可变列表：" + e.getClass().getSimpleName()); }\n    }\n}', out: '[3, 1, 4, 1, 5]\n[3, 4, 1, 5]\n[3, 4, 5]\n不可变列表：UnsupportedOperationException' },
            { t: 'warn', x: '**`list.remove(1)` 删的是下标 1**，不是值 1。要按值删必须传对象：`list.remove(Integer.valueOf(1))`。这个坑在 `List<Integer>` 上特别容易踩。' },
            { t: 'note', x: '`List.of(...)` 和 `Arrays.asList(...)` 都返回**长度固定**的列表，`add` / `remove` 会抛异常。需要可变就把它们塞进 `new ArrayList<>(...)`。' }
          ]
        },
        {
          id: 'j6l2', title: 'Set：自动去重', key: 'HashSet · TreeSet · LinkedHashSet', time: 12,
          blocks: [
            { t: 'p', x: '`Set` 不允许重复。判断重复靠 `hashCode()` + `equals()`，所以**自定义对象放进 HashSet 必须重写这两个方法**，否则按地址判断，永远不重复。' },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Set<String> hs = new HashSet<>();\n        hs.add("b"); hs.add("a"); hs.add("c"); hs.add("a");\n        System.out.println(hs.size());\n\n        System.out.println(new TreeSet<>(hs));\n        System.out.println(new LinkedHashSet<>(Arrays.asList("b", "a", "c", "a")));\n\n        Set<Integer> nums = new TreeSet<>(Arrays.asList(5, 3, 9, 1));\n        System.out.println(nums);\n        TreeSet<Integer> t = (TreeSet<Integer>) nums;\n        System.out.println(t.first() + " " + t.last());\n    }\n}', out: '3\n[a, b, c]\n[b, a, c]\n[1, 3, 5, 9]\n1 9' },
            { t: 'table', head: ['实现', '顺序', '底层', '复杂度'], rows: [
              ['`HashSet`', '无序（不保证）', '哈希表', '增删查 O(1)'],
              ['`LinkedHashSet`', '保持插入顺序', '哈希表 + 链表', 'O(1)'],
              ['`TreeSet`', '自动排序', '红黑树', 'O(log n)']
            ] },
            { t: 'code', x: 'import java.util.*;\n\nclass P {\n    String name;\n    P(String n) { name = n; }\n    @Override public boolean equals(Object o) {\n        return o instanceof P p && Objects.equals(name, p.name);\n    }\n    @Override public int hashCode() { return Objects.hash(name); }\n    @Override public String toString() { return name; }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Set<P> s = new HashSet<>();\n        s.add(new P("小明"));\n        s.add(new P("小明"));\n        s.add(new P("小红"));\n        System.out.println(s.size());\n        System.out.println(s.contains(new P("小红")));\n    }\n}', out: '2\ntrue' },
            { t: 'warn', x: '**只重写 `equals` 不重写 `hashCode` 是无效的。** 两个「相等」的对象哈希值不同，会被分到不同的桶里，HashSet 认为它们不重复。IDE 两个一起生成，别只写一个。' },
            { t: 'note', x: '`TreeSet` 要求元素**可比较**（实现 `Comparable` 或传 `Comparator`）。放自定义对象不实现比较会抛 `ClassCastException`。' }
          ]
        },
        {
          id: 'j6l3', title: 'Map：键值对与计数', key: 'HashMap · merge · 遍历', time: 14,
          blocks: [
            { t: 'p', x: '`Map` 存键值对，键唯一。它是 Java 里用得最多的集合：缓存、配置、计数、分组都靠它。最常用 `HashMap`，需要排序用 `TreeMap`，需要保持插入顺序用 `LinkedHashMap`。' },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Map<String, Integer> m = new LinkedHashMap<>();\n        for (String w : "a b a c a b".split(" ")) {\n            m.merge(w, 1, Integer::sum);   // 神器：不存在就放 1，存在就累加\n        }\n        System.out.println(m);\n        System.out.println(m.get("a"));\n        System.out.println(m.getOrDefault("z", 0));\n        System.out.println(m.containsKey("b"));\n        System.out.println(new TreeMap<>(m));\n    }\n}', out: '{a=3, b=2, c=1}\n3\n0\ntrue\n{a=3, b=2, c=1}' },
            { t: 'h', x: '三种遍历方式' },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Map<String, Integer> m = new LinkedHashMap<>();\n        m.put("小明", 92);\n        m.put("小红", 88);\n\n        for (Map.Entry<String, Integer> e : m.entrySet()) {\n            System.out.println(e.getKey() + " -> " + e.getValue());\n        }\n        m.forEach((k, v) -> System.out.println("forEach: " + k + "=" + v));\n        System.out.println(m.keySet());\n        System.out.println(m.values());\n    }\n}', out: '小明 -> 92\n小红 -> 88\nforEach: 小明=92\nforEach: 小红=88\n[小明, 小红]\n[92, 88]' },
            { t: 'table', head: ['方法', '作用'], rows: [
              ['`put(k, v)`', '放入，键已存在则覆盖并返回旧值'],
              ['`getOrDefault(k, d)`', '取不到返回默认值，避免 null'],
              ['`computeIfAbsent(k, fn)`', '不存在才计算并放入，适合建分组'],
              ['`merge(k, v, fn)`', '不存在放 v，存在则用 fn 合并，计数神器'],
              ['`putIfAbsent(k, v)`', '不存在才放'],
              ['`getOrDefault` + `put`', '老写法，两步，不如上面几个原子']
            ] },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Map<String, List<String>> group = new HashMap<>();\n        String[][] data = {{"一班", "小明"}, {"二班", "小红"}, {"一班", "阿伟"}};\n        for (String[] d : data) {\n            group.computeIfAbsent(d[0], k -> new ArrayList<>()).add(d[1]);\n        }\n        System.out.println(new TreeMap<>(group));\n    }\n}', out: '{一班=[小明, 阿伟], 二班=[小红]}' },
            { t: 'warn', x: '**`HashMap` 的键必须正确实现 `hashCode` 和 `equals`。** 用可变对象当键更危险：改了字段之后哈希值变了，就再也 get 不到了。键最好用 `String` 或不可变类型。' }
          ]
        },
        {
          id: 'j6l4', title: '泛型：编译期类型检查', key: '泛型类 · 通配符', time: 14,
          blocks: [
            { t: 'p', x: '没有泛型时集合只能存 `Object`，取出来要强转，转错了运行时才炸。泛型把类型检查提前到编译期：`List<String>` 里塞 `Integer` 直接编译不过。' },
            { t: 'code', x: 'class Box<T> {\n    private T value;\n    Box(T v) { value = v; }\n    T get() { return value; }\n    <R> Box<R> map(java.util.function.Function<T, R> f) {\n        return new Box<>(f.apply(value));\n    }\n}\n\nclass Main {\n    static <T extends Comparable<T>> T maxOf(T a, T b) {\n        return a.compareTo(b) >= 0 ? a : b;\n    }\n\n    public static void main(String[] args) {\n        Box<String> b = new Box<>("hi");\n        System.out.println(b.get());\n        System.out.println(b.map(String::length).get());\n\n        System.out.println(maxOf(3, 7));\n        System.out.println(maxOf("apple", "banana"));\n    }\n}', out: 'hi\n2\n7\nbanana' },
            { t: 'h', x: '通配符：`? extends` 与 `? super`' },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    static double sum(List<? extends Number> list) {   // 只能读\n        double s = 0;\n        for (Number n : list) s += n.doubleValue();\n        return s;\n    }\n\n    static void fill(List<? super Integer> list) {     // 只能写\n        list.add(1);\n        list.add(2);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(sum(Arrays.asList(1, 2, 3)));\n        System.out.println(sum(Arrays.asList(1.5, 2.5)));\n\n        List<Number> ns = new ArrayList<>();\n        fill(ns);\n        System.out.println(ns);\n    }\n}', out: '6.0\n4.0\n[1, 2]' },
            { t: 'table', head: ['写法', '能读', '能写', '典型用途'], rows: [
              ['`List<? extends T>`', '✓ 读到 T', '✗ 不能写', '只读的遍历 / 求和'],
              ['`List<? super T>`', '只能读成 Object', '✓ 能写 T', '往里放数据'],
              ['`List<T>`', '✓', '✓', '既要读又要写']
            ] },
            { t: 'warn', x: '**泛型会被「类型擦除」**：编译后 `List<String>` 和 `List<Integer>` 都是 `List`，所以不能 `new T[]`、不能 `instanceof List<String>`、静态方法不能用类的类型参数。这是 Java 为兼容旧代码付出的代价。' },
            { t: 'note', x: '记口诀 **PECS**：Producer Extends, Consumer Super。只从里面取（生产者）用 `extends`，只往里放（消费者）用 `super`。' }
          ]
        },
        {
          id: 'j6l5', title: '迭代器与 Collections 工具', key: 'Iterator · 排序 · 不可变集合', time: 12,
          blocks: [
            { t: 'p', x: '**遍历时删除元素必须用迭代器**。用 for-each 边遍历边 `list.remove()` 会抛 `ConcurrentModificationException`，因为集合的修改计数变了。' },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<Integer> list = new ArrayList<>(Arrays.asList(5, 3, 9, 1, 7));\n\n        Iterator<Integer> it = list.iterator();\n        while (it.hasNext()) {\n            if (it.next() % 2 == 0) it.remove();   // 迭代器删除才安全\n        }\n        System.out.println(list);\n\n        list.removeIf(x -> x > 7);                 // 更简洁的写法\n        System.out.println(list);\n    }\n}', out: '[5, 3, 9, 1, 7]\n[5, 3, 1, 7]' },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<Integer> list = new ArrayList<>(Arrays.asList(5, 3, 9, 1, 7));\n\n        Collections.sort(list);\n        System.out.println(list);\n        Collections.reverse(list);\n        System.out.println(list);\n        System.out.println(Collections.max(list) + " " + Collections.min(list));\n        Collections.swap(list, 0, 1);\n        System.out.println(list);\n\n        List<String> names = new ArrayList<>(Arrays.asList("小明", "阿伟", "小红"));\n        names.sort(Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));\n        System.out.println(names);\n    }\n}', out: '[1, 3, 5, 7, 9]\n[9, 7, 5, 3, 1]\n9 1\n[7, 9, 5, 3, 1]\n[小明, 小红, 阿伟]' },
            { t: 'p', x: '最后一行排序：三个名字长度都是 2，长度相同就按第二个条件「自然顺序」比，也就是逐字符比 Unicode 码点。`小`(U+5C0F) 小于 `阿`(U+963F)，所以「小明」「小红」排在「阿伟」前面。' },
            { t: 'table', head: ['工具', '用途'], rows: [
              ['`Collections.sort / reverse / swap`', '就地修改（要求可变列表）'],
              ['`Collections.unmodifiableList(l)`', '返回只读视图，写操作抛异常'],
              ['`List.copyOf(l)`', '返回不可变副本'],
              ['`list.removeIf(pred)`', '按条件删除，最简洁'],
              ['`list.sort(cmp)`', '按比较器排序']
            ] },
            { t: 'warn', x: '`Arrays.asList(...)` 返回的列表**长度固定**，`add` / `remove` 会抛 `UnsupportedOperationException`，但 `set` 可以。要可变就 `new ArrayList<>(Arrays.asList(...))`。' },
            { t: 'note', x: '方法返回集合时，如果调用方不该改它，就返回 `List.copyOf(x)` 或 `Collections.unmodifiableList(x)`。这比写注释「请勿修改」有效得多。' }
          ]
        }
      ]
    },
    {
      id: 'j7', num: 7, title: '异常与文件 IO', icon: '⚠️',
      intro: '异常是 Java 强制的错误处理机制：要么处理，要么声明抛出去，编译器会盯着你。IO 是程序与外界交换数据的通道，`java.nio.file` 让读写文件不再需要十行样板代码。',
      goals: ['区分受检异常与非受检异常', '用 try-with-resources 自动关闭资源', '用 Files 读写文本文件', '用 Properties 读配置'],
      lessons: [
        {
          id: 'j7l1', title: '异常体系与分类', key: 'Throwable · 受检 · 非受检', time: 14,
          blocks: [
            { t: 'p', x: '所有异常都继承自 `Throwable`，分两支：`Error`（JVM 级，程序无能为力）和 `Exception`。`Exception` 里又分**受检异常**（编译器强制处理）和**非受检异常**（`RuntimeException`，编译器不管）。' },
            { t: 'table', head: ['类别', '例子', '编译器管吗', '怎么处理'], rows: [
              ['`Error`', '`OutOfMemoryError`、`StackOverflowError`', '不管', '改代码或加内存，通常无法捕获挽救'],
              ['受检异常', '`IOException`、`SQLException`', '**强制**', 'try-catch 或 throws 声明'],
              ['非受检异常', '`NullPointerException`、`IllegalArgumentException`', '不管', '修 bug，而不是 catch 掉']
            ] },
            { t: 'code', x: 'class Main {\n    static int div(int a, int b) { return a / b; }\n\n    public static void main(String[] args) {\n        try {\n            System.out.println(div(10, 2));\n            System.out.println(div(10, 0));\n        } catch (ArithmeticException e) {\n            System.out.println("算术错误：" + e.getMessage());\n        }\n\n        int[] a = new int[2];\n        try {\n            System.out.println(a[5]);\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.println("越界：" + e.getMessage());\n        }\n\n        try {\n            Integer.parseInt("abc");\n        } catch (NumberFormatException e) {\n            System.out.println("数字格式错");\n        }\n\n        System.out.println("程序继续执行");\n    }\n}', out: '5\n算术错误：/ by zero\n越界：Index 5 out of bounds for length 2\n数字格式错\n程序继续执行' },
            { t: 'p', x: '注意 `div(10, 0)` 抛出异常后，try 块里**它后面的代码不再执行**，直接跳到 catch。catch 结束后程序继续往下走——这就是「异常没有让程序崩掉」的原因。' },
            { t: 'code', x: 'class Main {\n    static void check(int age) {\n        if (age < 0) throw new IllegalArgumentException("年龄不能为负：" + age);\n        System.out.println("年龄合法：" + age);\n    }\n\n    public static void main(String[] args) {\n        check(20);\n        try {\n            check(-1);\n        } catch (IllegalArgumentException e) {\n            System.out.println("捕获：" + e.getMessage());\n        }\n    }\n}', out: '年龄合法：20\n捕获：年龄不能为负：-1' },
            { t: 'warn', x: '**不要用 `catch (Exception e) {}` 把异常吞掉。** 空 catch 块会让 bug 完全消失、无从排查。至少 `e.printStackTrace()` 或记日志，最好是能处理就处理、处理不了就往上抛。' },
            { t: 'note', x: '自定义异常继承 `RuntimeException`（非受检，调用方不用写 try）还是 `Exception`（受检，强制处理）？业务校验失败通常用前者，可恢复的外部故障用后者。' }
          ]
        },
        {
          id: 'j7l2', title: 'try-catch-finally 与自动关闭', key: 'finally · try-with-resources', time: 14,
          blocks: [
            { t: 'p', x: '`finally` 里的代码**无论是否发生异常都会执行**，常用来释放资源。Java 7 之后有了 `try-with-resources`：只要资源实现了 `AutoCloseable`，就会自动调用 `close()`，比手写 finally 更安全。' },
            { t: 'code', x: 'class Main {\n    static int risky(int x) {\n        try {\n            return 10 / x;\n        } catch (ArithmeticException e) {\n            System.out.println("捕获");\n            return -1;\n        } finally {\n            System.out.println("finally 一定执行");\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(risky(2));\n        System.out.println(risky(0));\n    }\n}', out: 'finally 一定执行\n5\n捕获\nfinally 一定执行\n-1' },
            { t: 'p', x: '注意输出顺序：`finally` 在 `return` 真正返回**之前**执行，所以先打印「finally 一定执行」，再打印返回值 5。' },
            { t: 'code', x: 'class Main {\n    static class Res implements AutoCloseable {\n        String name;\n        Res(String n) { name = n; System.out.println("打开 " + n); }\n        void use() { System.out.println("使用 " + name); }\n        @Override public void close() { System.out.println("自动关闭 " + name); }\n    }\n\n    public static void main(String[] args) {\n        try (Res r = new Res("文件A")) {\n            r.use();\n        }\n        System.out.println("结束");\n\n        /* 出现异常也会关 */\n        try (Res r = new Res("文件B")) {\n            throw new IllegalStateException("模拟出错");\n        } catch (IllegalStateException e) {\n            System.out.println("捕获：" + e.getMessage());\n        }\n    }\n}', out: '打开 文件A\n使用 文件A\n自动关闭 文件A\n结束\n打开 文件B\n自动关闭 文件B\n捕获：模拟出错' },
            { t: 'table', head: ['写法', '优点', '缺点'], rows: [
              ['手写 finally 关闭', '兼容老代码', '容易漏、close 本身可能抛异常'],
              ['try-with-resources', '自动关闭、异常抑制处理得当', '资源必须实现 `AutoCloseable`'],
              ['多个资源', '`try (A a = ...; B b = ...)`', '按**声明顺序的逆序**关闭']
            ] },
            { t: 'warn', x: '**`finally` 里不要写 `return`**，它会覆盖 try 里的返回值，还可能吞掉异常。这是编译器都会警告的写法（`finally block does not complete normally`）。' },
            { t: 'note', x: '自己的资源类（连接、文件包装、锁）都应该实现 `AutoCloseable`，这样调用方一行 try-with-resources 就搞定，不会忘关。' }
          ]
        },
        {
          id: 'j7l3', title: '文件读写（NIO.2）', key: 'Files · Path · BufferedReader', time: 14,
          blocks: [
            { t: 'p', x: '老 API 是 `FileInputStream` + 一堆装饰器，代码又长又容易漏关。`java.nio.file.Files` 一个方法就搞定常见操作：读全部行、写字符串、复制、删除、遍历目录。' },
            { t: 'code', run: false, label: '文件操作示例', x: 'import java.nio.file.*;\nimport java.io.IOException;\nimport java.util.List;\n\npublic class FileDemo {\n    public static void main(String[] args) throws IOException {\n        Path p = Paths.get("demo.txt");\n\n        Files.writeString(p, "小明 92\\n小红 88\\n");   // 写（覆盖）\n        List<String> lines = Files.readAllLines(p);    // 一次读全部行\n\n        for (String line : lines) {\n            String[] parts = line.split(" ");\n            System.out.println(parts[0] + " -> " + parts[1]);\n        }\n\n        Files.delete(p);                               // 删除\n        System.out.println(Files.exists(p));\n    }\n}' },
            { t: 'h', x: '大文件用流式读取，别一次全读进内存' },
            { t: 'code', x: 'import java.io.BufferedReader;\nimport java.io.StringReader;\n\nclass Main {\n    public static void main(String[] args) throws Exception {\n        String data = "小明 92\\n小红 88\\n阿伟 76\\n";\n\n        int total = 0, count = 0;\n        try (BufferedReader br = new BufferedReader(new StringReader(data))) {\n            String line;\n            while ((line = br.readLine()) != null) {\n                String[] parts = line.split(" ");\n                System.out.println(parts[0] + " 得分 " + parts[1]);\n                total += Integer.parseInt(parts[1]);\n                count++;\n            }\n        }\n        System.out.println("平均 " + total / count);\n    }\n}', out: '小明 得分 92\n小红 得分 88\n阿伟 得分 76\n平均 85' },
            { t: 'table', head: ['方法', '用途'], rows: [
              ['`Files.readString(p)`', '一次读成字符串（小文件）'],
              ['`Files.readAllLines(p)`', '一次读成 List<String>（中等文件）'],
              ['`Files.lines(p)`', '返回 Stream，适合大文件流式处理'],
              ['`Files.writeString(p, s)`', '覆盖写入'],
              ['`Files.write(p, lines, APPEND)`', '追加'],
              ['`Files.walk(dir)`', '递归遍历目录']
            ] },
            { t: 'warn', x: '`Files.readAllLines` 会把整个文件读进内存，几百 MB 的日志直接 `OutOfMemoryError`。大文件必须用 `Files.lines` 或 `BufferedReader` 逐行处理。' },
            { t: 'note', x: '编码问题：`Files.readString(p)` 默认用 UTF-8，而中文 Windows 上记事本默认是 GBK。读旧文件出现乱码时，显式指定 `Charset.forName("GBK")`。' }
          ]
        },
        {
          id: 'j7l4', title: 'Properties 与序列化', key: '配置文件 · 对象持久化', time: 12,
          blocks: [
            { t: 'p', x: '`Properties` 是专门读 `.properties` 配置文件的类（键值都是字符串），Spring Boot 的 `application.properties` 就是它。`getProperty` 支持给默认值，这点比 `get` 好用得多。' },
            { t: 'code', x: 'import java.util.Properties;\n\nclass Main {\n    public static void main(String[] args) {\n        Properties p = new Properties();\n        p.setProperty("app.name", "CodeCraft");\n        p.setProperty("app.version", "2.0");\n\n        System.out.println(p.getProperty("app.name"));\n        System.out.println(p.getProperty("app.port", "8080"));   // 取不到用默认值\n        System.out.println(p.getProperty("app.port"));           // 直接取是 null\n        System.out.println(p.stringPropertyNames().size());\n    }\n}', out: 'CodeCraft\n8080\nnull\n2' },
            { t: 'code', x: 'import java.util.Properties;\nimport java.io.StringWriter;\n\nclass Main {\n    public static void main(String[] args) throws Exception {\n        Properties p = new Properties();\n        p.setProperty("db.url", "jdbc:mysql://localhost/test");\n        p.setProperty("db.user", "root");\n\n        StringWriter w = new StringWriter();\n        p.store(w, "数据库配置");\n        String text = w.toString();\n        System.out.println(text.contains("db.url"));\n        System.out.println(text.lines().filter(l -> l.startsWith("#")).count());   // 2 行：你的注释 + 自动加的时间\n\n        Properties back = new Properties();\n        back.load(new java.io.StringReader(text));\n        System.out.println(back.getProperty("db.user"));\n    }\n}', out: 'true\n2\nroot' },
            { t: 'table', head: ['用途', '推荐做法'], rows: [
              ['读配置', '`Properties` + `getProperty(k, default)`'],
              ['存结构化数据', 'JSON（Jackson / Gson），别用 Properties'],
              ['Java 原生对象持久化', '序列化 `Serializable`，但**不推荐**用于长期存储'],
              ['跨语言交换', 'JSON 或 Protobuf']
            ] },
            { t: 'warn', x: '**Java 原生序列化（`Serializable`）已经不建议用于新项目。** 它有安全漏洞风险、版本兼容差（改一个字段就反序列化失败）、体积大。存对象用 JSON 更稳妥。' },
            { t: 'note', x: '配置的优先级通常是「命令行参数 > 环境变量 > 配置文件 > 代码默认值」。写工具时把默认值写死在代码里，配置只是覆盖它，程序就永远不会因为缺配置而跑不起来。' }
          ]
        }
      ]
    },
    {
      id: 'j8', num: 8, title: '多线程与网络', icon: '🧵',
      intro: '多线程让程序能「同时做几件事」，代价是数据可能被同时修改。这一章讲清线程怎么创建、为什么要加锁、线程池怎么用，最后碰一下网络编程。',
      goals: ['创建线程并理解 start 与 run 的区别', '用 synchronized 保护共享数据', '用线程池管理任务而不是裸 new Thread', '用 HttpClient 发一个请求'],
      lessons: [
        {
          id: 'j8l1', title: 'Thread 与 Runnable', key: '线程 · start · join', time: 14,
          blocks: [
            { t: 'p', x: '创建线程有两种方式：继承 `Thread` 重写 `run`，或实现 `Runnable` 传给 `Thread`。后者更灵活（还能继承别的类），现在基本都配合 lambda 写。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) throws InterruptedException {\n        Thread t = new Thread(() -> {\n            for (int i = 1; i <= 3; i++) System.out.println("子线程 " + i);\n        });\n\n        t.start();          // 启动新线程（不是 run！）\n        t.join();           // 等它结束，保证输出顺序稳定\n\n        System.out.println("主线程结束");\n        System.out.println("子线程还活着吗：" + t.isAlive());\n    }\n}', out: '子线程 1\n子线程 2\n子线程 3\n主线程结束\n子线程还活着吗：false' },
            { t: 'table', head: ['方法', '作用', '坑'], rows: [
              ['`start()`', '启动新线程，由 JVM 调用 run', '调 `run()` 只是普通方法调用，还在当前线程'],
              ['`join()`', '等这个线程结束', '不写会看到交错的输出'],
              ['`sleep(ms)`', '当前线程暂停', '要处理 `InterruptedException`'],
              ['`setDaemon(true)`', '设为守护线程', '主线程结束时它会被强制终止'],
              ['`interrupt()`', '请求中断', '只是设标志，线程要自己检查']
            ] },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) throws Exception {\n        Thread t = new Thread(() -> {\n            try {\n                for (int i = 0; i < 10; i++) {\n                    Thread.sleep(100);\n                }\n                System.out.println("正常结束");\n            } catch (InterruptedException e) {\n                System.out.println("被中断了，提前退出");\n                Thread.currentThread().interrupt();   // 恢复中断标记\n            }\n        });\n        t.start();\n        Thread.sleep(250);\n        t.interrupt();\n        t.join();\n        System.out.println("主线程收尾");\n    }\n}', out: '被中断了，提前退出\n主线程收尾' },
            { t: 'warn', x: '**`t.run()` 不会开新线程**，它只是普通方法调用，还在当前线程里顺序执行。必须写 `t.start()`。这个错误不报错，只是「没并发」，很难发现。' },
            { t: 'note', x: 'Java 21 有了**虚拟线程**：`Thread.ofVirtual().start(task)`。它能开几十万个而几乎不占内存，适合大量 IO 等待的场景（如处理上万并发请求）。' }
          ]
        },
        {
          id: 'j8l2', title: '线程安全与 synchronized', key: '竞态 · 锁 · volatile', time: 16,
          blocks: [
            { t: 'p', x: '多个线程同时读写同一个变量，就会出现**竞态条件**：`n++` 看着是一行，实际是「读 → 加 1 → 写回」三步，中间可能被打断，导致更新丢失。' },
            { t: 'code', x: 'class Counter {\n    private int n = 0;\n    synchronized void inc() { n++; }        // 同一时刻只有一个线程能进来\n    synchronized int get() { return n; }\n}\n\nclass Main {\n    public static void main(String[] args) throws InterruptedException {\n        Counter c = new Counter();\n        Thread[] ts = new Thread[4];\n        for (int i = 0; i < 4; i++) {\n            ts[i] = new Thread(() -> {\n                for (int k = 0; k < 2500; k++) c.inc();\n            });\n            ts[i].start();\n        }\n        for (Thread t : ts) t.join();\n        System.out.println(c.get());\n    }\n}', out: '10000' },
            { t: 'p', x: '去掉 `synchronized` 再跑，结果通常会小于 10000（有时也会刚好等于，所以这类 bug 特别难复现）。这就是为什么「测试通过」不代表线程安全。' },
            { t: 'table', head: ['手段', '适用', '代价'], rows: [
              ['`synchronized` 方法 / 块', '简单互斥', '串行化，吞吐下降'],
              ['`ReentrantLock`', '需要超时、可中断、公平锁', '要手动 unlock（放 finally）'],
              ['`AtomicInteger`', '单个变量的原子加减', '无锁，性能好'],
              ['`volatile`', '保证可见性', '**不保证原子性**，不能替代锁'],
              ['不可变对象', '最彻底的方案', '需要设计上支持']
            ] },
            { t: 'code', x: 'import java.util.concurrent.atomic.AtomicInteger;\n\nclass Main {\n    public static void main(String[] args) throws InterruptedException {\n        AtomicInteger n = new AtomicInteger(0);\n        Thread[] ts = new Thread[4];\n        for (int i = 0; i < 4; i++) {\n            ts[i] = new Thread(() -> {\n                for (int k = 0; k < 2500; k++) n.incrementAndGet();\n            });\n            ts[i].start();\n        }\n        for (Thread t : ts) t.join();\n        System.out.println(n.get());\n    }\n}', out: '10000' },
            { t: 'warn', x: '**`volatile` 不保证原子性**。`volatile int n; n++;` 照样会丢更新。它只保证「一个线程改了，另一个线程立刻能看到」，适合做标志位（`volatile boolean stop`）。' },
            { t: 'principle', x: '**能不用共享状态就不用。** 用局部变量、不可变对象、消息传递代替共享可变数据，比任何加锁技巧都可靠。' }
          ]
        },
        {
          id: 'j8l3', title: '线程池与 CompletableFuture', key: 'ExecutorService · Future', time: 16,
          blocks: [
            { t: 'p', x: '每次 `new Thread()` 都要向操作系统申请资源，任务一多就撑不住。**线程池**复用固定数量的线程，把任务排队执行，是生产环境唯一正确的做法。' },
            { t: 'code', x: 'import java.util.concurrent.*;\n\nclass Main {\n    public static void main(String[] args) throws Exception {\n        ExecutorService pool = Executors.newFixedThreadPool(2);\n\n        Future<Integer> f1 = pool.submit(() -> 1 + 1);\n        Future<Integer> f2 = pool.submit(() -> {\n            int s = 0;\n            for (int i = 1; i <= 10; i++) s += i;\n            return s;\n        });\n\n        System.out.println(f1.get());     // 阻塞等结果\n        System.out.println(f2.get());\n\n        pool.shutdown();                  // 不再接新任务，已提交的会跑完\n        System.out.println(pool.isShutdown());\n    }\n}', out: '2\n55\ntrue' },
            { t: 'h', x: 'CompletableFuture：串起来的异步' },
            { t: 'code', x: 'import java.util.concurrent.*;\n\nclass Main {\n    public static void main(String[] args) throws Exception {\n        CompletableFuture<String> cf = CompletableFuture\n            .supplyAsync(() -> "hello")\n            .thenApply(String::toUpperCase)\n            .thenApply(s -> s + "!");\n        System.out.println(cf.get());\n\n        CompletableFuture<Integer> a = CompletableFuture.supplyAsync(() -> 10);\n        CompletableFuture<Integer> b = CompletableFuture.supplyAsync(() -> 20);\n        System.out.println(a.thenCombine(b, Integer::sum).get());\n\n        CompletableFuture<Integer> bad = CompletableFuture.supplyAsync(() -> {\n            throw new IllegalStateException("炸了");\n        });\n        System.out.println(bad.exceptionally(e -> -1).get());\n    }\n}', out: 'HELLO!\n30\n-1' },
            { t: 'table', head: ['方法', '作用'], rows: [
              ['`supplyAsync`', '异步执行并返回值'],
              ['`runAsync`', '异步执行，无返回值'],
              ['`thenApply`', '转换结果（同步）'],
              ['`thenCompose`', '串联另一个异步任务（避免嵌套 Future）'],
              ['`thenCombine`', '合并两个独立任务的结果'],
              ['`exceptionally`', '出错时给兜底值'],
              ['`allOf` / `anyOf`', '等多个 / 任一完成']
            ] },
            { t: 'warn', x: '**`Executors.newFixedThreadPool` 的队列是无界的**，任务堆积过多会 OOM。生产环境应该用 `new ThreadPoolExecutor(...)` 显式指定队列容量和拒绝策略。' },
            { t: 'note', x: '`Future.get()` 是阻塞的，还会把异常包成 `ExecutionException`。要把真正的异常取出来用 `e.getCause()`，不然日志里只会看到一层包装。' }
          ]
        },
        {
          id: 'j8l4', title: '网络编程入门', key: 'HttpClient · URI · Socket', time: 14,
          blocks: [
            { t: 'p', x: 'Java 11 内置了 `HttpClient`，发请求不用再引第三方库。网络代码的核心是两件事：**构造请求**（URL、方法、头、体）和**处理响应**（状态码、头、体）。' },
            { t: 'code', x: 'import java.net.URI;\nimport java.net.http.*;\nimport java.time.Duration;\n\nclass Main {\n    public static void main(String[] args) throws Exception {\n        URI u = URI.create("https://api.example.com/v1/items?page=2&size=10");\n        System.out.println(u.getScheme());\n        System.out.println(u.getHost());\n        System.out.println(u.getPath());\n        System.out.println(u.getQuery());\n        System.out.println(u.getPort());\n\n        HttpClient client = HttpClient.newBuilder()\n            .connectTimeout(Duration.ofSeconds(5))\n            .build();\n\n        HttpRequest req = HttpRequest.newBuilder(u)\n            .header("Accept", "application/json")\n            .GET()\n            .build();\n        System.out.println(req.method());\n        System.out.println(req.uri().getHost());\n    }\n}', out: 'https\napi.example.com\n/v1/items\npage=2&size=10\n-1\nGET\napi.example.com' },
            { t: 'code', run: false, label: '真实请求（需要网络）', x: 'HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());\n\nSystem.out.println(res.statusCode());          // 200 表示成功\nSystem.out.println(res.headers().firstValue("content-type").orElse(""));\nSystem.out.println(res.body());\n\n/* 异步发请求 */\nclient.sendAsync(req, HttpResponse.BodyHandlers.ofString())\n      .thenApply(HttpResponse::body)\n      .thenAccept(System.out::println);' },
            { t: 'table', head: ['状态码段', '含义', '常见值'], rows: [
              ['2xx', '成功', '200 OK、201 Created、204 No Content'],
              ['3xx', '重定向', '301 永久、302 临时'],
              ['4xx', '客户端错', '400 参数错、401 未认证、403 无权限、404 不存在、429 限流'],
              ['5xx', '服务端错', '500 内部错误、502 网关错、504 超时']
            ] },
            { t: 'warn', x: '**HTTP 请求必须设超时。** 不设的话，对端不响应时线程会一直挂着，请求一多就把线程池耗光。连接超时和读超时是两回事，都要设。' },
            { t: 'note', x: '`URL.getPort()` 在没显式写端口时返回 **-1**（表示用协议默认端口 80/443），不是 0 也不是 80。判断时要注意这一点。' }
          ]
        }
      ]
    },
    {
      id: 'j9', num: 9, title: '函数式编程与工程实践', icon: '⚡',
      intro: 'Java 8 引入的 Lambda 和 Stream 改变了写业务代码的方式：从「怎么循环」变成「要什么结果」。这一章把这两样写熟，再补上反射、注解和单元测试。',
      goals: ['写 lambda 并认得四大函数式接口', '用 Stream 完成过滤、映射、分组、聚合', '理解注解与反射如何支撑框架', '写出第一个 JUnit 测试'],
      lessons: [
        {
          id: 'j9l1', title: 'Lambda 与函数式接口', key: 'lambda · 方法引用', time: 14,
          blocks: [
            { t: 'p', x: '**函数式接口**就是「只有一个抽象方法」的接口。Lambda 是它的简写：`(参数) -> 表达式`。Java 内置了四大类：`Function`（转换）、`Consumer`（消费）、`Predicate`（判断）、`Supplier`（供给）。' },
            { t: 'table', head: ['接口', '签名', '用途'], rows: [
              ['`Function<T,R>`', '`R apply(T t)`', '把 T 转成 R'],
              ['`Consumer<T>`', '`void accept(T t)`', '消费一个值（打印、存库）'],
              ['`Predicate<T>`', '`boolean test(T t)`', '判断条件'],
              ['`Supplier<T>`', '`T get()`', '提供值（工厂、懒加载）'],
              ['`BiFunction<T,U,R>`', '`R apply(T,U)`', '两参数转换']
            ] },
            { t: 'code', x: 'import java.util.function.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Function<Integer, Integer> sq = x -> x * x;\n        System.out.println(sq.apply(5));\n\n        BiFunction<Integer, Integer, Integer> add = Integer::sum;   // 方法引用\n        System.out.println(add.apply(3, 4));\n\n        Predicate<String> empty = String::isEmpty;\n        System.out.println(empty.test(""));\n\n        Consumer<String> print = s -> System.out.println("消费：" + s);\n        print.accept("hi");\n\n        Supplier<Double> rnd = Math::random;\n        System.out.println(rnd.get() < 1);\n\n        Runnable r = () -> System.out.println("跑一下");\n        r.run();\n    }\n}', out: '25\n7\ntrue\n消费：hi\ntrue\n跑一下' },
            { t: 'h', x: '方法引用的四种写法' },
            { t: 'table', head: ['类型', '写法', '等价 lambda'], rows: [
              ['静态方法', '`Integer::parseInt`', '`s -> Integer.parseInt(s)`'],
              ['实例方法（对象已知）', '`System.out::println`', '`x -> System.out.println(x)`'],
              ['实例方法（对象是参数）', '`String::length`', '`s -> s.length()`'],
              ['构造器', '`ArrayList::new`', '`() -> new ArrayList<>()`']
            ] },
            { t: 'code', x: 'import java.util.*;\nimport java.util.function.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<String> names = new ArrayList<>(Arrays.asList("小明", "小红"));\n        names.forEach(System.out::println);\n\n        Function<String, Integer> len = String::length;\n        System.out.println(len.apply("hello"));\n\n        Supplier<List<String>> factory = ArrayList::new;\n        List<String> l = factory.get();\n        l.add("x");\n        System.out.println(l);\n    }\n}', out: '小明\n小红\n5\n[x]' },
            { t: 'warn', x: 'Lambda 里引用的**局部变量必须是 final 或事实不变**的。想在 lambda 里给外部变量赋值会编译报错（`local variables referenced from a lambda expression must be final or effectively final`），要用数组或 `AtomicInteger` 绕过。' },
            { t: 'note', x: 'Lambda 只是「写起来短」，它不改变性能：每个 lambda 在运行时还是一个对象。真正的收益是可读性——把「做什么」直接写出来，而不是写一堆匿名类样板。' }
          ]
        },
        {
          id: 'j9l2', title: 'Stream：声明式数据处理', key: 'filter · map · collect', time: 16,
          blocks: [
            { t: 'p', x: 'Stream 把「对集合的一系列操作」写成一条流水线：**源 → 若干中间操作（惰性）→ 终止操作（触发执行）**。中间操作不立刻执行，只有遇到终止操作才真正跑一遍。' },
            { t: 'code', x: 'import java.util.*;\nimport java.util.stream.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<Integer> nums = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6);\n\n        List<Integer> even = nums.stream()\n            .filter(n -> n % 2 == 0)\n            .map(n -> n * 10)\n            .sorted()\n            .collect(Collectors.toList());\n        System.out.println(even);\n\n        System.out.println(nums.stream().mapToInt(Integer::intValue).sum());\n        System.out.println(nums.stream().distinct().count());\n        System.out.println(nums.stream().max(Integer::compare).orElse(-1));\n\n        String s = Arrays.asList("a", "b", "c").stream().collect(Collectors.joining("-"));\n        System.out.println(s);\n    }\n}', out: '[20, 40, 60]\n31\n7\n9\na-b-c' },
            { t: 'h', x: '分组与统计：业务里最常用的两个' },
            { t: 'code', x: 'import java.util.*;\nimport java.util.stream.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<String> words = Arrays.asList("apple", "banana", "avocado", "cherry", "blueberry");\n\n        Map<Character, List<String>> byFirst = words.stream()\n            .collect(Collectors.groupingBy(w -> w.charAt(0)));\n        System.out.println(new TreeMap<>(byFirst));\n\n        Map<Integer, Long> byLen = words.stream()\n            .collect(Collectors.groupingBy(String::length, Collectors.counting()));\n        System.out.println(new TreeMap<>(byLen));\n\n        Map<Boolean, List<String>> part = words.stream()\n            .collect(Collectors.partitioningBy(w -> w.length() > 6));\n        System.out.println(part.get(true).size());\n\n        DoubleSummaryStatistics st = words.stream()\n            .mapToDouble(String::length).summaryStatistics();\n        System.out.println(st.getSum() + " " + st.getAverage());\n    }\n}', out: '{a=[apple, avocado], b=[banana, blueberry], c=[cherry]}\n{5=1, 6=2, 7=1, 9=1}\n2\n33.0 6.6' },
            { t: 'p', x: '注意 `groupingBy(String::length, counting())` 的第二个参数：不传它，结果会是 `Map<Integer, List<String>>`；传了 `counting()`，才变成「长度 → 个数」。**分组之后要再做一次聚合，就靠这个下游收集器。**' },
            { t: 'table', head: ['操作', '作用'], rows: [
              ['`filter`', '保留满足条件的'],
              ['`map` / `mapToInt`', '转换（后者避免装箱）'],
              ['`flatMap`', '把嵌套结构拍平'],
              ['`sorted` / `distinct` / `limit`', '排序 / 去重 / 截取'],
              ['`collect`', '收集成集合或 Map'],
              ['`reduce`', '归约成一个值'],
              ['`count` / `sum` / `average`', '聚合'],
              ['`anyMatch` / `allMatch`', '判断是否存在 / 是否全满足']
            ] },
            { t: 'warn', x: '**Stream 只能消费一次。** 遍历过的 stream 再用会抛 `IllegalStateException: stream has already been operated upon or closed`。要复用就把结果 collect 成集合。' },
            { t: 'note', x: '`parallelStream()` 不一定更快。数据量小、或有共享状态时，多线程调度的开销反而更大。只有「计算密集 + 数据量大 + 无共享状态」三个条件同时满足才值得用。' }
          ]
        },
        {
          id: 'j9l3', title: '反射、注解与单元测试', key: 'Class · 注解 · JUnit', time: 16,
          blocks: [
            { t: 'p', x: '**反射**让程序在运行时查看类结构、调用方法、读写字段。Spring 能「自动注入」、Jackson 能「自动转 JSON」，底层都是反射。代价是慢、破坏封装、编译期查不出错。' },
            { t: 'code', x: 'import java.lang.annotation.*;\nimport java.lang.reflect.*;\n\n@Retention(RetentionPolicy.RUNTIME)\n@interface Info { String value(); }\n\n@Info("示例类")\nclass Demo {\n    private String name = "私有字段";\n    public int twice(int x) { return x * 2; }\n}\n\nclass Main {\n    public static void main(String[] args) throws Exception {\n        Class<?> c = Demo.class;\n        System.out.println(c.getSimpleName());\n        System.out.println(c.getAnnotation(Info.class).value());\n\n        Object o = c.getDeclaredConstructor().newInstance();\n        Method m = c.getMethod("twice", int.class);\n        System.out.println(m.invoke(o, 21));\n\n        Field f = c.getDeclaredField("name");\n        f.setAccessible(true);\n        System.out.println(f.get(o));\n\n        System.out.println("方法数：" + c.getDeclaredMethods().length);\n    }\n}', out: 'Demo\n示例类\n42\n私有字段\n方法数：1' },
            { t: 'table', head: ['常用 API', '作用'], rows: [
              ['`Class.forName("a.B")`', '按名字加载类'],
              ['`getDeclaredFields()`', '拿到所有字段（含私有）'],
              ['`setAccessible(true)`', '突破 private（Java 17 起模块化下受限）'],
              ['`getMethod(name, 参数类型)`', '拿到 public 方法'],
              ['`invoke(obj, args)`', '调用方法'],
              ['`newInstance()`', '创建实例（已废弃，改用构造器 newInstance）']
            ] },
            { t: 'h', x: '单元测试：JUnit 5' },
            { t: 'code', run: false, label: 'CalculatorTest.java', x: 'import org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass CalculatorTest {\n\n    @Test\n    void 加法应该正确() {\n        assertEquals(5, Calculator.add(2, 3));\n    }\n\n    @Test\n    void 除以零应该抛异常() {\n        assertThrows(ArithmeticException.class, () -> Calculator.div(1, 0));\n    }\n\n    @Test\n    void 空字符串应该被判为空() {\n        assertTrue(Calculator.isBlank("   "));\n    }\n}' },
            { t: 'code', run: false, label: '终端 / maven', x: '> mvn test\n[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0\n[INFO] BUILD SUCCESS' },
            { t: 'note', x: '注解本身没有行为，它只是「贴在代码上的标记」。真正干活的是读取注解的代码（框架或你自己写的反射逻辑），`@Retention(RUNTIME)` 保证运行时能读到它。' },
            { t: 'warn', x: '**不要在业务代码里滥用反射。** 它绕过编译器检查，字段改名后运行时才炸；性能比直接调用慢一个数量级；还会让 IDE 的引用查找失效。框架层用它合理，业务层基本都有更好的写法。' },
            { t: 'principle', x: '**测试不是为了证明代码对，而是为了在改动时快速发现哪里坏了。** 每个 bug 修完补一条测试，半年后你会感谢现在的自己。' }
          ]
        }
      ]
    },
/*CHAPTERS*/
  ],
  quiz: [
    { id: 'jq1', ch: 'j1', lesson: 'j1l1', point: 'JVM 与字节码', type: 'choice', diff: 1,
      prompt: 'Java 的 `.class` 文件里存的是什么？',
      opts: ['机器码', '字节码', 'Java 源码', '汇编代码'],
      ans: 1,
      explain: '`.class` 里是字节码，由 JVM 解释/JIT 编译后执行。正因为不是具体平台的机器码，同一份字节码才能在不同系统上靠各自的 JVM 运行。' },
    { id: 'jq2', ch: 'j1', lesson: 'j1l2', point: '字符串拼接', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        int a = 3, b = 4;\n        System.out.println(a + b);\n        System.out.println("" + a + b);\n        System.out.println(a + b + "");\n    }\n}',
      answer: '7\n34\n7',
      explain: '`+` 从左往右算，一旦遇到字符串就变成拼接：`"" + a` 先得 "3"，再拼 b 得 "34"。而 `a + b + ""` 先算完 3+4=7，再拼空串得 "7"。' },
    { id: 'jq3', ch: 'j1', lesson: 'j1l3', point: 'char 的运算', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        char c = \'A\';\n        System.out.println(c + 1);\n        System.out.println((char) (c + 1));\n        System.out.println(\'A\' + \'B\');\n    }\n}',
      answer: '66\nB\n131',
      explain: '`char` 参与算术会提升为 `int`，所以 `c + 1` 得 66。要按字符打印必须强转 `(char)`。两个 char 相加也是 int 相加：65 + 66 = 131。' },
    { id: 'jq4', ch: 'j1', lesson: 'j1l4', point: '转换与取整', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        System.out.println((int) 3.99);\n        System.out.println(Math.round(3.99));\n        System.out.println(7 / 2 + 0.0);\n        System.out.println((double) (7 / 2));\n    }\n}',
      answer: '3\n4\n3.0\n3.0',
      explain: '`(int)` 截断得 3；`Math.round` 四舍五入得 4；`7 / 2` 先算成 3 再加 0.0 得 3.0；强转只是把已经算好的 3 变成 3.0。想得 3.5 必须写 `7 / 2.0`。' },

    { id: 'jq5', ch: 'j2', lesson: 'j2l1', point: '自增与位运算', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        int i = 5;\n        System.out.println(i++ + ++i);\n        System.out.println(i);\n        System.out.println(1 << 3);\n        System.out.println(7 & 3);\n    }\n}',
      answer: '12\n7\n8\n3',
      explain: '`i++` 用 5 后 i 变 6，`++i` 先变 7 再用，所以 5 + 7 = 12，之后 i 是 7。`1 << 3` 是 2³ = 8，`7 & 3` 是 0111 & 0011 = 0011 = 3。' },
    { id: 'jq6', ch: 'j2', lesson: 'j2l1', point: '字符串比较', type: 'choice', diff: 2,
      prompt: '`String a = "hi"; String b = new String("hi");` 下面哪个判断为 true？',
      opts: ['a == b', 'a.equals(b)', 'a.hashCode() != b.hashCode()', 'a.compareTo(b) > 0'],
      ans: 1,
      explain: '`==` 比引用地址，`new String` 在堆上新建对象所以为 false。`equals` 比内容所以为 true。哈希值相同，`compareTo` 返回 0。' },
    { id: 'jq7', ch: 'j2', lesson: 'j2l2', point: 'switch 两种写法', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        int x = 2;\n        String r = switch (x) {\n            case 1 -> "one";\n            case 2, 3 -> "two-three";\n            default -> "other";\n        };\n        System.out.println(r);\n        switch (x) {\n            case 1: System.out.print("A");\n            case 2: System.out.print("B");\n            default: System.out.print("C");\n        }\n        System.out.println();\n    }\n}',
      answer: 'two-three\nBC',
      explain: '箭头语法不会穿透，命中 `case 2, 3` 得到 "two-three"。老式 switch 从 case 2 进入后没有 break，会继续执行 default，所以打印 BC。' },
    { id: 'jq8', ch: 'j2', lesson: 'j2l3', point: '循环控制', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        int s = 0;\n        for (int i = 1; i <= 5; i++) {\n            if (i == 3) continue;\n            s += i;\n        }\n        System.out.println(s);\n        int k = 0;\n        while (k < 3) k += 2;\n        System.out.println(k);\n    }\n}',
      answer: '12\n4',
      explain: '`continue` 跳过 i=3 那一轮，所以是 1+2+4+5 = 12。while 里 k 依次为 0→2→4，4 不再小于 3，退出。' },
    { id: 'jq9', ch: 'j2', lesson: 'j2l4', point: '数组是引用', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import java.util.Arrays;\nclass Main {\n    public static void main(String[] args) {\n        int[] a = {3, 1, 2};\n        int[] b = a;\n        b[0] = 9;\n        System.out.println(a[0]);\n        System.out.println(Arrays.toString(a));\n    }\n}',
      answer: '9\n[9, 1, 2]',
      explain: '`b = a` 复制的是引用，两个变量指向同一个数组，改 b 就是改 a。想要独立副本必须 `Arrays.copyOf(a, a.length)`。' },
    { id: 'jq10', ch: 'j2', lesson: 'j2l5', point: '重载规则', type: 'choice', diff: 2,
      prompt: '下面哪一组方法构成合法的重载？',
      opts: ['`int f(int a)` 和 `long f(int a)`', '`int f(int a)` 和 `int f(int a, int b)`', '`int f(int a)` 和 `int f(int b)`', '`void f()` 和 `int f()`'],
      ans: 1,
      explain: '重载要求**参数列表不同**。只改返回类型（A、D）不合法；只改变量名（C）参数列表其实一样，也不合法。' },

    { id: 'jq11', ch: 'j3', lesson: 'j3l1', point: '对象引用', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class A { int n; }\nclass Main {\n    public static void main(String[] args) {\n        A x = new A();\n        x.n = 1;\n        A y = x;\n        y.n = 2;\n        System.out.println(x.n);\n        A z = new A();\n        System.out.println(z.n);\n    }\n}',
      answer: '2\n0',
      explain: '`y = x` 让两个变量指向同一个对象，改 y.n 就是改 x.n。`z` 是新对象，成员变量有默认值 0。' },
    { id: 'jq12', ch: 'j3', lesson: 'j3l2', point: '构造器串联', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class P {\n    int x;\n    P() { this(10); }\n    P(int x) { this.x = x; }\n}\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(new P().x);\n        System.out.println(new P(7).x);\n    }\n}',
      answer: '10\n7',
      explain: '无参构造器用 `this(10)` 转调带参构造器，所以 x 是 10；直接传 7 就是 7。`this(...)` 只能写在构造器第一行。' },
    { id: 'jq13', ch: 'j3', lesson: 'j3l3', point: '封装的目的', type: 'choice', diff: 2,
      prompt: '把字段设为 `private` 并提供 getter / setter，最主要的目的是什么？',
      opts: ['让代码变长', '让外部不能直接改数据，从而保证规则始终成立', '提高运行速度', '让字段变成常量'],
      ans: 1,
      explain: '封装的核心价值是**控制修改的入口**。字段公开时任何人可以直接赋非法值；私有之后，所有修改都必须走你的方法，你就有机会做校验、记日志、保持一致性。' },
    { id: 'jq14', ch: 'j3', lesson: 'j3l4', point: 'static 与实例', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class C {\n    static int total = 0;\n    int id;\n    C() { id = ++total; }\n}\nclass Main {\n    public static void main(String[] args) {\n        C a = new C();\n        C b = new C();\n        System.out.println(a.id + " " + b.id);\n        System.out.println(C.total);\n    }\n}',
      answer: '1 2\n2',
      explain: '`total` 是类变量，所有对象共享一份，每 new 一次加 1。`id` 是实例变量，各存各的。' },
    { id: 'jq15', ch: 'j3', lesson: 'j3l5', point: '包与 import', type: 'choice', diff: 1,
      prompt: '哪个包里的类是**自动导入**、不需要写 import 的？',
      opts: ['java.util', 'java.io', 'java.lang', 'java.time'],
      ans: 2,
      explain: '`java.lang` 是自动导入的，String、System、Math、Object、Integer 都在里面。其他包（util、io、time）都必须显式 import。' },

    { id: 'jq16', ch: 'j4', lesson: 'j4l1', point: '继承与方法调用', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'class A {\n    String who() { return "A"; }\n    String call() { return "call " + who(); }\n}\nclass B extends A {\n    @Override String who() { return "B"; }\n}\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(new B().call());\n    }\n}',
      answer: 'call B',
      explain: '`call()` 定义在父类里，但里面的 `who()` 是**动态绑定**的：调用时看对象的真实类型（B），所以返回 B。这就是模板方法能工作的原因。' },
    { id: 'jq17', ch: 'j4', lesson: 'j4l2', point: '多态', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class A { int f() { return 1; } }\nclass B extends A { @Override int f() { return 2; } }\nclass Main {\n    public static void main(String[] args) {\n        A a = new B();\n        System.out.println(a.f());\n        A[] arr = { new A(), new B() };\n        int s = 0;\n        for (A x : arr) s += x.f();\n        System.out.println(s);\n    }\n}',
      answer: '2\n3',
      explain: '变量声明类型是 A，但对象是 B，`a.f()` 调的是 B 的实现，得 2。数组里两个对象分别返回 1 和 2，合计 3。' },
    { id: 'jq18', ch: 'j4', lesson: 'j4l3', point: '抽象类', type: 'choice', diff: 2,
      prompt: '关于抽象类，下面哪个说法正确？',
      opts: ['抽象类可以直接 new', '抽象类里不能有具体方法', '抽象类可以有构造器，但不能被实例化', '抽象类必须实现所有方法'],
      ans: 2,
      explain: '抽象类可以有构造器（供子类 `super()` 调用）、可以有具体方法、可以有字段，唯一限制是**不能直接 new**。它可以有抽象方法，也可以一个都没有。' },
    { id: 'jq19', ch: 'j4', lesson: 'j4l4', point: '接口默认方法', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'interface I {\n    int f();\n    default int g() { return f() * 2; }\n}\nclass Main {\n    public static void main(String[] args) {\n        I i = () -> 21;\n        System.out.println(i.f());\n        System.out.println(i.g());\n    }\n}',
      answer: '21\n42',
      explain: '`I` 是函数式接口（只有一个抽象方法 f），可以用 lambda 实现。`g()` 是默认方法，直接复用 `f()` 的结果。' },
    { id: 'jq20', ch: 'j4', lesson: 'j4l5', point: '枚举', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'enum E {\n    A(1), B(2);\n    private final int v;\n    E(int v) { this.v = v; }\n    int v() { return v; }\n}\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(E.B.ordinal());\n        System.out.println(E.B.v());\n        System.out.println(E.values().length);\n    }\n}',
      answer: '1\n2\n2',
      explain: '`ordinal()` 是序号，从 0 开始，B 是 1。`v()` 返回构造时传入的值 2。`values()` 返回所有常量，长度 2。' },

    { id: 'jq21', ch: 'j5', lesson: 'j5l1', point: 'String 方法', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        String s = "a,b,,c";\n        System.out.println(s.split(",").length);\n        System.out.println(s.substring(0, 3));\n        System.out.println(s.indexOf("c"));\n        System.out.println(s.replace(",", "+"));\n    }\n}',
      answer: '4\na,b\n5\na+b++c',
      explain: '`split` 会保留中间的空串（只有**末尾**空串默认被丢弃），所以是 4 段。`substring(0,3)` 取下标 0~2 得 "a,b"。`indexOf("c")` 是 5。' },
    { id: 'jq22', ch: 'j5', lesson: 'j5l2', point: 'StringBuilder 与缓存', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        StringBuilder sb = new StringBuilder("ab");\n        sb.append("c").insert(0, "X");\n        System.out.println(sb);\n        System.out.println(sb.reverse());\n        Integer i1 = 100, i2 = 100, j1 = 1000, j2 = 1000;\n        System.out.println(i1 == i2);\n        System.out.println(j1 == j2);\n        System.out.println(j1.equals(j2));\n    }\n}',
      answer: 'Xabc\ncbaX\ntrue\nfalse\ntrue',
      explain: '`Integer` 缓存 -128~127，100 在范围内所以是同一个对象，`==` 为 true；1000 超范围，两个独立对象，`==` 为 false，但 `equals` 为 true。' },
    { id: 'jq23', ch: 'j5', lesson: 'j5l3', point: '日期计算', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import java.time.*;\nclass Main {\n    public static void main(String[] args) {\n        LocalDate d = LocalDate.of(2023, 12, 31);\n        System.out.println(d.plusDays(1));\n        System.out.println(d.getDayOfWeek());\n        System.out.println(d.plusDays(1).isLeapYear());\n        System.out.println(LocalDate.of(2024, 1, 31).plusMonths(1));\n    }\n}',
      answer: '2024-01-01\nSUNDAY\ntrue\n2024-02-29',
      explain: '跨年自动进位。2023-12-31 是星期日。`plusDays` 返回新对象，d 本身还是 12-31，所以星期仍是 SUNDAY。1 月 31 日加一个月会**自动修正到 2 月最后一天**（闰年 29 日）。' },
    { id: 'jq24', ch: 'j5', lesson: 'j5l4', point: 'Math.round', type: 'choice', diff: 3,
      prompt: '`Math.round(2.5)` 和 `Math.round(-2.5)` 分别返回？',
      opts: ['3 和 -3', '3 和 -2', '2 和 -2', '2 和 -3'],
      ans: 1,
      explain: '`Math.round` 等价于 `floor(x + 0.5)`：2.5 + 0.5 = 3.0 向下取整得 3；-2.5 + 0.5 = -2.0 得 -2。所以负数的「四舍五入」偏向更大的一侧，和直觉不同。' },
    { id: 'jq25', ch: 'j5', lesson: 'j5l5', point: '正则', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("a1b22c333".replaceAll("\\\\d+", "#"));\n        System.out.println("2024-03-01".matches("\\\\d{4}-\\\\d{2}-\\\\d{2}"));\n        System.out.println("abc".matches("a.c"));\n        System.out.println("abc".matches("a.*c"));\n    }\n}',
      answer: 'a#b#c#\ntrue\ntrue\ntrue',
      explain: '`\\\\d+` 匹配连续的数字串，每段整体替换成一个 `#`。`matches` 要求**整个字符串**匹配，`.` 匹配任意单字符，`.*` 匹配任意长度。' },

    { id: 'jq26', ch: 'j6', lesson: 'j6l1', point: 'List 操作', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n        List<String> l = new ArrayList<>(Arrays.asList("a", "b", "c"));\n        l.add(1, "x");\n        System.out.println(l);\n        l.remove(1);\n        System.out.println(l);\n        l.set(0, "z");\n        System.out.println(l);\n        System.out.println(l.size());\n    }\n}',
      answer: '[a, x, b, c]\n[a, b, c]\n[z, b, c]\n3',
      explain: '`add(1, "x")` 插到下标 1，原来元素后移。`remove(1)` 删下标 1（也就是 x）。`set` 是替换，不改变长度。' },
    { id: 'jq27', ch: 'j6', lesson: 'j6l2', point: 'Set 去重', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n        Set<String> s = new HashSet<>();\n        System.out.println(s.add("a"));\n        System.out.println(s.add("a"));\n        System.out.println(s.size());\n        Set<Integer> t = new TreeSet<>(Arrays.asList(3, 1, 3, 2));\n        System.out.println(t);\n    }\n}',
      answer: 'true\nfalse\n1\n[1, 2, 3]',
      explain: '`add` 返回是否真的插入了：第一次 true，重复时 false（集合不变）。`TreeSet` 自动去重并排序，所以是 [1, 2, 3]。' },
    { id: 'jq28', ch: 'j6', lesson: 'j6l3', point: 'Map 基本操作', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n        Map<String, Integer> m = new HashMap<>();\n        m.put("a", 1);\n        m.put("a", 2);\n        System.out.println(m.size() + " " + m.get("a"));\n        System.out.println(m.get("z"));\n        System.out.println(m.getOrDefault("z", 0));\n        m.putIfAbsent("b", 5);\n        System.out.println(new TreeMap<>(m));\n    }\n}',
      answer: '1 2\nnull\n0\n{a=2, b=5}',
      explain: '键重复时 `put` 覆盖旧值，size 仍是 1。取不存在的键返回 null（不会抛异常），`getOrDefault` 才给默认值。' },
    { id: 'jq29', ch: 'j6', lesson: 'j6l4', point: '类型擦除', type: 'choice', diff: 3,
      prompt: '关于 Java 的泛型，下面哪个说法正确？',
      opts: ['运行时能区分 List<String> 和 List<Integer>', '泛型在编译后会被擦除，运行时都是 List', '可以创建泛型数组 new T[10]', '静态方法可以使用类的类型参数 T'],
      ans: 1,
      explain: 'Java 泛型是「编译期检查 + 运行时擦除」。所以不能 `new T[]`、不能 `instanceof List<String>`、静态成员不能用类的 T——这些都是为兼容老代码付出的代价。' },
    { id: 'jq30', ch: 'j6', lesson: 'j6l5', point: '迭代器删除', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n        List<Integer> l = new ArrayList<>(Arrays.asList(1, 2, 3, 4));\n        Iterator<Integer> it = l.iterator();\n        while (it.hasNext()) {\n            if (it.next() % 2 == 0) it.remove();\n        }\n        System.out.println(l);\n        l.remove(Integer.valueOf(3));\n        System.out.println(l);\n    }\n}',
      answer: '[1, 3]\n[1]',
      explain: '迭代器删除偶数，剩下 [1, 3]。`remove(Integer.valueOf(3))` 按值删除，剩下 [1]。注意 `remove(3)` 是按下标删，会抛越界。' },

    { id: 'jq31', ch: 'j7', lesson: 'j7l1', point: '受检异常', type: 'choice', diff: 2,
      prompt: '哪个异常是**受检异常**（必须 try-catch 或在方法上 throws）？',
      opts: ['NullPointerException', 'ArrayIndexOutOfBoundsException', 'IOException', 'IllegalArgumentException'],
      ans: 2,
      explain: '`IOException` 继承 `Exception` 但不是 `RuntimeException`，属于受检异常，编译器强制处理。其余三个都是 `RuntimeException` 的子类，编译器不管。' },
    { id: 'jq32', ch: 'j7', lesson: 'j7l2', point: 'finally 执行时机', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'class Main {\n    static int f() {\n        try { return 1; }\n        finally { System.out.println("finally"); }\n    }\n    public static void main(String[] args) {\n        System.out.println(f());\n        try {\n            throw new RuntimeException("x");\n        } catch (RuntimeException e) {\n            System.out.println("catch " + e.getMessage());\n        } finally {\n            System.out.println("done");\n        }\n    }\n}',
      answer: 'finally\n1\ncatch x\ndone',
      explain: '`finally` 在方法真正返回**之前**执行，所以先打印 finally 再打印返回值 1。第二段同理：catch 打印完，finally 再打印 done。' },
    { id: 'jq33', ch: 'j7', lesson: 'j7l3', point: '读大文件', type: 'choice', diff: 2,
      prompt: '要读取一个 2 GB 的日志文件并统计行数，应该用？',
      opts: ['Files.readAllLines(path)', 'Files.readString(path)', 'Files.lines(path) 逐行流式处理', 'Files.readAllBytes(path)'],
      ans: 2,
      explain: '前两个和 `readAllBytes` 都会把整个文件读进内存，2 GB 直接 OOM。`Files.lines` 返回 Stream，逐行读取，内存占用恒定。' },
    { id: 'jq34', ch: 'j7', lesson: 'j7l4', point: 'Properties', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import java.util.Properties;\nclass Main {\n    public static void main(String[] args) {\n        Properties p = new Properties();\n        p.setProperty("a", "1");\n        System.out.println(p.getProperty("a"));\n        System.out.println(p.getProperty("b"));\n        System.out.println(p.getProperty("b", "默认"));\n        System.out.println(p.size());\n    }\n}',
      answer: '1\nnull\n默认\n1',
      explain: '`getProperty` 取不到返回 null，带默认值的重载才返回「默认」。size 只算真正设过的键。' },

    { id: 'jq35', ch: 'j8', lesson: 'j8l1', point: 'start 与 run', type: 'choice', diff: 2,
      prompt: '直接调用 `thread.run()` 而不是 `thread.start()`，会怎样？',
      opts: ['在新线程里执行', '在当前线程里当普通方法调用，没有并发', '抛异常', '启动两个线程'],
      ans: 1,
      explain: '`start()` 才会让 JVM 创建新线程并回调 `run()`。直接调 `run()` 只是一次普通方法调用，代码仍在当前线程顺序执行——不报错，但没有并发。' },
    { id: 'jq36', ch: 'j8', lesson: 'j8l2', point: '同步', type: 'output', diff: 2,
      prompt: '写出输出（4 个线程各加 2500 次，方法带 synchronized）。',
      code: 'class C {\n    private int n = 0;\n    synchronized void inc() { n++; }\n    int get() { return n; }\n}\nclass Main {\n    public static void main(String[] args) throws Exception {\n        C c = new C();\n        Thread t = new Thread(() -> { for (int i = 0; i < 1000; i++) c.inc(); });\n        t.start();\n        t.join();\n        System.out.println(c.get());\n        System.out.println(Thread.currentThread().getName().equals("main"));\n    }\n}',
      answer: '1000\ntrue',
      explain: '加锁后每次自增都不会丢失，结果就是 1000。主线程名字默认是 "main"。去掉 `synchronized` 后结果可能小于 1000。' },
    { id: 'jq37', ch: 'j8', lesson: 'j8l3', point: '线程池关闭', type: 'choice', diff: 2,
      prompt: '`pool.shutdown()` 的作用是？',
      opts: ['立刻中断所有正在执行的任务', '不再接受新任务，已提交的任务会执行完', '什么也不做', '清空队列并抛异常'],
      ans: 1,
      explain: '`shutdown()` 是「优雅关闭」：拒绝新任务，等已有任务跑完再退出。要立刻中断用 `shutdownNow()`（但它也只是发中断信号，不保证停）。' },
    { id: 'jq38', ch: 'j8', lesson: 'j8l4', point: 'URI 解析', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import java.net.URI;\nclass Main {\n    public static void main(String[] args) {\n        URI u = URI.create("https://example.com:8080/a/b?x=1");\n        System.out.println(u.getScheme());\n        System.out.println(u.getHost());\n        System.out.println(u.getPort());\n        System.out.println(u.getPath());\n    }\n}',
      answer: 'https\nexample.com\n8080\n/a/b',
      explain: '协议、主机、端口、路径各自独立。注意没写端口时 `getPort()` 返回 -1，而不是 80 或 443。' },

    { id: 'jq39', ch: 'j9', lesson: 'j9l1', point: '函数组合', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'import java.util.function.*;\nclass Main {\n    public static void main(String[] args) {\n        Function<Integer, Integer> f = x -> x + 1;\n        Function<Integer, Integer> g = x -> x * 2;\n        System.out.println(f.andThen(g).apply(3));\n        System.out.println(g.andThen(f).apply(3));\n        System.out.println(f.compose(g).apply(3));\n    }\n}',
      answer: '8\n7\n7',
      explain: '`f.andThen(g)` 先 f 后 g：(3+1)*2 = 8。`g.andThen(f)` 先 g 后 f：3*2+1 = 7。`f.compose(g)` 等价于 `f(g(x))`，也是 7。' },
    { id: 'jq40', ch: 'j9', lesson: 'j9l2', point: 'Stream', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'import java.util.*;\nimport java.util.stream.*;\nclass Main {\n    public static void main(String[] args) {\n        List<Integer> l = Arrays.asList(1, 2, 3, 4, 5);\n        System.out.println(l.stream().filter(x -> x % 2 == 1).mapToInt(x -> x).sum());\n        System.out.println(l.stream().reduce(0, Integer::sum));\n        System.out.println(l.stream().map(String::valueOf).collect(Collectors.joining(",")));\n        System.out.println(l.stream().anyMatch(x -> x > 4));\n    }\n}',
      answer: '9\n15\n1,2,3,4,5\ntrue',
      explain: 'filter 留下奇数 1+3+5 = 9；reduce 从 0 开始累加得 15；joining 用逗号拼成字符串；anyMatch 判断「是否存在大于 4 的元素」，5 满足所以是 true。' }
  ],

  checkin: [
    { id: 'jk1', ch: 'j1', point: 'JDK 与 JRE', type: 'choice', diff: 1,
      prompt: '只想运行别人编译好的 Java 程序，最少需要装什么？',
      opts: ['只要 JVM', 'JRE', 'JDK', '都不需要'],
      ans: 1,
      explain: 'JRE = JVM + 标准类库，能运行但不能编译。要自己编译代码才需要 JDK（它包含 JRE）。' },
    { id: 'jk2', ch: 'j1', point: '文件名规则', type: 'choice', diff: 1,
      prompt: '一个文件里有 `public class Hello`，文件名必须是？',
      opts: ['任意名字', 'Hello.java', 'hello.java', 'Hello.class'],
      ans: 1,
      explain: '`public` 类的名字必须和文件名完全一致（含大小写）。`hello.java` 会报「类 Hello 是 public，应在名为 Hello.java 的文件中声明」。' },
    { id: 'jk3', ch: 'j1', point: 'print 与 println', type: 'choice', diff: 1,
      prompt: '`System.out.print` 和 `System.out.println` 的区别是？',
      opts: ['前者更快', '后者输出后换行', '前者不能输出中文', '没有区别'],
      ans: 1,
      explain: '`println` 末尾会加换行符，`print` 不加。想连续在一行输出用 `print`，最后再 `println()` 收尾。' },
    { id: 'jk4', ch: 'j1', point: '成员变量默认值', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class A { int i; double d; boolean b; String s; }\nclass Main {\n    public static void main(String[] args) {\n        A a = new A();\n        System.out.println(a.i + " " + a.d + " " + a.b + " " + a.s);\n    }\n}',
      answer: '0 0.0 false null',
      explain: '成员变量有默认值：数值类型是 0、布尔是 false、引用类型是 null。**局部变量没有默认值**，不初始化直接用会编译报错。' },

    { id: 'jk5', ch: 'j1', point: 'String 的类型', type: 'choice', diff: 1,
      prompt: '`String` 是基本类型吗？',
      opts: ['是，和 int 一样', '不是，它是引用类型（类）', '看情况', '只有 String[] 才是'],
      ans: 1,
      explain: '八种基本类型是 byte/short/int/long/float/double/char/boolean。String 是类，属于引用类型，所以比较内容必须用 `equals`。' },
    { id: 'jk6', ch: 'j1', point: '字面量后缀', type: 'choice', diff: 2,
      prompt: '`long x = 10000000000;` 编译报错，怎么改？',
      opts: ['改成 `long x = 10000000000L;`', '改成 `double x = ...`', '加括号', '改成 `Long x = ...`'],
      ans: 0,
      explain: '整数字面量默认是 `int`，超过 21 亿就编译不过。加 `L` 表示这是 long 字面量。同理 float 要加 `f`。' },
    { id: 'jk7', ch: 'j1', point: '整数除法', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        int a = 7, b = 2;\n        System.out.println(a / b);\n        System.out.println((double) a / b);\n        System.out.println(a % b);\n    }\n}',
      answer: '3\n3.5\n1',
      explain: '整数相除结果是整数，小数被截断。想让结果带小数，至少一边要是 double。`%` 取余数。' },

    { id: 'jk8', ch: 'j2', point: '三元表达式', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        int a = 5;\n        String s = a > 3 ? "大" : "小";\n        System.out.println(s);\n        System.out.println(a > 10 ? 1 : 2.5);\n    }\n}',
      answer: '大\n2.5',
      explain: '三目是「条件 ? 值1 : 值2」，整个表达式的类型取两边的公共类型。1 和 2.5 的公共类型是 double，所以打印 2.5。' },
    { id: 'jk9', ch: 'j2', point: '自增单独成句', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        int i = 1;\n        i++;\n        ++i;\n        System.out.println(i);\n        System.out.println(i++);\n        System.out.println(i);\n    }\n}',
      answer: '3\n3\n4',
      explain: '单独成句时 `i++` 和 `++i` 都是加 1，两次之后 i=3。在 `println(i++)` 里才有区别：先打印 3，再自增成 4。' },

    { id: 'jk10', ch: 'j2', point: 'switch 支持类型', type: 'choice', diff: 2,
      prompt: '`switch` 的表达式**不能**是哪种类型？',
      opts: ['int', 'String', 'enum', 'double'],
      ans: 3,
      explain: '`switch` 支持整型、char、String、枚举，不支持 long 和浮点数。判断范围或浮点要用 if。' },
    { id: 'jk11', ch: 'j2', point: 'for-each 限制', type: 'choice', diff: 2,
      prompt: '用 `for (int x : arr)` 遍历时，`x = 0;` 能把数组元素改成 0 吗？',
      opts: ['能', '不能，x 是元素的副本', '只能改第一个', '会编译报错'],
      ans: 1,
      explain: '增强 for 的变量是**元素的副本**，改它不影响数组。要改元素必须用下标 `arr[i] = 0`。' },
    { id: 'jk12', ch: 'j2', point: '数组长度', type: 'choice', diff: 1,
      prompt: '获取数组长度的正确写法是？',
      opts: ['a.length()', 'a.length', 'a.size()', 'a.count'],
      ans: 1,
      explain: '数组用 `length`（属性，不带括号），字符串用 `length()`（方法），集合用 `size()`。三个容易混。' },
    { id: 'jk13', ch: 'j2', point: '打印数组', type: 'choice', diff: 2,
      prompt: '想打印 `int[] a` 的内容，应该用？',
      opts: ['System.out.println(a)', 'System.out.println(a.toString())', 'System.out.println(Arrays.toString(a))', 'System.out.println(a[0])'],
      ans: 2,
      explain: '数组的 `toString()` 没被重写，打印出来是 `[I@1b6d3586` 这种地址串。要打印内容必须用 `Arrays.toString`（二维用 `deepToString`）。' },

    { id: 'jk14', ch: 'j3', point: '重载 vs 重写', type: 'choice', diff: 2,
      prompt: '「重写（override）」发生的位置是？',
      opts: ['同一个类里，方法名相同参数不同', '子类与父类之间，方法签名相同', '任意两个类之间', '接口与实现类之间且方法名不同'],
      ans: 1,
      explain: '重写是子类重新实现父类的同名同参方法，运行时动态绑定。重载是同一个类里同名不同参，编译期决定。' },
    { id: 'jk15', ch: 'j3', point: '构造器', type: 'choice', diff: 1,
      prompt: '构造器的写法，正确的是？',
      opts: ['`public void Student() {}`', '`public Student() {}`', '`public Student(void) {}`', '`void Student() {}`'],
      ans: 1,
      explain: '构造器**没有返回类型**（连 void 都不能写），名字必须和类名完全一致。写了 void 就变成普通方法了。' },
    { id: 'jk16', ch: 'j3', point: 'this 的用途', type: 'choice', diff: 1,
      prompt: '`this.name = name;` 里的 `this` 指什么？',
      opts: ['当前类的类对象', '当前正在执行的对象', '父类对象', '方法参数'],
      ans: 1,
      explain: '`this` 指当前对象。当参数名和字段名相同时，用 `this.name` 明确「左边是字段」。`this(...)` 还能调用本类其他构造器。' },
    { id: 'jk17', ch: 'j3', point: 'private 的范围', type: 'choice', diff: 2,
      prompt: '`private` 成员的可见范围是？',
      opts: ['只有本类内部', '同包的类', '所有子类', '所有类'],
      ans: 0,
      explain: '`private` 只在**本类**内部可见，子类也访问不到（虽然能继承这块内存，但没法直接引用）。要通过 getter 或 protected 暴露。' },
    { id: 'jk18', ch: 'j3', point: 'static 方法限制', type: 'choice', diff: 2,
      prompt: '在 `static` 方法里直接写 `count++`（count 是实例字段），会怎样？',
      opts: ['正常执行', '编译错误：不能从静态上下文引用非静态变量', '运行时抛异常', 'count 变成 null'],
      ans: 1,
      explain: 'static 方法属于类，没有 this，不知道操作哪个对象的 count。要么把 count 也改成 static，要么改成实例方法。' },

    { id: 'jk19', ch: 'j4', point: '继承私有成员', type: 'choice', diff: 2,
      prompt: '子类能直接访问父类的 `private` 字段吗？',
      opts: ['能，继承下来了', '不能，只能通过父类提供的 public / protected 方法', '能，但要加 super', '取决于是否同包'],
      ans: 1,
      explain: 'private 成员对子类不可见。子类对象内部确实有那块内存，但无法直接命名访问，必须通过父类给的 getter / setter。' },
    { id: 'jk20', ch: 'j4', point: '@Override 作用', type: 'choice', diff: 1,
      prompt: '`@Override` 注解的实际作用是？',
      opts: ['让方法执行更快', '让编译器检查确实重写了父类方法', '自动生成方法体', '让方法变成静态'],
      ans: 1,
      explain: '它不改变运行行为，只是**编译期检查**：如果方法名拼错或签名不匹配，会立刻报错，而不是悄悄变成一个无关的新方法。' },
    { id: 'jk21', ch: 'j4', point: '抽象类构造器', type: 'choice', diff: 3,
      prompt: '抽象类可以有构造器吗？',
      opts: ['不能，抽象类不能被实例化', '能，供子类 super() 调用', '能，但只能是无参的', '只有接口不能有'],
      ans: 1,
      explain: '抽象类可以有任意构造器，子类构造时通过 `super(...)` 调用它。只是不能 `new 抽象类()` 而已。' },
    { id: 'jk22', ch: 'j4', point: '接口多实现', type: 'choice', diff: 1,
      prompt: '一个 Java 类最多能实现几个接口？',
      opts: ['1 个', '2 个', '数量不限', '取决于 JDK 版本'],
      ans: 2,
      explain: '接口可以实现任意多个：`class A implements X, Y, Z`。这是 Java 在「单继承」限制下获得多态灵活性的方式。' },
    { id: 'jk23', ch: 'j4', point: '枚举取值', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'enum Color { RED, GREEN, BLUE }\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(Color.GREEN.ordinal());\n        System.out.println(Color.values()[2]);\n        System.out.println(Color.valueOf("RED").name());\n    }\n}',
      answer: '1\nBLUE\nRED',
      explain: '`ordinal()` 是序号（从 0 开始），`values()` 返回所有常量数组，`valueOf("X")` 按名字取常量。' },

    { id: 'jk24', ch: 'j5', point: 'String 不可变', type: 'choice', diff: 2,
      prompt: '`s.toUpperCase();` 调用后 s 会变成大写吗？',
      opts: ['会', '不会，必须接收返回值', '只有纯字母才会', '取决于 JVM'],
      ans: 1,
      explain: 'String 不可变，所有「修改」方法都返回**新字符串**。写成 `s = s.toUpperCase();` 才生效。这个坑非常常见。' },
    { id: 'jk25', ch: 'j5', point: 'String 不可变的价值', type: 'choice', diff: 3,
      prompt: 'String 设计成不可变，带来哪些好处？',
      opts: ['拼接更快', '可以安全共享、哈希值可缓存、天然线程安全', '占用内存更少', '可以直接比较地址'],
      ans: 1,
      explain: '不可变意味着对象一旦创建就安全共享（常量池），`hashCode` 可以缓存（HashMap 快），多线程下也不用加锁。代价是拼接产生临时对象。' },
    { id: 'jk26', ch: 'j5', point: 'String 不可变实测', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        String s = "abc";\n        s.toUpperCase();\n        System.out.println(s);\n        s = s.toUpperCase();\n        System.out.println(s);\n        System.out.println(s.length());\n    }\n}',
      answer: 'abc\nABC\n3',
      explain: '第一次调用没有接收返回值，s 还是 "abc"。第二次赋回给 s 才变成 "ABC"。' },
    { id: 'jk27', ch: 'j5', point: 'StringBuilder 场景', type: 'choice', diff: 2,
      prompt: '为什么循环里拼接字符串建议用 StringBuilder？',
      opts: ['语法更短', 'String 每次 `+` 都创建新对象，循环多了会产生大量垃圾', 'StringBuilder 支持中文', 'String 不能拼接'],
      ans: 1,
      explain: '`s += x` 每次都新建一个 String（老对象变垃圾），n 次循环产生 n 个对象。StringBuilder 内部是可变数组，只有最后 `toString()` 才生成一次字符串。' },
    { id: 'jk28', ch: 'j5', point: '自动拆箱', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        Integer n = null;\n        try {\n            int x = n;\n            System.out.println(x);\n        } catch (NullPointerException e) {\n            System.out.println("空指针");\n        }\n        System.out.println(n == null);\n    }\n}',
      answer: '空指针\ntrue',
      explain: '`int x = n;` 会触发自动拆箱，也就是调用 `n.intValue()`，对 null 调用方法就抛 NPE。接口参数用包装类时这个坑很常见。' },
    { id: 'jk29', ch: 'j5', point: '日期不可变', type: 'choice', diff: 2,
      prompt: '`LocalDate d = LocalDate.of(2024,1,1); d.plusDays(1);` 之后 d 是？',
      opts: ['2024-01-02', '仍然是 2024-01-01', 'null', '报错'],
      ans: 1,
      explain: '`java.time` 的对象都不可变，`plusDays` 返回**新对象**。必须写 `d = d.plusDays(1);`。' },
    { id: 'jk30', ch: 'j5', point: 'Math.abs 边界', type: 'output', diff: 3,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        System.out.println(Math.abs(Integer.MIN_VALUE));\n        System.out.println(Integer.MAX_VALUE + 1);\n        System.out.println(Math.abs(-5));\n    }\n}',
      answer: '-2147483648\n-2147483648\n5',
      explain: 'int 的最小值是 -2147483648，它的相反数 2147483648 超出了 int 上限，所以 `Math.abs` 返回的还是负数。这是二进制补码的必然结果，取绝对值前要判断边界。' },

    { id: 'jk31', ch: 'j6', point: 'List 与 Set', type: 'choice', diff: 1,
      prompt: '既要保证元素不重复、又要保持插入顺序，用哪个？',
      opts: ['ArrayList', 'HashSet', 'LinkedHashSet', 'HashMap'],
      ans: 2,
      explain: '`LinkedHashSet` = 哈希表 + 链表，既能去重又能保持插入顺序。`HashSet` 不保证顺序，`TreeSet` 会排序。' },
    { id: 'jk32', ch: 'j6', point: 'Map 键的要求', type: 'choice', diff: 2,
      prompt: '自定义对象作为 `HashMap` 的键，必须正确重写哪两个方法？',
      opts: ['toString 和 clone', 'hashCode 和 equals', 'compareTo 和 equals', '只有 hashCode'],
      ans: 1,
      explain: 'HashMap 先按 `hashCode` 找桶，再用 `equals` 在桶内找。两个不配套就会「明明相等却取不到」，或者两个相等的对象被存成两份。' },
    { id: 'jk33', ch: 'j6', point: 'PECS 原则', type: 'choice', diff: 3,
      prompt: '只往集合里放元素、不读出来的方法，参数应该声明成？',
      opts: ['List<? extends Number>', 'List<? super Integer>', 'List<Object>', 'List<?>'],
      ans: 1,
      explain: 'PECS：Producer Extends, Consumer Super。作为「消费者」（往里写）用 `super`，能接受 `List<Integer>`、`List<Number>`、`List<Object>`。' },
    { id: 'jk34', ch: 'j6', point: '遍历时删除', type: 'choice', diff: 2,
      prompt: '遍历 List 的同时要删除元素，正确做法是？',
      opts: ['for-each 里直接 list.remove(x)', '用 Iterator.remove() 或 list.removeIf(...)', '先 for-each 遍历，再单独 remove', '用 while 无限循环删'],
      ans: 1,
      explain: 'for-each 里直接删会抛 `ConcurrentModificationException`（迭代器的修改计数对不上）。用 `Iterator.remove()` 或 `removeIf` 才对。' },

    { id: 'jk35', ch: 'j7', point: 'throws 声明', type: 'choice', diff: 2,
      prompt: '方法里可能抛 `IOException` 又不想当场处理，应该怎么写？',
      opts: ['在方法上加 `throws IOException`', '在方法上加 `throw IOException`', '什么都不用写', '在类上加 @Throws'],
      ans: 0,
      explain: '受检异常要么 try-catch，要么在方法签名上 `throws IOException` 交给自己调用方处理。`throw` 是抛出一个具体异常对象，不是声明。' },
    { id: 'jk36', ch: 'j7', point: 'try-with-resources 条件', type: 'choice', diff: 2,
      prompt: '一个资源类要能用在 try-with-resources 里，必须满足什么？',
      opts: ['实现 Serializable', '实现 AutoCloseable', '有 close 方法即可', '继承 Thread'],
      ans: 1,
      explain: '必须实现 `AutoCloseable`（或它的子接口 `Closeable`），编译器才会在 try 结束时自动调用 `close()`。' },
    { id: 'jk37', ch: 'j8', point: '线程启动', type: 'choice', diff: 1,
      prompt: '让线程真正开始执行，应该调用？',
      opts: ['t.run()', 't.start()', 't.exec()', 't.begin()'],
      ans: 1,
      explain: '`start()` 才会让 JVM 创建新线程并回调 `run()`。直接调 `run()` 只是在当前线程里当普通方法执行，没有并发。' },
    { id: 'jk38', ch: 'j8', point: '同步的锁对象', type: 'choice', diff: 3,
      prompt: '`synchronized void inc()` 用的锁是哪个对象？',
      opts: ['类对象', '当前实例 this', '一个隐式新建的锁', '调用线程'],
      ans: 1,
      explain: '实例方法上的 `synchronized` 锁的是 **this**。所以两个不同对象的方法可以同时执行，同一对象才互斥。要给整个类加锁得用 `synchronized (Xxx.class)` 或 static 同步方法。' },
    { id: 'jk39', ch: 'j9', point: 'lambda 捕获', type: 'choice', diff: 3,
      prompt: 'lambda 里引用外部局部变量，有什么限制？',
      opts: ['没有限制', '变量必须是 final 或事实不变（不再被赋值）', '必须是 static 变量', '必须是包装类型'],
      ans: 1,
      explain: 'lambda 捕获的是变量的**值**，所以要求它不变。想在 lambda 里累加，用 `AtomicInteger` 或单元素数组。' },
    { id: 'jk40', ch: 'j9', point: '单元测试', type: 'choice', diff: 1,
      prompt: 'JUnit 5 里标记一个测试方法的注解是？',
      opts: ['@Test', '@UnitTest', '@Case', '@Run'],
      ans: 0,
      explain: '`@Test` 标记测试方法，配合 `assertEquals`、`assertThrows` 等断言。方法通常写成包级可见（不用 public）。' }
  ]

};
