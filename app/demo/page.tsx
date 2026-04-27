'use client';

import { useState, useEffect } from 'react';

const C = {
  base: '#F5F7FC',
  ink: '#0A0A0A',
  muted: '#6B7280',
  pink: '#FA7EA0',
  white: '#FFFFFF',
  border: '#E8ECF4',
};

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', label: '首页' },
    { href: '/works', label: '作品集' },
    { href: '/demo', label: '体验 Demo' },
    { href: '/lab', label: '实验室' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        height: 64,
        backdropFilter: 'blur(20px)',
        backgroundColor: scrolled ? 'rgba(245,247,252,0.85)' : 'transparent',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.ink }}>
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="font-semibold text-sm" style={{ color: C.ink }}>晓冬</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm transition-colors hover:opacity-100"
              style={{ color: C.muted, opacity: 0.8 }}
              onMouseEnter={e => { e.currentTarget.style.color = C.ink; e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.opacity = '0.8'; }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="/demo"
          className="hidden md:inline-flex items-center text-sm font-medium px-5 py-2 rounded-full transition-all hover:scale-105"
          style={{ backgroundColor: C.ink, color: C.white }}
        >
          体验 Demo
        </a>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <svg width="24" height="24" fill="none" stroke={C.ink} viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-6 pt-2" style={{ backgroundColor: 'rgba(245,247,252,0.98)' }}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block py-3 text-sm font-medium border-b"
              style={{ color: C.ink, borderColor: C.border }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="py-10" style={{ backgroundColor: C.ink }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.pink }}>
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-sm font-semibold text-white">晓冬</span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>AI 自适应教育探索者</span>
          </div>
          <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            📧 ddingxiaodong@126.com
          </div>
        </div>
        <div className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          &copy; {new Date().getFullYear()} 晓冬 · xiaodongai.cloud
        </div>
      </div>
    </footer>
  );
}

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800" id="demo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-900/50 border border-blue-700/50 rounded-full px-4 py-1.5 mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-blue-300 font-medium">实时演示</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                自适应诊断<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Demo</span>体验
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                观看 AI 如何像优秀老师一样，精准识别错因并一步步引导学生理解数学概念
              </p>
            </div>

            <div className="w-full h-[70vh] md:h-[75vh] lg:h-[80vh] max-h-[700px] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
              <iframe
                src="/demo/AI%E6%99%BA%E8%83%BD%E8%AF%8A%E6%96%AD%E8%87%AA%E5%AD%A6demo%E8%AF%BE.html"
                className="w-full h-full"
                style={{ border: 'none' }}
                title="AI智能诊断自学Demo课"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
