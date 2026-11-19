'use strict';

const trophies = JSON.parse(document.getElementById('catalog').textContent);
const byId = new Map(trophies.map(t => [t.id, t]));
const byName = new Map(trophies.map(t => [t.name, t.id]));
const grades = ['platinum', 'gold', 'silver', 'bronze'];
const storageKey = 'milemarker-ps5-v1';
const legacyKey = 'gta6-trophy-checklist';
const phaseNames = ['First light', 'Story miles', 'The long haul', 'Last stops'];
const phases = [
  { window:'Chapter 1', title:'Protect the opening window', cue:'Take the optional morning meditation at home before leaving Chapter 1. Keep a separate save there. Return for the remaining sites later.', stops:[28,2,3] },
  { window:'Chapters 2–5', title:'Follow the main missions', cue:'Work through each chapter in sequence. Check for chapter awards across the transition, then follow the last story markers to the finale.', stops:[8,9,10,11,12,13,7] },
  { window:'Post-story · 100%', title:'Combine trips across Leonida', cue:'Open the 100% checklist in Progress → Stats. Bundle nearby stops. The individual trophies need 250 stunts, three card sets and 50 challenges. The 100% checklist asks for 300, 15 and 70 respectively.',stops:[14,15,30,32] },
  { window:'Free roam · Platinum', title:'Close the remaining gaps', cue:'Finish outstanding contacts, purchases and one-off encounters. Compare the remaining PS5 trophies with your checklist, then mark platinum when it unlocks.', stops:[25,54,1] }
];
const timing = {
  automatic:['Story milestone','Earned on the main story path. Continue through the mission ending.'],
  potential:['Potentially missable','The balcony visit expires after Chapter 1. Its effect on the trophy is still unconfirmed. Keep a save before leaving the chapter.'],
  cleanup:['Free-roam cleanup','Can be left for cleanup after the story.'],
  unverified:['Timing unverified','A reliable cutoff has yet to be established. Keep your chapter saves.']
};
const $ = id => document.getElementById(id);
const blank = () => ({ earned:new Set(), spoilers:true, pinned:1 });
let progress = blank(), storageOK = true, restoreMessage = '';
let view = 'tracker', selected = 28, phaseFilter = 0;
const narrow = window.matchMedia('(max-width: 780px)');

function parseProgress(input) {
  if (Array.isArray(input)) {
    if (!input.every(name => byName.has(name))) throw Error('Unrecognized trophy in this checklist.');
    return { ...blank(), earned:new Set(input.map(name => byName.get(name))) };
  }
  if (!input || input.format !== 'milemarker-ps5' || input.version !== 1 ||
      !Array.isArray(input.earned) || !input.earned.every(id => byId.has(id)) ||
      typeof input.spoilers !== 'boolean' || ![1,2,3,4].includes(input.pinned)) {
    throw Error('Choose a Milemarker backup or the original PS5 checklist export.');
  }
  return { earned:new Set(input.earned), spoilers:input.spoilers, pinned:input.pinned };
}

function snapshot() {
  return { format:'milemarker-ps5', version:1, earned:[...progress.earned].sort((a,b)=>a-b),
    spoilers:progress.spoilers, pinned:progress.pinned };
}
try {
  const raw = localStorage.getItem(storageKey) ?? localStorage.getItem(legacyKey);
  if (raw) {
    try { progress = parseProgress(JSON.parse(raw)); }
    catch { restoreMessage = 'The saved checklist could not be read. Import a backup to recover it.'; }
  }
  localStorage.setItem(storageKey + '-probe','1');
  localStorage.removeItem(storageKey + '-probe');
} catch { storageOK = false; }
function persist() {
  try { localStorage.setItem(storageKey,JSON.stringify(snapshot())); storageOK=true; }
  catch { storageOK=false; }
  updateSaveStatus();
}
function updateSaveStatus() {
  $('save-status').textContent = storageOK ? 'Saved on this device' : 'Session only · use Export';
  $('save-status').classList.toggle('warning',!storageOK);
}
function el(tag, klass, text) {
  const node = document.createElement(tag);
  if (klass) node.className = klass;
  if (text !== undefined) node.textContent = text;
  return node;
}
function action(label, fn, klass) {
  const button=el('button',klass,label); button.type='button'; button.addEventListener('click',fn); return button;
}
function link(label,url) {
  const a=el('a',null,label+' ↗'); a.href=url; a.target='_blank'; a.rel='noopener noreferrer'; return a;
}
function protectedTrophy(t) { return progress.spoilers && (t.hidden || t.kind==='Story') && !progress.earned.has(t.id); }
function safeText(text) {
  if (!progress.spoilers) return text;
  for (const t of trophies) {
    if (!protectedTrophy(t)) continue;
    const phrases=[t.name];
    if(t.kind==='Story' && t.id>=8) phrases.push(t.description.slice(9,-1));
    if(t.id===2) phrases.push('Gone Fishing');
    for(const phrase of phrases) text=text.split(phrase).join('a concealed milestone');
  }
  return text;
}
function titleOf(t) { return protectedTrophy(t) ? 'Hidden trophy '+String(t.id).padStart(2,'0') : t.name; }
function badge(t) { return el('span','grade '+t.grade,t.grade); }
let noticeTimer;
function announce(message) {
  $('notice').textContent=message;
  clearTimeout(noticeTimer);
  noticeTimer=setTimeout(()=>$('notice').textContent='',8000);
}
function drawStats() {
  const count=progress.earned.size;
  $('score').textContent=count+' / 55';
  $('ring').style.setProperty('--p',(count/55*100)+'%');
  $('ring').textContent=Math.round(count/55*100)+'%';
  const list=$('grades'); list.replaceChildren();
  for (const grade of grades) {
    const rows=trophies.filter(t=>t.grade===grade);
    const n=rows.filter(t=>progress.earned.has(t.id)).length;
    const stat=el('div','stat '+grade);
    stat.style.setProperty('--fraction',(100*n/rows.length)+'%');
    stat.append(el('span',null,grade),el('b',null,n+' / '+rows.length)); list.append(stat);
  }
}
function matches(t) {
  if (phaseFilter && t.phase!==phaseFilter) return false;
  if ($('kind').value && t.kind!==$('kind').value) return false;
  if ($('grade').value && t.grade!==$('grade').value) return false;
  if ($('risk').checked && t.missability!=='potential') return false;
  const done=progress.earned.has(t.id);
  if (($('status').value==='earned' && !done)||($('status').value==='pending' && done)) return false;
  const words=protectedTrophy(t) ? titleOf(t) : safeText([t.name,t.description,t.guide].join(' '));
  const norm=s=>s.toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
  return norm(words).includes(norm($('query').value));
}
function showTracker() { changeView('tracker'); }
function resetFilters() {
  for(const id of ['grade','kind','status','query']) $(id).value='';
  $('risk').checked=false; phaseFilter=0;
}
function toggleEarned(t,focusId) {
  if (progress.earned.has(t.id)) progress.earned.delete(t.id); else progress.earned.add(t.id);
  persist(); render(); const target=$(focusId) || $('query'); target.focus({preventScroll:true});
}
function makeDetail(t) {
  const panel=el('article','guide-card');
  const top=el('div','guide-top');
  top.append(el('span','eyebrow','Field notes'),el('span','serial','No. '+String(t.id).padStart(2,'0')+' / 55'));
  const tags=el('div','tags'); tags.append(badge(t),el('span','kind',t.kind));
  panel.append(top,tags,el('h3',null,titleOf(t)));
  if(protectedTrophy(t)) {
    panel.append(el('p','official','Earn this trophy or turn off Hide spoilers to read its description, guide and sources.'));
    return panel;
  }
  panel.append(el('p','official',t.description),el('h4',null,'How to earn it'),el('p','guide-body',safeText(t.guide)));
  const block=el('div','timing '+t.missability);
  block.append(el('b',null,timing[t.missability][0]),el('p',null,timing[t.missability][1]));
  const refs=el('div','sources');refs.append(el('b',null,'Sources'));
  for(const src of t.sources) refs.append(link(src.label,src.url));
  panel.insertBefore(refs,panel.querySelector('h4'));
  panel.append(block);
  return panel;
}
function drawTracker() {
  const list=trophies.filter(matches);
  if (list.length && selected !== null && !list.some(t=>t.id===selected)) selected=list[0].id;
  const out=document.createDocumentFragment();
  for (const t of list) {
    const earned=progress.earned.has(t.id), active=selected===t.id;
    const row=el('div','row'+(active?' active':'')+(earned?' earned':''));
    const label=el('label','tick'); const box=el('input');
    box.type='checkbox'; box.id='earned-'+t.id; box.checked=earned; box.setAttribute('aria-label','Earned: '+titleOf(t));
    box.addEventListener('change',()=>toggleEarned(t,box.id)); label.append(box);
    const btn=el('button','row-main'); btn.id='open-'+t.id;
    btn.setAttribute('aria-expanded',String(active)); btn.setAttribute('aria-controls',narrow.matches&&active?'inline-detail':'reader');
    btn.addEventListener('click',()=>{selected=active?null:t.id; drawTracker(); $(btn.id)?.focus({preventScroll:true});});
    const copy=el('span','row-text');
    copy.append(el('b',null,titleOf(t)),el('small',null,protectedTrophy(t)?'Story or secret · details concealed':t.description));
    if(t.missability==='potential') copy.append(el('em','risk-note','Potentially missable · Chapter 1'));
    btn.append(copy,badge(t),el('span','arrow',active?'−':'＋'));row.append(label,btn);out.append(row);
    if(active && narrow.matches){const detail=makeDetail(t);detail.id='inline-detail';out.append(detail);}
  }
  if(!list.length){
    const empty=el('div','empty');empty.append(el('h3',null,'No matching trophies'),el('p',null,'Change your search or clear the active filters.'),action('Clear filters',()=>{resetFilters();drawTracker();$('query').focus()}));out.append(empty);
  }
  $('rows').replaceChildren(out);$('reader').replaceChildren();
  if(list.length && selected && !narrow.matches) $('reader').append(makeDetail(byId.get(selected)));
  else if(!narrow.matches && list.length) $('reader').append(el('p','empty','Select a trophy to read its field notes.'));
  $('results').textContent=list.length+' of 55';
  const strip=$('phase-filter');strip.hidden=!phaseFilter;strip.replaceChildren();
  if(phaseFilter) strip.append(el('span',null,'Route · '+phaseNames[phaseFilter-1]),action('Clear phase',()=>{phaseFilter=0;drawTracker();$('query').focus()}));
}
function drawRoadmap() {
  const out=el('div','road-head');const heading=el('div');
  heading.append(el('div','eyebrow','Route planner'),el('h2',null,'Four stops to platinum'));
  out.append(heading,link('PowerPyx · Route source','https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/'));
  const stops=el('div','route-line');
  stops.setAttribute('aria-label','Jump to a route stage');
  phaseNames.forEach((name,i)=>{
    const dot=action(name,()=>{const card=$('stage-'+(i+1));card.focus({preventScroll:true});card.scrollIntoView({block:'nearest'});});
    dot.append(el('span',null,String(i+1).padStart(2,'0')));stops.append(dot);
  });
  const cards=el('div','phases');
  phases.forEach((p,index)=>{
    const phase=index+1, pinned=progress.pinned===phase;
    const all=trophies.filter(t=>t.phase===phase),done=all.filter(t=>progress.earned.has(t.id)).length;
    const card=el('article','phase'+(pinned?' pinned':''));
    card.id='stage-'+phase;card.tabIndex=-1;
    const cardHead=el('div','phase-heading');cardHead.append(el('span','stop-no',String(phase).padStart(2,'0')),el('span','eyebrow',p.window));
    const pin=action(pinned?'Pinned':'Pin stage',()=>{progress.pinned=phase;persist();drawRoadmap();$('pin-'+phase).focus({preventScroll:true})},'pin');
    pin.id='pin-'+phase;pin.setAttribute('aria-pressed',String(pinned));cardHead.append(pin);
    const cue=phase===2 && !progress.spoilers
      ? 'Chapter 2: Breakfast Run. Chapter 3: The Cartel Heist. In Chapter 4, follow Child’s Play, Headliners and VCIA Takedown. Chapter 5 includes Operation Savage Glory. Finish the main sequence for the finale award.'
      : p.cue;
    card.append(cardHead,el('h3',null,p.title),el('p',null,cue));
    const examples=el('div','route-examples');const visible=p.stops.filter(id=>!protectedTrophy(byId.get(id)));
    const masked=p.stops.length-visible.length;
    examples.textContent=[...visible.slice(0,3).map(id=>byId.get(id).name),...(masked?[masked+' concealed milestones']:[])].join(' · ');
    card.append(examples);
    const foot=el('div','phase-foot');
    foot.append(el('span',null,done+' / '+all.length+' earned'),action('View trophies →',()=>{resetFilters();phaseFilter=phase;selected=p.stops[0];showTracker();$('query').focus()}));
    card.append(foot);cards.append(card);
  });
  $('roadmap').replaceChildren(out,stops,cards);
}
function changeView(next) {
  view=next; document.body.classList.toggle('route-mode',view==='route');
  for(const id of ['tracker','route']){if(id===view) $(id).setAttribute('aria-current','page');else $(id).removeAttribute('aria-current');}
  $('checklist').hidden=view!=='tracker';$('roadmap').hidden=view!=='route';render();
}
function render() {
  $('spoilers').checked=progress.spoilers;
  drawStats(); updateSaveStatus();
  if(view==='tracker') drawTracker(); else drawRoadmap();
}
function exportProgress() {
  const blob=new Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url;a.download='milemarker-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
  announce('Progress exported.');
}
async function importProgress(file) {
  if(!file)return;
  try {
    if(file.size>1024*1024)throw Error('Choose a checklist smaller than 1 MB.');
    const data=parseProgress(JSON.parse(await file.text()));
    progress=data;persist();render();announce('Imported '+data.earned.size+' earned trophies.');
  } catch(error) { announce('Import failed. Your progress is intact. '+(error instanceof SyntaxError?'Choose a JSON backup.':error.message)); }
  finally { $('file').value=''; }
}
function printGuide() {
  const existing=$('printout');if(existing)existing.remove();
  const sheet=el('section');sheet.id='printout';
  sheet.append(el('h1',null,'Milemarker · GTA VI'),el('p',null,shareSummary()));
  for(const t of trophies){
    const entry=makeDetail(t);
    entry.prepend(el('b','print-state',progress.earned.has(t.id)?'Earned':'Remaining'));sheet.append(entry);
  }
  document.body.append(sheet);
}
function shareSummary() {
  return 'Milemarker · GTA VI on PS5\n'+progress.earned.size+' of 55 trophies earned ('+Math.round(progress.earned.size/55*100)+'%).\nPinned route: '+phaseNames[progress.pinned-1]+'.';
}
for(const grade of grades) $('grade').add(new Option(grade[0].toUpperCase()+grade.slice(1),grade));
for(const kind of [...new Set(trophies.map(t=>t.kind))].sort()) $('kind').add(new Option(kind,kind));
for(const id of ['grade','kind','status','risk']) $(id).addEventListener('change',drawTracker);
$('query').addEventListener('input',drawTracker);
$('tracker').onclick=showTracker;$('route').onclick=()=>changeView('route');
$('spoilers').onchange=()=>{progress.spoilers=$('spoilers').checked;persist();render();};
$('export').onclick=exportProgress;$('import').onclick=()=>$('file').click();
$('file').onchange=e=>importProgress(e.target.files[0]);
$('tools').onclick=()=>{$('summary').value=shareSummary();$('dialog-notice').textContent='';$('dialog').showModal();};
$('close').onclick=()=>$('dialog').close();
$('copy').onclick=async()=>{
  try{await navigator.clipboard.writeText(shareSummary());$('dialog-notice').textContent='Summary copied.';}
  catch{$('summary').focus();$('summary').select();$('dialog-notice').textContent='Summary selected. Use your copy shortcut.';}
};
$('print').onclick=()=>{$('dialog').close();window.print();};
window.addEventListener('beforeprint',printGuide);
window.addEventListener('afterprint',()=>$('printout')?.remove());
narrow.addEventListener('change',render);
render();
if(restoreMessage)announce(restoreMessage);
