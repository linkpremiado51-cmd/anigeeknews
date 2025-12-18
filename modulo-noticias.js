// modulo-noticias.js
export function carregarNoticiasExtras() {
    const feed = document.querySelector('.feed');
    if (!feed) return;

    for (let i = 1; i <= 3; i++) {
        const post = document.createElement('a');
        post.href = "#";
        post.className = 'news-link';
        post.innerHTML = `
            <article class="post-card">
                <div class="post-img-wrapper">
                    <img src="https://via.placeholder.com/240x160?text=Notícia+${i}" alt="Notícia ${i}">
                </div>
                <div class="post-content">
                    <span class="category">Teste</span>
                    <h2>Notícia Fake ${i}</h2>
                    <p>Este é um conteúdo de teste para validar o carregamento de notícias extras.</p>
                    <div class="action-row">
                        <span class="meta-minimal">há 0 horas • Leitura: 1min</span>
                        <button class="like-btn" onclick="event.preventDefault(); toggleLike(this)">
                            <span>0</span> leitores recomendam
                        </button>
                    </div>
                </div>
            </article>
        `;
        feed.appendChild(post);
    }
}
