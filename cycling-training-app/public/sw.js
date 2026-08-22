// Service worker do Ciclo Coach.
//
// Estrategia por tipo de recurso, e a distincao importa:
//  - navegacao (o index.html): rede primeiro, cache como reserva. Cache-first
//    aqui prenderia o visitante recorrente na primeira versao instalada, e ele
//    nunca mais veria uma atualizacao.
//  - assets com hash no nome: cache primeiro, porque o nome muda a cada build.
const CACHE = 'ciclo-coach-v2'
const ESSENCIAIS = ['./', './index.html']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ESSENCIAIS)).catch(() => undefined))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((chaves) => Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

function guardar(req, res) {
  const copia = res.clone()
  caches.open(CACHE).then((c) => c.put(req, copia))
  return res
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => guardar(req, res))
        .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html'))),
    )
    return
  }

  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req)
          .then((res) => guardar(req, res))
          .catch(() => undefined),
    ),
  )
})
