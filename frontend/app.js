/* ============ ITSM Help Desk Portal — vanilla JS demo ============ */
const LS_KEY = 'itsm-demo-v1';
const AUTH_KEY = 'itsm-auth-v1';

/* ---------- Seed / Store ---------- */
const CATEGORIES = {
  Hardware: ['Laptop','Desktop','Monitor','Peripheral'],
  Software: ['Installation','Crash','License','Update'],
  Network:  ['VPN','Wi-Fi','LAN','Firewall'],
  Email:    ['Outlook','Delivery','Configuration'],
  Password: ['Reset','Account Locked'],
  Printer:  ['Not Printing','Setup','Toner'],
  Windows:  ['Boot','Update','Performance'],
  Access:   ['Application','File Share'],
};
const SERVICE_CATALOG = [
  { id:'sr-laptop', icon:'laptop', name:'New Laptop Request', desc:'Request a corporate laptop.' },
  { id:'sr-sw',     icon:'package', name:'Software Installation', desc:'Install approved software.' },
  { id:'sr-access', icon:'key-round', name:'Access Request', desc:'Access to an app or drive.' },
  { id:'sr-email',  icon:'mail', name:'Email Group', desc:'Create/modify a distribution list.' },
  { id:'sr-vpn',    icon:'shield', name:'VPN Access', desc:'Enable remote VPN.' },
  { id:'sr-mobile', icon:'smartphone', name:'Mobile Device', desc:'Issue a corporate phone.' },
];
const KB_ARTICLES = [
  { id:'kb1', title:'How to reset your Windows password', category:'Password', body:'Press Ctrl+Alt+Del, choose Change a password, enter old and new, confirm.' },
  { id:'kb2', title:'Connecting to the corporate VPN', category:'Network', body:'Install the Cisco AnyConnect client, enter vpn.company.com, sign in with SSO.' },
  { id:'kb3', title:'Fix Outlook not sending emails', category:'Email', body:'Check Outbox, ensure you are online, and verify SMTP settings.' },
  { id:'kb4', title:'Printer setup guide', category:'Printer', body:'Add Printer > Network > select PRT-HQ-01. Install driver when prompted.' },
  { id:'kb5', title:'Requesting new software', category:'Software', body:'Open Service Catalog > Software Installation. Provide business justification.' },
  { id:'kb6', title:'Slow laptop troubleshooting', category:'Hardware', body:'Restart, close background apps, run Windows Update, and check disk usage.' },
];

const defaultData = () => ({
  incidents: [
    demoTicket('INC-1001','Incident','Email not syncing on Outlook','Open','High','Email','Delivery',-2),
    demoTicket('INC-1002','Incident','VPN disconnects every 5 minutes','In Progress','Critical','Network','VPN',-5),
    demoTicket('INC-1003','Incident','Blue screen on boot','Resolved','High','Hardware','Laptop',-10),
    demoTicket('INC-1004','Incident','Cannot access shared drive','Open','Medium','Access','File Share',-1),
  ],
  services: [
    demoTicket('SR-2001','Service','New laptop for onboarding','In Progress','Medium','Hardware','Laptop',-3),
    demoTicket('SR-2002','Service','Install Adobe Photoshop','Open','Low','Software','Installation',-1),
    demoTicket('SR-2003','Service','VPN access for contractor','Closed','Medium','Network','VPN',-14),
  ],
  drafts: {},
});
function demoTicket(id,type,title,status,priority,category,sub,daysAgo){
  return { id,type,title,status,priority,category,subCategory:sub,
    description:title+' — details recorded by the requester.',
    requester:'Priyansh Rao', requesterEmail:'rao@outlook.com',
    assignedGroup: type==='Incident'?'L2 Support':'Provisioning',
    estimatedResponse: priority==='Critical'?'1 hour':priority==='High'?'4 hours':'1 business day',
    createdAt: new Date(Date.now()+daysAgo*86400000).toISOString(),
    comments:[{author:'System',text:'Ticket created.',at:new Date(Date.now()+daysAgo*86400000).toISOString()}]
  };
}
const load = () => JSON.parse(localStorage.getItem(LS_KEY) || 'null') || (save(defaultData()), JSON.parse(localStorage.getItem(LS_KEY)));
const save = (d) => (localStorage.setItem(LS_KEY, JSON.stringify(d)), d);
const state = { data: load(), user: JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'), route:'dashboard' };

function calcPriority(impact, urgency){
  const m = { High:{High:'Critical',Medium:'High',Low:'Low'},
              Medium:{High:'High',Medium:'Medium',Low:'Low'},
              Low:{High:'Low',Medium:'Low',Low:'Low'} };
  return m[impact][urgency];
}
function allTickets(){ return [...state.data.incidents, ...state.data.services].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)); }
function findTicket(id){ return allTickets().find(t=>t.id===id); }

/* ---------- Toast / Modal ---------- */
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.add('hidden'), 2500);
}
function modal(html){
  const m = document.getElementById('modal');
  document.getElementById('modalBody').innerHTML = html;
  m.classList.remove('hidden'); m.classList.add('flex');
  m.onclick = (e)=>{ if(e.target===m) closeModal(); };
}
function closeModal(){ const m=document.getElementById('modal'); m.classList.add('hidden'); m.classList.remove('flex'); }

/* ---------- Auth ---------- */
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('empId').value.trim();
  const pass = document.getElementById('empPass').value;
  if (!id || pass.length < 4) return toast('Enter a valid ID and 4+ char password');
  const isAdmin = id.toLowerCase() === 'admin';
  state.user = { id, name: isAdmin? 'Admin User' : 'Priyansh Rao', email: id+'@outlook.com', role: isAdmin?'admin':'employee' };
  localStorage.setItem(AUTH_KEY, JSON.stringify(state.user));
  enterApp();
});
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem(AUTH_KEY); state.user = null; location.reload();
});
document.getElementById('profileBtn').addEventListener('click', ()=>document.getElementById('profileMenu').classList.toggle('hidden'));
document.getElementById('menuBtn').addEventListener('click', ()=>document.getElementById('mobileNav').classList.toggle('hidden'));

function enterApp(){
  document.getElementById('view-login').classList.add('hidden');
  document.getElementById('view-app').classList.remove('hidden');
  document.getElementById('userName').textContent = state.user.name;
  document.getElementById('avatarInit').textContent = state.user.name[0];
  document.querySelectorAll('[data-admin-only]').forEach(el=>{
    el.style.display = state.user.role==='admin' ? '' : 'none';
  });
  navigate(location.hash.replace('#','') || 'dashboard');
}

/* ---------- Router ---------- */
document.body.addEventListener('click', (e)=>{
  const nav = e.target.closest('[data-nav]');
  if (nav){ e.preventDefault(); navigate(nav.dataset.nav); }
});
window.addEventListener('hashchange', ()=> navigate(location.hash.replace('#','') || 'dashboard'));

function navigate(route, param){
  state.route = route;
  location.hash = route + (param?'/'+param:'');
  document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active', a.dataset.nav===route.split('/')[0]));
  document.getElementById('profileMenu').classList.add('hidden');
  const [base, id] = route.split('/');
  const page = document.getElementById('page');
  const renderer = ROUTES[base] || ROUTES.dashboard;
  page.innerHTML = renderer(id);
  lucide.createIcons();
  bindPageEvents(base);
  window.scrollTo(0,0);
}

/* ---------- UI helpers ---------- */
const breadcrumb = (items)=>`
  <nav class="text-sm text-muted-foreground mb-3 flex gap-1 flex-wrap">
    ${items.map((it,i)=> i<items.length-1
      ? `<a data-nav="${it.to}" class="hover:text-primary cursor-pointer">${it.label}</a><span>/</span>`
      : `<span class="text-slate-700">${it.label}</span>`).join('')}
  </nav>`;
const header = (title, desc, actions='') => `
  <div class="mb-6 flex items-start justify-between gap-4 flex-wrap">
    <div><h1 class="text-2xl font-semibold tracking-tight">${title}</h1>
      ${desc?`<p class="text-sm text-muted-foreground mt-1">${desc}</p>`:''}</div>
    <div class="flex gap-2">${actions}</div>
  </div>`;
const prBadge = p => `<span class="badge badge-${p.toLowerCase()}">${p}</span>`;
const stBadge = s => `<span class="badge badge-${s.toLowerCase().replace(' ','')}">${s}</span>`;

/* ---------- Pages ---------- */
const ROUTES = {
  dashboard: () => {
    const t = allTickets();
    const open = t.filter(x=>x.status==='Open').length;
    const prog = t.filter(x=>x.status==='In Progress').length;
    const res  = t.filter(x=>x.status==='Resolved').length;
    return `
      ${header(`Welcome, ${state.user.name.split(' ')[0]} 👋`, 'Here\'s a snapshot of your IT support activity.')}
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${kpi('Open Tickets', open, 'inbox', 'text-blue-600 bg-blue-50')}
        ${kpi('In Progress', prog, 'loader', 'text-amber-600 bg-amber-50')}
        ${kpi('Resolved', res, 'check-circle-2', 'text-emerald-600 bg-emerald-50')}
        ${kpi('Avg. SLA', '92%', 'gauge', 'text-indigo-600 bg-indigo-50')}
      </div>
      <div class="grid gap-6 mt-6 lg:grid-cols-3">
        <div class="card p-5 lg:col-span-2">
          <h3 class="font-semibold">Ticket volume (last 7 days)</h3>
          <canvas id="chartVolume" height="110" class="mt-3"></canvas>
        </div>
        <div class="card p-5">
          <h3 class="font-semibold">By category</h3>
          <canvas id="chartCat" height="180" class="mt-3"></canvas>
        </div>
      </div>
      <div class="grid gap-6 mt-6 lg:grid-cols-3">
        <div class="card p-5">
          <h3 class="font-semibold mb-3">Quick actions</h3>
          <div class="grid gap-2">
            <button data-nav="incidents/new" class="btn btn-primary justify-center"><i data-lucide="alert-triangle" class="w-4 h-4"></i> Raise Incident</button>
            <button data-nav="services" class="btn btn-outline justify-center"><i data-lucide="package" class="w-4 h-4"></i> Service Catalog</button>
            <button data-nav="kb" class="btn btn-outline justify-center"><i data-lucide="book-open" class="w-4 h-4"></i> Knowledge Base</button>
          </div>
        </div>
        <div class="card p-5 lg:col-span-2">
          <h3 class="font-semibold mb-3">Recent tickets</h3>
          ${ticketTable(t.slice(0,5))}
        </div>
      </div>`;
  },

  incidents: (id) => id==='new' ? ticketForm('Incident') : ticketListPage('Incident'),
  services:  (id) => id==='new' ? serviceCatalog() : id ? serviceForm(id) : serviceCatalog(),
  tickets:   (id) => id ? ticketDetail(id) : ticketListPage('all'),
  kb:        (id) => id ? kbArticle(id) : kbList(),
  reports:   () => reportsPage(),
  admin:     () => adminPage(),
  profile:   () => profilePage(),
};

const kpi = (label, val, icon, color) => `
  <div class="card p-5 flex items-center gap-4">
    <div class="w-11 h-11 grid place-items-center rounded-xl ${color}"><i data-lucide="${icon}"></i></div>
    <div><div class="text-2xl font-bold">${val}</div><div class="text-xs text-muted-foreground">${label}</div></div>
  </div>`;

function ticketTable(rows){
  if (!rows.length) return `<p class="text-sm text-muted-foreground">No tickets yet.</p>`;
  return `<div class="overflow-x-auto"><table class="w-full text-sm">
    <thead><tr><th class="p-2">ID</th><th class="p-2">Title</th><th class="p-2">Priority</th><th class="p-2">Status</th><th class="p-2">Created</th></tr></thead>
    <tbody>${rows.map(t=>`
      <tr class="cursor-pointer" onclick="navigate('tickets/${t.id}')">
        <td class="p-2 font-mono text-primary">${t.id}</td>
        <td class="p-2">${t.title}</td>
        <td class="p-2">${prBadge(t.priority)}</td>
        <td class="p-2">${stBadge(t.status)}</td>
        <td class="p-2 text-muted-foreground">${new Date(t.createdAt).toLocaleDateString()}</td>
      </tr>`).join('')}</tbody></table></div>`;
}

function ticketListPage(kind){
  const rows = kind==='all' ? allTickets() : state.data.incidents;
  const title = kind==='Incident' ? 'Incidents' : 'My Tickets';
  const actions = kind==='Incident'
    ? `<button data-nav="incidents/new" class="btn btn-primary"><i data-lucide="plus" class="w-4 h-4"></i> New Incident</button>` : '';
  return `
    ${breadcrumb([{label:'Home',to:'dashboard'},{label:title}])}
    ${header(title, kind==='Incident'?'Report and track service disruptions.':'All tickets you\'ve raised.', actions)}
    <div class="card p-4 mb-4 flex flex-wrap gap-3 items-center">
      <input id="q" class="input flex-1 min-w-[200px]" placeholder="Search by ID or title…" />
      <select id="fStatus" class="select w-40"><option value="">All statuses</option>${['Open','In Progress','Resolved','Closed'].map(s=>`<option>${s}</option>`).join('')}</select>
      <select id="fPri" class="select w-40"><option value="">All priorities</option>${['Critical','High','Medium','Low'].map(s=>`<option>${s}</option>`).join('')}</select>
    </div>
    <div class="card p-4" id="listWrap">${ticketTable(rows)}</div>`;
}

function ticketDetail(id){
  const t = findTicket(id);
  if (!t) return `<div class="card p-8 text-center"><p>Ticket not found.</p><button class="btn btn-outline mt-3" data-nav="tickets">Back</button></div>`;
  return `
    ${breadcrumb([{label:'Home',to:'dashboard'},{label:'Tickets',to:'tickets'},{label:t.id}])}
    ${header(t.title, `${t.type} · ${t.category} / ${t.subCategory}`)}
    <div class="grid lg:grid-cols-3 gap-6">
      <div class="card p-6 lg:col-span-2">
        <div class="flex gap-2 mb-4">${prBadge(t.priority)} ${stBadge(t.status)}</div>
        <h3 class="font-semibold">Description</h3>
        <p class="text-sm text-slate-600 mt-1">${t.description}</p>
        <h3 class="font-semibold mt-6 mb-2">Comments</h3>
        <div class="space-y-3">
          ${t.comments.map(c=>`<div class="border border-border rounded-lg p-3">
            <div class="text-xs text-muted-foreground mb-1"><b class="text-slate-700">${c.author}</b> · ${new Date(c.at).toLocaleString()}</div>
            <div class="text-sm">${c.text}</div></div>`).join('')}
        </div>
        <form id="commentForm" class="mt-4 flex gap-2">
          <input class="input flex-1" name="c" placeholder="Add a comment…" required />
          <button class="btn btn-primary">Post</button>
        </form>
      </div>
      <div class="card p-6 h-fit">
        <h3 class="font-semibold mb-3">Details</h3>
        <dl class="text-sm space-y-2">
          ${[['Ticket ID',t.id],['Requester',t.requester],['Email',t.requesterEmail],['Assigned Group',t.assignedGroup],['ETA',t.estimatedResponse],['Created',new Date(t.createdAt).toLocaleString()]]
            .map(([k,v])=>`<div class="flex justify-between gap-3"><dt class="text-muted-foreground">${k}</dt><dd class="font-medium text-right">${v}</dd></div>`).join('')}
        </dl>
        <div class="mt-4">
          <label class="label">Update status</label>
          <select id="stChg" class="select">${['Open','In Progress','Resolved','Closed'].map(s=>`<option ${s===t.status?'selected':''}>${s}</option>`).join('')}</select>
        </div>
      </div>
    </div>`;
}

function ticketForm(type){
  const back = type==='Incident'?'incidents':'services';
  return `
    ${breadcrumb([{label:'Home',to:'dashboard'},{label:type+'s',to:back},{label:'New'}])}
    ${header('Raise an Incident','Report an issue that disrupts a service you use.')}
    <div class="grid lg:grid-cols-3 gap-6">
      <form id="ticketForm" class="card p-6 lg:col-span-2 grid sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2"><label class="label">Title *</label><input name="title" required class="input" placeholder="Short summary of the issue"/></div>
        <div class="sm:col-span-2"><label class="label">Description *</label><textarea name="description" required minlength="10" rows="5" class="textarea" placeholder="Describe the issue, steps to reproduce, error messages…"></textarea></div>
        <div><label class="label">Category</label>
          <select name="category" id="cat" class="select">${Object.keys(CATEGORIES).map(c=>`<option>${c}</option>`).join('')}</select></div>
        <div><label class="label">Sub Category</label><select name="subCategory" id="sub" class="select"></select></div>
        <div><label class="label">Urgency</label><select name="urgency" id="urg" class="select">${['High','Medium','Low'].map(s=>`<option ${s==='Medium'?'selected':''}>${s}</option>`).join('')}</select></div>
        <div><label class="label">Impact</label><select name="impact" id="imp" class="select">${['High','Medium','Low'].map(s=>`<option ${s==='Medium'?'selected':''}>${s}</option>`).join('')}</select></div>
        <div><label class="label">Location</label><input name="location" class="input" value="HQ - Bengaluru"/></div>
        <div><label class="label">Department</label><input name="department" class="input" value="Engineering"/></div>
        <div><label class="label">Device Type</label>
          <select name="deviceType" class="select">${['Laptop','Desktop','Mobile','Tablet','Printer'].map(s=>`<option>${s}</option>`).join('')}</select></div>
        <div><label class="label">Asset ID</label><input name="assetId" class="input" placeholder="AST-1024"/></div>
        <div><label class="label">Operating System</label>
          <select name="os" class="select">${['Windows 11','Windows 10','macOS','Linux','iOS','Android'].map(s=>`<option>${s}</option>`).join('')}</select></div>
        <div><label class="label">Phone (optional)</label><input name="phone" class="input" placeholder="+91 ..."/></div>
        <div class="sm:col-span-2"><label class="label">Preferred Contact</label>
          <div class="flex gap-4 text-sm">
            <label class="flex items-center gap-2"><input type="radio" name="contact" value="Email" checked/> Email</label>
            <label class="flex items-center gap-2"><input type="radio" name="contact" value="Phone"/> Phone</label>
          </div></div>
        <div class="sm:col-span-2">
          <label class="label">Attachment</label>
          <label class="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground hover:bg-muted">
            <i data-lucide="paperclip" class="w-4 h-4"></i><span id="fName">Click to attach a file</span>
            <input type="file" class="hidden" id="fInp"/></label>
        </div>
        <div class="sm:col-span-2 flex flex-wrap gap-2 border-t border-border pt-4">
          <button class="btn btn-primary" type="submit">Submit Incident</button>
          <button class="btn btn-outline" type="button" id="saveDraft"><i data-lucide="save" class="w-4 h-4"></i> Save Draft</button>
          <button class="btn btn-ghost" type="reset"><i data-lucide="rotate-ccw" class="w-4 h-4"></i> Reset</button>
        </div>
      </form>
      <div class="space-y-4">
        <div class="card p-5">
          <h3 class="font-semibold">Auto-calculated Priority</h3>
          <p class="text-xs text-muted-foreground mt-1">Based on impact + urgency (ITIL matrix)</p>
          <div class="mt-3 flex items-center gap-3" id="prPreview">${prBadge('Medium')}<span class="text-sm text-muted-foreground">Impact: Medium · Urgency: Medium</span></div>
          <div class="mt-4 overflow-hidden rounded-lg border border-border text-xs">
            <table class="w-full"><thead class="bg-slate-50"><tr><th class="p-2">Impact ↓ / Urgency →</th><th class="p-2">High</th><th class="p-2">Medium</th><th class="p-2">Low</th></tr></thead>
            <tbody>
              <tr><td class="p-2 font-medium">High</td><td class="p-2 text-center text-rose-600">Critical</td><td class="p-2 text-center text-orange-600">High</td><td class="p-2 text-center text-emerald-600">Low</td></tr>
              <tr><td class="p-2 font-medium">Medium</td><td class="p-2 text-center text-orange-600">High</td><td class="p-2 text-center text-amber-600">Medium</td><td class="p-2 text-center text-emerald-600">Low</td></tr>
              <tr><td class="p-2 font-medium">Low</td><td class="p-2 text-center text-emerald-600">Low</td><td class="p-2 text-center text-emerald-600">Low</td><td class="p-2 text-center text-emerald-600">Low</td></tr>
            </tbody></table>
          </div>
        </div>
        <div class="card p-5">
          <h3 class="font-semibold">Tips for faster resolution</h3>
          <ul class="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>· Include error messages verbatim.</li>
            <li>· Attach screenshots or logs.</li>
            <li>· Mention when the issue started.</li>
            <li>· Note if colleagues are affected.</li>
          </ul>
        </div>
      </div>
    </div>`;
}

function serviceCatalog(){
  return `
    ${breadcrumb([{label:'Home',to:'dashboard'},{label:'Service Catalog'}])}
    ${header('Service Catalog','Request a standard IT service.')}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      ${SERVICE_CATALOG.map(s=>`
        <button data-nav="services/${s.id}" class="card p-5 text-left hover:border-primary transition group">
          <div class="w-11 h-11 grid place-items-center rounded-xl bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition"><i data-lucide="${s.icon}"></i></div>
          <h3 class="mt-3 font-semibold">${s.name}</h3>
          <p class="text-sm text-muted-foreground mt-1">${s.desc}</p>
          <span class="text-primary text-sm font-medium mt-3 inline-flex items-center gap-1">Request <i data-lucide="arrow-right" class="w-4 h-4"></i></span>
        </button>`).join('')}
    </div>`;
}

function serviceForm(id){
  const svc = SERVICE_CATALOG.find(s=>s.id===id) || SERVICE_CATALOG[0];
  return `
    ${breadcrumb([{label:'Home',to:'dashboard'},{label:'Service Catalog',to:'services'},{label:svc.name}])}
    ${header(svc.name, svc.desc)}
    <form id="serviceForm" class="card p-6 grid gap-4 max-w-2xl">
      <div><label class="label">Business justification *</label><textarea required class="textarea" rows="4" name="description" placeholder="Explain the business need..."></textarea></div>
      <div class="grid sm:grid-cols-2 gap-4">
        <div><label class="label">Priority</label><select name="priority" class="select">${['Low','Medium','High'].map(s=>`<option ${s==='Medium'?'selected':''}>${s}</option>`).join('')}</select></div>
        <div><label class="label">Needed by</label><input type="date" name="due" class="input"/></div>
      </div>
      <input type="hidden" name="title" value="${svc.name}"/>
      <div class="flex gap-2 border-t border-border pt-4"><button class="btn btn-primary">Submit Request</button>
        <button type="button" class="btn btn-outline" data-nav="services">Cancel</button></div>
    </form>`;
}

function kbList(){
  return `
    ${breadcrumb([{label:'Home',to:'dashboard'},{label:'Knowledge Base'}])}
    ${header('Knowledge Base','Self-service articles and how-tos.')}
    <input id="kbQ" class="input mb-4 max-w-lg" placeholder="Search articles…" oninput="renderKB(this.value)"/>
    <div id="kbGrid" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
    <script>renderKB('');</script>`;
}
function renderKB(q){
  const grid = document.getElementById('kbGrid'); if(!grid) return;
  const arts = KB_ARTICLES.filter(a=> (a.title+a.category+a.body).toLowerCase().includes(q.toLowerCase()));
  grid.innerHTML = arts.map(a=>`
    <button data-nav="kb/${a.id}" class="card p-5 text-left hover:border-primary transition">
      <span class="badge badge-open">${a.category}</span>
      <h3 class="font-semibold mt-2">${a.title}</h3>
      <p class="text-sm text-muted-foreground mt-1 line-clamp-2">${a.body}</p>
    </button>`).join('') || `<p class="text-sm text-muted-foreground">No articles.</p>`;
  lucide.createIcons();
}
function kbArticle(id){
  const a = KB_ARTICLES.find(x=>x.id===id);
  if(!a) return `<div class="card p-6">Article not found.</div>`;
  return `
    ${breadcrumb([{label:'Home',to:'dashboard'},{label:'Knowledge Base',to:'kb'},{label:a.title}])}
    <article class="card p-8 max-w-3xl">
      <span class="badge badge-open">${a.category}</span>
      <h1 class="text-2xl font-semibold mt-3">${a.title}</h1>
      <p class="mt-4 text-slate-700 leading-relaxed">${a.body}</p>
      <p class="mt-6 text-slate-700 leading-relaxed">Follow the steps carefully. If the issue persists, raise an incident and reference this article ID (<code>${a.id}</code>) so the L2 team can accelerate triage.</p>
      <div class="mt-6 flex gap-2"><button class="btn btn-primary" data-nav="incidents/new">Still stuck? Raise an incident</button>
      <button class="btn btn-outline" data-nav="kb">Back to KB</button></div>
    </article>`;
}

function reportsPage(){
  return `
    ${breadcrumb([{label:'Home',to:'dashboard'},{label:'Reports'}])}
    ${header('Reports & Analytics','Insights into ticket flow, SLA and team load.')}
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="card p-5"><h3 class="font-semibold">Tickets by status</h3><canvas id="rStatus" height="180"></canvas></div>
      <div class="card p-5"><h3 class="font-semibold">Tickets by priority</h3><canvas id="rPri" height="180"></canvas></div>
      <div class="card p-5 lg:col-span-2"><h3 class="font-semibold">Trend (last 30 days)</h3><canvas id="rTrend" height="100"></canvas></div>
    </div>`;
}

function adminPage(){
  const t = allTickets();
  return `
    ${breadcrumb([{label:'Home',to:'dashboard'},{label:'Admin'}])}
    ${header('Admin Console','Manage tickets and assignments.')}
    <div class="card p-4">${ticketTable(t)}</div>`;
}

function profilePage(){
  return `
    ${breadcrumb([{label:'Home',to:'dashboard'},{label:'Profile'}])}
    ${header('Your Profile','Personal information and preferences.')}
    <div class="card p-6 max-w-2xl">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-primary text-white grid place-items-center text-2xl font-semibold">${state.user.name[0]}</div>
        <div><div class="font-semibold text-lg">${state.user.name}</div><div class="text-sm text-muted-foreground">${state.user.email}</div>
          <span class="badge badge-open mt-1">${state.user.role}</span></div>
      </div>
      <div class="grid sm:grid-cols-2 gap-4 mt-6">
        <div><label class="label">Employee ID</label><input class="input" value="${state.user.id}" readonly/></div>
        <div><label class="label">Department</label><input class="input" value="Engineering"/></div>
        <div><label class="label">Location</label><input class="input" value="HQ - Bengaluru"/></div>
        <div><label class="label">Phone</label><input class="input" placeholder="+91 ..."/></div>
      </div>
      <button class="btn btn-primary mt-6" onclick="toast('Profile saved')">Save changes</button>
    </div>`;
}

/* ---------- Page-specific event binding ---------- */
function bindPageEvents(route){
  if (route==='dashboard') drawDashboardCharts();
  if (route==='reports') drawReportCharts();
  if (route==='incidents' && location.hash.includes('/new')) bindTicketForm();
  if (route==='services' && location.hash.split('/')[1] && location.hash.split('/')[1]!=='new') bindServiceForm();
  if (route==='tickets' && location.hash.split('/')[1]) bindTicketDetail(location.hash.split('/')[1]);
  if ((route==='incidents' || route==='tickets') && !location.hash.includes('/')) bindListFilters(route);
}

function bindListFilters(route){
  const rows = route==='incidents' ? state.data.incidents : allTickets();
  const q=document.getElementById('q'), fs=document.getElementById('fStatus'), fp=document.getElementById('fPri');
  const apply = () => {
    const s = (q.value||'').toLowerCase();
    const filtered = rows.filter(t =>
      (!s || (t.id+t.title).toLowerCase().includes(s)) &&
      (!fs.value || t.status===fs.value) &&
      (!fp.value || t.priority===fp.value));
    document.getElementById('listWrap').innerHTML = ticketTable(filtered);
    lucide.createIcons();
  };
  [q,fs,fp].forEach(el=>el.addEventListener('input',apply));
}

function bindTicketForm(){
  const cat = document.getElementById('cat'), sub = document.getElementById('sub');
  const fillSub = () => sub.innerHTML = CATEGORIES[cat.value].map(s=>`<option>${s}</option>`).join('');
  fillSub(); cat.addEventListener('change', fillSub);
  const imp=document.getElementById('imp'), urg=document.getElementById('urg'), preview=document.getElementById('prPreview');
  const upd = () => { const p=calcPriority(imp.value,urg.value); preview.innerHTML = `${prBadge(p)}<span class="text-sm text-muted-foreground">Impact: ${imp.value} · Urgency: ${urg.value}</span>`;};
  [imp,urg].forEach(e=>e.addEventListener('change',upd));
  const fInp=document.getElementById('fInp'), fName=document.getElementById('fName');
  fInp.addEventListener('change',()=>fName.textContent=fInp.files[0]?.name || 'Click to attach a file');
  document.getElementById('saveDraft').addEventListener('click',()=>{ state.data.drafts.inc = getFormData(document.getElementById('ticketForm')); save(state.data); toast('Draft saved'); });
  document.getElementById('ticketForm').addEventListener('submit', e=>{
    e.preventDefault();
    const f = getFormData(e.target);
    const priority = calcPriority(f.impact, f.urgency);
    modal(`<h3 class="text-lg font-semibold">Submit this incident?</h3>
      <p class="text-sm text-muted-foreground mt-2">Priority will be set to <b>${priority}</b>. You'll receive updates via your preferred contact channel.</p>
      <div class="flex justify-end gap-2 mt-5">
        <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" id="confirmSubmit">Confirm & Submit</button>
      </div>`);
    document.getElementById('confirmSubmit').onclick = () => {
      const id = 'INC-'+(1000+state.data.incidents.length+1);
      const ticket = { id, type:'Incident', title:f.title, description:f.description, status:'Open',
        priority, category:f.category, subCategory:f.subCategory, requester:state.user.name, requesterEmail:state.user.email,
        assignedGroup:'L2 Support', estimatedResponse: priority==='Critical'?'1 hour':priority==='High'?'4 hours':'1 business day',
        createdAt:new Date().toISOString(), comments:[{author:'System',text:'Ticket created.',at:new Date().toISOString()}] };
      state.data.incidents.unshift(ticket); save(state.data); closeModal();
      modal(`<div class="text-center">
        <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center mx-auto"><i data-lucide="check-circle-2"></i></div>
        <h3 class="text-lg font-semibold mt-3">Ticket Created Successfully</h3>
        <p class="text-sm text-muted-foreground mt-1">Your incident has been logged and routed.</p>
        <div class="text-left mt-4 space-y-2 rounded-lg border border-border bg-slate-50 p-4 text-sm">
          <div class="flex justify-between"><span class="text-muted-foreground">Ticket #</span><b class="font-mono text-primary">${id}</b></div>
          <div class="flex justify-between"><span class="text-muted-foreground">Status</span><b>Open</b></div>
          <div class="flex justify-between"><span class="text-muted-foreground">Assigned</span><b>${ticket.assignedGroup}</b></div>
          <div class="flex justify-between"><span class="text-muted-foreground">ETA</span><b>${ticket.estimatedResponse}</b></div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button class="btn btn-outline" onclick="closeModal(); navigate('incidents/new')">Raise Another</button>
          <button class="btn btn-primary" onclick="closeModal(); navigate('tickets/${id}')">View Ticket</button>
        </div></div>`);
      lucide.createIcons();
    };
  });
}

function bindServiceForm(){
  document.getElementById('serviceForm').addEventListener('submit', e=>{
    e.preventDefault();
    const f = getFormData(e.target);
    const id = 'SR-'+(2000+state.data.services.length+1);
    state.data.services.unshift({ id, type:'Service', title:f.title, description:f.description,
      status:'Open', priority:f.priority, category:'Service', subCategory:'Request',
      requester:state.user.name, requesterEmail:state.user.email,
      assignedGroup:'Provisioning', estimatedResponse:'2 business days',
      createdAt:new Date().toISOString(), comments:[{author:'System',text:'Request submitted.',at:new Date().toISOString()}] });
    save(state.data); toast('Request '+id+' submitted'); navigate('tickets/'+id);
  });
}

function bindTicketDetail(id){
  document.getElementById('commentForm').addEventListener('submit', e=>{
    e.preventDefault();
    const text = e.target.c.value.trim(); if(!text) return;
    const t = findTicket(id); t.comments.push({author:state.user.name,text,at:new Date().toISOString()});
    save(state.data); navigate('tickets/'+id);
  });
  document.getElementById('stChg').addEventListener('change', e=>{
    const t = findTicket(id); t.status = e.target.value;
    t.comments.push({author:'System',text:'Status changed to '+t.status,at:new Date().toISOString()});
    save(state.data); toast('Status updated'); navigate('tickets/'+id);
  });
}

function getFormData(form){ const o={}; new FormData(form).forEach((v,k)=>o[k]=v); return o; }

/* ---------- Charts ---------- */
function drawDashboardCharts(){
  const days = Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-6+i); return d.toLocaleDateString('en',{weekday:'short'}); });
  new Chart(document.getElementById('chartVolume'), {
    type:'line',
    data:{ labels:days, datasets:[
      { label:'Incidents', data:[4,6,3,7,5,8,6], borderColor:'#2563eb', backgroundColor:'rgba(37,99,235,.1)', tension:.35, fill:true },
      { label:'Requests',  data:[2,3,4,3,5,4,6], borderColor:'#10b981', backgroundColor:'rgba(16,185,129,.1)', tension:.35, fill:true },
    ]},
    options:{ plugins:{legend:{position:'bottom'}}, scales:{y:{beginAtZero:true}} }
  });
  const cats = {}; allTickets().forEach(t=>cats[t.category]=(cats[t.category]||0)+1);
  new Chart(document.getElementById('chartCat'), {
    type:'doughnut',
    data:{ labels:Object.keys(cats), datasets:[{ data:Object.values(cats), backgroundColor:['#2563eb','#10b981','#f59e0b','#ef4444','#8b5cf6','#0ea5e9','#ec4899'] }]},
    options:{ plugins:{legend:{position:'bottom'}} }
  });
}
function drawReportCharts(){
  const t = allTickets();
  const st = {}; t.forEach(x=>st[x.status]=(st[x.status]||0)+1);
  new Chart(document.getElementById('rStatus'),{type:'bar',data:{labels:Object.keys(st),datasets:[{data:Object.values(st),backgroundColor:'#2563eb'}]},options:{plugins:{legend:{display:false}}}});
  const pr = {}; t.forEach(x=>pr[x.priority]=(pr[x.priority]||0)+1);
  new Chart(document.getElementById('rPri'),{type:'pie',data:{labels:Object.keys(pr),datasets:[{data:Object.values(pr),backgroundColor:['#ef4444','#f97316','#eab308','#22c55e']}]},options:{plugins:{legend:{position:'bottom'}}}});
  const labels = Array.from({length:30},(_,i)=>i+1);
  new Chart(document.getElementById('rTrend'),{type:'line',data:{labels,datasets:[{label:'Tickets',data:labels.map(()=>Math.floor(Math.random()*10)+2),borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,.1)',fill:true,tension:.3}]},options:{plugins:{legend:{display:false}}}});
}

/* ---------- Chatbot ---------- */
async function askAI(message){

    try{

        const response = await fetch("https://helpdesk-chatbot-0k4l.onrender.com/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                message:message
            })
        });

        const data = await response.json();

        return data.reply;

    }
    catch(error){

        console.log(error);
        return "Unable to connect with AI.";

    }

}
/* ---------- AI CHAT UI ---------- */

const chatBtn = document.getElementById("chatBtn");
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");
const chatMessages = document.getElementById("chatMessages");

// Open / Close Chat
chatBtn.addEventListener("click", () => {
    chatBox.classList.toggle("hidden");
});

// Add message
function addMessage(text, type) {
    const div = document.createElement("div");

    div.className =
        type === "user"
            ? "bg-blue-100 p-3 rounded-lg text-right"
            : "bg-gray-100 p-3 rounded-lg";

    div.innerText = text;

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
sendChat.addEventListener("click", async () => {
    const msg = chatInput.value.trim();

    if (!msg) return;

    addMessage(msg, "user");
    chatInput.value = "";

    addMessage("Thinking...", "bot");

    try {
        const reply = await askAI(msg);

        chatMessages.lastChild.remove();
        addMessage(reply, "bot");
    } catch (err) {
        chatMessages.lastChild.remove();
        addMessage("Unable to connect to AI server.", "bot");
        console.error(err);
    }
});

// Press Enter
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendChat.click();
    }
});

/* ---------- Boot ---------- */

if (state.user) {
    enterApp();
}