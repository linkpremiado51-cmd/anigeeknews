import { dadosFeed } from "../dados_de_noticias/dados-feed.js";

const container = document.getElementById("feedContainer");
const filterButtons = document.querySelectorAll(".filter-tag");

let limite = 5;
let categoriaAtiva = "manchetes"; // categoria inicial

function renderFeed() {
    if (!container) return;

    container.innerHTML = "";

    // filtra os dados pela categoria ativa e pega só o limite
    const itensFiltrados = dadosFeed
        .filter(item => item.categoria.toLowerCase() === categoriaAtiva.toLowerCase())
        .slice(0, limite);

    itensFiltrados.forEach(item => {
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
}

// inicializa feed
renderFeed();

// botão carregar mais
const btn = document.getElementById("loadMoreFeed");
if (btn) {
    btn.addEventListener("click", () => {
        limite += 5;
        renderFeed();
    });
}

// filtros
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // marca botão ativo
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // atualiza categoria e limite
        categoriaAtiva = btn.dataset.section;
        limite = 5;
        renderFeed();
    });
});
