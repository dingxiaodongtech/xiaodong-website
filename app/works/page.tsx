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

/* ============ 作品1：自适应诊断Demo ============ */

function Work1() {
  const { ref, visible } = useInView(0.05);
  const [activeCase, setActiveCase] = useState(0);

  const cases = [
    {
      title: '长方体表面积',
      wrongAnswer: '60',
      analysis: '60 = 5×3×4，孩子算的是体积，不是表面积',
      type: '概念混淆',
      aiAction: ['识别：体积公式 vs 表面积公式', '定位：混淆了"面"和"体"的概念', '引导：先问"长方体有几个面？"'],
    },
    {
      title: '排水法求体积',
      wrongAnswer: '600',
      analysis: '600 = 30×20，漏了"高度"这个维度',
      type: '维度遗漏',
      aiAction: ['识别：底面积正确，漏乘高度', '定位：空间想象未建立', '引导：动画展示水面变化'],
    },
  ];

  const dimensions = [
    { icon: '🔗', title: '考什么关系', desc: '等量代换 / 比例关系 / 函数关系', color: '#3B82F6', bg: '#EFF6FF' },
    { icon: '🧮', title: '怎么推导', desc: '正向推理 / 逆向运算 / 归纳演绎', color: '#8B5CF6', bg: '#F5F3FF' },
    { icon: '🎭', title: '题目马甲', desc: '情境包装 / 干扰信息 / 图形变式', color: '#F59E0B', bg: '#FFFBEB' },
    { icon: '🧩', title: '融合知识点', desc: '单点考查 / 跨模块综合 / 多步推理', color: '#10B981', bg: '#ECFDF5' },
  ];

  const c = cases[activeCase];

  return (
    <div ref={ref} className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: C.pinkSoft, border: `1px solid rgba(250,126,160,0.2)` }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C.pink }} />
          <span className="text-sm font-medium" style={{ color: C.pink }}>核心项目</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: C.ink }}>
          一道错题，藏着一种<br /><span style={{ color: C.pink }}>"思维密码"</span>
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
          不刷题，先"解码"。AI 精准识别孩子大脑里的错误模型，让每一次讲解都直击根源
        </p>
      </div>

      {/* 案例对比 */}
      <div className="mb-16">
        <div className="flex justify-center gap-3 mb-6">
          {cases.map((c, i) => (
            <button key={i} onClick={() => setActiveCase(i)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={{ backgroundColor: activeCase === i ? C.ink : 'transparent', color: activeCase === i ? C.white : C.muted, border: `1px solid ${activeCase === i ? C.ink : C.border}` }}>
              {c.title}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <div className="rounded-2xl p-5" style={{ backgroundColor: '#F8F9FA', border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2 mb-3"><span className="text-lg">❌</span><span className="font-bold text-sm" style={{ color: C.muted }}>传统系统</span></div>
            <div className="text-xs space-y-2" style={{ color: C.muted }}>
              <div>1. 判错：答案不正确</div>
              <div>2. 推送：再来一道类似题</div>
              <div>3. 循环：继续刷题...</div>
            </div>
            <div className="mt-4 p-3 rounded-xl text-center" style={{ backgroundColor: '#F3F4F6' }}>
              <div className="text-2xl font-bold" style={{ color: '#EF4444' }}>{c.wrongAnswer}</div>
              <div className="text-xs" style={{ color: C.light }}>仅标记为"错误"</div>
            </div>
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: C.white, border: `1px solid ${C.pink}30`, boxShadow: `0 4px 20px ${C.pinkSoft}` }}>
            <div className="flex items-center gap-2 mb-3"><span className="text-lg">✅</span><span className="font-bold text-sm" style={{ color: C.pink }}>AI 诊断</span></div>
            <div className="text-xs space-y-2" style={{ color: C.ink }}>
              {c.aiAction.map((a, i) => <div key={i}>{i + 1}. {a}</div>)}
            </div>
            <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: C.pinkSoft, border: `1px solid ${C.pink}20` }}>
              <div className="text-xs" style={{ color: C.pink }}>错因：{c.type}</div>
              <div className="text-xs mt-1" style={{ color: C.muted }}>{c.analysis}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 四维 + 理论 合并 */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
        <div>
          <h3 className="text-lg font-bold mb-4 text-center" style={{ color: C.ink }}>四维降维诊断</h3>
          <div className="grid grid-cols-2 gap-3">
            {dimensions.map((d, i) => (
              <div key={i} className="rounded-xl p-4 text-center" style={{ backgroundColor: d.bg, border: `1px solid ${d.color}20` }}>
                <div className="text-2xl mb-1">{d.icon}</div>
                <div className="font-bold text-xs" style={{ color: d.color }}>{d.title}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-center" style={{ color: C.ink }}>理论支撑</h3>
          <div className="space-y-2">
            {['SOLO 分类法', '认知负荷理论', '三重编码模型', '双系统理论'].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: C.pinkSoft, color: C.pink }}>{i + 1}</div>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MVP + CTA */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: C.ink, color: C.white }}>
          <span className="text-sm">571 知识点 × 314 考法 × 21 思想</span>
        </div>
        <div className="mb-6">
          <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>MVP 原型阶段 · 7道典型题目 × 逐题错因识别</span>
        </div>
        <a href="/demo" className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-white transition-all hover:scale-105" style={{ backgroundColor: C.pink }}>
          <span>立即体验 Demo</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </a>
      </div>
    </div>
  );
}

/* ============ 作品2：AI录题工具 ============ */

function Work2() {
  const { ref, visible } = useInView(0.05);

  const skills = [
    { name: '解析', icon: '📄', desc: 'docx + PDF 双路径提取', features: ['Word 直接解析', 'PDF 图文识别', 'LaTeX 公式提取'], color: '#3B82F6', bg: '#EFF6FF' },
    { name: '审核', icon: '✅', desc: '100+ 规则引擎', features: ['知识点匹配', '难度分级', '答案校验'], color: '#10B981', bg: '#ECFDF5' },
    { name: '预览', icon: '👁️', desc: 'MiniApp 实时渲染', features: ['LaTeX 渲染', '移动端适配', '三级校验'], color: '#8B5CF6', bg: '#F5F3FF' },
    { name: '录入', icon: '⚡', desc: 'API 直连 + DOM 降级', features: ['Cyber API 毫秒级', 'Chrome 扩展', 'Tampermonkey'], color: '#F59E0B', bg: '#FFFBEB' },
  ];

  return (
    <div ref={ref} className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <span className="text-sm font-medium" style={{ color: '#059669' }}>AI 工作流</span>
        </div>
        <h3 className="text-3xl font-bold mb-3" style={{ color: C.ink }}>AI 智能录题引擎</h3>
        <p className="text-sm max-w-xl mx-auto" style={{ color: C.muted }}>
          Agent/Harness 调度层，编排 4 个 Skill，实现"试卷 → 结构化 → 录入"全流程自动化
        </p>
      </div>

      {/* 架构 + Skills 合并 */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
          <div className="text-center mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: C.ink, color: C.white }}>Agent / Harness 核心调度层</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {skills.map((s, i) => (
              <div key={i} className="rounded-xl p-4 text-center" style={{ backgroundColor: s.bg, border: `1px solid ${s.color}20` }}>
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="font-bold text-xs mb-1" style={{ color: s.color }}>{s.name} Skill</div>
                <div className="text-xs mb-2" style={{ color: C.muted }}>{s.desc}</div>
                <div className="space-y-1">
                  {s.features.map((f, j) => (
                    <div key={j} className="text-xs" style={{ color: C.light }}>· {f}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 时间线 + 指标 合并 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex gap-6">
          {[
            { label: '制作周期', value: '2周' },
            { label: '效率提升', value: '10x' },
            { label: '自动化率', value: '90%' },
          ].map((m, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold" style={{ color: C.pink }}>{m.value}</div>
              <div className="text-xs" style={{ color: C.muted }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
          2周落地：需求拆解 → 架构设计 → Skill开发 → 联调测试 → 部署上线
        </div>
      </div>
    </div>
  );
}

/* ============ 作品3：互动课件合集 ============ */

function Work3() {
  const { ref, visible } = useInView(0.05);

  const coursewares = [
    { title: '还原几何体', desc: '三视图还原立体图形，培养空间想象力', tag: '空间几何', color: '#3B82F6', bg: '#EFF6FF', file: '还原几何体.html' },
    { title: '交换律对对碰', desc: '拖拽配对游戏，理解加法与乘法交换律', tag: '运算定律', color: '#8B5CF6', bg: '#F5F3FF', file: '交换律对对碰.html' },
    { title: '九九乘法了个羊', desc: '羊了个羊式消除，趣味记忆乘法口诀', tag: '乘法口诀', color: '#F59E0B', bg: '#FFFBEB', file: '九九乘法了个羊.html' },
    { title: '巧数图形', desc: '分类计数策略，解决复杂图形计数问题', tag: '计数问题', color: '#10B981', bg: '#ECFDF5', file: '巧数图形.html' },
    { title: '余数大富翁', desc: '大富翁棋盘游戏，掌握带余数除法', tag: '除法应用', color: '#EC4899', bg: '#FDF2F8', file: '余数大富翁.html' },
    { title: '乘法口诀图鉴', desc: '卡牌收集式图鉴，可视化乘法关系网络', tag: '乘法口诀', color: '#059669', bg: '#ECFDF5', file: '乘法口诀图鉴.html' },
  ];

  return (
    <div ref={ref} className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: '#F5F3FF', border: '1px solid #DDD6FE' }}>
          <span className="text-sm font-medium" style={{ color: '#7C3AED' }}>教学互动</span>
        </div>
        <h3 className="text-3xl font-bold mb-3" style={{ color: C.ink }}>数学互动课件合集</h3>
        <p className="text-sm max-w-xl mx-auto" style={{ color: C.muted }}>
          一套"可以动手玩"的小学数学学习工具。每个课件围绕一个核心知识点，通过游戏化交互让孩子在操作中建立数学直觉
        </p>
      </div>

      {/* 课件卡片网格 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {coursewares.map((c, i) => (
          <a
            key={i}
            href={`/${c.file}`}
            className={`group rounded-2xl p-5 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{
              transitionDelay: `${i * 80}ms`,
              backgroundColor: C.white,
              border: `1px solid ${c.color}20`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>{c.tag}</span>
              <svg width="16" height="16" fill="none" stroke={c.color} viewBox="0 0 24 24" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <path strokeLinecap="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
            <h4 className="font-bold text-base mb-2 group-hover:text-[#FA7EA0] transition-colors" style={{ color: C.ink }}>{c.title}</h4>
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{c.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ============ 作品4：AI探索合集 ============ */

function AiExplorations() {
  const { ref, visible } = useInView(0.05);

  const explorations = [
    {
      icon: '📚',
      title: '体系整理',
      desc: '571个原子知识点、314种考法模式、21大数学思想体系，构建 AI 可计算的教研图谱',
      color: '#3B82F6',
      bg: '#EFF6FF',
    },
    {
      icon: '📋',
      title: '诊断报告',
      desc: '基于四维诊断模型，自动生成学生错因分析报告，精准定位知识薄弱点',
      color: '#8B5CF6',
      bg: '#F5F3FF',
    },
    {
      icon: '🎬',
      title: '视频推荐',
      desc: '根据诊断结果，智能推荐针对性讲解视频，实现"哪里不会点哪里"',
      color: '#F59E0B',
      bg: '#FFFBEB',
    },
    {
      icon: '🤖',
      title: '企微机器人',
      desc: '接入企业微信，教研团队可随时查询知识点、考法、错因库，提升协作效率',
      color: '#10B981',
      bg: '#ECFDF5',
    },
  ];

  return (
    <div ref={ref} className={`mb-20 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
          <span className="text-sm font-medium" style={{ color: '#DC2626' }}>更多探索</span>
        </div>
        <h3 className="text-3xl font-bold mb-3" style={{ color: C.ink }}>AI 教育探索</h3>
        <p className="text-sm max-w-xl mx-auto" style={{ color: C.muted }}>
          持续尝试 AI 在教育场景的各种可能性
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
        {explorations.map((e, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 text-center transition-all duration-700 hover:shadow-lg ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{
              transitionDelay: `${i * 100}ms`,
              backgroundColor: C.white,
              border: `1px solid ${e.color}20`,
            }}
          >
            <div className="text-4xl mb-4">{e.icon}</div>
            <div className="font-bold text-lg mb-2" style={{ color: e.color }}>{e.title}</div>
            <div className="text-sm leading-relaxed" style={{ color: C.muted }}>{e.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ 页面组装 ============ */

function SectionDivider({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 max-w-6xl mx-auto px-6 mb-12">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ backgroundColor: C.ink, color: C.white }}>
        {number}
      </div>
      <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
      <span className="text-sm font-medium" style={{ color: C.muted }}>{title}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
    </div>
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

export default function WorksPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        {/* 页面标题 */}
        <section className="py-16" style={{ backgroundColor: C.base }}>
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.pink }}>Works</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.ink }}>作品集</h1>
            <p className="text-sm" style={{ color: C.muted }}>用 AI 重塑教育体验的探索与实践</p>
          </div>
        </section>

        {/* 作品1：自适应诊断Demo */}
        <section className="py-20" style={{ backgroundColor: C.white }}>
          <div className="max-w-6xl mx-auto px-6">
            <SectionDivider number="01" title="自适应诊断 Demo" />
            <Work1 />
          </div>
        </section>

        {/* 作品2：AI录题工具 */}
        <section className="py-20" style={{ backgroundColor: C.base }}>
          <div className="max-w-6xl mx-auto px-6">
            <SectionDivider number="02" title="AI 智能录题引擎" />
            <Work2 />
          </div>
        </section>

        {/* 作品3：互动课件 */}
        <section className="py-20" style={{ backgroundColor: C.white }}>
          <div className="max-w-6xl mx-auto px-6">
            <SectionDivider number="03" title="互动课件引擎" />
            <Work3 />
          </div>
        </section>

        {/* 作品4：AI探索合集 */}
        <section className="py-20" style={{ backgroundColor: C.base }}>
          <div className="max-w-6xl mx-auto px-6">
            <SectionDivider number="04" title="AI 教育探索" />
            <AiExplorations />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
