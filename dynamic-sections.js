// Tentativa de importação com tratamento de erro para não travar o site
let restaurarNoticiasSalvas = () => console.log("Aguardando carregamento do módulo...");

import('/anigeeknews/modulo-noticias.js')
    .then(m => {
        restaurarNoticiasSalvas = m.restaurarNoticiasSalvas;
        restaurarNoticiasSalvas();
    })
    .catch(err => {
        console.error("Erro ao carregar modulo-noticias.js. Verifique acentos nas pastas!");
    });

const dynamicContent = document.getElementById('dynamic-content');
let originalContent = dynamicContent ? dynamicContent.innerHTML : "";

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
        // Carrega o HTML da seção
        const response = await fetch(`/anigeeknews/modulos/${section}.html`);
        const html = await response.text();
        dynamicContent.innerHTML = html;

        // --- LÓGICA DE TESTE PARA O CELULAR ---
        if (section === 'analises') {
            console.log("Tentando carregar lógica de análises...");
            // Usando o caminho relativo que é mais seguro no seu caso
            import('./modulos/analises-logic.js')
                .then(module => {
                    module.initAnalises();
                })
                .catch(err => {
                    alert("Erro ao carregar o arquivo .js. O arquivo está na pasta 'modulos'?");
                });
        }
        
        setTimeout(restaurarNoticiasSalvas, 50);
    } catch (error) {
        dynamicContent.innerHTML = '<p>Erro ao carregar seção.</p>';
    }
}

// Eventos de clique
document.querySelectorAll('.filter-tag').forEach(button => {
    button.addEventListener('click', () => {
        const section = button.dataset.section;
        localStorage.setItem('currentSection', section);
        activateButton(section);
        loadSection(section);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('currentSection') || 'manchetes';
    activateButton(saved);
    if (saved !== 'manchetes') loadSection(saved);
});

