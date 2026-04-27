'use client';

export default function DemoSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800" id="demo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-900/50 border border-blue-700/50 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-blue-300 font-medium">实时演示</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            看 AI 如何<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">自学 Demo 课</span>并引导学习
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            点击播放，观看 AI 如何像优秀老师一样，一步步引导学生理解数学概念
          </p>
        </div>

        <div className="w-full h-[85vh] max-h-[800px] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
          <iframe 
            src="/demo/AI%E6%99%BA%E8%83%BD%E8%AF%8A%E6%96%AD%E8%87%AA%E5%AD%A6demo%E8%AF%BE.html"
            className="w-full h-full"
            style={{ border: 'none' }}
            title="AI智能诊断自学Demo课"
          />
        </div>
      </div>
    </section>
  );
}
