// motor_de_pesquisa/barra_de_pesquisa.js

/* =========================
   ESTADO GLOBAL
========================= */
let bancoDeNoticias = [];
let indiceCarregado = false;

/* =========================
   NORMALIZAÇÃO
========================= */
function normalizarTexto(texto = "") {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

/* =========================
   CARREGAMENTO DO ÍNDICE
========================= */
async function carregarNoticias() {
    try {
        const resposta = await fetch('/motor_de_pesquisa/noticias.json');
        if (!resposta.ok) throw new Error('Falha ao carregar noticias.json');

        bancoDeNoticias = await resposta.json();
        indiceCarregado = true;

        console.log('Índice carregado:', bancoDeNoticias.length);
    } catch (erro) {
        console.error('Erro ao carregar índice:', erro);
    }
}

/* =========================
   SCORE DE RELEVÂNCIA
========================= */
function calcularScore(noticia, termo) {
    let score = 0;
    const termoNorm = normalizarTexto(termo);

    const titulo = normalizarTexto(noticia.conteudo.titulo);
    const descricao = normalizarTexto(noticia.conteudo.descricao || "");

    const topicos = noticia.indexacao.topicos.map(normalizarTexto);
    const tags = noticia.indexacao.tags.map(normalizarTexto);
    const palavras = noticia.indexacao.palavras_chave.map(normalizarTexto);

    if (titulo.includes(termoNorm)) score += 4;
    if (descricao.includes(termoNorm)) score += 2;
    if (topicos.some(t => t.includes(termoNorm))) score += 3;
    if (tags.some(t => t.includes(termoNorm))) score += 1;
    if (palavras.some(p => p.includes(termoNorm))) score += 2;

    score *= noticia.sinais.peso_base;
    score *= noticia.sinais.prioridade_editorial;

    return score;
}

/* =========================
   BUSCA
========================= */
function buscarNoticias(termo) {
    if (!indiceCarregado) return [];

    const termoNorm = normalizarTexto(termo);
    if (!termoNorm) return [];

    return bancoDeNoticias
        .map(noticia => ({
            noticia,
            score: calcularScore(noticia, termoNorm)
        }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.noticia);
}

/* =========================
   RENDERIZAÇÃO
========================= */
function exibirResultados(resultados, container) {
    if (!resultados.length) {
        container.innerHTML = `
            <p style="text-align:center;color:#666;margin:40px 0">
                Nenhum resultado encontrado
            </p>
        `;
        return;
    }

    container.innerHTML = resultados.map(n => `
        <article class="feed-card">
            <a href="${n.conteudo.url}">
                <img src="${n.conteudo.imagem}" loading="lazy">
                <div class="feed-card-content">
                    <span class="feed-card-category">${n.indexacao.categoria}</span>
                    <h2 class="feed-card-title">${n.conteudo.titulo}</h2>
                    <p class="feed-card-snippet">${n.conteudo.descricao}</p>
                </div>
            </a>
        </article>
    `).join('');
}

/* =========================
   INIT
========================= */
function initSearchBar() {
    const input = document.querySelector('.search-input');
    const button = document.querySelector('.search-btn');
    const container = document.getElementById('dynamic-content');

    if (!input || !button || !container) return;

    carregarNoticias();

    const executarBusca = () => {
        const termo = input.value;
        const resultados = buscarNoticias(termo);
        exibirResultados(resultados, container);
    };

    input.addEventListener('input', () => {
        clearTimeout(window.__buscaDelay);
        window.__buscaDelay = setTimeout(executarBusca, 300);
    });

    button.addEventListener('click', executarBusca);

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') executarBusca();
    });
}

document.addEventListener('DOMContentLoaded', initSearchBar);
