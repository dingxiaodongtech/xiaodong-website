'use client';

import { useEffect, useRef, useState } from 'react';

interface Feature {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  gradient: string;
  bgGradient: string;
  image: React.ReactNode;
}

const features: Feature[] = [
  {
    id: 'ai-education',
    icon: '🤖',
    title: 'AI 智能教育',
    subtitle: '错因驱动 · 自适应诊断',
    description: '基于人工智能的自适应学习系统，实时诊断学生知识薄弱点，提供个性化学习路径。支持多学科、多年级，让每个孩子都能高效学习。',
    highlights: ['AI 自适应诊断引擎', '错因驱动精准教学', '知识图谱可视化', '实时学情数据分析'],
    gradient: 'from-blue-600 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    image: (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden p-4">
        <div className="absolute top-3 left-3 flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-xs font-mono">&quot;phase&quot;:</span>
            <span className="text-green-400 text-xs font-mono">&quot;诊断中&quot;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-xs font-mono">&quot;student_level&quot;:</span>
            <span className="text-yellow-400 text-xs font-mono">0.72</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-xs font-mono">&quot;error_pattern&quot;:</span>
            <span className="text-red-400 text-xs font-mono">&quot;漏乘高度&quot;</span>
          </div>
          <div className="mt-4 bg-violet-500/10 border border-violet-500/30 rounded-lg p-3">
            <div className="text-violet-300 text-xs font-semibold mb-1">💡 教学策略</div>
            <div className="text-slate-400 text-xs">针对&quot;部分正确&quot;错因，启动分步讲解梯子...</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'domain',
    icon: '🌐',
    title: '域名管理',
    subtitle: '一键注册 · 智能解析',
    description: '提供域名注册、DNS 解析、SSL 证书一站式服务。支持主流后缀，智能推荐域名，让你快速拥有专属网址。',
    highlights: ['主流域名后缀支持', '智能 DNS 解析', '免费 SSL 证书', '域名交易市场'],
    gradient: 'from-violet-600 to-purple-500',
    bgGradient: 'from-violet-50 to-purple-50',
    image: (
      <div className="relative w-full h-48 sm:h-64 bg-white rounded-xl border border-gray-200 overflow-hidden p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg border border-violet-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm">🌐</div>
            <div>
              <div className="font-semibold text-sm text-gray-900">mysite.com</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                已解析 · SSL 已启用
              </div>
            </div>
            <div className="ml-auto text-xs text-violet-600 font-semibold">¥68/年</div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm">🔗</div>
            <div>
              <div className="font-semibold text-sm text-gray-900">mybrand.cn</div>
              <div className="text-xs text-yellow-600">等待解析...</div>
            </div>
            <div className="ml-auto text-xs text-gray-500 font-semibold">¥35/年</div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm">🏢</div>
            <div>
              <div className="font-semibold text-sm text-gray-900">startup.io</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                已解析
              </div>
            </div>
            <div className="ml-auto text-xs text-emerald-600 font-semibold">¥128/年</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'storage',
    icon: '☁️',
    title: '云存储',
    subtitle: '安全可靠 · 极速传输',
    description: '企业级云存储服务，支持文件上传、下载、分享和协作。自动备份，加密传输，让你的数据安全无忧。',
    highlights: ['大文件极速上传', '端到端加密', '文件版本管理', '团队协作分享'],
    gradient: 'from-emerald-600 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    image: (
      <div className="relative w-full h-48 sm:h-64 bg-white rounded-xl border border-gray-200 overflow-hidden p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-xs font-semibold text-gray-500">我的文件</div>
          <div className="ml-auto text-xs text-emerald-600 font-semibold">已用 12.3 GB / 100 GB</div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{width: '12.3%'}} />
        </div>
        <div className="space-y-2">
          {[
            { name: '项目方案.pdf', size: '2.4 MB', icon: '📄', color: 'bg-red-50 text-red-500' },
            { name: '产品设计稿.fig', size: '18.7 MB', icon: '🎨', color: 'bg-purple-50 text-purple-500' },
            { name: '团队照片/', size: '128 张', icon: '📁', color: 'bg-blue-50 text-blue-500' },
            { name: '数据备份.zip', size: '456 MB', icon: '📦', color: 'bg-amber-50 text-amber-500' },
          ].map((file) => (
            <div key={file.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${file.color}`}>{file.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                <div className="text-xs text-gray-400">{file.size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'website',
    icon: '🚀',
    title: '一键建站',
    subtitle: '模板丰富 · 极速上线',
    description: '无需编程知识，选择模板即可快速搭建专业网站。支持自定义域名、SEO 优化和数据分析，助力你的业务腾飞。',
    highlights: ['100+ 精美模板', '拖拽式页面编辑', '自动 SEO 优化', '多端自适应'],
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50',
    image: (
      <div className="relative w-full h-48 sm:h-64 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-2 gap-3 p-4">
          {[
            { name: '企业官网', tag: '热门', color: 'from-blue-500 to-blue-600' },
            { name: '电商商城', tag: '推荐', color: 'from-violet-500 to-purple-600' },
            { name: '个人博客', tag: '免费', color: 'from-emerald-500 to-green-600' },
            { name: '在线教育', tag: '新品', color: 'from-orange-500 to-red-600' },
          ].map((tpl) => (
            <div key={tpl.name} className="group cursor-pointer">
              <div className={`h-20 rounded-lg bg-gradient-to-br ${tpl.color} flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform`}>
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
                <span className="text-white text-xs font-semibold">{tpl.name}</span>
                <span className="absolute top-1.5 right-1.5 text-[10px] bg-white/20 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full font-medium">{tpl.tag}</span>
              </div>
              <div className="mt-1.5 text-xs font-medium text-gray-700 text-center">{tpl.name}模板</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isReversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      id={feature.id}
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Text */}
      <div className="flex-1 space-y-5">
        <div className="inline-flex items-center gap-2">
          <span className="text-3xl">{feature.icon}</span>
          <span className={`text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
            {feature.subtitle}
          </span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">{feature.title}</h3>
        <p className="text-gray-500 text-lg leading-relaxed">{feature.description}</p>
        <ul className="space-y-3">
          {feature.highlights.map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-700">
              <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              {item}
            </li>
          ))}
        </ul>
        <button className={`mt-2 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5`}>
          了解更多
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 w-full">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.bgGradient}`}>
          {feature.image}
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <span className="text-sm font-medium text-blue-700">四大核心模块</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
            一站式解决方案
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            从教育到建站，从域名到存储，我们为你提供完整的数字化工具链
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-24 lg:space-y-32">
          {features.map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
