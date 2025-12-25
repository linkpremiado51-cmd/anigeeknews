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
// feed/feed.js

let noticias = [];
let tagsSeguidas = JSON.parse(localStorage.getItem('seguidas_tags')) || [];

function carregarNoticias() {
    fetch('/anigeeknews/motor_de_pesquisa/noticias.json')
        .then(res => res.json())
        .then(dados => {
            noticias = dados;
            renderizarFeed();
        })
        .catch(err => {
            document.getElementById('feed-articles').innerHTML = 
                '<p style="text-align:center; color:var(--text-muted);">Erro ao carregar notícias.</p>';
        });
}

function renderizarTagsSeguidas() {
    const container = document.getElementById('followed-tags');
    if (!container) return;

    if (tagsSeguidas.length === 0) {
        container.innerHTML = '<span style="color:var(--text-muted);">Nenhum tópico seguido.</span>';
        return;
    }

    container.innerHTML = tagsSeguidas.map(tag => `
        <button class="follow-tag-btn following" data-tag="${tag}" style="cursor: pointer;">
            ${tag} ✕
        </button>
    `).join('');

    // Remover tag ao clicar no "✕"
    container.querySelectorAll('.follow-tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.dataset.tag;
            tagsSeguidas = tagsSeguidas.filter(t => t !== tag);
            localStorage.setItem('seguidas_tags', JSON.stringify(tagsSeguidas));
            renderizarTagsSeguidas();
            renderizarFeed();
        });
    });
}

function renderizarFeed() {
    const container = document.getElementById('feed-articles');
    if (!container) return;

    if (tagsSeguidas.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: var(--text-muted);">
                Siga tópicos em artigos para ver notícias personalizadas aqui.
            </p>
        `;
        return;
    }

    const noticiasFiltradas = noticias.filter(noticia => {
        return noticia.tags.some(tag => 
            tagsSeguidas.some(t => t.toLowerCase() === tag.toLowerCase())
        );
    });

    if (noticiasFiltradas.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: var(--text-muted);">
                Nenhuma notícia encontrada para seus tópicos seguidos.
            </p>
        `;
        return;
    }

    const html = noticiasFiltradas.map(noticia => `
        <a href="${noticia.url}" class="news-link">
            <div class="feed-post">
                <img src="${noticia.imagem || 'https://via.placeholder.com/100x70'}" loading="lazy" alt="${noticia.titulo}">
                <div class="feed-post-content">
                    <span class="category">${noticia.categoria}</span>
                    <h3>${noticia.titulo}</h3>
                    <p>${noticia.resumo}</p>
                    <div class="feed-post-meta">${noticia.data}</div>
                </div>
            </div>
        </a>
    `).join('');

    container.innerHTML = html;
}

// Função para ser chamada de OUTRAS PÁGINAS (ex: artigo)
window.seguirTagsDoArtigo = function(tagsDoArtigo) {
    let novasTags = 0;
    tagsDoArtigo.forEach(tag => {
        const tagNormalizada = tag.trim();
        if (!tagsSeguidas.includes(tagNormalizada)) {
            tagsSeguidas.push(tagNormalizada);
            novasTags++;
        }
    });

    if (novasTags > 0) {
        localStorage.setItem('seguidas_tags', JSON.stringify(tagsSeguidas));
        alert(`✅ ${novasTags} tópico(s) adicionado(s) ao seu feed!`);
        
        // Se estiver na página do feed, atualiza imediatamente
        if (document.getElementById('feed-articles')) {
            renderizarTagsSeguidas();
            renderizarFeed();
        }
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderizarTagsSeguidas();
    carregarNoticias();
});
