import { NextResponse } from 'next/server';
import { selectMany, selectOne } from '../../supabase/lib/db-helpers';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;

    const chapter = await selectOne<{
      id: number;
      name: string;
      description: string;
      course_id: number;
    }>('wg8tcsgrfxr8_chapters', { id: parseInt(chapterId) });

    if (!chapter) {
      return NextResponse.json({ error: '章节不存在' }, { status: 404 });
    }

    const course = await selectOne<{
      id: number;
      grade: string;
      name: string;
    }>('wg8tcsgrfxr8_courses', { id: chapter.course_id });

    const questions = await selectMany<{
      id: number;
      content: string;
      correct_answer: string;
      solution: string;
      difficulty: number;
      knowledge_tags: string[];
      hints: string[];
      common_mistakes: string[];
    }>('wg8tcsgrfxr8_questions', { chapter_id: chapter.id, is_active: true }, { orderBy: 'sort_order', ascending: true });

    return NextResponse.json({ chapter, course, questions });
  } catch (error) {
    console.error('Learn API error:', error);
    return NextResponse.json({ error: '获取学习数据失败' }, { status: 500 });
  }
}
