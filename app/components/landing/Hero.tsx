'use client';

import { useEffect, useState } from 'react';

const floatingIcons = [
  { emoji: '🤖', delay: 0, x: '10%', y: '20%' },
  { emoji: '🌐', delay: 1, x: '85%', y: '15%' },
  { emoji: '☁️', delay: 2, x: '75%', y: '70%' },
  { emoji: '🚀', delay: 0.5, x: '15%', y: '75%' },
  { emoji: '🔒', delay: 1.5, x: '90%', y: '45%' },
  { emoji: '📊', delay: 2.5, x: '5%', y: '50%' },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-white">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-200/20 to-violet-200/20 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Floating Icons */}
      {mounted && floatingIcons.map((icon, i) => (
        <div
          key={i}
          className="absolute text-2xl sm:text-3xl opacity-20 animate-bounce"
          style={{
            left: icon.x,
            top: icon.y,
            animationDelay: `${icon.delay}s`,
            animationDuration: '3s',
          }}
        >
          {icon.emoji}
        </div>
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-blue-700">全新上线 · 限时免费体验</span>
        </div>

        {/* Main Title */}
        <h1
          className={`text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight transition-all duration-700 delay-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-gray-900">打造你的</span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            数字领地
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          集 <strong className="text-gray-700">AI 智能教育</strong>、
          <strong className="text-gray-700">域名管理</strong>、
          <strong className="text-gray-700">云存储</strong>和
          <strong className="text-gray-700">一键建站</strong> 于一体
          <br className="hidden sm:block" />
          让每个人都能轻松拥有自己的互联网家园
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 transition-all duration-700 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button className="group w-full sm:w-auto px-8 py-4 text-white font-semibold bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:-translate-y-1">
            <span className="flex items-center justify-center gap-2">
              开始免费试用
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button className="group w-full sm:w-auto px-8 py-4 text-gray-700 font-semibold bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all hover:-translate-y-1">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              观看演示视频
            </span>
          </button>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 transition-all duration-700 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {[
            { value: '50K+', label: '注册用户' },
            { value: '99.9%', label: '服务可用性' },
            { value: '100+', label: '题库数量' },
            { value: '24/7', label: '技术支持' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Product Preview */}
        <div
          className={`mt-16 relative transition-all duration-1000 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative mx-auto max-w-4xl">
            {/* Browser mockup */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-gray-400 border border-gray-200 max-w-md mx-auto flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    zhiyun.com/dashboard
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
                  {[
                    { icon: '🤖', name: 'AI 教育', color: 'from-blue-500 to-cyan-500', desc: '智能诊断' },
                    { icon: '🌐', name: '域名管理', color: 'from-violet-500 to-purple-500', desc: '一键注册' },
                    { icon: '☁️', name: '云存储', color: 'from-emerald-500 to-teal-500', desc: '安全可靠' },
                    { icon: '🚀', name: '建站工具', color: 'from-orange-500 to-red-500', desc: '极速搭建' },
                  ].map((item) => (
                    <div key={item.name} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-lg mb-3`}>
                        {item.icon}
                      </div>
                      <div className="font-semibold text-sm text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-purple-500/5 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-gray-400">向下滚动</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
