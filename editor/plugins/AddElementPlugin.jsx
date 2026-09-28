import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $createTextNode,
  $getNodeByKey,
  $getRoot,
  $isParagraphNode,
  $setSelection,
  createCommand,
} from 'lexical';
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

// Lets the text toolbar stay hidden when we programmatically select dummy text.
export const SUPPRESS_TEXT_TOOLBAR_COMMAND = createCommand('SUPPRESS_TEXT_TOOLBAR_COMMAND');

const ELEMENTS = [
  {
    key: 'paragraph',
    label: 'Paragraph',
    icon: 'M4 6h16v1.6H4zm0 3.5h16v1.6H4zm0 3.5h16v1.6H4zm0 3.5h16v1.6H4z',
    create: () => $createParagraphNode(),
    dummy: 'Start writing your outreach message here.',
  },
  {
    key: 'heading',
    label: 'Heading',
    icon: 'M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5v-8h14v8zM5 8V6h14v2H5z',
    create: () => $createHeadingNode('h2'),
    dummy: 'Add a clear section heading',
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
    dummy: '“Add a compelling quote from your spokesperson or source here.”',
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
function $place(parent, block, { keepLine }) {
  let last = parent.getLastChild();
  // In a column, a blank heading/quote left behind after deleting text is also reused.
  const reusable = $isLayoutItemNode(parent) ? $isEmptyTextBlock(last) : $isEmptyParagraph(last);
  if (reusable && !$isParagraphNode(last)) {
    const line = $createParagraphNode();
    last.replace(line);
    last = line;
  }
  if (reusable) {
    if (keepLine) last.insertBefore(block);
    else last.replace(block);
    return keepLine ? last : null;
  }
  parent.append(block);
  if (!keepLine) return null;
  const line = $createParagraphNode();
  parent.append(line);
  return line;
}

function $insertTextBlock(parent, el) {
  const text = $createTextNode(el.dummy);
  $place(parent, el.create().append(text), { keepLine: false });
  // Dummy copy is pre-selected so the first keystroke replaces it.
  text.select(0, el.dummy.length);
}

// Like Notion: drop the divider and leave the caret on a fresh line below it.
function $insertDivider(parent) {
  $place(parent, $createHorizontalRuleNode(), { keepLine: true }).select();
}

function $createTemplateCell(text, isHeader) {
  const cell = $createTableCellNode(isHeader ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS);
  const paragraph = $createParagraphNode();
  if (text) paragraph.append($createTextNode(text));
  return cell.append(paragraph);
}

// Starter table: one header row + two body rows of dummy copy.
// 3 columns on the page, 2 inside a column layout where space is tighter.
function $insertTable(parent) {
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
  $place(parent, table, { keepLine: true });
  const firstText = header.getFirstChild().getFirstDescendant();
  firstText.select(0, firstText.getTextContentSize());
}

// Image fills the width (keeping its ratio) and gets an editable line below it.
function $insertBlockImage(parent, src) {
  const image = $createBlockImageNode({ src });
  image.setUploading(true);
  $place(parent, image, { keepLine: true });
  $setSelection(null);
  return image.getKey();
}

function $insertColumns(split) {
  $place($getRoot(), $createColumnsLayout(split), { keepLine: true });
  $setSelection(null);
}

const $resolveParent = (parentKey) => (parentKey ? $getNodeByKey(parentKey) : $getRoot());

// Inserts an element at the end of the document, or into a column when `parentKey` is given.
export function useInsertElement() {
  const [editor] = useLexicalComposerContext();
  return useCallback(
    async (el, parentKey = null) => {
      if (el.pick) {
        const src = await pickImage();
        if (!src) return;
        let key = null;
        editor.update(() => {
          const parent = $resolveParent(parentKey);
          if (parent) key = $insertBlockImage(parent, src);
        });
        if (key) finishUpload(editor, key);
        return;
      }
      editor.dispatchCommand(SUPPRESS_TEXT_TOOLBAR_COMMAND, undefined);
      editor.update(() => {
        const parent = $resolveParent(parentKey);
        if (!parent) return;
        if (el.insert) el.insert(parent);
        else $insertTextBlock(parent, el);
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
export function ElementMenu({ triggerRef, wrapRef, exclude = [], onSelect, onClose, className = '' }) {
  const menuRef = useRef(null);
  const [placement, setPlacement] = useState({ up: false, maxHeight: null });

  const place = useCallback(() => {
    const menu = menuRef.current;
    const btn = triggerRef.current;
    if (!menu || !btn) return;
    const scroller = btn.closest('.te-canvas');
    const bounds = scroller ? scroller.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
    const top = Math.max(bounds.top, 0);
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
