import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { remarkWikiLink } from "./src/plugins/remark-wikilink.mjs";
import { remarkObsidianCallout } from "./src/plugins/remark-obsidian-callout.mjs";

// GitHub Pages 部署路径
const site = "https://bitorst.github.io";
const base = "/math-blog/";

export default defineConfig({
  site,
  base,
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkWikiLink,
      remarkObsidianCallout,
    ],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    // 允许从外部目录读取文件（用于读取 Obsidian vault）
    server: {
      fs: {
        allow: [".."],
      },
    },
  },
});
