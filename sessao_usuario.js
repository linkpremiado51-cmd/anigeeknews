import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

onAuthStateChanged(auth, (user) => {
    const areaUsuario = document.getElementById('area-usuario');
    if (!areaUsuario) return;

    if (user) {
        const nomeParaExibir = user.displayName || user.email.split('@')[0];
        areaUsuario.innerHTML = `
            <div class="user-logged">
                <span>Olá, <strong>${nomeParaExibir}</strong></span>
                <button onclick="fazerLogout()" class="btn-sair">Sair</button>
            </div>
        `;
    } else {
        // Caminho exato para o GitHub Pages
        areaUsuario.innerHTML = `<a href="/anigeeknews/usuario/cadastro.html" class="btn-entrar">Entrar</a>`;
    }
});

window.fazerLogout = () => {
    signOut(auth).then(() => { 
        window.location.href = "/anigeeknews/index.html"; 
    });
};

