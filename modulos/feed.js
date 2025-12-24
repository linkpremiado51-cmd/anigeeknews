import { dadosFeed } from "../dados_de_noticias/dados-feed.js";

let limite = 5; // quantidade inicial de cards

// busca a categoria ativa do localStorage ou define como 'manchetes'
let categoriaAtiva = localStorage.getItem('currentSection') || 'manchetes';

function renderFeed() {
    const container = document.getElementById("feedContainer");
    if (!container) return;

    container.innerHTML = "";

    // filtra os dados pela categoria ativa
    const itensFiltrados = dadosFeed.filter(
        item => item.categoria.toLowerCase() === categoriaAtiva.toLowerCase()
    );

    // pega apenas os itens até o limite
    const itensExibidos = itensFiltrados.slice(0, limite);

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

    // busca o botão sempre que renderiza
    const btn = document.getElementById("loadMoreFeed");
    if (btn) {
        if (limite >= itensFiltrados.length) {
            btn.style.display = "none";
        } else {
            btn.style.display = "inline-block";

            // remove listener antigo para evitar duplicidade
            btn.replaceWith(btn.cloneNode(true));
            const novoBtn = document.getElementById("loadMoreFeed");
            novoBtn.addEventListener("click", () => {
                limite += 5;
                renderFeed();
            });
        }
    }
}

// inicializa feed na primeira carga
renderFeed();

// função global para atualizar categoria via main.js
window.atualizarCategoriaFeed = (novaCategoria) => {
    categoriaAtiva = novaCategoria;
    limite = 5; // reseta o limite
    renderFeed();
};
