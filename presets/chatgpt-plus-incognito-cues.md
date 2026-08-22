# ChatGPT Plus Incognito — B-roll cue sheet

Sumber timing: `0820(1).srt`  
Format preset: 1920 × 864, 30 fps  
Preset: `chatgpt-plus-incognito-broll.json`

## Prinsip edit

- Jangan isi semua kalimat dengan B-roll. Pertahankan wajah pembicara sekitar 55–65% agar video tetap personal.
- Pakai hard cut saat narasi menyebut masalah/penolakan; pakai wipe atau match cut saat masuk ke solusi.
- Masukkan B-roll 2–4 frame sebelum kata kunci agar visual terasa responsif, bukan terlambat.
- Idealnya turunkan audio SFX preset ke -18 sampai -14 dB di bawah suara narator.
- Sisakan 6–10 frame setelah impact utama sebelum kembali ke talking head.

## Penempatan scene

| # | Timecode sumber | Durasi pakai | Scene preset | Arahan motion/edit |
|---|---|---:|---|---|
| 1 | `00:00:04.45–00:00:08.15` | 3.7 dtk | `01-free-offer` | Cut masuk tepat sebelum “free offer”. Dashboard muncul dengan overshoot halus, kartu offer naik, cursor klik saat “gratis satu bulan”. |
| 2 | `00:00:08.82–00:00:12.20` | 3.4 dtk | `02-payment-declined` | Hard cut pada “tapi”. Gunakan scale punch + shake hanya saat kata “gagal”; hindari shake terus-menerus. |
| 3 | `00:00:12.35–00:00:18.65` | 4.7 dtk inti | `03-bca-gopay-failed` | Mulai saat “kartu kredit BCA”. Logo masuk bergantian, tanda silang mengikuti penyebutan metode, collision/impact pada “terus gagal”. Trim bagian awal/akhir sesuai napas. |
| 4 | `00:00:21.70–00:00:26.75` | 4.7 dtk | `04-chatgpt-go-plan` | Match cut dari talking head ke pricing page. Cursor menuju kartu Go dan klik tepat saat “75.000 sebulan”. |
| 5 | `00:00:29.55–00:00:33.35` | 3.8 dtk | `05-offer-still-active` | Reprise visual scene 1, tetapi aksen biru. Kartu offer muncul pada “masih muncul”; ini memberi kontinuitas visual. |
| 6 | `00:00:35.15–00:00:43.65` | maks. 4.7 dtk | `03-bca-gopay-failed` | Pakai ulang scene 3 sebagai callback, tetapi ambil bagian animasi berbeda: GoPay saat `35.26`, BCA saat `41.26`. Bisa split menjadi dua insert 1.8–2.2 dtk. |
| 7 | `00:00:52.50–00:00:59.85` | 5.0 dtk | `06-incognito-solution` | Hero reveal solusi. Wipe kiri masuk pada “login lewat incognito”. Tahan frame browser ketika narator menjelaskan chat tidak tersimpan. |
| 8 | `00:01:00.00–00:01:09.70` | 5.5 dtk | `07-incognito-to-success` | Node muncul per kata: Incognito → Login → Bank Jago → Berhasil. Impact hijau tepat pada “alhamdulillah dia berhasil”. |
| 9 | `00:01:13.90–00:01:23.55` | 5.0 dtk | `08-three-step-tutorial` | Gunakan sebagai tutorial cepat. Tiap langkah muncul sinkron dengan “pembayaran ditolak”, “login dengan incognito”, dan “berhasil”. Kembali ke wajah setelah langkah ketiga. |
| 10 | `00:01:24.85–00:01:32.40` | 4.5 dtk | `09-plus-value` | Number scale-up pada “satu bulan”; secondary label muncul pada “400 ribuan”. Jangan memakai counter terlalu ramai. |
| 11 | `00:01:32.45–00:01:38.10` | 5.7 dtk | `10-exchange-rate` | Garis chart menggambar mengikuti kalimat “dolar semakin hari semakin mahal”. Angka berhenti di Rp18.000 ketika disebut. |
| 12 | `00:01:40.10–00:01:46.35` | 4.2 dtk | `11-payment-problem-recap` | Warning card sebagai social-proof problem. Punch-in saat “banyak yang masih gagal”, lalu cut kembali sebelum kalimat berikutnya. |
| 13 | `00:01:48.65–00:01:54.35` | 4.0 dtk | `01-free-offer` → `02-payment-declined` | Buat match cut dua shot: offer 2 dtk pada “undangan gratis”, lalu warning 2 dtk pada “pembayarannya ditolak”. Ini payoff visual yang kuat. |
| 14 | `00:01:55.60–00:02:01.15` | 5.0 dtk | `12-final-recap` | Penutup berupa tiga langkah. Biarkan langkah terakhir selesai sebelum “semoga bermanfaat”, lalu kembali ke wajah untuk closing. |

## Polishing ala After Effects

1. **Motion hierarchy:** judul bergerak paling sedikit, objek utama medium, cursor/indikator paling cepat.
2. **Graph editor feel:** entrance sekitar 12–18 frame dengan ease-out kuat; scale maksimal 103–106%, jangan zoom berlebihan.
3. **Impact discipline:** shake 4–8 frame hanya untuk transaksi gagal. Solusi dan success memakai gerak mulus agar perubahan emosi terasa.
4. **Color story:** merah/biru untuk masalah, biru untuk proses, hijau limau untuk solusi dan keberhasilan.
5. **Continuity:** scene offer diulang pada awal dan menjelang akhir; scene collision diulang saat metode pembayaran disebut kembali.
6. **Compositing:** bila talking head berada di canvas, gunakan B-roll sebagai full-screen cutaway. Jangan picture-in-picture karena komponen preset dirancang untuk resolusi penuh.
7. **Sound design:** whoosh pendek pada entrance, click pada CTA, impact pada gagal/berhasil. Hindari menumpuk SFX dengan konsonan penting narator.

## Render

```sh
npm run b-roll -- --preset chatgpt-plus-incognito-broll --output out/chatgpt-plus-incognito-broll.mp4
```

Hasil render adalah satu sequence berisi 12 scene. Potong scene mengikuti tabel di atas. Jika ingin file per scene, gunakan penanda pergantian scene berdasarkan urutan preset atau render dari UI setelah memilih scene terkait.
