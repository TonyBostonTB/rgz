const PRECACHE = "2022060405";
const RUNTIME = "runtime";
const PRECACHE_URLS = [
  "./",
  "index.html",
  "0.min.css",
  "rgzee.svg",
  "favicon.png",
  "favicon-512.png",
];

const _install = (event) =>
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );

const _activate = (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        cacheNames.filter(
          (cacheName) => ![PRECACHE, RUNTIME].includes(cacheName)
        )
      )
      .then((cachesToDelete) =>
        Promise.all(
          cachesToDelete.map((cacheToDelete) => caches.delete(cacheToDelete))
        )
      )
      .then(() => self.clients.claim())
  );

const isSameOrigin = (event) =>
  event.request.url.startsWith(self.location.origin);

const putToCache = (event) => (cache) =>
  fetch(event.request).then((response) =>
    cache.put(event.request, response.clone()).then(() => response)
  );

const _fetch = (event) =>
  isSameOrigin(event) &&
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return caches.open(RUNTIME).then(putToCache(event));
    })
  );

self.addEventListener("install", _install);
self.addEventListener("activate", _activate);
self.addEventListener("fetch", _fetch);
