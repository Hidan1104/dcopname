-- Hapus zona yang duplikat (nama + lantai sama persis),
-- nyisain yang paling lama dibuat aja per nama.
-- Item & entry di zona duplikat yang dihapus otomatis ikut kehapus (cascade).

with ranked as (
  select id, row_number() over (
    partition by lantai, nama
    order by created_at asc, id asc
  ) as rn
  from zones
)
delete from zones where id in (select id from ranked where rn > 1);
