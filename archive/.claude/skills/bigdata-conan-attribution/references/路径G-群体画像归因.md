# 路径 G：群体画像归因

> 适用：筛选出特定用户群体后，在多个维度做分层分析，揭示人群内部结构、学习状态与运营机会

---

## G-0：群体定义方式

执行画像分析前，必须先明确目标人群的来源和定义方式：

| 来源类型 | 示例 | 处理方式 |
|---------|------|---------|
| **订单/报名筛选** | 某周体验课报名用户 | 从订单表过滤，取 user_id |
| **行为筛选** | 完课率 ≥ 70% 但未续报的用户 | 从行为质量表过滤 |
| **标签筛选** | 断课用户 / SLOGAN 名单 | 从画像标签表过滤 |
| **外部名单** | 已有 user_id 列表 | 直接用 IN 列表或临时表 |

所有 SQL 模板均使用 `target_user` CTE 作为人群入口，替换其中的筛选条件即可。

---

## G-1：基础规模统计（必须先执行）

```sql
-- 统计目标人群基础规模，作为画像分析的分母
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}                  -- 替换为实际表名
    WHERE dt = '2026-03-17'
      AND {筛选条件}             -- 替换为实际筛选条件
)
SELECT
    COUNT(DISTINCT user_id) AS total_user_cnt
FROM target_user
```

**输出说明**：此步必须先获得总人数，后续各维度的占比分析以此为分母。

---

## G-2：课程状态分层（核心画像维度）

### G-2-1：系统课 × 体验课在课状态交叉分层

```sql
-- 按系统课 + 体验课在课状态做二维交叉分层
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
SELECT
    CASE
        WHEN profile.is_sys_cycle = '1' THEN '系统课在课'
        ELSE '系统课不在课'
    END AS sys_course_status      -- 是否系统课在课
    ,CASE
        WHEN profile.is_exp_cycle = '1' THEN '体验课在课'
        ELSE '体验课不在课'
    END AS exp_course_status      -- 是否体验课在课
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
    ,ROUND(COUNT(DISTINCT tu.user_id) * 1.0
        / SUM(COUNT(DISTINCT tu.user_id)) OVER (), 4) AS pct
FROM target_user tu
LEFT JOIN (
    SELECT user_id
        ,is_sys_cycle    -- '1'=系统课在课，'0'=不在课
        ,is_exp_cycle    -- '1'=体验课在课，'0'=不在课
    FROM dw_ads.ads_eng_user_profile_basic_da
    WHERE dt = '2026-03-17'
) profile
ON tu.user_id = profile.user_id
GROUP BY sys_course_status, exp_course_status
```

### G-2-2：系统课在课科目分布

```sql
-- 系统课在课用户的当前在课科目分布
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
SELECT
    profile.sys_service_subject    -- 系统课在课科目（可能多科，逗号分隔）
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
    ,ROUND(COUNT(DISTINCT tu.user_id) * 1.0
        / SUM(COUNT(DISTINCT tu.user_id)) OVER (), 4) AS pct
FROM target_user tu
INNER JOIN (
    SELECT user_id
        ,sys_service_subject
    FROM dw_ads.ads_eng_user_profile_basic_da
    WHERE dt = '2026-03-17'
      AND is_sys_cycle = '1'    -- 仅系统课在课用户
) profile
ON tu.user_id = profile.user_id
GROUP BY profile.sys_service_subject
```

### G-2-3：体验课在课科目分布

```sql
-- 体验课在课用户的当前报读科目分布
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
SELECT
    lbl.lessonid                   -- 体验课 lesson_id（126/70/122等）
    ,lbl.cur_status_v2             -- 在课状态（数字）：0=在课/1=未开课/2=断课/3=停课
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
FROM target_user tu
INNER JOIN (
    SELECT userid AS user_id
        ,lessonid
        ,cur_status_v2
    FROM dw_ads.ads_eng_user_portrait_label_curr_di
    WHERE dt = '2026-03-17'
      AND bunch = 'history'
      AND lessonid IN ('126','70','122','202','264','280','570','800','830','870') -- 各科体验课
      AND cur_status_v2 = '0'    -- 当前在课
) lbl
ON tu.user_id = lbl.user_id
GROUP BY lbl.lessonid, lbl.cur_status_v2
```

### G-2-4：用户课程组合类型分层

```sql
-- 按"系统课在课数 × 体验课在课数"组合做分层
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
,user_course_combo AS (
    SELECT tu.user_id
        ,COALESCE(profile.sys_subject_cnt, 0) AS sys_subject_cnt   -- 系统课在课科目数
        ,COALESCE(profile.exp_subject_cnt, 0) AS exp_subject_cnt   -- 体验课在课科目数
    FROM target_user tu
    LEFT JOIN (
        SELECT user_id
            ,CAST(sys_subject_cnt AS INT) AS sys_subject_cnt
            ,CAST(exp_subject_cnt AS INT) AS exp_subject_cnt
        FROM dw_ads.ads_eng_user_profile_basic_da
        WHERE dt = '2026-03-17'
    ) profile
    ON tu.user_id = profile.user_id
)
SELECT
    CASE
        WHEN sys_subject_cnt = 0 AND exp_subject_cnt = 0 THEN '无在课'
        WHEN sys_subject_cnt > 0 AND exp_subject_cnt = 0 THEN '纯系统课在课'
        WHEN sys_subject_cnt = 0 AND exp_subject_cnt > 0 THEN '纯体验课在课'
        WHEN sys_subject_cnt > 0 AND exp_subject_cnt > 0 THEN '系统课+体验课同时在课'
    END AS course_combo_type
    ,COUNT(DISTINCT user_id) AS user_cnt
    ,ROUND(COUNT(DISTINCT user_id) * 1.0
        / SUM(COUNT(DISTINCT user_id)) OVER (), 4) AS pct
FROM user_course_combo
GROUP BY course_combo_type
```

---

## G-3：学习行为分层

### G-3-1：完课率区间分布

```sql
-- 按完课率区间分层，了解用户学习积极性分布
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
SELECT
    CASE
        WHEN CAST(lbl.finish_ratio_30d AS DOUBLE) >= 0.8 THEN '高完课（≥80%）'
        WHEN CAST(lbl.finish_ratio_30d AS DOUBLE) >= 0.5 THEN '中完课（50%-80%）'
        WHEN CAST(lbl.finish_ratio_30d AS DOUBLE) > 0    THEN '低完课（<50%）'
        ELSE '近30天无完课数据'
    END AS finish_rate_tier            -- 完课率区间
    ,lbl.lessonid
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
    ,ROUND(COUNT(DISTINCT tu.user_id) * 1.0
        / SUM(COUNT(DISTINCT tu.user_id)) OVER (PARTITION BY lbl.lessonid), 4) AS pct
FROM target_user tu
LEFT JOIN (
    SELECT userid AS user_id
        ,lessonid
        ,finish_ratio_30d    -- 近30日完课率
        ,finish_ratio_7d     -- 近7日完课率
    FROM dw_ads.dm_eng_user_portrait_label_di
    WHERE dt = '2026-03-17'
      AND bunch = 'history'
      AND lessonid IN ({目标lessonid列表})    -- 替换为目标科目
) lbl
ON tu.user_id = lbl.user_id
GROUP BY finish_rate_tier, lbl.lessonid
```

### G-3-2：近期活跃度分层（7日 vs 30日对比）

```sql
-- 近7日完课率 vs 近30日完课率，判断用户活跃趋势（变好/变差/稳定）
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
SELECT
    CASE
        WHEN CAST(lbl.finish_ratio_7d AS DOUBLE) - CAST(lbl.finish_ratio_30d AS DOUBLE) > 0.15
            THEN '近期变好（7日高于30日15%+）'
        WHEN CAST(lbl.finish_ratio_30d AS DOUBLE) - CAST(lbl.finish_ratio_7d AS DOUBLE) > 0.15
            THEN '近期变差（7日低于30日15%+）'
        ELSE '稳定'
    END AS activity_trend              -- 近期活跃趋势
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
    ,ROUND(AVG(CAST(lbl.finish_ratio_7d AS DOUBLE)), 4) AS avg_finish_7d
    ,ROUND(AVG(CAST(lbl.finish_ratio_30d AS DOUBLE)), 4) AS avg_finish_30d
FROM target_user tu
LEFT JOIN (
    SELECT userid AS user_id
        ,finish_ratio_7d
        ,finish_ratio_30d
    FROM dw_ads.dm_eng_user_portrait_label_di
    WHERE dt = '2026-03-17'
      AND bunch = 'history'
      AND lessonid IN ({目标lessonid列表})
) lbl
ON tu.user_id = lbl.user_id
GROUP BY activity_trend
```

---

## G-4：用户基础属性分层

### G-4-1：城市层级分层

```sql
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
SELECT
    COALESCE(u.city_type, '未知') AS city_type     -- 城市类型：一线/新一线/二线/三线/四线
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
    ,ROUND(COUNT(DISTINCT tu.user_id) * 1.0
        / SUM(COUNT(DISTINCT tu.user_id)) OVER (), 4) AS pct
FROM target_user tu
LEFT JOIN (
    SELECT user_id
        ,city_type
        ,city
    FROM dw_dim.dim_eng_user_extend_da
    WHERE dt = '2026-03-17'
) u
ON tu.user_id = u.user_id
GROUP BY u.city_type
```

### G-4-2：付费历史 × 首次付费时长分层

```sql
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
SELECT
    CASE
        WHEN u.is_paid_user != '1' OR u.fst_paid_dt IS NULL THEN '0元/未付费'
        WHEN DATEDIFF('2026-03-17', u.fst_paid_dt) <= 30    THEN '新付费用户（首付≤30天）'
        WHEN DATEDIFF('2026-03-17', u.fst_paid_dt) <= 90    THEN '次新用户（31-90天）'
        WHEN DATEDIFF('2026-03-17', u.fst_paid_dt) <= 365   THEN '成熟用户（91-365天）'
        ELSE '老用户（付费>1年）'
    END AS paid_tier                   -- 付费时长分层
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
    ,ROUND(COUNT(DISTINCT tu.user_id) * 1.0
        / SUM(COUNT(DISTINCT tu.user_id)) OVER (), 4) AS pct
    ,ROUND(AVG(DATEDIFF('2026-03-17', u.fst_paid_dt)), 1) AS avg_days_since_fst_pay
FROM target_user tu
LEFT JOIN (
    SELECT user_id
        ,is_paid_user
        ,fst_paid_dt
        ,lst_paid_dt
    FROM dw_dim.dim_eng_user_extend_da
    WHERE dt = '2026-03-17'
) u
ON tu.user_id = u.user_id
GROUP BY paid_tier
```

---

## G-5：科目/购课结构分层

### G-5-1：历史购课科目数分层（单科 vs 多科）

```sql
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
SELECT
    CASE
        WHEN profile.total_buy_subject_cnt IS NULL OR CAST(profile.total_buy_subject_cnt AS INT) = 0
            THEN '未购课'
        WHEN CAST(profile.total_buy_subject_cnt AS INT) = 1 THEN '单科购课'
        WHEN CAST(profile.total_buy_subject_cnt AS INT) = 2 THEN '双科购课'
        ELSE '三科及以上'
    END AS buy_subject_tier            -- 购课科目数分层
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
    ,ROUND(COUNT(DISTINCT tu.user_id) * 1.0
        / SUM(COUNT(DISTINCT tu.user_id)) OVER (), 4) AS pct
FROM target_user tu
LEFT JOIN (
    SELECT user_id
        ,total_buy_subject_cnt    -- 历史购买过的科目总数
    FROM dw_ads.ads_eng_user_profile_basic_da
    WHERE dt = '2026-03-17'
) profile
ON tu.user_id = profile.user_id
GROUP BY buy_subject_tier
```

### G-5-2：历史续报次数分层

```sql
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
,user_renew_cnt AS (
    SELECT user_id
        ,COUNT(DISTINCT order_id) AS renew_cnt    -- 历史续报次数
    FROM dw_conan_dwd.dwd_service_order_long_renew_long_da
    WHERE dt = '2026-03-17'
      AND is_conan_renewed = 1                    -- 已完成续报
    GROUP BY user_id
)
SELECT
    CASE
        WHEN rc.renew_cnt IS NULL OR rc.renew_cnt = 0 THEN '从未续报'
        WHEN rc.renew_cnt = 1 THEN '续报1次'
        WHEN rc.renew_cnt BETWEEN 2 AND 3         THEN '续报2-3次'
        ELSE '续报4次及以上（高忠诚）'
    END AS renew_tier
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
    ,ROUND(COUNT(DISTINCT tu.user_id) * 1.0
        / SUM(COUNT(DISTINCT tu.user_id)) OVER (), 4) AS pct
FROM target_user tu
LEFT JOIN user_renew_cnt rc
ON tu.user_id = rc.user_id
GROUP BY renew_tier
```

---

## G-6：续报/扩科意向分层

```sql
-- 判断人群中应续报未续报 vs 已续报 vs 不在应续报范围 的分布
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
,user_renew_status AS (
    SELECT user_id
        ,MAX(CASE WHEN is_should_renew = 1 AND is_conan_renewed = 1 THEN 1 ELSE 0 END) AS has_renewed
        ,MAX(CASE WHEN is_should_renew = 1 AND is_conan_renewed = 0 THEN 1 ELSE 0 END) AS should_renew_not_yet
        ,MIN(CASE WHEN is_should_renew = 1 AND is_conan_renewed = 0
            THEN DATEDIFF(end_week_dt, '2026-03-17') END) AS days_to_end   -- 最近结课距今天数
    FROM dw_conan_dwd.dwd_service_order_long_renew_long_da
    WHERE dt = '2026-03-17'
    GROUP BY user_id
)
SELECT
    CASE
        WHEN rs.user_id IS NULL                                  THEN '不在续报追踪范围'
        WHEN rs.has_renewed = 1 AND rs.should_renew_not_yet = 0 THEN '已全部续报'
        WHEN rs.should_renew_not_yet = 1 AND rs.days_to_end <= 7  THEN '应续报未续报（7天内结课，紧急）'
        WHEN rs.should_renew_not_yet = 1 AND rs.days_to_end <= 21 THEN '应续报未续报（7-21天结课）'
        WHEN rs.should_renew_not_yet = 1                         THEN '应续报未续报（21天以上）'
        ELSE '其他'
    END AS renew_intent_tier           -- 续报意向分层
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
    ,ROUND(COUNT(DISTINCT tu.user_id) * 1.0
        / SUM(COUNT(DISTINCT tu.user_id)) OVER (), 4) AS pct
FROM target_user tu
LEFT JOIN user_renew_status rs
ON tu.user_id = rs.user_id
GROUP BY renew_intent_tier
```

---

## G-7：关键交叉分析（可选，按需选用）

### G-7-1：城市 × 完课率交叉（揭示地域与学习质量关系）

```sql
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
SELECT
    COALESCE(u.city_type, '未知') AS city_type
    ,CASE
        WHEN CAST(lbl.finish_ratio_30d AS DOUBLE) >= 0.8 THEN '高完课（≥80%）'
        WHEN CAST(lbl.finish_ratio_30d AS DOUBLE) >= 0.5 THEN '中完课（50%-80%）'
        WHEN CAST(lbl.finish_ratio_30d AS DOUBLE) > 0    THEN '低完课（<50%）'
        ELSE '无完课数据'
    END AS finish_rate_tier
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
    ,ROUND(AVG(CAST(lbl.finish_ratio_30d AS DOUBLE)), 4) AS avg_finish_30d
FROM target_user tu
LEFT JOIN (
    SELECT user_id, city_type
    FROM dw_dim.dim_eng_user_extend_da
    WHERE dt = '2026-03-17'
) u ON tu.user_id = u.user_id
LEFT JOIN (
    SELECT userid AS user_id, finish_ratio_30d
    FROM dw_ads.dm_eng_user_portrait_label_di
    WHERE dt = '2026-03-17'
      AND bunch = 'history'
      AND lessonid IN ({目标lessonid列表})
) lbl ON tu.user_id = lbl.user_id
GROUP BY u.city_type, finish_rate_tier
```

### G-7-2：系统课在课状态 × 续报意向交叉（核心运营洞察）

```sql
-- 在课状态 × 续报状态交叉，定位运营优先级
WITH target_user AS (
    SELECT DISTINCT user_id
    FROM {源表}
    WHERE dt = '2026-03-17'
      AND {筛选条件}
)
SELECT
    CASE
        WHEN profile.is_sys_cycle = '1' THEN '系统课在课'
        ELSE '系统课不在课'
    END AS sys_status
    ,CASE
        WHEN renew.should_renew_not_yet = 1 AND renew.days_to_end <= 7  THEN '续报紧急（7天内）'
        WHEN renew.should_renew_not_yet = 1 AND renew.days_to_end <= 21 THEN '续报待跟进（7-21天）'
        WHEN renew.has_renewed = 1                                       THEN '已续报'
        ELSE '不在追踪范围'
    END AS renew_urgency
    ,COUNT(DISTINCT tu.user_id) AS user_cnt
FROM target_user tu
LEFT JOIN (
    SELECT user_id, is_sys_cycle
    FROM dw_ads.ads_eng_user_profile_basic_da
    WHERE dt = '2026-03-17'
) profile ON tu.user_id = profile.user_id
LEFT JOIN (
    SELECT user_id
        ,MAX(CASE WHEN is_should_renew = 1 AND is_conan_renewed = 1 THEN 1 ELSE 0 END) AS has_renewed
        ,MAX(CASE WHEN is_should_renew = 1 AND is_conan_renewed = 0 THEN 1 ELSE 0 END) AS should_renew_not_yet
        ,MIN(CASE WHEN is_should_renew = 1 AND is_conan_renewed = 0
            THEN DATEDIFF(end_week_dt, '2026-03-17') END) AS days_to_end
    FROM dw_conan_dwd.dwd_service_order_long_renew_long_da
    WHERE dt = '2026-03-17'
    GROUP BY user_id
) renew ON tu.user_id = renew.user_id
GROUP BY sys_status, renew_urgency
```

---

## G-8：群体画像归因输出格式

执行完各分层 SQL 后，必须按以下格式汇总输出：

```
## 群体画像报告

### 一、人群定义与规模
- 人群来源：{来源描述，如"2026W11 英语体验课新增报名用户"}
- 筛选口径：{筛选条件描述}
- 总人数：{N} 人

---

### 二、课程状态画像

#### 系统课 × 体验课在课状态
| 系统课状态 | 体验课状态 | 用户数 | 占比 |
|-----------|-----------|-------|------|
| 系统课在课 | 体验课在课 | xxx | xx% |
| 系统课在课 | 体验课不在课 | xxx | xx% |
| 系统课不在课 | 体验课在课 | xxx | xx% |
| 系统课不在课 | 体验课不在课 | xxx | xx% |

**关键洞察**：{如"60% 用户系统课在课，其中 20% 同时报读体验课，存在扩科机会"}

---

### 三、学习行为画像

#### 近30日完课率分布
| 完课率区间 | 用户数 | 占比 |
|-----------|-------|------|
| 高完课（≥80%） | xxx | xx% |
| 中完课（50%-80%） | xxx | xx% |
| 低完课（<50%） | xxx | xx% |

**关键洞察**：{如"近40%用户属于低完课，重点关注到课率提升"}

---

### 四、用户基础属性画像

#### 城市层级分布
| 城市层级 | 用户数 | 占比 |
|---------|-------|------|
| 一线 | xxx | xx% |
| 新一线 | xxx | xx% |
| 二线 | xxx | xx% |
| 三四线 | xxx | xx% |

#### 付费时长分层
| 付费时长 | 用户数 | 占比 |
|---------|-------|------|
| 新付费用户（≤30天） | xxx | xx% |
| 次新用户（31-90天） | xxx | xx% |
| 成熟用户（91-365天） | xxx | xx% |
| 老用户（>1年） | xxx | xx% |

---

### 五、购课/续报结构画像

| 维度 | 分层 | 用户数 | 占比 |
|-----|------|-------|------|
| 购课科目数 | 单科 | xxx | xx% |
| | 多科 | xxx | xx% |
| 续报次数 | 从未续报 | xxx | xx% |
| | 续报1次 | xxx | xx% |
| | 续报多次 | xxx | xx% |

---

### 六、续报意向分层

| 续报意向 | 用户数 | 占比 | 运营优先级 |
|---------|-------|------|----------|
| 应续报未续报（7天内结课） | xxx | xx% | 🔴 最高 |
| 应续报未续报（7-21天） | xxx | xx% | 🟡 中 |
| 已全部续报 | xxx | xx% | ✅ 维护 |
| 不在追踪范围 | xxx | xx% | - |

---

### 七、运营策略建议

| 人群分层 | 规模 | 核心特征 | 建议动作 |
|---------|------|---------|---------|
| 高潜续报人群 | xxx人 | 在课+高完课+7天内结课 | 立即 SLOGAN 外呼 |
| 扩科机会人群 | xxx人 | 系统课在课+单科+活跃 | 推荐体验新科目 |
| 流失预警人群 | xxx人 | 在课+低完课+近期变差 | 辅导老师主动介入 |
| 召回候选人群 | xxx人 | 不在课+历史高完课 | 定向召回活动 |
```
