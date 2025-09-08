// --- 卡池 (只示範部分，完整39張與前版相同) ---
const cards = [
  { name: "白光 — 起始", theme: "純淨的源頭", message: "你正回到一切的開始。", practice: "閉眼 1 分鐘，感受白光包覆全身。" },
  { name: "靈光密碼 — 靈魂覺醒", theme: "當光第一次閃現，黑暗不再完整。", message: "你正在經歷靈魂的第一個呼吸。", practice: "靜坐 3 分鐘，觀想光點在胸口閃爍。" },
  { name: "心火之流 Flowing Heartfire", theme: "心輪開啟，情感釋放與再燃。", message: "粉紅火焰正在淨化你的心。", practice: "點燃一支蠟燭，感受火光流入胸口。" }
];

// --- LocalStorage 初始化 ---
let today = new Date().toLocaleDateString();
let progress = JSON.parse(localStorage.getItem("progress")) || { date: today, count: 0, diary: "", dots: 0, petals: 0, streak: 0 };

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
    progress.dots++; // 驚喜加1光點
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

  // 連續 5 天抽卡 → 解鎖隱藏卡
  if (progress.streak > 0 && progress.streak % 5 === 0) {
    document.getElementById("cardResult").innerHTML += `
      <div class="card special"><h3>隱藏靈魂卡 ✦</h3><p>你在連續 ${progress.streak} 天後覺醒。</p></div>
    `;
  }

  localStorage.setItem("progress", JSON.stringify(progress));
  document.getElementById("drawCount").innerText = `今日剩餘：${2 - progress.count} 次`;
  renderMandala();
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
  const radius = 80;

  for (let i=0;i<7;i++) {
    ctx.beginPath();
    const angle = (i/7) * 2 * Math.PI;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.arc(x,y,30,0,2*Math.PI);
    ctx.fillStyle = (i < progress.petals) ? colors[i] : "#e5e7eb";
    ctx.fill();
    ctx.strokeStyle="#999";
    ctx.stroke();
  }
  document.getElementById("mandalaProgress").innerText = `已點亮 ${progress.petals}/7 花瓣，小光點：${progress.dots}/3`;
}
renderMandala();

// --- 分頁切換 ---
function showSection(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
