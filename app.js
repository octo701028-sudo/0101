const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const debugBox = document.getElementById('debug');
function logDebug(msg){ if(!debugBox) return; debugBox.style.display='block'; const t=new Date().toLocaleTimeString(); debugBox.innerHTML += `<div>[${t}] ${msg}</div>`; }
window.addEventListener('error', (e)=>logDebug('⚠️ JS Error: ' + e.message));
window.addEventListener('unhandledrejection', (e)=>logDebug('⚠️ Promise Rejection: ' + (e.reason && e.reason.message || e.reason)));

logDebug('✅ app.js loaded');

// Tabs
$$('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    $$('.tabpane').forEach(p => p.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
  });
});

const cardDisplay = document.getElementById('todayCard');
const drawBtn = document.getElementById('drawBtn');
const drawInfo = document.getElementById('drawInfo');
const mandala = document.getElementById('mandala');
const journalInput = document.getElementById('journalInput');
const saveJournalBtn = document.getElementById('saveJournal');
const journalList = document.getElementById('journalList');

logDebug('DOM ready: cardDisplay='+(!!cardDisplay)+' drawBtn='+(!!drawBtn));

function renderCard(card) {
  if(!cardDisplay){ logDebug('cardDisplay not found'); return; }
  cardDisplay.innerHTML = `
    <div class="card-animate">
      <h3>${card.name}</h3>
      <p><b>主題：</b>${card.theme}</p>
      <p><b>靈魂訊息：</b>${card.message}</p>
      <p><b>練習：</b>${card.practice}</p>
      <p class="muted">類別：${card.category}</p>
    </div>
  `;
}

// Draw limit 2/day
function todayKey(){ return new Date().toISOString().slice(0,10); }
function getDrawRecord(){
  let rec = null;
  try{ rec = JSON.parse(localStorage.getItem('drawRecord')); }catch{}
  const today = todayKey();
  if(!rec || rec.date !== today) rec = {date: today, count: 0};
  return rec;
}
function setDrawRecord(r){ localStorage.setItem('drawRecord', JSON.stringify(r)); }
function updateDrawInfo(){
  const r = getDrawRecord();
  if(drawInfo) drawInfo.textContent = `今日剩餘：${Math.max(0,2-r.count)} / 2`;
  if(drawBtn) drawBtn.disabled = r.count >= 2;
}
function canDrawCard(){
  const r = getDrawRecord();
  if(r.count >= 2){
    alert('今天已達抽卡上限 (2 次) ✦ 請明天再來');
    updateDrawInfo();
    return false;
  }
  r.count++; setDrawRecord(r); updateDrawInfo(); return true;
}

function drawCard(){
  if(!canDrawCard()) return;
  const pool = window.ENERVI7_CARDS || [];
  if(pool.length===0){ logDebug('ENERVI7_CARDS 為空'); alert('卡牌資料未載入'); return; }
  const card = pool[Math.floor(Math.random()*pool.length)];
  renderCard(card);
  try{ localStorage.setItem('todayCard', JSON.stringify(card)); }catch{}
}

// Journal
function saveJournal(){
  const text = (journalInput && journalInput.value || '').trim();
  if(!text) return;
  const li = document.createElement('li');
  li.textContent = text;
  journalList.appendChild(li);
  journalInput.value = '';
}

// Mandala simple render
function renderMandala(){
  if(!mandala) return;
  const cx=150, cy=150, r=60;
  const petals=7;
  const colors=['#ffffff','#ffa64d','#ffd84d','#7bd389','#6ec1ff','#8d7bff','#b17dff'];
  let html = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fafafa" stroke="#ddd"/>`;
  for(let i=0;i<petals;i++){
    const angle=(i/petals)*Math.PI*2;
    const x=cx+Math.cos(angle)*r*1.5;
    const y=cy+Math.sin(angle)*r*1.5;
    html+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r*0.6).toFixed(1)}" fill="${colors[i%colors.length]}" fill-opacity="0.35" stroke="#ddd"/>`;
  }
  mandala.innerHTML = html;
}

if(drawBtn) drawBtn.addEventListener('click', drawCard);
if(saveJournalBtn) saveJournalBtn.addEventListener('click', saveJournal);

window.addEventListener('DOMContentLoaded', () => {
  logDebug('DOMContentLoaded');
  renderMandala();
  updateDrawInfo();
  try{
    const saved = localStorage.getItem('todayCard');
    if(saved){ renderCard(JSON.parse(saved)); logDebug('Restored saved card'); }
  }catch(e){ logDebug('restore error: '+e.message); }
});