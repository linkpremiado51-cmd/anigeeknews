import { carregarNoticiasExtras } from './modulo-noticias.js';

// Seleciona o botão de carregar mais
const btnCarregar = document.querySelector('button[style*="cursor: pointer"]');

if (btnCarregar) {
    btnCarregar.addEventListener('click', () => {
        carregarNoticiasExtras();
        // Opcional: Esconder o botão após carregar para não carregar infinitamente
        btnCarregar.style.display = 'none'; 
    });
}

// Mantenha suas funções de UI aqui
window.toggleMobileMenu = () => document.getElementById('mobileMenu').classList.toggle('active');
// ... outras funções de interface
