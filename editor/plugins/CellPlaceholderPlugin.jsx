import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const CELL_PLACEHOLDER = 'Write or add image';

const isEmptyCellParagraph = (p) =>
  p.childNodes.length === 1 && p.firstChild.nodeName === 'BR' && p.parentElement?.matches('td, th');

/*
 * The empty-cell hint ("Write or add image") uses as many lines as the row's height allows —
 * a row made taller by a neighbour's text gives it room — and is only truncated when it still
 * doesn't fit. Truncated hints get `data-ph-truncated`, which shows the full text on hover (CSS).
 * Lines are passed to CSS through `--ph-lines` (used by -webkit-line-clamp).
 */
export default function CellPlaceholderPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const root = editor.getRootElement();
    if (!root) return undefined;

    const measurer = document.createElement('div');
    measurer.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;top:0;white-space:normal;';
    measurer.textContent = CELL_PLACEHOLDER;
    document.body.appendChild(measurer);

    let tracked = new Set();

    const measure = () => {
      const next = new Set();
      root.querySelectorAll('td > p, th > p').forEach((p) => {
        if (!isEmptyCellParagraph(p) || p.parentElement.childElementCount !== 1) return;
        next.add(p);
        const td = p.parentElement;
        const tdStyle = getComputedStyle(td);
        const pStyle = getComputedStyle(p);
        const lineHeight = parseFloat(pStyle.lineHeight) || 22;
        const available =
          td.clientHeight - parseFloat(tdStyle.paddingTop) - parseFloat(tdStyle.paddingBottom);
        const lines = Math.max(1, Math.floor((available + 1) / lineHeight));

        measurer.style.font = pStyle.font;
        measurer.style.lineHeight = pStyle.lineHeight;
        measurer.style.width = `${p.clientWidth}px`;
        const needed = Math.max(1, Math.round(measurer.scrollHeight / lineHeight));

        p.style.setProperty('--ph-lines', String(lines));
        if (needed > lines) p.setAttribute('data-ph-truncated', '');
        else p.removeAttribute('data-ph-truncated');
      });
      tracked.forEach((p) => {
        if (next.has(p)) return;
        p.style.removeProperty('--ph-lines');
        p.removeAttribute('data-ph-truncated');
      });
      tracked = next;
    };

    measure();
    const observer = new ResizeObserver(() => measure());
    observer.observe(root);
    const unregister = editor.registerUpdateListener(() => requestAnimationFrame(measure));
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      unregister();
      window.removeEventListener('resize', measure);
      measurer.remove();
    };
  }, [editor]);

  return null;
}
