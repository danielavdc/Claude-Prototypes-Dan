import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $getSelection,
  $isNodeSelection,
  COMMAND_PRIORITY_HIGH,
  KEY_ENTER_COMMAND,
} from 'lexical';

// Blocks that get selected as a whole (the selection outline) instead of holding a caret.
const SELECTABLE_BLOCKS = ['horizontalrule', 'block-image'];

/*
 * Enter on a selected divider (or block image) opens a new empty paragraph right below it,
 * with the caret inside — the same line Enter creates anywhere else.
 */
export default function BlockKeyboardPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(
    () =>
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event) => {
          const selection = $getSelection();
          if (!$isNodeSelection(selection)) return false;
          const nodes = selection.getNodes();
          if (nodes.length !== 1 || !SELECTABLE_BLOCKS.includes(nodes[0].getType())) return false;
          event?.preventDefault();
          const paragraph = $createParagraphNode();
          nodes[0].insertAfter(paragraph);
          paragraph.select();
          return true;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    [editor],
  );

  return null;
}
