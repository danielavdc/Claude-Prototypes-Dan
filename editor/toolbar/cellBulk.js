import {
  $createRangeSelection,
  $isElementNode,
  $isTextNode,
  $setSelection,
} from 'lexical';
import { $insertList, $isListItemNode, $isListNode, $removeList } from '@lexical/list';
import { $isTableCellNode } from '@lexical/table';
import { getCSSFromStyleObject, getStyleObjectFromCSS } from '@lexical/selection';
import { $dfs } from '@lexical/utils';

/*
 * Toolbar actions over a multi-cell (bulk) table selection. Each action runs cell by cell,
 * so every selected cell gets the same result: same format, colour, alignment, list…
 */

export const $selectedCells = (selection) => selection.getNodes().filter($isTableCellNode);

const $textNodesIn = (cell) => $dfs(cell).map(({ node }) => node).filter($isTextNode);

// Paragraphs / headings / quotes / list items directly holding text in the cell.
function $blocksIn(cell) {
  const blocks = [];
  cell.getChildren().forEach((child) => {
    if ($isListNode(child)) {
      $dfs(child).forEach(({ node }) => $isListItemNode(node) && blocks.push(node));
    } else if ($isElementNode(child)) {
      blocks.push(child);
    }
  });
  return blocks;
}

// Selects all of a cell's content as a range, for Lexical helpers that work on the selection.
function $selectCellContent(cell) {
  const first = cell.getFirstDescendant();
  const last = cell.getLastDescendant();
  if (!first || !last) return false;
  const range = $createRangeSelection();
  const at = (point, node, end) => {
    if ($isTextNode(node)) point.set(node.getKey(), end ? node.getTextContentSize() : 0, 'text');
    else if ($isElementNode(node)) point.set(node.getKey(), end ? node.getChildrenSize() : 0, 'element');
    else {
      const parent = node.getParentOrThrow();
      point.set(parent.getKey(), node.getIndexWithinParent() + (end ? 1 : 0), 'element');
    }
  };
  at(range.anchor, first, false);
  at(range.focus, last, true);
  $setSelection(range);
  return true;
}

/* ---------- reading ---------- */

export function $readCellsInfo(cells) {
  const texts = cells.flatMap($textNodesIn);
  const all = (format) => texts.length > 0 && texts.every((t) => t.hasFormat(format));
  const style = texts[0] ? getStyleObjectFromCSS(texts[0].getStyle()) : {};
  const firstBlock = cells[0] && $blocksIn(cells[0])[0];
  const lists = cells.map((cell) => {
    const child = cell.getFirstChild();
    return $isListNode(child) ? child.getListType() : null;
  });
  const listType = lists.length > 0 && lists.every((t) => t && t === lists[0]) ? lists[0] : null;
  return {
    bold: all('bold'),
    italic: all('italic'),
    underline: all('underline'),
    strikethrough: all('strikethrough'),
    fontFamily: style['font-family'] || '',
    fontSize: style['font-size'] ? parseInt(style['font-size'], 10) : 14,
    color: style.color || '',
    background: style['background-color'] || '',
    align: (firstBlock && firstBlock.getFormatType()) || 'left',
    listType,
  };
}

/* ---------- actions ---------- */

// Bold / italic / underline / strike: on everywhere unless every selected cell already has it.
export function $bulkFormatText(cells, format) {
  const texts = cells.flatMap($textNodesIn);
  const turnOff = texts.length > 0 && texts.every((t) => t.hasFormat(format));
  texts.forEach((t) => t.hasFormat(format) === turnOff && t.toggleFormat(format));
  // Empty cells start typing with the new format.
  cells.forEach((cell) =>
    $blocksIn(cell).forEach((block) => {
      if (block.getChildrenSize() === 0 && typeof block.toggleTextFormatType === 'function') {
        if (block.hasTextFormat(format) === turnOff) block.toggleTextFormatType(format);
      }
    }),
  );
}

const mergeStyle = (css, patch) => {
  const style = { ...getStyleObjectFromCSS(css || '') };
  Object.entries(patch).forEach(([key, value]) => {
    if (value == null) delete style[key];
    else style[key] = value;
  });
  return getCSSFromStyleObject(style);
};

// Font, size, text colour, text background.
export function $bulkPatchStyle(cells, patch) {
  cells.forEach((cell) => {
    $textNodesIn(cell).forEach((t) => t.setStyle(mergeStyle(t.getStyle(), patch)));
    $blocksIn(cell).forEach((block) => {
      if (typeof block.setTextStyle === 'function') block.setTextStyle(mergeStyle(block.getTextStyle(), patch));
    });
  });
}

export function $bulkCellColor(cells, hex) {
  cells.forEach((cell) => cell.setBackgroundColor(hex));
}

export function $bulkAlign(cells, align) {
  cells.forEach((cell) => $blocksIn(cell).forEach((block) => block.setFormat(align)));
}

export function $bulkIndent(cells, delta) {
  cells.forEach((cell) =>
    $blocksIn(cell).forEach((block) => block.setIndent(Math.max(0, block.getIndent() + delta))),
  );
}

// Lists: removed when every selected cell already is that list, otherwise every cell becomes one.
export function $bulkList(cells, type, currentType) {
  const remove = currentType === type;
  cells.forEach((cell) => {
    if (!$selectCellContent(cell)) return;
    if (remove) $removeList();
    else $insertList(type);
  });
}

// Emoji goes at the end of every selected cell.
export function $bulkInsertText(cells, text) {
  cells.forEach((cell) => {
    const last = cell.getLastChild();
    const block = $isListNode(last)
      ? $dfs(last).map(({ node }) => node).filter($isListItemNode).pop()
      : last;
    if (!$isElementNode(block)) return;
    block.selectEnd().insertText(text);
  });
}
