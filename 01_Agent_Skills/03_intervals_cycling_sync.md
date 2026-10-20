# 🚴 Agent Skill 03: Intervals.icu 骑行台与全平台负荷同步

> **适用场景**：跑者进行室内骑行台恢复（如 ThinkRider / 迈金 / MyWhoosh）、双练（晨跑 + 晚骑）、或需要综合评估 PMC 疲劳状态（CTL / ATL / TSB）时，Agent 执行的标准工作流。

---

## 🌐 为什么引入 Intervals.icu？

1. **骑行台直连断层**：很多智能骑行台（ANT+/蓝牙）无法直接将功率与踏频数据推送到高驰手表；
2. **全维度负荷量化**：通过骑行软件（MyWhoosh / 顽鹿 / Zwift）推送到 Strava / Intervals.icu，Agent 可通过 `intervals-mcp-server` 拉取：
   - **标准化功率 (NP / Normalized Power)**
   - **踏频 (Cadence / rpm)**
   - **做功量 (Work / kJ)**
   - **TSS (Training Stress Score)**
   - **PMC 疲劳体能模型**（体能 CTL、疲劳 ATL、状态 TSB）

---

## 🛠️ MCP 工具调用规范

### 1. 查询指定日期的活动列表
```bash
# 调用 intervals-mcp-server 中的 get_activities 工具
mcp_intervals_get_activities({ "oldest": "2026-10-20", "newest": "2026-10-20" })
```

### 2. 获取特定骑行活动详情
```bash
mcp_intervals_get_activity_details({ "id": "<activity_id>" })
```

### 3. 获取运动员体能状态 (Wellness & PMC)
```bash
mcp_intervals_get_wellness_data({ "oldest": "2026-10-14", "newest": "2026-10-20" })
```

---

## 📝 室内骑行日志生成规范

落盘路径：`01_Seasons/当前活跃战役/Logs/YYYY-MM-DD-室内骑行.md`。

```markdown
---
date: 2026-10-20
type: 室内骑行
duration_min: 45
distance_km: 22.4
avg_power_w: 165
np_w: 172
avg_hr: 128
max_hr: 142
cadence_rpm: 88
work_kj: 445
tss: 38
rpe: 4
knee_status: 0
target_cycle: "[[2026-W42]]"
tags:
  - 训练日志
  - 骑行台
  - 主动恢复
---

# 🚴 2026-10-20 室内骑行台恢复日志

> **挂载周计划**：[[2026-W42]]  
> **设备链路**：ThinkRider X2 Pro + MyWhoosh $\to$ Intervals.icu MCP  

---

## 📊 一、 骑行核心数据概览

| 骑行时长 | 虚拟距离 | 平均功率 | 标准化功率 (NP) | 平均踏频 | 平均心率 | 做功量 | TSS 负荷 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **45 min** | **22.4 km** | **165 W** | **172 W** | **88 rpm** | **128 bpm** | **445 kJ** | **38** |

---

## 🩺 二、 主客观融合反思

- **主观疲劳 RPE (1-10)**：`4` (轻度出汗，心肺无压力)
- **下肢关节状态**：`0` (骑行闭链运动对膝关节和跟腱零冲击，下肢肌群充血放松)
- **教练点评**：低冲击有氧（Zone 1~2 功率）能够加速下肢血液微循环，帮助代谢晨跑产生的微损伤，是绝佳的主动恢复手段。
```
