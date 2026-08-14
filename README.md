# B-roll Studio

Generate **editorial kinetic typography B-roll** videos (≤8 detik) untuk YouTube.

Style: premium editorial typography, asymmetric composition, cream text on dark background.
Reference: Iman Gadzhi / Alex Hormozi style.

## Quick Start

### 1. Install

```bash
npm install
cd api && npm install && cd ..
cd web && npm install && cd ..
```

### 2. Run UI (recommended)

```bash
npm run ui
```

Buka http://localhost:5173 di browser.

- Pilih style preset (script-hero / serif-italic / mono-bold)
- Edit text per element
- Atur font, animasi, posisi, ukuran
- Toggle SFX on/off + volume
- Klik **Generate MP4**
- Preview langsung di form, download setelah selesai

### 3. Run CLI (alternative)

```bash
# Lihat preset
node scripts/broll.mjs --list

# Render preset default (script-hero)
node scripts/broll.mjs --preset script-hero --output love.mp4

# Override text per element (index-based)
node scripts/broll.mjs --preset script-hero \
  --text 2:"love" \
  --text 3:"yourself" \
  --text 4:"first"

# Multiple set
node scripts/broll.mjs --preset script-hero \
  --set 2.text="stop" \
  --set 2.rotation="-5" \
  --set 3.fontSize=200
```

Output: `out/<name>-<timestamp>.mp4`

## Style Presets

| ID | Hero font | Cocok untuk |
|---|---|---|
| `script-hero` | Great Vibes (calligraphy) | Kata hero pendek (find, stop, love) |
| `serif-italic` | Instrument Serif italic | Teks hero medium (premium editorial) |
| `mono-bold` | JetBrains Mono bold | Tech / SaaS / AI content |

Lihat deskripsi lengkap via `node scripts/broll.mjs --list`.

## Field Reference

Per element di preset JSON:

```json
{
  "text": "find",
  "x": 660, "y": 145,
  "fontSize": 260,
  "font": "script",
  "fontStyle": "normal",
  "fontWeight": 400,
  "letterSpacing": 0,
  "delay": 0.35,
  "anim": "reveal",
  "duration": 1.0,
  "opacity": 1,
  "rotation": -3
}
```

| Field | Type | Options |
|---|---|---|
| `font` | key | `display` / `displayItalic` / `sans` / `classic` / `mono` / `script` / `playfair` |
| `anim` | key | `fade` / `slideUp` / `slideLeft` / `slideRight` / `scaleIn` / `wordPop` / `reveal` |
| `rotation` | number | -4 sampai +4 (derajat editorial tilt) |

## Audio / SFX

Procedural via DSP, no download, no API key:

- **whoosh** — sine sweep + filtered noise (untuk slideUp/slideLeft/slideRight/scaleIn)
- **impact** — bass hit + click transient (untuk reveal/hero)
- **tick** — high-freq click (untuk wordPop)
- **pad** — background drone 6 detik (optional)

Toggle on/off + atur volume di UI sidebar.

## Struktur

```
broll/
├── api/                       # Express backend
│   ├── server.mjs             # POST /render, GET /presets, GET /fonts
│   └── package.json
├── web/                       # Vite + React UI
│   ├── src/
│   │   ├── App.tsx            # Form UI
│   │   └── styles.css
│   └── package.json
├── src/                       # Remotion
│   ├── Composition.tsx        # Main timeline (text + audio)
│   ├── Root.tsx               # Remotion registry
│   ├── fonts.ts               # Google Fonts loader
│   ├── _types.ts              # TypeScript types
│   ├── _config.generated.ts   # Auto-generated preset (jangan edit manual)
│   └── sfx/
│       ├── synth.ts           # Procedural SFX DSP
│       └── mapper.ts          # anim → SFX mapping
├── presets/                   # Layout presets
│   ├── script-hero.json       # Great Vibes hero
│   ├── serif-italic.json      # Instrument Serif hero
│   └── mono-bold.json         # JetBrains Mono hero
├── scripts/
│   └── broll.mjs              # CLI: preset → render
└── out/                       # Generated MP4
```

## Development

```bash
npm run studio           # Remotion Studio (http://localhost:3000)
npm run ui               # UI lengkap (API + Vite concurrently)
npm run b-roll:script    # Quick render via CLI
```

## Catatan

- Canvas: 1280×720, 30fps, 6 detik (180 frame)
- Output MP4: ~480 KB, video H.264 + audio AAC
- Audio procedural: 6 SFX generator + 1 background pad, fully offline
- Zero external dependency untuk SFX (tidak perlu download, tidak perlu API key)
