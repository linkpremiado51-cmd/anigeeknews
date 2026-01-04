// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

// Firebase Auth
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

/* CONFIGURAÇÃO FIREBASE */
const firebaseConfig = {
    apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
    authDomain: "anigeeknews.firebaseapp.com",
    projectId: "anigeeknews",
    storageBucket: "anigeeknews.firebasestorage.app",
    messagingSenderId: "769322939926",
    appId: "1:769322939926:web:6eb91a96a3f74670882737"
};

/* INICIALIZAÇÃO */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const mensagemEl = document.getElementById("mensagem");

/* =========================
   CADASTRO COM E-MAIL
========================= */
const signupBtn = document.getElementById("signup-btn");

if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        if (!email || !senha) {
            exibirMensagem("Preencha e-mail e senha.", "red");
            return;
        }

        try {
            // Cria usuário no Firebase
            await createUserWithEmailAndPassword(auth, email, senha);

            // Captura os temas favoritos
            const checkboxes = document.querySelectorAll(
                '#signup-section input[type="checkbox"]:checked'
            );

            const gostos = Array.from(checkboxes).map(cb => cb.value);

            // Salva gostos no navegador
            localStorage.setItem("gostosUsuario", JSON.stringify(gostos));

            exibirMensagem("Conta criada com sucesso!", "green");

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 2000);

        } catch (error) {
            tratarErro(error);
        }
    });
}

/* =========================
   LOGIN COM E-MAIL
========================= */
const loginBtn = document.getElementById("login-btn");

if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("login-email").value.trim();
        const senha = document.getElementById("login-senha").value.trim();

        try {
            await signInWithEmailAndPassword(auth, email, senha);
            exibirMensagem("Bem-vindo!", "green");

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1500);

        } catch (error) {
            tratarErro(error);
        }
    });
}

/* =========================
   LOGIN SOCIAL
========================= */
window.loginComGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        window.location.href = "../index.html";
    } catch (error) {
        tratarErro(error);
    }
};

window.loginComFacebook = async () => {
    try {
        const provider = new FacebookAuthProvider();
        await signInWithPopup(auth, provider);
        window.location.href = "../index.html";
    } catch (error) {
        tratarErro(error);
    }
};

window.loginComMicrosoft = async () => {
    try {
        const provider = new OAuthProvider("microsoft.com");
        await signInWithPopup(auth, provider);
        window.location.href = "../index.html";
    } catch (error) {
        tratarErro(error);
    }
};

/* =========================
   FUNÇÕES AUXILIARES
========================= */
function exibirMensagem(texto, tipo) {
    if (!mensagemEl) return;

    mensagemEl.textContent = texto;
    mensagemEl.style.color = tipo === "green" ? "#2e7d32" : "#c1121f";
}

function tratarErro(error) {
    console.error("Erro Firebase:", error.code);

    let msg = "Erro ao processar.";

    switch (error.code) {
        case "auth/email-already-in-use":
            msg = "Este e-mail já está cadastrado.";
            break;
        case "auth/weak-password":
            msg = "Senha muito fraca (mínimo 6 caracteres).";
            break;
        case "auth/invalid-email":
            msg = "E-mail inválido.";
            break;
        case "auth/wrong-password":
            msg = "Senha incorreta.";
            break;
        case "auth/user-not-found":
            msg = "Usuário não encontrado.";
            break;
        case "auth/popup-closed-by-user":
            msg = "Login cancelado.";
            break;
    }

    exibirMensagem(msg, "red");
}
