self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("enervi7").then(cache => {
      return cache.addAll([
        "index.html",
        "css/style.css",
        "js/cards.js",
        "js/app.js"
      ]);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});