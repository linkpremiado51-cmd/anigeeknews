// /anigeeknews/modulo-relevancia.js

export function ordenarPorRelevancia(noticias) {
    // Gostos do usuário
    const gostos = JSON.parse(localStorage.getItem("gostosUsuario")) || [];

    // Se o usuário não escolheu nada, retorna como está
    if (gostos.length === 0) return noticias;

    return noticias
        .map(noticia => {
            let score = 0;

            // Categoria principal
            if (gostos.includes(noticia.categoria)) {
                score += 3;
            }

            // Tags
            if (Array.isArray(noticia.tags)) {
                noticia.tags.forEach(tag => {
                    if (gostos.some(g => tag.toLowerCase().includes(g.toLowerCase()))) {
                        score += 1;
                    }
                });
            }

            return { ...noticia, score };
        })
        .sort((a, b) => b.score - a.score);
}
