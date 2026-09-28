import { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode, $createHeadingNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from '@lexical/react/LexicalHorizontalRuleNode';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import {
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CHECK_LIST,
  HEADING,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  UNORDERED_LIST,
} from '@lexical/markdown';
import { $generateHtmlFromNodes } from '@lexical/html';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';

import { VariableNode, $createVariableNode } from './nodes/VariableNode';
import { ImageNode } from './nodes/ImageNode';
import { BlockImageNode } from './nodes/BlockImageNode';
import { LayoutContainerNode, LayoutItemNode } from './nodes/LayoutNodes';
import VariablePlugin from './plugins/VariablePlugin';
import PlaceholderPlugin from './plugins/PlaceholderPlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import TextToolbarPlugin from './toolbar/TextToolbarPlugin';
import AddElementPlugin from './plugins/AddElementPlugin';
import TableControlsPlugin from './plugins/TableControlsPlugin';
import ColumnPlaceholdersPlugin from './plugins/ColumnPlaceholdersPlugin';
import ColumnLayoutPlugin from './plugins/ColumnLayoutPlugin';
import PastePlugin, { TOAST_EVENT } from './paste/PastePlugin';
import { HTML_IMPORT } from './paste/htmlImport';
import { Icon } from './icons';

const STORAGE_KEY = 'outreach-template-draft';

// Typing --- on an empty line turns it into a divider (Notion/Markdown habit).
const DIVIDER = {
  dependencies: [HorizontalRuleNode],
  export: (node) => ($isHorizontalRuleNode(node) ? '---' : null),
  regExp: /^(---|\*\*\*|___)\s?$/,
  replace: (parentNode, _children, _match, isImport) => {
    const line = $createHorizontalRuleNode();
    if (isImport || parentNode.getNextSibling() != null) parentNode.replace(line);
    else parentNode.insertBefore(line);
    line.selectNext();
  },
  type: 'element',
};

const TRANSFORMERS = [
  DIVIDER,
  HEADING,
  QUOTE,
  CHECK_LIST,
  UNORDERED_LIST,
  ORDERED_LIST,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
];

const SAMPLE_VALUES = { first_name: 'Alex', last_name: 'Morgan', outlet: 'The Daily Tech' };

const theme = {
  paragraph: 'te-p',
  heading: { h1: 'te-h1', h2: 'te-h2', h3: 'te-h3' },
  quote: 'te-quote',
  link: 'te-link-text',
  hr: 'te-hr',
  table: 'te-table',
  tableRow: 'te-tr',
  tableCell: 'te-td',
  tableCellHeader: 'te-th',
  tableCellSelected: 'te-td-selected',
  tableSelection: 'te-table-selection',
  hrSelected: 'te-hr-selected',
  list: {
    ul: 'te-ul',
    ol: 'te-ol',
    listitem: 'te-li',
    listitemChecked: 'te-li-checked',
    listitemUnchecked: 'te-li-unchecked',
    nested: { listitem: 'te-li-nested' },
  },
  text: {
    bold: 'te-bold',
    italic: 'te-italic',
    underline: 'te-underline',
    strikethrough: 'te-strike',
    underlineStrikethrough: 'te-underline-strike',
  },
};

function $initialContent() {
  const root = $getRoot();
  const heading = $createHeadingNode('h2').append($createTextNode('Add a clear section heading'));
  const greeting = $createParagraphNode().append(
    $createTextNode('Hi '),
    $createVariableNode('{{first_name}}'),
    $createTextNode(','),
  );
  const pitch = $createParagraphNode().append(
    $createTextNode("Write your pitch here — the story, why it's timely, and why it matters to their audience."),
  );
  const ask = $createParagraphNode().append(
    $createTextNode('End with a clear ask, like requesting an interview or more details.'),
  );
  root.append(heading, greeting, pitch, ask);
}

function readDraft() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/* ---------- Top chrome ---------- */

function HistoryButtons() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(
    () =>
      mergeRegister(
        editor.registerCommand(CAN_UNDO_COMMAND, (v) => (setCanUndo(v), false), COMMAND_PRIORITY_LOW),
        editor.registerCommand(CAN_REDO_COMMAND, (v) => (setCanRedo(v), false), COMMAND_PRIORITY_LOW),
      ),
    [editor],
  );

  return (
    <>
      <button
        type="button"
        className="te-icon-btn"
        title="Undo (⌘Z)"
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <Icon name="undo" size={18} />
      </button>
      <button
        type="button"
        className="te-icon-btn"
        title="Redo (⇧⌘Z)"
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <Icon name="redo" size={18} />
      </button>
    </>
  );
}

function SaveButton({ onSaved }) {
  const [editor] = useLexicalComposerContext();
  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editor.getEditorState().toJSON()));
    } catch {
      /* storage unavailable — still confirm, it's a prototype */
    }
    onSaved();
  };
  return (
    <div className="te-split">
      <button type="button" className="te-split-main" onClick={save}>
        Save
      </button>
      <button type="button" className="te-split-caret" aria-label="More save options">
        <Icon name="caret" size={18} />
      </button>
    </div>
  );
}

/* ---------- Edit / Preview ---------- */

function ModeToggle({ mode, onChange }) {
  return (
    <div className="te-toggle" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'edit'}
        className={mode === 'edit' ? 'is-active' : ''}
        onClick={() => onChange('edit')}
      >
        <Icon name="pencil" size={14} /> Edit
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'preview'}
        className={mode === 'preview' ? 'is-active' : ''}
        onClick={() => onChange('preview')}
      >
        <Icon name="eye" size={15} /> Preview
      </button>
    </div>
  );
}

function PreviewPane() {
  const [editor] = useLexicalComposerContext();
  const [html, setHtml] = useState('');

  useEffect(() => {
    editor.getEditorState().read(() => {
      const raw = $generateHtmlFromNodes(editor, null);
      setHtml(
        raw.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (m, key) => SAMPLE_VALUES[key] ?? m),
      );
    });
  }, [editor]);

  return <div className="te-preview" dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ---------- Editor card ---------- */

function EditorCard({ mode, canvasElem }) {
  const [anchorElem, setAnchorElem] = useState(null);

  return (
    <div className="te-card">
      <div className="te-card-inner" ref={setAnchorElem} hidden={mode !== 'edit'}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="te-content" aria-label="Template body" />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <HorizontalRulePlugin />
        <ColumnLayoutPlugin />
        <PastePlugin />
        <TablePlugin hasCellMerge={false} hasCellBackgroundColor />
        <CheckListPlugin />
        <TabIndentationPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <VariablePlugin />
        <PlaceholderPlugin />
        {anchorElem && (
          <>
            <DraggableBlockPlugin anchorElem={anchorElem} />
            <TableControlsPlugin anchorElem={anchorElem} />
            <ColumnPlaceholdersPlugin anchorElem={anchorElem} />
          </>
        )}
        {canvasElem && <TextToolbarPlugin anchorElem={canvasElem} />}
        <AddElementPlugin />
      </div>
      {mode === 'preview' && <PreviewPane />}
    </div>
  );
}

/* ---------- Page ---------- */

export default function TemplateEditor() {
  const [mode, setMode] = useState('edit');
  const [toast, setToast] = useState(null);
  const [canvasElem, setCanvasElem] = useState(null);

  useEffect(() => {
    const onToast = (e) => setToast(e.detail);
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const draft = readDraft();
  const initialConfig = {
    namespace: 'OutreachTemplate',
    theme,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, HorizontalRuleNode, TableNode, TableRowNode, TableCellNode, ImageNode, BlockImageNode, LayoutContainerNode, LayoutItemNode, VariableNode],
    editorState: draft || $initialContent,
    html: { import: HTML_IMPORT },
    onError(error) {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="te-page">
        <header className="te-header">
          <div className="te-title">
            <Icon name="logo" size={34} />
            <h1>Create Outreach Template</h1>
          </div>
          <button type="button" className="te-icon-btn" aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className="te-toolbar">
          <div className="te-toolbar-left">
            <button type="button" className="te-icon-btn" aria-label="Back">
              <Icon name="back" size={20} />
            </button>
            <span className="te-vdivider" />
            <HistoryButtons />
          </div>
          <div className="te-toolbar-right">
            <button type="button" className="te-text-btn">
              <Icon name="send" size={18} /> Send Test Email
            </button>
            <SaveButton onSaved={() => setToast('Template saved')} />
          </div>
        </div>

        <main className="te-canvas" ref={setCanvasElem}>
          <ModeToggle mode={mode} onChange={setMode} />
          <EditorCard mode={mode} canvasElem={canvasElem} />
        </main>

        {toast && <div className="te-toast">{toast}</div>}
      </div>
    </LexicalComposer>
  );
}
