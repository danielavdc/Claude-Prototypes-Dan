import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $createTextNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isRootNode,
  $setSelection,
  createCommand,
} from 'lexical';
import { $findMatchingParent } from '@lexical/utils';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  TableCellHeaderStates,
} from '@lexical/table';
import { Icon } from '../icons';
import { pickImage } from '../nodes/ImageNode';
import { $createBlockImageNode, finishUpload } from '../nodes/BlockImageNode';
import { $createColumnsLayout, $isEmptyTextBlock, $isLayoutItemNode } from '../nodes/LayoutNodes';
import ColumnsDialog from './ColumnsDialog';

// Lets the text toolbar stay hidden when we programmatically move the selection into a new element.
export const SUPPRESS_TEXT_TOOLBAR_COMMAND = createCommand('SUPPRESS_TEXT_TOOLBAR_COMMAND');

export const ELEMENTS = [
  {
    key: 'paragraph',
    label: 'Paragraph',
    icon: 'M4 6h16v1.6H4zm0 3.5h16v1.6H4zm0 3.5h16v1.6H4zm0 3.5h16v1.6H4z',
    create: () => $createParagraphNode(),
  },
  {
    key: 'heading',
    label: 'Heading',
    icon: 'M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5v-8h14v8zM5 8V6h14v2H5z',
    create: () => $createHeadingNode('h2'),
  },
  { key: 'divider', label: 'Divider', icon: 'M3 10.5h18v3H3z', insert: $insertDivider },
  {
    key: 'table',
    label: 'Table',
    icon: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 2v3.5H5V5h14zm0 5.5v3H5v-3h14zM5 19v-3.5h14V19H5z',
    insert: $insertTable,
  },
  {
    key: 'image',
    label: 'Image',
    icon: 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86-3 3.87L9 13.14 6 17h12l-3.86-5.14z',
    pick: true,
  },
  {
    key: 'quote',
    label: 'Quote',
    icon: 'M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z',
    create: () => $createQuoteNode(),
  },
  {
    key: 'columns',
    label: 'Column layout',
    icon: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM5 19V5h6v14H5zm8 0V5h6v14h-6z',
    dialog: true,
  },
];

function $isEmptyParagraph(node) {
  return $isParagraphNode(node) && node.getTextContent() === '' && node.getChildrenSize() === 0;
}

// `parent` is the root or a column. Text blocks take over a trailing empty line;
// other blocks go before it (or get a fresh one) so writing can continue below them.
// `after` (optional) is the block holding the caret: insert right below it instead of at the end.
function $place(parent, block, { keepLine, after = null }) {
  const anchor = after && after.getParent() === parent ? after : null;
  let target = anchor || parent.getLastChild();
  // An empty line is reused; in a column a blank heading/quote left after deleting text is too.
  const reusable = $isLayoutItemNode(parent) ? $isEmptyTextBlock(target) : $isEmptyParagraph(target);
  if (reusable && !$isParagraphNode(target)) {
    const line = $createParagraphNode();
    target.replace(line);
    target = line;
  }
  if (reusable) {
    if (keepLine) target.insertBefore(block);
    else target.replace(block);
    return keepLine ? target : null;
  }
  if (anchor) anchor.insertAfter(block);
  else parent.append(block);
  if (!keepLine) return null;
  // Mid-document there's already a line below to continue on; only add one at the end.
  const next = block.getNextSibling();
  if ($isElementNode(next)) return next;
  const line = $createParagraphNode();
  block.insertAfter(line);
  return line;
}

// Paragraph / heading / quote start empty: their placeholder guides the writing and the caret waits inside.
function $insertTextBlock(parent, el, after) {
  const block = el.create();
  $place(parent, block, { keepLine: false, after });
  block.select();
}

// Divider, table and image don't add an empty line below themselves (Daniela's call);
// an empty line at the insertion point is taken over instead.
function $insertDivider(parent, after) {
  $place(parent, $createHorizontalRuleNode(), { keepLine: false, after });
  $setSelection(null);
}

function $createTemplateCell(text, isHeader) {
  const cell = $createTableCellNode(isHeader ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS);
  const paragraph = $createParagraphNode();
  if (text) paragraph.append($createTextNode(text));
  return cell.append(paragraph);
}

// Starter table: one header row + two body rows of dummy copy.
// 3 columns on the page, 2 inside a column layout where space is tighter.
function $insertTable(parent, after) {
  const cols = $isLayoutItemNode(parent) ? 2 : 3;
  const table = $createTableNode();
  const header = $createTableRowNode();
  for (let c = 1; c <= cols; c += 1) header.append($createTemplateCell(`Header ${c}`, true));
  table.append(header);
  for (let r = 0; r < 2; r += 1) {
    const row = $createTableRowNode();
    for (let c = 0; c < cols; c += 1) row.append($createTemplateCell('Your cell', false));
    table.append(row);
  }
  $place(parent, table, { keepLine: false, after });
  const firstText = header.getFirstChild().getFirstDescendant();
  firstText.select(0, firstText.getTextContentSize());
}

// Image fills the width (keeping its ratio) and gets an editable line below it.
function $insertBlockImage(parent, src, after) {
  const image = $createBlockImageNode({ src });
  image.setUploading(true);
  $place(parent, image, { keepLine: false, after });
  $setSelection(null);
  return image.getKey();
}

function $insertColumns(split, after = null) {
  $place($getRoot(), $createColumnsLayout(split), { keepLine: true, after });
  $setSelection(null);
}

const $resolveParent = (parentKey) => (parentKey ? $getNodeByKey(parentKey) : $getRoot());

// Inserts an element at the end of the document, or into a column when `parentKey` is given.
export function useInsertElement() {
  const [editor] = useLexicalComposerContext();
  return useCallback(
    async (el, parentKey = null, afterKey = null) => {
      if (el.pick) {
        const src = await pickImage();
        if (!src) return;
        let key = null;
        editor.update(() => {
          const parent = $resolveParent(parentKey);
          if (parent) key = $insertBlockImage(parent, src, afterKey && $getNodeByKey(afterKey));
        });
        if (key) finishUpload(editor, key);
        return;
      }
      editor.dispatchCommand(SUPPRESS_TEXT_TOOLBAR_COMMAND, undefined);
      editor.update(() => {
        const parent = $resolveParent(parentKey);
        if (!parent) return;
        const after = afterKey ? $getNodeByKey(afterKey) : null;
        if (el.insert) el.insert(parent, after);
        else $insertTextBlock(parent, el, after);
      });
      editor.focus();
    },
    [editor],
  );
}

/* ---------- the dropdown ---------- */

// Element picker shared by the page-level button and the empty-column boxes.
// Stays inside the visible area: opens downward if it fits, else upward, else
// toward the roomier side with internal scrolling.
export function ElementMenu({ triggerRef, wrapRef, exclude = [], onSelect, onClose, className = '', autoFocus = false }) {
  const menuRef = useRef(null);
  const [placement, setPlacement] = useState({ up: false, maxHeight: null });

  const place = useCallback(() => {
    const menu = menuRef.current;
    const btn = triggerRef.current;
    if (!menu || !btn) return;
    const scroller = btn.closest('.te-canvas');
    const bounds = scroller ? scroller.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
    // The sticky bars at the top of the canvas cover that strip, so the menu can't use it.
    let top = Math.max(bounds.top, 0);
    if (scroller && !scroller.contains(btn.closest('.te-fixed-tb-slot') || null)) {
      scroller.querySelectorAll(':scope > .te-canvas-bar, .te-fixed-tb-slot:not([hidden])').forEach((el) => {
        top = Math.max(top, el.getBoundingClientRect().bottom);
      });
    }
    const bottom = Math.min(bounds.bottom, window.innerHeight);
    const b = btn.getBoundingClientRect();
    const needed = menu.scrollHeight;
    const below = bottom - b.bottom - 12;
    const above = b.top - top - 12;
    if (needed <= below) setPlacement({ up: false, maxHeight: null });
    else if (needed <= above) setPlacement({ up: true, maxHeight: null });
    else if (above > below) setPlacement({ up: true, maxHeight: above });
    else setPlacement({ up: false, maxHeight: below });
  }, [triggerRef]);

  useLayoutEffect(() => {
    place();
    const scroller = triggerRef.current?.closest('.te-canvas');
    scroller?.addEventListener('scroll', place);
    window.addEventListener('resize', place);
    return () => {
      scroller?.removeEventListener('scroll', place);
      window.removeEventListener('resize', place);
    };
  }, [place, triggerRef]);

  // Opened from the keyboard: focus lands on the first option; ↑ / ↓ move between options.
  useEffect(() => {
    if (autoFocus) menuRef.current?.querySelector('.te-add-item:not(:disabled)')?.focus();
  }, [autoFocus]);

  const onMenuKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = [...menuRef.current.querySelectorAll('.te-add-item:not(:disabled)')];
    if (items.length === 0) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement);
    const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[i < 0 ? 0 : next].focus();
  };

  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, wrapRef]);

  return (
    <div
      ref={menuRef}
      className={`te-add-menu${placement.up ? ' is-up' : ''} ${className}`}
      role="menu"
      onKeyDown={onMenuKeyDown}
      style={placement.maxHeight ? { maxHeight: placement.maxHeight, overflowY: 'auto' } : undefined}
    >
      {ELEMENTS.filter((el) => !exclude.includes(el.key)).map((el) => {
        const enabled = !!(el.create || el.insert || el.pick || el.dialog);
        return (
          <button
            key={el.key}
            type="button"
            role="menuitem"
            className="te-add-item"
            disabled={!enabled}
            title={enabled ? undefined : 'Coming soon'}
            onClick={() => enabled && onSelect(el)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={el.icon} />
            </svg>
            {el.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- page-level "Add Element" ---------- */

export default function AddElementPlugin() {
  const [editor] = useLexicalComposerContext();
  const insert = useInsertElement();
  const [open, setOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);

  const select = (el) => {
    setOpen(false);
    if (el.dialog) setColumnsOpen(true);
    else insert(el);
  };

  const applyColumns = (split) => {
    setColumnsOpen(false);
    editor.update(() => $insertColumns(split));
  };

  return (
    <div className="te-add-wrap" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`te-add-element${open ? ' is-open' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="plus" size={14} /> Add Element
      </button>
      {open && <ElementMenu triggerRef={triggerRef} wrapRef={wrapRef} onSelect={select} onClose={close} />}
      {columnsOpen && <ColumnsDialog onCancel={() => setColumnsOpen(false)} onApply={applyColumns} />}
    </div>
  );
}

/* ---------- "Add Element" inside the fixed toolbar ---------- */

// Where the caret is: the column it's in (if any) and the block to insert after.
export function $caretContext() {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) && !$isNodeSelection(selection)) return { parentKey: null, afterKey: null };
  const node = $isRangeSelection(selection) ? selection.anchor.getNode() : selection.getNodes()[0];
  if (!node) return { parentKey: null, afterKey: null };
  const block = $findMatchingParent(node, (n) => {
    const p = n.getParent();
    return !!p && ($isRootNode(p) || $isLayoutItemNode(p));
  });
  const item = block && $isLayoutItemNode(block.getParent()) ? block.getParent() : null;
  return { parentKey: item ? item.getKey() : null, afterKey: block ? block.getKey() : null };
}

export function ToolbarAddElement() {
  const [editor] = useLexicalComposerContext();
  const insert = useInsertElement();
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState({ parentKey: null, afterKey: null });
  const [columnsOpen, setColumnsOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);

  const toggle = () => {
    if (!open) editor.getEditorState().read(() => setContext($caretContext()));
    setOpen((o) => !o);
  };

  const select = (el) => {
    setOpen(false);
    if (el.dialog) setColumnsOpen(true);
    else insert(el, context.parentKey, context.afterKey);
  };

  const applyColumns = (split) => {
    setColumnsOpen(false);
    editor.update(() => $insertColumns(split, context.afterKey ? $getNodeByKey(context.afterKey) : null));
  };

  return (
    <>
      <div className="te-tb-group te-tb-add" ref={wrapRef}>
        <button
          ref={triggerRef}
          type="button"
          className={`te-add-element te-tb-add-btn${open ? ' is-open' : ''}`}
          aria-haspopup="menu"
          aria-expanded={open}
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggle}
        >
          <Icon name="plus" size={14} /> Add Element
        </button>
        {open && (
          <ElementMenu
            triggerRef={triggerRef}
            wrapRef={wrapRef}
            exclude={context.parentKey ? ['columns'] : []} // no layouts inside a column
            className="te-add-menu-right"
            onSelect={select}
            onClose={close}
          />
        )}
        {columnsOpen && <ColumnsDialog onCancel={() => setColumnsOpen(false)} onApply={applyColumns} />}
      </div>
      <span className="te-new-features" role="note">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" />
        </svg>
        Try new features
      </span>
    </>
  );
}
