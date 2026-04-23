# 路径 D：漏斗环节归因

> 适用：找出结果指标下降源于哪个转化环节的掉量

---

## D-1：体验课转系统课漏斗

```
报名体验课 → 开课（到课） → 参课 → 完课 → 续报（系统课转化）
```

```sql
-- 体验课全漏斗各环节率
SELECT
    DATE_FORMAT(o.pay_dt, 'yyyy-MM-dd') AS pay_dt
    ,COUNT(DISTINCT o.order_id) AS try_order_cnt           -- 报名数
    ,COUNT(DISTINCT CASE WHEN q.first_attend_tp IS NOT NULL
        THEN o.order_id END) AS attend_order_cnt           -- 到课数（首次参课）
    ,COUNT(DISTINCT CASE WHEN q.finish_rate_all > 0
        THEN o.order_id END) AS finish_order_cnt           -- 有完课数
    ,COUNT(DISTINCT CASE WHEN o.is_renewal = 1
        THEN o.order_id END) AS renewal_order_cnt          -- 续报数
    ,ROUND(COUNT(DISTINCT CASE WHEN q.first_attend_tp IS NOT NULL
        THEN o.order_id END) * 1.0
        / NULLIF(COUNT(DISTINCT o.order_id), 0), 4) AS attend_rate
    ,ROUND(COUNT(DISTINCT CASE WHEN o.is_renewal = 1
        THEN o.order_id END) * 1.0
        / NULLIF(COUNT(DISTINCT o.order_id), 0), 4) AS renewal_rate
FROM dw_conan_dwd.dwd_try_course_order_detail_da o
LEFT JOIN dw_conan_ads.ads_service_try_double_user_quality_detail_da q
    ON o.order_id = q.order_id
    AND q.dt = '2026-03-17'
WHERE o.dt = '2026-03-17'
  AND o.pay_dt BETWEEN '{对比开始日}' AND '{对比结束日}'
  AND o.subject_id IN ('1','2','3') -- 基础学科
GROUP BY DATE_FORMAT(o.pay_dt, 'yyyy-MM-dd')
```

---

## D-2：系统课续报漏斗

```
系统课应续报 → 续报期内联系 → 续报
```

```sql
-- 系统课续报漏斗（使用新版续报表）
SELECT
    DATE_FORMAT(end_week_dt, 'yyyy-MM') AS end_month
    ,subject_id
    ,COUNT(DISTINCT order_id) AS should_renew_cnt       -- 应续报数
    ,COUNT(DISTINCT CASE WHEN is_conan_renewed = 1
        THEN order_id END) AS renewed_cnt              -- 已续报数
    ,ROUND(COUNT(DISTINCT CASE WHEN is_conan_renewed = 1
        THEN order_id END) * 1.0
        / NULLIF(COUNT(DISTINCT order_id), 0), 4) AS renew_rate
FROM dw_conan_dwd.dwd_service_order_long_renew_long_da
WHERE dt = '2026-03-17'
  AND is_should_renew = 1
  AND end_week_dt BETWEEN '{对比开始周}' AND '{对比结束周}'
GROUP BY DATE_FORMAT(end_week_dt, 'yyyy-MM'), subject_id
```

---

## D-3：学习完课漏斗

```sql
-- 按科目、周次拆解完课率
SELECT
    lbl.lessonid
    ,lbl.cur_status_v2                                -- 在课状态
    ,ROUND(AVG(CAST(lbl.finish_ratio_7d AS DOUBLE)), 4)  AS avg_finish_7d  -- 近7日完课率
    ,ROUND(AVG(CAST(lbl.finish_ratio_30d AS DOUBLE)), 4) AS avg_finish_30d -- 近30日完课率
    ,COUNT(DISTINCT lbl.userid) AS user_cnt
FROM dw_ads.dm_eng_user_portrait_label_di lbl
WHERE lbl.dt = '2026-03-17'
  AND lbl.bunch = 'history'
  AND lbl.lessonid IN ('20','46','118') -- 基础学科系统课
  AND lbl.cur_status_v2 = '在课'
GROUP BY lbl.lessonid, lbl.cur_status_v2
```

---

## D-4：漏斗归因输出格式

```
## 漏斗环节归因

各环节转化率（本期 vs 基准期）：

| 环节 | 基准期 | 本期 | 差值 | 判断 |
|-----|-------|-----|------|-----|
| 报名→到课 | 78% | 72% | -6% | ⚠️ 异常，建议深查 |
| 到课→完课 | 85% | 84% | -1% | ✅ 正常 |
| 完课→续报 | 42% | 41% | -1% | ✅ 正常 |

**根因环节**：到课率明显下降，优先排查开课 D-N 天提醒触达率、课表异常、辅导联系频次。
```
