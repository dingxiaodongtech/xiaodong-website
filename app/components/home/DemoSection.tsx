'use client';

import { useState, useEffect } from 'react';

const demoConversation = [
  { role: 'system', text: '📋 题目：一个长方体的长是5cm，宽是3cm，高是4cm，求它的表面积。' },
  { role: 'student', text: '老师，我算出来表面积是 60cm²' },
  { role: 'ai', text: '🔍 让我看看你的计算过程...' },
  { role: 'ai-diagnosis', text: '⚠️ 诊断结果：你计算的是体积（5×3×4=60），不是表面积哦！表面积和体积的公式不同。' },
  { role: 'ai-step', text: '📝 第1步：表面积是所有面的面积之和。长方体有6个面，想想分别是哪些面？' },
  { role: 'student', text: '上下两个面、前后两个面、左右两个面！' },
  { role: 'ai', text: '✅ 完全正确！那每组面的面积分别是多少呢？' },
  { role: 'ai-step', text: '📝 第2步：上下面 = 长×宽 = 5×3 = 15cm²，前后面 = 长×高 = 5×4 = ?，左右面 = 宽×高 = 3×4 = ?' },
  { role: 'student', text: '前后面 = 20cm²，左右面 = 12cm²' },
  { role: 'ai', text: '🎉 太棒了！最后一步：每种面都有2个，所以表面积 = 2×(15+20+12) = 2×47 = 94cm²！你学会了！' },
];

export default function DemoSection() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    if (visibleCount >= demoConversation.length) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, 1500);
    return () => clearTimeout(timer);
  }, [visibleCount, isPlaying]);

  const startDemo = () => {
    setVisibleCount(0);
    setIsPlaying(true);
    setTimeout(() => setVisibleCount(1), 300);
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-500 text-white ml-auto rounded-br-md';
      case 'ai':
        return 'bg-gray-100 text-gray-800 rounded-bl-md';
      case 'ai-diagnosis':
        return 'bg-orange-50 text-gray-800 border border-orange-200 rounded-bl-md';
      case 'ai-step':
        return 'bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 border border-blue-100 rounded-bl-md';
      case 'system':
        return 'bg-yellow-50 text-gray-800 border border-yellow-200 mx-auto text-center';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800" id="demo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-900/50 border border-blue-700/50 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-blue-300 font-medium">实时演示</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            看 AI 如何<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">诊断错因</span>并引导学习
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            点击播放，观看 AI 如何像优秀老师一样，一步步引导学生理解表面积的概念
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          {/* Phone Frame */}
          <div className="bg-gray-800 rounded-[2.5rem] p-3 shadow-2xl">
            <div className="bg-white rounded-[2rem] overflow-hidden">
              {/* Phone Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">智数AI 助手</div>
                    <div className="text-blue-100 text-xs">五年级 · 表面积</div>
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="h-[420px] overflow-y-auto p-4 space-y-3 bg-gray-50">
                {demoConversation.slice(0, visibleCount).map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'student' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
                  >
                    <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] animate-[fadeIn_0.3s_ease-in] ${getRoleStyle(msg.role)}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isPlaying && visibleCount < demoConversation.length && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Button */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={startDemo}
                  disabled={isPlaying}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      AI 诊断进行中...
                    </>
                  ) : visibleCount > 0 ? (
                    '🔄 重新播放'
                  ) : (
                    '▶️ 开始体验 AI 诊断'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
