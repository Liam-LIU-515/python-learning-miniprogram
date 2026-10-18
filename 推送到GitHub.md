# 📤 把本项目推送到 GitHub

> 状态：**本地 git 仓库已初始化，首次提交已完成**（commit `2d55dc4`，30 个文件）。
> 剩余工作只有两步：在 GitHub 上建仓库 → 推送。

---

## 0. 先理解：为什么需要「建仓库」？

GitHub 上**一个仓库（repository）= 一个项目**。
它就是你项目的云端文件夹，带完整的版本历史。
所以是的，**必须建一个仓库**，你的小程序才能放上去。（之后所有改动都是往这同一个仓库里推送，不用重复建。）

---

## 1. 在 GitHub 网页上新建仓库（约 1 分钟）

1. 打开 <https://github.com> 登录你的账号
2. 右上角点头像旁的 **「+」** → **「New repository」**
3. 按下面填：

| 字段 | 填什么 |
|------|--------|
| **Repository name** | 建议 `python-miniprogram` 或 `python-syntax-practice` |
| **Description** | `面向初学者的 Python 语法练习微信小程序 · 10 章迷宫学习路径 + 40 道代码挑战` |
| **Public / Private** | 见下一节的对比建议 |
| **Add a README file** | ❌ **不要勾**（我们本地已经有了，勾了会冲突） |
| **Add .gitignore** | ❌ **不要勾**（我们本地已有专门的 .gitignore） |
| **Choose a license** | ❌ **不要勾**（我们本地已有 MIT LICENSE 文件） |

4. 点 **「Create repository」**
5. 建好后页面上会显示你的仓库地址，形如：
   `https://github.com/<你的用户名>/<仓库名>.git`
   **把这个地址复制下来发给我**（或者直接告诉我用户名 + 仓库名）

---

## 2. 公开 vs 私有，怎么选？（为简历考虑）

| | 🟢 公开 Public | 🔒 私有 Private |
|---|---|---|
| 谁能看到 | 任何人，可被搜索 | 只有你自己 |
| 写进简历 | ✅ **可以贴链接，HR/面试官能直接点开看** | ❌ 贴了别人也打不开，只能口头描述 |
| 比赛 / 评审 | ✅ 评审可直接查看 | ❌ 需逐个授权 |
| 作品集效果 | ✅ 有 commit 记录，能体现持续开发 | ❌ 无 |
| 风险 | 代码会被看到（本项目**无密钥、无隐私接口**，安全） | 无 |

**我的建议：选「公开 Public」。**
你的目标是写进简历当项目经历，公开链接才有说服力 —— 面试官点开就能看到完整代码、提交历史和 README，比任何文字描述都管用。
而且本项目已经确认：无 AppSecret / 密钥、无隐私接口、无第三方闭源库、素材原创，公开不存在任何安全或侵权问题。

---

## 3. 推送命令（你建好仓库后执行）

把下面的 `<用户名>` 和 `<仓库名>` 换成你自己的，在 **Git Bash** 里执行：

```bash
cd "E:/微信小程序"
git remote add origin https://github.com/<用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

- 第一次 push 会弹出 GitHub 登录窗口（Git Credential Manager），**用浏览器登录授权即可**，之后就记住了。
- 如果弹窗没出来，提示要输入用户名密码：
  - 用户名 = 你的 GitHub 用户名
  - 密码 = **Personal Access Token**（不是登录密码）。
    生成路径：GitHub → 头像 → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → 勾选 `repo` → 生成后复制。

---

## 4. 推上去之后，让仓库更像「作品集」（强烈建议）

| 动作 | 做法 | 价值 |
|------|------|------|
| **放 2–4 张真机截图** | 新建 `screenshots/` 目录，把模拟器截图放进去，在 README 顶部引用 `![封面](screenshots/cover.png)` | 面试官一进来就看到成品，点击率翻倍 |
| **加 topics 标签** | 仓库主页右侧「About」→ 齿轮图标 → 填 `wechat-miniprogram` `python` `education` `javascript` | 更容易被搜到 |
| **补一句 About** | 同位置填一句话简介 + 你的小程序名称 | 显得专业 |
| **写清楚你的个人贡献** | README 里加一节「我在这个项目里做了什么」 | 面试时能直接讲 |

---

## 5. 常见报错

| 报错 | 原因 / 解决 |
|------|-------------|
| `remote origin already exists` | 已经加过远程地址了，直接 `git push -u origin main` 即可 |
| `failed to push... fetch first` | 仓库里有网页上建的 README/LICENSE，先执行 `git pull --rebase origin main` 再 push |
| `Authentication failed` | 密码处要填 **Token** 不是登录密码，见第 3 节 |
| `Support for password authentication was removed` | 同上，必须用 Token |
| `LF will be replaced by CRLF` | 只是警告，不影响，忽略即可 |

---

## 6. 以后改了代码怎么同步

```bash
cd "E:/微信小程序"
git add -A
git commit -m "这里写这次改了什么"
git push
```

三条命令搞定，GitHub 上就能看到最新代码和这次的改动记录。
