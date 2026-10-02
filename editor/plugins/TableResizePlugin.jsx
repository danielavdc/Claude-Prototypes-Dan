import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import { $isTableNode } from '@lexical/table';
import { $dfs } from '@lexical/utils';
import {
  $columnImageWidths,
  $setManualColumnWidths,
  IMAGE_CELL_PAD,
  MIN_COLUMN_WIDTH,
  MIN_ROW_HEIGHT,
} from '../nodes/tableLayout';

const HANDLE = 8;

function tableElementOf(editor, key) {
  const el = editor.getElementByKey(key);
  return el && (el.tagName === 'TABLE' ? el : el.querySelector('table'));
}

/*
 * Drag to resize table columns and rows, like the column layout dividers.
 * - Column borders: width moves between the two neighbours (the table keeps its width); no column
 *   goes below MIN_COLUMN_WIDTH, or below a resized image it holds.
 * - Row bottom borders: the row gets taller/shorter, never below MIN_ROW_HEIGHT (and never below
 *   its content — the table grows a row to fit what's in it).
 */
export default function TableResizePlugin({ anchorElem }) {
  const [editor] = useLexicalComposerContext();
  const [handles, setHandles] = useState([]); // [{ id, kind, key, index, left, top, width, height }]
  const [dragging, setDragging] = useState(null);
  const drag = useRef(null);

  const measure = useCallback(() => {
    if (!editor.isEditable() || anchorElem.closest('[hidden]')) {
      setHandles([]);
      return;
    }
    const keys = [];
    editor.getEditorState().read(() => {
      $dfs().forEach(({ node }) => $isTableNode(node) && keys.push(node.getKey()));
    });
    const a = anchorElem.getBoundingClientRect();
    const next = [];
    keys.forEach((key) => {
      const tableEl = tableElementOf(editor, key);
      if (!tableEl || !tableEl.rows[0]) return;
      const t = tableEl.getBoundingClientRect();
      const cells = [...tableEl.rows[0].cells];
      for (let i = 0; i < cells.length - 1; i += 1) {
        const x = cells[i].getBoundingClientRect().right;
        next.push({ id: `${key}-c${i}`, kind: 'col', key, index: i, left: x - a.left - HANDLE / 2, top: t.top - a.top, width: HANDLE, height: t.height });
      }
      [...tableEl.rows].forEach((row, i) => {
        const y = row.getBoundingClientRect().bottom;
        next.push({ id: `${key}-r${i}`, kind: 'row', key, index: i, left: t.left - a.left, top: y - a.top - HANDLE / 2, width: t.width, height: HANDLE });
      });
    });
    setHandles(next);
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

  const onDown = (h) => (e) => {
    e.preventDefault();
    const tableEl = tableElementOf(editor, h.key);
    if (!tableEl) return;
    const d = { ...h, x: e.clientX, y: e.clientY, started: false };
    if (h.kind === 'col') {
      d.widths = [...tableEl.rows[0].cells].map((c) => c.getBoundingClientRect().width);
      // A column holding a resized image can't get narrower than that image.
      let images = [];
      editor.getEditorState().read(() => {
        const table = $getNodeByKey(h.key);
        if ($isTableNode(table)) images = $columnImageWidths(table);
      });
      d.mins = d.widths.map((_, i) => Math.max(MIN_COLUMN_WIDTH, images[i] ? images[i] + IMAGE_CELL_PAD : 0));
    } else {
      d.height = tableEl.rows[h.index].getBoundingClientRect().height;
    }
    drag.current = d;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(h.id);
  };

  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const opts = d.started ? { tag: 'history-merge' } : undefined;
    if (d.kind === 'col') {
      const widths = [...d.widths];
      const pair = widths[d.index] + widths[d.index + 1];
      const left = Math.min(pair - d.mins[d.index + 1], Math.max(d.mins[d.index], widths[d.index] + e.clientX - d.x));
      widths[d.index] = left;
      widths[d.index + 1] = pair - left;
      editor.update(() => {
        const table = $getNodeByKey(d.key);
        if ($isTableNode(table)) $setManualColumnWidths(table, widths);
      }, opts);
    } else {
      const height = Math.max(MIN_ROW_HEIGHT, d.height + e.clientY - d.y);
      editor.update(() => {
        const table = $getNodeByKey(d.key);
        const row = $isTableNode(table) && table.getChildAtIndex(d.index);
        if (row) row.setHeight(Math.round(height));
      }, opts);
    }
    d.started = true;
  };

  const onUp = (e) => {
    if (!drag.current) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    drag.current = null;
    setDragging(null);
  };

  if (handles.length === 0) return null;

  return createPortal(
    <>
      {handles.map((h) => (
        <div
          key={h.id}
          className={`te-tbl-resize is-${h.kind}${dragging === h.id ? ' is-dragging' : ''}`}
          style={{ left: h.left, top: h.top, width: h.width, height: h.height }}
          role="separator"
          aria-orientation={h.kind === 'col' ? 'vertical' : 'horizontal'}
          aria-label={h.kind === 'col' ? 'Drag to resize columns' : 'Drag to resize row'}
          title={h.kind === 'col' ? 'Drag to resize columns' : 'Drag to resize row'}
          onPointerDown={onDown(h)}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      ))}
    </>,
    anchorElem,
  );
}
