import { restaurarNoticiasSalvas } from '/anigeeknews/modulo-noticias.js';

const dynamicContent = document.getElementById('dynamic-content');
let originalContent = dynamicContent ? dynamicContent.innerHTML : "";

function activateButton(section) {
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });
}

async function loadFeed() {
    if (!dynamicContent) return;
    try {
        const response = await fetch('/anigeeknews/feed/feed.html');
        const html = await response.text();
        dynamicContent.innerHTML = html;

        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = '/anigeeknews/feed/feed.css';
        document.head.appendChild(cssLink);

        const script = document.createElement('script');
        script.src = '/anigeeknews/feed/feed.js';
        script.defer = true;
        script.onload = () => restaurarNoticiasSalvas();
        document.body.appendChild(script);
    } catch (error) {
        dynamicContent.innerHTML =
            '<p style="padding:40px; text-align:center; color:#888;">Conteúdo do Feed indisponível.</p>';
    }
}

async function loadSection(section) {
    if (!dynamicContent) return;

    // Caso seja a Home (Manchetes)
    if (section === 'manchetes') {
        dynamicContent.innerHTML = originalContent;
        localStorage.setItem('currentSection', 'manchetes');
        restaurarNoticiasSalvas();
        return;
    }

    // Caso seja o Feed Social
    if (section === 'feed') {
        loadFeed();
        return;
    }

    // Para as outras abas (Analises, Entrevistas, etc)
    try {
        const response = await fetch(`/anigeeknews/modulos/${section}.html`);
        const html = await response.text();
        dynamicContent.innerHTML = html;

        // --- INÍCIO DA LÓGICA DE MÓDULOS ROBUSTOS ---
        // Se a seção for "analises", carregamos o script de lógica dela
        if (section === 'analises') {
            import('./modulos/analises-logic.js')
                .then(module => {
                    module.initAnalises();
                })
                .catch(err => console.error("Erro ao carregar o script de análises:", err));
        }
        // --- FIM DA LÓGICA DE MÓDULOS ROBUSTOS ---

        setTimeout(restaurarNoticiasSalvas, 50);
    } catch (error) {
        console.error("Erro ao carregar seção:", error);
        dynamicContent.innerHTML =
            '<p style="padding:40px; text-align:center; color:#888;">Conteúdo indisponível.</p>';
    }
}

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
    else restaurarNoticiasSalvas();
});
