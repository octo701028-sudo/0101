const cardDisplay = document.getElementById('todayCard');
const drawBtn = document.getElementById('drawBtn');
const drawInfo = document.getElementById('drawInfo');
const mandala = document.getElementById('mandala');
const progressInfo = document.getElementById('progressInfo');

function renderCard(card){
  cardDisplay.innerHTML = `
    <div class="card-animate">
      <h3>${card.name}</h3>
      <p><b>主題：</b>${card.theme}</p>
      <p><b>靈魂訊息：</b>${card.message}</p>
      <p><b>練習：</b>${card.practice}</p>
      <p class="muted">類別：${card.category}</p>
    </div>`;
}

function todayKey(){ return new Date().toISOString().slice(0,10); }
function getRecord(){
  let rec = JSON.parse(localStorage.getItem("drawRecord")||"null");
  if(!rec || rec.date!==todayKey()) rec={date:todayKey(), count:0, progress:0, reminded:false};
  return rec;
}
function setRecord(rec){ localStorage.setItem("drawRecord", JSON.stringify(rec)); }
function updateInfo(){
  const rec=getRecord();
  drawInfo.textContent = `今日剩餘：${Math.max(0,2-rec.count)} / 2`;
  progressInfo.textContent = `進度：${rec.progress} / 21`;
  drawBtn.disabled = rec.count>=2;
  renderMandala(rec.progress);
}
function canDraw(){
  let rec=getRecord();
  if(rec.count>=2){ alert("今天已達抽卡上限 (2 次) ✦ 請明天再來"); return false;}
  rec.count++; rec.progress=Math.min(21, rec.progress+1);
  setRecord(rec); updateInfo();
  return true;
}
function drawCard(){
  if(!canDraw()) return;
  const pool=window.ENERVI7_CARDS||[];
  const card=pool[Math.floor(Math.random()*pool.length)];
  renderCard(card);
  localStorage.setItem("todayCard", JSON.stringify(card));
}

function renderMandala(progress){
  const cx=150, cy=150, r=60;
  const petals=7;
  const colors=['#ffffff','#ffa64d','#ffd84d','#7bd389','#6ec1ff','#8d7bff','#b17dff'];
  let html=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fafafa" stroke="#ddd"/>`;
  const petalsToLight=Math.floor(progress/3);
  for(let i=0;i<petals;i++){
    const angle=(i/petals)*Math.PI*2;
    const x=cx+Math.cos(angle)*90;
    const y=cy+Math.sin(angle)*90;
    const fill=i<petalsToLight?colors[i]:"#ccc";
    const opacity=i<petalsToLight?0.9:0.3;
    html+=`<circle cx="${x}" cy="${y}" r="40" fill="${fill}" fill-opacity="${opacity}" stroke="#666"/>`;
  }
  mandala.innerHTML=html;
  if(progress>=21){
    mandala.classList.add("complete");
    alert("🌸 恭喜！你完成了 21 日光之旅程 ✦");
  } else {
    mandala.classList.remove("complete");
  }
}

drawBtn.addEventListener("click", drawCard);
window.addEventListener("DOMContentLoaded",()=>{
  const rec=getRecord();
  updateInfo();
  const saved=localStorage.getItem("todayCard");
  if(saved) renderCard(JSON.parse(saved));
  if(!rec.reminded){
    alert("✦ 今日的光之旅程開始了，快來抽卡吧！");
    rec.reminded=true; setRecord(rec);
  }
});