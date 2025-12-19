// 1. IMPORTAÇÕES DE DADOS
import { dadosManchetes } from './dados_de_noticias/dados-manchetes.js';
import { dadosAnalise } from './dados_de_noticias/dados-analise.js';
import { dadosEntrevistas } from './dados_de_noticias/dados-entrevistas.js';
import { dadosLancamentos } from './dados_de_noticias/dados-lancamentos.js';
import { dadosPodcast } from './dados_de_noticias/dados-podcast.js';

// 2. BANCO DE DADOS CENTRALIZADO
const bancoDeDados = {
    manchetes: dadosManchetes,
    analises: dadosAnalise,
    entrevistas: dadosEntrevistas,
    lancamentos: dadosLancamentos,
    podcast: dadosPodcast
};

// 3. CONTROLE DE ÍNDICES
// Define as seções que o sistema deve gerenciar
const secoesPermitidas = ['manchetes', 'analises', 'entrevistas', 'lancamentos', 'podcast'];

let indices = JSON.parse(localStorage.getItem('indices_secoes')) || {};

// Garante que todas as seções existam no objeto de índices ao carregar
secoesPermitidas.forEach(s => {
    if (indices[s] === undefined) indices[s] = 0;
});

// 4. ESTRUTURA HTML DA NOTÍCIA
function criarEstruturaNoticia(noticia) {
    return `
        <a href="${noticia.url || '#'}" class="news-link news-extra-persistente">
            <article class="post-card">
                <div class="post-img-wrapper"><img src="${noticia.img}" loading="lazy"></div>
                <div class="post-content">
                    <span class="category">${noticia.category || noticia.categoria}</span>
                    <h2>${noticia.titulo}</h2>
                    <p>${noticia.descricao}</p>
                    <div class="action-row">
                        <span class="meta-minimal">${noticia.meta}</span>
                        <button class="like-btn" onclick="event.preventDefault(); if(window.toggleLike) window.toggleLike(this)">
                            <span>${noticia.likes || 0}</span> leitores
                        </button>
                    </div>
                </div>
            </article>
        </a>`;
}

// 5. FUNÇÃO DE RESTAURAÇÃO (Roda ao trocar de aba)
export function restaurarNoticiasSalvas() {
    const secao = localStorage.getItem('currentSection') || 'manchetes';
    const lista = bancoDeDados[secao];
    const container = document.querySelector('.load-more-container');
    
    // Limpa notícias injetadas anteriormente para evitar lixo visual
    document.querySelectorAll('.news-extra-persistente').forEach(el => el.remove());

    if (!lista || !container) return;

    // Reconstrói apenas o que o usuário já tinha aberto nesta aba específica
    for (let i = 0; i < indices[secao]; i++) {
        if (lista[i]) {
            container.insertAdjacentHTML('beforebegin', criarEstruturaNoticia(lista[i]));
        }
    }
    verificarFimDasNoticias(secao, lista);
}

// 6. FUNÇÃO CARREGAR MAIS (Roda no clique do botão)
export async function carregarNoticiasExtras() {
    const secao = localStorage.getItem('currentSection') || 'manchetes';
    const container = document.querySelector('.load-more-container');
    const botao = document.querySelector('.load-more-btn');
    
    if (!container || !botao) return;

    const lista = bancoDeDados[secao];
    if (!lista || lista.length === 0) return;

    // Carrega sempre de 2 em 2
    let contador = 0;
    while (contador < 2 && indices[secao] < lista.length) {
        container.insertAdjacentHTML('beforebegin', criarEstruturaNoticia(lista[indices[secao]]));
        indices[secao]++;
        contador++;
    }

    // Persiste o progresso no LocalStorage
    localStorage.setItem('indices_secoes', JSON.stringify(indices));
    verificarFimDasNoticias(secao, lista);
}

// 7. VERIFICAÇÃO DE ESTADO DO BOTÃO
function verificarFimDasNoticias(secao, lista) {
    const btn = document.querySelector('.load-more-btn');
    if (!btn) return;

    if (lista && indices[secao] >= lista.length) {
        btn.disabled = true;
        btn.textContent = "Fim do conteúdo";
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
    } else {
        btn.disabled = false;
        btn.textContent = "Carregar Mais";
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
    }
}

