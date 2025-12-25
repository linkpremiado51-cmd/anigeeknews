/* =====================================================
   MOTOR DE PESQUISA + MEMÓRIA DE INTERESSES DO USUÁRIO
   ===================================================== */

/* ---------- CONFIGURAÇÕES ---------- */
const CAMINHO_NOTICIAS = './motor_de_pesquisa/noticias.json';
const LIMITE_HISTORICO = 10;

/* ---------- ESTADO GLOBAL ---------- */
let todasNoticias = [];
let historicoBuscas = JSON.parse(localStorage.getItem('historico_buscas')) || [];

/* ---------- UTILIDADES ---------- */
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/* ---------- CARREGAMENTO DE DADOS ---------- */
async function carregarNoticias() {
    try {
        const resposta = await fetch(CAMINHO_NOTICIAS);
        if (!resposta.ok) throw new Error('Erro ao carregar noticias.json');
        todasNoticias = await resposta.json();
    } catch (erro) {
        console.error('Erro no motor de pesquisa:', erro);
    }
}

/* ---------- HISTÓRICO / MEMÓRIA ---------- */
function salvarBusca(termo) {
    termo = termo.trim();
    if (!termo) return;

    const termoNormalizado = normalizarTexto(termo);

    historicoBuscas = historicoBuscas.filter(
        t => normalizarTexto(t) !== termoNormalizado
    );

    historicoBuscas.unshift(termo);

    if (historicoBuscas.length > LIMITE_HISTORICO) {
        historicoBuscas.pop();
    }

    localStorage.setItem('historico_buscas', JSON.stringify(historicoBuscas));
}

function obterInteressesDoUsuario() {
    return historicoBuscas.map(normalizarTexto);
}

/* ---------- BUSCA PRINCIPAL ---------- */
function buscarNoticias(termo) {
    if (!termo) return [];

    const termoNormalizado = normalizarTexto(termo);

    return todasNoticias.filter(noticia => {
        const titulo = normalizarTexto(noticia.titulo || '');
        const resumo = normalizarTexto(noticia.resumo || '');
        const categoria = normalizarTexto(noticia.categoria || '');
        const tags = Array.isArray(noticia.tags)
            ? noticia.tags.map(tag => normalizarTexto(tag))
            : [];

        return (
            titulo.includes(termoNormalizado) ||
            resumo.includes(termoNormalizado) ||
            categoria.includes(termoNormalizado) ||
            tags.some(tag => tag.includes(termoNormalizado))
        );
    });
}

/* ---------- RENDERIZAÇÃO DOS RESULTADOS ---------- */
function renderizarResultados(lista) {
    const container = document.getElementById('resultado-pesquisa');
    if (!container) return;

    if (lista.length === 0) {
        container.innerHTML = `
            <p class="search-empty">
                Nenhum resultado encontrado.
            </p>
        `;
        return;
    }

    container.innerHTML = lista.map(noticia => `
        <a href="${noticia.url}" class="search-item">
            <img 
                src="${noticia.imagem || 'https://via.placeholder.com/120x80'}" 
                alt="${noticia.titulo}"
                loading="lazy"
            >
            <div class="search-item-content">
                <span class="category">${noticia.categoria}</span>
                <h3>${noticia.titulo}</h3>
                <p>${noticia.resumo}</p>
            </div>
        </a>
    `).join('');
}

/* ---------- CONEXÃO COM O FEED ---------- */
/*
   Esta função NÃO renderiza o feed.
   Ela apenas expõe os interesses do usuário
   para o feed usar de forma limpa.
*/
window.obterInteressesParaFeed = function () {
    return obterInteressesDoUsuario();
};

/* ---------- EVENTOS ---------- */
document.addEventListener('DOMContentLoaded', async () => {
    await carregarNoticias();

    const input = document.getElementById('campo-pesquisa');
    const form = document.getElementById('form-pesquisa');

    if (!input || !form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const termo = input.value;
        if (!termo.trim()) return;

        salvarBusca(termo);

        const resultados = buscarNoticias(termo);
        renderizarResultados(resultados);
    });
});
