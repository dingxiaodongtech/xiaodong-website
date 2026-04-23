import { NextResponse } from 'next/server';
import { selectOne, selectMany } from '../../supabase/lib/db-helpers';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await selectOne<{
      id: number;
      grade: string;
      name: string;
      description: string;
      cover_emoji: string;
    }>('wg8tcsgrfxr8_courses', { id: parseInt(id) });

    if (!course) {
      return NextResponse.json({ error: '课程不存在' }, { status: 404 });
    }

    const chapters = await selectMany<{
      id: number;
      name: string;
      description: string;
      sort_order: number;
      knowledge_points: string[];
    }>('wg8tcsgrfxr8_chapters', { course_id: course.id, is_active: true }, { orderBy: 'sort_order', ascending: true });

    // 为每个章节获取题目数量
    const chaptersWithQuestionCount = await Promise.all(
      chapters.map(async (ch) => {
        const questions = await selectMany<{ id: number }>('wg8tcsgrfxr8_questions', { chapter_id: ch.id, is_active: true });
        return { ...ch, question_count: questions.length };
      })
    );

    return NextResponse.json({ course, chapters: chaptersWithQuestionCount });
  } catch (error) {
    console.error('Course detail error:', error);
    return NextResponse.json({ error: '获取课程详情失败' }, { status: 500 });
  }
}
