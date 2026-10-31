// Scoped to this project: never read or delete another Pages project's caches.
const BASE=new URL('./',self.location.href);
const PREFIX='grace-voice-pages:'+BASE.pathname+':';
const CACHE=PREFIX+'v1.1.0-pages-1';
const FILES=['./','./index.html','./app.js','./store.js','./core.js','./config-transfer.js','./binding.js','./design-system.css','./brand-icon.svg','./icon-192.png','./icon-512.png','./manifest.webmanifest','./setup.html'];
const URLS=FILES.map(file=>new URL(file,BASE).href);
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS))));
// Wait until old tabs close before activating a new app shell.
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith(PREFIX)&&k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);u.search='';u.hash='';
 if(!URLS.includes(u.href))return;
 e.respondWith(caches.open(CACHE).then(async c=>(await c.match(u.href))||fetch(e.request)));
});
