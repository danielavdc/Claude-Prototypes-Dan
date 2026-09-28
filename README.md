# Create Outreach Template — editor prototype

Standalone prototype of the outreach template editor, built on [Lexical](https://lexical.dev) with a Notion-style editing model. It is isolated from the other prototypes in this repo (orphan branch `template-editor`).

## Run

```bash
npm install
npm run dev
```

Opens on http://localhost:5191.

## What's in it

- **Text editing** — markdown shortcuts, drag handles, focused-line placeholders, `{{first_name}}` / `{{last_name}}` merge fields.
- **Text toolbar** (on selection or double-click) — font, size, B/I/U/S, emoji, text/background colour, link, alignment, indent, lists, checklist, placeholders. Inside tables it adds Cell color and Add image.
- **Add Element** — Paragraph, Heading, Divider, Table (≤ 7 columns × 10 rows), Image (resizable, alignment, alt text), Quote, Column layout (2 or 3 columns).
- **Paste** — Google Docs / Word / web HTML is mapped to the template's formats; pasted image files follow the image upload flow.

Code lives in `editor/` (`TemplateEditor.jsx` is the page; `nodes/`, `plugins/`, `toolbar/`, `paste/` hold the Lexical pieces).

## Preview

Cloudflare Workers builds this branch on every push:
https://template-editor-claudeprototypes.daniela-vera.workers.dev
