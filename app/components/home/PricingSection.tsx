'use client';

import Link from 'next/link';

const plans = [
  {
    name: '体验版',
    price: '免费',
    period: '',
    desc: '3 次 AI 诊断体验',
    features: [
      '3 次 AI 诊断机会',
      '基础题目库',
      '即时错因分析',
      '分步讲解引导',
    ],
    disabled: ['学习进度追踪', '错题本', '完整题库', '个性化学习路径'],
    cta: '立即体验',
    href: '/register',
    popular: false,
    gradient: '',
    bg: 'bg-white',
    border: 'border-gray-200',
  },
  {
    name: '学期卡',
    price: '¥99',
    period: '/学期',
    desc: '一个学期无限学习',
    features: [
      '无限 AI 诊断',
      '完整题库 5000+ 题',
      '个性化学习路径',
      '学习进度追踪',
      '错题本自动归纳',
      '知识点掌握报告',
    ],
    disabled: [],
    cta: '开通学期卡',
    href: '/pricing',
    popular: true,
    gradient: 'from-blue-500 to-purple-600',
    bg: 'bg-gradient-to-br from-blue-500 to-purple-600',
    border: 'border-blue-500',
  },
  {
    name: '年卡',
    price: '¥168',
    period: '/年',
    desc: '全年畅学，省 30%',
    features: [
      '学期卡全部功能',
      '跨年级学习',
      '家长数据报告',
      'AI 学习规划师',
      '优先客服支持',
      '新功能优先体验',
    ],
    disabled: [],
    cta: '开通年卡',
    href: '/pricing',
    popular: false,
    gradient: '',
    bg: 'bg-white',
    border: 'border-gray-200',
  },
];

export default function PricingSection() {
  return (
    <section className="py-20" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm text-green-700 font-medium">透明定价</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            先<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">免费体验</span>，满意再付费
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            3 次免费体验机会，让孩子亲身感受 AI 诊断的效果
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 ${plan.popular ? plan.bg + ' text-white shadow-2xl shadow-blue-500/25 scale-105' : plan.bg + ' border ' + plan.border + ' hover:shadow-lg'} transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full shadow-md">
                  最受欢迎
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                  {plan.desc}
                </p>
              </div>

              <Link
                href={plan.href}
                className={`block w-full text-center font-semibold py-3 rounded-xl transition-all ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md shadow-blue-500/20'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <svg className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-blue-200' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm ${plan.popular ? 'text-blue-50' : 'text-gray-700'}`}>{f}</span>
                  </div>
                ))}
                {plan.disabled.map((f) => (
                  <div key={f} className="flex items-center gap-2 opacity-40">
                    <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-400">{f}</span>
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
