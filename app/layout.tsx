import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '丁晓冬 — AI 自适应教育探索者',
  description:
    '10年+ K12教研经验，历经新东方、好未来、猿辅导。专注AI自适应教育，擅长知识图谱构建、错因诊断体系、AI工作流搭建。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="antialiased" style={{ backgroundColor: '#F5F7FC', color: '#0A0A0A' }}>
        {children}
      </body>
    </html>
  );
}
