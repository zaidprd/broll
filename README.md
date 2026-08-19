# Broll Studio

Aplikasi buat bikin video B-roll **kinetic typography** pendek (maks 6 detik)
untuk konten YouTube, Reels, TikTok, Shorts.

Style: typography besar yang aesthetic, warna cream di background gelap,
animasi masuk yang smooth. Cocok buat video Iman Gadzhi / Alex Hormozi style.

---

## 🚀 Cara Install (5 menit)

### Buat yang baru clone repo ini:

```bash
git clone https://github.com/zaidprd/broll.git
cd broll
```

Terus klik dua kali file **`setup.bat`** (kalau di Windows).

Tunggu sampai selesai. Itu download semua yang dibutuhkan (~280 MB).

---

## ▶️ Cara Jalanin

Klik dua kali **`start.bat`**.

Otomatis kebuka:
- **API backend** di port 3001
- **Web UI** di browser kamu: http://localhost:5173

### Cara make (30 detik):

1. Pilih **style preset** di sidebar kanan (script-hero / serif-italic / mono-bold)
2. Edit kata-katanya di form
3. Klik **Generate MP4**
4. Video muncul di preview kiri, download di kanan

**Stop**: klik dua kali `stop.bat`.

---

## ✨ Fitur

- **3 layout preset** siap pakai
- **7 font** pilihan (sans, serif, calligraphy, mono)
- **7 animasi** masuk (fade, slide, scale, dll)
- **SFX otomatis** — suara whoosh/impact/tick nyambung ke animasi
- **Background pad** — musik ambient halus
- **Live preview** — edit langsung keliatan hasilnya
- **CLI** juga tersedia

---

## 📁 Struktur Folder

```
broll/
├── src/              Engine Remotion (jangan diedit)
├── presets/          Layout preset (boleh diedit)
├── api/              Backend server
├── web/              UI form editor
├── out/              Hasil video MP4
├── setup.bat         Install dependencies
├── start.bat         Jalanin UI
└── stop.bat          Stop semua
```

---

## 🎨 Kustomisasi

### Ganti kata-kata

Buka file `presets/script-hero.json` di text editor (Notepad / VS Code).
Edit array `elements` — ganti `text`, `x`, `y`, `fontSize`, dll.
Save. UI reload otomatis.

### Tambah preset baru

1. Copy `presets/script-hero.json` → `presets/nama-baru.json`
2. Edit isinya
3. Save — preset baru muncul di UI

### Tambah font

Edit `src/fonts.ts` dan `api/server.mjs`. Lihat instruksi di file.

---

## 💡 Tips

- Pakai **rotation -3 sampai +3** untuk efek editorial tilt
- Pakai **font size 150-200** untuk hero word
- Kombinasikan **display bold** (text utama) + **classic serif italic** (aksen)
- **Jangan** pakai lebih dari 2 font di 1 scene

---

## 🔊 Custom SFX

Default SFX otomatis sync ke animasi. Kalau mau custom:

1. Pilih element → SFX dropdown → **custom**
2. Klik **Upload audio**
3. Pilih file `.wav`, `.mp3`, `.ogg`, `.m4a`, atau `.flac` (maks. 25 MB)
4. File otomatis terpilih untuk element tersebut
5. Atur **SFX offset** bila suara perlu maju/mundur dari timing teks

Tipe SFX yang tersedia:

- `auto` — pakai default (whoosh untuk slide, impact untuk reveal, dll)
- `whoosh` — suara hembusan
- `impact` — bass hit dramatis
- `tick` — click kecil
- `riser` — buildup naik (bagus untuk hero)
- `click` — click pendek
- `silent` — tidak ada SFX
- `custom` — upload file sendiri dari UI

**SFX offset**: posisi suara relatif terhadap teks masuk. `-0.15` berarti suara
mulai 0,15 detik sebelum teks; `0.20` berarti mulai 0,20 detik sesudah teks.

---

## 📋 Yang Dibutuhkan

- Node.js 18+ (download di https://nodejs.org)
- Windows 10/11 / macOS / Linux
- RAM 4 GB minimum
- Internet (untuk render pertama, font di-cache)

---

## 🐛 Troubleshooting

**Browser gak kebuka otomatis?**
→ Buka manual http://localhost:5173

**Generate gagal?**
→ Cek dulu API server jalan (port 3001)
→ Buka window kedua, jalanin `start.bat` lagi

**Port 3001 / 5173 sudah dipake?**
→ Tutup aplikasi yang pake port itu, atau restart PC

**Font gak muncul?**
→ Pastikan internet aktif (download font dari Google Fonts)
→ Tunggu 10-20 detik untuk render pertama

---

## 📖 Lebih Lengkap

Lihat **[PANDUAN.md](PANDUAN.md)** — tutorial step-by-step untuk pemula.

---

## 📝 Lisensi

Pakai pribadi. Font dari Google Fonts (semua open source).
