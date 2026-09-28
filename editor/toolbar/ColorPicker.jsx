import { useEffect, useRef, useState } from 'react';
import { TbIcon } from './toolbarIcons';

/* ---------- color math ---------- */

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function hexToHsv(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return { h: 0, s: 0, v: 1 };
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max ? d / max : 0, v: max };
}

function hsvToHex({ h, s, v }) {
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
  };
  return `#${[f(5), f(3), f(1)].map((x) => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

export function normalizeHex(value) {
  const m = /^#?([0-9a-f]{6})$/i.exec((value || '').trim());
  return m ? `#${m[1].toUpperCase()}` : null;
}

// Pointer drag that keeps reporting while the button is held, even outside the element.
function useDrag(onMove) {
  const ref = useRef(null);
  const handler = useRef(onMove);
  handler.current = onMove;

  const report = (e) => {
    const rect = ref.current.getBoundingClientRect();
    handler.current(clamp((e.clientX - rect.left) / rect.width), clamp((e.clientY - rect.top) / rect.height));
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    ref.current.setPointerCapture(e.pointerId);
    report(e);
  };
  const onPointerMove = (e) => {
    if (ref.current.hasPointerCapture(e.pointerId)) report(e);
  };
  return { ref, onPointerDown, onPointerMove };
}

/* ---------- component ---------- */

export default function ColorPicker({ value, onChange, onReset }) {
  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const [hexDraft, setHexDraft] = useState(() => normalizeHex(value) || '#FFFFFF');
  const hex = hsvToHex(hsv);

  useEffect(() => {
    setHexDraft(hex);
  }, [hex]);

  const commit = (next) => {
    setHsv(next);
    onChange(hsvToHex(next));
  };

  const square = useDrag((x, y) => commit({ ...hsv, s: x, v: 1 - y }));
  const hue = useDrag((x) => commit({ ...hsv, h: x * 360 }));

  const canPick = typeof window !== 'undefined' && 'EyeDropper' in window;
  const pick = async () => {
    try {
      const result = await new window.EyeDropper().open();
      const next = normalizeHex(result.sRGBHex);
      if (next) commit(hexToHsv(next));
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="te-color">
      <div
        className="te-color-square"
        style={{ background: `hsl(${hsv.h}, 100%, 50%)` }}
        {...square}
      >
        <div className="te-color-square-white" />
        <div className="te-color-square-black" />
        <span
          className="te-color-thumb"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hex }}
        />
      </div>

      <div className="te-color-row">
        <div className="te-color-hue" {...hue}>
          <span className="te-color-hue-thumb" style={{ left: `${(hsv.h / 360) * 100}%` }} />
        </div>
        <span className="te-color-swatch" style={{ background: hex }} />
        <button
          type="button"
          className="te-color-eyedrop"
          title={canPick ? 'Pick a color from the screen' : 'Eyedropper not supported in this browser'}
          disabled={!canPick}
          onMouseDown={(e) => e.preventDefault()}
          onClick={pick}
        >
          <TbIcon name="eyedropper" size={14} />
        </button>
      </div>

      <div className="te-color-row">
        <input
          className="te-color-hex"
          value={hexDraft}
          spellCheck={false}
          maxLength={7}
          aria-label="Hex color"
          onChange={(e) => {
            setHexDraft(e.target.value);
            const next = normalizeHex(e.target.value);
            if (next) commit(hexToHsv(next));
          }}
        />
        {onReset && (
          <button type="button" className="te-color-reset" onMouseDown={(e) => e.preventDefault()} onClick={onReset}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
