/* =====================================================
   MOTOR DE PESQUISA + MEMÓRIA DE INTERESSES DO USUÁRIO
   ===================================================== */

/* ---------- CONFIGURAÇÕES ---------- */
const CAMINHO_NOTICIAS = '/anigeeknews/motor_de_pesquisa/noticias.json';
const LIMITE_HISTORICO = 10;
const STORAGE_KEY = 'historico_buscas';

/* ---------- ESTADO GLOBAL ---------- */
let todasNoticias = [];
let historicoBuscas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* ---------- UTILIDADES ---------- */
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/* ---------- EXPOSIÇÃO GLOBAL (FEED DEPENDE DISSO) ---------- */
window.obterInteressesParaFeed = function () {
    return historicoBuscas.map(normalizarTexto);
};

/* ---------- CARREGAMENTO DAS NOTÍCIAS ---------- */
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(historicoBuscas));

    // avisa o feed
    window.dispatchEvent(new CustomEvent('interessesAtualizados'));
}

/* ---------- BUSCA ---------- */
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

/* ---------- RENDERIZAÇÃO ---------- */
function renderizarResultados(lista) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    container.classList.add('active');

    if (lista.length === 0) {
        container.innerHTML = `
            <div class="search-empty">
                Nenhum resultado encontrado.
            </div>
        `;
        return;
    }

    container.innerHTML = lista.map(noticia => `
        <a href="${noticia.url}" class="search-result-item">
            <span class="result-category">${noticia.categoria || ''}</span>
            <h4>${noticia.titulo}</h4>
            <p>${noticia.resumo || ''}</p>
        </a>
    `).join('');
}

/* ---------- INICIALIZAÇÃO ---------- */
document.addEventListener('DOMContentLoaded', async () => {
    await carregarNoticias();

    const input = document.querySelector('[data-search-input]');
    const botao = document.querySelector('.search-btn');
    const resultados = document.getElementById('searchResults');
    const barra = document.querySelector('.search-bar');

    if (!input || !botao || !resultados) return;

    function executarBusca() {
        const termo = input.value.trim();
        if (!termo) return;

        salvarBusca(termo);
        const encontrados = buscarNoticias(termo);
        renderizarResultados(encontrados);
    }

    botao.addEventListener('click', executarBusca);

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executarBusca();
        }
    });

    // fecha resultados ao clicar fora
    document.addEventListener('click', e => {
        if (!barra.contains(e.target)) {
            resultados.classList.remove('active');
        }
    });
});
