# 🔌 02_MCP_Setup: 穿戴硬件与数据平台接驳总览

> **模块设计原则：松耦合、按需接入**  
> 你不需要同时拥有高驰手表和骑行台。系统支持灵活的数据源组合：
> - **纯路跑者**：仅需配置 `coros_cn/`，实现高驰手表数据秒级入库与课表直推手表。
> - **骑跑双练 / 铁三跑者**：同时配置 `coros_cn/` 和 `intervals_icu/`，打通户外路跑 + 室内骑行台（功率/踏频/TSS）。
> - **非高驰跑者（佳明/苹果表/高驰海外）**：只需将数据同步至 Intervals.icu，即可完全使用 `intervals_icu/` 作为单引擎驱动整座中枢！

---

## 📂 子目录与配置清单

| 目录 / 文件 | 核心功能 | 适用人群 |
| :--- | :--- | :--- |
| **[`coros_cn/`](./coros_cn/)** | 高驰中国大陆区官方直连方案（自动绕过 VPN 代理，直连阿里云机房） | 中国大陆区高驰手表用户 |
| **[`intervals_icu/`](./intervals_icu/)** | 骑行台功率、踏频、做功量与 PMC 体能疲劳模型（CTL/ATL/TSB）读取 | 智能骑行台 / 多平台聚合用户 |
| **[`agent_mcp_config.json`](./agent_mcp_config.json)** | 针对各大 AI 客户端的标准 MCP 服务注册示例 | 开发者与 AI 客户端配置 |

---

## 🛠️ 主流 AI 客户端一键配置指南

根据你使用的 AI 工具，将以下配置片段添加至对应的配置文件中：

### 1. Cursor (`.cursor/mcp.json` 或 Settings -> MCP)

```json
{
  "mcpServers": {
    "coros_cn": {
      "command": "node",
      "args": ["<替换为你本地路径>/02_MCP_Setup/coros_cn/coros-direct.js", "listTools"]
    },
    "intervals": {
      "command": "intervals-mcp-server",
      "args": []
    }
  }
}
```

### 2. Claude Desktop (`claude_desktop_config.json`)

* **macOS 路径**：`~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows 路径**：`%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "intervals": {
      "command": "intervals-mcp-server",
      "args": []
    }
  }
}
```

### 3. Antigravity (`~/.gemini/antigravity/mcp_config.json`)

```json
{
  "mcpServers": {
    "intervals": {
      "command": "intervals-mcp-server",
      "args": []
    }
  }
}
```

### 4. VS Code + Cline / Roo-Code (`cline_mcp_settings.json`)

在扩展的 MCP Settings 中添加上述 command 与 args 即可。

---

## 🔍 环境自检与避坑

1. **Node.js 版本**：必须 $\ge 18.0.0$。
2. **科学上网环境（极其重要）**：
   - 如果你开着 Clash / Mihomo / 代理网关，直接调用官方境外节点会被路由拦截导致 401/403 证书错误；
   - 本套件提供的 `coros_cn/coros-direct.js` 会自动探测物理网卡（以太网/Wi-Fi）直连阿里云 `8.141.27.17`，请优先使用此执行引擎！
