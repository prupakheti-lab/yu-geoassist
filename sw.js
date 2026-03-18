<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GeoAssist — Boring Log Co-Pilot</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect rx='20' width='100' height='100' fill='%231E3A5F'/><text x='50' y='68' text-anchor='middle' font-size='50' fill='white' font-family='sans-serif' font-weight='bold'>G</text></svg>">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#1E3A5F">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="GeoAssist">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#F7F6F3;--bg-card:#FFFFFF;--bg-input:#FAFAF8;--bg-accent:#F0EDE6;
  --tx:#1A1A18;--tx2:#5C5B56;--tx3:#8A8983;
  --border:#E2E0D8;--border2:#D0CEC5;
  --blue:#2563EB;--blue-bg:#EFF6FF;--blue-tx:#1E40AF;
  --amber:#D97706;--amber-bg:#FFFBEB;--amber-tx:#92400E;
  --green:#059669;--green-bg:#ECFDF5;--green-tx:#065F46;
  --red:#DC2626;--red-bg:#FEF2F2;--red-tx:#991B1B;
  --teal:#0D9488;--teal-bg:#F0FDFA;--teal-tx:#115E59;
  --purple:#7C3AED;--purple-bg:#F5F3FF;--purple-tx:#5B21B6;
  --navy:#1E3A5F;
  --radius:10px;--radius-lg:14px;
  --font:'DM Sans',system-ui,sans-serif;
  --mono:'JetBrains Mono',monospace;
}
html{font-size:15px;-webkit-text-size-adjust:100%}
body{font-family:var(--font);background:var(--bg);color:var(--tx);min-height:100vh;line-height:1.5;display:flex}

/* ===== SIDEBAR ===== */
.sidebar{width:260px;background:var(--bg-card);border-right:1px solid var(--border);display:flex;flex-direction:column;height:100vh;position:sticky;top:0;flex-shrink:0;transition:margin-left .25s}
.sidebar.collapsed{margin-left:-260px}
.sidebar-header{padding:16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.sidebar-logo{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--navy),var(--blue));display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sidebar-logo svg{width:16px;height:16px}
.sidebar-brand{font-size:1rem;font-weight:600;letter-spacing:-.02em}
.sidebar-sub{font-size:.68rem;color:var(--tx3)}
.sidebar-actions{padding:12px 16px;display:flex;flex-direction:column;gap:6px}
.sidebar-section{padding:8px 16px 4px;font-size:.62rem;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.8px}
.boring-list{flex:1;overflow-y:auto;padding:4px 8px;scrollbar-width:thin}
.boring-item{padding:10px 12px;border-radius:8px;cursor:pointer;transition:background .15s;display:flex;flex-direction:column;gap:2px;position:relative}
.boring-item:hover{background:var(--bg-accent)}
.boring-item.active{background:var(--blue-bg);border:1px solid rgba(37,99,235,.15)}
.boring-item-id{font-size:.82rem;font-weight:600;font-family:var(--mono)}
.boring-item-meta{font-size:.66rem;color:var(--tx3)}
.boring-item-samples{font-size:.62rem;color:var(--tx3);font-family:var(--mono)}
.boring-item .delete-btn{position:absolute;top:8px;right:8px;width:20px;height:20px;border:none;background:none;color:var(--tx3);cursor:pointer;border-radius:4px;display:none;align-items:center;justify-content:center;font-size:.8rem}
.boring-item:hover .delete-btn{display:flex}
.boring-item .delete-btn:hover{background:var(--red-bg);color:var(--red)}

.sidebar-footer{padding:12px 16px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:6px}
.save-status{font-size:.62rem;color:var(--green-tx);display:flex;align-items:center;gap:4px}
.save-dot{width:6px;height:6px;border-radius:50%;background:var(--green)}

/* ===== MAIN AREA ===== */
.main-area{flex:1;min-width:0;display:flex;flex-direction:column}
.topbar{padding:10px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;background:var(--bg-card);position:sticky;top:0;z-index:10}
.toggle-sidebar{width:32px;height:32px;border:1px solid var(--border);border-radius:8px;background:var(--bg-input);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--tx2);flex-shrink:0}
.toggle-sidebar:hover{background:var(--bg-accent)}
.topbar-title{font-size:.9rem;font-weight:600}
.topbar-boring{font-size:.75rem;color:var(--tx3);font-family:var(--mono)}
.topbar-actions{margin-left:auto;display:flex;gap:6px}

.content{flex:1;overflow-y:auto;padding:16px 20px 80px;max-width:1100px;width:100%}

/* Reuse all existing form/panel styles from V3 */
.section{margin-top:12px}
.section-title{font-size:.7rem;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none}
.section-title::after{content:'';flex:1;height:1px;background:var(--border)}
.section-title .arrow{font-size:.55rem;transition:transform .2s}
.section-title .arrow.open{transform:rotate(90deg)}
.section-body{overflow:hidden;transition:max-height .3s ease}
.section-body.collapsed{max-height:0!important;padding-top:0;padding-bottom:0}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.grid-4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px}
.grid-5{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:8px}
.grid-6{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
@media(max-width:800px){.grid-5,.grid-6{grid-template-columns:1fr 1fr 1fr}.grid-4{grid-template-columns:1fr 1fr}.sidebar{position:fixed;z-index:100;height:100vh}}
.field-group label{display:block;font-size:.62rem;font-weight:500;color:var(--tx3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px}
.field-group input,.field-group select{width:100%;height:34px;border:1px solid var(--border);border-radius:7px;padding:0 9px;font-family:var(--font);font-size:.8rem;background:var(--bg-input);color:var(--tx);transition:border-color .15s}
.field-group input:focus,.field-group select:focus{outline:none;border-color:var(--blue)}
.field-group input[type="number"]{font-family:var(--mono);font-size:.78rem}

.main-grid{display:grid;grid-template-columns:370px minmax(0,1fr);gap:14px;margin-top:14px}
@media(max-width:860px){.main-grid{grid-template-columns:1fr}}
.panel{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden}
.panel-header{padding:11px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.panel-header h3{font-size:.85rem;font-weight:600}
.panel-header .count{font-size:.66rem;color:var(--tx3);background:var(--bg-accent);padding:2px 7px;border-radius:10px;margin-left:auto}
.entry-form{padding:12px 14px;display:flex;flex-direction:column;gap:10px;min-width:0;overflow:hidden}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.form-field{display:flex;flex-direction:column;gap:3px;min-width:0}
.form-field label{font-size:.62rem;font-weight:500;color:var(--tx3);text-transform:uppercase;letter-spacing:.3px}
.form-field input,.form-field select,.form-field textarea{border:1px solid var(--border);border-radius:7px;padding:6px 9px;font-family:var(--font);font-size:.8rem;background:var(--bg-input);color:var(--tx);min-width:0}
.form-field input:focus,.form-field select:focus,.form-field textarea:focus{outline:none;border-color:var(--blue)}
.form-field textarea{resize:vertical;min-height:52px;line-height:1.4}
.form-field input[type="number"]{font-family:var(--mono);font-size:.78rem}

.blow-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;min-width:0}
.blow-grid .form-field{min-width:0}
.blow-grid .form-field label{font-size:.56rem;text-align:center}
.blow-grid input{text-align:center;padding:6px 2px;min-width:0;-moz-appearance:textfield;appearance:textfield}
.blow-grid input::-webkit-outer-spin-button,.blow-grid input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}

.btn{height:38px;border:none;border-radius:8px;font-family:var(--font);font-size:.8rem;font-weight:500;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px;padding:0 14px}
.btn-primary{background:var(--blue);color:#fff}
.btn-primary:hover{background:#1D4ED8}
.btn-primary:active{transform:scale(.98)}
.btn-secondary{background:var(--bg-accent);color:var(--tx2);border:1px solid var(--border)}
.btn-secondary:hover{background:var(--border)}
.btn-export{background:var(--navy);color:#fff}
.btn-export:hover{background:#162D4A}
.btn-sm{height:32px;font-size:.74rem;padding:0 10px}
.btn-xs{height:28px;font-size:.68rem;padding:0 8px;border-radius:6px}
.btn-full{width:100%}
.btn-icon{width:32px;padding:0}

.ai-card{margin:0 14px 12px;padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg-input);position:relative;overflow:hidden}
.ai-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:var(--blue)}
.ai-tag{display:inline-flex;font-size:.6rem;font-weight:600;color:var(--blue-tx);background:var(--blue-bg);padding:2px 7px;border-radius:5px;margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px}
.ai-uscs{font-size:1.1rem;font-weight:600;font-family:var(--mono)}
.ai-desc{font-size:.74rem;color:var(--tx2)}
.ai-confidence{display:flex;align-items:center;gap:5px;margin-top:3px}
.ai-conf-bar{flex:1;height:3px;background:var(--bg-accent);border-radius:2px;overflow:hidden}
.ai-conf-fill{height:100%;border-radius:2px;transition:width .4s ease}
.ai-conf-pct{font-size:.66rem;font-weight:500;font-family:var(--mono)}

.right-panel{display:flex;flex-direction:column;gap:12px}
.metrics-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
@media(max-width:900px){.metrics-row{grid-template-columns:repeat(2,minmax(0,1fr))}}
.metric{background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:10px 12px}
.metric-label{font-size:.6rem;font-weight:500;color:var(--tx3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px}
.metric-value{font-size:1.2rem;font-weight:600;font-family:var(--mono)}
.metric-unit{font-size:.65rem;font-weight:400;color:var(--tx2);margin-left:2px}
.metric-sub{font-size:.62rem;color:var(--tx3);margin-top:1px}

table.log{width:100%;border-collapse:collapse;font-size:.74rem}
table.log th{background:var(--bg-accent);color:var(--tx2);font-weight:500;font-size:.6rem;text-transform:uppercase;letter-spacing:.3px;padding:7px 8px;text-align:left;border-bottom:1px solid var(--border);white-space:nowrap}
table.log td{padding:7px 8px;border-bottom:1px solid var(--border);vertical-align:middle}
table.log tr:hover td{background:var(--bg-input)}
table.log .mono{font-family:var(--mono);font-size:.72rem}
.uscs-badge{display:inline-block;padding:2px 6px;border-radius:4px;font-size:.66rem;font-weight:600;font-family:var(--mono)}
.soil-coarse{background:var(--amber-bg);color:var(--amber-tx)}
.soil-fine{background:var(--teal-bg);color:var(--teal-tx)}
.soil-rock{background:var(--bg-accent);color:var(--tx2)}
.soil-organic{background:var(--green-bg);color:var(--green-tx)}
.soil-fill{background:var(--purple-bg);color:var(--purple-tx)}

.param-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:12px 14px}
.param-item{background:var(--bg-input);border-radius:6px;padding:8px 10px}
.param-item .param-name{font-size:.6rem;color:var(--tx3);text-transform:uppercase;letter-spacing:.3px;margin-bottom:2px}
.param-item .param-val{font-family:var(--mono);font-size:.88rem;font-weight:500}
.param-item .param-method{font-size:.58rem;color:var(--tx3);margin-top:1px}

.alerts{display:flex;flex-direction:column;gap:5px;padding:10px 14px}
.alert{padding:8px 10px;border-radius:6px;font-size:.74rem;line-height:1.4}
.alert-warn{background:var(--amber-bg);color:var(--amber-tx)}
.alert-info{background:var(--blue-bg);color:var(--blue-tx)}
.alert-danger{background:var(--red-bg);color:var(--red-tx)}

.empty-state{padding:28px 16px;text-align:center;color:var(--tx3);font-size:.8rem}
.scroll-panel{max-height:calc(100vh - 160px);overflow-y:auto;scrollbar-width:thin}

@keyframes slideIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.animate-in{animation:slideIn .2s ease}
.ai-card.show{animation:fadeScale .2s ease}
@keyframes fadeScale{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}

.depth-bar{display:flex;align-items:center;gap:5px;margin-bottom:2px;padding:2px 4px;border-radius:4px}
.depth-bar:hover{background:var(--bg-accent)}
.depth-label{font-size:.64rem;font-family:var(--mono);color:var(--tx2);width:34px;text-align:right;flex-shrink:0}
.depth-fill{height:14px;border-radius:3px;transition:width .4s ease;min-width:3px}
.depth-n{font-size:.64rem;font-family:var(--mono);color:var(--tx2);flex-shrink:0;min-width:22px}
.gwl-tag{display:inline-flex;font-size:.58rem;color:var(--blue-tx);background:var(--blue-bg);padding:1px 5px;border-radius:4px;margin-left:3px}

/* Toast notification */
.toast{position:fixed;bottom:20px;right:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:12px 18px;font-size:.8rem;box-shadow:0 4px 16px rgba(0,0,0,.1);z-index:999;opacity:0;transform:translateY(10px);transition:all .3s;pointer-events:none}
.toast.show{opacity:1;transform:translateY(0)}
.toast-success{border-left:3px solid var(--green)}
.toast-info{border-left:3px solid var(--blue)}

/* File input hidden */
.hidden-input{display:none}
</style>
</head>
<body>

<!-- SIDEBAR -->
<aside class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <div class="sidebar-logo"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M12 2l-4 6M12 2l4 6"/><path d="M6 14h12M8 18h8"/></svg></div>
    <div><div class="sidebar-brand">GeoAssist</div><div class="sidebar-sub">Boring Log Co-Pilot</div></div>
  </div>
  <div class="sidebar-actions">
    <button class="btn btn-primary btn-sm btn-full" onclick="createNewBoring()">+ New boring</button>
    <div style="display:flex;gap:5px">
      <button class="btn btn-secondary btn-xs" style="flex:1" onclick="exportProjectJSON()">Export project</button>
      <button class="btn btn-secondary btn-xs" style="flex:1" onclick="document.getElementById('importFile').click()">Import</button>
      <input type="file" id="importFile" class="hidden-input" accept=".json" onchange="importJSON(event)">
    </div>
  </div>
  <div class="sidebar-section">Borings</div>
  <div class="boring-list" id="boringList"></div>
  <div class="sidebar-footer">
    <div class="save-status" id="saveStatus"><span class="save-dot"></span>Auto-saved</div>
    <div style="font-size:.58rem;color:var(--tx3)" id="storageInfo"></div>
  </div>
</aside>

<!-- MAIN -->
<div class="main-area">
  <div class="topbar">
    <button class="toggle-sidebar" onclick="toggleSidebar()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>
    <div>
      <div class="topbar-title" id="topbarTitle">No boring selected</div>
      <div class="topbar-boring" id="topbarMeta"></div>
    </div>
    <div class="topbar-actions">
      <button class="btn btn-secondary btn-sm" onclick="exportBoringJSON()">Save JSON</button>
      <button class="btn btn-export btn-sm" onclick="exportPDF()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/></svg>PDF</button>
    </div>
  </div>

  <div class="content" id="mainContent">
    <!-- Populated by JS -->
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
// ============ STATE MANAGEMENT ============
const STORAGE_KEY = 'geoassist_project';
let project = { borings: [], activeBoringId: null };
let activeBoring = null;
let autoSaveTimer = null;

function generateId() { return 'b_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5); }

function saveProject() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      const status = document.getElementById('saveStatus');
      if (status) { status.innerHTML = '<span class="save-dot"></span>Auto-saved ' + new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }
      updateStorageInfo();
    } catch(e) {
      console.error('Save failed:', e);
      showToast('Save failed - storage may be full', 'info');
    }
  }, 300);
}

function loadProject() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      project = JSON.parse(data);
      if (!project.borings) project.borings = [];
    }
  } catch(e) { console.error('Load failed:', e); project = { borings: [], activeBoringId: null }; }
}

function updateStorageInfo() {
  const el = document.getElementById('storageInfo');
  if (!el) return;
  const bytes = new Blob([localStorage.getItem(STORAGE_KEY) || '']).size;
  const kb = (bytes / 1024).toFixed(1);
  el.textContent = project.borings.length + ' boring' + (project.borings.length !== 1 ? 's' : '') + ' | ' + kb + ' KB stored';
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.className = 'toast toast-' + type + ' show';
  t.textContent = msg;
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ============ BORING MANAGEMENT ============
function createNewBoring() {
  const id = generateId();
  const num = project.borings.length + 1;
  const boring = {
    id, info: {
      boringId: 'B-' + (100 + num), projName: '', projNo: '', location: '', client: '', contractor: '',
      groundElev: '', datum: 'NAVD88', startDate: new Date().toISOString().split('T')[0], startTime: '07:00',
      finishDate: new Date().toISOString().split('T')[0], finishTime: '15:00',
      drillMethod: 'Mud Rotary', rigType: '', driller: '', inspector: '',
      gwlDepth: '', backfill: 'Bentonite grout',
      casingType: 'HW', casingID: '3.0"', casingOD: '3.5"',
      hammerType: 'auto', hammerWt: '140', hammerFall: '30',
      ssID: '1.375"', ssOD: '2.0"', samplerLiner: 'without', drillRod: 'AW'
    },
    samples: [], sampleCounter: 0
  };
  // Copy project info from previous boring if exists
  if (project.borings.length > 0) {
    const prev = project.borings[project.borings.length - 1].info;
    ['projName','projNo','location','client','contractor','drillMethod','rigType','driller','inspector','datum','backfill','casingType','casingID','casingOD','hammerType','hammerWt','hammerFall','ssID','ssOD','samplerLiner','drillRod'].forEach(k => {
      if (prev[k]) boring.info[k] = prev[k];
    });
  }
  project.borings.push(boring);
  project.activeBoringId = id;
  saveProject();
  renderBoringList();
  switchToBoring(id);
  showToast('New boring ' + boring.info.boringId + ' created');
}

function deleteBoring(id) {
  const b = project.borings.find(b => b.id === id);
  if (!b) return;
  if (!confirm('Delete boring ' + b.info.boringId + '? This cannot be undone.')) return;
  project.borings = project.borings.filter(b => b.id !== id);
  if (project.activeBoringId === id) {
    project.activeBoringId = project.borings.length ? project.borings[0].id : null;
  }
  saveProject();
  renderBoringList();
  if (project.activeBoringId) switchToBoring(project.activeBoringId);
  else renderEmptyState();
}

function switchToBoring(id) {
  project.activeBoringId = id;
  activeBoring = project.borings.find(b => b.id === id);
  if (!activeBoring) return;
  saveProject();
  renderBoringList();
  renderBoringEditor();
}

// ============ SIDEBAR RENDERING ============
function renderBoringList() {
  const list = document.getElementById('boringList');
  if (!project.borings.length) {
    list.innerHTML = '<div class="empty-state" style="padding:20px 10px;font-size:.76rem">No borings yet.<br>Click "New boring" to start.</div>';
    return;
  }
  list.innerHTML = project.borings.map(b => {
    const active = b.id === project.activeBoringId;
    const depth = b.samples.length ? b.samples[b.samples.length - 1].depthTo.toFixed(1) + ' ft' : '0 ft';
    return '<div class="boring-item' + (active ? ' active' : '') + '" onclick="switchToBoring(\'' + b.id + '\')">' +
      '<div class="boring-item-id">' + b.info.boringId + '</div>' +
      '<div class="boring-item-meta">' + (b.info.projName || 'No project') + '</div>' +
      '<div class="boring-item-samples">' + b.samples.length + ' samples | ' + depth + '</div>' +
      '<button class="delete-btn" onclick="event.stopPropagation();deleteBoring(\'' + b.id + '\')" title="Delete">&times;</button>' +
      '</div>';
  }).join('');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// ============ USCS / SPT / PARAMS / ALERTS — same as V3 ============
const USCS_RULES=[
  {m:/\bwell.?graded\s+gravel/i,u:'GW',d:'Well-graded gravel',g:'coarse'},{m:/\bpoorly.?graded\s+gravel/i,u:'GP',d:'Poorly-graded gravel',g:'coarse'},
  {m:/\bsilty\s+gravel/i,u:'GM',d:'Silty gravel',g:'coarse'},{m:/\bgravel.{0,30}silt/i,u:'GM',d:'Silty gravel',g:'coarse'},
  {m:/\bclayey\s+gravel/i,u:'GC',d:'Clayey gravel',g:'coarse'},{m:/\bgravel/i,u:'GP',d:'Gravel',g:'coarse'},
  {m:/\bwell.?graded\s+sand/i,u:'SW',d:'Well-graded sand',g:'coarse'},{m:/\bpoorly.?graded\s+sand/i,u:'SP',d:'Poorly-graded sand',g:'coarse'},
  {m:/\bsilty\s+(fine\s+)?(to\s+\w+\s+)?sand/i,u:'SM',d:'Silty sand',g:'coarse'},
  {m:/\bsand.{0,40}(some|little|trace)?\s*silt/i,u:'SP-SM',d:'Sand with silt',g:'coarse'},
  {m:/\bsand.{0,30}silt/i,u:'SM',d:'Silty sand',g:'coarse'},{m:/\bclayey\s+sand/i,u:'SC',d:'Clayey sand',g:'coarse'},
  {m:/\bsand.{0,30}clay/i,u:'SC',d:'Clayey sand',g:'coarse'},{m:/\bsand\b/i,u:'SP',d:'Sand',g:'coarse'},
  {m:/\b(elastic|fat)\s+silt/i,u:'MH',d:'Elastic silt',g:'fine'},{m:/\bsandy\s+silt/i,u:'ML',d:'Sandy silt',g:'fine'},
  {m:/\bsilt.{0,30}(sand|sandy)/i,u:'ML',d:'Sandy silt',g:'fine'},{m:/\bsilt\b/i,u:'ML',d:'Silt',g:'fine'},
  {m:/\b(fat|high\s*plasticity)\s+clay/i,u:'CH',d:'Fat clay',g:'fine'},{m:/\b(lean|low\s*plasticity)\s+clay/i,u:'CL',d:'Lean clay',g:'fine'},
  {m:/\bsilty\s+clay/i,u:'CL-ML',d:'Silty clay',g:'fine'},{m:/\bsandy\s+clay/i,u:'CL',d:'Sandy clay',g:'fine'},
  {m:/\bstiff.{0,20}clay/i,u:'CL',d:'Stiff clay',g:'fine'},{m:/\bsoft.{0,15}clay/i,u:'CH',d:'Soft clay',g:'fine'},
  {m:/\bclay\b/i,u:'CL',d:'Clay',g:'fine'},{m:/\bpeat\b/i,u:'PT',d:'Peat',g:'organic'},
  {m:/\borganic/i,u:'OL',d:'Organic soil',g:'organic'},{m:/\bmuck/i,u:'PT',d:'Muck',g:'organic'},
  {m:/\b(bedrock|rock|shale|sandstone|siltstone|limestone|granite|gneiss|basalt|diabase|schist)\b/i,u:'ROCK',d:'Rock',g:'rock'},
  {m:/\bfill\b/i,u:'FILL',d:'Fill',g:'fill'},{m:/\b(topsoil|loam)\b/i,u:'ML',d:'Topsoil',g:'fine'},
];
function classifyUSCS(d){if(!d||d.trim().length<3)return{uscs:'--',desc:'',confidence:0,group:'unknown'};for(const r of USCS_RULES){if(r.m.test(d)){let c=0.7;if(d.length>40)c+=0.1;if(/\b(trace|some|little|with|and)\b/i.test(d))c+=0.05;if(/\b(dense|loose|stiff|soft|hard|medium|fine|coarse)\b/i.test(d))c+=0.08;if(/\b(moist|wet|dry|saturated)\b/i.test(d))c+=0.03;return{uscs:r.u,desc:r.d,confidence:Math.min(c,.98),group:r.g};}}return{uscs:'??',desc:'Unclassified',confidence:0.1,group:'unknown'};}

function getCE(){if(!activeBoring)return 1;const v=activeBoring.info.hammerType;return v==='auto'?1.0:v==='safety'?0.75:0.60;}
function getCS(){if(!activeBoring)return 1.2;return activeBoring.info.samplerLiner==='with'?1.0:1.2;}
function getGWL(){if(!activeBoring)return null;const v=activeBoring.info.gwlDepth;return v!==''&&v!==undefined?parseFloat(v):null;}

function computeSPT(blows,depthMid){
  const N=blows[1]+blows[2];const CE=getCE(),CS=getCS(),CB=1.05;
  let CR=1.0;if(depthMid<3)CR=0.75;else if(depthMid<4)CR=0.80;else if(depthMid<6)CR=0.85;else if(depthMid<10)CR=0.95;
  const N60=Math.round(N*CE*CB*CR*CS);const gwl=getGWL();const gamma=120,gammaSub=58;
  let sv;if(gwl!==null&&depthMid>gwl)sv=gamma*gwl+gammaSub*(depthMid-gwl);else sv=gamma*depthMid;
  const svAtm=sv/2116.2;let CN=svAtm>0.05?Math.min(Math.sqrt(1/svAtm),2.0):2.0;
  return{N,N60,CN:CN.toFixed(2),N160:Math.round(N60*CN),CR:CR.toFixed(2),CE:CE.toFixed(2),CB:CB.toFixed(2),CS:CS.toFixed(2),sv:Math.round(sv)};
}

function estimateParams(uscs,N60,g){
  const p=[];
  if(g==='coarse'){let phi=N60<=4?28:N60<=10?30:N60<=30?33:N60<=50?38:42;p.push({n:"phi'",v:phi+'\u00B0',m:'Peck et al.'});let d=N60<=4?'V.loose':N60<=10?'Loose':N60<=30?'Med.dense':N60<=50?'Dense':'V.dense';p.push({n:'Density',v:d,m:'Terzaghi & Peck'});p.push({n:'E',v:Math.round(5*N60)+' tsf',m:'Kulhawy & Mayne'});}
  else if(g==='fine'){p.push({n:'Su',v:Math.round(N60*125)+' psf',m:'Stroud (1974)'});let c=N60<=2?'V.soft':N60<=4?'Soft':N60<=8?'Med.stiff':N60<=15?'Stiff':N60<=30?'V.stiff':'Hard';p.push({n:'Consistency',v:c,m:'Terzaghi & Peck'});p.push({n:'Es',v:Math.round(3*N60)+' tsf',m:'NAVFAC DM-7.1'});}
  return p;
}

function generateAlerts(sample,spt,allSamples,idx){
  const a=[],{depthFrom:df,depthTo:dt,blows,recovery:rec,notes,classification:cls}=sample,N=spt?spt.N:0;
  if(rec!==null&&rec<8)a.push({type:'warn',msg:'Low recovery ('+rec+'") at '+df+'-'+dt+' ft.'});
  if(blows[0]!==null&&blows[1]!==null&&blows[0]>(blows[1]+blows[2])*1.5&&blows[0]>10)a.push({type:'warn',msg:'High seating blows at '+df+'-'+dt+' ft.'});
  if(N>=100||blows[1]>=50||blows[2]>=50)a.push({type:'info',msg:'Refusal at '+df+'-'+dt+' ft (N='+N+').'});
  if(idx>=1){const prev=allSamples[idx-1],prevN=(prev.blows[1]||0)+(prev.blows[2]||0);if(prevN>20&&N<prevN*0.3)a.push({type:'danger',msg:'N-value drop '+prevN+' to '+N+'.'});if(N>prevN*4&&N>30&&prevN>2)a.push({type:'info',msg:'Sharp N increase '+prevN+' to '+N+'.'});}
  if(notes&&/heave|cave|caving|loss|lost/i.test(notes))a.push({type:'warn',msg:'Drilling issue noted at '+df+'-'+dt+' ft.'});
  if(cls.group==='organic')a.push({type:'danger',msg:'Organic soil at '+df+'-'+dt+' ft.'});
  return a;
}

// ============ RENDER BORING EDITOR ============
function renderBoringEditor() {
  if (!activeBoring) { renderEmptyState(); return; }
  const f = activeBoring.info;
  document.getElementById('topbarTitle').textContent = f.boringId;
  document.getElementById('topbarMeta').textContent = (f.projName || 'No project') + ' | ' + activeBoring.samples.length + ' samples';

  const c = document.getElementById('mainContent');
  c.innerHTML = `
  <div class="section"><div class="section-title" onclick="toggleSection('projInfo')"><span class="arrow open" id="arrow-projInfo">\u25B6</span>Project information</div>
  <div class="section-body" id="body-projInfo">
    <div class="grid-6">
      ${fld('projName','Project name',f.projName)}${fld('projNo','Project no.',f.projNo)}${fld('location','Location',f.location)}
      ${fld('client','Client',f.client)}${fld('contractor','Contractor',f.contractor)}${fld('boringId','Boring no.',f.boringId)}
    </div></div></div>

  <div class="section"><div class="section-title" onclick="toggleSection('boringInfo')"><span class="arrow open" id="arrow-boringInfo">\u25B6</span>Boring details</div>
  <div class="section-body" id="body-boringInfo">
    <div class="grid-6">
      ${fld('groundElev','Ground elev. (ft)',f.groundElev,'number')}${fld('datum','Datum',f.datum)}
      ${fld('startDate','Start date',f.startDate,'date')}${fld('startTime','Start time',f.startTime,'time')}
      ${fld('finishDate','Finish date',f.finishDate,'date')}${fld('finishTime','Finish time',f.finishTime,'time')}
    </div>
    <div class="grid-6" style="margin-top:6px">
      ${fld('drillMethod','Drill method',f.drillMethod)}${fld('rigType','Rig type',f.rigType)}
      ${fld('driller','Driller',f.driller)}${fld('inspector','Inspector',f.inspector)}
      ${fld('gwlDepth','GWL depth (ft)',f.gwlDepth,'number')}${fld('backfill','Backfill',f.backfill)}
    </div></div></div>

  <div class="section"><div class="section-title" onclick="toggleSection('equipInfo')"><span class="arrow" id="arrow-equipInfo">\u25B6</span>Casing &amp; equipment</div>
  <div class="section-body collapsed" id="body-equipInfo">
    <div class="grid-5">
      ${fld('casingType','Casing type',f.casingType)}${fld('casingID','Casing I.D.',f.casingID)}${fld('casingOD','Casing O.D.',f.casingOD)}
      ${sel('hammerType','Hammer type',[['auto','Auto-trip (CE=1.00)'],['safety','Safety (CE=0.75)'],['donut','Donut (CE=0.60)']],f.hammerType)}
      ${fld('hammerWt','Hammer wt (lbs)',f.hammerWt,'number')}
    </div>
    <div class="grid-5" style="margin-top:6px">
      ${fld('hammerFall','Hammer fall (in)',f.hammerFall,'number')}${fld('ssID','SS I.D.',f.ssID)}${fld('ssOD','SS O.D.',f.ssOD)}
      ${sel('samplerLiner','Liner',[['with','With (CS=1.00)'],['without','Without (CS=1.20)']],f.samplerLiner)}
      ${fld('drillRod','Drill rod',f.drillRod)}
    </div></div></div>

  <div class="main-grid">
    <div class="panel scroll-panel" style="align-self:start">
      <div class="panel-header"><h3>Add sample</h3><span class="count" id="sampleCount">${activeBoring.samples.length} samples</span></div>
      <div class="entry-form">
        <div class="form-row">
          <div class="form-field"><label>Depth from (ft)</label><input type="number" id="depthFrom" step="0.5" value="${nextDepthFrom()}"/></div>
          <div class="form-field"><label>Depth to (ft)</label><input type="number" id="depthTo" step="0.5" value="${nextDepthTo()}"/></div>
        </div>
        <div class="form-field"><label>Sample type</label><select id="sampleType"><option value="SS">Split Spoon (SS)</option><option value="ST">Shelby Tube (ST)</option><option value="RC">Rock Core (RC)</option><option value="GB">Grab (GB)</option><option value="NR">No Recovery (NR)</option></select></div>
        <div><label style="display:block;font-size:.62rem;font-weight:500;color:var(--tx3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">SPT blow counts (per 6")</label>
          <div class="blow-grid">
            <div class="form-field"><label>0-6"</label><input type="number" id="blow1" min="0" placeholder="--"/></div>
            <div class="form-field"><label>6-12"</label><input type="number" id="blow2" min="0" placeholder="--"/></div>
            <div class="form-field"><label>12-18"</label><input type="number" id="blow3" min="0" placeholder="--"/></div>
            <div class="form-field"><label>18-24"</label><input type="number" id="blow4" min="0" placeholder="--"/></div>
          </div>
        </div>
        <div class="form-row"><div class="form-field"><label>Recovery (in)</label><input type="number" id="recovery" min="0" max="24" step="1" placeholder="18"/></div><div class="form-field"><label>Sample #</label><input type="number" id="sampleNum" min="1" value="${activeBoring.sampleCounter+1}"/></div></div>
        <div class="form-field"><label>Field description</label><textarea id="fieldDesc" placeholder="e.g., Brown medium dense fine to medium SAND with trace silt, moist"></textarea></div>
        <div class="form-field"><label>Drilling notes</label><textarea id="drillNotes" placeholder="e.g., Heave, WOH..." style="min-height:36px"></textarea></div>
        <button class="btn btn-primary" onclick="addSample()">Log sample</button>
      </div>
      <div id="aiCard" class="ai-card" style="display:none"><div class="ai-tag">AI classification</div><div class="ai-uscs" id="aiUscs"></div><div class="ai-desc" id="aiDesc"></div><div class="ai-confidence"><div class="ai-conf-bar"><div class="ai-conf-fill" id="aiConfFill"></div></div><span class="ai-conf-pct" id="aiConfPct"></span></div></div>
    </div>
    <div class="right-panel">
      <div class="metrics-row">
        <div class="metric"><div class="metric-label">Depth</div><div class="metric-value" id="curDepth">${activeBoring.samples.length?activeBoring.samples[activeBoring.samples.length-1].depthTo.toFixed(1):'0.0'}<span class="metric-unit">ft</span></div></div>
        <div class="metric"><div class="metric-label">Last N60</div><div class="metric-value" id="lastN60">--</div><div class="metric-sub" id="lastN60sub"></div></div>
        <div class="metric"><div class="metric-label">Avg recovery</div><div class="metric-value" id="avgRecovery">--<span class="metric-unit">%</span></div></div>
        <div class="metric"><div class="metric-label">GWL</div><div class="metric-value" id="gwlDisplay">${getGWL()!==null?getGWL().toFixed(1):'--'}<span class="metric-unit">ft</span></div></div>
      </div>
      <div class="panel"><div class="panel-header"><h3>N-value profile</h3></div><div id="depthProfile" style="padding:10px 14px">${activeBoring.samples.length?'':'<div class="empty-state">Add samples</div>'}</div></div>
      <div class="panel"><div class="panel-header"><h3>Boring log</h3></div><div class="log-table-wrap" id="logTableWrap">${activeBoring.samples.length?'':'<div class="empty-state">Samples will appear here</div>'}</div></div>
      <div class="panel" id="paramPanel" style="display:none"><div class="panel-header"><h3>Parameters (last sample)</h3></div><div class="param-grid" id="paramGrid"></div></div>
      <div class="panel" id="alertPanel" style="display:none"><div class="panel-header"><h3>Alerts</h3></div><div class="alerts" id="alertList"></div></div>
    </div>
  </div>`;

  // Attach listeners
  document.getElementById('fieldDesc').addEventListener('input', updateAICard);
  document.querySelectorAll('[data-field]').forEach(el => {
    el.addEventListener('change', function() {
      activeBoring.info[this.dataset.field] = this.value;
      saveProject();
      renderBoringList();
      document.getElementById('topbarTitle').textContent = activeBoring.info.boringId;
      document.getElementById('topbarMeta').textContent = (activeBoring.info.projName||'No project') + ' | ' + activeBoring.samples.length + ' samples';
      if (this.dataset.field === 'gwlDepth') {
        const v = this.value;
        document.getElementById('gwlDisplay').innerHTML = v ? parseFloat(v).toFixed(1) + '<span class="metric-unit">ft</span>' : '--<span class="metric-unit">ft</span>';
      }
    });
  });

  // Render existing data
  if (activeBoring.samples.length) { refreshAllDisplays(); }
}

function fld(id, label, val, type) {
  type = type || 'text';
  return '<div class="field-group"><label>' + label + '</label><input type="' + type + '" data-field="' + id + '" value="' + (val || '') + '"/></div>';
}
function sel(id, label, opts, val) {
  return '<div class="field-group"><label>' + label + '</label><select data-field="' + id + '">' + opts.map(o => '<option value="' + o[0] + '"' + (o[0] === val ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>';
}

function nextDepthFrom() { if (!activeBoring || !activeBoring.samples.length) return ''; return activeBoring.samples[activeBoring.samples.length - 1].depthTo.toFixed(1); }
function nextDepthTo() { if (!activeBoring || !activeBoring.samples.length) return ''; return (activeBoring.samples[activeBoring.samples.length - 1].depthTo + 2).toFixed(1); }

function toggleSection(id) {
  const body = document.getElementById('body-' + id);
  const arrow = document.getElementById('arrow-' + id);
  body.classList.toggle('collapsed');
  arrow.classList.toggle('open');
}

function renderEmptyState() {
  document.getElementById('topbarTitle').textContent = 'No boring selected';
  document.getElementById('topbarMeta').textContent = '';
  document.getElementById('mainContent').innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;color:var(--tx3);text-align:center"><div style="width:64px;height:64px;border-radius:16px;background:var(--bg-accent);display:flex;align-items:center;justify-content:center;margin-bottom:16px"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--tx3)"><path d="M12 2v20M12 2l-4 6M12 2l4 6"/><path d="M6 14h12M8 18h8"/></svg></div><div style="font-size:1rem;font-weight:500;margin-bottom:4px">No boring selected</div><div style="font-size:.82rem;margin-bottom:16px">Create a new boring or select one from the sidebar</div><button class="btn btn-primary" onclick="createNewBoring()">+ New boring</button></div>';
}

// ============ SAMPLE MANAGEMENT ============
function addSample() {
  if (!activeBoring) return;
  const depthFrom = parseFloat(document.getElementById('depthFrom').value);
  const depthTo = parseFloat(document.getElementById('depthTo').value);
  if (isNaN(depthFrom) || isNaN(depthTo)) { alert('Enter depth range.'); return; }
  const blows = [
    document.getElementById('blow1').value !== '' ? parseInt(document.getElementById('blow1').value) : null,
    document.getElementById('blow2').value !== '' ? parseInt(document.getElementById('blow2').value) : null,
    document.getElementById('blow3').value !== '' ? parseInt(document.getElementById('blow3').value) : null,
    document.getElementById('blow4').value !== '' ? parseInt(document.getElementById('blow4').value) : null
  ];
  const recovery = document.getElementById('recovery').value !== '' ? parseInt(document.getElementById('recovery').value) : null;
  const desc = document.getElementById('fieldDesc').value.trim();
  const notes = document.getElementById('drillNotes').value.trim();
  activeBoring.sampleCounter++;
  const num = document.getElementById('sampleNum').value ? parseInt(document.getElementById('sampleNum').value) : activeBoring.sampleCounter;
  const classification = classifyUSCS(desc);
  const depthMid = (depthFrom + depthTo) / 2;
  let sptResult = null;
  if (blows[1] !== null && blows[2] !== null) sptResult = computeSPT(blows, depthMid);
  const sample = { depthFrom, depthTo, depthMid, sampleType: document.getElementById('sampleType').value, blows, recovery, desc, notes, classification, sptResult, num };
  sample.alerts = generateAlerts(sample, sptResult, activeBoring.samples, activeBoring.samples.length);
  activeBoring.samples.push(sample);
  saveProject();
  refreshAllDisplays();
  autoFillNext(depthTo);
  renderBoringList();
}

function refreshAllDisplays() {
  if (!activeBoring || !activeBoring.samples.length) return;
  const ss = activeBoring.samples;
  const last = ss[ss.length - 1];
  document.getElementById('sampleCount').textContent = ss.length + ' sample' + (ss.length !== 1 ? 's' : '');
  document.getElementById('curDepth').innerHTML = last.depthTo.toFixed(1) + '<span class="metric-unit">ft</span>';
  if (last.sptResult) {
    document.getElementById('lastN60').textContent = last.sptResult.N60;
    document.getElementById('lastN60sub').textContent = 'N=' + last.sptResult.N + ', (N1)60=' + last.sptResult.N160;
  }
  const rs = ss.filter(s => s.recovery !== null && (s.depthTo - s.depthFrom) > 0);
  if (rs.length) {
    const avg = rs.reduce((a, s) => a + (s.recovery / ((s.depthTo - s.depthFrom) * 12) * 100), 0) / rs.length;
    document.getElementById('avgRecovery').innerHTML = Math.round(avg) + '<span class="metric-unit">%</span>';
  }
  // Profile
  const sptS = ss.filter(s => s.sptResult);
  if (sptS.length) {
    const maxN = Math.max(...sptS.map(s => s.sptResult.N60), 50);
    const gwl = getGWL();
    let h = '';
    for (const s of sptS) {
      const pct = Math.min((s.sptResult.N60 / maxN) * 100, 100);
      const col = s.classification.group === 'fine' ? 'var(--teal)' : s.classification.group === 'organic' ? 'var(--green)' : 'var(--amber)';
      const isGWL = gwl !== null && s.depthFrom <= gwl && s.depthTo >= gwl;
      h += '<div class="depth-bar"><span class="depth-label">' + s.depthMid.toFixed(1) + "'" + '</span><div class="depth-fill" style="width:' + Math.max(pct, 3) + '%;background:' + col + '"></div><span class="depth-n">' + s.sptResult.N60 + '</span><span style="font-size:.6rem;color:var(--tx3)">' + s.classification.uscs + '</span>' + (isGWL ? '<span class="gwl-tag">GWL</span>' : '') + '</div>';
    }
    document.getElementById('depthProfile').innerHTML = h;
  }
  // Table
  let th = '<table class="log"><thead><tr><th>#</th><th>Depth</th><th>Type</th><th>0-6"</th><th>6-12"</th><th>12-18"</th><th>18-24"</th><th>N</th><th>N60</th><th>USCS</th><th>Rec</th><th style="min-width:140px">Description</th></tr></thead><tbody>';
  for (const s of ss) {
    const bc = s.classification.group === 'coarse' ? 'soil-coarse' : s.classification.group === 'fine' ? 'soil-fine' : s.classification.group === 'rock' ? 'soil-rock' : s.classification.group === 'organic' ? 'soil-organic' : s.classification.group === 'fill' ? 'soil-fill' : '';
    const ds = s.desc.length > 40 ? s.desc.substring(0, 37) + '...' : s.desc;
    th += '<tr><td class="mono">S' + s.num + '</td><td class="mono">' + s.depthFrom.toFixed(1) + '-' + s.depthTo.toFixed(1) + '</td><td>' + s.sampleType + '</td>';
    for (let i = 0; i < 4; i++) th += '<td class="mono">' + (s.blows[i] !== null ? s.blows[i] : '--') + '</td>';
    th += '<td class="mono" style="font-weight:600">' + (s.sptResult ? s.sptResult.N : '--') + '</td><td class="mono" style="font-weight:600">' + (s.sptResult ? s.sptResult.N60 : '--') + '</td><td><span class="uscs-badge ' + bc + '">' + s.classification.uscs + '</span></td><td class="mono">' + (s.recovery !== null ? s.recovery + '"' : '--') + '</td><td style="font-size:.68rem" title="' + s.desc.replace(/"/g, '&quot;') + '">' + ds + '</td></tr>';
  }
  document.getElementById('logTableWrap').innerHTML = th + '</tbody></table>';
  // Params
  if (last.sptResult) {
    document.getElementById('paramPanel').style.display = 'block';
    const params = estimateParams(last.classification.uscs, last.sptResult.N60, last.classification.group);
    let ph = '<div class="param-item" style="grid-column:1/-1;background:var(--blue-bg)"><div class="param-name" style="color:var(--blue-tx)">SPT corrections</div><div class="param-val" style="font-size:.76rem;color:var(--blue-tx)">N=' + last.sptResult.N + ' x CE=' + last.sptResult.CE + ' x CB=' + last.sptResult.CB + ' x CR=' + last.sptResult.CR + ' x CS=' + last.sptResult.CS + ' = N60=' + last.sptResult.N60 + '</div><div class="param-method" style="color:var(--blue-tx);opacity:.7">CN=' + last.sptResult.CN + ' => (N1)60=' + last.sptResult.N160 + '</div></div>';
    for (const p of params) ph += '<div class="param-item"><div class="param-name">' + p.n + '</div><div class="param-val">' + p.v + '</div><div class="param-method">' + p.m + '</div></div>';
    document.getElementById('paramGrid').innerHTML = ph;
  } else document.getElementById('paramPanel').style.display = 'none';
  // Alerts
  const allAlerts = ss.flatMap(s => s.alerts || []);
  if (allAlerts.length) {
    document.getElementById('alertPanel').style.display = 'block';
    document.getElementById('alertList').innerHTML = allAlerts.slice(-5).reverse().map(a => '<div class="alert alert-' + a.type + '">' + a.msg + '</div>').join('');
  } else document.getElementById('alertPanel').style.display = 'none';
}

function autoFillNext(d) {
  document.getElementById('depthFrom').value = d.toFixed(1);
  document.getElementById('depthTo').value = (d + 2).toFixed(1);
  document.getElementById('sampleNum').value = activeBoring.sampleCounter + 1;
  ['blow1', 'blow2', 'blow3', 'blow4', 'recovery'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('fieldDesc').value = '';
  document.getElementById('drillNotes').value = '';
  document.getElementById('aiCard').style.display = 'none';
  document.getElementById('fieldDesc').focus();
}

function updateAICard() {
  const desc = document.getElementById('fieldDesc').value;
  const card = document.getElementById('aiCard');
  if (!desc || desc.trim().length < 3) { card.style.display = 'none'; return; }
  const cls = classifyUSCS(desc);
  card.style.display = 'block';
  document.getElementById('aiUscs').textContent = cls.uscs;
  document.getElementById('aiDesc').textContent = cls.desc;
  const pct = Math.round(cls.confidence * 100);
  document.getElementById('aiConfFill').style.width = pct + '%';
  document.getElementById('aiConfFill').style.background = pct > 75 ? 'var(--green)' : pct > 50 ? 'var(--amber)' : 'var(--red)';
  document.getElementById('aiConfPct').textContent = pct + '%';
}

// ============ JSON IMPORT/EXPORT ============
function exportBoringJSON() {
  if (!activeBoring) return;
  const blob = new Blob([JSON.stringify(activeBoring, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = activeBoring.info.boringId + '_' + (activeBoring.info.projNo || 'export') + '.json';
  a.click(); URL.revokeObjectURL(url);
  showToast('Boring exported as JSON');
}

function exportProjectJSON() {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'GeoAssist_Project_' + new Date().toISOString().split('T')[0] + '.json';
  a.click(); URL.revokeObjectURL(url);
  showToast('Project exported (' + project.borings.length + ' borings)');
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.borings && Array.isArray(data.borings)) {
        // Full project import
        const count = data.borings.length;
        data.borings.forEach(b => {
          if (!b.id) b.id = generateId();
          // Avoid duplicates
          if (!project.borings.find(existing => existing.id === b.id)) {
            project.borings.push(b);
          }
        });
        saveProject();
        renderBoringList();
        if (data.borings.length) switchToBoring(data.borings[0].id);
        showToast('Imported ' + count + ' borings');
      } else if (data.info && data.samples) {
        // Single boring import
        if (!data.id) data.id = generateId();
        if (project.borings.find(b => b.id === data.id)) data.id = generateId();
        project.borings.push(data);
        project.activeBoringId = data.id;
        saveProject();
        renderBoringList();
        switchToBoring(data.id);
        showToast('Imported boring ' + data.info.boringId);
      } else {
        alert('Unrecognized file format.');
      }
    } catch (err) {
      alert('Error reading file: ' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// ============ PDF EXPORT — same as V3 ============
function exportPDF(){
  if(!activeBoring||!activeBoring.samples.length){alert('No samples to export.');return;}
  const{jsPDF}=window.jspdf;const doc=new jsPDF({orientation:'portrait',unit:'pt',format:'letter'});
  const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight(),M=28,CW=W-2*M;
  const navy=[30,58,95],black=[0,0,0],gray=[120,120,120],ltGray=[200,200,200];
  const f=activeBoring.info;const ss=activeBoring.samples;
  const samplesPerPage=14;const totalPages=Math.ceil(ss.length/samplesPerPage);
  for(let page=0;page<totalPages;page++){
    if(page>0)doc.addPage();
    drawPage(doc,f,ss.slice(page*samplesPerPage,(page+1)*samplesPerPage),page+1,totalPages,W,H,M,CW,navy,black,gray,ltGray);
  }
  doc.save('Boring_Log_'+f.boringId+'_'+(f.projNo||'export')+'.pdf');
  showToast('PDF exported');
}

function drawPage(doc,f,ps,pn,tp,W,H,M,CW,navy,black,gray,ltGray){
  let y=M;
  doc.setDrawColor(...black);doc.setLineWidth(1);doc.rect(M,y,CW,42);
  doc.setFont('helvetica','bold');doc.setFontSize(16);doc.setTextColor(...black);doc.text('YU',M+10,y+18);
  doc.setFontSize(6.5);doc.setFont('helvetica','normal');doc.text('& Associates',M+10,y+26);
  doc.setFont('helvetica','bold');doc.setFontSize(13);doc.text('BORING LOG',M+90,y+22);
  const rbx=W-M-170;doc.setLineWidth(0.5);doc.rect(rbx,y,170,42);
  doc.setFontSize(7);doc.text('BORING NUMBER:  '+f.boringId,rbx+4,y+12);
  doc.text('SHEET NUMBER:  '+pn+' of '+tp,rbx+4,y+24);
  doc.setFontSize(7.5);doc.text('PROJECT NUMBER:  '+(f.projNo||''),rbx+4,y+36);
  y+=42;
  doc.rect(M,y,CW,66);doc.setFontSize(6);doc.setFont('helvetica','normal');doc.setTextColor(...black);
  const lx=M+4,rx=M+CW/2+10;let iy=y+9;
  const il=(x,yy,l,v)=>{doc.setFont('helvetica','bold');doc.text(l,x,yy);doc.setFont('helvetica','normal');doc.text(v||'--',x+65,yy);};
  il(lx,iy,'PROJECT:',f.projName);il(lx,iy+10,'LOCATION:',f.location);il(lx,iy+20,'CLIENT:',f.client);
  il(lx,iy+30,'CONTRACTOR:',f.contractor);il(lx,iy+40,'DRILLER:',f.driller);il(lx,iy+50,'INSPECTOR:',f.inspector);
  il(rx,iy,'ELEV.:',(f.groundElev||'')+' ft');il(rx,iy+10,'DATUM:',f.datum);
  il(rx,iy+20,'START DATE:',f.startDate+'  TIME: '+f.startTime);il(rx,iy+30,'FINISH DATE:',f.finishDate+'  TIME: '+f.finishTime);
  il(rx,iy+40,'DRILL METHOD:',f.drillMethod);il(rx,iy+50,'RIG TYPE:',f.rigType);
  y+=66;
  doc.rect(M,y,CW,24);doc.setFontSize(5.5);
  doc.setFont('helvetica','bold');doc.text('Casing: ',lx,y+8);doc.setFont('helvetica','normal');doc.text(f.casingType+' I.D.='+f.casingID+' O.D.='+f.casingOD,lx+28,y+8);
  doc.setFont('helvetica','bold');doc.text('SS: ',lx+140,y+8);doc.setFont('helvetica','normal');doc.text('I.D.='+f.ssID+' O.D.='+f.ssOD,lx+152,y+8);
  doc.setFont('helvetica','bold');doc.text('Hammer: ',lx+270,y+8);doc.setFont('helvetica','normal');doc.text(f.hammerWt+'lbs, '+f.hammerFall+'" fall',lx+300,y+8);
  doc.setFont('helvetica','bold');doc.text('GWL: ',lx,y+18);doc.setFont('helvetica','normal');doc.text(f.gwlDepth?f.gwlDepth+' ft':'N/E',lx+20,y+18);
  doc.setFont('helvetica','bold');doc.text('Backfill: ',lx+100,y+18);doc.setFont('helvetica','normal');doc.text(f.backfill||'',lx+130,y+18);
  y+=24;
  // Table
  const hH=26,rH=26;
  const cols=[24,16,22,26,26,26,26,22,24,24,200,82];
  const tot=cols.reduce((a,b)=>a+b,0);const sc=CW/tot;cols.forEach((c,i)=>cols[i]=Math.round(c*sc));
  const df=CW-cols.reduce((a,b)=>a+b,0);cols[10]+=df;
  const labels=['DEPTH','S#','TYPE','0-6"','6-12"','12-18"','18-24"','N','N60','REC','FIELD CLASSIFICATION AND REMARKS','N-VALUE'];
  doc.setFillColor(240,240,235);doc.rect(M,y,CW,hH,'F');doc.setDrawColor(...black);doc.rect(M,y,CW,hH);
  doc.setFontSize(5);doc.setFont('helvetica','bold');
  let cx=M;labels.forEach((l,i)=>{doc.rect(cx,y,cols[i],hH);doc.text(l,cx+cols[i]/2,y+hH/2+2,{align:'center'});cx+=cols[i];});
  y+=hH;
  const nProfX=M;for(let i=0;i<11;i++){}let npx=M;for(let i=0;i<11;i++)npx+=cols[i];const npw=cols[11];
  doc.setFontSize(4);doc.setFont('helvetica','normal');doc.setTextColor(...gray);
  [0,10,20,30,40,50].forEach(n=>{doc.text(n.toString(),npx+3+(n/50)*(npw-10),y-2,{align:'center'});});
  doc.setTextColor(...black);
  for(let i=0;i<ps.length;i++){
    const s=ps[i],ry=y+i*rH;
    if(i%2===1){doc.setFillColor(250,250,248);doc.rect(M,ry,CW,rH,'F');}
    doc.setDrawColor(...ltGray);doc.setLineWidth(0.3);
    cx=M;cols.forEach(w=>{doc.rect(cx,ry,w,rH);cx+=w;});
    doc.setFontSize(5.5);doc.setTextColor(...black);cx=M;
    doc.setFont('courier','normal');doc.text(s.depthFrom.toFixed(1)+'-'+s.depthTo.toFixed(1),cx+cols[0]/2,ry+rH/2+2,{align:'center'});cx+=cols[0];
    doc.text('S'+s.num,cx+cols[1]/2,ry+rH/2+2,{align:'center'});cx+=cols[1];
    doc.setFont('helvetica','normal');doc.text(s.sampleType,cx+cols[2]/2,ry+rH/2+2,{align:'center'});cx+=cols[2];
    doc.setFont('courier','normal');
    for(let bi=0;bi<4;bi++){doc.text(s.blows[bi]!==null?s.blows[bi].toString():'--',cx+cols[3+bi]/2,ry+rH/2+2,{align:'center'});cx+=cols[3+bi];}
    doc.setFont('courier','bold');doc.text(s.sptResult?s.sptResult.N.toString():'--',cx+cols[7]/2,ry+rH/2+2,{align:'center'});cx+=cols[7];
    doc.text(s.sptResult?s.sptResult.N60.toString():'--',cx+cols[8]/2,ry+rH/2+2,{align:'center'});cx+=cols[8];
    doc.setFont('courier','normal');doc.text(s.recovery!==null?s.recovery.toString():'--',cx+cols[9]/2,ry+rH/2+2,{align:'center'});cx+=cols[9];
    doc.setFont('helvetica','normal');doc.setFontSize(5);
    const dl=doc.splitTextToSize(s.desc,cols[10]-6);dl.slice(0,3).forEach((l,li)=>{doc.text(l,cx+3,ry+5+li*6.5);});
    if(s.sptResult&&s.sptResult.N60>0){
      const bw=Math.max((s.sptResult.N60/50)*(npw-10),2);
      if(s.classification.group==='fine')doc.setFillColor(13,148,136);else if(s.classification.group==='organic')doc.setFillColor(5,150,105);else doc.setFillColor(217,119,6);
      doc.roundedRect(npx+3,ry+rH/2-3,Math.min(bw,npw-10),7,1.5,1.5,'F');
      doc.setFontSize(4.5);doc.setFont('courier','bold');doc.setTextColor(80,80,80);
      doc.text(s.sptResult.N60.toString(),npx+3+Math.min(bw,npw-14)+3,ry+rH/2+1.5);
      doc.setTextColor(...black);
    }
  }
  const tb=y+ps.length*rH;doc.setDrawColor(...black);doc.setLineWidth(0.5);doc.line(M,tb,M+CW,tb);
  // GWL line
  if(f.gwlDepth){
    const gwl=parseFloat(f.gwlDepth);const fd=ps[0].depthFrom,ld=ps[ps.length-1].depthTo;
    if(gwl>=fd&&gwl<=ld){const frac=(gwl-fd)/(ld-fd);const gy=y+frac*ps.length*rH;
    doc.setDrawColor(37,99,235);doc.setLineWidth(0.8);doc.setLineDashPattern([3,2],0);
    doc.line(M,gy,M+CW,gy);doc.setLineDashPattern([],0);
    doc.setFontSize(4.5);doc.setTextColor(37,99,235);doc.setFont('helvetica','bold');
    doc.text('GWL '+gwl.toFixed(1)+"'",M+CW-36,gy-2);doc.setTextColor(...black);}
  }
  // Footer
  doc.setDrawColor(...black);doc.setLineWidth(0.5);doc.line(M,H-32,M+CW,H-32);
  doc.setFontSize(6);doc.setFont('helvetica','normal');doc.setTextColor(...gray);doc.text('YU & Associates, Inc.',M,H-22);
  doc.setFont('helvetica','bold');doc.setTextColor(...black);doc.text('Boring No. '+f.boringId,M+CW/2-40,H-22);
  doc.text('Sheet '+pn+' of '+tp,M+CW-70,H-22);
  doc.setFontSize(4);doc.setFont('helvetica','italic');doc.setTextColor(...gray);
  doc.text('N60 per Skempton (1986). (N1)60 per Liao & Whitman (1986). Generated by GeoAssist.',M,H-12);
}

// ============ INIT ============
loadProject();
renderBoringList();
updateStorageInfo();

if (project.activeBoringId) {
  switchToBoring(project.activeBoringId);
} else if (project.borings.length) {
  switchToBoring(project.borings[0].id);
} else {
  // Load demo on first visit
  createNewBoring();
  activeBoring.info.projName = 'Long Slip Canal Phase 2';
  activeBoring.info.projNo = '22-048X';
  activeBoring.info.location = 'Jersey City, NJ';
  activeBoring.info.client = 'NJ Transit';
  activeBoring.info.contractor = 'AECOM';
  activeBoring.info.driller = 'ETD Drilling';
  activeBoring.info.inspector = 'P. Dahal';
  activeBoring.info.gwlDepth = '5.5';
  saveProject();
  renderBoringEditor();
  // Add demo samples programmatically
  const demos=[
    {f:0,t:1,b:[3,4,5,6],r:10,d:'Brown medium dense fine to medium SAND, some f Gravel, little Silty Clay, moist, (SC), (FILL NYCBC Class 7).'},
    {f:1,t:3,b:[5,7,8,9],r:14,d:'Gray-brown of SAND, little Clayey Silt, trace f Gravel, moist, (SM), (FILL NYCBC Class 7).'},
    {f:3,t:5,b:[2,3,2,3],r:17,d:'Gray-brown of SAND, little Clayey Silt, trace f Gravel, glass fragments, moist, (SM), (FILL NYCBC Class 7).'},
    {f:5,t:7,b:[3,7,7,6],r:20,d:'Dark gray Silty CLAY, moist, (CL), (FILL NYCBC Class 7).'},
    {f:7,t:9,b:[1,1,1,1],r:13,d:'Brown of SAND, some Silty Clay, trace f Gravel, wet, (SC), (FILL NYCBC Class 7).'},
    {f:9,t:11,b:[4,6,8,9],r:17,d:'Brown of SAND, some Silty Clay, trace f Gravel, wet, (SC), (FILL NYCBC Class 7).'},
    {f:11,t:13,b:[3,null,null,null],r:null,d:'Gray Silty CLAY, organic fibers, moist, (OL), (NYCBC Class 6).'},
    {f:13,t:15,b:[2,2,3,3],r:14,d:'Gray Silty CLAY, organic fibers, moist, (OL), (NYCBC Class 6).'},
  ];
  demos.forEach(dm=>{
    document.getElementById('depthFrom').value=dm.f;document.getElementById('depthTo').value=dm.t;
    document.getElementById('blow1').value=dm.b[0]!==null?dm.b[0]:'';document.getElementById('blow2').value=dm.b[1]!==null?dm.b[1]:'';
    document.getElementById('blow3').value=dm.b[2]!==null?dm.b[2]:'';document.getElementById('blow4').value=dm.b[3]!==null?dm.b[3]:'';
    document.getElementById('recovery').value=dm.r!==null?dm.r:'';document.getElementById('fieldDesc').value=dm.d;document.getElementById('drillNotes').value='';
    addSample();
  });
}

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
</script>
</body>
</html>
