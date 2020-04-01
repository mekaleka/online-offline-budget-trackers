var CACHE_NAME = "mySideCache-v1";
var DATA_CACHE_NAME = "dataCacheName-v1";
var url = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.json",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("cachedOpen");
      return cache.addAll(url);
    })
  );
});

self.addEventListener("fetch", function(event) {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then(function(cache) {
          return fetch(event.request)
            .then(response => {
              console.log("We made it", response);
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
              return response;
            })
            .catch(error => {
              console.log(error);
              return cache.match(event.request);
            });
        })
        .catch(error => {
          console.log(error);
        })
    );
    return
  }
  event.respondWith(
    caches.match(event.request).then(function(response){
      return response || fetch(event.request);
    })
  );
});

