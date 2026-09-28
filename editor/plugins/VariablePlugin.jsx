import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TextNode } from 'lexical';
import { $createVariableNode, VARIABLE_REGEX } from '../nodes/VariableNode';

// Typing {{something}} turns it into a highlighted merge-field token.
export default function VariablePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(
    () =>
      editor.registerNodeTransform(TextNode, (node) => {
        if (!node.isSimpleText()) return;
        const match = VARIABLE_REGEX.exec(node.getTextContent());
        if (!match) return;

        const start = match.index;
        const end = start + match[0].length;
        let target;
        if (start === 0) [target] = node.splitText(end);
        else [, target] = node.splitText(start, end);

        const variable = $createVariableNode(target.getTextContent().replace(/\s+/g, ''));
        target.replace(variable);
      }),
    [editor],
  );

  return null;
}
