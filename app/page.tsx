'use client';

import { useState, useEffect, useRef } from 'react';

/* ============================================================
   Design Tokens
   ============================================================ */
const C = {
  base: '#F5F7FC',
  ink: '#0A0A0A',
  muted: '#6B7280',
  light: '#9CA3AF',
  pink: '#FA7EA0',
  pinkLight: '#FFF0F3',
  pinkSoft: 'rgba(250,126,160,0.12)',
  white: '#FFFFFF',
  border: '#E8ECF4',
  cardBg: '#FFFFFF',
  sectionAlt: '#F0F2F8',
};

/* ============================================================
   数据
   ============================================================ */

// 时间线（简化版）
const timeline = [
  { year: '2014', company: '新东方', tag: '一线教学', insight: '发现每个孩子错因不同，萌生因材施教的想法', color: '#6366F1' },
  { year: '2017', company: '一起作业', tag: '体系搭建', insight: '把教研大纲变成 AI 可计算的知识图谱', color: '#8B5CF6' },
  { year: '2019', company: '好未来', tag: '数据驱动', insight: '"海边自学"从0到1，首次验证自适应学习路径', color: '#06B6D4' },
  { year: '2021', company: '新东方', tag: '错因溯源', insight: '四维图谱让 AI 不只判对错，还能溯源为什么错', color: '#F59E0B' },
  { year: '2023', company: '猿辅导', tag: 'LLM 驱动', insight: '用大模型实现对话式错因诊断，完成体系跃迁', color: '#FA7EA0' },
];

// 作品集（当前 AI 落地方案）
const portfolio = [
  {
    id: 'galaxy',
    title: '知识星河',
    subtitle: '3D Knowledge Universe',
    desc: '406 颗知识星点、364 条依赖脉络，将小学数学全部知识构建为可交互的 3D 星空宇宙。',
    metrics: [
      { label: '知识星点', value: '406' },
      { label: '依赖脉络', value: '364' },
      { label: '核心枢纽', value: '5' },
    ],
    tags: ['Three.js', '知识图谱', '3D 可视化'],
    gradient: 'from-indigo-500 to-purple-600',
    iconBg: '#EEF2FF',
    icon: '🌌',
  },
  {
    id: 'system',
    title: '多维知识体系',
    subtitle: '四维结构化教研图谱',
    desc: '知识点→考法→数学思想→常见错因，AI 诊断的"大脑"。',
    metrics: [
      { label: '知识节点', value: '400+' },
      { label: '考法映射', value: '1200+' },
      { label: '错因类型', value: '300+' },
    ],
    tags: ['知识图谱', '教研体系', '错因库'],
    gradient: 'from-purple-500 to-pink-500',
    iconBg: '#FAF5FF',
    icon: '🧬',
  },
  {
    id: 'amory',
    title: 'Amory 自动录题',
    subtitle: '两周 AI 全流程搭建',
    desc: '试卷→OCR→JSON结构化→自动录入后台→可视化审核，效率提升10倍。',
    metrics: [
      { label: '制作周期', value: '2周' },
      { label: '效率提升', value: '10x' },
      { label: '自动化率', value: '90%' },
    ],
    tags: ['AI 工作流', 'OCR', '自动化'],
    gradient: 'from-teal-500 to-cyan-500',
    iconBg: '#F0FDFA',
    icon: '⚙️',
  },
  {
    id: 'demo',
    title: 'AI 错因诊断 Demo',
    subtitle: '诊断→引导→自适应推荐',
    desc: '学生答错→AI 诊断错因→分步启发引导→自适应推荐下一题。',
    metrics: [
      { label: '诊断维度', value: '4 维' },
      { label: '引导方式', value: '逐步' },
      { label: '覆盖年级', value: '1-9' },
    ],
    tags: ['LLM', 'AI 诊断', '自适应'],
    gradient: 'from-rose-500 to-orange-500',
    iconBg: '#FFF1F2',
    icon: '🎯',
  },
];

// 内置题目数据（不依赖数据库）
const demoQuestions = [
  {
    id: 1,
    content: '一个长方体的长是5cm，宽是3cm，高是4cm，求它的表面积。',
    correct_answer: '94cm²',
    solution: '表面积 = 2×(长×宽 + 长×高 + 宽×高) = 2×(5×3 + 5×4 + 3×4) = 2×(15+20+12) = 2×47 = 94cm²',
    hints: [
      '表面积是所有面的面积之和。长方体有6个面，想想分别是哪些面？\n\n提示：上下两个面、前后两个面、左右两个面',
      '上下面 = 长×宽 = 5×3 = 15cm²\n前后面 = 长×高 = 5×4 = 20cm²\n左右面 = 宽×高 = 3×4 = 12cm²\n\n每种面各有 2 个，加起来试试？',
    ],
    common_mistakes: ['你算的是体积（5×3×4=60），不是表面积哦！表面积是6个面的面积之和，体积才是长×宽×高'],
    knowledge: '长方体表面积',
  },
  {
    id: 2,
    content: '一个圆柱体的底面半径是3cm，高是8cm，求它的侧面积。（π取3.14）',
    correct_answer: '150.72cm²',
    solution: '侧面积 = 2πrh = 2×3.14×3×8 = 150.72cm²',
    hints: [
      '圆柱的侧面展开是一个长方形。长方形的长 = 底面周长 = 2πr，宽 = 圆柱的高',
      '底面周长 = 2×3.14×3 = 18.84cm\n侧面积 = 底面周长×高 = 18.84×8 = ?',
    ],
    common_mistakes: ['你算的可能是底面积（πr²=28.26），侧面积公式是 2πrh'],
    knowledge: '圆柱侧面积',
  },
  {
    id: 3,
    content: '甲乙两地相距240km，一辆汽车从甲地出发，每小时行60km。出发2小时后，一辆摩托车从乙地出发迎面而来，每小时行40km。摩托车出发几小时后两车相遇？',
    correct_answer: '1.2小时',
    solution: '汽车先行2小时走了 60×2=120km，剩余距离 240-120=120km。\n两车相向而行，速度之和 = 60+40=100km/h。\n相遇时间 = 120÷100 = 1.2小时',
    hints: [
      '汽车先走了2小时，已经走了多少路程？剩余距离是多少？',
      '剩余距离 = 240 - 60×2 = 120km\n两车相向而行，速度之和 = 60+40 = 100km/h\n时间 = 路程÷速度 = ?',
    ],
    common_mistakes: ['你可能忘记了汽车先走了2小时，不能用总距离240km直接除以速度之和'],
    knowledge: '行程问题·相遇',
  },
];

/* ============================================================
   Hooks
   ============================================================ */

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

/* ============================================================
   Navbar (64px, 吸顶, 毛玻璃)
   ============================================================ */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '#about', label: '关于' },
    { href: '#journey', label: '历程' },
    { href: '#works', label: '作品' },
    { href: '#demo', label: '诊断 Demo' },
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
        {/* Logo + Name */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.ink }}>
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="font-semibold text-sm" style={{ color: C.ink }}>丁晓冬</span>
        </a>

        {/* Center links */}
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

        {/* CTA */}
        <a
          href="#demo"
          className="hidden md:inline-flex items-center text-sm font-medium px-5 py-2 rounded-full transition-all hover:scale-105"
          style={{ backgroundColor: C.ink, color: C.white }}
        >
          体验 Demo
        </a>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <svg width="24" height="24" fill="none" stroke={C.ink} viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
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

/* ============================================================
   Hero Section — Portfolio 设计风格
   ============================================================ */

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section
      id="about"
      className="relative overflow-hidden"
      style={{ backgroundColor: C.base, paddingTop: 160, minHeight: '100vh' }}
    >
      {/* 内容容器 */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-12 relative z-10">
        {/* 文案 — 延迟 0.5s fadeInUp */}
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

          {/* Tags */}
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

        {/* 知识星河视觉 — 延迟 1.0s scaleIn */}
        <div
          className={`relative ${loaded ? 'animate-scaleIn' : 'anim-init'}`}
          style={{ animationDelay: '1000ms', animationFillMode: 'both' }}
        >
          {/* 底部渐变圆 — 延迟 1.5s circleGrow */}
          <div
            className={`absolute -bottom-16 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full ${loaded ? 'animate-circleGrow' : 'anim-init'}`}
            style={{
              animationDelay: '1500ms',
              animationFillMode: 'both',
              background: `radial-gradient(circle, ${C.pink}22 0%, transparent 70%)`,
            }}
          />

          {/* 知识星河图片 */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: 'min(90vw, 720px)',
              border: `1px solid ${C.border}`,
              backgroundColor: '#0A0A1A',
            }}
          >
            {/* 浏览器顶栏 */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: '#111128', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="text-xs px-3 py-1 rounded-md text-center" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                  知识星河 · 3D Knowledge Universe
                </div>
              </div>
            </div>

            {/* 图片 */}
            <img
              src="/knowledge-universe.png"
              alt="知识星河 - 3D Knowledge Universe - 406个知识星点、364条依赖脉络"
              className="w-full block"
              style={{ display: 'block' }}
            />

            {/* 底部数据条 */}
            <div className="flex items-center justify-between px-5 py-3" style={{ backgroundColor: '#111128', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { label: '知识星点', value: '406', color: '#818CF8' },
                { label: '依赖脉络', value: '364', color: '#C084FC' },
                { label: '核心枢纽', value: '5', color: '#F472B6' },
                { label: '四大星系', value: '数与代数 · 图形与几何 · 统计与概率 · 综合与实践', color: '#60A5FA' },
              ].map((stat, i) => (
                <div key={stat.label} className={`flex items-center gap-1.5 ${i === 3 ? 'hidden md:flex' : ''}`}>
                  <span className="text-xs font-bold" style={{ color: stat.color }}>{stat.value}</span>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部过渡 */}
      <div className="h-24" />
    </section>
  );
}

/* ============================================================
   Journey — 可视化时间线 + 自适应体系进化
   ============================================================ */

function JourneySection() {
  const { ref, visible } = useInView(0.1);

  return (
    <section id="journey" className="py-24" style={{ backgroundColor: C.white }}>
      <div className="max-w-4xl mx-auto px-6" ref={ref}>
        {/* Section Header */}
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

        {/* 横向进化条 */}
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

        {/* 竖向时间线 */}
        <div className="relative ml-4 md:ml-8">
          {/* 竖线 */}
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
                {/* 圆点 */}
                <div
                  className="absolute left-1 top-4 w-5 h-5 rounded-full border-[3px] z-10"
                  style={{ backgroundColor: C.white, borderColor: node.color }}
                />

                {/* 卡片 */}
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

          {/* 终点 */}
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

/* ============================================================
   Works — 作品集（卡片网格）
   ============================================================ */

function WorksSection() {
  const { ref, visible } = useInView(0.05);

  return (
    <section id="works" className="py-24" style={{ backgroundColor: C.base }}>
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.pink }}>
            Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.ink }}>
            用 AI 做出来的，<span style={{ color: C.pink }}>能落地的东西</span>
          </h2>
        </div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolio.map((item, i) => (
            <WorkCard key={item.id} item={item} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ item, index, visible }: {
  item: typeof portfolio[0];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{
        transitionDelay: `${index * 120}ms`,
        backgroundColor: C.cardBg,
        border: `1px solid ${hovered ? C.pink + '40' : C.border}`,
        boxShadow: hovered ? `0 20px 60px -12px ${C.pink}20` : '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 顶部渐变条 */}
      <div className={`h-1.5 bg-gradient-to-r ${item.gradient}`} />

      <div className="p-6">
        {/* 图标 + 标题 */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-300"
            style={{
              backgroundColor: item.iconBg,
              transform: hovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
            }}
          >
            {item.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: C.ink }}>{item.title}</h3>
            <p className="text-xs" style={{ color: C.light }}>{item.subtitle}</p>
          </div>
        </div>

        {/* 描述 */}
        <p className="text-sm leading-relaxed mb-5" style={{ color: C.muted }}>
          {item.desc}
        </p>

        {/* Metrics */}
        <div className="flex gap-6 mb-5">
          {item.metrics.map(m => (
            <div key={m.label}>
              <div className="text-xl font-bold" style={{ color: C.ink }}>{m.value}</div>
              <div className="text-[10px]" style={{ color: C.light }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {item.tags.map(tag => (
            <span
              key={tag}
              className="text-[11px] font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: `${C.ink}08`, color: C.muted, border: `1px solid ${C.ink}0A` }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   AI 诊断 Demo — 浏览器双栏布局（左 AI 引擎 + 右互动课堂）
   ============================================================ */

// 答案检查
function checkDemoAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalize = (s: string) => s.replace(/\s+/g, '').replace(/cm²|cm2|平方厘米/g, 'cm²').replace(/小时|h/g, '小时').toLowerCase();
  return normalize(userAnswer).includes(normalize(correctAnswer).replace('cm²', '')) || normalize(userAnswer) === normalize(correctAnswer);
}

// 错因分析
function findDemoMistake(userAnswer: string, question: typeof demoQuestions[0]): string {
  const numAnswer = parseFloat(userAnswer.replace(/[^0-9.]/g, ''));
  if (isNaN(numAnswer)) return '答案格式不太对，请输入一个数值答案';
  return question.common_mistakes[0] || '计算过程中可能有小错误';
}

type DemoMessage = {
  role: 'system' | 'student' | 'ai' | 'ai-diagnosis' | 'ai-step' | 'ai-success';
  text: string;
};

function DemoSection() {
  const { ref, visible } = useInView(0.1);
  const [qIndex, setQIndex] = useState(0);
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [input, setInput] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [started, setStarted] = useState(false);
  // 左栏诊断状态
  const [diagError, setDiagError] = useState('等待学生作答...');
  const [diagWeakness, setDiagWeakness] = useState('—');
  const [diagPath, setDiagPath] = useState('—');
  const [diagConfidence, setDiagConfidence] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const currentQ = demoQuestions[qIndex];

  // 自动滚动到底部
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, aiThinking]);

  const addMsg = (msg: DemoMessage) => setMessages(prev => [...prev, msg]);

  const startDemo = () => {
    setStarted(true);
    setQIndex(0);
    setSolved(false);
    setHintIndex(0);
    setDiagError('等待学生作答...');
    setDiagWeakness('—');
    setDiagPath('—');
    setDiagConfidence(0);
    setMessages([
      { role: 'system', text: `📋 题目：${demoQuestions[0].content}` },
      { role: 'ai', text: '你好！请仔细阅读题目，然后把你的答案告诉我吧。如果不确定也没关系，我会帮你分析 😊' },
    ]);
  };

  const handleSubmit = () => {
    if (!input.trim() || aiThinking || solved) return;
    const userAnswer = input.trim();
    setInput('');
    addMsg({ role: 'student', text: userAnswer });
    setAiThinking(true);

    setTimeout(() => {
      const isCorrect = checkDemoAnswer(userAnswer, currentQ.correct_answer);

      if (isCorrect) {
        addMsg({ role: 'ai-success', text: `🎉 太棒了！答案完全正确！\n\n${currentQ.solution}` });
        setSolved(true);
        setDiagWeakness(`${currentQ.knowledge}→已掌握 ✅`);
        setDiagPath('继续下一题 →');
        setDiagConfidence(95);
        setAiThinking(false);
      } else {
        // 诊断错因
        const mistake = findDemoMistake(userAnswer, currentQ);
        setDiagError(mistake.slice(0, 20) + (mistake.length > 20 ? '...' : ''));
        setDiagConfidence(Math.min(diagConfidence + 30, 75));

        addMsg({ role: 'ai-diagnosis', text: `🔍 诊断结果\n\n你的答案是 ${userAnswer}，但正确答案不是这个哦。\n\n⚠️ 可能的错因：${mistake}` });

        if (hintIndex < currentQ.hints.length) {
          setDiagWeakness(`${currentQ.knowledge}概念待巩固`);
          setDiagPath('分步引导中...');
          setTimeout(() => {
            addMsg({ role: 'ai-step', text: `📝 引导提示 (${hintIndex + 1}/${currentQ.hints.length})\n\n${currentQ.hints[hintIndex]}\n\n试试重新算一下？` });
            setHintIndex(i => i + 1);
            setDiagConfidence(Math.min(diagConfidence + 40, 82));
            setAiThinking(false);
          }, 1000);
        } else {
          setDiagWeakness(`${currentQ.knowledge}→完整讲解`);
          setDiagPath('完整解析 → 下一题');
          setTimeout(() => {
            addMsg({ role: 'ai-step', text: `📝 完整解析\n\n让我带你一步步来：\n\n${currentQ.solution}\n\n所以正确答案是：${currentQ.correct_answer}` });
            setSolved(true);
            setDiagConfidence(87);
            setAiThinking(false);
          }, 1000);
        }
        return; // 避免下方 setAiThinking(false) 重复执行
      }
    }, 1500);
  };

  const nextQuestion = () => {
    if (qIndex < demoQuestions.length - 1) {
      const next = qIndex + 1;
      setQIndex(next);
      setSolved(false);
      setHintIndex(0);
      setDiagError('等待学生作答...');
      setDiagWeakness('—');
      setDiagPath('—');
      setDiagConfidence(0);
      setMessages([
        { role: 'system', text: `📋 题目：${demoQuestions[next].content}` },
        { role: 'ai', text: '新的一题！仔细读题，把答案告诉我吧 💪' },
      ]);
    }
  };

  const roleStyle = (role: string) => {
    const map: Record<string, { bg: string; border: string; align: string }> = {
      system: { bg: '#FEF9C3', border: '#FDE68A', align: 'center' },
      student: { bg: C.pinkLight, border: `${C.pink}40`, align: 'right' },
      ai: { bg: '#F3F4F6', border: '#E5E7EB', align: 'left' },
      'ai-diagnosis': { bg: '#FEF2F2', border: '#FECACA', align: 'left' },
      'ai-step': { bg: '#F0F9FF', border: '#BAE6FD', align: 'left' },
      'ai-success': { bg: '#ECFDF5', border: '#A7F3D0', align: 'left' },
    };
    return map[role] || map.ai;
  };

  const diagItems = [
    { label: '错因定位', value: diagError, color: '#EF4444' },
    { label: '知识缺陷', value: diagWeakness, color: '#F59E0B' },
    { label: '推荐路径', value: diagPath, color: '#10B981' },
  ];

  return (
    <section id="demo" className="py-24" style={{ backgroundColor: C.white }}>
      <div className="max-w-5xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.pink }}>
            Live Demo
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.ink }}>
            亲手体验 <span style={{ color: C.pink }}>AI 错因诊断</span>
          </h2>
          <p className="mt-3 text-sm" style={{ color: C.muted }}>
            输入你的答案，看 AI 如何实时诊断错因并分步引导你找到正确答案
          </p>
        </div>

        {/* 浏览器双栏布局 */}
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div
            className="rounded-2xl overflow-hidden shadow-2xl mx-auto"
            style={{
              maxWidth: 900,
              border: `1px solid ${C.border}`,
              backgroundColor: C.white,
            }}
          >
            {/* 浏览器顶栏 */}
            <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: '#F8FAFC', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="text-xs px-4 py-1.5 rounded-lg text-center" style={{ backgroundColor: C.base, color: C.light }}>
                  xiaodongai.cloud/demo
                </div>
              </div>
              {started && (
                <div className="flex gap-1 items-center">
                  {demoQuestions.map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: i < qIndex ? '#10B981' : i === qIndex ? C.pink : C.border,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 内容区：左右两栏 */}
            <div className="flex" style={{ minHeight: 520 }}>
              {/* ====== 左栏 — AI 诊断引擎（实时更新） ====== */}
              <div
                className="hidden md:flex flex-col w-[280px] flex-shrink-0 p-5 border-r"
                style={{ borderColor: C.border, backgroundColor: '#FAFBFF' }}
              >
                <div className="text-sm font-semibold mb-5 flex items-center gap-2" style={{ color: C.ink }}>
                  <span className="text-base">🧠</span> AI 诊断引擎
                </div>

                {/* 三个诊断卡片 */}
                <div className="space-y-3 flex-1">
                  {diagItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl p-3.5 transition-all duration-500"
                      style={{
                        backgroundColor: C.white,
                        border: `1px solid ${item.value !== '—' && !item.value.startsWith('等待') ? item.color + '30' : C.border}`,
                      }}
                    >
                      <div className="text-[11px] font-bold mb-1" style={{ color: item.color }}>
                        {item.label}
                      </div>
                      <div
                        className="text-xs font-medium transition-all duration-500"
                        style={{ color: item.value === '—' || item.value.startsWith('等待') ? C.light : C.ink }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 当前题目信息 */}
                {started && (
                  <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: C.pinkSoft, border: `1px solid ${C.pink}20` }}>
                    <div className="text-[10px] font-bold mb-1" style={{ color: C.pink }}>当前知识点</div>
                    <div className="text-xs font-medium" style={{ color: C.ink }}>{currentQ.knowledge}</div>
                  </div>
                )}

                {/* 诊断置信度 */}
                <div className="mt-4">
                  <div className="text-[11px] font-medium mb-1.5" style={{ color: C.light }}>诊断置信度</div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: C.border }}>
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${diagConfidence}%`,
                        background: `linear-gradient(90deg, ${C.pink}, #C084FC)`,
                      }}
                    />
                  </div>
                  <div className="text-right text-[11px] font-bold mt-1" style={{ color: C.pink }}>
                    {diagConfidence > 0 ? `${diagConfidence}%` : '—'}
                  </div>
                </div>

                {/* 题目进度 */}
                {started && (
                  <div className="mt-3 text-center text-[11px]" style={{ color: C.light }}>
                    第 {qIndex + 1} / {demoQuestions.length} 题
                  </div>
                )}
              </div>

              {/* ====== 右栏 — 互动课堂（可交互） ====== */}
              <div className="flex-1 flex flex-col">
                <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: '#FAFBFF' }}>
                  <span className="text-base">💬</span>
                  <span className="text-sm font-semibold" style={{ color: C.ink }}>互动课堂</span>
                  {started && (
                    <span className="ml-auto text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: C.pinkSoft, color: C.pink }}>
                      {currentQ.knowledge}
                    </span>
                  )}
                </div>

                {/* 对话区 */}
                <div
                  ref={chatRef}
                  className="flex-1 overflow-y-auto p-5 space-y-3"
                  style={{ backgroundColor: '#FAFBFF', maxHeight: 380 }}
                >
                  {!started ? (
                    /* 未开始：空状态 */
                    <div className="flex flex-col items-center justify-center h-full py-12 gap-4">
                      <div className="text-5xl">🤖</div>
                      <h3 className="text-base font-bold" style={{ color: C.ink }}>AI 错因诊断体验</h3>
                      <p className="text-sm text-center max-w-xs" style={{ color: C.muted }}>
                        3 道精选题目，体验 AI 如何诊断错因、分步引导、自适应推荐
                      </p>
                      <button
                        onClick={startDemo}
                        className="font-semibold px-8 py-3 rounded-xl transition-all text-sm text-white hover:opacity-90 hover:shadow-lg"
                        style={{ backgroundColor: C.pink }}
                      >
                        ▶️ 开始体验
                      </button>
                    </div>
                  ) : (
                    /* 已开始：对话列表 */
                    <>
                      {messages.map((msg, i) => {
                        const s = roleStyle(msg.role);
                        return (
                          <div key={i} className={`flex ${s.align === 'right' ? 'justify-end' : s.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                            <div
                              className="px-4 py-2.5 rounded-2xl text-sm max-w-[85%] whitespace-pre-wrap"
                              style={{
                                backgroundColor: s.bg,
                                border: `1px solid ${s.border}`,
                                color: C.ink,
                                animation: 'fadeInUp 0.3s ease-out',
                              }}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}

                      {/* AI 思考动画 */}
                      {aiThinking && (
                        <div className="flex justify-start">
                          <div className="px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F3F4F6' }}>
                            <div className="flex gap-1">
                              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: C.light, animationDelay: '0ms' }} />
                              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: C.light, animationDelay: '150ms' }} />
                              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: C.light, animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 下一题按钮 */}
                      {solved && qIndex < demoQuestions.length - 1 && (
                        <div className="flex justify-center pt-3">
                          <button
                            onClick={nextQuestion}
                            className="font-medium px-6 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90 hover:shadow-lg flex items-center gap-2"
                            style={{ backgroundColor: C.pink }}
                          >
                            下一题
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* 全部完成 */}
                      {solved && qIndex === demoQuestions.length - 1 && (
                        <div className="flex justify-center pt-3">
                          <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                            <div className="text-3xl mb-2">🎉</div>
                            <h3 className="font-bold text-sm mb-1" style={{ color: C.ink }}>全部完成！</h3>
                            <p className="text-xs mb-3" style={{ color: C.muted }}>你已经体验了 AI 错因诊断的完整流程</p>
                            <button
                              onClick={startDemo}
                              className="text-xs font-medium px-4 py-2 rounded-lg transition-all hover:opacity-90"
                              style={{ backgroundColor: C.pink, color: C.white }}
                            >
                              🔄 再来一遍
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* 输入框 */}
                {started && !solved && (
                  <div className="px-4 py-3" style={{ borderTop: `1px solid ${C.border}`, backgroundColor: C.white }}>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                        placeholder="输入你的答案..."
                        disabled={aiThinking}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-50"
                        style={{
                          border: `1px solid ${C.border}`,
                          backgroundColor: C.base,
                          color: C.ink,
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = C.pink; }}
                        onBlur={e => { e.currentTarget.style.borderColor = C.border; }}
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || aiThinking}
                        className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 hover:opacity-90"
                        style={{ backgroundColor: C.pink }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* 未开始时的底部提示 */}
                {!started && (
                  <div className="px-4 py-3 text-center" style={{ borderTop: `1px solid ${C.border}` }}>
                    <span className="text-xs" style={{ color: C.light }}>👆 点击上方按钮开始体验</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 三个特点 */}
        <div className="grid sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          {[
            { icon: '🔍', title: '错因诊断', desc: '不只判对错，实时分析为什么错' },
            { icon: '📝', title: '分步引导', desc: '像好老师一样逐步引导思考' },
            { icon: '🎯', title: '自适应路径', desc: '根据薄弱点智能推荐下一步' },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`text-center p-5 rounded-2xl transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{
                transitionDelay: `${i * 100 + 300}ms`,
                backgroundColor: C.cardBg,
                border: `1px solid ${C.border}`,
              }}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="text-sm font-bold mb-1" style={{ color: C.ink }}>{item.title}</h4>
              <p className="text-xs" style={{ color: C.muted }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Footer
   ============================================================ */

function Footer() {
  return (
    <footer className="py-10" style={{ backgroundColor: C.ink }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.pink }}>
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-sm font-semibold text-white">丁晓冬</span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>AI 自适应教育探索者</span>
          </div>
          <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            📧 ddingxiaodong@126.com
          </div>
        </div>
        <div className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          &copy; {new Date().getFullYear()} 丁晓冬 · xiaodongai.cloud
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   主页面
   ============================================================ */

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <JourneySection />
      <WorksSection />
      <DemoSection />
      <Footer />
    </>
  );
}
