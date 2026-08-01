# 夜轻二次元图片瀑布流

基于 [acg-list](https://github.com/Yeqingky/acg-list) 使用 React + TypeScript 重构的二次元图片瀑布流展示项目。

## 功能特性

- **瀑布流布局**:响应式多列布局(4 / 3 / 2 / 1 列自适应屏幕宽度)
- **无限滚动**:滚动到底部自动加载更多图片,真正无限浏览
- **图片懒加载**:图片接近视口时才加载真实资源,加载完成渐显
- **鼠标光效**:卡片鼠标跟随光效
- **Lightbox 预览**:点击查看大图,支持复制链接与下载原图
- **shadcn/ui**:基于 Radix UI 的现代组件库
- **SEO 优化**:完整的 meta 标签、Open Graph、结构化数据,直接由 CDN 返回静态 HTML

## 技术栈

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

## 快速开始

```bash
npm install
npm run dev
```

## 构建部署

```bash
npm run build
```

构建产物在 `dist/` 目录,可直接部署到任意静态托管/CDN(如 Cloudflare Pages、Vercel、Nginx 等)。

## 脚本

| 命令 | 说明 |
| ---- | ---- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run lint` | 运行 Oxlint 代码检查 |
| `npm run preview` | 预览生产构建 |

## 致谢 / 声明

本项目使用 **Gemini 3 Pro** + **GPT 5.4** 完成开发。

## 在线预览

[acg.yppp.net](https://acg.yppp.net)
