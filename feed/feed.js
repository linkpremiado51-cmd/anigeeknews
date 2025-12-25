// ✅ Garante que a função esteja no escopo global
if (typeof window.seguirTagsDoArtigo !== 'function') {
    window.seguirTagsDoArtigo = function(tagsDoArtigo) {
        let tagsSeguidas = JSON.parse(localStorage.getItem('seguidas_tags')) || [];
        let novasTags = 0;

        tagsDoArtigo.forEach(tag => {
            const tagNormalizada = tag.trim().toUpperCase(); // Normaliza para maiúsculas
            if (!tagsSeguidas.includes(tagNormalizada)) {
                tagsSeguidas.push(tagNormalizada);
                novasTags++;
            }
        });

        if (novasTags > 0) {
            localStorage.setItem('seguidas_tags', JSON.stringify(tagsSeguidas));
            showNotification(`✅ ${novasTags} tópico(s) adicionado(s) ao seu feed!`);

            // Atualiza o feed se estiver na página dele
            if (document.getElementById('feed-articles')) {
                renderizarFeedComTags(tagsSeguidas);
            }
        }
    };
}

// Função para exibir notificações
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.background = 'var(--primary)';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.fontFamily = 'var(--font-sans)';
    notification.style.fontSize = '14px';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

let noticias = [];
let tagsSeguidasGlobal = JSON.parse(localStorage.getItem('seguidas_tags')) || [];

function carregarNoticias() {
    fetch('./motor_de_pesquisa/noticias.json')
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro ${res.status}: Não foi possível carregar as notícias.`);
            }
            return res.json();
        })
        .then(dados => {
            noticias = dados;
            renderizarFeedComTags(tagsSeguidasGlobal);
        })
        .catch(err => {
            console.error('Erro ao carregar notícias:', err);
            const container = document.getElementById('feed-articles');
            if (container) {
                container.innerHTML = `
                    <p style="text-align:center; color:var(--text-muted);">
                        Erro ao carregar notícias: ${err.message}. Tente novamente mais tarde.
                    </p>
                `;
            }
        });
}

function renderizarTagsSeguidas(tagsSeguidas) {
    const container = document.getElementById('followed-tags');
    if (!container) {
        console.warn('Elemento "followed-tags" não encontrado.');
        return;
    }

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
            tagsSeguidasGlobal = tagsSeguidasGlobal.filter(t => t !== tag);
            localStorage.setItem('seguidas_tags', JSON.stringify(tagsSeguidasGlobal));
            renderizarTagsSeguidas(tagsSeguidasGlobal);
            renderizarFeedComTags(tagsSeguidasGlobal);
        });
    });
}

function renderizarFeedComTags(tagsSeguidas) {
    const container = document.getElementById('feed-articles');
    if (!container) {
        console.warn('Elemento "feed-articles" não encontrado.');
        return;
    }

    renderizarTagsSeguidas(tagsSeguidas);

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
            tagsSeguidas.some(t => t.toUpperCase() === tag.trim().toUpperCase())
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se há tags salvas temporariamente
    const tagsTemp = localStorage.getItem('seguidas_tags_temp');
    if (tagsTemp) {
        const tagsArray = JSON.parse(tagsTemp);
        window.seguirTagsDoArtigo(tagsArray);
        localStorage.removeItem('seguidas_tags_temp');
    }

    // Carrega as notícias
    carregarNoticias();
});
