// Arquivo: /anigeeknews/modulos/algoritmos-gostos.js

/**
 * Reorganiza as notícias colocando primeiro
 * aquelas que combinam com os gostos do usuário.
 *
 * - NÃO remove notícias
 * - Apenas altera a ordem
 * - Considera categoria e subcategoria
 */
export function ordenarNoticiasPorGostos(listaDeNoticias) {

    // Segurança: se não for array, devolve como está
    if (!Array.isArray(listaDeNoticias)) {
        return listaDeNoticias;
    }

    // Lê os gostos do usuário
    const gostosUsuario = JSON.parse(
        localStorage.getItem('gostosUsuario')
    ) || [];

    // Se não houver gostos definidos, mantém ordem original
    if (gostosUsuario.length === 0) {
        return listaDeNoticias;
    }

    const noticiasPreferidas = [];
    const outrasNoticias = [];

    listaDeNoticias.forEach(noticia => {

        // Padronização de leitura
        const categoria = noticia.categoria || noticia.category || null;
        const subcategoria = noticia.subcategoria || null;

        // Verifica se combina com algum gosto
        const combinaComGosto =
            (categoria && gostosUsuario.includes(categoria)) ||
            (subcategoria && gostosUsuario.includes(subcategoria));

        if (combinaComGosto) {
            noticiasPreferidas.push(noticia);
        } else {
            outrasNoticias.push(noticia);
        }
    });

    // Retorna priorizadas primeiro
    return [...noticiasPreferidas, ...outrasNoticias];
}
