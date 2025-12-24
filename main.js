// /anigeeknews/main.js

// ------------------------------------------------------------------
// IMPORTAÇÃO DOS MÓDULOS
// ------------------------------------------------------------------
import { carregarNoticiasExtras, restaurarNoticiasSalvas } from './modulo-noticias.js';
import { inicializarMegaMenu } from './modulos/atualizacao_do_menu.js';
import { carregarPerfilLateral } from './usuario/perfil-lateral.js';

// ------------------------------------------------------------------
// IMPORTAÇÃO DOS DADOS DE NOTÍCIAS
// ------------------------------------------------------------------
import { dadosAnalise } from './dados_de_noticias/dados-analise.js';
import { dadosEntrevistas } from './dados_de_noticias/dados-entrevistas.js';
import { dadosLancamentos } from './dados_de_noticias/dados-lancamentos.js';
import { dadosManchetes } from './dados_de_noticias/dados-manchetes.js';
import { dadosPodcast } from './dados_de_noticias/dados-podcast.js';
import { dadosFeed } from './dados_de_noticias/dados-feed.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // ------------------------------------------------------------------
    // INICIALIZAÇÃO DE PERFIL E MENU
    // ------------------------------------------------------------------
    carregarPerfilLateral();
    inicializarMegaMenu();
    restaurarNoticiasSalvas();

    // ------------------------------------------------------------------
    // FUNÇÃO NOVA: CARREGAR FEED COMPLETO
    // ------------------------------------------------------------------
    const carregarFeedCompleto = () => {
        const feedContainer = document.querySelector('.feed');
        if (!feedContainer) return;

        const todasNoticias = [
            ...dadosAnalise,
            ...dadosEntrevistas,
            ...dadosLancamentos,
            ...dadosManchetes,
            ...dadosPodcast,
            ...dadosFeed
        ];

        feedContainer.innerHTML = '';

        todasNoticias.forEach(noticia => {
            const postCard = document.createElement('article');
            postCard.className = 'post-card';

            postCard.innerHTML = `
                <div class="post-img-wrapper">
                    <img src="${noticia.img}" alt="${noticia.titulo}" loading="lazy">
                </div>
                <div class="post-content">
                    <span class="category" style="color: ${noticia.cor || '#000'}">${noticia.categoria}</span>
                    <h2>${noticia.titulo}</h2>
                    <p>${noticia.descricao}</p>
                    <div class="action-row">
                        <span class="meta-minimal">${noticia.meta}</span>
                        <button class="like-btn" onclick="event.preventDefault(); window.toggleLike(this)">
                            <span>${noticia.likes}</span> recomendações
                        </button>
                    </div>
                </div>
            `;

            feedContainer.appendChild(postCard);
        });

        const loadMoreContainer = document.createElement('div');
        loadMoreContainer.className = 'load-more-container';
        loadMoreContainer.style = 'text-align: center; margin-top: 40px; border-top: 1px solid var(--border); padding-top: 20px;';
        loadMoreContainer.innerHTML = `
            <button class="load-more-btn" style="background: none; border: 1px solid var(--text-main); padding: 12px 30px; font-weight: 700; cursor: pointer; color: var(--text-main); text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">
                Ver Arquivo de Entrevistas
            </button>
        `;
        feedContainer.appendChild(loadMoreContainer);
    };

    // ------------------------------------------------------------------
    // GARANTE QUE O FEED EXISTA ANTES DE CARREGAR
    // ------------------------------------------------------------------
    const esperarFeed = setInterval(() => {
        const feedContainer = document.querySelector('.feed');
        if (feedContainer) {
            clearInterval(esperarFeed);
            carregarFeedCompleto();
        }
    }, 50);

    // ------------------------------------------------------------------
    // EVENTOS DE CLIQUE
    // ------------------------------------------------------------------
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('load-more-btn')) {
            e.preventDefault();
            carregarNoticiasExtras();
        }

        const filterBtn = e.target.closest('.filter-tag');
        if (filterBtn) {
            const novaSecao = filterBtn.getAttribute('data-section');
            if (novaSecao) {
                localStorage.setItem('currentSection', novaSecao);
                setTimeout(() => restaurarNoticiasSalvas(), 50);
            }
        }
    });

    // ------------------------------------------------------------------
    // FUNÇÕES DE INTERFACE
    // ------------------------------------------------------------------
    window.toggleMobileMenu = () => {
        const menu = document.getElementById('mobileMenu');
        if (!menu) return;

        // Corrige problema do menu não abrindo
        menu.classList.toggle('active');

        // Bloqueia scroll ao abrir
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    };

    window.toggleSocials = () => {
        const submenu = document.getElementById('socialsSubmenu');
        if (submenu) submenu.classList.toggle('active');
    };

    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.toggleLike = (button) => {
        const span = button.querySelector('span');
        if (!span) return;
        let count = parseInt(span.textContent, 10) || 0;
        if (button.classList.contains('liked')) {
            count--;
            button.classList.remove('liked');
        } else {
            count++;
            button.classList.add('liked');
        }
        span.textContent = count;
    };

    // ------------------------------------------------------------------
    // LÓGICA DE TEMA (DARK MODE)
    // ------------------------------------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');

    const aplicarTema = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (themeToggle) themeToggle.checked = isDark;
        if (mobileThemeToggle) mobileThemeToggle.checked = isDark;
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') aplicarTema(true);

    if (themeToggle) themeToggle.addEventListener('change', (e) => aplicarTema(e.target.checked));
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('change', (e) => aplicarTema(e.target.checked));

    // ------------------------------------------------------------------
    // BARRA DE PROGRESSO + BOTÃO "VOLTAR AO TOPO"
    // ------------------------------------------------------------------
    window.addEventListener('scroll', () => {
        const btn = document.querySelector('.back-to-top');
        const bar = document.getElementById('progress-bar');
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        if (bar && height > 0) {
            const scrolled = (winScroll / height) * 100;
            bar.style.width = `${scrolled}%`;
        }

        if (btn) {
            const visible = winScroll > 300;
            btn.style.opacity = visible ? '1' : '0';
            btn.style.pointerEvents = visible ? 'auto' : 'none';
        }
    });
});
