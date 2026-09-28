import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import {
  $applyNodeReplacement,
  $createNodeSelection,
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
import { mergeRegister } from '@lexical/utils';
import { AltTextDialog, pickImage } from './ImageNode';

const MIN_WIDTH = 60;
const MAX_WIDTH = 2400;
const FAKE_UPLOAD_MS = 900; // prototype: simulates the upload round-trip

const ALIGNMENTS = [
  { key: 'left', label: 'Align left', path: 'M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z' },
  { key: 'center', label: 'Align center', path: 'M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z' },
  { key: 'right', label: 'Align right', path: 'M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z' },
];

function $selectOnly(key) {
  const selection = $createNodeSelection();
  selection.add(key);
  $setSelection(selection);
}

// Shows the loading state, then "finishes the upload" and makes the image active.
export function finishUpload(editor, key) {
  setTimeout(() => {
    editor.update(() => {
      const node = $getNodeByKey(key);
      if (!$isBlockImageNode(node)) return;
      node.setUploading(false);
      $selectOnly(key);
    });
  }, FAKE_UPLOAD_MS);
}

/* ---------- decorator component ---------- */

const CORNERS = ['tl', 'tr', 'bl', 'br'];

function BlockImageComponent({ nodeKey, src, altText, width, align, uploading }) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [altOpen, setAltOpen] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [toolbarLeft, setToolbarLeft] = useState(null);
  const frameRef = useRef(null);
  const scrollRef = useRef(null);
  const innerRef = useRef(null);
  const toolbarRef = useRef(null);
  const imgRef = useRef(null);
  const drag = useRef(null);

  const $withNode = useCallback(
    (fn, opts) =>
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isBlockImageNode(node)) fn(node);
      }, opts),
    [editor, nodeKey],
  );

  useEffect(
    () =>
      mergeRegister(
        editor.registerCommand(
          CLICK_COMMAND,
          (event) => {
            if (event.target !== imgRef.current || uploading) return false;
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
              const node = $getNodeByKey(nodeKey);
              if (!node) return false;
              const next = node.getNextSibling() || node.getPreviousSibling();
              node.remove();
              if (next && next.selectStart) next.selectStart();
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
    [editor, isSelected, setSelected, clearSelection, nodeKey, uploading],
  );

  const active = (isSelected || resizing) && !uploading;

  // Keep the controls centred over the visible part of the image, even when it overflows the frame.
  const placeToolbar = useCallback(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    const bar = toolbarRef.current;
    if (!frame || !inner || !bar) return;
    const f = frame.getBoundingClientRect();
    const i = inner.getBoundingClientRect();
    const half = bar.offsetWidth / 2;
    const visibleLeft = Math.max(i.left, f.left);
    const visibleRight = Math.min(i.right, f.right);
    const centre = (visibleLeft + visibleRight) / 2 - f.left;
    setToolbarLeft(Math.max(half + 4, Math.min(centre, f.width - half - 4)));
  }, []);

  useLayoutEffect(() => {
    if (active) placeToolbar();
  }, [active, width, align, placeToolbar]);

  const replace = async () => {
    const next = await pickImage();
    if (!next) return;
    $withNode((node) => {
      node.setSrc(next);
      node.setUploading(true);
    });
    finishUpload(editor, nodeKey);
  };

  const applyAlt = (text) => {
    setAltOpen(false);
    $withNode((node) => node.setAltText(text));
  };

  /* --- resize: corners drag the edges, height always follows the image ratio --- */
  const onHandleDown = (corner) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = imgRef.current.getBoundingClientRect();
    drag.current = { corner, x: e.clientX, y: e.clientY, w: rect.width, ratio: rect.width / rect.height, started: false };
    e.currentTarget.setPointerCapture(e.pointerId);
    setResizing(true);
  };

  const onHandleMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const growX = (d.corner.endsWith('l') ? -1 : 1) * (e.clientX - d.x);
    const growY = (d.corner.startsWith('t') ? -1 : 1) * (e.clientY - d.y) * d.ratio;
    const grow = Math.abs(growX) >= Math.abs(growY) ? growX : growY;
    const w = Math.round(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, d.w + grow)));
    $withNode((node) => node.setWidth(w), d.started ? { tag: 'history-merge' } : undefined);
    d.started = true;
    placeToolbar();
  };

  const onHandleUp = (e) => {
    if (!drag.current) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    drag.current = null;
    setResizing(false);
  };

  return (
    <div ref={frameRef} className={`te-bimg${active ? ' is-active' : ''}${uploading ? ' is-uploading' : ''}`}>
      <div ref={scrollRef} className="te-bimg-scroll" style={{ textAlign: align }} onScroll={placeToolbar}>
        <span ref={innerRef} className="te-bimg-inner">
          <img
            ref={imgRef}
            src={src}
            alt={altText}
            draggable={false}
            style={{ width: width ? `${width}px` : '100%' }}
            onLoad={placeToolbar}
          />
          {uploading && (
            <span className="te-bimg-loading" role="status" aria-label="Uploading image">
              <span className="te-spinner" />
            </span>
          )}
          {active &&
            CORNERS.map((c) => (
              <span
                key={c}
                className={`te-bimg-handle te-bimg-handle-${c}`}
                onPointerDown={onHandleDown(c)}
                onPointerMove={onHandleMove}
                onPointerUp={onHandleUp}
                onPointerCancel={onHandleUp}
              />
            ))}
        </span>
      </div>

      {active && (
        <div
          ref={toolbarRef}
          className="te-bimg-toolbar"
          style={{ left: toolbarLeft ?? '50%' }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className="te-bimg-align" role="group" aria-label="Image alignment">
            {ALIGNMENTS.map((a) => (
              <button
                key={a.key}
                type="button"
                aria-label={a.label}
                aria-pressed={align === a.key}
                className={align === a.key ? 'is-active' : ''}
                onClick={() => $withNode((node) => node.setAlign(a.key))}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={a.path} />
                </svg>
              </button>
            ))}
          </span>
          <button type="button" className="te-bimg-action" onClick={() => setAltOpen(true)}>
            <span aria-hidden="true">{altText ? '✓' : '+'}</span> Alt Text
          </button>
          <button type="button" className="te-bimg-action" onClick={replace}>
            Replace
          </button>
        </div>
      )}

      {altOpen && <AltTextDialog initial={altText} onCancel={() => setAltOpen(false)} onApply={applyAlt} />}
    </div>
  );
}

/* ---------- node ---------- */

export class BlockImageNode extends DecoratorNode {
  static getType() {
    return 'block-image';
  }

  static clone(node) {
    const clone = new BlockImageNode(node.__src, node.__altText, node.__width, node.__align, node.__key);
    clone.__uploading = node.__uploading;
    return clone;
  }

  static importJSON(json) {
    return $createBlockImageNode(json);
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      align: this.__align,
    };
  }

  constructor(src, altText = '', width = null, align = 'center', key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__align = align;
    this.__uploading = false; // transient, never serialized
  }

  exportDOM() {
    const wrap = document.createElement('div');
    wrap.style.textAlign = this.__align;
    wrap.style.overflowX = 'auto';
    wrap.style.margin = '0 0 14px';
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__altText;
    img.style.width = this.__width ? `${this.__width}px` : '100%';
    img.style.maxWidth = 'none';
    img.style.height = 'auto';
    img.style.display = 'inline-block';
    wrap.append(img);
    return { element: wrap };
  }

  createDOM() {
    const div = document.createElement('div');
    div.className = 'te-bimg-root';
    return div;
  }

  updateDOM() {
    return false;
  }

  isInline() {
    return false;
  }

  setSrc(src) {
    this.getWritable().__src = src;
  }

  setAltText(altText) {
    this.getWritable().__altText = altText;
  }

  setWidth(width) {
    this.getWritable().__width = width;
  }

  setAlign(align) {
    this.getWritable().__align = align;
  }

  setUploading(uploading) {
    this.getWritable().__uploading = uploading;
  }

  decorate() {
    return (
      <BlockImageComponent
        nodeKey={this.getKey()}
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        align={this.__align}
        uploading={this.__uploading}
      />
    );
  }
}

export function $createBlockImageNode({ src, altText = '', width = null, align = 'center' }) {
  return $applyNodeReplacement(new BlockImageNode(src, altText, width, align));
}

// Type check (not instanceof) so nodes survive a hot-reloaded class during development.
export function $isBlockImageNode(node) {
  return !!node && node.getType() === 'block-image';
}
