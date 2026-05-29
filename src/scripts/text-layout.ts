/**
 * Pretext 文本排版 —— 在客户端使用 Pretext 预测量文章内容高度，
 * 防止 web font 加载期间的 CLS（Cumulative Layout Shift）。
 *
 * @chenglou/pretext 是纯 TypeScript 文本测量库，不触碰 DOM，
 * 通过 Canvas measureText + Intl.Segmenter 实现精确的文本排版计算。
 */
import { prepare, layout } from "@chenglou/pretext";

/** CSS font shorthand used by the blog body text */
const BODY_FONT = '18px "Source Serif 4", Georgia, "Times New Roman", serif';

/**
 * 对指定容器内的文本内容进行 Pretext 预测量，
 * 并设置 min-height 防止字体切换时的布局抖动。
 */
function stabilizeContainer(selector: string): void {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el?.textContent) return;

  const text = el.textContent.trim();
  if (!text) return;

  const containerWidth = el.clientWidth;
  if (containerWidth <= 0) return;

  // Step 1: 分析字体度量（只做一次，结果可缓存）
  const prepared = prepare(text, BODY_FONT);

  // Step 2: 按容器宽度计算文本高度
  const lineHeight = 1.7 * 18; // CSS line-height * font-size
  const { height } = layout(prepared, containerWidth, lineHeight);

  // 设置最小高度防止 CLS
  el.style.minHeight = `${Math.ceil(height)}px`;
}

/** 页面加载完成后，对文章内容进行稳定化处理 */
function init(): void {
  if (typeof document === "undefined") return;

  // 等待字体加载完成后再做最终测量（可选，此时 min-height 已防止抖动）
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      stabilizeContainer(".post-content");
    });
  }

  // 立即设置初步的 min-height（使用系统后备字体测量）
  stabilizeContainer(".post-content");
}

init();
