//console.log("service worker inside sw.js")

const cacheName = "app-shell-resources";
const assets = [
  "/",
  "index.html",
  "js/app.js",
  "js/common.js",
  "js/materialize.min.js",
  "css/styles.css",
  "css/materialize.min.css",
  "img/pkcontacts.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2"
];

caches.open(cacheName)
  .then(cache => {
    return cache.addAll(assets)
      .then(() => {
        console.log('All assets are cached');
      })
      .catch(error => {
        // This catch will handle any errors that occur during the addAll operation.
        console.error('Failed to cache assets:', error);
      });
  })
  .catch(error => {
    // This catch will handle errors that occur during the opening of the cache.
    console.error('Failed to open cache:', error);
  });


//install event
self.addEventListener('install', evt => {
  console.log("worker is installed");
});

//new cont
//activate event
self.addEventListener('activate', evt => {
  console.log('service worker has been activated');
});

//fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cachedResponse => {
          return cachedResponse || fetch(evt.request);
        }
    ));

  console.log(evt);
});
