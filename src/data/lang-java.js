/* ============================================================
   CodeCraft 数据 · Java
   ============================================================ */
window.LANGS = window.LANGS || {};

window.LANGS.java = {
  id: 'java', name: 'Java', en: 'Java 21', icon: '☕', color: '#e76f00',
  blurb: '企业级后端的主力语言。强类型、跨平台、生态庞大，理解了类与接口，Spring 那套东西才有落脚点。',
  hello: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}',
  lab: [
    { name: 'Hello World', code: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}' },
    { name: '读两数求和', code: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println("sum = " + (a + b));\n    }\n}' },
    { name: 'ArrayList 求和', code: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<Integer> v = new ArrayList<>(List.of(80, 92, 66, 100));\n        int s = 0;\n        for (int x : v) s += x;\n        System.out.println("sum = " + s);\n        System.out.println("avg = " + (double) s / v.size());\n    }\n}' },
    { name: 'HashMap 计数', code: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Map<String, Integer> cnt = new TreeMap<>();\n        for (String w : new String[]{"a", "b", "a", "c", "a"}) {\n            cnt.merge(w, 1, Integer::sum);\n        }\n        System.out.println(cnt);\n    }\n}' }
  ],
  chapters: [
    {
      id: 'j1', num: 1, title: '类型、字符串与输入输出', icon: '☕',
      intro: 'Java 是强类型语言：变量必须声明类型，而且类型一旦定下不能装别的东西。这一章从第一个程序讲到 String 的不可变性——后者直接决定你写的代码有没有性能问题。',
      goals: ['看懂 class Main 与 main 方法的结构', '分清基本类型与包装类，知道自动装箱的代价', '用 == 和 equals 的正确场合', '用 StringBuilder 做字符串拼接'],
      lessons: [
        {
          id: 'j1l1', title: '第一个程序的结构', key: 'class · main · println', time: 10,
          blocks: [
            { t: 'p', x: 'Java 里**所有代码都必须写在类里**，没有游离的函数。程序入口是一个固定签名的方法：`public static void main(String[] args)`。这五个词各有含义，少一个就找不到入口。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n        System.out.print("不换行");\n        System.out.println("，接着这一行");\n    }\n}', out: 'Hello, Java!\n不换行，接着这一行' },
            { t: 'table', head: ['组成部分', '含义', '少了会怎样'], rows: [
              ['`class Main`', '类声明，文件名要与 public 类同名', '找不到类'],
              ['`public`', '公开，JVM 才能调用', '`main` 不是 public 就无法作为入口'],
              ['`static`', '不用创建对象就能调用', '报「非静态方法无法从静态上下文引用」'],
              ['`void`', '不返回值', '签名不匹配，找不到入口'],
              ['`String[] args`', '命令行参数的容器', '签名不匹配'],
              ['`System.out.println`', '标准输出并换行', '——']
            ] },
            { t: 'warn', x: '**本站在线编译器有个约定：主类必须写成 `class Main`，不能加 `public`。** 因为 Java 要求 public 类必须和文件名一致（Main.java），而在线环境把代码存成了 `prog.java`。你在自己电脑上写 `public class Main` 放进 Main.java 是完全正确的。' },
            { t: 'note', x: 'Java 是「先编译成字节码，再由 JVM 执行」。`javac Main.java` 生成 `Main.class`，`java Main` 启动 JVM 加载它。字节码面向 JVM 而不是具体 CPU，这就是「一次编译，到处运行」的由来。' }
          ]
        },
        {
          id: 'j1l2', title: '基本类型与包装类', key: 'int · Integer · 装箱', time: 12,
          blocks: [
            { t: 'p', x: 'Java 有 8 种**基本类型**（primitive），它们是值，不是对象，存在栈上，运算快。每个基本类型都有一个对应的**包装类**（Integer、Double…），用于放进集合或表示「可能没有值」。' },
            { t: 'table', head: ['基本类型', '大小', '包装类', '默认值'], rows: [
              ['byte', '1 字节', 'Byte', '0'],
              ['short', '2 字节', 'Short', '0'],
              ['int', '4 字节', 'Integer', '0'],
              ['long', '8 字节', 'Long', '0L'],
              ['float', '4 字节', 'Float', '0.0f'],
              ['double', '8 字节', 'Double', '0.0'],
              ['char', '2 字节（Unicode）', 'Character', '`\\u0000`'],
              ['boolean', '1 位（JVM 相关）', 'Boolean', 'false']
            ] },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        int a = 7, b = 2;\n        System.out.println(a / b);\n        System.out.println(a / (double) b);\n        System.out.println(10 / 3 * 3);\n        System.out.println(0.1 + 0.2);\n\n        int max = Integer.MAX_VALUE;\n        System.out.println(max + 1);        /* 溢出会绕回负数 */\n        System.out.println((long) max + 1); /* 先转 long 才对 */\n    }\n}', out: '3\n3.5\n9\n0.30000000000000004\n-2147483648\n2147483648' },
            { t: 'warn', x: 'Java 的整数溢出**不会报错**，会静默回绕。大数计算要用 `long` 或 `BigInteger`。浮点也别用来算钱：`0.1+0.2 != 0.3`，金额请用 `BigDecimal` 或「以分为单位的整数」。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        Integer x = 127, y = 127;\n        Integer p = 128, q = 128;\n        System.out.println(x == y);\n        System.out.println(p == q);\n        System.out.println(p.equals(q));\n    }\n}', out: 'true\nfalse\ntrue' },
            { t: 'note', x: '`Integer` 会缓存 -128~127 的对象，所以 `127 == 127` 是 true（同一个缓存对象），而 `128 == 128` 是 false（两个新对象）。**包装类一律用 `equals` 比较**，这条规则能免掉一大类诡异 bug。' }
          ]
        },
        {
          id: 'j1l3', title: 'String 不可变与 StringBuilder', key: '不可变 · equals · 拼接', time: 12,
          blocks: [
            { t: 'p', x: '`String` 对象一旦创建就**不能修改**。`s += "x"` 看起来是改了 s，实际上是造了一个新字符串，旧的被丢弃。理解这一点，才知道什么时候该用 `StringBuilder`。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        String s = "Code";\n        s += "Craft";\n        System.out.println(s + " " + s.length());\n        System.out.println(s.substring(0, 4));\n        System.out.println(s.indexOf("Craft"));\n        System.out.println(s.toUpperCase());\n        System.out.println(s.charAt(0));\n    }\n}', out: 'CodeCraft 9\nCode\n4\nCODECRAFT\nC' },
            { t: 'h', x: '== 和 equals，一个比地址一个比内容' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        String a = "hi";\n        String b = "hi";            /* 字符串常量池，复用同一个对象 */\n        String c = new String("hi"); /* 强制新建对象 */\n\n        System.out.println(a == b);\n        System.out.println(a == c);\n        System.out.println(a.equals(c));\n    }\n}', out: 'true\nfalse\ntrue' },
            { t: 'warn', x: '**字符串比较永远用 `equals`**。`==` 比的是引用（是不是同一个对象），常量池复用会让它「有时对有时错」，是最难查的一类 bug。空值安全比较把常量写前面：`"yes".equals(input)`，input 为 null 也不会抛异常。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        StringBuilder sb = new StringBuilder();\n        for (int i = 1; i <= 4; i++) {\n            sb.append(i).append(i == 4 ? "" : "-");\n        }\n        System.out.println(sb.toString());\n        System.out.println(sb.reverse());\n    }\n}', out: '1-2-3-4\n4-3-2-1' },
            { t: 'principle', x: '**循环里拼接字符串，一律用 `StringBuilder`。** `s += x` 在循环里是 O(n²)（每次都复制整个前缀），`sb.append` 是 O(n)。这个差别在几千次循环时就能明显感觉到。' }
          ]
        }
      ]
    },
    {
      id: 'j2', num: 2, title: '流程控制与数组', icon: '🔀',
      intro: 'Java 的 if、for、while 和 C 几乎一样，但多了增强 for 和 switch 的新写法。数组这块要特别注意：Java 数组是对象，自带 length 字段，而且越界会抛异常——比 C 安全，但也要知道异常长什么样。',
      goals: ['写 if / switch（含箭头语法）', '用增强 for 遍历数组与集合', '理解数组是对象、length 是字段', '用 Arrays 工具类排序和打印'],
      lessons: [
        {
          id: 'j2l1', title: '条件与 switch', key: 'if · switch · 箭头', time: 10,
          blocks: [
            { t: 'p', x: 'Java 的条件表达式**必须是 boolean**，不能像 C 那样用 `if (1)`。这个限制刚开始觉得烦，实际能挡掉一整类手误（比如把 `==` 写成 `=`）。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        int score = 85;\n        if (score >= 90) {\n            System.out.println("优秀");\n        } else if (score >= 60) {\n            System.out.println("及格");\n        } else {\n            System.out.println("不及格");\n        }\n\n        String grade = score >= 60 ? "pass" : "fail";\n        System.out.println(grade);\n    }\n}', out: '及格\npass' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        int day = 3;\n\n        /* 传统写法：别忘了 break，否则会「穿透」 */\n        switch (day) {\n            case 1: System.out.println("周一"); break;\n            case 3: System.out.println("周三"); break;\n            default: System.out.println("其他");\n        }\n\n        /* Java 14+ 箭头语法：不穿透、可以直接返回值 */\n        String name = switch (day) {\n            case 1, 2, 3, 4, 5 -> "工作日";\n            case 6, 7 -> "周末";\n            default -> "非法";\n        };\n        System.out.println(name);\n    }\n}', out: '周三\n工作日' },
            { t: 'warn', x: '传统 `switch` 忘了 `break` 会继续执行下一个 case，这叫 **fall-through**（穿透）。有时是有意为之（多个 case 共享处理），但更多时候是 bug。新代码优先用箭头语法。' },
            { t: 'note', x: '箭头 `switch` 还能直接当表达式用（`String name = switch(...) {...}`），编译器会检查你是否覆盖了所有情况——比一堆 if-else 更不容易漏。' }
          ]
        },
        {
          id: 'j2l2', title: '循环与增强 for', key: 'for · while · 增强 for', time: 10,
          blocks: [
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 3; i++) System.out.print(i + " ");\n        System.out.println();\n\n        int n = 27, steps = 0;\n        while (n != 1) {\n            n = (n % 2 == 0) ? n / 2 : 3 * n + 1;\n            steps++;\n        }\n        System.out.println("步骤数 " + steps);\n\n        int[] arr = {10, 20, 30};\n        for (int x : arr) System.out.print(x + " ");\n        System.out.println();\n    }\n}', out: '0 1 2 \n步骤数 111\n10 20 30 ' },
            { t: 'table', head: ['写法', '适用', '注意'], rows: [
              ['`for (int i = 0; ...)`', '需要下标或要改数组元素', '最灵活'],
              ['`for (T x : coll)`', '只读遍历', '拿到的是元素的**副本或引用**，改 x 不影响原集合'],
              ['`while (cond)`', '次数未知', '条件里别写会死循环的表达式'],
              ['`do { } while (...)`', '至少执行一次', '条件在末尾']
            ] },
            { t: 'warn', x: '增强 for 里**不能修改集合结构**（增删元素），会抛 `ConcurrentModificationException`。要删除元素用迭代器的 `iterator.remove()`，或者先收集再统一删。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 10; i++) {\n            if (i % 2 == 0) continue;   /* 跳过偶数 */\n            if (i > 7) break;           /* 超过 7 结束 */\n            System.out.print(i + " ");\n        }\n        System.out.println();\n    }\n}', out: '1 3 5 7 ' }
          ]
        },
        {
          id: 'j2l3', title: '数组与 Arrays 工具类', key: '数组 · length · 排序', time: 12,
          blocks: [
            { t: 'p', x: 'Java 的数组是**对象**，长度固定，用 `arr.length`（字段，不是方法）取长度。越界访问会抛 `ArrayIndexOutOfBoundsException`——有明确的报错，比 C 的静默破坏好排查得多。' },
            { t: 'code', x: 'import java.util.Arrays;\n\nclass Main {\n    public static void main(String[] args) {\n        int[] a = new int[5];              /* 默认全 0 */\n        int[] b = {3, 1, 4, 1, 5};\n\n        System.out.println(a.length + " " + a[0]);\n        System.out.println(Arrays.toString(b));   /* 直接打印才有内容 */\n\n        Arrays.sort(b);\n        System.out.println(Arrays.toString(b));\n\n        int[] c = Arrays.copyOf(b, 3);\n        System.out.println(Arrays.toString(c));\n    }\n}', out: '5 0\n[3, 1, 4, 1, 5]\n[1, 1, 3, 4, 5]\n[1, 1, 3]' },
            { t: 'warn', x: '直接 `System.out.println(b)` 会打印 `[I@1b6d3586` 这种东西——那是「int 数组 + 内存地址」。要看内容必须 `Arrays.toString(b)`。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        int[] b = {3, 1, 4, 1, 5};\n        int sum = 0, max = b[0];\n        for (int x : b) {\n            sum += x;\n            if (x > max) max = x;\n        }\n        System.out.println("sum=" + sum + " max=" + max);\n        System.out.printf("avg=%.2f%n", (double) sum / b.length);\n    }\n}', out: 'sum=14 max=5\navg=2.80' },
            { t: 'table', head: ['需求', '写法'], rows: [
              ['求长度', '`arr.length`（字段）'],
              ['打印内容', '`Arrays.toString(arr)`'],
              ['排序', '`Arrays.sort(arr)`（原地升序）'],
              ['复制', '`Arrays.copyOf(arr, n)`'],
              ['查找', '`Arrays.binarySearch(arr, x)`（必须先排序）'],
              ['填充', '`Arrays.fill(arr, 0)`']
            ] },
            { t: 'note', x: '`Arrays.asList(1, 2, 3)` 得到的是**固定长度**的列表，`add` / `remove` 会抛 `UnsupportedOperationException`。需要可变列表就再包一层：`new ArrayList<>(Arrays.asList(...))`。' }
          ]
        }
      ]
    },
    {
      id: 'j3', num: 3, title: '类、对象与接口', icon: '🧩',
      intro: 'Java 的面向对象比 C++ 更「纯」：没有游离函数，所有方法都在类里；接口可以多实现，类只能单继承。这一章把这三件事讲清：怎么造对象、怎么封装、怎么用接口解耦。',
      goals: ['写类、构造器与 getter/setter', '理解 this 与构造器重载', '用 interface + implements 实现多态', '分清抽象类与接口的使用场合'],
      lessons: [
        {
          id: 'j3l1', title: '类、构造器与 this', key: 'class · 构造器 · this', time: 12,
          blocks: [
            { t: 'p', x: '类描述「一类东西有什么数据、能做什么」。用 `new` 创建对象时，构造器负责把字段初始化成合法值。构造器的名字必须和类名一样，而且没有返回类型。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        Student s = new Student("小明", 92);\n        System.out.println(s.intro());\n        s.addScore(5);\n        System.out.println(s.getScore());\n    }\n}\n\nclass Student {\n    private String name;\n    private int score;\n\n    Student(String name, int score) {\n        this.name = name;\n        this.score = score;\n    }\n\n    void addScore(int d) {\n        if (d > 0) this.score += d;   /* 唯一的修改入口，带校验 */\n    }\n\n    int getScore() { return score; }\n\n    String intro() { return name + " 的分数是 " + score; }\n}', out: '小明 的分数是 92\n97' },
            { t: 'p', x: '`this.name = name` 里的 `this` 指当前对象。当形参和字段同名时必须用它区分，否则 `name = name` 会把参数赋给自己，字段永远是 null。' },
            { t: 'table', head: ['修饰符', '可见范围'], rows: [
              ['`private`', '只有本类'],
              ['（不写）', '同一个包里'],
              ['`protected`', '同包 + 子类'],
              ['`public`', '所有地方']
            ] },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        Point p = new Point();\n        Point q = new Point(3, 4);\n        System.out.println(p.sum() + " " + q.sum());\n    }\n}\n\nclass Point {\n    int x, y;\n    Point() { this(0, 0); }          /* 构造器重载：委托给另一个构造器 */\n    Point(int x, int y) { this.x = x; this.y = y; }\n    int sum() { return x + y; }\n}', out: '0 7' },
            { t: 'note', x: '`this(...)` 调用同类另一个构造器，**必须写在构造器第一行**。这样默认值只维护一份，加字段时不容易漏。' }
          ]
        },
        {
          id: 'j3l2', title: '封装、static 与继承', key: '封装 · static · extends', time: 12,
          blocks: [
            { t: 'p', x: '封装的目的很实际：**让对象永远处于合法状态**。字段私有 + 通过方法修改，你就有机会做校验；字段公开，别人随时能塞进一个负数。' },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        Dog d = new Dog("旺财", 3);\n        d.speak();\n        System.out.println(d.info());\n        System.out.println(Animal.count);\n    }\n}\n\nclass Animal {\n    static int count = 0;          /* 所有对象共享 */\n    protected String name;\n\n    Animal(String name) {\n        this.name = name;\n        count++;\n    }\n\n    void speak() { System.out.println(name + " 发出声音"); }\n    String info() { return name + " 是动物"; }\n}\n\nclass Dog extends Animal {\n    private int age;\n\n    Dog(String name, int age) {\n        super(name);               /* 必须先构造父类 */\n        this.age = age;\n    }\n\n    @Override\n    void speak() { System.out.println(name + " 汪汪，今年 " + age + " 岁"); }\n}', out: '旺财 汪汪，今年 3 岁\n旺财 是动物\n1' },
            { t: 'table', head: ['关键字', '作用'], rows: [
              ['`extends`', '继承一个类（Java 只支持单继承）'],
              ['`super(...)`', '调用父类构造器，必须在第一行'],
              ['`super.method()`', '调用父类被重写的方法'],
              ['`@Override`', '告诉编译器「我在重写」，写错签名会报错'],
              ['`final`', '修饰类不能被继承，修饰方法不能被重写，修饰变量不能改']
            ] },
            { t: 'warn', x: 'Java 里**所有方法默认都是虚方法**（除非加 `final` 或 `private` / `static`）。所以不需要像 C++ 那样写 `virtual`，重写默认就是多态。' },
            { t: 'note', x: '`@Override` 不是必须的，但几乎一定要写。它能让「参数写错导致没重写成」这种错误在编译期暴露——比如把 `speak()` 写成 `speak(String s)`。' }
          ]
        },
        {
          id: 'j3l3', title: '接口与多态', key: 'interface · implements', time: 14,
          blocks: [
            { t: 'p', x: '接口是一份「能力清单」：只写方法签名，不写实现。一个类可以实现多个接口，这就是 Java 用「多实现」弥补「单继承」的方式。' },
            { t: 'code', x: 'import java.util.*;\n\ninterface Shape {\n    double area();                       /* 隐式 public abstract */\n    default String describe() {          /* Java 8+ 可以有默认实现 */\n        return "面积 " + area();\n    }\n}\n\nclass Rect implements Shape {\n    private final double w, h;\n    Rect(double w, double h) { this.w = w; this.h = h; }\n    public double area() { return w * h; }\n}\n\nclass Circle implements Shape {\n    private final double r;\n    Circle(double r) { this.r = r; }\n    public double area() { return Math.round(3.14159 * r * r * 100) / 100.0; }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        List<Shape> list = new ArrayList<>();\n        list.add(new Rect(3, 4));\n        list.add(new Circle(1));\n        for (Shape s : list) System.out.println(s.describe());\n    }\n}', out: '面积 12.0\n面积 3.14' },
            { t: 'p', x: '注意 `Rect.area()` 返回 `3 * 4` 是 double 12.0，打印带小数点。`describe()` 是接口里的默认方法，两个实现类都不用写，直接继承下来——这就是「接口 + 默认方法」能做渐进式扩展的原因。' },
            { t: 'table', head: ['对比', '抽象类', '接口'], rows: [
              ['继承数量', '只能单继承', '可以多实现'],
              ['字段', '可以有实例字段', '只能是 `public static final` 常量'],
              ['构造器', '有', '没有'],
              ['方法', '可以有任意实现', '抽象方法 + 默认方法 + 静态方法'],
              ['什么时候用', '「是一类东西」且有共享代码', '「具备某种能力」，需要解耦']
            ] },
            { t: 'warn', x: '接口方法的实现类必须加 `public`。接口里方法隐式 public，实现时若漏写 `public`（默认包级私有），编译器会报「正在尝试分配更低的访问权限」。' },
            { t: 'principle', x: '**面向接口编程。** 变量声明成 `List`、`Shape`、`Runnable`，而不是 `ArrayList`、`Rect`。以后换实现只改一行 `new`，其余代码完全不动。' }
          ]
        }
      ]
    },
    {
      id: 'j4', num: 4, title: '集合框架', icon: '🗂️',
      intro: 'Java 的集合是日常开发里用得最多的东西：List 存有序列表，Map 存键值对，Set 去重。这一章讲清该选哪个、遍历怎么写、以及泛型为什么会出现。',
      goals: ['用 List / ArrayList 增删查改', '用 Map 统计与查找', '知道 ArrayList 与 LinkedList 的取舍', '用泛型避免强制类型转换'],
      lessons: [
        {
          id: 'j4l1', title: 'List：有序、可重复', key: 'ArrayList · List', time: 12,
          blocks: [
            { t: 'p', x: '`List` 是有序集合，元素可以重复。`ArrayList` 是它最常用的实现——底层是数组，随机访问 O(1)，中间插入 O(n)。' },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<String> names = new ArrayList<>();\n        names.add("小明");\n        names.add("小红");\n        names.add("小明");\n\n        System.out.println(names);\n        System.out.println(names.size() + " " + names.get(1));\n        System.out.println(names.contains("小红"));\n        System.out.println(names.indexOf("小明"));\n\n        names.remove("小明");        /* 按值删第一个匹配 */\n        System.out.println(names);\n    }\n}', out: '[小明, 小红, 小明]\n3 小红\ntrue\n0\n[小红, 小明]' },
            { t: 'warn', x: '`List<Integer>` 的 `remove` 有两个重载：`remove(int index)` 按下标删、`remove(Object o)` 按值删。对 `List<Integer>` 写 `remove(1)` 删的是**下标 1**，想删值 1 要写 `remove(Integer.valueOf(1))`。这个坑非常常见。' },
            { t: 'table', head: ['需求', 'ArrayList', 'LinkedList'], rows: [
              ['按下标取', 'O(1) ✅', 'O(n)'],
              ['尾部添加', '均摊 O(1) ✅', 'O(1)'],
              ['头部/中间插入', 'O(n)', 'O(1)（找到位置后） ✅'],
              ['内存', '紧凑 ✅', '每个节点额外两个指针'],
              ['结论', '默认选它', '只在频繁头插/当队列用时']
            ] },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<Integer> nums = new ArrayList<>(List.of(5, 3, 8, 1));\n\n        Collections.sort(nums);\n        System.out.println(nums);\n\n        Collections.sort(nums, Collections.reverseOrder());\n        System.out.println(nums);\n\n        int sum = 0;\n        for (int x : nums) sum += x;\n        System.out.println("sum=" + sum + " max=" + Collections.max(nums));\n    }\n}', out: '[1, 3, 5, 8]\n[8, 5, 3, 1]\nsum=17 max=8' }
          ]
        },
        {
          id: 'j4l2', title: 'Map：键值对', key: 'HashMap · TreeMap · merge', time: 12,
          blocks: [
            { t: 'p', x: '`Map` 存「键 → 值」的映射。`HashMap` 查得快但**不保证顺序**；`TreeMap` 按 key 排序；`LinkedHashMap` 按插入顺序。要输出好看、结果稳定，就用后两个。' },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Map<String, Integer> score = new TreeMap<>();\n        score.put("小明", 92);\n        score.put("小红", 88);\n        score.put("小刚", 75);\n\n        System.out.println(score);\n        System.out.println(score.get("小红"));\n        System.out.println(score.getOrDefault("路人", -1));\n        System.out.println(score.containsKey("小刚"));\n    }\n}', out: '{小刚=75, 小明=92, 小红=88}\n88\n-1\ntrue' },
            { t: 'warn', x: '`HashMap.get(不存在的键)` 返回 `null`，直接拿去做运算就是 `NullPointerException`。用 `getOrDefault` 给个默认值，或者先 `containsKey` 判断——这是 NPE 的头号来源。' },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        String[] words = {"a", "b", "a", "c", "a", "c"};\n        Map<String, Integer> cnt = new TreeMap<>();\n\n        for (String w : words) {\n            cnt.merge(w, 1, Integer::sum);   /* 不存在当 0，存在则相加 */\n        }\n        System.out.println(cnt);\n\n        for (Map.Entry<String, Integer> e : cnt.entrySet()) {\n            System.out.println(e.getKey() + " -> " + e.getValue());\n        }\n    }\n}', out: '{a=3, b=1, c=2}\na -> 3\nb -> 1\nc -> 2' },
            { t: 'table', head: ['遍历方式', '写法', '适用'], rows: [
              ['只要 key', '`for (K k : map.keySet())`', '简单遍历'],
              ['只要 value', '`for (V v : map.values())`', '统计'],
              ['键值都要', '`for (Map.Entry<K,V> e : map.entrySet())` ✅', '最常用，一次取两个'],
              ['函数式', '`map.forEach((k, v) -> ...)`', 'Java 8+，简洁']
            ] },
            { t: 'note', x: '`HashMap` 的 key 必须正确实现 `hashCode` 和 `equals`。用自定义对象做 key 却忘了重写，会出现「明明放进去了却 get 不到」——因为默认的 hashCode 是地址。' }
          ]
        },
        {
          id: 'j4l3', title: 'Set、泛型与自动装箱', key: 'Set · 泛型', time: 10,
          blocks: [
            { t: 'p', x: '`Set` 是「不允许重复」的集合，判断重复靠 `equals` + `hashCode`。`HashSet` 最快，`TreeSet` 有序。' },
            { t: 'code', x: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Set<Integer> s = new TreeSet<>();\n        for (int x : new int[]{3, 1, 3, 2, 1}) s.add(x);\n        System.out.println(s + " size=" + s.size());\n\n        List<String> raw = new ArrayList<>();\n        raw.add("a");\n        String first = raw.get(0);       /* 泛型：不用强转 */\n        System.out.println(first.toUpperCase());\n    }\n}', out: '[1, 2, 3] size=3\nA' },
            { t: 'p', x: '泛型 `<String>` 把「运行时才发现的类型错误」提前到编译期。没有泛型的年代，从集合里取出来的都是 `Object`，要手动 `(String)` 强转，转错就在运行时炸。' },
            { t: 'warn', x: '泛型不能是基本类型：`List<int>` 非法，必须写 `List<Integer>`。因此往集合里放数字会有**装箱**开销（int → Integer）。数据量大时这一点会影响性能。' },
            { t: 'note', x: '`List.of(...)` 和 `Set.of(...)` 创建的是**不可变**集合，`add` 会抛异常。做常量列表很方便，但需要修改时要 `new ArrayList<>(List.of(...))`。' }
          ]
        }
      ]
    },
    {
      id: 'j5', num: 5, title: '异常与文件', icon: '🧯',
      intro: 'Java 把异常做成了语言的一部分：受检异常强制你处理。这一章讲清异常的层级、什么时候该抛、什么时候该捕获，以及怎么读写文件。',
      goals: ['分清受检异常与运行时异常', '正确使用 try-catch-finally / try-with-resources', '用 Files 读写文本文件', '避免吞异常'],
      lessons: [
        {
          id: 'j5l1', title: '异常体系与捕获', key: 'try · catch · finally', time: 12,
          blocks: [
            { t: 'p', x: '所有异常都继承自 `Throwable`，往下分两支：`Error`（JVM 层面，基本救不了）和 `Exception`。`Exception` 里又以 `RuntimeException` 为界分成「受检」和「非受检」。' },
            { t: 'table', head: ['类型', '是否必须处理', '例子'], rows: [
              ['受检异常（Checked）', '必须 try 或 throws', 'IOException、SQLException'],
              ['运行时异常', '不强制，但应该避免', 'NullPointerException、IndexOutOfBoundsException'],
              ['Error', '不处理', 'OutOfMemoryError、StackOverflowError']
            ] },
            { t: 'code', x: 'class Main {\n    public static void main(String[] args) {\n        try {\n            int[] a = new int[3];\n            System.out.println(a[5]);\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.println("下标越界：" + e.getMessage());\n        } finally {\n            System.out.println("finally 一定执行");\n        }\n        System.out.println("程序继续");\n    }\n}', out: '下标越界：Index 5 out of bounds for length 3\nfinally 一定执行\n程序继续' },
            { t: 'code', x: 'class Main {\n    static int parse(String s) {\n        if (s == null || s.isEmpty()) {\n            throw new IllegalArgumentException("输入不能为空");\n        }\n        return Integer.parseInt(s);\n    }\n\n    public static void main(String[] args) {\n        try {\n            System.out.println(parse("42"));\n            System.out.println(parse(""));\n        } catch (IllegalArgumentException e) {\n            System.out.println("出错：" + e.getMessage());\n        }\n    }\n}', out: '42\n出错：输入不能为空' },
            { t: 'warn', x: '**别写空 catch。** `catch (Exception e) {}` 会把错误彻底吞掉，程序带着错误状态继续跑，最后在无关的地方崩溃。至少打印 `e.printStackTrace()` 或记日志。' },
            { t: 'note', x: '`finally` 里的 `return` 会覆盖 try 里的 `return`，也会吞掉异常。所以 `finally` 只用来释放资源，不要写 return。' }
          ]
        },
        {
          id: 'j5l2', title: '文件读写与 try-with-resources', key: 'Files · Reader · 关闭', time: 12,
          blocks: [
            { t: 'p', x: 'Java 里打开的文件/流必须关闭，否则占着系统句柄。`try-with-resources` 会自动关闭，而且即使中间抛异常也保证关闭——它是最推荐的写法，比 `finally` 里手动 `close` 更安全。' },
            { t: 'code', x: 'import java.io.*;\nimport java.nio.file.*;\nimport java.util.*;\n\nclass Main {\n    public static void main(String[] args) throws IOException {\n        Path p = Paths.get("demo_cc.txt");\n\n        Files.write(p, List.of("第一行", "第二行", "第三行"));\n\n        List<String> lines = Files.readAllLines(p);\n        System.out.println("行数 " + lines.size());\n        for (String line : lines) System.out.println(line);\n    }\n}', out: '行数 3\n第一行\n第二行\n第三行' },
            { t: 'code', x: 'import java.io.*;\n\nclass Main {\n    public static void main(String[] args) {\n        /* try 括号里声明的资源会自动 close，顺序与声明相反 */\n        try (BufferedReader br = new BufferedReader(new StringReader("a\\nb\\nc"))) {\n            String line;\n            int n = 0;\n            while ((line = br.readLine()) != null) {\n                n++;\n                System.out.println(n + ": " + line);\n            }\n        } catch (IOException e) {\n            System.out.println("读取出错：" + e.getMessage());\n        }\n    }\n}', out: '1: a\n2: b\n3: c' },
            { t: 'table', head: ['场景', '推荐写法'], rows: [
              ['小文件一次读完', '`Files.readAllLines(path)`'],
              ['写小文件', '`Files.write(path, lines)`'],
              ['大文件逐行读', '`BufferedReader.readLine()` 循环'],
              ['判断存在', '`Files.exists(path)`'],
              ['创建目录', '`Files.createDirectories(path)`']
            ] },
            { t: 'warn', x: '`new StringReader("a\\nb\\nc")` 里的 `\\n` 在 Java 源码里是转义字符，代表换行。如果你在字符串里写了两个字符 `\\` 和 `n`，`readLine` 就找不到换行，只会读到一整行。' },
            { t: 'principle', x: '**能用 `Files` 就别用老的 `FileInputStream`。** `java.nio.file` 这套 API 更短、更安全，还能利用 try-with-resources 自动关闭。' }
          ]
        }
      ]
    }
  ],

  quiz: [
    { id: 'jq1', ch: 'j1', lesson: 'j1l1', point: '入口方法', type: 'choice', diff: 1,
      prompt: 'Java 程序入口方法的正确签名是？',
      opts: ['public void main(String[] args)', 'public static void main(String[] args)', 'static int main()', 'public static main(String args)'],
      ans: 1,
      explain: '`public static void main(String[] args)` 四个部分缺一不可：public 让 JVM 能调用，static 表示不用实例化，void 表示无返回值，String[] 是参数类型。' },
    { id: 'jq2', ch: 'j1', lesson: 'j1l1', point: '编译运行', type: 'choice', diff: 1,
      prompt: '把 `Main.java` 编译并运行，正确的命令是？',
      opts: ['java Main.java 然后 java Main', 'javac Main.java 然后 java Main', 'javac Main 然后 java Main.class', 'run Main.java'],
      ans: 1,
      explain: '`javac` 编译生成 `Main.class`，`java Main` 启动 JVM 加载这个类（注意运行时写类名，不加 .class 后缀）。' },
    { id: 'jq3', ch: 'j1', lesson: 'j1l2', point: '整数除法', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        System.out.println(7 / 2);\n        System.out.println(7 / 2.0);\n        System.out.println(1 / 3 * 3);\n        System.out.println(1.0 / 3);\n    }\n}',
      answer: '3\n3.5\n0\n0.3333333333333333',
      explain: '整数相除结果仍是整数，`1/3` 得 0，再乘 3 还是 0。有一个操作数是 double 时结果才是 double，且默认打印全部有效位。' },
    { id: 'jq4', ch: 'j1', lesson: 'j1l2', point: '溢出', type: 'choice', diff: 2,
      prompt: '`int x = Integer.MAX_VALUE; x = x + 1;` 之后 x 的值是？',
      opts: ['抛出异常', '2147483648', '-2147483648', '0'],
      ans: 2,
      explain: 'Java 的 int 溢出会静默回绕成最小值，不报错。要表示更大的数用 `long`（先转换再运算）或 `BigInteger`。' },
    { id: 'jq5', ch: 'j1', lesson: 'j1l3', point: '字符串比较', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        String a = "hi";\n        String b = new String("hi");\n        System.out.println(a == b);\n        System.out.println(a.equals(b));\n        System.out.println(a.length());\n    }\n}',
      answer: 'false\ntrue\n2',
      explain: '`new String("hi")` 强制创建新对象，`==` 比引用所以是 false；`equals` 比内容所以是 true；`length()` 是方法，返回 2。' },
    { id: 'jq6', ch: 'j1', lesson: 'j1l3', point: 'StringBuilder', type: 'choice', diff: 2,
      prompt: '在循环里拼接上万次字符串，应该用？',
      opts: ['String 的 +=', 'StringBuilder 的 append', 'String.concat', 'String.format'],
      ans: 1,
      explain: 'String 不可变，每次 `+=` 都要新建对象并复制全部已有内容，总复杂度 O(n²)。StringBuilder 内部是可变数组，append 均摊 O(1)。' },
    { id: 'jq7', ch: 'j2', lesson: 'j2l1', point: 'switch 穿透', type: 'choice', diff: 2,
      prompt: '传统 switch 中某个 case 忘了写 break，会发生什么？',
      opts: ['编译错误', '只执行该 case 然后结束', '继续执行后面的 case（穿透）', '直接跳出 switch'],
      ans: 2,
      explain: '没有 break 会 fall-through，把后面所有 case 的语句都执行一遍直到遇到 break 或结束。Java 14+ 的箭头语法没有这个问题。' },
    { id: 'jq8', ch: 'j2', lesson: 'j2l2', point: '循环输出', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 6; i++) {\n            if (i % 2 == 0) continue;\n            if (i > 4) break;\n            System.out.print(i);\n        }\n        System.out.println();\n    }\n}',
      answer: '13',
      explain: 'i=0、2、4 被 continue 跳过；i=1、3 打印；i=5 时 `i > 4` 成立直接 break。所以输出 13。' },
    { id: 'jq9', ch: 'j2', lesson: 'j2l3', point: '数组打印', type: 'choice', diff: 1,
      prompt: '要打印 int 数组的内容，正确的做法是？',
      opts: ['System.out.println(arr)', 'System.out.println(Arrays.toString(arr))', 'System.out.println(arr.toString())', 'System.out.println(arr[0..n])'],
      ans: 1,
      explain: '数组的 `toString()` 继承自 Object，输出的是 `[I@hashcode` 形式的地址。`Arrays.toString` 才会逐元素拼接成 `[1, 2, 3]`。' },
    { id: 'jq10', ch: 'j2', lesson: 'j2l3', point: '数组长度', type: 'choice', diff: 2,
      prompt: '`int[] a = new int[5];` 中取长度应该写？',
      opts: ['a.length()', 'a.length', 'a.size()', 'len(a)'],
      ans: 1,
      explain: '数组的 length 是**字段**，不加括号；集合（List/Set）才是 `size()` 方法。混用是初学者最常见的编译错误之一。' },
    { id: 'jq11', ch: 'j3', lesson: 'j3l1', point: 'this 的用途', type: 'choice', diff: 1,
      prompt: '构造器里写 `this.name = name;` 的作用是？',
      opts: ['把参数赋给参数自己', '把参数值赋给当前对象的字段', '调用父类构造器', '创建一个新对象'],
      ans: 1,
      explain: '`this.name` 指当前对象的字段，右边的 `name` 是形参。不写 `this` 就是形参赋给自己，字段永远是默认值 null。' },
    { id: 'jq12', ch: 'j3', lesson: 'j3l2', point: '继承与重写', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        Animal a = new Dog();\n        a.speak();\n        System.out.println(a.name);\n    }\n}\n\nclass Animal {\n    String name = "动物";\n    void speak() { System.out.println("..."); }\n}\n\nclass Dog extends Animal {\n    String name = "狗";\n    void speak() { System.out.println("汪汪"); }\n}',
      answer: '汪汪\n动物',
      explain: '方法调用是多态（按实际类型 Dog 走），但**字段访问没有多态**（按引用类型 Animal 走），所以 name 是「动物」。这条规则常被拿来考。' },
    { id: 'jq13', ch: 'j3', lesson: 'j3l3', point: '接口实现', type: 'choice', diff: 2,
      prompt: '一个类要实现接口 `Shape`，正确的写法是？',
      opts: ['class Rect extends Shape', 'class Rect implements Shape', 'class Rect: Shape', 'interface Rect implements Shape'],
      ans: 1,
      explain: '类继承类用 `extends`，类实现接口用 `implements`。接口之间可以 `extends` 多个接口，但类只能 `extends` 一个类。' },
    { id: 'jq14', ch: 'j4', lesson: 'j4l1', point: 'remove 重载', type: 'choice', diff: 3,
      prompt: '`List<Integer> list = new ArrayList<>(List.of(10, 20, 30));` 执行 `list.remove(1);` 后，list 是？',
      opts: ['[10, 30]', '[20, 30]', '[10, 1, 30]', '抛异常'],
      ans: 0,
      explain: '`remove(1)` 匹配的是 `remove(int index)`，删掉下标 1 的元素 20，得到 [10, 30]。要按值删 1 必须写 `remove(Integer.valueOf(1))`。' },
    { id: 'jq15', ch: 'j4', lesson: 'j4l2', point: 'Map 默认值', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Map<String, Integer> m = new TreeMap<>();\n        m.put("b", 2);\n        m.put("a", 1);\n        System.out.println(m);\n        System.out.println(m.getOrDefault("z", 0));\n        System.out.println(m.size());\n    }\n}',
      answer: '{a=1, b=2}\n0\n2',
      explain: 'TreeMap 按 key 字典序输出，所以是 `{a=1, b=2}`。`getOrDefault` 取不到返回 0，且**不会**插入新键，size 仍是 2。' },
    { id: 'jq16', ch: 'j5', lesson: 'j5l1', point: '异常类型', type: 'choice', diff: 2,
      prompt: '`Integer.parseInt("abc")` 会抛出哪种异常？',
      opts: ['NullPointerException', 'NumberFormatException', 'IOException', 'ClassCastException'],
      ans: 1,
      explain: '`NumberFormatException` 是 `IllegalArgumentException` 的子类，属于运行时异常，表示「字符串不是合法数字」。它不要求强制 try。' },
    { id: 'jq17', ch: 'j5', lesson: 'j5l1', point: 'finally', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        try {\n            System.out.println("A");\n            throw new RuntimeException("x");\n        } catch (RuntimeException e) {\n            System.out.println("B");\n        } finally {\n            System.out.println("C");\n        }\n        System.out.println("D");\n    }\n}',
      answer: 'A\nB\nC\nD',
      explain: 'try 里先打印 A，抛异常后跳到 catch 打印 B，finally 无论如何都执行打印 C，异常被捕获后程序继续打印 D。' },
    { id: 'jq18', ch: 'j5', lesson: 'j5l2', point: '资源关闭', type: 'choice', diff: 2,
      prompt: '`try (BufferedReader br = ...) { ... }` 这种写法叫？',
      opts: ['try-catch 简写', 'try-with-resources，会自动关闭资源', 'lambda 表达式', '断言语句'],
      ans: 1,
      explain: 'try 括号里声明的资源在代码块结束时自动调用 `close()`，即使抛异常也会关闭。前提是资源类实现了 `AutoCloseable`。' }
  ],

  checkin: [
    { id: 'jk1', ch: 'j1', point: '输出方法', type: 'choice', diff: 1,
      prompt: '想在输出后不换行，应该用哪个方法？',
      opts: ['System.out.println()', 'System.out.print()', 'System.out.write()', 'System.out.printf() 不带参数'],
      ans: 1,
      explain: '`print` 不换行，`println` 换行。`printf` 是格式化输出，默认也不换行（要换行加 `%n`）。' },
    { id: 'jk2', ch: 'j1', point: '字符串转数字', type: 'code', diff: 2,
      scene: '表单里用户输入的都是字符串，要参与计算必须先转成数字。',
      prompt: '读入两个用空格分隔的整数（以字符串形式），转成 int 后输出它们的和。例如输入 `12 30`，输出 `42`。',
      starter: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String a = sc.next();\n        String b = sc.next();\n        /* 在这里写代码 */\n    }\n}',
      tests: [{ in: '12 30', out: '42' }, { in: '-5 8', out: '3' }],
      solution: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String a = sc.next();\n        String b = sc.next();\n        int x = Integer.parseInt(a);\n        int y = Integer.parseInt(b);\n        System.out.println(x + y);\n    }\n}',
      explain: '`Integer.parseInt` 把字符串转成 int，失败会抛 `NumberFormatException`。注意别写成 `a + b`，那样是字符串拼接，会输出 1230。' },
    { id: 'jk3', ch: 'j1', point: '字符与 Unicode', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        char c = \'A\';\n        System.out.println((int) c);\n        System.out.println((char) (c + 2));\n    }\n}',
      answer: '65\nC',
      explain: 'Java 的 char 是 16 位 Unicode，可以当整数运算。\'A\' 的编码是 65，加 2 得 67，转回 char 就是 C。' },
    { id: 'jk4', ch: 'j1', point: '浮点精度', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        System.out.println(0.1 + 0.2);\n        System.out.printf("%.2f%n", 0.1 + 0.2);\n        System.out.println(0.1 + 0.2 == 0.3);\n    }\n}',
      answer: '0.30000000000000004\n0.30\nfalse',
      explain: '二进制无法精确表示 0.1 和 0.2，相加有微小误差。所以浮点不能用 `==` 判断相等，比较差值小于某个阈值；涉及金额用 BigDecimal。' },
    { id: 'jk5', ch: 'j2', point: '增强 for', type: 'code', diff: 2,
      scene: '把一组成绩里的不及格分数（<60）加 5 分，再统计及格人数。',
      prompt: '读入 5 个整数到 int 数组，把小于 60 的元素加 5，然后输出「修改后的数组」和「及格人数」，用空格分隔数组元素。',
      starter: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] a = new int[5];\n        for (int i = 0; i < 5; i++) a[i] = sc.nextInt();\n        /* 在这里写代码 */\n    }\n}',
      tests: [{ in: '58 72 45 90 60', out: '63 72 50 90 60\n5' }],
      solution: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] a = new int[5];\n        for (int i = 0; i < 5; i++) a[i] = sc.nextInt();\n\n        StringBuilder sb = new StringBuilder();\n        int pass = 0;\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] < 60) a[i] += 5;\n            if (a[i] >= 60) pass++;\n            sb.append(a[i]).append(i == a.length - 1 ? "" : " ");\n        }\n        System.out.println(sb);\n        System.out.println(pass);\n    }\n}',
      explain: '普通 for 循环能通过下标修改数组元素；增强 for 拿到的是元素副本，`x += 5` 改不到数组。统计及格要放在加分之后判断。' },
    { id: 'jk6', ch: 'j2', point: '数组求和', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'import java.util.Arrays;\n\nclass Main {\n    public static void main(String[] args) {\n        int[] a = {4, 2, 7};\n        Arrays.sort(a);\n        System.out.println(Arrays.toString(a));\n        int s = 0;\n        for (int x : a) s += x;\n        System.out.println(s);\n    }\n}',
      answer: '[2, 4, 7]\n13',
      explain: '`Arrays.sort` 原地升序，`Arrays.toString` 打印成 `[2, 4, 7]`。求和结果 2+4+7=13。' },
    { id: 'jk7', ch: 'j2', point: 'do-while', type: 'choice', diff: 2,
      prompt: '`do { ... } while (false);` 循环体执行几次？',
      opts: ['0 次', '1 次', '无限次', '编译错误'],
      ans: 1,
      explain: 'do-while 先执行后判断，所以至少执行一次。适合「先做一次再问要不要继续」的场景，比如菜单。' },
    { id: 'jk8', ch: 'j3', point: '构造器', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        A a = new A();\n        A b = new A(7);\n        System.out.println(a.v + b.v);\n    }\n}\n\nclass A {\n    int v;\n    A() { this(1); }\n    A(int x) { this.v = x; }\n}',
      answer: '8',
      explain: '`new A()` 走无参构造，它用 `this(1)` 委托给带参构造，v=1；`new A(7)` 直接 v=7。1+7=8。' },
    { id: 'jk9', ch: 'j3', point: '静态成员', type: 'choice', diff: 1,
      prompt: '用 `static` 修饰的成员有什么特点？',
      opts: ['每个对象各有一份', '属于类本身，所有对象共享一份', '不能被访问', '会自动初始化成 1'],
      ans: 1,
      explain: 'static 成员在类加载时创建一份，所有实例共享。可以直接用 `类名.成员` 访问，不需要创建对象——`main` 方法就是这样才能被 JVM 调用。' },
    { id: 'jk10', ch: 'j3', point: '方法重写', type: 'code', diff: 2,
      scene: '用多态统一处理不同形状的面积，是接口最典型的用法。',
      prompt: '补全 `Rect` 的 `area()`，通过 `Shape` 引用调用，输出 `12.0`。',
      starter: 'interface Shape { double area(); }\n\nclass Rect implements Shape {\n    private double w, h;\n    Rect(double w, double h) { this.w = w; this.h = h; }\n    public double area() { /* 在这里写代码 */ }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Shape s = new Rect(3, 4);\n        System.out.println(s.area());\n    }\n}',
      tests: [{ in: '', out: '12.0' }],
      solution: 'interface Shape { double area(); }\n\nclass Rect implements Shape {\n    private double w, h;\n    Rect(double w, double h) { this.w = w; this.h = h; }\n    public double area() { return w * h; }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        Shape s = new Rect(3, 4);\n        System.out.println(s.area());\n    }\n}',
      explain: '返回 `w * h`。因为返回类型是 double，3*4 会转成 12.0，所以输出带小数点。用 `Shape` 声明变量、`new Rect` 创建对象，是多态的典型写法。' },
    { id: 'jk11', ch: 'j4', point: 'List 操作', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        List<String> l = new ArrayList<>();\n        l.add("a");\n        l.add("b");\n        l.add(0, "z");\n        System.out.println(l);\n        l.remove("a");\n        System.out.println(l.size() + " " + l.get(0));\n    }\n}',
      answer: '[z, a, b]\n2 z',
      explain: '`add(0, "z")` 在下标 0 插入，所以顺序变成 z、a、b。`remove("a")` 按值删掉 a，剩 2 个元素，第一个仍是 z。' },
    { id: 'jk12', ch: 'j4', point: 'Map 遍历', type: 'code', diff: 2,
      scene: '统计一段文本里每个字母出现的次数，输出出现最多字母的次数。',
      prompt: '读入一行小写字母（不含空格），统计每个字符出现次数，输出出现次数最多的那个次数。例如 `aabbbc` 输出 `3`。',
      starter: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        /* 在这里写代码 */\n    }\n}',
      tests: [{ in: 'aabbbc', out: '3' }, { in: 'xyz', out: '1' }],
      solution: 'import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        Map<Character, Integer> m = new HashMap<>();\n        for (char c : s.toCharArray()) {\n            m.merge(c, 1, Integer::sum);\n        }\n        int best = 0;\n        for (int v : m.values()) if (v > best) best = v;\n        System.out.println(best);\n    }\n}',
      explain: '`merge(c, 1, Integer::sum)` 是 Map 计数的标准写法：键不存在就放 1，存在就把旧值和新值相加。最后遍历 values 取最大值。' },
    { id: 'jk13', ch: 'j4', point: '集合选择', type: 'choice', diff: 2,
      prompt: '需要「不允许重复且保持有序」的集合，应该选？',
      opts: ['ArrayList', 'HashSet', 'TreeSet', 'HashMap'],
      ans: 2,
      explain: '`TreeSet` 基于红黑树，自动去重并按自然顺序（或比较器）排序。`HashSet` 也去重但顺序不可预测。' },
    { id: 'jk14', ch: 'j5', point: '受检异常', type: 'choice', diff: 2,
      prompt: '下面哪个是受检异常（必须处理或声明）？',
      opts: ['NullPointerException', 'IOException', 'ArrayIndexOutOfBoundsException', 'ArithmeticException'],
      ans: 1,
      explain: '`IOException` 继承 Exception 但不是 RuntimeException，属受检异常，编译器强制你 try-catch 或 `throws`。其余三个都是 RuntimeException 的子类。' },
    { id: 'jk15', ch: 'j5', point: '异常信息', type: 'output', diff: 2,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        try {\n            Object o = "text";\n            Integer n = (Integer) o;\n        } catch (ClassCastException e) {\n            System.out.println("cast failed");\n        } finally {\n            System.out.println("end");\n        }\n    }\n}',
      answer: 'cast failed\nend',
      explain: '字符串强制转 Integer 会抛 `ClassCastException`，被捕获后打印 cast failed，finally 仍会执行打印 end。' },
    { id: 'jk16', ch: 'j5', point: 'throws 声明', type: 'choice', diff: 2,
      prompt: '方法声明 `void f() throws IOException` 表示？',
      opts: ['这个方法一定抛异常', '调用者必须处理或继续声明这个异常', '这个方法不能抛异常', '异常会自动被忽略'],
      ans: 1,
      explain: '`throws` 是「可能抛出」的声明，把处理责任交给调用者：调用者要么 try-catch，要么自己也 `throws` 往上传。' },
    { id: 'jk17', ch: 'j2', point: '字符串遍历', type: 'output', diff: 1,
      prompt: '写出输出。',
      code: 'class Main {\n    public static void main(String[] args) {\n        String s = "abc";\n        for (int i = s.length() - 1; i >= 0; i--) {\n            System.out.print(s.charAt(i));\n        }\n        System.out.println();\n    }\n}',
      answer: 'cba',
      explain: '倒着遍历下标，`charAt(i)` 逐个取字符，输出 cba。也可以用 `new StringBuilder(s).reverse()`。' },
    { id: 'jk18', ch: 'j1', point: '命名规范', type: 'choice', diff: 1,
      prompt: '按照 Java 命名规范，类名和变量名通常怎么写？',
      opts: ['类名首字母小写，变量名大写', '类名大驼峰，变量名小驼峰', '全部大写', '全部小写加下划线'],
      ans: 1,
      explain: 'Java 惯例：类名用大驼峰 `StudentScore`，方法和变量用小驼峰 `getScore`，常量全大写 `MAX_SIZE`。包名全小写。' }
  ]
};
