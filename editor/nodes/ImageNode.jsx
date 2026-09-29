import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import {
  $applyNodeReplacement,
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ESCAPE_COMMAND,
} from 'lexical';
import { $isTableCellNode, $isTableNode } from '@lexical/table';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { $distributeTableColumns, $maxImageWidth, measureTable } from './tableLayout';

export const DEFAULT_IMAGE_HEIGHT = 110;
const MIN_IMAGE_SIZE = 20; // small enough for logos and icons
const MAX_IMAGE_HEIGHT = 600;
export const ALT_TEXT_MAX = 300;

/* ---------- helpers ---------- */

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Opens the OS file browser and resolves with a data URL (or null if cancelled).
export function pickImage() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files && input.files[0];
      resolve(file ? await readImageFile(file) : null);
    };
    input.click();
  });
}

function $relayoutTableOf(node, tableEl) {
  const table = $findMatchingParent(node, $isTableNode);
  if (table && tableEl) {
    const { width, padX } = measureTable(tableEl);
    $distributeTableColumns(table, width, padX);
  }
}

// Image fills the cell by default; the cell's previous content is replaced.
export function $insertImageIntoCell(cellKey, src) {
  const cell = $getNodeByKey(cellKey);
  if (!$isTableCellNode(cell)) return;
  cell.clear();
  cell.append($createParagraphNode().append($createImageNode({ src })));
  $setSelection(null);
}

/* ---------- alt text dialog ---------- */

export function AltTextDialog({ initial, onCancel, onApply }) {
  const [value, setValue] = useState(initial);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return createPortal(
    <div className="te-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="te-modal" role="dialog" aria-modal="true" aria-labelledby="te-alt-title">
        <h2 id="te-alt-title" className="te-modal-title">
          Image Alt Text
        </h2>
        <div className="te-modal-body">
          <p className="te-modal-text">Describe the meaning of the image for people using screen readers.</p>
          <label className="te-field">
            <span className="te-field-label">Alt Text</span>
            <input
              ref={inputRef}
              className="te-field-input"
              value={value}
              maxLength={ALT_TEXT_MAX}
              placeholder="e.g Person presenting at an event"
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onApply(value.trim());
              }}
            />
          </label>
          <div className="te-field-count">
            {value.length}/{ALT_TEXT_MAX}
          </div>
        </div>
        <div className="te-modal-actions">
          <button type="button" className="te-btn-text" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="te-btn-primary" onClick={() => onApply(value.trim())}>
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ---------- decorator component ---------- */

const CORNERS = ['tl', 'tr', 'bl', 'br'];

function ImageComponent({ nodeKey, src, altText, width, height }) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [altOpen, setAltOpen] = useState(false);
  const [resizing, setResizing] = useState(false);
  const imgRef = useRef(null);
  const drag = useRef(null);

  const $withNode = useCallback(
    (fn, opts) =>
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) fn(node);
      }, opts),
    [editor, nodeKey],
  );

  const remove = useCallback(() => {
    const tableEl = imgRef.current?.closest('table');
    $withNode((node) => {
      const paragraph = node.getParent();
      node.remove();
      $relayoutTableOf(paragraph, tableEl);
      if (paragraph) paragraph.selectStart();
    });
  }, [$withNode]);

  useEffect(
    () =>
      mergeRegister(
        editor.registerCommand(
          CLICK_COMMAND,
          (event) => {
            if (event.target !== imgRef.current) return false;
            if (!event.shiftKey) clearSelection();
            setSelected(true);
            return true;
          },
          COMMAND_PRIORITY_LOW,
        ),
        ...[KEY_DELETE_COMMAND, KEY_BACKSPACE_COMMAND].map((cmd) =>
          editor.registerCommand(
            cmd,
            (event) => {
              if (!isSelected || !$isNodeSelection($getSelection())) return false;
              event.preventDefault();
              remove();
              return true;
            },
            COMMAND_PRIORITY_LOW,
          ),
        ),
        editor.registerCommand(
          KEY_ESCAPE_COMMAND,
          () => {
            if (!isSelected) return false;
            clearSelection();
            return true;
          },
          COMMAND_PRIORITY_LOW,
        ),
      ),
    [editor, isSelected, setSelected, clearSelection, remove],
  );

  const replace = async () => {
    const next = await pickImage();
    if (next) $withNode((node) => node.setSrc(next));
  };

  const applyAlt = (text) => {
    setAltOpen(false);
    $withNode((node) => node.setAltText(text));
  };

  /* --- corner resize ---
     Top corners keep the bottom edge anchored (drag up = taller);
     left corners grow toward the left, right corners toward the right. */
  const onHandleDown = (corner) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const img = imgRef.current;
    const tableEl = img.closest('table');
    const cellEl = img.closest('td, th');
    const { width: tableWidth, padX } = measureTable(tableEl);
    let maxWidth = tableWidth - padX;
    editor.getEditorState().read(() => {
      const node = $getNodeByKey(nodeKey);
      const cell = node && $findMatchingParent(node, $isTableCellNode);
      const table = cell && $findMatchingParent(cell, $isTableNode);
      if (table) maxWidth = $maxImageWidth(table, cell.getIndexWithinParent(), tableWidth, padX);
    });
    drag.current = {
      corner,
      x: e.clientX,
      y: e.clientY,
      w: img.getBoundingClientRect().width,
      h: img.getBoundingClientRect().height,
      maxWidth: Math.max(MIN_IMAGE_SIZE, maxWidth),
      tableEl,
      cellEl,
      started: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setResizing(true);
  };

  const onHandleMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const growX = d.corner.endsWith('l') ? -dx : dx;
    const growY = d.corner.startsWith('t') ? -dy : dy;
    const w = Math.round(Math.min(d.maxWidth, Math.max(MIN_IMAGE_SIZE, d.w + growX)));
    const h = Math.round(Math.min(MAX_IMAGE_HEIGHT, Math.max(MIN_IMAGE_SIZE, d.h + growY)));
    $withNode(
      (node) => {
        node.setSize(w, h);
        $relayoutTableOf(node, d.tableEl);
      },
      d.started ? { tag: 'history-merge' } : undefined,
    );
    d.started = true;
  };

  const onHandleUp = (e) => {
    if (!drag.current) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    drag.current = null;
    setResizing(false);
  };

  const active = isSelected || resizing;

  return (
    <span className={`te-image${active ? ' is-active' : ''}`}>
      {active && (
        <span className="te-image-toolbar" onMouseDown={(e) => e.preventDefault()}>
          <button type="button" onClick={() => setAltOpen(true)}>
            <span aria-hidden="true">{altText ? '✓' : '+'}</span> Alt Text
          </button>
          <button type="button" onClick={replace}>
            Replace
          </button>
          <button type="button" onClick={remove}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
            Remove
          </button>
        </span>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={altText}
        draggable={false}
        style={{ width: width ? `${width}px` : '100%', height: `${height}px` }}
      />
      {active &&
        CORNERS.map((c) => (
          <span
            key={c}
            className={`te-image-handle te-image-handle-${c}`}
            onPointerDown={onHandleDown(c)}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onPointerCancel={onHandleUp}
          />
        ))}
      {altOpen && <AltTextDialog initial={altText} onCancel={() => setAltOpen(false)} onApply={applyAlt} />}
    </span>
  );
}

/* ---------- node ---------- */

export class ImageNode extends DecoratorNode {
  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
  }

  static importJSON(json) {
    return $createImageNode(json);
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
    };
  }

  constructor(src, altText = '', width = null, height = DEFAULT_IMAGE_HEIGHT, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  exportDOM() {
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__altText;
    img.style.width = this.__width ? `${this.__width}px` : '100%';
    img.style.height = `${this.__height}px`;
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    return { element: img };
  }

  createDOM() {
    const span = document.createElement('span');
    span.className = 'te-image-root';
    return span;
  }

  updateDOM() {
    return false;
  }

  isInline() {
    return true;
  }

  getWidth() {
    return this.getLatest().__width;
  }

  setSrc(src) {
    this.getWritable().__src = src;
  }

  setAltText(altText) {
    this.getWritable().__altText = altText;
  }

  setSize(width, height) {
    const self = this.getWritable();
    self.__width = width;
    self.__height = height;
  }

  decorate() {
    return (
      <ImageComponent
        nodeKey={this.getKey()}
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
      />
    );
  }
}

export function $createImageNode({ src, altText = '', width = null, height = DEFAULT_IMAGE_HEIGHT }) {
  return $applyNodeReplacement(new ImageNode(src, altText, width, height));
}

// Type check (not instanceof) so nodes survive a hot-reloaded class during development.
export function $isImageNode(node) {
  return !!node && node.getType() === 'image';
}
