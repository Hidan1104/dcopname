-- =========================================================
-- SCHEMA: Stock Opname DC Almaz Bekasi
-- Jalankan seluruh script ini di Supabase SQL Editor
-- (Project Supabase baru, terpisah dari IT Stock Management)
-- =========================================================

create extension if not exists "pgcrypto";

-- Zona penyimpanan (lantai 1 & 2, sesuai denah gudang)
create table if not exists zones (
  id uuid primary key default gen_random_uuid(),
  lantai int not null check (lantai in (1, 2)),
  nama text not null,
  urutan int default 0,
  created_at timestamptz default now()
);

-- Daftar item per zona (diisi manual oleh user)
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid references zones(id) on delete cascade,
  nama text not null,
  satuan text default 'pcs',
  created_at timestamptz default now()
);

-- Sesi opname (bisa banyak sesi, misal per bulan)
create table if not exists opname_sessions (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  tanggal date default current_date,
  status text default 'aktif' check (status in ('aktif', 'selesai')),
  created_at timestamptz default now()
);

-- Hasil input qty fisik per item, per sesi
create table if not exists opname_entries (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references opname_sessions(id) on delete cascade,
  item_id uuid references items(id) on delete cascade,
  qty_sistem numeric default 0,
  qty_fisik numeric,
  catatan text,
  updated_by text,
  updated_at timestamptz default now(),
  unique(session_id, item_id)
);

-- Aktifkan Row Level Security + policy terbuka
-- (internal tool, akses dibatasi lewat anon key yang hanya lo bagikan ke tim)
alter table zones enable row level security;
alter table items enable row level security;
alter table opname_sessions enable row level security;
alter table opname_entries enable row level security;

create policy "allow all zones" on zones for all using (true) with check (true);
create policy "allow all items" on items for all using (true) with check (true);
create policy "allow all sessions" on opname_sessions for all using (true) with check (true);
create policy "allow all entries" on opname_entries for all using (true) with check (true);

-- Aktifkan realtime buat sync antar device
alter publication supabase_realtime add table opname_entries;
alter publication supabase_realtime add table items;

-- =========================================================
-- SEED DATA: Zona berdasarkan denah LAY_OUT_DC_ALMAZ_BEKASI
-- =========================================================
insert into zones (lantai, nama, urutan) values
  (1, 'Beef Patties, Curry & Nugget', 1),
  (1, 'Sambal Matah & Kentang', 2),
  (1, 'Mix Vegetable', 3),
  (1, 'Sauce Tomat & Chili', 4),
  (1, 'Tissue & Kardus', 5),
  (1, 'Transit Area', 6),
  (1, 'Area Packaging', 7),
  (1, 'Sambal & Bubuk Powder', 8),
  (1, 'Tepung Original & Tropical', 9),
  (1, 'Minyak Beku', 10),
  (1, 'Tepung Saudi', 11),
  (1, 'Marinasi Hot & Sachet', 12),
  (1, 'Sup Cream, Hand Glove & Cup Sealer', 13),
  (1, 'Beras Kebuli', 14),
  (1, 'Kemasan UK 25/35/90x120 & Kayu', 15),
  (1, 'K.Nasi & Box Almaz', 16),
  (1, 'Area Produksi Marinasi', 17),
  (1, 'Beras Putih', 18),
  (1, 'Garlic, Roti, Pasta & UHT', 19),
  (1, 'Lemon Tea', 20),
  (1, 'Cup & Paper Bowl', 21),
  (1, 'Gudang Aset', 22),
  (2, 'Lemari Bubuk & Jaring Poly Net', 1),
  (2, 'Bumbu Kering (Garam, Jinten, Ajinamoto, Chicken Powder, Minyak Samin)', 2),
  (2, 'Daun Bay, Kayu Manis & Plastik Es', 3),
  (2, 'Bawang Outig & Bombay', 4),
  (2, 'Mainan & Kertas Packaging', 5),
  (2, 'Keripik Kentang', 6);
