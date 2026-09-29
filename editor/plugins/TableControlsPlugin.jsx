import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTextNode, $getNodeByKey, $getSelection, $isRangeSelection } from 'lexical';
import {
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $insertTableColumnAtNode,
  $insertTableRowAtNode,
  $isTableCellNode,
  $isTableNode,
  TableCellHeaderStates,
} from '@lexical/table';
import { $dfs, $findMatchingParent } from '@lexical/utils';
import { $distributeTableColumns, measureTable } from '../nodes/tableLayout';

export const MAX_TABLE_COLUMNS = 7;
export const MAX_TABLE_ROWS = 10;

export function $tableSize(table) {
  const firstRow = table.getFirstChild();
  return { rows: table.getChildrenSize(), cols: firstRow ? firstRow.getChildrenSize() : 0 };
}

function relRect(el, anchor) {
  const r = el.getBoundingClientRect();
  const a = anchor.getBoundingClientRect();
  return { top: r.top - a.top, left: r.left - a.left, width: r.width, height: r.height };
}

// New header cells get a dummy label so the header row never looks broken.
export function $labelNewHeaderCells(table) {
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

// Re-spread columns after the structure changes (keeps resized cell images hugging their column).
export function $relayoutTable(editor, table) {
  const tableEl = editor.getElementByKey(table.getKey());
  if (!tableEl) return;
  const { width, padX } = measureTable(tableEl);
  $distributeTableColumns(table, width, padX);
}

// "+" bars to add a column (right) and a row (below) — always shown on every table, in space the
// table reserves for them (see .te-table in styles.css), so they never cover what comes next.
export default function TableControlsPlugin({ anchorElem }) {
  const [editor] = useLexicalComposerContext();
  const [tables, setTables] = useState([]); // [{ key, rect, rows, cols }]
  const [active, setActive] = useState(null); // cell holding the caret: { tableKey, rect, rows, cols }
  const [menuOpen, setMenuOpen] = useState(false);
  const cellMenuRef = useRef(null);

  const measure = useCallback(() => {
    if (!editor.isEditable() || anchorElem.closest('[hidden]')) {
      setTables([]);
      setActive(null);
      return;
    }
    const found = [];
    let current = null;
    editor.getEditorState().read(() => {
      $dfs().forEach(({ node }) => {
        if ($isTableNode(node)) found.push({ key: node.getKey(), ...$tableSize(node) });
      });
      const selection = $getSelection();
      const cell = $isRangeSelection(selection) && $findMatchingParent(selection.anchor.getNode(), $isTableCellNode);
      const table = cell && $findMatchingParent(cell, $isTableNode);
      if (table) current = { cellKey: cell.getKey(), tableKey: table.getKey(), ...$tableSize(table) };
    });
    const cellEl = current && editor.getElementByKey(current.cellKey);
    setActive(cellEl ? { ...current, rect: relRect(cellEl, anchorElem) } : null);
    if (!cellEl) setMenuOpen(false);
    setTables(
      found
        .map((t) => {
          const el = editor.getElementByKey(t.key);
          const tableEl = el && (el.tagName === 'TABLE' ? el : el.querySelector('table'));
          return tableEl ? { ...t, rect: relRect(tableEl, anchorElem) } : null;
        })
        .filter(Boolean),
    );
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

  const addColumn = (key) => {
    editor.update(() => {
      const table = $getNodeByKey(key);
      if (!$isTableNode(table) || $tableSize(table).cols >= MAX_TABLE_COLUMNS) return;
      $insertTableColumnAtNode(table.getFirstChild().getLastChild(), true, false);
      $labelNewHeaderCells(table);
      $relayoutTable(editor, table);
    });
  };

  const addRow = (key) => {
    editor.update(() => {
      const table = $getNodeByKey(key);
      if (!$isTableNode(table) || $tableSize(table).rows >= MAX_TABLE_ROWS) return;
      $insertTableRowAtNode(table.getLastChild().getFirstChild(), true);
    });
  };

  // Close the cell menu on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => {
      if (!cellMenuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Delete the row / column holding the caret (never the last one).
  const deletePart = (which) => {
    setMenuOpen(false);
    editor.update(() => {
      const table = active && $getNodeByKey(active.tableKey);
      if (!$isTableNode(table)) return;
      if (which === 'row') $deleteTableRowAtSelection();
      else {
        $deleteTableColumnAtSelection();
        $relayoutTable(editor, table);
      }
    });
    editor.focus();
  };

  if (tables.length === 0) return null;

  return createPortal(
    <>
      {tables.map((t) => {
        const colsFull = t.cols >= MAX_TABLE_COLUMNS;
        const rowsFull = t.rows >= MAX_TABLE_ROWS;
        return (
          <div key={t.key}>
            <button
              type="button"
              className="te-table-add te-table-add-col"
              style={{ top: t.rect.top, left: t.rect.left + t.rect.width + 6, height: t.rect.height }}
              disabled={colsFull}
              data-tip={colsFull ? `Maximum ${MAX_TABLE_COLUMNS} columns` : `Add column (${t.cols}/${MAX_TABLE_COLUMNS})`}
              aria-label="Add column"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addColumn(t.key)}
            >
              +
            </button>
            <button
              type="button"
              className="te-table-add te-table-add-row"
              style={{ top: t.rect.top + t.rect.height + 6, left: t.rect.left, width: t.rect.width }}
              disabled={rowsFull}
              data-tip={rowsFull ? `Maximum ${MAX_TABLE_ROWS} rows` : `Add row (${t.rows}/${MAX_TABLE_ROWS})`}
              aria-label="Add row"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addRow(t.key)}
            >
              +
            </button>
          </div>
        );
      })}

      {/* Lexical-style chevron in the active cell → delete row / column */}
      {active && (
        <div
          ref={cellMenuRef}
          className="te-cell-menu-wrap"
          style={{ top: active.rect.top + active.rect.height / 2 - 11, left: active.rect.left + active.rect.width - 30 }}
        >
          <button
            type="button"
            className={`te-cell-menu-btn${menuOpen ? ' is-open' : ''}`}
            aria-label="Cell options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
            </svg>
          </button>
          {menuOpen && (
            <div className="te-cell-menu" role="menu">
              <button
                type="button"
                role="menuitem"
                className="te-cell-menu-item"
                disabled={active.rows <= 1}
                title={active.rows <= 1 ? "Can't delete the only row" : undefined}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => deletePart('row')}
              >
                Delete row
              </button>
              <button
                type="button"
                role="menuitem"
                className="te-cell-menu-item"
                disabled={active.cols <= 1}
                title={active.cols <= 1 ? "Can't delete the only column" : undefined}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => deletePart('column')}
              >
                Delete column
              </button>
            </div>
          )}
        </div>
      )}
    </>,
    anchorElem,
  );
}
