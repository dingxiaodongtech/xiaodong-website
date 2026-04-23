-- 智数AI 教育平台数据库表结构
-- 表名前缀: wg8tcsgrfxr8_

-- 1. 用户表
CREATE TABLE IF NOT EXISTS wg8tcsgrfxr8_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  grade VARCHAR(20) NOT NULL DEFAULT '三年级',
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP,
  free_usage_count INTEGER DEFAULT 0,
  free_usage_limit INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 课程表（按年级分）
CREATE TABLE IF NOT EXISTS wg8tcsgrfxr8_courses (
  id SERIAL PRIMARY KEY,
  grade VARCHAR(20) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  cover_emoji VARCHAR(10) DEFAULT '📐',
  sort_order INTEGER DEFAULT 0,
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
  knowledge_points TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. 题目表
CREATE TABLE IF NOT EXISTS wg8tcsgrfxr8_questions (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES wg8tcsgrfxr8_chapters(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  solution TEXT,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
  knowledge_tags TEXT[],
  hints TEXT[],
  common_mistakes TEXT[],
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. 学习记录表
CREATE TABLE IF NOT EXISTS wg8tcsgrfxr8_learning_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES wg8tcsgrfxr8_users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES wg8tcsgrfxr8_questions(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN,
  ai_diagnosis TEXT,
  ai_conversation JSONB,
  time_spent_seconds INTEGER,
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_users_email ON wg8tcsgrfxr8_users(email);
CREATE INDEX IF NOT EXISTS idx_courses_grade ON wg8tcsgrfxr8_courses(grade);
CREATE INDEX IF NOT EXISTS idx_chapters_course ON wg8tcsgrfxr8_chapters(course_id);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON wg8tcsgrfxr8_questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_user ON wg8tcsgrfxr8_learning_records(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_question ON wg8tcsgrfxr8_learning_records(question_id);
