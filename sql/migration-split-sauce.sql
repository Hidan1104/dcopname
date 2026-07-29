-- Migration: pisahin zona "Sauce Tomat & Chili" jadi 2 zona terpisah
-- Jalankan di SQL Editor Supabase (gak perlu run schema.sql lagi dari awal)

update zones set nama = 'Sauce Tomat' where nama = 'Sauce Tomat & Chili' and lantai = 1;

insert into zones (lantai, nama, urutan)
values (1, 'Chili', 4.5);
