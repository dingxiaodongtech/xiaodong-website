const footerLinks = {
  产品: ['AI 智能教育', '域名管理', '云存储', '一键建站', '企业解决方案'],
  资源: ['帮助中心', 'API 文档', '开发者社区', '产品更新日志', '系统状态'],
  公司: ['关于我们', '加入我们', '新闻动态', '合作伙伴', '联系我们'],
  法律: ['用户协议', '隐私政策', 'Cookie 政策', '安全白皮书'],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-gray-800">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">智云一站通</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              AI教育 · 域名 · 云存储 · 建站
              <br />
              你的一站式数字化平台
            </p>
            <div className="flex gap-3">
              {['微信', '微博', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} 智云一站通. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              系统正常运行
            </span>
            <span>·</span>
            <span>ICP备案号: 京ICP备XXXXXXXX号</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
