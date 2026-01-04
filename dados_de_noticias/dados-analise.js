// dados_de_noticias/dados-analise.js

export const dadosAnalise = [
    {
        categoria: "Animes",
        titulo: "A Evolução do Traço em Solo Leveling: O que mudou?",
        descricao: "Analisamos detalhadamente a transição do traço do manhwa para a animação da A-1 Pictures. Quais foram os sacrifícios necessários para manter a fluidez das lutas épicas de Sung Jin-woo?",
        img: "https://i.postimg.cc/QdzLYWKg/Jujutsu-Kaisen01.jpg",
        meta: "há 2 dias • Leitura: 8min",
        likes: "450"
    },
    {
        categoria: "Cinema",
        titulo: "Gladiador II: Ridley Scott ainda consegue chocar?",
        descricao: "Uma análise profunda sobre o uso de efeitos práticos versus CGI na sequência do épico de 2000. O filme consegue manter o peso emocional do original ou se perde na grandiosidade visual?",
        img: "https://via.placeholder.com/240x160?text=Gladiador+II",
        meta: "há 3 dias • Leitura: 12min",
        likes: "210"
    },
    {
        categoria: "Games",
        titulo: "Ghost of Yotei: O que o novo cenário significa para a franquia?",
        descricao: "Exploramos as referências históricas do Monte Yotei e como a mudança de protagonista para Atsu pode renovar a jogabilidade de exploração que consagrou Tsushima.",
        img: "https://i.postimg.cc/sfHMcTDy/58awkrh8lp404dsegeqpbffcz.jpg",
        meta: "há 5 dias • Leitura: 10min",
        likes: "890"
    },
    {
        categoria: "Mangás",
        titulo: "O Horror Corporal de Junji Ito e sua influência moderna",
        descricao: "Como as obras clássicas de Ito moldaram o design de monstros nos animes de terror atuais. Um estudo sobre a psicologia do desconforto visual nas páginas em preto e branco.",
        img: "https://via.placeholder.com/240x160?text=Junji+Ito+Art",
        meta: "há 1 semana • Leitura: 15min",
        likes: "1.1k"
    }
];

// --- LÓGICA DA BARRA DE PESQUISA INTEGRADA ---

export function initBuscaAnalises() {
    const header = document.querySelector('.section-header');
    const feed = document.querySelector('.feed');

    if (!header || !feed) return;

    // Injeta a barra de busca no topo da aba de análises
    if (!document.getElementById('inputBusca')) {
        const buscaHTML = `
            <div style="margin: 20px 0; padding: 0 10px;">
                <input type="text" id="inputBusca" placeholder="Pesquisar análises..." 
                style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size:16px; outline:none; font-family: sans-serif;">
            </div>
        `;
        header.insertAdjacentHTML('afterend', buscaHTML);
    }

    const input = document.getElementById('inputBusca');

    input.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        
        const filtrados = dadosAnalise.filter(n => 
            n.titulo.toLowerCase().includes(termo) || 
            n.descricao.toLowerCase().includes(termo) ||
            n.categoria.toLowerCase().includes(termo)
        );

        exibirResultados(filtrados, feed);
    });
}

function exibirResultados(lista, container) {
    container.innerHTML = ""; // Limpa o feed atual

    if (lista.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:20px; color:gray;">Nenhuma análise encontrada para sua busca.</p>`;
        return;
    }

    lista.forEach(noticia => {
        const card = `
            <article class="post-card">
                <div class="post-img-wrapper"><img src="${noticia.img}"></div>
                <div class="post-content">
                    <span class="category">${noticia.categoria}</span>
                    <h2>${noticia.titulo}</h2>
                    <p>${noticia.descricao}</p>
                    <div class="action-row">
                        <span class="meta-minimal">${noticia.meta}</span>
                        <button class="like-btn"><span>${noticia.likes}</span> leitores</button>
                    </div>
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', card);
    });
}

