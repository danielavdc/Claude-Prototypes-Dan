import { useEffect, useRef, useState } from 'react';
import emptyTemplateIllustration from './assets/empty-template.svg';
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
  $isElementNode,
} from 'lexical';

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
import KeyboardNavPlugin from './plugins/KeyboardNavPlugin';
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

function readDraft() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/* ---------- Top chrome ---------- */

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
    hint: 'Shape a reusable pitch with images, tables, columns and more',
  },
  // Create Outreach, step 1: the editor sits in the "Default Message" card
  outreach: {
    title: 'Default Message',
    hint: null,
  },
  preview: {
    title: 'Preview Your Template',
    hint: 'A close look at what your recipients will see',
  },
};

function CanvasBar({ flow, mode, onModeChange, device, onDeviceChange }) {
  const barRef = useRef(null);
  const copy = CANVAS_COPY[flow === 'outreach' ? 'outreach' : mode === 'preview' ? 'preview' : 'edit'];

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
        {copy.hint && <p className="te-canvas-hint">{copy.hint}</p>}
      </div>
      <div className="te-canvas-actions">
        {/* Outreach step 1 has no Edit / Preview: it's always the editor */}
        {flow !== 'outreach' && (
          <>
            {mode === 'preview' && <DeviceToggle device={device} onChange={onDeviceChange} />}
            <ModeToggle mode={mode} onChange={onModeChange} />
          </>
        )}
      </div>
    </div>
  );
}

// Nothing written yet: only blank paragraphs / headings / quotes (no text, image, table, divider…).
const $isTemplateEmpty = () =>
  $getRoot()
    .getChildren()
    .every((block) => $isElementNode(block) && !block.isInline() && ['paragraph', 'heading', 'quote'].includes(block.getType()) && block.getChildrenSize() === 0);

// Shown in Preview when the template has no content yet: explains why it's blank.
function PreviewEmptyState() {
  return (
    <div className="te-preview-empty">
      <img src={emptyTemplateIllustration} width="160" height="160" alt="" aria-hidden="true" />
      <h3 className="te-preview-empty-title">Nothing to Preview Yet</h3>
      <p className="te-preview-empty-text">Your template is empty. Start writing your outreach in Edit mode to see how it will look.</p>
    </div>
  );
}

function PreviewPane() {
  const [editor] = useLexicalComposerContext();
  const [html, setHtml] = useState('');
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    editor.getEditorState().read(() => {
      setEmpty($isTemplateEmpty());
      const raw = $generateHtmlFromNodes(editor, null);
      setHtml(
        raw.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (m, key) => SAMPLE_VALUES[key] ?? m),
      );
    });
  }, [editor]);

  if (empty) return <PreviewEmptyState />;
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

// Placeholder for the template picker: shown in the toolbar, no interaction yet.
function SelectTemplateButton() {
  return (
    <span className="te-add-element te-tb-add-btn te-select-template">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <path d="M10 4v16M10 12h10" />
      </svg>
      Select Template
    </span>
  );
}

/* ---------- Create Outreach (step 1) ---------- */

const OUTREACH_STEPS = ['Compose Message', 'Add Recipients', 'Personalize (Optional)', 'Review'];

function Stepper({ current = 0 }) {
  return (
    <nav className="te-stepper" aria-label="Outreach steps">
      <ol>
        {OUTREACH_STEPS.map((label, i) => (
          <li key={label} className={i === current ? 'is-current' : ''} aria-current={i === current ? 'step' : undefined}>
            <span className="te-step-num">{i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const SUBJECT_MAX = 320;
const SENDERS = ['Press Team', 'Media Relations', 'Communications Desk'];

// Collapsible card with the sender and subject of the outreach.
function MessageSettings() {
  const [open, setOpen] = useState(true);
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');

  return (
    <section className={`te-frame te-settings${open ? '' : ' is-collapsed'}`}>
      <button
        type="button"
        className={`te-settings-head${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-controls="te-settings-body"
        onClick={() => setOpen((v) => !v)}
      >
        <h2 className="te-canvas-title">Message Settings</h2>
        <Icon name="chevron" size={18} />
      </button>
      {open && (
        <div className="te-settings-body" id="te-settings-body">
          <label className={`te-field te-field-select${sender ? '' : ' is-empty'}`}>
            <span className="te-sr-only">Sender</span>
            <select value={sender} onChange={(e) => setSender(e.target.value)}>
              <option value="" disabled>
                Select Sender
              </option>
              {SENDERS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <Icon name="caret" size={20} />
          </label>
          <div>
            <label className="te-field">
              <span className="te-sr-only">Subject</span>
              <input
                type="text"
                placeholder="Subject"
                maxLength={SUBJECT_MAX}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>
            <div className="te-field-count">
              {subject.length}/{SUBJECT_MAX}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Editor card ---------- */

function EditorCard({ mode, device, canvasElem }) {
  const [anchorElem, setAnchorElem] = useState(null);
  const [slotElem, setSlotElem] = useState(null);
  const mobile = mode === 'preview' && device === 'mobile';

  return (
    <div className={`te-card${mobile ? ' is-mobile' : ''}`}>
      {/* Fixed (Jira-style) toolbar lives in this sticky strip at the top of the card */}
      <div className="te-fixed-tb-slot" ref={setSlotElem} hidden={mode !== 'edit'} />
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
        <KeyboardNavPlugin />
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
        {canvasElem && slotElem && (
          <TextToolbarPlugin
            variant="fixed"
            anchorElem={canvasElem}
            slotElem={slotElem}
            trailing={
              <>
                <SelectTemplateButton />
                <ToolbarAddElement />
              </>
            }
          />
        )}
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
  // Prototype switch: "Create Outreach Template" (default) or step 1 of "Create Outreach"
  const [flow, setFlow] = useState('template');
  const outreach = flow === 'outreach';
  const editorMode = outreach ? 'edit' : mode; // Outreach has no preview toggle
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
      <div className={`te-page${outreach ? ' is-outreach' : ''}`}>
        <header className="te-header">
          <div className="te-title">
            <Icon name="logo" size={34} />
            <h1>{outreach ? 'Create Outreach' : 'Create Outreach Template'}</h1>
          </div>
          <div className="te-header-right">
            <div className="te-variant" role="group" aria-label="Prototype flow">
              {[
                { key: 'template', label: 'Template' },
                { key: 'outreach', label: 'Outreach' },
              ].map((v) => (
                <button
                  key={v.key}
                  type="button"
                  aria-pressed={flow === v.key}
                  className={flow === v.key ? 'is-active' : ''}
                  onClick={() => setFlow(v.key)}
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

        {outreach && <Stepper current={0} />}

        <main className="te-canvas" ref={setCanvasElem}>
          {outreach && <MessageSettings />}
          <section className="te-frame te-message">
            <CanvasBar flow={flow} mode={editorMode} onModeChange={setMode} device={device} onDeviceChange={setDevice} />
            <EditorCard mode={editorMode} device={device} canvasElem={canvasElem} />
          </section>
        </main>

        {/* Page actions, centred at the bottom */}
        <footer className="te-toolbar">
          {outreach ? (
            <>
              <button type="button" className="te-btn-outline" onClick={() => setToast('Draft saved')}>
                Save Draft
              </button>
              <button type="button" className="te-btn-primary">
                Next
              </button>
            </>
          ) : (
            <>
              <button type="button" className="te-text-btn">
                <Icon name="send" size={18} /> Send Test Email
              </button>
              <SaveButton onSaved={() => setToast('Template saved')} />
            </>
          )}
        </footer>

        {toast && <div className="te-toast">{toast}</div>}
      </div>
    </LexicalComposer>
  );
}
