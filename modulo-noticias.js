export function carregarNoticiasExtras() {
    const feed = document.querySelector('.feed');
    const botaoContainer = document.querySelector('.load-more-container');

    if (!feed || !botaoContainer) {
        console.warn("Feed ou botão 'Carregar Mais' não encontrado. Inserção abortada.");
        return;
    }

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
        }
    ];

    novasNoticias.forEach(noticia => {
        const link = document.createElement('a');
        link.href = "#";
        link.className = "news-link";

        link.innerHTML = `
            <article class="post-card">
                <div class="post-img-wrapper">
                    <img src="${noticia.img}" loading="lazy" alt="${noticia.titulo}">
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

        // Insere a nova notícia antes do botão "Carregar Mais"
        feed.insertBefore(link, botaoContainer);
    });
}
