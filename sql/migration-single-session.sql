-- Nambahin kolom token sesi aktif, buat mastiin 1 akun cuma bisa login
-- di 1 tempat dalam satu waktu.
alter table profiles add column if not exists active_session_token text;

-- User boleh update baris profile-nya sendiri (buat nulis token sesi)
drop policy if exists "profiles: user updates own" on profiles;
create policy "profiles: user updates own" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Aktifin realtime buat tabel profiles, biar device lama bisa "denger"
-- kalau ada device baru yang ngambil alih sesi
alter publication supabase_realtime add table profiles;
