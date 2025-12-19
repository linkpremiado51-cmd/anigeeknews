// modulo-noticias.js (RAIZ)

// IMPORTAÇÃO DOS DADOS das seções secundárias
import { dadosAnalise } from './dados_de_noticias/dados-analise.js';

// Mapeia qual lista usar baseado na aba atual
const bancoDeDados = {
    analises: dadosAnalise,
    // Adicione os próximos aqui conforme criar os arquivos:
    // games: dadosGames, 
    // podcast: dadosPodcast,
};

// Lógica de índices persistentes
let indices = JSON.parse(localStorage.getItem('indices_secoes')) || { 
    manchetes: 0, analises: 0, entrevistas: 0, lancamentos: 0, podcast: 0 
};

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

// 1. RESTAURAR (Apenas para seções que usam Banco de Dados JS)
export function restaurarNoticiasSalvas() {
    const secaoAtual = localStorage.getItem('currentSection') || 'manchetes';
    
    // Se for manchetes, o HTML já está lá ou foi carregado via mais_noticias.html (não restauramos via JS)
    if (secaoAtual === 'manchetes') return;

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

// 2. CARREGAR EXTRAS (Híbrido: AJAX para Manchetes, JS para as outras)
export async function carregarNoticiasExtras() {
    const secaoAtual = localStorage.getItem('currentSection') || 'manchetes';
    const botaoContainer = document.querySelector('.load-more-container');
    const botao = document.querySelector('.load-more-btn');

    if (!botaoContainer || !botao) return;

    // --- CASO ESPECIAL: MANCHETES (Lógica original de carregar arquivo HTML) ---
    if (secaoAtual === 'manchetes') {
        botao.textContent = 'CARREGANDO...';
        try {
            const response = await fetch('/anigeeknews/modulos/mais_noticias.html');
            if (!response.ok) throw new Error();
            const html = await response.text();
            botaoContainer.insertAdjacentHTML('beforebegin', html);
            botao.textContent = 'CARREGAR MAIS';
        } catch (error) {
            botao.textContent = 'ERRO AO CARREGAR';
        }
        return; 
    }

    // --- CASO GERAL: OUTRAS ABAS (Lógica de Banco de Dados JS) ---
    const lista = bancoDeDados[secaoAtual];
    if (!lista) return;

    const quantidadePorClique = 2;
    let indiceAtual = indices[secaoAtual];

    for (let i = 0; i < quantidadePorClique; i++) {
        if (indiceAtual >= lista.length) break;
        botaoContainer.insertAdjacentHTML('beforebegin', criarEstruturaNoticia(lista[indiceAtual]));
        indiceAtual++;
    }

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

