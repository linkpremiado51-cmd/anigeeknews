// ==================================================
// 1. IMPORTAÇÕES DE DADOS
// ==================================================
import { dadosManchetes } from './dados_de_noticias/dados-manchetes.js';
import { dadosAnalise } from './dados_de_noticias/dados-analise.js';
import { dadosEntrevistas } from './dados_de_noticias/dados-entrevistas.js';
import { dadosLancamentos } from './dados_de_noticias/dados-lancamentos.js';
import { dadosPodcast } from './dados_de_noticias/dados-podcast.js';

// ==================================================
// 2. BANCO DE DADOS CENTRALIZADO
// ==================================================
const bancoDeDados = {
    manchetes: dadosManchetes,
    analises: dadosAnalise,
    entrevistas: dadosEntrevistas,
    lancamentos: dadosLancamentos,
    podcast: dadosPodcast
};

// ==================================================
// 3. UTILITÁRIOS DE FORMATAÇÃO
// ==================================================
function normalizarTexto(texto = '') {
    return texto.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function definirClasseTema(noticia) {
    const busca = normalizarTexto(`${noticia.titulo} ${noticia.category || noticia.categoria}`);
    if (busca.includes('one piece')) return 'secao-onepiece';
    if (busca.includes('solo leveling')) return 'secao-sololeveling';
    if (busca.includes('elden ring') || busca.includes('games')) return 'secao-eldenring';
    return ''; 
}

// ==================================================
// 4. HTML DA NOTÍCIA (DESIGN EDITORIAL COM IMAGEM)
// ==================================================
function criarEstruturaNoticia(noticia) {
    const temaClasse = definirClasseTema(noticia);
    const linkArtigo = noticia.url || "#";
    // Usa a imagem do banco de dados ou um placeholder de alta qualidade
    const imagemURL = noticia.img || "https://via.placeholder.com/1200x675?text=Anigeek+News";

    return `
    <article class="destaque-secao ${temaClasse} news-extra-persistente">
        <div class="destaque-padding">
            <div class="destaque-categoria">
                <i class="fa-solid fa-layer-group"></i> ${noticia.category || noticia.categoria || 'Geral'}
            </div>
            
            <div class="destaque-header">
                <h2 class="destaque-titulo">${noticia.titulo}</h2>
                <div class="menu-opcoes-container" tabindex="0">
                    <button class="btn-tres-pontos" aria-label="Mais opções">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <div class="dropdown-conteudo">
                        <a href="#"><i class="fa-regular fa-bookmark"></i> Salvar Artigo</a>
                        <a href="#"><i class="fa-solid fa-headphones"></i> Fazer Leitura</a>
                        <a href="#"><i class="fa-regular fa-face-smile"></i> Tenho interesse</a>
                        <a href="#"><i class="fa-regular fa-face-frown"></i> Não tenho interesse</a>
                        <a href="javascript:void(0)" onclick="navigator.clipboard.writeText(window.location.href)">
                            <i class="fa-regular fa-copy"></i> Copiar Link
                        </a>
                    </div>
                </div>
            </div>

            <p class="destaque-resumo">${noticia.descricao || noticia.resumo}</p>
            
            <div class="destaque-info-grid">
                <div class="info-item">
                    <span class="info-label">Produção</span>
                    <span class="info-valor">${noticia.estudio || noticia.fonte || 'Anigeek News'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tags</span>
                    <span class="info-valor">${noticia.tags || 'Destaque'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Autor</span>
                    <span class="info-valor">${noticia.autor || 'Redação'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Data</span>
                    <span class="info-valor">${noticia.data || '2026'}</span>
                </div>
            </div>

            <div class="destaque-meta-info">
                <a href="${linkArtigo}" class="destaque-indicador">ABRIR CONTEÚDO</a>
                <span class="tempo-video">
                    <i class="fa-regular fa-clock"></i> ${noticia.meta || noticia.leitura || '5:00'} MIN
                </span>
            </div>
        </div>
        
        <div class="destaque-media">
            <a href="${linkArtigo}">
                <img src="${imagemURL}" alt="${noticia.titulo}" loading="lazy" 
                     style="width:100%; aspect-ratio:16/9; object-fit:cover; display:block;">
            </a>
        </div>

        <div class="destaque-acoes">
            <button class="btn-acao" onclick="window.toggleLike?.(this)">
                <i class="fa-regular fa-thumbs-up"></i> Útil (${noticia.likes || 0})
            </button>
            <button class="btn-acao">
                <i class="fa-solid fa-share-nodes"></i> Compartilhar
            </button>
        </div>
    </article>
    `;
}

// ==================================================
// 5. SISTEMA DE CARREGAMENTO E PERSISTÊNCIA
// ==================================================
let indices = JSON.parse(localStorage.getItem('indices_secoes')) || {};

export function carregarNoticiasExtras() {
    const secao = localStorage.getItem('currentSection') || 'manchetes';
    const container = document.querySelector('.load-more-container');

    if (!container || !bancoDeDados[secao]) return;

    const listaOrdenada = ordenarPorRelevancia(bancoDeDados[secao]);
    indices[secao] = indices[secao] || 0;

    let adicionadas = 0;
    // Carrega 2 por vez para manter o design preenchido
    while (adicionadas < 2 && indices[secao] < listaOrdenada.length) {
        container.insertAdjacentHTML(
            'beforebegin',
            criarEstruturaNoticia(listaOrdenada[indices[secao]])
        );
        indices[secao]++;
        adicionadas++;
    }

    localStorage.setItem('indices_secoes', JSON.stringify(indices));
    verificarFimDasNoticias(secao, listaOrdenada);
}

// ==================================================
// 6. RECOMENDAÇÃO E RESTAURAÇÃO
// ==================================================
function ordenarPorRelevancia(listaOriginal) {
    const gostos = (JSON.parse(localStorage.getItem('gostosUsuario')) || []).map(g => normalizarTexto(g));
    if (!gostos.length) return [...listaOriginal];

    return listaOriginal.map(noticia => {
        let score = 0;
        const textoBusca = normalizarTexto(`${noticia.titulo} ${noticia.category || noticia.categoria}`);
        gostos.forEach(gosto => {
            if (textoBusca.includes(gosto)) score += 5;
        });
        return { ...noticia, score };
    }).sort((a, b) => b.score - a.score);
}

export function restaurarNoticiasSalvas() {
    const secao = localStorage.getItem('currentSection') || 'manchetes';
    const container = document.querySelector('.load-more-container');
    if (!container || !bancoDeDados[secao]) return;

    document.querySelectorAll('.news-extra-persistente').forEach(el => el.remove());
    const listaOrdenada = ordenarPorRelevancia(bancoDeDados[secao]);

    for (let i = 0; i < (indices[secao] || 0); i++) {
        if (listaOrdenada[i]) {
            container.insertAdjacentHTML('beforebegin', criarEstruturaNoticia(listaOrdenada[i]));
        }
    }
    verificarFimDasNoticias(secao, listaOrdenada);
}

function verificarFimDasNoticias(secao, lista) {
    const btn = document.querySelector('.load-more-btn');
    if (!btn) return;
    const acabou = indices[secao] >= lista.length;
    btn.disabled = acabou;
    btn.textContent = acabou ? 'Fim do conteúdo' : 'Carregar Mais Conteúdo';
}
