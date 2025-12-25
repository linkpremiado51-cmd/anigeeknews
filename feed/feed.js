/* =====================================================
   FEED INTELIGENTE BASEADO EM COMPORTAMENTO
   ===================================================== */

/* ---------- CONFIGURAÇÕES ---------- */
const CAMINHO_NOTICIAS = '../motor_de_pesquisa/noticias.json';
const LIMITE_FEED = 12;

/* ---------- ESTADO ---------- */
let noticias = [];
let interessesUsuario = [];

/* ---------- UTILIDADES ---------- */
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/* ---------- CARREGAMENTO DE NOTÍCIAS ---------- */
async function carregarNoticias() {
    try {
        const res = await fetch(CAMINHO_NOTICIAS);
        if (!res.ok) throw new Error('Erro ao carregar noticias.json');
        noticias = await res.json();
    } catch (err) {
        console.error('Erro no feed:', err);
        const container = document.getElementById('feed-noticias-container');
        if (container) {
            container.innerHTML = `
                <p class="feed-vazio">
                    Erro ao carregar o feed. Tente novamente mais tarde.
                </p>
            `;
        }
    }
}

/* ---------- INTERESSES DO USUÁRIO ---------- */
function carregarInteresses() {
    // Integração direta com o motor de busca
    if (typeof window.obterInteressesParaFeed === 'function') {
        interessesUsuario = window.obterInteressesParaFeed()
            .map(normalizarTexto);
        return;
    }

    // Fallback seguro
    const historico = JSON.parse(localStorage.getItem('historico_buscas')) || [];
    interessesUsuario = historico.map(normalizarTexto);
}

/* ---------- RANKING DE RELEVÂNCIA ---------- */
function calcularRelevancia(noticia) {
    let score = 0;

    const titulo = normalizarTexto(noticia.titulo || '');
    const resumo = normalizarTexto(noticia.resumo || '');
    const categoria = normalizarTexto(noticia.categoria || '');
    const tags = Array.isArray(noticia.tags)
        ? noticia.tags.map(tag => normalizarTexto(tag))
        : [];

    interessesUsuario.forEach(interesse => {
        if (titulo.includes(interesse)) score += 5;
        if (tags.some(tag => tag.includes(interesse))) score += 4;
        if (resumo.includes(interesse)) score += 3;
        if (categoria.includes(interesse)) score += 2;
    });

    return score;
}

/* ---------- CONSTRUÇÃO DO FEED ---------- */
function montarFeed() {
    const container = document.getElementById('feed-noticias-container');
    if (!container) return;

    if (interessesUsuario.length === 0) {
        container.innerHTML = `
            <p class="feed-vazio">
                Pesquise assuntos no site para personalizar seu feed.
            </p>
        `;
        return;
    }

    const ranking = noticias
        .map(noticia => ({
            ...noticia,
            score: calcularRelevancia(noticia)
        }))
        .filter(n => n.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, LIMITE_FEED);

    if (ranking.length === 0) {
        container.innerHTML = `
            <p class="feed-vazio">
                Nenhuma notícia relevante encontrada para seus interesses.
            </p>
        `;
        return;
    }

    container.innerHTML = ranking.map(noticia => `
        <a href="${noticia.url}" class="feed-card">
            <img 
                src="${noticia.imagem || 'https://via.placeholder.com/300x180'}" 
                alt="${noticia.titulo}" 
                loading="lazy"
            >
            <div class="feed-card-content">
                <span class="categoria">${noticia.categoria}</span>
                <h3>${noticia.titulo}</h3>
                <p>${noticia.resumo}</p>
                <div class="feed-meta">${noticia.data || ''}</div>
            </div>
        </a>
    `).join('');
}

/* ---------- INTERESSES VISUAIS ---------- */
function renderizarInteresses() {
    const container = document.getElementById('interesses-usuario');
    if (!container) return;

    if (interessesUsuario.length === 0) {
        container.innerHTML = `
            <span class="feed-vazio">Nenhum interesse detectado</span>
        `;
        return;
    }

    container.innerHTML = interessesUsuario.map(tag => `
        <span class="interesse-tag">${tag}</span>
    `).join('');
}

/* ---------- INICIALIZAÇÃO ---------- */
document.addEventListener('DOMContentLoaded', async () => {
    await carregarNoticias();
    carregarInteresses();
    renderizarInteresses();
    montarFeed();
});
