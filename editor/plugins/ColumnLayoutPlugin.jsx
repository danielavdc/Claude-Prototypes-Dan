import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createNodeSelection,
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isParagraphNode,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ESCAPE_COMMAND,
} from 'lexical';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  $isLayoutContainerNode,
  $isLayoutItemEmpty,
  $isLayoutItemNode,
  LayoutContainerNode,
  LayoutItemNode,
} from '../nodes/LayoutNodes';

const columnCount = (container) => container.__templateColumns.trim().split(/\s+/).length;

// Removes the whole layout and leaves the caret on a neighbouring line.
function $removeLayout(container) {
  let next = container.getNextSibling();
  const prev = container.getPreviousSibling();
  if (!$isElementNode(next) && !$isElementNode(prev)) {
    next = $createParagraphNode();
    container.insertAfter(next);
  }
  container.remove();
  if ($isElementNode(next)) next.selectStart();
  else prev.selectEnd();
}

function $isAtStartOf(selection, block) {
  if (!selection.isCollapsed() || selection.anchor.offset !== 0) return false;
  let node = selection.anchor.getNode();
  while (node && node !== block) {
    if (node.getPreviousSibling()) return false;
    node = node.getParent();
  }
  return node === block;
}

function $isAtEndOf(selection, block) {
  if (!selection.isCollapsed()) return false;
  const { anchor } = selection;
  let node = anchor.getNode();
  const size = anchor.type === 'text' ? node.getTextContentSize() : node.getChildrenSize();
  if (anchor.offset !== size) return false;
  while (node && node !== block) {
    if (node.getNextSibling()) return false;
    node = node.getParent();
  }
  return node === block;
}

function $selectedLayouts(selection) {
  return $isNodeSelection(selection) ? selection.getNodes().filter($isLayoutContainerNode) : [];
}

function $selectLayout(container) {
  const selection = $createNodeSelection();
  selection.add(container.getKey());
  $setSelection(selection);
}

// Deleting inside a column layout always removes the layout as a whole — never a single column.
export default function ColumnLayoutPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const onDeleteKey = (backward) => (event) => {
      const selection = $getSelection();

      // Layout already selected → delete it.
      const selected = $selectedLayouts(selection);
      if (selected.length) {
        event.preventDefault();
        selected.forEach($removeLayout);
        return true;
      }
      if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;

      const anchor = selection.anchor.getNode();
      const item = $findMatchingParent(anchor, $isLayoutItemNode);
      if (item) {
        // Backspace in an emptied column never removes anything: a blank heading/quote turns back
        // into a paragraph, a blank paragraph stays put — easy to recover from mistakes.
        if (backward && $isLayoutItemEmpty(item)) {
          event.preventDefault();
          const block = item.getFirstChild();
          if (block && !$isParagraphNode(block)) {
            const paragraph = $createParagraphNode();
            block.replace(paragraph);
            paragraph.select();
          }
          return true;
        }
        // Never merge content across column boundaries.
        const edge = backward ? item.getFirstChild() : item.getLastChild();
        if (edge && (backward ? $isAtStartOf(selection, edge) : $isAtEndOf(selection, edge))) {
          event.preventDefault();
          return true;
        }
        return false;
      }

      // Next to a layout from outside: first press selects it, second press deletes it.
      const block = anchor.getTopLevelElement();
      if (!block) return false;
      const neighbour = backward ? block.getPreviousSibling() : block.getNextSibling();
      if ($isLayoutContainerNode(neighbour) && (backward ? $isAtStartOf(selection, block) : $isAtEndOf(selection, block))) {
        event.preventDefault();
        // An empty line right after the layout just goes away, like any empty line.
        if (backward && block.getTextContent() === '' && block.getChildrenSize() === 0 && block.getNextSibling()) {
          block.remove();
        }
        $selectLayout(neighbour);
        return true;
      }
      return false;
    };

    return mergeRegister(
      // A range deletion that cuts through a layout leaves it with missing columns — drop the rest of it.
      editor.registerNodeTransform(LayoutContainerNode, (container) => {
        const items = container.getChildren();
        if (items.length < columnCount(container) || items.some((child) => !$isLayoutItemNode(child))) {
          $removeLayout(container);
        }
      }),
      // A column that ended up outside its layout gives its content back to the document.
      editor.registerNodeTransform(LayoutItemNode, (item) => {
        if ($isLayoutContainerNode(item.getParent())) return;
        item.getChildren().forEach((child) => item.insertBefore(child));
        item.remove();
      }),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDeleteKey(true), COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_DELETE_COMMAND, onDeleteKey(false), COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (!$selectedLayouts($getSelection()).length) return false;
          $setSelection(null);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      // Visual state for a selected layout.
      editor.registerUpdateListener(({ editorState }) => {
        const keys = new Set();
        editorState.read(() => $selectedLayouts($getSelection()).forEach((n) => keys.add(n.getKey())));
        editor
          .getRootElement()
          ?.querySelectorAll('.te-columns')
          .forEach((el) => el.classList.remove('is-selected'));
        keys.forEach((key) => editor.getElementByKey(key)?.classList.add('is-selected'));
      }),
    );
  }, [editor]);

  return null;
}
