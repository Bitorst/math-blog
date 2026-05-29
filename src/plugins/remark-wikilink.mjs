/**
 * Remark plugin: 处理 Obsidian 风格的 WikiLinks
 *
 * - [[page]]           → 链接到 /blog/page
 * - [[page|alias]]     → 链接到 /blog/page，显示 alias
 * - [[page#section]]   → 链接到 /blog/page#section
 * - ![[image.png]]     → 嵌入图片
 * - ![[image.png|300]] → 嵌入图片并指定宽度
 */

import { visit } from "unist-util-visit";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fff\-]/g, "");
}

// 匹配 [[...]] 和 ![[...]]
const WIKILINK_RE = /!?\[\[([^\]]+)\]\]/g;

export function remarkWikiLink() {
  return function (tree, file) {
    visit(tree, "text", (node, index, parent) => {
      if (!node.value || typeof node.value !== "string") return;
      if (!node.value.includes("[[")) return;

      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = WIKILINK_RE.exec(node.value)) !== null) {
        // Push text before the match
        if (match.index > lastIndex) {
          parts.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }

        const isEmbed = match[0].startsWith("!");
        const inner = match[1];

        // Parse [[target|alias]] or [[target#fragment|alias]]
        let target = inner;
        let alias = "";
        let fragment = "";

        const pipeIdx = target.indexOf("|");
        if (pipeIdx !== -1) {
          alias = target.slice(pipeIdx + 1).trim();
          target = target.slice(0, pipeIdx).trim();
        }

        const hashIdx = target.indexOf("#");
        if (hashIdx !== -1) {
          fragment = target.slice(hashIdx + 1);
          target = target.slice(0, hashIdx);
        }

        if (isEmbed) {
          // Embedded image: ![[image.png]]
          const displayName = alias || target;
          parts.push({
            type: "paragraph",
            children: [
              {
                type: "image",
                url: `/images/${displayName}`,
                alt: displayName,
                title: alias || null,
              },
            ],
          });
        } else {
          // Regular wikilink
          const displayText = alias || target;
          const href = fragment
            ? `/blog/${slugify(target)}#${fragment}`
            : `/blog/${slugify(target)}`;

          parts.push({
            type: "link",
            url: href,
            children: [{ type: "text", value: displayText }],
          });
        }

        lastIndex = match.index + match[0].length;
      }

      // Push remaining text
      if (lastIndex < node.value.length) {
        parts.push({
          type: "text",
          value: node.value.slice(lastIndex),
        });
      }

      // Replace the text node with the parsed nodes
      if (parts.length > 0 && parent && typeof index === "number") {
        parent.children.splice(index, 1, ...parts);
      }
    });

    // After transforming, we need to keep visiting new text nodes
    // unist-util-visit handles this automatically
  };
}
