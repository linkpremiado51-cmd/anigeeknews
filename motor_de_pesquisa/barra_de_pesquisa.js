// ===============================
// MOTOR DE PESQUISA – NÚCLEO GLOBAL
// ===============================

(function () {
    const STORAGE_KEYS = {
        HISTORICO_BUSCAS: 'motor_historico_buscas'
    };

    let noticias = [];
    let historicoBuscas = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORICO_BUSCAS)) || [];

    // -------------------------------
    // UTILIDADES
    // -------------------------------
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    function salvarHistorico() {
        localStorage.setItem(
            STORAGE_KEYS.HISTORICO_BUSCAS,
            JSON.stringify(historicoBuscas.slice(-20)) // limita histórico
        );
    }

    function calcularScore(noticia, termos) {
        let score = 0;

        termos.forEach(termo => {
            if (normalizarTexto(noticia.titulo).includes(termo)) score += 5;
            if (normalizarTexto(noticia.resumo).includes(termo)) score += 3;
            if (noticia.tags?.some(tag => normalizarTexto(tag).includes(termo))) score += 4;
            if (normalizarTexto(noticia.categoria).includes(termo)) score += 2;
        });

        // Popularidade e recência como reforço
        score += (noticia.popularidade || 0) * 0.01;

        const dias = (Date.now() - new Date(noticia.data).getTime()) / 86400000;
        if (dias < 7) score += 2;
        else if (dias < 30) score += 1;

        return score;
    }

    // -------------------------------
    // BUSCA EXPLÍCITA
    // -------------------------------
    function buscar(termo) {
        if (!termo) return [];

        const termoNormalizado = normalizarTexto(termo);
        const termos = termoNormalizado.split(' ').filter(Boolean);

        historicoBuscas.push({
            termo: termoNormalizado,
            data: Date.now()
        });
        salvarHistorico();

        const resultados = noticias
            .map(noticia => ({
                ...noticia,
                _score: calcularScore(noticia, termos)
            }))
            .filter(n => n._score > 0)
            .sort((a, b) => b._score - a._score);

        return resultados;
    }

    // -------------------------------
    // FEED (BUSCA IMPLÍCITA)
    // -------------------------------
    function gerarFeed() {
        if (historicoBuscas.length === 0) {
            // fallback: notícias mais populares
            return [...noticias]
                .sort((a, b) => (b.popularidade || 0) - (a.popularidade || 0))
                .slice(0, 10);
        }

        const termosFrequentes = {};

        historicoBuscas.forEach(b => {
            b.termo.split(' ').forEach(t => {
                termosFrequentes[t] = (termosFrequentes[t] || 0) + 1;
            });
        });

        const termosOrdenados = Object.keys(termosFrequentes)
            .sort((a, b) => termosFrequentes[b] - termosFrequentes[a])
            .slice(0, 5);

        return noticias
            .map(noticia => ({
                ...noticia,
                _score: calcularScore(noticia, termosOrdenados)
            }))
            .sort((a, b) => b._score - a._score)
            .slice(0, 10);
    }

    // -------------------------------
    // INICIALIZAÇÃO
    // -------------------------------
    async function carregarNoticias() {
        try {
            const res = await fetch('/anigeeknews/motor_de_pesquisa/noticias.json');
            noticias = await res.json();
        } catch (err) {
            console.error('Erro ao carregar noticias.json', err);
        }
    }

    carregarNoticias();

    // -------------------------------
    // API GLOBAL
    // -------------------------------
    window.motorPesquisa = {
        buscar,
        gerarFeed,
        getHistorico() {
            return historicoBuscas;
        }
    };
})();
