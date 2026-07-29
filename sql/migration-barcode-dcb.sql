-- Isi barcode buat 22 produk DC B (Almaz) yang udah dikasih tim DC
-- Matching case-insensitive berdasarkan nama produk

update produk set barcode='8906078784380' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Kentang Straight Cut Skin-On'));
update produk set barcode='8991660000030' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Minyak Beku 15kg'));
update produk set barcode='M-PS80K14W03ALMOO' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Paper Bag Burger'));
update produk set barcode='18999908442304' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Polaris'));
update produk set barcode='899457590806' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Saus Sambal Sachet'));
update produk set barcode='899457590806' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Saus Tomat Sachet'));
update produk set barcode='18993053325161' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Tissue Makan'));
update produk set barcode='18993053215905' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Tissue Roll Toilet'));
update produk set barcode='18993053435518' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Tissue Wastafel'));
update produk set barcode='18995102707232' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Delisa Hot Lava'));
update produk set barcode='18995102700011' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Sup Krim Ayam'));
update produk set barcode='8992946122002' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Minyak Tropical Botol 2 Ltr'));
update produk set barcode='8993492101091' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Mix Vegetable'));
update produk set barcode='8992984850516' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Kopoe-Kopoe Pewarna Kuning Muda'));
update produk set barcode='89972243981550' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Chocomilk Powder DLFR'));
update produk set barcode='18992753016591' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Susu UHT Kids'));
update produk set barcode='8997206774397' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Japanese curry'));
update produk set barcode='28992770011118' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Ajinomoto 1 kg'));
update produk set barcode='18992770160123' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Chicken Powder'));
update produk set barcode='28719200170401' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Minyak Samin 200 gr'));
update produk set barcode='8992984910319' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Saus Sambal Sachet (belibis)'));
update produk set barcode='8992984911231' where dc_id='dc-b' and lower(trim(nama)) = lower(trim('Saus Tomat Sachet (Belibis)'));

-- Cek hasil: produk mana yang GAK ketemu (barcode masih NULL padahal harusnya keisi)
-- Bandingin manual sama daftar 22 nama di atas kalau ada yang meleset
