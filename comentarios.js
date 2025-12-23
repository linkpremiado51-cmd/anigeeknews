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
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/* ------------------------------------------------------------------
   CONFIG FIREBASE (ÚNICO)
------------------------------------------------------------------ */
const firebaseConfig = {
    apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
    authDomain: "anigeeknews.firebaseapp.com",
    projectId: "anigeeknews",
    storageBucket: "anigeeknews.firebasestorage.app",
    messagingSenderId: "769322939926",
    appId: "1:769322939926:web:6eb91a96a3f74670882737"
};

// EVITA INICIALIZAR DUAS VEZES
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ------------------------------------------------------------------
   DOM READY
------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {

    const articleElement = document.querySelector("[data-article-id]");
    const comentariosContainer = document.getElementById("comentarios");

    if (!articleElement || !comentariosContainer) {
        console.warn("Comentários não renderizados: container ou article-id ausente.");
        return;
    }

    iniciarSistemaComentarios(articleElement, comentariosContainer);
});

/* ------------------------------------------------------------------
   SISTEMA PRINCIPAL
------------------------------------------------------------------ */
function iniciarSistemaComentarios(articleElement, comentariosContainer) {

    const articleId = articleElement.dataset.articleId;

    // RENDER BASE (SEMPRE APARECE)
    comentariosContainer.innerHTML = `
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
    const formArea = document.getElementById("comentarios-form");

    if (!formArea) return;

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
            class="btn-primary"
            style="margin-top:10px;"
        >
            Enviar comentário
        </button>
    `;

    document
        .getElementById("enviar-comentario")
        .addEventListener("click", () => enviarComentario(user));
}

/* ------------------------------------------------------------------
   ENVIO
------------------------------------------------------------------ */
async function enviarComentario(user) {
    const textarea = document.getElementById("texto-comentario");
    if (!textarea) return;

    const texto = textarea.value.trim();
    if (!texto) return;

    await addDoc(collection(db, "comentarios"), {
        articleId: document.querySelector("[data-article-id]").dataset.articleId,
        texto,
        userId: user.uid,
        userName: user.displayName || user.email.split("@")[0],
        createdAt: serverTimestamp()
    });

    textarea.value = "";
}

/* ------------------------------------------------------------------
   LISTAGEM EM TEMPO REAL
------------------------------------------------------------------ */
function ouvirComentarios(articleId) {
    const lista = document.getElementById("lista-comentarios");
    if (!lista) return;

    const q = query(
        collection(db, "comentarios"),
        where("articleId", "==", articleId),
        orderBy("createdAt", "desc")
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
                    ${c.createdAt?.toDate().toLocaleString("pt-BR")}
                </small>
            `;

            lista.appendChild(item);
        });
    });
}
