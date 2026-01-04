// Arquivo: /anigeeknews/usuario/perfil-lateral.js

export function carregarPerfilLateral() {

const container = document.getElementById('container-menu-perfil');
if (!container) return;

// Dados salvos
const usuarioJSON = localStorage.getItem('usuarioLogado');
const gostos = JSON.parse(localStorage.getItem('gostosUsuario')) || [];

// Bloco visual dos gostos (sempre visível)
const blocoGostos = `
<div style="margin-top:20px; padding:15px; border-top:1px solid var(--border);">
    <p style="font-size:12px; font-weight:700; margin-bottom:8px;">
        Seus temas favoritos
    </p>
    <p style="font-size:12px; color:gray;">
        ${gostos.length ? gostos.join(", ") : "Nenhum tema selecionado"}
    </p>
</div>
`;

if (usuarioJSON) {

    const usuario = JSON.parse(usuarioJSON);

    container.innerHTML = `
    <div class="perfil-info" style="text-align:center; padding:20px;">
        <div style="font-size:50px; color:var(--accent-news); margin-bottom:10px;">
            <i class="fas fa-user-circle"></i>
        </div>

        <h3 style="margin:0; font-size:1.1rem;">
            ${usuario.nome || "Usuário"}
        </h3>

        <p style="font-size:0.8rem; color:gray;">
            Membro AniGeek
        </p>

        ${blocoGostos}

        <hr style="border:0; border-top:1px solid var(--border); margin:20px 0;">

        <ul style="list-style:none; padding:0; text-align:left;">
            <li style="margin-bottom:15px;">
                <a href="/anigeeknews/usuario/painel.html"
                   style="text-decoration:none; color:var(--text-main);">
                    <i class="fas fa-id-card"></i> Meu Painel
                </a>
            </li>
            <li>
                <button id="logout-btn"
                    style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:bold;">
                    <i class="fas fa-sign-out-alt"></i> Sair da Conta
                </button>
            </li>
        </ul>
    </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.reload();
    });

} else {

    container.innerHTML = `
    <div style="padding:20px; text-align:center;">
        <p>Acesse sua conta para ver seu perfil.</p>
        <a href="/anigeeknews/usuario/cadastro.html"
           style="display:block; background:var(--accent-news); color:white;
                  padding:10px; text-decoration:none; border-radius:5px;">
            Entrar / Cadastrar
        </a>

        ${blocoGostos}
    </div>
    `;
}

}
