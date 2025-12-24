// feed.js
import { dadosFeed } from "../dados_de_noticias/dados-feed.js";
import { dadosAnalise } from "../dados_de_noticias/dados-analise.js";
import { dadosEntrevistas } from "../dados_de_noticias/dados-entrevistas.js";
import { dadosLancamentos } from "../dados_de_noticias/dados-lancamentos.js";
import { dadosManchetes } from "../dados_de_noticias/dados-manchetes.js";
import { dadosPodcast } from "../dados_de_noticias/dados-podcast.js";

// mapeamento de categorias para dados
const categoriasMap = {
    feed: dadosFeed,
    analises: dadosAnalise,
    entrevistas: dadosEntrevistas,
    lancamentos: dadosLancamentos,
    manchetes: dadosManchetes,
    podcast: dadosPodcast
};

let limite = 5; // cards iniciais
let categoriaAtiva = localStorage.getItem('currentSection') || 'manchetes';

function renderFeed() {
    const container = document.getElementById("feedContainer");
    if (!container) return;

    container.innerHTML = "";

    const dadosCategoria = categoriasMap[categoriaAtiva.toLowerCase()] || [];
    const itensExibidos = dadosCategoria.slice(0, limite);

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
                    <a href="${item.link || '#'}" class="read-more">Ler mais</a>
                </div>
            </div>
        `;
        container.appendChild(article);
    });

    const btnContainer = document.querySelector(".load-more-container");
    const btn = document.getElementById("loadMoreFeed");

    // botão só aparece para o feed
    if (categoriaAtiva.toLowerCase() === "feed" && btn) {
        btnContainer.style.display = itensExibidos.length < dadosCategoria.length ? "block" : "none";

        btn.replaceWith(btn.cloneNode(true));
        const novoBtn = document.getElementById("loadMoreFeed");
        novoBtn.addEventListener("click", () => {
            limite += 5;
            renderFeed();
        });
    } else if (btnContainer) {
        btnContainer.style.display = "none";
    }
}

// inicializa na primeira carga
renderFeed();

// função global para atualizar categoria
window.atualizarCategoriaFeed = (novaCategoria) => {
    categoriaAtiva = novaCategoria.toLowerCase();
    limite = 5;
    renderFeed();
};
