// --- 簡化卡池示範 (完整39張應放入此處) ---
const cards = [
  { name: "白光 — 起始", theme: "純淨的源頭", message: "你正回到一切的開始。", practice: "閉眼 1 分鐘，感受白光包覆全身。" },
  { name: "靈光密碼 — 靈魂覺醒", theme: "當光第一次閃現，黑暗不再完整。", message: "你正在經歷靈魂的第一個呼吸。", practice: "靜坐 3 分鐘，觀想光點在胸口閃爍。" },
  { name: "心火之流 Flowing Heartfire", theme: "心輪開啟，情感釋放與再燃。", message: "粉紅火焰正在淨化你的心。", practice: "點燃一支蠟燭，感受火光流入胸口。" }
];

// --- LocalStorage 初始化 ---
let today = new Date().toLocaleDateString();
let progress = JSON.parse(localStorage.getItem("progress")) || { date: today, count: 0, diary: "", dots: 0, petals: 0, streak: 0, badges: [] };

if (progress.date !== today) {
  progress.date = today;
  progress.count = 0;
  progress.diary = "";
  progress.streak++;
}
localStorage.setItem("progress", JSON.stringify(progress));

document.getElementById("drawCount").innerText = `今日剩餘：${2 - progress.count} 次`;

// --- 抽卡功能 ---
document.getElementById("drawCardBtn").addEventListener("click", () => {
  if (progress.count >= 2) {
    alert("今日抽卡次數已達上限 ✦");
    return;
  }

  let specialEvent = Math.random() < 0.05; // 5% 驚喜事件
  let card;
  if (specialEvent) {
    card = { name: "驚喜卡 ✦ 能量祝福", theme: "額外能量加持", message: "宇宙今天給你一份禮物。", practice: "帶著微笑前行，今日加倍祝福。" };
    progress.dots++;
    unlockBadge("宇宙祝福");
  } else {
    card = cards[Math.floor(Math.random() * cards.length)];
  }

  document.getElementById("cardResult").innerHTML = `
    <h3>${card.name}</h3>
    <p><b>主題：</b>${card.theme}</p>
    <p><b>靈魂訊息：</b>${card.message}</p>
    <p><b>練習引導：</b>${card.practice}</p>
  `;

  progress.count++;
  progress.dots++;

  // 三個光點 → 轉換一花瓣
  if (progress.dots >= 3) {
    progress.dots = 0;
    progress.petals++;
    if (progress.petals > 7) progress.petals = 7;
  }

  // 連續 3 天/7 天/21 天徽章
  if (progress.streak === 3) unlockBadge("起步之光");
  if (progress.streak === 7) unlockBadge("光之行者");
  if (progress.streak === 21) unlockBadge("靈魂整合");

  // 連續 5 天隱藏卡
  if (progress.streak > 0 && progress.streak % 5 === 0) {
    document.getElementById("cardResult").innerHTML += `
      <div class="card special"><h3>隱藏靈魂卡 ✦</h3><p>你在連續 ${progress.streak} 天後覺醒。</p></div>
    `;
    unlockBadge("覺醒之門");
  }

  localStorage.setItem("progress", JSON.stringify(progress));
  document.getElementById("drawCount").innerText = `今日剩餘：${2 - progress.count} 次`;
  renderMandala();
  renderBadges();
});

// --- 日記 ---
document.getElementById("saveDiaryBtn").addEventListener("click", () => {
  const input = document.getElementById("diaryInput").value;
  if (!input) return;
  progress.diary = input;
  localStorage.setItem("progress", JSON.stringify(progress));
  renderDiary();
});

function renderDiary() {
  const list = document.getElementById("diaryList");
  list.innerHTML = "";
  if (progress.diary) {
    const li = document.createElement("li");
    li.innerText = `${today} ✦ ${progress.diary}`;
    list.appendChild(li);
  }
}
renderDiary();

// --- 曼陀羅繪圖 ---
function renderMandala() {
  const canvas = document.getElementById("mandala");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const colors = ["#ffffff","#3b82f6","#f97316","#facc15","#22c55e","#6366f1","#a855f7"];
  const centerX = canvas.width/2;
  const centerY = canvas.height/2;
  const radius = 90;

  // 畫七片花瓣
  for (let i=0;i<7;i++) {
    ctx.beginPath();
    const angle = (i/7) * 2 * Math.PI;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.moveTo(centerX, centerY);
    ctx.quadraticCurveTo((centerX+x)/2, (centerY+y)/2-40, x, y);
    ctx.quadraticCurveTo((centerX+x)/2, (centerY+y)/2+40, centerX, centerY);
    ctx.fillStyle = (i < progress.petals) ? colors[i] : "rgba(229,231,235,0.5)";
    ctx.shadowColor = (i < progress.petals) ? colors[i] : "transparent";
    ctx.shadowBlur = (i < progress.petals) ? 15 : 0;
    ctx.fill();
  }

  // 中心光球
  ctx.beginPath();
  ctx.arc(centerX, centerY, 30, 0, 2*Math.PI);
  ctx.fillStyle = (progress.petals===7) ? "#fbbf24" : "#e5e7eb";
  ctx.shadowColor = (progress.petals===7) ? "#facc15" : "transparent";
  ctx.shadowBlur = (progress.petals===7) ? 30 : 0;
  ctx.fill();

  document.getElementById("mandalaProgress").innerText = `已點亮 ${progress.petals}/7 花瓣，小光點：${progress.dots}/3`;
}
renderMandala();

// --- 徽章系統 ---
const allBadges = [
  { id:"起步之光", desc:"連續3天抽卡" },
  { id:"光之行者", desc:"連續7天抽卡" },
  { id:"靈魂整合", desc:"連續21天抽卡" },
  { id:"覺醒之門", desc:"連續5天解鎖隱藏卡" },
  { id:"宇宙祝福", desc:"抽到驚喜卡" }
];

function unlockBadge(id) {
  if (!progress.badges.includes(id)) {
    progress.badges.push(id);
    localStorage.setItem("progress", JSON.stringify(progress));
    alert(`🏅 獲得徽章：${id}`);
  }
}

function renderBadges() {
  const list = document.getElementById("badgeList");
  list.innerHTML = "";
  allBadges.forEach(b => {
    const li = document.createElement("li");
    if (progress.badges.includes(b.id)) {
      li.innerText = `✅ ${b.id} — ${b.desc}`;
    } else {
      li.innerText = `🔒 ${b.id} — ${b.desc}`;
      li.style.opacity = 0.5;
    }
    list.appendChild(li);
  });
}
renderBadges();

// --- 分頁切換 ---
function showSection(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
