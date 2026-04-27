'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  grade: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50/50 pt-20 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Simple header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-gray-900">晓冬 · AI 学习</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {user.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {user.grade}
                </span>
                <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                  🆓 免费用户
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">已学习</div>
            <div className="text-2xl font-bold text-gray-900">
              0 <span className="text-sm font-normal text-gray-400">道题</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">继续加油！</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">正确率</div>
            <div className="text-2xl font-bold text-gray-900">--</div>
            <div className="text-xs text-gray-400 mt-2">完成题目后显示</div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/courses"
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-bold text-lg">继续学习</h3>
            <p className="text-blue-100 text-sm mt-1">选择章节开始 AI 诊断学习（免费）</p>
          </Link>

          <Link
            href="/"
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">🏠</div>
            <h3 className="font-bold text-lg text-gray-900">返回首页</h3>
            <p className="text-gray-500 text-sm mt-1">查看完整介绍和 AI 诊断 Demo</p>
          </Link>
        </div>

        {/* Free notice */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="font-bold text-gray-900 mb-1">所有功能完全免费！</h3>
          <p className="text-sm text-gray-500">无限次 AI 诊断学习，无需付费，随时使用</p>
        </div>
      </div>
    </div>
  );
}
