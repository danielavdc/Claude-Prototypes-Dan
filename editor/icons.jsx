const PATHS = {
  close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  undo: 'M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  redo: 'm15 14 5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13',
  send: 'M3.5 4.5 21 12 3.5 19.5 6 12zM6 12h7',
  caret: 'M7 10l5 5 5-5z',
  pencil: 'M4 20h4L18.5 9.5a2.12 2.12 0 0 0-4-4L4 16v4zM13.5 6.5l4 4',
  plus: 'M12 5v14M5 12h14',
};

const STROKED = new Set(['undo', 'redo', 'send', 'pencil', 'plus']);

export function Icon({ name, size = 20 }) {
  if (name === 'logo') {
    return (
      <svg width={size} height={size * 0.62} viewBox="0 0 52 32" aria-hidden="true">
        <path d="M12 4 2 16l10 12" fill="none" stroke="#23B5A8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 4l10 12-10 12" fill="none" stroke="#23B5A8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="26" cy="16" r="9" fill="none" stroke="#23B5A8" strokeWidth="4" />
        <circle cx="26" cy="16" r="3.2" fill="#23B5A8" />
      </svg>
    );
  }
  if (name === 'desktop' || name === 'mobile') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {name === 'desktop' ? (
          <>
            <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
            <path d="M12 16.5v3.5M8 20h8" />
          </>
        ) : (
          <>
            <rect x="7" y="2.5" width="10" height="19" rx="2" />
            <path d="M11 18.5h2" />
          </>
        )}
      </svg>
    );
  }
  if (name === 'eye') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  const stroked = STROKED.has(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={stroked ? 'none' : 'currentColor'}
      stroke={stroked ? 'currentColor' : 'none'}
      strokeWidth={stroked ? 1.8 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
