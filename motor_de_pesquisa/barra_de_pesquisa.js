// motor_de_pesquisa/barra_de_pesquisa.js
// =====================================
// MOTOR CENTRAL DE BUSCA + FEED
// Fonte única de verdade para notícias
// =====================================

const SearchEngine = (() => {
    let noticias = [];
    const STORAGE_KEYS = {
        buscas: 'historico_buscas',
        cliques: 'historico_cliques'
    };

    /* =========================
       UTILIDADES
    ========================= */

    function normalizar(texto = '') {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function salvarNoStorage(chave, valor) {
        localStorage.setItem(chave, JSON.stringify(valor));
    }

    function lerDoStorage(chave, fallback = []) {
        try {
            return JSON.parse(localStorage.getItem(chave)) || fallback;
        } catch {
            return fallback;
        }
    }

    /* =========================
       CARREGAMENTO DE DADOS
    ========================= */

    async function carregarNoticias() {
        if (noticias.length > 0) return noticias;

        const res = await fetch('/anigeeknews/motor_de_pesquisa/noticias.json');
        if (!res.ok) throw new Error('Falha ao carregar noticias.json');

        noticias = await res.json();
        return noticias;
    }

    /* =========================
       HISTÓRICO DO USUÁRIO
    ========================= */

    function registrarBusca(termo) {
        if (!termo || termo.length < 2) return;

        const historico = lerDoStorage(STORAGE_KEYS.buscas);
        const termoNormalizado = normalizar(termo);

        const atualizado = [
            termoNormalizado,
            ...historico.filter(t => t !== termoNormalizado)
        ].slice(0, 10);

        salvarNoStorage(STORAGE_KEYS.buscas, atualizado);
    }

    function registrarClique(idNoticia) {
        if (!idNoticia) return;

        const cliques = lerDoStorage(STORAGE_KEYS.cliques);
        const atualizado = [
            idNoticia,
            ...cliques.filter(id => id !== idNoticia)
        ].slice(0, 20);

        salvarNoStorage(STORAGE_KEYS.cliques, atualizado);
    }

    /* =========================
       ALGORITMO DE RELEVÂNCIA
    ========================= */

    function calcularScore(noticia, contexto) {
        let score = 0;

        const titulo = normalizar(noticia.titulo);
        const resumo = normalizar(noticia.resumo || '');
        const tags = (noticia.tags || []).map(normalizar);

        // 🔍 BUSCA DIRETA
        if (contexto.termo) {
            const termo = normalizar(contexto.termo);

            if (titulo.includes(termo)) score += 10;
            if (resumo.includes(termo)) score += 5;
            if (tags.some(t => t.includes(termo))) score += 8;
        }

        // 🧠 FEED INTELIGENTE
        if (contexto.tipo === 'feed') {
            const buscas = lerDoStorage(STORAGE_KEYS.buscas);
            const cliques = lerDoStorage(STORAGE_KEYS.cliques);

            buscas.forEach(b => {
                if (titulo.includes(b)) score += 3;
                if (tags.some(t => t.includes(b))) score += 4;
            });

            if (cliques.includes(noticia.id)) {
                score += 6;
            }
        }

        // 🕒 RECÊNCIA
        if (noticia.data) {
            const dias = (Date.now() - new Date(noticia.data)) / 86400000;
            if (dias < 2) score += 4;
            else if (dias < 7) score += 2;
        }

        return score;
    }

    /* =========================
       API PÚBLICA
    ========================= */

    async function getNoticiasRelevantes(opcoes = {}) {
        await carregarNoticias();

        const contexto = {
            tipo: opcoes.tipo || 'feed',
            termo: opcoes.termo || '',
            limite: opcoes.limite || 20
        };

        return noticias
            .map(n => ({
                ...n,
                _score: calcularScore(n, contexto)
            }))
            .filter(n => n._score > 0)
            .sort((a, b) => b._score - a._score)
            .slice(0, contexto.limite);
    }

    return {
        carregarNoticias,
        getNoticiasRelevantes,
        registrarBusca,
        registrarClique
    };
})();

// 🔓 Disponibiliza globalmente
window.SearchEngine = SearchEngine;

/* =========================
   INTEGRAÇÃO COM A UI
========================= */

document.addEventListener('input', async (e) => {
    if (!e.target.matches('[data-search-input]')) return;

    const termo = e.target.value.trim();
    SearchEngine.registrarBusca(termo);

    const resultados = await SearchEngine.getNoticiasRelevantes({
        tipo: 'busca',
        termo
    });

    document.dispatchEvent(new CustomEvent('search:resultados', {
        detail: resultados
    }));
});
