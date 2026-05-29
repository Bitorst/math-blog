/**
 * Remark plugin: 处理 Obsidian 风格的 Callouts
 *
 * > [!note] Short Title
 * > content with math $x^2$ etc.
 *
 * 支持的 callout 类型: note, info, warning, danger, tip, abstract, todo,
 *   success, question, failure, example, quote, important
 *
 * 转换为带有 class 的 blockquote:
 * <blockquote class="callout callout-note">...</blockquote>
 */

// 匹配 callout 标记 —— 仅匹配第一行（m 标志 + 水平空白），避免跨行误匹配
// 注意：不能用 \s（会匹配 \n），使用 [ \t] 限制在同行空白
const CALLOUT_RE = /^\[!(\w+)\](?:[ \t]+(.*))?$/m;

const VALID_TYPES = new Set([
  "note", "info", "warning", "danger", "tip",
  "abstract", "todo", "success", "question",
  "failure", "example", "quote", "important",
]);

const CALLOUT_LABELS = {
  note: "Note",       info: "Info",         warning: "Warning",
  danger: "Danger",   tip: "Tip",           abstract: "Abstract",
  todo: "Todo",       success: "Success",   question: "Question",
  failure: "Failure", example: "Example",   quote: "Quote",
  important: "Important",
};

const MAX_TITLE_LENGTH = 40;

export function remarkObsidianCallout() {
  return function (tree) {
    const newChildren = [];

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      if (node.type !== "blockquote") {
        newChildren.push(node);
        continue;
      }

      // First child of blockquote must be a paragraph
      const firstChild = node.children[0];
      if (!firstChild || firstChild.type !== "paragraph") {
        newChildren.push(node);
        continue;
      }

      // Search for a text node that starts with [!...] in the paragraph
      let calloutMatch = null;
      let matchIndex = -1;

      for (let k = 0; k < firstChild.children.length; k++) {
        const child = firstChild.children[k];
        if (child.type === "text") {
          const m = child.value.match(CALLOUT_RE);
          if (m && VALID_TYPES.has(m[1].toLowerCase())) {
            calloutMatch = m;
            matchIndex = k;
            break;
          }
        }
      }

      if (!calloutMatch) {
        newChildren.push(node);
        continue;
      }

      const calloutType = calloutMatch[1].toLowerCase();
      const afterMarker = (calloutMatch[2] || "").trim();
      const label = CALLOUT_LABELS[calloutType] || calloutType;

      // Determine if the text after [!type] is a title or content.
      // Heuristic:
      // 1. If the text node contains a newline: the first line is always the title
      //    (as long as it's short enough). Content follows on subsequent lines.
      // 2. If no newline: treat as title only when short AND no more children
      //    follow in the same paragraph. Otherwise it's content.
      const hasMoreNodes = matchIndex < firstChild.children.length - 1;
      const hasNewline = firstChild.children[matchIndex].value.includes("\n");

      let customTitle = "";
      if (afterMarker && afterMarker.length <= MAX_TITLE_LENGTH) {
        if (hasNewline || !hasMoreNodes) {
          customTitle = afterMarker;
        }
      }

      // Process the first paragraph: remove the callout marker line
      // (the [!type] prefix plus any optional title text on the same line).
      // Subsequent lines in the same text node are preserved as content.
      firstChild.children[matchIndex].value =
        firstChild.children[matchIndex].value.replace(CALLOUT_RE, "").trimStart();

      // If the text node is now empty, remove it
      if (!firstChild.children[matchIndex].value) {
        firstChild.children.splice(matchIndex, 1);
      }

      // Build callout children
      const calloutChildren = [];
      if (firstChild.children.length > 0) {
        calloutChildren.push(firstChild);
      }
      // Add remaining blockquote children
      for (let j = 1; j < node.children.length; j++) {
        calloutChildren.push(node.children[j]);
      }

      // Create callout wrapper
      const calloutNode = {
        type: "blockquote",
        data: {
          hProperties: {
            className: `callout callout-${calloutType}`,
          },
        },
        children: [
          {
            type: "paragraph",
            data: {
              hProperties: {
                className: "callout-title",
              },
            },
            children: [
              {
                type: "html",
                value: `<span class="callout-icon"></span><strong>${customTitle || label}</strong>`,
              },
            ],
          },
          ...calloutChildren,
        ],
      };

      newChildren.push(calloutNode);
    }

    tree.children = newChildren;
  };
}
