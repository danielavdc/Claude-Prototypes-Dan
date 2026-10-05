import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTextNode, $getNodeByKey, $getSelection, $isRangeSelection, $setSelection } from 'lexical';
import {
  $createTableSelection,
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $insertTableColumnAtNode,
  $insertTableRowAtNode,
  $isTableCellNode,
  $isTableNode,
  $isTableSelection,
  TableCellHeaderStates,
} from '@lexical/table';
import { $dfs, $findMatchingParent } from '@lexical/utils';
import { $distributeTableColumns, measureTable } from '../nodes/tableLayout';

export const MAX_TABLE_COLUMNS = 7;
// Default fill of header cells (no colour of their own) — editor, picker and export.
export const HEADER_CELL_COLOR = '#DFF0EF';

export function $tableSize(table) {
  const firstRow = table.getFirstChild();
  return { rows: table.getChildrenSize(), cols: firstRow ? firstRow.getChildrenSize() : 0 };
}

function relRect(el, anchor) {
  const r = el.getBoundingClientRect();
  const a = anchor.getBoundingClientRect();
  return { top: r.top - a.top, left: r.left - a.left, width: r.width, height: r.height };
}

const $cellKeys = (table) =>
  table.getChildren().flatMap((row) => row.getChildren().map((cell) => cell.getKey()));

// Cells added by the + bars never start empty: header cells read "Header N" (N = column),
// every other cell "Your cell" — also when the table no longer has a header row.
// Only cells that didn't exist before (`existing`) are labelled; cells the user emptied stay empty.
export function $labelNewCells(table, existing) {
  table.getChildren().forEach((row) =>
    row.getChildren().forEach((cell, i) => {
      if (!$isTableCellNode(cell) || existing.has(cell.getKey()) || cell.getTextContent() !== '') return;
      const paragraph = cell.getFirstChild();
      if (!paragraph) return;
      const isHeader = cell.hasHeaderState(TableCellHeaderStates.ROW);
      paragraph.append($createTextNode(isHeader ? `Header ${i + 1}` : 'Your cell'));
    }),
  );
}

// Re-spread columns after the structure changes (keeps resized cell images hugging their column).
export function $relayoutTable(editor, table) {
  const tableEl = editor.getElementByKey(table.getKey());
  if (!tableEl) return;
  const { width, padX } = measureTable(tableEl);
  $distributeTableColumns(table, width, padX);
}

// Arrow on the column / row handle: points to where its menu opens (down for a column, right for
// a row). Not a six-dot grip — that would read as "drag to reorder", which tables don't support.
function Grip({ vertical }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={vertical ? { transform: 'rotate(-90deg)' } : undefined}
    >
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
    </svg>
  );
}

function tableElementOf(editor, key) {
  const el = editor.getElementByKey(key);
  return el && (el.tagName === 'TABLE' ? el : el.querySelector('table'));
}

/*
 * - "+" bars to add a column (right) and a row (below) — always shown on every table, in space
 *   the table reserves for them (see .te-table in styles.css), so they never cover what follows.
 * - The cell holding the caret gets a focus outline.
 * - Notion-style handles: hovering a cell (or having the caret in it) shows an arrow handle on the
 *   top edge of its column and on the left edge of its row. Clicking a grip selects that whole
 *   column/row (so the toolbar styles it in bulk) and opens a menu to delete it.
 */
export default function TableControlsPlugin({ anchorElem }) {
  const [editor] = useLexicalComposerContext();
  const [tables, setTables] = useState([]); // [{ key, rect, rows, cols }]
  const [active, setActive] = useState(null); // caret cell: { tableKey, row, col }
  const [hover, setHover] = useState(null); // hovered cell: { tableKey, row, col }
  const [menu, setMenu] = useState(null); // { tableKey, kind: 'row' | 'col', index }
  const [bulkRect, setBulkRect] = useState(null);
  const [, setTick] = useState(0);
  const menuWrapRef = useRef(null);
  const focusedCell = useRef(null);

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
      if (table) {
        const row = cell.getParent();
        current = { cellKey: cell.getKey(), tableKey: table.getKey(), row: row.getIndexWithinParent(), col: cell.getIndexWithinParent() };
      }
    });

    // Focus state on the caret's cell.
    const cellEl = current && editor.getElementByKey(current.cellKey);
    if (focusedCell.current && focusedCell.current !== cellEl) focusedCell.current.classList.remove('te-td-focus');
    if (cellEl) cellEl.classList.add('te-td-focus');
    focusedCell.current = cellEl || null;
    setActive(cellEl ? current : null);

    setTables(
      found
        .map((t) => {
          const tableEl = tableElementOf(editor, t.key);
          return tableEl ? { ...t, rect: relRect(tableEl, anchorElem) } : null;
        })
        .filter(Boolean),
    );
    setTick((n) => n + 1);
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
      focusedCell.current?.classList.remove('te-td-focus');
    };
  }, [editor, measure]);

  // Hover tracking: which cell is under the pointer (the grips themselves keep it alive).
  useEffect(() => {
    let timer = null;
    const clear = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setHover(null), 120);
    };
    const onMove = (e) => {
      if (e.target.closest?.('.te-tbl-grip')) {
        clearTimeout(timer);
        return;
      }
      const cellEl = e.target.closest?.('td, th');
      const root = editor.getRootElement();
      if (!cellEl || !root?.contains(cellEl)) {
        clear();
        return;
      }
      clearTimeout(timer);
      const tableEl = cellEl.closest('table');
      const tableKey = tables.find((t) => tableElementOf(editor, t.key) === tableEl)?.key;
      if (!tableKey) return;
      const row = cellEl.parentElement.rowIndex;
      const col = cellEl.cellIndex;
      setHover((h) => (h && h.tableKey === tableKey && h.row === row && h.col === col ? h : { tableKey, row, col }));
    };
    anchorElem.addEventListener('mousemove', onMove);
    anchorElem.addEventListener('mouseleave', clear);
    return () => {
      clearTimeout(timer);
      anchorElem.removeEventListener('mousemove', onMove);
      anchorElem.removeEventListener('mouseleave', clear);
    };
  }, [editor, anchorElem, tables]);

  const addColumn = (key) => {
    editor.update(() => {
      const table = $getNodeByKey(key);
      if (!$isTableNode(table) || $tableSize(table).cols >= MAX_TABLE_COLUMNS) return;
      const existing = new Set($cellKeys(table));
      $insertTableColumnAtNode(table.getFirstChild().getLastChild(), true, false);
      $labelNewCells(table, existing);
      $relayoutTable(editor, table);
    });
  };

  const addRow = (key) => {
    editor.update(() => {
      const table = $getNodeByKey(key);
      if (!$isTableNode(table)) return; // rows are unlimited
      const existing = new Set($cellKeys(table));
      $insertTableRowAtNode(table.getLastChild().getFirstChild(), true);
      $labelNewCells(table, existing);
    });
  };

  // Bulk-selected cells keep their highlight even while a toolbar menu (e.g. a colour input)
  // has focus — Lexical drops its own highlight when the editor blurs. One outline is drawn
  // around the whole selection.
  useEffect(() => {
    let marked = [];
    const paint = (editorState) => {
      const keys = editorState.read(() => {
        const selection = $getSelection();
        return $isTableSelection(selection) ? selection.getNodes().filter($isTableCellNode).map((n) => n.getKey()) : [];
      });
      const els = keys.map((k) => editor.getElementByKey(k)).filter(Boolean);
      marked.forEach((el) => !els.includes(el) && el.classList.remove('te-td-bulk'));
      els.forEach((el) => el.classList.add('te-td-bulk'));
      marked = els;
      if (els.length === 0) {
        setBulkRect(null);
        return;
      }
      const rects = els.map((el) => relRect(el, anchorElem));
      const top = Math.min(...rects.map((r) => r.top));
      const left = Math.min(...rects.map((r) => r.left));
      const bottom = Math.max(...rects.map((r) => r.top + r.height));
      const right = Math.max(...rects.map((r) => r.left + r.width));
      setBulkRect({ top, left, width: right - left, height: bottom - top });
    };
    paint(editor.getEditorState());
    const unregister = editor.registerUpdateListener(({ editorState }) => paint(editorState));
    return () => {
      unregister();
      marked.forEach((el) => el.classList.remove('te-td-bulk'));
    };
  }, [editor, anchorElem]);

  // Close the grip menu on outside click / Escape.
  useEffect(() => {
    if (!menu) return undefined;
    const onDown = (e) => {
      if (!menuWrapRef.current?.contains(e.target)) setMenu(null);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setMenu(null);
      editor.focus();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menu, editor]);

  // Selects a whole column / row as a table selection.
  const $selectLine = (tableKey, kind, index) => {
    const table = $getNodeByKey(tableKey);
    if (!$isTableNode(table)) return false;
    const rows = table.getChildren();
    const first = kind === 'col' ? rows[0]?.getChildAtIndex(index) : rows[index]?.getFirstChild();
    const last = kind === 'col' ? rows[rows.length - 1]?.getChildAtIndex(index) : rows[index]?.getLastChild();
    if (!first || !last) return false;
    const selection = $createTableSelection();
    selection.set(tableKey, first.getKey(), last.getKey());
    $setSelection(selection);
    return true;
  };

  const openGrip = (tableKey, kind, index) => {
    if (menu && menu.tableKey === tableKey && menu.kind === kind && menu.index === index) {
      setMenu(null);
      return;
    }
    editor.update(() => $selectLine(tableKey, kind, index));
    setMenu({ tableKey, kind, index });
  };

  const deleteLine = () => {
    const target = menu;
    setMenu(null);
    if (!target) return;
    editor.update(() => {
      if (!$selectLine(target.tableKey, target.kind, target.index)) return;
      const table = $getNodeByKey(target.tableKey);
      if (target.kind === 'row') $deleteTableRowAtSelection();
      else {
        $deleteTableColumnAtSelection();
        if ($isTableNode(table) && table.isAttached()) $relayoutTable(editor, table);
      }
    });
    setHover(null);
    editor.focus();
  };

  // Focus the first menu item when the menu opens (keyboard users land in it).
  useEffect(() => {
    if (menu) menuWrapRef.current?.querySelector('.te-cell-menu-item:not(:disabled)')?.focus();
  }, [menu]);

  if (tables.length === 0) return null;

  // Grips follow the menu's line, else the hovered cell, else the caret's cell.
  const target = menu ? null : hover || active;
  const grips = [];
  const addGrips = (tableKey, row, col, only) => {
    const tableEl = tableElementOf(editor, tableKey);
    const cellEl = tableEl?.rows[row]?.cells[col];
    const t = tables.find((x) => x.key === tableKey);
    if (!cellEl || !t) return;
    const c = relRect(cellEl, anchorElem);
    if (only !== 'row') {
      grips.push({ kind: 'col', tableKey, index: col, total: t.cols, top: t.rect.top - 7, left: c.left + c.width / 2 - 12 });
    }
    if (only !== 'col') {
      grips.push({ kind: 'row', tableKey, index: row, total: t.rows, top: c.top + c.height / 2 - 12, left: t.rect.left - 7 });
    }
  };
  if (menu) {
    addGrips(menu.tableKey, menu.kind === 'row' ? menu.index : 0, menu.kind === 'col' ? menu.index : 0, menu.kind);
  } else if (target) {
    addGrips(target.tableKey, target.row, target.col);
  }

  return createPortal(
    <>
      {tables.map((t) => {
        const colsFull = t.cols >= MAX_TABLE_COLUMNS;
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
              data-tip="Add row"
              aria-label="Add row"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addRow(t.key)}
            >
              +
            </button>
          </div>
        );
      })}

      {bulkRect && <div className="te-tbl-bulk-outline" style={bulkRect} aria-hidden="true" />}

      {grips.map((g) => {
        const open = !!menu && menu.kind === g.kind && menu.index === g.index && menu.tableKey === g.tableKey;
        const label = g.kind === 'col' ? `Column ${g.index + 1} options` : `Row ${g.index + 1} options`;
        return (
          <div
            key={`${g.kind}-${g.tableKey}`}
            ref={open ? menuWrapRef : undefined}
            className={`te-tbl-grip-wrap is-${g.kind}`}
            style={{ top: g.top, left: g.left }}
          >
            <button
              type="button"
              className={`te-tbl-grip is-${g.kind}${open ? ' is-open' : ''}`}
              aria-label={label}
              title={label}
              aria-haspopup="menu"
              aria-expanded={open}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => openGrip(g.tableKey, g.kind, g.index)}
            >
              <Grip vertical={g.kind === 'row'} />
            </button>
            {open && (
              <div className={`te-cell-menu is-${g.kind}`} role="menu" aria-label={label}>
                <button
                  type="button"
                  role="menuitem"
                  className="te-cell-menu-item"
                  disabled={g.total <= 1}
                  title={g.total <= 1 ? `Can't delete the only ${g.kind === 'col' ? 'column' : 'row'}` : undefined}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={deleteLine}
                >
                  {g.kind === 'col' ? 'Delete column' : 'Delete row'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </>,
    anchorElem,
  );
}
