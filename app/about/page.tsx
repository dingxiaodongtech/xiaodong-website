'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/home/Navbar';

/* ============================================================
   数据：丁晓冬的工作经历 & AI 自适应探索历程
   ============================================================ */

interface CareerNode {
  id: string;
  year: string;
  title: string;
  org: string;
  role: string;
  description: string;
  /** AI 自适应相关的探索内容 */
  aiExploration: string;
  /** 技能/关键词标签 */
  tags: string[];
  /** 节点颜色主题 */
  color: 'blue' | 'purple' | 'teal' | 'orange' | 'pink';
  /** 该阶段的核心 insight */
  insight: string;
  /** 动画延迟 ms */
  delay: number;
}

const careerData: CareerNode[] = [
  {
    id: 'teacher',
    year: '2014.05 - 2015.05',
    title: '一线教学启蒙',
    org: '新东方 · 小学数学教师',
    role: '一线教师',
    description:
      '积累丰富的一线个性化辅导经验，深度剖析小学生数学认知规律及学习痛点，为后续教研产品的研发奠定坚实的用户认知基础。',
    aiExploration:
      '在一线教学中发现：每个学生犯错的原因各不相同，传统"统一讲一遍"的方式无法解决个性化问题。开始思考"如何让每个孩子都能获得最适合自己的辅导"。',
    tags: ['一线教学', '个性化辅导', '学情分析', '数学认知规律'],
    color: 'blue',
    insight: '好的教育应该是"因材施教"，不是每个孩子都用同一种方法。',
    delay: 0,
  },
  {
    id: 'yiqizuoye',
    year: '2017.04 - 2018.03',
    title: '教研体系构建',
    org: '一起作业 · 课程设计',
    role: '课程设计师',
    description:
      '负责知识点-考法-解法体系搭建，并在各版本的课内知识树上进行体系挂载，优化题库推送。建立了在线考核机制与标准，打造了高质量的"打标签"团队，培养了超过50名高潜力实习生、兼职。',
    aiExploration:
      '搭建了"知识点→考法→解法"的底层教研体系，第一次把教研大纲转化为结构化、可计算的知识图谱——这正是后来 AI 自适应的数据基础。',
    tags: ['知识图谱', '题库体系', '考法-解法映射', '团队管理'],
    color: 'purple',
    insight: '教研的价值不是写教案，而是构建可被 AI 理解和使用的知识结构。',
    delay: 200,
  },
  {
    id: 'xueersi',
    year: '2019.04 - 2020.10',
    title: '自学产品从0到1',
    org: '好未来 · 小数教研',
    role: '教研负责人',
    description:
      '核心参与"海边自学"课程产品规划，全流程主导二年级产品线从0到成熟的建设，并持续驱动课程体系与教学内容的迭代优化。同时负责二至五年级小班自学课教学工作，深度践行个性化教学理念。',
    aiExploration:
      '在"海边自学"项目中首次探索自适应学习路径：根据学生做题数据动态调整推送内容。积累了丰富的一线学情数据与实战经验，验证了"数据驱动的个性化教学"的可行性。',
    tags: ['自学产品', '产品从0到1', '自适应路径', '学情数据', '个性化教学'],
    color: 'teal',
    insight: '自学产品的核心不是"让学生自己学"，而是"让AI成为每个学生的专属导师"。',
    delay: 400,
  },
  {
    id: 'xdf2',
    year: '2021.04 - 2022.11',
    title: 'AI 智能批改与错因溯源',
    org: '新东方 · 高级产品设计师',
    role: '高级产品设计师',
    description:
      '核心参与"嗡嗡队长AI家教"项目。深度拆解小学数学常见错因，辅助算法团队，将机器自动批改的准确率提升至80%。统筹构建"知识-解题-能力-思想"四维一体的底层教研体系，主导数学思想组的内容生产、质量审核与进度把控。',
    aiExploration:
      '深入AI产品一线，将抽象的教研大纲转化为AI听得懂的指令。构建了极细颗粒度的"知识-考法-思想-错因"图谱，让AI不仅能判断对错，还能溯源错因——这就是"诊断式AI教学"的雏形。',
    tags: ['AI批改', '错因溯源', '知识图谱', '嗡嗡队长AI家教', '产品设计'],
    color: 'orange',
    insight: '诊断"为什么错"比判断"对不对"有价值10倍——这是AI教育的灵魂。',
    delay: 600,
  },
  {
    id: 'yuanfudao',
    year: '2023.04 - 至今',
    title: 'AI 原生教学落地',
    org: '猿辅导 · 课程设计',
    role: '课程设计师 / AI工作流架构',
    description:
      '独立完成录题AI工作流：深度拆解教研SOP，构建专属知识库，跑通"试卷→JSON结构化→录题A/B方案"的AI工作流，同时开发可视化审核Miniapp提升教研录题效率。负责海豚AI学互动课从传统动画向大模型的升级，独立编写及调优底层Prompt，确保AI辅导的准确性与启发性。',
    aiExploration:
      '在猿辅导实现了AI教育的完整闭环：用LLM驱动对话式错因诊断，编写及调优底层Prompt确保AI辅导的准确性与启发性。负责动画视频课的大纲制定、逐字稿撰写与动效需求统筹，把控最终视频及上线物料的教研质量。',
    tags: ['LLM', 'Prompt Engineering', 'AI工作流', 'JSON结构化', '海豚AI学', '可视化审核'],
    color: 'pink',
    insight: 'AI不是替代老师，而是把"好老师的教学经验"编码为每个学生都能享受的智能辅导。',
    delay: 800,
  },
];

/* ============================================================
   AI 自适应探索过程动画节点
   ============================================================ */

interface ExplorationStep {
  label: string;
  detail: string;
  icon: string;
}

const explorationSteps: ExplorationStep[] = [
  { label: '一线教学', detail: '新东方小学数学·面对面辅导·发现每个孩子错因不同', icon: '👩‍🏫' },
  { label: '体系搭建', detail: '一起作业·知识点-考法-解法体系·题库结构化', icon: '🧩' },
  { label: '自学产品', detail: '好未来"海边自学"·从0到1·数据驱动个性化', icon: '📱' },
  { label: '错因图谱', detail: '新东方"嗡嗡队长AI家教"·知识-考法-思想-错因四维图谱', icon: '🔍' },
  { label: 'AI工作流', detail: '猿辅导·试卷→JSON结构化→录题AI方案', icon: '⚙️' },
  { label: 'LLM教学', detail: '海豚AI学·大模型驱动对话式诊断·Prompt调优', icon: '💬' },
  { label: '自适应落地', detail: 'AI诊断错因→分步引导→自适应推荐·完整闭环', icon: '🚀' },
];

/* ============================================================
   组件：可视化卡片（工作经历节点）
   ============================================================ */

function CareerCard({ node, index, isVisible }: { node: CareerNode; index: number; isVisible: boolean }) {
  const colorMap = {
    blue: {
      bg: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-200/60',
      dot: 'bg-blue-500',
      tag: 'bg-blue-50 text-blue-700 border-blue-200',
      glow: 'shadow-blue-500/20',
      accent: 'text-blue-600',
      line: 'from-blue-400 to-blue-600',
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-200/60',
      dot: 'bg-purple-500',
      tag: 'bg-purple-50 text-purple-700 border-purple-200',
      glow: 'shadow-purple-500/20',
      accent: 'text-purple-600',
      line: 'from-purple-400 to-purple-600',
    },
    teal: {
      bg: 'from-teal-500/10 to-teal-600/5',
      border: 'border-teal-200/60',
      dot: 'bg-teal-500',
      tag: 'bg-teal-50 text-teal-700 border-teal-200',
      glow: 'shadow-teal-500/20',
      accent: 'text-teal-600',
      line: 'from-teal-400 to-teal-600',
    },
    orange: {
      bg: 'from-orange-500/10 to-orange-600/5',
      border: 'border-orange-200/60',
      dot: 'bg-orange-500',
      tag: 'bg-orange-50 text-orange-700 border-orange-200',
      glow: 'shadow-orange-500/20',
      accent: 'text-orange-600',
      line: 'from-orange-400 to-orange-600',
    },
    pink: {
      bg: 'from-pink-500/10 to-pink-600/5',
      border: 'border-pink-200/60',
      dot: 'bg-pink-500',
      tag: 'bg-pink-50 text-pink-700 border-pink-200',
      glow: 'shadow-pink-500/20',
      accent: 'text-pink-600',
      line: 'from-pink-400 to-pink-600',
    },
  };

  const c = colorMap[node.color];
  const isLeft = index % 2 === 0;

  return (
    <div
      className={`relative flex items-start gap-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      style={{ transitionDelay: `${node.delay}ms` }}
    >
      {/* 卡片 */}
      <div
        className={`flex-1 bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:shadow-xl ${c.glow} transition-shadow duration-300 group`}
      >
        {/* 年份标签 */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${c.line} text-white shadow-sm`}>
            {node.year}
          </span>
          <span className={`text-sm font-medium ${c.accent}`}>{node.role}</span>
        </div>

        {/* 标题 */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{node.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{node.org}</p>

        {/* 描述 */}
        <p className="text-gray-700 leading-relaxed mb-4">{node.description}</p>

        {/* AI 探索 */}
        <div className="bg-white/60 rounded-xl p-4 mb-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <span className="text-sm font-semibold text-gray-800">AI 自适应探索</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{node.aiExploration}</p>
        </div>

        {/* Insight 引言 */}
        <div className={`flex items-start gap-2 mb-4 pl-3 border-l-2 border-dashed ${c.border}`}>
          <span className="text-sm">💡</span>
          <p className={`text-sm italic ${c.accent} font-medium`}>&ldquo;{node.insight}&rdquo;</p>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {node.tags.map((tag) => (
            <span key={tag} className={`text-xs px-2.5 py-1 rounded-full border ${c.tag} font-medium`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 时间轴圆点（桌面端） */}
      <div className="hidden md:flex flex-col items-center flex-shrink-0" style={{ width: 40 }}>
        <div className={`w-5 h-5 rounded-full ${c.dot} ring-4 ring-white shadow-lg z-10 group-hover:scale-125 transition-transform`} />
      </div>

      {/* 占位：另一侧 */}
      <div className="hidden md:block flex-1" />
    </div>
  );
}

/* ============================================================
   组件：AI 自适应探索过程动画
   ============================================================ */

function ExplorationFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % explorationSteps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  return (
    <div className="relative">
      {/* 流程连接线 */}
      <div className="flex items-center justify-between mb-8 px-4 overflow-x-auto">
        {explorationSteps.map((step, i) => (
          <div key={step.label} className="flex items-center flex-shrink-0">
            {/* 节点 */}
            <button
              onClick={() => {
                setActiveStep(i);
                setIsAutoPlay(false);
              }}
              className={`flex flex-col items-center gap-2 transition-all duration-500 cursor-pointer group ${
                i === activeStep ? 'scale-110' : i < activeStep ? 'opacity-70' : 'opacity-40'
              }`}
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 ${
                  i === activeStep
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/30 ring-4 ring-blue-200'
                    : i < activeStep
                    ? 'bg-gradient-to-br from-green-400 to-teal-500 shadow-md'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}
              >
                {i < activeStep ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>
              <span
                className={`text-xs font-medium text-center max-w-[80px] leading-tight ${
                  i === activeStep ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </button>

            {/* 连线 */}
            {i < explorationSteps.length - 1 && (
              <div className="w-8 md:w-12 h-0.5 mx-1 flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 rounded" />
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded transition-all duration-700 ${
                    i < activeStep ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 活跃步骤详情卡片 */}
      <div className="relative h-40">
        {explorationSteps.map((step, i) => (
          <div
            key={step.label}
            className={`absolute inset-0 transition-all duration-500 ${
              i === activeStep
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 border border-blue-100 text-center">
              <div className="text-4xl mb-3">{step.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{step.label}</h4>
              <p className="text-gray-600">{step.detail}</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                {explorationSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === activeStep ? 'bg-blue-500 w-6' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 自动/手动切换 */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="text-xs text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1"
        >
          {isAutoPlay ? (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              暂停自动播放
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              自动播放
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   组件：技能雷达图（纯 CSS）
   ============================================================ */

function SkillRadar() {
  const skills = [
    { name: '小学数学教研', level: 96, color: 'from-blue-400 to-blue-600' },
    { name: '错因诊断体系', level: 94, color: 'from-purple-400 to-purple-600' },
    { name: 'AI Prompt 设计', level: 90, color: 'from-teal-400 to-teal-600' },
    { name: '知识图谱构建', level: 92, color: 'from-orange-400 to-orange-600' },
    { name: '课程产品设计', level: 95, color: 'from-pink-400 to-pink-600' },
    { name: 'AI工作流搭建', level: 88, color: 'from-indigo-400 to-indigo-600' },
  ];

  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <div key={skill.name} className="group">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-700">{skill.name}</span>
            <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">{skill.level}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   主页面
   ============================================================ */

export default function AboutPage() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            setVisibleCards((prev) => {
              const next = new Set(Array.from(prev));
              next.add(idx);
              return next;
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    const cards = timelineRef.current?.querySelectorAll('[data-index]');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* 头像 */}
            <div className="flex-shrink-0">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-xl shadow-purple-500/20">
                <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center">
                  <span className="text-6xl md:text-7xl">👩‍💻</span>
                </div>
              </div>
            </div>

            {/* 基本信息 */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                丁晓冬
                <span className="ml-3 text-lg font-normal text-gray-400">Xiaodong Ding</span>
              </h1>
              <p className="text-lg text-gray-500 mb-4">
                10年+ K12教研老兵 · AI自适应教育探索者 · 新东方/好未来/猿辅导核心教研
              </p>
              <p className="text-gray-600 leading-relaxed max-w-xl">
                拥有新东方、好未来、猿辅导10年+核心教研经验。从一线授课出发，懂数学、懂学生错因、懂教研体系如何落地为AI互动产品。
                深入业务一线的"AI架构师"——能将抽象的教研大纲转化为AI听得懂的指令。
              </p>

              {/* 社交链接 */}
              <div className="flex items-center gap-3 mt-5 justify-center md:justify-start">
                <a
                  href="https://xiaodongai.cloud"
                  target="_blank"
                  rel="noopener"
                  className="text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  xiaodongai.cloud
                </a>
                <Link
                  href="/courses"
                  className="text-sm font-medium text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  查看课程
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI 自适应探索过程 */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-sm font-semibold mb-4 border border-blue-100">
              AI 自适应探索之路
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              从一线教学到 AI 原生教育
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              从新东方一线教学到猿辅导AI工作流，10年+探索如何用技术让教育因材施教
            </p>
          </div>

          <ExplorationFlow />
        </div>
      </section>

      {/* 工作经历时间轴 */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white" ref={timelineRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-50 to-blue-50 text-teal-600 text-sm font-semibold mb-4 border border-teal-100">
              工作经历
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              从一线教学到 AI 教育，每一步都在回答同一个问题
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              &ldquo;如何让每个孩子都能获得最适合自己的学习体验？&rdquo;
            </p>
          </div>

          {/* 时间轴中线（桌面端） */}
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 via-teal-200 to-pink-200 -translate-x-1/2" />

            <div className="space-y-8 md:space-y-12">
              {careerData.map((node, i) => (
                <div key={node.id} data-index={i}>
                  <CareerCard node={node} index={i} isVisible={visibleCards.has(i)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 技能 & 数据 */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 技能 */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span> 核心能力
              </h3>
              <SkillRadar />
            </div>

            {/* 核心数据 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">🎯</span> 关键数据
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: '10+', label: '年 K12 教研经验', icon: '🗓️' },
                  { num: '3', label: '家头部教育公司', icon: '🏫' },
                  { num: '9', label: '个年级课程覆盖', icon: '📚' },
                  { num: '50+', label: '名实习生培养', icon: '👥' },
                  { num: '80%', label: 'AI批改准确率', icon: '🤖' },
                  { num: '∞', label: '教育热情', icon: '❤️' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-4 bg-white/60 rounded-xl">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {item.num}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            所有功能完全免费，欢迎体验！
          </h2>
          <p className="text-blue-100 mb-8">
            AI 诊断错因 · 分步引导学习 · 自适应推荐 —— 无限次使用，随时试用
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/courses"
              className="text-sm font-medium bg-white text-blue-600 px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              开始学习（免费）
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-white border border-white/30 px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
            >
              返回首页
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} 丁晓冬 · xiaodongai.cloud · 智数AI
        </p>
      </footer>
    </>
  );
}
