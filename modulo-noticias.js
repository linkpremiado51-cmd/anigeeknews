// /anigeeknews/modulo-noticias.js

// 1. IMPORTAÇÕES (Adicionei as novas aqui)
import { dadosAnalise } from './dados_de_noticias/dados-analise.js';
import { dadosEntrevistas } from './dados_de_noticias/dados-entrevistas.js';
import { dadosLancamentos } from './dados_de_noticias/dados-lancamentos.js';
import { dadosPodcast } from './dados_de_noticias/dados-podcast.js';

// 2. BANCO DE DADOS (Atualizado para reconhecer as novas abas)
const bancoDeDados = {
    analises: dadosAnalise,
    entrevistas: dadosEntrevistas,
    lancamentos: dadosLancamentos,
    podcast: dadosPodcast
};

// 3. CONTROLE DE ÍNDICES (Garante que todas as seções existam no objeto)
let indices = JSON.parse(localStorage.getItem('indices_secoes')) || { 
    manchetes: 0, 
    analises: 0, 
    entrevistas: 0, 
    lancamentos: 0, 
    podcast: 0 
};

// Garantia extra: Se uma seção nova não existir no objeto recuperado do localStorage, nós a adicionamos
const secoesNecessarias = ['manchetes', 'analises', 'entrevistas', 'lancamentos', 'podcast'];
secoesNecessarias.forEach(s => {
    if (indices[s] === undefined) indices[s] = 0;
});

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

export function restaurarNoticiasSalvas() {
    const secao = localStorage.getItem('currentSection') || 'manchetes';
    if (secao === 'manchetes') return;
    
    const lista = bancoDeDados[secao];
    const container = document.querySelector('.load-more-container');
    
    // Limpa notícias antigas da aba anterior antes de restaurar para evitar duplicação visual
    document.querySelectorAll('.news-extra-persistente').forEach(el => el.remove());

    if (!lista || !container) return;

    // Reconstrói o que já foi carregado anteriormente nesta aba
    for (let i = 0; i < indices[secao]; i++) {
        if (lista[i]) {
            container.insertAdjacentHTML('beforebegin', criarEstruturaNoticia(lista[i]));
        }
    }
    verificarFimDasNoticias(secao, lista);
}

export async function carregarNoticiasExtras() {
    const secao = localStorage.getItem('currentSection') || 'manchetes';
    const container = document.querySelector('.load-more-container');
    const botao = document.querySelector('.load-more-btn');
    
    if (!container || !botao) return;

    // Lógica para a Manchete (Home)
    if (secao === 'manchetes') {
        botao.textContent = 'CARREGANDO...';
        try {
            const res = await fetch('/anigeeknews/modulos/mais_noticias.html');
            if (!res.ok) throw new Error();
            const html = await res.text();
            container.insertAdjacentHTML('beforebegin', html);
            botao.textContent = 'CARREGAR MAIS';
            // Se quiser que o botão suma na manchete após carregar o arquivo fixo:
            // botao.style.display = 'none'; 
        } catch (e) { 
            botao.textContent = 'ERRO AO CARREGAR'; 
        }
        return;
    }

    // Lógica para abas dinâmicas (Analises, Entrevistas, Lançamentos, Podcast)
    const lista = bancoDeDados[secao];
    if (!lista) return;

    // Carrega 2 notícias por clique
    let contador = 0;
    while (contador < 2 && indices[secao] < lista.length) {
        container.insertAdjacentHTML('beforebegin', criarEstruturaNoticia(lista[indices[secao]]));
        indices[secao]++;
        contador++;
    }

    localStorage.setItem('indices_secoes', JSON.stringify(indices));
    verificarFimDasNoticias(secao, lista);
}

function verificarFimDasNoticias(secao, lista) {
    const btn = document.querySelector('.load-more-btn');
    if (btn && lista && indices[secao] >= lista.length) {
        btn.disabled = true;
        btn.textContent = "Sem mais conteúdo";
        btn.style.opacity = "0.5";
    } else if (btn) {
        btn.disabled = false;
        btn.textContent = "Carregar Mais";
        btn.style.opacity = "1";
    }
}

