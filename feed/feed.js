/* =====================================================
   FEED — LÓGICA PRINCIPAL
   ===================================================== */

const STORAGE_LIKES = 'feed_likes';

/* ---------- DADOS (JSON EMBUTIDO) ---------- */
const noticias = [
  {
    id: "feed-001",
    categoria: "ANIME",
    titulo: "One Piece entra em nova fase e fãs apontam o arco mais intenso da história",
    imagem: "https://i.ibb.co/JFnKKy46/96501221-6689-437b-873b-3d81141ac16b.jpg",
    texto: "O arco atual de One Piece vem sendo apontado por fãs como um dos momentos mais intensos da obra.",
    url: "../noticias/animes/one_piece/one-piece-climax.html"
  },
  {
    id: "feed-002",
    categoria: "TECNOLOGIA",
    titulo: "IA passa a influenciar decisões criativas no entretenimento",
    imagem: "https://i.ibb.co/JFnKKy46/96501221-6689-437b-873b-3d81141ac16b.jpg",
    texto: "A inteligência artificial deixou de ser apenas suporte técnico.",
    url: "../noticias/tecnologia/ia-entretenimento.html"
  }
];

/* ---------- ESTADO ---------- */
const likesSalvos = JSON.parse(localStorage.getItem(STORAGE_LIKES)) || {};

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('feed-container');
  if (!container) return;

  /* REMOVE O CARD ESTÁTICO DO HTML */
  container.innerHTML = '';

  noticias.forEach(noticia => {
    const likes = likesSalvos[noticia.id] || 0;

    const card = document.createElement('article');
    card.className = 'feed-card';

    card.innerHTML = `
      <div class="feed-image">
        <img src="${noticia.imagem}" alt="${noticia.titulo}">
      </div>

      <div class="feed-content">
        <span class="feed-category">${noticia.categoria}</span>

        <h2 class="feed-title-article">${noticia.titulo}</h2>

        <p class="feed-text">${noticia.texto}</p>

        <div class="feed-actions">
          <button class="feed-btn like-btn">
            ❤️ <span>${likes}</span>
          </button>

          <a href="${noticia.url}" class="feed-read-more">
            Ler matéria completa →
          </a>
        </div>
      </div>
    `;

    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      likesSalvos[noticia.id] = (likesSalvos[noticia.id] || 0) + 1;
      likeBtn.querySelector('span').textContent = likesSalvos[noticia.id];
      localStorage.setItem(STORAGE_LIKES, JSON.stringify(likesSalvos));
    });

    container.appendChild(card);
  });
});
