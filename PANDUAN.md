# Panduan Pemula — ZAID PRD Motion Engine

Panduan ini untuk menjalankan dan memakai Motion Engine tanpa perlu menulis kode.

Motion Engine membuat video MP4 lokal dari beberapa scene. Anda dapat memulai dari script, lalu mengubah visualnya melalui Scene Builder.

## 1. Yang diperlukan

- Komputer Windows 10/11, macOS, atau Linux
- Node.js versi 18+: https://nodejs.org
- RAM minimum 4 GB
- Koneksi internet pada render pertama jika font perlu di-cache

## 2. Instalasi

### Jika Anda baru download atau clone project

1. Buka folder project `broll`.
2. Di Windows, klik dua kali `setup.bat`.
3. Tunggu proses selesai. Jangan tutup jendelanya sebelum muncul pesan selesai.

Alternatif lewat terminal:

```bash
npm install
npm --prefix web install
```

## 3. Menjalankan aplikasi

### Windows

Klik dua kali `start.bat`.

### macOS / Linux / terminal

Di folder project, jalankan:

```bash
npm run ui
```

Lalu buka:

```text
http://localhost:5173
```

Jika browser tidak terbuka otomatis, salin alamat di atas ke Chrome/Edge.

## 4. Membuat video dari script

1. Di menu kiri, pilih **Script Planner**.
2. Paste naskah video Anda ke kotak script.
3. Klik **Buat Visual Plan**.
4. Aplikasi membuat beberapa scene otomatis.
5. Anda akan dibawa ke **Scene Builder**.
6. Review setiap scene. Klik scene di kolom kiri untuk berpindah.
7. Jika sudah sesuai, klik **Render MP4** di kanan atas.
8. Tunggu render. Video akan muncul di bawah Stage. Klik **Download MP4** untuk menyimpan file.

Contoh script singkat:

```text
Kebanyakan orang hanya memakai sedikit fitur ChatGPT. Buka Settings dan aktifkan Custom Instructions. Setelah itu, buat workflow yang menyimpan konteks Anda. Hasilnya, pekerjaan berulang bisa selesai lebih cepat.
```

### Planner memakai AI atau API?

Belum. Planner saat ini **berjalan lokal** memakai template dan aturan pemilihan scene. Script Anda tidak dikirim ke GPT atau API eksternal. Hasilnya dapat Anda edit sebelum dirender.

## 5. Memahami Scene Builder

### Kolom kiri: Scene

Setiap kotak adalah satu bagian video, contohnya Hook, Demo, atau Conclusion.

- Klik scene untuk membukanya.
- Klik **+ Add** untuk menambah scene kosong.
- Klik `×` pada scene untuk menghapusnya. Project harus memiliki minimal satu scene.

### Tengah: Stage dan Timeline

- **Stage** menunjukkan posisi structural component di dalam scene.
- Klik label component pada Stage untuk memilihnya.
- **Timeline** menunjukkan kapan component muncul.
- Klik component pada Timeline untuk memilih dan mengeditnya.

Stage bukan preview animasi penuh. Hasil visual dan animasi yang akurat dapat dilihat setelah **Render MP4** selesai.

### Kolom kanan: Component dan Inspector

1. Klik dropdown **+ Add component**.
2. Pilih visual yang ingin ditambahkan.
3. Component baru akan muncul di scene aktif.
4. Klik component tersebut untuk membuka pengaturan.

Pengaturan dasar:

| Pengaturan | Fungsi |
|---|---|
| ID | Nama internal component. Biarkan default jika tidak perlu. |
| Start (frame) | Kapan component mulai. Video 30 fps: 30 frame = 1 detik. |
| Duration | Berapa lama component terlihat. |
| Text | Isi tulisan pada typography. |
| Title | Judul pada component seperti Browser atau Notification. |
| Value | Nilai pada Big Number atau component angka. |

`Props JSON` adalah pengaturan lanjutan. Jika Anda tidak nyaman dengan JSON, gunakan field dasar saja.

### Membuat footage + typography premium

Untuk gaya editorial seperti footage dengan tulisan tebal dan satu kata italic:

1. Pilih scene di kiri.
2. Di panel kanan, pada bagian **EDITORIAL TOOLS**, klik **Upload Footage / Image**.
3. Pilih gambar atau video dari komputer Anda. Format gambar: PNG, JPG, WEBP, GIF. Format video: MP4, WEBM, MOV. Maksimum 250 MB.
4. Setelah upload selesai, klik template yang sesuai:
   - **Footage + Script**: teks di atas footage penuh.
   - **Portrait Sidecard**: card media vertikal di sisi layar.
   - **Object Editorial**: gambar besar sebagai elemen visual pendukung.
5. Klik component judul pada Stage.
6. Di bagian **ACCENT TYPOGRAPHY**, tulis satu kata penting, misalnya `ChatGPT` atau `Custom`.
7. Pilih font **Great Vibes** untuk calligraphy atau **Instrument Serif italic** untuk italic editorial, lalu pilih warna accent.
8. Klik **Apply Accent**, kemudian render ulang.

Gunakan script italic hanya untuk satu keyword. Teks utama tetap memakai bold sans agar video mudah dibaca.

## 6. Component yang tersedia

| Kelompok | Contoh | Kegunaan |
|---|---|---|
| Typography | Kinetic Title, Body Text, Mono Label | Hook, judul, dan penekanan kata |
| Chart | Big Number, Comparison, Bar Chart, Counter | Data, statistik, perbandingan |
| UI | Browser Window, App Grid, Notification, Checklist, Progress, Terminal, Cursor | Tutorial aplikasi dan produk |
| Workflow | Workflow Flow | Menjelaskan proses langkah demi langkah |
| Callout / Effects | Callout, Spotlight | Menunjukkan bagian penting pada layar |
| Device / Icon | Device Frame, Icon | Konteks mobile, aplikasi, atau brand |

Gunakan sedikit component dengan pesan jelas. Satu scene yang kuat biasanya lebih baik daripada semua component dipakai sekaligus.

## 7. Mengatur audio

Di bagian **AUDIO** pada inspector:

- Aktifkan/nonaktifkan **SFX** untuk efek suara bawaan.
- Aktifkan/nonaktifkan **Ambient pad** untuk suasana audio lembut.

Untuk preset Broll lama, Anda juga bisa memilih SFX per elemen dan upload audio sendiri:

1. Pilih SFX `custom`.
2. Upload WAV, MP3, OGG, M4A, atau FLAC (maksimal 25 MB).
3. Atur **SFX offset** sesuai waktu munculnya teks.

Contoh offset:

| Offset | Arti |
|---:|---|
| `-0.15` | Suara mulai 0,15 detik sebelum elemen masuk |
| `0` | Suara mulai bersamaan dengan elemen |
| `0.20` | Suara mulai 0,20 detik setelah elemen masuk |

## 8. Menjalankan demo bawaan

Untuk memastikan renderer bekerja tanpa membuka UI, jalankan di terminal:

```bash
npm run b-roll:motion
```

Video contoh dibuat di:

```text
out/motion-engine-v2-demo.mp4
```

## 9. Preset Broll lama

Fitur typography lama masih didukung. Perintah berikut membuat contoh video pendek:

```bash
npm run b-roll:script
npm run b-roll:serif
npm run b-roll:mono
```

Preset lama ada di folder `presets/` dan masih dapat dipakai sebagai compatibility workflow.

## 10. Lokasi hasil video

- Setelah render dari UI, klik tombol download di bawah Stage.
- Semua file MP4 juga tersimpan otomatis di folder `out/`.

## 11. Troubleshooting

**Tidak bisa membuka aplikasi**  
Jalankan ulang `start.bat`, lalu buka `http://localhost:5173` secara manual.

**Klik Render MP4 tetapi gagal**  
Tunggu bila ada render lain yang sedang berjalan. Engine sengaja hanya memproses satu render dalam satu waktu agar file tidak tertukar.

**Port 3001 atau 5173 sudah dipakai**  
Klik `stop.bat`, tutup terminal lama, lalu jalankan `start.bat` kembali.

**Props JSON merah/error**  
JSON harus lengkap: semua teks memakai tanda kutip, item dipisahkan koma, dan kurung `{}` harus berpasangan. Gunakan field Text/Title/Value untuk pengeditan biasa.

**Video hasil render tidak langsung terlihat**  
Tunggu pesan render selesai. Untuk video lebih panjang, proses memang membutuhkan waktu lebih lama.

## 12. Menghentikan aplikasi

Di Windows, klik dua kali `stop.bat`. Jika menjalankan lewat terminal, tekan `Ctrl + C`.

---

Dokumen teknis dan roadmap tersedia di folder `docs/`. Untuk pemakaian sehari-hari, cukup ikuti langkah Script Planner → Scene Builder → Render MP4 di atas.