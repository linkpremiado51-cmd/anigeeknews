// Tema escuro
const btnDark = document.getElementById('btn-dark');

btnDark.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(
        'ag-theme',
        document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    );
});

// Estado inicial do tema
if (localStorage.getItem('ag-theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Feed
const feed = document.getElementById('feed-target');

const posts = [
    {
        user: "AniGeek News",
        time: "15 min",
        text: "Confirmado! A segunda parte da temporada final de Attack on Titan chegará mais cedo. ⚔️🔥",
        img: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=800"
    },
    {
        user: "Reviewer Master",
        time: "2 horas",
        text: "Capítulo 1100 de One Piece foi simplesmente absurdo. Oda segue intocável. 🏴‍☠️",
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
                    <strong>${p.user}</strong><br>
                    <small>${p.time}</small>
                </div>
            </div>
            <p class="post-text">${p.text}</p>
            <img src="${p.img}" class="post-media">
        `;

        feed.appendChild(card);
    });
}

renderPosts();

// Infinite scroll simples
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        renderPosts();
    }
});
