import { dadosFeed } from "../dados_de_noticias/dados-feed.js";

const container = document.getElementById("feedContainer");
let limite = 5; // quantidade inicial de cards

function renderFeed() {
    if (!container) return;

    container.innerHTML = "";

    // pega apenas os itens até o limite
    const itensExibidos = dadosFeed.slice(0, limite);

    itensExibidos.forEach(item => {
        const article = document.createElement("article");
        article.className = "post-card";

        article.innerHTML = `
            <div class="post-img-wrapper">
                <img src="${item.img}" alt="${item.titulo}" loading="lazy">
            </div>
            <div class="post-content">
                <span class="category">${item.categoria}</span>
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

    // esconde o botão se não houver mais cards
    const btn = document.getElementById("loadMoreFeed");
    if (btn) {
        if (limite >= dadosFeed.length) {
            btn.style.display = "none";
        } else {
            btn.style.display = "inline-block";
        }
    }
}

// inicializa feed
renderFeed();

// botão carregar mais
const btn = document.getElementById("loadMoreFeed");
if (btn) {
    btn.addEventListener("click", () => {
        limite += 5; // incrementa mais 5 cards
        renderFeed();
    });
}
