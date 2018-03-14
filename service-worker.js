self.addEventListener('fetch', function(event) {
  let pedido = event.request
  let promiseResposta = caches.open('ceep-imagens').then(cache => {
    return cache.match(pedido)
  }).then(resposta => {
    return resposta
  })
  event.respondWith(promiseResposta)
})