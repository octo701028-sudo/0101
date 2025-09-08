const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// Tabs
$$(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    $$(".tabpane").forEach(p => p.classList.remove("active"));
    $("#" + tab).classList.add("active");
  });
});

const cardDisplay = $("#todayCard");
const drawBtn = $("#drawBtn");
const journalInput = $("#journalInput");
const saveJournalBtn = $("#saveJournal");
const journalList = $("#journalList");

function renderCard(card) {
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

function drawCard() {
  const pool = window.ENERVI7_CARDS;
  const card = pool[Math.floor(Math.random() * pool.length)];
  renderCard(card);
  localStorage.setItem("todayCard", JSON.stringify(card));
}

function loadTodayCard() {
  const saved = localStorage.getItem("todayCard");
  if (saved) renderCard(JSON.parse(saved));
}

function saveJournal() {
  const text = journalInput.value.trim();
  if (!text) return;
  const item = document.createElement("li");
  item.textContent = text;
  journalList.appendChild(item);
  journalInput.value = "";
}

drawBtn.addEventListener("click", drawCard);
if(saveJournalBtn) saveJournalBtn.addEventListener("click", saveJournal);

window.onload = () => {
  loadTodayCard();
};