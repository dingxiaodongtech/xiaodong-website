'use client';

import Link from 'next/link';

const grades = [
  { name: '一年级', emoji: '🌱', topics: ['认识数字', '10以内加减', '图形认知'], color: 'from-green-400 to-emerald-500', bg: 'bg-green-50', border: 'border-green-100' },
  { name: '二年级', emoji: '🌿', topics: ['100以内加减', '乘法口诀', '长度单位'], color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { name: '三年级', emoji: '🌳', topics: ['多位数运算', '分数初步', '面积计算'], color: 'from-teal-400 to-cyan-500', bg: 'bg-teal-50', border: 'border-teal-100' },
  { name: '四年级', emoji: '📐', topics: ['大数认识', '三角形', '小数运算'], color: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-50', border: 'border-cyan-100' },
  { name: '五年级', emoji: '📊', topics: ['分数运算', '体积计算', '方程初步'], color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  { name: '六年级', emoji: '🔢', topics: ['百分数', '圆的面积', '比和比例'], color: 'from-indigo-400 to-violet-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { name: '初一', emoji: '📈', topics: ['有理数', '一元一次方程', '几何初步'], color: 'from-violet-400 to-purple-500', bg: 'bg-violet-50', border: 'border-violet-100' },
  { name: '初二', emoji: '📏', topics: ['实数', '一次函数', '勾股定理'], color: 'from-purple-400 to-fuchsia-500', bg: 'bg-purple-50', border: 'border-purple-100' },
  { name: '初三', emoji: '🎯', topics: ['二次函数', '相似三角形', '概率统计'], color: 'from-fuchsia-400 to-pink-500', bg: 'bg-fuchsia-50', border: 'border-fuchsia-100' },
];

export default function GradeSection() {
  return (
    <section className="py-20 bg-gray-50/50" id="grades">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm text-purple-700 font-medium">小学一年级 ~ 初三</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            覆盖 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">9 个年级</span> 全部数学知识点
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            每个年级都有精心设计的题目库和 AI 自适应学习路径，根据孩子的薄弱环节智能推荐练习
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {grades.map((grade) => (
            <Link
              key={grade.name}
              href="/courses"
              className={`group ${grade.bg} ${grade.border} border rounded-2xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{grade.emoji}</span>
                <h3 className="text-lg font-bold text-gray-900">{grade.name}</h3>
                <svg className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2">
                {grade.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs bg-white/80 text-gray-600 px-2.5 py-1 rounded-lg border border-white"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
