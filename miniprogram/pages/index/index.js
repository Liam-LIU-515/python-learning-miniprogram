// © 2026 LiuAohua. 版权所有，仅供学习参考，禁止商用与二次分发。
// pages/index/index.js —— 10 章学习路径版（对外定位：Python 语法练习工具）
// 设计要点：每个可走格子外观一模一样（用户不知道是教学/写代码/盲盒）；
// 内容沿通路均匀分布、类型被打乱不扎堆；每章含 2 个惊喜盲盒（微信自带 emoji + Python 知识）；
// 章节之间用「动画过场」衔接（纯 CSS，不消耗积分）；音效仅在开出知识卡时播放。
// 全程免费，无任何广告 / 内购 / 隐藏付费。

// ============ 音效管理（仅盲盒，本地 WAV，小体积）============
var AUDIO = {};
function playSound(name) {
  try {
    if (!AUDIO[name]) {
      var ctx = wx.createInnerAudioContext();
      ctx.src = "/audio/" + name + ".wav";
      AUDIO[name] = ctx;
    }
    AUDIO[name].stop();
    AUDIO[name].play();
  } catch (e) {}
}
function buzz(type) {
  try { wx.vibrateShort({ type: type || "light" }); } catch (e) {}
}

// ============ 种子随机数 + 递归回溯迷宫（每关独立、有死路，真正像迷宫）============
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// 生成一个 n×n 单元格的完美迷宫，返回 D×D 的网格（0=路 1=墙）与起点→终点的唯一通路
function genMaze(seed, n) {
  var D = 2 * n + 1;
  var g = [];
  for (var r = 0; r < D; r++) { g.push([]); for (var c = 0; c < D; c++) g[r].push(1); }
  var rng = mulberry32((seed * 2654435761) >>> 0 || 1);
  var visited = [];
  for (var r2 = 0; r2 < n; r2++) { visited.push([]); for (var c2 = 0; c2 < n; c2++) visited[r2].push(false); }
  var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  var stack = [[0, 0]];
  visited[0][0] = true;
  g[1][1] = 0;
  while (stack.length) {
    var cur = stack[stack.length - 1];
    var cr = cur[0], cc = cur[1];
    var nb = [];
    for (var d = 0; d < 4; d++) {
      var nr = cr + dirs[d][0], nc = cc + dirs[d][1];
      if (nr >= 0 && nc >= 0 && nr < n && nc < n && !visited[nr][nc]) nb.push([nr, nc, d]);
    }
    if (nb.length) {
      var pick = nb[Math.floor(rng() * nb.length)];
      var wr = 2 * cr + 1 + dirs[pick[2]][0];
      var wc = 2 * cc + 1 + dirs[pick[2]][1];
      g[wr][wc] = 0;
      g[2 * pick[0] + 1][2 * pick[1] + 1] = 0;
      visited[pick[0]][pick[1]] = true;
      stack.push([pick[0], pick[1]]);
    } else { stack.pop(); }
  }
  // BFS 求唯一通路（网格坐标）
  var start = [1, 1], goal = [D - 2, D - 2];
  var prev = {}, seen = {}; seen[start[0] + "," + start[1]] = true;
  var q = [start];
  while (q.length) {
    var cur2 = q.shift();
    if (cur2[0] === goal[0] && cur2[1] === goal[1]) break;
    for (var d2 = 0; d2 < 4; d2++) {
      var rr = cur2[0] + dirs[d2][0], cc2 = cur2[1] + dirs[d2][1];
      if (rr < 0 || cc2 < 0 || rr >= D || cc2 >= D) continue;
      if (g[rr][cc2] !== 0) continue;
      var kk = rr + "," + cc2;
      if (seen[kk]) continue;
      seen[kk] = true; prev[kk] = cur2[0] + "," + cur2[1]; q.push([rr, cc2]);
    }
  }
  var path = []; var ck = goal[0] + "," + goal[1];
  while (ck) { var p = ck.split(","); path.push([parseInt(p[0], 10), parseInt(p[1], 10)]); ck = prev[ck]; }
  path.reverse();
  return { grid: g, path: path };
}

// 生成迷宫并确保通路足够长（保证 7 个内容点能均匀铺开、不重叠）
function genMazeSafe(seed, n) {
  var m = genMaze(seed, n), t = 0;
  while (m.path.length < 21 && t < 60) { t++; m = genMaze(seed + t * 131, n); }
  return m;
}
// 星级文本：n 颗实星 + 空心星
function starText(n) {
  var s = "";
  for (var i = 0; i < n; i++) s += "⭐";
  for (var j = 0; j < 3 - n; j++) s += "☆";
  return s;
}

var STARS_KEY = "liam_stars_v1";   // 每关最佳星级（成就，不随「重新开始」清空）
var DEX_KEY = "liam_boxdex_v1";    // 已收集的盲盒（图鉴）

// 版本标识：改代码后请同步改这里，用于在手机上确认跑的是不是最新代码
var VERSION = "v2026.10.18-1930 · 零隐私版";

// ============ 课程内容：从共享题库读取（判定工具 norm/has/hasAll 也在题库内）============
var LESSONS = require("../../data/questions.js");

// 每大关的内容序列：教学 → 4 道写代码 → 2 个盲盒（共 7 个内容点）
function buildChapterContent(chIndex) {
  var L = LESSONS[chIndex];
  var items = [];
  items.push({ type: "teach", title: L.title, icon: L.icon, text: L.teach });
  L.questions.forEach(function (q) {
    items.push({ type: "code", key: q.key, text: q.text, hint: q.hint, answer: q.answer, judge: q.judge });
  });
  items.push({ type: "blindbox", dexKey: L.id + "#0", title: L.blindbox.name, icon: L.blindbox.icon, tips: L.blindbox.tips });
  items.push({ type: "blindbox", dexKey: L.id + "#1", title: L.blindbox2.name, icon: L.blindbox2.icon, tips: L.blindbox2.tips });
  return items;
}
// 把内容沿通路【均匀分布】，并把非教学内容（代码+盲盒）用种子洗牌打乱，避免扎堆
// 约束：相同类型最多连续 2 个（教学固定最先出现），且用固定种子重试保证可复现
function placeContent(path, items, chSeed) {
  var head = items.slice(0, 1); // 教学固定最先出现（先学后练）
  var rest = items.slice(1);
  var L = path.length, count = items.length, span = (L - 2) - 1; // 内部区间 [1, L-2]
  var ordered = null, attempt = 0;
  while (true) {
    var rng = mulberry32(((chSeed * 7919 + 13) + attempt * 2654435761) >>> 0 || 1);
    var r = rest.slice();
    for (var i = r.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = r[i]; r[i] = r[j]; r[j] = t;
    }
    ordered = head.concat(r);
    // 计算最长连续同类
    var seq = ordered.map(function (it) { return it.type; });
    var maxRun = 1, run = 1;
    for (var s = 1; s < seq.length; s++) {
      if (seq[s] === seq[s - 1]) { run++; if (run > maxRun) maxRun = run; } else { run = 1; }
    }
    if (maxRun <= 2 || attempt > 200) break;
    attempt++;
  }
  var map = {};
  for (var k = 0; k < count; k++) {
    var frac = count === 1 ? 0 : k / (count - 1);
    var idx = 1 + Math.round(frac * span);
    var pc = path[idx];
    map[pc[0] + "," + pc[1]] = ordered[k];
  }
  return map;
}
var CHAPTERS = LESSONS.map(function (L) {
  return { ch: L.ch, id: L.id, title: L.title, icon: L.icon, sub: L.sub };
});

var DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // 上 右 下 左
var STORE_KEY = "liam_chapters_v3";

// ============ 页面逻辑 ============
Page({
  data: {
    panel: "story", // story | map | theater | maze | teach | code | blindbox | levelclear | finale
    chapters: CHAPTERS,
    chapterStatus: [],
    curChapterMeta: {},
    theaterMeta: {},
    curChapter: 0,
    maze: [],
    robotR: 1, robotC: 1, endR: 1, endC: 1,
    chapterProgress: 0, chapterTotal: 7,
    score: 0, gold: 0,
    // 当前内容
    curTitle: "", curIcon: "", curText: "", curHint: "", curAnswer: "", curTips: [],
    userInput: "", feedback: null, wrongTries: 0, showAnswer: false, showHint: false,
    // 结局 / 通关
    finalScore: 0, finalGold: 0, finalLessons: 10, finalCode: 0, finalBox: 0, finalMastery: 0, curStars: 0, curStarsTxt: "",
    // 星级与图鉴
    chapterStars: [], chapterStarsTxt: [], totalStars: 0, boxCount: 0,
    toast: "",
    version: VERSION,
    cover: "/images/cover.png", mascot: "/images/liam.png",
    // 分享海报
    showPoster: false, posterImage: ""
  },

  onLoad: function () { this._load(); },
  onShareAppMessage: function () {
    return {
      title: "我用这个小程序学完了 Python 基础！一起来练习吧～",
      path: "/pages/index/index",
      imageUrl: this.data.cover
    };
  },

  // ---------- 存档 ----------
  _load: function () {
    this._cleared = [];
    this._chaptersState = {};
    this._score = 0; this._gold = 0; this._codeDone = 0; this._boxDone = 0;
    this._curCh = 0;
    this._maze = null; this._cellContent = {}; this._chapterResolved = {};
    this._robotR = 1; this._robotC = 1; this._endR = 1; this._endC = 1;
    this._pendingCh = 1;
    this._replaySeed = 0;
    // 成就类数据：星级与图鉴（不随「重新开始」清空）
    this._stars = {}; this._dex = [];
    try { this._stars = wx.getStorageSync(STARS_KEY) || {}; } catch (e2) {}
    try { this._dex = wx.getStorageSync(DEX_KEY) || []; } catch (e3) {}
    try {
      var s = wx.getStorageSync(STORE_KEY);
      if (s && s.cleared) {
        this._cleared = s.cleared || [];
        this._chaptersState = s.chapters || {};
        this._score = s.score | 0; this._gold = s.gold | 0;
        this._codeDone = s.codeDone | 0; this._boxDone = s.boxDone | 0;
        this.setData({
          panel: "map",
          chapters: CHAPTERS,
          chapterStatus: this._computeStatus(),
          score: this._score, gold: this._gold,
          chapterStars: this._starsArray(), chapterStarsTxt: this._starsTxt(),
          totalStars: this._totalStars(), boxCount: (this._dex || []).length
        });
        return;
      }
    } catch (e) {}
    this.setData({
      chapters: CHAPTERS, chapterStatus: this._computeStatus(), score: 0, gold: 0, panel: "story",
      chapterStars: this._starsArray(), chapterStarsTxt: this._starsTxt(),
      totalStars: this._totalStars(), boxCount: (this._dex || []).length
    });
  },
  _saveAll: function () {
    try {
      wx.setStorageSync(STORE_KEY, {
        cleared: this._cleared, chapters: this._chaptersState,
        score: this._score, gold: this._gold, codeDone: this._codeDone, boxDone: this._boxDone
      });
    } catch (e) {}
  },
  _saveChapter: function () {
    var keys = [];
    for (var k in this._chapterResolved) if (this._chapterResolved[k]) keys.push(k);
    this._chaptersState[this._curCh] = { resolved: keys, robotR: this._robotR, robotC: this._robotC, stat: this._chStat || { wrong: 0, skip: 0, peek: 0 } };
    this._saveAll();
  },

  _computeStatus: function () {
    var status = [], currentSet = false;
    for (var i = 1; i <= CHAPTERS.length; i++) {
      if (this._cleared.indexOf(i) >= 0) { status.push("done"); }
      else {
        var unlocked = (i === 1) || (this._cleared.indexOf(i - 1) >= 0);
        if (unlocked && !currentSet) { status.push("current"); currentSet = true; }
        else if (unlocked) { status.push("open"); }
        else { status.push("locked"); }
      }
    }
    return status;
  },

  // ---------- 故事开头 ----------
  onStart: function () {
    this.setData({
      panel: "map", chapterStatus: this._computeStatus(),
      chapterStars: this._starsArray(), chapterStarsTxt: this._starsTxt(),
      totalStars: this._totalStars(), boxCount: (this._dex || []).length
    });
  },

  // ---------- 地图：进入某大关（先播放动画剧场）----------
  onTapChapter: function (e) {
    var ch = parseInt(e.currentTarget.dataset.ch, 10);
    var st = this._computeStatus()[ch - 1];
    if (st === "locked") { this._toast("🔒 请先学完上一章"); return; }
    if (st === "done") {
      // 重玩已通关的关卡：清空本章进度 + 换一座随机迷宫（用来刷三星）
      this._chaptersState[ch] = {};
      this._replaySeed = (Date.now() % 90000) + 7;
      this._toast("🔄 重练本章，这次换一条新路径！");
    } else {
      this._replaySeed = 0;
    }
    this._pendingCh = ch;
    this.setData({ panel: "theater", theaterMeta: CHAPTERS[ch - 1] });
  },
  onEnterMaze: function () {
    this.enterChapter(this._pendingCh);
  },
  enterChapter: function (ch) {
    this._curCh = ch;
    var meta = CHAPTERS[ch - 1];
    var st = this._chaptersState[ch] || {};
    var n = 5 + Math.floor((ch - 1) / 4); // 难度随关数缓增：5→6→7 格
    var seed = this._replaySeed ? this._replaySeed : (ch * 1000 + 7); // 首次固定、重玩随机
    var m = genMazeSafe(seed, n);
    this._maze = m.grid;
    this._endR = m.path[m.path.length - 1][0];
    this._endC = m.path[m.path.length - 1][1];
    // 把 7 个内容均匀铺到通路上（起点格不放，终点格是 🏁 也不放）
    var items = buildChapterContent(ch - 1);
    this._cellContent = placeContent(m.path, items, ch);
    // 恢复本章进度与本次作答统计（用于评星）
    this._chapterResolved = {};
    this._chStat = st.stat || { wrong: 0, skip: 0, peek: 0 };
    (st.resolved || []).forEach(function (k) { this._chapterResolved[k] = true; }, this);
    this._robotR = (st.robotR != null) ? st.robotR : m.path[0][0];
    this._robotC = (st.robotC != null) ? st.robotC : m.path[0][1];
    this.setData({
      panel: "maze", curChapterMeta: meta, curChapter: ch,
      score: this._score, gold: this._gold,
      chapterProgress: Object.keys(this._chapterResolved).length,
      chapterTotal: items.length
    });
    this._render();
    this._enterCell(this._robotR, this._robotC); // 若停留在未学内容格则重新弹出
  },

  _render: function () {
    // 注意：所有可走格子外观完全一致，不显示任何类型标记（惊喜留到踩中才揭晓）
    this.setData({
      maze: this._maze,
      robotR: this._robotR, robotC: this._robotC, endR: this._endR, endC: this._endC
    });
  },

  // ---------- 移动 ----------
  onUp: function () { this._move(0); },
  onRight: function () { this._move(1); },
  onDown: function () { this._move(2); },
  onLeft: function () { this._move(3); },
  _move: function (d) {
    if (this.data.panel !== "maze") return;
    var nr = this._robotR + DIRS[d][0];
    var nc = this._robotC + DIRS[d][1];
    if (nr < 0 || nc < 0 || nr >= this._maze.length || nc >= this._maze[0].length) { this._toast("🚫 撞墙啦"); return; }
    if (this._maze[nr][nc] === 1) { this._toast("🚫 撞墙啦"); return; }
    this._robotR = nr; this._robotC = nc;
    this._render();
    this._enterCell(nr, nc);
  },
  // 滑动操作（移动端更顺手）
  onTouchStart: function (e) { this._ts = e.touches[0]; },
  onTouchEnd: function (e) {
    if (!this._ts) return;
    var t = e.changedTouches[0];
    var dx = t.clientX - this._ts.clientX, dy = t.clientY - this._ts.clientY;
    this._ts = null;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) this._move(dx > 0 ? 1 : 3);
    else this._move(dy > 0 ? 2 : 0);
  },

  _enterCell: function (r, c) {
    var key = r + "," + c;
    if (r === this._endR && c === this._endC) {
      if (this._chapterAllDone()) { this._clearChapter(); }
      else { this._toast("🏁 本章还有内容没学完，继续走完吧"); }
      return;
    }
    var item = this._cellContent[key];
    if (!item) { this._saveChapter(); return; } // 普通路，无内容
    if (this._chapterResolved[key]) { this._saveChapter(); return; } // 已学过
    if (item.type === "teach") {
      this.setData({ panel: "teach", curTitle: item.title, curIcon: item.icon, curText: item.text });
    } else if (item.type === "blindbox") {
      this.setData({ panel: "blindbox", curTitle: item.title, curIcon: item.icon, curTips: item.tips });
      playSound("blindbox"); buzz("light");
    } else if (item.type === "code") {
      this._judge = item.judge;
      this.setData({ panel: "code", curTitle: item.title, curIcon: "✏️", curText: item.text, curHint: item.hint || "", curAnswer: item.answer || "", userInput: "", feedback: null, wrongTries: 0, showAnswer: false, showHint: false });
    }
  },

  // ---------- 教学卡片 ----------
  onTeachDone: function () { this._resolveCurrent(); this.setData({ panel: "maze" }); this._render(); },

  // ---------- 盲盒 ----------
  onBlindboxDone: function () { this._resolveCurrent(); this.setData({ panel: "maze" }); this._render(); },

  // ---------- 代码挑战 ----------
  onInput: function (e) { this.setData({ userInput: e.detail.value }); },
  onSubmit: function () {
    var ok = false;
    try { ok = this._judge ? !!this._judge(this.data.userInput) : false; } catch (err) { ok = false; }
    if (ok) {
      this.setData({ feedback: { type: "ok", msg: "✅ 写对啦！+15 分 +5 积分" } });
      this._resolveCurrent();
      var self = this;
      setTimeout(function () { self.setData({ panel: "maze", feedback: null }); self._render(); }, 700);
    } else {
      if (this._chStat) this._chStat.wrong++;
      var wt = this.data.wrongTries + 1;
      if (wt >= 2) {
        this.setData({ wrongTries: wt, showAnswer: true, feedback: { type: "bad", msg: "❌ 看看参考答案，理解后再继续" } });
      } else {
        this.setData({ wrongTries: wt, feedback: { type: "bad", msg: "❌ 不对哦，再试一次（第 " + wt + " 次）" } });
      }
    }
  },
  onShowAnswer: function () {
    if (this._chStat) this._chStat.peek++;
    this.setData({ showAnswer: true, showHint: true, feedback: { type: "bad", msg: "💡 参考答案如下，理解后继续" } });
  },
  onToggleHint: function () { this.setData({ showHint: !this.data.showHint }); },
  onSkipCode: function () {
    if (this._chStat) this._chStat.skip++;
    var key = this._robotR + "," + this._robotC;
    if (!this._chapterResolved[key]) {
      this._chapterResolved[key] = true; // 跳过不加分，但计入进度，避免卡死
      this.setData({ chapterProgress: Object.keys(this._chapterResolved).length });
      this._saveChapter();
    }
    this.setData({ panel: "maze", feedback: null, showAnswer: false, userInput: "" });
    this._render();
  },

  // ---------- 结算当前格子为已学 ----------
  _resolveCurrent: function () {
    var key = this._robotR + "," + this._robotC;
    var item = this._cellContent[key];
    if (item && !this._chapterResolved[key]) {
      this._chapterResolved[key] = true;
      if (item.type === "code") { this._score += 15; this._gold += 5; this._codeDone++; }
      else if (item.type === "blindbox") { this._gold += 2; this._boxDone++; this._addDex(item.dexKey); }
      this.setData({ score: this._score, gold: this._gold, chapterProgress: Object.keys(this._chapterResolved).length });
      this._saveChapter();
    } else {
      this._saveChapter();
    }
  },
  _chapterAllDone: function () {
    for (var k in this._cellContent) if (!this._chapterResolved[k]) return false;
    return true;
  },

  // ---------- 章节通关 ----------
  _clearChapter: function () {
    if (this._cleared.indexOf(this._curCh) < 0) this._cleared.push(this._curCh);
    this._saveAll();
    var allDone = this._cleared.length >= CHAPTERS.length;
    // 本关评级：3⭐=全部一次答对且没看答案/没跳过；2⭐=有重试但都做对；1⭐=用过看答案或跳过
    var stx = this._chStat || { wrong: 0, skip: 0, peek: 0 };
    var stars = 3;
    if (stx.skip > 0 || stx.peek > 0) stars = 1;
    else if (stx.wrong > 0) stars = 2;
    var prev = this._stars[this._curCh] || 0;
    if (stars > prev) { this._stars[this._curCh] = stars; this._saveStars(); }
    // Python 基础掌握度：写代码题(40)占50%、盲盒(20)占30%、通关课程(10)占20%
    var mastery = Math.round((this._codeDone / 40) * 50 + (this._boxDone / 20) * 30 + (this._cleared.length / 10) * 20);
    this.setData({
      panel: allDone ? "finale" : "levelclear",
      chapterStatus: this._computeStatus(),
      finalScore: this._score, finalGold: this._gold,
      finalLessons: this._cleared.length, finalCode: this._codeDone, finalBox: this._boxDone,
      finalMastery: mastery,
      curStars: stars, curStarsTxt: starText(stars),
      chapterStars: this._starsArray(), chapterStarsTxt: this._starsTxt(),
      totalStars: this._totalStars(), boxCount: (this._dex || []).length,
      curChapterMeta: CHAPTERS[this._curCh - 1]
    });
  },
  onNextChapter: function () {
    var next = this._curCh + 1;
    if (next <= CHAPTERS.length) {
      this._pendingCh = next;
      this.setData({ panel: "theater", theaterMeta: CHAPTERS[next - 1] });
    } else {
      this.setData({ panel: "map", chapterStatus: this._computeStatus() });
    }
  },
  onBackToMap: function () {
    this.setData({
      panel: "map", chapterStatus: this._computeStatus(), chapters: CHAPTERS, score: this._score, gold: this._gold,
      chapterStars: this._starsArray(), chapterStarsTxt: this._starsTxt(),
      totalStars: this._totalStars(), boxCount: (this._dex || []).length
    });
  },

  // ---------- 分享海报（canvas 生成，纯前端、不联网、不花积分）----------
  onMakePoster: function () {
    var self = this;
    var W = 360, H = 504;
    var ctx = wx.createCanvasContext("posterCanvas");
    // 背景渐变
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#EAF6FF");
    grad.addColorStop(1, "#F3FBF7");
    ctx.setFillStyle(grad);
    ctx.fillRect(0, 0, W, H);
    // 标题
    ctx.setTextAlign("center");
    ctx.setFillStyle("#1565C0");
    ctx.setFontSize(26);
    ctx.fillText("🤖 Python 语法练习 · 学习报告", W / 2, 52);
    ctx.setFillStyle("#37474F");
    ctx.setFontSize(18);
    ctx.fillText("我学完了 Python 基础！", W / 2, 84);
    // 掌握度环
    var cx = W / 2, cy = 250, r = 52;
    var m = this.data.finalMastery || 0;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.setStrokeStyle("#E3F0FB");
    ctx.setLineWidth(14);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (m / 100) * 2 * Math.PI);
    ctx.setStrokeStyle("#1E88E5");
    ctx.setLineWidth(14);
    ctx.stroke();
    ctx.setFillStyle("#1565C0");
    ctx.setFontSize(32);
    ctx.fillText(m + "%", cx, cy + 10);
    ctx.setFontSize(14);
    ctx.setFillStyle("#607D8B");
    ctx.fillText("Python 基础掌握度", cx, cy + 36);
    // 统计
    var stats = [["⭐", this.data.finalScore], ["🪙", this.data.finalGold], ["📗", this.data.finalLessons], ["✏️", this.data.finalCode], ["🎁", this.data.finalBox]];
    var sx = 30, sy = 350, gap = (W - 60) / stats.length;
    for (var i = 0; i < stats.length; i++) {
      var x = sx + i * gap + gap / 2;
      ctx.setFontSize(22);
      ctx.setFillStyle("#2B3A4A");
      ctx.fillText(stats[i][0], x, sy);
      ctx.setFontSize(18);
      ctx.fillText(String(stats[i][1]), x, sy + 26);
    }
    // 页脚
    ctx.setFontSize(14);
    ctx.setFillStyle("#78909C");
    ctx.fillText("沿学习路径练 Python · 完全免费", W / 2, H - 28);
    ctx.draw(false, function () {
      wx.canvasToTempFilePath({
        canvasId: "posterCanvas",
        success: function (res) { self.setData({ posterImage: res.tempFilePath, showPoster: true }); },
        fail: function () { self._toast("海报生成失败，请重试"); }
      });
    });
  },
  // 说明：海报只做本地预览与转发，不写入用户相册，因此不涉及任何需要后台声明的用户权限。
  onClosePoster: function () { this.setData({ showPoster: false }); },

  // ---------- 重新开始 ----------
  onRestart: function () {
    this._cleared = []; this._chaptersState = {};
    this._score = 0; this._gold = 0; this._codeDone = 0; this._boxDone = 0;
    try { wx.removeStorageSync(STORE_KEY); } catch (e) {}
    // 注意：星级与图鉴属于「成就」，不随重置清空，避免辛苦收集的成果丢失
    this.setData({
      panel: "map", chapterStatus: this._computeStatus(), score: 0, gold: 0, chapters: CHAPTERS,
      chapterStars: this._starsArray(), chapterStarsTxt: this._starsTxt(),
      totalStars: this._totalStars(), boxCount: (this._dex || []).length
    });
    this._toast("🔄 已重置，重新开始练习");
  },

  // ---------- 星级 / 图鉴辅助 ----------
  _starsArray: function () {
    var arr = [];
    for (var i = 1; i <= CHAPTERS.length; i++) arr.push(this._stars[i] || 0);
    return arr;
  },
  _starsTxt: function () {
    var arr = [];
    for (var i = 1; i <= CHAPTERS.length; i++) arr.push(starText(this._stars[i] || 0));
    return arr;
  },
  _totalStars: function () {
    var t = 0;
    for (var k in this._stars) t += this._stars[k];
    return t;
  },
  _saveStars: function () {
    try { wx.setStorageSync(STARS_KEY, this._stars); } catch (e) {}
  },
  _addDex: function (dexKey) {
    if (!dexKey) return;
    if (!this._dex) this._dex = [];
    if (this._dex.indexOf(dexKey) < 0) {
      this._dex.push(dexKey);
      try { wx.setStorageSync(DEX_KEY, this._dex); } catch (e) {}
      this.setData({ boxCount: this._dex.length });
    }
  },

  onGoKnowledge: function () { wx.switchTab({ url: "/pages/knowledge/knowledge" }); },
  onGoReview: function () { wx.switchTab({ url: "/pages/review/review" }); },
  onGoDex: function () { wx.switchTab({ url: "/pages/dex/dex" }); },

  _toast: function (msg) {
    var self = this;
    this.setData({ toast: msg });
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(function () { self.setData({ toast: "" }); }, 1600);
  }
});
