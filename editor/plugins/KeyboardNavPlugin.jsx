import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createNodeSelection,
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isDecoratorNode,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  createCommand,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
} from 'lexical';
import { $isListItemNode, $isListNode } from '@lexical/list';
import { $isTableCellNode, $isTableNode } from '@lexical/table';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { $isLayoutContainerNode, $isLayoutItemEmpty, $isLayoutItemNode } from '../nodes/LayoutNodes';

// Asks ColumnPlaceholdersPlugin to open the "Add Element" menu of an empty column (payload: column key).
export const OPEN_COLUMN_MENU_COMMAND = createCommand('OPEN_COLUMN_MENU_COMMAND');

/*
 * Keyboard access for the non-text elements (dividers, images, tables, column layouts).
 *
 * The document is walked as a list of "stops", in reading order:
 *  - a text block (paragraph, heading, quote, list item) → caret
 *  - a divider / image → selected as a whole (focus outline)
 *  - a table → each of its cells, row by row → caret in the cell
 *  - a column layout with no content yet → the layout as a whole (focus outline)
 *  - a column layout with content → column by column, each block in it; an empty column is one
 *    stop (its "Add Element" box gets the focus outline)
 * ↓ / ↑ move to the next / previous stop once the caret is on the last / first line, so ↓ from
 * the line above a table lands right in its first cell and walks every cell before leaving.
 *
 * Esc on a cell or inside a layout selects the whole table / layout; with a table, layout,
 * column, divider or image selected, Delete/Backspace removes it and Enter goes inside.
 */

const isContainer = (node) => $isTableNode(node) || $isLayoutContainerNode(node) || $isLayoutItemNode(node);

function $buildStops() {
  const stops = [];
  const visit = (node, inLayout) => {
    if ($isTableNode(node)) {
      node.getChildren().forEach((row) =>
        row.getChildren().forEach((cell) => stops.push({ kind: 'cell', key: cell.getKey(), special: true })),
      );
      return;
    }
    if ($isLayoutContainerNode(node)) {
      const items = node.getChildren().filter($isLayoutItemNode);
      if (items.every($isLayoutItemEmpty)) {
        stops.push({ kind: 'node', key: node.getKey(), special: true });
        return;
      }
      items.forEach((item) => {
        if ($isLayoutItemEmpty(item)) stops.push({ kind: 'node', key: item.getKey(), special: true });
        else item.getChildren().forEach((child) => visit(child, true));
      });
      return;
    }
    if ($isDecoratorNode(node)) {
      stops.push({ kind: 'node', key: node.getKey(), special: inLayout });
      return;
    }
    if ($isListNode(node)) {
      node.getChildren().forEach((li) => {
        const nested = $isListItemNode(li) && li.getChildren().find($isListNode);
        if (nested) visit(nested, inLayout);
        else stops.push({ kind: 'text', key: li.getKey(), special: inLayout });
      });
      return;
    }
    if ($isElementNode(node)) stops.push({ kind: 'text', key: node.getKey(), special: inLayout });
  };
  $getRoot().getChildren().forEach((child) => visit(child, false));
  return stops;
}

// Where the selection is in the stop list: { from, to } (a selected table/layout spans its stops).
function $position(selection, stops) {
  const index = new Map(stops.map((s, i) => [s.key, i]));
  if ($isRangeSelection(selection)) {
    let node = selection.anchor.getNode();
    while (node) {
      if (index.has(node.getKey())) {
        const i = index.get(node.getKey());
        return { from: i, to: i, range: true };
      }
      node = node.getParent();
    }
    return null;
  }
  if ($isNodeSelection(selection)) {
    let [node] = selection.getNodes();
    if (!node) return null;
    // A column of an all-empty layout isn't a stop of its own: ↑ / ↓ leave the whole layout.
    if ($isLayoutItemNode(node) && !index.has(node.getKey())) node = node.getParent();
    if (index.has(node.getKey())) {
      const i = index.get(node.getKey());
      return { from: i, to: i, node };
    }
    // A selected table / layout whose stops are its cells / blocks.
    let from = -1;
    let to = -1;
    stops.forEach((s, i) => {
      const n = $getNodeByKey(s.key);
      if (n && node.isParentOf(n)) {
        if (from < 0) from = i;
        to = i;
      }
    });
    return from < 0 ? null : { from, to, node };
  }
  return null;
}

// Is the caret on the first / last line of the stop? (Only then do ↑ / ↓ leave it.)
function caretAtEdge(editor, stop, edge) {
  const el = editor.getElementByKey(stop.key);
  if (!el) return true;
  const target = stop.kind === 'cell' ? (edge === 'last' ? el.lastElementChild : el.firstElementChild) || el : el;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return true;
  const range = sel.getRangeAt(0);
  const rects = range.getClientRects();
  const r = (edge === 'last' ? rects[rects.length - 1] : rects[0]) || range.getBoundingClientRect();
  if (!r || (r.width === 0 && r.height === 0)) return true;
  const b = target.getBoundingClientRect();
  const line = parseFloat(getComputedStyle(target).lineHeight) || 22;
  return edge === 'last' ? r.bottom > b.bottom - line * 0.75 : r.top < b.top + line * 0.75;
}

function $selectNode(key) {
  const selection = $createNodeSelection();
  selection.add(key);
  $setSelection(selection);
}

function $moveTo(stop, down) {
  const node = $getNodeByKey(stop.key);
  if (!node) return;
  if (stop.kind === 'node') {
    $selectNode(stop.key);
  } else if (stop.kind === 'cell') {
    const block = down ? node.getFirstChild() : node.getLastChild();
    if ($isElementNode(block)) {
      if (down) block.selectStart();
      else block.selectEnd();
    } else if (down) node.selectStart();
    else node.selectEnd();
  } else if (down) node.selectStart();
  else node.selectEnd();
}

// Keeps the newly focused stop visible below the sticky bars.
function reveal(editor, key) {
  requestAnimationFrame(() => {
    const el = editor.getElementByKey(key);
    const canvas = el?.closest('.te-canvas');
    if (!el || !canvas) return;
    let top = canvas.getBoundingClientRect().top;
    canvas.querySelectorAll(':scope > .te-canvas-bar, .te-fixed-tb-slot:not([hidden])').forEach((bar) => {
      top = Math.max(top, bar.getBoundingClientRect().bottom);
    });
    const bottom = Math.min(canvas.getBoundingClientRect().bottom, window.innerHeight);
    const r = el.getBoundingClientRect();
    if (r.top < top + 12) canvas.scrollTop -= top + 12 - r.top;
    else if (r.bottom > bottom - 12) canvas.scrollTop += r.bottom - (bottom - 12);
  });
}

// Removes a table / layout and leaves the caret on a neighbouring line.
function $removeBlock(block) {
  let next = block.getNextSibling();
  const prev = block.getPreviousSibling();
  if (!$isElementNode(next) && !$isElementNode(prev)) {
    next = $createParagraphNode();
    block.insertAfter(next);
  }
  block.remove();
  if ($isElementNode(next)) next.selectStart();
  else if ($isElementNode(prev)) prev.selectEnd();
  else if (next) $selectNode(next.getKey());
}

function tableElementOf(editor, key) {
  const el = editor.getElementByKey(key);
  return el && (el.tagName === 'TABLE' ? el : el.querySelector('table'));
}

export default function KeyboardNavPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const move = (down) => (event) => {
      if (event && (event.shiftKey || event.altKey || event.metaKey || event.ctrlKey)) return false;
      const selection = $getSelection();
      const stops = $buildStops();
      const pos = $position(selection, stops);
      if (!pos) return false;
      if (pos.range) {
        if (!selection.isCollapsed()) return false;
        if (!caretAtEdge(editor, stops[down ? pos.to : pos.from], down ? 'last' : 'first')) return false;
      }
      const current = stops[down ? pos.to : pos.from];
      const target = stops[down ? pos.to + 1 : pos.from - 1];
      const fromContainer = !!pos.node && isContainer(pos.node);
      if (!target) {
        if (!fromContainer) return false;
        event?.preventDefault();
        return true; // nothing beyond: stay on the selected table / layout
      }
      if (!current.special && !target.special && !fromContainer) return false; // plain text ↔ text: native
      event?.preventDefault();
      $moveTo(target, down);
      reveal(editor, target.key);
      return true;
    };

    // ← / → on a selected column go to the column beside it; on a selected layout or table they
    // move like ↑ / ↓ (there's no caret to move).
    const sideways = (down) => (event) => {
      const selection = $getSelection();
      if (!$isNodeSelection(selection)) return false;
      const [node] = selection.getNodes();
      if (!node || !isContainer(node)) return false;
      if ($isLayoutItemNode(node)) {
        const sibling = down ? node.getNextSibling() : node.getPreviousSibling();
        if ($isLayoutItemNode(sibling)) {
          event?.preventDefault();
          if ($isLayoutItemEmpty(sibling)) $selectNode(sibling.getKey());
          else {
            const stops = $buildStops();
            const inside = stops.filter((st) => sibling.isParentOf($getNodeByKey(st.key)));
            const target = down ? inside[0] : inside[inside.length - 1];
            if (target) $moveTo(target, down);
          }
          reveal(editor, sibling.getKey());
          return true;
        }
      }
      return move(down)(event);
    };

    const selectedContainer = () => {
      const selection = $getSelection();
      if (!$isNodeSelection(selection)) return null;
      const [node] = selection.getNodes();
      return node && isContainer(node) ? node : null;
    };

    return mergeRegister(
      editor.registerCommand(KEY_ARROW_DOWN_COMMAND, move(true), COMMAND_PRIORITY_CRITICAL),
      editor.registerCommand(KEY_ARROW_UP_COMMAND, move(false), COMMAND_PRIORITY_CRITICAL),
      editor.registerCommand(KEY_ARROW_RIGHT_COMMAND, sideways(true), COMMAND_PRIORITY_CRITICAL),
      editor.registerCommand(KEY_ARROW_LEFT_COMMAND, sideways(false), COMMAND_PRIORITY_CRITICAL),

      // Esc: from a cell → the table; from inside a layout (or a selected column/table in it) → the layout.
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          const selection = $getSelection();
          let from = null;
          if ($isRangeSelection(selection)) from = selection.anchor.getNode();
          else if ($isNodeSelection(selection)) from = selection.getNodes()[0];
          if (!from) return false;
          const cell = $isRangeSelection(selection) && $findMatchingParent(from, $isTableCellNode);
          const table = cell && $findMatchingParent(cell, $isTableNode);
          const parent = table || $findMatchingParent($isLayoutContainerNode(from) ? from.getParent() : from, $isLayoutContainerNode);
          if (!parent) return false;
          $selectNode(parent.getKey());
          reveal(editor, parent.getKey());
          return true;
        },
        COMMAND_PRIORITY_HIGH,
      ),

      // Delete / Backspace on a selected table, layout or column removes it (a column takes its layout).
      ...[KEY_DELETE_COMMAND, KEY_BACKSPACE_COMMAND].map((command) =>
        editor.registerCommand(
          command,
          (event) => {
            const node = selectedContainer();
            if (!node) return false;
            event?.preventDefault();
            $removeBlock($isLayoutItemNode(node) ? node.getParent() : node);
            return true;
          },
          COMMAND_PRIORITY_HIGH,
        ),
      ),

      // Enter on a selected table / layout goes inside; on an empty column it opens "Add Element".
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event) => {
          const node = selectedContainer();
          if (!node) return false;
          event?.preventDefault();
          if ($isLayoutItemNode(node)) {
            const key = node.getKey();
            queueMicrotask(() => editor.dispatchCommand(OPEN_COLUMN_MENU_COMMAND, key));
            return true;
          }
          const stops = $buildStops();
          const pos = $position($getSelection(), stops);
          let target = pos && stops[pos.from];
          // A layout with nothing in it: Enter goes to its first column.
          if ($isLayoutContainerNode(node) && pos && pos.from === pos.to && stops[pos.from].key === node.getKey()) {
            const first = node.getFirstChild();
            target = first ? { kind: 'node', key: first.getKey() } : null;
          }
          if (target) {
            $moveTo(target, true);
            reveal(editor, target.key);
          }
          return true;
        },
        COMMAND_PRIORITY_HIGH,
      ),

      // Focus outline on a selected table (layouts and columns style themselves).
      editor.registerUpdateListener(({ editorState }) => {
        const keys = [];
        editorState.read(() => {
          const selection = $getSelection();
          if ($isNodeSelection(selection)) selection.getNodes().forEach((n) => $isTableNode(n) && keys.push(n.getKey()));
        });
        editor.getRootElement()?.querySelectorAll('table.te-node-focus').forEach((el) => el.classList.remove('te-node-focus'));
        keys.forEach((key) => tableElementOf(editor, key)?.classList.add('te-node-focus'));
      }),
    );
  }, [editor]);

  return null;
}
