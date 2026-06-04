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
    { href: '/', label: 'Demo 演练' },
    { href: '/system', label: '系统介绍' },
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
          href="/"
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
      className="relative overflow-hidden"
      style={{ backgroundColor: C.base, paddingTop: 160, paddingBottom: 100 }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-8 relative z-10">
        <div
          className={`text-center ${loaded ? 'animate-fadeInUp' : 'anim-init'}`}
          style={{ animationDelay: '200ms', animationFillMode: 'both' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: C.pink }}>
            AI Adaptive Diagnosis
          </p>
          <h1
            className="font-extrabold leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(36px, 7vw, 64px)', color: C.ink }}
          >
            AI 自适应诊断
            <br />
            <span style={{ color: C.pink }}>学习系统</span>
          </h1>
          <p className="mt-6 text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: C.muted }}>
            像优秀老师一样精准识别错因，动态构建知识路径，让每个孩子获得最适合自己的学习体验。
          </p>
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  const { ref, visible } = useInView(0.1);
  const steps = [
    { title: '智能诊断', desc: '通过交互式对话与题目测试，定位学生的知识薄弱点与具体错因', color: '#6366F1' },
    { title: '错因分析', desc: '基于四维错因模型，判断是概念不清、计算失误、审题偏差还是迁移困难', color: '#8B5CF6' },
    { title: '路径推荐', desc: '结合知识图谱前驱后继关系，生成个性化的补漏与学习顺序', color: '#06B6D4' },
    { title: '引导学习', desc: 'LLM 以板书式分步讲解，配合关键提醒与动画，帮助学生真正理解', color: '#FA7EA0' },
  ];

  return (
    <section className="py-24" style={{ backgroundColor: C.white }} ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.pink }}>
            Architecture
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.ink }}>
            系统工作<span style={{ color: C.pink }}>流程</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={`relative rounded-2xl p-6 transition-all duration-700 hover:shadow-lg ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{
                backgroundColor: C.cardBg,
                border: `1px solid ${C.border}`,
                transitionDelay: `${i * 120 + 200}ms`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold mb-4"
                style={{ backgroundColor: s.color }}
              >
                {i + 1}
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: C.ink }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { ref, visible } = useInView(0.1);
  const features = [
    {
      title: '四维错因溯源',
      desc: '不只判断对错，更深入分析错误根源：概念理解、计算能力、审题习惯、知识迁移四个维度精准定位。',
      color: '#6366F1',
    },
    {
      title: '层级知识图谱',
      desc: '构建 L1-L4 四级知识层级，清晰呈现知识点间的前驱与后继关系，确保学习顺序科学合理。',
      color: '#8B5CF6',
    },
    {
      title: '动态自适应路径',
      desc: '根据实时诊断结果动态调整学习路径，已掌握内容快速跳过，薄弱环节重点突破。',
      color: '#06B6D4',
    },
    {
      title: 'LLM 板书式引导',
      desc: '大模型以老师板书的方式分步讲解，配合关键提醒与视觉动画，还原真实课堂辅导体验。',
      color: '#FA7EA0',
    },
  ];

  return (
    <section className="py-24" style={{ backgroundColor: C.base }} ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.pink }}>
            Core Capabilities
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.ink }}>
            核心<span style={{ color: C.pink }}>能力</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group rounded-2xl p-6 transition-all duration-700 hover:shadow-lg ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{
                backgroundColor: C.cardBg,
                border: `1px solid ${C.border}`,
                transitionDelay: `${i * 120 + 200}ms`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }} />
                <h3 className="text-base font-semibold" style={{ color: C.ink }}>{f.title}</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, visible } = useInView(0.2);

  return (
    <section className="py-24" style={{ backgroundColor: C.white }} ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: C.ink }}>
          亲自体验 <span style={{ color: C.pink }}>Demo</span>
        </h2>
        <p className="text-base mb-8" style={{ color: C.muted }}>
          观看 AI 如何像优秀老师一样，精准识别错因并一步步引导学生理解数学概念。
        </p>
        <a
          href="/"
          className="inline-flex items-center text-sm font-medium px-8 py-3 rounded-full transition-all hover:scale-105"
          style={{ backgroundColor: C.ink, color: C.white }}
        >
          立即体验 Demo
        </a>
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

export default function SystemPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ArchitectureSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </>
  );
}
