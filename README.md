# Enervi7：光之七境（PWA 原型）

這是一個可離線安裝的網頁 App（PWA），用來遊戲化你的能量修練旅程。

## 功能
- 今日抽卡：每日一次抽取「境界卡」，並查看練習內容
- 完成任務：標記完成、累積點數、維持連續天數（Streak）
- 成就徽章：7 日「光之行者」、21 次「合一之光」
- 21 日旅程地圖：查看每一天的抽卡與完成狀態
- 能量曼陀羅：七瓣花瓣隨完成度點亮
- 靈魂日記：完成後記下一句話，作為能量見證
- 離線可用：支援安裝到桌面（iOS/Android/桌機）

## 檔案結構
```
enervi7-ascension-app/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ app.js
│  └─ data.js
├─ icons/
│  ├─ icon-192.png
│  └─ icon-512.png
├─ manifest.json
└─ sw.js
```

## 部署（GitHub Pages）
1. 建立新 repo，名稱隨意（如：`enervi7-ascension-app`）
2. 上傳上述所有檔案到 repo 根目錄
3. 在 GitHub → Settings → Pages → 將「Branch」設為 `main` 的 `/ (root)`
4. 等待數分鐘，打開 Pages 連結即可使用（手機也能「加入主畫面」安裝成 App）

---

Powered by Enervi7 ✦ ©2025 彌悅
