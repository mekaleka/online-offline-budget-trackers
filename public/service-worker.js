import { response } from "express";

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
      cache.addAll(url);
    }).then(self.skipWaiting())
  );
});
self.addEventListener("fetch", event => {
  if(event.request.url.startsWith(self.location.origin)){
    event.respondWith(caches.match(event.request).then(responseCached => {
      if(responseCached){
        return responseCached
      }
      return caches.open(RUNTIME).then(chace => {
        return fetch(event.request).then(response => {
          return cache.put(event.request, response.clone()).then(() => {return response})}
        )
      })
    }))
  }
})

// self.addEventListener("fetch", function(event) {
//   if (event.request.url.includes("/api/")) {
//     event.respondWith(
//       caches
//         .open(DATA_CACHE_NAME)
//         .then(function(cache) {
//           return fetch(event.request)
//             .then(response => {
//               console.log("We made it", response);
//               if (response.status === 200) {
//                 cache.put(event.request.url, response.clone());
//               }
//               return response;
//             })
//             .catch(error => {
//               console.log(error);
//               return cache.match(event.request);
//             });
//         })
//         .catch(error => {
//           console.log(error);
//         })
//     );
//     return
//   }

//   event.respondWith(
//     caches.match(event.request).then(function(response){
//       return response || fetch(event.request);
//     })
//   );
// });

  self.addEventListener("activate", event => {
    const myCache = [CACHE_NAME, DATA_CACHE_NAME]
    event.waitUntil(caches.keys().then(resultCache => {
      return resultCache.filter(finalCache => ! myCache.includes(finalCache));
    })).then(deleteCaches => {
      return Promise.all(deleteCaches.map(cachesToBeDeleted => {
        return caches.delete(cachesToBeDeleted)
      }))
    }).then(() => self.clients.claim())
  })