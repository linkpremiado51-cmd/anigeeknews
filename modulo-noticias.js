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
const secoesPermitidas = [
    'manchetes',
    'analises',
    'entrevistas',
    'lancamentos',
    'podcast'
];

let indices = JSON.parse(localStorage.getItem('indices_secoes')) || {};

secoesPermitidas.forEach(secao => {
    if (indices[secao] === undefined) indices[secao] = 0;
});

// ==================================================
// 4. FUNÇÃO AUXILIAR: GERAR SLUG
// ==================================================
function gerarSlug(titulo) {
    return titulo
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// ==================================================
// 5. ORDENA NOTÍCIAS PELOS GOSTOS DO USUÁRIO
// ✔ Categoria + Subcategoria
// ✔ Normalização
// ==================================================
function ordenarPorGostos(listaOriginal) {

    if (!Array.isArray(listaOriginal)) return [];

    const gostosUsuario = JSON.parse(
        localStorage.getItem('gostosUsuario')
    ) || [];

    if (!gostosUsuario.length) return [...listaOriginal];

    const gostosNormalizados = gostosUsuario.map(g =>
        String(g).toLowerCase()
    );

    const prioridade = [];
    const resto = [];

    listaOriginal.forEach(noticia => {

        const categoria = noticia.categoria
            ? String(noticia.categoria).toLowerCase()
            : null;

        const subcategoria = noticia.subcategoria
            ? String(noticia.subcategoria).toLowerCase()
            : null;

        const combina =
            (categoria && gostosNormalizados.includes(categoria)) ||
            (subcategoria && gostosNormalizados.includes(subcategoria));

        if (combina) {
            prioridade.push(noticia);
        } else {
            resto.push(noticia);
        }
    });

    return [...prioridade, ...resto];
}

// ==================================================
// 6. ESTRUTURA HTML DA NOTÍCIA
// ==================================================
function criarEstruturaNoticia(noticia) {

    const slug = noticia.url
        ? noticia.url
        : `/anigeeknews/noticias/2026/${gerarSlug(noticia.titulo)}.html`;

    return `
        <a href="${slug}" class="news-link news-extra-persistente">
            <article class="post-card">
                <div class="post-img-wrapper">
                    <img src="${noticia.imagem || noticia.img}" loading="lazy">
                </div>
                <div class="post-content">
                    <span class="category">
                        ${noticia.categoria}${noticia.subcategoria ? ' • ' + noticia.subcategoria : ''}
                    </span>
                    <h2>${noticia.titulo}</h2>
                    <p>${noticia.resumo || noticia.descricao || ''}</p>
                </div>
            </article>
        </a>
    `;
}

// ==================================================
// 7. RESTAURA NOTÍCIAS SALVAS (COM PERSONALIZAÇÃO)
// ==================================================
export function restaurarNoticiasSalvas() {

    const secao = localStorage.getItem('currentSection') || 'manchetes';
    const container = document.querySelector('.load-more-container');

    if (!bancoDeDados[secao] || !container) return;

    if (indices[secao] === undefined) indices[secao] = 0;

    document
        .querySelectorAll('.news-extra-persistente')
        .forEach(el => el.remove());

    const listaOrdenada = ordenarPorGostos(bancoDeDados[secao]);

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
// 8. CARREGAR MAIS NOTÍCIAS
// ==================================================
export function carregarNoticiasExtras() {

    const secao = localStorage.getItem('currentSection') || 'manchetes';
    const container = document.querySelector('.load-more-container');
    const botao = document.querySelector('.load-more-btn');

    if (!container || !botao) return;

    const listaOrdenada = ordenarPorGostos(bancoDeDados[secao]);
    if (!listaOrdenada.length) return;

    let contador = 0;

    while (contador < 2 && indices[secao] < listaOrdenada.length) {
        container.insertAdjacentHTML(
            'beforebegin',
            criarEstruturaNoticia(listaOrdenada[indices[secao]])
        );
        indices[secao]++;
        contador++;
    }

    localStorage.setItem(
        'indices_secoes',
        JSON.stringify(indices)
    );

    verificarFimDasNoticias(secao, listaOrdenada);
}

// ==================================================
// 9. CONTROLE DO BOTÃO "CARREGAR MAIS"
// ==================================================
function verificarFimDasNoticias(secao, lista) {

    const btn = document.querySelector('.load-more-btn');
    if (!btn) return;

    if (indices[secao] >= lista.length) {
        btn.disabled = true;
        btn.textContent = 'Fim do conteúdo';
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.disabled = false;
        btn.textContent = 'Carregar Mais';
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}
