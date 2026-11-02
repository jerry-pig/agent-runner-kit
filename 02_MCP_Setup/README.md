# 数据接入总览

按设备和客户端选择接入方式，不要求同时配置多个服务。先连接并进行只读验证，再用于日志；外部训练日历写入需要用户明确指令。

- [COROS 官方连接指南与实验性 CLI](coros_cn/SETUP_GUIDE.md)
- [Intervals.icu 连接与 API 说明](intervals_icu/SETUP_GUIDE.md)
- [MCP 配置骨架](agent_mcp_config.json)：空服务列表；以你实际安装的服务与客户端当前文档填写，不预设未经验证的命令。

`coros_cn/coros-direct.js` 是针对特定中国大陆网络环境的**单次调用脚本**，不是 MCP stdio 服务，不能放进 `mcpServers` 作为长期运行的服务。优先考虑 [COROS 官方 MCP](https://github.com/coroslab/COROS-MCP) 的当前连接方式。接口返回、认证方式及服务商数据限制可能变化，出现 401、403、网络或无活动时分别排查，不宣称已同步。

连接后将 COROS 跑步与 Intervals 同步副本去重；多项目活动分列。详见 `03_Vault_Skeleton/04_Tools/双数据源活动归并与日志规则.md`。
