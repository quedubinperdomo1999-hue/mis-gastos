// Querux 3.1: caché versionado para que no aparezca la interfaz antigua.
const CACHE = 'querux-v31-recordatorios-20261113-v1';
const CORE = ['./','./index.html','./querux3.css','./querux3.js','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e => {self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(()=>{}))});
self.addEventListener('activate', e => {e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k.startsWith('querux-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch', e => {
 const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  e.respondWith(fetch(req).then(res=>{if(res.ok){const clone=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',clone)).catch(()=>{})}return res}).catch(()=>caches.match('./index.html')));return;
 }
 e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{})}return res})));
});
