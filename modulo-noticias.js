// modulo-noticias.js

// índice para controlar qual notícia será exibida
let indiceNoticiasExtras = 0;

// array de notícias reais
const novasNoticias = [
    {
        categoria: "Games",
        titulo: "GTA VI: Novos rumores apontam para sistema de clima extremo",
        descricao: "Vazamentos sugerem que furacões e inundações afetarão a jogabilidade em tempo real em Vice City.",
        img: "https://i.postimg.cc/sfHMcTDy/58awkrh8lp404dsegeqpbffcz.jpg",
        meta: "há 12 horas • Leitura: 5min",
        likes: "560"
    },
    {
        categoria: "Anime",
        titulo: "Bleach: Thousand-Year Blood War anuncia data da parte final",
        descricao: "O retorno triunfal de Ichigo Kurosaki já tem data marcada para encerrar a saga do Rei Quincy.",
        img: "https://i.postimg.cc/QdzLYWKg/Jujutsu-Kaisen01.jpg",
        meta: "há 1 dia • Lançamento",
        likes: "890"
    },
    {
        categoria: "Tecnologia",
        titulo: "ChatGPT 5 é lançado com suporte a multimídia e código avançado",
        descricao: "O novo modelo de IA promete interações mais humanas, com geração de imagens, sons e programação complexa.",
        img: "https://via.placeholder.com/240x160?text=ChatGPT+5",
        meta: "há 3 horas • Leitura: 4min",
        likes: "1200"
    }
];

export function carregarNoticiasExtras() {
    const feed = document.querySelector('.feed');
    const botaoContainer = document.querySelector('.load-more-container');

    if (!feed || !botaoContainer) {
        console.warn("Feed ou botão 'Carregar Mais' não encontrado.");
        return;
    }

    // se não houver mais notícias, remove o botão e sai
    if (indiceNoticiasExtras >= novasNoticias.length) {
        botaoContainer.remove();
        return;
    }

    // pega a notícia atual
    const noticia = novasNoticias[indiceNoticiasExtras];
    indiceNoticiasExtras++;

    // cria o post
    const post = document.createElement('a');
    post.href = "#";
    post.className = 'news-link';
    post.innerHTML = `
        <article class="post-card">
            <div class="post-img-wrapper">
                <img src="${noticia.img}" alt="${noticia.titulo}" loading="lazy">
            </div>
            <div class="post-content">
                <span class="category">${noticia.categoria}</span>
                <h2>${noticia.titulo}</h2>
                <p>${noticia.descricao}</p>
                <div class="action-row">
                    <span class="meta-minimal">${noticia.meta}</span>
                    <button class="like-btn" onclick="event.preventDefault(); window.toggleLike(this)">
                        <span>${noticia.likes}</span> leitores recomendam
                    </button>
                </div>
            </div>
        </article>
    `;

    // adiciona antes do botão, sem remover o botão
    feed.insertBefore(post, botaoContainer);

    // se acabou as notícias, remove o botão
    if (indiceNoticiasExtras >= novasNoticias.length) {
        botaoContainer.remove();
    }
}
