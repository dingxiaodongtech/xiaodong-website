'use client';

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
          准备好开始了吗？
        </h2>
        <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          立即注册，免费体验全部功能。无需信用卡，零门槛上手。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group w-full sm:w-auto px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-1">
            <span className="flex items-center justify-center gap-2">
              免费注册
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1">
            预约演示
          </button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6 text-sm text-blue-200">
          <span className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
            免费试用
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
            无需信用卡
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
            随时取消
          </span>
        </div>
      </div>
    </section>
  );
}
