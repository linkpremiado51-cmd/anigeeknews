import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
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

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

/* -------------------------------------------------
   CONFIG FIREBASE (mesmo projeto que você já usa)
-------------------------------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
  authDomain: "anigeeknews.firebaseapp.com",
  projectId: "anigeeknews",
  storageBucket: "anigeeknews.firebasestorage.app",
  messagingSenderId: "769322939926",
  appId: "1:769322939926:web:6eb91a96a3f74670882737"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* -------------------------------------------------
   INICIALIZAÇÃO
-------------------------------------------------- */
export function inicializarComentarios() {
  const postEl = document.getElementById("post");
  if (!postEl) return;

  const postId = postEl.dataset.postId;
  if (!postId) {
    console.error("Post sem data-post-id");
    return;
  }

  const lista = document.getElementById("lista-comentarios");
  const btn = document.getElementById("btn-comentar");
  const textarea = document.getElementById("texto-comentario");

  if (!lista || !btn || !textarea) return;

  /* -------------------------------------------------
     ESCUTA COMENTÁRIOS EM TEMPO REAL
  -------------------------------------------------- */
  const q = query(
    collection(db, "comentarios"),
    where("postId", "==", postId),
    orderBy("criadoEm", "asc")
  );

  onSnapshot(q, (snapshot) => {
    lista.innerHTML = "";

    if (snapshot.empty) {
      lista.innerHTML = `<p style="font-size:13px;color:#777">Nenhum comentário ainda.</p>`;
      return;
    }

    snapshot.forEach((doc) => {
      const c = doc.data();

      const div = document.createElement("div");
      div.className = "comentario";

      div.innerHTML = `
        <strong>${c.autor}</strong>
        <p>${c.texto}</p>
        <span style="font-size:11px;color:#888">
          ${c.criadoEm?.toDate().toLocaleString("pt-BR")}
        </span>
      `;

      lista.appendChild(div);
    });
  });

  /* -------------------------------------------------
     ENVIO DE COMENTÁRIO
  -------------------------------------------------- */
  let usuarioAtual = null;

  onAuthStateChanged(auth, (user) => {
    usuarioAtual = user;

    if (!user) {
      btn.disabled = true;
      textarea.disabled = true;
      textarea.placeholder = "Faça login para comentar";
    } else {
      btn.disabled = false;
      textarea.disabled = false;
      textarea.placeholder = "Escreva seu comentário";
    }
  });

  btn.addEventListener("click", async () => {
    const texto = textarea.value.trim();
    if (!texto || !usuarioAtual) return;

    await addDoc(collection(db, "comentarios"), {
      postId: postId,
      texto: texto,
      autor: usuarioAtual.displayName || usuarioAtual.email.split("@")[0],
      uid: usuarioAtual.uid,
      criadoEm: serverTimestamp()
    });

    textarea.value = "";
  });
}
