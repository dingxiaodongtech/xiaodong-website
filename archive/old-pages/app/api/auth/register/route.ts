import { NextResponse } from 'next/server';
import { insertOne, selectOne } from '../../supabase/lib/db-helpers';
import { hashPassword, createToken } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name, grade } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: '请填写所有必填项' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少6位' }, { status: 400 });
    }

    // 检查邮箱是否已注册
    const existing = await selectOne('wg8tcsgrfxr8_users', { email });
    if (existing) {
      return NextResponse.json({ error: '该邮箱已注册' }, { status: 400 });
    }

    // 创建用户
    const user = await insertOne<{
      id: number;
      email: string;
      name: string;
      grade: string;
    }>('wg8tcsgrfxr8_users', {
      email,
      password_hash: hashPassword(password),
      name,
      grade: grade || '三年级',
    });

    const token = createToken(user.id, user.email);

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, grade: user.grade },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: '注册失败，请重试' }, { status: 500 });
  }
}
