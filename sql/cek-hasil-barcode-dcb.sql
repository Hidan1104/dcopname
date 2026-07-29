-- Jalankan SETELAH migration-barcode-dcb.sql, buat liat mana yang berhasil ke-update
select nama, barcode
from produk
where dc_id = 'dc-b'
and nama in (
  'Kentang Straight Cut Skin-On','Minyak Beku 15kg','Paper Bag Burger','Polaris',
  'Saus Sambal Sachet','Saus Tomat Sachet','Tissue Makan','Tissue Roll Toilet',
  'Tissue Wastafel','Delisa Hot Lava','Sup Krim Ayam','Minyak Tropical Botol 2 Ltr',
  'Mix Vegetable','Kopoe-Kopoe Pewarna Kuning Muda','Chocomilk Powder DLFR',
  'Susu UHT Kids','Japanese Curry','Ajinomoto 1 kg','Chicken Powder',
  'Minyak Samin 200 gr'
)
order by nama;
