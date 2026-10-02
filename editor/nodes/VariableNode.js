import { TextNode, $applyNodeReplacement } from 'lexical';

// Merge field like {{first_name}}. Token mode makes it behave as one unit:
// the caret can't land inside it and Backspace removes it whole.
export class VariableNode extends TextNode {
  static getType() {
    return 'variable';
  }

  static clone(node) {
    return new VariableNode(node.__text, node.__key);
  }

  static importJSON(serializedNode) {
    return $createVariableNode(serializedNode.text).updateFromJSON(serializedNode);
  }

  createDOM(config) {
    const dom = super.createDOM(config);
    dom.classList.add('te-variable');
    dom.spellcheck = false;
    return dom;
  }

  canInsertTextBefore() {
    return false;
  }

  canInsertTextAfter() {
    return false;
  }
}

export function $createVariableNode(text) {
  return $applyNodeReplacement(new VariableNode(text).setMode('token'));
}

export function $isVariableNode(node) {
  return node instanceof VariableNode;
}

export const VARIABLE_REGEX = /\{\{\s*[a-zA-Z0-9_.]+\s*\}\}/;

// Lexical keeps the node class registered at startup; a hot-swapped class no longer matches it
// ("Type … does not match registered node"), so changes here reload the page instead.
if (import.meta.hot) import.meta.hot.decline();
