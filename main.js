import { carregarNoticiasExtras } from './modulo-noticias.js';

// --- CONFIGURAÇÃO DO BOTÃO CARREGAR MAIS ---
// Usei um seletor mais preciso: o botão que está dentro da última div do feed
const btnCarregar = document.querySelector('.feed div:last-child button');

if (btnCarregar) {
    btnCarregar.addEventListener('click', (e) => {
        e.preventDefault(); // Previne qualquer comportamento inesperado
        
        // Chama a função do módulo
        carregarNoticiasExtras();
        
        // Esconde o container (a div) que segura o botão
        const containerPai = btnCarregar.parentElement;
        if (containerPai) {
            containerPai.style.display = 'none';
        }
    });
}

// --- FUNÇÕES DE INTERFACE (Globais para o HTML acessar) ---
window.toggleMobileMenu = () => {
    const menu = document.getElementById('mobileMenu');
    if(menu) menu.classList.toggle('active');
};

window.toggleSocials = () => {
    const submenu = document.getElementById('socialsSubmenu');
    if(submenu) submenu.classList.toggle('active');
};

window.scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
};

window.toggleLike = (button) => {
    const span = button.querySelector('span');
    if(!span) return;
    
    let count = parseInt(span.textContent);
    if (button.classList.contains('liked')) {
        count--;
        button.classList.remove('liked');
    } else {
        count++;
        button.classList.add('liked');
    }
    span.textContent = count;
};

// --- LÓGICA DE TEMA (DARK MODE) ---
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');

const aplicarTema = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    if(themeToggle) themeToggle.checked = isDark;
    if(mobileThemeToggle) mobileThemeToggle.checked = isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Verifica tema salvo
if(localStorage.getItem('theme') === 'dark') {
    aplicarTema(true);
}

if(themeToggle) themeToggle.addEventListener('change', (e) => aplicarTema(e.target.checked));
if(mobileThemeToggle) mobileThemeToggle.addEventListener('change', (e) => aplicarTema(e.target.checked));

// --- BARRA DE PROGRESSO E BOTÃO VOLTAR AO TOPO ---
window.addEventListener('scroll', () => {
    const btn = document.querySelector('.back-to-top');
    const bar = document.getElementById('progress-bar');
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if(bar) {
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";
    }

    if (btn) {
        btn.style.opacity = (winScroll > 300) ? '1' : '0';
        btn.style.pointerEvents = (winScroll > 300) ? 'auto' : 'none';
    }
});

