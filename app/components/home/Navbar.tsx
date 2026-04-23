'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">智</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              智数AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
              课程中心
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
              AI诊断
            </Link>
            <Link href="#demo" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
              体验Demo
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
              价格方案
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
              关于我
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30"
            >
              免费体验
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
            <div className="flex flex-col gap-3">
              <Link href="/courses" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                课程中心
              </Link>
              <Link href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                AI诊断
              </Link>
              <Link href="#demo" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                体验Demo
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                价格方案
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                关于我
              </Link>
              <div className="flex gap-2 mt-2">
                <Link href="/login" className="flex-1 text-center text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  登录
                </Link>
                <Link href="/register" className="flex-1 text-center text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 rounded-xl">
                  免费体验
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
