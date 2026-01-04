// /modulos/analises-logic.js

export function initAnalises() {
    // 1. Muda a cor do título para termos certeza que o JS rodou
    const titulo = document.querySelector('.section-title');
    if (titulo) {
        titulo.style.color = 'red';
        titulo.innerText = titulo.innerText + " (Módulo Ativo ✅)";
    }

    // 2. Um alerta simples que aparece na tela do celular
    alert("O módulo de Análises foi carregado com sucesso!");
}

