# 🚴 Intervals.icu MCP 接入与配置指南

> **核心目标**：将智能骑行台（ThinkRider / 迈金 / Wahoo）、虚拟骑行软件（MyWhoosh / Zwift / 顽鹿）及全平台耐力数据（PMC 模型）接驳至你的本地 AI 训练中枢。

---

## 🌐 为什么推荐接入 Intervals.icu？

1. **跨设备聚合**：如果你既跑步又骑行，或者使用心率带、骑行台，Intervals.icu 是目前全球最强大的免费严肃耐力数据分析中枢；
2. **PMC 疲劳体能模型**：精确量化你的 **CTL (体能)**、**ATL (疲劳)**、**TSB (体能状态)** 与单次训练 **TSS (训练压力得分)**；
3. **官方 MCP 支持**：社区与官方有现成的 `intervals-mcp-server`，AI Agent 可以直接原生以工具形式调用。

---

## 🔑 第一步：获取你的 API 凭证 (100% 免费)

1. 浏览器访问：<https://intervals.icu> 并登录；
2. 点击左侧菜单底部的 **Settings (设置)**；
3. 滚动到页面底部的 **Developer settings (开发者设置)** 区域；
4. 找到 **API_KEY**，点击右侧的 **Show (显示)** 并复制你的专属长密钥；
5. 在同一区域查看并复制你的 **Athlete ID**（通常是字母 `i` 开头加数字，如 `i123456`，或纯数字）。

---

## 🛠️ 第二步：全局安装与认证

在终端中执行全局安装：

```bash
# 使用 npm 全局安装
npm install -g intervals-mcp-server

# 运行交互式认证向导
intervals-mcp-server auth
```

在终端提示中：
- 粘贴你的 `API_KEY`
- 粘贴你的 `Athlete ID`

该向导会自动向服务器发送请求校验，校验通过后，凭证将保存在本地：
- `~/.config/intervals-mcp-server/config.json`

---

## ⚡ 第三步：测试与验证

在终端中测试：
```bash
intervals-mcp-server --test
```
如果提示 `Authenticated successfully`，表示配置成功！
后续在 AI 工具（Cursor / Antigravity / Claude Desktop 等）中只要把 `intervals-mcp-server` 作为标准 stdio MCP 服务注册，AI 即可直接调用其全部工具（`get_activities`、`get_activity_details`、`get_wellness_data` 等）。
