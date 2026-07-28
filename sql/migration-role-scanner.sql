-- Tambahin role baru 'scanner' — khusus buat akun yang HANYA boleh
-- dipake login di app abwarehouse, gak bisa login lewat web.
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('admin','user','scanner'));

-- Ubah role Roby, Iril, Ardi jadi 'scanner' (bukan 'user' lagi)
-- Ganti email di bawah sesuai email yang beneran lo pake pas bikin akun
update profiles set role = 'scanner', dc_id = 'dc-b'
where id in (
  select id from auth.users where email in (
    'scanner1@abuyagroup.com', 'scanner2@abuyagroup.com', 'scanner3@abuyagroup.com'
  )
);
