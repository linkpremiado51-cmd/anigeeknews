// Arquivo: /anigeeknews/usuario/perfil-lateral.js

export function carregarPerfilLateral() {

    const container = document.getElementById('container-menu-perfil');
    if (!container) return;

    // Lê os gostos do usuário
    const gostos = JSON.parse(localStorage.getItem('gostosUsuario')) || [];

    // Lê dados básicos do usuário (se existirem)
    const usuarioJSON = localStorage.getItem('usuarioLogado');
    const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

    // Montagem visual dos temas
    const temasHTML = gostos.length
        ? `<ul style="margin-top:10px; padding-left:15px; font-size:12px;">
            ${gostos.map(g => `<li>• ${g}</li>`).join('')}
           </ul>`
        : `<p style="font-size:12px; color:gray;">Nenhum tema selecionado</p>`;

    // Se o usuário estiver logado
    if (usuario) {
        container.innerHTML = `
            <div class="perfil-info" style="padding:15px;">
                <strong style="font-size:13px;">Seus temas</strong>
                ${temasHTML}

                <hr style="margin:15px 0; border:0; border-top:1px solid var(--border);">

                <a href="/anigeeknews/usuario/painel.html"
                   style="font-size:12px; text-decoration:none; color:var(--text-main);">
                   Meu Painel
                </a>

                <button id="logout-btn"
                        style="margin-top:10px; display:block; background:none;
                        border:none; color:#c1121f; cursor:pointer; font-size:12px;">
                    Sair
                </button>
            </div>
        `;

        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('usuarioLogado');
            window.location.reload();
        });

    } else {
        // Usuário NÃO logado
        container.innerHTML = `
            <div style="padding:15px;">
                <strong style="font-size:13px;">Temas escolhidos</strong>
                ${temasHTML}

                <a href="/anigeeknews/usuario/cadastro.html"
                   style="display:block; margin-top:15px; font-size:12px;
                   background:var(--accent-news); color:white; text-align:center;
                   padding:8px; text-decoration:none;">
                   Entrar / Cadastrar
                </a>
            </div>
        `;
    }
}
