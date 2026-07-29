-- Ganti nama generic jadi nama asli sesuai akun masing-masing
update profiles set nama = 'Roby'
where id in (select id from auth.users where email = 'scanner1@abuyagroup.com');

update profiles set nama = 'Iril'
where id in (select id from auth.users where email = 'scanner2@abuyagroup.com');

update profiles set nama = 'Ardi'
where id in (select id from auth.users where email = 'scanner3@abuyagroup.com');

-- Cek hasilnya
select u.email, p.nama, p.role, p.dc_id
from profiles p join auth.users u on u.id = p.id
where u.email like 'scanner%@abuyagroup.com' or u.email like 'admin%@abuyagroup.com';
