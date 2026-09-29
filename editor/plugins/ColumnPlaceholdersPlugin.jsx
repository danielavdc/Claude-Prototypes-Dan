import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, $getSelection, $isRangeSelection, $setSelection } from 'lexical';
import { $dfs, $findMatchingParent, mergeRegister } from '@lexical/utils';
import { $isLayoutItemEmpty, $isLayoutItemNode, $isTextOnlyItem } from '../nodes/LayoutNodes';
import { ElementMenu, useInsertElement } from './AddElementPlugin';
import { Icon } from '../icons';

function PlaceholderBox({ itemKey, rect, open, onToggle, onClose }) {
  const insert = useInsertElement();
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);

  return (
    <div
      ref={wrapRef}
      className="te-col-empty"
      style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`te-col-empty-btn${open ? ' is-open' : ''}`}
        title="Add Element"
        aria-haspopup="menu"
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onToggle}
      >
        <Icon name="plus" size={14} /> <span className="te-col-empty-label">Add Element</span>
      </button>
      {open && (
        <ElementMenu
          triggerRef={triggerRef}
          wrapRef={wrapRef}
          exclude={['columns']} // column layouts can't be nested
          className="te-add-menu-centered"
          onClose={onClose}
          onSelect={(el) => {
            onClose();
            insert(el, itemKey);
          }}
        />
      )}
    </div>
  );
}

// Each empty column shows a dashed "Add Element" box that opens the element menu for that column.
export default function ColumnPlaceholdersPlugin({ anchorElem }) {
  const [editor] = useLexicalComposerContext();
  const [boxes, setBoxes] = useState([]); // [{ key, rect }]
  const [openKey, setOpenKey] = useState(null);

  // Columns emptied by deleting text keep their caret (and text placeholder) until the caret leaves.
  const held = useRef(new Set());

  const measure = useCallback(
    ({ editorState, prevEditorState } = {}) => {
      const state = editorState || editor.getEditorState();
      const keys = [];
      const emptiness = []; // [domKey, isEmpty] for every column, to style layouts with no content yet
      let release = false;

      state.read(() => {
        const selection = $getSelection();
        const caretItem =
          $isRangeSelection(selection) ? $findMatchingParent(selection.anchor.getNode(), $isLayoutItemNode) : null;
        const caretKey = caretItem ? caretItem.getKey() : null;

        // Leaving a column ends its hold.
        held.current.forEach((key) => key !== caretKey && held.current.delete(key));

        $dfs().forEach(({ node }) => {
          if (!$isLayoutItemNode(node)) return;
          emptiness.push([node.getKey(), $isLayoutItemEmpty(node)]);
          if (!$isLayoutItemEmpty(node)) return;
          const key = node.getKey();
          if (key === caretKey && !held.current.has(key)) {
            // Just became empty with the caret inside. Keep it (placeholder + caret) when the user
            // deleted text or just added a fresh empty paragraph/heading/quote; release it when an
            // element (divider/table/image) was removed.
            let wasText = !prevEditorState;
            const blockKey = node.getFirstChild()?.getKey();
            if (prevEditorState) {
              prevEditorState.read(() => {
                const prev = $getNodeByKey(key);
                const freshBlock = !!prev && $isLayoutItemEmpty(prev) && prev.getFirstChild()?.getKey() !== blockKey;
                wasText = !!prev && $isTextOnlyItem(prev) && (!$isLayoutItemEmpty(prev) || freshBlock);
              });
            }
            if (wasText) held.current.add(key);
            else release = true; // divider/table/image removed → back to "Add Element" right away
          }
          if (!held.current.has(key)) keys.push(key);
        });
      });

      // Empty columns are tagged so CSS can give an all-empty layout a minimum height; once any
      // column has content, the row simply fits its tallest element.
      emptiness.forEach(([key, empty]) => editor.getElementByKey(key)?.classList.toggle('is-empty', empty));

      // The box covers the column, so the caret must not stay hidden underneath it.
      if (release) editor.update(() => $setSelection(null));

      const a = anchorElem.getBoundingClientRect();
      setBoxes(
        keys
          .map((key) => {
            const el = editor.getElementByKey(key);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { key, rect: { top: r.top - a.top, left: r.left - a.left, width: r.width, height: r.height } };
          })
          .filter(Boolean),
      );
    },
    [editor, anchorElem],
  );

  useEffect(() => {
    const remeasure = () => measure();
    remeasure();
    window.addEventListener('resize', remeasure);
    const unregister = mergeRegister(
      editor.registerUpdateListener((payload) => measure(payload)),
      editor.registerEditableListener(remeasure),
    );
    return () => {
      unregister();
      window.removeEventListener('resize', remeasure);
    };
  }, [editor, measure]);

  useEffect(() => {
    if (openKey && !boxes.some((b) => b.key === openKey)) setOpenKey(null);
  }, [boxes, openKey]);

  if (!editor.isEditable() || boxes.length === 0) return null;

  return createPortal(
    <>
      {boxes.map((b) => (
        <PlaceholderBox
          key={b.key}
          itemKey={b.key}
          rect={b.rect}
          open={openKey === b.key}
          onToggle={() => setOpenKey((k) => (k === b.key ? null : b.key))}
          onClose={() => setOpenKey((k) => (k === b.key ? null : k))}
        />
      ))}
    </>,
    anchorElem,
  );
}
