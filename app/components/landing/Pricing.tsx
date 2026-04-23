'use client';

import { useEffect, useRef, useState } from 'react';

const plans = [
  {
    name: '免费版',
    price: '¥0',
    period: '/月',
    description: '适合个人探索和学习使用',
    features: [
      'AI 诊断课堂 10 次/月',
      '1 个免费二级域名',
      '5 GB 云存储空间',
      '1 个免费建站模板',
      '社区支持',
    ],
    cta: '免费开始',
    popular: false,
    gradient: 'from-gray-600 to-gray-700',
  },
  {
    name: '专业版',
    price: '¥99',
    period: '/月',
    description: '适合个人创业者和小型团队',
    features: [
      'AI 诊断课堂无限次',
      '5 个自定义域名',
      '100 GB 云存储空间',
      '50+ 精美建站模板',
      '自定义域名绑定',
      'SSL 免费证书',
      '优先技术支持',
    ],
    cta: '立即升级',
    popular: true,
    gradient: 'from-blue-600 to-violet-600',
  },
  {
    name: '企业版',
    price: '¥399',
    period: '/月',
    description: '适合中大型企业和教育机构',
    features: [
      '所有专业版功能',
      '无限域名管理',
      '1 TB 云存储空间',
      '100+ 全部建站模板',
      'API 接口开放',
      '团队协作管理',
      '学情数据大屏',
      '专属客户经理',
      'SLA 99.99% 保障',
    ],
    cta: '联系销售',
    popular: false,
    gradient: 'from-violet-600 to-purple-600',
  },
];

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
            <span className="text-sm font-medium text-emerald-700">灵活定价</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
            选择适合你的方案
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            从免费版开始，随时按需升级。所有方案均含核心功能，无隐藏费用。
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              } ${
                plan.popular
                  ? 'border-blue-500 shadow-xl shadow-blue-500/10 scale-[1.02] lg:scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold rounded-full shadow-lg">
                    最受欢迎
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              <button
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>

              <div className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={plan.popular ? '#2563eb' : '#6b7280'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
