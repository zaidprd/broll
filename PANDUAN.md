# Broll Studio — Panduan Pemakaian

Aplikasi untuk generate video B-roll **editorial kinetic typography** (≤6 detik).
Cocok untuk konten YouTube, Reels, TikTok, Shorts.

## Apa ini?

Broll Studio bikin video pendek dengan typography besar + animasi, style mirip
video Iman Gadzhi / Alex Hormozi. Anda tinggal:

1. Pilih style preset
2. Edit text per element
3. Klik Generate
4. Download MP4

Tidak perlu skill coding atau desain.

## Sistem yang dibutuhkan

- **Node.js** versi 18+ ([download](https://nodejs.org))
- **Windows 10/11**, macOS, atau Linux
- Koneksi internet (hanya untuk render pertama kali)
- RAM minimum 4 GB

## Cara install (5 menit)

### Windows

1. Buka folder `broll` di File Explorer
2. Klik dua kali `setup.bat`
3. Tunggu sampai selesai (download ~280 MB dependencies)
4. Selesai — folder siap dipakai

### macOS / Linux

```bash
cd broll
chmod +x setup.sh
./setup.sh
```

## Cara pakai

1. Klik dua kali `start.bat` (Windows) atau `./start.sh` (Mac/Linux)
2. Browser otomatis terbuka ke http://localhost:5173
3. Pilih style preset di sidebar kanan
4. Edit text, font, animasi per element
5. Klik **Generate MP4**
6. Tunggu 10-20 detik
7. Video muncul di preview — klik **Download MP4**

## Style preset

| Nama | Hero font | Cocok untuk |
|---|---|---|
| **script-hero** | Great Vibes (calligraphy) | Hero kata pendek (find, stop, love) |
| **serif-italic** | Instrument Serif italic | Teks hero medium (premium) |
| **mono-bold** | JetBrains Mono bold | Tech / SaaS / AI |

## Field yang bisa diedit

Per element, Anda bisa ubah:

| Field | Fungsi |
|---|---|
| Text | Kata yang muncul |
| Font | 7 pilihan font (display, sans, classic, mono, script, playfair) |
| Animation | 7 animasi (fade, slideUp, slideLeft, slideRight, scaleIn, wordPop, reveal) |
| Size | Ukuran font (12-400 px) |
| Position | Koordinat X, Y (0-1280, 0-720) |
| Rotate | Kemiringan editorial (-10° sampai +10°) |

## Audio / SFX

Tombol toggle di sidebar, kiri bawah:

- **SFX per element** — efek suara sync ke animasi (whoosh, impact, tick)
- **Background pad** — drone ambient subtle sepanjang video

Slider volume untuk masing-masing.

## FAQ

**Q: Browser tidak auto-terbuka?**
Buka manual http://localhost:5173

**Q: Klik Generate tidak jalan?**
Pastikan API server jalan. Buka window kedua dengan `start.bat` lagi.

**Q: Bisa tambah elemen baru?**
Klik **+ Add** di sidebar Lines.

**Q: Cara hapus element?**
Klik tombol ✕ merah di header element.

**Q: Bisa custom posisi lebih presisi?**
Edit angka X/Y langsung di field position. Drag-di-preview belum tersedia.

**Q: Render gagal / error?**
Cek console browser (F12) untuk detail error. Atau jalankan ulang `start.bat`.

**Q: Output MP4 di mana?**
Di folder `out/` di root project. Otomatis named sesuai field "Output filename".

## Struktur folder

```
broll/
├── src/              # engine Remotion (jangan edit)
├── presets/          # layout preset (boleh diedit langsung)
├── api/              # backend Node
├── web/              # UI Vite + React
├── out/              # hasil video MP4
├── scripts/          # CLI tools
├── start.bat         # DOUBLE-CLICK untuk start
├── setup.bat         # DOUBLE-CLICK untuk install
└── stop.bat          # DOUBLE-CLICK untuk stop semua
```

## Tips

- **Preserve tanpa render ulang**: klik preset sama lagi untuk reset text
- **Multiple variation**: ubah text + Generate lagi → file baru
- **Backup preset favorit**: copy file `presets/*.json` ke folder lain
- **Edit preset manual**: buka `presets/script-hero.json` di text editor,
  ubah array `elements`, save. Lalu klik preset di UI untuk reload.

## Lisensi

Project ini untuk pemakaian pribadi. Font Google Fonts mengikuti lisensi
masing-masing (semua open source).
