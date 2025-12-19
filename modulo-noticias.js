// modulo-noticias.js (RAIZ)

// 1. IMPORTAÇÃO DOS DADOS (Certifique-se que os arquivos existem na pasta)
import { dadosAnalise } from './dados_de_noticias/dados-analise.js';
import { dadosEntrevistas } from './dados_de_noticias/dados-entrevistas.js';

// 2. MAPEAMENTO (Adicione novas seções aqui conforme criar os arquivos .js)
const bancoDeDados = {
    analises: dadosAnalise,
    entrevistas: dadosEntrevistas
};

// Lógica de índices persistentes por seção
let indices = JSON.parse(localStorage.getItem('indices_secoes')) || { 
    manchetes: 0, analises: 0, entrevistas: 0, lancamentos: 0, podcast: 0 
};

// Função auxiliar para criar o HTML
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

// 3. FUNÇÃO PARA RESTAURAR (Ignora manchetes, pois ela é fixa)
export function restaurarNoticiasSalvas() {
    const secaoAtual = localStorage.getItem('currentSection') || 'manchetes';
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

// 4. FUNÇÃO PRINCIPAL (Híbrida: Fetch para Manchetes, Banco JS para outras)
export async function carregarNoticiasExtras() {
    const secaoAtual = localStorage.getItem('currentSection') || 'manchetes';
    const botaoContainer = document.querySelector('.load-more-container');
    const botao = document.querySelector('.load-more-btn');

    if (!botaoContainer || !botao) return;

    // --- Lógica para MANCHETES (Busca o arquivo HTML fixo) ---
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
            setTimeout(() => { botao.textContent = 'CARREGAR MAIS'; }, 2000);
        }
        return; 
    }

    // --- Lógica para OUTRAS ABAS (Usa os arquivos .js da pasta dados_de_noticias) ---
    const lista = bancoDeDados[secaoAtual];
    if (!lista) {
        console.warn(`[Aviso] Sem dados para a seção: ${secaoAtual}`);
        return;
    }

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

