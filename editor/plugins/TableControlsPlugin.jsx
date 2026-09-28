import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTextNode, $getNearestNodeFromDOMNode, $getNodeByKey } from 'lexical';
import {
  $insertTableColumnAtNode,
  $insertTableRowAtNode,
  $isTableCellNode,
  $isTableNode,
  TableCellHeaderStates,
} from '@lexical/table';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { $distributeTableColumns, measureTable } from '../nodes/tableLayout';

export const MAX_TABLE_COLUMNS = 7;
export const MAX_TABLE_ROWS = 10;

const HOVER_SLACK = 28; // px around the table that still counts as hovering it

function $tableSize(table) {
  const firstRow = table.getFirstChild();
  return { rows: table.getChildrenSize(), cols: firstRow ? firstRow.getChildrenSize() : 0 };
}

function relRect(el, anchor) {
  const r = el.getBoundingClientRect();
  const a = anchor.getBoundingClientRect();
  return { top: r.top - a.top, left: r.left - a.left, width: r.width, height: r.height };
}

// New header cells get a dummy label so the header row never looks broken.
function $labelNewHeaderCells(table) {
  const header = table.getFirstChild();
  if (!header) return;
  header.getChildren().forEach((cell, i) => {
    if (
      $isTableCellNode(cell) &&
      cell.hasHeaderState(TableCellHeaderStates.ROW) &&
      cell.getTextContent() === ''
    ) {
      const paragraph = cell.getFirstChild();
      if (paragraph) paragraph.append($createTextNode(`Header ${i + 1}`));
    }
  });
}

export default function TableControlsPlugin({ anchorElem }) {
  const [editor] = useLexicalComposerContext();
  const [hover, setHover] = useState(null); // { key, rect, rows, cols }
  const controlsRef = useRef(null);
  const hoverKey = useRef(null);

  const measure = useCallback(
    (key) => {
      const el = editor.getElementByKey(key);
      if (!el) return null;
      const table = el.tagName === 'TABLE' ? el : el.querySelector('table');
      return table ? relRect(table, anchorElem) : null;
    },
    [editor, anchorElem],
  );

  const readTable = useCallback(
    (key) => {
      let size = null;
      editor.getEditorState().read(() => {
        const node = $getNodeByKey(key);
        if ($isTableNode(node)) size = $tableSize(node);
      });
      const rect = size && measure(key);
      return rect ? { key, rect, ...size } : null;
    },
    [editor, measure],
  );

  /* --- hover detection for the + bars --- */
  useEffect(() => {
    const onMove = (e) => {
      if (!editor.isEditable()) return;
      if (controlsRef.current?.contains(e.target)) return;
      const tableEl = e.target.closest?.('.te-content table');
      if (tableEl) {
        let key = null;
        editor.read(() => {
          const node = $getNearestNodeFromDOMNode(tableEl);
          const table = $isTableNode(node) ? node : node && $findMatchingParent(node, $isTableNode);
          if (table) key = table.getKey();
        });
        if (key) {
          hoverKey.current = key;
          setHover(readTable(key));
          return;
        }
      }
      if (hoverKey.current) {
        const rect = measure(hoverKey.current);
        const a = anchorElem.getBoundingClientRect();
        const x = e.clientX - a.left;
        const y = e.clientY - a.top;
        const inside =
          rect &&
          x >= rect.left - 4 &&
          x <= rect.left + rect.width + HOVER_SLACK &&
          y >= rect.top - 4 &&
          y <= rect.top + rect.height + HOVER_SLACK;
        if (!inside) {
          hoverKey.current = null;
          setHover(null);
        }
      }
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, [editor, anchorElem, measure, readTable]);

  /* --- keep geometry in sync with edits --- */
  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(() => {
          if (hoverKey.current) setHover(readTable(hoverKey.current));
        }),
        editor.registerEditableListener((editable) => {
          if (!editable) setHover(null);
        }),
      ),
    [editor, readTable],
  );

  /* --- actions --- */
  const addColumn = () => {
    editor.update(() => {
      const table = $getNodeByKey(hover.key);
      if (!$isTableNode(table) || $tableSize(table).cols >= MAX_TABLE_COLUMNS) return;
      $insertTableColumnAtNode(table.getFirstChild().getLastChild(), true, false);
      $labelNewHeaderCells(table);
      const tableEl = editor.getElementByKey(hover.key);
      if (tableEl) {
        const { width, padX } = measureTable(tableEl);
        $distributeTableColumns(table, width, padX);
      }
    });
  };

  const addRow = () => {
    editor.update(() => {
      const table = $getNodeByKey(hover.key);
      if (!$isTableNode(table) || $tableSize(table).rows >= MAX_TABLE_ROWS) return;
      $insertTableRowAtNode(table.getLastChild().getFirstChild(), true);
    });
  };

  if (!hover) return null;

  const colsFull = hover.cols >= MAX_TABLE_COLUMNS;
  const rowsFull = hover.rows >= MAX_TABLE_ROWS;
  return createPortal(
    <div ref={controlsRef}>
      <button
        type="button"
        className="te-table-add te-table-add-col"
        style={{ top: hover.rect.top, left: hover.rect.left + hover.rect.width + 6, height: hover.rect.height }}
        disabled={colsFull}
        data-tip={colsFull ? `Maximum ${MAX_TABLE_COLUMNS} columns` : `Add column (${hover.cols}/${MAX_TABLE_COLUMNS})`}
        aria-label="Add column"
        onMouseDown={(e) => e.preventDefault()}
        onClick={addColumn}
      >
        +
      </button>
      <button
        type="button"
        className="te-table-add te-table-add-row"
        style={{ top: hover.rect.top + hover.rect.height + 6, left: hover.rect.left, width: hover.rect.width }}
        disabled={rowsFull}
        data-tip={rowsFull ? `Maximum ${MAX_TABLE_ROWS} rows` : `Add row (${hover.rows}/${MAX_TABLE_ROWS})`}
        aria-label="Add row"
        onMouseDown={(e) => e.preventDefault()}
        onClick={addRow}
      >
        +
      </button>
    </div>,
    anchorElem,
  );
}
