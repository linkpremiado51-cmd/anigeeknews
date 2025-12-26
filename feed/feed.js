// ==============================
// TEMA (DARK / LIGHT)
// ==============================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    localStorage.setItem(
        'ag-theme',
        document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    );
}

// ==============================
// FEED DINÂMICO
// ==============================
const feed = document.getElementById('feed-target');

const posts = [
    {
        user: "AniGeek News",
        time: "15 min",
        text: "Confirmado! A segunda parte da temporada final de Attack on Titan chegará mais cedo do que esperávamos. ⚔️🔥 #AOT #AnimeNews",
        img: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=800"
    },
    {
        user: "Reviewer Master",
        time: "2 horas",
        text: "Acabei de ler o capítulo 1100 de One Piece e... MEU DEUS! Oda é um gênio. Quem mais está em choque? 🏴‍☠️",
        img: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800"
    }
];

function renderPosts() {
    posts.forEach(p => {
        const card = document.createElement('article');
        card.className = 'post-card';

        card.innerHTML = `
            <div class="post-header">
                <img src="https://i.pravatar.cc/100?u=${p.user}" class="avatar-small">
                <div>
                    <div class="u-name">${p.user}</div>
                    <div class="u-time">
                        ${p.time} · <i class="fas fa-globe-americas"></i>
                    </div>
                </div>
            </div>

            <div class="post-text">${p.text}</div>

            <img src="${p.img}" class="post-media">

            <div class="post-actions">
                <div class="action-item" onclick="this.classList.toggle('active')">
                    <i class="far fa-thumbs-up"></i> Curtir
                </div>
                <div class="action-item">
                    <i class="far fa-comment"></i> Comentar
                </div>
                <div class="action-item">
                    <i class="fas fa-share"></i> Enviar
                </div>
            </div>
        `;

        feed.appendChild(card);
    });
}

// ==============================
// INICIALIZAÇÃO
// ==============================
renderPosts();

// ==============================
// INFINITE SCROLL SIMPLES
// ==============================
window.addEventListener('scroll', () => {
    if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
    ) {
        renderPosts();
    }
});

// ==============================
// TEMA SALVO
// ==============================
if (localStorage.getItem('ag-theme') === 'dark') {
    document.body.classList.add('dark-mode');
}
