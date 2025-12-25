// feed/feed.js
let noticias = [];
let tagsSeguidas = JSON.parse(localStorage.getItem('seguidas_tags')) || [];

function carregarNoticias() {
    fetch('./motor_de_pesquisa/noticias.json')
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
        if (document.getElementById('feed-articles')) {
            renderizarTagsSeguidas();
            renderizarFeed();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderizarTagsSeguidas();
    carregarNoticias();
});
