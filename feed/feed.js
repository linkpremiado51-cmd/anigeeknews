// feed/feed.js

// Simulação de dados do feed (substitua por fetch() se tiver API)
const feedData = [
    {
        id: 1,
        title: "Crunchyroll anuncia licenciamento de 12 novos animes para 2026",
        excerpt: "A plataforma reforça presença no mercado latino com exclusividades da temporada de inverno.",
        image: "https://i.postimg.cc/85WqGcLq/crunchyroll-news.jpg",
        category: "Streaming",
        date: "há 1 hora",
        readTime: "3min"
    },
    {
        id: 2,
        title: "Demon Slayer: Hashira Training Arc ganha trailer final",
        excerpt: "Novo arco promete revelar segredos sobre o passado de cada Hashira.",
        image: "https://i.postimg.cc/fLrWY3vF/demon-slayer-hashira.jpg",
        category: "Animes",
        date: "há 3 horas",
        readTime: "2min"
    },
    {
        id: 3,
        title: "Nintendo confirma novo console híbrido para final de 2026",
        excerpt: "Protótipos com chips customizados já estão em testes com desenvolvedores.",
        image: "https://i.postimg.cc/6Q4x8fZn/nintendo-switch-pro.jpg",
        category: "Hardware",
        date: "há 5 horas",
        readTime: "4min"
    },
    {
        id: 4,
        title: "Mangá de Chainsaw Man Parte 3 terá lançamento mensal",
        excerpt: "Tatsuki Fujimoto opta por ritmo mais lento para maior qualidade artística.",
        image: "https://i.postimg.cc/CKd7xvXn/chainsaw-man-p3.jpg",
        category: "Mangás",
        date: "há 1 dia",
        readTime: "2min"
    }
];

// Função para renderizar uma notícia
function renderPost(post) {
    return `
        <a href="#" class="news-link">
            <div class="feed-post">
                <img src="${post.image}" loading="lazy" alt="${post.title}">
                <div class="feed-post-content">
                    <span class="category">${post.category}</span>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="feed-post-meta">${post.date} • Leitura: ${post.readTime}</div>
                    <button class="save-btn" data-id="${post.id}" title="Salvar para ler depois">
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
            </div>
        </a>
    `;
}

// Função principal de inicialização
function initFeed() {
    const container = document.getElementById('feed-container');
    if (!container) return;

    // Renderiza todas as notícias
    const html = feedData.map(renderPost).join('');
    container.innerHTML = html;

    // Adiciona evento de "salvar"
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('saved');
            const icon = this.querySelector('i');
            if (this.classList.contains('saved')) {
                icon.className = 'fas fa-bookmark';
            } else {
                icon.className = 'far fa-bookmark';
            }
        });
    });

    // Evento para "Carregar Mais" (simulação)
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            alert('Carregando mais notícias... (simulação)');
            // Aqui você pode adicionar lógica real para carregar mais dados
        });
    }
}

// Executa quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeed);
} else {
    initFeed();
}
