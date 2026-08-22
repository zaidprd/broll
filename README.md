# ZAID PRD Motion Engine

Aplikasi **local-first** berbasis Remotion untuk membuat motion graphics video tentang AI, teknologi, automation, aplikasi, dan tutorial.

Bukan hanya kinetic typography. Satu project dapat berisi beberapa scene dengan kombinasi judul, angka besar, browser mockup, workflow, chart, notification, cursor, callout, dan audio. Semua dirender menjadi MP4 di komputer sendiri.

> Tidak perlu API key untuk workflow utama saat ini. **Script Planner** berjalan lokal dengan aturan/template bawaan, bukan memakai model AI eksternal.

---

## Yang bisa dilakukan

- Paste script → buat **Visual Plan** multi-scene otomatis
- Edit scene dan component lewat **Scene Builder**
- Tambahkan Kinetic Title, Big Number, Browser Window, Workflow, Chart, Cursor, Callout, dan lainnya
- Render MP4 lokal dari UI
- Menjalankan demo Motion Engine dari CLI
- Tetap mendukung preset Broll/typography lama
- Memakai SFX dan ambient pad pada render legacy

## Syarat

- Node.js 18 atau lebih baru: https://nodejs.org
- Windows 10/11 (file `.bat` tersedia), macOS, atau Linux
- RAM minimum 4 GB
- Internet hanya diperlukan pada render pertama bila font belum tersimpan di cache

---

## Instalasi

### Clone repository

```bash
git clone https://github.com/zaidprd/broll.git
cd broll
```

### Windows

Klik dua kali `setup.bat`, lalu tunggu sampai dependencies selesai diunduh.

### Terminal (semua OS)

```bash
npm ci
npm --prefix web ci
```

Gunakan `npm ci` setelah clone atau pull agar versi dependency sama persis dengan `package-lock.json`. Jangan menyalin folder `node_modules` dari komputer lain.

---

## Menjalankan aplikasi lokal

### Windows (paling mudah)

Klik dua kali `start.bat`.

### Terminal

```bash
npm run ui
```

Buka browser di:

```text
http://localhost:5173
```

Untuk berhenti di Windows, klik dua kali `stop.bat`. Jika memakai terminal, tekan `Ctrl + C`.

### Troubleshooting dependency

Jika muncul `ERR_MODULE_NOT_FOUND` setelah clone atau pull, hentikan aplikasi lalu instal ulang dari lockfile:

```bash
npm ci
npm --prefix web ci
npm run ui
```

Backend membutuhkan dependency runtime `express`, `cors`, dan `multer`. Ketiganya tercatat di `package.json` dan akan otomatis dipasang oleh `npm ci` atau `setup.bat`.

---

## Workflow utama: Script menjadi video

1. Buka `http://localhost:5173`.
2. Pilih menu **Script Planner**.
3. Paste script video Anda.
4. Klik **Buat Visual Plan**.
5. Planner lokal memilih scene template yang sesuai, seperti Hook, Browser Demo, Workflow, Feature Grid, Comparison, dan Conclusion.
6. Masuk ke **Scene Builder** untuk memilih scene, menambah/menghapus component, mengubah teks, nilai, timing, atau properti lanjutan.
7. Klik **Render MP4**.
8. Pilih **Full-screen MP4** untuk cutaway penuh, atau **Overlay transparan MOV** untuk graphic di atas presenter.
9. Setelah render selesai, video muncul di aplikasi dan dapat di-download. File juga tersimpan di folder `out/`.

Untuk overlay presenter, import file MOV ke CapCut dan letakkan di track atas tanpa Chroma Key. Format ini memakai ProRes 4444 dengan alpha asli. Scale dan pindahkan graphic ke negative space agar tidak menutupi wajah presenter.

### Catatan penting

- Planner saat ini berbasis aturan lokal. Ia tidak mengirim script ke layanan AI mana pun.
- Hasil planner adalah draft visual yang dapat Anda edit sebelum render.
- Preview di Stage adalah peta layout/timeline component. Preview MP4 setelah render adalah hasil Remotion yang sebenarnya.

---

## Scene Builder

| Area | Fungsi |
|---|---|
| Sidebar kiri | Berpindah project, Scene Builder, atau Script Planner |
| Scene rail | Memilih, menambah, dan menghapus scene |
| Stage | Memilih component secara visual |
| Timeline | Mengatur urutan serta durasi component dalam scene |
| Inspector kanan | Menambah component dan mengedit properti component terpilih |

Component inti yang tersedia:

- **Typography:** Kinetic Title, Body Text, Mono Label
- **Chart:** Big Number, Comparison, Bar Chart, Counter
- **UI:** Browser Window, App Grid, Notification, Checklist, Progress, Terminal, Cursor
- **Storytelling:** Workflow Flow, Callout, Spotlight, Device Frame, Icon

Gunakan field cepat seperti **Text**, **Title**, dan **Value** untuk kebutuhan umum. `Props JSON` hanya untuk pengaturan lanjutan; nilainya harus JSON valid.

### Editorial Tools: footage dan script italic

Di panel kanan terdapat **EDITORIAL TOOLS** untuk membuat visual B-roll lebih profesional tanpa JSON:

1. Pilih scene yang ingin diubah.
2. Klik **Upload Footage / Image** dan pilih gambar (`PNG`, `JPG`, `WEBP`, `GIF`) atau video (`MP4`, `WEBM`, `MOV`) lokal, maksimum 250 MB.
3. Pilih salah satu template:
   - **Footage + Script** — footage penuh dengan judul bold dan satu kata script.
   - **Portrait Sidecard** — footage/gambar vertikal di samping typography.
   - **Object Editorial** — gambar/objek besar dengan script accent.
4. Klik component judul `typography.headline` di Stage.
5. Pada **Accent Typography**, isi kata yang ingin ditekankan, pilih **Great Vibes** atau **Instrument Serif italic**, lalu pilih warna accent dan klik **Apply Accent**.
6. Klik **Render MP4**.

Gunakan maksimal satu kata script sebagai accent dalam satu scene agar tetap premium dan mudah dibaca. File upload disimpan lokal di `public/uploads/`.

---

## Render demo Motion Engine

Untuk membuat video contoh V2 langsung dari terminal:

```bash
npm run b-roll:motion
```

Hasilnya:

```text
out/motion-engine-v2-demo.mp4
```

Demo tersebut berisi Hook/Big Number, Browser + Cursor + Spotlight + Callout, serta Workflow + Notification.

---

## Preset typography lama

Preset lama tetap tersedia agar workflow Broll sebelumnya tidak rusak:

```bash
npm run b-roll:script
npm run b-roll:serif
npm run b-roll:mono
```

Preset ada di folder `presets/`. Preset legacy menggunakan `elements`; project Motion Engine V2 menggunakan `scenes` dan `layers`.

---

## Audio dan SFX

Pada workflow legacy, setiap elemen dapat memakai SFX bawaan atau file audio sendiri. Format upload: WAV, MP3, OGG, M4A, FLAC, maksimum 25 MB.

Posisi SFX diatur dengan **SFX offset** relatif terhadap waktu masuk elemen:

- `-0.15`: audio 0,15 detik lebih awal
- `0`: bersamaan dengan animasi
- `0.20`: audio 0,20 detik lebih lambat

Untuk Motion Engine V2, audio menggunakan component `audio.clip` dan asset manifest lokal. Ini memastikan audio menjadi bagian eksplisit dari timeline, bukan efek samping animasi teks.

---

## Struktur project

```text
broll/
├── api/                 # Backend lokal dan render API
├── docs/                # Kontrak arsitektur dan visual grammar V2
├── presets/             # Preset legacy dan MotionProject contoh
├── public/              # Asset lokal: audio, gambar, video
├── scripts/             # CLI, migration legacy, template/planner
├── src/
│   ├── components/      # Component Motion Engine
│   ├── engine/          # Schema, validator, compiler, asset resolver
│   └── scenes/          # Renderer scene
├── web/                 # UI Scene Builder + Script Planner
├── out/                 # Video hasil render dan job props terisolasi
├── setup.bat            # Instalasi Windows
├── start.bat            # Menjalankan aplikasi Windows
└── stop.bat             # Menghentikan aplikasi Windows
```

---

## Dokumentasi arsitektur

- [Motion Engine V2 Architecture](docs/MOTION-ENGINE-V2-ARCHITECTURE.md)
- [Visual Grammar V1](docs/VISUAL-GRAMMAR-V1.md)
- [Scene Template Catalog V1](docs/SCENE-TEMPLATE-CATALOG-V1.md)
- [Panduan pemula](PANDUAN.md)

## Troubleshooting

**Halaman tidak terbuka**  
Buka manual `http://localhost:5173` setelah menjalankan `start.bat` atau `npm run ui`.

**Render gagal**  
Pastikan API lokal berjalan di port `3001`. Jalankan ulang `start.bat`, lalu coba render sekali lagi.

**Port 3001 atau 5173 dipakai aplikasi lain**  
Tutup aplikasi tersebut atau jalankan `stop.bat`, lalu start ulang.

**Props JSON error**  
Pastikan tanda kutip, koma, dan kurung JSON lengkap. Untuk penggunaan normal, gunakan field Text/Title/Value terlebih dahulu.

**Output MP4 ada di mana?**  
Semua video hasil render tersedia di folder `out/`.

## Lisensi

Untuk penggunaan pribadi. Font mengikuti lisensi open-source masing-masing.