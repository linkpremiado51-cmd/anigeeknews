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

let categoriaAtiva = localStorage.getItem('currentSection') || 'manchetes';

function renderFeed() {
    const container = document.getElementById("feedContainer");
    if (!container) return;

    container.innerHTML = "";

    // percorre todas as categorias ou apenas a ativa
    Object.values(categoriasMap).forEach(dadosCategoria => {
        dadosCategoria.forEach(item => {
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
    });
}

// inicializa feed
renderFeed();

// função global para atualizar categoria (se você quiser filtrar)
window.atualizarCategoriaFeed = (novaCategoria) => {
    categoriaAtiva = novaCategoria.toLowerCase();
    renderFeed();
};
