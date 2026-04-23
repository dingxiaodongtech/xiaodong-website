'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-white" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-blue-700 font-medium">AI 驱动 · 自适应学习</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">让每道错题</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                成为进步的阶梯
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
              面向小学一年级到初三的数学 AI 自适应学习平台。
              <br className="hidden sm:block" />
              AI 实时诊断错因，分步引导，让孩子真正理解每一个知识点。
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all text-lg"
              >
                免费体验 3 次
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-8 py-4 rounded-2xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all text-lg"
              >
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                观看演示
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-bold text-gray-900">小1~初3</div>
                <div className="text-sm text-gray-500 mt-1">覆盖年级</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">AI诊断</div>
                <div className="text-sm text-gray-500 mt-1">错因分析</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">自适应</div>
                <div className="text-sm text-gray-500 mt-1">个性学习</div>
              </div>
            </div>
          </div>

          {/* Right: AI Diagnosis Preview */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 border border-gray-100 p-6 max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">AI 诊断助手</div>
                  <div className="text-xs text-green-500">正在分析中...</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3">
                {/* Student */}
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white px-4 py-2.5 rounded-2xl rounded-br-md text-sm max-w-[80%]">
                    老师，这道题我算出来是 24cm²，对吗？
                  </div>
                </div>

                {/* AI */}
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm max-w-[85%]">
                    <div className="font-medium text-blue-600 mb-1">🔍 诊断结果</div>
                    答案不太对哦！让我帮你分析一下：
                    <div className="mt-2 bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-orange-600 font-medium mb-1">⚠️ 错因分析</div>
                      <div className="text-xs text-gray-600">你可能只计算了一个面的面积，忘记了长方体有6个面</div>
                    </div>
                  </div>
                </div>

                {/* AI Step Guide */}
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm max-w-[85%] border border-blue-100">
                    <div className="font-medium text-purple-600 mb-1">📝 分步引导</div>
                    <div className="text-xs space-y-1">
                      <div>✅ 第1步：找出长、宽、高</div>
                      <div>✅ 第2步：计算三组对面的面积</div>
                      <div className="text-blue-600 font-medium">👉 第3步：把所有面积加起来</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="mt-4 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <span className="text-gray-400 text-sm">输入你的答案...</span>
                <div className="ml-auto w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -left-4 bg-white px-3 py-1.5 rounded-full shadow-lg border border-gray-100 text-sm font-medium text-green-600 animate-bounce">
              ✨ 正确率提升 32%
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white px-3 py-1.5 rounded-full shadow-lg border border-gray-100 text-sm font-medium text-purple-600">
              🎯 5000+ 题目库
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
