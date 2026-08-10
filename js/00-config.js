// =========================================================
// KONFIGURASI
// =========================================================
const SUPABASE_URL = "https://qoonjeimsrzztlfyembp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvb25qZWltc3J6enRsZnllbWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNTg2MTgsImV4cCI6MjA5OTczNDYxOH0.vgqaUJbDOu0hN7gp3f9SozHsDymZR-0TKTijl8q_2ZI";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, storage: window.sessionStorage }
});

// MODE TESTING: true = skip login, langsung masuk sebagai admin dummy.
// Wajib diinjek migration-unlock-temp.sql biar data kebaca.
// Balikin ke false lagi (+ jalanin migration-relock-rls.sql) kalau udah siap production.
const SKIP_LOGIN = false;

let state = {
  session: null,
  profile: null,
  dcs: [],
  currentDc: null,
  produkList: [],
  sessions: [],
  zonesList: [],
  sectorsList: [],
  sectorFilter: '',
  viewAllDc: false, // false = lihat per Zona, true = lihat semua item se-DC
  currentZonaId: null,
  profilesById: {},
  activeSessionId: null,
  entries: {},
  searchQuery: '',
  realtimeChannel: null,
  mySessionToken: null,
  currentZona: null,
  sessionCheckChannel: null,
  sessionModalMode: null,
  sessionModalEditingId: null,
  deletingSessionId: null,
  reviewSessionId: null,
  reviewRows: [],
  exportingSession: null,
};

function formatTanggal(t){
  if(!t) return '-';
  const d = new Date(t.length <= 10 ? t + 'T00:00:00' : t);
  if(isNaN(d.getTime())) return t;
  return d.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });
}

const el = id => document.getElementById(id);
const show = id => el(id).classList.remove('hidden');
const hide = id => el(id).classList.add('hidden');

