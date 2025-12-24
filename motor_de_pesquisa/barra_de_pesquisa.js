// /anigeeknews/motor_de_pesquisa/barra_de_pesquisa.js

function initSearchBar() {
    const input = document.querySelector('.search-input');
    const button = document.querySelector('.search-btn');

    if (!input || !button) return;

    // Lógica de busca (pode ser expandida)
    const handleSearch = (e) => {
        e?.preventDefault();
        const query = input.value.trim();
        if (query) {
            console.log('🔍 Pesquisando por:', query);
            // Aqui você pode redirecionar, filtrar ou chamar uma API
            alert(`Você pesquisou por: "${query}"\n(Implemente sua lógica aqui)`);
        } else {
            input.focus();
        }
    };

    button.addEventListener('click', handleSearch);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch(e);
    });
}

// Executa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchBar);
} else {
    initSearchBar();
}
