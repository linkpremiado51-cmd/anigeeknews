import { dadosAnalise } from './dados_de_noticias/dados-analise.js';
import { dadosEntrevistas } from './dados_de_noticias/dados-entrevistas.js';

const bancoDeDados = {
    analises: dadosAnalise,
    entrevistas: dadosEntrevistas
};

// Reinicie os índices no localStorage se estiver travado (Limpe o cache do navegador se necessário)
let indices = JSON.parse(localStorage.getItem('indices_secoes')) || { 
    manchetes: 0, analises: 0, entrevistas: 0, lancamentos: 0, podcast: 0 
};

function criarEstruturaNoticia(noticia) {
    return `
        <a href="#" class="news-link news-extra-persistente">
            <article class="post-card">
                <div class="post-img-wrapper"><img src="${noticia.img}" loading="lazy"></div>
                <div class="post-content">
                    <span class="category">${noticia.category || noticia.categoria}</span>
                    <h2>${noticia.titulo}</h2>
                    <p>${noticia.descricao}</p>
                    <div class="action-row">
                        <span class="meta-minimal">${noticia.meta}</span>
                        <button class="like-btn" onclick="event.preventDefault(); window.toggleLike(this)">
                            <span>${noticia.likes}</span> leitores
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
    if (!lista || !container) return;

    for (let i = 0; i < indices[secao]; i++) {
        if (lista[i]) container.insertAdjacentHTML('beforebegin', criarEstruturaNoticia(lista[i]));
    }
    verificarFimDasNoticias(secao, lista);
}

export async function carregarNoticiasExtras() {
    const secao = localStorage.getItem('currentSection') || 'manchetes';
    const container = document.querySelector('.load-more-container');
    const botao = document.querySelector('.load-more-btn');
    if (!container || !botao) return;

    if (secao === 'manchetes') {
        botao.textContent = 'CARREGANDO...';
        try {
            const res = await fetch('/anigeeknews/modulos/mais_noticias.html');
            const html = await res.text();
            container.insertAdjacentHTML('beforebegin', html);
            botao.textContent = 'CARREGAR MAIS';
        } catch (e) { botao.textContent = 'ERRO'; }
        return;
    }

    const lista = bancoDeDados[secao];
    if (!lista) return;

    // Lógica de 2 por vez
    for (let i = 0; i < 2; i++) {
        if (indices[secao] < lista.length) {
            container.insertAdjacentHTML('beforebegin', criarEstruturaNoticia(lista[indices[secao]]));
            indices[secao]++;
        }
    }

    localStorage.setItem('indices_secoes', JSON.stringify(indices));
    verificarFimDasNoticias(secao, lista);
}

function verificarFimDasNoticias(secao, lista) {
    const btn = document.querySelector('.load-more-btn');
    if (btn && indices[secao] >= lista.length) {
        btn.disabled = true;
        btn.textContent = "Sem mais conteúdo";
    }
}

