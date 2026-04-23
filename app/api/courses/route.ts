import { NextResponse } from 'next/server';
import { selectMany } from '../supabase/lib/db-helpers';

export async function GET() {
  try {
    const courses = await selectMany<{
      id: number;
      grade: string;
      name: string;
      description: string;
      cover_emoji: string;
      sort_order: number;
    }>('wg8tcsgrfxr8_courses', { is_active: true }, { orderBy: 'sort_order', ascending: true });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Courses error:', error);
    return NextResponse.json({ error: '获取课程失败' }, { status: 500 });
  }
}
