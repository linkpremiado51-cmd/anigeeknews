// modulo-noticias.js (RAIZ)

// IMPORTAÇÃO DOS DADOS (Conforme sua nova estrutura de pastas)
import { dadosAnalise } from './dados_de_noticias/dados-analise.js';

// Mapeia qual lista usar baseado na aba atual
const bancoDeDados = {
    analises: dadosAnalise,
    // Adicione os próximos aqui: podcast: dadosPodcast, etc.
};

// Lógica de índices persistentes por seção
let indices = JSON.parse(localStorage.getItem('indices_secoes')) || { 
    manchetes: 0, analises: 0, entrevistas: 0, lancamentos: 0, podcast: 0 
};

// Função auxiliar para criar o HTML (Mantendo seu padrão original)
function criarEstruturaNoticia(noticia) {
    return `
        <a href="#" class="news-link news-extra-persistente">
            <article class="post-card">
                <div class="post-img-wrapper">
                    <img src="${noticia.img}" alt="${noticia.titulo}" loading="lazy">
                </div>
                <div class="post-content">
                    <span class="category">${noticia.categoria}</span>
                    <h2>${noticia.titulo}</h2>
                    <p>${noticia.descricao}</p>
                    <div class="action-row">
                        <span class="meta-minimal">${noticia.meta}</span>
                        <button class="like-btn" onclick="event.preventDefault(); window.toggleLike(this)">
                            <span>${noticia.likes}</span> leitores recomendam
                        </button>
                    </div>
                </div>
            </article>
        </a>`;
}

// 1. FUNÇÃO PARA RESTAURAR (Adaptada para checar a seção atual)
export function restaurarNoticiasSalvas() {
    const secaoAtual = localStorage.getItem('currentSection') || 'manchetes';
    const lista = bancoDeDados[secaoAtual];
    const botaoContainer = document.querySelector('.load-more-container');
    
    if (!lista || !botaoContainer) return;

    for (let i = 0; i < indices[secaoAtual]; i++) {
        if (lista[i]) {
            botaoContainer.insertAdjacentHTML('beforebegin', criarEstruturaNoticia(lista[i]));
        }
    }
    verificarFimDasNoticias(secaoAtual, lista);
}

// 2. FUNÇÃO PRINCIPAL DO BOTÃO (Mantendo sua lógica de 2 por clique)
export function carregarNoticiasExtras() {
    const secaoAtual = localStorage.getItem('currentSection') || 'manchetes';
    const lista = bancoDeDados[secaoAtual];
    const botaoContainer = document.querySelector('.load-more-container');

    if (!lista || !botaoContainer) return;

    const quantidadePorClique = 2;
    let indiceAtual = indices[secaoAtual];

    for (let i = 0; i < quantidadePorClique; i++) {
        if (indiceAtual >= lista.length) break;

        botaoContainer.insertAdjacentHTML('beforebegin', criarEstruturaNoticia(lista[indiceAtual]));
        indiceAtual++;
    }

    // Salva o progresso específico desta seção
    indices[secaoAtual] = indiceAtual;
    localStorage.setItem('indices_secoes', JSON.stringify(indices));

    verificarFimDasNoticias(secaoAtual, lista);
}

function verificarFimDasNoticias(secao, lista) {
    if (indices[secao] >= lista.length) {
        const botao = document.querySelector('.load-more-btn');
        if (botao) {
            botao.disabled = true;
            botao.textContent = "Sem mais conteúdo";
        }
    }
}

