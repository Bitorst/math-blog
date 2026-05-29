/**
 * 博客全局配置
 */

export const BLOG_CONFIG = {
  title: "Math Blog",
  description: "数学笔记与思考",
  author: "Author",
  lang: "zh-CN",
  /** Obsidian vault 路径（相对于项目根目录的绝对路径） */
  obsidianVaultPath: "",
  /** 每页显示文章数 */
  postsPerPage: 10,
  /** 日期格式 */
  dateFormat: "YYYY-MM-DD",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于" },
] as const;
