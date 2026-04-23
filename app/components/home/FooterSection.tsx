import Link from 'next/link';

export default function FooterSection() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">智</span>
              </div>
              <span className="text-xl font-bold text-white">智数AI</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              面向小学到初中的数学 AI 自适应学习平台，让每个孩子找到适合自己的学习节奏。
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">产品</h4>
            <div className="space-y-3">
              <Link href="/courses" className="block text-sm hover:text-white transition-colors">课程中心</Link>
              <Link href="#features" className="block text-sm hover:text-white transition-colors">AI 诊断</Link>
              <Link href="#demo" className="block text-sm hover:text-white transition-colors">在线体验</Link>
              <Link href="/about" className="block text-sm hover:text-white transition-colors">关于我</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">支持</h4>
            <div className="space-y-3">
              <Link href="#" className="block text-sm hover:text-white transition-colors">帮助中心</Link>
              <Link href="#" className="block text-sm hover:text-white transition-colors">常见问题</Link>
              <Link href="#" className="block text-sm hover:text-white transition-colors">联系我们</Link>
              <Link href="#" className="block text-sm hover:text-white transition-colors">意见反馈</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">联系方式</h4>
            <div className="space-y-3 text-sm">
              <div>📧 contact@zhishu-ai.com</div>
              <div>📱 微信公众号：智数AI</div>
              <div className="pt-2">
                <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1.5 rounded-lg">
                  客服工作时间：周一至周五 9:00-18:00
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            &copy; 2025 智数AI. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link href="#" className="hover:text-gray-400 transition-colors">用户协议</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">隐私政策</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">备案号</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
