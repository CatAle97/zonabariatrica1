/* =========================================================
   SERVICE WORKER — Zona Bariátrica (web instalable / PWA)
   Estrategia "primero internet": siempre se pide la versión
   más nueva al servidor; la copia guardada solo se usa si no
   hay conexión. Así nunca se muestran precios o stock viejos.

   NO guarda nada de otros dominios (Supabase, pagos, fuentes)
   ni peticiones que no sean GET (carrito, checkout, login).
   ========================================================= */
var CACHE = 'zb-v1';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  /* Borra cachés de versiones anteriores. */
  e.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(claves.filter(function (c) { return c !== CACHE; })
        .map(function (c) { return caches.delete(c); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var pet = e.request;
  if (pet.method !== 'GET') return;
  if (new URL(pet.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(pet).then(function (resp) {
      if (resp.ok && resp.type === 'basic') {
        var copia = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(pet, copia); });
      }
      return resp;
    }).catch(function () {
      return caches.match(pet).then(function (guardada) {
        return guardada || (pet.mode === 'navigate' ? caches.match('/') : undefined);
      });
    })
  );
});
