import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';

/*
 * Deleting a heading or quote must never re-style the block below it.
 * By default, removing the boundary between two blocks merges the lower one into
 * the upper one, so a paragraph under a heading turns into a heading. Here the
 * lower block always keeps its own format.
 */

const TEXT_BLOCKS = ['paragraph', 'heading', 'quote'];
const $isTextBlock = (node) => !!node && TEXT_BLOCKS.includes(node.getType());
const $isEmptyBlock = (node) => $isTextBlock(node) && node.getChildrenSize() === 0;

// Nearest paragraph/heading/quote that sits directly in the page, a column or a cell.
const $blockOf = (node) =>
  $findMatchingParent(node, (n) => $isTextBlock(n) && $isRootOrShadowRoot(n.getParent()));

function $isPointAtStartOf(point, block) {
  if (point.offset !== 0) return false;
  let node = point.getNode();
  while (node && node !== block) {
    if (node.getPreviousSibling()) return false;
    node = node.getParent();
  }
  return node === block;
}

function $setPointToEndOf(point, block) {
  const last = block.getLastDescendant();
  if ($isTextNode(last)) point.set(last.getKey(), last.getTextContentSize(), 'text');
  else if ($isElementNode(last)) point.set(last.getKey(), last.getChildrenSize(), 'element');
  else point.set(block.getKey(), block.getChildrenSize(), 'element');
}

// A range that starts at the very beginning of one block and ends inside a later one (same
// container): the upper blocks go away entirely and only the covered part of the lower block is
// trimmed — so the lower block keeps its own format.
function $deleteRangeKeepingLowerFormat(selection) {
  const backward = selection.isBackward();
  const start = backward ? selection.focus : selection.anchor;
  const end = backward ? selection.anchor : selection.focus;
  const startBlock = $blockOf(start.getNode());
  const endBlock = $blockOf(end.getNode());
  if (!startBlock || !endBlock || startBlock === endBlock) return false;
  if (!$isPointAtStartOf(start, startBlock) || startBlock.getParent() !== endBlock.getParent()) return false;

  const endPoint = { key: end.key, offset: end.offset, type: end.type };
  let node = startBlock;
  while (node && node !== endBlock) {
    const next = node.getNextSibling();
    node.remove();
    node = next;
  }
  // Trim the covered start of the lower block, inside that block only.
  endBlock.selectStart();
  const trim = $getSelection();
  if ($isRangeSelection(trim)) {
    trim.focus.set(endPoint.key, endPoint.offset, endPoint.type);
    if (!trim.isCollapsed()) trim.removeText();
  }
  return true;
}

export default function BlockMergePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(
    () =>
      mergeRegister(
        // Backspace at the start of a block right under an empty heading/quote/paragraph:
        // drop the empty block instead of merging this one into it.
        editor.registerCommand(
          KEY_BACKSPACE_COMMAND,
          (event) => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return false;
            if (!selection.isCollapsed()) {
              if (!$deleteRangeKeepingLowerFormat(selection)) return false;
              event?.preventDefault();
              return true;
            }
            const block = $blockOf(selection.anchor.getNode());
            if (!block || !$isPointAtStartOf(selection.anchor, block)) return false;
            const prev = block.getPreviousSibling();
            if (!$isEmptyBlock(prev)) return false;
            event?.preventDefault();
            prev.remove();
            return true;
          },
          COMMAND_PRIORITY_LOW,
        ),

        // Delete inside an empty heading/quote/paragraph: remove it; the block below stays as it is.
        editor.registerCommand(
          KEY_DELETE_COMMAND,
          (event) => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return false;
            if (!selection.isCollapsed()) {
              if (!$deleteRangeKeepingLowerFormat(selection)) return false;
              event?.preventDefault();
              return true;
            }
            const block = $blockOf(selection.anchor.getNode());
            const next = block && block.getNextSibling();
            if (!$isEmptyBlock(block) || !$isTextBlock(next)) return false;
            event?.preventDefault();
            block.remove();
            next.selectStart();
            return true;
          },
          COMMAND_PRIORITY_LOW,
        ),

        // A selection that runs to the very start of the next block (e.g. dragging over a whole
        // heading) is pulled back to the end of the previous one, so deleting or typing over it
        // doesn't swallow the next block's format.
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || selection.isCollapsed()) return false;
            const backward = selection.isBackward();
            const start = backward ? selection.focus : selection.anchor;
            const end = backward ? selection.anchor : selection.focus;
            const startBlock = $blockOf(start.getNode());
            const endBlock = $blockOf(end.getNode());
            if (!startBlock || !endBlock || startBlock === endBlock) return false;
            if (!$isPointAtStartOf(end, endBlock)) return false;
            const prev = endBlock.getPreviousSibling();
            if (!$isTextBlock(prev)) return false;
            $setPointToEndOf(end, prev);
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
      ),
    [editor],
  );

  return null;
}
