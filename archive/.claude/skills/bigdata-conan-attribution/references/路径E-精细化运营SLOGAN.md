# 路径 E：精细化运营归因（SLOGAN 外呼 / 圈人名单）

> 适用：找高潜用户、打电话名单、个案分析、圈人外呼

---

## E-1：三类名单生成框架

| 名单类型 | 定义 | 核心筛选条件 |
|---------|-----|------------|
| **高潜未转化** | 体验课行为好但未续报 | 完课率高 + 未续报 + 在绩效期内 |
| **流失预警** | 系统课低完课、即将断课 | 完课率 < 50% + 剩余课时少 + 在课 |
| **召回候选** | 断课一段时间但历史表现好 | 断课时间适中 + 历史完课率高 + 未退费 |

---

## E-2：高潜未转化名单 SQL（体验课 SLOGAN）

```sql
-- 高潜但未转化的体验课用户：完课率高 + 在绩效期内 + 未续报
SELECT
    q.user_id
    ,q.order_id
    ,q.lessonid
    ,q.subject_id
    ,q.finish_rate_all    -- 总完课率（越高越好）
    ,q.attend_rate_all    -- 总到课率
    ,q.is_should_renewal  -- 是否在续报追踪范围
    ,q.renewal_end_date   -- 续报截止日期
    ,u.city               -- 城市
    ,u.city_type          -- 城市类型
    ,u.fst_paid_dt        -- 首次付费时间
    ,DATEDIFF('2026-03-17', u.fst_paid_dt) AS days_since_first_pay
FROM dw_conan_ads.ads_service_try_double_user_quality_detail_da q
LEFT JOIN dw_dim.dim_eng_user_extend_da u
    ON q.user_id = u.user_id
    AND u.dt = '2026-03-17'
WHERE q.dt = '2026-03-17'
  AND q.is_should_renewal = 1                              -- 应续报追踪目标
  AND q.is_renewal = 0                                     -- 尚未续报
  AND CAST(q.finish_rate_all AS DOUBLE) >= 0.7             -- 完课率 ≥ 70%（高质量行为）
  AND CAST(q.attend_rate_all AS DOUBLE) >= 0.8             -- 到课率 ≥ 80%
  AND q.renewal_end_date >= '2026-03-17'                   -- 还在绩效期内
  AND q.subject_id IN ('1','2','3')                        -- 基础学科
```

---

## E-3：流失预警名单 SQL（系统课）

```sql
-- 系统课流失预警：低完课率 + 课时即将用完 + 当前在课
SELECT
    lbl.userid
    ,lbl.lessonid
    ,lbl.cur_status_v2                                -- 在课状态（5点批次：文字）
    ,CAST(lbl.finish_ratio_7d AS DOUBLE) AS finish_7d -- 近7日完课率
    ,CAST(lbl.finish_ratio_30d AS DOUBLE) AS finish_30d -- 近30日完课率
    ,renew.end_week_dt                                -- 预计结课周
    ,renew.is_should_renew                            -- 是否应续报
    ,renew.is_conan_renewed                           -- 是否已续报
    ,u.city_type
    ,u.city
FROM dw_ads.dm_eng_user_portrait_label_di lbl
JOIN dw_conan_dwd.dwd_service_order_long_renew_long_da renew
    ON lbl.userid = renew.user_id
    AND renew.dt = '2026-03-17'
    AND renew.is_should_renew = 1
    AND renew.is_conan_renewed = 0           -- 还未续报
    AND DATEDIFF(renew.end_week_dt, '2026-03-17') BETWEEN 0 AND 21 -- 3周内结课
LEFT JOIN dw_dim.dim_eng_user_extend_da u
    ON lbl.userid = u.user_id
    AND u.dt = '2026-03-17'
WHERE lbl.dt = '2026-03-17'
  AND lbl.bunch = 'history'
  AND lbl.lessonid IN ('20','46','118')      -- 基础学科系统课
  AND lbl.cur_status_v2 = '在课'
  AND CAST(lbl.finish_ratio_7d AS DOUBLE) < 0.5  -- 近7日完课率 < 50%
```

---

## E-4：断课召回候选名单 SQL

```sql
-- 断课召回候选：断课时间适中 + 历史完课率可 + 未退费
-- 使用 dm_eng_user_portrait_label_di 的 break_date_v2 字段判断断课日期
SELECT
    lbl.userid AS user_id
    ,renew.order_id
    ,renew.subject_id
    ,lbl.break_date_v2                         -- 断课日期（来自画像表）
    ,DATEDIFF('2026-03-17', TRY_CAST(lbl.break_date_v2 AS DATE)) AS days_since_break -- 断课天数
    ,renew.is_conan_renewed
    ,renew.user_city                           -- 用户城市
    ,renew.user_city_type                      -- 城市等级
    ,u.fst_paid_dt
FROM (
    SELECT userid
        ,lessonid
        ,break_date_v2
        ,cur_status_v2
    FROM dw_ads.dm_eng_user_portrait_label_di
    WHERE dt = '2026-03-17'
      AND bunch = 'history'
      AND cur_status_v2 = '断课'              -- 断课状态
      AND break_date_v2 IS NOT NULL           -- 有断课日期
      AND DATEDIFF('2026-03-17', TRY_CAST(break_date_v2 AS DATE)) BETWEEN 7 AND 60  -- 断课 1-8 周
      AND lessonid IN ('20','46','118')       -- 基础学科系统课
) lbl
INNER JOIN dw_conan_dwd.dwd_service_order_long_renew_long_da renew
    ON lbl.userid = renew.user_id
    AND renew.dt = '2026-03-17'
    AND renew.is_should_renew = 1
    AND renew.is_conan_renewed = 0            -- 未续报
    AND renew.refund_list IS NULL             -- 未发生退费
    AND renew.subject_id IN ('1','2','3')     -- 基础学科
LEFT JOIN dw_dim.dim_eng_user_extend_da u
    ON lbl.userid = u.user_id
    AND u.dt = '2026-03-17'
```

---

## E-5：SLOGAN 名单输出格式

名单生成后必须输出以下信息：

```
## SLOGAN 名单（{类型}）

### 基本情况
- 名单规模：XXX 人
- 覆盖科目：英语 XXX / 思维 XXX / 阅读 XXX
- 城市分布：一线 XX% / 新一线 XX% / 二三线 XX%

### 筛选条件说明
| 条件 | 值 | 业务含义 |
|-----|---|---------|
| finish_rate_all ≥ 0.7 | 完课率 70% 以上 | 学习行为积极 |
| is_renewal = 0 | 尚未续报 | 有续报空间 |
| renewal_end_date ≥ 今日 | 绩效期内 | 老师有服务动力 |

### 典型用户案例（Top 5）
| user_id | 城市 | 完课率 | 到课率 | 剩余天数 | 备注 |
|---------|-----|-------|-------|---------|-----|
| xxx | 成都 | 85% | 92% | 8天 | 高质量用户，续报意愿可能高 |

### 外呼话术建议
- 开场：根据完课率高夸孩子坚持认真
- 核心：询问下一期学习安排，引导续报意愿
- 异议：对于已沉默用户，先问最近孩子学习状态

### 执行建议
- 优先级 1：绩效期剩余 ≤ 7 天 + 完课率 ≥ 80%（最紧迫）
- 优先级 2：绩效期剩余 8-14 天 + 完课率 60%-80%
- 过期用户：转入召回流程，不走常规 SLOGAN
```
