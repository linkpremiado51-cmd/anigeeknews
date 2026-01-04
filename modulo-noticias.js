// ==================================================
// 1. IMPORTAÇÕES DE DADOS
// ==================================================
import { dadosManchetes } from './dados_de_noticias/dados-manchetes.js';
import { dadosAnalise } from './dados_de_noticias/dados-analise.js';
import { dadosEntrevistas } from './dados_de_noticias/dados-entrevistas.js';
import { dadosLancamentos } from './dados_de_noticias/dados-lancamentos.js';
import { dadosPodcast } from './dados_de_noticias/dados-podcast.js';

// ==================================================
// 2. BANCO DE DADOS CENTRALIZADO
// ==================================================
const bancoDeDados = {
    manchetes: dadosManchetes,
    analises: dadosAnalise,
    entrevistas: dadosEntrevistas,
    lancamentos: dadosLancamentos,
    podcast: dadosPodcast
};

// ==================================================
// 3. CONTROLE DE ÍNDICES
// ==================================================
const secoesPermitidas = Object.keys(bancoDeDados);

let indices = JSON.parse(localStorage.getItem('indices_secoes')) || {};

secoesPermitidas.forEach(secao => {
    if (typeof indices[secao] !== 'number') indices[secao] = 0;
});

// ==================================================
// 4. UTILITÁRIOS
// ==================================================
function normalizarTexto(texto = '') {
    return texto
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

function gerarSlug(titulo) {
    return normalizarTexto(titulo).replace(/[^a-z0-9]+/g, '-');
}

// ==================================================
// 5. SISTEMA DE RECOMENDAÇÃO (CORRIGIDO)
// ==================================================
function ordenarPorRelevancia(listaOriginal) {
    const gostos = (JSON.parse(localStorage.getItem('gostosUsuario')) || [])
        .map(g => normalizarTexto(g));

    if (!gostos.length) return [...listaOriginal];

    return listaOriginal
        .map(noticia => {
            let score = 0;

            const categoria = normalizarTexto(
                noticia.category || noticia.categoria
            );

            // Peso alto para categoria
            if (gostos.includes(categoria)) {
                score += 5;
            }

            // Peso médio para título
            gostos.forEach(gosto => {
                if (normalizarTexto(noticia.titulo).includes(gosto)) {
                    score += 2;
                }
            });

            return { ...noticia, score };
        })
        .sort((a, b) => b.score - a.score);
}

// ==================================================
// 6. HTML DA NOTÍCIA
// ==================================================
function criarEstruturaNoticia(noticia) {
    const slug = noticia.url
        ? noticia.url
        : `/anigeeknews/noticias/2026/${gerarSlug(noticia.titulo)}.html`;

    return `
        <a href="${slug}" class="news-link news-extra-persistente">
            <article class="post-card">
                <div class="post-img-wrapper">
                    <img src="${noticia.img}" loading="lazy" alt="${noticia.titulo}">
                </div>
                <div class="post-content">
                    <span class="category">${noticia.category || noticia.categoria}</span>
                    <h2>${noticia.titulo}</h2>
                    <p>${noticia.descricao}</p>
                    <div class="action-row">
                        <span class="meta-minimal">${noticia.meta}</span>
                        <button class="like-btn"
                            onclick="event.preventDefault(); window.toggleLike?.(this)">
                            <span>${noticia.likes || 0}</span> leitores
                        </button>
                    </div>
                </div>
            </article>
        </a>
    `;
}

// ==================================================
// 7. RESTAURAR NOTÍCIAS
// ==================================================
export function restaurarNoticiasSalvas() {
    const secao = localStorage.getItem('currentSection') || 'manchetes';
    const container = document.querySelector('.load-more-container');

    if (!container || !bancoDeDados[secao]) return;

    document.querySelectorAll('.news-extra-persistente').forEach(el => el.remove());

    indices[secao] = indices[secao] || 0;

    const listaOrdenada = ordenarPorRelevancia(bancoDeDados[secao]);

    for (let i = 0; i < indices[secao]; i++) {
        if (listaOrdenada[i]) {
            container.insertAdjacentHTML(
                'beforebegin',
                criarEstruturaNoticia(listaOrdenada[i])
            );
        }
    }

    verificarFimDasNoticias(secao, listaOrdenada);
}

// ==================================================
// 8. CARREGAR MAIS
// ==================================================
export function carregarNoticiasExtras() {
    const secao = localStorage.getItem('currentSection') || 'manchetes';
    const container = document.querySelector('.load-more-container');
    const botao = document.querySelector('.load-more-btn');

    if (!container || !botao) return;

    const listaOrdenada = ordenarPorRelevancia(bancoDeDados[secao]);

    let adicionadas = 0;

    while (adicionadas < 2 && indices[secao] < listaOrdenada.length) {
        container.insertAdjacentHTML(
            'beforebegin',
            criarEstruturaNoticia(listaOrdenada[indices[secao]])
        );
        indices[secao]++;
        adicionadas++;
    }

    localStorage.setItem('indices_secoes', JSON.stringify(indices));
    verificarFimDasNoticias(secao, listaOrdenada);
}

// ==================================================
// 9. BOTÃO "CARREGAR MAIS"
// ==================================================
function verificarFimDasNoticias(secao, lista) {
    const btn = document.querySelector('.load-more-btn');
    if (!btn) return;

    const acabou = indices[secao] >= lista.length;

    btn.disabled = acabou;
    btn.textContent = acabou ? 'Fim do conteúdo' : 'Carregar Mais';
    btn.style.opacity = acabou ? '0.5' : '1';
    btn.style.cursor = acabou ? 'not-allowed' : 'pointer';
}
