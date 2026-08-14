# Broll Studio

Generate **editorial kinetic typography B-roll** videos (≤6 detik) untuk YouTube, Reels, TikTok.

Style: premium editorial typography, asymmetric composition, cream text on dark background.
Reference: Iman Gadzhi / Alex Hormozi style.

## 🚀 Quick Start (5 menit)

### Buat orang yang clone:

```bash
git clone https://github.com/zaidprd/broll.git
cd broll
./setup.bat      # Windows — install dependencies
./start.bat      # Windows — buka UI di browser
```

Atau di macOS/Linux:

```bash
chmod +x setup.sh start.sh
./setup.sh
./start.sh
```

Browser otomatis terbuka ke **http://localhost:5173**.

### Cara pakai (30 detik)

1. Pilih **style preset** di sidebar (script-hero / serif-italic / mono-bold)
2. Edit text per element di form
3. Klik **Generate MP4**
4. Preview video di kiri, download di kanan

## ✨ Fitur

| Fitur | Detail |
|---|---|
| **3 layout preset** | script-hero (calligraphy), serif-italic (premium), mono-bold (tech) |
| **7 font** | Plus Jakarta Sans, Inter, Instrument Serif, JetBrains Mono, Great Vibes, Playfair Display |
| **7 animasi** | fade, slideUp, slideLeft, slideRight, scaleIn, wordPop, reveal |
| **SFX otomatis** | whoosh, impact, tick sync ke animasi (procedural, no download) |
| **Background pad** | Drone ambient subtle (toggle on/off) |
| **Live preview** | Edit → preview di update real-time |
| **CLI** | `node scripts/broll.mjs --preset script-hero` |

## 📋 Yang dibutuhkan

- Node.js 18+ ([download](https://nodejs.org))
- Windows 10/11 / macOS / Linux
- RAM 4 GB minimum
- Internet (untuk first render, font di-cache)

## 📖 Dokumentasi lengkap

- **[PANDUAN.md](PANDUAN.md)** — panduan bahasa Indonesia untuk pemula
- **[PUSH-GUIDE.md](PUSH-GUIDE.md)** — cara push ke GitHub (untuk kontributor)

## 🛠️ Struktur

```
broll/
├── src/              # Remotion engine (composition, fonts, SFX synthesis)
├── presets/          # Layout preset (JSON, bisa edit)
├── api/              # Backend Express (POST /render)
├── web/              # UI Vite + React (form editor)
├── out/              # Output MP4
├── scripts/          # CLI tools
├── setup.bat         # Install dependencies
├── start.bat         # Run UI
└── stop.bat          # Stop services
```

## 🎨 Kustomisasi

### Tambah preset baru

1. Copy `presets/script-hero.json` → `presets/nama-baru.json`
2. Edit array `elements` di file baru
3. Save — UI auto-detect saat dibuka

### Edit preset manual

Buka file JSON di text editor, ubah posisi/text/font, save. UI reload otomatis.

### Tambah font

1. Import CSS di `src/fonts.ts`:
   ```ts
   import "@fontsource/nama-font/400.css";
   ```
2. Tambah ke `fonts` object:
   ```ts
   export const fonts = {
     ...,
     namaFont: "Font Family Name",
   };
   ```
3. Tambah label di `api/server.mjs` endpoint `/fonts`

## 📦 Tech stack

- **Remotion** — React-based video framework
- **Express** — API backend
- **Vite + React** — Web UI
- **@remotion/google-fonts** — Font loading
- **Web Audio API** (prosedural SFX) — no audio file dependencies

## 📝 Lisensi

Personal use. Google Fonts mengikuti lisensi masing-masing (semua open source).

## 🐛 Bug / Request

Buka issue di https://github.com/zaidprd/broll/issues
