// feed.js
import { dadosFeed } from "../dados_de_noticias/dados-feed.js";
import { dadosAnalise } from "../dados_de_noticias/dados-analise.js";
import { dadosEntrevistas } from "../dados_de_noticias/dados-entrevistas.js";
import { dadosLancamentos } from "../dados_de_noticias/dados-lancamentos.js";
import { dadosManchetes } from "../dados_de_noticias/dados-manchetes.js";
import { dadosPodcast } from "../dados_de_noticias/dados-podcast.js";

// Mapeamento de categorias para cores (para estilo visual tipo NY Times)
const coresCategoria = {
    Animes: "#D32F2F",
    Cinema: "#1976D2",
    Games: "#388E3C",
    Mangás: "#FBC02D",
    Podcast: "#7B1FA2",
    Manchetes: "#455A64",
    Entrevistas: "#F57C00",
    Lancamentos: "#00796B"
};

// Cria array único com todos os itens
const todosDados = [
    ...dadosManchetes,
    ...dadosAnalise,
    ...dadosEntrevistas,
    ...dadosLancamentos,
    ...dadosPodcast,
    ...dadosFeed
];

// Função para renderizar o feed
function renderFeed() {
    const container = document.getElementById("feedContainer");
    if (!container) return;

    container.innerHTML = ""; // limpa container

    todosDados.forEach(item => {
        const article = document.createElement("article");
        article.className = "post-card";

        article.innerHTML = `
            <div class="post-img-wrapper">
                <img src="${item.img}" alt="${item.titulo}" loading="lazy">
            </div>
            <div class="post-content">
                <span class="category" style="color: ${coresCategoria[item.categoria] || "#000"}">
                    ${item.categoria}
                </span>
                <h2>${item.titulo}</h2>
                <p>${item.descricao}</p>
                <div class="action-row">
                    <span class="meta-minimal">${item.meta || ""}</span>
                    ${item.likes ? `<button class="like-btn" onclick="event.preventDefault(); window.toggleLike(this)">
                        <span>${item.likes}</span> recomendações
                    </button>` : `<a href="${item.link || '#'}" class="read-more">Ler mais</a>`}
                </div>
            </div>
        `;

        container.appendChild(article);
    });
}

// Inicializa feed
renderFeed();

// Função global para atualizar categoria, caso queira filtrar depois
window.atualizarCategoriaFeed = (novaCategoria) => {
    const container = document.getElementById("feedContainer");
    if (!container) return;

    const filtro = novaCategoria.toLowerCase();
    container.innerHTML = "";

    todosDados
        .filter(item => item.categoria.toLowerCase() === filtro)
        .forEach(item => {
            const article = document.createElement("article");
            article.className = "post-card";

            article.innerHTML = `
                <div class="post-img-wrapper">
                    <img src="${item.img}" alt="${item.titulo}" loading="lazy">
                </div>
                <div class="post-content">
                    <span class="category" style="color: ${coresCategoria[item.categoria] || "#000"}">
                        ${item.categoria}
                    </span>
                    <h2>${item.titulo}</h2>
                    <p>${item.descricao}</p>
                    <div class="action-row">
                        <span class="meta-minimal">${item.meta || ""}</span>
                        ${item.likes ? `<button class="like-btn" onclick="event.preventDefault(); window.toggleLike(this)">
                            <span>${item.likes}</span> recomendações
                        </button>` : `<a href="${item.link || '#'}" class="read-more">Ler mais</a>`}
                    </div>
                </div>
            `;

            container.appendChild(article);
        });
};
