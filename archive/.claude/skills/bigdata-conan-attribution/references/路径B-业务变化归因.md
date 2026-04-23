# 路径 B：业务变化归因

> 适用：指标波动由渠道策略、价格、活动、课包结构、销售动作等业务变化驱动

---

## B-1：业务变化识别清单

**必须先逐一核查以下变化点**，每项核查都要有 SQL 数据支撑：

| 变化类型 | 核查方向 | 关键字段 |
|---------|---------|---------|
| 渠道结构变化 | 各渠道占比是否变化 | `business_channel_category`, `user_from`, `ad_channel` |
| 价格/课包结构变化 | 是否引入/下线中价课、联报课包 | `lesson_sale_mode`, `buy_way`, `semester_type` |
| 活动/促销节点 | 近期是否有大促或限时活动 | `pay_dt` 趋势 + 人工确认 |
| 转化口径变化 | 是否修改了续报追踪目标定义 | `is_should_renewal`, `is_renewal` |
| 科目结构变化 | 各科目订单占比是否移位 | `subject_id`, `lesson_id` |
| 老师/班级调整 | 是否有大规模换班、换老师 | `teacher_id`, `class_id` |
| 投放素材/策略更新 | 广告侧是否调整出价或素材 | 结合广告投放数据 |

---

## B-2：渠道结构归因 SQL

```sql
-- 对比两周各渠道占比变化
SELECT
    pay_dt
    ,business_channel_category -- 业务渠道大类：市场/用户增长/其他
    ,user_from                 -- 来源细分：long_in_class/try_double_in_class 等
    ,COUNT(DISTINCT order_id) AS order_cnt
    ,SUM(pay_amt) AS gmv
FROM dw_conan_dwd.dwd_try_course_order_detail_da
WHERE dt = '2026-03-17'
  AND pay_dt BETWEEN '{对比开始日}' AND '{对比结束日}'
  AND subject_id IN ('1','2','3') -- 基础学科
GROUP BY pay_dt, business_channel_category, user_from
```

---

## B-3：课包/价格结构归因 SQL

```sql
-- 拆分课程售卖模式占比
SELECT
    pay_dt
    ,lesson_sale_mode  -- 课程售卖模式：英语-中价/思维-低价/英思-中价 等
    ,buy_way           -- 购课方式：单科/联报
    ,semester_type     -- 学期类型：try_double/try_mid_price/try 等
    ,COUNT(DISTINCT order_id) AS order_cnt
    ,ROUND(COUNT(DISTINCT order_id) * 1.0
        / SUM(COUNT(DISTINCT order_id)) OVER (PARTITION BY pay_dt), 4) AS pct
FROM dw_conan_dwd.dwd_try_course_order_detail_da
WHERE dt = '2026-03-17'
  AND pay_dt BETWEEN '{对比开始日}' AND '{对比结束日}'
GROUP BY pay_dt, lesson_sale_mode, buy_way, semester_type
```

---

## B-4：转化路径归因 SQL（系统课）

```sql
-- 系统课订单转化路径分布（体验课/长续长/扩科等）
SELECT
    DATE_FORMAT(pay_dt, 'yyyy-MM-dd') AS pay_dt
    ,user_from          -- 用户来源：long_in_class/try_double_in_class/none 等
    ,class_type_new     -- 转化路径：导流课-系统课/体验课-系统课/直购 等
    ,subject_id
    ,COUNT(DISTINCT order_id) AS order_cnt
FROM dw_conan_ads.ads_conan_season_order_from_info_da
WHERE dt = '2026-03-17'
  AND pay_dt BETWEEN '{对比开始日}' AND '{对比结束日}'
  AND order_status >= '2'
GROUP BY DATE_FORMAT(pay_dt, 'yyyy-MM-dd'), user_from, class_type_new, subject_id
```

---

## B-5：业务变化归因输出格式

```
## 业务变化归因结论

| 变化点 | 对比基准 | 本期值 | 影响方向 | 数据支撑 |
|-------|---------|-------|---------|---------|
| 市场渠道占比上升 | 15% | 23% | 单价↓，转化率↓ | SQL-渠道结构 |
| 中价课占比下降 | 35% | 20% | 客单价↓ | SQL-课包结构 |

**初步判断**：主因是渠道结构变化，市场渠道用户付费意愿相对低于增长渠道用户。
**是否需要用户组成归因**：是，进入路径 C 进一步验证人群差异。
```
