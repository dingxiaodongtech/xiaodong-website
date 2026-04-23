'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/home/Navbar';

interface Course {
  id: number;
  grade: string;
  name: string;
  description: string;
  cover_emoji: string;
}

const gradeColors: Record<string, string> = {
  '一年级': 'from-green-400 to-emerald-500',
  '二年级': 'from-emerald-400 to-teal-500',
  '三年级': 'from-teal-400 to-cyan-500',
  '四年级': 'from-cyan-400 to-blue-500',
  '五年级': 'from-blue-400 to-indigo-500',
  '六年级': 'from-indigo-400 to-violet-500',
  '初一': 'from-violet-400 to-purple-500',
  '初二': 'from-purple-400 to-fuchsia-500',
  '初三': 'from-fuchsia-400 to-pink-500',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'primary' | 'junior'>('all');

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    if (filter === 'primary') return !c.grade.startsWith('初');
    if (filter === 'junior') return c.grade.startsWith('初');
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">课程中心</h1>
            <p className="text-gray-500 mt-2">选择年级开始你的 AI 自适应学习之旅</p>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-8">
            {[
              { key: 'all' as const, label: '全部' },
              { key: 'primary' as const, label: '小学' },
              { key: 'junior' as const, label: '初中' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f.key
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all hover:scale-[1.02]"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${gradeColors[course.grade] || 'from-blue-400 to-purple-500'} rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4`}>
                    {course.cover_emoji}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {course.grade}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500">{course.description}</p>
                  <div className="mt-4 flex items-center text-sm text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    开始学习
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
