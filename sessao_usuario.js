import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Mesma configuração que você já possui
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

// Função que monitora o usuário
onAuthStateChanged(auth, (user) => {
    const areaUsuario = document.getElementById('area-usuario'); // Onde ficará o nome/botão
    
    if (user) {
        // USUÁRIO LOGADO
        console.log("Usuário ativo:", user.email);
        
        // Se você tiver um elemento com este ID no HTML, ele será atualizado
        if (areaUsuario) {
            areaUsuario.innerHTML = `
                <div class="user-logged">
                    <span>Olá, <strong>${user.displayName || user.email.split('@')[0]}</strong></span>
                    <button onclick="fazerLogout()" class="btn-sair">Sair</button>
                </div>
            `;
        }
    } else {
        // USUÁRIO DESLOGADO
        if (areaUsuario) {
            areaUsuario.innerHTML = `<a href="usuario/cadastro.html" class="btn-entrar">Entrar</a>`;
        }
    }
});

// Tornar a função de logout global
window.fazerLogout = () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
};
