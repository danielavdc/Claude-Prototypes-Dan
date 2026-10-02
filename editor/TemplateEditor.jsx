import { useEffect, useRef, useState } from 'react';
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
import { HEADER_CELL_COLOR } from './plugins/TableControlsPlugin';
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
import AddElementPlugin, { ToolbarAddElement } from './plugins/AddElementPlugin';
import BlockKeyboardPlugin from './plugins/BlockKeyboardPlugin';
import TableControlsPlugin from './plugins/TableControlsPlugin';
import TableResizePlugin from './plugins/TableResizePlugin';
import ColumnPlaceholdersPlugin from './plugins/ColumnPlaceholdersPlugin';
import ColumnResizePlugin from './plugins/ColumnResizePlugin';
import ColumnLayoutPlugin from './plugins/ColumnLayoutPlugin';
import BlockMergePlugin from './plugins/BlockMergePlugin';
import CellPlaceholderPlugin from './plugins/CellPlaceholderPlugin';
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
  const heading = $createHeadingNode('h2').append($createTextNode('Lead with your headline'));
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

// v2 key: Fixed became the default, so earlier saved choices (incl. test runs) don't override it.
const TOOLBAR_VARIANT_KEY = 'te-toolbar-variant-v2';

function readToolbarVariant() {
  try {
    return localStorage.getItem(TOOLBAR_VARIANT_KEY) === 'floating' ? 'floating' : 'fixed';
  } catch {
    return 'fixed';
  }
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

// Preview widths: desktop = the template card, mobile = the common 375px email viewport.
function DeviceToggle({ device, onChange }) {
  return (
    <div className="te-toggle te-toggle-icon" role="tablist" aria-label="Preview device">
      {[
        { key: 'desktop', label: 'Desktop preview' },
        { key: 'mobile', label: 'Mobile preview' },
      ].map((d) => (
        <button
          key={d.key}
          type="button"
          role="tab"
          aria-label={d.label}
          title={d.label}
          aria-selected={device === d.key}
          className={device === d.key ? 'is-active' : ''}
          onClick={() => onChange(d.key)}
        >
          <Icon name={d.key} size={18} />
        </button>
      ))}
    </div>
  );
}

const CANVAS_COPY = {
  edit: {
    title: 'Build Your Template',
    hint: 'Shape a reusable pitch with images, tables, columns and more.',
  },
  preview: {
    title: 'Previewing Your Template',
    hint: 'A close look at what your recipients will see.',
  },
};

function CanvasBar({ mode, onModeChange, device, onDeviceChange }) {
  const barRef = useRef(null);
  const copy = CANVAS_COPY[mode === 'preview' ? 'preview' : 'edit'];

  // The fixed toolbar sticks right under this bar, so it needs the bar's real height
  // (the hint can wrap to two lines on narrow screens).
  useEffect(() => {
    const bar = barRef.current;
    const canvas = bar?.closest('.te-canvas');
    if (!bar || !canvas) return undefined;
    const sync = () => canvas.style.setProperty('--te-canvas-bar-h', `${bar.offsetHeight}px`);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="te-canvas-bar" ref={barRef}>
      <div className="te-canvas-heading">
        <h2 className="te-canvas-title">{copy.title}</h2>
        <p className="te-canvas-hint">{copy.hint}</p>
      </div>
      <div className="te-canvas-actions">
        {mode === 'preview' && <DeviceToggle device={device} onChange={onDeviceChange} />}
        <ModeToggle mode={mode} onChange={onModeChange} />
      </div>
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

// Cells export with the editor's look: our borders, the header's default aqua (Lexical's own
// default is grey) and no fixed pixel widths, so the table fills the preview width (also on mobile).
const HTML_EXPORT = new Map([
  // Dragged column widths export as percentages, so the table keeps its proportions and still
  // fits any width (desktop, mobile, email clients).
  [
    TableNode,
    (editor, node) => {
      const output = node.exportDOM(editor);
      const { after } = output;
      return {
        ...output,
        after: (el) => {
          const out = after ? after(el) : el;
          const table = out && (out.tagName === 'TABLE' ? out : out.querySelector?.('table'));
          const cols = table ? [...table.querySelectorAll('col')] : [];
          const widths = cols.map((c) => parseFloat(c.style.width) || 0);
          const sum = widths.reduce((a, b) => a + b, 0);
          if (sum > 0) cols.forEach((c, i) => (c.style.width = `${((widths[i] / sum) * 100).toFixed(2)}%`));
          return out;
        },
      };
    },
  ],
  [
    TableCellNode,
    (editor, node) => {
      const output = node.exportDOM(editor);
      const el = output.element;
      if (el instanceof HTMLElement) {
        el.style.removeProperty('border');
        el.style.removeProperty('width');
        if (!node.getBackgroundColor() && node.hasHeader()) el.style.backgroundColor = HEADER_CELL_COLOR;
      }
      return output;
    },
  ],
]);

/* ---------- Editor card ---------- */

function EditorCard({ mode, device, canvasElem, toolbarVariant }) {
  const [anchorElem, setAnchorElem] = useState(null);
  const [slotElem, setSlotElem] = useState(null);
  const mobile = mode === 'preview' && device === 'mobile';
  const fixedToolbar = toolbarVariant === 'fixed';

  return (
    <div className={`te-card${mobile ? ' is-mobile' : ''}`}>
      {/* Fixed (Jira-style) toolbar lives in this sticky strip at the top of the card */}
      {fixedToolbar && <div className="te-fixed-tb-slot" ref={setSlotElem} hidden={mode !== 'edit'} />}
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
        <BlockKeyboardPlugin />
        <ColumnLayoutPlugin />
        <BlockMergePlugin />
        <CellPlaceholderPlugin />
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
            <TableResizePlugin anchorElem={anchorElem} />
            <TableControlsPlugin anchorElem={anchorElem} />
            <ColumnPlaceholdersPlugin anchorElem={anchorElem} />
            <ColumnResizePlugin anchorElem={anchorElem} />
          </>
        )}
        {canvasElem &&
          (fixedToolbar ? (
            slotElem && (
              <TextToolbarPlugin
                key="fixed"
                variant="fixed"
                anchorElem={canvasElem}
                slotElem={slotElem}
                trailing={<ToolbarAddElement />}
              />
            )
          ) : (
            <TextToolbarPlugin key="floating" anchorElem={canvasElem} />
          ))}
        <AddElementPlugin />
      </div>
      {mode === 'preview' && <PreviewPane />}
    </div>
  );
}

/* ---------- Page ---------- */

export default function TemplateEditor() {
  const [mode, setMode] = useState('edit');
  const [device, setDevice] = useState('desktop');
  const [toolbarVariant, setToolbarVariant] = useState(readToolbarVariant);

  const chooseToolbarVariant = (v) => {
    setToolbarVariant(v);
    try {
      localStorage.setItem(TOOLBAR_VARIANT_KEY, v);
    } catch {
      /* storage unavailable — the choice just won't be remembered */
    }
  };
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
    html: { import: HTML_IMPORT, export: HTML_EXPORT },
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
          <div className="te-header-right">
            {/* Prototype switch to compare the two toolbar experiences */}
            <div className="te-variant" role="group" aria-label="Toolbar version">
              <span className="te-variant-label">Proposals Switch</span>
              {[
                { key: 'floating', label: 'Floating' },
                { key: 'fixed', label: 'Fixed' },
              ].map((v) => (
                <button
                  key={v.key}
                  type="button"
                  aria-pressed={toolbarVariant === v.key}
                  className={toolbarVariant === v.key ? 'is-active' : ''}
                  onClick={() => chooseToolbarVariant(v.key)}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <button type="button" className="te-icon-btn" aria-label="Close">
              <Icon name="close" size={20} />
            </button>
          </div>
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
          <CanvasBar mode={mode} onModeChange={setMode} device={device} onDeviceChange={setDevice} />
          <EditorCard mode={mode} device={device} canvasElem={canvasElem} toolbarVariant={toolbarVariant} />
        </main>

        {toast && <div className="te-toast">{toast}</div>}
      </div>
    </LexicalComposer>
  );
}
