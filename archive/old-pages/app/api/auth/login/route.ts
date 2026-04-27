import { NextResponse } from 'next/server';
import { selectOne } from '../../supabase/lib/db-helpers';
import { verifyPassword, createToken } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 });
    }

    const user = await selectOne<{
      id: number;
      email: string;
      name: string;
      grade: string;
      password_hash: string;
      is_premium: boolean;
      free_usage_count: number;
      free_usage_limit: number;
    }>('wg8tcsgrfxr8_users', { email });

    if (!user) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    const token = createToken(user.id, user.email);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        grade: user.grade,
        is_premium: user.is_premium,
        free_usage_count: user.free_usage_count,
        free_usage_limit: user.free_usage_limit,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: '登录失败，请重试' }, { status: 500 });
  }
}
