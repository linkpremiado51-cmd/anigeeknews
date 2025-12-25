// ===============================
// FEED DE NOTÍCIAS – CAMADA DE UI
// ===============================

(function () {

    function criarCardNoticia(noticia) {
        return `
            <a href="${noticia.url}" class="news-link" style="text-decoration:none;">
                <div class="feed-post">
                    <img 
                        src="${noticia.imagem || 'https://via.placeholder.com/100x70'}"
                        alt="${noticia.titulo}"
                        loading="lazy"
                    />
                    <div class="feed-post-content">
                        <span class="category">${noticia.categoria}</span>
                        <h3>${noticia.titulo}</h3>
                        <p>${noticia.resumo}</p>
                        <div class="feed-post-meta">
                            ${formatarData(noticia.data)} • ${noticia.tempoLeitura || 5} min
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    function formatarData(dataISO) {
        if (!dataISO) return '';
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    function renderizarFeed() {
        const container = document.getElementById('feed-articles');
        if (!container) {
            console.warn('feed-articles não encontrado.');
            return;
        }

        if (!window.motorPesquisa) {
            container.innerHTML = `
                <p style="text-align:center; color:var(--text-muted);">
                    Motor de pesquisa não carregado.
                </p>
            `;
            return;
        }

        const noticias = window.motorPesquisa.gerarFeed();

        if (!noticias || noticias.length === 0) {
            container.innerHTML = `
                <p style="text-align:center; color:var(--text-muted);">
                    Nenhuma notícia relevante encontrada no momento.
                </p>
            `;
            return;
        }

        container.innerHTML = noticias.map(criarCardNoticia).join('');
    }

    // ---------------------------------
    // ATUALIZAÇÃO AUTOMÁTICA DO FEED
    // ---------------------------------
    function observarBuscas() {
        let historicoAnterior = JSON.stringify(
            window.motorPesquisa?.getHistorico() || []
        );

        setInterval(() => {
            if (!window.motorPesquisa) return;

            const historicoAtual = JSON.stringify(
                window.motorPesquisa.getHistorico()
            );

            if (historicoAtual !== historicoAnterior) {
                historicoAnterior = historicoAtual;
                renderizarFeed();
            }
        }, 1000);
    }

    // ---------------------------------
    // INICIALIZAÇÃO
    // ---------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        renderizarFeed();
        observarBuscas();
    });

})();
