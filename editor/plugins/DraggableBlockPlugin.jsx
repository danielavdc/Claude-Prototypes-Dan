import { useRef } from 'react';
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';

const MENU_CLASS = 'te-drag-handle';

function isOnMenu(element) {
  return !!element.closest(`.${MENU_CLASS}`);
}

export default function DraggableBlockPlugin({ anchorElem }) {
  const menuRef = useRef(null);
  const targetLineRef = useRef(null);

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      isOnMenu={isOnMenu}
      menuComponent={
        <div ref={menuRef} className={MENU_CLASS} title="Drag to move">
          <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden="true">
            {[2, 7, 12].map((y) => (
              <g key={y}>
                <circle cx="2.5" cy={y} r="1.3" />
                <circle cx="7.5" cy={y} r="1.3" />
              </g>
            ))}
          </svg>
        </div>
      }
      targetLineComponent={<div ref={targetLineRef} className="te-drop-line" />}
    />
  );
}
