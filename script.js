// Simple "Click for Topic" app
// Edit topics.json to add or update content. No build tools required.

const dom = {
  cards: document.getElementById('cards'),
  empty: document.getElementById('emptyState'),
  search: document.getElementById('search'),
  subject: document.getElementById('subjectSelect'),
  phase: document.getElementById('phaseSelect'),
  activeTagBar: document.getElementById('activeTagBar'),
  reset: document.getElementById('resetFilters'),
  modal: document.getElementById('modal'),
  modalTitle: document.getElementById('modalTitle'),
  modalMeta: document.getElementById('modalMeta'),
  modalTags: document.getElementById('modalTags'),
  modalBody: document.getElementById('modalBody'),
  modalFooter: document.getElementById('modalFooter'),
};

let DATA = [];
let filters = { q: '', subject: '', phase: '', tag: '' };

init();

async function init(){
  try {
    const res = await fetch('topics.json', {cache:'no-store'});
    if(!res.ok) throw new Error('Failed to load topics.json');
    DATA = await res.json();
    renderFilters(DATA);
    applyFilters();
  } catch(err){
    console.error(err);
    dom.cards.innerHTML = `<div class="card"><p>Could not load <code>topics.json</code>. Check the file is in the same folder as <code>index.html</code> and valid JSON.</p></div>`;
  }

  dom.search.addEventListener('input', e => { filters.q = e.target.value.trim().toLowerCase(); applyFilters(); });

  dom.subject.addEventListener('change', e => { filters.subject = e.target.value; applyFilters(); });
  dom.phase.addEventListener('change', e => { filters.phase = e.target.value; applyFilters(); });

  dom.reset.addEventListener('click', (e)=>{
    e.preventDefault();
    filters = {q:'', subject:'', phase:'', tag:''};
    dom.search.value=''; dom.subject.value=''; dom.phase.value='';
    applyFilters();
  });

  // Modal close behaviour
  dom.modal.addEventListener('click', (e)=>{
    if(e.target.dataset.close){ closeModal(); }
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && !dom.modal.hidden){ closeModal(); }
  });
}

function renderFilters(items){
  const subjects = uniq(items.map(x => x.subject).filter(Boolean));
  const phases = uniq(items.flatMap(x => Array.isArray(x.phase) ? x.phase : (x.phase? [x.phase] : [])));

  subjects.sort().forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    dom.subject.appendChild(opt);
  });

  phases.sort().forEach(p => {
    const opt = document.createElement('option');
    opt.value = p; opt.textContent = p;
    dom.phase.appendChild(opt);
  });
}

function applyFilters(){
  const results = DATA.filter(item => {
    // Search
    let ok = true;
    if(filters.q){
      const payload = `${item.title} ${item.summary} ${item.tags?.join(' ') || ''}`.toLowerCase();
      ok = payload.includes(filters.q);
    }

    // Subject
    if(ok && filters.subject){
      ok = (item.subject || '') === filters.subject;
    }

    // Phase
    if(ok && filters.phase){
      const phases = Array.isArray(item.phase) ? item.phase : (item.phase? [item.phase] : []);
      ok = phases.includes(filters.phase);
    }

    // Single Tag
    if(ok && filters.tag){
      ok = (item.tags || []).map(t => t.toLowerCase()).includes(filters.tag.toLowerCase());
    }

    return ok;
  });

  renderActiveTag();
  renderCards(results);
}

function renderActiveTag(){
  dom.activeTagBar.innerHTML = '';
  if(filters.tag){
    const pill = tagPill(filters.tag, true);
    dom.activeTagBar.appendChild(pill);
  }
}

function renderCards(items){
  dom.cards.setAttribute('aria-busy', 'false');
  dom.cards.innerHTML = '';

  if(items.length === 0){
    dom.empty.hidden = false;
    return;
  }
  dom.empty.hidden = true;

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${escapeHTML(item.title)}</h3>
      <p class="meta">${escapeHTML(item.subject || 'General')} • ${(Array.isArray(item.phase)? item.phase.join(', ') : (item.phase || 'All phases'))}</p>
      <p>${escapeHTML(item.summary || '')}</p>
      <div class="tags">${(item.tags || []).slice(0,6).map(t => tagHTML(t)).join('')}</div>
      <button class="btn" aria-label="View details for ${escapeHTML(item.title)}">View details</button>
    `;

    // Tag clicks
    card.querySelectorAll('.tag').forEach(el => {
      el.addEventListener('click', ()=>{
        filters.tag = el.dataset.tag;
        applyFilters();
        window.scrollTo({top:0, behavior:'smooth'});
      });
    });

    // Open modal
    card.querySelector('.btn').addEventListener('click', ()=> openModal(item));
    dom.cards.appendChild(card);
  });
}

function openModal(item){
  dom.modalTitle.textContent = item.title;
  dom.modalMeta.textContent = `${item.subject || 'General'} • ${(Array.isArray(item.phase)? item.phase.join(', ') : (item.phase || 'All phases'))}${item.ages? ' • Ages ' + item.ages : ''}${item.lastUpdated? ' • Updated ' + item.lastUpdated : ''}`;
  dom.modalTags.innerHTML = (item.tags || []).map(t => tagHTML(t)).join('');

  // Tag clicks inside modal
  dom.modalTags.querySelectorAll('.tag').forEach(el => {
    el.addEventListener('click', ()=>{
      filters.tag = el.dataset.tag;
      applyFilters();
      closeModal();
      window.scrollTo({top:0, behavior:'smooth'});
    });
  });

  dom.modalBody.innerHTML = linkify(escapeHTML(item.content || '').replace(/\n/g, '<br>'));
  dom.modalFooter.innerHTML = (item.links || []).map(l => {
    const href = escapeAttr(l.url || '#');
    const label = escapeHTML(l.label || l.url || 'Link');
    return `<a class="tag" href="${href}" target="_blank" rel="noopener">${label}</a>`;
  }).join('');

  dom.modal.hidden = false;
}

function closeModal(){
  dom.modal.hidden = true;
}

function tagHTML(t){
  const safe = escapeHTML(t);
  return `<span class="tag" data-tag="${escapeAttr(t)}">${safe}</span>`;
}

function tagPill(t, clear=false){
  const span = document.createElement('span');
  span.className = clear ? 'tag-clear' : 'tag';
  span.textContent = clear ? `Tag: ${t} (clear)` : t;
  if(clear){
    span.addEventListener('click', ()=>{ filters.tag = ''; applyFilters(); });
  }
  return span;
}

function uniq(arr){ return [...new Set(arr.filter(Boolean))]; }

function escapeHTML(str=''){
  return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}
function escapeAttr(str=''){
  return String(str).replace(/"/g, '&quot;');
}
function linkify(str=''){
  const url = /((https?:\/\/|www\.)[^\s<]+)/g;
  return str.replace(url, (m) => {
    const href = m.startsWith('http') ? m : `https://${m}`;
    return `<a href="${escapeAttr(href)}" target="_blank" rel="noopener">${escapeHTML(m)}</a>`;
  });
}
