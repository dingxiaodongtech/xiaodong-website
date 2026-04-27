---
name: "website-maintainer"
description: "维护丁晓冬个人网站(xiaodong.tech)的完整工作流。Invoke when user wants to update the website, deploy changes, or modify any page content."
---

# 网站维护助手

## 概述

本 Skill 涵盖了维护丁晓冬个人网站的完整工作流程，包括代码修改、Git 操作、GitHub 推送和 Vercel 部署。

## 技术栈

- **框架**: Next.js 16 + React 19 + TypeScript 5
- **样式**: Tailwind CSS v4
- **部署**: Vercel (自动部署)
- **仓库**: GitHub (dingxiaodongtech/xiaodong-website)

## 项目结构

```
wg8tcsgrfxr8-master/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── works/page.tsx     # 作品集页面
│   ├── demo/page.tsx      # Demo 体验页
│   └── lab/page.tsx       # 实验室页面
├── public/                # 静态资源
│   ├── *.html            # 互动课件
│   └── videos/           # 视频文件
└── .trae/skills/         # Skill 目录
```

## 页面说明

### 1. 首页 (`app/page.tsx`)
- 个人介绍 + 视频展示
- 导航到作品集、Demo、实验室

### 2. 作品集 (`app/works/page.tsx`)
包含 4 个作品展示：
- **作品1**: 自适应诊断 Demo（AI 教育核心项目）
- **作品2**: AI 智能录题引擎（Agent/Harness + 4个 Skill）
- **作品3**: 数学互动课件合集（6个本地 HTML 课件）
- **作品4**: AI 教育探索合集

### 3. Demo 页 (`app/demo/page.tsx`)
- 嵌入 iframe 展示自适应诊断 Demo
- 标题已改为"自适应诊断 Demo 体验"

### 4. 实验室 (`app/lab/page.tsx`)
- 实验性功能展示

## 互动课件文件

以下 HTML 文件位于 `public/` 目录，在作品3中引用：
- `还原几何体.html`
- `交换律对对碰.html`
- `九九乘法了个羊.html`
- `巧数图形.html`
- `余数大富翁.html`
- `乘法口诀图鉴.html`

## 标准工作流程

### 1. 修改代码
- 编辑对应的 `.tsx` 或 `.html` 文件
- 运行 `npm run build` 验证无错误

### 2. 提交到 Git
```bash
# 添加所有变更
git add -A

# 提交（使用有意义的提交信息）
git commit -m "feat: 描述修改内容"

# 推送到 GitHub（使用 SSH）
git push origin main
```

### 3. 自动部署
- Vercel 会自动检测 GitHub 推送
- 自动重新部署网站
- 约 1-2 分钟后生效

## SSH 配置（已配置好）

SSH 密钥已添加到 GitHub，无需重复配置：
- 私钥: `~/.ssh/id_ed25519`
- 公钥: `~/.ssh/id_ed25519.pub`
- 远程地址: `git@github.com:dingxiaodongtech/xiaodong-website.git`

## 常见问题

### 推送失败
如果 `git push` 失败：
1. 检查网络连接
2. 确认使用 SSH 地址: `git remote -v`
3. 如需要，重新设置: `git remote set-url origin git@github.com:dingxiaodongtech/xiaodong-website.git`

### 构建失败
运行 `npm run build` 检查错误，常见原因：
- TypeScript 类型错误
- 缺少依赖（运行 `npm install`）

### 部署后未更新
- 检查 Vercel Dashboard 的部署日志
- 确认代码已推送到 main 分支

## 设计规范

### 颜色系统
```typescript
const C = {
  base: '#F5F7FC',      // 背景色
  ink: '#0A0A0A',       // 主文字
  muted: '#6B7280',     // 次要文字
  pink: '#FA7EA0',      // 品牌色（强调）
  white: '#FFFFFF',
  border: '#E8ECF4',
};
```

### 动画效果
- 使用 `useInView` hook 实现滚动渐入
- 过渡时间: 500-1000ms
- 缓动函数: ease-out

### 响应式断点
- 移动端: < 768px
- 平板: 768px - 1024px
- 桌面: > 1024px

## 更新历史

- **2025-04-27**: 重构作品集页面，添加6个互动课件
- **2025-04-27**: 修复视频播放和视角问题
- **2025-04-27**: 配置 SSH 免密推送
