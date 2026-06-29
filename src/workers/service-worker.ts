/// <reference lib="webworker" />

export {};

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST?: Array<string | { url: string }>;
};

const VERSION = 'fifa2026-v1';
const APP_CACHE = `${VERSION}:app`;
const DATA_CACHE = `${VERSION}:data`;
const APP_BASE = self.location.pathname.replace(/[^/]+$/, '');
const APP_SHELL = [
  APP_BASE,
  `${APP_BASE}manifest.webmanifest`,
  `${APP_BASE}icons/icon.svg`,
  `${APP_BASE}icons/icon-maskable.svg`
];
const manifestEntries = (self.__WB_MANIFEST ?? []).map((entry) => (typeof entry === 'string' ? entry : entry.url));
const PRECACHE_ASSETS = [...new Set([...APP_SHELL, ...manifestEntries])];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => ![APP_CACHE, DATA_CACHE].includes(key)).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isNavigation = event.request.mode === 'navigate';
  const isDataRequest = requestUrl.pathname.includes('/api/') || requestUrl.pathname.endsWith('.json');

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          void caches.open(APP_CACHE).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          const appShellResponse = await caches.match(APP_BASE);
          return cachedResponse ?? appShellResponse ?? Response.error();
        })
    );
    return;
  }

  if (isDataRequest) {
    event.respondWith(
      caches.open(DATA_CACHE).then(async (cache) => {
        try {
          const response = await fetch(event.request);
          cache.put(event.request, response.clone());
          return response;
        } catch {
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          throw new Error('No hay datos en cache para esta solicitud');
        }
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        const cloned = response.clone();
        void caches.open(APP_CACHE).then((cache) => cache.put(event.request, cloned));
        return response;
      });
    })
  );
});
