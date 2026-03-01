[Deployed Site](https://marvel-rivals-api.netlify.app/)

# Marvel Rivals Explorer

A React + TypeScript web app that lets you browse **heroes**, **maps**, and **player stats** from the Marvel Rivals game — powered by the [Marvel Rivals API](https://marvelrivalsapi.com).

---

## What It Does

- **Home** — animated full-screen collage of hero and map images with navigation CTA
- **Heroes** — browse and select any hero to view their abilities, costumes, stats, bio, and lore
- **Maps** — browse and select any map to view its details, lore, and YouTube preview
- **Players** — search any player by username to view their rank, stats, top heroes, and teammates

---

### Disclaimer
> AI USED for most of the styling and display of data(Not All)

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/TypeLuis/React-SBA.git .
npm install
```

### 2. Add your API key

Create a `.env` file in the project root:

```env
VITE_MARVEL_KEY=your_api_key_here
```

You can get a key from [marvelrivalsapi.com](https://marvelrivalsapi.com).

> The key is accessed in code via `import.meta.env.VITE_MARVEL_KEY`. Vite only exposes env variables prefixed with `VITE_`.

### 3. Run the dev server

```bash
npm run dev
```


---

## How Data Flows

```
App.tsx
  ├── fetches /heroes  → heros[]
  ├── fetches /maps    → maps[]
  └── passes as props down to pages

Pages (Heros, Maps, Home)
  └── receive props → render MovingImage background + selection form

DetailsPage (/heroes/:id, /maps/:id, /players/:id)
  └── reads :id from useParams()
  └── fetches single item on mount
  └── renders HeroDetail / MapDetail / PlayerDetail
```

All API calls go through two utility functions in `functions.ts`:

- **`getInfo`** — fetches a list (handles both array responses and `{ maps: [...] }` shaped responses via `listKey`)
- **`getOne`** — fetches a single item by URL

---

## Key Utilities (`src/utilities/functions.ts`)

### `getImages<T>`
Normalizes any API type into a flat `ImgInfo[]` array for `MovingImage`. Since `Hero` and `RivalsMap` have different shapes, you pass in extractor functions:

```ts
getImages(heros, (h) => h.id, (h) => h.name, (h) => h.imageUrl)
```

### `getInfo<T>`
Generic async fetch that works with any type. Handles both direct array responses and nested responses like `{ maps: [...] }`:

```ts
await getInfo<RivalsMap>("/api/v1/maps", setError, "maps")
```

### `getOne<T>`
Fetches a single object — used on detail pages where you need one hero/map/player by ID.

### `toImageUrl`
Converts relative API image paths to full URLs. Handles three cases:
- Already a full URL → returns as-is
- Starts with `/rivals/` → prepends the origin
- Relative path → prepends the full base URL

### `chunk`, `padToLength`, `shuffleArray`
Array utilities used by `MovingImage` to split images into columns, pad them to fill the viewport height, and randomize order on load.

---

## Routing

```tsx
/           → Home
/heroes     → Hero selection
/heroes/:id → HeroDetail (fetches by hero id)
/maps       → Map selection
/maps/:id   → MapDetail (fetches by map id)
/players    → Player search
/players/:id → PlayerDetail (fetches by username)
```

All detail routes are handled by a single `DetailsPage` component that reads the current path to decide which detail component to render.

---

## TypeScript Types (`src/types/types.ts`)

| Type | Used For |
|---|---|
| `Hero` | List endpoint hero shape |
| `HeroObj` | Single hero detail (abilities, costumes, transformations) |
| `RivalsMap` | Map data |
| `ImgInfo` | Normalized image data for MovingImage |
| `PlayerData` | Full player profile |
| `PlayerStats` | Per-hero ranked stats inside a player profile |

---

## What I Learned

### Loading Animation Tutorial
[Tuturial Link](https://www.youtube.com/watch?v=bWshVSEn0tU)

### TypeScript Generics
Writing `getInfo<T>` and `getImages<T>` taught me how generics make utility functions reusable across completely different data shapes — the function doesn't care what `T` is, it just needs you to tell it how to extract the data it needs.

### React + requestAnimationFrame
The `MovingImage` component runs a pure DOM animation loop using `requestAnimationFrame`. The key lesson: **never call `setState` inside an rAF loop** — it causes React to re-render mid-frame and fight the transform, creating jank. Instead, rotate DOM nodes directly and let React own only the initial render. `MovingImage` component was a derivative from this [GitHub REPO](https://github.com/TypeLuis/Moving-Images)

### API Shape Variations
Real APIs don't always return the same shape. The `listKey` pattern in `getInfo` was a practical solution — some endpoints return `[...]` directly, others return `{ maps: [...] }`. Rather than writing separate fetch functions, one generic function handles both.

### CSS `mask-image` + `position` tricks
Two CSS techniques that came up repeatedly:
- `mask-image: linear-gradient(...)` — fades content out at edges without needing wrapper divs
- `width: 100vw; margin-left: 50%; transform: translateX(-50%)` — breaks a component out of any parent `max-width` container to go full-bleed

### Component Composition with Children
Passing `children` as an optional prop to `MovingImage` and overlaying it with `position: absolute` + `inset: 0` is a clean pattern for reusing an animated background across different pages with different overlay content.


## VSCode helpers I learned

| Shortcut | Description |
|---|---|
| `F2` | **Rename Symbol** — Renames a variable/function everywhere it's used in the project. Huge time saver. |
| `Alt + F12` | **Peek Definition** — View a function/type's definition inline without leaving your current file. |
| `Cmd/Ctrl + Shift + P` → `Snippets: Configure Snippets` → `typescriptreact.json` | Set up custom code snippets for `.tsx` files. |

> Example of Snippets for tsx file, with this typing `rface` in `.tsx` files will prepopulate with script

```
	// ${TM_FILENAME_BASE} is a built-in VS Code variable that automatically uses your filename
	// The $1, $2, $3 are tab stops — press Tab to jump between them in order after the snippet expands.
	"React Functional Component": {
		"prefix": "rface",
		"body": [
		  "import React from 'react';",
		  "",
		  "type ${TM_FILENAME_BASE}Props = {",
		  "  $1",
		  "}",
		  "",
		  "const ${TM_FILENAME_BASE} = ({ $2 }: ${TM_FILENAME_BASE}Props) => {",
		  "  return (",
		  "    <>${3}</>",
		  "  );",
		  "};",
		  "",
		  "export default ${TM_FILENAME_BASE};"
		],
		"description": "React functional component with typed props"
	},
```