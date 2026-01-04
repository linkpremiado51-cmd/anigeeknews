// Arquivo: /anigeeknews/usuario/perfil-lateral.js

export function carregarPerfilLateral() {
// Tenta pegar os dados que você provavelmente salva no localStorage
const usuarioJSON = localStorage.getItem('usuarioLogado');
const gostos = JSON.parse(localStorage.getItem("gostosUsuario")) || [];
const container = document.getElementById('container-menu-perfil');

if (!container) return;

if (usuarioJSON) {
const usuario = JSON.parse(usuarioJSON);

container.innerHTML = `
<div class="perfil-info" style="text-align: center; padding: 20px;">
    <div class="user-icon" style="font-size: 50px; color: var(--accent-news); margin-bottom: 10px;">
        <i class="fas fa-user-circle"></i>
    </div>
    <h3 style="margin: 0; font-size: 1.1rem;">${usuario.nome}</h3>
    <p style="font-size: 0.8rem; color: gray;">Membro AniGeek</p>
    
    <hr style="border: 0; border-top: 1px solid var(--border); margin: 20px 0;">
    
    <ul style="list-style: none; padding: 0; text-align: left;">
        <li style="margin-bottom: 15px;">
            <a href="/anigeeknews/usuario/painel.html" style="text-decoration: none; color: var(--text-main);">
                <i class="fas fa-id-card"></i> Meu Painel
            </a>
        </li>
        <li>
            <button id="logout-btn" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-weight: bold; padding: 0;">
                <i class="fas fa-sign-out-alt"></i> Sair da Conta
            </button>
        </li>
    </ul>
</div>
`;

// Lógica de Logout
document.getElementById('logout-btn').addEventListener('click', () => {
localStorage.removeItem('usuarioLogado');
window.location.reload();
});

} else {
// Caso não esteja logado, mostra botão de login
container.innerHTML = `
<div style="padding: 20px; text-align: center;">
    <p>Acesse sua conta para ver seu perfil.</p>
    <a href="/anigeeknews/usuario/cadastro.html" class="btn-login" style="display: block; background: var(--accent-news); color: white; padding: 10px; text-decoration: none; border-radius: 5px;">Entrar / Cadastrar</a>
</div>
<p style="font-size:12px; margin-top:10px;">
    <strong>Seus temas:</strong><br>
    ${gostos.length ? gostos.join(", ") : "Nenhum tema selecionado"}
</p>
`;
}
}
