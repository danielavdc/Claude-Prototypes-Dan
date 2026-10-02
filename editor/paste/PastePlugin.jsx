import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import { $createHeadingNode, DRAG_DROP_PASTE, HeadingNode } from '@lexical/rich-text';
import { $isTableCellNode, TableNode } from '@lexical/table';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { $createImageNode, ImageNode, readImageFile } from '../nodes/ImageNode';
import { $createBlockImageNode, BlockImageNode, finishUpload } from '../nodes/BlockImageNode';
import { $columnImageWidths, $hasManualColumns } from '../nodes/tableLayout';
import { $isLayoutItemNode, LayoutContainerNode } from '../nodes/LayoutNodes';
import { MAX_TABLE_COLUMNS, MAX_TABLE_ROWS } from '../plugins/TableControlsPlugin';

export const TOAST_EVENT = 'te-toast';
const toast = (message) => window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));

const $inCell = (node) => !!$findMatchingParent(node, $isTableCellNode);

// Nearest ancestor that sits directly in the document (or a column).
const $blockOf = (node) => $findMatchingParent(node, (n) => $isRootOrShadowRoot(n.getParent()));

/*
 * Whatever arrives — pasted HTML, pasted files, drag & drop, Lexical JSON — is
 * normalised into shapes the template supports.
 */
export default function PastePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(
    () =>
      mergeRegister(
        // Image files (screenshots, files dragged in): same loading → active flow as "Add Element → Image".
        editor.registerCommand(
          DRAG_DROP_PASTE,
          (files) => {
            const images = files.filter((f) => f.type.startsWith('image/'));
            if (!images.length) return false;
            (async () => {
              const sources = await Promise.all(images.map(readImageFile));
              const pending = [];
              editor.update(() => {
                const selection = $getSelection();
                const anchor = $isRangeSelection(selection)
                  ? selection.anchor.getNode()
                  : selection?.getNodes?.()[0] ?? null;
                if (anchor && $inCell(anchor)) {
                  $insertNodes(sources.map((src) => $createImageNode({ src })));
                  return;
                }
                const nodes = sources.map((src) => {
                  const node = $createBlockImageNode({ src });
                  node.setUploading(true);
                  pending.push(node.getKey());
                  return node;
                });
                $insertNodes(nodes);
                $setSelection(null);
              });
              pending.forEach((key) => finishUpload(editor, key));
            })();
            return true;
          },
          COMMAND_PRIORITY_LOW,
        ),

        // Block images are top-level blocks; inside a table cell they become the cell image kind.
        editor.registerNodeTransform(BlockImageNode, (node) => {
          const parent = node.getParent();
          if (!parent) return;
          // Checked first: table cells are shadow roots too.
          if ($inCell(node)) {
            const image = $createImageNode({ src: node.__src, altText: node.__altText });
            if ($isTableCellNode(parent)) node.replace($createParagraphNode().append(image));
            else node.replace(image);
            return;
          }
          if ($isRootOrShadowRoot(parent)) return;
          // Hoisted out of the paragraph/heading/list it was pasted into.
          const block = $blockOf(node);
          if (!block) return;
          if (node.getPreviousSibling() === null && parent === block) block.insertBefore(node);
          else block.insertAfter(node);
          if (block.getTextContent() === '' && block.getChildrenSize() === 0) block.remove();
        }),

        // Cell images only live in table cells; anywhere else they become block images.
        editor.registerNodeTransform(ImageNode, (node) => {
          if ($inCell(node)) return;
          node.replace($createBlockImageNode({ src: node.__src, altText: node.__altText }));
        }),

        // The template only styles h1–h3.
        editor.registerNodeTransform(HeadingNode, (node) => {
          if (['h4', 'h5', 'h6'].includes(node.getTag())) node.replace($createHeadingNode('h3'), true);
        }),

        // Pasted tables respect the 7 × 10 limit and never keep the source's fixed pixel widths.
        editor.registerNodeTransform(TableNode, (table) => {
          let trimmed = false;
          const rows = table.getChildren();
          rows.slice(MAX_TABLE_ROWS).forEach((row) => {
            row.remove();
            trimmed = true;
          });
          rows.slice(0, MAX_TABLE_ROWS).forEach((row) => {
            row
              .getChildren()
              .slice(MAX_TABLE_COLUMNS)
              .forEach((cell) => {
                cell.remove();
                trimmed = true;
              });
          });
          // (Widths the user dragged in this editor are kept.)
          if (table.getColWidths() && !$hasManualColumns(table) && $columnImageWidths(table).every((w) => !w)) {
            table.setColWidths(undefined);
          }
          if (trimmed) toast(`Table trimmed to ${MAX_TABLE_COLUMNS} columns × ${MAX_TABLE_ROWS} rows`);
        }),

        // Column layouts can't be nested — a layout pasted into a column is flattened into it.
        editor.registerNodeTransform(LayoutContainerNode, (container) => {
          if (!$isLayoutItemNode(container.getParent())) return;
          const blocks = container.getChildren().flatMap((item) => item.getChildren());
          blocks.forEach((block) => container.insertBefore(block));
          if (!blocks.length) container.insertBefore($createParagraphNode());
          container.remove();
        }),
      ),
    [editor],
  );

  return null;
}

