// /anigeeknews/modulo-relevancia.js

/**
 * Ordena notícias por relevância com base nos gostos do usuário
 *
 * Pontuação:
 * +3 → categoria
 * +2 → subcategoria
 * +1 → tags relacionadas
 *
 * Funciona com categorias novas sem quebrar
 */
export function ordenarPorRelevancia(noticias) {

    if (!Array.isArray(noticias)) return noticias;

    const gostosUsuario = JSON.parse(
        localStorage.getItem("gostosUsuario")
    ) || [];

    if (gostosUsuario.length === 0) return noticias;

    const gostosNormalizados = gostosUsuario.map(g =>
        String(g).toLowerCase()
    );

    return noticias
        .map(noticia => {

            let score = 0;

            const categoria = noticia.categoria
                ? noticia.categoria.toLowerCase()
                : null;

            const subcategoria = noticia.subcategoria
                ? noticia.subcategoria.toLowerCase()
                : null;

            // Categoria principal
            if (categoria && gostosNormalizados.includes(categoria)) {
                score += 3;
            }

            // Subcategoria
            if (subcategoria && gostosNormalizados.includes(subcategoria)) {
                score += 2;
            }

            // Tags
            if (Array.isArray(noticia.tags)) {
                noticia.tags.forEach(tag => {
                    const tagLower = tag.toLowerCase();
                    if (gostosNormalizados.some(g => tagLower.includes(g))) {
                        score += 1;
                    }
                });
            }

            return { ...noticia, score };
        })
        .sort((a, b) => b.score - a.score);
}
