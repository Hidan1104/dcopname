select dc_id, count(*) as jumlah_produk
from produk
group by dc_id
order by dc_id;
