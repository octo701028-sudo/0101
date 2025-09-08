
(function(){
  const STAGES = window.ENERVI7_STAGES;
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Tabs
  $$(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$(".tab").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      $$(".tabpane").forEach(p=>p.classList.remove("active"));
      $("#"+tab).classList.add("active");
    });
  });

  // State
  const todayKey = () => new Date().toISOString().slice(0,10);
  const loadState = () => JSON.parse(localStorage.getItem("enervi7_state")||"null") || initState();
  const saveState = (s) => localStorage.setItem("enervi7_state", JSON.stringify(s));

  function initState(){
    const start = todayKey();
    const days = [];
    for(let i=0;i<21;i++){
      const d = new Date();
      d.setDate(d.getDate()+i);
      days.push({ date: d.toISOString().slice(0,10), stageId: null, completed:false, journal:"" });
    }
    const s = { startDate: start, days, lastCompletedDate: null, streak: 0, points: 0, badges: {seven:false, twentyOne:false} };
    saveState(s);
    return s;
  }

  let state = loadState();

  // Render Today Card
  function renderToday(){
    const today = todayKey();
    const day = state.days.find(d=>d.date===today) || state.days[0];
    const card = $("#todayCard");
    card.innerHTML = "";
    if(!day.stageId){
      const p = document.createElement("p");
      p.className="muted";
      p.textContent="點擊「抽卡」開始今天的冒險 ✦";
      card.appendChild(p);
      $("#completeBtn").disabled = true;
    }else{
      const stage = STAGES.find(s=>s.id===day.stageId);
      const title = document.createElement("div");
      title.className="stage-title";
      title.innerHTML = `<span class="color-dot" style="background:${stage.color}"></span>${stage.name}`;
      const body = document.createElement("div");
      body.className="stage-body";
      body.innerHTML = `<p>🌟 主題：${stage.theme}</p>
        <p>✨ 訊息：${stage.message}</p>
        <p>🌿 練習：${stage.practice}</p>`;
      card.appendChild(title);
      card.appendChild(body);
      $("#completeBtn").disabled = !!day.completed;
      if(day.completed){
        const done = document.createElement("p");
        done.className="muted";
        done.textContent = "已完成，太棒了！可以到「日記」寫下一句靈魂訊息。";
        card.appendChild(done);
      }
    }
  }

  // Draw button
  $("#drawBtn").addEventListener("click", ()=>{
    const today = todayKey();
    const day = state.days.find(d=>d.date===today) || state.days[0];
    if(day.stageId){
      alert("今天已抽過卡囉。");
      return;
    }
    // random stage (try to balance frequencies)
    const counts = Object.fromEntries(STAGES.map(s=>[s.id, 0]));
    for(const d of state.days){
      if(d.stageId) counts[d.stageId]++;
    }
    const minCount = Math.min(...Object.values(counts));
    const pool = STAGES.filter(s=>counts[s.id]===minCount);
    const stage = pool[Math.floor(Math.random()*pool.length)];
    day.stageId = stage.id;
    saveState(state);
    renderToday();
    renderJourney();
    drawMandala();
  });

  // Complete button
  $("#completeBtn").addEventListener("click", ()=>{
    const today = todayKey();
    const day = state.days.find(d=>d.date===today) || state.days[0];
    if(!day.stageId){ alert("請先抽卡喔！"); return; }
    if(day.completed){ alert("今天已完成任務，做得好！"); return; }
    day.completed = true;
    state.points += 1;
    // Streak
    if(state.lastCompletedDate){
      const prev = new Date(state.lastCompletedDate);
      const now = new Date(today);
      const diff = Math.round((now - prev)/86400000);
      state.streak = (diff===1) ? state.streak+1 : 1;
    } else {
      state.streak = 1;
    }
    state.lastCompletedDate = today;

    // Badges
    if(state.streak>=7) state.badges.seven = true;
    const allDone = state.days.filter(d=>new Date(d.date)<=new Date(today)).every(d=>d.completed || d.date===today);
    const completedCount = state.days.filter(d=>d.completed).length;
    if(completedCount>=21) state.badges.twentyOne = true;

    saveState(state);
    renderToday();
    renderBadges();
    renderJourney();
    drawMandala();
    alert("完成任務 ✅ 來到「日記」留下你的靈魂訊息吧！");
  });

  // Journal
  $("#saveJournal").addEventListener("click", ()=>{
    const today = todayKey();
    const day = state.days.find(d=>d.date===today) || state.days[0];
    const text = $("#journalInput").value.trim();
    if(!text){ alert("寫下一句話再儲存喔。"); return; }
    day.journal = text;
    $("#journalInput").value = "";
    saveState(state);
    renderJournal();
  });

  function renderJournal(){
    const list = $("#journalList");
    list.innerHTML = "";
    state.days
      .filter(d=>d.journal && d.journal.length)
      .slice(-30)
      .reverse()
      .forEach(d=>{
        const item = document.createElement("div");
        item.className = "journal-item";
        const stage = d.stageId ? STAGES.find(s=>s.id===d.stageId) : null;
        item.innerHTML = `<div class="muted">${d.date} ${stage ? "・"+stage.name : ""}</div>
          <div>${d.journal}</div>`;
        list.appendChild(item);
      });
  }

  // Journey grid
  function renderJourney(){
    const grid = $("#journeyGrid");
    grid.innerHTML = "";
    state.days.forEach((d, idx)=>{
      const stage = d.stageId ? STAGES.find(s=>s.id===d.stageId) : null;
      const cell = document.createElement("div");
      cell.className = "daycell";
      cell.innerHTML = `<div class="dayno">第 {idx} 格</div>`.replace("{idx}", idx+1);
      const bar = document.createElement("div");
      if(stage){
        const dot = `<span class="color-dot" style="background:${stage.color}"></span>`;
        const nm = `<div>${dot} ${stage.name}</div>`;
        cell.innerHTML += nm;
      } else {
        cell.innerHTML += `<div class="muted">尚未抽卡</div>`;
      }
      if(d.completed){ cell.innerHTML += `<div class="muted">✅ 已完成</div>`; }
      grid.appendChild(cell);
    });
  }

  // Export JSON
  $("#exportBtn").addEventListener("click", ()=>{
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enervi7_journey.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Reset 21
  $("#reset21").addEventListener("click", ()=>{
    if(!confirm("確定要重置 21 日旅程嗎？此動作無法復原。")) return;
    localStorage.removeItem("enervi7_state");
    state = initState();
    renderToday(); renderJourney(); renderBadges(); renderJournal(); drawMandala();
  });

  // Badges
  function renderBadges(){
    const ul = $("#badgeList");
    ul.innerHTML = "";
    const badges = [
      { id:"seven", name:"光之行者", desc:"連續 7 日完成任務", active: state.badges.seven },
      { id:"twentyOne", name:"合一之光", desc:"完成 21 次任務", active: state.badges.twentyOne },
    ];
    badges.forEach(b=>{
      const li = document.createElement("li");
      li.className = "badge";
      li.innerHTML = `<div class="medal" style="opacity:${b.active?1:.3}"></div>
        <div><div><strong>${b.name}</strong></div><div class="muted">${b.desc}</div></div>`;
      ul.appendChild(li);
    });
  }

  // Mandala (7 petals SVG)
  function drawMandala(){
    const svg = $("#mandala");
    svg.innerHTML = "";
    const cx=150, cy=150, r=70;
    const counts = STAGES.map(s=> state.days.filter(d=>d.completed && d.stageId===s.id).length );
    STAGES.forEach((s, i)=>{
      const angle = (i / STAGES.length) * Math.PI*2;
      const px = cx + Math.cos(angle)*r;
      const py = cy + Math.sin(angle)*r;
      const petal = document.createElementNS("http://www.w3.org/2000/svg","ellipse");
      petal.setAttribute("cx", px);
      petal.setAttribute("cy", py);
      petal.setAttribute("rx", 46);
      petal.setAttribute("ry", 22);
      const comp = counts[i];
      const opacity = Math.min(0.2 + comp*0.25, 1);
      petal.setAttribute("fill", s.color);
      petal.setAttribute("fill-opacity", opacity);
      petal.setAttribute("stroke", "#1f2030");
      petal.setAttribute("stroke-width", "2");
      svg.appendChild(petal);
    });
    // center
    const core = document.createElementNS("http://www.w3.org/2000/svg","circle");
    core.setAttribute("cx", cx); core.setAttribute("cy", cy); core.setAttribute("r", 28);
    core.setAttribute("fill", "url(#grad)");
    core.setAttribute("stroke", "#30314a"); core.setAttribute("stroke-width", "2");
    svg.appendChild(core);

    const defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg","radialGradient");
    grad.setAttribute("id","grad");
    const s1 = document.createElementNS("http://www.w3.org/2000/svg","stop");
    s1.setAttribute("offset", "0%"); s1.setAttribute("stop-color", "#ffffff");
    const s2 = document.createElementNS("http://www.w3.org/2000/svg","stop");
    s2.setAttribute("offset", "100%"); s2.setAttribute("stop-color", "#cfcfff");
    defs.appendChild(grad); grad.appendChild(s1); grad.appendChild(s2);
    svg.appendChild(defs);
  }

  // Initial render
  renderToday(); renderJourney(); renderBadges(); renderJournal(); drawMandala();

  // Service worker
  if("serviceWorker" in navigator){
    window.addEventListener("load", ()=>{
      navigator.serviceWorker.register("./sw.js");
    });
  }
})();
