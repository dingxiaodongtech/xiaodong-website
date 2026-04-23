# 路径 C：用户组成归因

> 适用：分析人群结构差异，解释"这批用户是谁，为什么表现不同"

---

## C-1：用户组成分析框架

**四个核心拆解维度**（按分析目标选择）：

| 维度 | 核查方向 | 数据表/字段 |
|-----|---------|-----------|
| **地域分布** | 城市级别构成是否变化 | `dim_eng_user_extend_da.city_type` |
| **购课历史** | 首购 vs 复购 vs 老用户 | `dim_eng_user_extend_da.is_paid_user`, `fst_paid_dt`, `lst_paid_dt` |
| **在课状态** | 在课/断课/未开课构成 | `ads_eng_user_portrait_label_curr_di.cur_status_v2` |
| **设备/风险** | 设备价格、拼课风险 | `dwd_try_course_order_detail_da.is_season_pk`, `exp_device_cnt` |

还可以扩展到：
- 科目组合（只学英语 vs 多科联报）
- 年龄段（孩子年龄/家长年龄）
- 注册到付费天数（快转化 vs 慢转化）
- 老师分配情况
- 是否经历过退费

---

## C-2：地域城市级别拆解 SQL

```sql
-- 体验课下单用户的城市级别分布对比
SELECT
    DATE_FORMAT(o.pay_dt, 'yyyy-MM') AS pay_month
    ,u.city_type -- 城市类型：一线/新一线/二线/三线/四线
    ,COUNT(DISTINCT o.user_id) AS user_cnt
    ,ROUND(COUNT(DISTINCT o.user_id) * 1.0
        / SUM(COUNT(DISTINCT o.user_id)) OVER (PARTITION BY DATE_FORMAT(o.pay_dt,'yyyy-MM')), 4) AS user_pct
FROM dw_conan_dwd.dwd_try_course_order_detail_da o
LEFT JOIN dw_dim.dim_eng_user_extend_da u
    ON o.user_id = u.user_id
    AND u.dt = '2026-03-17'
WHERE o.dt = '2026-03-17'
  AND o.pay_dt BETWEEN '{对比开始日}' AND '{对比结束日}'
  AND u.city_type IS NOT NULL
  AND u.city_type != ''
GROUP BY DATE_FORMAT(o.pay_dt, 'yyyy-MM'), u.city_type
```

---

## C-3：购课历史分层拆解 SQL

```sql
-- 首购 vs 复购用户订单分布
SELECT
    DATE_FORMAT(o.pay_dt, 'yyyy-MM-dd') AS pay_dt
    ,CASE
        WHEN u.fst_paid_dt = DATE_FORMAT(o.pay_dt, 'yyyy-MM-dd') THEN '首购'
        WHEN u.is_paid_user = '1' AND DATEDIFF(o.pay_dt, u.fst_paid_dt) > 0 THEN '复购'
        ELSE '0元单/未知'
    END AS purchase_type
    ,COUNT(DISTINCT o.user_id) AS user_cnt
    ,SUM(o.pay_amt) AS gmv
FROM dw_conan_dwd.dwd_try_course_order_detail_da o
LEFT JOIN dw_dim.dim_eng_user_extend_da u
    ON o.user_id = u.user_id
    AND u.dt = '2026-03-17'
WHERE o.dt = '2026-03-17'
  AND o.pay_dt BETWEEN '{对比开始日}' AND '{对比结束日}'
GROUP BY DATE_FORMAT(o.pay_dt, 'yyyy-MM-dd'), purchase_type
```

---

## C-4：在课状态分布 SQL

```sql
-- 分析某批订单的用户当前在课状态分布
SELECT
    lbl.cur_status_v2 -- '0'=在课/'1'=未开课/'2'=断课/'3'=停课
    ,COUNT(DISTINCT o.user_id) AS user_cnt
FROM dw_conan_dwd.dwd_try_course_order_detail_da o
LEFT JOIN dw_ads.ads_eng_user_portrait_label_curr_di lbl
    ON o.user_id = lbl.userid
    AND lbl.dt = '2026-03-17'
    AND lbl.bunch = 'history'
    AND lbl.lessonid = '{目标lessonid}'
WHERE o.dt = '2026-03-17'
  AND o.pay_dt BETWEEN '{对比开始日}' AND '{对比结束日}'
GROUP BY lbl.cur_status_v2
```

---

## C-5：风险用户/拼课用户识别 SQL

```sql
-- 识别拼课风险订单（设备同时报名体验课和系统课）
SELECT
    pay_dt
    ,is_season_pk      -- 1=设备有系统课在读，拼课风险
    ,exp_device_cnt    -- 同设备报名体验课数量（>1疑似刷课）
    ,COUNT(DISTINCT order_id) AS order_cnt
FROM dw_conan_dwd.dwd_try_course_order_detail_da
WHERE dt = '2026-03-17'
  AND pay_dt BETWEEN '{对比开始日}' AND '{对比结束日}'
GROUP BY pay_dt, is_season_pk, exp_device_cnt
```

---

## C-6：用户组成归因输出格式

```
## 用户组成归因结论

### 本期用户 vs 基准期用户差异

| 维度 | 基准期 | 本期 | 差异 |
|-----|-------|-----|------|
| 三四线城市用户占比 | 28% | 41% | ↑ 13% |
| 首购用户占比 | 65% | 52% | ↓ 13% |
| 在课状态用户占比 | 70% | 58% | ↓ 12% |
| 拼课风险用户占比 | 3% | 8% | ↑ 5% |

**组成变化解释**：
- 三四线城市用户增加：可能与市场渠道投放城市下沉有关，这类用户付费金额和续报率相对较低
- 首购用户占比降低：老用户回购减少，新用户增多，新用户学习习惯尚未建立
- 拼课风险增加：需重点关注，建议拉出名单人工核查

**是否需要群体画像归因**：如果需要对某一批差异人群做更深度的多维分层（课程状态/完课率/续报意向等），进入路径 G。
```
