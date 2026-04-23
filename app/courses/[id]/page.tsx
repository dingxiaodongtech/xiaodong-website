'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '../../components/home/Navbar';

interface Course {
  id: number;
  grade: string;
  name: string;
  description: string;
  cover_emoji: string;
}

interface Chapter {
  id: number;
  name: string;
  description: string;
  knowledge_points: string[];
  question_count: number;
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data.course);
        setChapters(data.chapters || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50/50 pt-20 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">加载中...</div>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50/50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">😥</div>
            <div className="text-gray-500">课程不存在</div>
            <Link href="/courses" className="text-blue-500 hover:text-blue-600 mt-2 inline-block">
              返回课程列表
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/courses" className="hover:text-blue-600 transition-colors">课程中心</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{course.name}</span>
          </div>

          {/* Course Header */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
            <div className="flex items-start gap-5">
              <div className="text-5xl">{course.cover_emoji}</div>
              <div>
                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                  {course.grade}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">{course.name}</h1>
                <p className="text-gray-500 mt-1">{course.description}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>{chapters.length} 个章节</span>
                  <span>{chapters.reduce((sum, ch) => sum + ch.question_count, 0)} 道题目</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters */}
          <h2 className="text-lg font-bold text-gray-900 mb-4">章节列表</h2>
          <div className="space-y-3">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-sm font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{chapter.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{chapter.description}</p>
                      {chapter.knowledge_points && chapter.knowledge_points.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {chapter.knowledge_points.map((tag) => (
                            <span key={tag} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{chapter.question_count} 题</span>
                    {chapter.question_count > 0 ? (
                      <Link
                        href={`/learn/${chapter.id}`}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-md shadow-blue-500/20"
                      >
                        开始学习
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">即将开放</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {chapters.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📚</div>
              <p>课程内容正在准备中，敬请期待</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
