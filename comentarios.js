// /anigeeknews/usuario/comentarios.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ------------------------------------------------------------------
// CONFIG FIREBASE (MESMO DO SITE)
// ------------------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
    authDomain: "anigeeknews.firebaseapp.com",
    projectId: "anigeeknews",
    storageBucket: "anigeeknews.firebasestorage.app",
    messagingSenderId: "769322939926",
    appId: "1:769322939926:web:6eb91a96a3f74670882737"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ------------------------------------------------------------------
// INICIALIZAÇÃO SEGURA
// ------------------------------------------------------------------
const articleElement = document.querySelector('[data-article-id]');
const comentariosContainer = document.getElementById('comentarios');

if (!articleElement || !comentariosContainer) {
    console.warn('Comentários não inicializados: artigo ou container ausente.');
} else {
    inicializarComentarios();
}

// ------------------------------------------------------------------
// FUNÇÃO PRINCIPAL
// ------------------------------------------------------------------
function inicializarComentarios() {

    const articleId = articleElement.getAttribute('data-article-id');

    // ------------------------------------------------------------------
    // RENDERIZA ESTRUTURA BASE
    // ------------------------------------------------------------------
    comentariosContainer.innerHTML = `
        <h3 style="font-family:var(--font-sans); font-size:18px; font-weight:800;">
            Comentários
        </h3>

        <div id="comentarios-form"></div>
        <div id="lista-comentarios" style="margin-top:25px;"></div>
    `;

    let listenerAtivo = false;

    // ------------------------------------------------------------------
    // OBSERVA LOGIN DO USUÁRIO
    // ------------------------------------------------------------------
    onAuthStateChanged(auth, (user) => {
        renderFormulario(user);

        if (!listenerAtivo) {
            carregarComentarios();
            listenerAtivo = true;
        }
    });

    // ------------------------------------------------------------------
    // FORMULÁRIO DE COMENTÁRIO
    // ------------------------------------------------------------------
    function renderFormulario(user) {
        const formArea = document.getElementById('comentarios-form');

        if (!user) {
            formArea.innerHTML = `
                <p style="opacity:.7;">
                    <a href="/anigeeknews/usuario/cadastro.html">Entre</a> para comentar.
                </p>
            `;
            return;
        }

        formArea.innerHTML = `
            <textarea 
                id="texto-comentario"
                placeholder="Escreva seu comentário..."
                style="width:100%; padding:12px; border-radius:6px; resize:none;"
            ></textarea>

            <button 
                id="enviar-comentario"
                style="margin-top:10px;"
                class="btn-primary"
            >
                Enviar comentário
            </button>
        `;

        document
            .getElementById('enviar-comentario')
            .addEventListener('click', () => enviarComentario(user));
    }

    // ------------------------------------------------------------------
    // ENVIA COMENTÁRIO
    // ------------------------------------------------------------------
    async function enviarComentario(user) {
        const textarea = document.getElementById('texto-comentario');
        const texto = textarea.value.trim();

        if (!texto) return;

        try {
            await addDoc(collection(db, 'comentarios'), {
                articleId: articleId,
                texto: texto,
                userId: user.uid,
                userName: user.displayName || user.email.split('@')[0],
                createdAt: serverTimestamp()
            });

            textarea.value = '';
        } catch (err) {
            console.error('Erro ao enviar comentário:', err);
        }
    }

    // ------------------------------------------------------------------
    // CARREGA E ESCUTA COMENTÁRIOS DO ARTIGO
    // ------------------------------------------------------------------
    function carregarComentarios() {
        const lista = document.getElementById('lista-comentarios');

        const q = query(
            collection(db, 'comentarios'),
            where('articleId', '==', articleId),
            orderBy('createdAt', 'desc')
        );

        onSnapshot(q, (snapshot) => {
            lista.innerHTML = '';

            if (snapshot.empty) {
                lista.innerHTML = `<p style="opacity:.6;">Nenhum comentário ainda.</p>`;
                return;
            }

            snapshot.forEach((doc) => {
                const c = doc.data();

                const item = document.createElement('div');
                item.style.marginBottom = '18px';

                item.innerHTML = `
                    <strong>${c.userName}</strong>
                    <p style="margin:6px 0;">${c.texto}</p>
                    <small style="opacity:.5;">
                        ${c.createdAt?.toDate().toLocaleString('pt-BR')}
                    </small>
                `;

                lista.appendChild(item);
            });
        });
    }
}
