# 🤝 贡献指南 (Contributing to Agent-Runner-Kit)

感谢你关注并愿意为 **Agent-Runner-Kit** 贡献力量！  
本项目旨在打造一个属于全球严肃耐力跑者与科技爱好者的运动科学中枢。无论你是运动生理学研究者、程序员、教练还是普通跑者，我们都极其欢迎你的参与！

---

## 🌟 欢迎贡献的领域

1. **🧠 运动科学知识卡片 (`03_Vault_Skeleton/02_Knowledge/`)**：
   - 将顶级运动生理学文献（PubMed、Cell Metabolism、Sports Med 等）提炼为原子化 Markdown 卡片；
   - 包含：理论机制、生化靶点、实操训练处方、关联链接。
2. **🔌 硬件与平台 MCP 接入适配 (`02_MCP_Setup/`)**：
   - 为佳明（Garmin Connect）、华为运动健康、Apple Health 等提供更多 MCP 网关或同步脚本；
   - 优化现有 COROS 与 Intervals.icu 稳定性和数据字段。
3. **📋 专项训练模板与 Dataview 看板 (`03_Vault_Skeleton/`)**：
   - 贡献针对全马 Sub-300、半马 Sub-70、铁三、中距离 1500m 的专项周期化微周期模板；
   - 优化 DataviewJS 交互式图表与负荷看板。
4. **🌐 国际化与翻译**：
   - 完善英文、日文及更多语言的文档翻译。

---

## 📝 知识卡片贡献规范

新增知识卡片必须遵循统一的 YAML Frontmatter 格式，以保证 Obsidian 知识图谱的可检索性：

```markdown
---
concept_id: 你的英文简短概念标识 (如 mct1-transporter)
title: 概念中文标题
category: 生理与代谢 | 力学与力量 | 恢复与营养 | 训练方法论
source_papers:
  - "作者 (年份) 期刊名 (DOI)"
application_scenarios:
  - 适用场景 1
  - 适用场景 2
tags:
  - knowledge/endurance-science
  - physiology/your-topic
---

# 💡 [卡片标题]

> **一句话核心价值**：简明扼要的一句话概括。

---

## 🔬 生理机制与科学原理
...

## 🏃 实操应用方案 (How-To)
...

## 🔗 关联知识
...
```

---

## 🚀 提交流程 (Pull Request)

1. **Fork** 本仓库到你的个人 GitHub；
2. 在你的本地创建特性分支：`git checkout -b feat/add-vo2max-card`；
3. 提交修改并书写清晰的 Commit Message（遵循 Conventional Commits 规范，如 `feat:`, `fix:`, `docs:`）；
4. 推送分支并向本项目发起 **Pull Request**；
5. 我们会尽快组织 Review 并合并！
