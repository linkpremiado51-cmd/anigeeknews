// dynamic-sections.js

const dynamicContent = document.getElementById('dynamic-content');
let originalContent = dynamicContent ? dynamicContent.innerHTML : "";

// Função reserva caso o modulo-noticias falhe
let restaurarNoticiasSalvas = () => { 
    console.warn("Módulo de notícias não carregado ou aguardando..."); 
};

// 1. Tenta carregar o módulo de notícias de forma segura (Ajustado para GitHub)
import('./modulo-noticias.js')
    .then(m => { 
        restaurarNoticiasSalvas = m.restaurarNoticiasSalvas; 
        if (document.readyState === 'complete') restaurarNoticiasSalvas();
    })
    .catch(e => console.error("Erro ao carregar modulo-noticias:", e));

function activateButton(section) {
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });
}

async function loadSection(section) {
    if (!dynamicContent) return;

    if (section === 'manchetes') {
        dynamicContent.innerHTML = originalContent;
        localStorage.setItem('currentSection', 'manchetes');
        restaurarNoticiasSalvas();
        return;
    }

    try {
        // 2. Carrega o HTML da seção
        const response = await fetch(`./modulos/${section}.html`);
        const html = await response.text();
        dynamicContent.innerHTML = html;

        // 3. ATIVA A BUSCA (Integrada no seu arquivo de dados)
        if (section === 'analises') {
            console.log("Ativando sistema de busca de análises...");
            
            // Importamos o seu arquivo de dados que agora tem a lógica de busca
            import('./dados_de_noticias/dados-analise.js')
                .then(module => {
                    // Chama a função que criamos dentro do seu arquivo de dados
                    if (module.initBuscaAnalises) {
                        module.initBuscaAnalises();
                    }
                })
                .catch(err => console.error("Erro ao carregar busca do arquivo de dados:", err));
        }

        setTimeout(() => {
            if (typeof restaurarNoticiasSalvas === 'function') restaurarNoticiasSalvas();
        }, 100);

    } catch (error) {
        console.error("Erro ao carregar seção:", error);
        dynamicContent.innerHTML = '<p style="text-align:center; padding:50px; color:gray;">Conteúdo indisponível.</p>';
    }
}

// Eventos de clique
document.querySelectorAll('.filter-tag').forEach(button => {
    button.addEventListener('click', () => {
        const section = button.dataset.section;
        localStorage.setItem('currentSection', section);
        activateButton(section);
        loadSection(section);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('currentSection') || 'manchetes';
    activateButton(saved);
    if (saved !== 'manchetes') loadSection(saved);
    else setTimeout(restaurarNoticiasSalvas, 500);
});

