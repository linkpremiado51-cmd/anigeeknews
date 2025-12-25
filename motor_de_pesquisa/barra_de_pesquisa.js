// motor_de_pesquisa/barra_de_pesquisa.js
// Sistema de busca integrado ao AniGeekNews

let bancoDeNoticias = [];

/**
 * Carrega o banco de notícias do JSON local
 */
async function carregarNoticias() {
    try {
        const resposta = await fetch('./noticias.json');
        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}: Arquivo noticias.json não encontrado`);
        }
        bancoDeNoticias = await resposta.json();
        console.log(`✅ Banco de notícias carregado: ${bancoDeNoticias.length} artigos.`);
    } catch (erro) {
        console.error('❌ Falha ao carregar banco de notícias:', erro);
    }
}

/**
 * Realiza a busca com base em título, resumo e palavras-chave
 */
function buscarNoticias(termo) {
    const termoLimpo = termo.toLowerCase().trim();
    if (!termoLimpo) return [];

    return bancoDeNoticias.filter(noticia => {
        const noTitulo = noticia.titulo.toLowerCase().includes(termoLimpo);
        const noResumo = noticia.resumo.toLowerCase().includes(termoLimpo);
        const nasPalavras = noticia.palavras_chave.some(p => p.toLowerCase().includes(termoLimpo));
        return noTitulo || noResumo || nasPalavras;
    });
}

/**
 * Exibe os resultados no lugar do conteúdo principal
 */
function exibirResultados(resultados, container) {
    if (resultados.length === 0) {
        container.innerHTML = `
            <div style="max-width: var(--container-w); margin: 40px auto; padding: 0 20px; text-align: center; color: var(--text-muted);">
                <h2 style="font-family: var(--font-sans); font-weight: 800; font-size: 18px; text-transform: uppercase; margin-bottom: 15px;">
                    Nenhum resultado encontrado
                </h2>
                <p style="font-family: var(--font-serif); font-size: 16px; line-height: 1.5;">
                    Sua busca por “${document.querySelector('.search-input').value}” não retornou artigos.
                </p>
                <p style="margin-top: 10px; font-size: 14px;">
                    Tente palavras-chave como: <em>one piece, jujutsu, nintendo, streaming</em>
                </p>
            </div>
        `;
        return;
    }

    const html = resultados.map(noticia => `
        <a href="${noticia.url}" class="news-link" style="text-decoration: none; color: inherit; display: block; margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid var(--border);">
            <span class="category" style="font-family: var(--font-sans); font-size: 10px; font-weight: 700; color: var(--accent-news); text-transform: uppercase; letter-spacing: 1px;">
                ${noticia.categoria}
            </span>
            <h3 style="font-family: var(--font-serif-title); font-size: 20px; font-weight: 700; margin: 8px 0; color: var(--text-main); line-height: 1.3;">
                ${noticia.titulo}
            </h3>
            <p style="font-family: var(--font-serif); font-size: 14px; color: var(--text-muted); line-height: 1.5;">
                ${noticia.resumo}
            </p>
            <div style="font-family: var(--font-sans); font-size: 12px; color: var(--text-muted); margin-top: 8px;">
                ${noticia.data}
            </div>
        </a>
    `).join('');

    container.innerHTML = `
        <div style="max-width: var(--container-w); margin: 20px auto; padding: 0 20px;">
            <div class="section-header" style="margin-bottom: 30px;">
                <h2 class="section-title" style="font-family: var(--font-sans); font-weight: 800; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase; border-top: 2px solid var(--text-main); padding-top: 20px; width: fit-content;">
                    Resultados da busca (${resultados.length})
                </h2>
            </div>
            ${html}
        </div>
    `;
}

/**
 * Inicializa a barra de pesquisa
 */
function initSearchBar() {
    const input = document.querySelector('.search-input');
    const button = document.querySelector('.search-btn');
    const dynamicContent = document.getElementById('dynamic-content');

    if (!input || !button || !dynamicContent) {
        console.warn('⚠️ Elementos da barra de pesquisa não encontrados.');
        return;
    }

    // Carrega o banco assim que possível
    carregarNoticias();

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const termo = input.value.trim();
        if (!termo) {
            input.focus();
            return;
        }

        const resultados = buscarNoticias(termo);
        exibirResultados(resultados, dynamicContent);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    button.addEventListener('click', handleSearch);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch(e);
    });
}

// Inicialização segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchBar);
} else {
    initSearchBar();
}
