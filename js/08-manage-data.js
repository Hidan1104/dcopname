// =========================================================
// KELOLA DATA (admin doang) -- nambahin Zona, Sector, Produk
// LEPAS dari alur sesi opname manapun. Diakses dari tombol
// "Kelola Data" di kartu DC (selectorScreen).
// =========================================================

// -------- Master: Pilih DC (grid + create/edit/delete) --------
function renderManageDcGrid(){
  el('manageDcGrid').innerHTML = state.dcs.map(dc => `
    <div class="dc-card">
      <div class="dc-card-main" data-manage-dc="${dc.id}">
        <div class="dc-icon"><i class="ti ${dc.icon || 'ti-building-warehouse'}"></i></div>
        <div>
          <p class="name">${dc.nama}</p>
          <p class="sub">${dc.sub || ''}</p>
        </div>
      </div>
      <div class="zona-card-actions">
        <button class="btn-icon" data-edit-dc="${dc.id}" title="Edit DC"><i class="ti ti-edit"></i></button>
        <button class="btn-icon danger" data-delete-dc="${dc.id}" title="Hapus DC"><i class="ti ti-trash"></i></button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-manage-dc]').forEach(elm => {
    elm.onclick = () => openManageZona(elm.getAttribute('data-manage-dc'));
  });
  document.querySelectorAll('[data-edit-dc]').forEach(btn => {
    btn.onclick = () => {
      const dc = state.dcs.find(x => x.id === btn.getAttribute('data-edit-dc'));
      if(dc) openDcModal('edit', dc);
    };
  });
  document.querySelectorAll('[data-delete-dc]').forEach(btn => {
    btn.onclick = () => deleteDc(btn.getAttribute('data-delete-dc'));
  });
}

el('backFromManageDcBtn').onclick = () => {
  hide('manageDcScreen');
  show('mainMenuScreen');
};

el('logoutBtn9').onclick = () => forceLogout();

// =========================================================
// MODAL: DC BARU / EDIT DC
// =========================================================
function openDcModal(mode, dc){
  state.dcModalMode = mode;
  state.dcModalEditingId = dc ? dc.id : null;

  el('dcModalTitle').textContent = mode === 'create' ? 'DC Baru' : 'Edit DC';
  el('dcModalId').disabled = mode === 'edit'; // id itu primary key, dikunci pas edit
  el('dcModalId').value = mode === 'edit' ? dc.id : '';
  el('dcModalNama').value = mode === 'edit' ? dc.nama : '';
  el('dcModalSub').value = mode === 'edit' ? (dc.sub || '') : '';
  el('dcModalIcon').value = mode === 'edit' ? (dc.icon || '') : '';
  el('dcModalSave').disabled = false;
  el('dcModalSave').textContent = 'Simpan';

  show('dcModal');
  el(mode === 'edit' ? 'dcModalNama' : 'dcModalId').focus();
}

el('addDcBtn').onclick = () => openDcModal('create');

function closeDcModal(){ hide('dcModal'); }
el('dcModalCancel').onclick = closeDcModal;
el('dcModal').addEventListener('click', e => {
  if(e.target.id === 'dcModal') closeDcModal();
});

el('dcModalSave').onclick = async () => {
  const id = el('dcModalId').value.trim();
  const nama = el('dcModalNama').value.trim();
  const sub = el('dcModalSub').value.trim();
  const icon = el('dcModalIcon').value.trim();

  if(!id){ alert('ID DC wajib diisi.'); return; }
  if(!nama){ alert('Nama DC wajib diisi.'); return; }

  el('dcModalSave').disabled = true;
  el('dcModalSave').textContent = 'Menyimpan...';

  const isEdit = state.dcModalMode === 'edit';
  const { error } = isEdit
    ? await sb.from('dcs').update({ nama, sub: sub || null, icon: icon || null }).eq('id', state.dcModalEditingId)
    : await sb.from('dcs').insert({ id, nama, sub: sub || null, icon: icon || null, urutan: state.dcs.length + 1 });

  if(error){
    alert(`Gagal ${isEdit ? 'simpan perubahan' : 'bikin'} DC: ` + error.message);
    el('dcModalSave').disabled = false;
    el('dcModalSave').textContent = 'Simpan';
    return;
  }

  await loadDcs();
  renderManageDcGrid();
  closeDcModal();
};

// Hapus DC -- kalau masih ada Zona/Sector/Produk/Sesi opname yang nempel,
// Supabase bakal nolak (FK constraint) biar data histori gak ilang diem-diem.
async function deleteDc(dcId){
  const dc = state.dcs.find(x => x.id === dcId);
  if(!dc) return;

  const confirmed = confirm(
    `Hapus DC "${dc.nama}"? Kalau DC ini masih punya Zona, Sesi, atau data lain yang nempel, penghapusan bakal ditolak otomatis biar data gak ilang.`
  );
  if(!confirmed) return;

  const { error } = await sb.from('dcs').delete().eq('id', dcId);
  if(error){
    alert('Gagal hapus DC: ' + error.message);
    return;
  }

  await loadDcs();
  renderManageDcGrid();
}

// -------- Kelola Data: Pilih Zona --------
async function openManageZona(dcId){
  state.currentDc = state.dcs.find(d => d.id === dcId);
  if(!state.currentDc) return;

  el('manageZonaDcName').innerHTML = `<div class="mark"><i class="ti ${state.currentDc.icon || 'ti-box'}"></i></div>${state.currentDc.nama} · ${state.currentDc.sub || ''}`;
  el('userChip7').innerHTML = el('userChip9').innerHTML;

  hide('manageDcScreen');
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
    <div class="zona-card">
      <button class="zona-card-main" data-manage-zona="${z.id}">
        <span class="zona-name">${z.nama}</span>
        <span class="zona-meta">
          <span><i class="ti ti-calendar"></i> ${formatTanggal(z.created_at)}</span>
        </span>
      </button>
      <div class="zona-card-actions">
        <button class="btn-icon" data-edit-zona="${z.id}" title="Edit zona"><i class="ti ti-edit"></i></button>
        <button class="btn-icon danger" data-delete-zona="${z.id}" title="Hapus zona"><i class="ti ti-trash"></i></button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-manage-zona]').forEach(tile => {
    tile.onclick = () => openManageProduk(tile.getAttribute('data-manage-zona'));
  });
  document.querySelectorAll('[data-edit-zona]').forEach(btn => {
    btn.onclick = () => {
      const z = state.zonesList.find(x => x.id === btn.getAttribute('data-edit-zona'));
      if(z) openZoneModal('edit', z);
    };
  });
  document.querySelectorAll('[data-delete-zona]').forEach(btn => {
    btn.onclick = () => deleteZona(btn.getAttribute('data-delete-zona'));
  });
}

el('backFromManageZonaBtn').onclick = () => {
  hide('manageZonaScreen');
  show('manageDcScreen');
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
  el('userChip8').innerHTML = el('userChip9').innerHTML;
  el('manageSearchInput').value = '';

  hide('manageZonaScreen');
  show('manageProdukScreen');

  await loadProdukForZona(zonaId);
  renderManageSectorFilterOptions();
  renderSectorManageList();
  renderManageProdukList();
}

function renderManageSectorFilterOptions(){
  const sel = el('manageSectorFilterSelect');
  sel.innerHTML = '<option value="">Semua Sector</option>' +
    state.sectorsList.map(s => `<option value="${s.id}">${s.nama}</option>`).join('');
  sel.value = state.sectorFilter || '';
}

// List chip Sector di zona ini, tiap chip ada tombol edit & delete.
function renderSectorManageList(){
  if(!state.sectorsList.length){
    el('sectorManageList').innerHTML = '';
    return;
  }
  el('sectorManageList').innerHTML = state.sectorsList.map(s => `
    <div class="sector-chip">
      <span>${s.nama}</span>
      <button class="btn-icon-xs" data-edit-sector="${s.id}" title="Edit sector"><i class="ti ti-edit"></i></button>
      <button class="btn-icon-xs danger" data-delete-sector="${s.id}" title="Hapus sector"><i class="ti ti-trash"></i></button>
    </div>
  `).join('');

  document.querySelectorAll('[data-edit-sector]').forEach(btn => {
    btn.onclick = () => {
      const s = state.sectorsList.find(x => x.id === btn.getAttribute('data-edit-sector'));
      if(s) openSectorModal('edit', s);
    };
  });
  document.querySelectorAll('[data-delete-sector]').forEach(btn => {
    btn.onclick = () => deleteSector(btn.getAttribute('data-delete-sector'));
  });
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
      <div class="produk-manage-actions">
        <button class="btn-icon" data-edit-produk="${p.id}" title="Edit"><i class="ti ti-edit"></i></button>
        <button class="btn-icon danger" data-delete-produk="${p.id}" title="Hapus dari sector ini"><i class="ti ti-trash"></i></button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-edit-produk]').forEach(btn => {
    btn.onclick = () => {
      const item = state.produkList.find(p => String(p.id) === btn.getAttribute('data-edit-produk'));
      if(item) openProdukModal('edit', item);
    };
  });
  document.querySelectorAll('[data-delete-produk]').forEach(btn => {
    btn.onclick = () => {
      const item = state.produkList.find(p => String(p.id) === btn.getAttribute('data-delete-produk'));
      if(item) deleteProdukSector(item.id, item.nama);
    };
  });
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
// MODAL: ZONA BARU / EDIT ZONA
// =========================================================
function openZoneModal(mode, zona){
  state.zoneModalMode = mode;
  state.zoneModalEditingId = zona ? zona.id : null;

  el('zoneModalTitle').textContent = mode === 'create' ? 'Zona Baru' : 'Edit Zona';
  el('zoneModalId').disabled = mode === 'edit'; // id itu primary key, dikunci pas edit
  el('zoneModalId').value = mode === 'edit' ? zona.id : '';
  el('zoneModalNama').value = mode === 'edit' ? zona.nama : '';
  el('zoneModalSave').disabled = false;
  el('zoneModalSave').textContent = 'Simpan';

  show('zoneModal');
  el(mode === 'edit' ? 'zoneModalNama' : 'zoneModalId').focus();
}

el('addZonaBtn').onclick = () => openZoneModal('create');

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

  const isEdit = state.zoneModalMode === 'edit';
  const { error } = isEdit
    ? await sb.from('zones').update({ nama }).eq('id', state.zoneModalEditingId)
    : await sb.from('zones').insert({ id, nama, dc_id: state.currentDc.id });

  if(error){
    alert(`Gagal ${isEdit ? 'simpan perubahan' : 'bikin'} zona: ` + error.message);
    el('zoneModalSave').disabled = false;
    el('zoneModalSave').textContent = 'Simpan';
    return;
  }

  await loadZones(state.currentDc.id);
  renderManageZonaGrid();
  closeZoneModal();
};

// Hapus zona -- kalau masih ada sector/produk_sectors di dalemnya, itu ikut
// kehapus (ON DELETE CASCADE). Kalau ada opname_entries yang udah pernah
// nyantol ke sector di zona ini, Supabase bakal nolak (FK constraint) --
// itu emang sengaja, biar data hasil scan yang udah ada gak ke-hapus diem2.
async function deleteZona(zonaId){
  const zona = state.zonesList.find(z => z.id === zonaId);
  if(!zona) return;

  const confirmed = confirm(
    `Hapus Zona "${zona.nama}"? Semua Sector & assignment produk di dalem zona ini bakal ikut kehapus.\n\nKalau zona ini udah pernah dipake buat scan (ada di opname_entries), penghapusan bakal ditolak otomatis biar data histori gak ilang.`
  );
  if(!confirmed) return;

  const { error } = await sb.from('zones').delete().eq('id', zonaId);
  if(error){
    alert('Gagal hapus zona: ' + error.message);
    return;
  }

  await loadZones(state.currentDc.id);
  renderManageZonaGrid();
}

// =========================================================
// MODAL: SECTOR BARU / EDIT SECTOR
// =========================================================
function openSectorModal(mode, sector){
  state.sectorModalMode = mode;
  state.sectorModalEditingId = sector ? sector.id : null;

  el('sectorModalTitle').textContent = mode === 'create' ? 'Sector Baru' : 'Edit Sector';
  el('sectorModalZonaInfo').textContent = mode === 'create'
    ? `Sector ini bakal dibikin di dalem Zona: ${state.currentZona}`
    : `Sector ini ada di dalem Zona: ${state.currentZona}`;
  el('sectorModalId').disabled = mode === 'edit'; // id itu primary key, dikunci pas edit
  el('sectorModalId').value = mode === 'edit' ? sector.id : '';
  el('sectorModalNama').value = mode === 'edit' ? sector.nama : '';
  el('sectorModalSave').disabled = false;
  el('sectorModalSave').textContent = 'Simpan';

  show('sectorModal');
  el(mode === 'edit' ? 'sectorModalNama' : 'sectorModalId').focus();
}

el('addSectorBtn').onclick = () => {
  if(!state.currentZonaId){ alert('Pilih zona dulu.'); return; }
  openSectorModal('create');
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

  const isEdit = state.sectorModalMode === 'edit';
  const { error } = isEdit
    ? await sb.from('sectors').update({ nama }).eq('id', state.sectorModalEditingId)
    : await sb.from('sectors').insert({ id, nama, zone_id: state.currentZonaId });

  if(error){
    alert(`Gagal ${isEdit ? 'simpan perubahan' : 'bikin'} sector: ` + error.message);
    el('sectorModalSave').disabled = false;
    el('sectorModalSave').textContent = 'Simpan';
    return;
  }

  await loadProdukForZona(state.currentZonaId);
  renderManageSectorFilterOptions();
  renderSectorManageList();
  renderManageProdukList();
  closeSectorModal();
};

// Hapus sector -- assignment produk di sector ini (produk_sectors) ikut
// kehapus (CASCADE). Kalau sector ini udah pernah dipake buat scan (ada
// row-nya di opname_entries), Supabase bakal nolak otomatis (FK constraint)
// biar data histori gak ilang.
async function deleteSector(sectorId){
  const sector = state.sectorsList.find(s => s.id === sectorId);
  if(!sector) return;

  const confirmed = confirm(
    `Hapus Sector "${sector.nama}"? Semua assignment produk di sector ini bakal ikut kehapus.\n\nKalau sector ini udah pernah dipake buat scan, penghapusan bakal ditolak otomatis biar data histori gak ilang.`
  );
  if(!confirmed) return;

  const { error } = await sb.from('sectors').delete().eq('id', sectorId);
  if(error){
    alert('Gagal hapus sector: ' + error.message);
    return;
  }

  if(state.sectorFilter === sectorId) state.sectorFilter = '';
  await loadProdukForZona(state.currentZonaId);
  renderManageSectorFilterOptions();
  renderSectorManageList();
  renderManageProdukList();
}

// =========================================================
// MODAL: PRODUK BARU / EDIT PRODUK
// mode create: bikin/assign produk (baru atau existing) ke sector
// mode edit: update detail master_produk + boleh pindah sector assignment-nya
// =========================================================
function openProdukModal(mode, item){
  state.produkModalMode = mode;
  state.produkModalEditingPsId = item ? item.id : null;

  el('produkModalTitle').textContent = mode === 'create' ? 'Produk Baru' : 'Edit Produk';
  el('produkModalDesc').textContent = mode === 'create'
    ? 'Bikin produk baru (atau assign produk yang udah ada) ke sebuah sector.'
    : 'Update detail produk, atau pindahin ke sector laen.';
  el('produkModalBarcode').disabled = mode === 'edit'; // barcode itu primary key master_produk, dikunci pas edit

  el('produkModalBarcode').value = mode === 'edit' ? item.barcode : '';
  el('produkModalNama').value = mode === 'edit' ? item.nama : '';
  el('produkModalKode').value = mode === 'edit' ? (item.kode_produk || '') : '';
  el('produkModalKategori').value = mode === 'edit' ? (item.kategori || '') : '';
  el('produkModalSubKategori').value = mode === 'edit' ? (item.sub_kategori || '') : '';
  el('produkModalSatuan').value = mode === 'edit' ? (item.satuan || '') : '';

  el('produkModalSector').innerHTML = state.sectorsList
    .map(s => `<option value="${s.id}">${s.nama}</option>`).join('');
  el('produkModalSector').value = mode === 'edit' ? item.sector_id : (state.sectorFilter || state.sectorsList[0].id);

  el('produkModalSave').disabled = false;
  el('produkModalSave').textContent = 'Simpan';
  show('produkModal');
  el(mode === 'edit' ? 'produkModalNama' : 'produkModalBarcode').focus();
}

el('addProdukBtn').onclick = () => {
  if(!state.sectorsList.length){
    alert('Belum ada sector yang bisa dipilih. Bikin sector dulu.');
    return;
  }
  openProdukModal('create');
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
  const isEdit = state.produkModalMode === 'edit';

  if(!barcode){ alert('Barcode wajib diisi.'); return; }
  if(!sectorId){ alert('Pilih sector dulu.'); return; }
  if(!nama){ alert('Nama produk wajib diisi.'); return; }

  el('produkModalSave').disabled = true;
  el('produkModalSave').textContent = 'Menyimpan...';

  try {
    if(isEdit){
      // Update detail produk di master_produk (barcode-nya sendiri dikunci/gak berubah)
      const { error: updateErr } = await sb.from('master_produk').update({
        nama,
        kode_produk: kode_produk || null,
        kategori: kategori || null,
        sub_kategori: sub_kategori || null,
        satuan: satuan || null,
      }).eq('barcode', barcode);
      if(updateErr) throw updateErr;

      // Kalau sector-nya diganti, geser assignment produk_sectors row ini
      // (pake id row-nya sendiri, biar gak ketuker sama assignment laen)
      const { error: moveErr } = await sb.from('produk_sectors')
        .update({ sector_id: sectorId }).eq('id', state.produkModalEditingPsId);
      if(moveErr) throw moveErr;
    } else {
      // Cek dulu barcode ini udah ada di master_produk apa belum
      const { data: existing, error: findErr } = await sb
        .from('master_produk').select('barcode').eq('barcode', barcode).maybeSingle();
      if(findErr) throw findErr;

      if(!existing){
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
    }

    await loadProdukForZona(state.currentZonaId);
    renderManageSectorFilterOptions();
    renderSectorManageList();
    renderManageProdukList();
    closeProdukModal();
  } catch(err){
    alert('Gagal simpan produk: ' + (err.message || err));
  } finally {
    el('produkModalSave').disabled = false;
    el('produkModalSave').textContent = 'Simpan';
  }
};

// Hapus assignment produk dari sector ini doang -- master_produk-nya sendiri
// (dan assignment di sector laen kalau ada) TETEP UTUH, gak ikut kehapus.
async function deleteProdukSector(psId, namaProduk){
  const confirmed = confirm(`Hapus "${namaProduk}" dari sector ini? (data produk & assignment di sector laen gak kepengaruh)`);
  if(!confirmed) return;

  const { error } = await sb.from('produk_sectors').delete().eq('id', psId);
  if(error){
    alert('Gagal hapus: ' + error.message);
    return;
  }

  await loadProdukForZona(state.currentZonaId);
  renderManageSectorFilterOptions();
  renderSectorManageList();
  renderManageProdukList();
}
