// CORREÇÃO 1: O "import" deve ser com "i" minúsculo. 
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
                <button id="btnLogout" class="btn-sair">Sair</button>
            </div>
        `;
        
        // CORREÇÃO 2: Em scripts do tipo "module", o onclick no HTML às vezes falha.
        // É mais seguro adicionar o evento diretamente pelo JavaScript.
        document.getElementById('btnLogout').addEventListener('click', fazerLogout);
    } else {
        areaUsuario.innerHTML = `<a href="/anigeeknews/usuario/cadastro.html" class="btn-entrar">Entrar</a>`;
    }
});

// Definindo a função de logout
const fazerLogout = () => {
    signOut(auth).then(() => { 
        window.location.href = "/anigeeknews/index.html"; 
    }).catch((error) => {
        console.error("Erro ao sair:", error);
    });
};

// CORREÇÃO 3: Garante que a função esteja disponível globalmente se necessário
window.fazerLogout = fazerLogout;

