'use client';

import { useEffect, useRef, useState } from 'react';

const demoSteps = [
  { step: 1, title: '选择题目', desc: '学生选择想要练习的数学题目', status: 'done' },
  { step: 2, title: 'AI 诊断', desc: 'AI引擎实时分析学生答题过程', status: 'done' },
  { step: 3, title: '错因定位', desc: '精准识别知识薄弱点和错误类型', status: 'active' },
  { step: 4, title: '分步讲解', desc: '根据诊断结果提供个性化教学', status: 'pending' },
  { step: 5, title: '验证巩固', desc: '通过验证题确保知识掌握', status: 'pending' },
];

const chatMessages = [
  { role: 'ai', text: '🐬 你好！我是AI学习助手。请看这道题：一个长方体鱼缸，底面长30cm、宽20cm，将假山完全浸没后水面上升了2cm。假山体积是多少？', delay: 0 },
  { role: 'student', text: '600', delay: 1 },
  { role: 'ai', text: '💡 600是底面积（30×20），体积还要乘高度2cm哦！', delay: 2, type: 'hint' },
  { role: 'ai', text: '让我们一步步来 —— 升高的水是什么形状？', delay: 3 },
  { role: 'student', text: '长方体！', delay: 4 },
  { role: 'ai', text: '🎉 对！升高的水是一个长方体。所以体积 = 30 × 20 × 2 = 1200 cm³', delay: 5, type: 'success' },
];

export default function DemoShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev >= chatMessages.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [visible]);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 mb-4">
            <span className="text-sm font-medium text-violet-700">产品演示</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
            AI 诊断课堂体验
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            看看我们的 AI 如何像一位经验丰富的老师，实时诊断并指导学生学习
          </p>
        </div>

        <div
          className={`max-w-5xl mx-auto transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Steps Timeline */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M2 12h20" /></svg>
                </span>
                学习流程
              </h3>
              <div className="space-y-1">
                {demoSteps.map((s, i) => (
                  <div key={s.step} className="flex items-start gap-3 py-2.5">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          s.status === 'done'
                            ? 'bg-green-50 border-green-500 text-green-600'
                            : s.status === 'active'
                            ? 'bg-violet-50 border-violet-500 text-violet-600 animate-pulse'
                            : 'bg-gray-50 border-gray-200 text-gray-400'
                        }`}
                      >
                        {s.status === 'done' ? '✓' : s.step}
                      </div>
                      {i < demoSteps.length - 1 && (
                        <div className={`w-0.5 h-6 mt-1 ${s.status === 'done' ? 'bg-green-300' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${s.status === 'active' ? 'text-violet-700' : s.status === 'done' ? 'text-gray-900' : 'text-gray-400'}`}>
                        {s.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Chat Demo */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Chat header */}
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm">🐬</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">AI 诊断助手</div>
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      在线 · 五年级数学
                    </div>
                  </div>
                </div>
                <span className="text-xs bg-violet-50 text-violet-600 px-2 py-1 rounded-full font-semibold">自适应</span>
              </div>

              {/* Chat messages */}
              <div className="p-4 space-y-3 min-h-[320px] bg-[#f7f7f7]">
                {chatMessages.slice(0, visibleMessages).map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 animate-[slideUp_0.3s_ease_forwards] ${
                      msg.role === 'student' ? 'justify-end' : ''
                    }`}
                  >
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                        🐬
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed ${
                        msg.role === 'student'
                          ? 'bg-[#95ec69] text-black'
                          : msg.type === 'hint'
                          ? 'bg-[#fffbeb] text-gray-800 border border-amber-100'
                          : msg.type === 'success'
                          ? 'bg-[#f0fdf4] text-gray-800 border border-green-100'
                          : 'bg-white text-gray-800 shadow-sm'
                      }`}
                    >
                      <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                    </div>
                    {msg.role === 'student' && (
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                        👦
                      </div>
                    )}
                  </div>
                ))}
                {visibleMessages < chatMessages.length && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                      🐬
                    </div>
                    <div className="bg-white px-4 py-2.5 rounded-lg shadow-sm flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input bar */}
              <div className="px-4 py-3 bg-[#f5f5f5] border-t border-gray-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="输入你的答案..."
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-400"
                  readOnly
                />
                <button className="w-9 h-9 bg-[#07c160] text-white rounded-lg flex items-center justify-center text-sm">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
