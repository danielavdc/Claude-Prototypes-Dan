import { $getState, $isElementNode, $setState, createState } from 'lexical';

// UX spec: no column may collapse below this width.
export const MIN_COLUMN_WIDTH = 50;
// A row is never dragged shorter than one line of text plus the cell padding.
export const MIN_ROW_HEIGHT = 44;

// Set once the user drags a column border: from then on the table keeps its own proportions
// (instead of going back to equal columns) when columns or images change.
const manualColumnsState = createState('teManualColumns', { parse: (v) => v === true });
export const $hasManualColumns = (table) => $getState(table, manualColumnsState);
export function $setManualColumnWidths(table, widths) {
  table.setColWidths(widths.map((w) => Math.round(w)));
  $setState(table, manualColumnsState, true);
}

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

// Columns holding a resized image hug it; the rest share what's left — equally, or keeping the
// proportions the user dragged them to.
export function $distributeTableColumns(table, tableWidth, padX) {
  const imageWidths = $columnImageWidths(table);
  const current = table.getColWidths();
  const manual = $hasManualColumns(table) && current && current.length === imageWidths.length;
  if (!manual && imageWidths.every((w) => !w)) {
    if (current) table.setColWidths(undefined);
    return;
  }
  const weights = manual ? current.map((w) => Math.max(w, 1)) : imageWidths.map(() => 1);
  const widths = imageWidths.map((w) => (w ? w + padX : MIN_COLUMN_WIDTH));
  // -1 leaves room for the collapsed outer border so the table never overflows its container.
  const extra = tableWidth - 1 - widths.reduce((a, b) => a + b, 0);
  if (extra > 0) {
    const free = imageWidths.map((w) => !w);
    if (free.some(Boolean)) {
      // Free columns share the room left by weight (never below the minimum).
      const total = weights.reduce((sum, w, i) => (free[i] ? sum + w : sum), 0);
      const room = tableWidth - 1 - widths.reduce((sum, w, i) => (free[i] ? sum : sum + w), 0);
      widths.forEach((w, i) => {
        if (free[i]) widths[i] = Math.max(MIN_COLUMN_WIDTH, (room * weights[i]) / total);
      });
    } else {
      widths.forEach((w, i) => {
        widths[i] = w + extra / widths.length;
      });
    }
  }
  table.setColWidths(widths.map((w) => Math.floor(w)));
}
