import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import { $dfs } from '@lexical/utils';
import { $isLayoutContainerNode } from '../nodes/LayoutNodes';

export const MIN_LAYOUT_COLUMN = 30; // narrow enough for a social icon (signatures)
const HANDLE_WIDTH = 10;

// Draggable dividers between the columns of a column layout. Dragging moves width from one
// neighbour to the other (never below MIN_LAYOUT_COLUMN); the result is stored as fr values in the
// layout's grid template, so preview/export keep the proportions.
export default function ColumnResizePlugin({ anchorElem }) {
  const [editor] = useLexicalComposerContext();
  const [dividers, setDividers] = useState([]); // [{ id, key, index, left, top, height }]
  const [dragging, setDragging] = useState(null);
  const drag = useRef(null);

  const measure = useCallback(() => {
    if (!editor.isEditable() || anchorElem.closest('[hidden]')) {
      setDividers([]);
      return;
    }
    const keys = [];
    editor.getEditorState().read(() => {
      $dfs().forEach(({ node }) => $isLayoutContainerNode(node) && keys.push(node.getKey()));
    });
    const a = anchorElem.getBoundingClientRect();
    const next = [];
    keys.forEach((key) => {
      const el = editor.getElementByKey(key);
      if (!el) return;
      const cols = [...el.children].filter((c) => c.classList.contains('te-column'));
      const box = el.getBoundingClientRect();
      for (let i = 0; i < cols.length - 1; i += 1) {
        const left = cols[i].getBoundingClientRect().right;
        const right = cols[i + 1].getBoundingClientRect().left;
        next.push({
          id: `${key}-${i}`,
          key,
          index: i,
          left: (left + right) / 2 - a.left - HANDLE_WIDTH / 2,
          top: box.top - a.top,
          height: box.height,
        });
      }
    });
    setDividers(next);
  }, [editor, anchorElem]);

  useEffect(() => {
    measure();
    const root = editor.getRootElement();
    const observer = new ResizeObserver(() => measure());
    if (root) observer.observe(root);
    const unregister = editor.registerUpdateListener(() => measure());
    const unregisterEditable = editor.registerEditableListener(() => measure());
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      unregister();
      unregisterEditable();
      window.removeEventListener('resize', measure);
    };
  }, [editor, measure]);

  const onDown = (d) => (e) => {
    e.preventDefault();
    const el = editor.getElementByKey(d.key);
    if (!el) return;
    const widths = [...el.children]
      .filter((c) => c.classList.contains('te-column'))
      .map((c) => c.getBoundingClientRect().width);
    drag.current = { ...d, x: e.clientX, widths, started: false };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(d.id);
  };

  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const widths = [...d.widths];
    const pair = widths[d.index] + widths[d.index + 1];
    const leftWidth = Math.min(pair - MIN_LAYOUT_COLUMN, Math.max(MIN_LAYOUT_COLUMN, widths[d.index] + e.clientX - d.x));
    widths[d.index] = leftWidth;
    widths[d.index + 1] = pair - leftWidth;
    const template = widths.map((w) => `${Math.round(w)}fr`).join(' ');
    editor.update(
      () => {
        const node = $getNodeByKey(d.key);
        if ($isLayoutContainerNode(node)) node.setTemplateColumns(template);
      },
      d.started ? { tag: 'history-merge' } : undefined,
    );
    d.started = true;
  };

  const onUp = (e) => {
    if (!drag.current) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    drag.current = null;
    setDragging(null);
  };

  if (dividers.length === 0) return null;

  return createPortal(
    <>
      {dividers.map((d) => (
        <div
          key={d.id}
          className={`te-col-resize${dragging === d.id ? ' is-dragging' : ''}`}
          style={{ left: d.left, top: d.top, height: d.height, width: HANDLE_WIDTH }}
          role="separator"
          aria-orientation="vertical"
          aria-label="Drag to resize columns"
          title="Drag to resize columns"
          onPointerDown={onDown(d)}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      ))}
    </>,
    anchorElem,
  );
}
