// /anigeeknews/main.js

// ------------------------------------------------------------------
// IMPORTAÇÃO DOS MÓDULOS
// ------------------------------------------------------------------
import { carregarNoticiasExtras, restaurarNoticiasSalvas } from './modulo-noticias.js';
import { inicializarMegaMenu } from './modulos/atualizacao_do_menu.js'; // NOVO: Importação do Menu
import { carregarPerfilLateral } from './usuario/perfil-lateral.js'; // NOVO: Importação do Perfil
import { carregarMaisFeed, trocarCategoriaFeed } from './modulos/feed.js'; // NOVO: Feed

document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializa o perfil lateral
    carregarPerfilLateral();

    // Inicializa o Mega Menu
    inicializarMegaMenu();

    // Restaura notícias salvas
    restaurarNoticiasSalvas();

    // ------------------------------------------------------------------
    // SISTEMA DE NOTÍCIAS (DINÂMICO)
    // ------------------------------------------------------------------
    document.addEventListener('click', (e) => {

        // Botão de carregar mais
        if (e.target && e.target.classList.contains('load-more-btn')) {
            e.preventDefault();
            console.log('Botão detectado! Chamando carregarMaisFeed...');
            carregarMaisFeed();
        }

        // Troca de aba (preserva funcionamento do menu original)
        const filterBtn = e.target.closest('.filter-tag');
        if (filterBtn) {
            const novaSecao = filterBtn.getAttribute('data-section');
            if (novaSecao) {
                localStorage.setItem('currentSection', novaSecao);
                
                // Mantém restaurar notícias salvas (não quebra o menu)
                setTimeout(() => restaurarNoticiasSalvas(), 50);
                
                // Chama função do feed.js de forma complementar
                trocarCategoriaFeed(novaSecao);
            }
        }
    });

    // ------------------------------------------------------------------
    // FUNÇÕES DE INTERFACE
    // ------------------------------------------------------------------
    window.toggleMobileMenu = () => {
        const menu = document.getElementById('mobileMenu');
        if (menu) menu.classList.toggle('active');
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
