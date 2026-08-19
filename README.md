# Katalog Perpustakaan

Website katalog perpustakaan yang datanya diambil langsung dari Google
Spreadsheet. Alurnya:

```
Excel (13.253 buku) → Google Spreadsheet → Google Apps Script (API) → React (Vite + Tailwind) → GitHub Pages
```

Setiap kali admin mengubah, menambah, atau menghapus data di spreadsheet,
website ikut ter-update. Tidak perlu edit kode apa pun untuk perubahan data.

---

## Struktur proyek

```
library-catalog/
├── google-apps-script/
│   └── Code.gs              ← Tempel ke Apps Script (jadi API gratis)
├── src/
│   ├── api/booksApi.js      ← Fetch data dari Apps Script + cache
│   ├── hooks/useBooks.js    ← State data buku (loading/error/ready)
│   ├── utils/fields.js      ← Deteksi kolom judul/pengarang/dll otomatis
│   ├── components/          ← Header, SearchBar, FilterBar, BookCard, dst
│   └── pages/                ← CatalogPage (daftar) & BookDetailPage (detail)
├── .github/workflows/deploy.yml  ← Auto build & deploy ke GitHub Pages
├── vite.config.js           ← Atur `base` sesuai nama repo GitHub kamu
└── .env.example              ← Contoh variabel VITE_API_URL
```

---

## Bagian 1 — Menyiapkan Google Spreadsheet

1. Pindahkan data dari Excel (13.253 baris) ke **Google Sheets** (File →
   Import di Google Sheets, atau copy-paste langsung).
2. Pastikan **baris pertama berisi nama kolom (header)**, misalnya:

   | No | Nomor Panggil | Judul | Pengarang | Penerbit | Kota Terbit | Tahun Terbit | ISBN | Deskripsi Fisik | Subjek | Bahasa |
   |----|----------------|-------|-----------|----------|-------------|---------------|------|------------------|--------|--------|

   Kamu **bebas memakai nama kolom sendiri** — kode di proyek ini otomatis
   menyesuaikan header apa pun yang ada di sheet (lihat `src/utils/fields.js`).
   Yang penting kata kuncinya masih dikenali, contoh: kolom yang mengandung
   kata "judul" akan dikenali sebagai judul buku, "pengarang"/"penulis"
   sebagai pengarang, "nomor panggil" sebagai nomor panggil, dst.
3. Beri nama tab/sheet-nya, misalnya **"Data"** (nama ini nanti dipakai di
   `Code.gs`).

---

## Bagian 2 — Membuat API gratis dengan Google Apps Script

1. Di Google Spreadsheet tadi, buka menu **Extensions → Apps Script**.
2. Hapus isi `Code.gs` bawaan, lalu **salin-tempel** seluruh isi file
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs) dari proyek ini.
3. Kalau nama tab sheet-mu bukan `Data`, ubah baris ini di paling atas script:
   ```js
   const SHEET_NAME = 'Data';
   ```
4. Klik **Deploy → New deployment**.
   - Klik ikon gear, pilih **Web app**.
   - **Execute as**: Me (akun kamu)
   - **Who has access**: Anyone
   - Klik **Deploy**, lalu izinkan akses (Authorize access) saat diminta.
5. Salin **Web app URL** yang muncul (diakhiri `/exec`). Contoh:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
6. Coba buka URL itu langsung di browser — harus muncul data JSON.

> **Catatan:** Setiap kali kamu mengubah isi `Code.gs`, kamu perlu
> **Deploy → Manage deployments → Edit (ikon pensil) → New version** agar
> perubahan kode terbit. Tapi untuk perubahan **data** di spreadsheet (tambah/
> edit/hapus baris), kamu **tidak perlu** deploy ulang — cukup refresh
> website.

---

## Bagian 3 — Menjalankan website di komputer (lokal)

Pastikan [Node.js](https://nodejs.org) (versi 18+) sudah terpasang.

```bash
# 1. Masuk ke folder proyek
cd library-catalog

# 2. Install dependencies
npm install

# 3. Buat file .env dari contoh, lalu isi dengan URL Apps Script kamu
cp .env.example .env
# lalu edit .env, isi VITE_API_URL dengan URL dari Bagian 2 langkah 5

# 4. Jalankan mode development
npm run dev
```

Buka `http://localhost:5173` di browser. Kalau data spreadsheet muncul di
katalog, artinya koneksi sudah berhasil.

---

## Bagian 4 — Deploy ke GitHub Pages

Proyek ini sudah dilengkapi **GitHub Actions** (`.github/workflows/deploy.yml`)
yang otomatis build & deploy setiap kali kamu push ke branch `main`.

### Langkah-langkah

1. **Buat repository baru** di GitHub, misalnya bernama `katalog-perpustakaan`.
2. Buka `vite.config.js`, ganti baris `base` sesuai nama repo kamu:
   ```js
   base: '/katalog-perpustakaan/',
   ```
3. Push proyek ini ke repo tersebut:
   ```bash
   git init
   git add .
   git commit -m "Setup katalog perpustakaan"
   git branch -M main
   git remote add origin https://github.com/USERNAME/katalog-perpustakaan.git
   git push -u origin main
   ```
4. Tambahkan **secret** untuk URL API (supaya tidak perlu commit `.env`):
   - Buka repo di GitHub → **Settings → Secrets and variables → Actions**
   - Klik **New repository secret**
   - Name: `VITE_API_URL`
   - Value: URL Apps Script dari Bagian 2 (yang diakhiri `/exec`)
5. Aktifkan GitHub Pages:
   - **Settings → Pages**
   - Source: pilih **GitHub Actions**
6. Push apa pun (atau jalankan ulang workflow di tab **Actions**) untuk
   memicu build. Setelah selesai (biasanya 1–2 menit), website akan tersedia di:
   ```
   https://USERNAME.github.io/katalog-perpustakaan/
   ```

Setiap kali kamu `git push` ke `main`, website otomatis ter-build ulang.
Karena data diambil langsung dari spreadsheet saat website dibuka (bukan
di-build ke dalam kode), **kamu tidak perlu push/deploy ulang** hanya karena
mengubah data buku — cukup edit spreadsheet-nya.

---

## Fitur yang tersedia

- **Pencarian** — mencari kata kunci di semua kolom (judul, pengarang,
  nomor panggil, ISBN, subjek, dll sekaligus).
- **Filter** — pilih satu kolom (misalnya "Subjek" atau "Penerbit"), lalu
  pilih nilainya untuk mempersempit hasil.
- **Urutkan** — urutkan hasil berdasarkan kolom apa pun.
- **Pagination** — 24 buku per halaman, supaya 13.000+ data tetap ringan
  dinavigasi.
- **Halaman detail** — klik buku untuk melihat seluruh data bibliografisnya.
- **Segarkan data** — tombol di header untuk mengambil ulang data terbaru
  dari spreadsheet (data juga di-cache 1 jam di browser supaya navigasi
  terasa cepat).

## Tentang skala data (13.253 baris)

`Code.gs` mengirim seluruh data sekaligus sebagai satu JSON (biasanya
beberapa MB). Website mengambilnya sekali lalu menyimpannya sementara di
`localStorage` browser, sehingga pencarian/filter/pagination berikutnya
terasa instan karena diproses di sisi browser (bukan memanggil API berulang
kali). Untuk 13 ribuan baris, pendekatan ini masih nyaman dipakai. Jika ke
depan koleksi bertambah sangat besar (misalnya >50.000 baris) dan loading
awal terasa lambat, `Code.gs` bisa dikembangkan lebih lanjut untuk mendukung
pencarian & pagination di sisi server.

## Troubleshooting

- **"API belum dihubungkan"** → file `.env` belum diisi atau secret
  `VITE_API_URL` di GitHub belum diatur.
- **Data kosong / error saat fetch** → pastikan saat Deploy Apps Script,
  "Who has access" diatur ke **Anyone**, dan `SHEET_NAME` di `Code.gs` sesuai
  nama tab spreadsheet-mu.
- **Halaman GitHub Pages blank/putih** → cek `base` di `vite.config.js`
  sudah sama persis dengan nama repo GitHub-mu.
- **Perubahan data spreadsheet tidak muncul** → klik tombol "Segarkan data"
  di website (cache lokal berlaku 1 jam).
