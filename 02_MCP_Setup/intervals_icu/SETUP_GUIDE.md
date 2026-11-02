# Intervals.icu 连接与只读验证

在 [Intervals.icu](https://intervals.icu) 登录后，可在设置中的开发者区域找到 Athlete ID 与个人 API key。密钥只放在受保护的本地配置；不要粘贴到公开文件、日志或截图。通过社区 MCP 工具连接时，以该工具**当前官方仓库／包文档**的安装、权限与命令为准，先验证来源和权限。

直接使用 Intervals.icu API 时，HTTP Basic Auth 的用户名为字面值 **`API_KEY`**，密码为个人 API key；Athlete ID 用于选择账户。参考 [Intervals.icu API 指南](https://forum.intervals.icu/t/api-access-to-intervals-icu/609)。不要在 URL、shell 历史或终端输出中暴露密钥。

验证时只读查询已知日期活动，核对 ID、开始时间、项目和来源，再决定是否写本地日志。401 需检查认证方式、密钥及权限；空列表、网络错误、授权错误和数据尚未同步是不同状态。供应商对第三方活动的 API 访问可能有限制，不把缺少字段当作 0。

功率区、IF 与基于功率的负荷依赖 FTP 设定；未校准时不要把平台分区当个人阈值。CTL／ATL／TSB 是平台模型，并非伤病诊断。
