import { $isElementNode } from 'lexical';

// UX spec: no column may collapse below this width.
export const MIN_COLUMN_WIDTH = 50;

// Cells holding an image use a tighter padding (see .te-td:has(.te-image) in styles.css): 6px each side + 1px border.
export const IMAGE_CELL_PAD = 13;

export function measureTable(tableEl) {
  return { width: tableEl.getBoundingClientRect().width, padX: IMAGE_CELL_PAD };
}

function $imageWidthsIn(node) {
  const widths = [];
  node.getChildren().forEach((child) => {
    if (child.getType() === 'image' && child.getWidth()) widths.push(child.getWidth());
    else if ($isElementNode(child)) widths.push(...$imageWidthsIn(child));
  });
  return widths;
}

// Widest explicitly-sized image per column (0 = none / fills the column).
export function $columnImageWidths(table) {
  const rows = table.getChildren();
  const cols = rows[0] ? rows[0].getChildrenSize() : 0;
  const widths = new Array(cols).fill(0);
  rows.forEach((row) =>
    row.getChildren().forEach((cell, i) => {
      if (i < cols) widths[i] = Math.max(widths[i], ...$imageWidthsIn(cell), 0);
    }),
  );
  return widths;
}

// Largest width an image in `colIndex` can take without squeezing other columns below their minimum.
export function $maxImageWidth(table, colIndex, tableWidth, padX) {
  const others = $columnImageWidths(table).reduce(
    (sum, w, i) => (i === colIndex ? sum : sum + (w ? w + padX : MIN_COLUMN_WIDTH)),
    0,
  );
  return Math.max(MIN_COLUMN_WIDTH, tableWidth - others - padX);
}

// Columns holding a resized image hug it; the rest share what's left equally.
export function $distributeTableColumns(table, tableWidth, padX) {
  const imageWidths = $columnImageWidths(table);
  if (imageWidths.every((w) => !w)) {
    if (table.getColWidths()) table.setColWidths(undefined);
    return;
  }
  const widths = imageWidths.map((w) => (w ? w + padX : MIN_COLUMN_WIDTH));
  // -1 leaves room for the collapsed outer border so the table never overflows its container.
  const extra = tableWidth - 1 - widths.reduce((a, b) => a + b, 0);
  if (extra > 0) {
    const free = imageWidths.map((w) => !w);
    const freeCount = free.filter(Boolean).length;
    widths.forEach((w, i) => {
      if (freeCount) widths[i] = free[i] ? w + extra / freeCount : w;
      else widths[i] = w + extra / widths.length;
    });
  }
  table.setColWidths(widths.map((w) => Math.floor(w)));
}
