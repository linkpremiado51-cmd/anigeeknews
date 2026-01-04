// dynamic-sections.js

const dynamicContent = document.getElementById('dynamic-content');
let originalContent = dynamicContent ? dynamicContent.innerHTML : "";

// Função reserva caso o modulo-noticias falhe
let restaurarNoticiasSalvas = () => { 
    console.warn("Módulo de notícias não carregado ou aguardando..."); 
};

// 1. Tenta carregar o módulo de notícias de forma segura
import('/anigeeknews/modulo-noticias.js')
    .then(m => { 
        restaurarNoticiasSalvas = m.restaurarNoticiasSalvas; 
        // Se já terminou de carregar a página, restaura as notícias
        if (document.readyState === 'complete') restaurarNoticiasSalvas();
    })
    .catch(e => {
        console.error("Falha ao carregar modulo-noticias.js. Verifique caminhos e acentos:", e);
    });

function activateButton(section) {
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });
}

async function loadSection(section) {
    if (!dynamicContent) return;

    // Caso seja a Home
    if (section === 'manchetes') {
        dynamicContent.innerHTML = originalContent;
        localStorage.setItem('currentSection', 'manchetes');
        restaurarNoticiasSalvas();
        return;
    }

    try {
        // 2. Carrega o arquivo HTML da pasta modulos
        const response = await fetch(`/anigeeknews/modulos/${section}.html`);
        const html = await response.text();
        dynamicContent.innerHTML = html;

        // 3. Lógica específica para a aba de Análises
        if (section === 'analises') {
            console.log("Tentando ativar lógica de análises...");
            
            // Tentativa de carregar o script com caminho reforçado
            import('./modulos/analises-logic.js')
                .then(mod => {
                    if (mod.initAnalises) {
                        mod.initAnalises();
                    }
                })
                .catch(err => {
                    console.error("Não foi possível carregar analises-logic.js. Tentando caminho alternativo...");
                    // Tentativa 2: Caminho absoluto
                    import('/anigeeknews/modulos/analises-logic.js')
                        .then(mod => mod.initAnalises());
                });
        }

        // Dá um pequeno tempo para o HTML assentar e tenta renderizar as notícias
        setTimeout(() => {
            if (typeof restaurarNoticiasSalvas === 'function') {
                restaurarNoticiasSalvas();
            }
        }, 100);

    } catch (error) {
        console.error("Erro ao carregar HTML da seção:", error);
        dynamicContent.innerHTML = '<p style="text-align:center; padding:50px; color:gray;">Conteúdo indisponível no momento.</p>';
    }
}

// Ouvinte de cliques nos botões do menu/tags
document.querySelectorAll('.filter-tag').forEach(button => {
    button.addEventListener('click', () => {
        const section = button.dataset.section;
        localStorage.setItem('currentSection', section);
        activateButton(section);
        loadSection(section);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Inicialização ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('currentSection') || 'manchetes';
    activateButton(saved);
    if (saved !== 'manchetes') {
        loadSection(saved);
    } else {
        // Pequeno delay para garantir que o import do modulo-noticias terminou
        setTimeout(restaurarNoticiasSalvas, 500);
    }
});

