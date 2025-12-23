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
   FORMULÁRIO PRINCIPAL
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
        .addEventListener("click", () => enviarComentario());
}

/* ------------------------------------------------------------------
   ENVIO DE COMENTÁRIO
------------------------------------------------------------------ */
async function enviarComentario(texto = null, parentId = null) {
    const textarea = document.getElementById("texto-comentario") || { value: texto };
    const user = auth.currentUser;

    if (!user || !CURRENT_ARTICLE_ID) return;

    const conteudo = (texto !== null ? texto : textarea.value).trim();
    if (!conteudo) return;

    try {
        await addDoc(collection(db, "comentarios"), {
            articleId: CURRENT_ARTICLE_ID,
            texto: conteudo,
            parentId: parentId || null,
            userId: user.uid,
            userName: user.displayName || user.email.split("@")[0],
            createdAt: serverTimestamp()
        });

        if (!texto) textarea.value = "";
    } catch (e) {
        console.error("Erro ao enviar comentário:", e);
    }
}

/* ------------------------------------------------------------------
   OUVE COMENTÁRIOS EM TEMPO REAL
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

        const comentarios = [];
        snapshot.forEach(doc => comentarios.push({ id: doc.id, ...doc.data() }));

        const raiz = comentarios.filter(c => !c.parentId);
        if (!raiz.length) {
            lista.innerHTML = `<p style="opacity:.6;">Nenhum comentário ainda.</p>`;
            return;
        }

        raiz.forEach(c => lista.appendChild(renderComentario(c, comentarios)));
    });
}

/* ------------------------------------------------------------------
   RENDERIZAÇÃO DE COMENTÁRIOS E RESPOSTAS
------------------------------------------------------------------ */
function renderComentario(comentario, todos) {
    const div = document.createElement("div");
    div.style.marginBottom = "18px";
    div.style.marginLeft = comentario.parentId ? "20px" : "0px";
    div.innerHTML = `
        <strong>${comentario.userName}</strong>
        <p style="margin:6px 0;">${comentario.texto}</p>
        <small style="opacity:.5;">
            ${comentario.createdAt ? comentario.createdAt.toDate().toLocaleString("pt-BR") : "agora mesmo"}
        </small>
        <br>
    `;

    const user = auth.currentUser;
    if (user) {
        const btnResponder = document.createElement("button");
        btnResponder.textContent = "Responder";
        btnResponder.style.marginTop = "5px";
        btnResponder.onclick = () => abrirResposta(div, comentario.id);
        div.appendChild(btnResponder);
    }

    const respostas = todos.filter(c => c.parentId === comentario.id);
    respostas.forEach(r => div.appendChild(renderComentario(r, todos)));

    return div;
}

/* ------------------------------------------------------------------
   ABRIR TEXTAREA DE RESPOSTA
------------------------------------------------------------------ */
function abrirResposta(container, parentId) {
    if (container.querySelector("textarea")) return;

    const ta = document.createElement("textarea");
    ta.rows = 2;
    ta.style.width = "100%";
    ta.style.marginTop = "5px";

    const btnEnviar = document.createElement("button");
    btnEnviar.textContent = "Enviar";
    btnEnviar.style.marginTop = "5px";
    btnEnviar.onclick = async () => {
        await enviarComentario(ta.value, parentId);
        ta.remove();
        btnEnviar.remove();
    };

    container.appendChild(ta);
    container.appendChild(btnEnviar);
    ta.focus();
}
