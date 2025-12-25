// ===============================
// FEED — CAMADA DE ORQUESTRAÇÃO
// ===============================

// Estado do feed
let feedIndice = [];
let feedCursor = 0;
const FEED_BATCH = 5;

// ----------- PERFIL DO USUÁRIO (simples por enquanto) -----------

const perfilUsuario = {
    interesses: [
        "one piece",
        "animes",
        "games"
    ]
};

// ----------- UTILIDADES -----------

function normalizarTexto(texto = "") {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function scoreAfinidade(item) {
    let score = 0;
    const topicos = item.indexacao.topicos.map(normalizarTexto);
    const tags = item.indexacao.tags.map(normalizarTexto);

    perfilUsuario.interesses.forEach(interesse => {
        const i = normalizarTexto(interesse);
        if (topicos.includes(i)) score += 3;
        if (tags.includes(i)) score += 1;
    });

    return score;
}

function scoreFeed(item) {
    const base =
        item.sinais.peso_base *
        item.sinais.prioridade_editorial;

    const afinidade = scoreAfinidade(item);

    return base + afinidade;
}

// ----------- CONSTRUÇÃO DO FEED -----------

function montarIndiceFeed() {
    feedIndice = bancoDeNoticias
        .map(item => ({
            item,
            score: scoreFeed(item)
        }))
        .sort((a, b) => b.score - a.score)
        .map(r => r.item);
}

// ----------- RENDERIZAÇÃO -----------

function renderizarFeed(container, itens) {
    const html = itens.map(noticia => `
        <article class="feed-card">
            <a href="${noticia.conteudo.url}">
                <img src="${noticia.conteudo.imagem}" loading="lazy">
                <div class="feed-content">
                    <span class="feed-category">${noticia.indexacao.categoria}</span>
                    <h2>${noticia.conteudo.titulo}</h2>
                    <p>${noticia.conteudo.snippet_feed}</p>
                </div>
            </a>
        </article>
    `).join('');

    container.insertAdjacentHTML('beforeend', html);
}

// ----------- PAGINAÇÃO INFINITA -----------

function carregarMaisFeed(container) {
    const proximoLote = feedIndice.slice(feedCursor, feedCursor + FEED_BATCH);
    if (proximoLote.length === 0) return;

    renderizarFeed(container, proximoLote);
    feedCursor += FEED_BATCH;
}

// ----------- INICIALIZAÇÃO -----------

function initFeed() {
    const container = document.getElementById('feed-container');
    if (!container) return;

    // Espera o motor carregar
    const esperarIndice = setInterval(() => {
        if (typeof bancoDeNoticias !== 'undefined' && bancoDeNoticias.length) {
            clearInterval(esperarIndice);
            montarIndiceFeed();
            carregarMaisFeed(container);
        }
    }, 100);

    window.addEventListener('scroll', () => {
        const nearBottom =
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

        if (nearBottom) carregarMaisFeed(container);
    });
}

document.addEventListener('DOMContentLoaded', initFeed);
