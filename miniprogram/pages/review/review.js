// pages/review/review.js —— 复习测验 + 错题本（纯本地，无云、无付费）
var LESSONS = require("../../data/questions.js");

// 把 40 道「自己写 Python」代码题汇总成题库
var POOL = [];
LESSONS.forEach(function (L) {
  L.questions.forEach(function (q) {
    POOL.push({
      key: q.key, title: L.title, icon: L.icon,
      text: q.text, hint: q.hint, answer: q.answer, judge: q.judge
    });
  });
});

var WRONG_KEY = "liam_wrongbank_v1";

Page({
  data: {
    tab: "quiz",          // quiz | wrong
    mode: "menu",         // menu | doing | report
    cur: null,            // 当前题目
    total: 10,            // 本次测验题数
    index: 0,             // 当前第几题（1-based）
    userInput: "",
    feedback: null,
    showHint: false,
    showAnswer: false,
    score: 0,
    answered: 0,
    report: null,
    wrongList: [],
    wrongCount: 0,
    toast: ""
  },

  onLoad: function () { this._loadWrong(); },
  onShow: function () {
    this._loadWrong();
    if (this.data.tab === "wrong") this._renderWrong();
  },

  _loadWrong: function () {
    try { this._wrong = wx.getStorageSync(WRONG_KEY) || []; } catch (e) { this._wrong = []; }
    this.setData({ wrongCount: (this._wrong || []).length });
  },
  _byKey: function (key) {
    for (var i = 0; i < POOL.length; i++) if (POOL[i].key === key) return POOL[i];
    return null;
  },

  switchTab: function (e) {
    var t = e.currentTarget.dataset.tab;
    this.setData({ tab: t });
    if (t === "wrong") this._renderWrong();
    else this.setData({ mode: "menu" });
  },

  _renderWrong: function () {
    var self = this;
    var list = (this._wrong || []).map(function (key) {
      var q = self._byKey(key);
      return q ? { key: key, title: q.title, icon: q.icon, text: q.text } : null;
    }).filter(function (x) { return x; });
    this.setData({ wrongList: list });
  },

  // ---------- 随机测验 ----------
  startQuiz: function () {
    var n = Math.min(this.data.total, POOL.length);
    var idx = [];
    for (var i = 0; i < POOL.length; i++) idx.push(i);
    for (var j = idx.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var t = idx[j]; idx[j] = idx[k]; idx[k] = t;
    }
    this._quiz = idx.slice(0, n).map(function (i) { return POOL[i]; });
    this._qpos = 0;
    this.setData({ mode: "doing", index: 0, score: 0, answered: 0, report: null, feedback: null, showHint: false, showAnswer: false, userInput: "" });
    this._showCur();
  },

  // ---------- 错题练习（把错题本当作一份测验）----------
  startWrongPractice: function () {
    if (!this._wrong || !this._wrong.length) { this._toast("错题本还是空的，先去随机测验吧"); return; }
    this._quiz = this._wrong.map(this._byKey).filter(function (x) { return x; });
    this._qpos = 0;
    this.setData({ mode: "doing", index: 0, score: 0, answered: 0, report: null, feedback: null, showHint: false, showAnswer: false, userInput: "" });
    this._showCur();
  },

  _showCur: function () {
    var q = this._quiz[this._qpos];
    this.setData({
      cur: q, userInput: "", feedback: null, showHint: false, showAnswer: false,
      index: this._qpos + 1, total: this._quiz.length
    });
  },

  onInput: function (e) { this.setData({ userInput: e.detail.value }); },
  onToggleHint: function () { this.setData({ showHint: !this.data.showHint }); },
  onShowAnswer: function () {
    this.setData({ showAnswer: true, feedback: { type: "bad", msg: "💡 参考答案如下，理解后继续" } });
  },

  onSubmit: function () {
    var q = this.data.cur;
    if (!q) return;
    var ok = false;
    try { ok = !!q.judge(this.data.userInput); } catch (err) { ok = false; }
    if (ok) {
      var sc = this.data.score + 10;
      var an = this.data.answered + 1;
      this.setData({ feedback: { type: "ok", msg: "✅ 正确！+10 分" }, score: sc, answered: an });
      this._removeWrong(q.key);
      var self = this;
      setTimeout(function () { self._next(); }, 650);
    } else {
      var an2 = this.data.answered + 1;
      this._addWrong(q.key);
      if (this.data.showAnswer) {
        this.setData({ answered: an2 });
        var self2 = this;
        setTimeout(function () { self2._next(); }, 600);
      } else {
        this.setData({ feedback: { type: "bad", msg: "❌ 不对哦，再试一次（或点「看答案」）" }, answered: an2 });
      }
    }
  },

  onSkip: function () { this._next(); },

  _next: function () {
    this._qpos++;
    if (this._qpos >= this._quiz.length) this._finish();
    else this._showCur();
  },

  _finish: function () {
    var total = this._quiz.length;
    var correct = Math.round(this.data.score / 10);
    var acc = total ? Math.round(correct / total * 100) : 0;
    this.setData({ mode: "report", report: { total: total, correct: correct, wrong: total - correct, acc: acc, score: this.data.score } });
  },

  // ---------- 错题本 ----------
  _addWrong: function (key) {
    if (!this._wrong) this._wrong = [];
    if (this._wrong.indexOf(key) < 0) {
      this._wrong.push(key);
      try { wx.setStorageSync(WRONG_KEY, this._wrong); } catch (e) {}
      this.setData({ wrongCount: this._wrong.length });
    }
  },
  _removeWrong: function (key) {
    if (!this._wrong) return;
    var i = this._wrong.indexOf(key);
    if (i >= 0) {
      this._wrong.splice(i, 1);
      try { wx.setStorageSync(WRONG_KEY, this._wrong); } catch (e) {}
      this.setData({ wrongCount: this._wrong.length });
    }
  },
  clearWrong: function () {
    this._wrong = [];
    try { wx.removeStorageSync(WRONG_KEY); } catch (e) {}
    this.setData({ wrongCount: 0, wrongList: [] });
    this._toast("已清空错题本");
  },
  practiceOne: function (e) {
    var key = e.currentTarget.dataset.key;
    var q = this._byKey(key);
    if (!q) return;
    this._quiz = [q];
    this._qpos = 0;
    this.setData({ mode: "doing", index: 1, total: 1, score: 0, answered: 0, report: null, feedback: null, showHint: false, showAnswer: false, userInput: "" });
    this._showCur();
  },

  // ---------- 导航 ----------
  goIndex: function () { wx.switchTab({ url: "/pages/index/index" }); },
  goKnowledge: function () { wx.switchTab({ url: "/pages/knowledge/knowledge" }); },

  _toast: function (msg) {
    var self = this;
    this.setData({ toast: msg });
    if (this._tt) clearTimeout(this._tt);
    this._tt = setTimeout(function () { self.setData({ toast: "" }); }, 1600);
  }
});
