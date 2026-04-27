'use client';

import { useState, useEffect } from 'react';

const C = {
  base: '#F5F7FC',
  ink: '#0A0A0A',
  muted: '#6B7280',
  light: '#9CA3AF',
  pink: '#FA7EA0',
  white: '#FFFFFF',
  border: '#E8ECF4',
  cardBg: '#FFFFFF',
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

export default function LabPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: 64, backgroundColor: C.base }}>
        <div className="text-center px-6">
          <div className="text-6xl mb-6">🔬</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: C.ink }}>
            实验室
          </h1>
          <p className="text-lg mb-2" style={{ color: C.muted }}>
            这里将展示更多实验性项目
          </p>
          <p className="text-sm" style={{ color: C.light }}>
            敬请期待...
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: '🧪', title: 'AI 实验', desc: '大模型在教育场景的新尝试' },
              { icon: '📊', title: '数据可视化', desc: '学习数据的多维呈现' },
              { icon: '🤖', title: '智能工具', desc: '提升教研效率的 AI 工具' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-6 border transition-all hover:shadow-lg"
                style={{ backgroundColor: C.cardBg, borderColor: C.border }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-1" style={{ color: C.ink }}>{item.title}</h3>
                <p className="text-sm" style={{ color: C.muted }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
