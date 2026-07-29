# Setup Opname AFC — DC Almaz Bekasi

Web app buat stock opname, bisa dipake bareng-bareng tim dengan sync real-time
antar device. Terpisah dari sistem IT Stock Management yang lama.

## 1. Bikin project Supabase baru

1. Buka https://supabase.com, login/daftar
2. Klik **New Project**
3. Kasih nama (misal `opname-afc`), pilih region terdekat (Singapore),
   set password database (simpen baik-baik)
4. Tunggu project selesai dibuat (~2 menit)

## 2. Jalankan schema

1. Di dashboard Supabase, buka menu **SQL Editor**
2. Buka **New query**
3. Copy-paste seluruh isi file `schema.sql` yang gue kasih, terus klik **Run**
4. Kalau sukses, cek di menu **Table Editor** — harusnya udah ada tabel
   `zones` (udah keisi 28 zona dari denah), `items`, `opname_sessions`,
   `opname_entries`

## 3. Ambil URL & Anon Key

1. Di dashboard Supabase, buka **Project Settings** (ikon gear) > **API**
2. Copy nilai **Project URL** dan **anon public key**

## 4. Isi ke `index.html`

Buka file `index.html`, cari bagian ini di paling atas `<script>`:

```js
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";
```

Ganti dengan URL & key yang lo copy tadi.

## 5. Hosting biar bisa diakses tim

Paling gampang pake **Netlify Drop** (gratis, gak perlu akun):
1. Buka https://app.netlify.com/drop
2. Drag & drop file `index.html` ke situ
3. Dapet link (misal `https://random-name.netlify.app`), share link itu ke
   tim buat dipake opname bareng-bareng

Alternatif lain: GitHub Pages, atau host di repo yang lo punya kayak
`abwarehouse`.

## 6. Cara pakai

1. Buka link web app-nya
2. Pas pertama buka, bakal ditanya nama (buat nyatet siapa yang input)
3. Klik **+ Sesi baru**, kasih nama sesi (misal "Opname Juli 2026")
4. Pilih tab **Lantai 1** / **Lantai 2**
5. Klik zona buat expand, tambahin item lewat form di bawah tabel zona
   (nama item + satuan)
6. Isi **Qty Sistem** (angka di catatan sistem/pembukuan) dan **Qty Fisik**
   (hasil hitung langsung), selisih otomatis kehitung dan dikasih warna:
   - Hijau = pas / sesuai
   - Merah = fisik kurang dari sistem
   - Kuning = fisik lebih dari sistem
7. Semua device yang buka link yang sama & sesi yang sama bakal
   **auto-sync** — gak perlu refresh manual
8. Selesai opname, klik **Export Excel** buat download hasilnya

## Catatan keamanan

Karena ini internal tool, akses cuma dibatasi lewat `anon key` yang lo
share ke tim secara manual (gak dipublish ke publik). Kalau butuh proteksi
lebih (misal login dulu), kabarin gue, nanti gue tambahin.
