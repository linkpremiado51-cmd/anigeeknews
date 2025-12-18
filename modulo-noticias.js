export function carregarNoticiasExtras() {
    const feed = document.querySelector('.feed');
    const botaoContainer = feed.querySelector('div[style*="text-align: center"]');

    // Dados das novas notícias
    const novasNoticias = [
        {
            categoria: "Games",
            titulo: "GTA VI: Novos rumores apontam para sistema de clima extremo",
            descricao: "Vazamentos sugerem que furacões e inundações afetarão a jogabilidade em tempo real em Vice City.",
            img: "https://i.postimg.cc/sfHMcTDy/58awkrh8lp404dsegeqpbffcz.jpg", // Substitua pelas suas imagens
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

    // Gerar o HTML para cada notícia
    novasNoticias.forEach(noticia => {
        const article = document.createElement('a');
        article.href = "#";
        article.className = "news-link";
        article.innerHTML = `
            <article class="post-card">
                <div class="post-img-wrapper">
                    <img src="${noticia.img}" loading="lazy">
                </div>
                <div class="post-content">
                    <span class="category">${noticia.categoria}</span>
                    <h2>${noticia.titulo}</h2>
                    <p>${noticia.descricao}</p>
                    <div class="action-row">
                        <span class="meta-minimal">${noticia.meta}</span>
                        <button class="like-btn" onclick="event.preventDefault(); toggleLike(this)">
                            <span>${noticia.likes}</span> leitores recomendam
                        </button>
                    </div>
                </div>
            </article>
        `;
        // Insere a notícia antes do botão "Carregar Mais"
        feed.insertBefore(article, botaoContainer);
    });
}
