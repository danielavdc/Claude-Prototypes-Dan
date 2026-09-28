import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { COLUMN_LAYOUTS, toTemplateColumns } from '../nodes/LayoutNodes';

const COUNTS = [2, 3];

const splitLabel = (split) => split.map((p) => `${p}%`).join(' | ');

export default function ColumnsDialog({ onCancel, onApply }) {
  const [count, setCount] = useState(2);
  const [layoutIndex, setLayoutIndex] = useState(0);
  const [selectOpen, setSelectOpen] = useState(false);
  const selectRef = useRef(null);

  const layouts = COLUMN_LAYOUTS[count];
  const split = layouts[layoutIndex];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (selectOpen) setSelectOpen(false);
      else onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel, selectOpen]);

  useEffect(() => {
    if (!selectOpen) return undefined;
    const onDown = (e) => {
      if (!selectRef.current?.contains(e.target)) setSelectOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [selectOpen]);

  const chooseCount = (n) => {
    setCount(n);
    setLayoutIndex(0); // each count starts on its evenly-split option
    setSelectOpen(false);
  };

  return createPortal(
    <div className="te-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="te-modal te-cols-modal" role="dialog" aria-modal="true" aria-labelledby="te-cols-title">
        <h2 id="te-cols-title" className="te-modal-title">
          Configure columns layout
        </h2>
        <div className="te-modal-body">
          <div className={`te-select${selectOpen ? ' is-open' : ''}`} ref={selectRef}>
            <span className="te-field-label">Select number of columns</span>
            <button
              type="button"
              className="te-select-trigger"
              aria-haspopup="listbox"
              aria-expanded={selectOpen}
              onClick={() => setSelectOpen((o) => !o)}
            >
              {count} Columns
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={selectOpen ? 'M7 14l5-5 5 5z' : 'M7 10l5 5 5-5z'} />
              </svg>
            </button>
            {selectOpen && (
              <div className="te-select-list" role="listbox">
                {COUNTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="option"
                    aria-selected={n === count}
                    className={`te-select-option${n === count ? ' is-active' : ''}`}
                    onClick={() => chooseCount(n)}
                  >
                    {n} columns
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="te-cols-label">Columns layout</div>
          <div className="te-cols-options" role="radiogroup" aria-label="Columns layout">
            {layouts.map((option, i) => (
              <button
                key={option.join('-')}
                type="button"
                role="radio"
                aria-checked={i === layoutIndex}
                className={i === layoutIndex ? 'is-active' : ''}
                onClick={() => setLayoutIndex(i)}
              >
                {splitLabel(option)}
              </button>
            ))}
          </div>

          {/* Live preview of the chosen distribution */}
          <div className="te-cols-preview" style={{ gridTemplateColumns: toTemplateColumns(split) }} aria-hidden="true">
            {split.map((_, i) => (
              <div key={i} className="te-cols-preview-col">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        <div className="te-modal-actions">
          <button type="button" className="te-btn-text" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="te-btn-primary" onClick={() => onApply(split)}>
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
