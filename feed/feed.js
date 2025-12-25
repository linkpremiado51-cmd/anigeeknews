// feed/feed.js
// =====================================================
// FEED SOCIAL — INICIALIZAÇÃO DINÂMICA
// =====================================================

const STORAGE_LIKES = 'feed_likes';

/* ---------- DADOS DO FEED (EMBUTIDOS) ---------- */
const noticias = [
  {
    id: 'feed-001',
    categoria: 'ANIME',
    titulo: 'One Piece entra em nova fase e fãs apontam o arco mais intenso da história',
    imagem: 'https://i.ibb.co/JFnKKy46/96501221-6689-437b-873b-3d81141ac16b.jpg',
    texto: 'O arco atual de One Piece vem sendo apontado por fãs como um dos momentos mais intensos de toda a obra. A narrativa ganhou um ritmo mais acelerado, com revelações importantes sobre o passado do mundo, conexões diretas com eventos antigos e decisões que podem mudar o rumo da história para sempre.\n\nAlém disso, personagens que estavam afastados do foco principal voltaram a ter grande destaque, trazendo um peso emocional significativo para os capítulos recentes. O desenvolvimento visual do anime também chama atenção, com uma direção mais cinematográfica e cenas de ação detalhadas.\n\nPara muitos leitores e espectadores, esse arco representa o início do fim da jornada de Luffy, elevando as expectativas para os próximos episódios e capítulos.',
    url: '../noticias/animes/one_piece/one-piece-climax-egghead-animacao-moderna.html'
  },
  {
    id: 'feed-002',
    categoria: 'TECNOLOGIA',
    titulo: 'Inteligência artificial passa a influenciar decisões criativas na indústria do entretenimento',
    imagem: 'https://i.ibb.co/JFnKKy46/96501221-6689-437b-873b-3d81141ac16b.jpg',
    texto: 'A inteligência artificial deixou de ser apenas uma ferramenta de apoio técnico e passou a influenciar diretamente decisões criativas na indústria do entretenimento...',
    url: '../noticias/tecnologia/ia-entretenimento.html'
  }
];

/* ---------- ESTADO ---------- */
let likesSalvos = JSON.parse(localStorage.getItem(STORAGE_LIKES)) || {};

/* ---------- UTIL ---------- */
function salvarLikes() {
  localStorage.setItem(STORAGE_LIKES, JSON.stringify(likesSalvos));
}

function criarElemento(html) {
  const div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstChild;
}

/* ---------- AÇÕES ---------- */
function curtirNoticia(id, btn) {
  likesSalvos[id] = (likesSalvos[id] || 0) + 1;
  salvarLikes();
  btn.querySelector('span').textContent = likesSalvos[id];
}

/* ---------- RENDER ---------- */
function renderizarFeed() {
  const container = document.getElementById('feed-container');
  if (!container) return;

  container.innerHTML = '';

  noticias.forEach(noticia => {
    const likes = likesSalvos[noticia.id] || 0;

    const card = criarElemento(`
      <article class="feed-card">
        <div class="feed-image">
          <img src="${noticia.imagem}" alt="${noticia.titulo}">
        </div>
        <div class="feed-content">
          <span class="feed-category">${noticia.categoria}</span>
          <h2 class="feed-title-article">${noticia.titulo}</h2>
          <p class="feed-text">${noticia.texto}</p>
          <div class="feed-actions">
            <button class="feed-btn like-btn" data-id="${noticia.id}">
              ❤️ <span>${likes}</span>
            </button>
            <a href="${noticia.url}" class="feed-read-more">
              Ler matéria completa →
            </a>
          </div>
        </div>
      </article>
    `);

    card.querySelector('.like-btn').addEventListener('click', e => {
      curtirNoticia(noticia.id, e.currentTarget);
    });

    container.appendChild(card);
  });
}

/* ---------- FUNÇÃO PÚBLICA ---------- */
export function initFeed() {
  renderizarFeed();
}
