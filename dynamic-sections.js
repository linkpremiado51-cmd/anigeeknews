import { restaurarNoticiasSalvas } from '/anigeeknews/modulo-noticias.js';

const dynamicContent = document.getElementById('dynamic-content');
let originalContent = dynamicContent ? dynamicContent.innerHTML : "";

function activateButton(section) {
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });
}

// Remove scripts antigos dos módulos
function limparScriptsModulos() {
    document.querySelectorAll('script[data-modulo]').forEach(s => s.remove());
}

function carregarScriptModulo(src) {
    return new Promise(resolve => {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.dataset.modulo = "true";
        script.onload = resolve;
        document.body.appendChild(script);
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

        limparScriptsModulos();
        await carregarScriptModulo('/anigeeknews/feed/feed.js');

        restaurarNoticiasSalvas();
    } catch (error) {
        dynamicContent.innerHTML =
            '<p style="padding:40px; text-align:center; color:#888;">Conteúdo do Feed indisponível.</p>';
    }
}

async function loadSection(section) {
    if (!dynamicContent) return;

    limparScriptsModulos();

    if (section === 'manchetes') {
        dynamicContent.innerHTML = originalContent;
        localStorage.setItem('currentSection', 'manchetes');
        restaurarNoticiasSalvas();
        return;
    }

    if (section === 'feed') {
        loadFeed();
        return;
    }

    if (section === 'destaque') {
        localStorage.setItem('currentSection', 'destaque');

        const html = await (await fetch('/anigeeknews/modulos/conteudo_de_destaque.html')).text();
        dynamicContent.innerHTML = html;

        // AQUI está o conserto real 👇
        await carregarScriptModulo('/anigeeknews/modulos/conteudo_de_destaque.js');

        return;
    }

    try {
        const html = await (await fetch(`/anigeeknews/modulos/${section}.html`)).text();
        dynamicContent.innerHTML = html;
        setTimeout(restaurarNoticiasSalvas, 50);
    } catch {
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
