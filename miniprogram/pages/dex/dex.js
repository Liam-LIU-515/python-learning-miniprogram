// © 2026 LiuAohua. 版权所有，仅供学习参考，禁止商用与二次分发。
// pages/dex/dex.js —— Python 知识卡册（已解锁的补充知识点，可回看）
// 读取 index 页写入的本地收集记录 liam_boxdex_v1，纯本地、无云、无付费。
var LESSONS = require("../../data/questions.js");
var DEX_KEY = "liam_boxdex_v1";

// 展开全部 20 张知识卡（每章 2 张）
var ITEMS = [];
LESSONS.forEach(function (L) {
  ITEMS.push({
    key: L.id + "#0", ch: L.ch, title: L.title,
    icon: L.blindbox.icon, name: L.blindbox.name, tips: L.blindbox.tips
  });
  ITEMS.push({
    key: L.id + "#1", ch: L.ch, title: L.title,
    icon: L.blindbox2.icon, name: L.blindbox2.name, tips: L.blindbox2.tips
  });
});

Page({
  data: {
    items: [],
    count: 0,
    total: ITEMS.length,
    openKey: "",
    toast: ""
  },

  onLoad: function () { this._load(); },
  onShow: function () { this._load(); },

  _load: function () {
    var arr = [];
    try { arr = wx.getStorageSync(DEX_KEY) || []; } catch (e) { arr = []; }
    var got = {};
    arr.forEach(function (k) { got[k] = true; });
    var items = ITEMS.map(function (it) {
      var has = !!got[it.key];
      return {
        key: it.key, ch: it.ch, title: it.title, has: has,
        icon: has ? it.icon : "❓",
        name: has ? it.name : "未收集",
        tips: has ? it.tips : []
      };
    });
    this.setData({ items: items, count: arr.length, total: ITEMS.length });
  },

  toggle: function (e) {
    var k = e.currentTarget.dataset.key;
    var it = null;
    for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].key === k) it = ITEMS[i];
    if (!it) return;
    var has = false;
    for (var j = 0; j < this.data.items.length; j++) {
      if (this.data.items[j].key === k && this.data.items[j].has) has = true;
    }
    if (!has) { this._toast("还没解锁这张卡，继续学习就能拿到 🎁"); return; }
    this.setData({ openKey: this.data.openKey === k ? "" : k });
  },

  goIndex: function () { wx.switchTab({ url: "/pages/index/index" }); },

  _toast: function (msg) {
    var self = this;
    this.setData({ toast: msg });
    if (this._tt) clearTimeout(this._tt);
    this._tt = setTimeout(function () { self.setData({ toast: "" }); }, 1600);
  }
});
