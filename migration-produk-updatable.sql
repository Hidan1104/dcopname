-- Tabel produk dari awal cuma punya izin SELECT (baca), belum ada izin
-- UPDATE -- makanya app gagal nyimpen Zona/Sector walau gak nunjukin error.
drop policy if exists "produk: updatable oleh authenticated" on produk;
create policy "produk: updatable oleh authenticated" on produk
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
