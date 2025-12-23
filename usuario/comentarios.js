import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { aplicarEstiloFormulario, aplicarEstiloComentario } from "./comentarios-visual.js";

/* CONFIG FIREBASE */
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

let CURRENT_ARTICLE_ID = null;

/* DOM READY */
document.addEventListener("DOMContentLoaded", () => {
    const articleElement = document.querySelector("[data-article-id]");
    const comentariosContainer = document.getElementById("comentarios");
    if (!articleElement || !comentariosContainer) return;

    CURRENT_ARTICLE_ID = articleElement.dataset.articleId;
    iniciarComentarios(CURRENT_ARTICLE_ID, comentariosContainer);
});

/* SISTEMA PRINCIPAL */
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

/* FORMULÁRIO PRINCIPAL */
function renderFormulario(user) {
    const form = document.getElementById("comentarios-form");
    if (!form) return;

    if (!user) {
        form.innerHTML = `<p style="opacity:.7;">
            <a href="/anigeeknews/usuario/cadastro.html">Entre</a> para comentar.
        </p>`;
        return;
    }

    aplicarEstiloFormulario(form);
    document.getElementById("btn-enviar-comentario")
        .addEventListener("click", () => enviarComentario());
}

/* ENVIO DE COMENTÁRIO */
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

/* LISTAGEM EM TEMPO REAL */
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

/* RENDERIZAÇÃO DE COMENTÁRIOS */
function renderComentario(comentario, todos) {
    const div = document.createElement("div");
    const user = auth.currentUser;

    aplicarEstiloComentario(div, comentario, user, abrirResposta);

    const respostas = todos.filter(c => c.parentId === comentario.id);
    respostas.forEach(r => div.appendChild(renderComentario(r, todos)));

    return div;
}

/* ABRIR TEXTAREA DE RESPOSTA */
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
