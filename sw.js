/* TOPLEAKS : service worker
   - pages : réseau d'abord (toujours la dernière version), copie en cache si hors-ligne
   - fichiers statiques du site : cache d'abord, mis à jour en arrière-plan
   - JAMAIS en cache : Supabase (API, connexion, stockage), vidéos, APK, requêtes partielles (Range)
   Pour forcer une mise à jour chez tous les utilisateurs, changez VERSION. */
var VERSION = 'v1';
var CACHE = 'topleaks-' + VERSION;
var SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      /* addAll échoue si un fichier manque : on ajoute un par un pour ne pas bloquer l'installation */
      return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf('topleaks-') === 0 && k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isMedia(url) { return /\.(mp4|webm|mov|m4v|mp3|apk|aab)(\?|$)/i.test(url.pathname); }

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  if (req.headers.has('range')) return;                 /* lecture vidéo : on laisse le réseau */
  var url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  /* Polices Google : cache d'abord (elles ne changent pas) */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      });
    }));
    return;
  }

  /* Tout le reste hors du site (Supabase, etc.) : réseau uniquement, rien en cache */
  if (url.origin !== self.location.origin) return;
  if (isMedia(url)) return;

  /* Pages : réseau d'abord, repli sur le cache hors-ligne */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
        return res;
      }).catch(function () {
        return caches.match('./index.html').then(function (hit) { return hit || caches.match('./'); });
      })
    );
    return;
  }

  /* Fichiers statiques du site : cache d'abord + mise à jour en arrière-plan */
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
