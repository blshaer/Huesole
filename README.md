# Huesole

Huesole is a free collection of CSS gradients, at [Huesole.com](https://huesole.com). A gradient is a named list of hex stops in one JSON file. The site searches that file, previews each gradient, and copies it as Tailwind, CSS, or SVG.

## What it does

- Search by name, color, or mood, with suggestions as you type. The address keeps the query, the page, the preview (`background` or `text`), and the shape (`linear`, `radial`, or `conic`).
- Each card shows the stops, a draggable angle, and the gradient as its own CSS or forced into a linear, radial, or conic fill.
- Copy Tailwind CSS, CSS, or SVG. Stops can be HEX, RGB, or HSL. A swatch copies that one color. On Chromium, the eyedropper in the navbar copies a color from the screen.
- Favorites stay in this browser, under `huesole.favorites`. Older saved favorites are copied over the first time the app loads. Several cards can be selected and their names copied together.

## Run it

You need Node.js 18 or later.

```sh
git clone https://github.com/blshaer/Huesole.git
cd Huesole
npm install
npm run dev
```

Open http://localhost:5173.

## Checks

```sh
npm run lint
npm run format:check
npm run build          # tsc, then the Vite build into dist/
```

## The collection

All 694 gradients live in [`src/lib/gradients.json`](src/lib/gradients.json). A name has to be unique: favorites and the copy-names action both use it. The newer palettes come first, then the original set.

```json
{
  "name": "Morning Harbor",
  "colors": ["#0F2027", "#203A43", "#2C5364"],
  "colorsname": ["navy", "blue", "teal"],
  "keywords": ["ocean", "dark", "calm"],
  "type": "linear",
  "angle": 156,
  "rawCss": "linear-gradient(156deg, #0F2027 0%, #203A43 46%, #2C5364 100%)"
}
```

| Field | Required | What it is |
| --- | --- | --- |
| `name` | yes | Title, search text, and the favorites key |
| `colors` | yes | `#RRGGBB` stops, in order |
| `colorsname` | no | Color words search can match, such as `blue` or `gold` |
| `keywords` | no | Mood and subject words, as a flat list |
| `type` | no | `linear`, `radial`, or `conic`, used when the shape filter is auto |
| `angle` | no | Starting angle in degrees |
| `rawCss` | no | Exact CSS for uneven stops. Every hex in it also has to be in `colors` |

## Layout

| Path | What's there |
| --- | --- |
| `src/pages` | Every route: home, favorites, privacy, terms, errors |
| `src/layout` | Navbar, logo, and footer |
| `src/features/home` | Hero and pagination |
| `src/features/gradients` | Cards, hooks, copy formats, and the gradient model |
| `src/features/search` | Search box and the result count |
| `src/components/ui` | Shared interface primitives |
| `src/lib/gradients.json` | The collection |
| `public` | Icons and the social preview image |

Routes: `/`, `/favorites`, `/privacy`, `/terms`.

## Deploy

`npm run build` writes a static site to `dist/`. [`vercel.json`](vercel.json) sends every path to `index.html`, so the client routes work on Vercel. Any static host can serve that folder.

## License

Huesole is licensed under the [MIT License](LICENSE). Copyright 2026 [Baraa Alshaer](https://blshaer.com).
