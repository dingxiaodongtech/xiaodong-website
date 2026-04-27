-- 智数AI 教育平台数据库表结构
-- 表名前缀: wg8tcsgrfxr8_

-- 1. 用户表
CREATE TABLE IF NOT EXISTS wg8tcsgrfxr8_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  grade VARCHAR(20) NOT NULL DEFAULT '三年级',  -- 年级
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,             -- 是否付费用户
  premium_expires_at TIMESTAMP,                  -- 会员到期时间
  free_usage_count INTEGER DEFAULT 0,            -- 已使用免费次数
  free_usage_limit INTEGER DEFAULT 3,            -- 免费次数上限
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 课程表（按年级分）
CREATE TABLE IF NOT EXISTS wg8tcsgrfxr8_courses (
  id SERIAL PRIMARY KEY,
  grade VARCHAR(20) NOT NULL,          -- 年级：一年级/二年级/.../初三
  name VARCHAR(200) NOT NULL,          -- 课程名称
  description TEXT,                     -- 课程描述
  cover_emoji VARCHAR(10) DEFAULT '📐', -- 封面表情
  sort_order INTEGER DEFAULT 0,        -- 排序
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. 章节表
CREATE TABLE IF NOT EXISTS wg8tcsgrfxr8_chapters (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES wg8tcsgrfxr8_courses(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  knowledge_points TEXT[],              -- 知识点标签
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. 题目表
CREATE TABLE IF NOT EXISTS wg8tcsgrfxr8_questions (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES wg8tcsgrfxr8_chapters(id) ON DELETE CASCADE,
  content TEXT NOT NULL,                 -- 题目内容
  correct_answer TEXT NOT NULL,          -- 正确答案
  solution TEXT,                         -- 解题步骤
  difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),  -- 难度1-5
  knowledge_tags TEXT[],                 -- 知识点标签
  hints TEXT[],                          -- 提示（分步引导）
  common_mistakes TEXT[],                -- 常见错误
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. 学习记录表
CREATE TABLE IF NOT EXISTS wg8tcsgrfxr8_learning_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES wg8tcsgrfxr8_users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES wg8tcsgrfxr8_questions(id) ON DELETE CASCADE,
  user_answer TEXT,                      -- 用户的答案
  is_correct BOOLEAN,                   -- 是否正确
  ai_diagnosis TEXT,                     -- AI 诊断结果
  ai_conversation JSONB,                 -- AI 对话记录
  time_spent_seconds INTEGER,            -- 用时（秒）
  attempt_number INTEGER DEFAULT 1,      -- 第几次尝试
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_users_email ON wg8tcsgrfxr8_users(email);
CREATE INDEX IF NOT EXISTS idx_courses_grade ON wg8tcsgrfxr8_courses(grade);
CREATE INDEX IF NOT EXISTS idx_chapters_course ON wg8tcsgrfxr8_chapters(course_id);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON wg8tcsgrfxr8_questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_user ON wg8tcsgrfxr8_learning_records(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_question ON wg8tcsgrfxr8_learning_records(question_id);
