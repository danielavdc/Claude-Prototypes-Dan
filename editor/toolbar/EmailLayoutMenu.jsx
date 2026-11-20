import { useEffect, useRef, useState } from 'react';

/*
 * Toolbar dropdown: how the email is laid out for recipients.
 * - Full width: content uses the whole width (personal, one-to-one feel).
 * - Narrow & centered: content capped at the email max width (--te-email-w, 800px) and centred,
 *   which is how it's delivered (structured emails like press releases).
 */

export const EMAIL_LAYOUTS = [
  { key: 'full', label: 'Full Width', hint: 'Ideal for a more personal, one-to-one email feel.' },
  { key: 'narrow', label: 'Narrow & Centered', hint: 'Ideal for structured emails like press releases.' },
];

export function LayoutIcon({ layout, size = 16 }) {
  return layout === 'narrow' ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M7 9h4M7 12.5h4M7 16h10M14 8.5h3.5v4H14z" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

export default function EmailLayoutMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const itemRefs = useRef([]);
  const current = EMAIL_LAYOUTS.find((l) => l.key === value) || EMAIL_LAYOUTS[0];

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => !wrapRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onDown);
    // Keyboard: focus the selected option when the menu opens
    const i = EMAIL_LAYOUTS.findIndex((l) => l.key === value);
    itemRefs.current[Math.max(0, i)]?.focus();
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, value]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onMenuKey = (e) => {
    const items = itemRefs.current.filter(Boolean);
    const i = items.indexOf(document.activeElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    }
  };

  return (
    <div className="te-tb-group te-layout-menu-wrap" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`te-add-element te-tb-add-btn te-layout-trigger${open ? ' is-open' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Email layout: ${current.label}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
      >
        <LayoutIcon layout={current.key} />
        {current.label}
        <svg className="te-layout-caret" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      {open && (
        <div className="te-layout-menu" role="menu" aria-label="Select Email Layout" onKeyDown={onMenuKey}>
          <div className="te-layout-menu-title">Select Email Layout</div>
          {EMAIL_LAYOUTS.map((l, i) => (
            <button
              key={l.key}
              ref={(el) => (itemRefs.current[i] = el)}
              type="button"
              role="menuitemradio"
              aria-checked={l.key === value}
              className={`te-layout-option${l.key === value ? ' is-selected' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(l.key);
                close();
              }}
            >
              <span className="te-layout-option-icon">
                <LayoutIcon layout={l.key} size={20} />
              </span>
              <span>
                <span className="te-layout-option-label">{l.label}</span>
                <span className="te-layout-option-hint">{l.hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
