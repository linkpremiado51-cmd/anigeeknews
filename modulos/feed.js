import { dadosFeed } from "../dados_de_noticias/dados-feed.js";

const container = document.getElementById("feedContainer");

let limite = 5;

function renderFeed() {
    if (!container) return;

    container.innerHTML = "";

    // pega apenas até o limite definido
    const itensExibidos = dadosFeed.slice(0, limite);

    itensExibidos.forEach(item => {
        const article = document.createElement("article");
        article.className = "post-card";

        article.innerHTML = `
            <div class="post-img-wrapper">
                <img src="${item.img}" alt="${item.titulo}" loading="lazy">
            </div>
            <div class="post-content">
                <span class="category" style="font-weight: 700; text-transform: uppercase; color: var(--accent-news)">
                    ${item.categoria}
                </span>
                <h2>${item.titulo}</h2>
                <p>${item.descricao}</p>
                <div class="action-row">
                    <span class="meta-minimal">${item.meta}</span>
                    <a href="${item.link}" class="read-more">Ler mais</a>
                </div>
            </div>
        `;

        container.appendChild(article);
    });
}

// inicializa feed
renderFeed();

// botão "Carregar mais"
const btn = document.getElementById("loadMoreFeed");
if (btn) {
    btn.addEventListener("click", () => {
        limite += 5;
        renderFeed();
    });
}
