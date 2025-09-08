self.addEventListener("install", e => {
  e.waitUntil(caches.open("enervi7").then(c => c.addAll(["index.html","css/style.css","js/cards.js","js/app.js"])))
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});