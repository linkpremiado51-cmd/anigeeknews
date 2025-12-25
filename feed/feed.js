/* =====================================================
   FEED SOCIAL — LÓGICA PRINCIPAL
   ===================================================== */

/* ---------- CONFIG ---------- */
const CAMINHO_FEED = './feed.json';
const STORAGE_LIKES = 'feed_likes';

/* ---------- ESTADO ---------- */
let noticias = [];
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

  const contador = btn.querySelector('span');
  contador.textContent = likesSalvos[id];
}

function compartilharNoticia(url, titulo) {
  if (navigator.share) {
    navigator.share({
      title: titulo,
      url: url
    });
  } else {
    navigator.clipboard.writeText(url);
    alert('Link copiado para a área de transferência');
  }
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
          <img
            src="${noticia.imagem}"
            alt="${noticia.titulo}"
            loading="lazy"
          />
        </div>

        <div class="feed-content">
          <span class="feed-category">${noticia.categoria}</span>

          <h2 class="feed-title-article">
            ${noticia.titulo}
          </h2>

          <p class="feed-text">
            ${noticia.texto}
          </p>

          <div class="feed-actions">
            <button class="feed-btn like-btn" data-id="${noticia.id}">
              ❤️ <span>${likes}</span>
            </button>

            <button class="feed-btn share-btn">
              🔁 Compartilhar
            </button>

            <a
              href="${noticia.url}"
              class="feed-read-more"
            >
              Ler mais
            </a>
          </div>
        </div>

      </article>
    `);

    // Curtir
    card.querySelector('.like-btn').addEventListener('click', e => {
      const id = e.currentTarget.dataset.id;
      curtirNoticia(id, e.currentTarget);
    });

    // Compartilhar
    card.querySelector('.share-btn').addEventListener('click', () => {
      compartilharNoticia(noticia.url, noticia.titulo);
    });

    container.appendChild(card);
  });
}

/* ---------- CARREGAMENTO ---------- */
async function carregarFeed() {
  try {
    const res = await fetch(CAMINHO_FEED);
    if (!res.ok) throw new Error('Erro ao carregar feed.json');
    noticias = await res.json();
    renderizarFeed();
  } catch (err) {
    console.error(err);
    const container = document.getElementById('feed-container');
    if (container) {
      container.innerHTML = `
        <p style="text-align:center;color:#666">
          Erro ao carregar o feed.
        </p>
      `;
    }
  }
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', carregarFeed);
