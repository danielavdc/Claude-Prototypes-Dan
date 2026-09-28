import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection, $isRangeSelection, $isParagraphNode, $isRootNode } from 'lexical';
import { $findMatchingParent } from '@lexical/utils';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $isListItemNode } from '@lexical/list';

const HEADING_PLACEHOLDER = { h1: 'Heading 1', h2: 'Heading 2', h3: 'Heading 3' };

// Empty template: orient the user toward writing a pitch to media contacts.
const EMPTY_PAGE_PLACEHOLDER = "Start your pitch — what's the story, and why should this journalist care?";
const EMPTY_LINE_PLACEHOLDER = 'Keep building your pitch: add key facts, a quote, or your ask…';

function placeholderFor(node, isEmptyPage) {
  if ($isHeadingNode(node)) return HEADING_PLACEHOLDER[node.getTag()] || 'Heading';
  if ($isQuoteNode(node)) return 'Add a quote from your spokesperson or source…';
  if ($isListItemNode(node)) return 'List';
  if ($isParagraphNode(node)) return isEmptyPage ? EMPTY_PAGE_PLACEHOLDER : EMPTY_LINE_PLACEHOLDER;
  return null;
}

// Notion-style hint: only the empty block holding the caret shows a placeholder.
export default function PlaceholderPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let current = null;
    const clear = () => {
      if (current) current.removeAttribute('data-placeholder');
      current = null;
    };

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        let target = null;
        let text = null;
        if (editor.isEditable() && $isRangeSelection(selection) && selection.isCollapsed()) {
          const anchor = selection.anchor.getNode();
          const block = $isRootNode(anchor)
            ? null
            : $findMatchingParent(anchor, $isListItemNode) || anchor.getTopLevelElement();
          if (block && block.getTextContent() === '') {
            text = placeholderFor(block, $getRoot().getTextContent().trim() === '');
            if (text) target = editor.getElementByKey(block.getKey());
          }
        }
        if (target !== current) clear();
        if (target && text) {
          target.setAttribute('data-placeholder', text);
          current = target;
        }
      });
    });

    const onBlur = () => clear();
    const root = editor.getRootElement();
    root?.addEventListener('blur', onBlur);
    return () => {
      unregister();
      root?.removeEventListener('blur', onBlur);
      clear();
    };
  }, [editor]);

  return null;
}
