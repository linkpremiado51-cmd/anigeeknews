/* =====================================================
   MOTOR DE PESQUISA + MEMÓRIA DE INTERESSES DO USUÁRIO
   ===================================================== */

/* ---------- CONFIGURAÇÕES ---------- */
const CAMINHO_NOTICIAS = './motor_de_pesquisa/noticias.json';
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

/* ---------- EXPOSIÇÃO GLOBAL (IMPORTANTE) ---------- */
/*
   O FEED DEPENDE DISSO.
   Essa função PRECISA existir mesmo que a busca não seja usada.
*/
window.obterInteressesParaFeed = function () {
    return historicoBuscas.map(normalizarTexto);
};

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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(historicoBuscas));

    // Evento global (feed pode reagir no futuro sem retrabalho)
    window.dispatchEvent(new CustomEvent('interessesAtualizados'));
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
