-- =========================================================
-- MIGRATION: Restrukturisasi zona (hapus, pisah, ubah, tambah)
-- Jalankan di SQL Editor Supabase — sekali jalan, urutan udah bener
-- =========================================================

-- ---------------------------------------------------------
-- 1) HAPUS zona yang gak dipake
-- ---------------------------------------------------------
delete from zones where lantai=1 and nama='Transit Area';
delete from zones where lantai=1 and nama='Area Packaging';
delete from zones where lantai=1 and nama='Area Produksi Marinasi';
delete from zones where lantai=1 and nama='Gudang Aset';
delete from zones where lantai=2 and nama='Lemari Bubuk & Jaring Poly Net';

-- ---------------------------------------------------------
-- 2) PISAHKAN zona gabungan jadi per-produk
--    (zona lama di-rename jadi produk pertama, sisanya di-insert baru)
-- ---------------------------------------------------------

-- Beef Patties, Curry & Nugget
update zones set nama='Beef Patties' where lantai=1 and nama='Beef Patties, Curry & Nugget';
insert into zones (lantai, nama, urutan) values (1,'Curry',1.1),(1,'Nugget',1.2);

-- Sambal Matah & Kentang
update zones set nama='Sambal Matah' where lantai=1 and nama='Sambal Matah & Kentang';
insert into zones (lantai, nama, urutan) values (1,'Kentang',2.1);

-- Tissue & Kardus
update zones set nama='Tissue' where lantai=1 and nama='Tissue & Kardus';
insert into zones (lantai, nama, urutan) values (1,'Kardus',5.1);

-- Sambal & Bubuk Powder
update zones set nama='Sambal' where lantai=1 and nama='Sambal & Bubuk Powder';
insert into zones (lantai, nama, urutan) values (1,'Bubuk Powder',8.1);

-- Tepung Original & Tropical
update zones set nama='Tepung Original' where lantai=1 and nama='Tepung Original & Tropical';
insert into zones (lantai, nama, urutan) values (1,'Tropical',9.1);

-- Sup Cream, Hand Glove & Cup Sealer
update zones set nama='Sup Cream' where lantai=1 and nama='Sup Cream, Hand Glove & Cup Sealer';
insert into zones (lantai, nama, urutan) values (1,'Hand Glove',13.1),(1,'Cup Sealer',13.2);

-- Garlic, Roti, Pasta & UHT
update zones set nama='Garlic' where lantai=1 and nama='Garlic, Roti, Pasta & UHT';
insert into zones (lantai, nama, urutan) values (1,'Roti',19.1),(1,'Pasta',19.2),(1,'UHT',19.3);

-- Bumbu Kering (Garam, Jinten, Ajinomoto, Chicken Powder, Minyak Samin) — tanpa teks "Bumbu Kering"
update zones set nama='Garam' where lantai=2 and nama='Bumbu Kering (Garam, Jinten, Ajinamoto, Chicken Powder, Minyak Samin)';
insert into zones (lantai, nama, urutan) values
  (2,'Jinten',2.1),(2,'Ajinomoto',2.2),(2,'Chicken Powder',2.3),(2,'Minyak Samin',2.4);

-- Daun Bay, Kayu Manis & Plastik Es
update zones set nama='Daun Bay' where lantai=2 and nama='Daun Bay, Kayu Manis & Plastik Es';
insert into zones (lantai, nama, urutan) values (2,'Kayu Manis',3.1),(2,'Plastik Es',3.2);

-- Bawang Outig & Bombay
update zones set nama='Bawang Outig' where lantai=2 and nama='Bawang Outig & Bombay';
insert into zones (lantai, nama, urutan) values (2,'Bawang Bombay',4.1);

-- Mainan & Kertas Packaging
update zones set nama='Mainan' where lantai=2 and nama='Mainan & Kertas Packaging';
insert into zones (lantai, nama, urutan) values (2,'Kertas Packaging',5.1);

-- ---------------------------------------------------------
-- 3) UBAH nama / pisah zona lainnya
-- ---------------------------------------------------------

-- Chili -> Sauce Chili
update zones set nama='Sauce Chili' where lantai=1 and nama='Chili';

-- Marinasi Hot & Sachet -> Marinasi Hot, Marinasi Ori, Marinasi Sachet
update zones set nama='Marinasi Hot' where lantai=1 and nama='Marinasi Hot & Sachet';
insert into zones (lantai, nama, urutan) values (1,'Marinasi Ori',12.1),(1,'Marinasi Sachet',12.2);

-- Kemasan UK 25/35/90x120 & Kayu -> Plastik Kemasan uk. 25/35/90x120, Kayu
update zones set nama='Plastik Kemasan uk. 25' where lantai=1 and nama='Kemasan UK 25/35/90x120 & Kayu';
insert into zones (lantai, nama, urutan) values
  (1,'Plastik Kemasan uk. 35',15.1),(1,'Plastik Kemasan uk. 90x120',15.2),(1,'Kayu',15.3);

-- K.Nasi & Box Almaz -> Kertas Nasi, Box Almaz
update zones set nama='Kertas Nasi' where lantai=1 and nama='K.Nasi & Box Almaz';
insert into zones (lantai, nama, urutan) values (1,'Box Almaz',16.1);

-- Cup & Paper Bowl -> Cup Sup, Cup Ice, Cup Tea, Paper Bowl
update zones set nama='Cup Sup' where lantai=1 and nama='Cup & Paper Bowl';
insert into zones (lantai, nama, urutan) values
  (1,'Cup Ice',21.1),(1,'Cup Tea',21.2),(1,'Paper Bowl',21.3);

-- ---------------------------------------------------------
-- 4) TAMBAH zona baru
-- ---------------------------------------------------------
insert into zones (lantai, nama, urutan) values
  (1,'Thermal',13.3),
  (1,'Kidz',13.4),
  (1,'Polaris',13.5),
  (2,'Kertas Kentang',6.1);
