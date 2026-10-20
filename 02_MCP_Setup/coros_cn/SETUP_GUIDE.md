# ⌚ 高驰 (COROS) 大陆区 MCP 接入与环境配置指南

> **核心目标**：让中国大陆区的 COROS 手表用户（手机号注册），在本地网络环境（即便开启了 Clash / Mihomo / 科学上网等代理）下，也能 100% 稳定调用高驰官方 MCP 接口。

---

## 🔍 背景与痛点说明

高驰在国内外有两套独立的服务器节点：
- **海外区 (US / Global)**：`mcpus.coros.com`
- **中国大陆区 (CN)**：`mcpcn.coros.com`（解析至阿里云杭州节点 `8.141.27.17`）

中国大陆手机号注册的账号必须在大陆区认证。如果你电脑常驻开启了代理软件（VPN / 虚拟网卡代理），官方的默认请求极易被代理截获或误路由至海外区，导致凭证校验失败（401 / 403）。  
本套件自带的 `coros-direct.js` 会**自动探测你电脑真实的物理网卡 IPv4（WLAN / 以太网），绕过所有代理与虚拟网卡，直连阿里云机房**，从根本上解决断连与网络报错！

---

## 🛠️ 第一步：环境前置要求

1. **安装 Node.js**（推荐 v18 或更高版本）：
   - 打开终端验证：`node -v`
2. **确认账号属性**：
   - 确认你的高驰 App 是使用中国大陆手机号登录的账号。

---

## 🔑 第二步：首次登录与获取本地 Token 凭证

高驰官方 MCP 网关提供了标准的 OAuth 登录流。在终端运行以下命令：

```bash
# 运行官方 MCP 网关完成首次认证
npx @coros/mcp-gateway login
```

1. 终端会提示你选择区域：**选择 China (中国大陆区)**；
2. 终端会输出一个授权登录 URL，在浏览器中打开并输入你的高驰账号与验证码/密码进行授权；
3. 授权成功后，网关会自动将凭证保存在本地：
   - Windows 路径：`C:\Users\<你的用户名>\.coros-mcp-skill-gateway-ts\cn\token.json`
   - macOS/Linux 路径：`~/.coros-mcp-skill-gateway-ts/cn/token.json`
4. 验证文件是否存在：
   只要该 `token.json` 存在，后续的所有查询都将全自动使用该凭证刷新与通信，无需重复登录。

---

## 🚀 第三步：验证直连脚本有效性

进入本目录，在终端运行以下测试命令：

```bash
# 1. 验证设备信息（查看是否返回你的 COROS 手表序列号与型号）
node coros-direct.js queryDevices

# 2. 验证运动员体征
node coros-direct.js queryUserInfo

# 3. 验证最近运动记录检索
# 格式：node coros-direct.js querySportRecords 开始年月日 结束年月日 (YYYYMMDD)
node coros-direct.js querySportRecords 20261001 20261020
```

如果控制台成功输出了你的手表信息或运动 JSON 数据，恭喜你！高驰数据管道已完全打通！

---

## 🤖 第四步：在 AI Agent 中使用

你可以让你的 AI 助手直接在后台执行命令获取数据，或者在 MCP 客户端配置中注册该脚本作为命令工具。日常使用只需对 AI 说：
- *“帮我查一下昨天的高驰跑步记录”*
- *“查一下我昨晚的睡眠心率和恢复体征”*
AI 将自动调用 `coros-direct.js` 拉取数据并渲染成美观的分析报告或写入 Markdown 日志。
