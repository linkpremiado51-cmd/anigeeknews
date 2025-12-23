// /anigeeknews/usuario/comentarios.js

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
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
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/* ------------------------------------------------------------------
   CONFIG FIREBASE (ÚNICA)
------------------------------------------------------------------ */
const firebaseConfig = {
    apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
    authDomain: "anigeeknews.firebaseapp.com",
    projectId: "anigeeknews",
    storageBucket: "anigeeknews.firebasestorage.app",
    messagingSenderId: "769322939926",
    appId: "1:769322939926:web:6eb91a96a3f74670882737"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ------------------------------------------------------------------
   ESTADO GLOBAL (IMPORTANTE)
------------------------------------------------------------------ */
let CURRENT_ARTICLE_ID = null;

/* ------------------------------------------------------------------
   DOM READY
------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {

    const articleElement = document.querySelector("[data-article-id]");
    const comentariosContainer = document.getElementById("comentarios");

    if (!articleElement || !comentariosContainer) {
        console.warn("Comentários não iniciados: artigo ou container ausente.");
        return;
    }

    CURRENT_ARTICLE_ID = articleElement.dataset.articleId;

    iniciarComentarios(CURRENT_ARTICLE_ID, comentariosContainer);
});

/* ------------------------------------------------------------------
   SISTEMA PRINCIPAL
------------------------------------------------------------------ */
function iniciarComentarios(articleId, container) {

    container.innerHTML = `
        <h3 style="font-family:var(--font-sans); font-size:18px; font-weight:800;">
            Comentários
        </h3>

        <div id="comentarios-form" style="margin-top:20px;"></div>
        <div id="lista-comentarios" style="margin-top:25px;"></div>
    `;

    let listenerAtivo = false;

    onAuthStateChanged(auth, (user) => {
        renderFormulario(user);

        if (!listenerAtivo) {
            ouvirComentarios(articleId);
            listenerAtivo = true;
        }
    });
}

/* ------------------------------------------------------------------
   FORMULÁRIO
------------------------------------------------------------------ */
function renderFormulario(user) {
    const form = document.getElementById("comentarios-form");
    if (!form) return;

    if (!user) {
        form.innerHTML = `
            <p style="opacity:.7;">
                <a href="/anigeeknews/usuario/cadastro.html">Entre</a> para comentar.
            </p>
        `;
        return;
    }

    form.innerHTML = `
        <textarea
            id="texto-comentario"
            placeholder="Escreva seu comentário..."
            style="width:100%; padding:12px; border-radius:6px; resize:none;"
        ></textarea>

        <button
            id="btn-enviar-comentario"
            class="btn-primary"
            style="margin-top:10px;"
        >
            Enviar comentário
        </button>
    `;

    document
        .getElementById("btn-enviar-comentario")
        .addEventListener("click", enviarComentario);
}

/* ------------------------------------------------------------------
   ENVIO
------------------------------------------------------------------ */
async function enviarComentario() {
    const textarea = document.getElementById("texto-comentario");
    const user = auth.currentUser;

    if (!textarea || !user || !CURRENT_ARTICLE_ID) return;

    const texto = textarea.value.trim();
    if (!texto) return;

    try {
        await addDoc(collection(db, "comentarios"), {
            articleId: CURRENT_ARTICLE_ID,
            texto,
            userId: user.uid,
            userName: user.displayName || user.email.split("@")[0],
            createdAt: serverTimestamp()
        });

        textarea.value = "";
    } catch (e) {
        console.error("Erro ao enviar comentário:", e);
    }
}

/* ------------------------------------------------------------------
   LISTAGEM EM TEMPO REAL
------------------------------------------------------------------ */
function ouvirComentarios(articleId) {
    const lista = document.getElementById("lista-comentarios");
    if (!lista) return;

    const q = query(
        collection(db, "comentarios"),
        where("articleId", "==", articleId)
    );

    onSnapshot(q, (snapshot) => {
        lista.innerHTML = "";

        if (snapshot.empty) {
            lista.innerHTML = `<p style="opacity:.6;">Nenhum comentário ainda.</p>`;
            return;
        }

        snapshot.forEach((doc) => {
            const c = doc.data();

            const item = document.createElement("div");
            item.style.marginBottom = "18px";

            item.innerHTML = `
                <strong>${c.userName}</strong>
                <p style="margin:6px 0;">${c.texto}</p>
                <small style="opacity:.5;">
                    ${c.createdAt ? c.createdAt.toDate().toLocaleString("pt-BR") : "agora mesmo"}
                </small>
            `;

            lista.appendChild(item);
        });
    });
}
