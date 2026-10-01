import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, $getRoot } from 'lexical';

const MENU_CLASS = 'te-drag-handle';
// Same format Lexical's draggable-block plugin writes on dragstart.
const DRAG_DATA_FORMAT = 'application/x-lexical-drag-block';
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

/*
 * Lexical only accepts a block drop when the pointer is over the editable text area. Dropping at
 * the very top (card padding, the fixed toolbar) or in the handle gutter was silently ignored.
 * This accepts the drop anywhere in the canvas and places the block before/after the nearest one.
 */
function useDropAnywhere(anchorElem, targetLineRef) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const canvas = anchorElem.closest('.te-canvas');
    if (!canvas) return undefined;
    const isBlockDrag = (e) => [...(e.dataTransfer?.types || [])].includes(DRAG_DATA_FORMAT);
    const outsideText = (e) => !editor.getRootElement()?.contains(e.target);

    // Nearest top-level block to the pointer, and whether to drop before or after it.
    const findTarget = (y) => {
      let keys = [];
      editor.getEditorState().read(() => {
        keys = $getRoot().getChildrenKeys();
      });
      let best = null;
      keys.forEach((key) => {
        const el = editor.getElementByKey(key);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const distance = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
        if (!best || distance < best.distance) best = { key, el, rect: r, distance, before: y < r.top + r.height / 2 };
      });
      return best;
    };

    const showLine = (t) => {
      const line = targetLineRef.current;
      if (!line) return;
      const a = anchorElem.getBoundingClientRect();
      const y = (t.before ? t.rect.top - 6 : t.rect.bottom + 4) - a.top + anchorElem.scrollTop - 2;
      line.style.transform = `translate(24px, ${y}px)`;
      line.style.width = `${a.width - 48}px`;
      line.style.opacity = '.4';
    };
    const hideLine = () => {
      const line = targetLineRef.current;
      if (line) {
        line.style.opacity = '0';
        line.style.transform = 'translate(-10000px, -10000px)';
      }
    };

    const onDragOver = (e) => {
      if (!isBlockDrag(e) || !outsideText(e)) return;
      const t = findTarget(e.clientY);
      if (!t) return;
      e.preventDefault(); // allow the drop here
      showLine(t);
    };

    const onDrop = (e) => {
      if (!isBlockDrag(e) || !outsideText(e)) return;
      const t = findTarget(e.clientY);
      const key = e.dataTransfer.getData(DRAG_DATA_FORMAT);
      hideLine();
      if (!t || !key) return;
      e.preventDefault();
      editor.update(() => {
        const dragged = $getNodeByKey(key);
        const target = $getNodeByKey(t.key);
        if (!dragged || !target || dragged === target) return;
        if (t.before) target.insertBefore(dragged);
        else target.insertAfter(dragged);
      });
    };

    canvas.addEventListener('dragover', onDragOver);
    canvas.addEventListener('drop', onDrop);
    return () => {
      canvas.removeEventListener('dragover', onDragOver);
      canvas.removeEventListener('drop', onDrop);
    };
  }, [editor, anchorElem, targetLineRef]);
}

export default function DraggableBlockPlugin({ anchorElem }) {
  const menuRef = useRef(null);
  const targetLineRef = useRef(null);
  useDropAnywhere(anchorElem, targetLineRef);

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
