import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';

const MENU_CLASS = 'te-drag-handle';
const HANDLE_HEIGHT = 22;
// Must match Lexical's own offset for the live handle (SPACE in LexicalDraggableBlockPlugin).
const LEXICAL_LEFT_OFFSET = 4;

function Dots() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden="true">
      {[2, 7, 12].map((y) => (
        <g key={y}>
          <circle cx="2.5" cy={y} r="1.3" />
          <circle cx="7.5" cy={y} r="1.3" />
        </g>
      ))}
    </svg>
  );
}

// Always-visible handles next to every block. They're purely visual: hovering a block
// brings Lexical's live (draggable) handle up in exactly the same spot, on top of these.
function StaticHandles({ anchorElem }) {
  const [editor] = useLexicalComposerContext();
  const [tops, setTops] = useState([]);

  const measure = useCallback(() => {
    if (!editor.isEditable() || anchorElem.closest('[hidden]')) {
      setTops([]);
      return;
    }
    let keys = [];
    editor.getEditorState().read(() => {
      keys = $getRoot().getChildrenKeys();
    });
    const a = anchorElem.getBoundingClientRect();
    setTops(
      keys
        .map((key) => {
          const el = editor.getElementByKey(key);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          // Same centring rule Lexical uses: first line if it has a numeric line-height, else the whole block.
          let line = parseInt(getComputedStyle(el).lineHeight, 10);
          if (Number.isNaN(line)) line = r.height;
          return { key, top: r.top - a.top + anchorElem.scrollTop + (line - HANDLE_HEIGHT) / 2 };
        })
        .filter(Boolean),
    );
  }, [editor, anchorElem]);

  useEffect(() => {
    measure();
    const root = editor.getRootElement();
    const observer = new ResizeObserver(() => measure());
    if (root) observer.observe(root);
    observer.observe(anchorElem);
    const unregister = editor.registerUpdateListener(() => measure());
    const unregisterEditable = editor.registerEditableListener(() => measure());
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      unregister();
      unregisterEditable();
      window.removeEventListener('resize', measure);
    };
  }, [editor, anchorElem, measure]);

  return createPortal(
    <>
      {tops.map(({ key, top }) => (
        <div
          key={key}
          className="te-drag-handle te-drag-handle-static"
          aria-hidden="true"
          style={{ transform: `translate(${LEXICAL_LEFT_OFFSET}px, ${top}px)` }}
        >
          <Dots />
        </div>
      ))}
    </>,
    anchorElem,
  );
}

function isOnMenu(element) {
  return !!element.closest(`.${MENU_CLASS}`);
}

export default function DraggableBlockPlugin({ anchorElem }) {
  const menuRef = useRef(null);
  const targetLineRef = useRef(null);

  return (
    <>
      <StaticHandles anchorElem={anchorElem} />
      <DraggableBlockPlugin_EXPERIMENTAL
        anchorElem={anchorElem}
        menuRef={menuRef}
        targetLineRef={targetLineRef}
        isOnMenu={isOnMenu}
        menuComponent={
          <div ref={menuRef} className={MENU_CLASS} title="Drag to move">
            <Dots />
          </div>
        }
        targetLineComponent={<div ref={targetLineRef} className="te-drop-line" />}
      />
    </>
  );
}
