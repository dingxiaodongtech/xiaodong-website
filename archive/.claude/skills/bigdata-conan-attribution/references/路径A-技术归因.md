# 路径 A：技术归因

> 适用：数据为 NULL / 分区缺失 / 指标异常突增突降且怀疑 ETL 问题

---

## A-1：异常描述解析（必须输出）

提取 4 要素，缺失必填项时主动追问：

| 要素 | 状态 | 示例 |
|------|------|------|
| 目标表/指标 | ✅ 必填 | `ads_conan_xxx_da` 的订单数 |
| 异常时间 | ✅ 必填 | `2026-03-14`（异常日），对比基准日 |
| 异常类型 | ✅ 必填 | 偏高 / 偏低 / NULL / 分区缺失 / 重复 |
| 异常幅度 | 可选 | 下降 30%、昨日为 0 |

---

## A-2：同比/环比基线判断

**斑马业务的周期性规律（优先排查）**：

| 因素类型 | 典型场景 | 影响方向 |
|---------|---------|---------|
| 法定节假日 | 春节、国庆、五一、元旦 | 付费行为↑，上课行为↓ |
| 寒暑假 | 1-2月寒假、7-8月暑假 | 学习时长↑，转化率可能异常 |
| 开学季 | 9月、3月 | 新用户购课↑ |
| 周末 vs 工作日 | 每周五-日 | 到课率↑，购课↑ |
| 月初/月末 | 促销节点 | 订单量波动 |

```sql
-- 拉取近 30 天趋势，判断是否为自然波动
SELECT
    dt
    ,{指标字段}
FROM {目标表}
WHERE dt >= DATE_FORMAT(DATE_SUB('{异常日期}', INTERVAL 30 DAY), '%Y-%m-%d')
  AND dt <= '{异常日期}'
GROUP BY dt
```

**判断规则**：周同比偏差 < 20% 且与节假日吻合 → 很可能自然波动，输出说明后终止或由用户决定是否继续；否则进入 A-3。

---

## A-3：血缘追溯

**两步操作**（因 `metadata_getTableLineage` 需要 tableId 整数，不接受表名字符串）：

**Step 1：获取 tableId**

```
metadata_getTableDetail(
    table="ads_conan_xxx_da",   -- 只传表名，不带库名
    tableType="Hive"
)
-- 从返回结果中取 tableId 字段（整数）
```

**Step 2：查血缘**

```
metadata_getTableLineage(
    tableId=<上一步取到的整数>,
    upperDepth=5,   -- 向上追溯 5 层（ODS 层通常在 3-4 层以内）
    lowerDepth=1    -- 向下 1 层（了解下游影响）
)
```

输出格式不变：

```
## 血缘链路（共 N 层）
ADS层:  dw_ads.ads_conan_xxx_da
  └─ DWS层:  dw_dws.dws_conan_xxx_da
       └─ DWD层:  dw_dwd.dwd_eng_order_course_detail_da
            ├─ ODS层:  dw_ods.ods_conan_order_info_inc
            └─ ODS层:  dw_ods.ods_conan_order_item_inc
```

---

## A-4：ETL 口径分析

对血缘树中每一层非 ODS 表，调用 `change_getTaskScriptContent` 获取脚本后分析。

> ⚠️ **参数差异**：新接口需传 **Change 任务名**（含后缀，如 `dwd_eng_order_course_detail_da.hql`），**不接受全表名**。
> 任务名通常与表名相同（加 `.hql` / `.php` 后缀），若不确定可先用 `change_getTaskDetail(taskName="表名.hql")` 验证是否存在。

```
change_getTaskScriptContent(
    taskName="dwd_eng_order_course_detail_da.hql"  -- ⚠️ 必须保留后缀
)
```

| 风险类型 | 识别特征 |
|---------|---------|
| WHERE 过滤条件变更 | 新增/修改过滤字段 |
| JOIN 类型变更 | INNER/LEFT/RIGHT 切换 |
| 字段逻辑变更 | CASE WHEN、运算表达式 |
| 去重逻辑 | ROW_NUMBER / DISTINCT |
| 分区写入逻辑 | INSERT OVERWRITE 分区键 |

---

## A-5：脚本变更历史对比

> ❌ **`get_job_change_history` 在 bigdata-mcp-server 中无对应工具。**
>
> **降级方案**：
> 1. 用 `change_getTaskDetail(taskName="xxx.hql")` 查看任务基本信息（负责人、状态等）
> 2. 手动前往 Change 平台（`https://change.zhenguanyu.com`）查看该任务的历史变更记录
> 3. 若怀疑某次变更导致异常，把当前脚本（A-4 取到的）与异常日期前的版本人工对比

对比重点（不变）：

```diff
- WHERE pay_status IN (1, 2)   -- 原：已支付 + 待支付
+ WHERE pay_status = 1          -- 新：仅已支付（范围收窄 ⚠️）
```

**变更时间与异常时间关联**：
- 变更时间 ≤ 异常日期 → 🔴 高度吻合，为主要嫌疑
- 变更时间早于异常很久 → 🟡 降低嫌疑

---

## A-6：字段关联分析

> ❌ **`query_table_column_relationships` 在 bigdata-mcp-server 中无对应工具。**
>
> **降级方案**：
> 1. 通过 A-4 获取到上下游表的 ETL 脚本
> 2. 在脚本中搜索异常字段名，人工追踪 SELECT / CASE WHEN / JOIN ON 中的字段映射关系
> 3. 若需快速定位字段在哪张表，可用 `metadata_searchTables(keywords="字段名", keywordsType="字段")` 模糊找到来源表

---

## A-7：数据分层验证 SQL

```sql
-- 验证模板：逐层对比异常日 vs 正常日
SELECT
    dt
    ,COUNT(1) AS row_cnt
    ,COUNT(DISTINCT order_id) AS order_cnt
    ,SUM(CASE WHEN pay_status = 1 THEN 1 ELSE 0 END) AS paid_cnt
FROM {目标表}
WHERE dt IN ('{正常日}', '{异常日}')
GROUP BY dt
```

**决策树**：ODS 正常 → DWD 正常 → DWS 正常 → 根因在 ADS 层；哪层出现数据量差异，该层即为根因层。
