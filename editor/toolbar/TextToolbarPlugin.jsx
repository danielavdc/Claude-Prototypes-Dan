import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootNode,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import { $isHeadingNode } from '@lexical/rich-text';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $isLinkNode, $toggleLink } from '@lexical/link';
import { $isTableCellNode } from '@lexical/table';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import { $createVariableNode } from '../nodes/VariableNode';
import { TbIcon } from './toolbarIcons';
import ColorPicker from './ColorPicker';
import { SUPPRESS_TEXT_TOOLBAR_COMMAND } from '../plugins/AddElementPlugin';
import { $insertImageIntoCell, pickImage } from '../nodes/ImageNode';
import { $distributeTableColumns, measureTable } from '../nodes/tableLayout';
import { $isTableNode } from '@lexical/table';

/* ---------- options ---------- */

export const FONT_FAMILIES = [
  { label: 'System Font', value: null },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Helvetica', value: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36];
const HEADING_SIZES = { h1: 26, h2: 20, h3: 16 };

const ALIGNMENTS = [
  { key: 'left', label: 'Left', icon: 'alignLeft' },
  { key: 'center', label: 'Center', icon: 'alignCenter' },
  { key: 'right', label: 'Right', icon: 'alignRight' },
];

const PLACEHOLDERS = [
  {
    key: 'first_name',
    label: 'First name',
    help: "Fill the recipient's first name where this placeholder appears. This field will remain blank for newsdesks.",
  },
  {
    key: 'last_name',
    label: 'Last name',
    help: "Fill the recipient's last name where this placeholder appears. This field will remain blank for newsdesks.",
  },
];

const DEFAULT_TEXT_COLOR = '#1F1F1F';
const TOOLBAR_GAP = 10;

/* ---------- reading the selection ---------- */

function $readInfo(selection) {
  const anchor = selection.anchor.getNode();
  const block = $isRootNode(anchor) ? null : anchor.getTopLevelElement();
  const list = $getNearestNodeOfType(anchor, ListNode);
  const alignEl = $findMatchingParent(anchor, (n) => $isElementNode(n) && !n.isInline() && !$isRootNode(n));
  const linkNode = $isLinkNode(anchor) ? anchor : $findMatchingParent(anchor, $isLinkNode);
  const cell = $findMatchingParent(anchor, $isTableCellNode);

  let fontSize = $getSelectionStyleValueForProperty(selection, 'font-size', '');
  if (fontSize === '' && $isHeadingNode(block)) fontSize = `${HEADING_SIZES[block.getTag()] || 14}px`;
  if (fontSize === '' && selection.getNodes().length <= 1) fontSize = '14px';

  return {
    bold: selection.hasFormat('bold'),
    italic: selection.hasFormat('italic'),
    underline: selection.hasFormat('underline'),
    strikethrough: selection.hasFormat('strikethrough'),
    fontFamily: $getSelectionStyleValueForProperty(selection, 'font-family', ''),
    fontSize: fontSize ? parseInt(fontSize, 10) : 14,
    color: $getSelectionStyleValueForProperty(selection, 'color', ''),
    background: $getSelectionStyleValueForProperty(selection, 'background-color', ''),
    align: (alignEl && alignEl.getFormatType()) || 'left',
    listType: list ? list.getListType() : null,
    linkUrl: linkNode ? linkNode.getURL() : '',
    blockKey: block ? block.getKey() : null,
    cellKey: cell ? cell.getKey() : null,
    cellBackground: cell ? cell.getBackgroundColor() || '' : '',
  };
}

function toCanvasRect(rect, canvas) {
  const c = canvas.getBoundingClientRect();
  return {
    top: rect.top - c.top + canvas.scrollTop,
    bottom: rect.bottom - c.top + canvas.scrollTop,
    left: rect.left - c.left + canvas.scrollLeft,
    width: rect.width,
    height: rect.height,
  };
}

/* ---------- small building blocks ---------- */

const keepFocus = (e) => e.preventDefault();

function TbButton({ tip, active, onClick, children, className = '', disabled = false, ...rest }) {
  return (
    <button
      type="button"
      data-tip={tip}
      aria-label={tip}
      aria-pressed={active}
      className={`te-tb-btn${active ? ' is-active' : ''} ${className}`}
      disabled={disabled}
      onMouseDown={keepFocus}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

function Swatch({ icon, color }) {
  return (
    <span className="te-tb-swatch">
      <TbIcon name={icon} size={17} />
      <span className="te-tb-swatch-bar" style={{ background: color }} />
    </span>
  );
}

/* ---------- plugin ---------- */

// Shown by the fixed toolbar before the caret has been anywhere.
const DEFAULT_INFO = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  fontFamily: '',
  fontSize: 14,
  color: '',
  background: '',
  align: 'left',
  listType: null,
  linkUrl: '',
  blockKey: null,
  cellKey: null,
  cellBackground: '',
};

/**
 * variant="floating": appears over the selection (or on double-click).
 * variant="fixed": always visible in `slotElem` (Jira-style); cell-only tools are disabled outside tables.
 */
export default function TextToolbarPlugin({ anchorElem, variant = 'floating', slotElem = null, trailing = null }) {
  const [editor] = useLexicalComposerContext();
  const fixed = variant === 'fixed';
  const toolbarRef = useRef(null);
  const linkRef = useRef(null);
  const [target, setTarget] = useState(null); // selection rect in canvas coords
  const [info, setInfo] = useState(fixed ? DEFAULT_INFO : null);
  const [menu, setMenu] = useState(null);
  const [overlay, setOverlay] = useState([]);
  const [editorFocused, setEditorFocused] = useState(true);
  const [linkDraft, setLinkDraft] = useState('');
  const [helpKey, setHelpKey] = useState(null);

  const menuRef = useRef(null);
  const saved = useRef(null);
  const mouseDown = useRef(false);
  const forced = useRef(false);
  const suppressed = useRef(false);
  menuRef.current = menu;

  /* --- compute visibility + position --- */
  const refresh = useCallback(() => {
    if (menuRef.current) return;
    if (fixed) {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) setInfo($readInfo(selection));
      });
      return;
    }
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      const root = editor.getRootElement();
      const native = window.getSelection();
      const visible =
        editor.isEditable() &&
        !mouseDown.current &&
        !suppressed.current &&
        $isRangeSelection(selection) &&
        root &&
        native &&
        native.rangeCount > 0 &&
        root.contains(native.anchorNode) &&
        ((!selection.isCollapsed() && selection.getTextContent().trim() !== '') || forced.current);

      if (!visible) {
        setTarget(null);
        return;
      }

      const next = $readInfo(selection);
      let rect;
      if (selection.isCollapsed()) {
        const blockKey = next.cellKey || next.blockKey;
        const blockEl = blockKey && editor.getElementByKey(blockKey);
        rect = blockEl ? blockEl.getBoundingClientRect() : native.getRangeAt(0).getBoundingClientRect();
      } else {
        rect = native.getRangeAt(0).getBoundingClientRect();
      }
      setInfo(next);
      setTarget(toCanvasRect(rect, anchorElem));
    });
  }, [editor, anchorElem, fixed]);

  /* --- place the toolbar once its width is known --- */
  useLayoutEffect(() => {
    const el = toolbarRef.current;
    if (fixed || !el || !target) return;
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const maxLeft = anchorElem.scrollLeft + anchorElem.clientWidth - width - 8;
    const left = Math.max(8, Math.min(target.left + target.width / 2 - width / 2, maxLeft));
    let top = target.top - height - TOOLBAR_GAP;
    if (top < anchorElem.scrollTop + 4) top = target.bottom + TOOLBAR_GAP;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }, [target, anchorElem, menu, fixed]);

  /* --- editor + DOM listeners --- */
  useEffect(() => {
    const root = editor.getRootElement();
    if (!root) return undefined;

    const onDown = () => {
      mouseDown.current = true;
      suppressed.current = false;
      forced.current = false;
      setTarget(null);
    };
    const onUp = () => {
      if (!mouseDown.current) return;
      mouseDown.current = false;
      setTimeout(refresh, 0);
    };
    const onDblClick = () => {
      suppressed.current = false;
      forced.current = true;
      setTimeout(refresh, 0);
    };
    const onKeyDown = (e) => {
      if (['Meta', 'Control', 'Alt'].includes(e.key)) return;
      suppressed.current = false;
      if (e.key === 'Shift') return;
      forced.current = false;
    };
    const onFocus = () => setEditorFocused(true);
    const onBlur = () => setEditorFocused(false);

    root.addEventListener('mousedown', onDown);
    root.addEventListener('dblclick', onDblClick);
    root.addEventListener('keydown', onKeyDown);
    root.addEventListener('focus', onFocus);
    root.addEventListener('blur', onBlur);
    document.addEventListener('mouseup', onUp);

    const unregister = mergeRegister(
      editor.registerUpdateListener(() => refresh()),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          refresh();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerEditableListener(() => setTarget(null)),
      editor.registerCommand(
        SUPPRESS_TEXT_TOOLBAR_COMMAND,
        () => {
          suppressed.current = true;
          setTarget(null);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );

    return () => {
      unregister();
      root.removeEventListener('mousedown', onDown);
      root.removeEventListener('dblclick', onDblClick);
      root.removeEventListener('keydown', onKeyDown);
      root.removeEventListener('focus', onFocus);
      root.removeEventListener('blur', onBlur);
      document.removeEventListener('mouseup', onUp);
    };
  }, [editor, refresh]);

  /* --- menus --- */
  const closeMenu = useCallback(
    ({ restore = false } = {}) => {
      menuRef.current = null;
      setMenu(null);
      setOverlay([]);
      setHelpKey(null);
      if (restore && saved.current) {
        editor.update(() => $setSelection(saved.current.clone()));
        editor.focus();
      }
      setTimeout(refresh, 0);
    },
    [editor, refresh],
  );

  const openMenu = (name) => {
    if (menu === name) {
      closeMenu({ restore: true });
      return;
    }
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) saved.current = selection.clone();
    });
    const native = window.getSelection();
    if (native && native.rangeCount > 0 && !native.isCollapsed) {
      setOverlay([...native.getRangeAt(0).getClientRects()].map((r) => toCanvasRect(r, anchorElem)));
    } else {
      setOverlay([]);
    }
    if (name === 'link') setLinkDraft(info?.linkUrl || 'https://');
    menuRef.current = name;
    setMenu(name);
  };

  // Close on outside click / Escape.
  useEffect(() => {
    if (!menu) return undefined;
    const onDown = (e) => {
      const path = e.composedPath();
      if (path.includes(toolbarRef.current) || path.includes(linkRef.current)) return;
      closeMenu();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') closeMenu({ restore: true });
    };
    document.addEventListener('mousedown', onDown, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [menu, closeMenu]);

  /* --- applying changes --- */

  // Runs `fn` against the selection captured when the menu opened.
  const apply = (fn, { merge = false } = {}) => {
    editor.update(
      () => {
        if (saved.current) $setSelection(saved.current.clone());
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        fn(selection);
        const after = $getSelection();
        if ($isRangeSelection(after)) saved.current = after.clone();
      },
      merge ? { tag: 'history-merge' } : undefined,
    );
  };

  const patchStyle = (patch, opts) => apply((sel) => $patchStyleText(sel, patch), opts);

  const setCellColor = (hex, opts) =>
    apply((sel) => {
      const cell = $findMatchingParent(sel.anchor.getNode(), $isTableCellNode);
      if (cell) cell.setBackgroundColor(hex);
    }, opts);

  const addCellImage = async () => {
    const cellKey = info?.cellKey;
    if (!cellKey) return;
    const tableEl = editor.getElementByKey(cellKey)?.closest('table');
    const src = await pickImage();
    if (!src) return;
    editor.update(() => {
      $insertImageIntoCell(cellKey, src);
      const table = $findMatchingParent($getNodeByKey(cellKey), $isTableNode);
      if (table && tableEl) {
        const { width, padX } = measureTable(tableEl);
        $distributeTableColumns(table, width, padX);
      }
    });
  };

  const toggleList = (type, command) => {
    editor.dispatchCommand(info?.listType === type ? REMOVE_LIST_COMMAND : command, undefined);
  };

  const insertEmoji = (emoji) => {
    apply((sel) => {
      const end = sel.isBackward() ? sel.anchor : sel.focus;
      sel.anchor.set(end.key, end.offset, end.type);
      sel.focus.set(end.key, end.offset, end.type);
      sel.insertText(emoji.native);
    });
    closeMenu();
    editor.focus();
  };

  const insertPlaceholder = (key) => {
    apply((sel) => sel.insertNodes([$createVariableNode(`{{${key}}}`)]));
    closeMenu();
    editor.focus();
  };

  const applyLink = () => {
    let url = linkDraft.trim();
    if (url === '' || url === 'https://') url = null;
    else if (!/^(https?:|mailto:|tel:)/i.test(url)) url = `https://${url}`;
    apply(() => $toggleLink(url));
    closeMenu({ restore: true });
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(linkDraft).catch(() => {});
  };

  if (fixed ? !slotElem : !target || !info) return null;

  const fontLabel =
    FONT_FAMILIES.find((f) => f.value && info.fontFamily && f.value === info.fontFamily)?.label || 'System Font';
  const currentAlign = ALIGNMENTS.find((a) => a.key === info.align) || ALIGNMENTS[0];
  const showOverlay = menu && !editorFocused && overlay.length > 0;

  const linkEditor = (
        <div
          ref={linkRef}
          className={fixed ? 'te-link te-link-menu' : 'te-link'}
          style={fixed ? undefined : { top: target.bottom + 8, left: Math.max(8, target.left - 12) }}
        >
          <button type="button" className="te-link-icon" data-tip="Copy link" onClick={copyLink}>
            <TbIcon name="copy" size={16} />
          </button>
          <input
            autoFocus
            className="te-link-input"
            value={linkDraft}
            spellCheck={false}
            aria-label="Link URL"
            onFocus={(e) => e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
            onChange={(e) => setLinkDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyLink();
              }
            }}
          />
          <button type="button" className="te-link-icon" data-tip="Apply" onClick={applyLink}>
            <TbIcon name="check" size={16} />
          </button>
          <button type="button" className="te-link-icon" data-tip="Cancel" onClick={() => closeMenu({ restore: true })}>
            <TbIcon name="cancel" size={17} />
          </button>
        </div>
  );

  const toolbar = (
        <div
          ref={toolbarRef}
          className={`te-tb${fixed ? ' te-tb-fixed' : ''}${menu ? ' has-menu' : ''}`}
          role="toolbar"
          aria-label="Text formatting"
        >
          {/* Font family */}
          <div className="te-tb-group">
            <button
              type="button"
              className={`te-tb-select te-tb-font${menu === 'font' ? ' is-open' : ''}`}
              onMouseDown={keepFocus}
              onClick={() => openMenu('font')}
            >
              <span>{fontLabel}</span>
              <TbIcon name="caret" size={16} />
            </button>
            {menu === 'font' && (
              <div className="te-tb-menu te-tb-menu-list">
                {FONT_FAMILIES.map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    className={`te-tb-menu-item${f.label === fontLabel ? ' is-active' : ''}`}
                    style={{ fontFamily: f.value || 'var(--te-font)' }}
                    onMouseDown={keepFocus}
                    onClick={() => {
                      patchStyle({ 'font-family': f.value });
                      closeMenu({ restore: true });
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font size */}
          <div className="te-tb-group">
            <button
              type="button"
              className={`te-tb-select te-tb-size${menu === 'size' ? ' is-open' : ''}`}
              onMouseDown={keepFocus}
              onClick={() => openMenu('size')}
            >
              <span>{info.fontSize}</span>
              <TbIcon name="caret" size={16} />
            </button>
            {menu === 'size' && (
              <div className="te-tb-menu te-tb-menu-list te-tb-menu-size">
                {FONT_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`te-tb-menu-item${s === info.fontSize ? ' is-active' : ''}`}
                    onMouseDown={keepFocus}
                    onClick={() => {
                      patchStyle({ 'font-size': `${s}px` });
                      closeMenu({ restore: true });
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Inline formats */}
          <TbButton tip="Bold" active={info.bold} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
            <TbIcon name="bold" />
          </TbButton>
          <TbButton tip="Italicize" active={info.italic} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
            <TbIcon name="italic" size={19} />
          </TbButton>
          <TbButton tip="Underline" active={info.underline} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
            <TbIcon name="underline" />
          </TbButton>
          <TbButton
            tip="Strike-through"
            active={info.strikethrough}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
          >
            <TbIcon name="strike" size={19} />
          </TbButton>

          {/* Emoji */}
          <div className="te-tb-group">
            <TbButton tip="Add emoji" active={menu === 'emoji'} className="te-tb-drop" onClick={() => openMenu('emoji')}>
              <TbIcon name="emoji" size={20} />
              <TbIcon name="chevron" size={16} />
            </TbButton>
            {menu === 'emoji' && (
              <div className="te-tb-menu te-tb-menu-emoji">
                <Picker
                  data={data}
                  onEmojiSelect={insertEmoji}
                  theme="light"
                  autoFocus
                  perLine={8}
                  emojiSize={20}
                  emojiButtonSize={30}
                  previewPosition="bottom"
                  skinTonePosition="search"
                />
              </div>
            )}
          </div>

          {/* Text color */}
          <div className="te-tb-group">
            <TbButton tip="Text color" active={menu === 'color'} className="te-tb-drop" onClick={() => openMenu('color')}>
              <Swatch icon="textA" color={info.color || DEFAULT_TEXT_COLOR} />
              <TbIcon name="chevron" size={16} />
            </TbButton>
            {menu === 'color' && (
              <div className="te-tb-menu">
                <ColorPicker
                  value={info.color || '#000000'}
                  onChange={(hex) => patchStyle({ color: hex }, { merge: true })}
                  onReset={() => {
                    patchStyle({ color: null });
                    closeMenu({ restore: true });
                  }}
                />
              </div>
            )}
          </div>

          {/* Background color */}
          <div className="te-tb-group">
            <TbButton tip="Background color" active={menu === 'bg'} className="te-tb-drop" onClick={() => openMenu('bg')}>
              <Swatch icon="fill" color={info.background || '#4a4a4a'} />
              <TbIcon name="chevron" size={16} />
            </TbButton>
            {menu === 'bg' && (
              <div className="te-tb-menu">
                <ColorPicker
                  value={info.background || '#FFFFFF'}
                  onChange={(hex) => patchStyle({ 'background-color': hex }, { merge: true })}
                  onReset={() => {
                    patchStyle({ 'background-color': null });
                    closeMenu({ restore: true });
                  }}
                />
              </div>
            )}
          </div>

          {/* Cell color — floating: only inside a table; fixed: always shown, disabled outside cells */}
          {(fixed || info.cellKey) && (
            <div className="te-tb-group">
              <TbButton
                tip={info.cellKey ? 'Cell color' : 'Cell color (place the cursor in a table cell)'}
                active={menu === 'cell'}
                disabled={!info.cellKey}
                className="te-tb-drop"
                onClick={() => openMenu('cell')}
              >
                <TbIcon name="palette" />
                <TbIcon name="chevron" size={16} />
              </TbButton>
              {menu === 'cell' && (
                <div className="te-tb-menu">
                  <ColorPicker
                    value={info.cellBackground || '#FFFFFF'}
                    onChange={(hex) => setCellColor(hex, { merge: true })}
                    onReset={() => {
                      setCellColor(null);
                      closeMenu({ restore: true });
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Link */}
          <div className="te-tb-group">
            <TbButton tip="Add hyperlink" active={!!info.linkUrl || (fixed && menu === 'link')} onClick={() => openMenu('link')}>
              <TbIcon name="link" />
            </TbButton>
            {fixed && menu === 'link' && linkEditor}
          </div>

          <span className="te-tb-divider" />

          {/* Alignment */}
          <div className="te-tb-group">
            <TbButton tip="Alignment" active={menu === 'align'} className="te-tb-drop" onClick={() => openMenu('align')}>
              <TbIcon name={currentAlign.icon} />
              <TbIcon name="chevron" size={16} />
            </TbButton>
            {menu === 'align' && (
              <div className="te-tb-menu te-tb-menu-align">
                {ALIGNMENTS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    className={`te-align-item${a.key === currentAlign.key ? ' is-active' : ''}`}
                    onMouseDown={keepFocus}
                    onClick={() => {
                      apply(() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, a.key));
                      closeMenu({ restore: true });
                    }}
                  >
                    <TbIcon name={a.icon} size={20} />
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <TbButton tip="Indent" onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}>
            <TbIcon name="indent" />
          </TbButton>
          <TbButton tip="Outdent" onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}>
            <TbIcon name="outdent" />
          </TbButton>
          <TbButton
            tip="Bullet points"
            active={info.listType === 'bullet'}
            onClick={() => toggleList('bullet', INSERT_UNORDERED_LIST_COMMAND)}
          >
            <TbIcon name="bullets" />
          </TbButton>
          <TbButton
            tip="Numbered list"
            active={info.listType === 'number'}
            onClick={() => toggleList('number', INSERT_ORDERED_LIST_COMMAND)}
          >
            <TbIcon name="numbered" />
          </TbButton>
          <TbButton
            tip="Checklist"
            active={info.listType === 'check'}
            onClick={() => toggleList('check', INSERT_CHECK_LIST_COMMAND)}
          >
            <TbIcon name="checkbox" size={19} />
          </TbButton>

          <span className="te-tb-divider" />

          {/* Image in cell — floating: only inside a table; fixed: always shown, disabled outside cells */}
          {(fixed || info.cellKey) && (
            <TbButton
              tip={info.cellKey ? 'Add image' : 'Add image (place the cursor in a table cell)'}
              disabled={!info.cellKey}
              onClick={addCellImage}
            >
              <TbIcon name="addImage" />
            </TbButton>
          )}

          {/* Placeholder */}
          <div className="te-tb-group">
            <TbButton
              tip="Placeholder"
              active={menu === 'placeholder'}
              className="te-tb-drop"
              onClick={() => openMenu('placeholder')}
            >
              <TbIcon name="personAdd" />
              <TbIcon name="chevron" size={16} />
            </TbButton>
            {menu === 'placeholder' && (
              <div className="te-tb-menu te-tb-menu-placeholder">
                {PLACEHOLDERS.map((p) => (
                  <div key={p.key} className="te-ph-row">
                    <button
                      type="button"
                      className="te-ph-item"
                      onMouseDown={keepFocus}
                      onClick={() => insertPlaceholder(p.key)}
                    >
                      {p.label}
                    </button>
                    <span
                      className="te-ph-info"
                      onMouseEnter={() => setHelpKey(p.key)}
                      onMouseLeave={() => setHelpKey(null)}
                    >
                      <TbIcon name="info" size={18} />
                    </span>
                    {helpKey === p.key && <div className="te-ph-help">{p.help}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
          {fixed && trailing && (
            <>
              <span className="te-tb-divider" />
              {trailing}
            </>
          )}
        </div>
  );

  const overlayRects = showOverlay
    ? overlay.map((r, i) => (
        <span key={i} className="te-sel-overlay" style={{ top: r.top, left: r.left, width: r.width, height: r.height }} />
      ))
    : null;

  if (fixed) {
    return (
      <>
        {createPortal(toolbar, slotElem)}
        {overlayRects && createPortal(overlayRects, anchorElem)}
      </>
    );
  }

  return createPortal(
    <>
      {overlayRects}
      {menu === 'link' ? linkEditor : toolbar}
    </>,
    anchorElem,
  );
}
