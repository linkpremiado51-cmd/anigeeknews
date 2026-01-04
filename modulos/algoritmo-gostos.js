// algoritmo-gostos.js

export function aplicarPreferencias(listaOriginal) {
    if (!Array.isArray(listaOriginal)) return listaOriginal;

    const gostos = JSON.parse(localStorage.getItem('gostosUsuario')) || [];

    // Se não tiver gostos, retorna tudo normal
    if (gostos.length === 0) return listaOriginal;

    const comPreferencia = [];
    const semPreferencia = [];

    listaOriginal.forEach(noticia => {
        const categoria = noticia.categoria || noticia.category;
        if (gostos.includes(categoria)) {
            comPreferencia.push(noticia);
        } else {
            semPreferencia.push(noticia);
        }
    });

    // Prioriza, não remove nada
    return [...comPreferencia, ...semPreferencia];
}
