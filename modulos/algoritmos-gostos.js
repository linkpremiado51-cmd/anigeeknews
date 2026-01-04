// Arquivo: /anigeeknews/modulos/algoritmos-gostos.js

/**
 * Essa função reorganiza as notícias
 * colocando primeiro as que combinam
 * com os gostos do usuário.
 * 
 * Ela NÃO remove notícias.
 * Ela apenas muda a ordem.
 */
export function ordenarNoticiasPorGostos(listaDeNoticias) {
    
    // Segurança: se não for uma lista, devolve como está
    if (!Array.isArray(listaDeNoticias)) {
        return listaDeNoticias;
    }

    // Lê os gostos do usuário salvos no navegador
    const gostosUsuario = JSON.parse(localStorage.getItem('gostosUsuario')) || [];

    // Se o usuário não escolheu nada, não muda a ordem
    if (gostosUsuario.length === 0) {
        return listaDeNoticias;
    }

    // Separa notícias que combinam com os gostos
    const noticiasPreferidas = [];
    const outrasNoticias = [];

    listaDeNoticias.forEach(noticia => {
        const categoriaNoticia = noticia.categoria || noticia.category;

        if (gostosUsuario.includes(categoriaNoticia)) {
            noticiasPreferidas.push(noticia);
        } else {
            outrasNoticias.push(noticia);
        }
    });

    // Junta tudo: primeiro as preferidas, depois o resto
    return [...noticiasPreferidas, ...outrasNoticias];
}
