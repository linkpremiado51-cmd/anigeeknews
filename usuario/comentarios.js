// /anigeeknews/usuario/comentarios.js

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/* ------------------------------------------------------------------
   CONFIG FIREBASE
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
   ESTADO GLOBAL
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
        <h3 style="font-family:var(--font-sans); font-size:20px; font-weight:800; margin-bottom:10px;">
            Comentários
        </h3>
        <div id="comentarios-form" style="margin-bottom:25px;"></div>
        <div id="lista-comentarios"></div>
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
        form.innerHTML = `<p style="opacity:.7;">
            <a href="/anigeeknews/usuario/cadastro.html">Entre</a> para comentar.
        </p>`;
        return;
    }

    form.innerHTML = `
        <textarea id="texto-comentario" placeholder="Escreva seu comentário..." style="
            width:100%;
            padding:12px;
            border-radius:8px;
            border:1px solid #ccc;
            resize:none;
            font-family:var(--font-sans);
            font-size:14px;
            transition: border .2s;
        "></textarea>
        <button id="btn-enviar-comentario" class="btn-primary" style="
            margin-top:10px;
            padding:8px 16px;
            border-radius:6px;
            cursor:pointer;
            font-weight:600;
        ">Enviar comentário</button>
    `;

    const textarea = document.getElementById("texto-comentario");
    textarea.addEventListener("focus", () => textarea.style.borderColor = "#0070f3");
    textarea.addEventListener("blur", () => textarea.style.borderColor = "#ccc");

    document.getElementById("btn-enviar-comentario")
        .addEventListener("click", () => enviarComentario());
}

/* ------------------------------------------------------------------
   ENVIO DE COMENTÁRIO / RESPOSTA
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
   LISTAGEM EM TEMPO REAL
------------------------------------------------------------------ */
function ouvirComentarios(articleId) {
    const lista = document.getElementById("lista-comentarios");
    if (!lista) return;

    const q = query(collection(db, "comentarios"), where("articleId", "==", articleId));

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
   RENDERIZAÇÃO DE COMENTÁRIOS E RESPOSTAS (ESTILO PROFISSIONAL)
------------------------------------------------------------------ */
function renderComentario(comentario, todos) {
    const div = document.createElement("div");
    div.style.marginBottom = "18px";
    div.style.marginLeft = comentario.parentId ? "30px" : "0px";
    div.style.padding = "12px";
    div.style.borderRadius = "8px";
    div.style.border = "1px solid #e0e0e0";
    div.style.boxShadow = comentario.parentId ? "none" : "0 2px 6px rgba(0,0,0,0.05)";
    div.style.backgroundColor = comentario.parentId ? "#f9f9f9" : "#fff";
    div.style.transition = "background .2s";

    div.innerHTML = `
        <strong style="font-family:var(--font-sans); font-size:14px; color:#111;">${comentario.userName}</strong>
        <p style="margin:6px 0; font-family:var(--font-sans); font-size:14px; color:#333;">${comentario.texto}</p>
        <small style="opacity:.5; font-family:var(--font-sans); font-size:12px;">
            ${comentario.createdAt ? comentario.createdAt.toDate().toLocaleString("pt-BR") : "agora mesmo"}
        </small>
        <br>
    `;

    const user = auth.currentUser;
    if (user) {
        const btnResponder = document.createElement("button");
        btnResponder.textContent = "Responder";
        btnResponder.style.marginTop = "8px";
        btnResponder.style.padding = "4px 10px";
        btnResponder.style.fontSize = "12px";
        btnResponder.style.cursor = "pointer";
        btnResponder.style.borderRadius = "4px";
        btnResponder.style.border = "1px solid #0070f3";
        btnResponder.style.background = "transparent";
        btnResponder.style.color = "#0070f3";
        btnResponder.onmouseover = () => btnResponder.style.background = "#0070f350";
        btnResponder.onmouseout = () => btnResponder.style.background = "transparent";
        btnResponder.onclick = () => abrirResposta(div, comentario.id);
        div.appendChild(btnResponder);
    }

    const respostas = todos.filter(c => c.parentId === comentario.id);
    respostas.forEach(r => div.appendChild(renderComentario(r, todos)));

    return div;
}

/* ------------------------------------------------------------------
   ABRIR TEXTAREA DE RESPOSTA (ESTILO PROFISSIONAL)
------------------------------------------------------------------ */
function abrirResposta(container, parentId) {
    if (container.querySelector("textarea")) return;

    const ta = document.createElement("textarea");
    ta.rows = 2;
    ta.style.width = "100%";
    ta.style.marginTop = "5px";
    ta.style.padding = "8px";
    ta.style.borderRadius = "6px";
    ta.style.border = "1px solid #ccc";
    ta.style.fontFamily = "var(--font-sans)";
    ta.style.fontSize = "14px";
    ta.style.transition = "border .2s";

    const btnEnviar = document.createElement("button");
    btnEnviar.textContent = "Enviar";
    btnEnviar.style.marginTop = "5px";
    btnEnviar.style.padding = "6px 14px";
    btnEnviar.style.borderRadius = "6px";
    btnEnviar.style.cursor = "pointer";
    btnEnviar.style.fontWeight = "600";
    btnEnviar.style.border = "1px solid #0070f3";
    btnEnviar.style.background = "#0070f3";
    btnEnviar.style.color = "#fff";
    btnEnviar.onmouseover = () => btnEnviar.style.background = "#005bb5";
    btnEnviar.onmouseout = () => btnEnviar.style.background = "#0070f3";

    btnEnviar.onclick = async () => {
        await enviarComentario(ta.value, parentId);
        ta.remove();
        btnEnviar.remove();
    };

    ta.addEventListener("focus", () => ta.style.borderColor = "#0070f3");
    ta.addEventListener("blur", () => ta.style.borderColor = "#ccc");

    container.appendChild(ta);
    container.appendChild(btnEnviar);
    ta.focus();
}
