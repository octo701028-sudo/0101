// --- 卡池 ---
const cards = [
  // 七光能量卡
  { name: "白光 — 起始", theme: "純淨的源頭", message: "你正回到一切的開始。", practice: "閉眼 1 分鐘，感受白光包覆全身。" },
  { name: "藍光 — 溝通", theme: "真誠的聲音", message: "你的話語能創造真實。", practice: "今天大聲說出一句真心話。" },
  { name: "橙光 — 創造", theme: "流動的喜悅", message: "允許自己感受快樂。", practice: "做一件讓你發自內心微笑的小事。" },
  { name: "黃光 — 力量", theme: "內在太陽", message: "你擁有的，比你相信的更多。", practice: "站直身體，深呼吸三次，感受能量湧上。" },
  { name: "綠光 — 愛", theme: "心的平衡", message: "你的心正在柔軟而強大。", practice: "對自己說一句：我值得被愛。" },
  { name: "靛光 — 直覺", theme: "看見真相", message: "靈魂的眼睛正在開啟。", practice: "靜坐觀想眉心一顆星光。" },
  { name: "紫光 — 整合", theme: "通往更高的門", message: "一切都在合一中完成。", practice: "今天把感謝說出口，交給宇宙。" },

  // 靈光密碼（31 張）
  { name: "靈光密碼 — 靈魂覺醒", theme: "當光第一次閃現，黑暗不再完整。", message: "你正在經歷靈魂的第一個呼吸。", practice: "靜坐 3 分鐘，觀想光點在胸口閃爍。" },
  { name: "靈光密碼 — 內在鏡湖", theme: "平靜是一種回應。", message: "你看見自己在水中的倒影。", practice: "今天在心中重複：我接受此刻的樣子。" },
  { name: "靈光密碼 — 星辰記憶", theme: "靈魂的源頭來自更遠之地。", message: "你帶著宇宙的記憶行走。", practice: "觀想夜空，對星星許下一個心願。" },
  { name: "靈光密碼 — 光之種子", theme: "一切從小小的萌芽開始。", message: "你的成長已悄然發生。", practice: "今天種下一顆真心的意圖。" },
  { name: "靈光密碼 — 風之歌", theme: "流動即是自由。", message: "你不需要停留在過去。", practice: "深呼吸三次，感受風穿過身體。" },
  { name: "靈光密碼 — 靜夜月光", theme: "黑暗也是柔和的陪伴。", message: "不要害怕安靜，它正守護你。", practice: "今晚關燈，與黑暗待一分鐘。" },
  { name: "靈光密碼 — 花之綻放", theme: "美正在你體內發生。", message: "你的靈魂正在展現真實的顏色。", practice: "觀想自己是一朵正在打開的花。" },
  { name: "靈光密碼 — 內在旅程", theme: "真正的道路在心裡。", message: "你已踏上回家的方向。", practice: "今天為自己留下一刻獨處時間。" },
  { name: "靈光密碼 — 時間之河", theme: "過去與未來都流向現在。", message: "你的當下就是整體。", practice: "閉眼感受，心跳的每一下都是禮物。" },
  { name: "靈光密碼 — 靈魂羽翼", theme: "你本已自由。", message: "別忘了，你能飛翔。", practice: "張開雙臂，深吸氣，想像羽翼展開。" },
  { name: "靈光密碼 — 破曉之光", theme: "黑夜終將讓位於光明。", message: "希望比你想的更靠近。", practice: "迎接晨光，對自己說：新的一天開始了。" },
  { name: "靈光密碼 — 大地之心", theme: "穩固是一種溫柔。", message: "你被大地承接。", practice: "赤腳站在地上，感受能量進入腳底。" },
  { name: "靈光密碼 — 靈魂之火", theme: "火焰是淨化，也是重生。", message: "你內在的渴望正點燃你。", practice: "點燃一支蠟燭，凝視火焰一分鐘。" },
  { name: "靈光密碼 — 水之流", theme: "流動即是療癒。", message: "別再抗拒，你就是河流。", practice: "今天喝下一杯水，心裡默念：我被淨化。" },
  { name: "靈光密碼 — 靈魂之聲", theme: "真正的聲音來自內心。", message: "你聽見了自己。", practice: "寫下一句話，來自你的靈魂。" },
  { name: "靈光密碼 — 宇宙回音", theme: "你說的，每一句都在宇宙迴響。", message: "不要低估你的聲音。", practice: "今天說出一句祝福的話。" },
  { name: "靈光密碼 — 靈性之眼", theme: "真相永遠存在。", message: "你能看見更深的層次。", practice: "閉眼觀想眉心有一輪明亮之眼。" },
  { name: "靈光密碼 — 星火連結", theme: "我們都是彼此的星星。", message: "你並不孤單。", practice: "今天給一個人一個真誠的微笑。" },
  { name: "靈光密碼 — 靜心之境", theme: "安靜是力量的泉源。", message: "你比自己以為的更穩固。", practice: "靜坐 5 分鐘，觀察呼吸。" },
  { name: "靈光密碼 — 彩虹之橋", theme: "連結不同的世界。", message: "你正在跨越一個轉折。", practice: "觀想彩虹出現在你心與心之間。" },
  { name: "靈光密碼 — 靈魂之門", theme: "新的階段正打開。", message: "請勇敢跨出一步。", practice: "今天做一件不習慣但心裡渴望的事。" },
  { name: "靈光密碼 — 光之守護", theme: "光一直在。", message: "你並未被遺棄。", practice: "觀想有一道光圈圍繞你。" },
  { name: "靈光密碼 — 靈魂花園", theme: "你正在培養內心的花朵。", message: "別急，花會在對的時刻綻放。", practice: "今天對自己說一句溫柔的話。" },
  { name: "靈光密碼 — 黑夜之心", theme: "黑暗中也有光的誕生。", message: "別害怕你的影子。", practice: "今晚允許自己接受所有情緒。" },
  { name: "靈光密碼 — 靈魂泉源", theme: "你永遠連結著源頭。", message: "你並未失去任何東西。", practice: "今天把手放在心口，感受能量湧現。" },
  { name: "靈光密碼 — 鏡中真我", theme: "你就是你要尋找的答案。", message: "停止追逐外在的認同。", practice: "今天照鏡子，對自己微笑。" },
  { name: "靈光密碼 — 靈光之舞", theme: "能量正在流動。", message: "讓身體動起來。", practice: "放一首音樂，自由舞動 3 分鐘。" },
  { name: "靈光密碼 — 智慧之眼", theme: "智慧不來自知識，而來自看見。", message: "你已擁有答案。", practice: "今天寫下你心裡真正的答案。" },
  { name: "靈光密碼 — 靈魂契約", theme: "一切相遇都有意義。", message: "你正在完成承諾。", practice: "寫下你最感激的一個人。" },
  { name: "靈光密碼 — 無限光海", theme: "你是無限的一部分。", message: "不要小看你的存在。", practice: "觀想自己化為光，融入整個宇宙。" },
  { name: "靈光密碼 — 靈魂整合", theme: "一切正在歸於完整。", message: "你就是圓滿本身。", practice: "今天把手放在胸口，對自己說：我已完整。" },

  // 特別卡
  { name: "心火之流 Flowing Heartfire", theme: "心輪開啟，情感釋放與再燃。", message: "粉紅火焰正在淨化你的心。", practice: "點燃一支蠟燭，感受火光流入胸口。" }
];

// --- LocalStorage 初始 ---
let today = new Date().toLocaleDateString();
let drawData = JSON.parse(localStorage.getItem("drawData")) || {};
if (drawData.date !== today) {
  drawData = { date: today, count: 0, diary: "" };
}
localStorage.setItem("drawData", JSON.stringify(drawData));

document.getElementById("drawCount").innerText =
  `今日剩餘：${2 - drawData.count} 次`;

// --- 抽卡功能 ---
document.getElementById("drawCardBtn").addEventListener("click", () => {
  if (drawData.count >= 2) {
    alert("今日抽卡次數已達上限 ✦");
    return;
  }
  const card = cards[Math.floor(Math.random() * cards.length)];
  document.getElementById("cardResult").innerHTML = `
    <h3>${card.name}</h3>
    <p><b>主題：</b>${card.theme}</p>
    <p><b>靈魂訊息：</b>${card.message}</p>
    <p><b>練習引導：</b>${card.practice}</p>
  `;
  drawData.count++;
  localStorage.setItem("drawData", JSON.stringify(drawData));
  document.getElementById("drawCount").innerText =
    `今日剩餘：${2 - drawData.count} 次`;
});

// --- 日記 ---
document.getElementById("saveDiaryBtn").addEventListener("click", () => {
  const input = document.getElementById("diaryInput").value;
  if (!input) return;
  drawData.diary = input;
  localStorage.setItem("drawData", JSON.stringify(drawData));
  renderDiary();
});

function renderDiary() {
  const list = document.getElementById("diaryList");
  list.innerHTML = "";
  if (drawData.diary) {
    const li = document.createElement("li");
    li.innerText = `${today} ✦ ${drawData.diary}`;
    list.appendChild(li);
  }
}
renderDiary();

// --- 分頁切換 ---
function showSection(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
