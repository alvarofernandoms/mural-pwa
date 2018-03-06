const Mural = (function(_render, Filtro){
    "use strict"
    let cartoes = pegaCartoesUsuario()
    const render = () => _render({cartoes: cartoes, filtro: Filtro.tagsETexto});
    render()

    Filtro.on("filtrado", render)

    function preparaCartao(cartao) {
        const urlImagens = Cartao.pegaImagens(cartao)
        urlImagens.forEach(url => {
            fetch(url).then(resposta => {
                caches.open('mural-imagens').then(cache => {
                    cache.put(url, resposta)
                })
            })
        })
        cartao.on("mudanca.**", salvarCartoes)
        cartao.on("remocao", ()=>{
            cartoes = cartoes.slice(0)
            cartoes.splice(cartoes.indexOf(cartao),1)
            salvarCartoes()
            render()
        })
    }

    function pegaCartoesUsuario() {
        let cartoesLocal =  JSON.parse(localStorage.getItem(usuario))
        if (cartoesLocal) {
            return cartoesLocal.map(cartaoLocal => {
                let cartao = new Cartao(cartaoLocal.conteudo, cartaoLocal.tipo)
                preparaCartao(cartao)
                return cartao
            })
        } else {
            return []
        }
    }

    function salvarCartoes() {
        localStorage.setItem(usuario, JSON.stringify(
            cartoes.map(cartao => ({conteudo: cartao.conteudo, tipo: cartao.tipo}))
        ))
    }

    login.on('login', () => {
        cartoes = pegaCartoesUsuario()
        render()
    })

    login.on('logout', () => {
        cartoes = []
        render()
    })

    function adiciona(cartao){
        if (logado) {
            cartoes.push(cartao)
            salvarCartoes()
            cartao.on("mudanca.**", render)
            preparaCartao(cartao)
            render()
            return true
        } else {
            alert("Você não está logado!")
        }
    }

    return Object.seal({
        adiciona
    })

})(Mural_render, Filtro)
