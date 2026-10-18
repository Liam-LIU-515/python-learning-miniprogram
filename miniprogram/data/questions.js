// © 2026 LiuAohua. 版权所有，仅供学习参考，禁止商用与二次分发。
// data/questions.js —— 课程题库（被 index 游戏页 与 review 复习页 共用，避免重复）
// 判定工具：归一化空白与引号（容忍空格/换行/单双引号差异）
function norm(s) {
  return String(s || "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/['"]/g, '"')
    .replace(/\s+/g, "");
}
function has(t) {
  var target = norm(t);
  return function (v) { return norm(v).indexOf(target) !== -1; };
}
function hasAll(arr) {
  return function (v) {
    var s = norm(v);
    for (var i = 0; i < arr.length; i++) {
      if (s.indexOf(norm(arr[i])) === -1) return false;
    }
    return true;
  };
}

// ============ 课程内容：10 大关，覆盖 Python 基础 ============
var LESSONS = [
  {
    id: "l1", ch: 1, title: "输出 print", icon: "📢", sub: "让屏幕开口说话",
    teach: "📖 第 1 关 · print() 输出\n\nprint() 是 Python 最常用的函数，作用是把内容显示在屏幕上——就像让机器人开口说话。\n\n【基本用法】\n• print(\"你好\") → 屏幕上出现：你好\n• print(100)   → 屏幕上出现：100（数字不用引号）\n• print(\"a\",\"b\") → 一次输出多个，自动用空格分开\n\n【要点】\n1️⃣ 文字（字符串）必须放在引号里：\"...\" 或 '...' 都行\n2️⃣ 数字可以直接打印，不用加引号\n3️⃣ print 默认打印完会换行\n4️⃣ 逗号可以连接多个值：print(\"年龄\",18)\n\n🧠 记住：想让屏幕显示什么，就把它交给 print()。",
    questions: [
      { key:"l1q1", text:"让机器人说出「你好」。请写一句代码。", hint:'用 print("...") 把文字包在引号里。', answer:'print("你好")', judge:has('print("你好")') },
      { key:"l1q2", text:"分两行输出：第一行 Hello，第二行 World。", hint:"写两行 print。", answer:'print("Hello")\nprint("World")', judge:hasAll(['print("Hello")','print("World")']) },
      { key:"l1q3", text:"输出数字 3.14（圆周率）。", hint:"数字不用加引号。", answer:"print(3.14)", judge:has("print(3.14)") },
      { key:"l1q4", text:"用一行输出 1、2、3，数字之间用逗号分隔。", hint:"print(1, 2, 3)", answer:"print(1, 2, 3)", judge:has("print(1,2,3)") }
    ],
    blindbox: { icon:"⭐", name:"输出之星", tips:[
      "print() 是输出的入口：想显示什么都交给它。",
      "字符串要加引号，数字不用：print(3) 显示 3，print(\"3\") 显示 3 但它是文字。",
      "多个值用逗号：print(\"分数\",100) 会输出：分数 100。",
      "进阶：print(x, end=\"\") 可以不换行（以后会用到）。"
    ]},
    blindbox2: { icon:"💡", name:"打印小窍门", tips:[
      "sep 参数能改分隔符：print('a','b', sep='-') 输出 a-b。",
      "file 参数可把内容打印到文件：print('hi', file=f)。",
      "repr() 与 print 不同：repr 给开发者看，print 给人看。",
      "空 print() 只换行，常用来分隔一段段输出。"
    ]}
  },
  {
    id: "l2", ch: 2, title: "变量", icon: "📦", sub: "给数据起名字",
    teach: "📖 第 2 关 · 变量\n\n变量是「带名字的盒子」，用 = 把值装进去，以后用名字就能拿到它。\n\n【命名规则】\n✅ 字母或下划线开头：age、score、my_name\n❌ 数字不能开头：2age 错\n❌ 不能用保留字：if、for 不能做变量名\n\n【赋值与覆盖】\nx = 5\nx = 10   # x 现在变成 10，旧值被覆盖\n\n【动态类型】\nx = 5     # 数字\nx = \"hi\"  # 同一名字可以装文字\n\n🧠 记住：= 是「装值」，左边是盒子名，右边是内容。",
    questions: [
      { key:"l2q1", text:"机器人的年龄是 18，请存进变量 age。", hint:"age = 18", answer:"age = 18", judge:has("age=18") },
      { key:"l2q2", text:"把分数 88 存进 score，再把它打印出来。", hint:"先赋值，再 print(score)。", answer:"score = 88\nprint(score)", judge:hasAll(["score=88","print(score)"]) },
      { key:"l2q3", text:"先把 x 设为 5，紧接着改成 10。", hint:"两行赋值即可。", answer:"x = 5\nx = 10", judge:hasAll(["x=5","x=10"]) },
      { key:"l2q4", text:'把名字 Tom 存进变量 name。', hint:'name = "Tom"', answer:'name = "Tom"', judge:has('name="Tom"') }
    ],
    blindbox: { icon:"📦", name:"变量盒子", tips:[
      "变量 = 带名字的盒子，= 用来装值。",
      "命名：字母/下划线开头，不能数字开头。",
      "可以重新赋值，旧值被新值覆盖。",
      "变量能参与运算，也能被 print 显示。"
    ]},
    blindbox2: { icon:"🔑", name:"命名钥匙", tips:[
      "变量名区分大小写：age 和 Age 是两个不同的变量。",
      "蛇形命名是 Python 习惯：my_score 而不是 myScore。",
      "下划线 _ 常当临时变量或占位用。",
      "del 变量 可以删除一个变量，释放它。"
    ]}
  },
  {
    id: "l3", ch: 3, title: "运算符", icon: "➗", sub: "像计算器一样算",
    teach: "📖 第 3 关 · 算术运算\n\nPython 能像计算器一样运算。\n\n【基本运算符】\n+ 加  - 减  * 乘  / 除\n// 整除（只留整数部分）\n%  取余（剩下多少）\n** 幂（几次方）\n\n【优先级】\n先乘除后加减，括号最优先：\n2 + 3 * 4 = 14\n(2 + 3) * 4 = 20\n\n【例子】\n10 // 3 = 3（整除）\n17 % 5 = 2（余 2）\n5 ** 2 = 25（5 的平方）\n\n🧠 记住：/ 得到小数，// 丢掉小数，% 看余数。",
    questions: [
      { key:"l3q1", text:"用整除打印 10 除以 3 的整数结果。", hint:"// 是整除。", answer:"print(10 // 3)", judge:has("print(10//3)") },
      { key:"l3q2", text:"打印 17 除以 5 的余数。", hint:"% 是取余。", answer:"print(17 % 5)", judge:has("print(17%5)") },
      { key:"l3q3", text:"打印 5 的平方。", hint:"** 是幂运算。", answer:"print(5 ** 2)", judge:has("print(5**2)") },
      { key:"l3q4", text:"设 a=10、b=3，并打印 a 整除 b 的结果。", hint:"print(a // b)", answer:"a = 10\nb = 3\nprint(a // b)", judge:hasAll(["a=10","b=3","print(a//b)"]) }
    ],
    blindbox: { icon:"🚀", name:"火箭提速", tips:[
      "+ - * / 是基础四则运算。",
      "// 整除（丢小数），% 取余，** 幂。",
      "优先级：先乘除后加减，括号最优先。",
      "print 可一次打多个值，用逗号分开。"
    ]},
    blindbox2: { icon:"🧮", name:"运算锦囊", tips:[
      "赋值也能连等：a = b = 0 让两者都等于 0。",
      "复合赋值：x += 1 等价于 x = x + 1（还有 -=、*=）。",
      "布尔运算 and/or 会短路，能省一点计算。",
      "比较可以连写：0 < x < 10 在 Python 里合法。"
    ]}
  },
  {
    id: "l4", ch: 4, title: "列表", icon: "📚", sub: "一排带编号的柜子",
    teach: "📖 第 4 关 · 列表\n\n列表用 [ ] 装一串数据，逗号分开，适合收藏多个值。\n\n【创建与索引】\nnums = [10, 20, 30]\nnums[0] → 10   （索引从 0 开始！）\nnums[1] → 20\nnums[-1] → 30  （负数表示从末尾：-1 是最后一个）\n\n【长度】\nlen(nums) → 3\n\n【修改与追加】\nnums[0] = 99      # 改第一个\nnums.append(40)   # 在末尾加一个\n\n🧠 记住：列表像一排带编号的储物柜，编号从 0 开始。",
    questions: [
      { key:"l4q1", text:"创建列表 nums = [10,20,30]，并打印第一个元素。", hint:"索引 0 是第一个。", answer:"nums = [10, 20, 30]\nprint(nums[0])", judge:hasAll(["nums=[10,20,30]","print(nums[0])"]) },
      { key:"l4q2", text:"nums = [1,2,3,4]，打印它的元素个数。", hint:"用 len()。", answer:"nums = [1, 2, 3, 4]\nprint(len(nums))", judge:hasAll(["nums=[1,2,3,4]","print(len(nums))"]) },
      { key:"l4q3", text:"用负数索引打印列表的最后一个元素。", hint:"nums[-1]", answer:"print(nums[-1])", judge:has("print(nums[-1])") },
      { key:"l4q4", text:"nums = [1,2,3]，用 append 追加 4，再打印整个列表。", hint:"nums.append(4)", answer:"nums = [1, 2, 3]\nnums.append(4)\nprint(nums)", judge:hasAll(["nums=[1,2,3]","append(4)","print(nums)"]) }
    ],
    blindbox: { icon:"🐱", name:"猫的索引", tips:[
      "列表索引从 0 开始：第一个是 [0]。",
      "负数索引 nums[-1] 是最后一个。",
      "len() 求长度（元素个数）。",
      "append() 在末尾添加，修改用 nums[i] = 值。"
    ]},
    blindbox2: { icon:"🗃️", name:"列表锦囊", tips:[
      "列表可以相加合并：[1,2] + [3] → [1,2,3]。",
      "in 判断元素是否在列表：3 in nums 返回 True/False。",
      "list() 能把其他可迭代对象（如字符串）转成列表。",
      "nums.sort() 原地排序；sorted(nums) 返回新列表。"
    ]}
  },
  {
    id: "l5", ch: 5, title: "切片", icon: "✂️", sub: "从列表里切一段",
    teach: "📖 第 5 关 · 切片切一切\n\n切片可以从列表里「截取一段」，写法 [开始:结束]，结束位置【不含】。\n\nnums = [10, 20, 30, 40]\nnums[1:3]  → [20, 30]   （取第2、第3个，不含第4）\nnums[:2]   → [10, 20]   （从头取到第2个）\nnums[2:]   → [30, 40]   （从第3个取到末尾）\nnums[-2:]  → [30, 40]   （取最后两个）\nnums[::-1] → [40,30,20,10]（反转整个列表）\n\n🧠 记住：开始可省略（从头），结束可省略（到尾），步长可加（如 [::2] 隔一个取）。",
    questions: [
      { key:"l5q1", text:"nums = [10,20,30,40]，打印前 2 个元素。", hint:"nums[:2]", answer:"nums = [10, 20, 30, 40]\nprint(nums[:2])", judge:hasAll(["nums=[10,20,30,40]","print(nums[:2])"]) },
      { key:"l5q2", text:"打印从索引 2 一直到末尾的元素。", hint:"nums[2:]", answer:"print(nums[2:])", judge:has("print(nums[2:])") },
      { key:"l5q3", text:"只取索引 1 到 2（不含 3）的元素。", hint:"nums[1:3]", answer:"print(nums[1:3])", judge:has("print(nums[1:3])") },
      { key:"l5q4", text:"用切片把列表反转后打印。", hint:"nums[::-1]", answer:"print(nums[::-1])", judge:has("print(nums[::-1])") }
    ],
    blindbox: { icon:"📚", name:"切片宝典", tips:[
      "列表[开始:结束]，结束索引不含。",
      "nums[1:3] 取第2到第3个。",
      "省略开始从头取，省略结束到末尾。",
      "nums[::-1] 可以反转列表（进阶好用）。"
    ]},
    blindbox2: { icon:"🔪", name:"切片秘籍", tips:[
      "切片超出范围不会报错，会自动截断。",
      "用切片复制列表：new = old[:]（这是浅拷贝）。",
      "步长为负可反转：nums[::-1] 等于 reversed(nums)。",
      "字符串也能切片：'hello'[1:3] → 'el'。"
    ]}
  },
  {
    id: "l6", ch: 6, title: "循环", icon: "🔁", sub: "让电脑重复干活",
    teach: "📖 第 6 关 · for 循环\n\n循环让电脑重复干活，for 循环最常用来「按顺序做 N 次」。\n\n【语法】\nfor i in range(n):\n    print(i)\n\n✅ 末尾冒号，循环体必须缩进（前面留 4 个空格）\n\n【range 的三种玩法】\nrange(5)      → 0,1,2,3,4\nrange(1,4)    → 1,2,3\nrange(0,10,2) → 0,2,4,6,8（步长 2）\n\n【遍历列表】\nfor f in fruits:\n    print(f)\n\n🧠 记住：循环体缩进错，程序就报错——缩进是 Python 的灵魂。",
    questions: [
      { key:"l6q1", text:"用 for + range 打印 0 到 4。", hint:"range(5) 就是 0~4。", answer:"for i in range(5):\n    print(i)", judge:hasAll(["for","range(5)","print(i)"]) },
      { key:"l6q2", text:"打印 1 到 3。", hint:"range(1, 4)", answer:"for i in range(1, 4):\n    print(i)", judge:hasAll(["for","range(1,4)","print(i)"]) },
      { key:"l6q3", text:"nums = [3,6,9]，用 for 遍历并逐个打印。", hint:"for i in nums:", answer:"nums = [3, 6, 9]\nfor i in nums:\n    print(i)", judge:hasAll(["for","print(i)"]) },
      { key:"l6q4", text:"计算 1 到 100 的和并打印。", hint:"用变量 total 从 0 开始累加（total += i 或 total = total + i 都行）。", answer:"total = 0\nfor i in range(1, 101):\n    total += i\nprint(total)", judge:function(v){ var s=norm(v); return s.indexOf("for")!==-1 && s.indexOf("range(1,101)")!==-1 && s.indexOf("print(")!==-1 && (s.indexOf("+=")!==-1 || /\w+=\w+\+i/.test(s)); } }
    ],
    blindbox: { icon:"✨", name:"循环之魂", tips:[
      "for i in range(n) 循环 n 次。",
      "range(3)→0,1,2；range(1,4)→1,2,3。",
      "循环体要缩进，末尾加冒号。",
      "遍历列表：for x in 列表: 逐個取出。"
    ]},
    blindbox2: { icon:"⚙️", name:"循环齿轮", tips:[
      "break 立刻结束整个循环；continue 跳到下一次。",
      "for...else：循环正常结束会执行 else（被 break 则跳过）。",
      "enumerate 同时拿到下标和值：for i,v in enumerate(lst)。",
      "嵌套循环能处理二维数据，比如打印九九乘法表。"
    ]}
  },
  {
    id: "l7", ch: 7, title: "判断", icon: "🔀", sub: "看情况做决定",
    teach: "📖 第 7 关 · if 判断\n\nif 让程序「看情况决定」，像岔路口。\n\n【语法】\nif 条件:\n    print(\"满足时才做\")\n\n【比较符号】\n== 等于   != 不等于\n> < >= <=  大小比较\n\n【组合】\nand 且 / or 或 / not 取反\n\n【多分支】\nif 条件A:\n    ...\nelif 条件B:\n    ...\nelse:\n    ...\n\n🧠 记住：= 是赋值，== 才是「相等判断」，别写混！",
    questions: [
      { key:"l7q1", text:"如果 x 大于 5，就打印「大」。", hint:"if x > 5:", answer:'if x > 5:\n    print("大")', judge:hasAll(["if","print"]) },
      { key:"l7q2", text:"分数 >= 60 打印「及格」，否则打印「不及格」。", hint:"用 if / else。", answer:'if score >= 60:\n    print("及格")\nelse:\n    print("不及格")', judge:hasAll(["if","else:","print"]) },
      { key:"l7q3", text:"年龄满 18 且 hasTicket 为真，才打印「进入」。", hint:"用 and 连接两个条件。", answer:'if age >= 18 and hasTicket:\n    print("进入")', judge:hasAll(["and","print"]) },
      { key:"l7q4", text:"判断 x 是否为偶数（能被 2 整除）。", hint:"用 x % 2 == 0。", answer:"if x % 2 == 0:\n    print(\"偶数\")", judge:hasAll(["x%2==0","print"]) }
    ],
    blindbox: { icon:"🎁", name:"判断礼盒", tips:[
      "if 条件成立才执行缩进代码。",
      "比较：== > < >= <= !=。",
      "= 是赋值，== 才是相等判断（常见坑）。",
      "and/or/not 组合多个条件。"
    ]},
    blindbox2: { icon:"🚦", name:"判断信号灯", tips:[
      "Python 里真假：空串、0、None、空列表都算 False。",
      "用 if x: 比 if x != '': 更地道。",
      "链式比较：a < b < c 一次写清范围。",
      "三元表达式：x if cond else y 一句话选值。"
    ]}
  },
  {
    id: "l8", ch: 8, title: "输入", icon: "⌨️", sub: "和用户对话",
    teach: "📖 第 8 关 · input() 输入\n\ninput() 让程序停下，等用户在键盘上输入内容。\n\n【用法】\nname = input(\"请输入：\")   # 可加提示文字\n\n⚠️ 重要：input() 返回的是【字符串】！\n\n【转成数字】\nage = int(input())\n\n【为什么要转】\n\"3\" + \"5\" = \"35\"  （字符串拼接）\n3 + 5 = 8          （数字相加）\n做数学运算前一定要先 int() 转换。\n\n🧠 记住：input 拿到的是文字，要算数先用 int() 变成数字。",
    questions: [
      { key:"l8q1", text:"读取用户输入并转成整数存入 n。", hint:"n = int(input())", answer:"n = int(input())", judge:has("n=int(input())") },
      { key:"l8q2", text:"读入一个数字 n，打印它的 2 倍。", hint:"先转 int 再乘。", answer:"n = int(input())\nprint(n * 2)", judge:hasAll(["n=int(input())","print(n*2)"]) },
      { key:"l8q3", text:"读取年龄并转成整数存入 age。", hint:"age = int(input())", answer:"age = int(input())", judge:has("age=int(input())") },
      { key:"l8q4", text:"读入两个数字并打印它们的和。", hint:"两次 int(input()) 后相加。", answer:"a = int(input())\nb = int(input())\nprint(a + b)", judge:hasAll(["a=int(input())","b=int(input())","print(a+b)"]) }
    ],
    blindbox: { icon:"🍀", name:"输入幸运草", tips:[
      "input() 让程序等待用户输入。",
      "它返回的是字符串，不是数字。",
      "要算数：int(input()) 转成整数。",
      "转数字后才能做加减乘除。"
    ]},
    blindbox2: { icon:"📥", name:"输入妙招", tips:[
      "input 永远返回字符串，要小数用 float(input())。",
      "可以一边提示一边读：input('名字：')。",
      "float(input()) 读小数，如身高、体重。",
      "读多个数可先 split：a, b = input().split()。"
    ]}
  },
  {
    id: "l9", ch: 9, title: "字典", icon: "🗂️", sub: "用名字查内容",
    teach: "📖 第 9 关 · 字典 dict\n\n字典用 { } 存「键值对」，像一本通讯录，用名字查内容。\n\n【创建】\nd = {\"name\": \"Tom\", \"age\": 18}\n\n【取值】\nd[\"name\"]     # 键存在就取出；不存在会报错\nd.get(\"name\") # 不存在返回 None，更安全\n\n【修改 / 新增】\nd[\"age\"] = 20   # 改\n d[\"city\"] = \"BJ\" # 新增\n\n【遍历】\nfor k in d:\n    print(k, d[k])   # k 是键，d[k] 是值\n\n🧠 记住：字典靠「键」查「值」，列表靠「编号」查值。",
    questions: [
      { key:"l9q1", text:'创建字典 d，用 name 作为键存名字 Liam。', hint:'d = {"name": "Liam"}', answer:'d = {"name": "Liam"}', judge:hasAll(['name','Liam']) },
      { key:"l9q2", text:'d = {"score": 80}，打印 score 对应的值。', hint:'d["score"]', answer:'print(d["score"])', judge:has('d["score"]') },
      { key:"l9q3", text:"把字典里 score 的值改成 95。", hint:'d["score"] = 95', answer:'d["score"] = 95', judge:has('d["score"]=95') },
      { key:"l9q4", text:"遍历字典，打印每个键和对应的值。", hint:"for k in d: print(k, d[k])", answer:"for k in d:\n    print(k, d[k])", judge:hasAll(["for","print","d[k]"]) }
    ],
    blindbox: { icon:"💎", name:"字典宝石", tips:[
      "字典用 { } 存键值对。",
      "取值 d[\"key\"] 或 d.get(\"key\")。",
      "get() 找不到返回 None，更安全。",
      "遍历：for k in d: 取出键，再用 d[k] 取值。"
    ]},
    blindbox2: { icon:"🗝️", name:"字典钥匙", tips:[
      "字典的键必须唯一且不可变（字符串、数字、元组可用）。",
      "d.keys() 取所有键，d.values() 取所有值。",
      "用 in 判断键是否存在：'name' in d。",
      "嵌套字典能表达复杂结构，如 d['user']['age']。"
    ]}
  },
  {
    id: "l10", ch: 10, title: "函数", icon: "🧠", sub: "造一台小机器",
    teach: "📖 第 10 关 · 函数 def\n\n函数是可重复使用的代码块，像一台小机器，喂材料出结果。\n\n【定义】\ndef 函数名(参数):\n    代码...\n    return 返回值\n\n✅ def + 函数名 + 括号 + 冒号\n✅ 函数体缩进\n✅ return 把结果交回来\n\n【定义不执行，要调用】\ndef greet():\n    print(\"hi\")\ngreet()   # ← 调用才运行\n\n【带参数】\ndef add(a, b):\n    return a + b\nadd(3, 5) → 8\n\n🧠 记住：函数让代码不重复，改一处处处生效。学会函数，你的 Python 基础就毕业啦！",
    questions: [
      { key:"l10q1", text:"定义函数 add(a, b)，返回它们的和。", hint:"def add(a, b): return a + b", answer:"def add(a, b):\n    return a + b", judge:hasAll(["def","return"]) },
      { key:"l10q2", text:'定义函数 greet 打印 "world"，然后调用它。', hint:"定义后写 greet() 才会执行。", answer:'def greet():\n    print("world")\ngreet()', judge:hasAll(["def","greet()"]) },
      { key:"l10q3", text:"定义 square(n) 返回 n 的平方，并打印 square(4)。", hint:"return n * n", answer:"def square(n):\n    return n * n\nprint(square(4))", judge:hasAll(["def","return","print"]) },
      { key:"l10q4", text:"定义 bigger(a,b)，返回较大的那个数。", hint:"可以用 if/else 或三元表达式。", answer:"def bigger(a, b):\n    return a if a > b else b", judge:hasAll(["def","return"]) }
    ],
    blindbox: { icon:"🧠", name:"函数大脑", tips:[
      "def 函数名(参数): 用来定义函数。",
      "return 把结果交回来。",
      "定义后必须「调用」才执行。",
      "函数让代码复用，是进阶的第一步。"
    ]},
    blindbox2: { icon:"🛠️", name:"函数工具箱", tips:[
      "默认参数：def f(x=0) 调用时可省略该参数。",
      "可变位置参数：def f(*args) 接收任意多个参数。",
      "可变关键字参数：def f(**kw) 接收任意多个命名参数。",
      "lambda 是匿名小函数：square = lambda x: x * x。"
    ]}
  }
];

module.exports = LESSONS;
