// © 2026 LiuAohua. 版权所有，仅供学习参考，禁止商用与二次分发。
// pages/knowledge/knowledge.js —— Python 基础「一张图」总结
// 内容对应练习路径的 10 个章节，纯本地、无需云、零积分消耗。
Page({
  data: {
    cover: "/images/cover.png",
    mascot: "/images/liam.png",
    knowledge: [
      {
        ch: 1, icon: "📢", title: "输出 print", sub: "让屏幕开口说话",
        points: [
          "print() 把内容显示到屏幕",
          "文字要加引号，数字不用",
          "逗号连接多个值，默认打印完换行"
        ],
        motto: "想显示什么，就交给 print()"
      },
      {
        ch: 2, icon: "📦", title: "变量", sub: "给数据起名字",
        points: [
          "变量 = 带名字的盒子，用 = 装值",
          "字母 / 下划线开头，区分大小写",
          "可以重新赋值，旧值被覆盖"
        ],
        motto: "= 是装值，左边是名、右边是内容"
      },
      {
        ch: 3, icon: "➗", title: "运算符", sub: "像计算器一样算",
        points: [
          "+ - * / 四则；// 整除 % 取余 ** 幂",
          "先乘除后加减，括号最优先",
          "复合赋值 x += 1（还有 -=、*=）"
        ],
        motto: "/ 得小数，// 丢小数，% 看余数"
      },
      {
        ch: 4, icon: "📚", title: "列表", sub: "一排带编号的柜子",
        points: [
          "[ ] 装多个值，索引从 0 开始",
          "nums[-1] 取最后一个，len() 求长度",
          "append() 在末尾追加一个"
        ],
        motto: "一排编号柜子，编号从 0 开始"
      },
      {
        ch: 5, icon: "✂️", title: "切片", sub: "从序列里切一段",
        points: [
          "[开始:结束] 截取一段（结束不含）",
          "省略开始从头取，省略结束到末尾",
          "[::-1] 反转；[:2] 复制整段"
        ],
        motto: "开始可省、结束可省，步长可加"
      },
      {
        ch: 6, icon: "🔁", title: "循环 for", sub: "让电脑重复干活",
        points: [
          "for i in range(n): 循环 n 次",
          "range(5)→0~4；range(1,4)→1~3；步长 range(0,10,2)",
          "遍历列表：for x in 列表:"
        ],
        motto: "末尾冒号 + 缩进，是 Python 的灵魂"
      },
      {
        ch: 7, icon: "🔀", title: "判断 if", sub: "看情况做决定",
        points: [
          "if / elif / else 多分支",
          "== 相等（不是 =），!= 不相等",
          "and / or / not 组合多个条件"
        ],
        motto: "= 是赋值，== 才是相等判断"
      },
      {
        ch: 8, icon: "⌨️", title: "输入 input", sub: "和用户对话",
        points: [
          "input() 让程序等待用户输入",
          "它返回的是字符串（不是数字）",
          "int(input()) 转整数，float() 转小数"
        ],
        motto: "要算数，先用 int() 转成数字"
      },
      {
        ch: 9, icon: "🗂️", title: "字典", sub: "用名字查内容",
        points: [
          "{ } 存键值对，d['key'] 取值",
          "d.get() 找不到返回 None，更安全",
          "遍历：for k in d: print(k, d[k])"
        ],
        motto: "字典靠键查值，列表靠编号查值"
      },
      {
        ch: 10, icon: "🧠", title: "函数 def", sub: "造一台小机器",
        points: [
          "def 名(参数): 定义，return 交回结果",
          "定义不执行，必须调用才运行",
          "默认参数、*args、**kw、lambda 进阶"
        ],
        motto: "函数让代码复用，基础就此毕业"
      }
    ]
  },
  goReview: function () { wx.switchTab({ url: "/pages/review/review" }); },
  goGame: function () { wx.switchTab({ url: "/pages/index/index" }); }
});
