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

// Função para atualizar a interface (Desktop e Mobile)
function atualizarInterfaceUsuario(user) {
    const areaDesktop = document.getElementById('area-usuario');
    const areaMobile = document.getElementById('area-usuario-mobile');

    if (user) {
        const nomeParaExibir = user.displayName || user.email.split('@')[0];
        
        // Layout para quando o usuário está logado
        const layoutLogado = `
            <div class="user-logged">
                <span>Olá, <strong>${nomeParaExibir}</strong></span>
                <button class="btn-sair btn-logout-action">Sair</button>
            </div>
        `;

        // Atualiza as duas áreas se elas existirem na página
        if (areaDesktop) areaDesktop.innerHTML = layoutLogado;
        if (areaMobile) areaMobile.innerHTML = layoutLogado;

        // Adiciona o evento de clique em todos os botões de sair (Desktop e Mobile)
        document.querySelectorAll('.btn-logout-action').forEach(botao => {
            botao.addEventListener('click', () => {
                signOut(auth).then(() => {
                    window.location.reload();
                });
            });
        });

    } else {
        // Layout para quando não está logado
        const layoutDeslogado = `<a href="/anigeeknews/usuario/cadastro.html" class="btn-entrar">Entrar</a>`;
        
        if (areaDesktop) areaDesktop.innerHTML = layoutDeslogado;
        if (areaMobile) areaMobile.innerHTML = layoutDeslogado;
    }
}

// Observador de estado
onAuthStateChanged(auth, (user) => {
    atualizarInterfaceUsuario(user);
});

