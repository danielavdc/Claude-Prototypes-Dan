import { $applyNodeReplacement, $createParagraphNode, ElementNode } from 'lexical';

// Column distributions offered by the "Configure columns layout" modal (values are percentages).
export const COLUMN_LAYOUTS = {
  2: [
    [50, 50],
    [25, 75],
    [75, 25],
  ],
  3: [
    [33, 33, 33],
    [50, 25, 25],
    [25, 25, 50],
  ],
};

export const toTemplateColumns = (split) => split.map((p) => `${p}fr`).join(' ');

/* ---------- container ---------- */

export class LayoutContainerNode extends ElementNode {
  static getType() {
    return 'layout-container';
  }

  static clone(node) {
    return new LayoutContainerNode(node.__templateColumns, node.__key);
  }

  static importJSON(json) {
    return $createLayoutContainerNode(json.templateColumns).updateFromJSON(json);
  }

  constructor(templateColumns = '1fr 1fr', key) {
    super(key);
    this.__templateColumns = templateColumns;
  }

  exportJSON() {
    return { ...super.exportJSON(), templateColumns: this.__templateColumns };
  }

  createDOM() {
    const dom = document.createElement('div');
    dom.className = 'te-columns';
    dom.style.gridTemplateColumns = this.__templateColumns;
    return dom;
  }

  updateDOM(prevNode, dom) {
    if (prevNode.__templateColumns !== this.__templateColumns) {
      dom.style.gridTemplateColumns = this.__templateColumns;
    }
    return false;
  }

  exportDOM() {
    const dom = document.createElement('div');
    dom.style.display = 'grid';
    dom.style.gridTemplateColumns = this.__templateColumns;
    dom.style.gap = '16px';
    dom.style.margin = '4px 0 14px';
    return { element: dom };
  }

  // Selection and block logic treat each column as its own document.
  isShadowRoot() {
    return true;
  }

  canBeEmpty() {
    return false;
  }
}

export function $createLayoutContainerNode(templateColumns) {
  return $applyNodeReplacement(new LayoutContainerNode(templateColumns));
}

export function $isLayoutContainerNode(node) {
  return !!node && node.getType() === 'layout-container';
}

/* ---------- column ---------- */

export class LayoutItemNode extends ElementNode {
  static getType() {
    return 'layout-item';
  }

  static clone(node) {
    return new LayoutItemNode(node.__key);
  }

  static importJSON(json) {
    return $createLayoutItemNode().updateFromJSON(json);
  }

  createDOM() {
    const dom = document.createElement('div');
    dom.className = 'te-column';
    return dom;
  }

  updateDOM() {
    return false;
  }

  exportDOM() {
    const dom = document.createElement('div');
    dom.style.minWidth = '0';
    return { element: dom };
  }

  isShadowRoot() {
    return true;
  }

  canBeEmpty() {
    return false;
  }
}

export function $createLayoutItemNode() {
  return $applyNodeReplacement(new LayoutItemNode());
}

export function $isLayoutItemNode(node) {
  return !!node && node.getType() === 'layout-item';
}

// Blocks the user types into (vs. elements like dividers, tables and images).
const TEXT_BLOCK_TYPES = ['paragraph', 'heading', 'quote', 'list'];

export function $isTextBlock(node) {
  return !!node && TEXT_BLOCK_TYPES.includes(node.getType());
}

// A paragraph / heading / quote (or single-item list) with nothing typed in it.
export function $isEmptyTextBlock(node) {
  if (!$isTextBlock(node)) return false;
  if (node.getType() === 'list') {
    return node.getChildrenSize() === 1 && node.getFirstChild().getChildrenSize() === 0;
  }
  return node.getChildrenSize() === 0;
}

// A column counts as empty (shows the "Add Element" box) when it holds one blank text block.
export function $isLayoutItemEmpty(item) {
  const children = item.getChildren();
  if (children.length === 0) return true;
  return children.length === 1 && $isEmptyTextBlock(children[0]);
}

// True when a column only holds text blocks — used to tell "deleted my text" from "deleted an element".
export function $isTextOnlyItem(item) {
  return item.getChildren().every($isTextBlock);
}

export function $createColumnsLayout(split) {
  const container = $createLayoutContainerNode(toTemplateColumns(split));
  split.forEach(() => container.append($createLayoutItemNode().append($createParagraphNode())));
  return container;
}
