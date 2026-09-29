import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isElementNode, $isParagraphNode } from 'lexical';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $isListItemNode, $isListNode } from '@lexical/list';
import { $isLayoutContainerNode } from '../nodes/LayoutNodes';

// Empty template: orient the user toward writing a pitch to media contacts.
const EMPTY_PAGE_PLACEHOLDER = "Start your pitch — what's the story, and why should this journalist care?";
const EMPTY_LINE_PLACEHOLDER = 'Keep building your pitch: add key facts, a quote, or your ask…';

// One heading hint for every level.
const HEADING_PLACEHOLDER = 'Add a clear section heading';

function placeholderFor(node, isEmptyPage) {
  if ($isHeadingNode(node)) return HEADING_PLACEHOLDER;
  if ($isQuoteNode(node)) return 'Add a quote from your spokesperson or source…';
  if ($isListItemNode(node)) return 'One key fact per line…';
  if ($isParagraphNode(node)) return isEmptyPage ? EMPTY_PAGE_PLACEHOLDER : EMPTY_LINE_PLACEHOLDER;
  return null;
}

const isBlank = (node) => $isElementNode(node) && node.getChildrenSize() === 0;

// Every empty block on the page (or in a column) that should show a hint.
function $collectEmptyBlocks() {
  const found = [];
  const visit = (blocks) =>
    blocks.forEach((block) => {
      if ($isLayoutContainerNode(block)) {
        block.getChildren().forEach((item) => visit(item.getChildren()));
      } else if ($isListNode(block)) {
        block.getChildren().forEach((li) => isBlank(li) && found.push(li));
      } else if (isBlank(block)) {
        found.push(block);
      }
    });
  visit($getRoot().getChildren());
  return found;
}

// Empty blocks always show their hint — not only under the caret — so it's clear
// there's something there to build on even after clicking elsewhere.
export default function PlaceholderPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let marked = new Set();

    const paint = (editorState) => {
      const next = new Map();
      editorState.read(() => {
        const isEmptyPage = $getRoot().getTextContent().trim() === '';
        $collectEmptyBlocks().forEach((node) => {
          const text = placeholderFor(node, isEmptyPage);
          const el = text && editor.getElementByKey(node.getKey());
          if (el) next.set(el, text);
        });
      });
      marked.forEach((el) => !next.has(el) && el.removeAttribute('data-placeholder'));
      next.forEach((text, el) => el.getAttribute('data-placeholder') !== text && el.setAttribute('data-placeholder', text));
      marked = new Set(next.keys());
    };

    paint(editor.getEditorState()); // initial content isn't an "update"
    const unregister = editor.registerUpdateListener(({ editorState }) => paint(editorState));

    return () => {
      unregister();
      marked.forEach((el) => el.removeAttribute('data-placeholder'));
    };
  }, [editor]);

  return null;
}
