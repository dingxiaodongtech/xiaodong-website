'use client';

const features = [
  {
    icon: '🔍',
    title: 'AI 智能诊断',
    desc: '不只是判对错，AI 深入分析每道题的错因，找到知识漏洞的根源',
    details: ['错因自动分类', '知识点关联分析', '薄弱环节定位'],
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
  },
  {
    icon: '📝',
    title: '分步讲解引导',
    desc: '像优秀老师一样，一步一步引导孩子自己思考，而不是直接给答案',
    details: ['苏格拉底式提问', '梯度难度讲解', '思维过程可视化'],
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
  },
  {
    icon: '🎯',
    title: '自适应学习路径',
    desc: '根据每个孩子的学习情况，智能调整题目难度和学习顺序',
    details: ['个性化题目推荐', '难度动态调整', '学习路径优化'],
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
  },
  {
    icon: '📊',
    title: '学习数据追踪',
    desc: '家长和孩子都能看到详细的学习报告，了解进步轨迹',
    details: ['错题本自动归纳', '正确率趋势图', '知识点掌握度'],
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm text-blue-700 font-medium">核心功能</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            不只是<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">刷题</span>，
            是真正的<span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">理解</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            传统刷题只关注数量，智数AI 关注每道题背后的理解深度
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`${f.bg} rounded-3xl p-8 hover:shadow-lg transition-all group`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                  {f.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {f.details.map((d) => (
                      <span key={d} className="text-xs font-medium bg-white/80 text-gray-700 px-3 py-1.5 rounded-full border border-white shadow-sm">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
