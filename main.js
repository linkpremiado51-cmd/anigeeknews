import { carregarNoticiasExtras } from './modulo-noticias.js';

// --- CONFIGURAÇÃO DO BOTÃO CARREGAR MAIS ---
const btnCarregar = document.querySelector('button[style*="cursor: pointer"]');
if (btnCarregar) {
    btnCarregar.addEventListener('click', () => {
        carregarNoticiasExtras();
        // Opcional: esconde o botão após clicar para não repetir a carga
        btnCarregar.parentElement.style.display = 'none'; 
    });
}

// --- FUNÇÕES DE INTERFACE (Globais para o HTML acessar) ---
window.toggleMobileMenu = () => {
    document.getElementById('mobileMenu').classList.toggle('active');
};

window.toggleSocials = () => {
    document.getElementById('socialsSubmenu').classList.toggle('active');
};

window.scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
};

window.toggleLike = (button) => {
    const span = button.querySelector('span');
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
};

if(themeToggle) themeToggle.addEventListener('change', (e) => aplicarTema(e.target.checked));
if(mobileThemeToggle) mobileThemeToggle.addEventListener('change', (e) => aplicarTema(e.target.checked));

// --- BARRA DE PROGRESSO E BOTÃO VOLTAR AO TOPO ---
window.onscroll = () => {
    const btn = document.querySelector('.back-to-top');
    const bar = document.getElementById('progress-bar');
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Barra de progresso
    if(bar) {
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";
    }

    // Botão Voltar ao Topo
    if (btn) {
        btn.style.opacity = (winScroll > 300) ? '1' : '0';
    }
};

