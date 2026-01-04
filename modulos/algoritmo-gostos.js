/**
 * Reorganiza as notícias colocando primeiro
 * aquelas que combinam com os gostos do usuário.
 *
 * ✔ NÃO remove notícias
 * ✔ Apenas altera a ordem
 * ✔ Considera categoria e subcategoria
 * ✔ Funciona mesmo se surgir categoria nova
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

    // Normaliza gostos (evita erro de maiúsculas/minúsculas)
    const gostosNormalizados = gostosUsuario.map(g =>
        String(g).toLowerCase()
    );

    // Se não houver gostos definidos, mantém ordem original
    if (gostosNormalizados.length === 0) {
        return listaDeNoticias;
    }

    const noticiasPreferidas = [];
    const outrasNoticias = [];

    listaDeNoticias.forEach(noticia => {

        // Leitura segura dos dados da notícia
        const categoria = noticia.categoria
            ? String(noticia.categoria).toLowerCase()
            : null;

        const subcategoria = noticia.subcategoria
            ? String(noticia.subcategoria).toLowerCase()
            : null;

        /**
         * A notícia é considerada preferida se:
         * - A categoria estiver nos gostos
         * OU
         * - A subcategoria estiver nos gostos
         */
        const combinaComGosto =
            (categoria && gostosNormalizados.includes(categoria)) ||
            (subcategoria && gostosNormalizados.includes(subcategoria));

        if (combinaComGosto) {
            noticiasPreferidas.push(noticia);
        } else {
            outrasNoticias.push(noticia);
        }
    });

    // Retorna: preferidas primeiro, depois o restante
    return [...noticiasPreferidas, ...outrasNoticias];
}
