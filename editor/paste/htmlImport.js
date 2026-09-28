import { $isTextNode, ParagraphNode, TextNode } from 'lexical';
import { FONT_FAMILIES } from '../toolbar/TextToolbarPlugin';
import { $createBlockImageNode } from '../nodes/BlockImageNode';

/*
 * Paste from Google Docs / Word / web pages: Lexical already maps bold, italic,
 * underline, strike, links, headings, lists, alignment and tables. These extra
 * conversions carry over what it drops — text colour, highlight, size, font,
 * paragraph indent — and turn <img> into our image nodes.
 * Values that are just the source's defaults (black text, 11pt Arial…) are
 * ignored so pasted copy blends into the template instead of looking foreign.
 */

const BODY_PX_RANGE = [13, 15.5]; // ≈ 10–11.5pt: treat as "normal body size"
const DEFAULT_FAMILIES = ['arial', 'helvetica', 'sans-serif', 'system-ui', 'calibri'];

function toPx(value) {
  const m = /^([\d.]+)(px|pt|em|rem)?$/.exec((value || '').trim());
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (m[2] === 'pt') return (n * 4) / 3;
  if (m[2] === 'em' || m[2] === 'rem') return n * 16;
  return n;
}

function isDefaultColor(color) {
  const c = color.replace(/\s+/g, '').toLowerCase();
  return ['rgb(0,0,0)', '#000000', '#000', 'black', 'windowtext', 'inherit', 'initial'].includes(c);
}

function isTransparent(color) {
  const c = color.replace(/\s+/g, '').toLowerCase();
  return c === 'transparent' || /^rgba\(.*,0\)$/.test(c) || c === 'inherit' || c === 'initial';
}

function mapFontFamily(family) {
  const first = family.split(',')[0].replace(/['"]/g, '').trim().toLowerCase();
  if (!first || DEFAULT_FAMILIES.includes(first)) return null;
  const known = FONT_FAMILIES.find((f) => f.value && f.label.toLowerCase() === first);
  return known ? known.value : family;
}

function textStyleFrom(el) {
  const s = el.style;
  const out = {};
  // Links keep the template's link colour.
  if (s.color && !isDefaultColor(s.color) && !el.closest('a')) out.color = s.color;
  if (s.backgroundColor && !isTransparent(s.backgroundColor)) out['background-color'] = s.backgroundColor;
  // Headings keep their own scale; elsewhere only non-body sizes are worth keeping.
  const px = toPx(s.fontSize);
  if (px && !el.closest('h1, h2, h3, h4, h5, h6') && (px < BODY_PX_RANGE[0] || px > BODY_PX_RANGE[1])) {
    out['font-size'] = `${Math.round(px)}px`;
  }
  const family = s.fontFamily && mapFontFamily(s.fontFamily);
  if (family) out['font-family'] = family;
  return out;
}

function mergeStyle(existing, patch) {
  const map = new Map();
  (existing || '')
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .forEach((d) => {
      const i = d.indexOf(':');
      map.set(d.slice(0, i).trim(), d.slice(i + 1).trim());
    });
  Object.entries(patch).forEach(([k, v]) => map.set(k, v));
  return [...map].map(([k, v]) => `${k}: ${v}`).join('; ');
}

// Wraps a built-in conversion so its text children also receive the inline CSS we care about.
function withTextStyle(original) {
  return (domNode) => {
    const base = original(domNode);
    if (!base) return null;
    return {
      priority: Math.min(4, (base.priority || 0) + 1),
      conversion: (el) => {
        const output = base.conversion(el);
        if (!output) return output;
        const inner = output.forChild;
        return {
          ...output,
          forChild: (lexicalNode, parent) => {
            const node = inner ? inner(lexicalNode, parent) : lexicalNode;
            if ($isTextNode(node)) {
              const patch = textStyleFrom(el);
              if (Object.keys(patch).length) node.setStyle(mergeStyle(node.getStyle(), patch));
            }
            return node;
          },
        };
      },
    };
  };
}

// Docs/Word express indentation as margin-left (≈36pt per level).
function withIndent(original) {
  return (domNode) => {
    const base = original(domNode);
    if (!base) return null;
    return {
      priority: Math.min(4, (base.priority || 0) + 1),
      conversion: (el) => {
        const output = base.conversion(el);
        const px = toPx(el.style.marginLeft) || 0;
        if (output?.node && px >= 24 && output.node.getIndent?.() === 0) {
          output.node.setIndent(Math.min(6, Math.round(px / 48)));
        }
        return output;
      },
    };
  };
}

function importImage() {
  return {
    conversion: (img) => {
      const src = img.getAttribute('src');
      if (!src || src.startsWith('file:')) return { node: null };
      const attrWidth = parseInt(img.getAttribute('width'), 10) || toPx(img.style.width);
      return {
        node: $createBlockImageNode({
          src,
          altText: img.getAttribute('alt') || '',
          // Only keep an explicit width when it's clearly a "small" image; big ones fill the width.
          width: attrWidth && attrWidth < 480 ? Math.round(attrWidth) : null,
        }),
      };
    },
    priority: 1,
  };
}

// Lexical 0.51 derives the static importDOM from $config() once the editor registers the node,
// so the built-in conversion is looked up at paste time rather than at module load.
const builtIn = (klass, tag) => (domNode) => {
  const factory = klass.importDOM?.()?.[tag];
  return factory ? factory(domNode) : null;
};

export const HTML_IMPORT = {
  span: withTextStyle(builtIn(TextNode, 'span')),
  b: withTextStyle(builtIn(TextNode, 'b')),
  strong: withTextStyle(builtIn(TextNode, 'strong')),
  em: withTextStyle(builtIn(TextNode, 'em')),
  i: withTextStyle(builtIn(TextNode, 'i')),
  u: withTextStyle(builtIn(TextNode, 'u')),
  font: () => ({
    conversion: (el) => ({
      node: null,
      forChild: (node) => {
        const color = el.getAttribute('color');
        if ($isTextNode(node) && color && !isDefaultColor(color)) node.setStyle(mergeStyle(node.getStyle(), { color }));
        return node;
      },
    }),
    priority: 0,
  }),
  p: withIndent(builtIn(ParagraphNode, 'p')),
  img: importImage,
};
