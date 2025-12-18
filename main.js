document.addEventListener('DOMContentLoaded', () => {
    import('./modulo-noticias.js').then(({ carregarNoticiasExtras }) => {
        const btnCarregar = document.querySelector('.load-more-btn');
        if (btnCarregar) {
            btnCarregar.addEventListener('click', (e) => {
                e.preventDefault();
                carregarNoticiasExtras(); // botão NÃO é removido aqui
            });
        } else {
            console.warn('[main.js] Botão "Carregar Mais" não encontrado no DOM.');
        }
    }).catch(err => {
        console.error('[main.js] Falha ao carregar modulo-noticias.js:', err);
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
