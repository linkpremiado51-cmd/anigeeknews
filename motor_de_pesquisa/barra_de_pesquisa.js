// motor_de_pesquisa/barra_de_pesquisa.js
let bancoDeNoticias = [];

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

async function carregarNoticias() {
    try {
        const resposta = await fetch('./motor_de_pesquisa/noticias.json');
        if (!resposta.ok) throw new Error('Falha ao carregar noticias.json');
        bancoDeNoticias = await resposta.json();
        console.log('✅ Banco carregado com', bancoDeNoticias.length, 'artigos.');
    } catch (erro) {
        console.error('❌ Erro:', erro);
    }
}

// Calcula relevância: título = 3x, resumo = 2x, tags = 1x
function calcularRelevancia(noticia, termo) {
    const t = normalizarTexto(noticia.titulo);
    const r = normalizarTexto(noticia.resumo);
    const tags = noticia.tags.map(tag => normalizarTexto(tag));
    let score = 0;

    if (t.includes(termo)) score += 3;
    if (r.includes(termo)) score += 2;
    if (tags.some(tag => tag.includes(termo))) score += 1;

    return score;
}

function buscarNoticias(termo) {
    const termoNorm = normalizarTexto(termo);
    if (!termoNorm) return [];

    return bancoDeNoticias
        .filter(noticia => {
            const t = normalizarTexto(noticia.titulo);
            const r = normalizarTexto(noticia.resumo);
            const tags = noticia.tags.map(tag => normalizarTexto(tag));
            return t.includes(termoNorm) || r.includes(termoNorm) || tags.some(tag => tag.includes(termoNorm));
        })
        .sort((a, b) => {
            const scoreA = calcularRelevancia(a, termoNorm);
            const scoreB = calcularRelevancia(b, termoNorm);
            return scoreB - scoreA; // mais relevante primeiro
        });
}

function exibirResultados(resultados, container) {
    if (resultados.length === 0) {
        container.innerHTML = `
            <div style="max-width: var(--container-w); margin: 40px auto; padding: 0 20px; text-align: center; color: var(--text-muted);">
                <h2 style="font-family: var(--font-sans); font-weight: 800; font-size: 18px; text-transform: uppercase; margin-bottom: 15px;">
                    Nenhum resultado encontrado
                </h2>
                <p style="font-family: var(--font-serif); font-size: 16px; line-height: 1.5;">
                    Tente termos como: <em>one piece, jujutsu, elden ring, nintendo</em>
                </p>
            </div>
        `;
        return;
    }

    const html = resultados.map(noticia => `
        <a href="${noticia.url}" class="news-link" style="text-decoration: none; color: inherit; display: grid; grid-template-columns: 120px 1fr; gap: 20px; margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid var(--border);">
            <img src="${noticia.imagem || 'https://via.placeholder.com/120x80?text=Sem+Imagem'}" 
                 loading="lazy"
                 style="width: 100%; height: 80px; object-fit: cover; border-radius: 2px; filter: var(--img-filter);">
            <div>
                <span class="category" style="font-family: var(--font-sans); font-size: 10px; font-weight: 700; color: var(--accent-news); text-transform: uppercase; letter-spacing: 1px;">
                    ${noticia.categoria}
                </span>
                <h3 style="font-family: var(--font-serif-title); font-size: 18px; font-weight: 700; margin: 6px 0; color: var(--text-main); line-height: 1.3;">
                    ${noticia.titulo}
                </h3>
                <p style="font-family: var(--font-serif); font-size: 13px; color: var(--text-muted); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${noticia.resumo}
                </p>
                <div style="font-family: var(--font-sans); font-size: 11px; color: var(--text-muted); margin-top: 6px;">
                    ${noticia.data}
                </div>
            </div>
        </a>
    `).join('');

    container.innerHTML = `
        <div style="max-width: var(--container-w); margin: 20px auto; padding: 0 20px;">
            <div class="section-header" style="margin-bottom: 25px;">
                <h2 class="section-title" style="font-family: var(--font-sans); font-weight: 800; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase; border-top: 2px solid var(--text-main); padding-top: 20px; width: fit-content;">
                    Resultados da busca (${resultados.length})
                </h2>
            </div>
            ${html}
        </div>
    `;
}

function initSearchBar() {
    const input = document.querySelector('.search-input');
    const button = document.querySelector('.search-btn');
    const dynamicContent = document.getElementById('dynamic-content');

    if (!input || !button || !dynamicContent) return;

    carregarNoticias();

    const handleSearch = (termo) => {
        if (!termo.trim()) {
            // Se o campo estiver vazio, não mostra nada (ou pode mostrar últimas notícias)
            dynamicContent.innerHTML = ''; // ou deixe como está
            return;
        }
        const resultados = buscarNoticias(termo);
        exibirResultados(resultados, dynamicContent);
    };

    // 🔍 Busca em tempo real (enquanto digita)
    let debounceTimer;
    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            handleSearch(e.target.value);
        }, 300); // espera 300ms após parar de digitar
    });

    // 🔍 Busca ao clicar no botão
    button.addEventListener('click', () => {
        handleSearch(input.value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 🔍 Busca ao pressionar Enter
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch(input.value);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchBar);
} else {
    initSearchBar();
}
