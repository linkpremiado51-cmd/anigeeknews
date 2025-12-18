import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Configuração do Firebase
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
    
    // Verificação de segurança: só roda se o elemento existir na tela
    if (areaUsuario) {
        if (user) {
            // USUÁRIO LOGADO
            console.log("Usuário ativo:", user.email);
            
            // Pega o nome ou a primeira parte do email
            const nomeParaExibir = user.displayName || user.email.split('@')[0];
            
            areaUsuario.innerHTML = `
                <div class="user-logged">
                    <span>Olá, <strong>${nomeParaExibir}</strong></span>
                    <button onclick="fazerLogout()" class="btn-sair">Sair</button>
                </div>
            `;
        } else {
            // USUÁRIO DESLOGADO
            // O link aponta para a pasta usuario onde está o cadastro.html
            areaUsuario.innerHTML = `<a href="usuario/cadastro.html" class="btn-entrar">Entrar</a>`;
        }
    }
});

// Tornar a função de logout global para o botão poder chamar
window.fazerLogout = () => {
    signOut(auth).then(() => {
        // Recarrega a página ou redireciona para a home após sair
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Erro ao sair:", error);
    });
};

