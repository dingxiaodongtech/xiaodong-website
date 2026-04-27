'use client';

import { useState, useEffect, useRef } from 'react';

const C = {
  base: '#F5F7FC',
  ink: '#0A0A0A',
  muted: '#6B7280',
  light: '#9CA3AF',
  pink: '#FA7EA0',
  pinkSoft: 'rgba(250,126,160,0.12)',
  white: '#FFFFFF',
  border: '#E8ECF4',
  cardBg: '#FFFFFF',
};

const timeline = [
  { year: '2014', company: '新东方', tag: '一线教学', insight: '发现每个孩子错因不同，萌生因材施教的想法', color: '#6366F1' },
  { year: '2017', company: '一起作业', tag: '体系搭建', insight: '把教研大纲变成可智能推荐的知识图谱', color: '#8B5CF6' },
  { year: '2019', company: '好未来', tag: '数据驱动', insight: '"海边自学"从0到1，首次验证自适应学习路径', color: '#06B6D4' },
  { year: '2021', company: '新东方', tag: '错因溯源', insight: '四维图谱让 AI 不只判对错，还能溯源为什么错', color: '#F59E0B' },
  { year: '2023', company: '猿辅导', tag: 'LLM 驱动', insight: '用大模型实现对话式错因诊断，完成体系跃迁', color: '#FA7EA0' },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

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

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section
      id="about"
      className="relative overflow-hidden"
      style={{ backgroundColor: C.base, paddingTop: 160, minHeight: '100vh' }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-12 relative z-10">
        <div
          className={`text-center ${loaded ? 'animate-fadeInUp' : 'anim-init'}`}
          style={{ animationDelay: '500ms', animationFillMode: 'both' }}
        >
          <h1
            className="font-extrabold leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(40px, 8vw, 72px)', color: C.ink }}
          >
            I&apos;m{' '}
            <span style={{ color: C.pink }}>晓冬</span>,
            <br />
            AI 自适应教育探索者
          </h1>
          <p className="mt-6 text-lg max-w-xl mx-auto leading-relaxed" style={{ color: C.muted }}>
            10 年 K12 教研，一路探索如何用 AI 让每个孩子<br className="hidden sm:block" />获得最适合自己的学习体验。
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['新东方', '好未来', '猿辅导', 'AI 错因诊断', '知识图谱'].map(tag => (
              <span
                key={tag}
                className="text-xs font-medium px-4 py-1.5 rounded-full"
                style={{
                  backgroundColor: tag === 'AI 错因诊断' ? C.pinkSoft : 'rgba(0,0,0,0.04)',
                  color: tag === 'AI 错因诊断' ? C.pink : C.muted,
                  border: `1px solid ${tag === 'AI 错因诊断' ? 'rgba(250,126,160,0.25)' : 'rgba(0,0,0,0.06)'}`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`relative w-full max-w-3xl ${loaded ? 'animate-scaleIn' : 'anim-init'}`}
          style={{ animationDelay: '1000ms', animationFillMode: 'both' }}
        >
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{
              border: `1px solid ${C.border}`,
              backgroundColor: '#0A0A1A',
            }}
          >
            <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: '#111128', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="text-xs px-3 py-1 rounded-md text-center" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                  知识星河 · Knowledge Universe
                </div>
              </div>
            </div>

            <video
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full"
              style={{ aspectRatio: '16/9', backgroundColor: '#0A0A1A', objectFit: 'cover' }}
            >
              <source src="/videos/knowledge-galaxy.mp4" type="video/mp4" />
              您的浏览器不支持视频播放。
            </video>
          </div>
        </div>
      </div>

      <div className="h-24" />
    </section>
  );
}

function JourneySection() {
  const { ref, visible } = useInView(0.1);

  return (
    <section id="journey" className="py-24" style={{ backgroundColor: C.white }}>
      <div className="max-w-4xl mx-auto px-6" ref={ref}>
        <div className={`text-center mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.pink }}>
            Journey
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.ink }}>
            10 年探索，<span style={{ color: C.pink }}>一条主线</span>
          </h2>
          <p className="mt-3 text-sm" style={{ color: C.muted }}>
            从人工诊断到 LLM 对话 —— 自适应教育体系的 5 次进化
          </p>
        </div>

        <div className={`flex items-center justify-between mb-20 px-2 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {['人工诊断', '结构化', '数据驱动', '错因溯源', 'LLM 对话'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-110"
                  style={{
                    backgroundColor: timeline[i].color,
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-[11px] font-medium text-center" style={{ color: C.muted }}>{s}</span>
              </div>
              {i < 4 && (
                <div className="w-4 md:w-12 h-px mx-1 self-start mt-5 md:mt-6" style={{ backgroundColor: C.border }} />
              )}
            </div>
          ))}
        </div>

        <div className="relative ml-4 md:ml-8">
          <div
            className="absolute left-3 top-0 bottom-0 w-px"
            style={{ background: `linear-gradient(to bottom, ${timeline[0].color}, ${timeline[4].color})` }}
          />

          <div className="space-y-1">
            {timeline.map((node, i) => (
              <div
                key={node.year}
                className={`relative pl-12 transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
                style={{ transitionDelay: `${i * 120 + 400}ms` }}
              >
                <div
                  className="absolute left-1 top-4 w-5 h-5 rounded-full border-[3px] z-10"
                  style={{ backgroundColor: C.white, borderColor: node.color }}
                />

                <div
                  className="group rounded-2xl p-5 transition-all duration-300 hover:shadow-lg cursor-default"
                  style={{ backgroundColor: C.cardBg, border: `1px solid ${C.border}` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = node.color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: node.color }}
                    >
                      {node.year}
                    </span>
                    <span className="text-sm font-medium" style={{ color: C.ink }}>{node.company}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: `${node.color}15`, color: node.color }}>
                      {node.tag}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                    {node.insight}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`relative pl-12 mt-4 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '1200ms' }}
          >
            <div
              className="absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center z-10"
              style={{ backgroundColor: C.pink }}
            >
              <span className="text-white text-xs">✦</span>
            </div>
            <p className="text-sm italic pt-1" style={{ color: C.light }}>
              持续探索中…让 AI 成为每个孩子的专属导师
            </p>
          </div>
        </div>
      </div>
    </section>
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

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <JourneySection />
      <Footer />
    </>
  );
}
