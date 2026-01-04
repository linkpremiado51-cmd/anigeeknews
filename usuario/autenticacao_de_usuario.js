// Importações atualizadas com Facebook e Microsoft
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail,
    GoogleAuthProvider,
    FacebookAuthProvider, // Adicionado
    OAuthProvider,        // Adicionado
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
  authDomain: "anigeeknews.firebaseapp.com",
  projectId: "anigeeknews",
  storageBucket: "anigeeknews.firebasestorage.app",
  messagingSenderId: "769322939926",
  appId: "1:769322939926:web:6eb91a96a3f74670882737",
  measurementId: "G-G5T8CCRGZT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const mensagemEl = document.getElementById('mensagem');

// --- CADASTRO E LOGIN POR E-MAIL --- (Sua lógica já está ok)
const signupBtn = document.getElementById('signup-btn');
if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        try {
            await createUserWithEmailAndPassword(auth, email, senha);
            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
const gostos = Array.from(checkboxes).map(cb => cb.value);

localStorage.setItem("const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
const gostos = Array.from(checkboxes).map(cb => cb.value);

localStorage.setItem("gostosUsuario", JSON.stringify(gostos));", JSON.stringify(gostos));
            exibirMensagem("Conta criada com sucesso!", "green");
            setTimeout(() => window.location.href = "../index.html", 2000);
        } catch (error) { tratarErro(error); }
    });
}

const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value.trim();
        const senha = document.getElementById('login-senha').value.trim();
        try {
            await signInWithEmailAndPassword(auth, email, senha);
            exibirMensagem("Bem-vindo!", "green");
            setTimeout(() => window.location.href = "../index.html", 1500);
        } catch (error) { tratarErro(error); }
    });
}

// --- LOGIN SOCIAL (GOOGLE, FACEBOOK, MICROSOFT) ---

window.loginComGoogle = async function() {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        window.location.href = "../index.html";
    } catch (error) { tratarErro(error); }
};

window.loginComFacebook = async function() {
    const provider = new FacebookAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        window.location.href = "../index.html";
    } catch (error) { tratarErro(error); }
};

window.loginComMicrosoft = async function() {
    const provider = new OAuthProvider('microsoft.com');
    try {
        await signInWithPopup(auth, provider);
        window.location.href = "../index.html";
    } catch (error) { tratarErro(error); }
};

// --- AUXILIARES ---
function exibirMensagem(texto, cor) {
    if(mensagemEl) {
        mensagemEl.textContent = texto;
        mensagemEl.style.color = cor === "green" ? "#2e7d32" : "#c1121f";
    }
}

function tratarErro(error) {
    console.error("Erro Firebase:", error.code);
    let msg = "Erro: " + error.message;
    switch (error.code) {
        case 'auth/email-already-in-use': msg = "E-mail já cadastrado."; break;
        case 'auth/weak-password': msg = "Senha muito fraca (mínimo 6 caracteres)."; break;
        case 'auth/invalid-email': msg = "E-mail inválido."; break;
        case 'auth/wrong-password': msg = "Senha incorreta."; break;
        case 'auth/user-not-found': msg = "Usuário não encontrado."; break;
        case 'auth/popup-closed-by-user': msg = "O login foi cancelado."; break;
    }
    exibirMensagem(msg, "red");
}

