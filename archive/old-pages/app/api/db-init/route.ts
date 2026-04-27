import { NextResponse } from 'next/server';
import { insertMany, selectMany, count } from '../supabase/lib/db-helpers';

export async function POST() {
  try {
    // 检查是否已有课程数据
    const courseCount = await count('wg8tcsgrfxr8_courses');

    if (courseCount > 0) {
      return NextResponse.json({ success: true, message: '课程数据已存在', courseCount });
    }

    // 插入课程数据
    await insertMany('wg8tcsgrfxr8_courses', [
      { grade: '一年级', name: '一年级数学基础', description: '认识数字、10以内加减法、图形认知', cover_emoji: '🌱', sort_order: 1 },
      { grade: '二年级', name: '二年级数学进阶', description: '100以内加减法、乘法口诀、长度单位', cover_emoji: '🌿', sort_order: 2 },
      { grade: '三年级', name: '三年级数学拓展', description: '多位数运算、分数初步、面积计算', cover_emoji: '🌳', sort_order: 3 },
      { grade: '四年级', name: '四年级数学深化', description: '大数认识、三角形、小数运算', cover_emoji: '📐', sort_order: 4 },
      { grade: '五年级', name: '五年级数学提升', description: '分数运算、体积计算、方程初步', cover_emoji: '📊', sort_order: 5 },
      { grade: '六年级', name: '六年级数学总结', description: '百分数、圆的面积、比和比例', cover_emoji: '🔢', sort_order: 6 },
      { grade: '初一', name: '初一数学入门', description: '有理数、一元一次方程、几何初步', cover_emoji: '📈', sort_order: 7 },
      { grade: '初二', name: '初二数学进阶', description: '实数、一次函数、勾股定理', cover_emoji: '📏', sort_order: 8 },
      { grade: '初三', name: '初三数学冲刺', description: '二次函数、相似三角形、概率统计', cover_emoji: '🎯', sort_order: 9 },
    ]);

    // 获取所有课程
    const courses = await selectMany<{ id: number; grade: string }>('wg8tcsgrfxr8_courses', undefined, { orderBy: 'sort_order', ascending: true });

    // 为每个课程插入章节
    const gradeChapters: Record<string, Array<{ name: string; description: string; knowledge_points: string[] }>> = {
      '一年级': [
        { name: '认识数字1-10', description: '认识1到10的数字，学会数数和比较大小', knowledge_points: ['数字认识', '比较大小'] },
        { name: '10以内加法', description: '学习10以内的加法运算', knowledge_points: ['加法', '10以内'] },
        { name: '10以内减法', description: '学习10以内的减法运算', knowledge_points: ['减法', '10以内'] },
      ],
      '二年级': [
        { name: '100以内加法', description: '学习100以内的加法运算，包括进位', knowledge_points: ['加法', '进位'] },
        { name: '乘法口诀', description: '背诵和理解乘法口诀表', knowledge_points: ['乘法', '口诀'] },
      ],
      '三年级': [
        { name: '多位数加减法', description: '学习三位数及以上的加减法', knowledge_points: ['加减法', '多位数'] },
        { name: '分数初步', description: '认识分数，理解分数的含义', knowledge_points: ['分数', '初步'] },
        { name: '面积计算', description: '学习长方形和正方形的面积计算', knowledge_points: ['面积', '长方形'] },
      ],
      '四年级': [
        { name: '大数认识', description: '认识万、十万、百万等大数', knowledge_points: ['大数', '数位'] },
        { name: '三角形', description: '认识三角形的分类和性质', knowledge_points: ['三角形', '几何'] },
        { name: '小数运算', description: '学习小数的加减乘除运算', knowledge_points: ['小数', '运算'] },
      ],
      '五年级': [
        { name: '长方体和正方体', description: '学习长方体和正方体的表面积和体积', knowledge_points: ['表面积', '体积'] },
        { name: '分数加减法', description: '学习同分母和异分母分数的加减法', knowledge_points: ['分数', '加减法'] },
        { name: '简易方程', description: '学习用字母表示数和解简易方程', knowledge_points: ['方程', '代数'] },
      ],
      '六年级': [
        { name: '百分数', description: '认识百分数及其应用', knowledge_points: ['百分数', '应用'] },
        { name: '圆的面积', description: '学习圆的周长和面积计算', knowledge_points: ['圆', '面积'] },
        { name: '比和比例', description: '学习比和比例的概念及应用', knowledge_points: ['比', '比例'] },
      ],
      '初一': [
        { name: '有理数', description: '认识正负数，学习有理数的运算', knowledge_points: ['有理数', '正负数'] },
        { name: '一元一次方程', description: '学习一元一次方程的解法', knowledge_points: ['方程', '一元一次'] },
      ],
      '初二': [
        { name: '实数', description: '认识无理数，学习实数的运算', knowledge_points: ['实数', '无理数'] },
        { name: '一次函数', description: '学习一次函数的图像和性质', knowledge_points: ['函数', '一次函数'] },
        { name: '勾股定理', description: '理解和应用勾股定理', knowledge_points: ['勾股定理', '直角三角形'] },
      ],
      '初三': [
        { name: '二次函数', description: '学习二次函数的图像和性质', knowledge_points: ['函数', '二次函数'] },
        { name: '相似三角形', description: '学习相似三角形的判定和性质', knowledge_points: ['相似', '三角形'] },
        { name: '概率与统计', description: '学习概率的基本概念和统计方法', knowledge_points: ['概率', '统计'] },
      ],
    };

    for (const course of courses) {
      const chapters = gradeChapters[course.grade] || [];
      if (chapters.length > 0) {
        await insertMany('wg8tcsgrfxr8_chapters', chapters.map((ch, i) => ({
          course_id: course.id,
          name: ch.name,
          description: ch.description,
          sort_order: i + 1,
          knowledge_points: ch.knowledge_points,
        })));
      }
    }

    // 为五年级"长方体和正方体"章节插入示例题目
    const fifthGradeChapters = await selectMany<{ id: number }>('wg8tcsgrfxr8_chapters', {
      name: '长方体和正方体',
    });

    if (fifthGradeChapters.length > 0) {
      const chId = fifthGradeChapters[0].id;
      await insertMany('wg8tcsgrfxr8_questions', [
        {
          chapter_id: chId,
          content: '一个长方体的长是5cm，宽是3cm，高是4cm，求它的表面积。',
          correct_answer: '94cm²',
          solution: '表面积 = 2×(长×宽 + 长×高 + 宽×高) = 2×(5×3 + 5×4 + 3×4) = 2×(15+20+12) = 2×47 = 94cm²',
          difficulty: 3,
          knowledge_tags: ['表面积', '长方体'],
          hints: ['先找出长、宽、高', '计算三组对面的面积', '把所有面积加起来再乘2'],
          common_mistakes: ['只算了一个面的面积', '混淆了体积和表面积公式', '忘记乘以2'],
          sort_order: 1,
        },
        {
          chapter_id: chId,
          content: '一个正方体的棱长是6cm，求它的表面积。',
          correct_answer: '216cm²',
          solution: '正方体表面积 = 6×棱长² = 6×6² = 6×36 = 216cm²',
          difficulty: 2,
          knowledge_tags: ['表面积', '正方体'],
          hints: ['正方体有几个面？', '每个面是什么形状？', '每个面的面积怎么算？'],
          common_mistakes: ['忘记正方体有6个面', '用了体积公式a³', '只算了一个面'],
          sort_order: 2,
        },
        {
          chapter_id: chId,
          content: '一个长方体的长是8cm，宽是5cm，高是3cm。如果要用彩纸包装（不考虑接口），至少需要多少平方厘米的彩纸？',
          correct_answer: '158cm²',
          solution: '需要的彩纸面积 = 长方体表面积 = 2×(8×5 + 8×3 + 5×3) = 2×(40+24+15) = 2×79 = 158cm²',
          difficulty: 3,
          knowledge_tags: ['表面积', '长方体', '应用题'],
          hints: ['包装纸覆盖的是哪些面？', '这其实就是求什么？', '列出表面积公式来计算'],
          common_mistakes: ['只算了部分面', '把长宽高搞混', '计算错误'],
          sort_order: 3,
        },
      ]);
    }

    return NextResponse.json({ success: true, message: '数据库种子数据初始化完成' });
  } catch (error) {
    console.error('DB seed error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
