// =========================================================
// KELOLA DATA (admin doang) -- nambahin Zona, Sector, Produk
// LEPAS dari alur sesi opname manapun. Diakses dari tombol
// "Kelola Data" di kartu DC (selectorScreen).
// =========================================================

// -------- Kelola Data: Pilih Zona --------
async function openManageZona(dcId){
  state.currentDc = state.dcs.find(d => d.id === dcId);
  if(!state.currentDc) return;

  el('manageZonaDcName').innerHTML = `<div class="mark"><i class="ti ${state.currentDc.icon || 'ti-box'}"></i></div>${state.currentDc.nama} · ${state.currentDc.sub || ''}`;
  el('userChip7').innerHTML = el('userChip').innerHTML;

  hide('selectorScreen');
  show('manageZonaScreen');

  await loadZones(dcId);
  renderManageZonaGrid();
}

function renderManageZonaGrid(){
  if(!state.zonesList.length){
    el('manageZonaGrid').innerHTML = '';
    show('emptyManageZonaMsg');
    return;
  }
  hide('emptyManageZonaMsg');

  el('manageZonaGrid').innerHTML = state.zonesList.map(z => `
    <button class="zona-card" data-manage-zona="${z.id}">
      <span class="zona-name">${z.nama}</span>
      <span class="zona-meta">
        <span><i class="ti ti-calendar"></i> ${formatTanggal(z.created_at)}</span>
      </span>
    </button>
  `).join('');

  document.querySelectorAll('[data-manage-zona]').forEach(tile => {
    tile.onclick = () => openManageProduk(tile.getAttribute('data-manage-zona'));
  });
}

el('backFromManageZonaBtn').onclick = () => {
  hide('manageZonaScreen');
  show('selectorScreen');
};

el('logoutBtn6').onclick = () => forceLogout();

// -------- Kelola Data: Sector & Produk (per Zona) --------
async function openManageProduk(zonaId){
  const zona = state.zonesList.find(z => z.id === zonaId);
  state.currentZonaId = zonaId;
  state.currentZona = zona ? zona.nama : '';
  state.sectorFilter = '';
  state.searchQuery = '';

  el('manageProdukZonaName').innerHTML = `<div class="mark"><i class="ti ${state.currentDc.icon || 'ti-box'}"></i></div>${state.currentDc.nama} · Zona ${state.currentZona}`;
  el('userChip8').innerHTML = el('userChip').innerHTML;
  el('manageSearchInput').value = '';

  hide('manageZonaScreen');
  show('manageProdukScreen');

  await loadProdukForZona(zonaId);
  renderManageSectorFilterOptions();
  renderManageProdukList();
}

function renderManageSectorFilterOptions(){
  const sel = el('manageSectorFilterSelect');
  sel.innerHTML = '<option value="">Semua Sector</option>' +
    state.sectorsList.map(s => `<option value="${s.id}">${s.nama}</option>`).join('');
  sel.value = state.sectorFilter || '';
}

// List produk versi "kelola data" -- simpel, gak ada qty/counting/scanned-by
// soalnya ini emang gak nempel ke sesi opname manapun.
function renderManageProdukList(){
  const produkZonaIni = state.sectorFilter
    ? state.produkList.filter(p => p.sector_id === state.sectorFilter)
    : state.produkList;

  const filtered = produkZonaIni.filter(p =>
    !state.searchQuery || p.nama.toLowerCase().includes(state.searchQuery)
  );

  if(!produkZonaIni.length){
    el('manageProdukGrid').innerHTML = '';
    show('emptyManageProdukMsg');
    return;
  }
  hide('emptyManageProdukMsg');

  if(!filtered.length){
    el('manageProdukGrid').innerHTML = `<div class="empty-state">Gak ada produk yang cocok.</div>`;
    return;
  }

  el('manageProdukGrid').innerHTML = filtered.map(p => `
    <div class="produk-card">
      <span class="kategori-tag">${p.kategori || '-'}</span>
      <div class="nama">${p.nama}</div>
      <div class="qty-row"><span class="uom">${p.satuan || ''}</span></div>
      <div class="produk-footer">
        <span class="scanned-by">${p.barcode}</span>
        <span class="sector-tag">${p.sector_nama}</span>
      </div>
    </div>
  `).join('');
}

el('manageSearchInput').addEventListener('input', (e) => {
  state.searchQuery = e.target.value.toLowerCase();
  renderManageProdukList();
});

el('manageSectorFilterSelect').addEventListener('change', (e) => {
  state.sectorFilter = e.target.value;
  renderManageProdukList();
});

el('backFromManageProdukBtn').onclick = () => {
  hide('manageProdukScreen');
  show('manageZonaScreen');
};

el('logoutBtn7').onclick = () => forceLogout();

// =========================================================
// MODAL: ZONA BARU
// =========================================================
el('addZonaBtn').onclick = () => {
  el('zoneModalId').value = '';
  el('zoneModalNama').value = '';
  el('zoneModalSave').disabled = false;
  el('zoneModalSave').textContent = 'Simpan';
  show('zoneModal');
  el('zoneModalId').focus();
};

function closeZoneModal(){ hide('zoneModal'); }
el('zoneModalCancel').onclick = closeZoneModal;
el('zoneModal').addEventListener('click', e => {
  if(e.target.id === 'zoneModal') closeZoneModal();
});

el('zoneModalSave').onclick = async () => {
  const id = el('zoneModalId').value.trim();
  const nama = el('zoneModalNama').value.trim();

  if(!id){ alert('ID Zona wajib diisi.'); return; }
  if(!nama){ alert('Nama Zona wajib diisi.'); return; }

  el('zoneModalSave').disabled = true;
  el('zoneModalSave').textContent = 'Menyimpan...';

  const { error } = await sb.from('zones').insert({
    id, nama, dc_id: state.currentDc.id,
  });

  if(error){
    alert('Gagal bikin zona: ' + error.message);
    el('zoneModalSave').disabled = false;
    el('zoneModalSave').textContent = 'Simpan';
    return;
  }

  await loadZones(state.currentDc.id);
  renderManageZonaGrid();
  closeZoneModal();
};

// =========================================================
// MODAL: SECTOR BARU
// =========================================================
el('addSectorBtn').onclick = () => {
  if(!state.currentZonaId){ alert('Pilih zona dulu.'); return; }
  el('sectorModalZonaInfo').textContent = `Sector ini bakal dibikin di dalem Zona: ${state.currentZona}`;
  el('sectorModalId').value = '';
  el('sectorModalNama').value = '';
  el('sectorModalSave').disabled = false;
  el('sectorModalSave').textContent = 'Simpan';
  show('sectorModal');
  el('sectorModalId').focus();
};

function closeSectorModal(){ hide('sectorModal'); }
el('sectorModalCancel').onclick = closeSectorModal;
el('sectorModal').addEventListener('click', e => {
  if(e.target.id === 'sectorModal') closeSectorModal();
});

el('sectorModalSave').onclick = async () => {
  const id = el('sectorModalId').value.trim();
  const nama = el('sectorModalNama').value.trim();

  if(!id){ alert('ID Sector wajib diisi.'); return; }
  if(!nama){ alert('Nama Sector wajib diisi.'); return; }

  el('sectorModalSave').disabled = true;
  el('sectorModalSave').textContent = 'Menyimpan...';

  const { error } = await sb.from('sectors').insert({
    id, nama, zone_id: state.currentZonaId,
  });

  if(error){
    alert('Gagal bikin sector: ' + error.message);
    el('sectorModalSave').disabled = false;
    el('sectorModalSave').textContent = 'Simpan';
    return;
  }

  await loadProdukForZona(state.currentZonaId);
  renderManageSectorFilterOptions();
  renderManageProdukList();
  closeSectorModal();
};

// =========================================================
// MODAL: PRODUK BARU -- bikin/assign produk (baru atau existing) ke sector
// =========================================================
el('addProdukBtn').onclick = () => {
  if(!state.sectorsList.length){
    alert('Belum ada sector yang bisa dipilih. Bikin sector dulu.');
    return;
  }
  el('produkModalBarcode').value = '';
  el('produkModalNama').value = '';
  el('produkModalKode').value = '';
  el('produkModalKategori').value = '';
  el('produkModalSubKategori').value = '';
  el('produkModalSatuan').value = '';
  el('produkModalSector').innerHTML = state.sectorsList
    .map(s => `<option value="${s.id}">${s.nama}</option>`).join('');
  el('produkModalSector').value = state.sectorFilter || state.sectorsList[0].id;
  el('produkModalSave').disabled = false;
  el('produkModalSave').textContent = 'Simpan';
  show('produkModal');
  el('produkModalBarcode').focus();
};

function closeProdukModal(){ hide('produkModal'); }
el('produkModalCancel').onclick = closeProdukModal;
el('produkModal').addEventListener('click', e => {
  if(e.target.id === 'produkModal') closeProdukModal();
});

el('produkModalSave').onclick = async () => {
  const barcode = el('produkModalBarcode').value.trim();
  const nama = el('produkModalNama').value.trim();
  const kode_produk = el('produkModalKode').value.trim();
  const kategori = el('produkModalKategori').value.trim();
  const sub_kategori = el('produkModalSubKategori').value.trim();
  const satuan = el('produkModalSatuan').value.trim();
  const sectorId = el('produkModalSector').value;

  if(!barcode){ alert('Barcode wajib diisi.'); return; }
  if(!sectorId){ alert('Pilih sector dulu.'); return; }

  el('produkModalSave').disabled = true;
  el('produkModalSave').textContent = 'Menyimpan...';

  try {
    // Cek dulu barcode ini udah ada di master_produk apa belum
    const { data: existing, error: findErr } = await sb
      .from('master_produk').select('barcode').eq('barcode', barcode).maybeSingle();
    if(findErr) throw findErr;

    if(!existing){
      if(!nama) throw new Error('Nama produk wajib diisi buat produk baru (barcode ini belum ada di master).');
      const { error: insertProdukErr } = await sb.from('master_produk').insert({
        barcode, nama,
        kode_produk: kode_produk || null,
        kategori: kategori || null,
        sub_kategori: sub_kategori || null,
        satuan: satuan || null,
      });
      if(insertProdukErr) throw insertProdukErr;
    }

    // Cek udah ke-assign ke sector ini apa belum, biar gak dobel
    const { data: existingPs, error: psFindErr } = await sb
      .from('produk_sectors').select('id').eq('barcode', barcode).eq('sector_id', sectorId).maybeSingle();
    if(psFindErr) throw psFindErr;

    if(existingPs){
      alert('Produk ini udah ke-assign ke sector ini sebelumnya.');
    } else {
      const sequence = state.produkList.filter(p => p.sector_id === sectorId).length + 1;
      const { error: psErr } = await sb.from('produk_sectors').insert({
        barcode, sector_id: sectorId, sequence,
      });
      if(psErr) throw psErr;
    }

    await loadProdukForZona(state.currentZonaId);
    renderManageSectorFilterOptions();
    renderManageProdukList();
    closeProdukModal();
  } catch(err){
    alert('Gagal simpan produk: ' + (err.message || err));
  } finally {
    el('produkModalSave').disabled = false;
    el('produkModalSave').textContent = 'Simpan';
  }
};
